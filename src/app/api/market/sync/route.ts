import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { isMarketConfigured } from "@/lib/market/tables";
import { getMailSettings } from "@/lib/market/graph-mail";
import { syncAll } from "@/lib/market/sync";
import { trackEvent } from "@/lib/logger";

/**
 * The mail sync (task 042), called every 30 minutes by
 * .github/workflows/mail-sync.yml with the MA_SYNC_TOKEN bearer token, the
 * same shape as /api/reports/daily. It answers with counts only: no
 * addresses, subjects or message IDs.
 *
 *   POST /api/market/sync   with the bearer token
 */

export const dynamic = "force-dynamic";

// Static Web Apps ends a function call at about 45 seconds; stop starting new
// messages well before that, leaving time to record results and recompute
// campaigns. Whatever is left continues on the next run.
const BUDGET_MS = 25_000;

function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function POST(request: Request) {
  // Trimmed: a token with a stray carriage return fails without looking like an auth problem.
  const expected = process.env.MA_SYNC_TOKEN?.trim();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "NOT_CONFIGURED", message: "MA_SYNC_TOKEN is not set." }, { status: 503, headers: HEADERS });
  }
  const header = request.headers.get("authorization") ?? "";
  const provided = (header.startsWith("Bearer ") ? header.slice(7) : "").trim();
  if (!provided || !tokenMatches(provided, expected)) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401, headers: HEADERS });
  }

  const settings = getMailSettings();
  if (!settings || !isMarketConfigured()) {
    return NextResponse.json(
      { ok: false, error: "NOT_CONFIGURED", message: "The Graph settings or the storage connection are not set." },
      { status: 503, headers: HEADERS },
    );
  }

  const started = Date.now();
  const summary = await syncAll({ settings, deadline: started + BUDGET_MS });
  const failed = summary.mailboxes.filter((m) => !m.ok).length;
  const totals = summary.mailboxes.reduce(
    (t, m) => ({
      messages: t.messages + m.messages,
      sent: t.sent + m.sent,
      received: t.received + m.received,
      bounced: t.bounced + m.bounced,
      triaged: t.triaged + m.triaged,
      followUpsClosed: t.followUpsClosed + m.followUpsClosed,
    }),
    { messages: 0, sent: 0, received: 0, bounced: 0, triaged: 0, followUpsClosed: 0 },
  );
  try {
    trackEvent("market.sync", {
      mailboxes: String(summary.mailboxes.length),
      failed: String(failed),
      deferred: String(summary.deferred),
      ...Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, String(v)])),
    });
  } catch {
    // Telemetry never fails the run.
  }

  // A mailbox that failed is reported here and on /admin/mailboxes; the run itself succeeded.
  return NextResponse.json({ ok: true, ms: Date.now() - started, failed, ...totals, ...summary }, { headers: HEADERS });
}
