"use client";

import { useEffect, useRef } from "react";
import { ConsoleBody } from "./ConsoleBody";
import { CloseIcon } from "./chrome";
import { useInsights } from "./InsightsProvider";

/**
 * The console on a phone, as a sheet over the article.
 *
 * **This does trap focus, where the desktop panel deliberately does not.** The
 * difference is not inconsistency. Beside an article the console is one of two
 * things on screen and the reader moves between them, so trapping would make the
 * article unreachable. Over an article it is the only thing on screen, nothing
 * behind it is usable, and letting Tab wander into a covered page is the bug.
 *
 * **The height is `dvh`, not `vh`, and that is the whole keyboard fix.** A sheet
 * sized to `vh` keeps its height when the on-screen keyboard opens, so the
 * composer ends up underneath it and the reader types blind. The dynamic viewport
 * unit shrinks with the keyboard, so the composer stays where it is: pinned to the
 * bottom of a sheet that is now shorter.
 *
 * The article stays mounted behind it, so closing returns the reader to the
 * paragraph they were on rather than to the top.
 */
export function MobileSheet() {
  const { open, openOn, articleTitle, eyebrow, options, turns, busy, ask, close, dismissAsk, answerAsk, retry } =
    useInsights();
  const showing = open && openOn === "sheet";

  const sheet = useRef<HTMLDivElement | null>(null);
  const composer = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!showing) return;
    composer.current?.focus();

    // The article must not scroll under the sheet. Overflow hidden keeps the
    // scroll position, which is what makes closing land the reader back on the
    // paragraph they were reading.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = sheet.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [close, showing]);

  if (!showing) return null;

  return (
    <div className="lg:hidden">
      <div
        className="fixed inset-0 z-40 bg-black/40"
        // A tap outside closes it. Not a button, because it is not a control a
        // keyboard user needs: Escape and the close button both do this, and
        // adding a full-screen tab stop in front of the sheet would be worse.
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Article assistant"
        className="bg-bg border-line fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl border-t shadow-[0_-8px_32px_rgba(0,0,0,0.18)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <header className="border-line flex shrink-0 items-start justify-between gap-3 border-b px-4 pb-3 pt-3">
          <div className="min-w-0">
            <p className="text-fg-low font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
              {eyebrow}
            </p>
            <p className="text-fg-mid mt-1 truncate text-[13px]">{articleTitle}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="text-fg-low hover:text-fg focus-visible:ring-spaarke-blue -mr-1 -mt-1 shrink-0 rounded p-2 transition-colors focus-visible:outline-none focus-visible:ring-2"
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
      </div>
    </div>
  );
}
