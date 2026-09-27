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
 * It began as a hardcoded 100, which is about right for the site header and was
 * not right in practice. Then it measured the header's height, which was still
 * wrong for the reason that actually mattered: **the campaign bar above the header
 * pushes it down.** With the bar showing, the header's bottom edge is the bar plus
 * the header, so the panel started under it and the row it hid is the one holding
 * the close button. Dismiss the bar and the close button appeared, which is how
 * the owner found it.
 *
 * So this follows the header's bottom edge rather than its size. That edge moves:
 * the bar scrolls away and the sticky header rises to the top of the window, and
 * the bar can be dismissed outright, which changes nothing about the header's own
 * dimensions. Hence a scroll listener and an observer on the body as well as on
 * the header, because those are three different ways for the same number to
 * change and only one of them is a resize.
 */
const FALLBACK_TOP = 100;

export function useSurfaceTop(): number {
  const [top, setTop] = useState(FALLBACK_TOP);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const next = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
      // Only when it actually moved. This runs on scroll, and a re-render a frame
      // is not what anyone wants from a number that changes twice a session.
      setTop((current) => (current === next ? current : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(header);
    // Dismissing the campaign bar moves the header without resizing it, and the
    // page gets shorter when it goes.
    observer.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      observer.disconnect();
    };
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
