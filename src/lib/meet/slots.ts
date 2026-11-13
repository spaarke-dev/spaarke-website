import type { SlotRules } from "@/lib/meet/config";
import { zonedParts, zonedTimeToUtc } from "@/lib/meet/tz";

/** A half-open interval [start, end) in UTC milliseconds. */
export type Interval = { start: number; end: number };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** The span getSchedule has to cover to judge every slot in the window. */
export function scheduleRange(now: number, rules: SlotRules): Interval {
  return {
    start: now - rules.bufferMinutes * MINUTE,
    end: now + rules.windowDays * DAY + (rules.durationMinutes + rules.bufferMinutes) * MINUTE,
  };
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Whether a slot starting at `start` is clear of every busy interval once it
 * is widened by the buffer on both sides.
 */
export function isClear(start: number, busy: Interval[], rules: SlotRules): boolean {
  const widened: Interval = {
    start: start - rules.bufferMinutes * MINUTE,
    end: start + (rules.durationMinutes + rules.bufferMinutes) * MINUTE,
  };
  return !busy.some((b) => overlaps(widened, b));
}

/**
 * Open slot start times (UTC milliseconds, ascending) between the minimum
 * notice and the end of the booking window.
 *
 * Business hours are read in the host's zone one calendar day at a time, so a
 * daylight saving change moves the UTC times of the slots rather than the
 * hours the host works.
 */
export function generateSlots(now: number, busy: Interval[], rules: SlotRules): number[] {
  const earliest = now + rules.minNoticeHours * HOUR;
  const latest = now + rules.windowDays * DAY;
  const today = zonedParts(now, rules.hostTimeZone);
  const slots: number[] = [];

  for (let i = 0; i <= rules.windowDays + 1; i++) {
    // Date.UTC normalizes day overflow, which walks the host's calendar.
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day + i));
    if (!rules.workDays.includes(date.getUTCDay())) continue;
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();

    for (
      let minute = rules.dayStartMinutes;
      minute + rules.durationMinutes <= rules.dayEndMinutes;
      minute += rules.slotStepMinutes
    ) {
      const start = zonedTimeToUtc(y, m, d, Math.floor(minute / 60), minute % 60, rules.hostTimeZone);
      if (start < earliest || start > latest) continue;
      if (isClear(start, busy, rules)) slots.push(start);
    }
  }

  return slots;
}

/**
 * Removes the one busy interval that is the meeting being moved, so that when
 * a visitor reschedules, their own meeting (and its buffer) does not hide the
 * times next to it.
 */
export function withoutInterval(busy: Interval[], own: Interval): Interval[] {
  const i = busy.findIndex((b) => b.start === own.start && b.end === own.end);
  if (i === -1) return busy;
  return [...busy.slice(0, i), ...busy.slice(i + 1)];
}
