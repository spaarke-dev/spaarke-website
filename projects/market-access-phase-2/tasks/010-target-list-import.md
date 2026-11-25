# Task 010: Target list import

**Phase:** 1 (Target lists)
**Status:** done
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

- [x] The preview names each broken row and why.
- [x] Nothing is saved until Ralph confirms.
- [x] A second import of the same file adds no contact, member or note.
- [x] An admin without `investor` cannot import as investor.
- [x] The page has no sideways scroll at 375 px.

## Notes

- Parse in memory only; never write the file to disk or storage.
- The fixture uses `.test` addresses and made-up names.
- Spec references: FR-01, NFR-01 to NFR-03, NFR-05.

## As built

- `src/lib/market/target-fields.ts` (pure, used by the form too): the 11 target fields with labels and common header names, `defaultTargetMapping`, `checkTargetMapping`, `mapTargetRows` (a full name column wins over first and last name), and the limits: 2,000 rows, 2 MB, and 250 rows a run.
- `src/lib/market/target-import.ts`: request checks, `checkTargets` (no email, not an email, a field over 400 characters, a group or template over 100, a repeated email), `previewTargets` (new contacts, existing contacts, already in the campaign, skipped) and `runTargets`.
  - Contacts go through `resolveContact` with kind `prospect`, so existing contacts gain only empty fields and hand edits stay.
  - Members go through `addMember`. An existing member gains a missing group or template label but never loses one.
  - Each person gets one `list.import` entry ("Added from a list") on the campaign, and a note becomes one `note` entry, keyed by campaign, email and note text.
  - A run handles 250 rows from `from` and answers with the next row; the form sends a large file in parts. Every write is keyed, so a repeated part adds nothing.
  - The audit holds counts only (`import.targets`).
- `POST /api/admin/import/targets`: preview without `confirm`, import with it. Investor visibility needs the `investor` role (403).
- `/admin/import`: a "Target list" or "LinkedIn leads" choice (`ImportChooser`), with the target form in `TargetImport.tsx`: campaign (existing or new outreach campaign), file, visibility, column picker, preview and the result.
- New activity type `list.import`, with its label and icon.
- Checks: one pure (mapping, row checks, request checks, the 2,000-row limit) and two storage (preview writes nothing; import; hand edits kept; second import adds nothing; labels filled, not replaced; investor visibility; no unmapped value stored; audit counts only; a 257-row list in two parts). 63 pass with fresh tables.
- In headless Chrome against the local production build: a made-up list previewed with its 3 broken rows named, imported into a new campaign (3 people, 2 notes), and a second import added nothing. Investor import without the role answered 403. No sideways scroll at 375 px; axe finds only the site header button's contrast, as before.
- Note: the check for a 500-member campaign's load time fails against an emulator that has held every check run of the day; with fresh tables it passes.
