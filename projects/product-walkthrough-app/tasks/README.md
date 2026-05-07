# Product Walkthrough App — Tasks

Phase 1 tasks ready to execute. Each task is **self-contained**: read
the task file plus the spec section it references, and you can run
without holding the rest of the project in head. Tasks meant for
parallel execution touch disjoint files.

The full architecture is in [`../spec.md`](../spec.md). Tasks reference
spec sections by number (e.g., "spec §5.1") rather than restating
content.

---

## Phase 1 — Engine + proof

Deliverable: visiting `/tour` renders the engine with sample Matter
Management content; ←/→ advance; `?grid=1` shows the coordinate grid.

### Dependency graph

```
T01 Foundation (types + route skeleton + registry)
 │
 ├── T02a Callout                ┐
 ├── T02b StepNav                │
 ├── T02c CoordinateGrid         ├── all parallel after T01
 ├── T02d TourHeader             │
 ├── T02e Sample tour content    ┘
 │
 ├── T03 TourStage               (depends on T02a + T02c)
 │
 ├── T04 TourShell + page wire-up (depends on T02b + T02d + T03)
 │
 └── T05 Phase 1 acceptance       (depends on T04)
```

### Parallelization plan

- **Wave 1** (sequential): T01.
- **Wave 2** (parallel, 5 agents): T02a, T02b, T02c, T02d, T02e.
- **Wave 3** (1 agent): T03.
- **Wave 4** (1 agent): T04.
- **Wave 5** (1 agent): T05 — verifies typecheck, dev server, screenshots
  the running engine.

To run a wave, spawn the listed task files as parallel `Agent` tool
calls in a single message. Each agent's prompt is the **Prompt** block
inside its task file — paste it verbatim.

### File touch matrix (verifies no parallel-write conflicts)

| Task | Creates | Modifies |
|---|---|---|
| T01 | `src/content/tours/types.ts`, `src/content/tours/registry.ts`, `src/app/tour/[slug]/page.tsx` (skeleton) | — |
| T02a | `src/components/tour/Callout.tsx`, `src/components/tour/geometry.ts` | — |
| T02b | `src/components/tour/StepNav.tsx` | — |
| T02c | `src/components/tour/CoordinateGrid.tsx` | — |
| T02d | `src/components/tour/TourHeader.tsx` | — |
| T02e | `src/content/tours/full-walkthrough.ts`, placeholder PNGs in `public/tours/full-walkthrough/matter-management/` | `src/content/tours/registry.ts` (single-line append) |
| T03 | `src/components/tour/TourStage.tsx` | — |
| T04 | `src/components/tour/TourShell.tsx` | `src/app/tour/[slug]/page.tsx` (replace skeleton with real renderer) |
| T05 | — | optional polish/fix on any of the above |

T02e's modify of `registry.ts` is the only parallel-write risk. T01 lays
down `registry.ts` with a clear `// TOURS` insertion marker that T02e
appends below — see T02e prompt for the exact instruction.

---

## Phase 2 — Full Walkthrough content

Deliverable: all 5 capability sections × 3–5 steps each, with real
screenshots and refined callout positioning. No engine changes.

### Dependency graph

```
T06 P2.0 — Per-section file split (refactor full-walkthrough.ts)
 │
 ├── T07 P2.1 Matter Management content        ┐
 ├── T08 P2.2 Documents & Email content        │
 ├── T09 P2.3 Collaboration content            ├── all parallel after T06
 ├── T10 P2.4 AI & Automation content          │
 └── T11 P2.5 Spend & Performance content      ┘
```

### Parallelization plan

- **Wave 1** (sequential): T06 — splits `full-walkthrough.ts` into
  per-section files so the content tasks touch disjoint files.
- **Wave 2** (parallel, 5 sessions): T07–T11. Each is an authoring
  session per spec §6: the user drops screenshots into chat, Claude
  estimates anchor coords, the user previews with `?grid=1` and
  iterates. These tasks are not one-shot — they pause for the user
  between rounds.

### File touch matrix

| Task | Creates | Modifies |
|---|---|---|
| T06 | `src/content/tours/full-walkthrough/<id>.ts` × 5 (matter-management migrated; rest stubs) | `src/content/tours/full-walkthrough.ts` (replace inline content with imports) |
| T07 | `public/tours/full-walkthrough/matter-management/*.png` (3–5) | `src/content/tours/full-walkthrough/matter-management.ts` |
| T08 | `public/tours/full-walkthrough/documents-email/*.png` (3–5) | `src/content/tours/full-walkthrough/documents-email.ts` |
| T09 | `public/tours/full-walkthrough/collaboration/*.png` (3–5) | `src/content/tours/full-walkthrough/collaboration.ts` |
| T10 | `public/tours/full-walkthrough/ai-automation/*.png` (3–5) | `src/content/tours/full-walkthrough/ai-automation.ts` |
| T11 | `public/tours/full-walkthrough/spend-performance/*.png` (3–5) | `src/content/tours/full-walkthrough/spend-performance.ts` |

T07–T11 each touch their own section file and their own asset
directory — zero parallel-write risk after T06 completes.

---

## Phase 3+ tasks (deferred)

Outlined in spec §10. Will be written as task files **after** Phase 2
acceptance:

- **P3.1**: `<HotspotLayer>` + `Hotspot` types end-to-end.
- **P3.2**: wire one example hotspot.
- **P4.1**: `<FeatureHighlights>` tour content.
- **P4.2**: author mode (`?author=1`) click-to-print coordinates.
- **P4.3**: telemetry events.
- **P4.4**: visual polish + tour-completion CTA.
- **P4.5**: route the home Take Tour modal to `/tour` (decision in
  spec §11).
