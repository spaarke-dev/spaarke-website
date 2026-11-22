/**
 * The words of the Text MEET program, in one place. The /sms page, the opt-in
 * workflow image, and the inbound webhook all read from here, because Twilio's
 * toll-free review compares the call to action, the consent language, and the
 * sample messages against each other and against what people actually receive.
 * Spec: projects/text-to-meet/spec.md.
 */

export const KEYWORD = "MEET";

export const BRAND = "Spaarke, Inc.";

export const HELP_EMAIL = "contactus@spaarke.com";

/** Formats an E.164 US number as (888) 555-0100, or a fallback when unset. */
export function displayNumber(e164: string | null): string {
  if (!e164) return "our booking number";
  const ten = e164.replace(/\D/g, "").slice(-10);
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

/** The call to action as it appears on print, signs, and email signatures. */
export function callToAction(number: string): string {
  return `Text ${KEYWORD} to ${number} to get a link to book a meeting with Spaarke.`;
}

/**
 * The consent statement shown with every call to action. It names the sender,
 * says that the person is agreeing to receive text messages, and says what
 * those messages are and how often they come, which is what error 30513
 * (opt-in language unclear) asks for.
 */
export function consentStatement(number: string): string {
  return (
    `By texting ${KEYWORD} to ${number}, you agree to receive SMS text messages from ${BRAND} ` +
    `in reply: one text with a link to book a meeting for each ${KEYWORD} you send. ` +
    "Message frequency: one reply per text you send. Msg & data rates may apply. " +
    "Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase."
  );
}

/** The reply to MEET. Two SMS segments with a real link; the opt-in confirmation. */
export function meetReply(link: string): string {
  return (
    `Spaarke: Thanks for texting ${KEYWORD}. Book a time with our team: ${link} ` +
    "One reply per text. Msg & data rates may apply. Reply HELP for help, STOP to opt out."
  );
}

/** The HELP reply, configured in the Twilio Messaging Service (Advanced Opt-Out). */
export const HELP_REPLY =
  `Spaarke meeting links: text ${KEYWORD} for a link to book a meeting. One reply per text. ` +
  `Msg & data rates may apply. Help: ${HELP_EMAIL}. Reply STOP to opt out.`;

/** The reply to a text the webhook does not recognize, at most once a day per sender (spec FR-12). */
export const NUDGE_REPLY = `Spaarke: text ${KEYWORD} for a link to book a meeting with our team, or HELP for help. Reply STOP to opt out.`;

/** What a link in a sample message looks like; real links carry a signed code. */
export const SAMPLE_LINK = "https://spaarke.com/meet?c=Xk3Q9pLm2v7A";
