import type { Callout, PointerPosition } from "@/content/tours/types";

/** Which edge of the callout box the pointer protrudes from. */
export type PointerEdge = "left" | "right" | "top" | "bottom";

export type ResolvedBox = {
  /** CSS `left` as a fraction of stage width. For anchor-driven layout
   * this is the anchor-aligned base position before the transform; CSS
   * applies the transform to land the pointer at the exact anchor.
   * For explicit `box` overrides this is the user's literal x. */
  x: number;
  /** CSS `top` as a fraction of stage height. Same semantics as `x`. */
  y: number;
  /** CSS `width` as a fraction of stage width. */
  width: number;
  /** CSS `transform` applied to the box. For anchor-driven layout this
   * uses percent-of-self translates so the pointer's tip lands exactly
   * at the anchor regardless of rendered box height (which we cannot
   * predict in JS — text wraps based on actual viewport). Empty string
   * when an explicit `box` is supplied. */
  transform: string;
  /** Edge of the box where the pointer sits. */
  pointerEdge: PointerEdge;
  /** Position along that edge, normalized 0-1. */
  pointerOffset: number;
  /** True if the box was flipped to keep it on-screen. */
  flipped: boolean;
};

const HEIGHT_ESTIMATE = 0.1;

/** Offset along the pointer's edge. 0.18 / 0.50 / 0.82 for top/middle/bottom
 * (or left/middle/right for horizontal edges). 0.18 sits roughly at the
 * title baseline of a typical 2-3 line callout. */
const OFFSET_START = 0.18;
const OFFSET_MIDDLE = 0.5;
const OFFSET_END = 0.82;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const oppositeEdge: Record<PointerEdge, PointerEdge> = {
  left: "right",
  right: "left",
  top: "bottom",
  bottom: "top",
};

/** Parse a PointerPosition string into edge + numeric offset. */
function parsePointer(p: PointerPosition): {
  edge: PointerEdge;
  offset: number;
} {
  const [edgeStr, offsetStr] = p.split("-") as [PointerEdge, string];
  const offset =
    offsetStr === "top" || offsetStr === "left"
      ? OFFSET_START
      : offsetStr === "bottom" || offsetStr === "right"
        ? OFFSET_END
        : OFFSET_MIDDLE;
  return { edge: edgeStr, offset };
}

/** Map legacy `side` field to the equivalent PointerPosition.
 * `side` historically meant "which side the box extends from the anchor";
 * the new system describes the pointer's position on the box (opposite
 * direction). All legacy positions map to *-middle offsets. */
function sideToPointer(
  side: "top" | "right" | "bottom" | "left",
): PointerPosition {
  switch (side) {
    case "right":
      return "left-middle";
    case "left":
      return "right-middle";
    case "top":
      return "bottom-middle";
    case "bottom":
      return "top-middle";
  }
}

/**
 * Resolve a Callout's box position. If `box` is provided, return it as-is
 * (with the requested pointer direction, no flip). If `box` is omitted,
 * derive a box from `anchor` + `pointer` (or legacy `side`), positioning
 * the box so the pointer's tip lands at the anchor. Flips the pointer
 * edge to keep the box within the [0, 1] stage when needed.
 */
export function resolveBox(
  callout: Callout,
  opts?: { defaultWidth?: number; gap?: number },
): ResolvedBox {
  const defaultWidth = opts?.defaultWidth ?? 0.28;
  const gap = opts?.gap ?? 0.02;

  // Determine pointer position: explicit `pointer` wins; else legacy `side`;
  // else default to "left-middle" (box extends right of anchor).
  const pointerPos: PointerPosition = callout.pointer
    ? callout.pointer
    : callout.side
      ? sideToPointer(callout.side)
      : "left-middle";
  const { edge, offset } = parsePointer(pointerPos);

  // Explicit box wins — anchor (if any) drives only the pointer.
  if (callout.box) {
    return {
      x: callout.box.x,
      y: callout.box.y,
      width: callout.box.width,
      transform: "",
      pointerEdge: edge,
      pointerOffset: offset,
      flipped: false,
    };
  }

  // No anchor and no box — centered fallback.
  if (!callout.anchor) {
    return {
      x: 0.5,
      y: 0.5,
      width: defaultWidth,
      transform: "translate(-50%, -50%)",
      pointerEdge: edge,
      pointerOffset: offset,
      flipped: false,
    };
  }

  const anchor = callout.anchor;

  /**
   * Anchor-aligned base position for the box BEFORE the transform.
   *
   * The transform shifts the box by a percent of its OWN rendered size,
   * so the pointer's tip ends up exactly at the anchor regardless of
   * rendered box height. We don't need to know the box's height in JS.
   *
   * - Pointer on `left` edge → box extends right; CSS left = anchor.x + gap.
   *   transform translateY(-offset*100%) lifts the box so a point `offset`
   *   down its left edge lands at anchor.y.
   * - Mirror for the other 3 edges.
   */
  const place = (
    e: PointerEdge,
  ): { x: number; y: number; width: number } => {
    if (e === "left") {
      return { x: anchor.x + gap, y: anchor.y, width: defaultWidth };
    }
    if (e === "right") {
      return { x: anchor.x - gap, y: anchor.y, width: defaultWidth };
    }
    if (e === "top") {
      return { x: anchor.x, y: anchor.y + gap, width: defaultWidth };
    }
    // e === "bottom"
    return { x: anchor.x, y: anchor.y - gap, width: defaultWidth };
  };

  /** Does the box fit on its primary axis after applying its transform?
   * Uses HEIGHT_ESTIMATE for the perpendicular dimension when relevant. */
  const fits = (
    e: PointerEdge,
    p: { x: number; y: number; width: number },
  ): boolean => {
    if (e === "left") return p.x + p.width <= 1;
    if (e === "right") return p.x - p.width >= 0;
    if (e === "top") return p.y + HEIGHT_ESTIMATE <= 1;
    return p.y - HEIGHT_ESTIMATE >= 0; // bottom
  };

  let resolvedEdge: PointerEdge = edge;
  let placed = place(resolvedEdge);
  let flipped = false;

  if (!fits(resolvedEdge, placed)) {
    const flipEdge = oppositeEdge[resolvedEdge];
    const flipPlaced = place(flipEdge);
    if (fits(flipEdge, flipPlaced)) {
      resolvedEdge = flipEdge;
      placed = flipPlaced;
      flipped = true;
    }
  }

  placed.x = clamp01(placed.x);
  placed.y = clamp01(placed.y);

  return {
    x: placed.x,
    y: placed.y,
    width: placed.width,
    transform: computeTransform(resolvedEdge, offset),
    pointerEdge: resolvedEdge,
    pointerOffset: offset,
    flipped,
  };
}

