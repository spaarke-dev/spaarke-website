"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { EntryOption } from "@/lib/insights/questions";
import { AnswerBody } from "./AnswerBody";
import { Composer } from "./Composer";
import { Disclaimer } from "./Disclaimer";
import { groupExchanges, type Turn } from "./transcript";

/**
 * The console itself, with no opinion about what is holding it.
 *
 * The desktop panel and the mobile sheet are two frames around this. That is the
 * whole point: a mobile variant written separately diverges within a release and
 * then falls behind, so the entry card, the transcript, the composer and the
 * disclaimer exist once and the containers differ only in how they sit on screen.
 *
 * **The question moves to the top of the pane and the answer fills downward.** The
 * obvious alternative, following the last line as it streams, makes the reader
 * chase text down the screen and keeps the sentence they are reading in motion. So
 * the current exchange is scrolled to the top once, when the question is asked,
 * and nothing moves after that. The answer grows into the space below it and the
 * reader stays still.
 *
 * That needs somewhere to scroll to, which is what the minimum height on the last
 * exchange is for. Without it a short answer cannot reach the top of the pane,
 * because there is nothing underneath it to scroll past.
 */
export function ConsoleBody({
  options,
  turns,
  busy,
  onAsk,
  onDismissAsk,
  onAnswerAsk,
  onRetry,
  composerRef,
}: {
  options: EntryOption[];
  turns: Turn[];
  busy: boolean;
  onAsk: (question: string, source?: "suggested" | "typed") => void;
  onDismissAsk: (id: string) => void;
  onAnswerAsk: (id: string) => void;
  onRetry: () => void;
  composerRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const lastExchange = useRef<HTMLDivElement | null>(null);
  const [paneHeight, setPaneHeight] = useState(0);

  const exchanges = useMemo(() => groupExchanges(turns), [turns]);

  // The pane's height is the minimum height of the last exchange, so re-measure
  // when it changes: the mobile sheet shrinks when the keyboard opens, and a stale
  // measurement there would leave the question unreachable.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setPaneHeight(el.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Before paint, so the question does not appear at the bottom and then jump.
  useLayoutEffect(() => {
    const el = scroller.current;
    const last = lastExchange.current;
    if (!el || !last || exchanges.length === 0) return;
    const offset = last.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
    el.scrollTo({ top: Math.max(offset, 0), behavior: exchanges.length > 1 ? "smooth" : "auto" });
    // Keyed on the count alone, deliberately. Re-running as the answer streams is
    // exactly the behaviour this replaces.
  }, [exchanges.length]);

  return (
    <>
      <div
        ref={scroller}
        // `overscroll-contain` stops a flick at the end of the transcript from
        // scrolling the article underneath, which on a phone reads as the page
        // jumping while you are reading an answer.
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {/* The entry card. FR-04: three specific questions, then summarize. It
            lives here rather than in the rail, because this is where there is room
            to read what they return. */}
        {exchanges.length === 0 && options.length > 0 && (
          <div>
            <p className="text-fg-mid text-[13px] leading-snug">
              Start with one of these, or ask your own.
            </p>
            <ul className="mt-3 space-y-2">
              {options.map((option) => (
                <li key={option.text}>
                  <button
                    type="button"
                    onClick={() => onAsk(option.text, "suggested")}
                    disabled={busy}
                    className={`focus-visible:ring-spaarke-blue block w-full rounded-md border px-3 py-2.5 text-left text-[13px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ${
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
          </div>
        )}

        {exchanges.map((exchange, i) => {
          const isLast = i === exchanges.length - 1;
          const assistant = exchange.assistant;
          return (
            <div
              key={exchange.id}
              ref={isLast ? lastExchange : undefined}
              // Room to scroll the current question to the top. Only the last one
              // needs it; giving every exchange a screen of padding would turn the
              // transcript into a slide deck.
              style={isLast && paneHeight > 0 ? { minHeight: paneHeight - 32 } : undefined}
              className={i > 0 ? "mt-8" : ""}
            >
              {exchange.reader && (
                <p className="text-fg border-line border-l-2 pl-3 text-[15px] font-medium leading-snug">
                  {exchange.reader.text}
                </p>
              )}
              {assistant && (
                <div className={exchange.reader ? "mt-4" : ""}>
                  <AnswerBody
                    turn={assistant}
                    onDismissAsk={() => onDismissAsk(assistant.id)}
                    onAnswerAsk={() => onAnswerAsk(assistant.id)}
                    onRetry={onRetry}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-line shrink-0 border-t px-4 py-3">
        <Composer
          ref={composerRef}
          onSubmit={(question) => onAsk(question, "typed")}
          busy={busy}
          placeholder={exchanges.length === 0 ? "Ask a question" : "Ask a follow-up"}
          footer={<Disclaimer className="mt-2" />}
        />
      </div>
    </>
  );
}
