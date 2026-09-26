# Task 001: Record the Foundry deployment and wire app settings

**Phase:** 0 (Foundation and cost truth)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** none
**Tags:** azure, config, deploy

## Goal

The website can authenticate to its own Foundry deployment from a
server-side context, and the details are recorded where later tasks can
find them.

## Context

The owner created the website-specific Foundry project by hand on
2026-09-25, separate from the product's Foundry resources so marketing
traffic cannot consume product quota and the spend is attributable on its
own. This task captures what was created and wires it in. It does not
create the resource.

Everything else in the project depends on this task.

## Steps

1. Get from the owner: resource name, deployment name, region scope, model
   id as deployed, and whether authentication is Entra ID or an API key.
2. Record them in `notes/foundry-deployment.md`, including the base URL
   `https://<resource-name>.services.ai.azure.com/anthropic`.
3. Note that the deployment name, not the model id, is what goes in the
   `model` parameter at call time. This is a common source of 404s.
4. Add app settings to Azure Static Web Apps. For Entra ID:
   `FOUNDRY_BASE_URL`, `FOUNDRY_DEPLOYMENT`, plus the Entra app
   registration values. For an API key: `FOUNDRY_BASE_URL`,
   `FOUNDRY_DEPLOYMENT`, `FOUNDRY_API_KEY`.
5. Mirror the same names in `.env.local` for local development, and confirm
   `.env.local` is git ignored.
6. If Entra ID, assign the **Cognitive Services User** role to the
   principal the website runs as.
7. Install `@anthropic-ai/foundry-sdk`. Note it is not `@anthropic-ai/sdk`.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `notes/foundry-deployment.md` - resource, deployment, auth, base URL
- Azure SWA app settings added
- `.env.local` populated locally
- `package.json` - `@anthropic-ai/foundry-sdk` added

## Acceptance Criteria

- [ ] A minimal call from a Node script returns a completion
- [ ] The call runs server-side only; no key or token reaches the browser
- [ ] `notes/foundry-deployment.md` records everything a later session needs
- [ ] The deployment name used in `model` matches the deployment, not the
      model id

## Notes

Two failure modes worth recognizing quickly.

**401 or 403.** For Entra ID, confirm scope `https://ai.azure.com/.default`
and the Cognitive Services User role. For an API key, the header is
`x-api-key`, not `Authorization`.

**400 saying data retention is required.** The subscription has Zero Data
Retention enabled and the model is an Anthropic Covered Model. Microsoft
cannot change this. It needs Anthropic directly, or a different
subscription. Raise it with the owner rather than working around it.

See spec KD-02 and Dependencies.
