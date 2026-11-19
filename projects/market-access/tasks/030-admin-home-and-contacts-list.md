# Task 030: Admin home and contacts list

**Phase:** 3 (Admin pages)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 002, 012
**Tags:** nextjs, react, tailwind, responsive

## Goal

`/admin` shows recent activity and new contacts this week (with slots for follow-ups and triage, filled by tasks 034 and 043), and `/admin/contacts` lists contacts with search and filters.

## Context

FR-15 and FR-02. Desktop-first and usable on a phone at events. Every read applies the visibility filter.

## Steps

1. Server-rendered pages under `src/app/admin/`; data read with server functions in `src/lib/market/queries.ts`.
2. Home: recent activity from `MaActivityByMonth` (this month and last), new contacts in the last 7 days.
3. Contacts list: search over name, email and organization; filters for kind, stage, tag and campaign; paged. For Phase 1 volume (NFR-04: 10,000 contacts) a filtered scan with a short in-process cache is acceptable; record the measured time.
4. Shared admin UI pieces in `src/components/admin/` (table, filter bar, badge, empty state) on the v2 tokens and Fluent icons.
5. Check at 375 px width.

## Expected outputs

- `src/app/admin/page.tsx`, `src/app/admin/contacts/page.tsx`
- `src/lib/market/queries.ts`, `src/components/admin/*`

## Acceptance criteria

- [ ] Both pages render for `admin` and refuse others.
- [ ] An admin without `investor` sees no investor contact and no count that includes one.
- [ ] Search finds a contact by part of the name, email or organization.

## Notes

- Spec references: FR-02, FR-15, NFR-04, NFR-07.
