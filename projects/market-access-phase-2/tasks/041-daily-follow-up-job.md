# Task 041: Daily follow-up job

**Phase:** 4 (Follow-up steps)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 040, 031 (for the "first meeting held" anchor)
**Tags:** api, storage

## Goal

A daily run creates one follow-up for each member a step applies to that day, once only, and `POST /api/market/followups/run` starts it.

## Context

FR-10. The follow-ups it creates are ordinary phase 1 follow-ups: they show in the morning report and on the contact, and close as `sent` when the sync sees the email go out.

## Steps

1. `src/lib/market/step-run.ts`, `runSteps(now)`:
   - for each campaign with steps switched on, list members and their activities in the campaign window;
   - anchor day: first `email.sent` for `first-email`; first `calendar.held`, `/meet` `meeting.booked` or `meeting.in_person` for `first-meeting`;
   - due day = anchor day + days, in the host time zone (`todayKey()`);
   - create when the due day is today or up to 7 days past; skip older ones and count them;
   - audience, from the member's effective status: `no-reply` is status `sent`; `engaged-no-meeting` has reached `engaged` and not `meeting`; `met` has reached `meeting`; `everyone` is any;
   - stop rules: replied (unless `met` or `everyone`), bounced, deleted contact, `stopSteps`;
   - group filter.
2. `MaStepRuns` row per campaign, step and member, and a follow-up ID from the same three, so a second run that day creates nothing. The follow-up is due on its due day, linked to the campaign, with the step name as title.
3. Recompute stale campaign results first, so statuses are current.
4. `POST /api/market/followups/run` behind `MA_SYNC_TOKEN`, in the `/api/market/sync` pattern; it answers with counts only (created, already made, skipped as too late, stopped).
5. Checks with made-up members and dates: day 7 for exactly the members at `sent`; a second run creating nothing; a step 8 days late skipped; each stop rule; the meeting anchor; a group filter; investor members counted only for the investor role in the admin views.
6. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/step-run.ts`
- `src/app/api/market/followups/run/route.ts`
- Changes to `src/lib/market/tables.ts`, `followups.ts`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] A step "7 days after first email, no reply" creates follow-ups on day 7 for exactly the members still at `sent`.
- [ ] Running the job twice that day creates nothing more.
- [ ] A missed day up to 7 days late is caught up; older ones are skipped and counted.

## Notes

- If task 031 is not merged yet, ship with the `first-email` anchor and add `first-meeting` when it lands.
- Spec references: FR-10, NFR-02, NFR-03.
