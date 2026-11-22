/**
 * Settings for the Text MEET webhook. Every value is an app setting read at
 * request time; none is committed, because the repository is public and the
 * number, the Twilio account, and the secrets are not things to publish.
 * See docs/text-to-meet.md for how each one is set. Spec:
 * projects/text-to-meet/spec.md (FR-01, FR-12, FR-17).
 */

export type SmsConfig = {
  accountSid: string;
  /** Current token first; the previous one only during a rotation (FR-04). */
  authTokens: string[];
  /** The exact URL configured in Twilio, which is what Twilio signs. */
  webhookUrl: string;
  /** The program's own number, E.164 (+1 and ten digits). */
  publicNumber: string;
  linkSecret: string;
  phoneHashSecret: string;
  hourlyCap: number;
  dailyCap: number;
};

const MIN_SECRET_LENGTH = 32;

/** Whether the program is switched on. Off by default, so the route answers 404. */
export function smsModeOn(): boolean {
  return process.env.SMS_MODE?.trim().toLowerCase() === "twilio";
}

/** Reads a US or Canadian number in any common format as E.164, or null. */
export function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function intSetting(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < min || n > max) {
    console.warn(`[sms] ${name} is out of range; using ${fallback}.`);
    return fallback;
  }
  return n;
}

function webhookUrlSetting(): string | null {
  const raw = process.env.SMS_WEBHOOK_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol === "https:" || (local && url.protocol === "http:")) return raw;
  } catch {
    // fall through
  }
  console.warn("[sms] SMS_WEBHOOK_URL is not an https URL; the webhook is off.");
  return null;
}

/**
 * The full configuration, or null when the program is off or any required
 * setting is missing. Logs the names of missing settings, never their values.
 */
export function getSmsConfig(): SmsConfig | null {
  if (!smsModeOn()) return null;

  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const previousToken = process.env.TWILIO_AUTH_TOKEN_PREVIOUS?.trim();
  const webhookUrl = webhookUrlSetting();
  const publicNumber = toE164(process.env.SMS_PUBLIC_NUMBER?.trim());
  const linkSecret = process.env.SMS_LINK_SECRET?.trim();
  const phoneHashSecret = process.env.SMS_PHONE_HASH_SECRET?.trim();

  const missing = [
    !accountSid && "TWILIO_ACCOUNT_SID",
    !authToken && "TWILIO_AUTH_TOKEN",
    !webhookUrl && "SMS_WEBHOOK_URL",
    !publicNumber && "SMS_PUBLIC_NUMBER",
    !linkSecret && "SMS_LINK_SECRET",
    !phoneHashSecret && "SMS_PHONE_HASH_SECRET",
  ].filter(Boolean);
  if (missing.length > 0) {
    console.warn(`[sms] SMS_MODE=twilio but settings are missing or invalid: ${missing.join(", ")}.`);
    return null;
  }

  const short = [
    linkSecret!.length < MIN_SECRET_LENGTH && "SMS_LINK_SECRET",
    phoneHashSecret!.length < MIN_SECRET_LENGTH && "SMS_PHONE_HASH_SECRET",
  ].filter(Boolean);
  if (short.length > 0) {
    console.warn(`[sms] ${short.join(", ")} shorter than ${MIN_SECRET_LENGTH} characters; the webhook is off.`);
    return null;
  }

  return {
    accountSid: accountSid!,
    authTokens: previousToken ? [authToken!, previousToken] : [authToken!],
    webhookUrl: webhookUrl!,
    publicNumber: publicNumber!,
    linkSecret: linkSecret!,
    phoneHashSecret: phoneHashSecret!,
    hourlyCap: intSetting("SMS_REPLY_HOURLY_CAP", 30, 1, 10_000),
    dailyCap: intSetting("SMS_REPLY_DAILY_CAP", 150, 1, 100_000),
  };
}

/**
 * The secret that signs the link in a MEET reply, read apart from
 * getSmsConfig: /meet honors a link already sent even when the webhook is
 * off, and in Bookings mode (FR-15, FR-16). Null when unset or too short.
 */
export function smsLinkSecret(): string | null {
  const secret = process.env.SMS_LINK_SECRET?.trim();
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

/**
 * Placement codes: the optional second word after MEET, which says where the
 * person saw the call to action ("Text MEET CARD2"). Codes are not secret.
 * The two below are the ones the spec's Placement section names; the owner
 * confirms the list in task 001. Add one per event or print run.
 */
export const PLACEMENT_CODES: Readonly<Record<string, string>> = {
  CARD2: "Postcard, second print",
  SIG: "Email signature",
};

/** What a conversation records when there is no code, or an unknown one. */
export const NO_PLACEMENT = "none";

/** The stored code for a text: a known code, or "none" (unknown codes are ignored, not refused). */
export function resolvePlacement(code: string | undefined): string {
  return code && Object.hasOwn(PLACEMENT_CODES, code) ? code : NO_PLACEMENT;
}

/** The label for the team email, for example "Postcard, second print". */
export function placementLabel(code: string): string {
  return Object.hasOwn(PLACEMENT_CODES, code) ? PLACEMENT_CODES[code] : NO_PLACEMENT;
}
