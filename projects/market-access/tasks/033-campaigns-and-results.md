# Task 033: Campaigns and results

**Phase:** 3 (Admin pages)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 030, 013
**Tags:** nextjs, react, api, storage

## Goal

`/admin/campaigns` lists campaigns and `/admin/campaigns/[slug]` shows the funnel and the per-member table, with member status derived from the activity log and a manual override.

## Context

FR-09 and FR-10. The engagement rule needs the scanner filter (task 051); until it lands, `engaged` counts every brief read or click and the page says so.

## Steps

1. `src/lib/market/results.ts`: `deriveMemberStatus(member, activities)` with the FR-09 rules (sent, bounced, replied, engaged, meeting), taking the furthest stage reached; a `statusOverride` wins and is shown as such.
2. `campaignResults(slug)`: funnel (members, sent, delivered, engaged, replied, meeting) and rows (member, contact, group, last activity, status).
3. Pages: list (with create and edit), detail (funnel, filterable table by status and group, override control).
4. Admin API: create or edit a campaign, add members by contact, set or clear an override (audited).
5. A recompute that runs after each sync (task 042) and on page load when stale.

## Expected outputs

- `src/lib/market/results.ts`
- `src/app/admin/campaigns/page.tsx`, `src/app/admin/campaigns/[slug]/page.tsx`
- `src/app/api/admin/campaigns/**/route.ts`

## Acceptance criteria

- [ ] A made-up campaign's funnel matches hand-counted activities.
- [ ] A manual override is kept through recomputes and shown.
- [ ] A campaign of 500 made-up members loads in under 2 seconds (NFR-04).

## Notes

- Spec references: FR-09, FR-10, NFR-04, NFR-06.
