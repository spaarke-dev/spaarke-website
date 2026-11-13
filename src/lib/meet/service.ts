import type { MeetConfig } from "@/lib/meet/config";
import { getBusyIntervals } from "@/lib/meet/graph";
import { generateSlots, isClear, scheduleRange, withoutInterval, type Interval } from "@/lib/meet/slots";
import { isValidTimeZone } from "@/lib/meet/tz";

/**
 * Availability with a short cache, the live re-check before a booking, input
 * validation, and the text of the invitation. Shared by the /meet page, the
 * manage page, and the API routes.
 */

const CACHE_MS = 60_000;
const MINUTE = 60_000;
// The cached busy list is fetched an hour past the window, so a cached copy
// up to a minute old still covers every slot the window can offer.
const RANGE_PADDING_MS = 60 * MINUTE;

let cache: { at: number; host: string; busy: Interval[] } | null = null;

async function loadBusy(config: MeetConfig, now: number): Promise<Interval[]> {
  if (cache && cache.host === config.host && now - cache.at < CACHE_MS) return cache.busy;
  const range = scheduleRange(now, config.rules);
  const busy = await getBusyIntervals(config, { start: range.start, end: range.end + RANGE_PADDING_MS });
  cache = { at: now, host: config.host, busy };
  return busy;
}

/** Drops the cached busy list, after a booking changes the calendar. */
export function invalidateAvailability(): void {
  cache = null;
}

/**
 * Open slot starts in UTC milliseconds. `exclude` is the meeting being moved,
 * which should not block the times beside it.
 */
export async function getOpenSlots(
  config: MeetConfig,
  options: { now?: number; exclude?: Interval } = {},
): Promise<number[]> {
  const now = options.now ?? Date.now();
  let busy = await loadBusy(config, now);
  if (options.exclude) busy = withoutInterval(busy, options.exclude);
  return generateSlots(now, busy, config.rules);
}

/**
 * Asks Graph again, uncached, whether the slot is still clear. This is what
 * catches a meeting added in Outlook after the visitor loaded the picker.
 */
export async function isSlotStillClear(
  config: MeetConfig,
  start: number,
  exclude?: Interval,
): Promise<boolean> {
  const { bufferMinutes, durationMinutes } = config.rules;
  let busy = await getBusyIntervals(config, {
    start: start - bufferMinutes * MINUTE,
    end: start + (durationMinutes + bufferMinutes) * MINUTE,
  });
  if (exclude) busy = withoutInterval(busy, exclude);
  return isClear(start, busy, config.rules);
}

export function slotEnd(config: MeetConfig, start: number): number {
  return start + config.rules.durationMinutes * MINUTE;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type MeetDetails = {
  name: string;
  email: string;
  organization: string;
  role: string;
  topic: string;
  timeZone: string;
};

export type MeetFieldErrors = Partial<Record<"name" | "email" | "organization" | "role" | "topic", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TOPIC_MAX = 1000;

export function validateDetails(d: MeetDetails): MeetFieldErrors {
  const errors: MeetFieldErrors = {};
  if (!d.name || d.name.length > 100) errors.name = "Name is required (up to 100 characters).";
  if (!d.email || d.email.length > 254 || !EMAIL_RE.test(d.email)) {
    errors.email = "A valid work email address is required.";
  }
  if (!d.organization || d.organization.length > 200) {
    errors.organization = "Organization is required (up to 200 characters).";
  }
  if (d.role.length > 100) errors.role = "Role can be up to 100 characters.";
  if (d.topic.length > TOPIC_MAX) errors.topic = `Please keep this to ${TOPIC_MAX} characters.`;
  // Single-line fields end up in the event subject and the email subject.
  for (const field of ["name", "email", "organization", "role"] as const) {
    if (/[\r\n\t]/.test(d[field]) && !errors[field]) errors[field] = "Please use a single line.";
  }
  return errors;
}

export function normalizeTimeZone(tz: unknown, fallback: string): string {
  return typeof tz === "string" && isValidTimeZone(tz) ? tz : fallback;
}

// ---------------------------------------------------------------------------
// reCAPTCHA
// ---------------------------------------------------------------------------

/**
 * Verifies the token. When the secret is set, a token is required: unlike the
 * contact form, a booking writes to a calendar, so an empty token is a refusal
 * rather than a pass. Without the secret (local development) it passes.
 */
export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[meet] RECAPTCHA_SECRET_KEY not set; skipping verification.");
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      signal: AbortSignal.timeout(8_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[meet] captcha verification failed to complete:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Invitation text
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.spaarke.com").replace(/\/$/, "");
}

export function manageUrl(token: string): string {
  return `${siteUrl()}/meet/manage?t=${encodeURIComponent(token)}`;
}

export function invitationSubject(d: MeetDetails): string {
  return `Spaarke meeting with ${d.name} (${d.organization})`.slice(0, 255);
}

/** The event body both the visitor and the host see. */
export function invitationBody(d: MeetDetails, manageLink: string): string {
  const rows = [
    ["Booked by", d.name],
    ["Email", d.email],
    ["Organization", d.organization],
    ["Role", d.role],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${escapeHtml(k)}: ${escapeHtml(v)}`)
    .join("<br>");

  const topic = d.topic
    ? `<p><strong>What to cover</strong><br>${escapeHtml(d.topic).replace(/\r?\n/g, "<br>")}</p>`
    : "";

  return [
    "<p>Thank you for booking time with the Spaarke team. The Microsoft Teams link is below.</p>",
    `<p>${rows}</p>`,
    topic,
    `<p>Need a different time? <a href="${escapeHtml(manageLink)}">Reschedule or cancel this meeting</a>.</p>`,
  ].join("");
}
