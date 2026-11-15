import type { NextRequest } from "next/server";
import { getIpHash } from "@/lib/ip-hash";
import { flushTelemetry, trackEvent, trackException } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { getMeetConfig } from "@/lib/meet/config";
import { setMeetingAttendees } from "@/lib/meet/graph";
import { errorOf, json, lookupManagedBooking } from "@/lib/meet/routes";
import { normalizeGuests } from "@/lib/meet/service";
import { guestsOf, updateBooking } from "@/lib/meet/store";

export const dynamic = "force-dynamic";

/** Guest list changes allowed per booking, so a link cannot become a mailer. */
const MAX_CHANGES = 10;

/**
 * Replaces the guest list of a booked meeting from its manage link. Exchange
 * sends the invitation to added guests and a cancellation to removed ones.
 */
export async function POST(request: NextRequest) {
  // Not gated on MEET_BOOKING_MODE, like reschedule and cancel.
  const config = getMeetConfig();
  if (!config) return json({ ok: false, error: "NOT_AVAILABLE" }, 404);

  const ipHash = await getIpHash();
  const rate = checkRateLimit(ipHash, { bucket: "meet-guests", max: 5 });
  if (!rate.allowed) {
    return json({ ok: false, error: "RATE_LIMITED" }, 429, { "Retry-After": String(rate.retryAfter) });
  }

  const body = (await request.json().catch(() => ({}))) as { token?: string; guests?: unknown };

  try {
    const found = await lookupManagedBooking(config, String(body.token ?? ""));
    if (!found.ok) return json({ ok: false, error: "LINK_INVALID", reason: found.reason }, 400);
    const { booking } = found.value;

    const check = normalizeGuests(body.guests, booking.email, config.host);
    if (!check.ok) return json({ ok: false, error: "VALIDATION_ERROR", fields: { guests: check.error } }, 400);

    const current = guestsOf(booking);
    const same =
      current.length === check.guests.length &&
      current.every((g, i) => g.toLowerCase() === check.guests[i].toLowerCase());
    if (same) return json({ ok: true, guests: current });

    const changes = Number(booking.guestChanges ?? 0);
    if (changes >= MAX_CHANGES) return json({ ok: false, error: "GUEST_LIMIT" }, 429);

    await setMeetingAttendees(config, booking.eventId, [
      { name: booking.name, email: booking.email },
      ...check.guests.map((email) => ({ email })),
    ]);

    try {
      await updateBooking(booking.bookingId, { guests: JSON.stringify(check.guests), guestChanges: changes + 1 });
    } catch (err) {
      // The calendar has the new list; the row catches up on the next change.
      trackException(errorOf(err), { step: "meet.guests.store" });
    }

    trackEvent("meet.guests_updated", { count: String(check.guests.length) });
    await flushTelemetry();
    return json({ ok: true, guests: check.guests });
  } catch (err) {
    console.error("[meet] guest update failed:", err);
    trackException(errorOf(err), { step: "meet.guests" });
    await flushTelemetry();
    return json({ ok: false, error: "UNAVAILABLE" }, 503);
  }
}
