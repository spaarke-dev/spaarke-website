# Market access: task index

Status values: `not-started`, `in-progress`, `blocked`, `done`. Medium granularity (2 to 4 hours each).

## Phase 0: Foundations

| Task | Title | Depends on | Status |
|---|---|---|---|
| [001](001-auth-spike.md) | Auth spike on a preview environment | none | done |
| [002](002-admin-guard-and-shell.md) | Admin guard and shell | 001 | done |
| [003](003-exchange-and-app-setup-instructions.md) | Exchange and app setup instructions (Ralph runs them) | open question 1 | done |
| [004](004-app-insights-safety-export.md) | App Insights safety export | none | done |

## Phase 1: Store and activity log

| Task | Title | Depends on | Status |
|---|---|---|---|
| [010](010-market-store.md) | Market store | none | done |
| [011](011-contact-and-organization-resolution.md) | Contact and organization resolution | 010 | done |
| [012](012-record-activity.md) | `recordActivity` | 011 | done |
| [013](013-campaigns-members-audit.md) | Campaigns, members and audit | 012 | done |

## Phase 2: Site writers

| Task | Title | Depends on | Status |
|---|---|---|---|
| [020](020-form-writers.md) | Form writers | 012 | done |
| [021](021-meeting-writers.md) | Meeting writers | 012 | done |
| [022](022-brief-and-ask-ai-writers.md) | Brief read and Ask AI writers | 013 | done |

## Phase 3: Admin pages

| Task | Title | Depends on | Status |
|---|---|---|---|
| [030](030-admin-home-and-contacts-list.md) | Admin home and contacts list | 002, 012 | done |
| [031](031-contact-detail-and-edits.md) | Contact detail and edits | 030, 013 | done |
| [032](032-organizations.md) | Organizations | 030 | done |
| [033](033-campaigns-and-results.md) | Campaigns and results | 030, 013 | done |
| [034](034-follow-ups.md) | Follow-ups | 031, 033 | done |

## Phase 4: Mailbox sync

| Task | Title | Depends on | Status |
|---|---|---|---|
| [040](040-graph-mail-client.md) | Graph mail client | 003 run in the tenant | done |
| [041](041-mailbox-registry.md) | Mailbox registry | 002, 010 | done |
| [042](042-sync-engine-and-schedule.md) | Sync engine and schedule | 040, 041, 033, 034 | done |
| [043](043-triage.md) | Triage | 042 | done |

## Phase 5: Imports and backfill

| Task | Title | Depends on | Status |
|---|---|---|---|
| [050](050-tltf-import-cli.md) | TLTF import CLI | 013, 033, open question 2 | done |
| [051](051-engagement-filter.md) | Engagement filter | 033 | done |
| [052](052-backfill-cli.md) | Backfill CLI (before 2027-02-11) | 020, 021, 022, 004 | done (run 2026-11-24) |
| [053](053-linkedin-csv-import.md) | LinkedIn Lead Gen CSV import (before 2026-12-19) | 033, 002 | done |

## Phase 6: Reporting and privacy

| Task | Title | Depends on | Status |
|---|---|---|---|
| [060](060-morning-report.md) | Morning report sections | 034 | done |
| [061](061-privacy-page.md) | Privacy page | 031 | done |
| [090](090-project-wrap-up.md) | Project wrap-up | all | not-started |

## Dated constraints

- **2026-12-19:** the paid LinkedIn program starts; task 053 should be live by then.
- **2027-02-11:** App Insights retention drops the 2026-11-13 send data; task 004 removes the risk now, and task 052 must run before then.
