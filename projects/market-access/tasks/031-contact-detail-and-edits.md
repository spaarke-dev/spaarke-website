# Task 031: Contact detail and edits

**Phase:** 3 (Admin pages)
**Status:** done
**Estimated:** 4 hours
**Dependencies:** 030, 013
**Tags:** nextjs, react, api, storage

## Goal

`/admin/contacts/[id]` shows the profile, timeline, campaign memberships and follow-ups, and supports edit, add note, log activity, merge and delete, each audited.

## Context

FR-03, FR-05, FR-15, FR-17, NFR-06.

## Steps

1. Detail page: profile, timeline (newest first, paged), memberships, follow-ups. Email activities link to Outlook with the stored web link.
2. Admin API routes under `src/app/api/admin/contacts/[id]/` (all behind `requireAdminApi`): `PATCH` edit, `POST note`, `POST activity` (`meeting.in_person`, `linkedin.message`, `note`), `POST merge`, `DELETE`.
3. Merge: move activities, memberships and follow-ups to the surviving contact, add the other email as an alternate, delete the merged record, audit both.
4. Delete: remove the contact, its activities (both tables), memberships and follow-ups; write a tombstone with the email hash; audit without the email.
5. Confirmations for merge and delete in the UI.

## Expected outputs

- `src/app/admin/contacts/[id]/page.tsx`
- `src/app/api/admin/contacts/[id]/**/route.ts`
- `src/lib/market/contacts.ts` (merge, delete)

## Acceptance criteria

- [x] After a delete, re-running an import does not bring the contact back (FR-17 acceptance).
- [x] A merge leaves one contact with every activity from both.
- [x] Every edit, merge and delete writes an audit row.

## Notes

- Spec references: FR-03, FR-05, FR-15, FR-17, NFR-06.

## As built

- Merge, delete, edit and logging live in `src/lib/market/contact-admin.ts` rather than `contacts.ts`: they need the activity and campaign modules, which already import `contacts.ts`.
- Routes: `PATCH` and `DELETE` on `/api/admin/contacts/[id]`, `POST .../activity` (note, in-person meeting or LinkedIn message; one route serves the "add note" and "log activity" steps) and `POST .../merge`. Each checks the admin role, refuses a cross-site request (`Sec-Fetch-Site`, with Origin as a fallback, since the Host header behind Static Web Apps may not be the public host), requires a JSON body, and treats a contact the user may not see as not found.
- Edit: only known fields; an emptied field is stored as an empty string. Name, title, LinkedIn, phone and kind join `editedFields` when changed by hand, so later forms and imports leave them alone. Visibility can be changed only with the `investor` role. A save with no change writes no audit row.
- Merge: the other contact's activities keep their row keys under the survivor; the month index rows and idempotency markers are pointed at the survivor, so a repeat of an already moved event is still a duplicate. Memberships move (where both were members, the survivor's row is kept and gaps are filled), and code and brief lookups now find the survivor. The other's email and alternates become the survivor's alternates. Empty survivor fields are filled from the other, tags joined, visibility widened. Two audit rows: `contact.merge` on the survivor and `contact.merged_into` on the other.
- Delete: tombstones for the primary and every alternate email are written first, so no writer can bring the person back mid-delete. Then activities, month index rows, markers, memberships, code and brief lookups, follow-ups, alias rows and the contact go. The audit row holds the contact ID (a hash) and counts, no email or name.
- Follow-ups: merge and delete already handle rows in `MaFollowUps` partitioned by contact ID, and index rows elsewhere in that table carrying a `contactId` property. Task 034 should keep that shape. The page shows a placeholder for follow-ups until then.
- UI: the timeline pages 50 at a time (`?after=`); email activities link to Outlook only for Microsoft hosts. Merge is two steps (find and show what moves, then confirm). Delete opens a warning and goes ahead on a Confirm delete click (until 2026-11-25 it also needed the contact's email typed; Ralph dropped that step). Contact names on the list and home page link here.
- Verified in a local dev preview against Azurite: add note, edit stage, merge and delete through the UI; the API refused a cross-site request (403), a non-JSON body (415) and an unknown field (400). No horizontal scroll at 375 px.
- Checks: one pure (patch parsing, same-site rule) and three storage checks (edit and log, merge, delete with tombstones); 32 pass.
