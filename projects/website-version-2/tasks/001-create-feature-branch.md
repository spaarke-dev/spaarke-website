# Task 001: Create `v2` feature branch

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 15 minutes
**Dependencies:** none
**Tags:** git, branching, swa

## Goal

Create the `v2` feature branch that all v2 redesign work happens on, so SWA produces preview deploys via PR builds and `main` stays untouched until atomic cutover at merge.

## Context

Branch-based development is the core of our "least risky" strategy. `main` continues to deploy v1 to production; `v2` branch deploys to a SWA preview URL when we open a PR. We replace v1 components in place on the branch (no `V2` filename suffix). Final cutover = merging the PR.

## Steps

1. From `main`, ensure working tree is clean (`git status`).
2. Create the branch: `git checkout -b v2`.
3. Push to origin and set upstream: `git push -u origin v2`.
4. Open a draft PR `v2 → main` titled "v2: full visual redesign" with body summarizing the scope (link to [README.md](../README.md)) — this triggers SWA's preview build for the branch and keeps the preview URL stable.
5. Verify the SWA preview URL is generated and the v1 site renders there (we have not changed anything yet).
6. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- `v2` branch on origin
- Draft PR open with SWA preview URL active

## Acceptance Criteria

- [ ] `v2` branch exists locally and on origin
- [ ] Draft PR is open against `main`
- [ ] SWA preview URL renders the v1 site (sanity check)

## Notes

- Keep the PR in **draft** until Phase 5; converting to "ready for review" signals cutover-ready.
- All subsequent task commits push to `v2`. Do not commit to `main` during this project except for hot fixes unrelated to v2.
