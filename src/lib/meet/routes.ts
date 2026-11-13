import { NextResponse } from "next/server";
import { getMeetConfig, wantsGraphMode, type MeetConfig } from "@/lib/meet/config";
import { getMeetingEvent, type EventState } from "@/lib/meet/graph";
import { getBooking, type BookingRecord } from "@/lib/meet/store";
import { verifyManageToken } from "@/lib/meet/tokens";

/** Helpers shared by the /api/meet routes. */

export function json(body: unknown, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers });
}

/** The config when the Graph flow is switched on, otherwise null. */
export function activeConfig(): MeetConfig | null {
  if (!wantsGraphMode()) return null;
  return getMeetConfig();
}

export function errorOf(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

export type ManagedBooking = {
  booking: BookingRecord;
  event: EventState;
};

export type ManageLookup =
  | { ok: true; value: ManagedBooking }
  | { ok: false; reason: "invalid" | "expired" | "cancelled" | "past" | "unavailable" };

/**
 * Resolves a manage token to the booking and the event as it stands on the
 * calendar now, which may differ from the record if the host moved or deleted
 * it in Outlook.
 */
export async function lookupManagedBooking(
  config: MeetConfig,
  token: string,
  now = Date.now(),
): Promise<ManageLookup> {
  const check = verifyManageToken(token, config.linkSecret, now);
  if (!check.ok) return { ok: false, reason: check.reason };

  const booking = await getBooking(check.bookingId);
  if (!booking || !booking.eventId) return { ok: false, reason: "unavailable" };
  if (booking.status === "cancelled") return { ok: false, reason: "cancelled" };

  const event = await getMeetingEvent(config, booking.eventId);
  if (!event || event.isCancelled) return { ok: false, reason: "cancelled" };
  if (event.start <= now) return { ok: false, reason: "past" };
  return { ok: true, value: { booking, event } };
}
