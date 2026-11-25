# Task 042: Job schedule and Write in Outlook

**Phase:** 4 (Follow-up steps)
**Status:** done
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

- [x] A failed call fails the workflow run, so GitHub's failure email reaches Ralph.
- [x] "Write in Outlook" opens a new message to the contact with the subject filled in.
- [x] The workflow log shows counts only.

## Notes

- `MA_SYNC_TOKEN` is already a repository secret (phase 1 task 042).
- Spec references: FR-11, FR-12.

## As built

- `.github/workflows/followup-steps.yml`: 11:00 UTC and `workflow_dispatch`, one run at a time, a POST with `MA_SYNC_TOKEN`. Any answer but 200 fails the run, so GitHub's failure email goes out. The route returns counts only, so the log does too.
- `src/lib/market/mailto.ts` and `WriteInOutlook.tsx`: `mailto:<address>?subject=<title>`, the subject encoded so `&` and `#` stay in it. Underlined, default text color.
- Shown on each open follow-up on `/admin`, on the contact page, and in a new "Open follow-ups" section on the campaign page (`campaignFollowUpRows`, from the due index, for contacts the user may see).
- Checks: the link's address and subject, and the campaign list with its investor filter. Browser: the link on all three pages with the right address and subject, the route answering 401 without the token and counts with it, no sideways scroll at 375 px, axe clean apart from the header contrast that predates this work.
- Step 3, 2026-11-25: run by hand after deploy; HTTP 200 with counts only (no campaign had steps yet).
