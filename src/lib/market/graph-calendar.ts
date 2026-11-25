import { normalizeEmail } from "@/lib/market/keys";
import { graphGet, MailGraphError, NoMailboxAccess, type MailDeps, type MailSettings } from "@/lib/market/graph-mail";

/**
 * Calendar metadata from Microsoft Graph for the sync (phase 2 FR-06, task 030).
 *
 * Task 001 settled the read (projects/market-access-phase-2/notes/calendar-spike.md):
 * a `calendarView` of the whole window on every run, with `$select`, so no
 * event body, notes or attachments are requested. The delta read is not used:
 * it returns the body whatever `$select` says. Occurrences of recurring
 * meetings come back expanded, each with its own `iCalUId`.
 *
 * Access comes from the same app and Exchange RBAC as the mail sync, with the
 * `Application Calendars.Read` role (docs/market-access-mailboxes.md, section 7).
 * A 403 surfaces as NoCalendarAccess.
 */

export const CALENDAR_BACK_DAYS = 30;
export const CALENDAR_AHEAD_DAYS = 90;
const PAGE_SIZE = 50;
const DAY_MS = 86_400_000;

export const CALENDAR_SELECT =
  "iCalUId,subject,start,end,isCancelled,sensitivity,isOnlineMeeting,webLink,attendees,organizer,createdDateTime,lastModifiedDateTime,type,seriesMasterId";

/** The mailbox's calendar is not in the Exchange access scope (yet). */
export class NoCalendarAccess extends NoMailboxAccess {
  constructor(mailbox: string) {
    super(mailbox);
    this.message = "This mailbox's calendar is not in the Exchange access scope yet.";
    this.name = "NoCalendarAccess";
  }
}

export type CalendarEvent = {
  /** The same in every calendar that holds the meeting, and different for each occurrence. */
  iCalUId: string;
  /** The event's ID in this mailbox. */
  id: string;
  /** UTC ISO times. */
  start: string;
  end: string;
  /** The time zone Graph gave the times in (UTC, as the request asks). */
  timeZone: string;
  isCancelled: boolean;
  /** Sensitivity is private or confidential: the entry keeps no subject. */
  isPrivate: boolean;
  isOnline: boolean;
  webLink?: string;
  subject?: string;
  organizer?: string;
  attendees: string[];
  createdAt?: string;
  modifiedAt?: string;
  /** singleInstance, occurrence, exception or seriesMaster. */
  type?: string;
  seriesMasterId?: string;
};

type GraphTime = { dateTime?: string; timeZone?: string };
type GraphAttendee = { emailAddress?: { address?: string } };
export type GraphEvent = {
  id?: string;
  iCalUId?: string;
  subject?: string;
  start?: GraphTime;
  end?: GraphTime;
  isCancelled?: boolean;
  sensitivity?: string;
  isOnlineMeeting?: boolean;
  webLink?: string;
  attendees?: GraphAttendee[];
  organizer?: GraphAttendee;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  type?: string;
  seriesMasterId?: string;
};

function utc(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const ms = Date.parse(value.endsWith("Z") || /[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : undefined;
}

/** A Graph event as the fields the sync keeps, addresses normalized. Pure, so the checks can run it. */
export function toCalendarEvent(e: GraphEvent): CalendarEvent | null {
  const start = utc(e.start?.dateTime);
  const end = utc(e.end?.dateTime) ?? start;
  if (!e.id || !e.iCalUId || !start || !end) return null;
  const attendees = [
    ...new Set((e.attendees ?? []).map((a) => normalizeEmail(a.emailAddress?.address)).filter((a): a is string => Boolean(a))),
  ];
  const sensitivity = (e.sensitivity ?? "").toLowerCase();
  const isPrivate = sensitivity === "private" || sensitivity === "confidential";
  return {
    iCalUId: e.iCalUId,
    id: e.id,
    start,
    end,
    timeZone: e.start?.timeZone || "UTC",
    isCancelled: e.isCancelled === true,
    isPrivate,
    isOnline: e.isOnlineMeeting === true,
    webLink: e.webLink || undefined,
    subject: isPrivate ? undefined : e.subject?.trim() || undefined,
    organizer: normalizeEmail(e.organizer?.emailAddress?.address) ?? undefined,
    attendees,
    createdAt: utc(e.createdDateTime),
    modifiedAt: utc(e.lastModifiedDateTime),
    type: e.type || undefined,
    seriesMasterId: e.seriesMasterId || undefined,
  };
}

export type CalendarWindow = { start: string; end: string };

/** 30 days back to 90 ahead of `now`, from the start of the day. Pure. */
export function calendarWindow(now: Date): CalendarWindow {
  const day = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return {
    start: new Date(day - CALENDAR_BACK_DAYS * DAY_MS).toISOString(),
    end: new Date(day + (CALENDAR_AHEAD_DAYS + 1) * DAY_MS).toISOString(),
  };
}

function mailboxOf(mailbox: string): string {
  const box = normalizeEmail(mailbox);
  if (!box) throw new MailGraphError("Not a mailbox address", 400);
  return box;
}

function calendarError(err: unknown, box: string): unknown {
  return err instanceof NoMailboxAccess ? new NoCalendarAccess(box) : err;
}

/**
 * Every event in the window, following Graph's paging. Stops after `max`
 * events (default 1,000), so one run stays bounded.
 */
export async function* listCalendarView(
  s: MailSettings,
  mailbox: string,
  window: CalendarWindow,
  opts: { max?: number } & MailDeps = {},
): AsyncGenerator<CalendarEvent> {
  const box = mailboxOf(mailbox);
  const max = opts.max ?? 1000;
  const query = [
    `startDateTime=${encodeURIComponent(window.start)}`,
    `endDateTime=${encodeURIComponent(window.end)}`,
    `$select=${CALENDAR_SELECT}`,
    `$top=${PAGE_SIZE}`,
  ].join("&");
  let url: string | undefined = `/users/${encodeURIComponent(box)}/calendarView?${query}`;
  let seen = 0;
  while (url) {
    let page: { value?: GraphEvent[]; "@odata.nextLink"?: string };
    try {
      page = await graphGet(s, box, url, {}, opts);
    } catch (err) {
      throw calendarError(err, box);
    }
    for (const e of page.value ?? []) {
      const event = toCalendarEvent(e);
      if (!event) continue;
      yield event;
      if (++seen >= max) return;
    }
    const next = page["@odata.nextLink"];
    // Follow only Graph's own links.
    url = next && next.startsWith("https://graph.microsoft.com/v1.0/") ? next : undefined;
  }
}

/**
 * One event by its ID, for an event gone from the window: null when Graph
 * answers 404 (deleted). Same `$select` as the window read.
 */
export async function getCalendarEvent(
  s: MailSettings,
  mailbox: string,
  eventId: string,
  deps: MailDeps = {},
): Promise<CalendarEvent | null> {
  const box = mailboxOf(mailbox);
  try {
    const e = await graphGet<GraphEvent>(
      s,
      box,
      `/users/${encodeURIComponent(box)}/events/${encodeURIComponent(eventId)}?$select=${CALENDAR_SELECT}`,
      {},
      deps,
    );
    return toCalendarEvent({ ...e, id: e.id ?? eventId });
  } catch (err) {
    if (err instanceof MailGraphError && err.status === 404 && (!err.code || /ItemNotFound|NotFound/i.test(err.code)) && !/InvalidUser|MailboxNotEnabled|UserNotFound/i.test(err.code ?? "")) {
      return null;
    }
    throw calendarError(err, box);
  }
}
