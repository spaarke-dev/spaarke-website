"use client";

import { useState, useSyncExternalStore } from "react";
import { zonedDateKey } from "@/lib/meet/tz";

/**
 * Shared pieces of the /meet booking UI: field styles (the underline style
 * from DemoRequestForm, so every form on the site reads as one), time zone
 * detection, and date formatting in the visitor's zone.
 */

export const labelClass =
  "font-mono block text-[11px] font-medium uppercase tracking-[0.18em] text-fg-low";
export const inputBase =
  "block w-full border-0 border-b bg-transparent px-0 py-2.5 text-[15px] text-fg placeholder:text-fg-low/70 transition-colors focus:outline-none";
export const inputBorder = (hasError: boolean) =>
  hasError ? "border-error focus:border-error" : "border-line-strong focus:border-cta-blue";

const noopSubscribe = () => () => {};
const detectZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

/**
 * The visitor's time zone, with a manual override. Empty during server
 * rendering, because the server cannot know it; callers render a placeholder
 * until it is set rather than times in the wrong zone.
 */
export function useVisitorTimeZone(): [string, (tz: string) => void] {
  const detected = useSyncExternalStore(noopSubscribe, detectZone, () => "");
  const [override, setOverride] = useState<string | null>(null);
  return [override ?? detected, setOverride];
}

export function allTimeZones(current: string): string[] {
  let zones: string[] = [];
  try {
    zones = Intl.supportedValuesOf("timeZone");
  } catch {
    zones = [];
  }
  if (current && !zones.includes(current)) zones = [current, ...zones];
  return zones;
}

export function formatTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(
    new Date(iso),
  );
}

export function formatLongDate(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

/** "Tuesday, November 17, 2026, 10:00 AM to 10:30 AM EST" */
export function formatMeeting(startIso: string, durationMinutes: number, timeZone: string): string {
  const end = new Date(Date.parse(startIso) + durationMinutes * 60_000).toISOString();
  const zoneName =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(new Date(startIso))
      .find((p) => p.type === "timeZoneName")?.value ?? timeZone;
  return `${formatLongDate(startIso, timeZone)}, ${formatTime(startIso, timeZone)} to ${formatTime(end, timeZone)} ${zoneName}`;
}

export function dateKeyOf(iso: string, timeZone: string): string {
  return zonedDateKey(Date.parse(iso), timeZone);
}

export function groupByDay(slots: string[], timeZone: string): Map<string, string[]> {
  const days = new Map<string, string[]>();
  for (const s of slots) {
    const key = dateKeyOf(s, timeZone);
    const list = days.get(key);
    if (list) list.push(s);
    else days.set(key, [s]);
  }
  return days;
}

/** Adds days to a YYYY-MM-DD key. */
export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function weekdayOf(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function dayLabel(key: string, opts: Intl.DateTimeFormatOptions): string {
  const [y, m, d] = key.split("-").map(Number);
  // Noon UTC formatted in UTC keeps the calendar date whatever the zone.
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d, 12)),
  );
}

export const MEET_ERRORS: Record<string, string> = {
  SLOT_TAKEN: "Someone just took that time. Please choose another; the list has been refreshed.",
  RATE_LIMITED: "Too many attempts in a short time. Please wait a minute and try again.",
  CAPTCHA_FAILED: "We could not verify the reCAPTCHA. Please try again.",
  LINK_INVALID: "This link is no longer valid. Please use the latest invitation, or book a new time.",
  UNAVAILABLE: "Booking is not available right now. Please try again shortly, or contact us and we will propose times by email.",
  BOOKING_FAILED: "We could not create the meeting. Please try again, or contact us and we will propose times by email.",
  SAME_TIME: "That is the time the meeting already has. Please choose a different one.",
  NETWORK: "Could not reach our server. Check your connection and try again.",
};
