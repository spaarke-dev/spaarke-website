# Task 061: Privacy page

**Phase:** 6 (Reporting and privacy)
**Status:** done (wording approved by Ralph 2026-11-23)
**Estimated:** 1 hour
**Dependencies:** 031
**Tags:** content, nextjs

## Goal

The privacy page describes the contact and activity records: purpose, sources (forms, meetings, email with Spaarke, LinkedIn leads, engagement with links Spaarke sends), what is stored (no email bodies), retention, and how to ask for deletion.

## Context

FR-17 and the retention assumption (contacts until deleted, activities three years).

## Steps

1. Draft the new section in plain language; run it past Ralph before merge.
2. Update `src/app/privacy/page.tsx` and its last-updated date.
3. `npm run voice:lint` if it covers the page text; otherwise check by hand.

## Expected outputs

- `src/app/privacy/page.tsx`

## Acceptance criteria

- [x] Ralph approves the wording.
- [x] The deletion route on the page matches the delete action in task 031.

## Notes

- Spec references: FR-17, Assumptions (retention).

## As built

- A new section, "Contact and activity records" (`#contact-records`), sits in Part 1 of `/privacy` after the form data section. It covers:
  - **Purpose:** keeping track of business relationships.
  - **What a record holds:** name, work email, organization, and where given or public, title, LinkedIn and phone, plus dated entries with short summaries.
  - **Sources:** forms, bookings and LinkedIn lead forms; email with the team mailboxes we connect (subject, participants, time and a link only, never bodies or attachments); triage for a shared inbox; meetings, including in person; personal links in our emails, with mail scanner visits left out; and team notes.
  - **Storage and access:** Azure Table Storage in a US region, seen only by team members with admin access. Not sold, not used for advertising or automated decisions.
  - **Retention:** a contact is kept until deleted or no longer needed; entries for no more than three years.
  - **Deletion:** by email to privacy@spaarke.com. The record, its entries, outreach list places and follow-ups are deleted, and a one-way hash of the address is kept so nothing adds it back. This matches `deleteContact` in task 031.
- The "Your rights" deletion bullet links to the section, and the last-updated date is 2026-11-23.
- Voice lint finds no issue in the new section. The 14 em dashes it flags were on the page before this task.
- Checked locally at 375 px: no horizontal scroll, the section anchor works, no server errors.
- Not built yet: an automatic purge of activity entries older than three years. The earliest entries (form submissions from 2026) would be due in 2029.
