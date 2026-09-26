import { TableClient, odata } from "@azure/data-tables";
import { randomBytes } from "crypto";

/**
 * Durable counters for the insights endpoint.
 *
 * `src/lib/rate-limit.ts` keeps its counters in a module-level Map. That is
 * adequate for the contact form, where a missed block costs one email. Here a
 * missed block costs money: every request that reaches the model is about $0.03
 * warm and $0.38 on a cache miss. A scripted client only has to wait for a
 * function recycle, which resets an in-process Map and is invisible in
 * development because the process never recycles there.
 *
 * So the counters live in Table Storage, shared across instances and surviving
 * recycles, incremented with optimistic concurrency on the ETag.
 *
 * **These fail closed.** If the count cannot be read or written, the request is
 * refused rather than allowed. An unmetered call to a frontier model is the
 * failure this whole module exists to prevent, so losing the feature for a few
 * minutes is the better outcome. The one exception is development without a
 * connection string, where it falls back to the in-process limiter and says so
 * loudly.
 */

/**
 * Overridable so the self-test can exercise real Table Storage without touching
 * production counters. There is no other reason to set it.
 */
const TABLE_NAME = process.env.INSIGHTS_COUNTER_TABLE ?? "InsightsCounters";

/**
 * Per IP, per hour and per day. Sized against the measured $0.032 a warm turn:
 * 30 questions a day from one address is about a dollar, so the global ceiling
 * rather than this is what bounds total spend.
 */
export const LIMITS = {
  perIpHour: 10,
  perIpDay: 30,
  /** One conversation. Long enough for a real exchange, short enough to bound a script. */
  perSession: 25,
} as const;

/** Counter rows older than this are swept away by the sampled cleanup. */
const COUNTER_RETENTION_HOURS = 72;
/** Roughly one request in this many runs the cleanup. */
const CLEANUP_SAMPLE = 50;

export type Scope = "ip-hour" | "ip-day" | "session" | "global";

export type LimitDecision =
  | { allowed: true }
  | { allowed: false; scope: Scope; limit: number; retryAfterSeconds: number };

let client: TableClient | null = null;
let tableEnsured = false;

function getClient(): TableClient | null {
  if (client) return client;
  const connection = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!connection) return null;
  client = TableClient.fromConnectionString(connection, TABLE_NAME);
  return client;
}

async function ensureTable(c: TableClient): Promise<void> {
  if (tableEnsured) return;
  try {
    await c.createTable();
  } catch (err) {
    const code = (err as { statusCode?: number }).statusCode;
    if (code && code !== 409) throw err;
  }
  tableEnsured = true;
}

export function utcDay(at = new Date()): string {
  return at.toISOString().slice(0, 10).replace(/-/g, "");
}

export function utcHour(at = new Date()): string {
  return `${utcDay(at)}${String(at.getUTCHours()).padStart(2, "0")}`;
}

/** True when durable counting is possible at all. */
export function countersAvailable(): boolean {
  return Boolean(process.env.STORAGE_ACCOUNT_CONNECTION);
}

type CounterRow = {
  partitionKey: string;
  rowKey: string;
  count: number;
  expiresAt: string;
  etag?: string;
};

/**
 * Adds to a counter and returns the new value. Optimistic concurrency on the
 * ETag, retried a few times, because two requests from the same address landing
 * on two instances in the same second is ordinary rather than exceptional.
 */
async function increment(
  c: TableClient,
  partitionKey: string,
  rowKey: string,
  by: number,
  expiresAt: Date,
): Promise<number> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const existing = await c.getEntity<CounterRow>(partitionKey, rowKey);
      const next = (existing.count ?? 0) + by;
      await c.updateEntity(
        { partitionKey, rowKey, count: next, expiresAt: expiresAt.toISOString() },
        "Merge",
        { etag: existing.etag },
      );
      return next;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404) {
        try {
          await c.createEntity({
            partitionKey,
            rowKey,
            count: by,
            expiresAt: expiresAt.toISOString(),
          });
          return by;
        } catch (createErr) {
          // Another instance created it between the read and the write.
          if ((createErr as { statusCode?: number }).statusCode !== 409) throw createErr;
          continue;
        }
      }
      // 412 is the ETag losing a race, which is what the retry is for.
      if (status !== 412) throw err;
    }
  }
  throw new Error("counter contention: five attempts lost the ETag race");
}

