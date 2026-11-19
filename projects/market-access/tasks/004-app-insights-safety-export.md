# Task 004: App Insights safety export

**Phase:** 0 (Foundations)
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** none
**Tags:** azure, storage

## Goal

A private JSON export of every `brief.read` and `ask_ai.click` custom event since the site started emitting them, saved under `C:\code_files\spaarke-research`, so the 2027-02-11 retention deadline no longer puts the TLTF engagement history at risk.

## Context

FR-13 must read these events before 2027-02-11, when the 2026-11-13 send data leaves App Insights' 90-day retention. The backfill (task 052) is late in the plan. Exporting the raw events now costs an hour and removes the risk; task 052 can then read either the live data or this file.

## Steps

1. Query with the Azure CLI, always passing `--offset 90d` (the default is the last hour):

   ```bash
   az monitor app-insights query --app <app> --resource-group <rg> --offset 90d \
     --analytics-query "customEvents | where name in ('brief.read','ask_ai.click') | project timestamp, name, customDimensions, client_CountryOrRegion, client_City, session_Id, user_Id" \
     -o json
   ```

2. Save the result to `C:\code_files\spaarke-research\market-access\appinsights-engagement-<yyyy-mm-dd>.json`. Never inside the repo.
3. Record the row count per event name and the earliest and latest timestamps in `projects/market-access/notes/appinsights-export.md` (counts and dates only, no dimensions).
4. Update `TASK-INDEX.md`.

## Expected outputs

- Private export file in `C:\code_files\spaarke-research\market-access\`
- `projects/market-access/notes/appinsights-export.md` (counts only)

## Acceptance criteria

- [ ] The earliest timestamp predates the 2026-11-13 send.
- [ ] Counts are recorded, and no event content is committed.

## Notes

- The memory note on `az app-insights query` applies: without `--offset`, old data looks lost.
