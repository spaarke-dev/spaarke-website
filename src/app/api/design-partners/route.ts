import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  normalizeApplication,
  validateApplication,
  type DesignPartnerApplication,
} from "@/lib/design-partners";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveDesignPartnerApplication } from "@/lib/storage";
import { sendDesignPartnerNotification } from "@/lib/email";
import { trackEvent, trackException, flushTelemetry } from "@/lib/logger";
import type { Attribution } from "@/lib/attribution";

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[design-partners] RECAPTCHA_SECRET_KEY not set - skipping verification.");
    return true;
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      // A hung verification must not hang the request, which is how the
      // contact form failed on 2026-09-25.
      signal: AbortSignal.timeout(8_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[design-partners] captcha verification failed to complete:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<
      Record<keyof DesignPartnerApplication, unknown>
    > & {
      captchaToken?: string;
      attribution?: Attribution | null;
    };
    const data = normalizeApplication(body);
    const captchaToken = (body.captchaToken ?? "").trim();
    const attribution = body.attribution ?? null;

    // Rate limiting
    const ipHash = await getIpHash();
    const rateResult = checkRateLimit(ipHash);
    if (!rateResult.allowed) {
      trackEvent("design_partner.rate_limited", { ipHash });
      await flushTelemetry();
      return NextResponse.json(
        { ok: false, error: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rateResult.retryAfter) } },
      );
    }

    // Validation, with the same rules the form applies
    const fields = validateApplication(data);
    if (fields) {
      trackEvent("design_partner.validation_failed", {
        fields: Object.keys(fields).join(","),
      });
      await flushTelemetry();
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", fields },
        { status: 400 },
      );
    }

    // CAPTCHA, required whenever the secret is set (see early-release).
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!captchaToken || !(await verifyCaptcha(captchaToken))) {
        trackEvent("design_partner.captcha_failed", { ipHash });
        await flushTelemetry();
        return NextResponse.json(
          { ok: false, error: "CAPTCHA_FAILED" },
          { status: 400 },
        );
      }
    }

    // The table is the durable record and the email is what reaches a person.
    // Neither failure discards the other; only losing both is an error.
    const rowKey = await saveDesignPartnerApplication(data, ipHash, attribution);

    let emailed = false;
    try {
      const result = await sendDesignPartnerNotification({ ...data, rowKey });
      emailed = result.sent;
      if (!result.sent) {
        trackEvent("design_partner.email_not_sent", { error: result.error });
      }
    } catch (err) {
      console.error("[design-partners] Email notification threw:", err);
      trackException(err instanceof Error ? err : new Error(String(err)), {
        step: "email",
      });
    }

    if (!rowKey && !emailed) {
      trackEvent("design_partner.lost", { organizationType: data.organizationType });
      await flushTelemetry();
      return NextResponse.json(
        { ok: false, error: "INTERNAL_ERROR" },
        { status: 500 },
      );
    }

    trackEvent("design_partner.success", {
      stored: String(Boolean(rowKey)),
      emailed: String(emailed),
      organizationType: data.organizationType,
      entry_referrer: attribution?.entry_referrer ?? "",
      ai_source: attribution?.ai_source ?? "",
      utm_source: attribution?.utm_source ?? "",
    });
    await flushTelemetry();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[design-partners] Unexpected error:", err);
    trackException(err instanceof Error ? err : new Error(String(err)), {
      step: "handler",
    });
    await flushTelemetry();
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
