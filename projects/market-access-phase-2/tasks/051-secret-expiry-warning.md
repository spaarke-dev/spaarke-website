# Task 051: Secret expiry warning

**Phase:** 5 (Health)
**Status:** not-started
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

- [ ] With the setting 20 days ahead, the report shows the warning and the date.
- [ ] Without the setting, the report says the date is unknown.

## Notes

- The date is not secret, but it is not read from Entra, so the setting must change at each rotation.
- Spec references: FR-14.
