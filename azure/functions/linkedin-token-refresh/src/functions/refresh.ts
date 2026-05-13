import { app, InvocationContext, Timer } from "@azure/functions";

import {
  refreshIfNeeded,
  daysUntilExpiry,
} from "../linkedin/linkedin-refresh-token";
import {
  LinkedInAuthError,
  LinkedInConfigError,
  type App,
} from "../linkedin/linkedin-shared";
import { notifyOnResults, type RefreshResult } from "../notify";

const APPS: App[] = ["member", "org"];
const REFRESH_WINDOW_DAYS = 7;

export async function refresh(
  _myTimer: Timer,
  context: InvocationContext,
): Promise<void> {
  const startedAt = new Date().toISOString();
  context.log(`[refresh] Starting LinkedIn token refresh at ${startedAt}.`);

  const results: RefreshResult[] = [];

  for (const appName of APPS) {
    try {
      const tokens = await refreshIfNeeded(appName, REFRESH_WINDOW_DAYS);
      const daysLeft = daysUntilExpiry(tokens);
      // refreshIfNeeded returns the same tokens when no refresh was needed;
      // we don't get a "did refresh actually happen" boolean from it, but
      // we can infer: if daysLeft < window, a refresh happened (or failed).
      const outcome = daysLeft < REFRESH_WINDOW_DAYS ? "refreshed" : "skipped";
      results.push({ app: appName, outcome, daysLeft });
      context.log(
        `[refresh] ${appName}: ${outcome}, ${daysLeft.toFixed(1)}d remaining`,
      );
    } catch (err: unknown) {
      if (
        err instanceof LinkedInConfigError &&
        err.message.includes("not set in")
      ) {
        // Pre-OAuth state: org app may not be configured yet (CM API not
        // approved). Don't treat as failure — log and move on.
        results.push({ app: appName, outcome: "no-tokens" });
        context.log(`[refresh] ${appName}: not yet configured`);
        continue;
      }
      if (err instanceof LinkedInAuthError && err.message.includes("No tokens stored")) {
        results.push({ app: appName, outcome: "no-tokens" });
        context.log(`[refresh] ${appName}: no tokens stored`);
        continue;
      }
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ app: appName, outcome: "failed", error: msg });
      context.error(`[refresh] ${appName}: FAILED — ${msg}`);
    }
  }

  try {
    await notifyOnResults(results, context);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    context.error(`[refresh] Notify call threw: ${msg}`);
  }

  context.log(`[refresh] Done. Results: ${JSON.stringify(results)}`);
}

app.timer("refresh", {
  // Daily at 02:00 UTC (per spec §5.2 / task 020).
  schedule: "0 0 2 * * *",
  handler: refresh,
});
