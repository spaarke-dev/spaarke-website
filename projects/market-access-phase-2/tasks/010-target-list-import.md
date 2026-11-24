# Task 010: Target list import

**Phase:** 1 (Target lists)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** none
**Tags:** nextjs, react, api, forms, storage

## Goal

Ralph uploads any target list CSV at `/admin/import`, picks its columns, sees a preview, and confirms; the people become contacts and campaign members, and a second import of the same file adds nothing.

## Context

FR-01. Today a target list needs a private script. The LinkedIn import (phase 1 task 053) already parses CSV in memory, maps columns and previews; this task reuses that shape for a general list.

## Steps

1. `src/lib/market/target-import.ts`:
   - target fields: email (required); first name, last name, full name, title, organization, LinkedIn URL, phone, group label, template label, note;
   - `defaultTargetMapping(headers)` guessing common header names;
   - row checks (email shape, field lengths), with a reason for each broken row;
   - limits: 2,000 rows and 2 MB.
2. Preview: new contacts, existing contacts, members already in the campaign, broken rows. Nothing is written.
3. Run:
   - contacts through the phase 1 `resolveContact` (existing contacts gain only empty fields; hand-edited fields never change);
   - members through `addMember` with group and template labels;
   - a note becomes one `note` activity, with a source ID from the campaign and the email, so it is written once;
   - a new campaign is created from the form when named.
4. Visibility: "All admins" or "Investor role only"; the route refuses investor without the `investor` role.
5. `POST /api/admin/import/targets` with `preview` and `run` modes, behind the phase 1 admin request checks.
6. On `/admin/import`, a choice between "LinkedIn leads" and "Target list", sharing the file picker and column mapping.
7. Audit `import.targets` with counts only.
8. Checks: mapping, row checks, a preview, a run, a second run adding nothing, the investor refusal.
9. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/target-import.ts`
- `src/app/api/admin/import/targets/route.ts`
- Changes to `src/app/admin/import/page.tsx` and its form component
- Additions to `scripts/check-market.mts`
- A made-up fixture, `scripts/market/fixtures/target-list-sample.csv`

## Acceptance criteria

- [ ] The preview names each broken row and why.
- [ ] Nothing is saved until Ralph confirms.
- [ ] A second import of the same file adds no contact, member or note.
- [ ] An admin without `investor` cannot import as investor.
- [ ] The page has no sideways scroll at 375 px.

## Notes

- Parse in memory only; never write the file to disk or storage.
- The fixture uses `.test` addresses and made-up names.
- Spec references: FR-01, NFR-01 to NFR-03, NFR-05.
