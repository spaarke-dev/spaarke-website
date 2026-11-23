# Task 042: Sync engine and schedule

**Phase:** 4 (Mailbox sync)
**Status:** not-started
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
- [ ] Mail to an unknown address from a `known-only` mailbox creates nothing.
- [ ] A failing mailbox records its error and the others still sync.
- [ ] Success criterion 3 holds.

## Notes

- Follow-up auto-close (FR-11): for an `email.sent` to a contact after a follow-up's `createdAt`, call `changeFollowUp(contactId, id, { status: "sent" }, "system")` from `src/lib/market/followup-admin.ts` on each of that contact's open follow-ups (`listContactFollowUps` in `followups.ts`); on `email.received`, move `sent` ones to `replied`. That keeps the audit row and the due index in step.
- After each sync, call `recomputeAllCampaigns()` from `src/lib/market/results.ts` so member statuses follow new mail (task 033). It writes only member rows whose status changed.

- Spec references: FR-07, FR-09, FR-11, NFR-02, NFR-05.
