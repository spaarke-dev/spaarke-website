# Task 090: Project wrap-up

**Phase:** 5 (Health)
**Status:** in-progress (written up; waits on Ralph's final checks)
**Estimated:** 3 hours
**Dependencies:** all
**Tags:** testing, accessibility, performance

## Goal

Every phase 2 success criterion is verified and written up, and the project is ready for Ralph's final checks.

## Steps

1. Verify each success criterion in `spec.md` and record how in `notes/verification.md`, counts only.
2. Rerun the phase 1 privacy search over the files this project changed and over the private outreach files' values.
3. axe at 375 px and 1280 px on the campaign page (codes, brief, links, steps), the import page and the contacts page; Lighthouse on `/brief/<key>` with a test brief.
4. `npm run market:check` against Azurite, all passing.
5. Write lessons in `notes/lessons.md`.
6. List Ralph's final checks: one real campaign from `/admin`, a test meeting in each calendar, the first live step run.
7. Only after Ralph has done them: mark the README Complete, tick the plan's milestones, and delete `current-task.md`.

## Expected outputs

- `projects/market-access-phase-2/notes/verification.md`
- `projects/market-access-phase-2/notes/lessons.md`

## Acceptance criteria

- [x] Every success criterion has a status and a method.
- [x] No contact data, codes, keys or brief text in the repo.
- [ ] The project stays open until Ralph has done his final checks.

## As built

- `notes/verification.md`: each of the 7 success criteria with its status, method and what is left for Ralph; the privacy searches (counts only); axe per page from the task browser tests; Ralph's final checks in order.
- Privacy: the pattern search over the 91 files phase 2 changed found only made-up fixtures; the private-value search over 1,641 tracked files found no address, key, code or phone number, and one name in a research note from 2026-09 that phase 2 did not add.
- `npm run market:check`: 84 pass with fresh tables on this branch.
- Lighthouse on `/brief/<key>` needs a live brief, so it moves to after deploy.
- `notes/lessons.md` written.
- Step 7 (README Complete, milestones, deleting `current-task.md`) waits on Ralph's final checks.
