import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { buildDailyReport, renderDailyReport } from "@/lib/reports/daily";
import { sendDailyReport } from "@/lib/email";
import { trackEvent } from "@/lib/logger";

/**
 * The morning digest, triggered on a schedule.
 *
 * It lives here rather than in a GitHub Action because everything it needs is
 * already an app setting on this site: the storage connection, the SendGrid key,
 * the recipient. Running it from CI would mean copying three secrets into
 * GitHub, and this repository is public. The workflow holds one shared secret
 * and this route does the work, which is the same shape task 050 specifies for
 * cache warming.
 *
 *   GET  /api/reports/daily?days=1   with the bearer token, sends the mail
 *   GET  /api/reports/daily?dry=1    with the bearer token, returns it unsent
 */

export const dynamic = "force-dynamic";

/** Constant time, because a token compared with === leaks its prefix. */
function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const expected = process.env.REPORT_TRIGGER_TOKEN;

  // No token configured means no scheduled reporting, and an open endpoint that
  // reads the conversation record would be worse than no report at all.
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "NOT_CONFIGURED", message: "REPORT_TRIGGER_TOKEN is not set." },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!provided || !tokenMatches(provided, expected)) {
    // Deliberately says nothing about why, and costs nothing to refuse.
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = Number(url.searchParams.get("days") ?? "1");
  const dryRun = url.searchParams.get("dry") === "1";

  const report = await buildDailyReport({
    connectionString: process.env.STORAGE_ACCOUNT_CONNECTION,
    clarityToken: process.env.CLARITY_API_TOKEN,
    days,
  });
  const text = renderDailyReport(report, Math.min(Math.max(days, 1), 3));

  // A section that could not be read is worth knowing about on its own, because
  // a digest that quietly loses a section is how you stop trusting the digest.
  const broken = report.sections.filter((s) => s.problem).map((s) => s.title);
  if (broken.length > 0) {
    trackEvent("report.daily.partial", { sections: broken.join(",") });
  }

  if (dryRun) {
    return NextResponse.json({ ok: true, quiet: report.quiet, broken, text });
  }

  const sent = await sendDailyReport({ text, date: report.date, quiet: report.quiet });
  trackEvent("report.daily.sent", {
    quiet: String(report.quiet),
    sent: String(sent.sent),
    broken: broken.join(","),
  });

  if (!sent.sent) {
    return NextResponse.json({ ok: false, error: "EMAIL_FAILED", detail: sent.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, quiet: report.quiet, broken });
}
