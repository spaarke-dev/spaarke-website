# Task 021: Campaign brief

**Phase:** 2 (Codes, briefs and links)
**Status:** done
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

- [x] Opening a member's brief link logs a `brief.read` on that member.
- [x] After "Turn the briefs off", the link answers 404.
- [x] The text is in no log, telemetry event, audit row or file in the repo.

## Notes

- The key is a secret link; never log it. Use `crypto.randomBytes` with base64url.
- Spec references: FR-04, NFR-01, NFR-03.

## As built

- `src/lib/private-brief.ts`: reads are unchanged apart from a new `audience`. Writes added: `putBrief` (create only, so a key is never reused), `updateBrief`, `setBriefActive`, and `listCampaignBriefRows`. Campaign rows carry `campaign` (the slug) and `audience`. The writes create the table on first use, for a fresh emulator.
- `src/lib/market/campaign-brief.ts`: `saveCampaignBrief` gives each coded member without a row a 32-character key (`randomBytes(24)` as base64url) and a row with the member's brief label, and stores the key's hash on the member. A changed text reaches every row; the same text again changes nothing. `setCampaignBriefsActive` turns every row off or on. `fillBriefRows` gives members coded later a row from the saved text and state; the codes route calls it after the last part.
- Saving needs at least one coded member (409 otherwise). Rows written elsewhere (the TLTF script) are never listed or changed.
- Framing: the brief route treated every private brief as the investor overview. A campaign that all admins can see now writes `audience: "general"`: the material says it is shared privately with the reader, the brief appears as "A note from the Spaarke team", and the Ask AI prompt keeps the published headings. Investor campaigns, and rows without an audience (TLTF), keep the investor framing. The copy-to-clipboard prompt on the site's Ask AI card cannot see the audience, so it keeps the investor headings for any page opened with `?k=`.
- Routes: `PUT /api/admin/campaigns/[slug]/brief` and `POST .../brief/active`.
- The campaign page has a Brief section: the text (with a character count, up to 20,000), Save brief, the number of links the user may see, and "Turn the briefs off" or "Turn them on".
- Audit `campaign.brief` (links, created, updated, characters) and `campaign.brief_active` (state, links). No text, no keys.
- Checks: 69 pass with fresh tables. Browser: save gives two links; a member's link answers 200 with the note and no mention of investors; the Ask AI link points at that brief without the investor headings; the read shows on the member's timeline; off gives 404 and on gives 200 again; axe at desktop (only the header button contrast that predates this work) and at 375 px (none), no sideways scroll.
