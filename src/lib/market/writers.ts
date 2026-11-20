import { recordActivitySafe, type ActivityInput, type SafeResult } from "@/lib/market/activity";
import { emailHash, normalizeEmail, sha256 } from "@/lib/market/keys";

/**
 * Site writers (FR-06): how each public route's events become activities.
 * The routes call these after their own work has succeeded. Every call goes
 * through recordActivitySafe, so the log can never fail or noticeably slow a
 * visitor's request.
 */

// ---------------------------------------------------------------------------
// Meetings (task 021)
// ---------------------------------------------------------------------------

export type MeetingEvent = "booked" | "rescheduled" | "cancelled";

export type MeetingFacts = {
  bookingId: string;
  name: string;
  email: string;
  organization?: string;
  role?: string;
  /** Guest addresses on the meeting. */
  guests: string[];
  /** The meeting start after this event, in ms. */
  start: number;
  hostTimeZone: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

const TYPE: Record<MeetingEvent, ActivityInput["type"]> = {
  booked: "meeting.booked",
  rescheduled: "meeting.rescheduled",
  cancelled: "meeting.cancelled",
};

/** "Tue, Nov 25, 10:00 AM EST" in the host's zone. */
export function meetingTime(start: number, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(start));
  } catch {
    return new Date(start).toISOString();
  }
}

function meetingSummary(event: MeetingEvent, when: string, asGuest: boolean): string {
  const role = asGuest ? " (as a guest)" : "";
  if (event === "booked") return `Meeting booked for ${when}${role}`;
  if (event === "rescheduled") return `Meeting moved to ${when}${role}`;
  return `Meeting for ${when} canceled${role}`;
}

/**
 * One activity for the booker and one for each guest. The source ID is the
 * booking, the event and, for a move, when it happened, so a second move is a
 * new activity while a retried request is not. Guests' IDs add a slice of
 * their address hash, so each guest's activity is its own.
 */
export function meetingActivities(
  event: MeetingEvent,
  facts: MeetingFacts,
  opts: { occurredAt?: number; onlyGuests?: string[] } = {},
): ActivityInput[] {
  const occurredAt = opts.occurredAt ?? Date.now();
  const when = meetingTime(facts.start, facts.hostTimeZone);
  const base = event === "rescheduled" ? `${facts.bookingId}:rescheduled:${occurredAt}` : `${facts.bookingId}:${event}`;
  const utm = { source: facts.utm_source || undefined, medium: facts.utm_medium || undefined, campaign: facts.utm_campaign || undefined };

  const out: ActivityInput[] = [];
  if (!opts.onlyGuests) {
    out.push({
      type: TYPE[event],
      source: "MeetingBookings",
      sourceId: base,
      occurredAt,
      email: facts.email,
      contactHints: {
        name: facts.name || undefined,
        title: facts.role || undefined,
        organizationName: facts.organization || undefined,
      },
      utm,
      summary: meetingSummary(event, when, false),
    });
  }
  const booker = normalizeEmail(facts.email);
  for (const guest of opts.onlyGuests ?? facts.guests) {
    const g = normalizeEmail(guest);
    if (!g || g === booker) continue;
    out.push({
      type: TYPE[event],
      source: "MeetingBookings",
      sourceId: `${base}:${emailHash(g).slice(0, 12)}`,
      occurredAt,
      email: g,
      summary: meetingSummary(event, when, true),
    });
  }
  return out;
}

/** Record a meeting event for everyone on it. Never throws. */
export async function recordMeeting(
  event: MeetingEvent,
  facts: MeetingFacts,
  opts?: { occurredAt?: number; onlyGuests?: string[] },
): Promise<SafeResult[]> {
  try {
    return await Promise.all(meetingActivities(event, facts, opts).map((a) => recordActivitySafe(a)));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Brief reads and Ask AI clicks (task 022)
// ---------------------------------------------------------------------------

/** To the second, so a retry within the same second is one read. */
function secondOf(ms: number): string {
  return new Date(Math.floor(ms / 1000) * 1000).toISOString();
}

/**
 * A /brief/<key> read. It resolves through the brief label to a campaign
 * member; with no member, nothing is written. Neither the key nor the label
 * is put in the source ID in the clear.
 */
export async function recordBriefRead(label: string, now = Date.now()): Promise<SafeResult | null> {
  if (!label || label === "unlabeled") return null;
  return recordActivitySafe({
    type: "brief.read",
    source: "brief",
    sourceId: `${secondOf(now)}:${sha256(`brief:${label}`).slice(0, 16)}`,
    occurredAt: now,
    briefLabel: label,
    summary: "Read the private brief",
  });
}

/** Values of `src` that name a place on the site rather than a recipient. */
const PLACE_SOURCES = new Set(["", "direct", "article", "email", "home", "ask", "footer", "header", "nav", "tltf"]);

/**
 * An /ask/<provider> click. The recipient code in `src` resolves first, then
 * the brief label behind `k`. With neither, nothing is written, and site
 * clicks such as `src=article` skip the lookup altogether.
 */
export async function recordAskClick(
  provider: string,
  src: string,
  briefLabel: string | undefined,
  now = Date.now(),
): Promise<SafeResult | null> {
  const code = PLACE_SOURCES.has(src.toLowerCase()) ? undefined : src;
  if (!code && !briefLabel) return null;
  return recordActivitySafe({
    type: "ask_ai.click",
    source: "ask",
    sourceId: `${provider}:${secondOf(now)}:${sha256(`ask:${code ?? ""}:${briefLabel ?? ""}`).slice(0, 16)}`,
    occurredAt: now,
    memberCode: code,
    briefLabel,
    summary: `Opened Ask AI in ${provider}`,
  });
}
