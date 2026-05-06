"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Take Tour modal — overlay that hosts the product walkthrough video,
 * triggered by submitting the home-hero "Take tour" form. Visually
 * identical to WatchDemoModal but with copy that frames it as the
 * tour the user just unlocked. Backdrop click and Escape close. Body
 * scroll locked while open.
 *
 * Replace the placeholder block below with the production walkthrough
 * (an <iframe> embed or a self-hosted <video src="...">) when the
 * asset lands.
 */
export function TakeTourModal({ open, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spaarke product tour"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close tour"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 motion-safe:animate-in motion-safe:fade-in"
      />

      {/* Dialog content */}
      <div className="relative z-10 mx-4 w-full max-w-4xl">
        <div className="bg-surface border-line-strong overflow-hidden rounded-2xl border shadow-2xl">
          {/* Walkthrough placeholder — swap with production embed/video */}
          <div className="bg-bg relative aspect-video w-full">
            <div className="text-fg-mid absolute inset-0 flex items-center justify-center text-center">
              <div className="px-6">
                <p className="font-display text-fg text-2xl font-medium">
                  Tour coming soon
                </p>
                <p className="text-fg-mid mt-2 text-sm">
                  Thanks for signing up. We&rsquo;ll be in touch shortly with
                  your full walkthrough — in the meantime your details are
                  on our list.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close button (top-right of dialog) */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close tour"
          className="bg-surface border-line-strong text-fg hover:bg-surface-2 focus-visible:ring-spaarke-blue absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
