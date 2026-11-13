import { trackException } from "@/lib/logger";
import type { MeetConfig } from "@/lib/meet/config";
import { getMeetingEvent } from "@/lib/meet/graph";
import { sendBookingEmails } from "@/lib/meet/notify";
import { dueReminder, LOOKAHEAD } from "@/lib/meet/reminder-rules";
import { listBookingsStartingBetween, updateBookingIfUnchanged } from "@/lib/meet/store";

/**
 * Reminder emails, sent by a scheduler that calls /api/meet/reminders every
 * few minutes. Each reminder has a window rather than an instant, so a late
 * or missed run still sends it, and a claim on the booking row (an ETag
 * conditional write) so two runs at once never both send it.
 */

export type ReminderRun = { checked: number; sent: number; skipped: number; failed: number };

const RUN_BUDGET_MS = 25_000;

export async function runReminders(config: MeetConfig, now = Date.now()): Promise<ReminderRun> {
  const run: ReminderRun = { checked: 0, sent: 0, skipped: 0, failed: 0 };
  const rows = await listBookingsStartingBetween(now, now + LOOKAHEAD);

  for (const row of rows) {
    if (Date.now() - now > RUN_BUDGET_MS) break; // The next run picks up the rest.
    run.checked++;
    const decision = dueReminder(row, now);
    if (!decision.send) {
      if (decision.reason !== "none_due" && decision.reason !== "inactive") run.skipped++;
      continue;
    }
    const { rule } = decision;

    try {
      // Claim first. A 412 means another run has this one.
      const etag = await updateBookingIfUnchanged(row.bookingId, row.etag, { [rule.field]: row.start });
      if (etag === null) {
        run.skipped++;
        continue;
      }

      // The calendar is the truth: skip a meeting the host cancelled or moved
      // in Outlook, which the row does not know about.
      const event = row.eventId ? await getMeetingEvent(config, row.eventId) : null;
      if (!event || event.isCancelled || event.start !== Date.parse(row.start)) {
        run.skipped++;
        continue;
      }

      const result = await sendBookingEmails(
        rule.kind,
        config,
        row,
        { start: event.start, joinUrl: event.joinUrl ?? row.joinUrl ?? null },
        { includeGuests: true },
      );
      if (result.sent === 0) {
        // Nothing went out: release the claim so the next run tries again
        // while the window is still open.
        await updateBookingIfUnchanged(row.bookingId, etag, { [rule.field]: "" }).catch(() => null);
        run.failed++;
      } else {
        run.sent++;
      }
    } catch (err) {
      run.failed++;
      console.error("[meet] reminder failed:", err);
      trackException(err instanceof Error ? err : new Error(String(err)), {
        step: "meet.reminders",
        bookingId: row.bookingId,
      });
    }
  }
  return run;
}
