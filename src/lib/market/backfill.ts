import { TableClient } from "@azure/data-tables";
import { hasActivity, listContactActivities, recordActivity, type ActivityInput } from "@/lib/market/activity";
import { audit } from "@/lib/market/audit";
import { findMemberByBriefLabel, findMemberByCode } from "@/lib/market/campaigns";
import { findContactByEmail, isTombstoned } from "@/lib/market/contacts";
import { normalizeEmail } from "@/lib/market/keys";
import { recomputeAllCampaigns } from "@/lib/market/results";
import {
  askClickActivity,
  briefReadActivity,
  FORM_SOURCES,
  formActivity,
  meetingActivities,
  type FormKind,
  type MeetingFacts,
} from "@/lib/market/writers";

/**
 * The one-time backfill (FR-13, task 052): the site's own tables and the App
 * Insights engagement events become contacts and activities, with their
 * original times and UTM fields.
 *
 * Every row goes through the same builder as its live writer (tasks 020 to
 * 022), so the backfill and the live writes share source IDs and never double
 * each other. Two cases need more than the ID:
 *  - Ask AI clicks: App Insights keeps the code (`src`) but not the brief
 *    label the live writer hashed in, so a click is skipped when the member
 *    already has a click on the same provider within two seconds.
 *  - Moves: a booking keeps only its last move, and the live writer dated the
 *    move to the millisecond, so a move is skipped when the booker already has
 *    one for that booking.
 * Rows from spaarke.com addresses are the team's own tests and are skipped.
 */

export const FORM_KINDS = Object.keys(FORM_SOURCES) as FormKind[];
/** Rows from this domain are the team testing its own forms. */
const OWN_DOMAIN = "spaarke.com";
/** App Insights and the live writer stamp a click a few milliseconds apart; allow for a second boundary between them. */
const LIVE_SKEW_MS = 2_000;
export const BOOKINGS_TABLE = "MeetingBookings";

export type Row = Record<string, unknown>;

const text = (row: Row, key: string): string => (typeof row[key] === "string" ? (row[key] as string).trim() : "");

function timeOf(row: Row, ...keys: string[]): number | null {
  for (const k of keys) {
    const ms = Date.parse(text(row, k));
    if (Number.isFinite(ms)) return ms;
  }
  // Row keys start with the save time in milliseconds.
  const lead = /^(\d{12,14})-/.exec(text(row, "rowKey"));
  return lead ? Number(lead[1]) : null;
}

function attribution(row: Row) {
  return { utm_source: text(row, "utm_source"), utm_medium: text(row, "utm_medium"), utm_campaign: text(row, "utm_campaign") };
}

const joinName = (...parts: string[]) => parts.filter(Boolean).join(" ") || undefined;

/** A form row as its live writer would have recorded it, or null when it has no usable time. */
export function formRowActivity(kind: FormKind, row: Row): ActivityInput | null {
  const occurredAt = timeOf(row, "createdAt", "signedUpAt");
  const rowKey = text(row, "rowKey");
  if (occurredAt === null || !rowKey) return null;
  const base = { rowKey, email: text(row, "email"), attribution: attribution(row), occurredAt };
  switch (kind) {
    case "contact":
      return formActivity(kind, { ...base, name: text(row, "name"), organization: text(row, "company"), detail: text(row, "reason") });
    case "demo":
      return formActivity(kind, {
        ...base,
        name: joinName(text(row, "firstName"), text(row, "lastName")),
        title: text(row, "jobTitle"),
        organization: text(row, "organization"),
        phone: text(row, "phone"),
        detail: text(row, "useCase"),
      });
    case "design_partner":
      return formActivity(kind, {
        ...base,
        name: joinName(text(row, "firstName"), text(row, "lastName")),
        title: text(row, "role"),
        organization: text(row, "organization"),
        detail: text(row, "organizationType"),
      });
    case "early_release":
      return formActivity(kind, { ...base, name: text(row, "name"), detail: text(row, "source") });
    case "investor_overview":
      // The live route passes the page the form was on, which is the row's partition.
      return formActivity(kind, { ...base, detail: text(row, "partitionKey") });
  }
}

export type BookingActivities = { activities: ActivityInput[]; moves: ActivityInput[]; bookingId: string };

