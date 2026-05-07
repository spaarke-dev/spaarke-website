# Website Analytics Platform — Tasks

Phase 0 ships the install + baseline. After this is live and
we've gathered 2–3 weeks of data, the first monthly readout (Phase 1)
calibrates event list and readout shape based on what we actually
want to see.

The full architecture is in [`../spec.md`](../spec.md). Tasks reference
spec sections by number.

---

## Phase 0 — Install + baseline

Deliverable: Plausible + Clarity live, custom events firing,
first-touch attribution capturing, AI traffic broken out, privacy
policy updated, readout templates in place.

### Dependency graph

```
T01 [Foundation]
  ├── Plausible script in RootLayout
  ├── Clarity script in RootLayout
  ├── src/lib/analytics.ts (typed event helper)
  ├── src/components/analytics/AttributionBootstrap.tsx
  └── src/lib/attribution.ts (read API)
 │
 ├── T02 [Form integration + attribution persistence]
 │     - Form components read attribution
 │     - API endpoints accept + persist attribution
 │     - Plausible "* Submit" events on success
 │
 ├── T03 [Custom events]
 │     - Tour, CTA, Article Read events
 │     - Outbound link tracking
 │
 ├── T04 [AI traffic detection]
 │     - middleware.ts AI bot detection
 │     - src/content/analytics/ai-sources.ts
 │     - "AI Source Visit" event
 │
 ├── T05 [Privacy policy update]
 │
 └── T06 [Readout templates + monitoring scaffolding]

T07 [Phase 0 acceptance] — after T01-T06
```

### Parallelization plan

- **Wave 1** (sequential): **T01**. Foundation — must complete before
  any analytics call sites exist.
- **Wave 2** (sequential after T01): **T02**. Touches form components
  + API routes; locks down the attribution payload shape that T03's
  events will reference.
- **Wave 3** (parallel): **T03**, **T04**, **T06**. T03 adds events
  to non-form components; T04 adds middleware + AI source list; T06
  is doc-only.
- **Wave 4** (sequential): **T05**. Privacy policy reflects
  everything T01-T04 did.
- **Wave 5** (sequential): **T07**. Acceptance.

### File touch matrix

| Task | Creates | Modifies |
|---|---|---|
| T01 | `src/lib/analytics.ts`, `src/lib/attribution.ts`, `src/components/analytics/PlausibleScript.tsx`, `src/components/analytics/ClarityScript.tsx`, `src/components/analytics/AttributionBootstrap.tsx`, `src/types/plausible.d.ts` | `src/app/layout.tsx`, `.env.example`, `next.config.ts` (if needed for env validation) |
| T02 | — | `src/components/TakeTourCTAs.tsx`, `src/components/PlatformHeroCTAs.tsx`, `src/components/ContactForm.tsx`, `src/components/DemoRequestForm.tsx`, `src/app/api/early-release/route.ts`, `src/app/api/contact/route.ts`, `src/app/api/registration/demo-request/route.ts` |
| T03 | (none — adds calls inside existing components) | `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, `src/components/tour/TourShell.tsx` (if exists), components rendering external links to LinkedIn |
| T04 | `middleware.ts`, `src/content/analytics/ai-sources.ts`, `src/lib/ai-bots.ts` | `src/lib/logger.ts` (extend with `trackAiCrawler`) |
| T05 | — | `src/app/privacy/page.tsx` |
| T06 | `projects/website-analytics-platform/readouts/weekly-template.md`, `monthly-template.md`, `quarterly-template.md`, `monitoring/ai-citation-prompts.md` | — |
| T07 | — | flag/fix issues found across T01–T06 |

T03's modifications are scattered across components but each touch
is a single one-line `track()` call. Low conflict risk. T03 and T04
don't overlap files at all — safe to parallelize.

---

## Phase 1+ tasks (deferred)

Outlined in spec §9. Will be written as task files **after** Phase 0
yields 2–3 weeks of data:

- **P1.1**: First monthly readout — calibrate event list, refine
  readout templates, identify dashboard gaps.
- **P2.1**: AI citation monitoring (Profound / Athena evaluation OR
  DIY API script).
- **P2.2**: PostHog evaluation if tour engagement justifies funnel
  analytics.
- **P3.1**: Internal `/internal/analytics` dashboard (auth-gated,
  Plausible API + App Insights summary in one view).
- **P3.2**: Automated monthly-readout generator script.
