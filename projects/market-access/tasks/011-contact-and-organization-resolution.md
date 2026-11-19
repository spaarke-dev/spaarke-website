# Task 011: Contact and organization resolution

**Phase:** 1 (Store and activity log)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 010
**Tags:** typescript, azure, storage

## Goal

`resolveContact()` turns an email (plus optional name, title, organization name, LinkedIn URL, phone) into exactly one contact, creating it and its organization when needed, and refusing to re-create a deleted contact.

## Context

FR-03 (one record per person, alternate emails), FR-04 (organizations by domain, free-mail never creates one), FR-17 (tombstones stop re-creation). Every writer and importer goes through this one function.

## Steps

1. `src/lib/market/contacts.ts`:
   - `findContactByEmail(email)`: point read on the primary key, then on the alternate-email index (`MaContacts` partition `email:<hh>` rows pointing to the primary).
   - `resolveContact(input, { visibility, source })`: tombstone check first (`MaTombstones`, keyed by email hash), then find, else create with `stage: "new"`, `kind` from input or `other`, the given visibility, `source` set to the first activity's type, and `createdAt`/`updatedAt`. Fill empty fields from input on later calls; never overwrite a field Ralph edited (track `editedFields`).
   - Returns `{ contact, created }` or `{ tombstoned: true }`.
   - Visibility only ever widens to `investor`, never narrows automatically.
2. `src/lib/market/organizations.ts`:
   - `resolveOrganization(email, orgName?)`: skip free-mail domains; key by domain; an override row (`domain-override:<domain>`) can point a domain at another organization.
   - Link the contact to it.
3. Concurrency: create with `createEntity` and treat 409 as "someone else created it", then read it back.
4. Extend `scripts/check-market.mts`: same email twice with different capitalization gives one contact; two contacts at `example-co.test` share one organization; a gmail address creates none; a tombstoned email is refused.

## Expected outputs

- `src/lib/market/contacts.ts`, `src/lib/market/organizations.ts`
- `scripts/check-market.mts` additions

## Acceptance criteria

- [ ] The FR-03 and FR-04 acceptance cases pass in the check script.
- [ ] A tombstoned email never produces a contact.
- [ ] Two concurrent `resolveContact` calls for the same new email produce one contact.

## Notes

- Merge (FR-03) is in task 031; it moves activities and adds the old email as an alternate.
- Spec references: FR-03, FR-04, FR-17.
