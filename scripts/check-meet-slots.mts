// Checks for the /meet slot rules, time zone math, and manage links.
//
//   npm run meet:check
//
// Pure functions only: no Graph, no storage, no settings. The cases are the
// ones the spec names (FR-03): buffers, minimum notice, a daylight saving
// change in the host zone, a visitor whose date differs from the host's, and
// a window with nothing open.

import assert from "node:assert/strict";
import type { SlotRules } from "@/lib/meet/config";
import type { Interval } from "@/lib/meet/slots";

// The library modules compile as CommonJS under tsx, so named imports are
// taken from dynamic imports, as the other check scripts do.
const { generateSlots, isClear, withoutInterval } = await import("@/lib/meet/slots");
const { zonedDateKey, zonedParts, zonedTimeToUtc, isValidTimeZone } = await import("@/lib/meet/tz");
const { createManageToken, verifyManageToken } = await import("@/lib/meet/tokens");

const NY = "America/New_York";
const rules: SlotRules = {
  hostTimeZone: NY,
  durationMinutes: 30,
  bufferMinutes: 15,
  minNoticeHours: 24,
  windowDays: 21,
  dayStartMinutes: 9 * 60,
  dayEndMinutes: 17 * 60,
  workDays: [1, 2, 3, 4, 5],
  slotStepMinutes: 30,
};

