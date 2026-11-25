import { TableClient } from "@azure/data-tables";
import {
  calendarWindow,
  getCalendarEvent,
  listCalendarView,
  type CalendarEvent,
  type CalendarWindow,
} from "@/lib/market/graph-calendar";
import {
  loadCalendarStates,
  pruneCalendarStates,
  saveCalendarState,
  type CalendarState,
} from "@/lib/market/calendar-state";
import { hasInPersonMeetingNear, recordActivity } from "@/lib/market/activity";
import { findContactByEmail } from "@/lib/market/contacts";
import { emailDomain, sha256 } from "@/lib/market/keys";
import { getTable, statusOf } from "@/lib/market/tables";
import type { MailDeps, MailSettings } from "@/lib/market/graph-mail";
import type { Mailbox } from "@/lib/market/mailboxes";
import type { ActivityType, Contact } from "@/lib/market/types";

/**
 * The calendar part of a sync run (phase 2 FR-06 and FR-07), for a mailbox
 * with Read calendar on. It runs after the mailbox's mail, inside the same
 * deadline, and its failure never fails the mail: the sync records it apart.
 *
 * For each event with a known contact (never the mailbox's own domain) it logs:
 *
 * - `calendar.booked` once, dated when the event was created; for a recurring
 *   meeting, once for the whole series;
 * - `calendar.moved` when the start changes, or an event gone from the window
 *   is found elsewhere by its ID;
 * - `calendar.cancelled` when canceled, or gone and answering 404;
 * - `calendar.held` once the end has passed without a cancellation, dated at
 *   the start.
 *
 * Source IDs come from the `iCalUId`, so one meeting seen in two calendars is
 * logged once. `/meet` bookings are logged by the booking code, so their
 * events are skipped here. Telemetry carries counts only: never a subject or
 * an attendee.
 */

export const CALENDAR_SOURCE = "graph-calendar";

export type CalendarSummary = {
  ok: boolean;
  error?: string;
  /** Events read in the window. */
  events: number;
  booked: number;
  moved: number;
  cancelled: number;
  held: number;
  /** `/meet` bookings, which the booking code logs. */
  skippedMeet: number;
  /** Entries another mailbox or an earlier run had already logged. */
  duplicates: number;
  /** Entries left out because the contact already has an in-person entry for that meeting (the TLTF import). */
  alreadyMet: number;
  /** State rows for events that ended more than 30 days ago, removed this run. */
  pruned: number;
  /** False when the deadline stopped it; the next run reads the whole window again. */
  complete: boolean;
};

export function emptyCalendarSummary(over: Partial<CalendarSummary> = {}): CalendarSummary {
  return { ok: true, events: 0, booked: 0, moved: 0, cancelled: 0, held: 0, skippedMeet: 0, duplicates: 0, alreadyMet: 0, pruned: 0, complete: true, ...over };
}

/** `/meet` events to skip: their IDs in the host's calendar and their iCalUIds anywhere. */
export type MeetSkip = { ids: Set<string>; uids: Set<string> };

export type CalendarOptions = MailDeps & {
  settings: MailSettings;
  deadline: number;
  now?: Date;
  /** Events per run (default 1,000). */
  maxEvents?: number;
  /** The `/meet` events to skip; worked out once per run when not given. */
  meet?: MeetSkip;
  /** Contacts already looked up this run, by address. */
  contacts?: Map<string, Contact | null>;
};

// ---- Pure helpers ----

const EXCHANGE_UID = /^040000008200E00074C5B7101A82E008/i;

/**
 * The key a recurring meeting's occurrences share across calendars. Exchange
 * builds an occurrence's iCalUId from the series' by writing the occurrence
 * date into bytes 16 to 19, so zeroing them gives the series. Other UIDs fall
 * back to the series ID, which is this mailbox's own. Pure.
 */
export function seriesKey(e: Pick<CalendarEvent, "iCalUId" | "seriesMasterId">): string | undefined {
  if (!e.seriesMasterId) return undefined;
  if (EXCHANGE_UID.test(e.iCalUId) && e.iCalUId.length >= 40) {
    return `${e.iCalUId.slice(0, 32)}00000000${e.iCalUId.slice(40)}`.toUpperCase();
  }
  return `series:${e.seriesMasterId}`;
}

/** The people on an event other than the mailbox and its own domain. Pure. */
export function eventCounterparts(e: Pick<CalendarEvent, "organizer" | "attendees">, mailbox: string): string[] {
  const own = mailbox.toLowerCase();
  const domain = emailDomain(own);
  return [...new Set([e.organizer, ...e.attendees].filter((a): a is string => Boolean(a)))].filter(
    (a) => a !== own && emailDomain(a) !== domain,
  );
}

const HOST_ZONE = () => process.env.MEET_HOST_TIME_ZONE?.trim() || "America/New_York";

/**
 * "Meeting on Tue, Dec 1, 2026, 10:00 AM EST, online". The place is left out
 * when it is not known (a deleted event). Pure apart from the time zone setting.
 */
