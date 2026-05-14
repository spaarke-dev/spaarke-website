# Task 001: Scaffold the content-reminder Azure Function project

**Phase:** 0 — Foundation
**Status:** not-started
**Estimated:** 45 minutes
**Dependencies:** none
**Tags:** azure, functions, scaffold, devops

## Goal

Create `azure/functions/content-reminder/` with a Functions v4 +
Node 24 + TypeScript scaffold and a timer-trigger placeholder
`remind` function. Pattern mirrors the existing `linkedin-token-refresh`
function exactly.

## Context

Per [spec.md §3](../spec.md). This is the same scaffold work as
LinkedIn task 020 — copy that approach. No Azure resources are
created in this task; that comes in 021.

## Steps

1. `mkdir -p azure/functions/content-reminder` and `cd` in.
2. `func init --worker-runtime node --language typescript`.
3. `func new --template "Timer trigger" --name remind`.
4. Edit `host.json`: `version: "2.0"`, `functionTimeout: "00:05:00"`.
5. Edit `src/functions/remind.ts` schedule to `0 0 13 * * *` (13:00 UTC daily ≈ 09:00 ET DST). Use the same `app.timer(...)` pattern as the LinkedIn refresh function (Node v4 programming model).
6. Add deps to the project's `package.json`:
   - `@azure/identity` ^4.13.1
   - `@azure/keyvault-secrets` ^4.11.2
   - `@octokit/rest` ^21
   - `@sendgrid/mail` ^8
7. Update `tsconfig.json` to match the LinkedIn refresh's pattern: `target: es2022`, `module: node16`, `moduleResolution: node16`, `lib: [es2022]`, `esModuleInterop`, `skipLibCheck`, `types: ["node"]`, plus `include: ["src/**/*.ts"]`.
8. `npm install` and verify `npm run build` exits 0 (the trivial timer scaffold compiles).
9. Add this Function project's `.gitignore` entries if `func init` didn't include them: `node_modules`, `dist`, `local.settings.json` should already be there.

## Expected Outputs

- `azure/functions/content-reminder/` directory tree
- `host.json`, `package.json`, `tsconfig.json`, `local.settings.json`, `.gitignore`, `.funcignore`
- `src/functions/remind.ts` (timer scaffold)

## Acceptance Criteria

- [ ] `npm run build` in the Function dir exits 0.
- [ ] `func start` locally registers `remind` as a timer trigger.
- [ ] No Azure resource calls (resources come in task 021).
- [ ] Git tracks the source files, ignores `node_modules`, `dist`, `local.settings.json`.

## Notes

- Same Linux-rejection RG quirk as LinkedIn refresh: Function App will be Windows kind. No impact for Node code.
- Reference: `azure/functions/linkedin-token-refresh/` for the exact pattern.
