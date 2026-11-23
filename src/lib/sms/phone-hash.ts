import { createHmac } from "node:crypto";

/**
 * Phone numbers are reduced to a keyed hash on arrival (spec FR-13). The
 * readable number lives only in memory for one request and is never written to
 * a table, a log, an App Insights property, or an email.
 *
 * Keyed, not plain SHA-256: there are few enough US numbers to reverse an
 * unkeyed hash by trying them all. SMS_PHONE_HASH_SECRET is never rotated,
 * because a new secret would split every sender's history.
 */

const E164_US = /^\+1[0-9]{10}$/;

/**
 * Twilio's `From` as a US or Canadian E.164 number, or null. Strict on
 * purpose: one number must always produce the same string, so the same hash.
 */
export function normalizeE164(from: string | null | undefined): string | null {
  const value = from?.trim() ?? "";
  return E164_US.test(value) ? value : null;
}

/** HMAC-SHA256 of the E.164 number, hex, first 32 characters (128 bits). */
export function phoneHash(e164: string, secret: string): string {
  return createHmac("sha256", secret).update(e164).digest("hex").slice(0, 32);
}
