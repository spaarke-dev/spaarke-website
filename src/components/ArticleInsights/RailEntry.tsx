"use client";

import { useInsights } from "./InsightsProvider";

/**
 * The desktop entry point, in the article rail.
 *
 * A heading, one line of positioning, and a link. It carried the four entry
 * questions at first and the owner rejected that on sight: the cards pushed the
 * rail past the fold and put a scrollbar beside a table of contents that had never
 * had one. The questions live in the panel now, where there is room to read what
 * they return.
 */
export function RailEntry() {
  const { open, openOn, openConsole, registerTrigger, turns } = useInsights();

  return (
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
        ref={(el) => registerTrigger("panel", el)}
        onClick={() => openConsole("panel")}
        aria-expanded={open && openOn === "panel"}
        className="text-spaarke-blue hover:text-cta-blue focus-visible:ring-spaarke-blue mt-3 inline-flex items-center gap-2 rounded text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
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
  );
}
