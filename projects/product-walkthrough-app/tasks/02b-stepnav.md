# T02b — StepNav component

**Phase**: 1
**Wave**: 2 (parallel with T02a/c/d/e)
**Dependencies**: T01 (types must exist)

## Goal

Implement `<StepNav>`, the prev/next + "{n} of {total}" controls under
the stage. Pure presentational client component — receives state and
callbacks via props.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §5.2.
- `src/components/primitives/Button.tsx` (for the visual style of
  primary/text buttons used elsewhere).
- `docs/SITE-SPECIFICATION.md` §4 (typography / fluid spacing tokens).

## Deliverables

### `src/components/tour/StepNav.tsx`

```ts
"use client";

type Props = {
  /** Zero-based step index within the active section. */
  index: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function StepNav(props: Props): JSX.Element;
```

Visual (per spec §5.2):
- Two icon buttons (chevron-left, chevron-right) flanking centered
  counter text "{index + 1} of {total}".
- Disabled state when `!hasPrev` / `!hasNext`: 50% opacity, cursor
  `not-allowed`. Disabled `<button>` elements naturally don't fire
  click. Set `aria-disabled` too.
- Use inline-rendered SVG chevrons (not icon library) — match the
  thin-stroke style used in `WatchDemoModal` close button:
  ```jsx
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />  // left
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />     // right
  </svg>
  ```
- Counter typography: `font-display`, `text-[14px]` to `text-[15px]`,
  weight 500, slate-700. Tabular-nums helps avoid jitter as digit
  width changes.

Layout: a centered horizontal flex row, `gap-4` between elements,
`mt-6 md:mt-8` from the stage (the consumer sets margin; StepNav
itself has no top margin).

A11y:
- Each button has explicit `aria-label="Previous step"` /
  `aria-label="Next step"`.
- Counter is wrapped in a `<span aria-live="polite">` so screen
  readers announce step changes.
- Buttons must be reachable via Tab in DOM order: prev → counter →
  next. Counter is not focusable.

Keyboard handling — **does not** belong in StepNav. The parent
TourShell binds ←/→ at the window level; StepNav only handles direct
button clicks.

## Acceptance criteria

- `npm run typecheck` passes.
- Component renders without errors when given any combination of
  `hasPrev`/`hasNext` flags.
- Disabled buttons cannot be clicked (visual state + actual disabled
  attribute + aria-disabled).
- The counter element has `aria-live="polite"`.

## Out of scope

- URL state. StepNav doesn't read or write URL params.
- Keyboard listeners. Bound at TourShell level.
- Step content. Just the controls.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. T01 has been completed.
>
> Read `projects/product-walkthrough-app/spec.md` §5.2 and
> `projects/product-walkthrough-app/tasks/02b-stepnav.md` (this file).
>
> Execute T02b: create `src/components/tour/StepNav.tsx` per spec.
> Pure client component (`"use client"`), props as documented, inline
> SVG chevrons, disabled handling, aria-live counter.
>
> Do not modify any other files. Do not bind keyboard listeners. Run
> `npm run typecheck` before reporting done.
