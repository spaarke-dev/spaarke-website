# Task 043: Triage

**Phase:** 4 (Mailbox sync)
**Status:** done (live acceptance after merge)
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
- [x] Accepting it creates one contact and one activity.
- [x] A dismissed sender does not reappear.
- [ ] Success criterion 7 holds.

## Notes

- Spec references: FR-08, NFR-05.

## As built

- The queue itself was built with task 042, so no message from contactus@spaarke.com was lost before this page: `MaTriage`, partition the sender's email hash, row key the message key; block rows in partition `block` with row keys `sender:<hash>` and `domain:<domain>` (the sender block keeps only the hash).
- `src/lib/market/triage.ts`:
  - `listTriage` groups waiting messages by sender, newest first. A sender whose mail came through a mailbox with investor default visibility is investor-only and hidden without the role, including from the actions (404).
  - `acceptSender`: `resolveContact` with the mailbox's default visibility and the display name, an `email.received` activity per queued message, then the queue rows are deleted. A deleted (tombstoned) address is refused.
  - `linkSender`: adds the sender as an alternate email of an existing contact, found by that contact's email address (`addAlternateEmail` in `contacts.ts`; refused when the address is already another contact's), then the same activities.
  - `dismissSender` with scope `sender` or `domain`: writes the block row and marks waiting entries dismissed. A free-mail domain can be dismissed only as a sender.
  - `cleanupDismissed`: each sync run deletes dismissed entries older than 30 days; block rows stay.
  - Every action is audited: `triage.accept`, `triage.link`, `triage.dismiss_sender`, `triage.dismiss_domain`.
- The activities use the sync's source IDs (`src/lib/market/mail-keys.ts`, now shared by both), so mail the sync sees again after an accept is logged once.
- `POST /api/admin/triage/{sender hash}` with `action` accept, link (plus `email`) or dismiss (plus `scope`). Page `/admin/triage`; the Triage nav link is live and `/admin` shows the waiting count.
- After an action the card stays, showing the result and a link to the contact; the list is current on the next visit.
- Checks: one pure check (grouping, visibility) and one storage check (accept, investor mailbox, link, dismiss sender and domain, free-mail refusal, 30-day cleanup, audit). 53 pass.
- Verified locally against Azurite with made-up senders: the home count, accept, link to an existing contact (the message showed on that contact's timeline), dismiss a domain (both senders), dismiss a Gmail sender (no domain button for it), API refusals, no horizontal scroll at 375 px, no server errors.
- Live acceptance after the merge: the 4 senders already waiting from contactus@spaarke.com show on `/admin/triage`; a test email from a new address appears within 30 minutes.
