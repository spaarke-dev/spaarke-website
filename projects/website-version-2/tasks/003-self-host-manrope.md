# Task 003: Self-host Manrope, load Source Sans 3

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 45 minutes
**Dependencies:** 001
**Tags:** fonts, performance, next-font

## Goal

Make Manrope (display) and Source Sans 3 (body) available across the site with `font-display: swap`, optimized for first-paint.

## Context

Handoff calls for Manrope as the primary display face (with Source Sans 3 fallback) and Source Sans 3 as the body face. The Manrope variable TTF lives at [design_handoff_spaarke_website_v2/brand/fonts/Manrope-VariableFont_wght.ttf](../design_handoff_spaarke_website_v2/brand/fonts/Manrope-VariableFont_wght.ttf). Source Sans 3 is loaded from Google Fonts in the handoff CSS.

Next.js 16 has `next/font` which handles self-hosting + subsetting + `font-display`. Use it for both fonts — even though Source Sans 3 is "from Google Fonts," `next/font/google` self-hosts it at build time, which is faster than a runtime Google request.

## Steps

1. Copy the Manrope variable font into the project: `public/brand/fonts/Manrope-VariableFont_wght.ttf` (or `src/app/fonts/` per Next.js convention — pick the one that matches the project's existing pattern; check whether any existing fonts are loaded).
2. In [src/app/layout.tsx](../../../src/app/layout.tsx):
   - Import `localFont` from `next/font/local` for Manrope, pointing at the TTF, declaring weights 400/500/600/700, with `display: 'swap'`, `variable: '--font-manrope'`.
   - Import Source Sans 3 from `next/font/google` with weights 300/400/500/600/700, italic + non-italic, `display: 'swap'`, `variable: '--font-source-sans'`.
   - Apply both `variable` class names to the `<html>` element so the variables propagate.
3. In `src/app/globals.css`, update the `--v2-display` and `--v2-body` token values to reference the Next.js font CSS variables:
   - `--v2-display: var(--font-manrope), 'Source Sans 3', system-ui, sans-serif;`
   - `--v2-body: var(--font-source-sans), system-ui, sans-serif;`
4. Test in dev server: open the `_v2-tokens` page from Task 002; type should render in Manrope (display) and Source Sans 3 (body).
5. Verify the network tab shows the fonts loading from same-origin (not Google) for both.
6. Commit: `feat(v2): self-host Manrope and Source Sans 3 via next/font`.
7. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- Manrope variable TTF in the project
- Updated `src/app/layout.tsx` loading both fonts via `next/font`
- Updated `--v2-display` and `--v2-body` tokens in `globals.css`

## Acceptance Criteria

- [ ] Both fonts load from same-origin (not Google CDN)
- [ ] Manrope renders for display utility classes
- [ ] Source Sans 3 renders for body
- [ ] No FOIT/FOUT — `font-display: swap` honored
- [ ] No console errors about font preload

## Notes

- `next/font/google` self-hosts at build time despite the name. This is the recommended Next.js pattern.
- Don't load fonts via `<link>` tags or `@import` — `next/font` handles preload/optimization automatically.
- Manrope variable font supports a wide weight range; we only declare the four we use.
