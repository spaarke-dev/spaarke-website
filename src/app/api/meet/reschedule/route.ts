import type { NextRequest } from "next/server";
import { sendMeetingNotification } from "@/lib/email";
import { getIpHash } from "@/lib/ip-hash";
import { trackEvent, trackException, flushTelemetry } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { moveMeetingEvent } from "@/lib/meet/graph";
import { getMeetConfig } from "@/lib/meet/config";
import { errorOf, json, lookupManagedBooking } from "@/lib/meet/routes";
import { getOpenSlots, invalidateAvailability, isSlotStillClear, slotEnd } from "@/lib/meet/service";
import { sendBookingEmails } from "@/lib/meet/notify";
import { acquireSlotLock, guestsOf, releaseSlotLock, updateBooking } from "@/lib/meet/store";

// A meeting moved twice comes back to a slot it held before; that row was
// deleted when it moved away, so the insert succeeds.

export const dynamic = "force-dynamic";

/**
 * Moves a booked meeting. The token is the authority: no captcha, since the
 * link only reaches the person the invitation went to.
 */
export async function POST(request: NextRequest) {
  // Not gated on MEET_BOOKING_MODE: links already sent keep working if /meet
  // is switched back to the Bookings embed.
  const config = getMeetConfig();
  if (!config) return json({ ok: false, error: "NOT_AVAILABLE" }, 404);

  const ipHash = await getIpHash();
  const rate = checkRateLimit(ipHash, { bucket: "meet-manage" });
  if (!rate.allowed) {
    return json({ ok: false, error: "RATE_LIMITED" }, 429, { "Retry-After": String(rate.retryAfter) });
  }

  const body = (await request.json().catch(() => ({}))) as { token?: string; start?: string };
  const start = Date.parse(String(body.start ?? ""));
  if (!Number.isFinite(start)) return json({ ok: false, error: "VALIDATION_ERROR" }, 400);

  // The booking that holds a lock on the new slot, while the move is in flight.
  let lockedFor: string | null = null;
  try {
    const found = await lookupManagedBooking(config, String(body.token ?? ""));
    if (!found.ok) return json({ ok: false, error: "LINK_INVALID", reason: found.reason }, 400);
    const { booking, event } = found.value;
    const own = { start: event.start, end: event.end };

    if (start === event.start) return json({ ok: false, error: "SAME_TIME" }, 400);

    const open = await getOpenSlots(config, { exclude: own });
    if (!open.includes(start)) return json({ ok: false, error: "SLOT_TAKEN" }, 409);

    if (!(await acquireSlotLock(config.host, start, booking.bookingId))) {
      return json({ ok: false, error: "SLOT_TAKEN" }, 409);
    }
    lockedFor = booking.bookingId;

    if (!(await isSlotStillClear(config, start, own))) {
      invalidateAvailability();
      return json({ ok: false, error: "SLOT_TAKEN" }, 409); // finally releases the lock
    }

    const end = slotEnd(config, start);
    await moveMeetingEvent(config, booking.eventId, start, end);
    lockedFor = null; // The new lock now belongs to the meeting.
    invalidateAvailability();
    await releaseSlotLock(config.host, event.start, booking.bookingId);

    let stored = true;
    try {
      await updateBooking(booking.bookingId, {
        status: "rescheduled",
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        movedAt: new Date().toISOString(),
      });
    } catch (err) {
      stored = false;
      trackException(errorOf(err), { step: "meet.reschedule.store" });
    }

    await sendMeetingNotification({
      kind: "rescheduled",
      bookingId: booking.bookingId,
      stored,
      start,
      previousStart: event.start,
      hostTimeZone: config.rules.hostTimeZone,
      visitorTimeZone: booking.visitorTimeZone,
      name: booking.name,
      email: booking.email,
      organization: booking.organization,
      role: booking.role,
      topic: booking.topic,
      guests: guestsOf(booking),
    });

    await sendBookingEmails(
      "moved",
      config,
      booking,
      { start, previousStart: event.start, joinUrl: event.joinUrl ?? booking.joinUrl ?? null },
      { includeGuests: true },
    );

    trackEvent("meet.rescheduled");
    await flushTelemetry();
    return json({ ok: true, start: new Date(start).toISOString(), end: new Date(end).toISOString() });
  } catch (err) {
    console.error("[meet] reschedule failed:", err);
    trackException(errorOf(err), { step: "meet.reschedule" });
    await flushTelemetry();
    return json({ ok: false, error: "UNAVAILABLE" }, 503);
  } finally {
    // A lock is still held here only when the move did not happen.
    if (lockedFor) await releaseSlotLock(config.host, start, lockedFor);
  }
}
