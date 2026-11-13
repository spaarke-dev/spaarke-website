import { createHash, randomBytes } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import type { Attribution } from "@/lib/attribution";

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
  return Boolean(process.env.STORAGE_ACCOUNT_CONNECTION);
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
};

export function attributionFields(a?: Attribution | null) {
  return {
    entry_referrer: a?.entry_referrer ?? "",
    entry_landing: a?.entry_landing ?? "",
    first_visit_at: a?.first_visit_at ?? "",
    ai_source: a?.ai_source ?? "",
    utm_source: a?.utm_source ?? "",
    utm_medium: a?.utm_medium ?? "",
    utm_campaign: a?.utm_campaign ?? "",
  };
}

export async function createBooking(record: BookingRecord): Promise<void> {
  const client = await getClient(BOOKINGS_TABLE);
  if (!client) throw new Error("Storage is not configured");
  await client.createEntity({ partitionKey: PARTITION, rowKey: record.bookingId, ...record });
}

export async function getBooking(bookingId: string): Promise<BookingRecord | null> {
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
  const client = await getClient(BOOKINGS_TABLE);
  if (!client) throw new Error("Storage is not configured");
  await client.updateEntity(
    { partitionKey: PARTITION, rowKey: bookingId, ...patch, updatedAt: new Date().toISOString() },
    "Merge",
  );
}
