# T02d — TourHeader component

**Phase**: 1
**Wave**: 2 (parallel with T02a/b/c/e)
**Dependencies**: T01 (types must exist)

## Goal

Implement `<TourHeader>`, the top capability nav matching the design
mockup: dashed-outline pill buttons for each section, solid pill for
"Get access" on the right. Active section's button is solid-filled.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §5.4.
- `src/components/primitives/Button.tsx` (read only — to align visual
  language for the "Get access" button).
- `docs/SITE-SPECIFICATION.md` §4 (brand palette: `--color-cta-blue`
  `#5078DC` for active state; `#0a0a0a` and white for backgrounds).

## Deliverables

### `src/components/tour/TourHeader.tsx`

Client component (`"use client"`) — owns the `onSectionClick` handler.

```ts
"use client";

import type { TourSection, SectionId } from "@/content/tours/types";

type Props = {
  sections: TourSection[];
  activeSectionId: SectionId;
  onSectionClick: (id: SectionId) => void;
};

export function TourHeader(props: Props): JSX.Element;
```

Visual:
- Container: `flex items-center justify-between gap-3 px-6 md:px-10 pt-6 pb-4`
  with a dark `#0a0a0a` background; rounded top corners (the stage
  below has square corners or a small radius — let TourShell handle the
  outer rounding).
- Section buttons (left/center group): horizontally scrollable on
  narrow viewports. Each button:
  - Default: `border-dashed border-[1.5px] border-white/30 text-white/80
    px-4 md:px-6 py-2 rounded-full text-[13px] md:text-[14px] font-medium`
    with `hover:border-white/60 hover:text-white` transition.
  - Active: `border-solid border-[#5078DC] bg-[#5078DC] text-white`
    (no dashes, solid fill).
- "Get access" button (right): solid-filled CTA matching the home
  Button primary variant — link to `/access-request`. Use the existing
  `<Button variant="primary" href="/access-request">Get access</Button>`
  from `@/components/primitives` rather than re-styling.

Markup outline:
```jsx
<div className="flex items-center justify-between gap-3 ...">
  <div className="flex items-center gap-3 overflow-x-auto">
    {sections.map(section => (
      <button
        key={section.id}
        type="button"
        onClick={() => onSectionClick(section.id)}
        className={section.id === activeSectionId ? activeClass : defaultClass}
        aria-current={section.id === activeSectionId ? "page" : undefined}
      >
        {section.label}
      </button>
    ))}
  </div>
  <Button variant="primary" href="/access-request">Get access</Button>
</div>
```

A11y:
- Section buttons: `<button type="button">` (not `<a>` — they don't
  navigate away, they update URL params via the parent).
- `aria-current="page"` on the active section button.
- Container has `role="tablist"` only if you implement full tablist
  semantics (which would require `role="tab"`/`tabpanel` plumbing). For
  Phase 1, simpler is fine: omit role attributes — the buttons are
  descriptive enough.

## Acceptance criteria

- `npm run typecheck` passes.
- Renders all sections plus a "Get access" CTA on the right.
- Active section button has solid blue fill; others have dashed
  outline.
- Clicking a section button calls `onSectionClick(section.id)`.
- Horizontal overflow scrolls on narrow viewports (touch-pan).

## Out of scope

- The actual section-switching logic — TourShell handles state and
  passes the callback.
- Mobile-specific simplification — the mobile guard in TourShell hides
  the entire engine below `lg:` (spec §7.4), so TourHeader only needs
  to look reasonable down to ~1024px.
- Animation between active states.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. T01 has been completed.
>
> Read `projects/product-walkthrough-app/spec.md` §5.4 and
> `projects/product-walkthrough-app/tasks/02d-tour-header.md` (this file).
>
> Execute T02d: create `src/components/tour/TourHeader.tsx` per spec.
> Client component, dashed-outline section buttons with active solid
> fill, "Get access" using the existing `Button` primitive primary
> variant linking to `/access-request`. `aria-current="page"` on the
> active section.
>
> Do not modify other files. Run `npm run typecheck` before reporting done.
