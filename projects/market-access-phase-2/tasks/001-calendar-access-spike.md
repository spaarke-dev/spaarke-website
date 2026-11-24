# Task 001: Calendar access spike and Exchange step

**Phase:** 0 (Calendar access)
**Status:** in-progress (contactus@ retest waits on Ralph's Exchange step)
**Estimated:** 3 hours
**Dependencies:** none
**Tags:** azure, graph, config, docs

## Goal

`notes/calendar-spike.md` answers how the sync reads calendars, tested against Ralph's mailbox with the existing app, and `docs/market-access-mailboxes.md` has the Exchange command Ralph runs for contactus@.

## Context

FR-06. The `/meet` app already has `Application Calendars.ReadWrite` on Ralph's mailbox (the meet hosts scope). contactus@ needs `Application Calendars.Read` on the "Market access sync" scope. Exchange can take up to two hours to apply a change, so the command goes to Ralph first.

## Steps

1. Add a "Calendar read" subsection to `docs/market-access-mailboxes.md`: the `New-ManagementRoleAssignment` command for `Application Calendars.Read` on the "Market access sync" scope, how to test it with `Test-ServicePrincipalAuthorization`, and the expected wait. Placeholders only, no IDs.
2. With a throwaway script in `scripts/market/.tmp-*.mts` (deleted afterwards), read Ralph's calendar app-only and answer:
   - Does `GET /users/{id}/calendarView/delta?startDateTime&endDateTime` work app-only, and does it page with `@odata.nextLink` and end with `@odata.deltaLink`?
   - The delta window is fixed at the first call. How is a rolling 30-back, 90-ahead window kept? (For example: start a new delta each week, or read `calendarView` for the window each run and keep a hash of each event.)
   - What does the delta return for a moved event, a canceled event (`isCancelled`, or `@removed`), and an event the organizer marked private (`sensitivity`)?
   - Which field matches a `/meet` booking's stored event ID: `id` (differs by mailbox) or `iCalUId`?
   - Which fields give the online flag and the Outlook link (`isOnlineMeeting`, `webLink`)?
3. Print counts and field names only; never a subject, attendee or ID.
4. Write `notes/calendar-spike.md` with the answers and the decision for task 030.
5. After Ralph runs the command, run "Check access" for contactus@ calendar read with the same script and record the result.
6. Update TASK-INDEX.md.

## Expected outputs

- `docs/market-access-mailboxes.md` (calendar subsection)
- `projects/market-access-phase-2/notes/calendar-spike.md`

## Acceptance criteria

- [ ] Each question in step 2 has an answer from a real call, not from documentation alone.
- [ ] The read design for task 030 is decided.
- [ ] Ralph has the command, and its result for contactus@ is recorded.
- [ ] No tenant ID, mailbox ID, event ID or subject in the repo.

## Notes

- Do not run Exchange admin commands; Ralph runs them.
- Live credentials load per command from the SWA app settings and are never printed.
- Spec references: FR-06, NFR-01, NFR-04.
