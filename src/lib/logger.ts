import { setup, defaultClient } from "applicationinsights";

let initialized = false;

// The SDK batches telemetry and flushes on a timer. On Azure Static Web Apps
// the function is frozen or torn down between requests, so a batch that has
// not gone out yet is simply lost. That is why this app recorded 11 requests
// in 30 days while serving live traffic, and why the contact form outage on
// 2026-09-25 left no trace to diagnose. Flush explicitly after every write.

function ensureInitialized() {
  if (initialized) return;

  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  if (!connectionString) {
    return;
  }

  setup(connectionString)
    .setAutoCollectRequests(true)
    .setAutoCollectExceptions(true)
    .start();

  initialized = true;
}

/** Track a custom event with sanitized properties (no PII). */
export function trackEvent(
  name: string,
  properties?: Record<string, string>,
) {
  ensureInitialized();
  if (defaultClient) {
    defaultClient.trackEvent({ name, properties });
    void flushTelemetry();
  }
}

/** Track an exception with context (no PII in properties). */
export function trackException(
  error: Error,
  properties?: Record<string, string>,
) {
  ensureInitialized();
  if (defaultClient) {
    defaultClient.trackException({ exception: error, properties });
    void flushTelemetry();
  }
}

/**
 * Push any buffered telemetry now. Await this before returning from a route
 * handler when the event must survive the function being frozen.
 */
export async function flushTelemetry(): Promise<void> {
  if (!defaultClient) return;
  try {
    await Promise.resolve(defaultClient.flush());
  } catch (err) {
    console.warn("[logger] telemetry flush failed:", err);
  }
}

/** Track an AI crawler bot visit. Slug-only — no IP, no full UA stored. */
export function trackAiCrawler(data: { bot: string; path: string }): void {
  trackEvent("ai_crawler.visit", { bot: data.bot, path: data.path });
}
