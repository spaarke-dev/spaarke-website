"use client";

import { useInsights } from "./InsightsProvider";

/**
 * The mobile entry point.
 *
 * Fixed, because the articles run to six thousand words and an entry point at the
 * top of one is an entry point nobody uses. Bottom right, which is the reachable
 * corner for a right thumb and is clear of everything else the site fixes: the
 * progress bar is at the top and the header is sticky rather than fixed.
 *
 * It hides while the sheet is open, since the sheet covers it anyway and leaving a
 * second control under a modal surface is how a stray tap closes something the
 * reader meant to keep.
 */
export function FloatingButton() {
  const { open, openOn, openConsole, registerTrigger, turns } = useInsights();
  const hidden = open && openOn === "sheet";

  return (
    <button
      type="button"
      ref={(el) => registerTrigger("sheet", el)}
      onClick={() => openConsole("sheet")}
      aria-expanded={hidden}
      aria-haspopup="dialog"
      className={`bg-spaarke-blue focus-visible:ring-spaarke-blue fixed bottom-5 right-4 z-30 flex items-center gap-2 rounded-full py-3 pl-4 pr-5 text-[14px] font-medium text-white shadow-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:hidden ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <svg
        className="h-5 w-5 shrink-0"
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
      {turns.length > 0 ? "Conversation" : "Ask about this"}
    </button>
  );
}
