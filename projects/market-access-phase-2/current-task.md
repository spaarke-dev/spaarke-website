# Current task

> Context recovery for market access phase 2 sessions. Update it when a task starts, pauses or finishes.

## Quick recovery

| Field | Value |
|-------|-------|
| **Task** | 090: project wrap-up (written up); waits on deploy and Ralph's final checks |
| **Step** | All tasks built; PRs 210 to 219 plus the wrap-up PR stacked, merged together in order (Ralph, 2026-11-24) |
| **Status** | in progress; waiting on the merge and deploy, then Ralph's final checks and the Exchange step |
| **Next action** | After deploy: run the live checks in `notes/verification.md` (050 alert, 031 live run, 032 recompute, 042 first workflow run, Lighthouse on a brief). After Ralph's Exchange step: retest the contactus@ calendar read and record it in `notes/calendar-spike.md` |

## Open items

| # | Item | Status |
|---|---|---|
| 1 | Ralph runs `Application Calendars.Read` for contactus@ | Command ready (setup guide, section 7) |
| 2 | Delta window for a rolling calendar range | Settled: no delta; `calendarView` each run (`notes/calendar-spike.md`) |
| 3 | `MEET_GRAPH_SECRET_EXPIRES` set | Code done (task 051); the app setting waits for Ralph's go-ahead |

## Decisions made

- Spec accepted as written on 2026-11-24, with its seven assumptions. Plan approved the same day.

## Log

- 2026-11-24: design, spec, plan and tasks written on `docs/market-access-phase-2-design` (PR 206).
- 2026-11-24: plan approved by Ralph; PR 206 merged.
- 2026-11-24: task 001 spike run against Ralph's calendar; decision recorded in `notes/calendar-spike.md`. contactus@ answers 403 until the Exchange step.
- 2026-11-24: task 010 built (target list import); 63 checks pass with fresh tables.
- 2026-11-24: task 010 merged (PR 209). Task 011 built (add contact by hand); 65 checks pass with fresh tables.
- 2026-11-24: Ralph: keep working through the tasks and deploy once they are done, so the PRs stack (011 is PR 210). Task 020 built (member codes); 67 checks pass with fresh tables.
- 2026-11-24: task 020 in PR 211. Task 021 built (campaign brief); 69 checks pass with fresh tables. A general campaign's brief is framed for any reader, not for investors.
- 2026-11-24: task 021 in PR 212. Task 022 built (links and export); 71 checks pass with fresh tables.
- 2026-11-24: task 022 in PR 213. Tasks 050 and 051 built (sync health, alert, secret expiry); 73 checks pass with fresh tables.
- 2026-11-24: tasks 050 and 051 in PR 214. Task 040 built (follow-up steps, Stop steps); 75 checks pass with fresh tables.
- 2026-11-24: task 040 in PR 215. Task 030 built (calendar client, state table, Read calendar setting); 77 checks pass with fresh tables.
- 2026-11-24: task 030 in PR 216. Task 031 built (calendar entries); 79 checks pass with fresh tables.
- 2026-11-24: task 031 in PR 217. Task 032 built (held meetings count toward the meeting stage); 80 checks pass with fresh tables.
- 2026-11-24: task 032 in PR 218. Tasks 041 and 042 built (daily follow-up job, schedule, Write in Outlook); 84 checks pass with fresh tables.
- 2026-11-24: tasks 041 and 042 in PR 219. Task 090 written up: `notes/verification.md` and `notes/lessons.md`; privacy searches clean; 84 checks pass. The project stays open until Ralph's final checks (listed at the end of `notes/verification.md`).
