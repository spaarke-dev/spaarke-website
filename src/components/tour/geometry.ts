import type { Callout } from "@/content/tours/types";

export type Side = "top" | "right" | "bottom" | "left";

export type ResolvedBox = {
  /** Final box position normalized 0-1. */
  x: number;
  y: number;
  width: number;
  /** The (possibly flipped) side the pointer comes out of. */
  side: Side;
  /** True if we flipped to keep the box on-screen. */
  flipped: boolean;
};

/**
 * Approximate height used for vertical centering when auto-placing a box
 * from an anchor. We don't know the rendered text height ahead of time
 * (callouts are auto-height); 0.10 of stage is a reasonable estimate for
 * a 1-2 line callout, and only matters for centering & clamping.
 */
const HEIGHT_ESTIMATE = 0.1;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Resolve a Callout's box position. If `box` is provided, return it as-is
 * (with the requested side, no flip). If `box` is omitted, derive a box
 * from `anchor` + `side`, flipping the side if needed to keep the box
 * within the [0, 1] stage.
 */
export function resolveBox(
  callout: Callout,
  opts?: { defaultWidth?: number; gap?: number }
): ResolvedBox {
  const defaultWidth = opts?.defaultWidth ?? 0.28;
  const gap = opts?.gap ?? 0.02;

  // 1) Explicit box wins. Anchor (if provided) is only used by the
  //    pointer renderer, not for placement.
  if (callout.box) {
    return {
      x: callout.box.x,
      y: callout.box.y,
      width: callout.box.width,
      side: callout.side ?? "right",
      flipped: false,
    };
  }

  // 2) Need an anchor to derive a box. Fall back to a centered, no-flip
  //    box if neither box nor anchor is given.
  if (!callout.anchor) {
    return {
      x: 0.5 - defaultWidth / 2,
      y: 0.5 - HEIGHT_ESTIMATE / 2,
      width: defaultWidth,
      side: callout.side ?? "right",
      flipped: false,
    };
  }

  const anchor = callout.anchor;
  const requestedSide: Side = callout.side ?? "right";

  /**
   * Place the box on a given side relative to the anchor. The box is
   * positioned so that its edge nearest the anchor is `gap` away from
   * it, and it's centered along the perpendicular axis.
   */
  const place = (
    side: Side
  ): { x: number; y: number; width: number; height: number } => {
    if (side === "right") {
      return {
        x: anchor.x + gap,
        y: anchor.y - HEIGHT_ESTIMATE / 2,
        width: defaultWidth,
        height: HEIGHT_ESTIMATE,
      };
    }
    if (side === "left") {
      return {
        x: anchor.x - gap - defaultWidth,
        y: anchor.y - HEIGHT_ESTIMATE / 2,
        width: defaultWidth,
        height: HEIGHT_ESTIMATE,
      };
    }
    if (side === "bottom") {
      return {
        x: anchor.x - defaultWidth / 2,
        y: anchor.y + gap,
        width: defaultWidth,
        height: HEIGHT_ESTIMATE,
      };
    }
    // side === "top"
    return {
      x: anchor.x - defaultWidth / 2,
      y: anchor.y - gap - HEIGHT_ESTIMATE,
      width: defaultWidth,
      height: HEIGHT_ESTIMATE,
    };
  };

  /**
   * Does a box of this size, on this side, fit within the [0, 1] stage
   * along the side's primary axis? (We always clamp the perpendicular
   * axis; only the primary-axis overflow triggers a flip.)
   */
  const fits = (
    side: Side,
    placed: { x: number; y: number; width: number; height: number }
  ): boolean => {
    if (side === "right") return placed.x + placed.width <= 1;
    if (side === "left") return placed.x >= 0;
    if (side === "bottom") return placed.y + placed.height <= 1;
    return placed.y >= 0; // top
  };

  const opposite: Record<Side, Side> = {
    right: "left",
    left: "right",
    top: "bottom",
    bottom: "top",
  };

  let side: Side = requestedSide;
  let placed = place(side);
  let flipped = false;

  if (!fits(side, placed)) {
    const flippedSide = opposite[side];
    const flippedPlaced = place(flippedSide);
    if (fits(flippedSide, flippedPlaced)) {
      side = flippedSide;
      placed = flippedPlaced;
      flipped = true;
    }
    // If neither side fits (anchor mid-stage with too-wide box), keep
    // the original; the clamps below will pull it on-screen.
  }

  // Clamp perpendicular axis so the box doesn't run off the top/bottom
  // (for left/right placement) or off the left/right (for top/bottom).
  if (side === "left" || side === "right") {
    placed.y = Math.max(0, Math.min(1 - HEIGHT_ESTIMATE, placed.y));
  } else {
    placed.x = Math.max(0, Math.min(1 - placed.width, placed.x));
  }

  // Final safety clamp on primary axis (in case neither side fit).
  placed.x = clamp01(placed.x);
  placed.y = clamp01(placed.y);

  return {
    x: placed.x,
    y: placed.y,
    width: placed.width,
    side,
    flipped,
  };
}

/* ---------------------------------------------------------------------------
 * Worked examples (no test framework — these document expected behavior).
 *
 * Defaults: defaultWidth = 0.28, gap = 0.02, HEIGHT_ESTIMATE = 0.10.
 *
 * Example 1 — explicit box wins, no flip
 *   resolveBox({
 *     body: "x",
 *     box: { x: 0.45, y: 0.20, width: 0.30 },
 *     anchor: { x: 0.10, y: 0.10 }, // ignored for placement
 *   })
 *   → { x: 0.45, y: 0.20, width: 0.30, side: "right", flipped: false }
 *
 * Example 2 — anchor + side="right", fits
 *   resolveBox({ body: "x", anchor: { x: 0.40, y: 0.50 }, side: "right" })
 *   → { x: 0.42, y: 0.45, width: 0.28, side: "right", flipped: false }
 *   // x = 0.40 + 0.02 = 0.42; y = 0.50 - 0.10/2 = 0.45.
 *
 * Example 3 — anchor + side="left", fits
 *   resolveBox({ body: "x", anchor: { x: 0.60, y: 0.30 }, side: "left" })
 *   → { x: 0.30, y: 0.25, width: 0.28, side: "left", flipped: false }
 *   // x = 0.60 - 0.02 - 0.28 = 0.30; y = 0.30 - 0.05 = 0.25.
 *
 * Example 4 — anchor near right edge, side="right" → flips to "left"
 *   resolveBox({ body: "x", anchor: { x: 0.90, y: 0.50 }, side: "right" })
 *   // right placement would land at x=0.92, x+width = 1.20 > 1 → overflow.
 *   // Flip to left: x = 0.90 - 0.02 - 0.28 = 0.60; y = 0.45.
 *   → { x: 0.60, y: 0.45, width: 0.28, side: "left", flipped: true }
 *
 * Bonus — anchor + side="bottom", fits
 *   resolveBox({ body: "x", anchor: { x: 0.50, y: 0.20 }, side: "bottom" })
 *   → { x: 0.36, y: 0.22, width: 0.28, side: "bottom", flipped: false }
 *   // x = 0.50 - 0.28/2 = 0.36; y = 0.20 + 0.02 = 0.22.
 * -------------------------------------------------------------------------*/
