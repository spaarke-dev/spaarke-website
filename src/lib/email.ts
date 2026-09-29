import sgMail from "@sendgrid/mail";
import type { ContactFormData } from "@/lib/contact";

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
