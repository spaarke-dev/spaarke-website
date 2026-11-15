import { NextResponse, type NextRequest } from "next/server";
import type { Attribution } from "@/lib/attribution";
import { siteUrl } from "@/lib/ask-ai";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { flushTelemetry, trackEvent, trackException } from "@/lib/logger";
import { verifyCaptcha } from "@/lib/meet/service";
import {
  createDownloadToken,
  isConfigured,
  isSource,
  newRequestId,
  saveRequest,
  sendTeamNotice,
  sendVisitorEmail,
} from "@/lib/investor-overview";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The investor overview email gate. Records the request, emails the visitor a
 * link, and returns the same link so the browser can start the download.
 * See src/lib/investor-overview.ts.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      source?: string;
      hp?: string;
      captchaToken?: string;
      attribution?: Attribution | null;
    };

    // Honeypot: accept quietly, give nothing.
    if ((body.hp ?? "").trim()) {
      trackEvent("investor_overview.honeypot");
      return NextResponse.json({ ok: true });
    }

    if (!isConfigured()) {
      return NextResponse.json({ ok: false, error: "UNAVAILABLE" }, { status: 503 });
    }

    const email = (body.email ?? "").trim().slice(0, 254);
    const source = isSource(body.source) ? body.source : "tltf-2026";
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
    }

    const ipHash = await getIpHash();
    const rate = checkRateLimit(ipHash, { bucket: "investor-overview", max: 5 });
    if (!rate.allowed) {
      return NextResponse.json(
        { ok: false, error: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
      );
    }

    if (!(await verifyCaptcha((body.captchaToken ?? "").trim()))) {
      trackEvent("investor_overview.captcha_failed");
      return NextResponse.json({ ok: false, error: "CAPTCHA_FAILED" }, { status: 400 });
    }

    const requestId = newRequestId();
    const token = createDownloadToken(requestId);
    if (!token) return NextResponse.json({ ok: false, error: "UNAVAILABLE" }, { status: 503 });

    const base = siteUrl();
    const url = `${base}/api/investor-overview/file?t=${encodeURIComponent(token)}`;
    const attribution = body.attribution ?? null;

    const saved = await saveRequest({ requestId, source, email, ipHash, attribution });
    const [emailed] = await Promise.all([
      sendVisitorEmail(email, url, `${base}/${source}#meet`),
      sendTeamNotice({ email, source, requestId, saved, attribution }),
    ]);

    trackEvent("investor_overview.requested", {
      source,
      saved: String(saved),
      emailed: String(emailed),
      utm_campaign: attribution?.utm_campaign ?? "",
    });
    await flushTelemetry();

    return NextResponse.json({ ok: true, url, emailed });
  } catch (err) {
    console.error("[investor-overview] request failed:", err);
    trackException(err instanceof Error ? err : new Error(String(err)), { step: "investor_overview.request" });
    await flushTelemetry();
    return NextResponse.json({ ok: false, error: "UNAVAILABLE" }, { status: 500 });
  }
}
