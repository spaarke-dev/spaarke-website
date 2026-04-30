# Task 003: Load fonts via `next/font/google`

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 001
**Tags:** fonts, performance, next-font

## Goal

Load **Inter Tight** (display), **Inter** (body), and **JetBrains Mono** (eyebrows/captions) via `next/font/google` — self-hosted at build time, with `font-display: swap`, subsetting, and preload all handled by Next.js.

## Context

The mockup uses Inter Tight + Inter as its display + body pair (matching the prototype's `v2.css`). These are robust, broadly-supported, available via Google Fonts. `next/font/google` self-hosts them at build time, so production has zero runtime dependency on Google's CDN.

We prefer Inter over Manrope (the brand kit's display face) for v2 because:
- It matches the actual mockup the designer reviewed
- Variable Inter offers similar weight flexibility
- Simpler loader (no local TTF asset to manage)

## Steps

1. Open [src/app/layout.tsx](../../../src/app/layout.tsx).
2. Import three fonts from `next/font/google`:
   ```ts
   import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";

   const interTight = Inter_Tight({
     subsets: ["latin"],
     weight: ["400", "500", "600"],
     display: "swap",
     variable: "--font-display",
   });

   const inter = Inter({
     subsets: ["latin"],
     weight: ["400", "500"],
     display: "swap",
     variable: "--font-body",
   });

   const jetbrainsMono = JetBrains_Mono({
     subsets: ["latin"],
     weight: ["400", "500"],
     display: "swap",
     variable: "--font-mono",
   });
   ```
3. Apply all three `variable` class names to the `<html>` element (or `<body>`) so the CSS variables propagate.
4. In `src/app/globals.css`, ensure the font tokens declared in Task 002 reference the Next.js font CSS variables:
   - `--font-display: var(--font-display), system-ui, -apple-system, sans-serif;`
   - `--font-body: var(--font-body), system-ui, -apple-system, sans-serif;`
   - (The `next/font/google` loader sets these CSS variables; our token aliases them with system fallbacks.)
5. In dev server, open the `_v2-tokens` page from Task 002 and verify the fonts load from same-origin (Network tab — no Google CDN requests).
6. Run `npm run build` — confirm no regressions; bundle size includes the font files (a few KB per face after subsetting).
7. Commit: `feat(v2): load Inter Tight + Inter + JetBrains Mono via next/font/google`.
8. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- Updated `src/app/layout.tsx` loading three fonts
- `globals.css` font tokens wired to Next.js variable names

## Acceptance Criteria

- [ ] All three fonts load from same-origin (not Google CDN) in production
- [ ] Inter Tight renders for display utility classes
- [ ] Inter renders for body
- [ ] JetBrains Mono renders for eyebrow/caption styles
- [ ] No FOIT/FOUT — `font-display: swap` honored
- [ ] No console errors about font preload

## Notes

- `next/font/google` self-hosts at build time despite the name. This is the recommended Next.js pattern.
- Don't load fonts via `<link>` tags or `@import` — `next/font` handles preload/optimization automatically.
- Manrope (from the brand kit `colors_and_type.css`) is intentionally NOT loaded for v2. If a future page needs it, add a separate loader.
