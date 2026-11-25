import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { isMarketConfigured } from "@/lib/market/tables";
import { runSteps } from "@/lib/market/step-run";
import { trackEvent } from "@/lib/logger";

/**
 * The daily follow-up job (phase 2 FR-10, task 041), called at 11:00 UTC by
 * .github/workflows/followup-steps.yml with the MA_SYNC_TOKEN bearer token,
 * the same shape as /api/market/sync. It answers with counts only: no names,
 * addresses or step titles.
 *
 *   POST /api/market/followups/run   with the bearer token
 */

export const dynamic = "force-dynamic";

function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function POST(request: Request) {
  const expected = process.env.MA_SYNC_TOKEN?.trim();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "NOT_CONFIGURED", message: "MA_SYNC_TOKEN is not set." }, { status: 503, headers: HEADERS });
  }
  const header = request.headers.get("authorization") ?? "";
  const provided = (header.startsWith("Bearer ") ? header.slice(7) : "").trim();
  if (!provided || !tokenMatches(provided, expected)) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401, headers: HEADERS });
  }
  if (!isMarketConfigured()) {
    return NextResponse.json({ ok: false, error: "NOT_CONFIGURED", message: "The storage connection is not set." }, { status: 503, headers: HEADERS });
  }

  const started = Date.now();
  try {
    const summary = await runSteps();
    try {
      trackEvent("market.steps", Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, String(v)])));
    } catch {
      // Telemetry never fails the run.
    }
    return NextResponse.json({ ok: true, ms: Date.now() - started, ...summary }, { headers: HEADERS });
  } catch (err) {
    console.error("[steps] run failed:", (err as Error).message);
    return NextResponse.json({ ok: false, error: "RUN_FAILED" }, { status: 500, headers: HEADERS });
  }
}
