# T10 (P2.4) — AI & Automation section content

**Phase**: 2
**Wave**: 2 (parallel with T07–T09, T11)
**Dependencies**: T06 (P2.0)

## Goal

Author 3–5 steps for the AI & Automation section in
`src/content/tours/full-walkthrough/ai-automation.ts`. The section
demonstrates AI summaries, Copilot-native experiences, and event-
driven playbooks running across the platform.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.3, §6 (authoring
  workflow), §8 (assets).
- `src/content/tours/full-walkthrough/ai-automation.ts` (stub from
  T06).
- `src/content/home/capabilities.ts` — AI & Automation capability +
  features (matter summaries, M365 Copilot, document profiles, Word
  Copilot, playbooks). Source screenshots in
  `resources/screenshots/ai-and-automation/`.

## Authoring loop

Follow spec §6: author drops screenshot + intent, Claude estimates
anchor coords and writes the step, author previews at
`/tour/full-walkthrough?section=ai-automation&step=<n>&grid=1` and
requests adjustments. 1–2 rounds per step.

## Deliverables

### 1. Screenshots

Reuse from `resources/screenshots/ai-and-automation/` where they fit
(`AI generated matter summaries-light.png`,
`M365-copilot-integration.png`, `document-summaries-light.png`,
`word-ai-copilot-light.png`, `ai-and-automation-playbooks-light.png`).

Note: source filenames have spaces and mixed case. Re-export to
stable kebab-case under `public/tours/full-walkthrough/ai-automation/`
(e.g. `step-1-matter-summary.png`). Asset rules per spec §8.1: ~2×
rendered size, ≤ 400 KB per PNG / 250 KB per WebP. Source captures +
the per-section `_guide.md` live at
`resources/walkthroughs/full-walkthrough/ai-automation/` — `_guide.md`
tracked; raw image files gitignored.

### 2. Step config in `ai-automation.ts`

Recommended coverage — pick 3–5 from the home page's feature list:
1. AI-generated matter summaries — status, recent activity,
   priorities.
2. M365 Copilot integration — Spaarke as a Copilot knowledge source.
3. Auto-created document profiles — AI summary, key terms, parties.
4. Word Copilot drafting — grounded in the matter's documents and
   precedents.
5. Playbooks — visual AI/automation workflows.

Order suggestion: open with the most-recognizable surface (matter
summary), expand to where Spaarke shows up (Copilot, Word), end on
the one feature that's distinctly Spaarke (playbooks).

### 3. Callout copy

Title: 4–8 words. Body: 1–2 sentences, ≤ 240 chars. Voice matches
`capabilities.ts` — "AI that runs across your legal operations—not
just drafting." Keep copy specific to AI's place in the workflow
(grounded, native, event-driven) rather than generic AI hype.

## Acceptance criteria

- `npm run typecheck` passes.
- Each step in
  `/tour/full-walkthrough?section=ai-automation&step=<n>` renders
  with the callout where the author expects (verify with `?grid=1`).
- All assets committed with kebab-case names; no broken-image
  fallbacks.
- No files modified outside `ai-automation.ts` and
  `public/tours/full-walkthrough/ai-automation/`.

## Out of scope

- Other sections (T07–T09, T11).
- Hotspots — Phase 3.
- Telemetry, animation, completion CTA — Phase 4.
- Engine changes.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website-wt-walkthrough-app` (worktree).
> T06 (per-section file split) is complete.
>
> Read `projects/product-walkthrough-app/spec.md` §3.3, §6, §8 and
> `projects/product-walkthrough-app/tasks/10-ai-automation-content.md`.
>
> Author the AI & Automation section content per the spec §6
> iterative loop. Source screenshots from
> `resources/screenshots/ai-and-automation/` where appropriate; re-
> export to kebab-case names under
> `public/tours/full-walkthrough/ai-automation/`. Update
> `src/content/tours/full-walkthrough/ai-automation.ts` with 3–5
> steps. Verify each step's anchor with `?grid=1`.
>
> Do not modify other section files or the engine. Run
> `npm run typecheck` before reporting done.
