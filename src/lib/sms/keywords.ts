import { KEYWORD } from "@/lib/sms/messages";

/**
 * What an inbound text asks for. Spec: projects/text-to-meet/spec.md, FR-07 to
 * FR-10. Twilio answers STOP, START and HELP itself (Advanced Opt-Out); the
 * route only records them and stays silent, so nobody gets two replies.
 */

export type SmsKind = "meet" | "stop" | "start" | "help" | "other";

export type Classification = { kind: SmsKind; code?: string };

/** Twilio's toll-free opt-out words. */
const STOP_WORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "REVOKE", "OPTOUT", "QUIT"]);
/** The only re-opt-in words on toll-free. */
const START_WORDS = new Set(["START", "UNSTOP"]);
const HELP_WORDS = new Set(["HELP", "INFO"]);

/** Plain-language revocations (FR-08): consent may be revoked "by any reasonable means". */
const STOP_PHRASES = ["stop texting", "stop text", "dont text", "do not text", "remove me", "opt out", "unsubscribe me"];

const CODE = /^[A-Z0-9]{1,12}$/;

/** Words in the message, uppercased, with punctuation removed. */
function words(body: string): string[] {
  return body
    .normalize("NFKC")
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
}

/** Lowercase, straight apostrophes dropped, spacing collapsed, for phrase matching. */
function phraseText(body: string): string {
  return body
    .normalize("NFKC")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function fromOptOutType(optOutType: string | null | undefined): SmsKind | null {
  switch (optOutType?.trim().toUpperCase()) {
    case "STOP":
      return "stop";
    case "START":
      return "start";
    case "HELP":
      return "help";
    default:
      return null;
  }
}

/**
 * Classifies a text. Twilio's OptOutType (sent by Advanced Opt-Out) wins when
 * present. Otherwise the first word decides, except that a stop word or a
 * plain-language revocation anywhere in the message makes it a stop: when a
 * message could be read either way, the reading that honors an opt-out wins.
 * Counsel reviews this rule (spec, "For counsel").
 */
export function classify(body: string | null | undefined, optOutType?: string | null): Classification {
  const forced = fromOptOutType(optOutType);
  if (forced) return { kind: forced };

  const text = body ?? "";
  const w = words(text);
  if (w.length === 0) return { kind: "other" };

  const first = w[0];
  if (STOP_WORDS.has(first)) return { kind: "stop" };
  if (w.some((word) => STOP_WORDS.has(word))) return { kind: "stop" };
  const phrases = ` ${phraseText(text)} `;
  if (STOP_PHRASES.some((p) => phrases.includes(` ${p} `))) return { kind: "stop" };

  if (START_WORDS.has(first)) return { kind: "start" };
  if (HELP_WORDS.has(first)) return { kind: "help" };

  if (first === KEYWORD) {
    const code = w[1];
    return code && CODE.test(code) ? { kind: "meet", code } : { kind: "meet" };
  }

  return { kind: "other" };
}
