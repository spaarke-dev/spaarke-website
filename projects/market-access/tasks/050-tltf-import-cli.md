# Task 050: TLTF import CLI

**Phase:** 5 (Imports and backfill)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 013, 033
**Tags:** typescript, storage

## Goal

`scripts/market/import-tltf.mts` builds the `tltf-2026` campaign (visibility `investor`) from the private files, with its members, contacts, history and Summit meetings, and can be re-run without duplicating anything.

## Context

FR-12 and FR-09 acceptance (81 sent, the bounces and replies in the private `index.csv`).

**Raise open question 2 with Ralph before coding the Summit part:** should `meeting.in_person` entries come from the calendar import only, or should Ralph confirm which meetings took place? The plan recommends importing them as planned and confirming in one pass on the campaign page.

## Steps

1. Ask Ralph open question 2; record the answer in `spec.md` and `current-task.md`.
2. Arguments: `--outreach <csv> --brief-keys <csv> --people <json> --calendar <export> [--dry-run]`. No default paths in code.
3. Read the column layouts from the files at run time and print the mapping before writing; `--dry-run` prints counts only.
4. Create the campaign, contacts (titles, LinkedIn, context notes), members (codes, brief key hashes, labels, groups), and history activities (`email.sent`, `email.bounced`, `email.received` replies) with source `tltf-import` and stable source IDs.
5. Summit meetings per the answer to question 2.
6. Print a summary and compare it with `index.csv` counts.

## Expected outputs

- `scripts/market/import-tltf.mts`

## Acceptance criteria

- [ ] Run from a local shell with the storage connection set, no file under the repo changes.
- [ ] The campaign shows 81 sent and the same bounces and replies as `index.csv`.
- [ ] A second run changes no counts.

## Notes

- Set the campaign's start and end dates, or tag the imported emails with the campaign slug: untagged email counts toward a campaign only inside its date window (task 033, `results.ts`). Then run `recomputeCampaign` and compare the funnel with `index.csv`.

- The spec names `STORAGE_CS`; the script reads `STORAGE_ACCOUNT_CONNECTION` like the rest of the site and accepts `STORAGE_CS` as an alias.
- Spec references: FR-09, FR-12, NFR-01.
