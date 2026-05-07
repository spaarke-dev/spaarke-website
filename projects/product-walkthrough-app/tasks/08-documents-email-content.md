# T08 (P2.2) — Documents & Email section content

**Phase**: 2
**Wave**: 2 (parallel with T07, T09–T11)
**Dependencies**: T06 (P2.0)

## Goal

Author 3–5 steps for the Documents & Email section in
`src/content/tours/full-walkthrough/documents-email.ts`. The section
demonstrates how documents and emails are captured, profiled, and
discoverable across matters.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.3, §6 (authoring
  workflow), §8 (assets).
- `src/content/tours/full-walkthrough/documents-email.ts` (stub from
  T06).
- `src/content/home/capabilities.ts` — the Documents & Email
  capability + features (document records, find similar, relationship
  graph, email capture, Office integration). Source screenshots live
  under `resources/screenshots/documents/`.

## Authoring loop

Follow spec §6: author drops screenshot + intent into chat, Claude
estimates anchor coords, writes the step entry, author previews at
`/tour/full-walkthrough?section=documents-email&step=<n>&grid=1` and
requests adjustments. 1–2 rounds per step.

## Deliverables

### 1. Screenshots

Reuse from `resources/screenshots/documents/` where they fit
(`document-record-partial-light.png`, `find-similar-light.png`,
`semantic-graph-light.png`, `outlook-save-to-spaarke-light.png`,
`word-save-to-spaarke-light.png`).

Place final assets at `public/tours/full-walkthrough/documents-email/`
with stable kebab-case names (e.g. `step-1-document-record.png`).
Asset rules per spec §8.1: ~2× rendered size, ≤ 400 KB per PNG / 250 KB
per WebP. Source captures + the per-section `_guide.md` live at
`resources/walkthroughs/full-walkthrough/documents-email/` — `_guide.md`
tracked; raw image files gitignored.

### 2. Step config in `documents-email.ts`

Recommended coverage — pick 3–5 from the home page's feature list:
1. Document records — AI-summarized profile, metadata, version
   history, matter linkage.
2. Find similar — semantic-search results across matters.
3. Relationship graph — visual map of related documents.
4. Email capture — save-to-Spaarke add-in inside Outlook.
5. Office integration — save-to-Spaarke from Word/Excel/PowerPoint.

Order suggestion: start with a single document's profile, expand to
"find similar", then graph; finish with the capture surfaces (Outlook
+ Office) so the loop closes back to "how things get into Spaarke."

### 3. Callout copy

Title: 4–8 words. Body: 1–2 sentences, ≤ 240 chars. Voice matches
`capabilities.ts` — "So knowledge is reusable, not buried." Keep
copy concrete (what the user sees) over abstract (architectural).

## Acceptance criteria

- `npm run typecheck` passes.
- Each step in
  `/tour/full-walkthrough?section=documents-email&step=<n>` renders
  its screenshot with the callout where the author expects (verify
  with `?grid=1`).
- All assets committed; no broken-image fallbacks.
- No files modified outside `documents-email.ts` and
  `public/tours/full-walkthrough/documents-email/`.

## Out of scope

- Other sections (T07, T09–T11).
- Hotspots — Phase 3.
- Telemetry, animation, completion CTA — Phase 4.
- Engine changes.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website-wt-walkthrough-app` (worktree).
> T06 (per-section file split) is complete.
>
> Read `projects/product-walkthrough-app/spec.md` §3.3, §6, §8 and
> `projects/product-walkthrough-app/tasks/08-documents-email-content.md`.
>
> Author the Documents & Email section content per the spec §6
> iterative loop. Source screenshots from
> `resources/screenshots/documents/` where appropriate; place final
> assets in `public/tours/full-walkthrough/documents-email/`. Update
> `src/content/tours/full-walkthrough/documents-email.ts` with 3–5
> steps. Verify each step's anchor with `?grid=1`.
>
> Do not modify other section files or the engine. Run
> `npm run typecheck` before reporting done.
