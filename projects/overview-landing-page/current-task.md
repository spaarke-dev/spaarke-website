# Current task: Design Partner Page

> Context recovery. A session picking this up cold reads this file first, then
> `tasks/TASK-INDEX.md`, then `spec.md`.
>
> Last updated 2026-10-22.

## Quick Recovery
| Field | Value |
|-------|-------|
| **Task** | 010 - Storage and notification functions |
| **Step** | 0 of 6 |
| **Status** | not-started |
| **Next Action** | Begin task 010 |

## Where the project stands

- Branch `feat/design-partner-page` in the worktree
  `c:\code_files\spaarke-website-wt-design-partner-page`; draft PR #124.
- Task 001 complete (2026-10-22): nine 1080 by 1350 slide PNGs (1.3 MB in
  total), `spaarke-overview.pdf` (nine pages, title "Spaarke Overview"), and
  `og.png` (1200 by 630: cover headline beside the decision card) in
  `public/design-partners/`.

## Decisions Made

- PNG kept, not WebP: the slides total 1.3 MB, under the 2 MB limit.
- The Open Graph image composes the cover's headline and decision card side
  by side, because a straight crop of a 4:5 slide to 1.9:1 cuts the headline.

## Context a cold session needs

- The program is the Spaarke Design Partner Program. The overview carousel
  says "advisory group" and keeps it; `/advisory-group` redirects here.
- This repo is public. The carousel HTML lives in
  `C:\code_files\spaarke-research\linkedin-carousel\` and is never copied in.
- Notifications go to contactus@spaarke.com through `CONTACT_EMAIL_TO`.
