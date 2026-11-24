# Task 042: Job schedule and Write in Outlook

**Phase:** 4 (Follow-up steps)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 041
**Tags:** ci-cd, deploy, react

## Goal

The daily follow-up job runs at 11:00 UTC from GitHub Actions, and every open follow-up has a "Write in Outlook" link.

## Context

FR-11, FR-12 and owner decision 1 (no sending from the admin area for now).

## Steps

1. `.github/workflows/followup-steps.yml`, in the `mail-sync.yml` pattern: `cron: "0 11 * * *"`, `workflow_dispatch`, a `curl --fail` POST to `/api/market/followups/run` with `MA_SYNC_TOKEN`, printing counts only. A header comment notes that GitHub can start it late and that the 7-day catch-up covers it.
2. "Write in Outlook" on each open follow-up on the contact page, the campaign page and `/admin`: `mailto:<email>?subject=<title>`, encoded. Underlined default text color, not the brand blue.
3. Run the workflow once by hand after merge and record the counts.
4. Check the link in the browser: it opens a new message with the subject filled in.
5. Update TASK-INDEX.md.

## Expected outputs

- `.github/workflows/followup-steps.yml`
- Changes to the follow-up components on the contact, campaign and home pages

## Acceptance criteria

- [ ] A failed call fails the workflow run, so GitHub's failure email reaches Ralph.
- [ ] "Write in Outlook" opens a new message to the contact with the subject filled in.
- [ ] The workflow log shows counts only.

## Notes

- `MA_SYNC_TOKEN` is already a repository secret (phase 1 task 042).
- Spec references: FR-11, FR-12.
