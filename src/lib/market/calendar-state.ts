import { createHash } from "node:crypto";
import { getTable, statusOf } from "@/lib/market/tables";

/**
 * What the calendar sync remembers about each event it has logged (phase 2
 * FR-06, task 030). `calendarView` does not report changes, so each run
 * compares what Graph returns with these rows.
 *
 *   MaCalendarEvents  partition: mailbox ID   row key: SHA-256 of the iCalUId
 *
 * A row holds the event ID, start, end, the contact IDs and which entries are
 * logged; never the subject. Each row is written whole after its entries, so
 * a run cut short leaves every row as one run or the other wrote it. Rows go
 * once the event ended more than 30 days ago.
 */

export const CALENDAR_STATE_KEEP_DAYS = 30;

export type CalendarState = {
  mailboxId: string;
  iCalUId: string;
  eventId: string;
  start: string;
  end: string;
  seriesMasterId?: string;
  contactIds: string[];
  /** Entries logged: `booked`, `held`, `cancelled`, and `moved:<start>` for each move. */
  logged: string[];
  updatedAt: string;
};

type Entity = {
  partitionKey: string;
  rowKey: string;
  iCalUId: string;
  eventId: string;
  start: string;
  end: string;
  seriesMasterId?: string;
  contactIds: string;
  logged: string;
  updatedAt: string;
};

/** The row key for an iCalUId, which may hold characters a row key cannot. */
export function calendarRowKey(iCalUId: string): string {
  return createHash("sha256").update(iCalUId).digest("hex");
}

function list(value: string | undefined): string[] {
  try {
    const v = JSON.parse(value ?? "[]") as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function fromEntity(e: Entity): CalendarState {
  return {
    mailboxId: e.partitionKey,
    iCalUId: e.iCalUId,
    eventId: e.eventId,
    start: e.start,
    end: e.end,
    seriesMasterId: e.seriesMasterId || undefined,
    contactIds: list(e.contactIds),
    logged: list(e.logged),
    updatedAt: e.updatedAt,
  };
}

/** Every row for one mailbox, keyed by iCalUId. */
export async function loadCalendarStates(mailboxId: string): Promise<Map<string, CalendarState>> {
  const out = new Map<string, CalendarState>();
  const t = await getTable("calendarEvents");
  if (!t) return out;
  for await (const e of t.listEntities<Entity>({ queryOptions: { filter: `PartitionKey eq '${mailboxId.replace(/'/g, "''")}'` } })) {
    const s = fromEntity(e);
    out.set(s.iCalUId, s);
  }
  return out;
}

export async function saveCalendarState(s: Omit<CalendarState, "updatedAt">, now = new Date()): Promise<void> {
  const t = await getTable("calendarEvents");
  if (!t) return;
  await t.upsertEntity<Entity>(
    {
      partitionKey: s.mailboxId,
      rowKey: calendarRowKey(s.iCalUId),
      iCalUId: s.iCalUId,
      eventId: s.eventId,
      start: s.start,
      end: s.end,
      seriesMasterId: s.seriesMasterId ?? "",
      contactIds: JSON.stringify([...new Set(s.contactIds)].sort()),
      logged: JSON.stringify([...new Set(s.logged)]),
      updatedAt: now.toISOString(),
    },
    "Replace",
  );
}

/** Delete one mailbox's rows for events that ended more than 30 days before `now`. Returns how many. */
export async function pruneCalendarStates(mailboxId: string, now = new Date(), states?: Map<string, CalendarState>): Promise<number> {
  const t = await getTable("calendarEvents");
  if (!t) return 0;
  const cutoff = new Date(now.getTime() - CALENDAR_STATE_KEEP_DAYS * 86_400_000).toISOString();
  let n = 0;
  for (const s of (states ?? (await loadCalendarStates(mailboxId))).values()) {
    if (s.end >= cutoff) continue;
    try {
      await t.deleteEntity(mailboxId, calendarRowKey(s.iCalUId));
      states?.delete(s.iCalUId);
      n++;
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
  }
  return n;
}
