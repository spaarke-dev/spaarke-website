# Task 010: Implement `scripts/linkedin-auth.ts` (one-shot OAuth CLI)

**Phase:** 1 — Personal-account end-to-end
**Status:** not-started
**Estimated:** 2.5 hours
**Dependencies:** 002
**Tags:** typescript, oauth, linkedin, cli
**Parallel group:** **A** — runs alongside 011 and 012 after Phase 0

## Goal

A one-shot CLI the operator runs once per app per year (or when a
refresh token is revoked). Opens the browser, captures the OAuth
callback, exchanges code for tokens, fetches the author URN, writes
everything to KV.

## Context

Per [spec §5.1](../spec.md). This is the operator-friendly path —
no manual URL copying, no curl wrangling. Two-app support: `--app=member`
uses Sign In with LinkedIn scopes; `--app=org` uses Community
Management API scopes.

## Steps

1. Create `scripts/linkedin-auth.ts`.
2. Parse CLI args: `--app=member|org` (required).
3. Define scope set per app:
   - `member`: `openid profile email w_member_social`
   - `org`: `r_organization_social w_organization_social rw_organization_admin`
4. Load credentials from KV: `getCredentials(app)`.
5. Generate a random `state` (16 bytes base64) — store in a local in-memory variable for CSRF protection.
6. Start an ephemeral HTTP server on `127.0.0.1:3030` (port 3000 reserved for Next.js dev). Single route handler at `/auth/linkedin/callback`.
7. Build the LinkedIn authorization URL:
   `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=<id>&redirect_uri=http%3A%2F%2Flocalhost%3A3030%2Fauth%2Flinkedin%2Fcallback&state=<state>&scope=<scope>`
8. Print the URL to stdout and call `open(url)` to launch the default browser.
9. In the callback handler:
   - Validate `state` matches.
   - Exchange `code` at `POST https://www.linkedin.com/oauth/v2/accessToken` (form-encoded with `grant_type=authorization_code`, `code`, `redirect_uri`, `client_id`, `client_secret`).
   - On 200: parse response. Save `access_token`, `refresh_token`, compute `expiresAt`.
10. Fetch author URN:
    - `member`: `GET https://api.linkedin.com/v2/userinfo` (with `Authorization: Bearer <access_token>`) → `sub` is `<id>`, build `urn:li:person:<id>`.
    - `org`: `GET https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED` (with `LinkedIn-Version: 202604` + `X-Restli-Protocol-Version: 2.0.0`) → take the first `organization` URN from `elements[0]`. If multiple, print the list and ask the operator to choose by index (stay in the HTTP server flow — re-render a small HTML page with the picker).
11. Call `setTokens(app, { accessToken, refreshToken, expiresAt, authorUrn })`.
12. Send the browser a small "Success — you may close this tab" HTML page.
13. Close the HTTP server. Print to stdout: `Token stored. Access valid until <YYYY-MM-DD>. Refresh valid for 365 days.`
14. Exit 0.

## Expected Outputs

- `scripts/linkedin-auth.ts` — ~250 lines

## Acceptance Criteria

- [ ] `npm run linkedin:auth --app=member` opens the browser, completes the LinkedIn flow, and exits with "Token stored" plus an expiry date.
- [ ] After success, `npm run linkedin:test-kv` (from task 002) can read `linkedin-member-access-token` and `linkedin-member-author-urn`.
- [ ] On state mismatch, the server returns 400 and exits with a clear error.
- [ ] On Linkedin denial (operator clicks "Cancel" in the LinkedIn consent screen), the script exits cleanly with the LinkedIn-provided error description.
- [ ] No secret values logged. The access token, refresh token, and client secret never appear in stdout/stderr.

## Notes

- Use Node's built-in `http` module — keep dependencies minimal.
- The `open` package handles cross-platform browser launch.
- For `--app=org`, the operator must have ADMINISTRATOR role on the Spaarke Company Page; the picker page handles the case where they admin multiple pages.
- Don't try to be clever about server-side OAuth state persistence — the script is single-shot and dies after the callback.
