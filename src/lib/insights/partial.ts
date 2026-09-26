import { TableClient, odata } from "@azure/data-tables";
import type { InsightsEvent } from "./stream";

/**
 * Partial answers, so a reader sees prose arrive on a platform that will not
 * stream.
 *
 * Azure Static Web Apps buffers the response. Proven against the deployed site:
 * every chunk of a six-chunk probe arrived together, and the response carried
 * `Content-Length` rather than `Transfer-Encoding: chunked`, while the same build
 * under `next start` streamed correctly. So the POST's stream reaches the platform
 * a sentence at a time and reaches the reader all at once, eleven seconds later.
 *
 * The answer to that is to put the sentences somewhere the reader can fetch them
 * while the POST is still running. Each event the assembler emits is appended
 * here as it is produced, and `GET /api/article-insights/partial` reads them back.
 *
 * **This is a rendering path, not a defence, and it fails open.** If the table
 * cannot be written the reader still gets the whole answer from the POST
 * response, so a failure here costs progressive rendering and nothing else. That
 * is the opposite of `rate-limit-durable.ts`, which fails closed because a
 * failure there costs money. Do not copy the fail-closed pattern into this file.
 *
 * Two things carry the design and are easy to get wrong:
 *
 * - **The id comes from the client.** The POST does not resolve until the answer
 *   is finished, so a poller that waits for the POST to tell it the id cannot
 *   start until there is nothing left to poll for.
 * - **The session is a row property, not a convention.** Every read filters on
 *   it, so a guessed request id with the wrong session returns an empty result
 *   that looks exactly like an answer that has not started. There is no error to
 *   distinguish the two, because the error would be the oracle.
 */

/** Overridable so the self-test can use real Table Storage without touching live rows. */
const TABLE_NAME = process.env.INSIGHTS_PARTIAL_TABLE ?? "InsightsPartials";

/**
 * How long a partial answer lives.
 *
 * These rows hold a reader's question and answer, so they are a second copy of
 * what `capture.ts` keeps deliberately for 90 days. Ten minutes is long enough to
 * outlive the slowest measured answer by a wide margin and short enough that the
 * copy is not a retention decision. Nothing reads them after the conversation
 * turn ends.
 */
export const PARTIAL_TTL_MS = 10 * 60_000;

/**
 * The request id the client generates. Sixteen characters minimum, because this
 * value plus the session id is what stands between one reader's answer and
 * another's. `newRequestId` in `poll-client.ts` produces 22.
 */
export const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

/** Bounds a single answer's rows. A measured answer flushes fewer than thirty times. */
const MAX_EVENTS = 400;

/**
 * Deleted per sweep.
 *
 * Kept small on purpose. The platform buffers, so a reader waits for the POST's
 * stream to close, and anything slow before that close is added to the answer
 * they are waiting for. Housekeeping runs on the poll route instead, where a
 * slow response costs one skipped poll rather than a delayed answer.
 */
const SWEEP_BATCH = 50;

export function partialAvailable(): boolean {
  return Boolean(process.env.STORAGE_ACCOUNT_CONNECTION);
}

