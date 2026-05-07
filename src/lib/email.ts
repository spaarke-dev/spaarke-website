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
