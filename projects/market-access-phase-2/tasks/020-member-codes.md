# Task 020: Member codes

**Phase:** 2 (Codes, briefs and links)
**Status:** not-started
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

- [ ] Running it twice gives no member a second code.
- [ ] A member added later gets the next number.
- [ ] Codes are unique across campaigns, and existing TLTF codes keep their format.

## Notes

- Investor members are coded like others, but the count and table follow the phase 1 visibility filter.
- Spec references: FR-03, NFR-02, NFR-03.
