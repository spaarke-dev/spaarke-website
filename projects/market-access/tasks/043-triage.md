# Task 043: Triage

**Phase:** 4 (Mailbox sync)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 042
**Tags:** nextjs, react, api, storage

## Goal

Inbound mail from unknown senders to a `capture-new` mailbox waits in `/admin/triage` until Ralph accepts, links or dismisses it, and nothing becomes a contact without that choice.

## Context

FR-08 (`capture-new` mode), NFR-05 (triage holds sender, subject, time and link only; dismissed entries deleted after 30 days).

## Steps

1. `MaTriage`: partition the sender's email hash, row key the message ID hash; fields sender, display name, subject, received time, web link, mailbox, state.
2. Block list rows: `block:sender:<hash>` and `block:domain:<domain>`; the sync skips blocked senders and domains.
3. `/admin/triage`: one row per sender with message count; actions:
   - Accept: `resolveContact` with the mailbox's default visibility, then `email.received` activities for every queued message from that sender;
   - Link to an existing contact: add the address as an alternate email, then the same activities;
   - Dismiss sender, or dismiss domain.
4. The triage count on `/admin`.
5. Cleanup: each sync run deletes dismissed entries older than 30 days.

## Expected outputs

- `src/lib/market/triage.ts`
- `src/app/admin/triage/page.tsx`, `src/app/api/admin/triage/**/route.ts`

## Acceptance criteria

- [ ] A test email to contactus@spaarke.com from a new address appears in triage within 30 minutes.
- [ ] Accepting it creates one contact and one activity.
- [ ] A dismissed sender does not reappear.
- [ ] Success criterion 7 holds.

## Notes

- Spec references: FR-08, NFR-05.
