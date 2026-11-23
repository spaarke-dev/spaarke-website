import { odata, TableClient } from "@azure/data-tables";
import {
  devMockEnabled,
  mockDelete,
  mockEntries,
  mockInsert,
  mockMerge,
  mockMergeIf,
  mockRead,
} from "@/lib/meet/dev-mock";

/**
 * Text MEET records in Table Storage (spec FR-05, FR-12, FR-14).
 *
 * Storage is required: the inbound row is what stops a Twilio retry from
 * getting a second reply, and the sender and counter rows are what hold the
 * rate limits across instances. With no storage the route answers with an
 * empty <Response/> rather than reply without either.
 *
 * Nothing here holds a readable phone number or message text: senders are
 * keyed by the keyed phone hash (phone-hash.ts) and inbound rows keep only
 * the MessageSid, the time, and the classification.
 *
 * Every call has a timeout. A storage failure throws to the route, which
 * answers with an empty <Response/>. Table names can be overridden so local
 * checks never write to live tables. With MEET_DEV_MOCK=1 under `next dev`,
 * rows live in the same in-memory store the /meet mock uses.
 */

const TIMEOUT_MS = 5_000;
const ATTEMPTS = 3;

const TABLE_DEFAULTS = {
  senders: ["SMS_SENDERS_TABLE", "SmsSenders"],
  conversations: ["SMS_CONVERSATIONS_TABLE", "SmsConversations"],
  inbound: ["SMS_INBOUND_TABLE", "SmsInbound"],
  counters: ["SMS_COUNTERS_TABLE", "SmsCounters"],
} as const;

type TableKind = keyof typeof TABLE_DEFAULTS;

/** Read on each call, so a check script can set the names after import. */
function tableName(kind: TableKind): string {
  const [setting, fallback] = TABLE_DEFAULTS[kind];
  return process.env[setting]?.trim() || fallback;
}

const SENDER_PARTITION = "sender";
const CONVERSATION_PARTITION = "sms";

/** Row keys may not contain / \ # ? or control characters; these patterns rule that out. */
const MESSAGE_SID = /^[A-Za-z0-9]{1,64}$/;
const PHONE_HASH = /^[0-9a-f]{32}$/;
const CONVERSATION_ID = /^[A-Za-z0-9_-]{12}$/;

function assertKey(value: string, pattern: RegExp, what: string) {
  if (!pattern.test(value)) throw new Error(`Invalid ${what}.`);
}

export function isSmsStorageConfigured(): boolean {
  return devMockEnabled() || Boolean(process.env.STORAGE_ACCOUNT_CONNECTION);
}

// ---------------------------------------------------------------------------
// Row access: Table Storage, or the dev mock
// ---------------------------------------------------------------------------

const clients = new Map<string, TableClient>();
const ensured = new Set<string>();

const signal = () => ({ abortSignal: AbortSignal.timeout(TIMEOUT_MS) });
const statusOf = (err: unknown) => (err as { statusCode?: number }).statusCode;

async function client(kind: TableKind): Promise<TableClient> {
  const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!connectionString) throw new Error("Storage is not configured");
  const table = tableName(kind);
  let c = clients.get(table);
  if (!c) {
    // Plain http is allowed only for a local emulator (Azurite), which the
    // route checks use; Azure endpoints are always https.
    const local = /(EndpointSuffix|TableEndpoint)=http:\/\/(127\.0\.0\.1|localhost)[:/]|UseDevelopmentStorage=true/i.test(
      connectionString,
    );
    c = TableClient.fromConnectionString(connectionString, table, { allowInsecureConnection: local });
    clients.set(table, c);
  }
  if (!ensured.has(table)) {
    try {
      await c.createTable(signal());
    } catch (err) {
      if (statusOf(err) !== 409) throw err;
    }
    ensured.add(table);
  }
  return c;
}

type Row<T> = T & { etag: string };
type Fields = Record<string, string | number | boolean>;

const mockKey = (pk: string, rk: string) => `${pk}|${rk}`;

