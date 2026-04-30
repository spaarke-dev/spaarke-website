# Task Index — Spaarke Marketing Website (v2)

> **Total Tasks**: 35
> **Completed**: 1 / 35
> **Current Phase**: 0 — Foundations

## All Tasks

| ID | Title | Phase | Status | Dependencies |
|----|-------|-------|--------|--------------|
| 001 | Create `v2` feature branch | 0 | **done** | none |
| 002 | Add semantic design tokens (`@theme inline`) | 0 | not-started | 001 |
| 003 | Load Inter Tight + Inter + JetBrains Mono via `next/font/google` | 0 | not-started | 001 |
| 004 | Migrate brand assets to `public/brand/` | 0 | not-started | 001 |
| 005 | Build component primitives (Heading, Lede, Eyebrow, Shell, Slab, Button) | 0 | not-started | 002, 003 |
| 006 | Extract content to typed modules in `src/content/` | 0 | not-started | 005 |
| 010 | NotificationBar (dismissible, localStorage) | 1 | not-started | 005 |
| 011 | SiteHeader (left: nav; right: Contact us + Sign in) | 1 | not-started | 005 |
| 012 | Footer (dark, columns + Get access CTA panel) | 1 | not-started | 005 |
| 013 | Wire global components into root layout | 1 | not-started | 010, 011, 012 |
| 020 | Section 1 — Hero | 2 | not-started | 013, 027 |
| 021 | Section 2 — Gap stats (mockup version) | 2 | not-started | 013 |
| 022 | Section 4 — Capabilities + Microsoft foundation | 2 | not-started | 013, 028 |
| 023 | Section 5 — Legal Operations Intelligence diagram | 2 | not-started | 013, 004 |
| 024 | Section 6 — Closing CTA | 2 | not-started | 013 |
| 025 | Compose home page at `/` | 2 | not-started | 020-024, 027, 029 |
| 026 | Hero screenshot prep | 2 | not-started | 004 |
| 027 | Section 3 — Pillars (light slab) | 2 | not-started | 005, 006 |
| 028 | Capability screenshots prep | 2 | not-started | 004 |
| 029 | Watch demo modal | 2 | not-started | 005 |
| 030 | Page template pattern for content pages | 3 | not-started | 013 |
| 031 | Rename `/blog` → `/insights` + redirect; reskin index | 3 | not-started | 030 |
| 032 | Reskin Insights post page | 3 | not-started | 031 |
| 033 | Reskin `/contact` and `/access-request` (forms) | 3 | not-started | 030 |
| 034 | Reskin `/privacy`, `/terms`, `/signin` | 3 | not-started | 030 |
| 035 | v2-styled `/platform` stub | 3 | not-started | 030 |
| 036 | v2-styled `/why-spaarke` stub | 3 | not-started | 030 |
| 037 | Error + 404 pages styled with v2 system | 3 | not-started | 030 |
| 040 | Mobile breakpoint audit + fixes | 4 | not-started | 025, 031–037 |
| 041 | A11y + reduced-motion audit | 4 | not-started | 025, 031–037 |
| 042 | Image optimization (WebP/AVIF) | 4 | not-started | 025 |
| 043 | Lighthouse pass | 4 | not-started | 040, 041, 042 |
| 044 | OG images + JSON-LD | 4 | not-started | 025, 031, 032 |
| 090 | Final QA on SWA preview URL | 5 | not-started | 043, 044 |
| 091 | Merge `v2` → `main` and smoke test live | 5 | not-started | 090 |

## Render order (for compose home, Task 025)

The home page renders sections in this order — note this differs from task ID order because Pillars (027) was added after the rest of Phase 2 was scaffolded:

```
SiteHeader (Task 011) — global
  ↓
Section 1 Hero (Task 020)
Section 2 Gap (Task 021)
Section 3 Pillars (Task 027) ← inserted between Gap and Capabilities
Section 4 Capabilities + Microsoft foundation (Task 022)
Section 5 LOI diagram (Task 023)
Section 6 Closing (Task 024)
  ↓
Footer (Task 012) — global
```

The Watch demo modal (Task 029) is mounted globally and triggered from the hero's "Watch demo" CTA.

## Phase Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 0 — Foundations | 001-006 | Branch, tokens, fonts, brand assets, primitives, content modules |
| 1 — Global components | 010-013 | NotificationBar, SiteHeader, Footer, wire into layout |
| 2 — Home sections | 020-029 | Six sections, demo modal, asset prep, compose |
| 3 — Reskin pages | 030-037 | Page template, insights, content pages, stubs, error/404 |
| 4 — Polish | 040-044 | Mobile, a11y, image opt, Lighthouse, OG/JSON-LD |
| 5 — Cutover | 090-091 | Final QA, merge, smoke test live |

## Execution Order

**Sequential (must follow order):**
- 001 → 002, 003, 004 (Phase 0 sequence) → 005 → 006

**After Phase 0 (006), Phase 1 starts:**
- 010, 011, 012 in parallel → 013 wires them in

**After Phase 1 (013), Phases 2 and 3 can run in parallel:**
- Phase 2 (home sections) — section components, asset prep, demo modal can run in parallel; 025 (compose) is the gate
- Phase 3 (reskin pages) — 030 (page template) gates the rest; 031-037 in parallel after 030

**Phase 4 polish requires Phases 2 + 3 substantially complete.**

**Phase 5 (cutover) is final.**

## Notes

- Detailed task files exist for Phase 0 (001-006). Phases 1-5 are stub task files — full details added when each phase begins, so specs don't drift before we get there.
- All work happens on the `v2` branch. PR #2 is the cutover vehicle; opens preview deploys via SWA.
