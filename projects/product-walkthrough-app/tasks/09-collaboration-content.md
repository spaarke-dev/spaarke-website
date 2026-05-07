# T09 (P2.3) — Collaboration section content

**Phase**: 2
**Wave**: 2 (parallel with T07, T08, T10, T11)
**Dependencies**: T06 (P2.0)

## Goal

Author 3–5 steps for the Collaboration section in
`src/content/tours/full-walkthrough/collaboration.ts`. The section
demonstrates how internal teams, business clients, and outside counsel
work the same matter from one secure space.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.3, §6 (authoring
  workflow), §8 (assets).
- `src/content/tours/full-walkthrough/collaboration.ts` (stub from
  T06).
- `src/content/home/capabilities.ts` — Collaboration capability +
  features (secure workspaces, outside counsel access, Word
  co-creation, shared matters, Teams app). Source screenshots in
  `resources/screenshots/collaboration/`.

## Authoring loop

Follow spec §6: author drops screenshot + intent, Claude estimates
anchor coords and writes the step, author previews at
`/tour/full-walkthrough?section=collaboration&step=<n>&grid=1` and
requests adjustments. 1–2 rounds per step.

## Deliverables

### 1. Screenshots

Reuse from `resources/screenshots/collaboration/` where they fit
(`secure-project-workspace-light.png`,
`outside-counsel-access-light.png`, `word-co-creation-light.png`,
`share-matters-light.png`, `teams-spaarke-app.png`).

Place final assets at `public/tours/full-walkthrough/collaboration/`
with stable kebab-case names. Asset rules per spec §8.1: ~2×
rendered size, ≤ 400 KB per PNG / 250 KB per WebP. Source captures +
the per-section `_guide.md` live at
`resources/walkthroughs/full-walkthrough/collaboration/` — `_guide.md`
tracked; raw image files gitignored.

### 2. Step config in `collaboration.ts`

Recommended coverage — pick 3–5 from the home page's feature list:
1. Secure project workspaces — invite-only, role-aware spaces tied
   to matters.
2. Outside counsel access — external workspace exposing only what
   counsel needs.
3. Word co-creation — multiple authors editing in place, anchored
   to a matter.
4. Shared matters and projects — privilege-preserving sharing
   controls.
5. Teams app — Spaarke surfaces inside Microsoft Teams.

Order suggestion: open with a workspace overview, narrow into one
external-facing scenario (outside counsel), show in-Office
collaboration (Word), then close on the daily-flow surface (Teams).

### 3. Callout copy

Title: 4–8 words. Body: 1–2 sentences, ≤ 240 chars. Voice matches
`capabilities.ts` — "So everyone works from the same context." Keep
copy specific (privilege preserved, role-aware, etc.) over generic
("collaboration tools").

## Acceptance criteria

- `npm run typecheck` passes.
- Each step in
  `/tour/full-walkthrough?section=collaboration&step=<n>` renders
  with the callout where the author expects (verify with `?grid=1`).
- All assets committed; no broken-image fallbacks.
- No files modified outside `collaboration.ts` and
  `public/tours/full-walkthrough/collaboration/`.

## Out of scope

- Other sections (T07, T08, T10, T11).
- Hotspots — Phase 3.
- Telemetry, animation, completion CTA — Phase 4.
- Engine changes.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website-wt-walkthrough-app` (worktree).
> T06 (per-section file split) is complete.
>
> Read `projects/product-walkthrough-app/spec.md` §3.3, §6, §8 and
> `projects/product-walkthrough-app/tasks/09-collaboration-content.md`.
>
> Author the Collaboration section content per the spec §6 iterative
> loop. Source screenshots from `resources/screenshots/collaboration/`
> where appropriate; place final assets in
> `public/tours/full-walkthrough/collaboration/`. Update
> `src/content/tours/full-walkthrough/collaboration.ts` with 3–5
> steps. Verify each step's anchor with `?grid=1`.
>
> Do not modify other section files or the engine. Run
> `npm run typecheck` before reporting done.
