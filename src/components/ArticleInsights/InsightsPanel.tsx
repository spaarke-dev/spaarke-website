"use client";

import { useEffect, useRef } from "react";
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
 */
export function InsightsPanel({
  articleTitle,
  turns,
  busy,
  onAsk,
  onClose,
  onDismissAsk,
  onAnswerAsk,
  onRetry,
}: {
  articleTitle: string;
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

  useEffect(() => {
    composer.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
      className="border-line bg-bg fixed right-0 z-40 hidden flex-col border-l shadow-[-8px_0_32px_rgba(0,0,0,0.08)] lg:flex"
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
