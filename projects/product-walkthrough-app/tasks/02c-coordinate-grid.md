# T02c — CoordinateGrid component

**Phase**: 1
**Wave**: 2 (parallel with T02a/b/d/e)
**Dependencies**: T01 (types must exist; this task uses none of them
but must not run before T01 in case of conflicts)

## Goal

Implement `<CoordinateGrid>`, the SVG overlay that draws a 5%-step
crosshair grid with axis labels — author/dev aid for placing callouts.
Renders nothing if not enabled.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §4.3, §5.3.

## Deliverables

### `src/components/tour/CoordinateGrid.tsx`

Pure server component (no `"use client"`).

```ts
type Props = {
  enabled: boolean;
};

export function CoordinateGrid({ enabled }: Props): JSX.Element | null;
```

Renders `null` if `!enabled`. Otherwise renders a single `<svg>`
positioned `absolute inset-0` with `pointer-events-none` so it never
blocks clicks.

Implementation:
- `<svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full pointer-events-none">`
  — using `preserveAspectRatio="none"` makes SVG units = % of stage
  width/height, not square — so a 1-unit-wide vertical line spans the
  full height.
- Generate 21 vertical lines at `x = 0, 5, 10, …, 100`. Each is `<line
  x1={x} y1="0" x2={x} y2="100" />`.
- Same for horizontal at y = 0, 5, …, 100.
- Stroke widths and colors:
  - Default lines: stroke `rgba(80, 120, 220, 0.18)`, stroke-width `0.1`
    (in viewBox units → ~0.1% of stage; will be a hairline).
  - Heavier lines at every 10% step (x or y divisible by 10): stroke
    `rgba(80, 120, 220, 0.32)`, stroke-width `0.18`.
- Labels at every 10% step along the top edge (X labels) and left edge
  (Y labels):
  - `<text x={x} y={2.5} fill="rgba(80,120,220,0.6)" fontSize="2"
    fontFamily="ui-monospace, monospace">{x}</text>` — each label reads
    "10", "20", … "90".
  - Y labels mirror at left: `<text x={1} y={y + 0.5} ...>{y}</text>`.
  - Skip the 0 and 100 labels at the edges to avoid clipping.
  - Note: `font-size` on an SVG with `preserveAspectRatio="none"` does
    *not* stretch — labels render at the rendered pixel scale of the
    `2`-unit value. Verify visually; tune size if needed.

If the labels look squashed because of `preserveAspectRatio="none"` —
solution: render the labels in a separate non-stretched SVG sibling, or
in absolutely-positioned divs. Pick whichever is simpler. The grid lines
themselves benefit from the stretched viewBox; the labels do not.

Accessibility: this is a developer aid, not user-facing content. Set
`aria-hidden="true"` on the SVG.

## Acceptance criteria

- `npm run typecheck` passes.
- When enabled, renders 21 vertical + 21 horizontal lines + axis labels
  every 10%.
- When disabled, renders `null` (component returns null, not an empty
  fragment with hidden styles).
- Pointer events are not captured by the grid.
- `aria-hidden="true"` on the SVG.

## Out of scope

- Toggling logic — TourShell decides whether to pass `enabled={true}`
  based on `?grid=1`.
- Cursor tracking on hover — Phase 4 (`?author=1` is a separate feature
  added then).
- Animation — none.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. T01 has been completed.
>
> Read `projects/product-walkthrough-app/spec.md` §4.3, §5.3 and
> `projects/product-walkthrough-app/tasks/02c-coordinate-grid.md` (this file).
>
> Execute T02c: create `src/components/tour/CoordinateGrid.tsx` per
> spec. SVG with `viewBox="0 0 100 100"` and
> `preserveAspectRatio="none"`. Lines every 5%, heavier every 10%,
> labels every 10%. `pointer-events-none` and `aria-hidden="true"`.
> Returns null when disabled.
>
> If labels look distorted from the stretched viewBox, render labels in
> a sibling non-stretched SVG or absolutely-positioned spans — pick
> whichever is simpler.
>
> Do not modify other files. Run `npm run typecheck` before reporting done.
