# Task 040: Pull request and preview checks

**Phase:** 4 (Ship and go live)
**Status:** not-started
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
