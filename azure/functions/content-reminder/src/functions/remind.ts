// azure/functions/content-reminder/src/functions/remind.ts
//
// Timer-triggered orchestrator for the daily content reminder digest.
// Wires together: KV (secrets) → GitHub (calendar.md) → parser
// (CalendarRow[]) → window filter → digest renderer → SendGrid.
//
// Daily at 13:00 UTC (≈09:00 ET DST). Best-effort by design — failures
// log to App Insights but never throw out of the handler (a thrown
// timer-trigger error would mark the function as failing-job and
// trigger Azure alerts, which is wrong for a non-critical reminder).
//
// See projects/content-orchestration/spec.md §3 and tasks/014.

import { app, InvocationContext, Timer } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

import { fetchCalendar, checkPatExpiry } from "../integrations/github";
import { sendDigest } from "../integrations/sendgrid";
import {
  parseCalendar,
  filterDueInWindow,
} from "../calendar/parse-calendar";
import { renderDigest } from "../notify/digest";

const KV_VAULT_NAME = "sprk-demo-kv";

let cachedClient: SecretClient | null = null;
function getSecretClient(): SecretClient {
  if (cachedClient) return cachedClient;
  cachedClient = new SecretClient(
    `https://${KV_VAULT_NAME}.vault.azure.net`,
    new DefaultAzureCredential(),
  );
  return cachedClient;
}

async function loadSecrets(): Promise<{
  ghToken: string;
  sgApiKey: string;
  toAddress: string;
  fromAddress: string;
}> {
  const kv = getSecretClient();
  const [ghToken, sgApiKey, toAddress, fromAddress] = await Promise.all([
    kv.getSecret("github-token-readonly").then((s) => s.value),
    kv.getSecret("sendgrid-api-key").then((s) => s.value),
    kv.getSecret("notification-email-operator").then((s) => s.value),
    kv.getSecret("notification-email-from").then((s) => s.value),
  ]);
  if (!ghToken || !sgApiKey || !toAddress || !fromAddress) {
    throw new Error(
      "One or more required KV secrets are empty: " +
        "github-token-readonly, sendgrid-api-key, " +
        "notification-email-operator, notification-email-from.",
    );
  }
  return { ghToken, sgApiKey, toAddress, fromAddress };
}

export async function remind(
  _myTimer: Timer,
  context: InvocationContext,
): Promise<void> {
  const startedAt = new Date().toISOString();
  context.log(`[remind] Started at ${startedAt}.`);

  try {
    const { ghToken, sgApiKey, toAddress, fromAddress } = await loadSecrets();

    const markdown = await fetchCalendar(ghToken);
    const allRows = parseCalendar(markdown);
    const dueRows = filterDueInWindow(allRows);

    context.log(
      `[remind] ${dueRows.length} pieces in window (of ${allRows.length} total).`,
    );

    if (dueRows.length === 0) {
      context.log("[remind] No pieces due — skip-day rule applies.");
      return;
    }

    let patExpiryDays: number | null = null;
    try {
      const expiry = await checkPatExpiry(ghToken);
      patExpiryDays = expiry.daysUntilExpiry;
      if (patExpiryDays !== null) {
        context.log(`[remind] GitHub PAT expires in ${patExpiryDays} days.`);
      }
    } catch (err) {
      // Non-fatal — proceed without the expiry footer.
      context.warn(
        `[remind] PAT-expiry check failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    const { subject, text, html } = renderDigest(
      dueRows,
      new Date(),
      patExpiryDays,
    );

    await sendDigest({
      to: toAddress,
      from: fromAddress,
      subject,
      text,
      html,
      apiKey: sgApiKey,
    });

    context.log(`[remind] Digest sent to ${toAddress}: "${subject}"`);
  } catch (err: unknown) {
    // Best-effort: log and swallow. A throw here would mark the
    // timer trigger as failed and trigger Azure platform alerts,
    // which we don't want for a non-critical reminder.
    const msg = err instanceof Error ? err.message : String(err);
    context.error(`[remind] Failed: ${msg}`);
  }
}

app.timer("remind", {
  // Daily at 13:00 UTC (≈09:00 ET DST / 08:00 ET standard). Per spec §9 #2.
  schedule: "0 0 13 * * *",
  handler: remind,
});
