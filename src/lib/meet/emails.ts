import sgMail from "@sendgrid/mail";
import { devMockEnabled } from "@/lib/meet/dev-mock";
import { siteUrl } from "@/lib/meet/service";

/**
 * The branded emails a visitor and their guests get from Spaarke about a
 * meeting booked on /meet: a confirmation, reminders 24 hours and 1 hour
 * before, and notices when it moves or is cancelled. They sit beside the
 * Outlook invitation Exchange sends, which is what puts the meeting on the
 * calendar; they never replace it.
 *
 * The layout is table-based with inline styles, the only HTML that Outlook
 * desktop, Outlook on the web, Gmail, and Apple Mail all render the same way.
 * Every visitor-supplied value is escaped. Sending never throws.
 */

export type MeetingEmailKind = "confirmation" | "reminder24" | "reminder1" | "moved" | "cancelled";
export type Audience = "booker" | "guest";

export type MeetingEmailData = {
  start: number;
  durationMinutes: number;
  /** The zone the times are shown in: the booker's, for guests too. */
  timeZone: string;
  joinUrl: string | null;
  bookerName: string;
  guests: string[];
  /** The signed manage link. Only the booker's emails carry it. */
  manageUrl: string;
  /** For "moved": where the meeting was. */
  previousStart?: number;
};

export type BuiltEmail = { subject: string; html: string; text: string; preheader: string };

const COLORS = {
  page: "#f6f6f4",
  card: "#ffffff",
  text: "#0a0a0a",
  mid: "#4a4a48",
  low: "#6b6b68",
  line: "#e4e4e0",
  blue: "#4060DC",
};
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Subjects and headers must stay on one line. */
function oneLine(s: string): string {
  return s.replace(/[\r\n\t]+/g, " ").trim();
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}

function fmt(ms: number, tz: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, ...options }).format(new Date(ms));
}

