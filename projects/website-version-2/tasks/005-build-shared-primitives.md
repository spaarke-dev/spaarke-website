# Task 005: Build shared v2 primitives (Shell, Button, Eyebrow)

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 1.5 hours
**Dependencies:** 002, 003
**Tags:** components, primitives, ui

## Goal

Reusable React components for the most-used v2 patterns — page shell container, buttons (primary/secondary/text variants), and the eyebrow caption — so every section component can compose them without re-implementing.

## Context

The handoff prototype uses utility classes directly (`.v2-shell`, `.v2-btn-primary`). We could mirror that, but lifting them into typed React components gives us:
- Better DX (props instead of remembering class names)
- Single place to add accessibility (focus-visible, aria attributes on buttons)
- Easier to evolve later

Place these in `src/components/v2/` so they're co-located and discoverable. (Don't put them in `src/components/ui/` if that exists — keep the v2 namespace clean for the redesign.)

## Steps

1. Create `src/components/v2/Shell.tsx`:
   - `<Shell>` wraps children in a `<div>` with class `v2-shell`
   - Optional `as` prop for tag override (default `div`)
   - Optional `className` for additional classes
2. Create `src/components/v2/Button.tsx`:
   - Props: `variant` ('primary' | 'secondary' | 'text'), `href` (optional — renders Next.js `Link` if present, else `<button>`), `children`, plus standard button/anchor pass-through props
   - Map variants to `.v2-btn .v2-btn-primary`, `.v2-btn .v2-btn-secondary`, `.v2-btn-text` classes
   - Text variant includes a `<span class="arrow">→</span>` if `children` ends with a right arrow, OR explicit `arrow` prop — pick whichever is cleaner; check what the handoff prototype does
   - `aria-disabled` and `disabled` props for button-mode
3. Create `src/components/v2/Eyebrow.tsx`:
   - `<Eyebrow>` renders a `<span class="v2-eyebrow">` with the children, uppercased via CSS (already in `.v2-eyebrow`)
4. Add an `index.ts` barrel export in `src/components/v2/`.
5. Update the `_v2-tokens` page from Task 002 to use these components instead of raw classes — ensures they render correctly.
6. Commit: `feat(v2): add Shell, Button, Eyebrow primitives`.
7. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- `src/components/v2/Shell.tsx`
- `src/components/v2/Button.tsx`
- `src/components/v2/Eyebrow.tsx`
- `src/components/v2/index.ts`
- Updated `_v2-tokens` sanity page

## Acceptance Criteria

- [ ] `<Shell>` constrains content to 1240px with correct fluid padding
- [ ] `<Button variant="primary">Get access</Button>` renders the white-bg dark-text pill
- [ ] `<Button variant="secondary">` renders the hairline-border variant
- [ ] `<Button variant="text">Read why</Button>` renders the text-button with hover-translate arrow
- [ ] `<Button href="/access-request">` renders a Next.js `Link`
- [ ] Focus-visible styles present on all interactive variants

## Notes

- Keep these primitives **headless of motion** — section components handle their own animation. These should render the chrome, nothing more.
- If the handoff prototype uses different markup for text-arrow buttons, mirror it precisely (the `.arrow` translate effect is defined in `v2.css`).
- Don't reach into Tailwind for these — they're pure utility-class compositions of the v2 layer we set up in Task 002.
