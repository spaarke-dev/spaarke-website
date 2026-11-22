import { siteUrl } from "@/lib/ask-ai";
import { createSmsToken, newConversationId } from "@/lib/meet/tokens";
import { resolvePlacement, type SmsConfig } from "@/lib/sms/config";
import { classify, type SmsKind } from "@/lib/sms/keywords";
import { KEYWORD, meetReply, NUDGE_REPLY } from "@/lib/sms/messages";
import { normalizeE164, phoneHash } from "@/lib/sms/phone-hash";
import {
  claimInbound,
  classifyInbound,
  createConversation,
  getConversation,
  getSender,
  newSender,
  updateSender,
  type SenderRecord,
} from "@/lib/sms/store";
import type { FormParams } from "@/lib/sms/twilio-signature";

/**
 * One inbound text, after the route has checked the signature, the account,
 * and the number (spec FR-03). Decides the reply and records what happened.
 * The readable number exists only inside this function; what leaves it is the
 * reply text and labels for telemetry, never the number or its hash.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
/** MEET replies per sender per 24 hours; each repeats the same link (FR-12). */
export const MEET_REPLIES_PER_DAY = 3;
/** Nudges per sender per 24 hours (FR-12). */
export const NUDGES_PER_DAY = 1;
/** How long a link works (FR-15). */
const LINK_DAYS = 30;

export type InboundOutcome = {
  /** The text to send, or null for an empty <Response/>. */
  reply: string | null;
  /** What the text was; "blocked" for a sender outside +1. */
  classification: SmsKind | "blocked" | "unknown";
  /** The placement code after MEET, when known. */
  code?: string;
  /** Why there is no reply, for telemetry. */
  reason?: "duplicate" | "no_message_sid" | "region_blocked" | "opted_out" | "rate_limited" | "handled_by_twilio";
};

function param(params: FormParams, name: string): string {
  return params.find(([k]) => k === name)?.[1] ?? "";
}

const within = (iso: string, now: Date, ms: number) => Boolean(iso) && now.getTime() - Date.parse(iso) < ms;

/** The sender as it should be after this text arrives, before any decision. */
function seen(current: SenderRecord | null, now: Date): SenderRecord {
  return { ...(current ?? newSender(now)), lastSeenAt: now.toISOString() };
}

export async function handleInbound(params: FormParams, config: SmsConfig, now = new Date()): Promise<InboundOutcome> {
  const messageSid = param(params, "MessageSid");
  if (!/^[A-Za-z0-9]{1,64}$/.test(messageSid)) return { reply: null, classification: "unknown", reason: "no_message_sid" };
  if (!(await claimInbound(messageSid, now))) return { reply: null, classification: "unknown", reason: "duplicate" };

  const e164 = normalizeE164(param(params, "From"));
  if (!e164) {
    await classifyInbound(messageSid, now, "blocked");
    return { reply: null, classification: "blocked", reason: "region_blocked" };
  }
  const hash = phoneHash(e164, config.phoneHashSecret);

  const { kind, code } = classify(param(params, "Body"), param(params, "OptOutType"));
  const outcome = await decide(kind, code, hash, config, now);
  await classifyInbound(messageSid, now, kind, outcome.conversationId ?? "");
  return { reply: outcome.reply, classification: kind, code, reason: outcome.reason };
}

type Decision = { reply: string | null; conversationId?: string; reason?: InboundOutcome["reason"] };

async function decide(kind: SmsKind, code: string | undefined, hash: string, config: SmsConfig, now: Date): Promise<Decision> {
  const at = now.toISOString();

  switch (kind) {
    // STOP, START, and HELP are answered by Twilio's Advanced Opt-Out; the
    // route records them and stays silent, so nobody gets two replies.
    case "stop":
      await updateSender(hash, (c) => ({ ...seen(c, now), optedOut: true, optedOutAt: at }));
      return { reply: null, reason: "handled_by_twilio" };
    case "start":
      await updateSender(hash, (c) => ({ ...seen(c, now), optedOut: false }));
      return { reply: null, reason: "handled_by_twilio" };
    case "help":
      await updateSender(hash, (c) => seen(c, now));
      return { reply: null, reason: "handled_by_twilio" };
    case "meet":
      return meet(code, hash, config, now);
    case "other":
      return other(hash, now);
  }
}

/** True when the window that began at `start` is still open and has `count` of `max` used. */
function full(start: string, count: number, max: number, now: Date): boolean {
  return within(start, now, DAY_MS) && count >= max;
}

async function meet(code: string | undefined, hash: string, config: SmsConfig, now: Date): Promise<Decision> {
  const at = now.toISOString();

  // A first look, so a sender who is opted out or at the limit does not get
  // a conversation row made for nothing. The decision itself is taken again
  // below, inside the guarded write.
  const before = await getSender(hash);
  if (before?.optedOut) {
    await updateSender(hash, (c) => seen(c, now));
    return { reply: null, reason: "opted_out" };
  }
  if (before && full(before.meetWindowStart, before.meetReplyCount, MEET_REPLIES_PER_DAY, now)) {
    await updateSender(hash, (c) => seen(c, now));
    return { reply: null, reason: "rate_limited" };
  }

  // Reuse the sender's conversation from the last 24 hours, or make one. The
  // row is created before the sender points at it, so a link never names a
  // conversation that does not exist.
  let conversationId =
    before && within(before.latestConversationAt, now, DAY_MS) ? before.latestConversationId : "";
  if (conversationId && !(await getConversation(conversationId))) conversationId = "";
  const created = !conversationId;
  if (created) {
    conversationId = newConversationId();
    await createConversation(conversationId, {
      phoneHash: hash,
      keyword: KEYWORD,
      placement: resolvePlacement(code),
      createdAt: at,
      linkExpiresAt: new Date(now.getTime() + LINK_DAYS * DAY_MS).toISOString(),
    });
  }

  let decision: Decision = { reply: null };
  await updateSender(hash, (c) => {
    const s = seen(c, now);
    if (s.optedOut) {
      decision = { reply: null, reason: "opted_out" };
      return s;
    }
    const open = within(s.meetWindowStart, now, DAY_MS);
    const count = open ? s.meetReplyCount : 0;
    if (count >= MEET_REPLIES_PER_DAY) {
      decision = { reply: null, reason: "rate_limited" };
      return s;
    }
    const token = createSmsToken(conversationId, config.linkSecret, now.getTime());
    decision = { reply: meetReply(`${siteUrl()}/meet?c=${token}`), conversationId };
    return {
      ...s,
      meetReplyCount: count + 1,
      meetWindowStart: open ? s.meetWindowStart : at,
      latestConversationId: conversationId,
      latestConversationAt: created ? at : s.latestConversationAt || at,
    };
  });
  return decision;
}

async function other(hash: string, now: Date): Promise<Decision> {
  const at = now.toISOString();
  let decision: Decision = { reply: null };
  await updateSender(hash, (c) => {
    const s = seen(c, now);
    if (s.optedOut) {
      decision = { reply: null, reason: "opted_out" };
      return s;
    }
    if (full(s.otherWindowStart, s.otherReplyCount, NUDGES_PER_DAY, now)) {
      decision = { reply: null, reason: "rate_limited" };
      return s;
    }
    const open = within(s.otherWindowStart, now, DAY_MS);
    decision = { reply: NUDGE_REPLY };
    return {
      ...s,
      otherReplyCount: (open ? s.otherReplyCount : 0) + 1,
      otherWindowStart: open ? s.otherWindowStart : at,
    };
  });
  return decision;
}
