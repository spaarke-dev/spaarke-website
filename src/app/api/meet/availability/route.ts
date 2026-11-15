import type { NextRequest } from "next/server";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackException, flushTelemetry } from "@/lib/logger";
import { getOpenSlots } from "@/lib/meet/service";
import { getMeetConfig } from "@/lib/meet/config";
import { activeConfig, errorOf, json, lookupManagedBooking } from "@/lib/meet/routes";

export const dynamic = "force-dynamic";

/**
 * Open slots for the /meet picker, as UTC ISO strings. With `t` (a manage
 * token), the visitor's own meeting does not block the times beside it.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  // A manage link keeps working when /meet is switched back to the embed.
  const config = token ? getMeetConfig() : activeConfig();
  if (!config) return json({ ok: false, error: "NOT_AVAILABLE" }, 404);

  const ipHash = await getIpHash();
  const rate = checkRateLimit(ipHash, { bucket: "meet-availability", max: 30 });
  if (!rate.allowed) {
    return json({ ok: false, error: "RATE_LIMITED" }, 429, { "Retry-After": String(rate.retryAfter) });
  }

  try {
    let exclude: { start: number; end: number } | undefined;
    if (token) {
      const found = await lookupManagedBooking(config, token);
      if (!found.ok) return json({ ok: false, error: "LINK_INVALID" }, 400);
      exclude = { start: found.value.event.start, end: found.value.event.end };
    }

    const slots = await getOpenSlots(config, { exclude });
    return json(
      {
        ok: true,
        durationMinutes: config.rules.durationMinutes,
        slots: slots.map((s) => new Date(s).toISOString()),
      },
      200,
      { "Cache-Control": "no-store" },
    );
  } catch (err) {
    console.error("[meet] availability failed:", err);
    trackException(errorOf(err), { step: "meet.availability" });
    await flushTelemetry();
    return json({ ok: false, error: "UNAVAILABLE" }, 503);
  }
}
