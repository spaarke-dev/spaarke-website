import type { ActivityType } from "@/lib/market/types";

/**
 * Labels and dates for the admin pages. Times show in the host's zone, the
 * same setting /meet uses.
 */

function zone(): string {
  const tz = process.env.MEET_HOST_TIME_ZONE?.trim() || "America/New_York";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "America/New_York";
  }
}

function yearIn(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric" }).format(d);
}

function format(iso: string | undefined, withTime: boolean, now: Date): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tz = zone();
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    year: yearIn(d, tz) === yearIn(now, tz) ? undefined : "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(d);
}

/** "Nov 20, 3:15 PM", with the year when it is not this year. */
export function formatWhen(iso: string | undefined, now = new Date()): string {
  return format(iso, true, now);
}

/** "Nov 20", with the year when it is not this year. */
export function formatDay(iso: string | undefined, now = new Date()): string {
  return format(iso, false, now);
}

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  "form.contact": "Contact form",
  "form.demo": "Demo request",
  "form.design_partner": "Design partner application",
  "form.early_release": "Early release signup",
  "form.investor_overview": "Investor overview request",
  "meeting.booked": "Meeting booked",
  "meeting.rescheduled": "Meeting rescheduled",
  "meeting.cancelled": "Meeting canceled",
  "meeting.in_person": "In-person meeting",
  "calendar.booked": "Meeting in calendar",
  "calendar.moved": "Meeting moved",
  "calendar.cancelled": "Meeting canceled",
  "calendar.held": "Meeting held",
  "brief.read": "Brief read",
  "ask_ai.click": "Ask AI click",
  "email.sent": "Email sent",
  "email.received": "Email received",
  "email.bounced": "Email bounced",
  "linkedin.lead": "LinkedIn lead",
  "linkedin.message": "LinkedIn message",
  call: "Phone call",
  note: "Note",
  "followup.done": "Follow-up done",
  "list.import": "Added from a list",
  "contact.added": "Added by hand",
};

export function activityLabel(type: string): string {
  return ACTIVITY_LABELS[type as ActivityType] ?? type;
}

/** "design_partner" becomes "Design partner". */
export function label(value: string | undefined): string {
  if (!value) return "";
  const s = value.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
