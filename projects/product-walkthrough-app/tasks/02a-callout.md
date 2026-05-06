# T02a — Callout component + geometry utilities

**Phase**: 1
**Wave**: 2 (parallel with T02b/c/d/e)
**Dependencies**: T01 (types must exist)

## Goal

Implement the `<Callout>` component (the bordered box + pointer arrow
that overlays a screenshot) and the supporting `geometry.ts` placement
utilities. Pure presentational component — no URL state, no click
handlers (those live in TourStage and TourShell).

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` — **§4 (positioning system)**,
  **§5.1 (Callout spec)**, **§5.8 (geometry utilities)**.
- `src/content/tours/types.ts` (created by T01) — for the `Callout` type.
- `docs/SITE-SPECIFICATION.md` §4 (design tokens — relevant for
  color/typography choices).
- `src/components/primitives/Heading.tsx` and
  `src/components/primitives/Lede.tsx` (read only — for typography
  conventions).

## Deliverables

### 1. `src/components/tour/geometry.ts`

```ts
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
 * Resolve a Callout's box position. If `box` is provided, return it as-is
 * (with the requested side, no flip). If `box` is omitted, derive a box
 * from `anchor` + `side`, flipping the side if needed to keep the box
 * within the [0, 1] stage.
 */
export function resolveBox(
  callout: Callout,
  opts?: { defaultWidth?: number; gap?: number }
): ResolvedBox;
```

Algorithm:
- `defaultWidth = opts?.defaultWidth ?? 0.28`, `gap = opts?.gap ?? 0.02`.
- If `callout.box` is set → return `{ ...box, side: callout.side ?? "right", flipped: false }`.
- Else require `callout.anchor` + (default `callout.side ?? "right"`).
- Place box per the side (e.g., side="right" → `x = anchor.x + gap`,
  `y = anchor.y - 0.5 * heightEstimate` where `heightEstimate ≈ 0.10`).
- Check overflow: if `x + width > 1` (right) → flip to "left"; mirror
  for other sides.
- Clamp y to `[0, 1 - heightEstimate]`.

Include unit tests via comments at the bottom of the file showing
expected values for 4 representative cases (right/left/top/bottom with
no flip + 1 case that flips). No actual test framework needed.

### 2. `src/components/tour/Callout.tsx`

Pure server component (no `"use client"`).

Visual treatment per spec §5.1:
- Box: white background `#ffffff`, 1px border `rgba(15,23,42,0.12)`,
  rounded `0.5rem`, soft shadow `0 8px 24px -4px rgba(15,23,42,0.10)`.
- Body text: `font-display`, ~14-16px, slate-700 (`text-slate-700` if
  available, else inline `color: rgba(15,23,42,0.74)`).
- Optional title: same family, font-weight 600, slate-900, mb-2.
- Pointer arrow: 12px equilateral triangle, white fill, same border on
  visible edges. Rendered as a `clip-path: polygon(...)` div positioned
  at the box edge. Or as a small SVG triangle — pick whichever is
  cleaner.

Layout:
- The Callout is rendered inside a `position: relative` parent (the
  TourStage). It positions itself as `position: absolute` using the
  resolved box's normalized coords as percentages.
- Pointer arrow sits at the side opposite to the box (e.g., box is to
  the right of the anchor → pointer on the box's left edge, pointing
  left toward the anchor).

Props:
```ts
type Props = {
  callout: Callout;
};
```

A11y: outer element `role="region"` with
`aria-roledescription="callout"` and
`aria-label={callout.title ? `${callout.title}: ${callout.body}` : callout.body}`.

The component doesn't know about anchor → DOM connection beyond
positioning the pointer arrow on the correct side. (A future enhancement
could draw a real connector line; out of scope for Phase 1.)

## Acceptance criteria

- `npm run typecheck` passes.
- `Callout` renders correctly when given a step's callout from the
  sample data (T02e ships this; verifier can mock if T02e isn't done
  yet).
- `resolveBox` correctly flips when the anchor is near a stage edge.
- No client component directives unless absolutely required.

## Out of scope

- Wiring the callout into the page — that's T03 (TourStage).
- Animating step transitions — Phase 4.
- The connector line from box to anchor — Phase 4 (Phase 1 just shows
  the pointer arrow on the correct side).
- Hotspot rendering — Phase 3.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. T01 has been completed (types and
> route skeleton exist).
>
> Read `projects/product-walkthrough-app/spec.md` §4, §5.1, §5.8, then
> `projects/product-walkthrough-app/tasks/02a-callout.md` (this file).
>
> Execute T02a: implement `src/components/tour/geometry.ts` (with the
> `resolveBox` function per the spec) and `src/components/tour/Callout.tsx`
> (pure server component, normalized-coord positioning, pointer arrow,
> a11y per spec §5.1). Add the worked-example comments at the bottom of
> `geometry.ts` showing 4 expected resolutions.
>
> Do not modify any other files. Do not create test files. Run
> `npm run typecheck` before reporting done.
