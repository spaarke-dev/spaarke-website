# Task 013: Campaigns, members and audit

**Phase:** 1 (Store and activity log)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 012
**Tags:** typescript, azure, storage

## Goal

The store can hold campaigns and their members, look a member up by recipient code or brief label, and write audit entries.

## Context

FR-09 (campaigns as outreach projects with members), FR-06 (brief reads and Ask AI clicks resolve through the code or brief label), NFR-06 (audit).

## Steps

1. `src/lib/market/campaigns.ts`:
   - `MaCampaigns`: partition `campaign`, row key the slug.
   - `MaMembers`: partition the campaign slug, row key the contact ID; fields code, brief key hash, brief label, group, template label, status, `statusOverride`, `lastActivityAt`.
   - Lookup index rows in `MaMembers`: partition `code`, row key the code; partition `brief`, row key the brief label. Each points to the campaign and contact.
   - `upsertCampaign`, `addMember`, `findMemberByCode`, `findMemberByBriefLabel`, `listMembers(slug)`.
   - Store a hash of the brief key, not the key itself; the label is enough to resolve a read.
2. `src/lib/market/audit.ts`: `audit({ who, action, entity, entityId, before?, after? })` to `MaAudit`, partition `yyyy-mm`, row key inverted time. Store changed field names and short values only.
3. `recordActivity` (task 012) accepts `memberCode` and sets campaign and member links when it resolves.
4. Extend `scripts/check-market.mts` with a made-up campaign of three members.

## Expected outputs

- `src/lib/market/campaigns.ts`, `src/lib/market/audit.ts`
- `src/lib/market/activity.ts` (member links)
- `scripts/check-market.mts` additions

## Acceptance criteria

- [ ] A member is found by its code and by its brief label in one point read each.
- [ ] An activity recorded with a member code carries the campaign and member links.
- [ ] Audit rows record who, when and what.

## Notes

- Status derivation from the log is task 033; this task stores the field.
- Spec references: FR-06, FR-09, NFR-06.
