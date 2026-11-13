import type { MeetingEmailKind } from "@/lib/meet/emails";
import type { BookingRecord } from "@/lib/meet/store";

/**
 * When each reminder is due. Pure, so the checks in scripts/check-meet-slots.mts
 * can cover the windows and the skip rules without storage or Graph.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

export type ReminderField = "reminder24hFor" | "reminder1hFor";

export type ReminderRule = {
  kind: Extract<MeetingEmailKind, "reminder24" | "reminder1">;
  field: ReminderField;
  /** Due this long before the start. */
  lead: number;
  /** Not sent once the start is closer than this. */
  latest: number;
  /** Skipped if the booking or latest move came less than this before it fell due. */
  quiet: number;
};

export const REMINDER_RULES: ReminderRule[] = [
  { kind: "reminder24", field: "reminder24hFor", lead: 24 * HOUR, latest: 20 * HOUR, quiet: 12 * HOUR },
  { kind: "reminder1", field: "reminder1hFor", lead: 60 * MINUTE, latest: 10 * MINUTE, quiet: 30 * MINUTE },
];

/** How far ahead a run looks: the longest lead, plus room for a late run. */
export const LOOKAHEAD = 25 * HOUR;

type ReminderInput = Pick<
  BookingRecord,
  "status" | "start" | "createdAt" | "movedAt" | "reminder24hFor" | "reminder1hFor"
>;

export type ReminderDecision =
  | { send: true; rule: ReminderRule }
  | { send: false; reason: "inactive" | "none_due" | "already_sent" | "too_soon_after_booking" };

/** Which reminder, if any, a booking needs at `now`. Pure, for the checks. */
export function dueReminder(b: ReminderInput, now: number): ReminderDecision {
  if (b.status !== "booked" && b.status !== "rescheduled") return { send: false, reason: "inactive" };
  const start = Date.parse(b.start);
  if (!Number.isFinite(start)) return { send: false, reason: "inactive" };
  const lastChange = Date.parse(b.movedAt || b.createdAt);

  for (const rule of REMINDER_RULES) {
    const due = start - rule.lead;
    if (now < due || now > start - rule.latest) continue;
    if (b[rule.field] === b.start) return { send: false, reason: "already_sent" };
    if (Number.isFinite(lastChange) && lastChange > due - rule.quiet) {
      return { send: false, reason: "too_soon_after_booking" };
    }
    return { send: true, rule };
  }
  return { send: false, reason: "none_due" };
}
