import sgMail from "@sendgrid/mail";
import type { ContactFormData } from "@/lib/contact";
import type { DesignPartnerApplication } from "@/lib/design-partners";
import { devMockEnabled } from "@/lib/meet/dev-mock";

let initialized = false;

function ensureInit(): boolean {
  if (initialized) return true;

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] SENDGRID_API_KEY not set - skipping email notifications.",
    );
    return false;
  }

  sgMail.setApiKey(apiKey);
  initialized = true;
  return true;
}

export async function sendContactNotification(
  data: ContactFormData,
): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) {
    return { sent: false, error: "SendGrid not configured." };
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!to || !from) {
    console.warn(
      "[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.",
    );
    return { sent: false, error: "Email recipients not configured." };
  }

  const reason = data.reason || "General";
  const timestamp = new Date().toISOString();

  const text = [
    `New website inquiry received at ${timestamp}`,
    "",
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Company: ${data.company || "(not provided)"}`,
    `Reason:  ${reason}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  try {
    await sgMail.send({
      to,
      from,
      subject: `[Spaarke] New website inquiry - ${reason}`,
      text,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send notification:", message);
    return { sent: false, error: message };
  }
}

export type TourFeedbackEmailData = {
  tourSlug: string;
  sectionId: string;
  stepId: string;
  sentiment: "up" | "down" | null;
  comment: string;
  sessionToken?: string;
};

export async function sendTourFeedbackNotification(
  data: TourFeedbackEmailData,
): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) {
    return { sent: false, error: "SendGrid not configured." };
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!to || !from) {
    console.warn(
      "[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.",
    );
    return { sent: false, error: "Email recipients not configured." };
  }

  const timestamp = new Date().toISOString();
  const sentimentLabel = data.sentiment ?? "(no sentiment)";
  const sessionLine = data.sessionToken
    ? data.sessionToken
    : "(none — anonymous visitor)";

  const text = [
    `New tour feedback received at ${timestamp}`,
    "",
    `Tour:      ${data.tourSlug}`,
    `Section:   ${data.sectionId}`,
    `Step:      ${data.stepId}`,
    `Sentiment: ${sentimentLabel}`,
    `Session:   ${sessionLine}`,
    "",
    "Comment:",
    data.comment,
    "",
    "To follow up, look up the EarlyReleaseSignups row whose email hashes to the session token above.",
  ].join("\n");

  try {
    await sgMail.send({
      to,
      from,
      subject: `Tour feedback: ${data.stepId}`,
      text,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send tour feedback notification:", message);
    return { sent: false, error: message };
  }
}

export type EarlyReleaseSource = "get-access" | "take-tour";

const SOURCE_LABEL: Record<EarlyReleaseSource, string> = {
  "get-access": "Early Release signup",
  "take-tour": "Take Tour signup",
};

export async function sendEarlyReleaseNotification(data: {
  name: string;
  email: string;
  source?: EarlyReleaseSource;
}): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) {
    return { sent: false, error: "SendGrid not configured." };
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!to || !from) {
    console.warn(
      "[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.",
    );
    return { sent: false, error: "Email recipients not configured." };
  }

  const source: EarlyReleaseSource = data.source ?? "get-access";
  const label = SOURCE_LABEL[source];
  const timestamp = new Date().toISOString();

  const text = [
    `New ${label} at ${timestamp}`,
    "",
    `Name:   ${data.name}`,
    `Email:  ${data.email}`,
    `Source: ${source}`,
  ].join("\n");

  try {
    await sgMail.send({
      to,
      from,
      subject: `[Spaarke] New ${label} - ${data.name}`,
      text,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send early release notification:", message);
    return { sent: false, error: message };
  }
}

/**
 * A Design Partner Program application. Reply-to is the applicant, so the team
 * answers from the mail itself.
 */
export async function sendDesignPartnerNotification(
  data: DesignPartnerApplication & { rowKey: string | null },
): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) {
    return { sent: false, error: "SendGrid not configured." };
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!to || !from) {
    console.warn(
      "[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.",
    );
    return { sent: false, error: "Email recipients not configured." };
  }

  const timestamp = new Date().toISOString();
  const stored = data.rowKey
    ? `Saved in Table Storage, DesignPartnerApplications, row ${data.rowKey}.`
    : "NOT SAVED. Table Storage was unavailable, so this mail is the only copy.";

  const text = [
    `New design partner application at ${timestamp}`,
    stored,
    "",
    `Name:              ${data.firstName} ${data.lastName}`,
    `Email:             ${data.email}`,
    `Organization:      ${data.organization}`,
    `Role:              ${data.role}`,
    `Organization type: ${data.organizationType}`,
    "",
    "The decision they would start with:",
    data.startingDecision || "(not provided)",
  ].join("\n");

  try {
    await sgMail.send({
      to,
      from,
      replyTo: data.email,
      subject: `[Spaarke] Design partner application - ${data.organization}`,
      text,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send design partner notification:", message);
    return { sent: false, error: message };
  }
}

/**
 * Tells a human that an evaluation request arrived but did not reach the
 * platform, so somebody re-enters it rather than a lead sitting unread in a
 * table nobody opens.
 *
 * This fires only when the BFF could not be reached or failed. A refusal on the
 * BFF's own terms, a duplicate email for instance, is a working system saying
 * no and needs no alert.
 *
 * The lead's details are in the body on purpose. The point of this mail is that
 * the work can be done from the mail itself when storage is also unavailable.
 */
export async function sendDemoRequestFallbackNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  jobTitle?: string;
  phone?: string;
  useCase: string;
  notes?: string;
  reason: string;
  rowKey: string | null;
}): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) {
    return { sent: false, error: "SendGrid not configured." };
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!to || !from) {
    console.warn(
      "[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.",
    );
    return { sent: false, error: "Email recipients not configured." };
  }

  const timestamp = new Date().toISOString();
  const stored = data.rowKey
    ? `Saved in Table Storage, DemoRequests, row ${data.rowKey}, status orphaned.`
    : "NOT SAVED. Table Storage was unavailable too, so this mail is the only copy.";

  const text = [
    `An evaluation access request did not reach the platform at ${timestamp}.`,
    "",
    `Reason: ${data.reason}`,
    stored,
    "",
    "The visitor was shown a success message, because we hold their request.",
    "Re-enter it in the platform, or wait for the backend and forward it then.",
    "",
    `Name:         ${data.firstName} ${data.lastName}`,
    `Email:        ${data.email}`,
    `Organization: ${data.organization}`,
    `Job title:    ${data.jobTitle || "-"}`,
    `Phone:        ${data.phone || "-"}`,
    `Use case:     ${data.useCase}`,
    `Notes:        ${data.notes || "-"}`,
  ].join("\n");

  try {
    await sgMail.send({
      to,
      from,
      subject: `[Spaarke] ACTION NEEDED: evaluation request not forwarded - ${data.firstName} ${data.lastName}`,
      text,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send demo request fallback notice:", message);
    return { sent: false, error: message };
  }
}

/**
 * The morning digest.
 *
 * The subject carries the headline so the mail can be triaged without opening
 * it, including the case where nothing happened. A quiet day is a real result
 * for a feature that is a bet on engagement, and a subject line that hides it
 * behind "Daily report" makes a week of silence easy to miss.
 */
export async function sendDailyReport(data: {
  text: string;
  date: string;
  quiet: boolean;
}): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) {
    return { sent: false, error: "SendGrid not configured." };
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!to || !from) {
    console.warn("[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.");
    return { sent: false, error: "Email recipients not configured." };
  }

  const subject = data.quiet
    ? `[Spaarke] ${data.date}: quiet. No questions, no leads.`
    : `[Spaarke] ${data.date}: daily report`;

  try {
    await sgMail.send({ to, from, subject, text: data.text });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send the daily report:", message);
    return { sent: false, error: message };
  }
}

