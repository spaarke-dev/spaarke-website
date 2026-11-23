"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * An article shown over /services (owner, 2026-11-22: "Read the Spaarke
 * Method" opens as an article modal instead of leaving the page). Reached
 * through the intercepting route in src/app/services/@modal; a reload or a
 * direct link renders the normal article page. Built like EstimateModal: a
 * native modal dialog, so the page behind is inert and focus stays inside;
 * Esc, the close button or a click on the backdrop go back to /services.
 * Full screen below 900 px.
 */
export function ArticleModal({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  const close = () => router.back();

  return (
    <dialog
      ref={ref}
      data-tone="light"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="text-fg m-auto h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-white p-0 backdrop:bg-[rgba(5,8,20,0.72)] backdrop:backdrop-blur-sm min-[900px]:h-[min(92vh,1100px)] min-[900px]:w-[min(960px,calc(100vw-64px))] min-[900px]:rounded-3xl"
    >
      <div className="flex h-full flex-col">
        <div className="border-line flex items-center justify-between gap-4 border-b bg-white px-5 py-3 md:px-8">
          <p className="font-mono-display text-fg-low truncate text-[11px] uppercase tracking-[0.16em]">Article</p>
          <div className="flex items-center gap-2">
            {/* The URL is already the article's; a full load shows it as a page. */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
              className="text-fg-mid hidden rounded-full px-3 py-2 text-[13px] hover:text-[#3F5FD9] sm:inline"
            >
              Open as a page
            </a>
            <button
              type="button"
              onClick={close}
              aria-label="Close article"
              autoFocus
              className="text-fg flex h-10 w-10 items-center justify-center rounded-full hover:bg-[rgba(10,10,10,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-8 md:px-12 md:py-12">
          <article className="mx-auto w-full max-w-[720px]">{children}</article>
        </div>
      </div>
    </dialog>
  );
}