/** A booking row's meeting activities: booked, the last move and a cancellation. Pending and failed rows are no meeting. */
export function bookingRowActivities(row: Row, hostTimeZone: string): BookingActivities | null {
  const status = text(row, "status");
  if (!["booked", "rescheduled", "cancelled"].includes(status)) return null;
  const bookingId = text(row, "rowKey") || text(row, "bookingId");
  const start = Date.parse(text(row, "start"));
  const created = timeOf(row, "createdAt");
  if (!bookingId || !Number.isFinite(start) || created === null) return null;
  let guests: string[] = [];
  try {
    const parsed: unknown = JSON.parse(text(row, "guests") || "[]");
    if (Array.isArray(parsed)) guests = parsed.filter((g): g is string => typeof g === "string");
  } catch {
    guests = [];
  }
  const facts: MeetingFacts = {
    bookingId,
    name: text(row, "name"),
    email: text(row, "email"),
    organization: text(row, "organization") || undefined,
    role: text(row, "role") || undefined,
    guests,
    start,
    hostTimeZone,
    ...attribution(row),
  };
  const activities = meetingActivities("booked", facts, { occurredAt: created });
  const moved = Date.parse(text(row, "movedAt"));
  const moves = Number.isFinite(moved) ? meetingActivities("rescheduled", facts, { occurredAt: moved }) : [];
  if (status === "cancelled") {
    activities.push(...meetingActivities("cancelled", facts, { occurredAt: timeOf(row, "updatedAt") ?? created }));
  }
  return { activities, moves, bookingId };
}

// ---------------------------------------------------------------------------
// App Insights events.

export type EngagementEvent = { at: number; name: "brief.read" | "ask_ai.click"; label?: string; provider?: string; src?: string };

/**
 * Events from the private export (task 004) or a live query, in either
 * shape: objects with `timestamp`, `name` and `customDimensions` (an object
 * or a JSON string), or `az` table rows. Repeats are dropped.
 */
