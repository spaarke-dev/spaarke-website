# Task 032: Meetings in results

**Phase:** 3 (Calendar)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 031
**Tags:** api, storage

## Goal

`calendar.held` counts toward a member's `meeting` stage; booked and moved calendar entries show on the timeline but do not count.

## Context

FR-08. A booked meeting that never happens should not inflate the funnel. Phase 1 rules for `/meet` bookings and `meeting.in_person` stay as they are.

## Steps

1. In `src/lib/market/results.ts`, map `calendar.held` to `meeting` in the stage table. Leave `calendar.booked`, `calendar.moved` and `calendar.cancelled` unmapped.
2. Make sure the held entry falls inside the campaign window like other activity.
3. Recompute live campaigns after merge (the existing `recomputeAllCampaigns`), and record counts before and after.
4. Checks: booked leaves the stage unchanged; held moves the member to `meeting`; `/meet` and in-person rules unchanged.
5. Update TASK-INDEX.md.

## Expected outputs

- Changes to `src/lib/market/results.ts`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] A booked calendar meeting with a member leaves the funnel unchanged until it is held.
- [ ] Phase 1 funnel counts for TLTF are unchanged apart from meetings the calendar adds.

## Notes

- Spec references: FR-08.
