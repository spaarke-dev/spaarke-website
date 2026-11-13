import type { NextRequest } from "next/server";
import { buildMeetingEmail, type Audience, type MeetingEmailKind } from "@/lib/meet/emails";
import { siteUrl } from "@/lib/meet/service";

export const dynamic = "force-dynamic";

const KINDS: MeetingEmailKind[] = ["confirmation", "reminder24", "reminder1", "moved", "cancelled"];

/**
 * Renders a meeting email with sample data, for checking the layout in a
 * browser. Development only: 404 in any production build.
 */
export function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return new Response("Not found", { status: 404 });

  const params = request.nextUrl.searchParams;
  const kind = (KINDS as string[]).includes(params.get("type") ?? "")
    ? (params.get("type") as MeetingEmailKind)
    : "confirmation";
  const audience: Audience = params.get("as") === "guest" ? "guest" : "booker";
  const day = 86_400_000;
  const start = Math.ceil((Date.now() + 2 * day) / (30 * 60_000)) * 30 * 60_000;

  const email = buildMeetingEmail(kind, audience, {
    start,
    durationMinutes: 30,
    timeZone: "America/New_York",
    joinUrl: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_sample%40thread.v2/0",
    bookerName: "Jordan Rivera",
    guests: ["alex.chen@example.com", "sam.patel@example.com"],
    manageUrl: `${siteUrl()}/meet/manage?t=sample`,
    previousStart: start - day,
  });

  const body = params.get("format") === "text" ? `<pre>${email.text.replace(/</g, "&lt;")}</pre>` : email.html;
  return new Response(body, {
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Email-Subject": encodeURIComponent(email.subject) },
  });
}
