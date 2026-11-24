# Task 011: Add contact

**Phase:** 1 (Target lists)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** none
**Tags:** nextjs, react, api, forms

## Goal

An "Add contact" form on `/admin/contacts` creates one contact, or points to the existing one when the email is already known.

## Context

FR-02. Today a person met in passing can only enter through a form, an import or the mail sync.

## Steps

1. `POST /api/admin/contacts`: email (required), name, title, organization, LinkedIn URL, phone, visibility. Same checks as task 010; investor needs the `investor` role.
2. Use `resolveContact`. When the email (or an alternate email) already belongs to a contact, answer with that contact's ID and create nothing.
3. A new contact gets one `contact.added` activity with source `admin`, shown as "Added by hand". Add the type, label and icon.
4. An "Add contact" button and form on `/admin/contacts`; on success go to the new contact; on "already a contact" show a link to it.
5. Audit `contact.create`.
6. Checks: create, the existing-email answer, investor refusal.
7. Update TASK-INDEX.md.

## Expected outputs

- `src/app/api/admin/contacts/route.ts` (POST)
- `src/components/admin/AddContactForm.tsx`
- Changes to `src/lib/market/types.ts`, `src/components/admin/format.ts`, `src/components/admin/icons.tsx`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] A new person appears in the list with "Added by hand" as the first timeline entry.
- [ ] An email already known creates nothing and links to the contact.
- [ ] The form passes axe and works at 375 px.

## Notes

- Spec references: FR-02, NFR-02, NFR-05.
