# T03 — TourStage component

**Phase**: 1
**Wave**: 3
**Dependencies**: T01 (types), T02a (Callout + geometry), T02c
(CoordinateGrid). Can run as soon as those three are done; T02b/d/e
do not need to be done first.

## Goal

Implement `<TourStage>`, the box that holds a screenshot with the
callout (and grid) overlay. This is where the normalized-coordinate
positioning system actually renders. Sets the aspect ratio, lays out
the screenshot at intrinsic size, and positions the Callout +
CoordinateGrid inside the same coordinate space.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.2 (component tree),
  §4.1 (normalized coordinates), §5.5 (TourStage spec).
- `src/content/tours/types.ts` — for `TourStep` type.
- `src/components/tour/Callout.tsx` (T02a output) — for the import.
- `src/components/tour/CoordinateGrid.tsx` (T02c output) — for the
  import.
- `next/image` Image component documentation (relevant for explicit
  width/height on the screenshot).

## Deliverables

### `src/components/tour/TourStage.tsx`

```ts
"use client";  // only required if authorMode is implemented in this task; otherwise can be a server component. See note below.

import Image from "next/image";
import type { TourStep } from "@/content/tours/types";
import { Callout } from "@/components/tour/Callout";
import { CoordinateGrid } from "@/components/tour/CoordinateGrid";

type Props = {
  step: TourStep;
  showGrid?: boolean;
  authorMode?: boolean;   // ?author=1 — Phase 1 may stub this; full impl in Phase 4
};

export function TourStage(props: Props): JSX.Element;
```

Behavior:
- Outer wrapper: `position: relative`, `width: 100%`, with inline style
  `aspect-ratio: ${ss.width} / ${ss.height}`. Background `#0a0a0a` so the
  letterboxing (if any) reads as part of the dark frame.
- Inner: a `position: relative` content box with the screenshot
  layered as `<Image>` `fill` and the overlay layers on top.
- Screenshot: `<Image src={step.screenshot.src} alt={step.screenshot.alt}
  width={step.screenshot.width} height={step.screenshot.height}
  className="block h-auto w-full" priority />`. Use `width`/`height` form
  rather than `fill` — the parent already sets aspect-ratio, so
  intrinsic-size + w-full keeps things simple.
- `<Callout callout={step.callout} />` rendered absolutely inside the
  same parent. Per T02a, Callout positions itself based on the resolved
  box.
- `<CoordinateGrid enabled={!!showGrid} />` rendered as a sibling so it
  layers cleanly over the image (z-index handled by source order).

Author mode (Phase 1 — stub, Phase 4 — full): If you're implementing
the click-to-print right now (because it's trivial), do the following.
If not, accept the prop and ignore it.
```ts
const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
  if (!authorMode) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const coords = `{ x: ${x.toFixed(3)}, y: ${y.toFixed(3)} }`;
  // eslint-disable-next-line no-console
  console.log("[author]", coords);
  void navigator.clipboard?.writeText(coords);
};
```

If `authorMode` is wired here, the component must be `"use client"`.
Recommended: implement now (it's <10 lines and unblocks Phase 2
authoring immediately).

A11y: outer element `role="region"` with
`aria-roledescription="slide"` and an `aria-label` set by the parent
TourShell (TourStage doesn't know section/step indices). Don't set
aria-label here — make it overridable via prop or just let TourShell
wrap with its own region.

Recommendation: TourStage does **not** set `role`/`aria-label`. The
parent TourShell wraps it in the labeled region. Keeps TourStage
focused on layout.

## Acceptance criteria

- `npm run typecheck` passes.
- Renders without errors when given a `TourStep` with the sample
  matter-management content from T02e.
- Aspect ratio reflects the screenshot's intrinsic dimensions.
- Callout appears at the correct normalized position relative to the
  stage box (verify by spot-checking with `?grid=1`).
- Author mode (if implemented) prints to console + copies to clipboard
  on click.
- Pointer events on the screenshot/callout don't trigger the author
  click handler unintentionally — the click handler is on the
  outermost stage div, but child interactive elements (none in Phase 1)
  would `e.stopPropagation()` if added later.

## Out of scope

- URL state for `showGrid` / `authorMode` — TourShell reads the URL
  and passes the booleans down.
- HotspotLayer — Phase 3.
- Step-transition animation — Phase 4.
- Mobile layout — TourShell decides whether to render the engine at all
  below `lg:`.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. T01, T02a, and T02c have been
> completed (types, Callout + geometry, CoordinateGrid all exist).
>
> Read `projects/product-walkthrough-app/spec.md` §3.2, §4.1, §5.5 and
> `projects/product-walkthrough-app/tasks/03-tour-stage.md` (this file).
>
> Execute T03: create `src/components/tour/TourStage.tsx`.
> - `position: relative` outer wrapper with inline `aspect-ratio:
>   width / height` from the screenshot's intrinsic dims.
> - `next/image` Image for the screenshot at intrinsic size, `w-full`.
> - `<Callout>` and `<CoordinateGrid>` layered over.
> - Recommended: implement author-mode click handler now (~10 lines),
>   making the component `"use client"`. If you do, log + clipboard the
>   normalized `{x, y}` of the click.
> - Do not set role/aria-label here — TourShell wraps for that.
>
> Do not modify other files. Run `npm run typecheck` before reporting done.
