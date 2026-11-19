# Current task

> Context recovery for market access sessions. Update it when a task starts, pauses or finishes.

## Quick recovery

| Field | Value |
|-------|-------|
| **Task** | 001: Auth spike on a preview environment |
| **Step** | 5 of 9: curl tests on the preview, then Ralph's sign-in |
| **Status** | in-progress (waiting on the preview deploy, then on Ralph) |
| **Next action** | Run the signed-out, forged-header and bad-token curl tests against the spike preview; ask Ralph to invite himself with the `admin` role and sign in |

- **Spike branch:** `feat/market-access-auth-spike`, draft PR #163 (never merge).
- **Store branch:** `feat/market-access-store` (tasks 010 to 012 done; PR pending Ralph's go-ahead to merge).
- **Plan:** approved and merged 2026-11-19 (PR #162).

## Open questions and where they stand

| # | Question | Status |
|---|---|---|
| 1 | Reuse the `/meet` Graph app for mail read? | Open; raise at task 003 |
| 2 | Confirm which Summit meetings took place? | Open; raise at task 050 |
| 3 | Default visibility for form-submitted investors? | Open; raise at task 020 |

## Decisions made

- Store checks run against the Azurite emulator (`npx -p azurite azurite-table --inMemoryPersistence`), not the live storage account. The script refuses to touch storage unless `MA_TABLE_SUFFIX` is set.
- Idempotency marker written last; long summaries shortened, not rejected (see task 012 notes).
- Organization visibility: created as the first contact's visibility, becomes `general` when a `general` contact joins.

## Log

- 2026-11-19: spec Owner Clarifications updated (contactus@spaarke.com is a user mailbox with an Exchange license only). Plan, tasks and README generated; plan approved and merged (PR #162).
- 2026-11-19: task 001 spike routes deployed to a preview via draft PR #163.
- 2026-11-19: tasks 010 to 012 built; `npm run market:check` passes 16 checks against Azurite.
