# Task 002: Add semantic design tokens

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 1.5 hours
**Dependencies:** 001
**Tags:** css, tailwind-v4, design-tokens

## Goal

Establish the v2 visual foundation in [src/app/globals.css](../../../src/app/globals.css) — semantic color tokens, type stack, container, button base styles — declared inside Tailwind v4's `@theme inline` block so utilities like `bg-surface`, `text-mid`, `border-line` are auto-generated.

## Context

The project is on **Tailwind v4**, which uses `@import "tailwindcss"` and `@theme inline { --color-* }`. Variables declared inside `@theme inline` automatically become Tailwind utility classes.

Approach (per agreed technical principles):
- **Semantic naming**: `--color-bg-base`, `--color-surface`, `--color-text-base`, `--color-text-mid`, `--color-text-low`, `--color-line`, `--color-accent` — not `--v2-*` and not raw color names like `--color-near-black`
- **No bespoke utility classes** like `.v2-h1`, `.v2-shell` — those are replaced by component primitives in Task 005
- **Existing v1 tokens stay**: `--color-spaarke-*` palette, dark-mode `.dark` block remain (used elsewhere in the site)
- **Light mode**: define a complementary set so light slabs (Section 3, Section 4) work with the same primitives

## Steps

1. Open [src/app/globals.css](../../../src/app/globals.css). Note the existing `@theme inline { ... }` block.
2. Add semantic v2 tokens to `@theme inline`:
   - **Colors** (dark-default values; reference values from [design_handoff/design/v2.css](../design_handoff_spaarke_website_v2/design/v2.css) as a starting point but use semantic names):
     - `--color-bg-base: #0a0a0a` (page background, dark)
     - `--color-surface: #111111` (elevated surface)
     - `--color-surface-2: #161616` (hover/nested)
     - `--color-bg-light: #f6f6f4` (light slab background — Section 3, Section 4)
     - `--color-surface-light: #ffffff` (cards on light slab)
     - `--color-text-base: #f5f5f5` (primary on dark)
     - `--color-text-mid: rgba(245,245,245,0.66)` (secondary on dark)
     - `--color-text-low: rgba(245,245,245,0.42)` (tertiary on dark)
     - `--color-text-base-light: #0a0a0a` (primary on light)
     - `--color-text-mid-light: rgba(10,10,10,0.62)` (secondary on light)
     - `--color-text-low-light: rgba(10,10,10,0.42)` (tertiary on light)
     - `--color-line: rgba(255,255,255,0.10)` (hairlines on dark)
     - `--color-line-2: rgba(255,255,255,0.18)` (stronger borders on dark)
     - `--color-line-light: rgba(10,10,10,0.10)` (hairlines on light)
     - `--color-accent: #000BFF` (Spaarke Blue — already exists as `--color-spaarke-blue`; alias as `accent` for v2 use)
3. Add type-stack tokens (used by font primitives in Task 003):
   - `--font-display`, `--font-body`, `--font-mono` — values become CSS variables that Task 003 wires to the actual fonts loaded via `next/font/google`
4. Add fluid spacing tokens (the v2 mockup uses generous shell padding):
   - `--spacing-shell-x: clamp(24px, 6vw, 120px)` (horizontal page padding)
   - `--spacing-section-y: clamp(80px, 12vh, 160px)` (vertical section padding)
5. Verify Tailwind v4 picks up the new variables: `npm run dev`, inspect a test element with class `bg-bg-base` or `text-mid`.
6. Build a tiny visual sanity check at `src/app/_v2-tokens/page.tsx` (private, deleted before merge) showing each semantic color and type token rendered on dark and light slabs.
7. Run `npm run build` to confirm no regressions on existing pages.
8. Commit: `feat(v2): add semantic design tokens to @theme inline`.
9. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- Updated `src/app/globals.css` with semantic tokens inside `@theme inline`
- Temporary `src/app/_v2-tokens/page.tsx` visual sanity check
- Build passes

## Acceptance Criteria

- [ ] All semantic color tokens declared and Tailwind exposes them as utility classes
- [ ] Light + dark variants both work via primitive components in Task 005
- [ ] `--font-*` tokens declared (will be wired in Task 003)
- [ ] Existing v1 site still builds and renders on the `v2` branch
- [ ] TypeScript strict checks pass (`tsc --noEmit`)
- [ ] No raw `--v2-*` prefixed tokens in production code

## Notes

- Per memory: Tailwind v4 uses `@import "tailwindcss"` and `@theme inline` — match the project's existing convention.
- The reference `design_handoff/design/v2.css` and `colors_and_type.css` are guides only; we extract semantic intent, not literal class names.
- Existing `--color-spaarke-*` palette stays untouched — it's the brand palette, separate from semantic theming.
