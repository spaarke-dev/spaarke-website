# Task 043: Retention cleanup

**Phase:** 4 (Ship and go live)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 004 (retention approved); no need to wait for 041
**Tags:** api, storage, azure

## Goal

SMS rows are deleted 12 months after their last activity, as counsel
approved, and opted-out senders keep their opt-out flag while Twilio holds
the number.

## Context

Counsel approved the spec's proposed retention on 2026-11-23 (task 004). No
row can reach 12 months before late 2027, so this is not needed for go-live,
but it should exist before the first rows age out.

## Steps

1. A `purgeSmsRows(now)` function in `src/lib/sms/store.ts`:
   - `SmsConversations`: delete rows whose latest of `createdAt`,
     `linkOpenedAt`, and `bookedAt` is older than 12 months. A booking keeps
     its own `smsConversationId`; that is fine, the booking row is kept on
     the /meet terms.
   - `SmsSenders`: delete rows whose `lastSeenAt` is older than 12 months,
     unless `optedOut` is true. Opted-out rows are kept so a later MEET
     after STOP still gets nothing.
   - `SmsInbound`: delete rows older than 12 months by `receivedAt`; they
     exist only to drop duplicate deliveries.
   - `SmsCounters`: delete windows older than 2 days.
2. Run it from the existing reminder schedule: `/api/meet/reminders` (called
   every five minutes with `MEET_CRON_SECRET`) runs the purge at most once a
   day, behind a counter row so two instances don't both run it. Keep it
   cheap: an OData filter on the date field, not a full table scan, where
   the field allows it.
3. Log `sms.purged` with the count per table; `trackException` with step
   `sms.purge` on failure, which never fails the reminder run.
4. Cases in `npm run sms:check` against the dev mock: old rows go, recent
   rows stay, opted-out senders stay, a second run the same day does nothing.
5. Add the retention rule to `docs/text-to-meet.md` and the "Text messages"
   paragraph only if counsel wants the period stated publicly (the approved
   wording does not state it).
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/sms/store.ts`: `purgeSmsRows`
- `src/app/api/meet/reminders/route.ts`: the daily purge
- `scripts/check-sms.mts`: purge cases
- `docs/text-to-meet.md`: retention section

## Acceptance Criteria

- [ ] Rows older than 12 months are deleted, opted-out senders excepted
- [ ] The purge runs at most once a day and never fails the reminder run
- [ ] `sms:check`, typecheck, and build pass

## Notes

The reminder route runs only when `MEET_CRON_SECRET` is set, which it is in
production. If the /meet Graph flow is ever switched off, the purge needs
its own schedule.
