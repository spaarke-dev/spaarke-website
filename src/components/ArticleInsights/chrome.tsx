"use client";

import { useEffect, useState } from "react";

/**
 * The bits every surface needs, kept out of any of them.
 *
 * The close icon and the panel width used to live in `InsightsPanel`, which meant
 * the sheet and the reader imported from the panel, the panel imported the
 * provider, and the provider imported the sheet and the reader. That cycle
 * resolved only because every use happened at render time. Cycles that work by
 * accident stop working by accident.
 */

/** The desktop panel's width. `shiftArticle` and the reader both measure against it. */
export const PANEL_WIDTH = 420;

/**
 * How far down the surfaces start, measured rather than assumed.
 *
 * It used to be a hardcoded 100, which is about right for the site header and was
 * not right on every viewport. When the header came out taller it covered the top
 * of the panel, which is the row holding the close button, so there was no visible
 * way to shut the console. A guess that is usually right is worse than a
 * measurement, because the failure only shows up on somebody else's screen.
 */
const FALLBACK_TOP = 100;

export function useSurfaceTop(): number {
  const [top, setTop] = useState(FALLBACK_TOP);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;
    const measure = () => setTop(Math.round(header.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return top;
}

export function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
