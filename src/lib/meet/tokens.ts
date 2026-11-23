import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

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

/**
 * The link in the MEET reply (spec FR-15): `/meet?c=<token>`. A token is a
 * conversation ID and an expiry, signed with SMS_LINK_SECRET; it carries no
 * phone number or anything else personal. The signature covers `sms.` plus the
 * payload, so an SMS token never verifies as a manage token, or the reverse.
 * 12 + 1 + 6 + 1 + 22 = 42 characters, which keeps the reply at two segments.
 */

const SMS_TTL_SECONDS = 30 * 24 * 60 * 60;
const CONVERSATION_ID = /^[A-Za-z0-9_-]{12}$/;
/** Expiry in seconds, base36: six characters until 2038. */
const SMS_EXP = /^[0-9a-z]{6}$/;
const SMS_SIG_BYTES = 16;
export const SMS_TOKEN_LENGTH = 42;

/** 9 random bytes, base64url: 12 characters. */
export function newConversationId(): string {
  return randomBytes(9).toString("base64url");
}

function signSms(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`sms.${payload}`).digest().subarray(0, SMS_SIG_BYTES).toString("base64url");
}

export function createSmsToken(conversationId: string, secret: string, now = Date.now()): string {
  if (!CONVERSATION_ID.test(conversationId)) throw new Error("Invalid conversation ID.");
  const exp = (Math.floor(now / 1000) + SMS_TTL_SECONDS).toString(36);
  const payload = `${conversationId}.${exp}`;
  return `${payload}.${signSms(payload, secret)}`;
}

export type SmsTokenCheck =
  | { ok: true; conversationId: string }
  | { ok: false; reason: "invalid" | "expired" };

export function verifySmsToken(token: string, secret: string, now = Date.now()): SmsTokenCheck {
  if (!token || token.length !== SMS_TOKEN_LENGTH) return { ok: false, reason: "invalid" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid" };
  const [conversationId, exp, sig] = parts;
  if (!CONVERSATION_ID.test(conversationId) || !SMS_EXP.test(exp)) return { ok: false, reason: "invalid" };

  const expected = Buffer.from(signSms(`${conversationId}.${exp}`, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "invalid" };
  }

  const expiresAt = Number.parseInt(exp, 36) * 1000;
  if (!Number.isFinite(expiresAt) || now > expiresAt) return { ok: false, reason: "expired" };
  return { ok: true, conversationId };
}
