# Task 053: LinkedIn Lead Gen CSV import

**Phase:** 5 (Imports and backfill)
**Status:** done
**Estimated:** 3 hours
**Dependencies:** 033, 002
**Tags:** nextjs, react, api, forms

## Goal

`/admin/import` takes a Campaign Manager Lead Gen Form CSV, maps its columns, previews, and on confirm creates contacts and `linkedin.lead` activities, without storing the file.

## Context

FR-14. The paid program starts 2026-12-19, so this should land before the first leads arrive.

## Steps

1. Page: pick or create a campaign; upload; column mapping with defaults for LinkedIn's standard headers (First Name, Last Name, Email Address, Company Name, Job Title, LinkedIn Profile URL, Phone Number, Submitted At, Lead ID); preview of the first rows and the counts.
2. Admin API: parse in memory (a small CSV parser that handles quoted fields; no new dependency unless needed), validate, then `recordActivity` per row with source `linkedin-csv` and source ID the Lead ID (or a hash of email plus submitted time).
3. Report created, existing and skipped counts.
4. Test with a made-up CSV committed under `scripts/market/fixtures/` (no real data).

## Expected outputs

- `src/app/admin/import/page.tsx`, `src/app/api/admin/import/linkedin/route.ts`
- `src/lib/market/csv.ts`
- `scripts/market/fixtures/linkedin-leads-sample.csv` (made-up)

## Acceptance criteria

- [x] Importing the same file twice adds nothing the second time (FR-14 acceptance).
- [x] The uploaded file is never written to storage or disk.
- [x] Success criterion 5 holds.

## Notes

- Spec references: FR-14.

## As built

- `src/lib/market/csv.ts`: a CSV reader (quoted fields, doubled quotes, line breaks inside quotes, CRLF, byte order mark; comma, tab or semicolon), the default column mapping from LinkedIn's headers (case and punctuation ignored), and a reader for the submitted time. Times without a zone are read as UTC; ISO, US dates with 12- or 24-hour times, "Dec 20, 2026 2:03 PM" and epoch values are understood. No new dependency.
- `src/lib/market/linkedin-import.ts`: checks each row and names why a row is skipped (no email, not an email address, submitted time not understood, no lead ID or submitted time, repeats an earlier row). The source is `linkedin-csv`; the source ID is the Lead ID, or `h:` plus a hash of the email and submitted time when the file has no Lead ID column. The preview writes nothing; it counts ready, already imported (by the idempotency marker, `hasActivity` in `activity.ts`) and skipped rows.
- On import, each ready row is a `linkedin.lead` activity tagged with the campaign, with UTM source `linkedin`, medium `paid` and the campaign's UTM value, and the summary "LinkedIn lead form: <form name>". The contact gets the name, title, company, LinkedIn URL and phone as hints (never over a field edited by hand), kind `prospect`, and the campaign's visibility. Rows for one email run in order, so two submissions from one person never race. A deleted (tombstoned) contact is skipped, not brought back.
- Each lead's contact joins the campaign as a member in the group "LinkedIn lead", so the campaign page lists them; members are then recomputed. `linkedin.lead` tagged with a campaign now counts as engaged (`STAGE_OF` in `results.ts`), and the Engaged tile's caption says "Read the brief, clicked or sent a lead form".
- One audit row per import (`import.linkedin`) with counts only.
- Limits: 500 rows and about 3 MB a file; a larger export is split. 500 leads took 3.9 s against Azurite; live Table Storage is slower per call, and 500 keeps a request well inside the function timeout.
- `POST /api/admin/import/linkedin` takes `{ csv, mapping?, campaign?, confirm? }` as JSON through the shared admin checks. Without `confirm` it returns the preview; with it, it imports into a campaign the user may see. The page reads the file in the browser and sends its text; the route parses it in memory and logs nothing from it.
- `/admin/import`: pick a campaign (LinkedIn campaigns first) or create one, choose the file, adjust the column mapping (each change re-runs the preview), see the first 10 rows and the counts, and import. The result shows imported, new contacts, already imported, skipped (with line numbers) and members added, with a link to the campaign. Import is enabled in the admin nav.
- Fixture: `scripts/market/fixtures/linkedin-leads-sample.csv`, made up, under example.test: 8 rows, 4 ready (one person twice), 4 skipped for each reason.
- Checks: one pure (reader, times, mapping, row checks, request checks) and two storage checks (fixture import and re-import, no unmapped value stored, audit holds counts only; 500 leads). 40 pass.
- Verified in a local dev preview against Azurite: created a campaign from the page, preview 4 ready and 4 skipped, imported 4 with 3 new contacts and 3 members; the same file again previewed 0 ready and 4 already imported with Import disabled; remapping the email column re-ran the preview; the campaign page showed 3 members engaged; no horizontal scroll at 375 px; the dev server log held no lead data. The API refused a cross-site request (403), a non-JSON body (415), an unknown field (400), import without a campaign (400), an unknown campaign (404), a mapping to a missing column (400), a header-only file (400) and 501 rows (400).
- Not yet tried with a real Campaign Manager export: none exists until the Design Partner Document ad starts on 2026-12-19. If its headers differ, the mapping can be set on the page, and the aliases in `csv.ts` updated.
