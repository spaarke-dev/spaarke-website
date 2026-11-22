import { flushTelemetry, trackEvent, trackException } from "@/lib/logger";
import { getSmsConfig } from "@/lib/sms/config";
import { handleInbound, type InboundOutcome } from "@/lib/sms/inbound";
import { twiml } from "@/lib/sms/replies";
import { isValidSignature, parseFormBody } from "@/lib/sms/twilio-signature";

/**
 * Twilio's webhook for texts to the Text MEET number (spec FR-03).
 *
 * Order matters: the switch, the body checks, then the signature, and only
 * after the signature passes does anything read From, To, or Body. Every
 * answer after that is 200 with TwiML, one <Message> or an empty
 * <Response/>, even on an error, because Twilio retries a failed or slow
 * webhook and a retry must never become a second reply.
 */

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

const empty = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });

async function done(response: Response): Promise<Response> {
  await flushTelemetry();
  return response;
}

export async function POST(request: Request) {
  const config = getSmsConfig();
  if (!config) return empty(404);

  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/x-www-form-urlencoded")) return empty(400);
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return empty(400);
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return empty(400);

  const params = parseFormBody(raw);

  // Signed over SMS_WEBHOOK_URL, never request.url: behind Static Web Apps
  // the route sees an internal host (the PR #153 lesson).
  if (!isValidSignature(request.headers.get("x-twilio-signature"), config.webhookUrl, params, config.authTokens)) {
    trackEvent("sms.bad_signature");
    return done(empty(403));
  }

  const field = (name: string) => params.find(([k]) => k === name)?.[1] ?? "";
  if (field("AccountSid") !== config.accountSid || field("To") !== config.publicNumber) {
    trackEvent("sms.wrong_destination");
    return done(empty(403));
  }

  let outcome: InboundOutcome;
  try {
    outcome = await handleInbound(params, config);
  } catch (err) {
    trackException(err instanceof Error ? err : new Error(String(err)), { step: "sms.inbound" });
    return done(twiml(null));
  }

  // Labels only: no number, no hash, no message text.
  const props: Record<string, string> = { classification: outcome.classification };
  if (outcome.code) props.code = outcome.code;
  if (outcome.reason) props.reason = outcome.reason;
  trackEvent("sms.received", props);
  if (outcome.reason === "region_blocked") trackEvent("sms.region_blocked");
  if (outcome.reason === "rate_limited") trackEvent("sms.rate_limited", { classification: outcome.classification });
  if (outcome.reply) trackEvent("sms.replied", { classification: outcome.classification });

  return done(twiml(outcome.reply));
}
