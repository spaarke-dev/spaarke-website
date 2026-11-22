# Task 040: Pull request and preview checks

**Phase:** 4 (Ship and go live)
**Status:** in-progress
**Estimated:** 2 hours
**Dependencies:** 022, 031, 032
**Tags:** deploy, ci-cd, testing

## Goal

The build is merged and deployed with `SMS_MODE` unset, and nothing visible
on the site has changed except what is meant to.

## Context

Shipping dark lets the code reach production while the number is in review
and counsel is working. Going live is task 041.

## Steps

1. `npm run typecheck`, `npm run lint`, `npm run build`,
   `npm run sms:check`, `npm run meet:check`, `npm run voice:lint` on
   changed copy.
2. `git grep` for the number, `AC` account SIDs, `MG` service SIDs, and
   any secret pattern: none found.
3. Push and open the PR with the `push-to-github` skill. Body: what ships,
   that the route is dark, and the go-live steps in task 041.
4. On the PR preview: `/api/sms/inbound` returns 404; `/meet` renders as
   before with no footer line; `/meet?c=junk` renders the normal page;
   `/sms` unchanged.
5. Owner reviews and merges. Confirm the production deploy succeeded and
   repeat the checks in step 4 on spaarke.com.
6. Update TASK-INDEX.md and current-task.md.

## Expected Outputs

- A merged PR; production deploy green

## Acceptance Criteria

- [ ] All checks pass in CI and locally
- [ ] Production: inbound route 404, `/meet` unchanged
- [ ] No secret or number in the diff

## Notes

If the deploy fails on fonts or a canceled concurrent run, rerun it with
`gh run rerun`; the fonts are bundled since PR #158.

### Progress (2026-11-22)

- Step 1: main merged into the branch (10 commits, no shared files).
  Typecheck, build, `sms:check` (177), and `meet:check` (30) pass; ESLint is
  clean on every changed file. The repo-wide `npm run lint` has 11 errors,
  all in files this PR does not touch, so CI's lint state is unchanged.
- Step 2: the diff has no real number, no account or service SID, and no
  key. The only phone number is the example from Twilio's signature docs;
  the only SID is an all-zeros fixture.
- Step 3: PR #178 retitled, description rewritten (what ships, ships dark,
  go-live order), marked ready for review.
- Task 041 reordered: the Twilio webhook is set before `SMS_MODE`, so the
  number is never live without the route ready, and the /meet line never
  shows before Twilio points at the site.
- Next: step 4 on the preview once its deploy finishes, then the owner's
  review and merge.