export function meetingSummary(e: { start: string; isOnline?: boolean }, prefix = "Meeting on"): string {
  const when = new Intl.DateTimeFormat("en-US", {
    timeZone: HOST_ZONE(),
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(e.start));
  return e.isOnline === undefined ? `${prefix} ${when}` : `${prefix} ${when}, ${e.isOnline ? "online" : "in person"}`;
}

// ---- /meet bookings ----

const MEET_PARTITION = "meet";

type MeetEntity = { partitionKey: string; rowKey: string; eventId: string; iCalUId: string; start: string; updatedAt: string };

/** Booking event IDs whose meeting starts inside the window, from the /meet bookings table. */
export async function bookingEventIds(window: CalendarWindow): Promise<string[]> {
  const cs = process.env.STORAGE_ACCOUNT_CONNECTION?.trim();
  if (!cs) return [];
  const table = process.env.MEET_BOOKINGS_TABLE?.trim() || "MeetingBookings";
  const client = TableClient.fromConnectionString(cs, table, {
    allowInsecureConnection: cs.includes("UseDevelopmentStorage") || cs.includes("127.0.0.1"),
  });
  const ids: string[] = [];
  try {
    for await (const e of client.listEntities<{ eventId?: string; start?: string }>({
      queryOptions: { filter: `start ge '${window.start}' and start le '${window.end}'`, select: ["eventId", "start"] },
    })) {
      if (e.eventId) ids.push(e.eventId);
    }
  } catch (err) {
    if (statusOf(err) === 404) return [];
    throw err;
  }
  return ids;
}

/**
 * The `/meet` events to skip. Each booking's iCalUId is read once from the
 * host's calendar and kept in MaCalendarEvents (partition `meet`), so other
 * calendars can skip the same meeting whatever order the mailboxes run in.
 */
export async function resolveMeet(
  eventIds: string[],
  settings: MailSettings,
  host: string | undefined,
  deps: MailDeps = {},
  now = new Date(),
): Promise<MeetSkip> {
  const out: MeetSkip = { ids: new Set(eventIds), uids: new Set() };
  const t = await getTable("calendarEvents");
  for (const id of eventIds) {
    let row: MeetEntity | null = null;
    if (t) {
      try {
        row = await t.getEntity<MeetEntity>(MEET_PARTITION, sha256(id));
      } catch (err) {
        if (statusOf(err) !== 404) throw err;
      }
    }
    if (!row && host) {
      try {
        const e = await getCalendarEvent(settings, host, id, deps);
        row = { partitionKey: MEET_PARTITION, rowKey: sha256(id), eventId: id, iCalUId: e?.iCalUId ?? "", start: e?.start ?? "", updatedAt: now.toISOString() };
        if (t) await t.upsertEntity(row, "Replace");
      } catch (err) {
        // The host's ID still skips the event in the host's calendar.
        console.error("[calendar] /meet event lookup failed:", (err as Error).message);
      }
    }
    if (row?.iCalUId) out.uids.add(row.iCalUId);
  }
  return out;
}

// ---- One mailbox ----

async function contactFor(address: string, opts: CalendarOptions): Promise<Contact | null> {
  const cache = opts.contacts ?? (opts.contacts = new Map());
  if (!cache.has(address)) cache.set(address, await findContactByEmail(address));
  return cache.get(address) ?? null;
}

/** An event as the entries see it: a deleted one has no place. */
export type LogEvent = Omit<CalendarEvent, "isOnline"> & { isOnline?: boolean };

type Entry = {
  kind: "booked" | "moved" | "cancelled" | "held";
  sourceId: string;
  occurredAt: string;
  summary: string;
  logKey: string;
  /** Marked as logged without an entry: a meeting first seen already canceled. */
  silent?: boolean;
};

const TYPE: Record<Entry["kind"], ActivityType> = {
  booked: "calendar.booked",
  moved: "calendar.moved",
  cancelled: "calendar.cancelled",
  held: "calendar.held",
};

/** The entries an event needs now, given what is logged. Pure. */
export function entriesFor(e: LogEvent, state: Pick<CalendarState, "start" | "logged"> | undefined, now: Date): Entry[] {
  const logged = new Set(state?.logged ?? []);
  const out: Entry[] = [];
  const uid = e.iCalUId;
  const series = seriesKey(e);
  const at = (iso: string | undefined) => iso ?? now.toISOString();
  if (!state && e.isCancelled) {
    // Never seen booked: nothing to cancel on the timeline.
    return [{ kind: "cancelled", sourceId: "", occurredAt: at(e.modifiedAt), summary: "", logKey: "cancelled", silent: true }];
  }
  // A canceled meeting is done with.
  if (logged.has("cancelled")) return out;
  if (!logged.has("booked")) {
    out.push({
      kind: "booked",
      sourceId: `booked:${series ?? uid}`,
      occurredAt: at(e.createdAt),
      summary: meetingSummary(e, series ? "Recurring meeting, first on" : "Meeting on"),
      logKey: "booked",
    });
  }
  if (e.isCancelled) {
    if (!logged.has("cancelled")) {
      out.push({ kind: "cancelled", sourceId: `cancelled:${uid}`, occurredAt: at(e.modifiedAt), summary: meetingSummary(e, "Canceled the meeting on"), logKey: "cancelled" });
    }
    return out;
  }
  if (state && state.start !== e.start) {
    const key = `moved:${state.start}>${e.start}`;
    if (!logged.has(key)) {
      out.push({ kind: "moved", sourceId: `moved:${uid}:${state.start}>${e.start}`, occurredAt: at(e.modifiedAt), summary: meetingSummary(e, "Moved to"), logKey: key });
    }
  }
  if (e.end <= now.toISOString() && !logged.has("held")) {
    out.push({ kind: "held", sourceId: `held:${uid}`, occurredAt: e.start, summary: meetingSummary(e), logKey: "held" });
  }
  return out;
}

async function logEvent(
  e: LogEvent,
  contactIds: string[],
  state: CalendarState | undefined,
  mailbox: Mailbox,
  s: CalendarSummary,
  now: Date,
): Promise<CalendarState> {
  const logged = new Set(state?.logged ?? []);
  // A meeting another source logged as in person (the TLTF import) stays as that one entry.
  const met = new Map<string, boolean>();
  const alreadyMet = async (contactId: string) => {
    if (!met.has(contactId)) met.set(contactId, await hasInPersonMeetingNear(contactId, e.start));
    return met.get(contactId)!;
  };
  for (const entry of entriesFor(e, state, now)) {
    for (const contactId of entry.silent ? [] : contactIds) {
      if (await alreadyMet(contactId)) {
        s.alreadyMet++;
        continue;
      }
      const r = await recordActivity({
        type: TYPE[entry.kind],
        source: CALENDAR_SOURCE,
        sourceId: `${entry.sourceId}:${contactId.slice(0, 16)}`,
        occurredAt: entry.occurredAt,
        contactId,
        subject: e.isPrivate ? "Private meeting" : e.subject,
        summary: entry.summary,
        webLink: e.webLink,
        mailbox: mailbox.address,
      });
      if (r.status === "recorded") s[entry.kind]++;
      else if (r.status === "duplicate") s.duplicates++;
    }
    logged.add(entry.logKey);
  }
  return {
    mailboxId: mailbox.id,
    iCalUId: e.iCalUId,
    eventId: e.id,
    start: e.start,
    end: e.end,
    seriesMasterId: e.seriesMasterId,
    contactIds,
    logged: [...logged],
    updatedAt: now.toISOString(),
  };
}

/**
 * Read the window, log entries for events with known contacts, follow up on
 * logged events gone from the window, then remove old rows. Throws on a Graph
 * or storage failure; the sync records it.
 */
export async function syncCalendar(mailbox: Mailbox, opts: CalendarOptions): Promise<CalendarSummary> {
  const now = opts.now ?? new Date();
  const s = emptyCalendarSummary();
  const window = calendarWindow(now);
  const states = await loadCalendarStates(mailbox.id);
  const meet =
    opts.meet ??
    (opts.meet = await resolveMeet(await bookingEventIds(window), opts.settings, process.env.MEET_HOST?.trim(), opts, now));
  const seen = new Set<string>();

  for await (const e of listCalendarView(opts.settings, mailbox.address, window, { ...opts, max: opts.maxEvents })) {
    s.events++;
    seen.add(e.iCalUId);
    if (meet.ids.has(e.id) || meet.uids.has(e.iCalUId)) {
      s.skippedMeet++;
      continue;
    }
    const state = states.get(e.iCalUId);
    const found: string[] = [];
    for (const address of eventCounterparts(e, mailbox.address)) {
      const c = await contactFor(address, opts);
      if (c) found.push(c.id);
    }
    const contactIds = [...new Set([...(state?.contactIds ?? []), ...found])];
    if (contactIds.length) {
      const next = await logEvent(e, contactIds, state, mailbox, s, now);
      await saveCalendarState(next, now);
      states.set(e.iCalUId, next);
    }
    if (Date.now() >= opts.deadline) {
      s.complete = false;
      break;
    }
  }

  // Logged events the window no longer returns: read each by its ID.
  if (s.complete) {
    for (const state of states.values()) {
      if (seen.has(state.iCalUId) || state.logged.includes("cancelled") || state.logged.includes("held")) continue;
      if (state.end < window.start) continue;
      if (Date.now() >= opts.deadline) {
        s.complete = false;
        break;
      }
      const found: LogEvent | null = await getCalendarEvent(opts.settings, mailbox.address, state.eventId, opts);
      const e: LogEvent = found ?? {
        // Deleted: logged as canceled, with the time it was planned and no subject.
        iCalUId: state.iCalUId,
        id: state.eventId,
        start: state.start,
        end: state.end,
        timeZone: "UTC",
        isCancelled: true,
        isPrivate: false,
        attendees: [],
        modifiedAt: now.toISOString(),
      };
      const next = await logEvent({ ...e, iCalUId: state.iCalUId }, state.contactIds, state, mailbox, s, now);
      await saveCalendarState(next, now);
      states.set(state.iCalUId, next);
    }
  }

  s.pruned = await pruneCalendarStates(mailbox.id, now, states);
  return s;
}

