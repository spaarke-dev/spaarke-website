import type { NextRequest } from "next/server";
import type { Attribution } from "@/lib/attribution";
import { sendMeetingNotification } from "@/lib/email";
import { getIpHash } from "@/lib/ip-hash";
import { trackEvent, trackException, flushTelemetry } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { createMeetingEvent } from "@/lib/meet/graph";
import { activeConfig, errorOf, json } from "@/lib/meet/routes";
import {
  getOpenSlots,
  invalidateAvailability,
  invitationBody,
  invitationSubject,
  isSlotStillClear,
  manageUrl,
  normalizeGuests,
  normalizeTimeZone,
  slotEnd,
  validateDetails,
  verifyCaptcha,
  type MeetDetails,
} from "@/lib/meet/service";
import {
  acquireSlotLock,
  attributionFields,
  createBooking,
  isStorageConfigured,
  newBookingId,
  releaseSlotLock,
  updateBooking,
} from "@/lib/meet/store";
import { createManageToken } from "@/lib/meet/tokens";
import { sendBookingEmails } from "@/lib/meet/notify";

export const dynamic = "force-dynamic";

type Body = Partial<Record<keyof MeetDetails | "start" | "captchaToken" | "hp", string>> & {
  attribution?: Attribution | null;
  guests?: unknown;
};

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: NextRequest) {
  const config = activeConfig();
  if (!config) return json({ ok: false, error: "NOT_AVAILABLE" }, 404);

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, error: "VALIDATION_ERROR" }, 400);
  }

  // Honeypot: bots fill it in. Answer as if it worked and do nothing.
  if (str(body.hp)) {
    trackEvent("meet.honeypot");
    return json({ ok: true });
  }

  const ipHash = await getIpHash();
  const rate = checkRateLimit(ipHash, { bucket: "meet-book" });
  if (!rate.allowed) {
    trackEvent("meet.rate_limited");
    return json({ ok: false, error: "RATE_LIMITED" }, 429, { "Retry-After": String(rate.retryAfter) });
  }

  if (!(await verifyCaptcha(str(body.captchaToken, 4000)))) {
    trackEvent("meet.captcha_failed");
    return json({ ok: false, error: "CAPTCHA_FAILED" }, 400);
  }

  const details: MeetDetails = {
    name: str(body.name, 200),
    email: str(body.email, 300),
    organization: str(body.organization, 300),
    role: str(body.role, 200),
    topic: str(body.topic, 2000),
    timeZone: normalizeTimeZone(body.timeZone, config.rules.hostTimeZone),
  };
  const fields: Record<string, string> = validateDetails(details);
  const guestCheck = normalizeGuests(body.guests, details.email, config.host);
  if (!guestCheck.ok) fields.guests = guestCheck.error;
  const guests = guestCheck.ok ? guestCheck.guests : [];
  const start = Date.parse(str(body.start, 40));
  if (Object.keys(fields).length > 0 || !Number.isFinite(start)) {
    trackEvent("meet.validation_failed", { fields: Object.keys(fields).join(",") });
    return json({ ok: false, error: "VALIDATION_ERROR", fields }, 400);
  }

  if (!isStorageConfigured()) {
    console.error("[meet] STORAGE_ACCOUNT_CONNECTION is not set; refusing to book without slot locks.");
    return json({ ok: false, error: "UNAVAILABLE" }, 503);
  }

  const bookingId = newBookingId();
  const end = slotEnd(config, start);
  let locked = false;

  try {
    // Only times the picker could have offered, so a crafted request cannot
    // book outside business hours or inside the minimum notice.
    const open = await getOpenSlots(config);
    if (!open.includes(start)) {
      trackEvent("meet.slot_taken", { stage: "list" });
      return json({ ok: false, error: "SLOT_TAKEN" }, 409);
    }

    locked = await acquireSlotLock(config.host, start, bookingId);
    if (!locked) {
      trackEvent("meet.slot_taken", { stage: "lock" });
      return json({ ok: false, error: "SLOT_TAKEN" }, 409);
    }

    if (!(await isSlotStillClear(config, start))) {
      invalidateAvailability();
      await releaseSlotLock(config.host, start, bookingId);
      locked = false;
      trackEvent("meet.slot_taken", { stage: "recheck" });
      return json({ ok: false, error: "SLOT_TAKEN" }, 409);
    }

    // The record exists before the event so that the manage link in the
    // invitation always has a row to find.
    const now = new Date().toISOString();
    await createBooking({
      bookingId,
      status: "pending",
      eventId: "",
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      visitorTimeZone: details.timeZone,
      name: details.name,
      email: details.email,
      organization: details.organization,
      role: details.role,
      topic: details.topic,
      ipHash,
      createdAt: now,
      updatedAt: now,
      guests: JSON.stringify(guests),
      ...attributionFields(body.attribution),
    });
  } catch (err) {
    if (locked) await releaseSlotLock(config.host, start, bookingId);
    console.error("[meet] booking setup failed:", err);
    trackException(errorOf(err), { step: "meet.book.setup" });
    await flushTelemetry();
    return json({ ok: false, error: "UNAVAILABLE" }, 503);
  }

  const token = createManageToken(bookingId, config.linkSecret);
  const link = manageUrl(token);

  let eventId: string;
  let joinUrl: string | null;
  try {
    const event = await createMeetingEvent(config, {
      subject: invitationSubject(details),
      htmlBody: invitationBody(details, link),
      start,
      end,
      attendees: [{ name: details.name, email: details.email }, ...guests.map((email) => ({ email }))],
      transactionId: bookingId,
    });
    eventId = event.id;
    joinUrl = event.joinUrl;
  } catch (err) {
    await releaseSlotLock(config.host, start, bookingId);
    await updateBooking(bookingId, { status: "failed" }).catch(() => undefined);
    console.error("[meet] event create failed:", err);
    trackException(errorOf(err), { step: "meet.book.event" });
    await flushTelemetry();
    return json({ ok: false, error: "BOOKING_FAILED" }, 502);
  }

  invalidateAvailability();

  let stored = true;
  try {
    await updateBooking(bookingId, { status: "booked", eventId, joinUrl: joinUrl ?? "" });
  } catch (err) {
    // The meeting exists and the invitation is sent. The manage link will not
    // find the event until the row is fixed by hand, which the email says.
    stored = false;
    console.error("[meet] booking row update failed:", err);
    trackException(errorOf(err), { step: "meet.book.store", bookingId });
  }

  const sent = await sendMeetingNotification({
    kind: "booked",
    bookingId,
    stored,
    start,
    hostTimeZone: config.rules.hostTimeZone,
    visitorTimeZone: details.timeZone,
    name: details.name,
    email: details.email,
    organization: details.organization,
    role: details.role,
    topic: details.topic,
    guests,
    attribution: attributionFields(body.attribution),
  });
  if (!sent.sent) trackEvent("meet.email_failed", { kind: "booked" });

  // The branded confirmation goes to the booker even when the address is the
  // host's own, which Exchange sends no invitation to. Guests already have
  // the Outlook invitation, so their first branded email is a reminder.
  await sendBookingEmails(
    "confirmation",
    config,
    { bookingId, name: details.name, email: details.email, visitorTimeZone: details.timeZone },
    { start, joinUrl, guests },
    { includeGuests: false },
  );

  trackEvent("meet.booked", {
    stored: String(stored),
    guests: String(guests.length),
    entry_referrer: body.attribution?.entry_referrer ?? "",
    ai_source: body.attribution?.ai_source ?? "",
  });
  await flushTelemetry();

  return json({
    ok: true,
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    manageUrl: link,
    guests,
  });
}

export function GET() {
  return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
}
