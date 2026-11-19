# Task 041: Mailbox registry

**Phase:** 4 (Mailbox sync)
**Status:** not-started
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

- [ ] Add, pause and remove work and are audited.
- [ ] A mailbox's last error shows on the page.

## Notes

- Spec references: FR-08, NFR-06.
