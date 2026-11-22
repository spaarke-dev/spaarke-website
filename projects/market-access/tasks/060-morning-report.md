# Task 060: Morning report sections

**Phase:** 6 (Reporting and privacy)
**Status:** done
**Estimated:** 2 hours
**Dependencies:** 034
**Tags:** typescript, api

## Goal

The morning digest gains two sections: follow-ups due today or overdue, and contacts created in the period, with investor records shown only as a count.

## Context

FR-16. `src/lib/reports/daily.ts` builds the digest and `/api/reports/daily` sends it to a list, so no investor name may appear.

## Steps

1. Add both sections to `buildDailyReport` and `renderDailyReport`, reading the follow-up due index and new contacts.
2. Investor records: a single line such as "2 investor contacts (hidden)".
3. A section that cannot be read is reported in `broken`, like the existing sections.
4. Check with `?dry=1` against dev tables.

## Expected outputs

- `src/lib/reports/daily.ts`

## Acceptance criteria

- [x] Both sections render in a dry run with made-up data.
- [x] No investor name or email appears.

## Notes

- Due and overdue follow-ups: `dueFollowUps(todayKey())` in `src/lib/market/followups.ts` reads the due index; `dueForHome` in `followup-admin.ts` adds contact names and the visibility check, so pass no investor role and report investor rows as a count only.

- Spec references: FR-16.

## As built

- `src/lib/reports/daily.ts` adds two sections after Leads: "Follow-ups" (open follow-ups due today or earlier, oldest first, each with title, contact name and email, and campaign; overdue ones show their due date) and "New contacts" (contacts created in the report's window, newest first, with organization and the first activity). Each lists up to 25 and then says how many more.
- Investor records appear only as a count line, such as "2 investor follow-ups (hidden)": no name, email, firm, title or follow-up title. A follow-up counts as investor when it or its contact is investor-only (`dueForReport` in `followup-admin.ts`); a contact counts as investor by its own visibility.
- Each section catches its own failure and reports it in `problem`, so it shows in the route's `broken` list and the mail still goes. Both are skipped with the other storage sections when `STORAGE_ACCOUNT_CONNECTION` is not set.
- An empty section's first line starts with "No", so a day with nothing due and no new contacts still counts as quiet.
- The footer now says follow-ups and contacts come from the admin records and that investor records are counted, never named.
- Checks: one storage check (a general contact with an overdue follow-up and an investor contact with one, both new; the report lists the first and counts the second, and the rendered text holds no investor name, email, domain or follow-up title). 44 pass.
- Dry run with `npm run report:daily` against Azurite (`MA_TABLE_SUFFIX=Check`): both sections rendered with made-up data and counted investor records as hidden.
- Not tried against the live tables: the route's `?dry=1` needs the report token, which stays in the app settings. The first morning mail after the merge is the live check.
