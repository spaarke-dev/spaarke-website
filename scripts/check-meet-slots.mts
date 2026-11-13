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

console.log("meet: reminders");

const { dueReminder } = await import("@/lib/meet/reminder-rules");
const H = 3_600_000;
const meetingAt = iso("2026-11-20T15:00:00Z");
const booking = {
  status: "booked" as const,
  start: at(meetingAt),
  createdAt: at(meetingAt - 5 * 24 * H),
  movedAt: undefined as string | undefined,
  reminder24hFor: undefined as string | undefined,
  reminder1hFor: undefined as string | undefined,
};
const kindAt = (b: typeof booking, now: number) => {
  const d = dueReminder(b, now);
  return d.send ? d.rule.kind : d.reason;
};

check("24-hour reminder is due from 24 hours before until 20", () => {
  assert.equal(kindAt(booking, meetingAt - 24 * H - 60_000), "none_due");
  assert.equal(kindAt(booking, meetingAt - 24 * H), "reminder24");
  assert.equal(kindAt(booking, meetingAt - 21 * H), "reminder24");
  assert.equal(kindAt(booking, meetingAt - 19 * H), "none_due");
});

check("1-hour reminder is due from 60 minutes before until 10", () => {
  assert.equal(kindAt(booking, meetingAt - 61 * 60_000), "none_due");
  assert.equal(kindAt(booking, meetingAt - 60 * 60_000), "reminder1");
  assert.equal(kindAt(booking, meetingAt - 11 * 60_000), "reminder1");
  assert.equal(kindAt(booking, meetingAt - 9 * 60_000), "none_due");
});

check("a reminder already sent for this start is not sent again", () => {
  const sent = { ...booking, reminder24hFor: booking.start };
  assert.equal(kindAt(sent, meetingAt - 23 * H), "already_sent");
});

check("a move re-arms the reminders for the new time", () => {
  const moved = { ...booking, reminder24hFor: at(meetingAt - 2 * 24 * H), movedAt: at(meetingAt - 3 * 24 * H) };
  assert.equal(kindAt(moved, meetingAt - 23 * H), "reminder24");
});

check("no 24-hour reminder for a meeting booked about 25 hours ahead", () => {
  const late = { ...booking, createdAt: at(meetingAt - 25 * H) };
  assert.equal(kindAt(late, meetingAt - 24 * H), "too_soon_after_booking");
  assert.equal(kindAt(late, meetingAt - 60 * 60_000), "reminder1");
});

check("cancelled and pending bookings get no reminders", () => {
  assert.equal(kindAt({ ...booking, status: "cancelled" } as never, meetingAt - 23 * H), "inactive");
  assert.equal(kindAt({ ...booking, status: "pending" } as never, meetingAt - 23 * H), "inactive");
});

console.log("meet: guests");

const { normalizeGuests } = await import("@/lib/meet/service");
const host = "host@example.test";

check("guests are trimmed, blanks and repeats dropped", () => {
  assert.deepEqual(normalizeGuests([" a@x.com ", "", "A@x.com", "b@y.org"], "me@z.com", host), {
    ok: true,
    guests: ["a@x.com", "b@y.org"],
  });
  assert.deepEqual(normalizeGuests(undefined, "me@z.com", host), { ok: true, guests: [] });
});

check("bad addresses, the booker, the host, and a sixth guest are refused", () => {
  assert.equal(normalizeGuests(["not-an-email"], "me@z.com", host).ok, false);
  assert.equal(normalizeGuests(["a@x.com\nBcc: c@d.com"], "me@z.com", host).ok, false);
  assert.equal(normalizeGuests(["ME@z.com"], "me@z.com", host).ok, false);
  assert.equal(normalizeGuests([host], "me@z.com", host).ok, false);
  assert.equal(normalizeGuests(["1@a.co", "2@a.co", "3@a.co", "4@a.co", "5@a.co", "6@a.co"], "me@z.com", host).ok, false);
  assert.equal(normalizeGuests("a@x.com", "me@z.com", host).ok, false);
});

console.log("meet: emails");

const { buildMeetingEmail } = await import("@/lib/meet/emails");
const sample = {
  start: meetingAt,
  durationMinutes: 30,
  timeZone: NY,
  joinUrl: "https://teams.microsoft.com/l/meetup-join/x",
  bookerName: "Jo <b>Doe</b>",
  guests: ["a@x.com"],
  manageUrl: "https://www.spaarke.com/meet/manage?t=abc",
};

check("booker emails carry the manage link; guest emails do not", () => {
  for (const kind of ["confirmation", "reminder24", "reminder1", "moved"] as const) {
    assert.ok(buildMeetingEmail(kind, "booker", sample).html.includes("manage?t=abc"), kind);
    assert.ok(!buildMeetingEmail(kind, "guest", sample).html.includes("manage?t=abc"), kind);
    assert.ok(!buildMeetingEmail(kind, "guest", sample).text.includes("manage?t=abc"), kind);
  }
});

check("visitor text is escaped and subjects stay on one line", () => {
  const e = buildMeetingEmail("reminder24", "guest", sample);
  assert.ok(!e.html.includes("<b>Doe</b>"));
  assert.ok(e.html.includes("&lt;b&gt;Doe&lt;/b&gt;"));
  assert.ok(!/[\r\n]/.test(buildMeetingEmail("confirmation", "booker", sample).subject));
});

check("times show in the reader's zone with its name", () => {
  const e = buildMeetingEmail("confirmation", "booker", sample);
  assert.match(e.subject, /Fri, Nov 20 at 10:00 AM EST/);
  assert.match(e.text, /10:00 AM to 10:30 AM EST/);
});

check("a cancelled email has no join link and offers a new time", () => {
  const e = buildMeetingEmail("cancelled", "booker", sample);
  assert.ok(!e.html.includes("meetup-join"));
  assert.ok(e.html.includes('/meet"'));
});

console.log(`\n${passed} checks passed.`);
