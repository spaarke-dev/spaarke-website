# Task 020: Scaffold the token-refresh Azure Function

**Phase:** 2 — Azure Function refresh loop
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 003 (refresh logic must exist)
**Tags:** azure, functions, timer, devops

## Goal

A new Azure Functions app called `spaarke-linkedin-refresh` with a
timer-triggered function scaffolded against the existing
`linkedin-refresh-token.ts` logic.

## Context

Per spec §10 #1 the decision is a new isolated Functions app (not
co-located with `spaarke-bff-demo`). Isolation gives clean logs and
keeps the LinkedIn integration's failure modes from polluting the
BFF.

## Steps

1. Verify `func` (Azure Functions Core Tools v4) is installed: `func --version`. If not: `npm i -g azure-functions-core-tools@4 --unsafe-perm true`.
2. Create the Functions project directory:
   ```bash
   mkdir -p azure/functions/linkedin-token-refresh
   cd azure/functions/linkedin-token-refresh
   func init --worker-runtime node --language typescript
   func new --template "Timer trigger" --name refresh
   ```
3. Edit `host.json` to set `version: "2.0"` and `functionTimeout: "00:05:00"`.
4. Edit `refresh/function.json` schedule: `"schedule": "0 0 2 * * *"` (daily 02:00 UTC).
5. Adjust `package.json` to share types with the scripts/ tree where possible — but keep it self-contained (no `file:` deps; Functions deploy must be standalone).
6. Add the same Azure SDK deps as scripts/: `@azure/identity`, `@azure/keyvault-secrets`.
7. Copy the contents of `scripts/linkedin-shared.ts` and `scripts/linkedin-refresh-token.ts` into the Functions project under `src/linkedin/`. **Yes, duplicate the code** — Functions packaging is simpler when the bundle is self-contained, and the modules are small + stable. Add a comment at the top of each duplicate file pointing back to the canonical version.
8. Verify it builds: `npm install && npm run build`.
9. Provision the Azure Functions App (don't deploy yet — task 024):
   ```bash
   az functionapp create \
     --name spaarke-linkedin-refresh \
     --resource-group rg-spaarke-demo \
     --consumption-plan-location westus2 \
     --runtime node --runtime-version 20 --functions-version 4 \
     --storage-account sprkdemosa \
     --os-type linux
   ```

## Expected Outputs

- `azure/functions/linkedin-token-refresh/` — new directory
- `host.json`, `function.json`, `refresh/index.ts` (timer scaffold), `package.json`, `tsconfig.json`
- Azure: empty Functions App `spaarke-linkedin-refresh` provisioned in westus2

## Acceptance Criteria

- [ ] Local `func start` runs and shows the timer trigger registered.
- [ ] `az functionapp show -n spaarke-linkedin-refresh -g rg-spaarke-demo` returns success.
- [ ] No code yet — just the scaffold. Function fires on schedule but does nothing meaningful.
- [ ] `git status` shows only the new `azure/functions/linkedin-token-refresh/` tree.

## Notes

- Choosing **Consumption plan** keeps cost minimal (free for thousands of executions/month). Upgrade only if we need always-on.
- The duplicate-code decision (step 7) trades DRY for deployment simplicity. If the duplicated modules diverge later, we add a sync check to the Phase 4 wrap-up.
- Use the existing storage account `sprkdemosa` to avoid creating another one.
