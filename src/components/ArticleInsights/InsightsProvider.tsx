"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { track } from "@/lib/analytics";
import { markAssistantUsed } from "@/lib/insights/engagement";
import { askInsights, newRequestId } from "@/lib/insights/poll-client";
import type { EntryOption } from "@/lib/insights/questions";
import { ArticleReader } from "./ArticleReader";
import { FloatingButton } from "./FloatingButton";
import { InsightsPanel, shiftArticle } from "./InsightsPanel";
import { MobileSheet } from "./MobileSheet";
import {
  applyEvent,
  failTurn,
  historyFor,
  newAssistantTurn,
  type AssistantTurn,
  type Turn,
} from "./transcript";

/**
 * The assistant: one conversation, wherever it appears.
 *
 * Two contexts. On an article, `slug` names the piece the reader is on and the
 * answer can extend it. On the library page `slug` is null, which the endpoint
 * already accepts: the corpus is in context either way, so a library question
 * reaches all twenty-four articles rather than fewer. The only difference is that
 * nothing is foregrounded.
 *
 * The rail entry point, the desktop panel and the mobile sheet all read the same
 * state from here. **That is why this is a provider rather than a component.** The
 * rail lives inside the article's `<aside>`, which is `hidden lg:block`, and a
 * `display: none` ancestor hides a fixed child too, so the mobile button cannot
 * live there. Two separate components would mean two conversations, two captcha
 * widgets and, before long, two implementations that disagree.
 *
 * **State lives here and nowhere else.** The surfaces are given their data.
 *
 * **The conversation is not persisted.** It lasts as long as the page does. That
 * is a privacy decision as much as a simplicity one: task 022 keeps the question
 * text for 90 days for content-gap analysis, and adding a copy in the reader's own
 * browser would be a second retention decision nobody asked for.
 */

/** Google is fast or Google is broken, and either way it cannot hang the console. */
const CAPTCHA_TIMEOUT_MS = 10_000;

/** How many of an article's questions the entry card shows at once. */
const VISIBLE_QUESTIONS = 3;

/**
 * Which questions to offer.
 *
 * Six are generated per article and three are shown, drawn fresh each time the
 * page loads. Always offering the same three made the entry card read as a fixed
 * menu, and a reader who wanted none of them had nothing to come back to.
 *
 * The first render is deliberately not random. It has to match what the server
 * sent or React will complain, and the panel is hidden at that point anyway, so
 * the swap happens before anyone can see it.
 */
function pickQuestions(all: EntryOption[], shuffled: boolean): EntryOption[] {
  const questions = all.filter((o) => o.kind === "question");
  const rest = all.filter((o) => o.kind !== "question");

  let chosen = questions;
  if (shuffled) {
    chosen = [...questions];
    for (let i = chosen.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
    }
  }
  // Summarize stays last, which FR-04 asks for and which is the whole point of
  // the ordering: it is the fallback, not the invitation.
  return [...chosen.slice(0, VISIBLE_QUESTIONS), ...rest];
}

/** Which surface a reader opened. The other one stays hidden and inert. */
export type OpenOn = "panel" | "sheet";

/**
 * A cited passage being read beside the conversation.
 *
 * Everything here comes from the citation itself, which came from the build-time
 * manifest rather than from the model, so the reader's heading is the heading the
 * article actually has.
 */
export type ReaderTarget = {
  slug: string;
  title: string;
  heading: string;
  anchor?: string;
  href: string;
};

/** Where a question came from, which is the interesting half of FR-04. */
export type QuestionSource = "suggested" | "typed";

type InsightsValue = {
  /** Null on the library page, where there is no article to extend. */
  slug: string | null;
  articleTitle: string;
  /** "Ask about this piece" on an article, something else on the library. */
  eyebrow: string;
  options: EntryOption[];
  turns: Turn[];
  busy: boolean;
  open: boolean;
  openOn: OpenOn;
  openConsole: (on: OpenOn) => void;
  close: () => void;
  ask: (question: string, source?: QuestionSource) => void;
  retry: () => void;
  dismissAsk: (id: string) => void;
  answerAsk: (id: string) => void;
  /** So a surface can hand focus back to whatever opened it. */
  registerTrigger: (on: OpenOn, el: HTMLElement | null) => void;
  /** The cited article open beside the console, or null. */
  reader: ReaderTarget | null;
  openReader: (target: ReaderTarget) => void;
  closeReader: () => void;
};

