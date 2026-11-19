# Task 034: Follow-ups

**Phase:** 3 (Admin pages)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 031, 033
**Tags:** nextjs, react, api, storage

## Goal

Follow-ups can be added on a contact or in bulk for a campaign segment, edited through their statuses, and seen as due and overdue on `/admin`.

## Context

FR-11 and FR-15. The first real use is "Thank-you after the Summit." Automatic moves to `sent` and `replied` come with mail sync (task 042).

## Steps

1. `src/lib/market/followups.ts`: `MaFollowUps`, partition contact ID, plus a due-date index (partition `due:<yyyy-mm>`) for the home list.
2. Contact page: add, edit, change status, delete.
3. Campaign page: bulk create for members picked by status or tag, one follow-up each, with title, due date and notes.
4. Home: due today and overdue, oldest first.
5. Audit status changes.

## Expected outputs

- `src/lib/market/followups.ts`
- `src/app/api/admin/followups/**/route.ts`
- Additions to the contact, campaign and home pages

## Acceptance criteria

- [ ] Bulk create adds exactly one follow-up per selected member, and running it twice does not double them.
- [ ] Due and overdue follow-ups show on `/admin`.

## Notes

- Spec references: FR-11, FR-15.
