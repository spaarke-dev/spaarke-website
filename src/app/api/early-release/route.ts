import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TableClient } from "@azure/data-tables";
import { createHash, randomBytes } from "crypto";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackEvent, trackException } from "@/lib/logger";
import {
  sendEarlyReleaseNotification,
  type EarlyReleaseSource,
} from "@/lib/email";
import type { Attribution } from "@/lib/attribution";

/**
 * Build the deterministic, non-PII tour session token bound to an
 * email address + per-deploy salt. The token is set as an HttpOnly
 * cookie when a Take Tour signup succeeds so subsequent feedback
 * submissions can be correlated with the signup row by re-deriving
 * this same hash from the EarlyReleaseSignups email column.
 */
function buildTourSessionToken(normalizedEmail: string): string {
  const salt = process.env.TOUR_SESSION_SALT ?? "";
  return createHash("sha256")
    .update(`${normalizedEmail}:${salt}`)
    .digest("hex")
    .slice(0, 32);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TABLE_NAME = "EarlyReleaseSignups";
const VALID_SOURCES: ReadonlySet<EarlyReleaseSource> = new Set([
  "get-access",
  "take-tour",
]);

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[early-release] RECAPTCHA_SECRET_KEY not set - skipping verification.");
    return true;
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const captchaToken = (body.captchaToken ?? "").trim();
    const sourceRaw = (body.source ?? "get-access").toString();
    const source: EarlyReleaseSource = VALID_SOURCES.has(
      sourceRaw as EarlyReleaseSource,
    )
      ? (sourceRaw as EarlyReleaseSource)
      : "get-access";
    const attribution = (body.attribution ?? null) as Attribution | null;

    // Rate limiting
    const ipHash = await getIpHash();
    const rateResult = checkRateLimit(ipHash);
    if (!rateResult.allowed) {
      trackEvent("early_release.rate_limited", { ipHash });
      return NextResponse.json(
        { ok: false, error: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rateResult.retryAfter) } },
      );
    }

    // Validate inputs
    if (!name || name.length > 100) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", message: "Name is required." },
        { status: 400 },
      );
    }
    if (!email || email.length < 3 || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", message: "Valid email is required." },
        { status: 400 },
      );
    }

    // Verify CAPTCHA — only required when RECAPTCHA_SECRET_KEY is set.
    // In dev / preview environments without the secret, an empty token
    // is acceptable (verifyCaptcha returns true) and we skip the check
    // entirely. With the secret set, empty tokens mean the widget
    // didn't load (ad-blocker, extension, network) and we reject.
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!captchaToken) {
        return NextResponse.json(
          { ok: false, error: "CAPTCHA_FAILED" },
          { status: 400 },
        );
      }
      const captchaValid = await verifyCaptcha(captchaToken);
      if (!captchaValid) {
        trackEvent("early_release.captcha_failed", { ipHash });
        return NextResponse.json(
          { ok: false, error: "CAPTCHA_FAILED" },
          { status: 400 },
        );
      }
    }

    // Save to Azure Table Storage
    const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
    let persisted = false;
    if (connectionString) {
      const client = TableClient.fromConnectionString(connectionString, TABLE_NAME);
      const random = randomBytes(4).toString("hex");
      const rowKey = `${Date.now()}-${random}`;

      await client.createEntity({
        partitionKey: "signup",
        rowKey,
        name,
        email,
        source,
        ipHash,
        signedUpAt: new Date().toISOString(),
        entry_referrer: attribution?.entry_referrer ?? "",
        entry_landing: attribution?.entry_landing ?? "",
        first_visit_at: attribution?.first_visit_at ?? "",
        ai_source: attribution?.ai_source ?? "",
        utm_source: attribution?.utm_source ?? "",
        utm_medium: attribution?.utm_medium ?? "",
        utm_campaign: attribution?.utm_campaign ?? "",
      });
      persisted = true;
    } else {
      console.warn("[early-release] STORAGE_ACCOUNT_CONNECTION not set - signup not persisted.");
    }

    // Send email notification (awaited so serverless doesn't terminate
    // early). The function returns {sent: false} on SendGrid errors
    // without throwing — capture both the thrown and returned-failure
    // cases so silent send failures don't go unnoticed in App Insights.
    try {
      const result = await sendEarlyReleaseNotification({ name, email, source });
      if (result.sent) {
        trackEvent("early_release.email_sent", { source });
      } else {
        console.error(
          "[early-release] Email notification returned not-sent:",
          result.error,
        );
        trackEvent("early_release.email_not_sent", {
          source,
          error: result.error,
        });
      }
    } catch (err) {
      console.error("[early-release] Email notification threw:", err);
      trackException(
        err instanceof Error ? err : new Error(String(err)),
        { step: "email", source },
      );
    }

    trackEvent("early_release.success", {
      email: email.replace(/@.*/, "@***"),
      source,
      entry_referrer: attribution?.entry_referrer ?? "",
      ai_source: attribution?.ai_source ?? "",
    });

    const response = NextResponse.json({ ok: true });

    // Set a tour_session cookie only for the Take Tour flow and only
    // when the row was actually persisted. The value is a deterministic
    // SHA-256 hash of email + per-deploy salt, truncated — not PII, but
    // only re-derivable on the server holding TOUR_SESSION_SALT.
    if (source === "take-tour" && persisted) {
      const normalizedEmail = email.toLowerCase();
      const token = buildTourSessionToken(normalizedEmail);
      response.headers.append(
        "Set-Cookie",
        `tour_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`,
      );
    }

    return response;
  } catch (err) {
    console.error("[early-release] Unexpected error:", err);
    trackException(
      err instanceof Error ? err : new Error(String(err)),
      { step: "early-release" },
    );
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
