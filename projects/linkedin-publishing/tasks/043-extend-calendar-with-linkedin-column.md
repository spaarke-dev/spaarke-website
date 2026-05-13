# Task 043: Extend `content-platform/calendar.md` with LinkedIn-posted column

**Phase:** 4 — Polish & docs
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 011
**Tags:** content-platform, calendar, schema
**Parallel group:** **C** — runs alongside 040, 041, 042

## Goal

The calendar reflects when a piece was promoted on LinkedIn, per
target. The publish CLI writes to this column on success.

## Context

Spec §10 #4 — agreed format: a new `linkedin-posted` column with
the post URL. Today the calendar has no such column.

## Steps

1. Open `content-platform/calendar.md`.
2. Identify the existing row schema (markdown table or YAML
   front-matter list — depends on current shape).
3. Add a new column / field per row:
   - **Column header**: `LinkedIn (personal)` | `LinkedIn (company)` (two columns)
   - **Cell content**: either empty or a `[date](url)` markdown link
4. Back-fill historical rows where you know the LinkedIn URL (the existing 17 published articles — for the ones already promoted, you can paste the LinkedIn URL by hand).
5. Update `scripts/linkedin-publish.ts` (task 011) to append/update the relevant row when posting:
   - Locate the row matching the slug.
   - Update the appropriate column with `[YYYY-MM-DD](url)`.
6. Update `content-platform/CLAUDE.md` schema description if it references the calendar columns.

## Expected Outputs

- `content-platform/calendar.md` — schema updated, historical rows back-filled
- `scripts/linkedin-publish.ts` — calendar-update logic refined
- Possibly `content-platform/CLAUDE.md` — schema description updated

## Acceptance Criteria

- [ ] Calendar shows both columns clearly.
- [ ] After publishing the next piece, the relevant column populates automatically.
- [ ] Back-filled rows have plausible URLs (operator can check by clicking through).
- [ ] No existing column data lost or shifted.

## Notes

- If the calendar is a markdown table, take care that the column alignment doesn't break — wide URLs may need a shorter format like `2026-05-13` instead of the full URL (and the URL goes in a footnote or separate file).
- Alternative formats: a JSON file alongside the markdown could hold structured data. Out of scope unless the markdown is fighting us.
