# Task 001: Create `v2` feature branch

**Phase:** 0 — Foundations
**Status:** **done** (2026-04-30)
**Estimated:** 15 minutes
**Dependencies:** none
**Tags:** git, branching, swa

## Goal

Create the `v2` feature branch that all v2 redesign work happens on, so SWA produces preview deploys via PR builds and `main` stays untouched until atomic cutover at merge.

## Completed Steps

1. ✓ Verified clean working tree on `main`
2. ✓ Created `v2` branch from `main`
3. ✓ Pushed to origin and set upstream tracking
4. ✓ Made an initial bookkeeping commit on `v2` so a PR could be opened
5. ✓ Opened draft PR [#2](https://github.com/spaarke-dev/spaarke-website/pull/2) `v2 → main`
6. ✓ Verified SWA preview build succeeded (5m49s)

## Outputs

- `v2` branch on origin, tracking
- Draft PR #2 open against `main`
- SWA preview URL active and renders v1 site (sanity confirmed)

## Notes

- The PR stays in **draft** until Task 090. Converting to "ready for review" signals cutover-ready.
- All subsequent task commits push to `v2`. No commits to `main` during this project except hot fixes unrelated to v2.
