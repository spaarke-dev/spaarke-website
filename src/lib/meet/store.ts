import { createHash, randomBytes } from "node:crypto";
import { odata, TableClient } from "@azure/data-tables";
import type { Attribution } from "@/lib/attribution";
import {
  devMockEnabled,
  mockDelete,
  mockInsert,
  mockList,
  mockMerge,
  mockMergeIf,
  mockRead,
} from "@/lib/meet/dev-mock";

/**
 * Booking records and slot locks in Table Storage.
 *
 * Unlike the contact and design partner tables, storage is required here: the
 * slot lock is what stops two visitors on two instances taking one slot, and
 * the reschedule and cancel links look the meeting up by booking ID. With no
 * storage the flow refuses to book rather than book without either.
 *
 * Table names can be overridden so local checks never write to live tables.
 */

const BOOKINGS_TABLE = process.env.MEET_BOOKINGS_TABLE?.trim() || "MeetingBookings";
const LOCKS_TABLE = process.env.MEET_LOCKS_TABLE?.trim() || "MeetingSlotLocks";
const PARTITION = "meeting";

const clients = new Map<string, TableClient>();
const ensured = new Set<string>();

async function getClient(table: string): Promise<TableClient | null> {
  const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!connectionString) return null;

  let client = clients.get(table);
  if (!client) {
    client = TableClient.fromConnectionString(connectionString, table);
    clients.set(table, client);
  }
  if (!ensured.has(table)) {
    try {
      await client.createTable();
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code && code !== 409) throw err;
    }
    ensured.add(table);
  }
  return client;
}

export function isStorageConfigured(): boolean {
  return devMockEnabled() || Boolean(process.env.STORAGE_ACCOUNT_CONNECTION);
}

export function newBookingId(now = Date.now()): string {
  return `${now}-${randomBytes(4).toString("hex")}`;
}

// ---------------------------------------------------------------------------
// Slot locks
// ---------------------------------------------------------------------------

function lockKeys(host: string, start: number) {
  // The host is hashed so the row key holds no mailbox address.
  const hostKey = createHash("sha256").update(host.toLowerCase()).digest("hex").slice(0, 16);
  return { partitionKey: hostKey, rowKey: new Date(start).toISOString() };
}

/**
 * Claims a slot. Returns false when another booking already holds it. An
 * insert of an existing key fails with 409 on every instance at once, which
 * is the property the in-memory cache and rate limiter cannot give.
 */
export async function acquireSlotLock(host: string, start: number, bookingId: string): Promise<boolean> {
  if (devMockEnabled()) {
    const k = lockKeys(host, start);
    return mockInsert(LOCKS_TABLE, `${k.partitionKey}|${k.rowKey}`, { bookingId });
  }
  const client = await getClient(LOCKS_TABLE);
  if (!client) throw new Error("Storage is not configured");
  try {
    await client.createEntity({ ...lockKeys(host, start), bookingId, createdAt: new Date().toISOString() });
    return true;
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 409) return false;
    throw err;
  }
}

/** Releases a slot, but only if the given booking holds it. Never throws. */
export async function releaseSlotLock(host: string, start: number, bookingId: string): Promise<void> {
  if (devMockEnabled()) {
    const k = lockKeys(host, start);
    const key = `${k.partitionKey}|${k.rowKey}`;
    if (mockRead<{ bookingId: string }>(LOCKS_TABLE, key)?.bookingId === bookingId) mockDelete(LOCKS_TABLE, key);
    return;
  }
  try {
    const client = await getClient(LOCKS_TABLE);
    if (!client) return;
    const keys = lockKeys(host, start);
    const row = await client.getEntity<{ bookingId?: string }>(keys.partitionKey, keys.rowKey);
    if (row.bookingId !== bookingId) return;
    await client.deleteEntity(keys.partitionKey, keys.rowKey, { etag: row.etag });
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 404) return;
    console.error("[meet] Failed to release slot lock:", err);
  }
}

// ---------------------------------------------------------------------------
// Booking records
// ---------------------------------------------------------------------------

export type BookingStatus = "pending" | "booked" | "rescheduled" | "cancelled" | "failed";

export type BookingRecord = {
  bookingId: string;
  status: BookingStatus;
  eventId: string;
  start: string;
  end: string;
  visitorTimeZone: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  topic: string;
  ipHash: string;
  createdAt: string;
  updatedAt: string;
  entry_referrer: string;
  entry_landing: string;
  first_visit_at: string;
  ai_source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  // Added with the branded emails and guests. Rows booked before then lack them.
  /** JSON array of guest addresses, at most five. */
  guests?: string;
  /** The Teams link, kept for the reminder emails. */
  joinUrl?: string;
  /** The meeting start (ISO) each reminder was sent for. A move re-arms both. */
  reminder24hFor?: string;
  reminder1hFor?: string;
  /** How many times the guest list was changed from the manage page. */
  guestChanges?: number;
  /** When the meeting was last moved. */
  movedAt?: string;
};

