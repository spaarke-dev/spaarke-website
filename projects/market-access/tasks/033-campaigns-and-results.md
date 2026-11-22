# Task 033: Campaigns and results

**Phase:** 3 (Admin pages)
**Status:** done
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

- [x] A made-up campaign's funnel matches hand-counted activities.
- [x] A manual override is kept through recomputes and shown.
- [x] A campaign of 500 made-up members loads in under 2 seconds (NFR-04).

## Notes

- Spec references: FR-09, FR-10, NFR-04, NFR-06.

## As built

- `src/lib/market/results.ts` holds the rules. A member's status is the furthest stage the log shows, in the order sent, bounced, engaged, replied, meeting. The override is stored beside the derived status and wins on the page; a recompute never touches it.
- Which activities count: anything tagged with the campaign (brief reads and Ask AI clicks through a member's code, or an import that names the campaign), and untagged email and meetings with the contact from the start date (or the day the member was added) to 60 days after the end date. Mail sync does not know campaigns, so the window is how a sent email or reply finds its campaign. An activity tagged with another campaign never counts. Editing the dates clears the results time, so the next view derives statuses again.
- Funnel: a member counts at each stage the log shows them reaching, so the counts match a hand count of activities. An override counts at its own stage, and as sent unless it is `planned`. Delivered is sent minus members whose status is bounced.
- Stored on member rows: `status`, `reached` (comma-separated stages for the funnel) and `lastActivityAt`; on the campaign, `resultsAt`. A page view reads one member partition and does point reads for the contacts; it derives statuses first when `resultsAt` is older than 15 minutes. "Update statuses" derives them now. `recomputeAllCampaigns()` is for task 042 to call after each sync.
- Members whose contact is investor-only are left out of the rows and counts without the investor role (FR-02); an investor campaign is "not found".
- Admin API: `POST /api/admin/campaigns` (create), `PATCH /api/admin/campaigns/[slug]` (edit; dates checked, short name fixed), `POST .../members` (existing contacts by email or ID, one per line, with group and template label; entries that match no visible contact are listed back and nothing is created), `PATCH .../members/[contactId]` (`{ status }` or `{ status: null }`) and `POST .../recompute`. Each runs the shared role, same-site and JSON checks (`adminRequest` in `admin-api.ts`). Create, edit, members added and every override change write audit rows.
- Pages: `/admin/campaigns` lists campaigns with members, sent, engaged, replied and meetings from the stored statuses, and a create form (visibility defaults to all admins; investor only with the role). `/admin/campaigns/[slug]` shows details with an edit form, the funnel, the note that engaged counts every read until task 051, an add-members form, and the member table, filterable by name, status and group, with a status control per row.
- Measured against Azurite: 500 members load in about 100 ms from stored statuses and 360 ms when deriving them first. Live Table Storage is slower per call; reads run 32 at a time, which keeps the estimate under 2 seconds. Check on the preview once the TLTF import (task 050) gives a real campaign.
- Verified in a local dev preview: created a campaign, added four contacts and one unknown address (reported back), the funnel matched, an override showed "set by hand" and survived "Update statuses", status filter, no horizontal scroll at 375 px. The API refused a cross-site request (403), a non-JSON body (415), an unknown field (400), a duplicate short name (409) and reversed dates (400).
- Checks: one pure (status rules, window, funnel, input parsing) and four storage checks (hand-counted funnel, override, edit and hidden members, 500 members); 37 pass.
