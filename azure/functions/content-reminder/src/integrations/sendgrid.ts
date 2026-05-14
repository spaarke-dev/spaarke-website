// azure/functions/content-reminder/src/integrations/sendgrid.ts
//
// Thin, typed wrapper around `@sendgrid/mail` for sending multipart
// (HTML + plain-text) digest emails. No KV access and no env-var
// reads — callers pass the API key and addresses in. Designed to be
// reusable; a future `azure/shared/sendgrid.ts` will seed from this
// once a third caller appears (see task 011 notes).
//
// Per spec.md §3 and decision #6 (multipart email).
//
// IMPORTANT: never log or include `apiKey` in any thrown error
// message. The wrapped error surfaces SendGrid's response body so
// operators can see actionable failures like "sender not verified"
// without exposing the secret.
//
// Reference pattern: azure/functions/linkedin-token-refresh/src/notify.ts

import sgMail from "@sendgrid/mail";

export interface DigestEmail {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  apiKey: string;
}

// Shape of the error SendGrid throws. Not exported by the SDK as a
// type, so we narrow it locally. `response.body` typically contains
// `{ errors: [{ message, field, help }] }` — the specific failure
// reason (e.g., "The from address does not match a verified Sender
// Identity").
interface SendGridErrorResponse {
  body?: unknown;
  statusCode?: number;
}

interface SendGridErrorLike {
  message?: string;
  code?: number;
  response?: SendGridErrorResponse;
}

function formatResponseBody(body: unknown): string {
  if (body == null) return "";
  if (typeof body === "string") return body;
  try {
    return JSON.stringify(body);
  } catch {
    return String(body);
  }
}

export async function sendDigest(email: DigestEmail): Promise<void> {
  // Idempotent — safe to call on every invocation. Operator could
  // rotate the API key between calls, so don't memoize.
  sgMail.setApiKey(email.apiKey);

  try {
    await sgMail.send({
      to: email.to,
      from: email.from,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  } catch (err: unknown) {
    const e = err as SendGridErrorLike;
    const base = e?.message ?? "unknown error";
    const bodyStr = formatResponseBody(e?.response?.body);
    const statusPart =
      typeof e?.response?.statusCode === "number"
        ? ` [status=${e.response.statusCode}]`
        : "";
    const bodyPart = bodyStr ? ` — response: ${bodyStr}` : "";
    throw new Error(
      `SendGrid send to <${email.to}> from <${email.from}> failed: ${base}${statusPart}${bodyPart}`,
    );
  }
}
