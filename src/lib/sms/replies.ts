/**
 * TwiML responses for the inbound webhook. Every answer is either one
 * <Message> or an empty <Response/>, served as text/xml with status 200, so
 * Twilio never retries into a second reply.
 */

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function xmlEscape(text: string): string {
  return text.replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);
}

/** The TwiML document: one message, or none. */
export function twimlBody(message?: string | null): string {
  const head = '<?xml version="1.0" encoding="UTF-8"?>';
  return message ? `${head}<Response><Message>${xmlEscape(message)}</Message></Response>` : `${head}<Response/>`;
}

export function twiml(message?: string | null): Response {
  return new Response(twimlBody(message), {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8", "Cache-Control": "no-store" },
  });
}
