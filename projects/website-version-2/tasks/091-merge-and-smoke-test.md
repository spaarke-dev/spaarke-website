# Task 091: Merge `v2` → `main` and smoke test live

**Phase:** 5 — Cutover
**Status:** not-started (stub — to be expanded when Phase 5 begins)
**Estimated:** 1 hour
**Dependencies:** 090
**Tags:** cutover, deploy, qa

## Context

Atomic cutover. Merge the PR (use a merge commit, not squash, so the v2 history is preserved and revertable as a single commit). SWA picks it up automatically and deploys to production.

Smoke test on production:
- Home page renders
- Forms submit (contact, access-request)
- Insights index + at least one post renders
- Sitemap and robots resolve
- No 404s from internal links
- Old `/blog` paths redirect to `/insights`

If anything regresses, rollback path: `git revert <merge-commit-sha>` and push.

After live verification:
- Update [README.md](../README.md) status to "Complete"
- Update [current-task.md](../current-task.md) marking 091 done

## Acceptance (will expand when Phase 5 begins)

- [ ] Merge commit on main, deployed by SWA
- [ ] Production smoke test passed
- [ ] No P0 issues reported within 24 hours
- [ ] Project marked Complete in README

## Rollback path

If P0 issue surfaces:
```
git revert <merge-commit-sha>
git push origin main
```
SWA redeploys v1 within ~1-2 minutes.
