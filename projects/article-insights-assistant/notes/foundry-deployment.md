# Foundry deployment

> Task 001 working notes. No secrets in this file. The API key lives in
> `.env.local` locally and in Azure Static Web Apps app settings in
> production, and this repository is public.

## Resource

| | |
|---|---|
| Resource name | `website-article-agent-resource` |
| Resource group | `rg-website-article-agent` |
| Kind | `AIServices` |
| Region | `eastus2` |
| Foundry project | `website-article-agent` |

Created by the owner on 2026-09-25, separate from the product's Foundry
resources so marketing traffic cannot consume product quota and the spend
is attributable on its own.

## Endpoints

The resource exposes several surfaces and they are not interchangeable.

| Purpose | URL |
|---|---|
| **Claude Messages API, what this project uses** | `https://website-article-agent-resource.services.ai.azure.com/anthropic` |
| Target URI for a direct call | `.../anthropic/v1/messages` |
| Agents | `https://website-article-agent-resource.services.ai.azure.com/api/projects/website-article-agent` |
| Azure OpenAI | `https://website-article-agent-resource.openai.azure.com/openai/v1` |

The Azure OpenAI endpoint does not serve Claude. Using it is the likely
cause of a 404 that looks like a deployment-name problem.

## Authentication

API key, chosen by the owner. Header is `x-api-key`, not `Authorization`.

Entra ID remains available and is cleaner for a server-side call from Azure
Static Web Apps. If the key is ever rotated in a hurry, switching to Entra
ID with `DefaultAzureCredential`, scope `https://ai.azure.com/.default`,
and the **Cognitive Services User** role is the better answer than pasting
a new key.

## Model deployment

Deployed 2026-09-26.

| | |
|---|---|
| Deployment name | `spaarke-website-claude-sonnet-5` |
| Model | `claude-sonnet-5` |
| Version | 2, hosted on Azure |
| SKU | `DataZoneStandard`, US data zone |
| Capacity | 100 |

`spaarke-website-claude-sonnet-5` is what goes in the `model` parameter,
not `claude-sonnet-5`. Passing the model id produces a 404 that reads like
a missing deployment.

Redeployed from `GlobalStandard` to `DataZoneStandard` on 2026-09-26.
Because the resource sits in eastus2, inference stays within the US data
zone. Costs a 1.1x multiplier on every pricing category, which
`cost-model.md` accounts for. The deployment name did not change, so no app
setting or environment variable needed updating.

**Leave the Playground's Instructions, Knowledge and Memory empty.** They
configure the portal Playground and the Agents service, not the Messages
API this project calls, so anything set there would silently do nothing in
production. Each also cuts against a decision already made: the system
prompt belongs in `src/lib/insights/prompt.ts` where a change is a
reviewable diff the evaluation suite can test, Knowledge is a retrieval
store and retrieval is what KD-01 deliberately removed, and Memory
persists context across sessions, which the privacy policy published on
2026-09-25 says this feature does not do.

## Environment variables

Same names locally and in Azure Static Web Apps app settings.

| Name | Value |
|---|---|
| `FOUNDRY_BASE_URL` | the `/anthropic` URL above |
| `FOUNDRY_API_KEY` | secret, never in the repo |
| `FOUNDRY_DEPLOYMENT` | `spaarke-website-claude-sonnet-5` |

## SDK

`@anthropic-ai/foundry-sdk`. Note this is not `@anthropic-ai/sdk`.

Set in Azure Static Web Apps app settings and in `.env.local` on
2026-09-26.

## Open items

- Decide GlobalStandard versus US Data Zone, per above.
- **Rotate the API key.** It was pasted into a chat transcript on
  2026-09-25 and this repository is public. Rotate once the path is
  confirmed working, then update `.env.local` and the SWA app setting.
- Confirm the subscription does not have Zero Data Retention enabled. If it
  does, Anthropic's Covered Models return a 400 saying data retention is
  required, and Microsoft cannot change it.
