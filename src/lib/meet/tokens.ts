import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed links to reschedule or cancel a booking. A token is the booking ID
 * and an expiry, signed with MEET_LINK_SECRET. It carries nothing personal;
 * whoever holds the link can manage that one meeting, which is the same trust
 * a calendar invitation's own links carry.
 */

const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const BOOKING_ID = /^[0-9]{13}-[0-9a-f]{8}$/;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createManageToken(bookingId: string, secret: string, now = Date.now()): string {
  const payload = `${bookingId}.${(now + TTL_MS).toString(36)}`;
  return `${payload}.${sign(payload, secret)}`;
}

export type TokenCheck =
  | { ok: true; bookingId: string }
  | { ok: false; reason: "invalid" | "expired" };

export function verifyManageToken(token: string, secret: string, now = Date.now()): TokenCheck {
  if (!token || token.length > 200) return { ok: false, reason: "invalid" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid" };
  const [bookingId, exp, sig] = parts;
  if (!BOOKING_ID.test(bookingId)) return { ok: false, reason: "invalid" };

  const expected = Buffer.from(sign(`${bookingId}.${exp}`, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "invalid" };
  }

  const expiresAt = Number.parseInt(exp, 36);
  if (!Number.isFinite(expiresAt) || now > expiresAt) return { ok: false, reason: "expired" };
  return { ok: true, bookingId };
}
