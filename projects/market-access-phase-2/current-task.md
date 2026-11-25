# Current task

> Context recovery for market access phase 2 sessions. Update it when a task starts, pauses or finishes.

## Quick recovery

| Field | Value |
|-------|-------|
| **Task** | 022: Links and export (done); 001 waits on the Exchange step |
| **Step** | 022 built and verified; PRs stacked, merged together after all tasks (Ralph, 2026-11-24) |
| **Status** | in progress; waiting on Ralph's Exchange step for the contactus@ retest |
| **Next action** | Once Ralph has run section 7 of `docs/market-access-mailboxes.md`, retest the contactus@ calendar read and record it in `notes/calendar-spike.md`. Meanwhile tasks 050 and 051 go on |

## Open items

| # | Item | Status |
|---|---|---|
| 1 | Ralph runs `Application Calendars.Read` for contactus@ | Command ready (setup guide, section 7) |
| 2 | Delta window for a rolling calendar range | Settled: no delta; `calendarView` each run (`notes/calendar-spike.md`) |
| 3 | `MEET_GRAPH_SECRET_EXPIRES` set | Task 051 |

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
