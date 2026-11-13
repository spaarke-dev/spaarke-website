import { devMockEnabled } from "@/lib/meet/dev-mock";
import { isValidTimeZone } from "@/lib/meet/tz";

/**
 * Settings for the Graph booking flow on /meet. Every value is an app setting
 * read at request time; none is committed, because the repository is public
 * and the tenant, app, and host mailbox are not things to publish.
 * See docs/meet-graph-booking.md for how each one is set.
 */

export type SlotRules = {
  /** IANA zone the business hours are written in. */
  hostTimeZone: string;
  durationMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  windowDays: number;
  /** Minutes after local midnight. */
  dayStartMinutes: number;
  dayEndMinutes: number;
  /** 0 is Sunday. */
  workDays: number[];
  /** Spacing of candidate start times. */
  slotStepMinutes: number;
};

export type GraphSettings = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  host: string;
  linkSecret: string;
};

export type MeetConfig = GraphSettings & { rules: SlotRules };

function intSetting(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < min || n > max) {
    console.warn(`[meet] ${name} is out of range; using ${fallback}.`);
    return fallback;
  }
  return n;
}

function parseClock(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 24 || min > 59 || (h === 24 && min !== 0)) return null;
  return h * 60 + min;
}

export function getSlotRules(): SlotRules {
  let hostTimeZone = process.env.MEET_HOST_TIME_ZONE?.trim() || "America/New_York";
  if (!isValidTimeZone(hostTimeZone)) {
    console.warn("[meet] MEET_HOST_TIME_ZONE is not a valid zone; using America/New_York.");
    hostTimeZone = "America/New_York";
  }

  let dayStartMinutes = 9 * 60;
  let dayEndMinutes = 17 * 60;
  const hours = process.env.MEET_BUSINESS_HOURS?.trim();
  if (hours) {
    const [a, b] = hours.split("-");
    const start = a ? parseClock(a) : null;
    const end = b ? parseClock(b) : null;
    if (start !== null && end !== null && end > start) {
      dayStartMinutes = start;
      dayEndMinutes = end;
    } else {
      console.warn("[meet] MEET_BUSINESS_HOURS should look like 09:00-17:00; using the default.");
    }
  }

  let workDays = [1, 2, 3, 4, 5];
  const days = process.env.MEET_BUSINESS_DAYS?.trim();
  if (days) {
    const parsed = days
      .split(",")
      .map((d) => Number.parseInt(d.trim(), 10))
      .filter((d) => d >= 0 && d <= 6);
    if (parsed.length > 0) workDays = [...new Set(parsed)];
  }

  return {
    hostTimeZone,
    durationMinutes: intSetting("MEET_DURATION_MINUTES", 30, 15, 240),
    bufferMinutes: intSetting("MEET_BUFFER_MINUTES", 15, 0, 120),
    minNoticeHours: intSetting("MEET_MIN_NOTICE_HOURS", 24, 0, 24 * 14),
    windowDays: intSetting("MEET_WINDOW_DAYS", 21, 1, 60),
    dayStartMinutes,
    dayEndMinutes,
    workDays,
    slotStepMinutes: 30,
  };
}

function getGraphSettings(): GraphSettings | null {
  if (devMockEnabled()) {
    // Placeholders: no Graph call is made in mock mode.
    return {
      tenantId: "mock",
      clientId: "mock",
      clientSecret: "mock",
      host: "host@example.test",
      linkSecret: "dev-mock-link-secret-not-for-production-use",
    };
  }
  const tenantId = process.env.MEET_GRAPH_TENANT_ID?.trim();
  const clientId = process.env.MEET_GRAPH_CLIENT_ID?.trim();
  const clientSecret = process.env.MEET_GRAPH_CLIENT_SECRET?.trim();
  const host = process.env.MEET_HOST?.trim();
  const linkSecret = process.env.MEET_LINK_SECRET?.trim();
  if (!tenantId || !clientId || !clientSecret || !host || !linkSecret) return null;
  if (linkSecret.length < 32) {
    console.warn("[meet] MEET_LINK_SECRET is shorter than 32 characters; Graph booking is off.");
    return null;
  }
  return { tenantId, clientId, clientSecret, host, linkSecret };
}

/** The full Graph configuration, or null when any required setting is missing. */
export function getMeetConfig(): MeetConfig | null {
  const graph = getGraphSettings();
  if (!graph) return null;
  return { ...graph, rules: getSlotRules() };
}

/**
 * Whether /meet should run the Graph flow. The default is the Bookings embed,
 * so merging this code changes nothing until MEET_BOOKING_MODE=graph is set.
 */
export function wantsGraphMode(): boolean {
  return process.env.MEET_BOOKING_MODE?.trim().toLowerCase() === "graph";
}