export function validRequestId(value: unknown): string | null {
  return typeof value === "string" && REQUEST_ID_PATTERN.test(value) ? value : null;
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

type PartialRow = {
  partitionKey: string;
  rowKey: string;
  /** One `InsightsEvent`, JSON encoded. The same shape the stream sends. */
  payload: string;
  /** Filtered on by every read, which is what makes a guessed id useless. */
  session: string;
  expiresAt: string;
};

/** Fixed width, because Table Storage orders row keys as strings. */
function seqKey(n: number): string {
  return String(n).padStart(4, "0");
}

/**
 * Appends events for one request as the answer is assembled.
 *
 * Writes are chained rather than fired in parallel, so row keys land in the order
 * the events were produced. The poller advances past the highest key it has seen,
 * and a write that landed out of order would leave a sentence behind that the
 * reader never sees. The chain is not awaited by the caller, so the model loop
 * never waits on a table write; `settled()` is awaited once at the end, because
 * the function can be frozen the moment the stream closes.
 */
export class PartialWriter {
  private seq = 0;
  private chain: Promise<void> = Promise.resolve();
  private stopped = false;
  private written = 0;
  private firstError: string | null = null;

  constructor(
    private readonly requestId: string,
    private readonly session: string,
  ) {}

  /** Queues events. Never throws, never rejects, never blocks the caller. */
  push(events: InsightsEvent[]): void {
    if (this.stopped || events.length === 0) return;
    for (const event of events) {
      if (this.seq >= MAX_EVENTS) {
        this.stopped = true;
        return;
      }
      this.seq += 1;
      const rowKey = seqKey(this.seq);
      const payload = JSON.stringify(event);
      this.chain = this.chain.then(() => this.write(rowKey, payload));
    }
  }

  private async write(rowKey: string, payload: string): Promise<void> {
    if (this.stopped) return;
    const c = getClient();
    if (!c) {
      this.stopped = true;
      return;
    }
    try {
      await ensureTable(c);
      await c.createEntity<PartialRow>({
        partitionKey: this.requestId,
        rowKey,
        payload,
        session: this.session,
        expiresAt: new Date(Date.now() + PARTIAL_TTL_MS).toISOString(),
      });
      this.written += 1;
    } catch (err) {
      // One failure stops the rest. A broken table should cost one round trip
      // rather than thirty, and the reader loses progressive rendering rather
      // than the answer.
      this.stopped = true;
      this.firstError = err instanceof Error ? err.message.slice(0, 120) : "unknown";
    }
  }

  /** Awaited before the stream closes. Resolves whether or not the writes worked. */
  async settled(): Promise<{ written: number; error: string | null }> {
    await this.chain.catch(() => {});
    return { written: this.written, error: this.firstError };
  }
}

export type PartialRead = {
  /** Events after the requested sequence, in the order they were produced. */
  events: InsightsEvent[];
  /** Pass back as `after` on the next poll. */
  cursor: number;
  /** True once a `done` or `error` event has been read, meaning stop polling. */
  complete: boolean;
};

/**
 * Reads what has been written so far for one request.
 *
 * One partition, one query, nothing else. An unknown id, an expired id and a
 * mismatched session all produce the same empty result, which is also what a
 * request that has not flushed its first sentence produces.
 */
export async function readPartial(input: {
  requestId: string;
  session: string;
  after: number;
}): Promise<PartialRead> {
  const c = getClient();
  if (!c) return { events: [], cursor: input.after, complete: false };
  await ensureTable(c);

  const afterKey = seqKey(Math.max(input.after, 0));
  const rows = c.listEntities<PartialRow>({
    queryOptions: {
      filter: odata`PartitionKey eq ${input.requestId} and RowKey gt ${afterKey} and session eq ${input.session}`,
    },
  });

  const events: InsightsEvent[] = [];
  let cursor = input.after;
  let complete = false;
  for await (const row of rows) {
    const seq = Number(row.rowKey);
    if (!Number.isFinite(seq)) continue;
    try {
      const event = JSON.parse(row.payload) as InsightsEvent;
      events.push(event);
      if (event.type === "done" || event.type === "error") complete = true;
    } catch {
      // A row that will not parse is a row the reader cannot use. Skipping it
      // keeps the cursor moving rather than wedging the poll on one bad value.
    }
    if (seq > cursor) cursor = seq;
  }

  return { events, cursor, complete };
}

/**
 * Deletes expired rows left behind by a request that never finished.
 *
 * This is the backstop rather than the mechanism. A POST that completes deletes
 * its own rows with `discardPartial`, so the only rows this finds are from a
 * request that was killed between its first flush and its close. Table Storage
 * has no time to live, so expiry is this function plus somebody calling it, and
 * the caller is the poll route on a sample: it is the cheap route, it gets the
 * traffic, and a slow poll costs one skipped sentence rather than a delayed
 * answer.
 */
export async function sweepExpiredPartials(): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  await ensureTable(c);

  const now = new Date().toISOString();
  let deleted = 0;
  const stale = c.listEntities<PartialRow>({
    queryOptions: { filter: odata`expiresAt lt ${now}` },
  });
  for await (const row of stale) {
    await c.deleteEntity(row.partitionKey, row.rowKey);
    deleted += 1;
    if (deleted >= SWEEP_BATCH) break;
  }
  return deleted;
}

/**
 * Drops one request's rows, which is how a partial answer normally ends.
 *
 * Called at the close of every POST, whether the turn succeeded or failed. By
 * then the complete answer is in the POST response and the reader has already
 * been shown the prose, so the rows have no further use and holding them would
 * make this a second copy of the conversation record with a longer life than the
 * one that was designed.
 *
 * It deletes one partition of about twenty rows, and it runs before the stream
 * closes, so it is deliberately not the sweep.
 */
export async function discardPartial(requestId: string): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  await ensureTable(c);

  let deleted = 0;
  const rows = c.listEntities<PartialRow>({
    queryOptions: { filter: odata`PartitionKey eq ${requestId}` },
  });
  for await (const row of rows) {
    await c.deleteEntity(row.partitionKey, row.rowKey);
    deleted += 1;
  }
  return deleted;
}
