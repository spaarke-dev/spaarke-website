// azure/functions/linkedin-token-refresh/src/notify.ts
//
// Operator notifications for the LinkedIn token-refresh function.
// Sends email via SendGrid on any refresh failure, and a weekly
// health summary on Mondays regardless of outcome. Degrades to
// silent-with-log if any of the required KV secrets are missing,
// so a misconfigured notify path doesn't take down the refresh
// itself.
//
// Required KV secrets (in sprk-demo-kv):
//   sendgrid-api-key
//   notification-email-operator   (recipient — operator's email)
//   notification-email-from       (sender — e.g., noreply@spaarke.com,
//                                  must be a SendGrid-verified sender)
//
// See projects/linkedin-publishing/spec.md §10 #6 and tasks/023.

import sgMail from "@sendgrid/mail";
import type { InvocationContext } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

import type { App } from "./linkedin/linkedin-shared";

const KV_VAULT_NAME = "sprk-demo-kv";

export interface RefreshResult {
  app: App;
  outcome: "refreshed" | "skipped" | "failed" | "no-tokens";
  daysLeft?: number;
  error?: string;
}

interface NotifyConfig {
  apiKey: string;
  to: string;
  from: string;
}

let cachedClient: SecretClient | null = null;

function getSecretClient(): SecretClient {
  if (cachedClient) return cachedClient;
  cachedClient = new SecretClient(
    `https://${KV_VAULT_NAME}.vault.azure.net`,
    new DefaultAzureCredential(),
  );
  return cachedClient;
}

async function getSecretOrNull(name: string): Promise<string | null> {
  try {
    const v = await getSecretClient().getSecret(name);
    return v.value ?? null;
  } catch (err: unknown) {
    const e = err as { code?: string; statusCode?: number };
    if (e?.code === "SecretNotFound" || e?.statusCode === 404) return null;
    throw err;
  }
}

async function loadConfig(): Promise<NotifyConfig | null> {
  const [apiKey, to, from] = await Promise.all([
    getSecretOrNull("sendgrid-api-key"),
    getSecretOrNull("notification-email-operator"),
    getSecretOrNull("notification-email-from"),
  ]);
  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

function isMondayUtc(now: Date = new Date()): boolean {
  return now.getUTCDay() === 1;
}

function summaryLine(r: RefreshResult): string {
  const dl =
    typeof r.daysLeft === "number" ? `${r.daysLeft.toFixed(1)} days` : "—";
  switch (r.outcome) {
    case "refreshed":
      return `  ${r.app}: refreshed, ${dl} remaining`;
    case "skipped":
      return `  ${r.app}: OK, ${dl} remaining`;
    case "no-tokens":
      return `  ${r.app}: no tokens stored (run linkedin-auth)`;
    case "failed":
      return `  ${r.app}: FAILED — ${r.error ?? "unknown error"}`;
  }
}

function buildFailureEmail(results: RefreshResult[]) {
  const failures = results.filter((r) => r.outcome === "failed");
  const subjects = failures.map((f) => f.app).join("+");
  return {
    subject: `[LinkedIn refresh] ${subjects} token refresh failed`,
    body: [
      "The LinkedIn token-refresh Azure Function reported failures:",
      "",
      ...results.map(summaryLine),
      "",
      "Remediation:",
      ...failures.map(
        (f) =>
          `  - For app=${f.app}: run \`npx tsx scripts/linkedin-auth.ts --app=${f.app}\` from your dev machine to re-authorize.`,
      ),
      "",
      "The function will retry tomorrow at 02:00 UTC. Until then, any",
      "publish attempts against affected apps will return 401.",
    ].join("\n"),
  };
}

function buildWeeklySummary(results: RefreshResult[]) {
  const dayParts = results
    .filter((r) => typeof r.daysLeft === "number")
    .map((r) => `${r.app}=${r.daysLeft!.toFixed(0)}d`)
    .join(", ");
  return {
    subject: `[LinkedIn refresh] Weekly health: ${dayParts || "no apps configured"}`,
    body: [
      "Weekly token-health summary from the LinkedIn refresh function:",
      "",
      ...results.map(summaryLine),
      "",
      "All clear — no operator action needed.",
    ].join("\n"),
  };
}

export async function notifyOnResults(
  results: RefreshResult[],
  context: InvocationContext,
): Promise<void> {
  const failures = results.filter((r) => r.outcome === "failed");
  const isWeekly = isMondayUtc();

  if (failures.length === 0 && !isWeekly) {
    context.log("[notify] No failures + not Monday → no email.");
    return;
  }

  const config = await loadConfig();
  if (!config) {
    context.log(
      "[notify] SendGrid config not present in KV (sendgrid-api-key / notification-email-operator / notification-email-from). Skipping email.",
    );
    return;
  }

  sgMail.setApiKey(config.apiKey);

  const { subject, body } =
    failures.length > 0
      ? buildFailureEmail(results)
      : buildWeeklySummary(results);

  try {
    await sgMail.send({
      to: config.to,
      from: config.from,
      subject,
      text: body,
    });
    context.log(`[notify] Email sent: "${subject}"`);
  } catch (err: unknown) {
    const e = err as Error;
    context.error(`[notify] SendGrid send failed: ${e.message}`);
    // Don't throw — the refresh itself already succeeded; we just
    // couldn't email about it.
  }
}
