# Current task: Services page first draft

> Context recovery. A session picking this up cold reads this file first.
> Last updated 2026-11-21.

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | 051 Counsel, finance and photo inputs |
| **Status** | Owner review (050) complete 2026-11-21; all ten decisions in `notes/review-notes.md`. Branch `feature/website-services-page` (worktree `c:\code_files\spaarke-website-wt-services-page`) is open as PR spaarke-dev/spaarke-website#179, not merged. Merging puts the page and its nav link live (noindex). |
| **Next Action** | Gather counsel review of the copy (function labels, boundary and fee language, FAQ, firm-view value and capital lines), finance-set calculator defaults, primary sources for the stats, and the exclusively licensed hero photo; then task 052 |

## Where things are

- Route: `src/app/services/page.tsx`; copy: `src/app/services/content.ts`
- Components: `src/components/services/`
- Calculator model tests: `npm run test:services`
- Open questions: `spec.md` Unresolved Questions and `design.md` section 13
