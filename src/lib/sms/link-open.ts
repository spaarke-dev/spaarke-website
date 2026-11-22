import { trackEvent, trackException } from "@/lib/logger";
import { verifySmsToken } from "@/lib/meet/tokens";
import { smsLinkSecret } from "@/lib/sms/config";
import { isSmsStorageConfigured, recordLinkOpen } from "@/lib/sms/store";

/**
 * /meet opened from the link in a MEET reply (spec FR-16).
 *
 * The token is verified first; a bad or expired one leaves the page as it is
 * without `c`. A good one records the open on the conversation. When storage
 * cannot be reached the token is still genuine, so the visitor still gets the
 * welcome line; only the record is missed, and the error is logged. Nothing
 * here may throw into the page.
 */

export type SmsLinkOpen = {
  /** The verified token, for the booking flow to send with a booking (task 031). */
  token: string;
  /** The placement code, or "none"; null when storage could not be read. */
  code: string | null;
};

export async function openSmsLink(
  c: string | string[] | undefined,
  now: Date = new Date(),
): Promise<SmsLinkOpen | null> {
  if (c === undefined) return null;
  const token = Array.isArray(c) ? (c[0] ?? "") : c;

  const secret = smsLinkSecret();
  if (!secret) {
    console.warn("[sms] /meet has a link token but SMS_LINK_SECRET is missing or short; ignored.");
    return null;
  }

  const check = verifySmsToken(token, secret, now.getTime());
  if (!check.ok) {
    trackEvent(check.reason === "expired" ? "sms.token_expired" : "sms.token_invalid");
    return null;
  }

  try {
    if (!isSmsStorageConfigured()) throw new Error("Storage is not configured");
    const conversation = await recordLinkOpen(check.conversationId, now);
    if (!conversation) {
      // Signed by us, but the row is gone (or was never written).
      trackEvent("sms.token_invalid", { reason: "unknown_conversation" });
      return null;
    }
    trackEvent("sms.link_opened", {
      code: conversation.placement,
      first: String(conversation.linkOpenCount === 1),
    });
    return { token, code: conversation.placement };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    // The message only: storage errors carry no number or text.
    console.error("[sms] link open not recorded:", error.message);
    trackException(error, { step: "sms.link_open" });
    return { token, code: null };
  }
}