/**
 * A mailbox failed several mail sync runs in a row (market access phase 2
 * FR-13). Sent at most once a day per mailbox. Carries the mailbox and its
 * error only: no message content, subject or sender.
 */
export async function sendSyncAlert(data: {
  label: string;
  address: string;
  error: string;
  streak: number;
}): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) return { sent: false, error: "SendGrid not configured." };
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!to || !from) {
    console.warn("[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.");
    return { sent: false, error: "Email recipients not configured." };
  }
  const text = [
    `The mail sync has failed ${data.streak} runs in a row for ${data.label} <${data.address}>.`,
    "",
    `The last error: ${data.error}`,
    "",
    "Mail with contacts in this mailbox is not reaching the timelines. Check it at https://spaarke.com/admin/mailboxes",
    "",
    "This alert goes once a day while the mailbox keeps failing.",
  ].join("\n");
  const subject = `[Spaarke] Mail sync failing: ${data.label}`;
  try {
    await sgMail.send({ to, from, subject, text });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send the sync alert:", message);
    return { sent: false, error: message };
  }
}

/**
 * Text MEET reached a site-wide reply cap (spec FR-12). Sent once per window.
 * Carries the cap and the window only: no number, no hash, no message text.
 */
export async function sendSmsCapAlert(data: {
  kind: "hour" | "day";
  cap: number;
  at: Date;
}): Promise<{ sent: true } | { sent: false; error: string }> {
  if (!ensureInit()) return { sent: false, error: "SendGrid not configured." };
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!to || !from) {
    console.warn("[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set - skipping.");
    return { sent: false, error: "Email recipients not configured." };
  }

  const period = data.kind === "hour" ? "hour" : "day";
  const window =
    data.kind === "hour"
      ? `the hour starting ${data.at.toISOString().slice(0, 13)}:00 UTC`
      : `${data.at.toISOString().slice(0, 10)} (UTC)`;
  const setting = data.kind === "hour" ? "SMS_REPLY_HOURLY_CAP" : "SMS_REPLY_DAILY_CAP";
  const text = [
    `Text MEET reached its cap of ${data.cap} replies for ${window}.`,
    "",
    `Until the next ${period} starts, texts to the number get no reply. STOP, START, and HELP still work, because Twilio answers those itself.`,
    "",
    `If this is real demand, raise ${setting} in the app settings. If it looks like abuse, the sms.received events in App Insights show the mix of texts.`,
  ].join("\n");
  const subject = `[Spaarke] Text MEET: ${data.kind === "hour" ? "hourly" : "daily"} reply cap reached`;

  try {
    await sgMail.send({ to, from, subject, text });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send the SMS cap alert:", message);
    return { sent: false, error: message };
  }
}

