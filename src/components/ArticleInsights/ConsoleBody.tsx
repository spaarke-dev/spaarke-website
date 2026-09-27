"use client";

import type { RefObject } from "react";
import type { EntryOption } from "@/lib/insights/questions";
import { AnswerBody } from "./AnswerBody";
import { Composer } from "./Composer";
import { Disclaimer } from "./Disclaimer";
import type { Turn } from "./transcript";

/**
 * The console itself, with no opinion about what is holding it.
 *
 * The desktop panel and the mobile sheet are two frames around this. That is the
 * whole point: a mobile variant written separately diverges within a release and
 * then falls behind, so the entry card, the transcript, the composer and the
 * disclaimer exist once and the containers differ only in how they sit on screen.
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
  scrollerRef,
}: {
  options: EntryOption[];
  turns: Turn[];
  busy: boolean;
  onAsk: (question: string, source?: "suggested" | "typed") => void;
  onDismissAsk: (id: string) => void;
  onAnswerAsk: (id: string) => void;
  onRetry: () => void;
  composerRef: RefObject<HTMLTextAreaElement | null>;
  scrollerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <div
        ref={scrollerRef}
        // `overscroll-contain` stops a flick at the end of the transcript from
        // scrolling the article underneath, which on a phone reads as the page
        // jumping while you are reading an answer.
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {/* The entry card. FR-04: three article-specific questions, then
            summarize. It lives here rather than in the rail, because this is
            where there is room to read what they return. */}
        {turns.length === 0 && options.length > 0 && (
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

        <div className="space-y-6">
          {turns.map((turn) =>
            turn.role === "reader" ? (
              <p
                key={turn.id}
                className="text-fg border-line border-l-2 pl-3 text-[14px] font-medium leading-snug"
              >
                {turn.text}
              </p>
            ) : (
              <AnswerBody
                key={turn.id}
                turn={turn}
                onDismissAsk={() => onDismissAsk(turn.id)}
                onAnswerAsk={() => onAnswerAsk(turn.id)}
                onRetry={onRetry}
              />
            ),
          )}
        </div>
      </div>

      <div className="border-line shrink-0 border-t px-4 py-3">
        <Composer
          ref={composerRef}
          onSubmit={(question) => onAsk(question, "typed")}
          busy={busy}
          placeholder={turns.length === 0 ? "Ask about this article" : "Ask a follow-up"}
          footer={<Disclaimer className="mt-2" />}
        />
      </div>
    </>
  );
}
