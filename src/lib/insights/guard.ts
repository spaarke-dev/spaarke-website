import {
  checkDurableLimits,
  isSessionVerified,
  markSessionVerified,
  LIMITS,
} from "./rate-limit-durable";
import { ceilingState } from "./ceiling";
import type { InsightsErrorCode } from "./stream";

/**
 * The four defences, in the order they are applied.
 *
 * Order is a cost decision. The ceiling is one table read and decides for
 * everybody, so it goes first. The captcha is next, because rejecting a script
 * before it consumes anyone's quota is better than after. The per-IP and
 * per-session counters come last, since they are writes.
 *
 * Nothing here calls the model, and every refusal costs a fraction of a cent.
 */

export type GuardDefence =
  | "ceiling"
  | "captcha_required"
  | "captcha_failed"
  | "ip_hour"
  | "ip_day"
  | "session"
  | "counters_error";

export type GuardResult =
  | { ok: true }
  | {
      ok: false;
      defence: GuardDefence;
      code: InsightsErrorCode;
      status: number;
      detail?: string;
      headers?: Record<string, string>;
    };

/**
 * Verifies a reCAPTCHA token, reusing the site's existing keys.
 *
 * Unlike the contact route, a missing secret here is a refusal rather than a
 * pass. The contact form's permissiveness costs one unverified email; this one
 * would leave the model endpoint open to anything that can post JSON.
 */
async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("[insights] RECAPTCHA_SECRET_KEY is not set, so the first-question check cannot pass.");
    return false;
  }
  if (!token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      // Google is fast or Google is broken. Either way this cannot be the thing
      // that hangs the request, which is how the contact form failed.
      signal: AbortSignal.timeout(8_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[insights] captcha verification failed to complete:", err);
    return false;
  }
}

export async function guardRequest(input: {
  ipHash: string;
  sessionId: string;
  isFirstTurn: boolean;
  captchaToken: string;
}): Promise<GuardResult> {
  try {
    const ceiling = await ceilingState();
    if (ceiling.reached) {
      return {
        ok: false,
        defence: "ceiling",
        code: "DAILY_CEILING",
        status: 503,
        detail: `spent ${ceiling.spentUsd.toFixed(2)} of ${ceiling.ceilingUsd.toFixed(2)} over ${ceiling.turns} turns`,
        headers: { "Retry-After": "3600" },
      };
    }

    // The captcha gates the first question of a session. Later turns are not
    // re-gated, which would make a conversation painful, so the verified session
    // is recorded. Without that record a client could fabricate a history and
    // skip the check on every request.
    if (input.isFirstTurn) {
      if (!(await verifyCaptcha(input.captchaToken))) {
        return {
          ok: false,
          defence: input.captchaToken ? "captcha_failed" : "captcha_required",
          code: input.captchaToken ? "CAPTCHA_FAILED" : "CAPTCHA_REQUIRED",
          status: 400,
        };
      }
      await markSessionVerified(input.sessionId);
    } else if (!(await isSessionVerified(input.sessionId))) {
      return { ok: false, defence: "captcha_required", code: "CAPTCHA_REQUIRED", status: 400 };
    }

    const limits = await checkDurableLimits(input.ipHash, input.sessionId);
    if (!limits.allowed) {
      const defence: GuardDefence =
        limits.scope === "ip-hour" ? "ip_hour" : limits.scope === "ip-day" ? "ip_day" : "session";
      return {
        ok: false,
        defence,
        code: "RATE_LIMITED",
        status: 429,
        detail: `${limits.scope} limit ${limits.limit}`,
        headers: limits.retryAfterSeconds > 0
          ? { "Retry-After": String(limits.retryAfterSeconds) }
          : undefined,
      };
    }

    return { ok: true };
  } catch (err) {
    // Fail closed. If the counters cannot be trusted, the spend cannot be
    // bounded, and unmetered spend is worse than a few minutes of downtime.
    console.error("[insights] defences could not run, refusing the request:", err);
    return {
      ok: false,
      defence: "counters_error",
      code: "INTERNAL_ERROR",
      status: 503,
      detail: err instanceof Error ? err.message.slice(0, 120) : "unknown",
    };
  }
}

export { LIMITS };
