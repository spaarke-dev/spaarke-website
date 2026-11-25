# Task 051: Secret expiry warning

**Phase:** 5 (Health)
**Status:** done
**Estimated:** 1 hour
**Dependencies:** none
**Tags:** config, azure

## Goal

The morning report warns 30 days before the Graph app's secret expires, and says so plainly when it does not know the date.

## Context

FR-14. The `/meet` booking and the mail sync share one secret (expires 2027-11-13). When it expires, both stop.

## Steps

1. In `src/lib/reports/daily.ts`, read `MEET_GRAPH_SECRET_EXPIRES` (yyyy-mm-dd):
   - within 30 days or past: a warning with the date;
   - set and further out: one quiet line with the date;
   - missing or malformed: "Secret expiry date unknown".
2. Add the setting to the secret rotation steps in `docs/market-access-mailboxes.md` and `/meet`'s setup notes.
3. With Ralph's go-ahead, set it: `az staticwebapp appsettings set -n swa-spaarke-website -g rg-spaarke-website --setting-names MEET_GRAPH_SECRET_EXPIRES=2027-11-13`.
4. Checks with canned dates: 20 days ahead, 60 days ahead, past, missing.
5. Update TASK-INDEX.md.

## Expected outputs

- Changes to `src/lib/reports/daily.ts`, `docs/market-access-mailboxes.md`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [x] With the setting 20 days ahead, the report shows the warning and the date.
- [x] Without the setting, the report says the date is unknown.

## Notes

- The date is not secret, but it is not read from Entra, so the setting must change at each rotation.
- Spec references: FR-14.

## As built

- `src/lib/reports/daily.ts`: `secretSection` reads `MEET_GRAPH_SECRET_EXPIRES`. Within 30 days: "Warning: the secret expires on <date>, in N days. Rotate it before then." Past: "Warning: the secret expired on <date>. The /meet booking and the mail sync have stopped." Further out: "Expires <date>." Missing or malformed: "Secret expiry date unknown. Set MEET_GRAPH_SECRET_EXPIRES (yyyy-mm-dd) on the site." It is the last section of the report, whether or not storage is set.
- `docs/meet-graph-booking.md`: the setting in the table, at secret creation, and in the rotation steps; `docs/market-access-mailboxes.md` points to it.
- Checks with canned dates: 20 days ahead, 60 days ahead, past, missing and malformed.
- Step 3, 2026-11-25: set on the site with Ralph's go-ahead, matching the secret's end date on the app registration.
