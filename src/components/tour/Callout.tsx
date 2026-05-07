"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type {
  Callout as CalloutType,
  CalloutCta,
  CalloutNav as CalloutNavType,
} from "@/content/tours/types";
import { resolveBox, type PointerEdge } from "./geometry";
import { FeedbackWidget } from "./FeedbackWidget";

type Props = {
  callout: CalloutType;
  /** Step navigation controls. When provided, render prev/next + counter
   * inline at the bottom of the callout (replaces the external StepNav). */
  nav?: CalloutNavType;
  /**
   * Identifiers used by the inline per-step feedback widget. The widget
   * is rendered only when both `nav` and these identifiers are present
   * — that combination signals a real, navigable step (interstitials
   * use a different overlay component and don't render feedback here).
   */
  tourSlug?: string;
  sectionId?: string;
  stepId?: string;
};

// Brand-aligned high-contrast styling so callouts read clearly on
// light-mode screenshots without inverting to a dark card. Border is
// the Spaarke brand blue at 2px so the callout always reads as a
// distinct UI element regardless of underlying screenshot content.
const BRAND_BLUE = "#5078DC";
const BOX_BORDER = BRAND_BLUE;
const BOX_BORDER_WIDTH_PX = 2;
const BOX_SHADOW =
  "0 16px 48px -8px rgba(15,23,42,0.25), 0 4px 12px -2px rgba(80,120,220,0.18)";
const TITLE_COLOR = BRAND_BLUE;
const BODY_COLOR = "rgba(15,23,42,0.86)"; // ~slate-800
const NAV_BORDER = "rgba(15,23,42,0.16)";
const NAV_TEXT = "rgba(15,23,42,0.7)";
const NAV_DISABLED = "rgba(15,23,42,0.25)";

const ARROW_SIZE_PX = 14;
const ARROW_STROKE_PX = 2;

/**
 * Pointer arrow positioned on a given edge of the callout box at a given
 * offset along that edge. The polygon's tip points away from the box
 * (toward the anchor); the box is positioned so that tip lands on the
 * anchor coordinates.
 *
 * `offset` is normalized 0-1 along the edge:
 * - For `left` / `right` edges: 0 = top, 1 = bottom (vertical position).
 * - For `top` / `bottom` edges:  0 = left, 1 = right (horizontal position).
 */
function PointerArrow({
  edge,
  offset,
}: {
  edge: PointerEdge;
  offset: number;
}) {
  const s = ARROW_SIZE_PX;
  // Tip vertex points AWAY from the box. The other two sit flush with
  // the box edge so the box border + arrow stroke read as a continuous outline.
  const points: Record<PointerEdge, string> = {
    left: `${s},0 ${s},${s} 0,${s / 2}`, // tip at SVG x=0 → points left, away from box
    right: `0,0 0,${s} ${s},${s / 2}`, // tip at SVG x=s → points right
    top: `0,${s} ${s},${s} ${s / 2},0`, // tip at SVG y=0 → points up
    bottom: `0,0 ${s},0 ${s / 2},${s}`, // tip at SVG y=s → points down
  };

  const offsetPct = `${offset * 100}%`;
  const positionStyle: CSSProperties =
    edge === "left"
      ? { top: offsetPct, left: 0, transform: `translate(-${s}px, -50%)` }
      : edge === "right"
        ? { top: offsetPct, right: 0, transform: `translate(${s}px, -50%)` }
        : edge === "top"
          ? { top: 0, left: offsetPct, transform: `translate(-50%, -${s}px)` }
          : {
              bottom: 0,
              left: offsetPct,
              transform: `translate(-50%, ${s}px)`,
            };

  return (
    <svg
      aria-hidden="true"
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{
        position: "absolute",
        ...positionStyle,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <polygon
        points={points[edge]}
        fill="#ffffff"
        stroke={BOX_BORDER}
        strokeWidth={ARROW_STROKE_PX}
      />
    </svg>
  );
}

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
        marginTop: "1rem",
        paddingTop: "0.75rem",
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

export function Callout({
  callout,
  nav,
  tourSlug,
  sectionId,
  stepId,
}: Props) {
  const resolved = resolveBox(callout);

  const style: CSSProperties = {
    position: "absolute",
    left: `${resolved.x * 100}%`,
    top: `${resolved.y * 100}%`,
    width: `${resolved.width * 100}%`,
    transform: resolved.transform || undefined,
    backgroundColor: "#ffffff",
    border: `${BOX_BORDER_WIDTH_PX}px solid ${BOX_BORDER}`,
    borderRadius: "0.625rem",
    boxShadow: BOX_SHADOW,
    padding: "1rem 1.125rem",
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
            fontWeight: 700,
            fontSize: "1rem",
            lineHeight: 1.3,
            letterSpacing: "-0.005em",
            marginBottom: "0.5rem",
          }}
        >
          {callout.title}
        </div>
      ) : null}
      <div
        style={{
          fontSize: "0.9375rem",
          lineHeight: 1.5,
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
      {nav && tourSlug && sectionId && stepId ? (
        <FeedbackWidget
          tourSlug={tourSlug}
          sectionId={sectionId}
          stepId={stepId}
        />
      ) : null}
      {showPointer ? (
        <PointerArrow
          edge={resolved.pointerEdge}
          offset={resolved.pointerOffset}
        />
      ) : null}
    </div>
  );
}
