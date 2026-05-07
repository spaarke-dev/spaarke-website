import type { CSSProperties } from "react";
import type { Callout as CalloutType } from "@/content/tours/types";
import { resolveBox, type Side } from "./geometry";

type Props = {
  callout: CalloutType;
};

const BOX_BORDER = "rgba(15,23,42,0.12)";
const BOX_SHADOW = "0 8px 24px -4px rgba(15,23,42,0.10)";
const BODY_COLOR = "rgba(15,23,42,0.74)"; // ~slate-700
const TITLE_COLOR = "rgb(15,23,42)"; // slate-900

const ARROW_SIZE_PX = 12;

/**
 * Pointer arrow. Rendered as an absolutely-positioned SVG triangle on
 * the side of the box that faces the anchor. The triangle sits half
 * outside the box so its tip points toward the anchor.
 *
 * `pointerSide` is the side of the *box* the pointer comes out of —
 * which is the same side the user passed in for placement.
 */
function PointerArrow({ pointerSide }: { pointerSide: Side }) {
  // Polygons drawn in a 12x12 viewBox; tip points outward.
  const points: Record<Side, string> = {
    // Arrow on the box's left edge, tip points left toward anchor.
    left: "12,0 12,12 0,6",
    // Arrow on the box's right edge, tip points right toward anchor.
    right: "0,0 0,12 12,6",
    // Arrow on the box's top edge, tip points up toward anchor.
    top: "0,12 12,12 6,0",
    // Arrow on the box's bottom edge, tip points down toward anchor.
    bottom: "0,0 12,0 6,12",
  };

  // Position the arrow flush against the appropriate edge, centered on
  // the perpendicular axis. The arrow sits *outside* the box edge so
  // the tip protrudes toward the anchor.
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

export function Callout({ callout }: Props) {
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

  // Only render a pointer if the author gave us an anchor (i.e., they
  // intend the callout to point at something). Explicit-box-only
  // callouts with no anchor render as a plain floating note.
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
      {showPointer ? <PointerArrow pointerSide={resolved.side} /> : null}
    </div>
  );
}
