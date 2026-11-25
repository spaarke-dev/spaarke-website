// Remove calendar entries that repeat a TLTF in-person meeting (projects/market-access-phase-2).
//
// Turning on "Read calendar" read the Summit week from the host's calendar and
// logged "Meeting booked" and "Meeting held" for contacts the TLTF import had
// already logged "Met in person" for, from an export of the same calendar. The
// sync now leaves such meetings alone; this removes the entries it wrote before
// that fix.
//
//   npm run market:calendar-dedupe            counts only, changes nothing
//   npm run market:calendar-dedupe -- --delete
//
// A calendar entry repeats a meeting when its contact has a `meeting.in_person`
// entry within two hours of the event's held time. The booked entry of the same
// event (same calendar UID, same contact) goes with it; a recurring series'
// booked entry stays, since it stands for the series' other dates too. Each entry is removed
// from the contact's timeline and the month index. Its idempotency marker and
// the calendar state row stay, so the sync never writes it again. Prints counts,
// never names or addresses. Needs STORAGE_ACCOUNT_CONNECTION (or STORAGE_CS).

// Loaded with import() as the other market scripts do: tsx gives these modules no named static exports here.
const { getTable } = await import("@/lib/market/tables");
const { CALENDAR_SOURCE } = await import("@/lib/market/calendar-sync");
const { SAME_MEETING_MS } = await import("@/lib/market/activity");

type Row = { partitionKey: string; rowKey: string; contactId: string; type: string; source: string; sourceId: string; occurredAt: string };

const del = process.argv.includes("--delete");
const unknown = process.argv.slice(2).filter((a) => a !== "--delete");
if (unknown.length) throw new Error(`Unexpected argument: ${unknown.join(" ")}. Usage: npm run market:calendar-dedupe [-- --delete]`);

const activities = await getTable("activities");
const byMonth = await getTable("activityByMonth");
if (!activities || !byMonth) throw new Error("Storage is not configured (STORAGE_ACCOUNT_CONNECTION).");

// Calendar and in-person entries come from the month index, then are checked against the timeline.
const calendar: Row[] = [];
const inPerson: Row[] = [];
for await (const e of byMonth.listEntities<Row>({
  queryOptions: {
    filter: `source eq '${CALENDAR_SOURCE}' or type eq 'meeting.in_person'`,
    select: ["PartitionKey", "RowKey", "contactId", "type", "source", "sourceId", "occurredAt"],
  },
})) {
  if (e.source === CALENDAR_SOURCE) calendar.push(e);
  else if (e.type === "meeting.in_person") inPerson.push(e);
}

const metAt = new Map<string, number[]>();
for (const m of inPerson) metAt.set(m.contactId, [...(metAt.get(m.contactId) ?? []), Date.parse(m.occurredAt)]);
const near = (contactId: string, iso: string) => (metAt.get(contactId) ?? []).some((t) => Math.abs(t - Date.parse(iso)) <= SAME_MEETING_MS);

// The event key of an entry: its source ID without the kind and the contact part.
const eventOf = (sourceId: string) => sourceId.split(":").slice(1, -1).join(":");

const repeatedEvents = new Set<string>();
for (const c of calendar) if (c.type === "calendar.held" && near(c.contactId, c.occurredAt)) repeatedEvents.add(`${c.contactId}|${eventOf(c.sourceId)}`);
const doomed = calendar.filter((c) => repeatedEvents.has(`${c.contactId}|${eventOf(c.sourceId)}`) || (c.type === "calendar.held" && near(c.contactId, c.occurredAt)));

const count = (rows: Row[], type: string) => rows.filter((r) => r.type === type).length;
console.log(`Calendar entries: ${calendar.length}; in-person entries: ${inPerson.length}.`);
console.log(
  `Repeating an in-person meeting: ${doomed.length} entries (held ${count(doomed, "calendar.held")}, booked ${count(doomed, "calendar.booked")}, other ${doomed.length - count(doomed, "calendar.held") - count(doomed, "calendar.booked")}) for ${new Set(doomed.map((d) => d.contactId)).size} contacts.`,
);

if (!del) {
  console.log("Counts only. Run with --delete to remove them.");
  process.exit(0);
}

let removed = 0;
let missing = 0;
for (const d of doomed) {
  try {
    await activities.deleteEntity(d.contactId, d.rowKey);
    removed++;
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode !== 404) throw err;
    missing++;
  }
  try {
    await byMonth.deleteEntity(d.partitionKey, d.rowKey);
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode !== 404) throw err;
  }
}
console.log(`Removed ${removed} entries${missing ? `; ${missing} were already gone from the timeline` : ""}.`);
