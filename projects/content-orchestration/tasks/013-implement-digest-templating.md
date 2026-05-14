# Task 013: Implement digest templating (HTML + plain text)

**Phase:** 1 — Function logic
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 001, 002 (uses CalendarRow), 012 (uses link builders)
**Tags:** typescript, templating, email, content
**Parallel group:** **A** — runs alongside 010, 011, 012 after Phase 0

## Goal

Pure function that takes a `CalendarRow[]` and produces the digest's
`subject`, `text`, and `html` strings. Multipart email is the
target.

## Context

Per [spec.md §5](../spec.md). Both HTML and plain-text bodies are
generated. HTML is rendered with inline styles (no CSS framework),
target body < 30 KB so Gmail doesn't clip.

## Steps

1. Create `src/notify/digest.ts`.
2. Import `CalendarRow` from `../calendar/types`, `daysUntilPublish` from `../calendar/parse-calendar`, link builders from `../integrations/links`.
3. Export `renderDigest(rows: CalendarRow[], today = new Date(), patExpiryDays: number | null = null): { subject: string; text: string; html: string }`:
   - Sort rows by `daysUntilPublish` ascending (most urgent first).
   - **Subject:**
     - Single row: `[Spaarke content] Due <relative>: "<title>"` (where title comes from frontmatter — but we only have slug here, so use slug as proxy; mention this in the task notes).
     - Multiple rows: `[Spaarke content] <N> pieces due in the next week`.
   - Use `Intl.RelativeTimeFormat("en", { numeric: "auto" })` to format the relative day count.
4. **Plain text** body matches §5.2 exactly. One block per row, separator lines, footer line `(No reply needed — this is an automated daily digest.)`.
5. **HTML** body: same content, rendered as a `<table>` per row, inline styles. Keep it conservative — Gmail-compatible.
6. **PAT expiry warning**: if `patExpiryDays !== null && patExpiryDays < 14`, append a footer line to both bodies: `⚠ GitHub PAT expires in N days — rotate before the function loses access.`

## Expected Outputs

- `azure/functions/content-reminder/src/notify/digest.ts` (~250 lines including HTML template)

## Acceptance Criteria

- [ ] `npm run build` exits 0.
- [ ] Smoke test with 3 fixture rows produces a sensible HTML body when opened in a browser (use `fs.writeFileSync` to dump it to a file and open).
- [ ] Plain-text body is readable in a monospace terminal.
- [ ] Subject line uses `Intl.RelativeTimeFormat` (test with "today", "tomorrow", "in 3 days", "yesterday").
- [ ] PAT-expiry warning footer fires correctly at < 14 days, hidden otherwise.

## Notes

- Subject line uses **slug** as the title placeholder because the calendar has no separate "title" column. If important, the parser can later be extended to peek at the frontmatter of `content/blog/<date>-<slug>.mdx` for the real title — defer to a follow-up.
- HTML template should NOT use a templating library. Plain string concat is fine and keeps the function bundle tiny.
- Keep total HTML body < 30 KB. For 5 rows that's plenty of headroom.
