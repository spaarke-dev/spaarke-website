"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type {
  Callout as CalloutType,
  CalloutCta,
  CalloutNav as CalloutNavType,
} from "@/content/tours/types";
import { resolveBox, type Side } from "./geometry";

type Props = {
  callout: CalloutType;
  /** Step navigation controls. When provided, render prev/next + counter
   * inline at the bottom of the callout (replaces the external StepNav). */
  nav?: CalloutNavType;
};

const BOX_BORDER = "rgba(15,23,42,0.12)";
const BOX_SHADOW = "0 8px 24px -4px rgba(15,23,42,0.10)";
const BODY_COLOR = "rgba(15,23,42,0.74)"; // ~slate-700
const TITLE_COLOR = "rgb(15,23,42)"; // slate-900
const NAV_BORDER = "rgba(15,23,42,0.08)";
const NAV_TEXT = "rgba(15,23,42,0.6)";
const NAV_DISABLED = "rgba(15,23,42,0.25)";

const ARROW_SIZE_PX = 12;

function PointerArrow({ pointerSide }: { pointerSide: Side }) {
  const points: Record<Side, string> = {
    left: "12,0 12,12 0,6",
    right: "0,0 0,12 12,6",
    top: "0,12 12,12 6,0",
    bottom: "0,0 12,0 6,12",
  };
  const positionStyle: Record<Side, CSSProperties> = {
    left: {
      top: "50%",
      left: 0,
      transform: `translate(-${ARROW_SIZE_PX}px, -50%)`,
    },
    right: {
      top: "50%",
      right: 0,
      transform: `translate(${ARROW_SIZE_PX}px, -50%)`,
    },
    top: {
      top: 0,
      left: "50%",
      transform: `translate(-50%, -${ARROW_SIZE_PX}px)`,
    },
    bottom: {
      bottom: 0,
      left: "50%",
      transform: `translate(-50%, ${ARROW_SIZE_PX}px)`,
    },
  };
  return (
    <svg
      aria-hidden="true"
      width={ARROW_SIZE_PX}
      height={ARROW_SIZE_PX}
      viewBox="0 0 12 12"
      style={{
        position: "absolute",
        ...positionStyle[pointerSide],
        pointerEvents: "none",
      }}
    >
      <polygon
        points={points[pointerSide]}
        fill="#ffffff"
        stroke={BOX_BORDER}
        strokeWidth={1}
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      aria-hidden="true"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
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
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CalloutCtaButton({ cta }: { cta: CalloutCta }) {
  const isExternal = /^https?:\/\//.test(cta.href);
  const className =
    "inline-flex items-center gap-2 rounded-md bg-[#5078DC] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#4060B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2";
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

function CalloutNav({ nav }: { nav: CalloutNavType }) {
  const counter = `${nav.index + 1} of ${nav.total}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "0.875rem",
        paddingTop: "0.625rem",
        borderTop: `1px solid ${NAV_BORDER}`,
        color: NAV_TEXT,
      }}
    >
      <button
        type="button"
        onClick={nav.onPrev}
        disabled={!nav.hasPrev}
        aria-label="Previous step"
        style={{
          display: "inline-flex",
          alignItems: "center",
          color: nav.hasPrev ? NAV_TEXT : NAV_DISABLED,
          cursor: nav.hasPrev ? "pointer" : "not-allowed",
        }}
      >
        <ChevronLeft />
      </button>
      <span
        aria-live="polite"
        style={{
          fontSize: "0.75rem",
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
        style={{
          display: "inline-flex",
          alignItems: "center",
          color: nav.hasNext ? NAV_TEXT : NAV_DISABLED,
          cursor: nav.hasNext ? "pointer" : "not-allowed",
        }}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export function Callout({ callout, nav }: Props) {
  const resolved = resolveBox(callout);

  const style: CSSProperties = {
    position: "absolute",
    left: `${resolved.x * 100}%`,
    top: `${resolved.y * 100}%`,
    width: `${resolved.width * 100}%`,
    backgroundColor: "#ffffff",
    border: `1px solid ${BOX_BORDER}`,
    borderRadius: "0.5rem",
    boxShadow: BOX_SHADOW,
    padding: "0.875rem 1rem",
    color: BODY_COLOR,
  };

  const ariaLabel = callout.title
    ? `${callout.title}: ${callout.body}`
    : callout.body;

  const showPointer = Boolean(callout.anchor);

  return (
    <div
      role="region"
      aria-roledescription="callout"
      aria-label={ariaLabel}
      style={style}
      className="font-display"
    >
      {callout.title ? (
        <div
          style={{
            color: TITLE_COLOR,
            fontWeight: 600,
            fontSize: "0.9375rem",
            lineHeight: 1.3,
            marginBottom: "0.5rem",
          }}
        >
          {callout.title}
        </div>
      ) : null}
      <div
        style={{
          fontSize: "0.875rem",
          lineHeight: 1.45,
        }}
      >
        {callout.body}
      </div>
      {callout.cta ? (
        <div style={{ marginTop: "0.75rem" }}>
          <CalloutCtaButton cta={callout.cta} />
        </div>
      ) : null}
      {nav ? <CalloutNav nav={nav} /> : null}
      {showPointer ? <PointerArrow pointerSide={resolved.side} /> : null}
    </div>
  );
}
