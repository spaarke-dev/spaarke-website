import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { trackEvent } from "@/lib/logger";

/**
 * Lightweight relay endpoint for client-side tour analytics events.
 *
 * Why a server hop instead of the App Insights browser SDK? Two reasons:
 * 1. Avoids shipping the App Insights connection string to the browser
 *    (Microsoft says the key isn't secret, but keeping it server-only
 *    matches the existing observability pattern in src/lib/logger.ts).
 * 2. No new client-side dependency on `@microsoft/applicationinsights-web`.
 *
 * Trade-off: one extra HTTP POST per event. For a ~100-step tour visit
 * that's ~100 small POSTs over ~15 minutes — negligible. The client uses
 * `keepalive: true` (and falls back to navigator.sendBeacon for
 * unload-time events) so events don't get dropped on page navigation.
 *
 * Event-name allowlist: we only relay events whose name starts with
 * `tour.` so this endpoint can't be abused to inject arbitrary noise
 * into App Insights.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "BAD_BODY" },
        { status: 400 },
      );
    }

    const name = typeof body.name === "string" ? body.name : "";
    if (!name || !name.startsWith("tour.") || name.length > 64) {
      return NextResponse.json(
        { ok: false, error: "INVALID_NAME" },
        { status: 400 },
      );
    }

    const rawProps = (body.properties ?? {}) as Record<string, unknown>;
    const properties: Record<string, string> = {};
    let propCount = 0;
    for (const [key, value] of Object.entries(rawProps)) {
      if (propCount >= 20) break;
      if (typeof key !== "string" || key.length > 64) continue;
      // Coerce to string. Skip nullish.
      if (value === null || value === undefined) continue;
      const str =
        typeof value === "string" ? value : String(value);
      if (str.length > 1000) continue;
      properties[key] = str;
      propCount++;
    }

    trackEvent(name, properties);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
