"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { askInsights, newRequestId } from "@/lib/insights/poll-client";
import type { EntryOption } from "@/lib/insights/questions";
import { Disclaimer } from "./Disclaimer";
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
 * The rail is 220px, which is fine for three questions and unreadable for a
 * 185-word answer, so the card stays in the rail and the answers open in a panel
 * beside the article. One console, two containers; task 031's mobile sheet is the
 * third and reuses everything below `InsightsPanel`.
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

        {options.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {options.map((option) => (
              <li key={option.text}>
                <button
                  type="button"
                  onClick={() => ask(option.text)}
                  disabled={busy}
                  className={`focus-visible:ring-spaarke-blue block w-full rounded-md border px-2.5 py-2 text-left text-[13px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ${
                    option.kind === "summarize"
                      ? "border-line text-fg-mid hover:border-line-strong hover:text-fg"
                      : "border-line text-fg hover:border-line-strong hover:bg-surface"
                  }`}
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          ref={railTrigger}
          onClick={() => {
            setOpen(true);
            // The panel focuses its own field on mount, so opening and typing is
            // one action rather than two.
          }}
          className="text-spaarke-blue focus-visible:ring-spaarke-blue mt-3 rounded text-[13px] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2"
          aria-expanded={open}
        >
          {turns.length > 0 ? "Open the conversation" : "Ask something else"}
        </button>

        <Disclaimer className="mt-4" />
      </section>

      {open && (
        <InsightsPanel
          articleTitle={articleTitle}
          turns={turns}
          busy={busy}
          onAsk={ask}
          onClose={close}
          onDismissAsk={dismissAsk}
          onAnswerAsk={answerAsk}
          onRetry={retry}
        />
      )}

      {recaptchaSiteKey && (
        <ReCAPTCHA ref={captchaRef} sitekey={recaptchaSiteKey} size="invisible" />
      )}
    </>
  );
}
