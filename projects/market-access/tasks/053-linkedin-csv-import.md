# Task 053: LinkedIn Lead Gen CSV import

**Phase:** 5 (Imports and backfill)
**Status:** not-started
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

- [ ] Importing the same file twice adds nothing the second time (FR-14 acceptance).
- [ ] The uploaded file is never written to storage or disk.
- [ ] Success criterion 5 holds.

## Notes

- Spec references: FR-14.