const InsightsContext = createContext<InsightsValue | null>(null);

export function useInsights(): InsightsValue {
  const value = useContext(InsightsContext);
  if (!value) throw new Error("useInsights must be used inside InsightsProvider");
  return value;
}

export function InsightsProvider({
  slug,
  articleTitle,
  options,
  recaptchaSiteKey,
  children,
}: {
  slug: string | null;
  articleTitle: string;
  options: EntryOption[];
  recaptchaSiteKey: string;
  children: ReactNode;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [open, setOpen] = useState(false);
  const [openOn, setOpenOn] = useState<OpenOn>("panel");
  const [reader, setReader] = useState<ReaderTarget | null>(null);

  // Chosen once per page load and then held, so the card does not reshuffle
  // itself under a reader who was part way through reading it.
  const [shown, setShown] = useState<EntryOption[]>(() => pickQuestions(options, false));
  useEffect(() => setShown(pickQuestions(options, true)), [options]);

  // A mirror of the state, because a turn needs the history as it stood before it
  // and reading that out of a functional update would be a side effect in a
  // reducer, which React is entitled to run twice.
  const turnsRef = useRef<Turn[]>([]);
  const commit = useCallback((next: Turn[]) => {
    turnsRef.current = next;
    setTurns(next);
  }, []);

  const sessionRef = useRef<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);
  const triggers = useRef<Record<OpenOn, HTMLElement | null>>({ panel: null, sheet: null });
  const seq = useRef(0);

  const busy = turns.some(
    (t) => t.role === "assistant" && (t.status === "waiting" || t.status === "streaming"),
  );

  useEffect(() => shiftArticle(open && openOn === "panel"), [open, openOn]);

  const registerTrigger = useCallback((on: OpenOn, el: HTMLElement | null) => {
    triggers.current[on] = el;
  }, []);

  const openConsole = useCallback(
    (on: OpenOn) => {
      setOpenOn(on);
      setOpen(true);
      // Marked here rather than on the first question, because opening the console
      // is already a reader choosing it over the article. The engagement
      // comparison asks whether that choice costs the article, so the flag has to
      // be set by the choice and not by what follows it.
      markAssistantUsed();
      track("Assistant Opened", { article_slug: slug ?? "library", surface: on });
    },
    [slug],
  );

  const close = useCallback(() => {
    setOpen(false);
    setReader(null);
    triggers.current[openOn]?.focus();
  }, [openOn]);

  const openReader = useCallback((target: ReaderTarget) => {
    setReader(target);
    markAssistantUsed();
  }, []);

  const closeReader = useCallback(() => setReader(null), []);

  const updateAssistant = useCallback(
    (id: string, fn: (turn: AssistantTurn) => AssistantTurn) => {
      commit(turnsRef.current.map((t) => (t.role === "assistant" && t.id === id ? fn(t) : t)));
    },
    [commit],
  );

  /**
   * Runs one turn.
   *
   * `base` is the conversation the question is being asked into, which matters for
   * a retry: the failed pair is dropped and the same question is asked again with
   * the history it originally had, rather than with itself in it.
   */
  const runTurn = useCallback(
    async (question: string, base: Turn[]) => {
      sessionRef.current ??= newRequestId();
      seq.current += 1;
      const id = `a${seq.current}`;
      const history = historyFor(base);

      commit([
        ...base,
        { role: "reader", id: `q${seq.current}`, text: question },
        newAssistantTurn(id),
      ]);

      // The captcha gates the first question of a session. A later turn is not
      // re-gated, because the endpoint remembers that the session passed.
      let captchaToken = "";
      if (history.length === 0 && recaptchaSiteKey && captchaRef.current) {
        try {
          captchaRef.current.reset();
          const token = await Promise.race([
            captchaRef.current.executeAsync(),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("CAPTCHA_TIMEOUT")), CAPTCHA_TIMEOUT_MS),
            ),
          ]);
          captchaToken = token ?? "";
        } catch {
          // Corporate networks and privacy tools block this, and this audience sits
          // behind both, so the copy says what to try rather than what failed.
          updateAssistant(id, (t) =>
            failTurn(
              t,
              "CAPTCHA_FAILED",
              "The robot check could not run. Ad blockers, privacy extensions and some corporate networks stop it. Reloading the page usually works.",
            ),
          );
          return;
        }
      }

      let provenance = "none";
      let citations = 0;
      let askedBack = false;

      const outcome = await askInsights({
        question,
        articleSlug: slug,
        history,
        sessionId: sessionRef.current,
        captchaToken,
        onEvent: (event) => {
          if (event.type === "provenance") provenance = event.value;
          if (event.type === "citation") citations += 1;
          if (event.type === "question") askedBack = true;
          updateAssistant(id, (t) => applyEvent(t, event));
        },
      });

      if (outcome.status === "error") {
        updateAssistant(id, (t) => failTurn(t, outcome.code, outcome.message));
        track("Assistant Error", { article_slug: slug ?? "library", code: outcome.code });
        return;
      }

      // Provenance is the property worth having. A run of answers labeled general
      // on one article is a subject the library does not cover, which makes this
      // the brief for the next piece as much as a health check.
      track("Assistant Answer", {
        article_slug: slug ?? "library",
        provenance,
        citations,
        asked_back: askedBack,
        closed_early: outcome.status === "answered-without-close",
      });

      // Prose reached the reader and the POST never landed, which is a proxy
      // killing the connection. The answer on screen is real, so it is kept and
      // marked done rather than replaced with a failure the reader can see is
      // wrong.
      updateAssistant(id, (t) => (t.status === "done" ? t : { ...t, status: "done" }));
    },
    [commit, recaptchaSiteKey, slug, updateAssistant],
  );

  const ask = useCallback(
    (question: string, source: QuestionSource = "typed") => {
      if (busy) return;
      markAssistantUsed();
      track("Assistant Question", {
        article_slug: slug ?? "library",
        source,
        turn: turnsRef.current.filter((t) => t.role === "reader").length + 1,
      });
      void runTurn(question, turnsRef.current);
    },
    [busy, runTurn, slug],
  );

  const retry = useCallback(() => {
    const current = turnsRef.current;
    // The last two turns are the question and its failed answer. Both come off,
    // and the question goes back in.
    const last = current[current.length - 1];
    const question = current[current.length - 2];
    if (!last || last.role !== "assistant" || !question || question.role !== "reader") return;
    void runTurn(question.text, current.slice(0, -2));
  }, [runTurn]);

  const dismissAsk = useCallback(
    (id: string) => updateAssistant(id, (t) => ({ ...t, askDismissed: true })),
    [updateAssistant],
  );

  const answerAsk = useCallback(
    (id: string) => {
      updateAssistant(id, (t) => ({ ...t, askDismissed: true }));
      // The reader types the answer, so the only job here is to put the cursor
      // where they can. Both surfaces label their field the same way, and only one
      // of them is ever on screen.
      const fields = document.querySelectorAll<HTMLTextAreaElement>("textarea[data-insights-question]");
      for (const field of fields) {
        if (field.offsetParent !== null) {
          field.focus();
          return;
        }
      }
    },
    [updateAssistant],
  );

  const value = useMemo<InsightsValue>(
    () => ({
      slug,
      articleTitle,
      eyebrow: slug === null ? "Ask the library" : "Ask about this piece",
      options: shown,
      turns,
      busy,
      open,
      openOn,
      openConsole,
      close,
      ask,
      retry,
      dismissAsk,
      answerAsk,
      registerTrigger,
      reader,
      openReader,
      closeReader,
    }),
    [
      answerAsk,
      articleTitle,
      ask,
      busy,
      close,
      closeReader,
      dismissAsk,
      open,
      openConsole,
      openOn,
      openReader,
      reader,
      shown,
      registerTrigger,
      retry,
      slug,
      turns,
    ],
  );

  return (
    <InsightsContext.Provider value={value}>
      {children}
      <InsightsPanel />
      <ArticleReader />
      <FloatingButton />
      <MobileSheet />
      {recaptchaSiteKey && (
        <ReCAPTCHA ref={captchaRef} sitekey={recaptchaSiteKey} size="invisible" />
      )}
    </InsightsContext.Provider>
  );
}
