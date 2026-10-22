# Task 010: Storage and notification functions

**Phase:** 1 (Server side)
**Status:** completed
**Estimated:** 2 hours
**Dependencies:** none
**Tags:** api, storage, azure, typescript

## Goal

`saveDesignPartnerApplication()` and `sendDesignPartnerNotification()` exist,
typecheck, and follow their models exactly.

## Context

Spec FR-08 and FR-09. The table and the email are the record of
applications; nothing goes to Dataverse or the CRM.

## Steps

1. Define a `DesignPartnerApplication` type: the eight form fields, the
   attribution fields from `submissionProps()`, `ipHash`, `submittedAt`.
2. In `src/lib/storage.ts`, add `saveDesignPartnerApplication()` modelled on
   `saveDemoRequestLead()`: table `DesignPartnerApplications`, create on
   first use, partition key by month, row key unique, never throws, failures
   to `trackException`, a logged skip when `STORAGE_ACCOUNT_CONNECTION` is
   absent.
3. In `src/lib/email.ts`, add `sendDesignPartnerNotification()` modelled on
   `sendEarlyReleaseNotification()`: to `CONTACT_EMAIL_TO`, from
   `SENDGRID_FROM_EMAIL`, reply-to the applicant, subject "Design partner
   application: {organization}", every field and the attribution in the
   body, HTML-escaped as the other notifications do.
4. Run `npm run typecheck`.
5. Verify acceptance criteria are met.
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/storage.ts` (modified)
- `src/lib/email.ts` (modified)

## Acceptance Criteria

- [ ] Both functions typecheck and never throw to the caller
- [ ] Missing settings produce a logged skip, not an error
- [ ] The email sets reply-to to the applicant and escapes user input

## Notes

The early-release route writes its entity inline. Use the
`saveDemoRequestLead()` shape in `storage.ts` instead, so the route stays
thin.
