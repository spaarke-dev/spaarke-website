# T11 (P2.5) — Spend & Performance section content

**Phase**: 2
**Wave**: 2 (parallel with T07–T10)
**Dependencies**: T06 (P2.0)

## Goal

Author 3–5 steps for the Spend & Performance section in
`src/content/tours/full-walkthrough/spend-performance.ts`. The section
demonstrates the financial and operational view: invoices, budgets,
OCG compliance, outcomes, and the dashboards built on top.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.3, §6 (authoring
  workflow), §8 (assets).
- `src/content/tours/full-walkthrough/spend-performance.ts` (stub
  from T06).
- `src/content/home/capabilities.ts` — Spend & Performance capability
  + features (counsel metrics, matter report cards, billing roll-up,
  budget tracking, Power BI). Source screenshots in
  `resources/screenshots/spend-and-performance/`.

## Authoring loop

Follow spec §6: author drops screenshot + intent, Claude estimates
anchor coords and writes the step, author previews at
`/tour/full-walkthrough?section=spend-performance&step=<n>&grid=1`
and requests adjustments. 1–2 rounds per step.

## Deliverables

### 1. Screenshots

Reuse from `resources/screenshots/spend-and-performance/` where they
fit (`Outside-counsel-report-card-light.png`,
`financial-performance-metrics-light.png`,
`billing-summary-light.png`, `budget-tracking-light.png`,
`powerbi-dashboards-light.png`).

Note: source filenames are mixed case. Re-export to stable kebab-case
under `public/tours/full-walkthrough/spend-performance/` (e.g.
`step-1-counsel-report-card.png`). Asset rules per spec §8.1: ~2×
rendered size, ≤ 400 KB per PNG / 250 KB per WebP. Source captures +
the per-section `_guide.md` live at
`resources/walkthroughs/full-walkthrough/spend-performance/` —
`_guide.md` tracked; raw image files gitignored.

### 2. Step config in `spend-performance.ts`

Recommended coverage — pick 3–5 from the home page's feature list:
1. Outside counsel report card — performance grades for cost,
   timeliness, OCG compliance.
2. Matter report cards — single scorecard combining budget, spend,
   performance, risk.
3. Billing roll-up — invoices rolled up to matter, project, counsel.
4. Budget setup and tracking — actual vs forecast, overage alerts.
5. Power BI dashboards — cross-matter analytics built on Spaarke
   data.

Order suggestion: start with one specific scorecard (counsel report
card), zoom out to matter-level (matter report card), drill into
the underlying numbers (billing, budgets), end with the cross-matter
analytical view (Power BI).

### 3. Callout copy

Title: 4–8 words. Body: 1–2 sentences, ≤ 240 chars. Voice matches
`capabilities.ts` — "Comprehensive insights to every matter, every
firm." Lean on the financial-truth angle (alerts, grades, roll-ups)
rather than abstract analytics language.

## Acceptance criteria

- `npm run typecheck` passes.
- Each step in
  `/tour/full-walkthrough?section=spend-performance&step=<n>`
  renders with the callout where the author expects (verify with
  `?grid=1`).
- All assets committed with kebab-case names; no broken-image
  fallbacks.
- No files modified outside `spend-performance.ts` and
  `public/tours/full-walkthrough/spend-performance/`.

## Out of scope

- Other sections (T07–T10).
- Hotspots — Phase 3.
- Telemetry, animation, completion CTA — Phase 4.
- Engine changes.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website-wt-walkthrough-app` (worktree).
> T06 (per-section file split) is complete.
>
> Read `projects/product-walkthrough-app/spec.md` §3.3, §6, §8 and
> `projects/product-walkthrough-app/tasks/11-spend-performance-content.md`.
>
> Author the Spend & Performance section content per the spec §6
> iterative loop. Source screenshots from
> `resources/screenshots/spend-and-performance/` where appropriate;
> re-export to kebab-case names under
> `public/tours/full-walkthrough/spend-performance/`. Update
> `src/content/tours/full-walkthrough/spend-performance.ts` with 3–5
> steps. Verify each step's anchor with `?grid=1`.
>
> Do not modify other section files or the engine. Run
> `npm run typecheck` before reporting done.
