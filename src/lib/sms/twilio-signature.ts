import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Twilio's request signature (X-Twilio-Signature), checked without the twilio
 * package. Twilio signs the full webhook URL followed by every POST parameter,
 * sorted by name, each as name then value, with HMAC-SHA1 keyed by the account
 * auth token, base64 encoded.
 * https://www.twilio.com/docs/usage/webhooks/webhooks-security
 *
 * The URL must be the one configured in Twilio (SMS_WEBHOOK_URL), never
 * request.url: behind Static Web Apps the route sees an internal host.
 */

export type FormParams = ReadonlyArray<readonly [string, string]>;

/** Code-unit order, which is what Twilio's libraries sort by; not locale order. */
function byCodeUnit(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The string Twilio signs: the URL, then each parameter name and value in name order. */
export function signaturePayload(url: string, params: FormParams): string {
  const sorted = [...params].sort((x, y) => byCodeUnit(x[0], y[0]) || byCodeUnit(x[1], y[1]));
  let payload = url;
  for (const [name, value] of sorted) payload += name + value;
  return payload;
}

export function computeSignature(authToken: string, url: string, params: FormParams): string {
  return createHmac("sha1", authToken).update(signaturePayload(url, params), "utf8").digest("base64");
}

/**
 * Whether the header matches a signature made with any of the tokens (the
 * current token, and the previous one during a rotation). Constant time per
 * comparison.
 */
export function isValidSignature(
  header: string | null | undefined,
  url: string,
  params: FormParams,
  authTokens: readonly string[],
): boolean {
  if (!header || header.length > 100) return false;
  const given = Buffer.from(header);
  let ok = false;
  for (const token of authTokens) {
    if (!token) continue;
    const expected = Buffer.from(computeSignature(token, url, params));
    if (expected.length === given.length && timingSafeEqual(expected, given)) ok = true;
  }
  return ok;
}

/** Form parameters from a raw application/x-www-form-urlencoded body, repeats kept. */
export function parseFormBody(body: string): FormParams {
  return [...new URLSearchParams(body).entries()];
}
