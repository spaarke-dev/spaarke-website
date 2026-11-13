import type { Interval } from "@/lib/meet/slots";

/**
 * An in-memory calendar and table for working on /meet without a tenant.
 *
 * On only when MEET_DEV_MOCK=1 and the server is `next dev`; a production
 * build ignores the setting, so it can never stand in for the real calendar.
 * graph.ts and store.ts hand their calls here when it is on. The fake
 * calendar starts with a few busy blocks so the picker shows gaps.
 */

export function devMockEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.MEET_DEV_MOCK === "1";
}

type MockEvent = Interval & { id: string; isCancelled: boolean; joinUrl: string; attendees: string[] };

type MockState = {
  events: Map<string, MockEvent>;
  fixedBusy: Interval[];
  tables: Map<string, Map<string, Record<string, unknown>>>;
};

const g = globalThis as unknown as { __meetDevMock?: MockState };

function state(): MockState {
  if (!g.__meetDevMock) {
    const day = 86_400_000;
    const base = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate());
    // Busy 15:00 to 16:00 UTC on alternate days, and a whole day off next week.
    const fixedBusy: Interval[] = [];
    for (let i = 1; i < 30; i += 2) fixedBusy.push({ start: base + i * day + 15 * 3_600_000, end: base + i * day + 16 * 3_600_000 });
    fixedBusy.push({ start: base + 8 * day, end: base + 9 * day });
    g.__meetDevMock = { events: new Map(), fixedBusy, tables: new Map() };
  }
  return g.__meetDevMock;
}

// Calendar -------------------------------------------------------------------

export function mockBusy(range: Interval): Interval[] {
  const s = state();
  const events = [...s.events.values()].filter((e) => !e.isCancelled);
  return [...s.fixedBusy, ...events].filter((b) => b.start < range.end && range.start < b.end).map((b) => ({ start: b.start, end: b.end }));
}

export function mockCreate(start: number, end: number, attendees: string[]): { id: string; joinUrl: string } {
  const id = `mock-${Math.random().toString(36).slice(2, 10)}`;
  const joinUrl = `https://teams.microsoft.com/l/meetup-join/${id}`;
  state().events.set(id, { id, start, end, isCancelled: false, joinUrl, attendees });
  return { id, joinUrl };
}

export function mockGet(id: string) {
  const e = state().events.get(id);
  return e ? { start: e.start, end: e.end, isCancelled: e.isCancelled, joinUrl: e.joinUrl } : null;
}

export function mockSetAttendees(id: string, attendees: string[]) {
  const e = state().events.get(id);
  if (e) e.attendees = attendees;
}

export function mockMove(id: string, start: number, end: number) {
  const e = state().events.get(id);
  if (e) Object.assign(e, { start, end });
}

export function mockCancel(id: string) {
  const e = state().events.get(id);
  if (e) e.isCancelled = true;
}

// Tables ---------------------------------------------------------------------

function table(name: string) {
  const s = state();
  let t = s.tables.get(name);
  if (!t) s.tables.set(name, (t = new Map()));
  return t;
}

// Each row carries an ETag that changes on every write, like Table Storage.
let etagCounter = 0;
const nextEtag = () => `mock-${++etagCounter}`;

export function mockInsert(name: string, key: string, row: Record<string, unknown>): boolean {
  const t = table(name);
  if (t.has(key)) return false;
  t.set(key, { ...row, etag: nextEtag() });
  return true;
}

export function mockList<T>(name: string): T[] {
  return [...table(name).values()].map((r) => ({ ...r }) as T);
}

/** Merges only when the row's ETag still matches; returns the new ETag or null. */
export function mockMergeIf(name: string, key: string, etag: string, patch: Record<string, unknown>): string | null {
  const t = table(name);
  const row = t.get(key);
  if (!row || row.etag !== etag) return null;
  const next = nextEtag();
  t.set(key, { ...row, ...patch, etag: next });
  return next;
}

export function mockRead<T>(name: string, key: string): T | null {
  return (table(name).get(key) as T | undefined) ?? null;
}

export function mockMerge(name: string, key: string, patch: Record<string, unknown>) {
  const t = table(name);
  t.set(key, { ...(t.get(key) ?? {}), ...patch, etag: nextEtag() });
}

export function mockDelete(name: string, key: string) {
  table(name).delete(key);
}
