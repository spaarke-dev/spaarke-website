# Task 040: Implement `pnpm linkedin:status`

**Phase:** 4 — Polish & docs
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 002, 003
**Tags:** cli, devops, observability
**Parallel group:** **C** — runs alongside 041, 042, 043

## Goal

A health-check CLI that the operator runs anytime to confirm
LinkedIn integration is alive — both apps' token expiry, KV access,
and last successful publish.

## Context

The Azure Function emails on failure, but the operator needs an
on-demand check that doesn't require waiting for an email. This is
also the script the wrap-up task uses to verify the system is
shippable.

## Steps

1. Create `scripts/linkedin-status.ts`.
2. For each app (`member`, `org`):
   - Try `getTokens(app)`. If null → "Not authenticated. Run pnpm linkedin:auth --app=<app>."
   - If tokens present: print `expiresAt`, `daysUntilExpiry`, `authorUrn`.
   - Warn (yellow) if `daysUntilExpiry < 14`.
   - Error (red) if expired or invalid.
3. Try a lightweight LinkedIn API call to confirm the token actually works:
   - `member`: `GET https://api.linkedin.com/v2/userinfo`
   - `org`: `GET https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED`
   - On 200: ✓ valid
   - On 401: ✗ invalid (token rejected)
4. Show last publish: read `content-platform/calendar.md` last LinkedIn entry per target.
5. Output:
   ```
   LinkedIn integration status:
     ✓ member: token valid, 47 days remaining (urn:li:person:abc123)
       Last publish: 2026-05-12 — the-iq-stack
     ⚠ org: token expires in 11 days (urn:li:organization:18799005)
       Last publish: 2026-05-13 — what-is-loi
   ```
6. Exit code: 0 if both apps OK, 1 if any warning, 2 if any error.

## Expected Outputs

- `scripts/linkedin-status.ts` — ~150 lines

## Acceptance Criteria

- [ ] `pnpm linkedin:status` prints the report and exits 0 in a healthy state.
- [ ] When `linkedin-org-*` is unpopulated (pre-OAuth), org row says "Not authenticated".
- [ ] Output uses simple ANSI colors (no big terminal library).
- [ ] No secret values appear in output.

## Notes

- Use Node's `process.stdout.isTTY` to gate colors.
- Don't make this script trigger a refresh — it's read-only by design.
- This script is the first one operator should run after an `az login` lapse to see if KV is reachable.
