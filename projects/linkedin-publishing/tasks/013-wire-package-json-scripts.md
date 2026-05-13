# Task 013: Wire `npm run linkedin:*` scripts in package.json

**Phase:** 1 — Personal-account end-to-end
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 002, 003, 010, 011
**Tags:** package-json, scripts, devops

## Goal

Operator runs `npm run linkedin:auth`, `npm run linkedin:publish`,
`npm run linkedin:test-kv` directly without remembering `tsx` paths.

## Context

The skill in task 012 shells out to these npm scripts. Each one
runs a TypeScript file via `tsx` against `tsconfig.scripts.json`.

## Steps

1. Open `package.json`.
2. Under `"scripts"`, add (alphabetically grouped with existing scripts):
   ```json
   "linkedin:auth": "tsx scripts/linkedin-auth.ts",
   "linkedin:publish": "tsx scripts/linkedin-publish.ts",
   "linkedin:refresh": "tsx scripts/linkedin-refresh-token.ts",
   "linkedin:test-kv": "tsx -e \"import { pingKv } from './scripts/linkedin-shared.ts'; pingKv().then(n => console.log('KV reachable, client-id length:', n)).catch(e => { console.error(e); process.exit(1); })\"",
   "linkedin:status": "tsx scripts/linkedin-status.ts"
   ```
3. The `linkedin:status` script doesn't exist yet (task 040) — that's OK, the entry can be wired now since npm only resolves it when invoked.

## Expected Outputs

- `package.json` — five new scripts under `"scripts"`

## Acceptance Criteria

- [ ] `npm run linkedin:test-kv` prints `KV reachable, client-id length: 14`.
- [ ] `npm run linkedin:auth --help` (or `--app=member`) launches the auth flow (assumes task 010 done).
- [ ] `npm run linkedin:publish --help` (or `--slug=foo --target=personal --dry-run`) shows usage or runs dry (assumes task 011 done).
- [ ] No new dependencies added.

## Notes

- Don't add a `prepublish` hook or anything that runs automatically. These scripts are operator-only.
- Avoid prefixing with `dev:` — these aren't dev tasks, they're operational.
