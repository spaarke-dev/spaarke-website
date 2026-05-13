# Task 021: Implement the refresh function logic

**Phase:** 2 — Azure Function refresh loop
**Status:** not-started
**Estimated:** 1.5 hours
**Dependencies:** 020
**Tags:** azure, functions, linkedin, oauth
**Parallel group:** **B** — runs alongside 022 and 023 after 020

## Goal

The function body that runs daily, checks token expiry for both
apps, refreshes when within 7 days of expiring, writes new tokens
back to KV.

## Context

Per [spec §5.2](../spec.md). Uses the shared refresh logic
duplicated into the Functions project in task 020.

## Steps

1. Open `azure/functions/linkedin-token-refresh/refresh/index.ts`.
2. Import `refreshIfNeeded`, `daysUntilExpiry`, `App` from the duplicated `src/linkedin/linkedin-refresh-token.ts`.
3. Implement the handler:
   ```ts
   export default async function refreshHandler(context, timer) {
     const apps: App[] = ["member", "org"];
     const results: { app: App; outcome: string; daysLeft?: number; error?: string }[] = [];

     for (const app of apps) {
       try {
         const tokens = await refreshIfNeeded(app, 7);
         const daysLeft = daysUntilExpiry(tokens);
         results.push({ app, outcome: daysLeft < 7 ? "refreshed" : "skipped", daysLeft });
         context.log.info(`[linkedin] ${app}: ${results[results.length - 1].outcome}, ${daysLeft}d remaining`);
       } catch (e) {
         results.push({ app, outcome: "failed", error: (e as Error).message });
         context.log.error(`[linkedin] ${app}: ${(e as Error).message}`);
       }
     }

     // Hand off to alerting (task 023)
     await notifyOnResults(results);
   }
   ```
4. Wrap in try/catch so a `member`-app failure doesn't block the `org`-app check.
5. Use `context.log` for App Insights integration (it's automatic once App Insights is wired in).
6. If neither app has tokens stored (both `getTokens` return null), skip silently — this is the pre-OAuth state.

## Expected Outputs

- `azure/functions/linkedin-token-refresh/refresh/index.ts` — ~80 lines

## Acceptance Criteria

- [ ] `npm run build` succeeds locally.
- [ ] `func start` running locally with a manual timer-trigger curl invocation (`curl -X POST http://localhost:7071/admin/functions/refresh -H 'Content-Type: application/json' -d '{}'`) processes both apps and logs the outcomes.
- [ ] When forced to refresh (set a member token's expires-at to now), the function refreshes and writes new tokens.
- [ ] When a refresh token is invalid (set garbage in KV), the function logs the typed `LinkedInAuthError` message — but does NOT crash the whole invocation.

## Notes

- This task runs in parallel with 022 (managed identity) — function won't have KV access yet from a managed identity until that lands, but you can test locally via `az login` because `DefaultAzureCredential` falls through.
- The `notifyOnResults` call is a stub until task 023 fills it in.
- Don't load secrets into env vars — read from KV at runtime via the shared module.
