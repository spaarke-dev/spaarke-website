# Task 041: Implement `npm run linkedin:revoke`

**Phase:** 4 — Polish & docs
**Status:** not-started
**Estimated:** 45 minutes
**Dependencies:** 002
**Tags:** cli, security, lifecycle
**Parallel group:** **C** — runs alongside 040, 042, 043

## Goal

Clean disposal: revoke a LinkedIn token, clear the related KV
secrets, leave the system in a "no tokens, no posting" state.
Needed for operator handoff or when migrating credentials.

## Context

Spec §10 #10 — privacy/GDPR posture for stored tokens. The system
holds operator-personal credentials; we need a documented disposal
path.

## Steps

1. Create `scripts/linkedin-revoke.ts`.
2. Parse args: `--app=member|org` (required), `--confirm` (flag, required to actually revoke — without it, dry-run).
3. Without `--confirm`:
   - Show what *would* be revoked (app, expiry, URN).
   - Print: "Add --confirm to actually revoke."
   - Exit 0.
4. With `--confirm`:
   - Load tokens for the app.
   - Call LinkedIn's token-revoke endpoint:
     `POST https://www.linkedin.com/oauth/v2/revoke` with body `token=<access_token>&token_type_hint=access_token&client_id=<id>&client_secret=<secret>`.
   - Also revoke the refresh token (`token_type_hint=refresh_token`).
   - On success (or even on failure — LinkedIn doesn't always 200 these), proceed to KV cleanup.
   - Delete the four token-related secrets from KV (keep `client-id` and `client-secret` — those are app-level, not session-level):
     - `linkedin-<app>-access-token`
     - `linkedin-<app>-refresh-token`
     - `linkedin-<app>-token-expires-at`
     - `linkedin-<app>-author-urn`
5. Print: "Revoked. To re-authorize, run `npm run linkedin:auth --app=<app>`."

## Expected Outputs

- `scripts/linkedin-revoke.ts` — ~120 lines

## Acceptance Criteria

- [ ] `npm run linkedin:revoke --app=member` (no --confirm) shows what would be revoked; exits 0.
- [ ] `npm run linkedin:revoke --app=member --confirm` deletes the four KV secrets; subsequent `npm run linkedin:status` shows "Not authenticated" for member.
- [ ] Re-running `npm run linkedin:auth --app=member` after revoke restores function.
- [ ] No accidental deletion of `linkedin-<app>-client-id` or `linkedin-<app>-client-secret` (those are app-level).

## Notes

- KV soft-delete is on (90-day recovery window), so an accidental revoke is undoable. Still: require `--confirm`.
- LinkedIn's revoke endpoint sometimes returns 200 for tokens it's already revoked. Treat that as success.
- Add this script to the docs (task 042) as the "what to do when an operator leaves" path.
