# Current task: Services page first draft

> Context recovery. A session picking this up cold reads this file first.
> Last updated 2026-11-22 (task 071).

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | 050 Owner review, section by section (rounds 2 to 5 applied), then 051 Counsel, finance and photo inputs |
| **Status** | Review rounds 1 to 5 applied 2026-11-21; the MSO value estimate replaced both calculators 2026-11-22 (task 070 for law firms, task 071 for legal departments), with its details at `/services/estimate` (a modal from /services; `?audience=corporate` for departments). Every change is recorded in `notes/review-notes.md`. Branch `feature/website-services-page` is open as PR spaarke-dev/spaarke-website#179, not merged. Merging puts the page and its nav link live (noindex). |
| **Next Action** | Take the owner's next round of feedback, if any. Then gather counsel review of the copy (the equity figures in the MSO value estimate; MSO and MLO definitions, including "enable non-lawyer ownership"; function labels; boundary and fee language; FAQ; firm-view value and capital lines), finance-set estimate assumptions (both models), primary sources for the stats, and the licensed hero video and still; then task 052 |

## Where things are

- Route: `src/app/services/page.tsx`; copy: `src/app/services/content.ts`
- Components: `src/components/services/` (both estimates in `estimate/`; the retired round 5 calculator in `calculator/`, the stacked-column chart is `StackedShift.tsx`, phases are `Phases.tsx`)
- Calculator model tests: `npm run test:services` (31 tests)
- Open questions: `spec.md` Unresolved Questions and `design.md` section 13

## Picking this up on another machine

```
git fetch origin --prune
git checkout feature/website-services-page
npm install
npm run dev
```

Open `/services`, and `/services?audience=corporate` for the legal department view.

The hero video clips are unlicensed Stocksy comps (5947230 and 5947223), cleared for development use only. They are gitignored and never committed, because the repo is public. Without them the hero shows the interim photo. They are kept in the Spaarke OneDrive at `marketing/creative/website/services-hero-comps/`, already renamed. To show the video locally, copy them into the repo from the repo root:

```
Copy-Item "$env:OneDriveCommercial\marketing\creative\website\services-hero-comps\hero-comp-*.mp4" public\services\
```

The comps are 1280 x 720 and watermarked. License each clip at 1080p (1920 x 1080) before launch; 4K is not needed for a background video under a dark wash.
