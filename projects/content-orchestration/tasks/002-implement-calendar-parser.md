# Task 002: Implement the calendar parser

**Phase:** 0 — Foundation
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 001
**Tags:** typescript, parser, content-platform

## Goal

Pure-functional markdown table parser that turns the contents of
`content-platform/calendar.md` (a string) into a typed
`CalendarRow[]`, then applies the window filter.

## Context

Per [spec.md §4](../spec.md). The parser is the meat of this
project — everything downstream depends on its output. Schema-flex:
parse by column-header name, not column-index, so adding/reordering
calendar columns won't break the reminder.

## Steps

1. Create `src/calendar/types.ts`:
   - `interface CalendarRow { slug, type, publishDate (ISO YYYY-MM-DD), status, author, campaign, linkedinPersonal, linkedinCompany, notes }`
   - Status is `"idea" | "brief" | "outline" | "draft" | "review" | "scheduled" | "published"`
2. Create `src/calendar/parse-calendar.ts` exporting:
   - `parseCalendar(markdown: string): CalendarRow[]` — full parser, no filter.
   - `filterDueInWindow(rows: CalendarRow[], today = new Date()): CalendarRow[]` — applies the window filter from spec §4.4: `status in {brief, outline}` AND `publish_date in [today - 1, today + 7]`. Skip quarter rows (`YYYY-Qn`).
   - `daysUntilPublish(row: CalendarRow, today = new Date()): number` — used by digest sorter.
3. Parser logic:
   - Split markdown on `/^## /m` to get sections.
   - For each section, locate the markdown table (header row, separator row, then data rows).
   - Skip non-table sections ("Idea backlog" if it has a different shape).
   - For each data row: split by `|`, trim cells, build header-name → cell-value map from the header row, then construct `CalendarRow`.
   - Empty cells become null where the type allows; `LinkedIn (personal)` / `LinkedIn (company)` already use `[YYYY-MM-DD](url)` format — extract just the URL via regex.
4. Date parsing:
   - `2026-05-15` → real Date.
   - `2026-Q3` → return `null`; caller filters these out.
5. Write a tiny local test in the same file (under `if (import.meta.main)` is fine for Node v22+, or a separate test file):
   - Read `content-platform/calendar.md` from the local repo.
   - Parse it.
   - Print the count + first 3 filtered rows.

## Expected Outputs

- `azure/functions/content-reminder/src/calendar/types.ts` (~30 lines)
- `azure/functions/content-reminder/src/calendar/parse-calendar.ts` (~150 lines)

## Acceptance Criteria

- [ ] `npm run build` exits 0.
- [ ] Manually parsing the live `calendar.md` produces non-zero rows.
- [ ] Quarter rows (`2026-Q3`) are skipped.
- [ ] `filterDueInWindow` correctly returns pieces in the [today-1, today+7] window.
- [ ] Reordering a calendar column doesn't break the parser (test by swapping two adjacent columns in a fixture).

## Notes

- Don't bring in a markdown parser dep — the table format is simple enough for regex. Goal is to keep this function self-contained and tiny.
- Output type matches §4.3 schema exactly. Header names from the live calendar:
  `Slug | Type | Publish | Status | Author | Campaign | LinkedIn (personal) | LinkedIn (company) | Notes`.
- The `LinkedIn (personal)` / `LinkedIn (company)` cells are `[YYYY-MM-DD](url)` or empty. Parser extracts URL only; reminder doesn't use these but the type carries them for future Phase 3.
