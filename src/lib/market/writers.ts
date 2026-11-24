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
  const input = briefReadActivity(label, now);
  return input ? recordActivitySafe(input) : null;
}

/** The activity for a brief read; shared with the backfill (task 052) so both write the same IDs. */
export function briefReadActivity(label: string, now: number): ActivityInput | null {
  if (!label || label === "unlabeled") return null;
  return {
    type: "brief.read",
    source: "brief",
    sourceId: `${secondOf(now)}:${sha256(`brief:${label}`).slice(0, 16)}`,
    occurredAt: now,
    briefLabel: label,
    summary: "Read the private brief",
  };
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
  const input = askClickActivity(provider, src, briefLabel, now);
  return input ? recordActivitySafe(input) : null;
}

/**
 * The activity for an Ask AI click; shared with the backfill (task 052). The
 * source ID starts with the provider and the second, which the backfill uses
 * with the time to find a click already logged live (App Insights does not keep the label).
 */
export function askClickActivity(
  provider: string,
  src: string,
  briefLabel: string | undefined,
  now: number,
): ActivityInput | null {
  const code = PLACE_SOURCES.has(src.toLowerCase()) ? undefined : src;
  if (!code && !briefLabel) return null;
  return {
    type: "ask_ai.click",
    source: "ask",
    sourceId: `${askClickPrefix(provider, now)}${sha256(`ask:${code ?? ""}:${briefLabel ?? ""}`).slice(0, 16)}`,
    occurredAt: now,
    memberCode: code,
    briefLabel,
    summary: `Opened Ask AI in ${provider}`,
  };
}

/** The start of an Ask AI click's source ID: the same for every click on one provider in one second. */
export function askClickPrefix(provider: string, now: number): string {
  return `${provider}:${secondOf(now)}:`;
}

// ---------------------------------------------------------------------------
// Forms (task 020)
// ---------------------------------------------------------------------------

export type FormKind = "contact" | "demo" | "design_partner" | "early_release" | "investor_overview";

/** The table each form saves to, so the backfill (task 052) builds the same idempotency keys. */
export const FORM_SOURCES: Record<FormKind, string> = {
  contact: "ContactSubmissions",
  demo: "DemoRequests",
  design_partner: "DesignPartnerApplications",
  early_release: "EarlyReleaseSignups",
  investor_overview: "InvestorOverviewRequests",
};

export type FormFacts = {
  /** The row key the form's own table write used. */
  rowKey: string;
  email: string;
  name?: string;
  title?: string;
  organization?: string;
  phone?: string;
  /** A short detail for the summary: the contact reason, use case, source page. */
  detail?: string;
  attribution?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  } | null;
  occurredAt?: number;
};

const FORM_LABEL: Record<FormKind, string> = {
  contact: "Contact form",
  demo: "Demo request",
  design_partner: "Design partner application",
  early_release: "Early release signup",
  investor_overview: "Requested the investor overview",
};

/**
 * Open question 3 (2026-11-20): form contacts start as general, except the
 * investor overview form, whose contacts start as investor-only.
 */
export function formVisibility(kind: FormKind): ActivityInput["visibility"] {
  return kind === "investor_overview" ? "investor" : "general";
}

export function formActivity(kind: FormKind, facts: FormFacts): ActivityInput {
  const a = facts.attribution;
  const detail = facts.detail?.replace(/\s+/g, " ").trim();
  return {
    type: `form.${kind}` as ActivityInput["type"],
    source: FORM_SOURCES[kind],
    sourceId: facts.rowKey,
    occurredAt: facts.occurredAt ?? Date.now(),
    email: facts.email,
    visibility: formVisibility(kind),
    contactHints: {
      name: facts.name?.trim() || undefined,
      title: facts.title?.trim() || undefined,
      organizationName: facts.organization?.trim() || undefined,
      phone: facts.phone?.trim() || undefined,
      kind: kind === "investor_overview" ? "investor" : kind === "design_partner" ? "design_partner" : undefined,
    },
    utm: {
      source: a?.utm_source || undefined,
      medium: a?.utm_medium || undefined,
      campaign: a?.utm_campaign || undefined,
    },
    summary: detail ? `${FORM_LABEL[kind]} (${detail})` : FORM_LABEL[kind],
  };
}

/** Record a form submission after the form's own save. Never throws. */
export async function recordForm(kind: FormKind, facts: FormFacts): Promise<SafeResult | null> {
  try {
    return await recordActivitySafe(formActivity(kind, facts));
  } catch {
    return null;
  }
}