export function formatDay(ms: number, tz: string): string {
  return fmt(ms, tz, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function shortDay(ms: number, tz: string): string {
  return fmt(ms, tz, { weekday: "short", month: "short", day: "numeric" });
}

function clock(ms: number, tz: string): string {
  return fmt(ms, tz, { hour: "numeric", minute: "2-digit" });
}

function clockWithZone(ms: number, tz: string): string {
  return fmt(ms, tz, { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}

/** For example "9:00 AM to 9:30 AM EST". */
export function formatTimeRange(start: number, minutes: number, tz: string): string {
  const end = start + minutes * 60_000;
  return `${clock(start, tz)} to ${clockWithZone(end, tz)}`;
}

type Copy = {
  subject: string;
  preheader: string;
  heading: string;
  intro: string;
  join: boolean;
};

function copyFor(kind: MeetingEmailKind, audience: Audience, d: MeetingEmailData): Copy {
  const day = shortDay(d.start, d.timeZone);
  const at = clockWithZone(d.start, d.timeZone);
  const booker = d.bookerName.trim();
  const hi = `Hi ${firstName(booker)}, `;
  const invitedBy = `${booker} invited you to a meeting with the Spaarke team.`;

  switch (kind) {
    case "confirmation":
      return {
        subject: `You're booked: Spaarke meeting on ${day} at ${at}`,
        preheader: `Your meeting with the Spaarke team is on ${day} at ${at}.`,
        heading: "You're booked",
        intro: `${hi}thank you for booking time with the Spaarke team. Your Outlook invitation has the same details and puts the meeting on your calendar.`,
        join: true,
      };
    case "reminder24":
      return {
        subject: `Reminder: Spaarke meeting tomorrow at ${at}`,
        preheader: `Your meeting with the Spaarke team is tomorrow at ${at}.`,
        heading: "Your meeting is tomorrow",
        intro:
          audience === "booker"
            ? `${hi}this is a reminder that your meeting with the Spaarke team is tomorrow. We look forward to speaking with you.`
            : `${invitedBy} This is a reminder that it is tomorrow.`,
        join: true,
      };
    case "reminder1":
      return {
        subject: `Starting in 1 hour: Spaarke meeting at ${at}`,
        preheader: `Your meeting with the Spaarke team starts at ${at}.`,
        heading: "Your meeting starts in an hour",
        intro:
          audience === "booker"
            ? `${hi}your meeting with the Spaarke team starts in about an hour. Use the button below to join in Microsoft Teams.`
            : `${invitedBy} It starts in about an hour. Use the button below to join in Microsoft Teams.`,
        join: true,
      };
    case "moved":
      return {
        subject: `Moved: Spaarke meeting now ${day} at ${at}`,
        preheader: `Your meeting with the Spaarke team moved to ${day} at ${at}.`,
        heading: "Your meeting has moved",
        intro:
          audience === "booker"
            ? `${hi}your meeting with the Spaarke team is at a new time. The Teams link stays the same, and your calendar has the update.`
            : `${booker} moved the meeting with the Spaarke team to a new time. The Teams link stays the same.`,
        join: true,
      };
    case "cancelled":
      return {
        subject: `Cancelled: Spaarke meeting on ${day}`,
        preheader: `Your meeting with the Spaarke team on ${day} is cancelled.`,
        heading: "Your meeting is cancelled",
        intro:
          audience === "booker"
            ? `${hi}your meeting with the Spaarke team is cancelled. If you would like to talk another time, you can book a new time whenever suits you.`
            : `${booker} cancelled the meeting with the Spaarke team.`,
        join: false,
      };
  }
}

function button(href: string, label: string): string {
  // A bordered table cell renders as a button in Outlook desktop, which
  // ignores padding on links.
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${COLORS.blue};border-radius:8px;" bgcolor="${COLORS.blue}"><a href="${esc(href)}" style="display:inline-block;padding:13px 22px;font-family:${FONT};font-size:16px;font-weight:600;line-height:20px;color:#ffffff;text-decoration:none;border-radius:8px;">${esc(label)}</a></td></tr></table>`;
}

function detailRow(label: string, value: string): string {
  return `<tr><td style="padding:0 0 10px;font-family:${FONT};font-size:13px;line-height:18px;color:${COLORS.low};text-transform:uppercase;letter-spacing:0.06em;">${esc(label)}</td></tr><tr><td style="padding:0 0 18px;font-family:${FONT};font-size:17px;line-height:24px;color:${COLORS.text};">${value}</td></tr>`;
}

export function buildMeetingEmail(kind: MeetingEmailKind, audience: Audience, d: MeetingEmailData): BuiltEmail {
  const c = copyFor(kind, audience, d);
  const site = siteUrl();
  const tz = d.timeZone;
  const whenHtml = `${esc(formatDay(d.start, tz))}<br>${esc(formatTimeRange(d.start, d.durationMinutes, tz))}`;
  const wasLine =
    kind === "moved" && d.previousStart !== undefined
      ? `<br><span style="color:${COLORS.low};font-size:15px;">Was ${esc(shortDay(d.previousStart, tz))} at ${esc(clockWithZone(d.previousStart, tz))}</span>`
      : "";
  const strike = kind === "cancelled" ? "text-decoration:line-through;" : "";

  const details = [
    detailRow(kind === "cancelled" ? "Was scheduled for" : "When", `<span style="${strike}">${whenHtml}</span>${wasLine}`),
    kind !== "cancelled" ? detailRow("Where", "Microsoft Teams (link below)") : "",
    d.guests.length > 0 && kind !== "cancelled"
      ? detailRow(audience === "booker" ? "Also invited" : "Booked by", audience === "booker" ? d.guests.map(esc).join("<br>") : esc(d.bookerName))
      : "",
  ].join("");

  const primary =
    c.join && d.joinUrl
      ? `${button(d.joinUrl, "Join Microsoft Teams meeting")}<p style="margin:12px 0 0;font-family:${FONT};font-size:13px;line-height:19px;color:${COLORS.low};word-break:break-all;">Or paste this link into your browser:<br><a href="${esc(d.joinUrl)}" style="color:${COLORS.blue};">${esc(d.joinUrl)}</a></p>`
      : kind === "cancelled" && audience === "booker"
        ? button(`${site}/meet`, "Book a new time")
        : "";

  const manage =
    audience === "booker" && kind !== "cancelled"
      ? `<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid ${COLORS.line};font-family:${FONT};font-size:15px;line-height:22px;color:${COLORS.mid};">Need a different time? <a href="${esc(d.manageUrl)}" style="color:${COLORS.blue};font-weight:600;">Reschedule</a> or <a href="${esc(d.manageUrl)}" style="color:${COLORS.blue};font-weight:600;">cancel</a>. You can also invite colleagues from the same page.</p>`
      : "";

  const why =
    audience === "booker"
      ? "You received this email because you booked a meeting with Spaarke on spaarke.com."
      : `You received this email because ${esc(d.bookerName)} invited you to a meeting with Spaarke.`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(c.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};" bgcolor="${COLORS.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.page};" bgcolor="${COLORS.page}">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${COLORS.card};border:1px solid ${COLORS.line};border-radius:12px;" bgcolor="${COLORS.card}">
<tr><td style="padding:28px 32px 8px;">
<a href="${esc(site)}" style="text-decoration:none;"><img src="${esc(site)}/images/email/logo-color.png" width="140" height="43" alt="Spaarke" style="display:block;border:0;width:140px;height:auto;"></a>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<h1 style="margin:0 0 14px;font-family:${FONT};font-size:26px;line-height:32px;font-weight:700;color:${COLORS.text};">${esc(c.heading)}</h1>
<p style="margin:0 0 26px;font-family:${FONT};font-size:16px;line-height:24px;color:${COLORS.mid};">${esc(c.intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${details}</table>
${primary}
${manage}
</td></tr>
<tr><td style="padding:32px 32px 28px;">
<p style="margin:0;font-family:${FONT};font-size:13px;line-height:19px;color:${COLORS.low};">${why} Reply to this email and it reaches the Spaarke team.</p>
</td></tr>
</table>
<p style="margin:18px 0 0;font-family:${FONT};font-size:12px;line-height:18px;color:${COLORS.low};">Spaarke &middot; <a href="${esc(site)}" style="color:${COLORS.low};">spaarke.com</a></p>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    c.heading,
    "",
    c.intro,
    "",
    kind === "cancelled" ? "Was scheduled for:" : "When:",
    `${formatDay(d.start, tz)}, ${formatTimeRange(d.start, d.durationMinutes, tz)}`,
    ...(kind === "moved" && d.previousStart !== undefined
      ? [`(Was ${shortDay(d.previousStart, tz)} at ${clockWithZone(d.previousStart, tz)})`]
      : []),
    ...(c.join && d.joinUrl ? ["", "Join Microsoft Teams meeting:", d.joinUrl] : []),
    ...(d.guests.length > 0 && kind !== "cancelled" && audience === "booker" ? ["", "Also invited:", ...d.guests] : []),
    ...(audience === "booker" && kind !== "cancelled" ? ["", "Reschedule, cancel, or invite colleagues:", d.manageUrl] : []),
    ...(kind === "cancelled" && audience === "booker" ? ["", "Book a new time:", `${site}/meet`] : []),
    "",
    `${audience === "booker" ? "You received this email because you booked a meeting with Spaarke on spaarke.com." : `You received this email because ${d.bookerName} invited you to a meeting with Spaarke.`} Reply to this email and it reaches the Spaarke team.`,
  ].join("\n");

  return { subject: oneLine(c.subject), html, text, preheader: c.preheader };
}

// ---------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------

let initialized = false;

function ready(): { from: string } | null {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!apiKey || !from) return null;
  if (!initialized) {
    sgMail.setApiKey(apiKey);
    initialized = true;
  }
  return { from };
}

export type SendResult = { sent: number; failed: number };

/**
 * Sends one kind of email to the booker and, when `includeGuests`, to each
 * guest. Each recipient gets their own message, so guests never see the
 * booker's manage link. Never throws.
 */
export async function sendMeetingEmails(
  kind: MeetingEmailKind,
  data: MeetingEmailData,
  recipients: { bookerEmail: string; includeGuests: boolean },
  replyTo: string,
): Promise<SendResult> {
  const list: { to: string; audience: Audience }[] = [{ to: recipients.bookerEmail, audience: "booker" }];
  if (recipients.includeGuests) for (const g of data.guests) list.push({ to: g, audience: "guest" });

  const result: SendResult = { sent: 0, failed: 0 };
  for (const r of list) {
    try {
      const email = buildMeetingEmail(kind, r.audience, data);
      if (devMockEnabled()) {
        console.info(`[meet] (dev mock) email ${kind} to ${r.to}: ${email.subject}`);
        result.sent++;
        continue;
      }
      const sg = ready();
      if (!sg) {
        console.warn("[meet] SendGrid is not configured; meeting email not sent.");
        result.failed++;
        continue;
      }
      await sgMail.send({
        to: r.to,
        from: { email: sg.from, name: "Spaarke" },
        replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
        // Links stay exactly as written: no tracking redirects on Teams and
        // signed manage links.
        trackingSettings: {
          clickTracking: { enable: false, enableText: false },
          openTracking: { enable: false },
        },
      });
      result.sent++;
    } catch (err) {
      result.failed++;
      console.error(`[meet] ${kind} email failed:`, err instanceof Error ? err.message : err);
    }
  }
  return result;
}
