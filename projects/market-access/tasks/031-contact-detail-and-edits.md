# Task 031: Contact detail and edits

**Phase:** 3 (Admin pages)
**Status:** not-started
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

- [ ] After a delete, re-running an import does not bring the contact back (FR-17 acceptance).
- [ ] A merge leaves one contact with every activity from both.
- [ ] Every edit, merge and delete writes an audit row.

## Notes

- Spec references: FR-03, FR-05, FR-15, FR-17, NFR-06.
