# Task 010: Implement GitHub integration (Octokit)

**Phase:** 1 — Function logic
**Status:** not-started
**Estimated:** 45 minutes
**Dependencies:** 001 (deps installed)
**Tags:** typescript, github, octokit, integration
**Parallel group:** **A** — runs alongside 011, 012, 013 after Phase 0

## Goal

Single function that fetches `content-platform/calendar.md` from
GitHub via the Contents API. Returns the decoded markdown string.

## Context

Per [spec.md §4.1](../spec.md). The function reads the calendar at
runtime from `spaarke-dev/spaarke-website` (main branch). Token comes
from KV (fetched by the orchestrator handler, passed in).

## Steps

1. Create `src/integrations/github.ts`.
2. Import `Octokit` from `@octokit/rest`.
3. Export `fetchCalendar(token: string, owner = "spaarke-dev", repo = "spaarke-website", ref = "main"): Promise<string>`:
   ```ts
   const octokit = new Octokit({ auth: token });
   const { data } = await octokit.repos.getContent({
     owner, repo, ref,
     path: "content-platform/calendar.md",
   });
   if (Array.isArray(data) || data.type !== "file") {
     throw new Error("Unexpected response shape from GitHub Contents API.");
   }
   return Buffer.from(data.content, "base64").toString("utf-8");
   ```
4. Optionally export `checkPatExpiry(token): Promise<{daysUntilExpiry: number | null}>`:
   - The PAT-expiry response header from GitHub is `github-authentication-token-expiration` (RFC3339 timestamp).
   - Make a lightweight `GET /` call with `Authorization: token <pat>` and read the header.
   - Return `daysUntilExpiry` (or `null` for classic PATs that don't expire).
   - Used in the digest footer per spec §9 #5.

## Expected Outputs

- `azure/functions/content-reminder/src/integrations/github.ts` (~80 lines)

## Acceptance Criteria

- [ ] `npm run build` exits 0.
- [ ] Smoke test with a real PAT: function returns the calendar markdown string starting with `# Content calendar`.
- [ ] On a bad token: throws with a clear error message.
- [ ] `checkPatExpiry` correctly returns `null` for classic PATs and a positive number for fine-grained.

## Notes

- Use `@octokit/rest` for the typed API; don't roll a manual fetch.
- The token is a function arg, not loaded from KV here — the orchestrator reads KV and passes the value. Keeps this module pure.
- No caching — the calendar fetch is once per day; performance doesn't matter.
