"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { askInsights, newRequestId } from "@/lib/insights/poll-client";
import type { EntryOption } from "@/lib/insights/questions";
import { InsightsPanel, shiftArticle } from "./InsightsPanel";
import {
  applyEvent,
  failTurn,
  historyFor,
  newAssistantTurn,
  type AssistantTurn,
  type Turn,
} from "./transcript";

/**
 * The article assistant: an entry card in the rail, and a reading panel.
 *
 * The rail is 220px, which is unreadable for a 185-word answer, so the rail holds
 * a link and the console itself is the panel. The entry questions live in the
 * panel too: four cards in the rail pushed the column past the fold and put a
 * scrollbar beside a table of contents that did not have one before.
 *
 * The panel is always mounted and hidden when closed, rather than mounted on
 * open. Its first rendered state is therefore the entry questions and the
 * disclaimer, which is what FR-04 and FR-10 ask for, and `inert` keeps a closed
 * panel out of the tab order rather than leaving a hidden text field in it.
 *
 * **State lives here and nowhere else.** The panel and the card are both given
 * their data, because a conversation that survived being closed and reopened but
 * not being scrolled past would be a strange thing to explain.
 *
 * **The conversation is not persisted.** It lasts as long as the page does. That
 * is a privacy decision as much as a simplicity one: task 022 keeps the question
 * text for 90 days for content-gap analysis, and adding a copy in the reader's own
 * browser would be a second retention decision nobody asked for.
 */

/** Google is fast or Google is broken, and either way it cannot hang the console. */
const CAPTCHA_TIMEOUT_MS = 10_000;

export function ArticleInsights({
  slug,
  articleTitle,
  options,
  recaptchaSiteKey,
}: {
  slug: string;
  articleTitle: string;
  options: EntryOption[];
  recaptchaSiteKey: string;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [open, setOpen] = useState(false);

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
  const railTrigger = useRef<HTMLButtonElement | null>(null);
  const seq = useRef(0);

  const busy = turns.some(
    (t) => t.role === "assistant" && (t.status === "waiting" || t.status === "streaming"),
  );

  useEffect(() => shiftArticle(open), [open]);

  const close = useCallback(() => {
    setOpen(false);
    railTrigger.current?.focus();
  }, []);

  const updateAssistant = useCallback(
    (id: string, fn: (turn: AssistantTurn) => AssistantTurn) => {
      commit(
        turnsRef.current.map((t) => (t.role === "assistant" && t.id === id ? fn(t) : t)),
      );
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

      const outcome = await askInsights({
        question,
        articleSlug: slug,
        history,
        sessionId: sessionRef.current,
        captchaToken,
        onEvent: (event) => updateAssistant(id, (t) => applyEvent(t, event)),
      });

      if (outcome.status === "error") {
        updateAssistant(id, (t) => failTurn(t, outcome.code, outcome.message));
        return;
      }

      // Prose reached the reader and the POST never landed, which is a proxy
      // killing the connection. The answer on screen is real, so it is kept and
      // marked done rather than replaced with a failure the reader can see is
      // wrong.
      updateAssistant(id, (t) => (t.status === "done" ? t : { ...t, status: "done" }));
    },
    [commit, recaptchaSiteKey, slug, updateAssistant],
  );

  const ask = useCallback(
    (question: string) => {
      if (busy) return;
      setOpen(true);
      void runTurn(question, turnsRef.current);
    },
    [busy, runTurn],
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
      // where they can.
      document.getElementById("insights-question")?.focus();
    },
    [updateAssistant],
  );

  return (
    <>
      {/* The rail is an entry point, not a surface. It was four question cards and
          a paragraph, which pushed the column past the fold and put a scrollbar
          beside a table of contents that did not have one before. The questions
          belong where there is room to read the answers. */}
      <section aria-labelledby="insights-rail-heading">
        <h2
          id="insights-rail-heading"
          className="text-fg-low font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
        >
          Ask about this piece
        </h2>

        <p className="text-fg-mid mt-3 text-[13px] leading-snug">
          Put a question to the whole library, not just this page.
        </p>

        <button
          type="button"
          ref={railTrigger}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="text-spaarke-blue hover:text-cta-blue focus-visible:ring-spaarke-blue group mt-3 inline-flex items-center gap-2 rounded text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
        >
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5M21 12a8 8 0 0 1-8 8H7l-4 3v-5.6A8 8 0 0 1 13 4a8 8 0 0 1 8 8Z"
            />
          </svg>
          <span className="underline underline-offset-2">
            {turns.length > 0 ? "Open the conversation" : "Open the assistant"}
          </span>
        </button>
      </section>

      <InsightsPanel
        open={open}
        articleTitle={articleTitle}
        options={options}
        turns={turns}
        busy={busy}
        onAsk={ask}
        onClose={close}
        onDismissAsk={dismissAsk}
        onAnswerAsk={answerAsk}
        onRetry={retry}
      />

      {recaptchaSiteKey && (
        <ReCAPTCHA ref={captchaRef} sitekey={recaptchaSiteKey} size="invisible" />
      )}
    </>
  );
}
