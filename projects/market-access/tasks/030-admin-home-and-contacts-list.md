# Task 030: Admin home and contacts list

**Phase:** 3 (Admin pages)
**Status:** done
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

- [x] Both pages render for `admin` and refuse others.
- [x] An admin without `investor` sees no investor contact and no count that includes one.
- [x] Search finds a contact by part of the name, email or organization.

## Notes

- Spec references: FR-02, FR-15, NFR-04, NFR-07.

## As built

- `src/lib/market/queries.ts`: `loadContacts` scans contact rows with the OData visibility filter and joins organization names, leaving off any organization the user may not see. The scan is cached for 30 seconds per visibility scope. `filterContacts` is the pure search and filter; every search word must appear in the name, email, organization name or domain. `recentActivity` reads this month and last from `MaActivityByMonth` and shows an activity only when both it and its contact are visible, since a contact can become investor after its early activities were written.
- The campaign filter lists only campaigns the user may see; a campaign slug the user may not see filters to nothing rather than being ignored.
- Shared pieces in `src/components/admin/`: `DataTable`, `FilterBar` (a plain GET form, so filtered lists have their own URL), `Pager`, `Badge`, `EmptyState`, labels and dates in `format.ts` (host time zone, as `/meet`). Fluent icons render through a client `icons.tsx`, since they read React context.
- The admin area now sits on a light slab (`data-tone="light"`) with the v2 tokens. The nav shows the signed-in user.
- Follow-ups and triage have placeholder panels on the home page for tasks 034 and 043. Contact names do not link yet; the detail page comes with task 031.
- Measured scan time (step 3): 10,000 made-up contacts in the Azurite emulator, `loadContacts` took 160 to 200 ms and the filter under 2 ms. Live Table Storage returns 1,000 rows per page, so a cold scan at that size is about 10 round trips, likely 1 to 2 seconds; the cache covers repeat views. If the live time is too slow, the next step is a narrower `select` and a longer cache.
- Checked at 375 px: no horizontal scroll on either page; less important columns hide and the time moves under the activity.
- Checks: one pure check (search, filters, paging) and one storage check (lists, counts, recent activity and campaign filters without the investor role); 28 pass.
