"use client";

import { useEffect, useRef } from "react";
import { CloseIcon, PANEL_WIDTH, SURFACE_TOP } from "./chrome";
import { ConsoleBody } from "./ConsoleBody";
import { useInsights } from "./InsightsProvider";

/**
 * The desktop reading surface.
 *
 * **Not a modal.** The point of a console beside an article is to use it while
 * reading, so the article stays live, scrollable and reachable by Tab. That rules
 * out `aria-modal`, a focus trap and a backdrop, all of which would make the
 * article unreachable to exactly the readers who most need it reachable. Escape
 * closes, focus moves in on open and returns to the trigger on close, and the
 * region is labeled so it can be found. The mobile sheet does trap focus, because
 * there the console covers the article and there is nothing behind it to reach.
 *
 * **It is always mounted and hidden when closed.** So its first rendered state
 * carries the entry questions and the disclaimer, which is what FR-04 and FR-10
 * ask for, and both are in the page's first paint rather than appearing on open.
 * `inert` is what makes that safe: a closed panel is out of the tab order and out
 * of the accessibility tree, instead of leaving a hidden text field in both.
 */
export function InsightsPanel() {
  const {
    open,
    openOn,
    articleTitle,
    eyebrow,
    options,
    turns,
    busy,
    ask,
    close,
    dismissAsk,
    answerAsk,
    retry,
    reader,
  } = useInsights();
  const composer = useRef<HTMLTextAreaElement | null>(null);
  const showing = open && openOn === "panel";

  // On open rather than on mount, because the panel is in the page from the start
  // and stealing focus on page load would be a bug rather than a courtesy.
  useEffect(() => {
    if (showing) composer.current?.focus();
  }, [showing]);

  useEffect(() => {
    if (!showing) return;
    function onKeyDown(e: KeyboardEvent) {
      // The reader is on top of the console, so escape closes that first.
      // Without this one press would close both, and the reader would never see
      // the conversation they were sent back to.
      if (e.key === "Escape" && reader === null) close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, reader, showing]);

  return (
    <aside
      aria-label="Article assistant"
      inert={!showing}
      // The console is a reading surface for articles, and articles are light.
      // Without this it inherits from wherever it is mounted, which on the library
      // page is outside the light slab, so it came out dark against a light page.
      data-tone="light"
      className={`border-line bg-bg fixed right-0 z-40 flex-col border-l shadow-[-8px_0_32px_rgba(0,0,0,0.08)] ${
        showing ? "hidden lg:flex" : "hidden"
      }`}
      style={{ top: SURFACE_TOP, bottom: 0, width: PANEL_WIDTH }}
    >
      <header className="border-line flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-fg-low font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
            {eyebrow}
          </p>
          <p className="text-fg-mid mt-1 truncate text-[13px]" title={articleTitle}>
            {articleTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          className="text-fg-low hover:text-fg focus-visible:ring-spaarke-blue -mr-1 -mt-1 shrink-0 rounded p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2"
          aria-label="Close the assistant"
        >
          <CloseIcon />
        </button>
      </header>

      <ConsoleBody
        options={options}
        turns={turns}
        busy={busy}
        onAsk={ask}
        onDismissAsk={dismissAsk}
        onAnswerAsk={answerAsk}
        onRetry={retry}
        composerRef={composer}
      />
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
