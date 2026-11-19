# Task 010: Market store

**Phase:** 1 (Store and activity log)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** none
**Tags:** typescript, azure, storage

## Goal

`src/lib/market/` has the table access layer, entity types and key helpers every other market task builds on, with a check script that exercises them against dev tables.

## Context

Spec Key Decisions (the `Ma*` tables), NFR-04 (partitioning) and FR-02 (visibility on every read). The pattern is `src/lib/meet/store.ts`: one cached `TableClient` per table, created once per process, `STORAGE_ACCOUNT_CONNECTION` read at call time, and null when storage is not configured.

## Steps

1. `src/lib/market/tables.ts`: `getTable(name)` with the meet pattern; `MA_TABLE_SUFFIX` appends a suffix (for example `Dev`) to every table name; `isMarketConfigured()`.
2. `src/lib/market/types.ts`: `Visibility`, `ContactKind`, `ContactStage`, `ActivityType` (the FR-05 list), `CampaignKind`, `MemberStatus`, `FollowUpStatus`, and the entity shapes for contacts, organizations, activities, campaigns, members, follow-ups, mailboxes, triage entries, sync state, audit and tombstones.
3. `src/lib/market/keys.ts`:
   - `normalizeEmail(raw)`: trim, lower-case, reject anything that is not a single address;
   - `emailHash(email)`: SHA-256 hex;
   - `contactKeys(email)`: partition is the first two hex characters of the hash, row key is the hash;
   - `invertedTime(ms)` for newest-first row keys;
   - `monthKey(ms)` (`yyyy-mm`) for `MaActivityByMonth`;
   - `emailDomain(email)` and `isFreeMailDomain(domain)` with a short built-in list (gmail.com, googlemail.com, outlook.com, hotmail.com, live.com, msn.com, yahoo.com, icloud.com, me.com, aol.com, proton.me, protonmail.com, gmx.com).
4. `src/lib/market/visibility.ts`: `visibleTo(principal)` returns an OData filter fragment or a predicate, so investor rows are excluded from every list, search and count unless the principal has `investor`.
5. `scripts/check-market.mts` (or extend it): run the helpers on made-up data, and round-trip one entity per table against `*Dev` tables. Add `"market:check": "tsx scripts/check-market.mts"` to `package.json`.
6. `npm run typecheck` and `npm run lint`.

## Expected outputs

- `src/lib/market/tables.ts`, `types.ts`, `keys.ts`, `visibility.ts`
- `scripts/check-market.mts`, `package.json`

## Acceptance criteria

- [ ] `normalizeEmail("  Jane.Doe@Example.COM ")` equals `normalizeEmail("jane.doe@example.com")`.
- [ ] With `STORAGE_ACCOUNT_CONNECTION` unset, every function returns null or a no-op and nothing throws.
- [ ] The check script passes against dev tables and uses only made-up data.

## Notes

- Keep emails out of partition and row keys (hash them), so table keys never expose an address in logs or tooling.
- Spec references: FR-02, FR-03, FR-04, NFR-01, NFR-04, Key Decisions.