async function readCount(c: TableClient, partitionKey: string, rowKey: string): Promise<number> {
  try {
    const row = await c.getEntity<CounterRow>(partitionKey, rowKey);
    return row.count ?? 0;
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 404) return 0;
    throw err;
  }
}

function endOfHour(): Date {
  const at = new Date();
  at.setUTCMinutes(59, 59, 999);
  return at;
}

function endOfDay(): Date {
  const at = new Date();
  at.setUTCHours(23, 59, 59, 999);
  return at;
}

/**
 * Counts this request against the per-IP and per-session limits, and blocks when
 * one is exceeded. Counting happens before the model call, so a request that is
 * about to be refused has still been counted: the alternative lets a client that
 * always fails validation probe for free.
 */
export async function checkDurableLimits(
  ipHash: string,
  sessionId: string,
): Promise<LimitDecision> {
  const c = getClient();
  if (!c) throw new Error("STORAGE_ACCOUNT_CONNECTION is not configured");
  await ensureTable(c);

  const hourKey = `${ipHash}-${utcHour()}`;
  const dayKey = `${ipHash}-${utcDay()}`;
  const sessionKey = `${sessionId}-${utcDay()}`;

  const hourCount = await increment(c, "ip-hour", hourKey, 1, endOfHour());
  if (hourCount > LIMITS.perIpHour) {
    const secondsLeft = Math.ceil((endOfHour().getTime() - Date.now()) / 1000);
    return { allowed: false, scope: "ip-hour", limit: LIMITS.perIpHour, retryAfterSeconds: Math.max(secondsLeft, 30) };
  }

  const dayCount = await increment(c, "ip-day", dayKey, 1, endOfDay());
  if (dayCount > LIMITS.perIpDay) {
    const secondsLeft = Math.ceil((endOfDay().getTime() - Date.now()) / 1000);
    return { allowed: false, scope: "ip-day", limit: LIMITS.perIpDay, retryAfterSeconds: Math.max(secondsLeft, 60) };
  }

  const sessionCount = await increment(c, "session", sessionKey, 1, endOfDay());
  if (sessionCount > LIMITS.perSession) {
    return { allowed: false, scope: "session", limit: LIMITS.perSession, retryAfterSeconds: 0 };
  }

  if (Math.random() < 1 / CLEANUP_SAMPLE) {
    await sweepExpiredCounters().catch(() => {
      // Housekeeping. A failure here must not cost the reader an answer.
    });
  }

  return { allowed: true };
}

/**
 * Records that a session passed the captcha.
 *
 * This row is what makes the captcha more than decoration. Without it a client
 * could send a fabricated conversation history and skip the check on every
 * request, since the first question is the only one that is gated.
 */
export async function markSessionVerified(sessionId: string): Promise<void> {
  const c = getClient();
  if (!c) throw new Error("STORAGE_ACCOUNT_CONNECTION is not configured");
  await ensureTable(c);
  await c.upsertEntity(
    {
      partitionKey: "session-verified",
      rowKey: sessionId,
      count: 1,
      expiresAt: endOfDay().toISOString(),
    },
    "Replace",
  );
}

export async function isSessionVerified(sessionId: string): Promise<boolean> {
  const c = getClient();
  if (!c) throw new Error("STORAGE_ACCOUNT_CONNECTION is not configured");
  await ensureTable(c);
  return (await readCount(c, "session-verified", sessionId)) > 0;
}

/** Deletes counter rows whose window closed more than the retention period ago. */
export async function sweepExpiredCounters(): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  await ensureTable(c);

  const cutoff = new Date(Date.now() - COUNTER_RETENTION_HOURS * 3_600_000).toISOString();
  let deleted = 0;
  const stale = c.listEntities<CounterRow>({
    queryOptions: { filter: odata`expiresAt lt ${cutoff}` },
  });
  for await (const row of stale) {
    await c.deleteEntity(row.partitionKey, row.rowKey);
    deleted += 1;
    if (deleted >= 500) break;
  }
  return deleted;
}

/** A session id for the client to use. Ephemeral, not a cookie, not derived from anything. */
export function newSessionId(): string {
  return randomBytes(12).toString("base64url");
}
