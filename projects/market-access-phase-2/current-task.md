# Current task

> Context recovery for market access phase 2 sessions. Update it when a task starts, pauses or finishes.

## Quick recovery

| Field | Value |
|-------|-------|
| **Task** | 001: Calendar access spike and Exchange step |
| **Step** | Spike done and written up; Exchange command in the setup guide |
| **Status** | in progress; waiting on Ralph's Exchange step for the contactus@ retest |
| **Next action** | Once Ralph has run section 7 of `docs/market-access-mailboxes.md`, retest the contactus@ calendar read and record it in `notes/calendar-spike.md`. Meanwhile tasks 010, 011, 050 and 051 can start |

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
