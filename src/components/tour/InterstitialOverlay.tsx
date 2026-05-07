"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type {
  Callout as CalloutType,
  CalloutCta,
  CalloutNav as CalloutNavType,
} from "@/content/tours/types";

type Props = {
  callout: CalloutType;
  /** Step navigation controls. When provided, render prev/next + counter
   * inline at the bottom of the interstitial card. */
  nav?: CalloutNavType;
};

// Match the Callout option-B styling so the interstitial reads as the
// same visual language — white card, brand-blue 2px border, brand-blue
// title — but scaled up to feel like a centered confirmation card.
const BRAND_BLUE = "#5078DC";
const BOX_BORDER = BRAND_BLUE;
const BOX_BORDER_WIDTH_PX = 2;
const BOX_SHADOW =
  "0 24px 64px -8px rgba(15,23,42,0.35), 0 8px 20px -4px rgba(80,120,220,0.22)";
const TITLE_COLOR = BRAND_BLUE;
const BODY_COLOR = "rgba(15,23,42,0.86)"; // ~slate-800
const NAV_BORDER = "rgba(15,23,42,0.16)";
const NAV_TEXT = "rgba(15,23,42,0.7)";
const NAV_DISABLED = "rgba(15,23,42,0.25)";

function ChevronLeft() {
  return (
    <svg
      aria-hidden="true"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      aria-hidden="true"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CalloutCtaButton({ cta }: { cta: CalloutCta }) {
  const isExternal = /^https?:\/\//.test(cta.href);
  const className =
    "inline-flex items-center gap-2 rounded-md bg-[#5078DC] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#4060B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2";
  if (isExternal) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

function InterstitialNav({ nav }: { nav: CalloutNavType }) {
  const counter = `${nav.index + 1} of ${nav.total}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "1.25rem",
        paddingTop: "0.875rem",
        borderTop: `1px solid ${NAV_BORDER}`,
        color: NAV_TEXT,
      }}
    >
      <button
        type="button"
        onClick={nav.onPrev}
        disabled={!nav.hasPrev}
        aria-label="Previous step"
        className="rounded-md transition-colors hover:enabled:bg-[rgba(80,120,220,0.1)] hover:enabled:text-[#5078DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]/40"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0.25rem 0.5rem",
          color: nav.hasPrev ? NAV_TEXT : NAV_DISABLED,
          cursor: nav.hasPrev ? "pointer" : "not-allowed",
        }}
      >
        <ChevronLeft />
      </button>
      <span
        aria-live="polite"
        style={{
          fontSize: "0.8125rem",
          fontWeight: 500,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.02em",
        }}
      >
        {counter}
      </span>
      <button
        type="button"
        onClick={nav.onNext}
        disabled={!nav.hasNext}
        aria-label="Next step"
        className="rounded-md transition-colors hover:enabled:bg-[rgba(80,120,220,0.1)] hover:enabled:text-[#5078DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]/40"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0.25rem 0.5rem",
          color: nav.hasNext ? NAV_TEXT : NAV_DISABLED,
          cursor: nav.hasNext ? "pointer" : "not-allowed",
        }}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

/**
 * A centered modal-style card overlaid on the dimmed screenshot for tour
 * intro, section-transition, and outro steps. Renders without a pointer
 * — the dimmed underlying screenshot provides visual continuity, while
 * the centered card pauses the tour like a soft confirmation.
 */
export function InterstitialOverlay({ callout, nav }: Props) {
  const wrapperStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const cardStyle: CSSProperties = {
    pointerEvents: "auto",
    width: "min(540px, 60%)",
    backgroundColor: "#ffffff",
    border: `${BOX_BORDER_WIDTH_PX}px solid ${BOX_BORDER}`,
    borderRadius: "1rem",
    boxShadow: BOX_SHADOW,
    padding: "2rem",
    color: BODY_COLOR,
  };

  const ariaLabel = callout.title
    ? `${callout.title}: ${callout.body}`
    : callout.body;

  return (
    <div style={wrapperStyle}>
      <div
        role="region"
        aria-roledescription="interstitial"
        aria-label={ariaLabel}
        style={cardStyle}
        className="font-display"
      >
        {callout.title ? (
          <div
            style={{
              color: TITLE_COLOR,
              fontWeight: 700,
              fontSize: "1.25rem",
              lineHeight: 1.3,
              letterSpacing: "-0.005em",
              marginBottom: "0.75rem",
            }}
          >
            {callout.title}
          </div>
        ) : null}
        <div
          style={{
            fontSize: "1rem",
            lineHeight: 1.55,
          }}
        >
          {callout.body.split(/\n\n+/).map((para, i, arr) => (
            <p
              key={i}
              style={{ margin: 0, marginBottom: i < arr.length - 1 ? "0.75rem" : 0 }}
            >
              {para}
            </p>
          ))}
        </div>
        {callout.cta ? (
          <div style={{ marginTop: "1rem" }}>
            <CalloutCtaButton cta={callout.cta} />
          </div>
        ) : null}
        {nav ? <InterstitialNav nav={nav} /> : null}
      </div>
    </div>
  );
}
