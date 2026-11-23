# Task 050: TLTF import CLI

**Phase:** 5 (Imports and backfill)
**Status:** done (run live 2026-11-23)
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

- [x] Run from a local shell with the storage connection set, no file under the repo changes.
- [x] The campaign shows 81 sent and the same bounces and replies as `index.csv`.
- [x] A second run changes no counts.

## Notes

- Set the campaign's start and end dates, or tag the imported emails with the campaign slug: untagged email counts toward a campaign only inside its date window (task 033, `results.ts`). Then run `recomputeCampaign` and compare the funnel with `index.csv`.

- The spec names `STORAGE_CS`; the script reads `STORAGE_ACCOUNT_CONNECTION` like the rest of the site and accepts `STORAGE_CS` as an alias.
- Spec references: FR-09, FR-12, NFR-01.

## As built

- Open question 2 answered 2026-11-23: import, confirm later. Every Summit meeting in the calendar export is imported as held; Ralph corrects the ones that did not happen with the member status override on the campaign page. Recorded in `spec.md` (Owner Clarifications), `plan.md` and `current-task.md`.
- `src/lib/market/tltf-import.ts` (pure) reads the four files into a plan:
  - Columns are found by name and printed before anything is written; a missing column stops the run and names it.
  - Outreach rows: the file name gives the code and either a person and firm (`<code> <name> (<firm>).eml`) or a firm's general inbox (`<code> <firm>.eml`). Rows not sent are skipped. The send is dated 21:00 US Eastern on the status date.
  - Members: code `tltf-<code>` (the `src` on tracked links), brief label `tltf-2026:<code>`, the brief key (only its hash is stored), group `G1` or `G2`, and `Template A` to `D`.
  - Activities, all with source `tltf-import`, tagged with the campaign and visibility `investor`: `email.sent` per sent row, `email.bounced` per bounce, `email.received` per reply (the list's reply note as the summary; dated an hour after the send, since the list has no reply dates), `meeting.in_person` per outside attendee of each calendar meeting, and a `note` with the Summit people file's context for each matched person. Auto-replies and out-of-office results are not replies.
  - Summit people match an attendee's address, or the subject of a meeting with one outside attendee. They fill name, title, firm, LinkedIn and phone where the contact has none.
  - Summit attendees not on the outreach list become members in group `Summit`; someone on both keeps their outreach group.
  - Calendar times use Windows zone names, converted to UTC. Cancelled events and meetings with only spaarke.com attendees are skipped.
  - The campaign dates come from the send and the last meeting (2026-11-13 to 2026-11-19), so the history counts on the campaign page.
- `src/lib/market/tltf-run.ts` writes the plan: creates the campaign if missing (or sets its dates if it has none; otherwise leaves it as edited), then per person resolves the contact (visibility `investor`), adds or updates the member without resetting its status or override, and records the activities. It then recomputes the campaign, compares the funnel with the list, and audits `import.tltf` with counts only.
- `scripts/market/import-tltf.mts` (`npm run market:import-tltf -- --outreach ... --brief-keys ... --people ... --calendar ... [--dry-run]`): no default paths; `--dry-run` never touches storage; reads `STORAGE_ACCOUNT_CONNECTION`, or `STORAGE_CS` as an alias. It prints counts only, never names or addresses, and writes nothing under the repo.
- Dry run against the private files, 2026-11-23: 82 rows; 81 sent, 10 bounced, 11 replies, 3 auto-replies, 1 not sent, no missing brief keys; 14 meetings with 19 outside attendees (5 also on the outreach list, 14 Summit only); 14 Summit people matched, 13 context notes; 95 members and 134 activities.
- Checks: one pure check (mapping, file names, time zones, the plan and its stable IDs) and one storage check (two runs: contacts, members, groups, codes, brief key hash, timeline, funnel, an override kept, nothing added the second time). 55 pass.
- Known overlap: the import's reply entries come from the list. If the mail sync or a later backfill reads the same replies from the mailbox, the timeline shows both (different sources); the funnel counts each member once.
- Live run, 2026-11-23, after PR #193 merged: campaign created; 95 contacts and 95 members created; 134 activities recorded. Funnel: 95 members, 81 sent, 71 delivered, 11 replied, 19 with a Summit meeting, 0 engaged. Against `index.csv`: sent 81/81, bounced 10/10, replied 11/11. A second run found all 95 contacts, updated the 95 members in place, recorded nothing new (134 duplicates) and left the funnel unchanged. No file under the repo changed.
- Engaged is 0 because brief reads and Ask AI clicks from before the import were logged without a member to link to. The backfill (task 052) brings the App Insights events in, resolved through the member codes and brief labels the import created.
