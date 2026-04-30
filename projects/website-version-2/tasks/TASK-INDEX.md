# Task Index — Spaarke Marketing Website (v2)

> **Total Tasks**: 24
> **Completed**: 0 / 24
> **In Progress**: 001
> **Current Phase**: 0 — Foundations

## All Tasks

| ID | Title | Phase | Status | Dependencies |
|----|-------|-------|--------|--------------|
| 001 | Create `v2` feature branch | 0 | in-progress | none |
| 002 | Add v2 CSS tokens and utility classes | 0 | not-started | 001 |
| 003 | Self-host Manrope, load Source Sans 3 | 0 | not-started | 001 |
| 004 | Migrate brand assets to `public/brand/` | 0 | not-started | 001 |
| 005 | Build shared v2 primitives (Shell, Button, Eyebrow) | 0 | not-started | 002, 003 |
| 010 | NotificationBar (dismissible, localStorage) | 1 | not-started | 005 |
| 011 | SiteHeader (sticky, dark, left/right groups) | 1 | not-started | 005 |
| 012 | Footer (dark, columns + legal line) | 1 | not-started | 005 |
| 013 | Wire global components into root layout | 1 | not-started | 010, 011, 012 |
| 020 | Hero (full-bleed glow + screenshot) | 2 | not-started | 013 |
| 021 | GapStats (two-column stats grid) | 2 | not-started | 013 |
| 022 | ModuleGrid (5 alternating rows + substrate) | 2 | not-started | 013 |
| 023 | PlatformDiagram (Spaarke ↔ Copilot) | 2 | not-started | 013 |
| 024 | Closing (mirrored spotlight CTA) | 2 | not-started | 013 |
| 025 | Compose home page at `/` | 2 | not-started | 020, 021, 022, 023, 024 |
| 026 | Hero screenshot prep (cleanup, optimization) | 2 | not-started | 004 |
| 030 | Page template pattern (shared layout for content pages) | 3 | not-started | 013 |
| 031 | Rename `/blog` → `/insights` + redirect; reskin index | 3 | not-started | 030 |
| 032 | Reskin Insights post page | 3 | not-started | 031 |
| 033 | Reskin `/contact` and `/access-request` (forms) | 3 | not-started | 030 |
| 034 | Reskin `/privacy`, `/terms`, `/signin` | 3 | not-started | 030 |
| 035 | v2-styled `/platform` stub | 3 | not-started | 030 |
| 036 | v2-styled `/why-spaarke` stub | 3 | not-started | 030 |
| 040 | Mobile breakpoint audit + fixes | 4 | not-started | 025, 031–036 |
| 041 | A11y + reduced-motion audit | 4 | not-started | 025, 031–036 |
| 042 | Image optimization (WebP/AVIF) | 4 | not-started | 025 |
| 043 | Lighthouse pass | 4 | not-started | 040, 041, 042 |
| 090 | Final QA on SWA preview URL | 5 | not-started | 043 |
| 091 | Merge `v2` → `main` and smoke test live | 5 | not-started | 090 |

## Phase Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 0 — Foundations | 001-005 | Branch, CSS tokens, fonts, brand assets, primitives |
| 1 — Global components | 010-013 | NotificationBar, SiteHeader, Footer, wire into layout |
| 2 — Home sections | 020-026 | Hero, GapStats, ModuleGrid, PlatformDiagram, Closing, compose home, screenshot prep |
| 3 — Reskin pages | 030-036 | Page template, insights, content pages, stubs |
| 4 — Polish | 040-043 | Mobile, a11y, image opt, Lighthouse |
| 5 — Cutover | 090-091 | Final QA, merge, smoke test live |

## Execution Order

**Sequential (must follow order):**
- 001 → 002, 003, 004 (Phase 0 sequence)
- 005 → Phase 1 → Phase 2 / Phase 3 → Phase 4 → Phase 5

**After Phase 1 (013) is done, Phases 2 and 3 can run in parallel:**
- Phase 2 (home sections)
- Phase 3 (reskin existing pages)

**Phase 4 polish requires Phases 2 + 3 mostly complete.**

## Notes

- This index is a forward-looking plan. Task files for Phase 0 are detailed; Phases 1–5 task files are stubs and will be expanded as we begin each phase, to keep specs from drifting.
- All work happens on the `v2` branch. Each task may produce one or more commits; PR opens once Phase 0 is done so SWA preview deploys begin generating.
