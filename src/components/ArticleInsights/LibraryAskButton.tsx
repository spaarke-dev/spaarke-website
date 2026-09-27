"use client";

import { useInsights } from "./InsightsProvider";

/**
 * The library page's entry point, in the filter bar where the search box was.
 *
 * **It replaces search rather than sitting beside it**, which is the owner's call
 * and a defensible one. Keyword search over twenty-four articles matches titles
 * and excerpts; a question reaches the whole corpus and comes back with the
 * article cited. The filters stay, because narrowing by topic and audience is a
 * different job from asking a question.
 *
 * The search box is still in `WhySpaarkeLibrary` and renders when this button is
 * absent, so switching the assistant off restores it rather than leaving a gap.
 */
export function LibraryAskButton() {
  const { open, openOn, openConsole, registerTrigger, turns } = useInsights();

  return (
    <button
      type="button"
      ref={(el) => registerTrigger("panel", el)}
      onClick={() => openConsole("panel")}
      aria-expanded={open && openOn === "panel"}
      // Same height and padding as the filters, so the row still lines up, and
      // nothing else in common with them.
      className="bg-fg text-bg focus-visible:ring-spaarke-blue flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <svg
        className="text-spaarke-cyan h-4 w-4 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h8M8 14h5M21 12a8 8 0 0 1-8 8H7l-4 3v-5.6A8 8 0 0 1 13 4a8 8 0 0 1 8 8Z"
        />
      </svg>
      <span className="truncate">
        {turns.length > 0 ? "Back to your questions" : "Ask these articles a question"}
      </span>
    </button>
  );
}
