# Task 003: Implement `scripts/linkedin-refresh-token.ts`

**Phase:** 0 — Foundation
**Status:** not-started
**Estimated:** 1.5 hours
**Dependencies:** 002
**Tags:** typescript, oauth, linkedin, foundation

## Goal

Reusable refresh-token logic that's called by `linkedin-publish.ts`
inline (when posting and access token is near-expired) and by the
Azure Function on a daily timer. One implementation, two callers.

## Context

LinkedIn access tokens are 60-day TTL; refresh tokens are 365-day
TTL. LinkedIn rotates refresh tokens on every refresh, so the new
refresh token must be persisted atomically with the new access
token.

Spec §5.3 documents the lifetime details. The function must handle
the "refresh token rejected" case (returns 401 from the refresh
endpoint) by raising a typed error the caller can map to a clear
operator message.

## Steps

1. Create `scripts/linkedin-refresh-token.ts`.
2. Import `App`, `LinkedInTokens`, `getCredentials`, `getTokens`, `setTokens`, `LinkedInAuthError` from `./linkedin-shared.ts`.
3. Export `refreshIfNeeded(app: App, windowDays = 7): Promise<LinkedInTokens>`:
   - Loads tokens via `getTokens(app)`.
   - If null → throw `LinkedInAuthError("No tokens stored for app=<app>. Run pnpm linkedin:auth --app=<app>.")`.
   - If `expiresAt` is more than `windowDays` away → return tokens unchanged.
   - Otherwise call `refreshNow(app)`.
4. Export `refreshNow(app: App): Promise<LinkedInTokens>`:
   - Load credentials + current tokens.
   - `POST https://www.linkedin.com/oauth/v2/accessToken` (form-encoded):
     - `grant_type=refresh_token`
     - `refresh_token=<currentRefreshToken>`
     - `client_id=<clientId>`
     - `client_secret=<clientSecret>`
   - On 200: parse `{ access_token, expires_in, refresh_token, refresh_token_expires_in }`. Build new `LinkedInTokens`. Persist via `setTokens(app, ...)`. Return.
   - On 401: throw `LinkedInAuthError("Refresh token rejected for app=<app>. The refresh token is expired, revoked, or invalid. Run pnpm linkedin:auth --app=<app> to re-authorize.")`.
   - On any other error: throw `LinkedInAuthError(\`Refresh failed (HTTP <status>): <body>\`)`.
5. Export `daysUntilExpiry(tokens: LinkedInTokens): number` — pure helper, used by the Function for logging.
6. Compute `expiresAt`: `new Date(Date.now() + expires_in * 1000).toISOString()`.

## Expected Outputs

- `scripts/linkedin-refresh-token.ts` — ~100 lines

## Acceptance Criteria

- [ ] Type-checks clean against the scripts tsconfig.
- [ ] Smoke test: with valid tokens in KV, `refreshIfNeeded` returns existing tokens (windowDays default) without making any network call.
- [ ] With `windowDays = 999`, `refreshIfNeeded` triggers a real refresh, and the new `expires_at` is later than the old one.
- [ ] Forcing an invalid refresh token (e.g., manually edit the KV value to garbage) produces a clean `LinkedInAuthError` with the actionable message — no stack trace dump.
- [ ] No secret values appear in logs.

## Notes

- LinkedIn's refresh-token endpoint is on `linkedin.com`, not `api.linkedin.com`. Easy to get wrong.
- Use Node 18+ native `fetch` and `URLSearchParams`. No axios needed.
- The 5-min safety window (when called from `linkedin-publish.ts` immediately before posting) is documented in spec §6.2; expose it via the `windowDays` parameter (caller passes `0.0035` ≈ 5 min for the inline path — keep it as days for unit consistency).