export function parseEvents(rows: readonly unknown[]): EngagementEvent[] {
  const seen = new Set<string>();
  const out: EngagementEvent[] = [];
  for (const raw of rows) {
    const r = (raw ?? {}) as Record<string, unknown>;
    const name = r.name;
    if (name !== "brief.read" && name !== "ask_ai.click") continue;
    const at = Date.parse(String(r.timestamp ?? ""));
    if (!Number.isFinite(at)) continue;
    let dims: Record<string, unknown> = {};
    try {
      dims = (typeof r.customDimensions === "string" ? JSON.parse(r.customDimensions) : r.customDimensions ?? {}) as Record<string, unknown>;
    } catch {
      dims = {};
    }
    const str = (k: string) => (typeof dims[k] === "string" ? (dims[k] as string) : undefined);
    const e: EngagementEvent = { at, name, label: str("label"), provider: str("provider"), src: str("src") };
    const key = `${at}|${name}|${e.label ?? ""}|${e.provider ?? ""}|${e.src ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out.sort((a, b) => a.at - b.at);
}

/** An event as the live writer would have recorded it, or null when it names no recipient. */
export function eventActivity(e: EngagementEvent): ActivityInput | null {
  if (e.name === "brief.read") return e.label ? briefReadActivity(e.label, e.at) : null;
  return e.provider ? askClickActivity(e.provider, e.src ?? "direct", undefined, e.at) : null;
}

// ---------------------------------------------------------------------------
// Reading the site tables.

/** Every row of a site table; an empty list when the table does not exist. */
export async function readTable(connection: string, table: string): Promise<Row[]> {
  const client = TableClient.fromConnectionString(connection, table, { allowInsecureConnection: connection.includes("UseDevelopmentStorage") || connection.includes("127.0.0.1") });
  const rows: Row[] = [];
  try {
    for await (const e of client.listEntities<Row>()) rows.push(e);
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 404) return [];
    throw err;
  }
  return rows;
}

// ---------------------------------------------------------------------------
// The run.

export type SourceCount = { rows: number; activities: number; added: number; already: number; skipped: Record<string, number> };

export type BackfillInput = {
  forms: Partial<Record<FormKind, Row[]>>;
  bookings: Row[];
  events: EngagementEvent[];
  hostTimeZone: string;
};

function counter(rows: number): SourceCount {
  return { rows, activities: 0, added: 0, already: 0, skipped: {} };
}

function skip(c: SourceCount, reason: string) {
  c.skipped[reason] = (c.skipped[reason] ?? 0) + 1;
}

/**
 * Run the backfill, or with `write: false` count what it would do without
 * writing anything. Returns counts per source, keyed by the source table or
 * event name.
 */
export async function runBackfill(
  input: BackfillInput,
  opts: { write: boolean; who?: string; now?: Date },
): Promise<Record<string, SourceCount>> {
  const out: Record<string, SourceCount> = {};
  const timelines = new Map<string, Awaited<ReturnType<typeof listContactActivities>>>();
  const timeline = async (contactId: string) => {
    if (!timelines.has(contactId)) timelines.set(contactId, await listContactActivities(contactId, 1000));
    return timelines.get(contactId)!;
  };

  /** Write one activity (or check it, in a dry run) and count the outcome. */
  async function put(c: SourceCount, a: ActivityInput) {
    c.activities += 1;
    if (await hasActivity(a.source, a.sourceId)) {
      c.already += 1;
      return;
    }
    if (a.email) {
      const email = normalizeEmail(a.email);
      if (!email) return skip(c, "not an email address");
      // Our own tests of the forms and booking page: the team is never a contact.
      if (email.endsWith(`@${OWN_DOMAIN}`)) return skip(c, "a Spaarke address");
      if (await isTombstoned(email)) return skip(c, "deleted contact");
    }
    if (!opts.write) {
      c.added += 1;
      return;
    }
    const r = await recordActivity(a);
    if (r.status === "recorded") c.added += 1;
    else if (r.status === "duplicate") c.already += 1;
    else skip(c, r.reason === "no_contact" ? "no member for the code or label" : r.reason);
  }

  for (const kind of FORM_KINDS) {
    const rows = input.forms[kind] ?? [];
    const c = (out[FORM_SOURCES[kind]] = counter(rows.length));
    for (const row of rows) {
      const a = formRowActivity(kind, row);
      if (!a) skip(c, "no time or row key");
      else await put(c, a);
    }
  }

  const meetings = (out[BOOKINGS_TABLE] = counter(input.bookings.length));
  for (const row of input.bookings) {
    const b = bookingRowActivities(row, input.hostTimeZone);
    if (!b) {
      skip(meetings, "not a held booking");
      continue;
    }
    for (const a of b.activities) await put(meetings, a);
    if (!b.moves.length) continue;
    // The live writer logged a move after 2026-11-20 with its own millisecond; one is enough.
    const booker = await findContactByEmail(b.moves[0].email ?? "");
    const moved = booker && (await timeline(booker.id)).some((x) => x.type === "meeting.rescheduled" && x.sourceId.startsWith(`${b.bookingId}:rescheduled:`));
    if (moved) meetings.already += b.moves.length;
    else for (const a of b.moves) await put(meetings, a);
    meetings.activities += moved ? b.moves.length : 0;
  }

  const reads = (out["brief.read"] = counter(0));
  const clicks = (out["ask_ai.click"] = counter(0));
  for (const e of input.events) {
    const c = e.name === "brief.read" ? reads : clicks;
    c.rows += 1;
    const a = eventActivity(e);
    if (!a) {
      skip(c, e.name === "brief.read" ? "no brief label" : "a site click, not a recipient");
      continue;
    }
    // The member, as the live writer finds it: the code first, then the label. A shared label names no one.
    let member = a.memberCode ? await findMemberByCode(a.memberCode) : null;
    if (!member && a.briefLabel) member = await findMemberByBriefLabel(a.briefLabel);
    if (!member?.contactId) {
      c.activities += 1;
      skip(c, "no member for the code or label");
      continue;
    }
    if (a.type === "ask_ai.click") {
      const provider = `${e.provider}:`;
      const live = (await timeline(member.contactId)).some(
        (x) => x.type === "ask_ai.click" && x.sourceId.startsWith(provider) && Math.abs(Date.parse(x.occurredAt) - e.at) <= LIVE_SKEW_MS,
      );
      if (live) {
        c.activities += 1;
        c.already += 1;
        continue;
      }
    }
    await put(c, a);
  }

  if (opts.write) {
    await recomputeAllCampaigns(opts.now);
    // Counts only: the audit never holds the people themselves.
    const after: Record<string, number> = {};
    for (const [source, c] of Object.entries(out)) {
      after[`${source}.rows`] = c.rows;
      after[`${source}.added`] = c.added;
      after[`${source}.already`] = c.already;
    }
    await audit({ who: opts.who ?? "backfill", action: "import.backfill", entity: "log", entityId: "backfill", after }, opts.now);
  }
  return out;
}
