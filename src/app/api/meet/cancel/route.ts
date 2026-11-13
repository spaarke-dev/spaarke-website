import type { NextRequest } from "next/server";
import { sendMeetingNotification } from "@/lib/email";
import { getIpHash } from "@/lib/ip-hash";
import { trackEvent, trackException, flushTelemetry } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { cancelMeetingEvent } from "@/lib/meet/graph";
import { getMeetConfig } from "@/lib/meet/config";
import { errorOf, json, lookupManagedBooking } from "@/lib/meet/routes";
import { invalidateAvailability } from "@/lib/meet/service";
import { sendBookingEmails } from "@/lib/meet/notify";
import { guestsOf, releaseSlotLock, updateBooking } from "@/lib/meet/store";

export const dynamic = "force-dynamic";

const NOTE_MAX = 500;

/** Cancels a booked meeting from its manage link. */
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

  const body = (await request.json().catch(() => ({}))) as { token?: string; note?: string };
  const note = typeof body.note === "string" ? body.note.trim().slice(0, NOTE_MAX) : "";

  try {
    const found = await lookupManagedBooking(config, String(body.token ?? ""));
    if (!found.ok) return json({ ok: false, error: "LINK_INVALID", reason: found.reason }, 400);
    const { booking, event } = found.value;

    await cancelMeetingEvent(
      config,
      booking.eventId,
      note ? `Cancelled from the Spaarke booking page. Note: ${note}` : "Cancelled from the Spaarke booking page.",
    );
    invalidateAvailability();
    await releaseSlotLock(config.host, event.start, booking.bookingId);

    let stored = true;
    try {
      await updateBooking(booking.bookingId, { status: "cancelled" });
    } catch (err) {
      stored = false;
      trackException(errorOf(err), { step: "meet.cancel.store" });
    }

    await sendMeetingNotification({
      kind: "cancelled",
      bookingId: booking.bookingId,
      stored,
      start: event.start,
      hostTimeZone: config.rules.hostTimeZone,
      visitorTimeZone: booking.visitorTimeZone,
      name: booking.name,
      email: booking.email,
      organization: booking.organization,
      role: booking.role,
      topic: booking.topic,
      note,
      guests: guestsOf(booking),
    });

    await sendBookingEmails("cancelled", config, booking, { start: event.start, joinUrl: null }, { includeGuests: true });

    trackEvent("meet.cancelled");
    await flushTelemetry();
    return json({ ok: true });
  } catch (err) {
    console.error("[meet] cancel failed:", err);
    trackException(errorOf(err), { step: "meet.cancel" });
    await flushTelemetry();
    return json({ ok: false, error: "UNAVAILABLE" }, 503);
  }
}
