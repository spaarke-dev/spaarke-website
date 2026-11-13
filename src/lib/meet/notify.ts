import { trackEvent, trackException } from "@/lib/logger";
import type { MeetConfig } from "@/lib/meet/config";
import { sendMeetingEmails, type MeetingEmailKind, type SendResult } from "@/lib/meet/emails";
import { manageUrl } from "@/lib/meet/service";
import { guestsOf, type BookingRecord } from "@/lib/meet/store";
import { createManageToken } from "@/lib/meet/tokens";

/**
 * Sends one kind of branded email for a booking, with a fresh manage link for
 * the booker. Failures are logged and counted, never thrown: the meeting
 * already exists by the time any of these go out.
 */
export async function sendBookingEmails(
  kind: MeetingEmailKind,
  config: MeetConfig,
  booking: Pick<BookingRecord, "bookingId" | "name" | "email" | "visitorTimeZone" | "guests">,
  meeting: { start: number; joinUrl: string | null; previousStart?: number; guests?: string[] },
  options: { includeGuests: boolean },
): Promise<SendResult> {
  try {
    const result = await sendMeetingEmails(
      kind,
      {
        start: meeting.start,
        durationMinutes: config.rules.durationMinutes,
        timeZone: booking.visitorTimeZone || config.rules.hostTimeZone,
        joinUrl: meeting.joinUrl,
        bookerName: booking.name,
        guests: meeting.guests ?? guestsOf(booking),
        manageUrl: manageUrl(createManageToken(booking.bookingId, config.linkSecret)),
        previousStart: meeting.previousStart,
      },
      { bookerEmail: booking.email, includeGuests: options.includeGuests },
      config.host,
    );
    if (result.failed > 0) trackEvent("meet.visitor_email_failed", { kind, failed: String(result.failed) });
    return result;
  } catch (err) {
    trackException(err instanceof Error ? err : new Error(String(err)), { step: `meet.email.${kind}` });
    return { sent: 0, failed: 1 };
  }
}
