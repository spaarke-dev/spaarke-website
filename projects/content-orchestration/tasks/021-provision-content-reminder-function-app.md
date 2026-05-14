# Task 021: Provision the content-reminder Azure Function App

**Phase:** 2 — Azure provisioning + deploy
**Status:** not-started
**Estimated:** 10 minutes
**Dependencies:** 014 (local build proven)
**Tags:** azure, functions, provisioning, devops

## Goal

A new Function App `spaarke-content-reminder` exists in
`rg-spaarke-demo`, Consumption plan, Node 24, ready to receive a
deployment.

## Context

Per [spec.md §3.2](../spec.md). Same Azure-CLI pattern as the
LinkedIn refresh function. Linux Consumption is unavailable in this
RG (per the spec note), so the function ends up on Windows kind —
no impact for Node code.

## Steps

1. From a terminal with `az login` active:

   ```bash
   az functionapp create \
     --name spaarke-content-reminder \
     --resource-group rg-spaarke-demo \
     --consumption-plan-location westus2 \
     --runtime node --runtime-version 24 --functions-version 4 \
     --storage-account sprkdemosa \
     --query "{name: name, state: state, kind: kind, defaultHostName: defaultHostName}" -o table
   ```

   (Don't pass `--os-type Linux` — the RG rejects it. Letting it default produces Windows kind, which is fine.)

2. Confirm the response shows `state: Running`. Azure usually
   auto-provisions an Application Insights resource of the same
   name; capture the warning message if present.

3. (Optional) Set the function's `WEBSITE_RUN_FROM_PACKAGE` mode to
   `1` for atomic deploys — the `func azure functionapp publish`
   command does this for you on first deploy.

## Expected Outputs

- New Azure resource `spaarke-content-reminder` (functionapp kind) in `rg-spaarke-demo`
- New Application Insights resource auto-attached
- No code changes

## Acceptance Criteria

- [ ] `az functionapp show -n spaarke-content-reminder -g rg-spaarke-demo --query state -o tsv` returns `Running`.
- [ ] `az functionapp show ... --query kind` returns `functionapp` (Windows; not `functionapp,linux`).
- [ ] Application Insights resource visible in Azure Portal.

## Notes

- Don't deploy code yet — that's task 023, after the managed identity is configured (task 022).
- Cost: Consumption plan free monthly grant covers thousands of executions; one daily reminder is ~30 executions/month. Effective cost ~$0.
