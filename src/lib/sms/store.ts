import { TableClient } from "@azure/data-tables";
import { devMockEnabled, mockInsert, mockMerge, mockMergeIf, mockRead } from "@/lib/meet/dev-mock";

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
    c = TableClient.fromConnectionString(connectionString, table);
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

export type InboundClassification = "pending" | "meet" | "stop" | "start" | "help" | "other";

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
