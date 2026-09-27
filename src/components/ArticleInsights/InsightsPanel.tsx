"use client";

import { useEffect, useRef } from "react";
import type { EntryOption } from "@/lib/insights/questions";
import { AnswerBody } from "./AnswerBody";
import { Composer } from "./Composer";
import { Disclaimer } from "./Disclaimer";
import type { Turn } from "./transcript";

/** Matches the width the shift calculation assumes. Change both together. */
export const PANEL_WIDTH = 420;
/** Clears the sticky site header, which is about 100px tall. */
const PANEL_TOP = 100;

/**
 * The reading surface.
 *
 * **Not a modal.** The point of a console beside an article is to use it while
 * reading, so the article stays live, scrollable and reachable by Tab. That rules
 * out `aria-modal`, a focus trap and a backdrop, all of which would make the
 * article unreachable to exactly the readers who most need it reachable. Escape
 * closes, focus moves in on open and returns to the trigger on close, and the
 * region is labeled so it can be found.
 *
 * The article is shifted rather than covered. See `shiftArticle`, which changes
 * padding rather than applying a transform, because a transformed ancestor would
 * break the sticky table of contents inside it.
 *
 * **It is always mounted and hidden when closed.** So its first rendered state
 * carries the entry questions and the disclaimer, which is what FR-04 and FR-10
 * ask for, and both are in the page's first paint rather than appearing on open.
 * `inert` is what makes that safe: a closed panel is out of the tab order and out
 * of the accessibility tree, instead of leaving a hidden text field in both.
 */
export function InsightsPanel({
  open,
  articleTitle,
  options,
  turns,
  busy,
  onAsk,
  onClose,
  onDismissAsk,
  onAnswerAsk,
  onRetry,
}: {
  open: boolean;
  articleTitle: string;
  options: EntryOption[];
  turns: Turn[];
  busy: boolean;
  onAsk: (question: string) => void;
  onClose: () => void;
  onDismissAsk: (id: string) => void;
  onAnswerAsk: (id: string) => void;
  onRetry: () => void;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const composer = useRef<HTMLTextAreaElement | null>(null);

  // On open rather than on mount, because the panel is in the page from the
  // start and stealing focus on page load would be a bug rather than a courtesy.
  useEffect(() => {
    if (open) composer.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  // Follow the answer as it arrives, but only while the reader is already at the
  // bottom. Yanking the view back while somebody is reading an earlier answer is
  // the standard way this goes wrong.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [turns]);

  return (
    <aside
      aria-label="Article assistant"
      inert={!open}
      className={`border-line bg-bg fixed right-0 z-40 flex-col border-l shadow-[-8px_0_32px_rgba(0,0,0,0.08)] ${
        open ? "hidden lg:flex" : "hidden"
      }`}
      style={{ top: PANEL_TOP, bottom: 0, width: PANEL_WIDTH }}
    >
      <header className="border-line flex items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-fg-low font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
            Ask about this piece
          </p>
          <p className="text-fg-mid mt-1 truncate text-[13px]" title={articleTitle}>
            {articleTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-fg-low hover:text-fg focus-visible:ring-spaarke-blue -mr-1 -mt-1 shrink-0 rounded p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2"
          aria-label="Close the assistant"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {/* The entry card. FR-04: three article-specific questions, then
            summarize. It is the panel's first state rather than the rail's,
            because this is where there is room to read what they return. */}
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
                    onClick={() => onAsk(option.text)}
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
              <p key={turn.id} className="text-fg border-line border-l-2 pl-3 text-[14px] font-medium leading-snug">
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

      <div className="border-line border-t px-4 py-3">
        <Composer
          ref={composer}
          onSubmit={onAsk}
          busy={busy}
          placeholder="Ask a follow-up"
          footer={<Disclaimer className="mt-2" />}
        />
      </div>
    </aside>
  );
}

/**
 * Moves the article out from under the panel.
 *
 * Padding rather than a transform, on purpose. A transform on the grid would make
 * it the containing block for the sticky table of contents inside it and stop the
 * rail following the scroll. Padding shrinks the grid's first column instead, and
 * because the article has `max-w-[720px] mx-auto` inside that column it re-centers
 * leftward without the prose re-wrapping, until the column drops below 720px.
 *
 * Returns the cleanup, so the caller cannot forget it.
 */
export function shiftArticle(open: boolean): () => void {
  const grid = document.getElementById("article-grid");
  if (!grid) return () => {};

  if (!open || window.innerWidth < 1024) {
    grid.style.paddingRight = "";
    return () => {
      grid.style.paddingRight = "";
    };
  }

  // The panel's left edge, less a gutter, is where the grid's content has to end.
  const panelLeft = window.innerWidth - PANEL_WIDTH;
  const overlap = grid.getBoundingClientRect().right - (panelLeft - 24);
  grid.style.transition = "padding-right 220ms ease";
  grid.style.paddingRight = overlap > 0 ? `${Math.round(overlap)}px` : "";

  return () => {
    grid.style.paddingRight = "";
  };
}
