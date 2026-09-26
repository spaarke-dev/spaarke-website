import { TableClient } from "@azure/data-tables";

/**
 * The global daily spend ceiling.
 *
 * Per-IP limits bound one abuser. They do not bound a hundred of them, or one
 * with a hundred addresses, and abuse on a public endpoint that calls a frontier
 * model arrives as an invoice rather than as an outage.
 *
 * **This counts money, not requests.** A request that forces a cache miss costs
 * $0.379 against $0.032 for a cached turn, so roughly 1,300 cache-missing
 * requests would spend a month's budget in a day while a request counter sat
 * comfortably inside its limit. The counter therefore accumulates the measured
 * cost of each answer from the token usage the API reports.
 *
 * When the ceiling is reached the feature rests until the next UTC day and says
 * so. It does not fail, and it does not show a generic error: the assistant is
 * fine, the articles are all still there, and the reader is told as much.
 *
 * Rates are Claude Sonnet 5 published prices confirmed 2026-09-26, with the 1.1x
 * DataZoneStandard multiplier. See notes/cost-model.md.
 */

/** Overridable for the self-test, which must not touch the real spend row. */
const TABLE_NAME = process.env.INSIGHTS_COUNTER_TABLE ?? "InsightsCounters";
const PARTITION = "global";

const RATE_PER_MTOK = { input: 2.0, output: 10.0, cacheRead: 0.2, cacheWrite1h: 4.0 };
const DATA_ZONE_MULTIPLIER = 1.1;

/**
 * Default daily ceiling in US dollars. The owner set 500 a month, which is about
 * 16.40 a day, and 16 leaves a little room for the hourly cache warming that is
 * designed and not yet built. Overridable by app setting so it can be lowered
 * without a deploy.
 */
const DEFAULT_DAILY_CEILING_USD = 16;

export function dailyCeilingUsd(): number {
  const parsed = Number(process.env.INSIGHTS_DAILY_CEILING_USD);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_CEILING_USD;
}

export type Usage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};

/** What one turn actually cost, from the token counts the API reported. */
export function turnCostUsd(usage: Usage): number {
  const raw =
    (usage.input * RATE_PER_MTOK.input +
      usage.output * RATE_PER_MTOK.output +
      usage.cacheRead * RATE_PER_MTOK.cacheRead +
      usage.cacheWrite * RATE_PER_MTOK.cacheWrite1h) /
    1_000_000;
  return raw * DATA_ZONE_MULTIPLIER;
}

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

function rowKeyFor(at = new Date()): string {
  return `spend-${at.toISOString().slice(0, 10)}`;
}

/**
 * Spend is stored in microdollars as an integer. Table Storage would hold a
 * double happily enough, but accumulating thousands of $0.032 additions into a
 * float is exactly the arithmetic that drifts, and this number decides whether
 * the feature is switched off.
 */
type SpendRow = {
  partitionKey: string;
  rowKey: string;
  microdollars: number;
  turns: number;
  etag?: string;
};

export type CeilingState = {
  /** What today has cost so far. */
  spentUsd: number;
  ceilingUsd: number;
  turns: number;
  reached: boolean;
};

export async function ceilingState(): Promise<CeilingState> {
  const ceilingUsd = dailyCeilingUsd();
  const c = getClient();
  if (!c) throw new Error("STORAGE_ACCOUNT_CONNECTION is not configured");
  await ensureTable(c);

  try {
    const row = await c.getEntity<SpendRow>(PARTITION, rowKeyFor());
    const spentUsd = (row.microdollars ?? 0) / 1_000_000;
    return { spentUsd, ceilingUsd, turns: row.turns ?? 0, reached: spentUsd >= ceilingUsd };
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 404) {
      return { spentUsd: 0, ceilingUsd, turns: 0, reached: false };
    }
    throw err;
  }
}

/**
 * Adds one turn's cost to today's total.
 *
 * Called after the answer, because the cost is only known once the API has
 * reported its token counts. That means the ceiling can be crossed by one turn
 * rather than blocking mid-answer, which is the right trade: the overshoot is one
 * turn, and refusing to record a cost because the read raced would lose the
 * accounting entirely.
 */
export async function recordSpend(usage: Usage): Promise<void> {
  const c = getClient();
  if (!c) return;
  await ensureTable(c);

  const micro = Math.round(turnCostUsd(usage) * 1_000_000);
  const rowKey = rowKeyFor();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const row = await c.getEntity<SpendRow>(PARTITION, rowKey);
      await c.updateEntity(
        {
          partitionKey: PARTITION,
          rowKey,
          microdollars: (row.microdollars ?? 0) + micro,
          turns: (row.turns ?? 0) + 1,
        },
        "Merge",
        { etag: row.etag },
      );
      return;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404) {
        try {
          await c.createEntity({ partitionKey: PARTITION, rowKey, microdollars: micro, turns: 1 });
          return;
        } catch (createErr) {
          if ((createErr as { statusCode?: number }).statusCode !== 409) throw createErr;
          continue;
        }
      }
      if (status !== 412) throw err;
    }
  }
  throw new Error("spend contention: five attempts lost the ETag race");
}
