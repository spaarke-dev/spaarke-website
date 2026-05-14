# Task 014: Implement the timer-trigger orchestrator

**Phase:** 1 — Function logic
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 010, 011, 012, 013
**Tags:** azure, functions, timer, orchestration, milestone

## Goal

The orchestrator handler that ties everything together. Daily timer
fires → fetch calendar → parse → filter → render → send.
**Milestone M1** — local end-to-end works.

## Context

Per [spec.md §3](../spec.md). All the integration + parser + template
modules exist after the Group A fan-out. This task wires them into
the timer trigger.

## Steps

1. Open `azure/functions/content-reminder/src/functions/remind.ts` (the scaffold from task 001).
2. Replace the placeholder body with the full handler:
   ```ts
   import { app, InvocationContext, Timer } from "@azure/functions";
   import { DefaultAzureCredential } from "@azure/identity";
   import { SecretClient } from "@azure/keyvault-secrets";
   import { fetchCalendar, checkPatExpiry } from "../integrations/github";
   import { sendDigest } from "../integrations/sendgrid";
   import { parseCalendar, filterDueInWindow } from "../calendar/parse-calendar";
   import { renderDigest } from "../notify/digest";

   const KV = "sprk-demo-kv";

   export async function remind(_t: Timer, context: InvocationContext) {
     const kv = new SecretClient(`https://${KV}.vault.azure.net`, new DefaultAzureCredential());

     const [ghToken, sgKey, to, from] = await Promise.all([
       kv.getSecret("github-token-readonly").then(s => s.value!),
       kv.getSecret("sendgrid-api-key").then(s => s.value!),
       kv.getSecret("notification-email-operator").then(s => s.value!),
       kv.getSecret("notification-email-from").then(s => s.value!),
     ]);

     const markdown = await fetchCalendar(ghToken);
     const allRows = parseCalendar(markdown);
     const dueRows = filterDueInWindow(allRows);

     context.log(`[remind] ${dueRows.length} pieces in window (of ${allRows.length} total).`);

     if (dueRows.length === 0) {
       context.log("[remind] No pieces due — skip-day rule applies.");
       return;
     }

     const { daysUntilExpiry } = await checkPatExpiry(ghToken).catch(() => ({ daysUntilExpiry: null }));
     const { subject, text, html } = renderDigest(dueRows, new Date(), daysUntilExpiry);

     await sendDigest({ to, from, subject, text, html, apiKey: sgKey });
     context.log(`[remind] Digest sent to ${to}: "${subject}"`);
   }

   app.timer("remind", {
     schedule: "0 0 13 * * *",  // daily 13:00 UTC ≈ 09:00 ET DST
     handler: remind,
   });
   ```
3. Wrap in try/catch at the outermost level — log error to App Insights, don't throw (a thrown timer-trigger error gets the function reported as failing-job; not what we want for a non-critical reminder).
4. Manual local test:
   - `npm run build`
   - `func start` in one terminal
   - In another terminal: `curl -X POST http://localhost:7071/admin/functions/remind -H "Content-Type: application/json" -d '{}'`
   - Verify the real digest email lands in `notification-email-operator` inbox.

## Expected Outputs

- `azure/functions/content-reminder/src/functions/remind.ts` (~80 lines)

## Acceptance Criteria

- [ ] `npm run build` exits 0.
- [ ] Local `func start` + manual trigger sends a real digest to the operator's inbox.
- [ ] HTML and plain-text bodies both render correctly.
- [ ] Skip-day rule: with calendar containing zero in-window rows, function exits cleanly with the skip log line.
- [ ] PAT expiry warning shows in the footer if the PAT is < 14 days from expiring.
- [ ] No secret values appear in App Insights logs.

## Notes

- This task assumes the GitHub PAT is already in KV (task 020). For local testing, populate `github-token-readonly` first; otherwise the function fails at KV-read.
- The `DefaultAzureCredential` chain handles `az login` locally and managed identity in Azure. No code changes needed.
- The "Milestone M1 reached" check is when this task's manual trigger delivers a real digest email.
