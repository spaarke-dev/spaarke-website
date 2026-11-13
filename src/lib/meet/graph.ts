import { ClientSecretCredential } from "@azure/identity";
import type { GraphSettings } from "@/lib/meet/config";
import type { Interval } from "@/lib/meet/slots";
import { devMockEnabled, mockBusy, mockCancel, mockCreate, mockGet, mockMove } from "@/lib/meet/dev-mock";

/**
 * The few Microsoft Graph calls the booking flow makes, over fetch. The app
 * registration is app-only and is scoped to the host mailbox by Exchange RBAC
 * for Applications (docs/meet-graph-booking.md), so a call against any other
 * mailbox fails with 403 by design.
 */

const GRAPH = "https://graph.microsoft.com/v1.0";
const SCOPE = "https://graph.microsoft.com/.default";

export class GraphError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "GraphError";
  }
}

let credential: ClientSecretCredential | null = null;
let credentialKey = "";

function getCredential(s: GraphSettings): ClientSecretCredential {
  const key = `${s.tenantId}:${s.clientId}:${s.clientSecret.length}`;
  if (!credential || credentialKey !== key) {
    // The credential caches tokens until shortly before they expire.
    credential = new ClientSecretCredential(s.tenantId, s.clientId, s.clientSecret);
    credentialKey = key;
  }
  return credential;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function graphFetch<T>(
  s: GraphSettings,
  path: string,
  init: { method: string; body?: unknown },
): Promise<T> {
  const token = await getCredential(s).getToken(SCOPE);
  if (!token) throw new GraphError("No Graph token", 401);

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${GRAPH}${path}`, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
        // Every dateTime in and out is UTC, so no Windows zone names to map.
        Prefer: 'outlook.timezone="UTC"',
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });

    // One retry for throttling or a brief outage, within a short ceiling so a
    // visitor is never left waiting on Graph's patience.
    if ((res.status === 429 || res.status === 503) && attempt === 0) {
      const after = Number(res.headers.get("Retry-After") ?? "1");
      await sleep(Math.min(Number.isFinite(after) ? after : 1, 5) * 1000);
      continue;
    }

    if (res.status === 202 || res.status === 204) return undefined as T;

    const text = await res.text();
    let json: unknown = undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      // Non-JSON body; reported below if the status is an error.
    }

    if (!res.ok) {
      const err = (json as { error?: { code?: string; message?: string } } | undefined)?.error;
      throw new GraphError(
        `Graph ${init.method} ${path.split("?")[0]} failed: ${res.status} ${err?.code ?? ""} ${err?.message ?? ""}`.trim(),
        res.status,
        err?.code,
      );
    }
    return json as T;
  }
  throw new GraphError("Graph throttled the request twice", 429);
}

function utcDateTime(ms: number) {
  // Graph wants a dateTime without an offset plus a separate zone name.
  return { dateTime: new Date(ms).toISOString().replace("Z", ""), timeZone: "UTC" };
}

function parseUtc(value: { dateTime: string; timeZone?: string }): number {
  // With the UTC preference set, Graph returns seven fractional digits and no
  // offset, for example 2026-11-17T15:00:00.0000000.
  const trimmed = value.dateTime.replace(/(\.\d{3})\d*$/, "$1");
  return Date.parse(trimmed.endsWith("Z") ? trimmed : `${trimmed}Z`);
}

const BUSY_STATUSES = new Set(["busy", "tentative", "oof"]);

type ScheduleResponse = {
  value: {
    scheduleId: string;
    error?: { message?: string; responseCode?: string };
    scheduleItems?: {
      status: string;
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
    }[];
  }[];
};

/** Busy, tentative, and out-of-office time on the host's calendar. */
export async function getBusyIntervals(s: GraphSettings, range: Interval): Promise<Interval[]> {
  if (devMockEnabled()) return mockBusy(range);
  const data = await graphFetch<ScheduleResponse>(
    s,
    `/users/${encodeURIComponent(s.host)}/calendar/getSchedule`,
    {
      method: "POST",
      body: {
        schedules: [s.host],
        startTime: utcDateTime(range.start),
        endTime: utcDateTime(range.end),
        availabilityViewInterval: 15,
      },
    },
  );

  const schedule = data.value?.[0];
  if (!schedule) throw new GraphError("getSchedule returned no schedule", 502);
  if (schedule.error) {
    throw new GraphError(
      `getSchedule error: ${schedule.error.responseCode ?? ""} ${schedule.error.message ?? ""}`.trim(),
      502,
      schedule.error.responseCode,
    );
  }

  return (schedule.scheduleItems ?? [])
    .filter((item) => BUSY_STATUSES.has(item.status.toLowerCase()))
    .map((item) => ({ start: parseUtc(item.start), end: parseUtc(item.end) }));
}

export type CreatedEvent = { id: string; joinUrl: string | null };

export async function createMeetingEvent(
  s: GraphSettings,
  input: {
    subject: string;
    htmlBody: string;
    start: number;
    end: number;
    attendee: { name: string; email: string };
    transactionId: string;
  },
): Promise<CreatedEvent> {
  if (devMockEnabled()) return mockCreate(input.start, input.end);
  const event = await graphFetch<{ id: string; onlineMeeting?: { joinUrl?: string } | null }>(
    s,
    `/users/${encodeURIComponent(s.host)}/events`,
    {
      method: "POST",
      body: {
        subject: input.subject,
        body: { contentType: "HTML", content: input.htmlBody },
        start: utcDateTime(input.start),
        end: utcDateTime(input.end),
        attendees: [
          {
            emailAddress: { address: input.attendee.email, name: input.attendee.name },
            type: "required",
          },
        ],
        isOnlineMeeting: true,
        onlineMeetingProvider: "teamsForBusiness",
        // New times go through the manage link, which keeps the slot locks
        // and the booking record in step with the calendar.
        allowNewTimeProposals: false,
        responseRequested: true,
        showAs: "busy",
        transactionId: input.transactionId,
      },
    },
  );
  return { id: event.id, joinUrl: event.onlineMeeting?.joinUrl ?? null };
}

export type EventState = { start: number; end: number; isCancelled: boolean };

/** The event's current time, or null when it no longer exists. */
export async function getMeetingEvent(s: GraphSettings, eventId: string): Promise<EventState | null> {
  if (devMockEnabled()) return mockGet(eventId);
  try {
    const e = await graphFetch<{
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
      isCancelled?: boolean;
    }>(
      s,
      `/users/${encodeURIComponent(s.host)}/events/${encodeURIComponent(eventId)}?$select=start,end,isCancelled`,
      { method: "GET" },
    );
    return { start: parseUtc(e.start), end: parseUtc(e.end), isCancelled: e.isCancelled === true };
  } catch (err) {
    if (err instanceof GraphError && err.status === 404) return null;
    throw err;
  }
}

/** Moves the event. The Teams link stays the same and attendees get an update. */
export async function moveMeetingEvent(
  s: GraphSettings,
  eventId: string,
  start: number,
  end: number,
): Promise<void> {
  if (devMockEnabled()) return mockMove(eventId, start, end);
  await graphFetch<unknown>(s, `/users/${encodeURIComponent(s.host)}/events/${encodeURIComponent(eventId)}`, {
    method: "PATCH",
    body: { start: utcDateTime(start), end: utcDateTime(end) },
  });
}

/** Cancels the event and sends the cancellation to attendees. */
export async function cancelMeetingEvent(s: GraphSettings, eventId: string, comment: string): Promise<void> {
  if (devMockEnabled()) return mockCancel(eventId);
  try {
    await graphFetch<unknown>(
      s,
      `/users/${encodeURIComponent(s.host)}/events/${encodeURIComponent(eventId)}/cancel`,
      { method: "POST", body: { comment } },
    );
  } catch (err) {
    // Already deleted from the host's calendar: the outcome the visitor wants.
    if (err instanceof GraphError && err.status === 404) return;
    throw err;
  }
}
