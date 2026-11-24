# Task 090: Project wrap-up

**Phase:** Wrap-up
**Status:** in progress; the project stays open for Ralph's final checks
**Estimated:** 2 hours
**Dependencies:** all other tasks
**Tags:** testing, accessibility, performance

## Goal

Every spec success criterion is verified and recorded, and the project is marked complete.

## Steps

1. Verify each success criterion in `spec.md` and record how in `notes/verification.md`.
2. Run the repo privacy check: grep the tree for email addresses other than published ones, recipient codes, brief keys, GUIDs and secrets.
3. Lighthouse on a public page touched by the writers (no regression) and an accessibility pass on the admin pages.
4. Check every admin page at phone width.
5. Update `README.md` status to Complete, mark the milestones in `plan.md`, and write lessons learned in `notes/`.
6. Delete `current-task.md` and the root `CLAUDE.md` note if one was added.

## Expected outputs

- `projects/market-access/notes/verification.md`, `notes/lessons.md`
- `README.md`, `plan.md` updated

## Acceptance criteria

- [ ] All eight success criteria checked.
- [x] The privacy grep is clean.

## As done so far (2026-11-24)

- Steps 1 to 4 done; results in `notes/verification.md`. Criteria 2, 4, 5, 6 and 8 are verified. Criteria 1, 3 and 7 each need one step only Ralph can take (a second account, sending real follow-ups, a real mailbox outside the scope), listed there.
- Privacy grep: two items replaced with placeholders (a label example in `tltf-import.ts`, a Spaarke mailbox in the check fixtures); otherwise clean.
- Lighthouse and accessibility: no admin page scrolls sideways at phone width; axe finds one issue on every admin page, the site header's primary button contrast (site-wide, not this module).
- Lessons learned in `notes/lessons.md`.
- Step 5 in part: README status updated, but not to Complete, and the plan milestones are not marked. Step 6 not done: `current-task.md` stays.
- To close: Ralph's final checks, then README to Complete, the milestones, and delete `current-task.md`.