/** Inserts a row; returns false when the key already exists. */
async function insertRow(kind: TableKind, pk: string, rk: string, fields: Fields): Promise<boolean> {
  if (devMockEnabled()) return mockInsert(tableName(kind), mockKey(pk, rk), fields);
  const c = await client(kind);
  try {
    await c.createEntity({ partitionKey: pk, rowKey: rk, ...fields }, signal());
    return true;
  } catch (err) {
    if (statusOf(err) === 409) return false;
    throw err;
  }
}

async function readRow<T>(kind: TableKind, pk: string, rk: string): Promise<Row<T> | null> {
  if (devMockEnabled()) return mockRead<Row<T>>(tableName(kind), mockKey(pk, rk));
  const c = await client(kind);
  try {
    const e = await c.getEntity<Record<string, unknown>>(pk, rk, signal());
    return e as unknown as Row<T>;
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

/** Merges only if the row is unchanged since it was read; false when another writer got there first. */
async function mergeRowIf(kind: TableKind, pk: string, rk: string, etag: string, patch: Fields): Promise<boolean> {
  if (devMockEnabled()) return mockMergeIf(tableName(kind), mockKey(pk, rk), etag, patch) !== null;
  const c = await client(kind);
  try {
    await c.updateEntity({ partitionKey: pk, rowKey: rk, ...patch }, "Merge", { etag, ...signal() });
    return true;
  } catch (err) {
    if (statusOf(err) === 412) return false;
    throw err;
  }
}

async function mergeRow(kind: TableKind, pk: string, rk: string, patch: Fields): Promise<void> {
  if (devMockEnabled()) {
    mockMerge(tableName(kind), mockKey(pk, rk), patch);
    return;
  }
  const c = await client(kind);
  await c.upsertEntity({ partitionKey: pk, rowKey: rk, ...patch }, "Merge", signal());
}

/**
 * Read, change, write, with the ETag guarding the write; up to three tries.
 * `change` gets the current row (or null) and returns the fields to write, or
 * null to write nothing. It may run more than once, so it must not have side
 * effects. Throws when every try loses a race: the caller then answers
 * without a reply, which is the safe side of every limit.
 */
async function readModifyWrite<T extends Fields>(
  kind: TableKind,
  pk: string,
  rk: string,
  change: (current: T | null) => Partial<T> | null,
): Promise<T | null> {
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    // A short random pause before a retry, so racing writers spread out.
    if (attempt > 0) await new Promise((r) => setTimeout(r, 10 + Math.random() * 40 * attempt));
    const current = await readRow<T>(kind, pk, rk);
    const patch = change(current ? withoutMeta(current) : null);
    if (!patch) return current ? withoutMeta(current) : null;
    const next = { ...(current ? withoutMeta(current) : {}), ...patch } as T;
    const written = current
      ? await mergeRowIf(kind, pk, rk, current.etag, patch as Fields)
      : await insertRow(kind, pk, rk, next);
    if (written) return next;
  }
  throw new Error(`Storage write lost ${ATTEMPTS} races on ${tableName(kind)}.`);
}

/** The row's own fields, without the keys, ETag, and service metadata. */
function withoutMeta<T>(row: Row<T> | T): T {
  const copy = { ...(row as Record<string, unknown>) };
  for (const k of ["etag", "partitionKey", "rowKey", "timestamp", "odata.metadata"]) delete copy[k];
  return copy as T;
}

// ---------------------------------------------------------------------------
// Inbound messages: one row per MessageSid, which deduplicates Twilio retries
// ---------------------------------------------------------------------------

/** "blocked": a sender outside +1, never classified or hashed (FR-06). */
export type InboundClassification = "pending" | "meet" | "stop" | "start" | "help" | "other" | "blocked";

const dayKey = (at: Date) => at.toISOString().slice(0, 10);

/**
 * Claims an inbound message. Returns false when the MessageSid was already
 * claimed, so a retried webhook gets no second reply. The partition is the
 * UTC day the message arrived; Twilio retries within seconds, so a retry
 * across midnight is the one case this would miss.
 */
export async function claimInbound(messageSid: string, receivedAt: Date): Promise<boolean> {
  assertKey(messageSid, MESSAGE_SID, "MessageSid");
  return insertRow("inbound", dayKey(receivedAt), messageSid, {
    receivedAt: receivedAt.toISOString(),
    classification: "pending",
    conversationId: "",
  });
}

/** Records what the message was. No message text is stored. */
export async function classifyInbound(
  messageSid: string,
  receivedAt: Date,
  classification: Exclude<InboundClassification, "pending">,
  conversationId = "",
): Promise<void> {
  assertKey(messageSid, MESSAGE_SID, "MessageSid");
  await mergeRow("inbound", dayKey(receivedAt), messageSid, { classification, conversationId });
}

// ---------------------------------------------------------------------------
// Senders: keyed by the phone hash
// ---------------------------------------------------------------------------

export type SenderRecord = {
  firstSeenAt: string;
  lastSeenAt: string;
  optedOut: boolean;
  /** Empty when never opted out. */
  optedOutAt: string;
  /** Empty until the first MEET. */
  latestConversationId: string;
  /** When that conversation was created; a MEET within 24 hours reuses it. */
  latestConversationAt: string;
  /** MEET replies sent in the window that began at meetWindowStart. */
  meetReplyCount: number;
  meetWindowStart: string;
  /** Nudges sent in the window that began at otherWindowStart. */
  otherReplyCount: number;
  otherWindowStart: string;
};

export function newSender(now: Date): SenderRecord {
  const at = now.toISOString();
  return {
    firstSeenAt: at,
    lastSeenAt: at,
    optedOut: false,
    optedOutAt: "",
    latestConversationId: "",
    latestConversationAt: "",
    meetReplyCount: 0,
    meetWindowStart: "",
    otherReplyCount: 0,
    otherWindowStart: "",
  };
}

export async function getSender(phoneHash: string): Promise<SenderRecord | null> {
  assertKey(phoneHash, PHONE_HASH, "phone hash");
  const row = await readRow<SenderRecord>("senders", SENDER_PARTITION, phoneHash);
  return row ? withoutMeta(row) : null;
}

/**
 * Changes a sender under the ETag: `change` gets the current record (null for
 * a new sender) and returns the fields to set, or null to leave it as is.
 * Returns the record as written. The rate limit decisions in the route are
 * made inside `change`, so two texts from one number at once cannot both
 * take the last reply.
 */
export async function updateSender(
  phoneHash: string,
  change: (current: SenderRecord | null) => Partial<SenderRecord> | null,
): Promise<SenderRecord | null> {
  assertKey(phoneHash, PHONE_HASH, "phone hash");
  return readModifyWrite<SenderRecord>("senders", SENDER_PARTITION, phoneHash, change);
}

// ---------------------------------------------------------------------------
// Conversations: one per MEET link
// ---------------------------------------------------------------------------

export type ConversationStatus = "sent" | "opened" | "booked";

export type ConversationRecord = {
  phoneHash: string;
  keyword: string;
  /** A known placement code, or "none". */
  placement: string;
  createdAt: string;
  linkExpiresAt: string;
  /** Empty until the link is first opened. */
  linkOpenedAt: string;
  linkOpenCount: number;
  /** Empty until a booking is made from the link. */
  bookingId: string;
  bookedAt: string;
  status: ConversationStatus;
};

export async function createConversation(
  conversationId: string,
  record: Pick<ConversationRecord, "phoneHash" | "keyword" | "placement" | "createdAt" | "linkExpiresAt">,
): Promise<void> {
  assertKey(conversationId, CONVERSATION_ID, "conversation ID");
  assertKey(record.phoneHash, PHONE_HASH, "phone hash");
  const full: ConversationRecord = {
    ...record,
    linkOpenedAt: "",
    linkOpenCount: 0,
    bookingId: "",
    bookedAt: "",
    status: "sent",
  };
  const inserted = await insertRow("conversations", CONVERSATION_PARTITION, conversationId, full);
  if (!inserted) throw new Error("Conversation ID already exists.");
}

export async function getConversation(conversationId: string): Promise<ConversationRecord | null> {
  if (!CONVERSATION_ID.test(conversationId)) return null;
  const row = await readRow<ConversationRecord>("conversations", CONVERSATION_PARTITION, conversationId);
  return row ? withoutMeta(row) : null;
}

/** Counts an open of the link; the first open sets the time and the status. Null when unknown. */
export async function recordLinkOpen(conversationId: string, now: Date): Promise<ConversationRecord | null> {
  if (!CONVERSATION_ID.test(conversationId)) return null;
  return readModifyWrite<ConversationRecord>("conversations", CONVERSATION_PARTITION, conversationId, (c) =>
    c
      ? {
          linkOpenCount: (c.linkOpenCount ?? 0) + 1,
          linkOpenedAt: c.linkOpenedAt || now.toISOString(),
          status: c.status === "booked" ? "booked" : "opened",
        }
      : null,
  );
}

/** Links a booking to the conversation its link came from. Null when unknown. */
export async function markConversationBooked(
  conversationId: string,
  bookingId: string,
  now: Date,
): Promise<ConversationRecord | null> {
  if (!CONVERSATION_ID.test(conversationId)) return null;
  return readModifyWrite<ConversationRecord>("conversations", CONVERSATION_PARTITION, conversationId, (c) =>
    c ? { bookingId, bookedAt: now.toISOString(), status: "booked" } : null,
  );
}

// ---------------------------------------------------------------------------
// Site-wide counters: replies per hour and per day
// ---------------------------------------------------------------------------

export type CounterKind = "hour" | "day";

type CounterRecord = { count: number; cap: number; alertedAt: string };

/** The current window for each counter, in UTC: "2026-11-22T14" and "2026-11-22". */
export function counterWindow(kind: CounterKind, now: Date): string {
  const iso = now.toISOString();
  return kind === "hour" ? iso.slice(0, 13) : iso.slice(0, 10);
}

export type CounterResult = {
  /** Whether this reply fits under the cap; when true, it has been counted. */
  allowed: boolean;
  count: number;
  /** True for exactly one refused request per window: the one that should send the alert email. */
  alert: boolean;
};

/**
 * Takes one reply from the window's allowance. Under the cap the count goes
 * up and the reply is allowed. At the cap nothing is counted, and the first
 * refusal in the window marks the row and returns `alert: true`, so the cap
 * email goes once per window however many instances hit it.
 */
export async function incrementCounter(kind: CounterKind, now: Date, cap: number): Promise<CounterResult> {
  const window = counterWindow(kind, now);
  let result: CounterResult = { allowed: false, count: 0, alert: false };
  await readModifyWrite<CounterRecord>("counters", kind, window, (c) => {
    const count = c?.count ?? 0;
    if (count < cap) {
      result = { allowed: true, count: count + 1, alert: false };
      return { count: count + 1, cap, alertedAt: c?.alertedAt ?? "" };
    }
    if (!c?.alertedAt) {
      result = { allowed: false, count, alert: true };
      return { count, cap, alertedAt: now.toISOString() };
    }
    result = { allowed: false, count, alert: false };
    return null;
  });
  return result;
}

// ---------------------------------------------------------------------------
// Retention (task 043): rows go 12 months after their last activity
// ---------------------------------------------------------------------------

/** Counsel approved 12 months from last activity (task 004). */
export const RETENTION_DAYS = 365;
/** Counter windows are only read in the hour or day they name. */
const COUNTER_KEEP_DAYS = 2;
/** Deletes per run at most; anything left goes the next day. */
const PURGE_LIMIT = 500;
const PURGE_PARTITION = "purge";
const LIST_TIMEOUT_MS = 30_000;
const DAY_MS = 86_400_000;

type Listed<T> = { pk: string; rk: string; etag: string; row: T };

/**
 * Rows that `keep` rejects, at most `limit`. In Azure the filter narrows the
 * listing on the server; `keep` is checked on every row either way, so the
 * filter can be loose but never wider than the rule.
 */
async function listRows<T>(
  kind: TableKind,
  filter: string,
  purge: (pk: string, rk: string, row: T) => boolean,
  limit: number,
): Promise<Listed<T>[]> {
  const found: Listed<T>[] = [];
  if (limit <= 0) return found;
  if (devMockEnabled()) {
    for (const [key, row] of mockEntries<Row<T>>(tableName(kind))) {
      const cut = key.indexOf("|");
      const pk = key.slice(0, cut);
      const rk = key.slice(cut + 1);
      if (purge(pk, rk, row)) found.push({ pk, rk, etag: row.etag, row });
      if (found.length >= limit) break;
    }
    return found;
  }
  const c = await client(kind);
  const entities = c.listEntities<Record<string, unknown>>({
    queryOptions: { filter },
    abortSignal: AbortSignal.timeout(LIST_TIMEOUT_MS),
  });
  for await (const e of entities) {
    const row = e as unknown as T;
    if (purge(e.partitionKey ?? "", e.rowKey ?? "", row)) {
      found.push({ pk: e.partitionKey ?? "", rk: e.rowKey ?? "", etag: e.etag, row });
    }
    if (found.length >= limit) break;
  }
  return found;
}

/** Deletes a row only if it is unchanged since it was listed; false when it changed or is gone. */
async function deleteRowIf(kind: TableKind, pk: string, rk: string, etag: string): Promise<boolean> {
  if (devMockEnabled()) {
    const key = mockKey(pk, rk);
    if (mockRead<Row<Fields>>(tableName(kind), key)?.etag !== etag) return false;
    mockDelete(tableName(kind), key);
    return true;
  }
  const c = await client(kind);
  try {
    await c.deleteEntity(pk, rk, { etag, ...signal() });
    return true;
  } catch (err) {
    const status = statusOf(err);
    if (status === 404 || status === 412) return false;
    throw err;
  }
}

/** Claims today's purge (UTC); false when another run already has. */
export async function claimDailyPurge(now: Date): Promise<boolean> {
  return insertRow("counters", PURGE_PARTITION, dayKey(now), { startedAt: now.toISOString() });
}

export type PurgeResult = {
  conversations: number;
  senders: number;
  inbound: number;
  counters: number;
  /** True when the run stopped at its limit with rows possibly left. */
  capped: boolean;
};

/**
 * Deletes rows past retention:
 * - conversations whose latest activity (created, opened, booked) is over 12
 *   months old. A booking row keeps its own `smsConversationId`; the booking
 *   itself is kept on the /meet terms.
 * - senders not seen for 12 months, unless they opted out: an opted-out row is
 *   kept so a MEET after STOP still gets nothing.
 * - inbound rows from UTC days over 12 months old.
 * - counter windows, and past purge claims, over 2 days old.
 * A row changed since it was listed is left for the next run.
 */
export async function purgeSmsRows(now: Date): Promise<PurgeResult> {
  const cutoff = new Date(now.getTime() - RETENTION_DAYS * DAY_MS).toISOString();
  const inboundCutoff = cutoff.slice(0, 10);
  const counterCutoff = dayKey(new Date(now.getTime() - COUNTER_KEEP_DAYS * DAY_MS));
  const result: PurgeResult = { conversations: 0, senders: 0, inbound: 0, counters: 0, capped: false };
  let budget = PURGE_LIMIT;

  const sweep = async <T>(
    kind: TableKind,
    filter: string,
    purge: (pk: string, rk: string, row: T) => boolean,
  ): Promise<number> => {
    const rows = await listRows<T>(kind, filter, purge, budget);
    if (rows.length >= budget) result.capped = true;
    budget -= rows.length;
    let deleted = 0;
    for (const r of rows) if (await deleteRowIf(kind, r.pk, r.rk, r.etag)) deleted++;
    return deleted;
  };

  const latest = (...times: (string | undefined)[]) => times.reduce<string>((a, t) => (t && t > a ? t : a), "");

  result.conversations = await sweep<ConversationRecord>(
    "conversations",
    odata`PartitionKey eq ${CONVERSATION_PARTITION} and createdAt lt ${cutoff}`,
    (pk, _rk, c) => pk === CONVERSATION_PARTITION && latest(c.createdAt, c.linkOpenedAt, c.bookedAt) < cutoff,
  );
  result.senders = await sweep<SenderRecord>(
    "senders",
    odata`PartitionKey eq ${SENDER_PARTITION} and lastSeenAt lt ${cutoff} and optedOut eq ${false}`,
    (pk, _rk, s) => pk === SENDER_PARTITION && !s.optedOut && Boolean(s.lastSeenAt) && s.lastSeenAt < cutoff,
  );
  result.inbound = await sweep<Fields>(
    "inbound",
    odata`PartitionKey lt ${inboundCutoff}`,
    (pk) => pk < inboundCutoff,
  );
  result.counters = await sweep<Fields>(
    "counters",
    odata`RowKey lt ${counterCutoff}`,
    (_pk, rk) => rk < counterCutoff,
  );
  return result;
}
