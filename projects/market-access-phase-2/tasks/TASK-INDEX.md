# Market access phase 2: task index

Status values are `not-started`, `in-progress`, `blocked` and `done`, and each task is sized at 2 to 4 hours.

## Phase 0: Calendar access

| Task | Title | Depends on | Status |
|---|---|---|---|
| [001](001-calendar-access-spike.md) | Calendar access spike and Exchange step | none | in-progress (spike done; contactus@ retest after Ralph's Exchange step) |

## Phase 1: Target lists

| Task | Title | Depends on | Status |
|---|---|---|---|
| [010](010-target-list-import.md) | Target list import | none | done |
| [011](011-add-contact.md) | Add contact | none | done |

## Phase 2: Codes, briefs and links

| Task | Title | Depends on | Status |
|---|---|---|---|
| [020](020-member-codes.md) | Member codes | 010 | done |
| [021](021-campaign-brief.md) | Campaign brief | 020 | done |
| [022](022-links-and-export.md) | Links and export | 021 | done |

## Phase 3: Calendar

| Task | Title | Depends on | Status |
|---|---|---|---|
| [030](030-graph-calendar-client.md) | Graph calendar client and registry setting | 001 | not-started |
| [031](031-calendar-entries.md) | Calendar entries in the sync | 030 | not-started |
| [032](032-meetings-in-results.md) | Meetings in results | 031 | not-started |

## Phase 4: Follow-up steps

| Task | Title | Depends on | Status |
|---|---|---|---|
| [040](040-follow-up-steps.md) | Follow-up steps | 020 | not-started |
| [041](041-daily-follow-up-job.md) | Daily follow-up job | 040, 031 | not-started |
| [042](042-job-schedule-and-outlook-link.md) | Job schedule and Write in Outlook | 041 | not-started |

## Phase 5: Health

| Task | Title | Depends on | Status |
|---|---|---|---|
| [050](050-sync-health-and-alert.md) | Sync health and alert | none | not-started |
| [051](051-secret-expiry-warning.md) | Secret expiry warning | none | not-started |
| [090](090-project-wrap-up.md) | Project wrap-up | all | not-started |

## Dated constraints

- **2026-12-19:** the paid LinkedIn program starts. Phase 2 is not needed for it (the phase 1 LinkedIn import covers it), but the second outreach campaign should follow soon after.
- **2027-10-14:** 30 days before the Graph secret expires; task 051 warns from then.
