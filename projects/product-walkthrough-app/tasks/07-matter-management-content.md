# T07 (P2.1) — Matter Management section content

**Phase**: 2
**Wave**: 2 (parallel with T08–T11)
**Dependencies**: T06 (P2.0) — per-section file structure

## Goal

Replace the two placeholder steps in
`src/content/tours/full-walkthrough/matter-management.ts` with the
final 3–5 steps that walk a prospective user through the Matter
Management capability: how active matters surface, how a matter is
opened, and what the matter detail experience looks like.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.3 (data model), §6
  (authoring workflow), §8 (assets / screenshot processing), §10
  (Phase 2 deliverable).
- `src/content/tours/full-walkthrough/matter-management.ts` — current
  state (two placeholder steps from Phase 1).
- `src/content/tours/types.ts`.

## Authoring loop (per spec §6)

This task is **not** one-shot. The author (you + Claude) iterate:

1. **You** drop a screenshot + a one-line description into chat — e.g.,
   "Active matters list, 1920×1200, callout on the New Matter button:
   'Create matters from any context.'"
2. **Claude** estimates the anchor coordinates from the image, writes
   or updates the step entry in `matter-management.ts`, and references
   the PNG path under
   `/public/tours/full-walkthrough/matter-management/`.
3. **You** preview at
   `/tour/full-walkthrough?section=matter-management&step=<n>&grid=1`
   — the grid overlay shows exactly where the anchor lands.
4. **You** ask for adjustments ("anchor 4% lower", "callout side flip
   to the left"). For dense screenshots, switch to `?author=1` and
   click on the target — coords print to console + clipboard.
5. **Claude** updates the config; re-preview.

Iteration is typically 1–2 rounds per step.

## Deliverables

### 1. Screenshots

The home page already uses curated Matter Management screenshots —
see `src/content/home/capabilities.ts` and the source PNGs at
`resources/screenshots/matter-management/` (e.g.
`my-workspace-light.png`, `daily-briefing-light.png`, `to-do-light.png`,
`quick-create-new-matters-light.png`). Reuse these where they fit;
recapture only if a tour-specific framing is needed.

Place final assets at `public/tours/full-walkthrough/matter-management/`:

- `step-1-active-matters.png`
- `step-2-...png`
- (3–5 total)

Asset rules per spec §8.1:
- Capture / source at ~2× rendered size (typically 2400px wide).
- Compress before committing — target ≤ 400 KB per PNG, or WebP
  ≤ 250 KB.
- Source captures and the per-section `_guide.md` live at
  `resources/walkthroughs/full-walkthrough/matter-management/`. The
  `_guide.md` is tracked; raw `.png`/`.jpg`/`.webp` source files are
  gitignored. Drop final processed assets into
  `public/tours/full-walkthrough/matter-management/`.

### 2. Step config in `matter-management.ts`

Replace the two placeholder steps with the final step list. Each
step's `id` is a kebab-case slug describing the screenshot
(`active-matters-list`, `matter-detail-overview`, etc.). Anchor
coordinates are normalized — see spec §4 — and refined through the
authoring loop above.

Recommended step coverage — pick 3–5 from the home page's Matter
Management feature list (see `capabilities.ts`):
1. Matter records — overview, calendar, contacts, billing, report card.
2. Personal workspaces — configurable user surface.
3. Daily briefings — AI-generated activity rollup.
4. Smart To Do — AI-monitored task list tied to underlying records.
5. AI quick create — natural-language input → structured matter record.

The order should narrate a coherent story (start broad, drill in,
end with an "AI accelerates this" moment), not just enumerate the
feature list.

### 3. Callout copy

Each callout has a `title` (short — 4–8 words) and `body` (1–2
sentences, ≤ 240 chars). Tone matches the rest of the marketing site
— see `src/content/home/capabilities.ts` for voice reference.

## Acceptance criteria

- `npm run typecheck` passes.
- Visiting
  `/tour/full-walkthrough?section=matter-management&step=1` through
  the last step renders each screenshot with its callout in the
  expected position (verify with `?grid=1`).
- All screenshots are committed and load (no broken-image icons).
- Each callout body fits comfortably inside the box at the default
  width (~28% of stage); long bodies use a wider `box.width`.
- No other files are modified outside the section file and the
  matter-management screenshot directory.

## Out of scope

- Other sections — those are T08–T11.
- Hotspots — Phase 3.
- Telemetry — Phase 4.
- Engine changes.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website-wt-walkthrough-app` (worktree).
> T06 (per-section file split) is complete.
>
> Read `projects/product-walkthrough-app/spec.md` §3.3, §6, §8, §10
> and `projects/product-walkthrough-app/tasks/07-matter-management-content.md`.
>
> Author the Matter Management section content per the iterative
> workflow in spec §6. The author will drop screenshots into chat —
> for each one, estimate the anchor coordinates, write or update the
> step in `src/content/tours/full-walkthrough/matter-management.ts`,
> and tell the author which preview URL to load. Refine through 1–2
> rounds of `?grid=1` adjustments per step.
>
> Final state: 3–5 steps, all screenshots in
> `public/tours/full-walkthrough/matter-management/`, typecheck clean.
> Do not modify other section files or the engine.
