# Current task: Design Partner Page

> Context recovery. A session picking this up cold reads this file first, then
> `tasks/TASK-INDEX.md`, then `notes/implementation.md`, then `spec.md`.
>
> Last updated 2026-10-22.

## Quick Recovery
| Field | Value |
|-------|-------|
| **Task** | 031 - Pull request and preview verification |
| **Step** | 0 of 10 |
| **Status** | not-started |
| **Next Action** | Mark PR #124 ready for review so the Static Web Apps preview builds, then run the preview checks in task 031 |

## Where the project stands

- Branch `feat/design-partner-page` in the worktree
  `c:\code_files\spaarke-website-wt-design-partner-page`; draft PR #124.
- Tasks 001, 010, 011, 012, 020, 021, 022, 030 complete. Local results and
  the decisions made while building are in `notes/implementation.md`.
- What only the preview can prove: a real submission reaching the table and
  contactus@spaarke.com, the captcha failure path, the daily report with a
  row, and the Plausible events.

## Context a cold session needs

- The program is the Spaarke Design Partner Program. The overview carousel
  says "advisory group" and keeps it; `/advisory-group` redirects here.
- This repo is public. The carousel HTML lives in
  `C:\code_files\spaarke-research\linkedin-carousel\` and is never copied in.
- Notifications go to contactus@spaarke.com through `CONTACT_EMAIL_TO`.
- A fresh worktree needs `next-env.d.ts` and `node scripts/build-corpus-manifest.mjs`
  before `npm run typecheck` passes; `npm run build` generates both.