const iso = (s: string) => Date.parse(s);
const at = (ms: number) => new Date(ms).toISOString();
let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}`);
    throw err;
  }
}

console.log("meet: time zones");

check("zonedTimeToUtc, standard and daylight time", () => {
  assert.equal(at(zonedTimeToUtc(2026, 11, 17, 9, 0, NY)), "2026-11-17T14:00:00.000Z");
  assert.equal(at(zonedTimeToUtc(2026, 7, 14, 9, 0, NY)), "2026-07-14T13:00:00.000Z");
  assert.equal(at(zonedTimeToUtc(2026, 11, 17, 9, 0, "Asia/Kolkata")), "2026-11-17T03:30:00.000Z");
});

check("zonedTimeToUtc, repeated hour resolves to the first", () => {
  // 2026-11-01 01:30 happens twice in New York; the first is EDT (05:30Z).
  assert.equal(at(zonedTimeToUtc(2026, 11, 1, 1, 30, NY)), "2026-11-01T05:30:00.000Z");
});

check("zonedTimeToUtc, skipped hour resolves past the gap", () => {
  // 2026-03-08 02:30 does not exist in New York.
  const ms = zonedTimeToUtc(2026, 3, 8, 2, 30, NY);
  const p = zonedParts(ms, NY);
  assert.equal(p.hour, 3);
  assert.equal(p.minute, 30);
});

check("isValidTimeZone", () => {
  assert.ok(isValidTimeZone("Europe/London"));
  assert.ok(!isValidTimeZone("Mars/Olympus"));
  assert.ok(!isValidTimeZone(""));
});

console.log("meet: slots");

// Monday 2026-11-16, 08:00 in New York.
const monday8am = iso("2026-11-16T13:00:00Z");

check("minimum notice: first slot is Tuesday 09:00, not Monday", () => {
  const slots = generateSlots(monday8am, [], rules);
  assert.equal(at(slots[0]), "2026-11-17T14:00:00.000Z");
});

check("minimum notice: a slot inside the notice is dropped", () => {
  // At Monday 09:10, Tuesday 09:00 is less than 24 hours away.
  const slots = generateSlots(iso("2026-11-16T14:10:00Z"), [], rules);
  assert.equal(at(slots[0]), "2026-11-17T14:30:00.000Z");
});

check("business hours: 16 slots a day, last at 16:30, none at weekends", () => {
  const slots = generateSlots(monday8am, [], rules);
  const tuesday = slots.filter((s) => zonedDateKey(s, NY) === "2026-11-17");
  assert.equal(tuesday.length, 16);
  assert.equal(zonedParts(tuesday[15], NY).hour, 16);
  assert.equal(zonedParts(tuesday[15], NY).minute, 30);
  const weekend = slots.filter((s) => [0, 6].includes(new Date(s - 5 * 3600_000).getUTCDay()));
  assert.equal(weekend.length, 0);
});

check("booking window: nothing past 21 days", () => {
  const slots = generateSlots(monday8am, [], rules);
  const last = slots[slots.length - 1];
  assert.ok(last <= monday8am + 21 * 86_400_000);
  // The window ends Monday 2026-12-07 at 08:00, before that day opens.
  assert.equal(zonedDateKey(last, NY), "2026-12-04");
});

check("buffer: a 10:00 to 10:30 meeting blocks 09:30 to 10:30", () => {
  const busy: Interval[] = [{ start: iso("2026-11-17T15:00:00Z"), end: iso("2026-11-17T15:30:00Z") }];
  const tuesday = generateSlots(monday8am, busy, rules)
    .filter((s) => zonedDateKey(s, NY) === "2026-11-17")
    .map((s) => `${zonedParts(s, NY).hour}:${String(zonedParts(s, NY).minute).padStart(2, "0")}`);
  assert.ok(tuesday.includes("9:00"));
  assert.ok(!tuesday.includes("9:30"));
  assert.ok(!tuesday.includes("10:00"));
  assert.ok(!tuesday.includes("10:30"));
  assert.ok(tuesday.includes("11:00"));
});

check("buffer of zero: back to back is allowed", () => {
  const busy: Interval[] = [{ start: iso("2026-11-17T15:00:00Z"), end: iso("2026-11-17T15:30:00Z") }];
  const r = { ...rules, bufferMinutes: 0 };
  assert.ok(isClear(iso("2026-11-17T14:30:00Z"), busy, r));
  assert.ok(isClear(iso("2026-11-17T15:30:00Z"), busy, r));
  assert.ok(!isClear(iso("2026-11-17T15:00:00Z"), busy, r));
});

check("daylight saving: 09:00 stays 09:00 across the change", () => {
  // Thursday 2026-10-29 12:00Z; New York leaves daylight time on 2026-11-01.
  const slots = generateSlots(iso("2026-10-29T12:00:00Z"), [], rules);
  assert.ok(slots.includes(iso("2026-10-30T13:00:00Z")), "Friday 09:00 EDT");
  assert.ok(slots.includes(iso("2026-11-02T14:00:00Z")), "Monday 09:00 EST");
  assert.ok(!slots.includes(iso("2026-11-02T13:00:00Z")), "no 08:00 EST slot");
});

check("visitor zone: the host's afternoon is the next morning in Tokyo", () => {
  const slots = generateSlots(monday8am, [], rules);
  const tue1630 = iso("2026-11-17T21:30:00Z");
  assert.ok(slots.includes(tue1630));
  assert.equal(zonedDateKey(tue1630, NY), "2026-11-17");
  assert.equal(zonedDateKey(tue1630, "Asia/Tokyo"), "2026-11-18");
});

check("empty window: everything busy yields no slots", () => {
  const busy: Interval[] = [{ start: monday8am - 86_400_000, end: monday8am + 30 * 86_400_000 }];
  assert.equal(generateSlots(monday8am, busy, rules).length, 0);
});

check("withoutInterval removes only the meeting being moved", () => {
  const own = { start: 1, end: 2 };
  const busy = [own, { start: 1, end: 2 }, { start: 5, end: 6 }];
  assert.equal(withoutInterval(busy, own).length, 2);
  assert.equal(withoutInterval(busy, { start: 9, end: 10 }).length, 3);
});

console.log("meet: manage links");

const secret = "x".repeat(40);
const id = "1763300000000-0a1b2c3d";

check("a token verifies and names its booking", () => {
  const r = verifyManageToken(createManageToken(id, secret), secret);
  assert.deepEqual(r, { ok: true, bookingId: id });
});

check("a tampered token or the wrong secret is refused", () => {
  const t = createManageToken(id, secret);
  assert.equal(verifyManageToken(t.replace(id, "1763300000000-ffffffff"), secret).ok, false);
  assert.equal(verifyManageToken(t, "y".repeat(40)).ok, false);
  assert.equal(verifyManageToken(`${t}x`, secret).ok, false);
  assert.equal(verifyManageToken("", secret).ok, false);
});

check("an expired token is refused as expired", () => {
  const t = createManageToken(id, secret, 0);
  assert.deepEqual(verifyManageToken(t, secret), { ok: false, reason: "expired" });
});

console.log(`\n${passed} checks passed.`);
