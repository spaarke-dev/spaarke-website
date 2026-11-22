# Task 034: Follow-ups

**Phase:** 3 (Admin pages)
**Status:** done
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

- [x] Bulk create adds exactly one follow-up per selected member, and running it twice does not double them.
- [x] Due and overdue follow-ups show on `/admin`.

## Notes

- Task 031's merge and delete already move or remove rows in `MaFollowUps` partitioned by contact ID, and any index row in that table with a `contactId` property. Keep both shapes so merge and delete stay complete.

- Spec references: FR-11, FR-15.

## As built

- `src/lib/market/followups.ts`: `MaFollowUps` rows partitioned by contact ID (title, due date, status, notes, campaign, visibility, created, updated and closed times), plus an index row in `due:<yyyy-mm>` while a follow-up is open (`todo` or `drafted`). Closing it removes the index row; reopening or moving the due date rewrites it. Index rows carry `contactId`, so task 031's merge and delete move or remove them; a check confirms both.
- Due dates are days in the host's time zone (`MEET_HOST_TIME_ZONE`, default America/New_York, the zone the admin pages show). `todayKey()` gives today there.
- Bulk IDs come from the campaign, the title (case and spaces ignored) and the contact, so the same bulk create run again finds what it made and adds nothing. A later run with the same title keeps the first due date and notes.
- `src/lib/market/followup-admin.ts`: input checks, add, edit, status change and delete on a contact, bulk create, and the home list. Audit actions: `followup.create`, `followup.edit`, `followup.status`, `followup.delete` (entity ID `<contact>/<follow-up>`) and `followup.bulk_create` (on the campaign, with the selection and counts). Moving an open follow-up to `sent` or `replied` adds one `followup.done` entry to the contact's timeline.
- `src/lib/market/followup-select.ts`: the selection rule (effective member status, group, contact tag), shared by the server and the campaign page's live count.
- API: `POST /api/admin/contacts/[id]/followups`, `PATCH` and `DELETE /api/admin/contacts/[id]/followups/[followUpId]`, `POST /api/admin/campaigns/[slug]/followups`. Routes sit under the contact and campaign they belong to, so they reuse `contactRequest` and `campaignRequest` (role, same site, visibility).
- Pages: the contact page lists follow-ups (open first, overdue marked) with add (optionally linked to one of the contact's campaigns), edit, status and delete. The campaign page has "Add follow-ups": title, due date, notes, statuses, group and tag, with the member count shown before anything is created. `/admin` shows "Follow-ups due" (today and overdue, oldest first, up to 50) with a status control on each row; investor contacts' follow-ups need the investor role, checked against the contact's current visibility.
- Checks: one pure (input, bulk IDs, today in the host zone, selection) and two storage checks (one follow-up through its statuses with the due list and audit; bulk create once and again, by status, group and tag, then merge and delete). 43 pass.
- Verified in a local dev preview against Azurite: bulk follow-ups for three engaged members, a second run reported all three already there; the home list showed them and dropped one when marked sent there; on a contact page, added an overdue follow-up, edited its notes, deleted it, and marked another sent, which put "Follow-up done" on the timeline; no horizontal scroll at 375 px on the home and campaign pages. The API refused a cross-site request (403), a missing due date (400), an unknown campaign (400), an unknown status (400), an unknown or malformed follow-up ID (404), an unknown bulk field (400) and an unknown campaign for bulk (404).
