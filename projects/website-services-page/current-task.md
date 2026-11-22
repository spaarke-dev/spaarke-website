# Current task: Services page first draft

> Context recovery. A session picking this up cold reads this file first.
> Last updated 2026-11-22.

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | 050 Owner review, section by section (rounds 2 to 5 applied), then 051 Counsel, finance and photo inputs |
| **Status** | Review rounds 1 to 5 applied 2026-11-21; every round is recorded in `notes/review-notes.md`. Branch `feature/website-services-page` is open as PR spaarke-dev/spaarke-website#179, not merged, last commit 9622720. Merging puts the page and its nav link live (noindex). |
| **Next Action** | Take the owner's next round of feedback, if any. Then gather counsel review of the copy (MSO and MLO definitions, including "enable non-lawyer ownership"; function labels; boundary and fee language; FAQ; firm-view value and capital lines), finance-set calculator defaults, primary sources for the stats, and the licensed hero video and still; then task 052 |

## Where things are

- Route: `src/app/services/page.tsx`; copy: `src/app/services/content.ts`
- Components: `src/components/services/` (calculator in `calculator/`, the stacked-column chart is `StackedShift.tsx`, phases are `Phases.tsx`)
- Calculator model tests: `npm run test:services` (18 tests)
- Open questions: `spec.md` Unresolved Questions and `design.md` section 13

## Picking this up on another machine

```
git fetch origin --prune
git checkout feature/website-services-page
npm install
npm run dev
```

Open `/services`, and `/services?audience=corporate` for the legal department view.

The hero video clips are unlicensed Stocksy comps (5947230 and 5947223). They are gitignored and never committed, because the repo is public. Without them the hero shows the interim photo. To see the video locally, copy the comps from the original handoff folder into `public/services/hero-comp-1.mp4` and `public/services/hero-comp-2.mp4`.
