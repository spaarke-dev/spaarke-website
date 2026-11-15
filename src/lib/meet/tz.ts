/**
 * Time zone arithmetic on top of Intl, so the booking flow needs no date
 * library. Everything the server stores or sends is UTC; these helpers convert
 * between a UTC instant and a wall-clock time in a named IANA zone.
 */

export type ZonedParts = {
  year: number;
  month: number; // 1 to 12
  day: number;
  hour: number;
  minute: number;
};

const formatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone || timeZone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** The wall-clock reading of a UTC instant in a zone. */
export function zonedParts(utcMs: number, timeZone: string): ZonedParts {
  const out: Record<string, number> = {};
  for (const p of partsFormatter(timeZone).formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour === 24 ? 0 : out.hour,
    minute: out.minute,
  };
}

/** How far the zone is ahead of UTC at a given instant, in milliseconds. */
export function zoneOffsetMs(utcMs: number, timeZone: string): number {
  const p = zonedParts(utcMs, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  const floored = Math.floor(utcMs / 60_000) * 60_000;
  return asUtc - floored;
}

/**
 * The UTC instant at which a zone's clock reads the given wall-clock time.
 *
 * Two passes, because the offset at the guess can differ from the offset at
 * the answer across a daylight saving change. A wall-clock time that does not
 * exist (inside a spring-forward gap) resolves to the instant just after the
 * gap; one that occurs twice (a fall-back hour) resolves to the first.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): number {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const first = wall - zoneOffsetMs(wall, timeZone);
  const second = wall - zoneOffsetMs(first, timeZone);
  if (first === second) return first;
  // Ambiguous or nonexistent: prefer the candidate whose wall clock matches.
  const p = zonedParts(second, timeZone);
  if (p.hour === hour && p.minute === minute) return Math.min(first, second);
  return Math.max(first, second);
}

/** A calendar date key (YYYY-MM-DD) for an instant as seen in a zone. */
export function zonedDateKey(utcMs: number, timeZone: string): string {
  const p = zonedParts(utcMs, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}
