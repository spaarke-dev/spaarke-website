# Task 002: Add v2 CSS tokens and utility classes

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 1.5 hours
**Dependencies:** 001
**Tags:** css, tailwind-v4, design-tokens

## Goal

Establish the v2 visual foundation in [src/app/globals.css](../../../src/app/globals.css) — color tokens, type scale, shell container, button utilities — so every subsequent component can use them.

## Context

The v2 design system uses CSS custom properties (`--v2-*`) plus a small set of utility classes (`.v2-h1`, `.v2-h2`, `.v2-shell`, `.v2-btn-primary`, etc.). The full token list is in [design_handoff/README.md §"Design tokens"](../design_handoff_spaarke_website_v2/README.md) and [design_handoff/design/v2.css](../design_handoff_spaarke_website_v2/design/v2.css). Lift verbatim.

This project is on Tailwind v4, which uses `@theme inline` syntax (not `tailwind.config.js`). v2 tokens should slot into the existing `@theme inline` block where appropriate; bespoke utility classes (type scale, shell, buttons) go in `@layer components` or `@layer utilities`.

## Steps

1. Open [design_handoff_spaarke_website_v2/design/v2.css](../design_handoff_spaarke_website_v2/design/v2.css) and identify:
   - `:root` custom properties (colors, type stacks, spacing clamps)
   - Utility class definitions (`.v2-h1`, `.v2-h2`, `.v2-h3`, `.v2-eyebrow`, `.v2-lede`, `.v2-shell`, `.v2-btn`, `.v2-btn-primary`, `.v2-btn-secondary`, `.v2-btn-text`)
2. In [src/app/globals.css](../../../src/app/globals.css):
   - Add `--v2-*` custom properties to `:root` (colors, type stacks)
   - Add light-slab variant tokens (light `bg`, `surface`, `fg`, `fgMid`, `fgLow`, `line`)
   - Add type-scale utility classes inside `@layer components` (`.v2-h1`, `.v2-h2`, `.v2-h3`, `.v2-eyebrow`, `.v2-lede`)
   - Add shell container class `.v2-shell` (max-width 1240px, fluid horizontal padding)
   - Add button base `.v2-btn` and variants (`.v2-btn-primary`, `.v2-btn-secondary`, `.v2-btn-text`)
   - Add `.arrow` translate-on-hover for text buttons
3. Do **not** remove existing v1 styles yet — they're still used by pages on the `v2` branch until we replace them. Keep both side-by-side.
4. Verify Tailwind v4 build picks up the new layer styles: `npm run dev` and inspect a test element.
5. Add a quick visual sanity-check route at `src/app/_v2-tokens/page.tsx` (private, will be deleted before merge) showing each utility class rendered, so we can eyeball the foundation is correct.
6. Commit: `feat(v2): add v2 design tokens and utility classes`.
7. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- Updated `src/app/globals.css` with `--v2-*` tokens and v2 utility classes
- Temporary `src/app/_v2-tokens/page.tsx` visual sanity check

## Acceptance Criteria

- [ ] All `--v2-*` color, type, line tokens declared in `:root`
- [ ] Type scale classes (`.v2-h1` through `.v2-eyebrow`, `.v2-lede`) render with correct clamps and tracking
- [ ] `.v2-shell` constrains to 1240px max with fluid padding
- [ ] Button variants render correctly (primary, secondary, text)
- [ ] Existing v1 site still builds and renders on the `v2` branch

## Notes

- Per memory note: Tailwind v4 uses `@import "tailwindcss"` and `@theme inline` — match the project's existing convention.
- Source Sans 3 import is already in `brand/colors_and_type.css`; we'll wire that file in Task 003.
- The `_v2-tokens` route name uses a leading underscore so Next.js treats it as ignorable if we want; in practice we'll delete it before merge.