/** A booking row with the ETag it was read at, for conditional writes. */
export type BookingRow = BookingRecord & { etag: string };

export function guestsOf(b: Pick<BookingRecord, "guests">): string[] {
  if (!b.guests) return [];
  try {
    const parsed: unknown = JSON.parse(b.guests);
    return Array.isArray(parsed) ? parsed.filter((g): g is string => typeof g === "string") : [];
  } catch {
    return [];
  }
}

/** Attribution as sent by the browser: untrusted, so typed and capped here. */
export function attributionFields(a?: Attribution | null) {
  const f = (v: unknown) => (typeof v === "string" ? v.slice(0, 500) : "");
  return {
    entry_referrer: f(a?.entry_referrer),
    entry_landing: f(a?.entry_landing),
    first_visit_at: f(a?.first_visit_at),
    ai_source: f(a?.ai_source),
    utm_source: f(a?.utm_source),
    utm_medium: f(a?.utm_medium),
    utm_campaign: f(a?.utm_campaign),
  };
}

export async function createBooking(record: BookingRecord): Promise<void> {
  if (devMockEnabled()) {
    mockInsert(BOOKINGS_TABLE, record.bookingId, record);
    return;
  }
  const client = await getClient(BOOKINGS_TABLE);
  if (!client) throw new Error("Storage is not configured");
  await client.createEntity({ partitionKey: PARTITION, rowKey: record.bookingId, ...record });
}

export async function getBooking(bookingId: string): Promise<BookingRecord | null> {
  if (devMockEnabled()) return mockRead<BookingRecord>(BOOKINGS_TABLE, bookingId);
  const client = await getClient(BOOKINGS_TABLE);
  if (!client) return null;
  try {
    const row = await client.getEntity<BookingRecord>(PARTITION, bookingId);
    return row as unknown as BookingRecord;
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 404) return null;
    throw err;
  }
}

export async function updateBooking(
  bookingId: string,
  patch: Partial<Omit<BookingRecord, "bookingId">>,
): Promise<void> {
  if (devMockEnabled()) {
    mockMerge(BOOKINGS_TABLE, bookingId, { ...patch, updatedAt: new Date().toISOString() });
    return;
  }
  const client = await getClient(BOOKINGS_TABLE);
  if (!client) throw new Error("Storage is not configured");
  await client.updateEntity(
    { partitionKey: PARTITION, rowKey: bookingId, ...patch, updatedAt: new Date().toISOString() },
    "Merge",
  );
}

/**
 * Bookings whose meeting starts in [from, to). Start times are stored as ISO
 * strings in UTC, which sort the same as the times they name.
 */
export async function listBookingsStartingBetween(from: number, to: number): Promise<BookingRow[]> {
  const a = new Date(from).toISOString();
  const b = new Date(to).toISOString();
  if (devMockEnabled()) {
    return mockList<BookingRow>(BOOKINGS_TABLE).filter((r) => r.start >= a && r.start < b);
  }
  const client = await getClient(BOOKINGS_TABLE);
  if (!client) throw new Error("Storage is not configured");
  const rows: BookingRow[] = [];
  const entities = client.listEntities<BookingRecord>({
    queryOptions: { filter: odata`PartitionKey eq ${PARTITION} and start ge ${a} and start lt ${b}` },
  });
  for await (const e of entities) rows.push({ ...(e as unknown as BookingRecord), etag: e.etag });
  return rows;
}

/**
 * Merges the patch only if the row is unchanged since it was read. Returns the
 * new ETag, or null when another writer got there first. This is how two
 * reminder runs at once agree on which of them sends.
 */
export async function updateBookingIfUnchanged(
  bookingId: string,
  etag: string,
  patch: Partial<Omit<BookingRecord, "bookingId">>,
): Promise<string | null> {
  const full = { ...patch, updatedAt: new Date().toISOString() };
  if (devMockEnabled()) return mockMergeIf(BOOKINGS_TABLE, bookingId, etag, full);
  const client = await getClient(BOOKINGS_TABLE);
  if (!client) throw new Error("Storage is not configured");
  try {
    const res = await client.updateEntity({ partitionKey: PARTITION, rowKey: bookingId, ...full }, "Merge", { etag });
    return res.etag ?? "";
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 412) return null;
    throw err;
  }
}
