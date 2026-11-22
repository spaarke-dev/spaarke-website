import { trackEvent, trackException } from "@/lib/logger";
import { verifySmsToken } from "@/lib/meet/tokens";
import { placementLabel, smsLinkSecret } from "@/lib/sms/config";
import { getConversation, isSmsStorageConfigured, markConversationBooked, recordLinkOpen } from "@/lib/sms/store";

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

// ---------------------------------------------------------------------------
// The booking made through the link (FR-16, Graph mode)
// ---------------------------------------------------------------------------

export type SmsBookingSource = {
  conversationId: string;
  /** The placement code, or "none". */
  placement: string;
};

/**
 * The book route's check: the conversation a booking came from, or null. The
 * token is verified again, since the request body is the visitor's to change.
 * A bad, expired, or unknown token, or a storage error, means the booking
 * simply has no link. It never throws, so it can never block a booking.
 */
export async function smsBookingSource(token: unknown, now: Date = new Date()): Promise<SmsBookingSource | null> {
  if (typeof token !== "string" || token === "") return null;
  const unlinked = (reason: string) => {
    trackEvent("sms.booking_unlinked", { reason });
    return null;
  };

  const secret = smsLinkSecret();
  if (!secret) return unlinked("no_secret");
  const check = verifySmsToken(token, secret, now.getTime());
  if (!check.ok) return unlinked(check.reason);

  try {
    if (!isSmsStorageConfigured()) throw new Error("Storage is not configured");
    const conversation = await getConversation(check.conversationId);
    if (!conversation) return unlinked("unknown_conversation");
    return { conversationId: check.conversationId, placement: conversation.placement };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[sms] booking link check failed:", error.message);
    trackException(error, { step: "sms.booking_source" });
    return unlinked("storage");
  }
}

/**
 * Marks the conversation booked once the meeting exists. A later booking
 * through the same link replaces the booking ID. Never throws.
 */
export async function markSmsBooked(source: SmsBookingSource, bookingId: string, now: Date = new Date()): Promise<boolean> {
  try {
    const updated = await markConversationBooked(source.conversationId, bookingId, now);
    if (!updated) {
      trackEvent("sms.booking_unlinked", { reason: "conversation_gone" });
      return false;
    }
    trackEvent("sms.booking_linked", { code: source.placement });
    return true;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[sms] conversation not marked booked:", error.message);
    trackException(error, { step: "sms.booking_link", bookingId });
    return false;
  }
}

/** The team email's line, for example "Came from a text (MEET, CARD2: Postcard, second print)". */
export function smsSourceLine(placement: string): string {
  const where = placementLabel(placement) === "none" ? "none" : `${placement}: ${placementLabel(placement)}`;
  return `Came from a text (MEET, ${where})`;
}
