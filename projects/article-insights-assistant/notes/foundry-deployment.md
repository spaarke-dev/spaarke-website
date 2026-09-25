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

**None yet.** Confirmed 2026-09-25:

```
az cognitiveservices account deployment list \
  --name website-article-agent-resource \
  --resource-group rg-website-article-agent --query "length(@)"
0
```

Task 001 cannot complete and everything downstream is blocked until a
Claude model is deployed to this resource.

Once deployed, record here: deployment name, model id as deployed, model
version (expect 2, hosted on Azure), and region scope. The **deployment
name**, not the model id, is what goes in the `model` parameter at call
time. That mismatch is a common source of 404s.

## Environment variables

Same names locally and in Azure Static Web Apps app settings.

| Name | Value |
|---|---|
| `FOUNDRY_BASE_URL` | the `/anthropic` URL above |
| `FOUNDRY_API_KEY` | secret, never in the repo |
| `FOUNDRY_DEPLOYMENT` | pending the deployment |

## SDK

`@anthropic-ai/foundry-sdk`. Note this is not `@anthropic-ai/sdk`.

## Open items

- Deploy a Claude model and record the deployment name.
- **Rotate the API key.** It was pasted into a chat transcript on
  2026-09-25 and this repository is public. Rotate once the path is
  confirmed working, then update `.env.local` and the SWA app setting.
- Confirm the subscription does not have Zero Data Retention enabled. If it
  does, Anthropic's Covered Models return a 400 saying data retention is
  required, and Microsoft cannot change it.
