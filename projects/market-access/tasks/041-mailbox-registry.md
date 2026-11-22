# Task 041: Mailbox registry

**Phase:** 4 (Mailbox sync)
**Status:** done
**Estimated:** 2 hours
**Dependencies:** 002, 010
**Tags:** nextjs, react, api, storage

## Goal

`/admin/mailboxes` lists the synced mailboxes from `MaMailboxes` and adds, pauses or removes them, showing each one's last sync time and last error.

## Context

FR-08. Mailbox addresses live only in `MaMailboxes`, never in code or app settings.

## Steps

1. `src/lib/market/mailboxes.ts`: CRUD over `MaMailboxes` (partition `mailbox`, row key the address hash) with address, label, kind (`personal` or `shared`), mode (`known-only` or `capture-new`), default visibility, enabled, last sync time, last error.
2. Page and admin API to add, edit, pause and remove; audited.
3. A clear note on the page: adding here does not grant access; link to `docs/market-access-mailboxes.md`.
4. Seed Ralph's mailbox (`personal`, `known-only`) and contactus@spaarke.com (`shared`, `capture-new`, `general`) through the page, not through code.

## Expected outputs

- `src/lib/market/mailboxes.ts`
- `src/app/admin/mailboxes/page.tsx`, `src/app/api/admin/mailboxes/**/route.ts`

## Acceptance criteria

- [x] Add, pause and remove work and are audited.
- [x] A mailbox's last error shows on the page.

## Notes

- Spec references: FR-08, NFR-06.

## As built

- `src/lib/market/mailboxes.ts`: `MaMailboxes`, partition `mailbox`, row key the SHA-256 of the address. Fields: address, label, kind, mode, visibility, enabled, `lastSyncAt`, `lastError` and `lastErrorAt`, `checkedAt` and `checkError`.
- Input: `parseNewMailbox` takes one address; the kind picks the usual mode (personal: `known-only`; shared: `capture-new`) unless one is given. `parseMailboxPatch` takes label, kind, mode, visibility and enabled; the address is fixed (remove and add again to change it).
- Every change is audited: `mailbox.add`, `mailbox.edit`, `mailbox.pause`, `mailbox.resume`, `mailbox.remove`. Investor default visibility needs the investor role.
- For task 042: `enabledMailboxes()` and `recordSync(id, {error?})`. A success sets `lastSyncAt` and clears the error; a failure keeps the last good time. It merges, so an admin edit during a run is kept, and it never brings back a removed mailbox.
- "Check access" on the page (`POST /api/admin/mailboxes/{id}/check`) asks Graph for at most one Inbox message from the last day, metadata only, and records the outcome apart from the sync's error. Ralph can see whether a mailbox is in the Exchange scope before the first sync.
- Routes: `POST /api/admin/mailboxes`; `PATCH` and `DELETE /api/admin/mailboxes/{id}`; `POST /api/admin/mailboxes/{id}/check`. Page: `/admin/mailboxes`, with the note that adding does not grant access and a link to the guide. The nav link is live.
- Checks: one pure (input) and one storage (add, duplicate, pause, resume, edit, sync and check outcomes against canned Graph answers, remove, audit). 49 pass.
- Verified locally against Azurite: added a made-up shared mailbox through the form (the kind switched the mode to triage), paused, edited the label, saw a recorded sync error on the page, saw "The Graph settings are not configured" from Check access without settings, removed it, and the API refusals (two addresses, a duplicate, an unknown ID). No horizontal scroll at 375 px; no server errors.
- Step 4 (seed Ralph's mailbox and contactus@spaarke.com) is done by Ralph on the live page after the merge, not in code. Then "Check access" on each should say Graph can read it.
