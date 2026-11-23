# Task 042: Sync engine and schedule

**Phase:** 4 (Mailbox sync)
**Status:** done (live acceptance after merge)
**Estimated:** 4 hours
**Dependencies:** 040, 041, 033, 034
**Tags:** nextjs, api, azure, ci-cd

## Goal

Every 30 minutes a GitHub Action asks the site to sync each enabled mailbox in turn; known-contact mail becomes email activities, bounces are logged, member statuses update, and follow-ups close themselves.

## Context

FR-07, FR-09, FR-11. Route shape and workflow shape follow `src/app/api/reports/daily/route.ts` and `.github/workflows/daily-report.yml`: one bearer secret, constant-time compare, trimmed token.

## Steps

1. `src/app/api/market/sync/route.ts`: bearer token `MA_SYNC_TOKEN`; 503 when unset; loops enabled mailboxes one at a time; per-mailbox try and catch writing `lastSyncAt` and `lastError`; returns a JSON summary (counts only).
2. `src/lib/market/sync.ts`:
   - checkpoint per mailbox and folder in `MaSyncState`, with a small overlap so nothing at the boundary is missed (idempotency handles repeats);
   - for each message, the counterparts (recipients for sent, sender for received); for each counterpart that is a known contact, `recordActivity` with `email.sent` or `email.received`, source `graph:<mailbox hash>`, source ID the `internetMessageId` plus counterpart, subject and web link, and the mailbox;
   - bounces: `email.bounced` against the original recipient;
   - unknown counterparts: ignored in `known-only`; in `capture-new`, inbound only, handed to triage (task 043);
   - after each new email activity, update member status and follow-ups: `todo` or `drafted` to `sent` on an outgoing email created after the follow-up, to `replied` on their reply.
3. `.github/workflows/mail-sync.yml`: `*/30 * * * *`, `workflow_dispatch`, calling `https://spaarke.com/api/market/sync` with `MA_SYNC_TOKEN`; fails the run on non-200.
4. Ralph sets `MA_SYNC_TOKEN` in app settings and GitHub secrets (instructions in the PR; Claude does not set secrets without his go-ahead).

## Expected outputs

- `src/app/api/market/sync/route.ts`, `src/lib/market/sync.ts`
- `.github/workflows/mail-sync.yml`

## Acceptance criteria

- [ ] A sent email to a known contact appears on their timeline within 30 minutes (FR-07 acceptance).
- [x] Mail to an unknown address from a `known-only` mailbox creates nothing.
- [x] A failing mailbox records its error and the others still sync.
- [ ] Success criterion 3 holds.

## Notes

- Follow-up auto-close (FR-11): for an `email.sent` to a contact after a follow-up's `createdAt`, call `changeFollowUp(contactId, id, { status: "sent" }, "system")` from `src/lib/market/followup-admin.ts` on each of that contact's open follow-ups (`listContactFollowUps` in `followups.ts`); on `email.received`, move `sent` ones to `replied`. That keeps the audit row and the due index in step.
- After each sync, call `recomputeAllCampaigns()` from `src/lib/market/results.ts` so member statuses follow new mail (task 033). It writes only member rows whose status changed.

- Spec references: FR-07, FR-09, FR-11, NFR-02, NFR-05.

## As built

- `src/lib/market/sync.ts`: `syncAll` takes the enabled mailboxes one at a time, the longest unsynced first; `syncMailbox` reads Sent Items, then the Inbox, so a follow-up closed by a sent email can be marked replied in the same run.
- Checkpoints: `MaSyncState`, partition the mailbox ID, row key the folder. A run starts five minutes before the checkpoint; a mailbox with none starts 30 days back (`FIRST_LOOKBACK_DAYS`). The checkpoint moves to the last message handled, also when a later one fails.
- Activities: source `graph`, source ID the type, a hash of the internet message ID and a hash slice of the counterpart. Not `graph:<mailbox>` as the task said: keyed on the message, one email seen in two synced mailboxes is logged once. No address in the source ID. Each activity records its mailbox, subject and Outlook link.
- Bounces: an Inbox non-delivery report is read once (task 040), and `email.bounced` goes on the contact whose address failed. A report for an address that is not a contact is counted and dropped.
- Unknown counterparts: ignored in `known-only`. In `capture-new`, inbound mail from a human outside the mailbox's own domain is queued in `MaTriage` (`src/lib/market/triage.ts`: sender, display name, subject, time, link, mailbox; partition the sender hash, row key the message key). Automated senders (no-reply, notifications, postmaster and similar), blocked senders and domains, and deleted contacts are not queued. Writing the queue now means no message is lost before the triage page (task 043) exists. Nothing becomes a contact.
- Follow-ups (FR-11): a `todo` or `drafted` follow-up becomes `sent` on an email to the contact after it was created, and a `sent` one becomes `replied` on their email after that. The change is dated at the email, with `system` as who, so the audit entry and the `followup.done` activity carry the email's time.
- After a run that logged any email, `recomputeAllCampaigns()` derives member statuses again.
- `POST /api/market/sync`: bearer `MA_SYNC_TOKEN` (trimmed, constant-time compare), 503 without it or without the Graph and storage settings. It stops starting new messages after 25 seconds, inside the Static Web Apps limit of about 45, and the next run continues. A failed mailbox records its error on `/admin/mailboxes` and the run still answers 200. The answer has counts and mailbox IDs only.
- `.github/workflows/mail-sync.yml`: every 30 minutes and on demand; fails on a non-200 answer; warns when a mailbox failed. `MA_SYNC_TOKEN` was already set in the app settings and GitHub secrets during the tenant setup (2026-11-20), so nothing is left for Ralph to set.
- Checks: one pure check (counterparts, triage rules, overlap and first lookback, keys) and one storage check against canned Graph answers (logging, bounce, triage only for the shared inbox, both follow-up moves, a mailbox without access failing alone, a second run adding nothing, the deadline). 51 pass.
- Read-only estimate against the live mailboxes and contacts, 2026-11-23, counts only: the personal mailbox has 883 messages in 30 days with 229 distinct counterparts, none of them a contact yet, and 13 bounces; contactus@spaarke.com has 63, of which 4 would go to triage. Reading the personal mailbox took 34 seconds from a local machine, so its first catch-up may take two runs.
- Live acceptance after the merge: run the workflow by hand, then check `/admin/mailboxes` (last sync times, no errors) and the run's counts. The "within 30 minutes" acceptance needs an email to a known contact; most contacts arrive with the TLTF import (task 050).