/**
 * CSS transform that absorbs the pointer-offset adjustment.
 * Percent translates use the BOX's own size, not the parent — so the
 * adjustment is exact regardless of how tall the box renders.
 *
 * - left edge: translate the box up by `offset * 100%` of its own height
 *   so a point `offset` down its left edge sits at the anchor.
 * - right edge: also translate left by 100% (so the box's right edge
 *   aligns with the CSS-left coord, which we set to anchor.x - gap).
 * - top edge: translate left by `offset * 100%` of its own width.
 * - bottom edge: translate left by `offset * 100%` AND up by 100%.
 */
function computeTransform(edge: PointerEdge, offset: number): string {
  const off = (offset * 100).toFixed(2);
  if (edge === "left") return `translateY(-${off}%)`;
  if (edge === "right") return `translate(-100%, -${off}%)`;
  if (edge === "top") return `translateX(-${off}%)`;
  return `translate(-${off}%, -100%)`; // bottom
}

/**
 * @deprecated Backwards-compat alias retained for any consumers that
 * imported the old `Side` type. Resolves to PointerEdge.
 */
export type Side = PointerEdge;

/* ---------------------------------------------------------------------------
 * Worked examples (no test framework — these document expected behavior).
 *
 * Defaults: defaultWidth = 0.28, gap = 0.02, HEIGHT_ESTIMATE = 0.10.
 * Offsets: start=0.18, middle=0.50, end=0.82.
 *
 * Example 1 — pointer="left-middle", anchor at (0.40, 0.50)
 *   Box extends right; pointer on left edge at vertical middle.
 *   x = 0.40 + 0.02 = 0.42
 *   y = 0.50 - 0.50 * 0.10 = 0.45
 *   → { x: 0.42, y: 0.45, width: 0.28, pointerEdge: "left", pointerOffset: 0.50 }
 *
 * Example 2 — pointer="left-top", anchor at (0.40, 0.50)
 *   Box extends right; pointer on left edge at top portion (offset 0.18).
 *   x = 0.42; y = 0.50 - 0.18 * 0.10 = 0.482
 *   Anchor will be ~18% down the box's left edge — aligned with title.
 *   → { x: 0.42, y: 0.482, width: 0.28, pointerEdge: "left", pointerOffset: 0.18 }
 *
 * Example 3 — pointer="bottom-right", anchor at (0.50, 0.40)
 *   Box extends up; pointer on bottom edge at right portion.
 *   x = 0.50 - 0.82 * 0.28 = 0.270; y = 0.40 - 0.02 - 0.10 = 0.28
 *   Anchor will be ~82% across the box's bottom edge.
 *   → { x: 0.27, y: 0.28, width: 0.28, pointerEdge: "bottom", pointerOffset: 0.82 }
 *
 * Example 4 — legacy side="right" (backwards compat)
 *   Maps to pointer="left-middle" (box extends right of anchor).
 *   Same as Example 1.
 *
 * Example 5 — pointer="left-top" near right edge → flips to "right-top"
 *   anchor at (0.90, 0.50): left placement would have x+w=1.20 > 1 → overflow.
 *   Flips to right edge: x = 0.90 - 0.02 - 0.28 = 0.60; y = 0.482.
 *   → { x: 0.60, y: 0.482, width: 0.28, pointerEdge: "right",
 *       pointerOffset: 0.18, flipped: true }
 * -------------------------------------------------------------------------*/
