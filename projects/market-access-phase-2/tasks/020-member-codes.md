# Task 020: Member codes

**Phase:** 2 (Codes, briefs and links)
**Status:** done
**Estimated:** 3 hours
**Dependencies:** 010
**Tags:** nextjs, api, storage

## Goal

"Give everyone a code" on the campaign page gives each member without a code the next `<prefix>-NNN`, and sets their brief label to `<slug>:<code>`.

## Context

FR-03. Codes are how a brief read, an Ask AI click and a tagged site visit find the member. Phase 1 already indexes codes and brief labels (`findMemberByCode`, `findMemberByBriefLabel`); TLTF codes came from the private script.

## Steps

1. `src/lib/market/codes.ts`:
   - `codePrefix` on the campaign: defaults to the slug cut to 12 characters; editable until the first code exists; must pass `isMemberCode` once a number is added;
   - a counter row on the campaign, claimed with an ETag check, so two runs at once never give out the same number;
   - `assignCodes(slug)`: for each member without a code, the next number, written through `addMember` so the phase 1 code index guards against a clash across campaigns.
2. Brief label `<slug>:<code>` on each newly coded member.
3. `POST /api/admin/campaigns/[slug]/codes` and a prefix field on the campaign edit form.
4. On the campaign page: "Give everyone a code" with the count of members without one, and the code in the members table.
5. Audit `campaign.codes` with counts.
6. Checks: format, running twice, a later member getting the next number, a clash with another campaign's code, the TLTF codes left alone.
7. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/codes.ts`
- `src/app/api/admin/campaigns/[slug]/codes/route.ts`
- Changes to the campaign page, the campaign edit form and `campaign-admin.ts`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [x] Running it twice gives no member a second code.
- [x] A member added later gets the next number.
- [x] Codes are unique across campaigns, and existing TLTF codes keep their format.

## Notes

- Investor members are coded like others, but the count and table follow the phase 1 visibility filter.
- Spec references: FR-03, NFR-02, NFR-03.

## As built

- `src/lib/market/codes.ts`: codes are `<prefix>-NNN` (three digits, more when needed). The prefix defaults to the slug cut to 12 characters without a trailing dash; it takes letters, digits, `-` and `_`, up to 24 characters.
- The counter is a row in `MaCampaigns` (partition `counter`, row key the slug). Each run claims a block of numbers with an ETag check, so two runs at once never share a number.
- `assignCodes` codes up to 200 members per request, earliest member first, and writes each code with the brief label `<slug>:<code>` through `addMember`. A number another member already holds (in any campaign) is skipped and counted as a clash. Members with a code, the TLTF codes among them, are left alone.
- The prefix is fixed once any member has a code or the counter has given out a number. A prefix another campaign uses is refused, without naming that campaign.
- `POST /api/admin/campaigns/[slug]/codes` answers `coded` (members the user may see), `clashes` and `more`; the button calls it until `more` is false.
- The campaign page shows "Give everyone a code (N without one)", the prefix, and a Code column. Edit details has the prefix field until codes exist.
- Audit `campaign.codes` holds the counts and the prefix.
- Checks: 67 pass with fresh tables, including two runs at once on 12 members. Browser: prefix set, three codes given, a second run gives none, the prefix is then fixed; axe at desktop (only the header button contrast that predates this work) and at 375 px (none), no sideways scroll.
- Members added in one request share a time, so their order among themselves follows the contact ID.
