"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { deptEstimate, estimate } from "@/app/services/content";
import type { EstimateInputs } from "./model";
import type { DeptInputs } from "./dept-model";
import { EstimateView } from "./EstimateView";
import { DETAILS_ANCHOR, type EstimateAudience } from "./query";

/**
 * /services/estimate shown over /services (the intercepting route in
 * src/app/services/@modal). A native modal dialog: the rest of the page is
 * inert while it is open, focus stays inside, and Esc, the close button or a
 * click on the backdrop go back to /services. It opens scrolled to "How the
 * estimate works"; the calculator sits above, so the page works on its own.
 * Full screen below 900 px (handoff section 6).
 */
export function EstimateModal({
  audience,
  firm,
  dept,
}: {
  audience: EstimateAudience;
  firm: EstimateInputs | null;
  dept: DeptInputs | null;
}) {
  const copy = audience === "corporate" ? deptEstimate : estimate;
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(DETAILS_ANCHOR);
      if (target && body.current) body.current.scrollTop = target.offsetTop - 16;
    });
    return () => {
      cancelAnimationFrame(frame);
      root.style.overflow = prev;
    };
  }, []);

  const close = () => router.back();

  return (
    <dialog
      ref={ref}
      data-tone="light"
      aria-labelledby="estimate-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="text-fg m-auto h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-[#f6f6f4] p-0 backdrop:bg-[rgba(5,8,20,0.72)] backdrop:backdrop-blur-sm min-[900px]:h-[min(92vh,1100px)] min-[900px]:w-[min(1240px,calc(100vw-64px))] min-[900px]:rounded-3xl"
    >
      <div className="flex h-full flex-col">
        <div className="border-line flex items-center justify-between gap-4 border-b bg-white px-5 py-3 md:px-8">
          <p id="estimate-modal-title" className="font-display text-fg text-[17px] font-medium">
            MSO value estimate
          </p>
          <div className="flex items-center gap-2">
            {/* The URL is already /services/estimate with the inputs; a full
                load shows it as a page instead of the intercepted modal. */}
            <a
              href="/services/estimate"
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
              aria-label="Close details"
              autoFocus
              className="text-fg flex h-10 w-10 items-center justify-center rounded-full hover:bg-[rgba(10,10,10,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div ref={body} className="relative flex-1 overflow-y-auto px-5 py-8 md:px-10 md:py-10">
          <h2 className="font-display text-fg max-w-3xl text-[clamp(28px,3.4vw,40px)] font-medium tracking-[-0.02em] text-balance">
            {copy.title}
          </h2>
          <p className="text-fg-mid mt-3 max-w-3xl text-[16px] leading-relaxed">{copy.lede}</p>
          <div className="mt-8">
            <EstimateView audience={audience} firm={firm} dept={dept} />
          </div>
        </div>
      </div>
    </dialog>
  );
}
