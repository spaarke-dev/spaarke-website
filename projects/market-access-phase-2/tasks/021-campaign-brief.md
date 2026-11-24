# Task 021: Campaign brief

**Phase:** 2 (Codes, briefs and links)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 020
**Tags:** nextjs, react, api, storage

## Goal

Ralph writes one brief text for a campaign; every coded member gets a private link to it, and the briefs can be turned off and on together.

## Context

FR-04 and owner decision 2. Phase 1 reads `PrivateBriefs` rows (PK `brief`, RowKey the key, `text`, `label`, `active`) and logs `brief.read` through the label. Members already carry `briefKeyHash`.

## Steps

1. In `src/lib/private-brief.ts`, add writes: `putBrief(key, label, text, active)`, `setBriefActive(key, active)`. Keep reads unchanged.
2. `src/lib/market/campaign-brief.ts`:
   - `saveCampaignBrief(slug, text)`: for each coded member, a random 32-character URL-safe key (passes `isBriefKey`) the first time, stored in `PrivateBriefs` with the member's brief label; the member keeps only the key's hash, as in phase 1;
   - saving changed text updates every row in the campaign;
   - `setCampaignBriefsActive(slug, active)`;
   - a member coded after the brief exists gets a row on the next save or on "Give everyone a code".
3. Routes: `PUT /api/admin/campaigns/[slug]/brief` and `POST .../brief/active`.
4. On the campaign page: a brief editor (plain text, with a character count), Save, and "Turn the briefs off" or "Turn them on", with the number of links.
5. Audit `campaign.brief` and `campaign.brief_active` without the text.
6. Checks with made-up text: keys pass `isBriefKey`, a saved change reaches every row, off makes `getPrivateBrief` return null, on brings it back, the text never appears in the audit row.
7. Update TASK-INDEX.md.

## Expected outputs

- Changes to `src/lib/private-brief.ts`
- `src/lib/market/campaign-brief.ts`
- `src/app/api/admin/campaigns/[slug]/brief/**/route.ts`
- A brief component on the campaign page
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] Opening a member's brief link logs a `brief.read` on that member.
- [ ] After "Turn the briefs off", the link answers 404.
- [ ] The text is in no log, telemetry event, audit row or file in the repo.

## Notes

- The key is a secret link; never log it. Use `crypto.randomBytes` with base64url.
- Spec references: FR-04, NFR-01, NFR-03.
