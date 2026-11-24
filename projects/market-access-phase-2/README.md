# Market access phase 2

> **Status**: Planned (2026-11-24). Plan waiting for the owner's review.

Phase 2 lets the second outreach campaign run end to end from `/admin`. It adds a target list import and an "Add contact" form, personal codes with private brief links and a links export, calendar entries for meetings with known contacts, and follow-up steps that a daily job turns into follow-ups. Emails are still written and sent in Outlook. Three small checks keep it healthy: the daily job itself, a sync health line with an alert, and a secret expiry warning.

- **Spec**: [`spec.md`](spec.md) (accepted 2026-11-24)
- **Design notes**: [`design.md`](design.md)
- **Plan**: [`plan.md`](plan.md)
- **Tasks**: [`tasks/TASK-INDEX.md`](tasks/TASK-INDEX.md)
- **Session state**: [`current-task.md`](current-task.md)
- **Phase 1**: [`../market-access/README.md`](../market-access/README.md)

## Tech stack

The same as phase 1:

- Next.js 16 App Router (TypeScript) on Azure Static Web Apps; SWA authentication with roles `admin` and `investor`.
- Azure Table Storage through `@azure/data-tables`. New tables: `MaSteps` and `MaStepRuns`. Brief rows stay in `PrivateBriefs`.
- Microsoft Graph over `fetch`, app-only, limited by Exchange RBAC for Applications. Phase 2 adds calendar read.
- GitHub Actions for the schedules: the mail sync every 15 minutes, the new follow-up job daily at 11:00 UTC, the morning report at 12:00 UTC.
- Tailwind v4 tokens and `@fluentui/react-icons`.

## Code map (new in phase 2)

| Path | What |
|---|---|
| `src/lib/market/target-import.ts` | Target list CSV import |
| `src/lib/market/codes.ts` | Member codes and brief labels |
| `src/lib/private-brief.ts` | Brief rows: read (phase 1), write and switch off (phase 2) |
| `src/lib/market/graph-calendar.ts`, `calendar-sync.ts` | Calendar read and calendar entries |
| `src/lib/market/steps.ts`, `step-run.ts` | Follow-up steps and the daily job |
| `src/app/api/market/followups/run/` | Bearer-token route the daily job calls |
| `.github/workflows/followup-steps.yml` | The daily follow-up job |

## Local development

As in phase 1: run the checks against Azurite with a table suffix, and never against the live tables.

```
STORAGE_ACCOUNT_CONNECTION="UseDevelopmentStorage=true" MA_TABLE_SUFFIX=Check npm run market:check
```

## Setup Ralph runs

- `Application Calendars.Read` for the Graph app on the "Market access sync" scope, so the sync can read the contactus@ calendar (task 001 puts the command in `docs/market-access-mailboxes.md`).
- `MEET_GRAPH_SECRET_EXPIRES` set to the current secret's expiry date (task 051).

## Privacy

The repo is public. No contact data, target lists, codes, brief keys, brief text, calendar subjects, tenant IDs or secrets go in git, logs or telemetry. Imports read files from Ralph's browser or from `C:\code_files\spaarke-research` at run time, and the links export is built in the browser.