/**
 * A meeting booked, moved, or cancelled through the Graph flow on /meet. The
 * calendar event is on the host's calendar already; this mail is what puts it
 * in front of the team (CONTACT_EMAIL_TO) and the host (MEET_HOST), alongside
 * the other leads. Reply-to is the visitor.
 *
 * Never throws. It runs after the meeting already exists, so a failure here
 * must not turn a booking the visitor has into an error on their screen.
 */
export async function sendMeetingNotification(
  data: MeetingNotification,
): Promise<{ sent: true } | { sent: false; error: string }> {
  try {
    return await sendMeetingNotificationUnsafe(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to build meeting notification:", message);
    return { sent: false, error: message };
  }
}

export type MeetingNotification = {
  kind: "booked" | "rescheduled" | "cancelled";
  bookingId: string;
  stored: boolean;
  start: number;
  previousStart?: number;
  hostTimeZone: string;
  visitorTimeZone: string;
  name: string;
  email: string;
  organization: string;
  role?: string;
  topic?: string;
  note?: string;
  guests?: string[];
  attribution?: Record<string, string>;
  /** "Came from a text (...)" when the booking came through a Text MEET link. */
  sourceLine?: string;
};

async function sendMeetingNotificationUnsafe(data: MeetingNotification): Promise<{ sent: true } | { sent: false; error: string }> {
  // As the visitor emails do in mock mode: logged, never sent.
  if (devMockEnabled()) {
    const { heading } = meetingNotificationText(data);
    console.info(`[meet] (dev mock) team notice: ${heading}; ${data.sourceLine ?? "no text link"}`);
    return { sent: true };
  }
  if (!ensureInit()) {
    return { sent: false, error: "SendGrid not configured." };
  }

  const team = process.env.CONTACT_EMAIL_TO?.trim();
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!team || !from) {
    console.warn("[email] CONTACT_EMAIL_TO or SENDGRID_FROM_EMAIL not set; skipping.");
    return { sent: false, error: "Email recipients not configured." };
  }
  // The host gets the notice too: Exchange sends the organizer no invitation,
  // so without it a booking reaches the host only as a calendar entry.
  const host = process.env.MEET_HOST?.trim();
  const to = host && host.toLowerCase() !== team.toLowerCase() ? [team, host] : team;
  const { heading, text } = meetingNotificationText(data);

  try {
    await sgMail.send({
      to,
      from,
      replyTo: data.email,
      subject: `[Spaarke] ${heading} - ${data.organization}`,
      text,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send meeting notification:", message);
    return { sent: false, error: message };
  }
}

/** The team notice's heading and plain-text body. Exported for the check scripts. */
export function meetingNotificationText(data: MeetingNotification): { heading: string; text: string } {
  // Explicit fields: Intl refuses dateStyle or timeStyle combined with
  // timeZoneName, and the zone name is the part the team needs.
  const when = (ms: number, tz: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(ms));

  const heading = {
    booked: "New meeting booked on /meet",
    rescheduled: "Meeting moved on /meet",
    cancelled: "Meeting cancelled on /meet",
  }[data.kind];

  const attribution = Object.entries(data.attribution ?? {})
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

  const text = [
    heading,
    data.stored
      ? `Saved in Table Storage, MeetingBookings, row ${data.bookingId}.`
      : `NOT SAVED to Table Storage (booking ${data.bookingId}). The calendar event and this mail are the record.`,
    ...(data.sourceLine ? [`${data.sourceLine}.`] : []),
    "",
    `When:          ${when(data.start, data.hostTimeZone)}`,
    ...(data.previousStart !== undefined
      ? [`Was:           ${when(data.previousStart, data.hostTimeZone)}`]
      : []),
    `Visitor zone:  ${data.visitorTimeZone}`,
    "",
    `Name:          ${data.name}`,
    `Email:         ${data.email}`,
    `Organization:  ${data.organization}`,
    `Role:          ${data.role || "(not provided)"}`,
    `Guests:        ${data.guests?.length ? data.guests.join(", ") : "(none)"}`,
    "",
    "What to cover:",
    data.topic || "(not provided)",
    ...(data.note ? ["", "Note from the visitor:", data.note] : []),
    ...(attribution.length ? ["", "Attribution:", ...attribution] : []),
  ].join("\n");

  return { heading, text };
}
