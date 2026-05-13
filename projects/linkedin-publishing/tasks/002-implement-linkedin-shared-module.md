# Task 002: Implement `scripts/linkedin-shared.ts`

**Phase:** 0 — Foundation
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 001
**Tags:** typescript, azure, keyvault, foundation

## Goal

The single source of truth for KV access, token types, app
identification, and common errors. Every other LinkedIn script
imports from here.

## Context

Per [spec §3.2](../spec.md), the KV layout has two parallel sets of
secrets (`linkedin-member-*` and `linkedin-org-*`). The shared
module abstracts the "which app" choice into a single `App` enum so
no other script hardcodes secret names.

## Steps

1. Create `scripts/linkedin-shared.ts`.
2. Export the `App` type: `export type App = "member" | "org"`.
3. Export `LinkedInTokens` shape:
   ```ts
   export interface LinkedInTokens {
     accessToken: string;
     refreshToken: string;
     expiresAt: string;   // ISO 8601
     authorUrn: string;   // urn:li:person:... or urn:li:organization:...
   }
   ```
4. Export `LinkedInCredentials` shape: `{ clientId: string; clientSecret: string }`.
5. Implement `getSecretClient()`: returns a memoized `SecretClient` using `DefaultAzureCredential` against `https://sprk-demo-kv.vault.azure.net/`.
6. Implement `getCredentials(app: App): Promise<LinkedInCredentials>` — reads `linkedin-{app}-client-id` and `linkedin-{app}-client-secret`.
7. Implement `getTokens(app: App): Promise<LinkedInTokens | null>` — returns null if any of the four token secrets is missing.
8. Implement `setTokens(app: App, tokens: LinkedInTokens): Promise<void>` — writes all four atomically (sequential `setSecret` is fine; soft-delete protects us).
9. Implement `getKvVaultName()`: returns `sprk-demo-kv` (hard-coded for v1; spec open question #5 says hard-code, bump quarterly).
10. Export named error classes:
    - `LinkedInAuthError` — for OAuth / token problems
    - `LinkedInApiError` — for API response errors (with `httpStatus` + `responseBody`)
    - `LinkedInConfigError` — for missing KV secrets or env
11. Add a tiny self-check function `pingKv()` that reads `linkedin-member-client-id` and returns its length (used by `pnpm linkedin:test-kv`).

## Expected Outputs

- `scripts/linkedin-shared.ts` — ~150 lines

## Acceptance Criteria

- [ ] `pnpm exec tsc -p tsconfig.scripts.json --noEmit` exits 0.
- [ ] `pnpm tsx -e "import { pingKv } from './scripts/linkedin-shared.ts'; pingKv().then(n => console.log('OK', n))"` prints `OK 14` (the client-id length).
- [ ] No secret values logged anywhere — only lengths or counts.
- [ ] All exported types are named (no anonymous `as` casts at boundaries).

## Notes

- Use `DefaultAzureCredential` — falls through `az login` locally and managed identity in Azure Function. No code changes needed between environments.
- KV soft-delete is on, so accidental writes are recoverable for 90 days. No need for atomic-write tricks.
- Don't import this module from Next.js code — it pulls in the Azure SDK which Turbopack chokes on (see existing `applicationinsights` workaround in `next.config.ts`).
