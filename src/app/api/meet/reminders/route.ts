import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { flushTelemetry, trackEvent, trackException } from "@/lib/logger";
import { getMeetConfig } from "@/lib/meet/config";
import { runReminders } from "@/lib/meet/reminders";
import { errorOf, json } from "@/lib/meet/routes";
import { runDailySmsPurge } from "@/lib/sms/retention";

export const dynamic = "force-dynamic";

function cronSecret(): string | null {
  const s = process.env.MEET_CRON_SECRET?.trim();
  return s && s.length >= 32 ? s : null;
}

/** Constant-time compare of the bearer token against the secret. */
function authorized(request: NextRequest, secret: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const a = createHash("sha256").update(token).digest();
  const b = createHash("sha256").update(secret).digest();
  return token.length > 0 && timingSafeEqual(a, b);
}

/**
 * Sends the reminder emails that are due. Called every five minutes by the
 * Logic App described in docs/meet-graph-booking.md. Not gated on
 * MEET_BOOKING_MODE: meetings already booked get their reminders through a
 * rollback to the Bookings embed.
 *
 * The daily Text MEET retention purge rides on the same schedule (task 043).
 * It runs alongside the reminders, never throws, and is not gated on the
 * /meet settings.
 */
export async function POST(request: NextRequest) {
  const secret = cronSecret();
  if (!secret) return json({ error: "Not found" }, 404);
  if (!authorized(request, secret)) return json({ error: "Unauthorized" }, 401);

  const purge = runDailySmsPurge();
  try {
    return await sendReminders();
  } finally {
    await purge;
    await flushTelemetry();
  }
}

async function sendReminders() {
  const config = getMeetConfig();
  if (!config) return json({ ok: false, error: "NOT_CONFIGURED" }, 503);

  try {
    const run = await runReminders(config);
    if (run.sent > 0 || run.failed > 0) trackEvent("meet.reminders", Object.fromEntries(Object.entries(run).map(([k, v]) => [k, String(v)])));
    return json({ ok: true, ...run });
  } catch (err) {
    console.error("[meet] reminder run failed:", err);
    trackException(errorOf(err), { step: "meet.reminders" });
    return json({ ok: false, error: "UNAVAILABLE" }, 503);
  }
}

export function GET() {
  return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
}
