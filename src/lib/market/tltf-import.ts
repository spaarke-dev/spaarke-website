import { emailHash, normalizeEmail, sha256 } from "@/lib/market/keys";
import { isMemberCode } from "@/lib/market/campaigns";
import type { ParsedCsv } from "@/lib/market/csv";
import type { ActivityInput } from "@/lib/market/activity";
import type { ContactHints } from "@/lib/market/types";

/**
 * The TLTF Summit 2026 import (FR-12, task 050), pure part: read the private
 * outreach list, brief keys, Summit people and calendar export, and turn them
 * into a plan of contacts, members and activities. No storage and no file
 * system here; `scripts/market/import-tltf.mts` reads the files and
 * `tltf-run.ts` writes the plan.
 *
 * Every activity has source `tltf-import` and a source ID built from the
 * outreach code or the calendar event, so a second run adds nothing.
 *
 * Summit meetings (open question 2, answered 2026-11-23): every meeting in the
 * calendar export is imported as held. Ralph corrects the ones that did not
 * happen with the member status override on the campaign page.
 */

export const TLTF_SOURCE = "tltf-import";
export const TLTF_SLUG = "tltf-2026";
export const TLTF_CAMPAIGN = {
  slug: TLTF_SLUG,
  name: "TLTF Summit 2026",
  kind: "outreach" as const,
  utmCampaign: "tltf-2026",
  visibility: "investor" as const,
};
/** The outreach code prefix on tracked links (`src=tltf-<code>`) and the brief label prefix. */
const CODE_PREFIX = "tltf-";
const LABEL_PREFIX = "tltf-2026:";
/** Addresses at this domain are Spaarke people, never contacts. */
const OWN_DOMAIN = "spaarke.com";
/** The send went out in the evening, US Eastern; the list records the date only. */
const SEND_HOUR = "21:00:00";
const SEND_ZONE = "America/New_York";

export type ImportIssue = { where: string; reason: string };

// ---------------------------------------------------------------------------
// Column mappings: the files are read at run time, so the columns are found by
// name and printed before anything is written.

export const OUTREACH_FIELDS = ["file", "group", "template", "to", "status", "result", "reply"] as const;
export type OutreachField = (typeof OUTREACH_FIELDS)[number];
export type OutreachMapping = Record<OutreachField, number>;

export const BRIEF_KEY_FIELDS = ["code", "key"] as const;
export type BriefKeyMapping = Record<(typeof BRIEF_KEY_FIELDS)[number], number>;

/** The index of each required column, matched by name without case. Throws naming the missing ones. */
export function columnMapping<F extends string>(headers: readonly string[], fields: readonly F[]): Record<F, number> {
  const norm = headers.map((h) => h.trim().toLowerCase());
  const out = {} as Record<F, number>;
  const missing: string[] = [];
  for (const f of fields) {
    const i = norm.indexOf(f);
    if (i < 0) missing.push(f);
    else out[f] = i;
  }
  if (missing.length) throw new Error(`Missing columns: ${missing.join(", ")} (found: ${headers.join(", ")})`);
  return out;
}

// ---------------------------------------------------------------------------
// Time: the calendar export uses Windows zone names.

const WINDOWS_ZONES: Record<string, string> = {
  "eastern standard time": "America/New_York",
  "central standard time": "America/Chicago",
  "mountain standard time": "America/Denver",
  "pacific standard time": "America/Los_Angeles",
  "gmt standard time": "Europe/London",
  utc: "UTC",
};

export function ianaZone(zone: string): string {
  const mapped = WINDOWS_ZONES[zone.trim().toLowerCase()] ?? zone.trim();
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: mapped });
  } catch {
    throw new Error(`Unknown time zone: ${zone}`);
  }
  return mapped;
}

function offsetMs(utcMs: number, zone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second")) - utcMs;
}

/** A wall-clock time ("2026-11-17T10:00:00.0000000") in a zone, as an ISO instant. */
export function zonedToIso(local: string, zone: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(local.trim());
  if (!m) throw new Error(`Not a date and time: ${local}`);
  const iana = ianaZone(zone);
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
  let utc = wall - offsetMs(wall, iana);
  // A second pass settles a guess that landed on the other side of a DST change.
  utc = wall - offsetMs(utc, iana);
  return new Date(utc).toISOString();
}

// ---------------------------------------------------------------------------
// Summit people: hints and context notes for contacts.

export type PersonHint = {
  /** Substrings matched against an attendee's address, or the meeting subject. */
  match: string[];
  name?: string;
  title?: string;
  org?: string;
  linkedin?: string;
  phone?: string;
  context?: string;
};

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export function parsePeople(data: unknown): PersonHint[] {
  if (!Array.isArray(data)) throw new Error("people.json: expected a list");
  return data.map((p, i) => {
    const o = (p ?? {}) as Record<string, unknown>;
    const match = Array.isArray(o.match) ? o.match.map(str).filter((s): s is string => Boolean(s)) : [];
    if (!match.length) throw new Error(`people.json entry ${i + 1}: no match strings`);
    return {
      match: match.map((s) => s.toLowerCase()),
      name: str(o.name),
      title: str(o.title),
      org: str(o.org),
      linkedin: str(o.linkedin),
      phone: str(o.phone),
      context: str(o.context),
    };
  });
}

/** The person whose match string is in the address. */
export function personByEmail(email: string, people: readonly PersonHint[]): PersonHint | undefined {
  return people.find((p) => p.match.some((s) => email.includes(s)));
}

function hintsOf(p: PersonHint | undefined): ContactHints {
  if (!p) return {};
  return { name: p.name, title: p.title, organizationName: p.org, linkedinUrl: p.linkedin, phone: p.phone };
}

/** Fill hints that are still empty from a second source. */
function merge(a: ContactHints, b: ContactHints): ContactHints {
  const out: ContactHints = { ...a };
  for (const [k, v] of Object.entries(b) as [keyof ContactHints, string][]) {
    if (v && !out[k]) (out as Record<string, string>)[k] = v;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Outreach list.

export type OutreachEntry = {
  line: number;
  code: string;
  email: string;
  hints: ContactHints;
  group?: string;
  template?: string;
  briefKey?: string;
  sentAt: string;
  bounce?: string;
  reply?: string;
  person?: PersonHint;
};

const FILE_RE = /^(\S+)\s+(.+?)\s*(?:\((.+)\))?\.eml$/i;
const SENT_RE = /^sent\s+(\d{4}-\d{2}-\d{2})\b/i;
const ISO_DATE_RE = /\b(\d{4}-\d{2}-\d{2})\b/;

export function parseBriefKeys(csv: ParsedCsv): Map<string, string> {
  const m = columnMapping(csv.headers, BRIEF_KEY_FIELDS);
  const out = new Map<string, string>();
  for (const r of csv.rows) {
    const code = r[m.code]?.trim();
    const key = r[m.key]?.trim();
    if (code && key) out.set(code, key);
  }
  return out;
}

export type OutreachParse = { entries: OutreachEntry[]; notSent: number; autoReplies: number; issues: ImportIssue[] };

export function parseOutreach(
  csv: ParsedCsv,
  briefKeys: ReadonlyMap<string, string>,
  people: readonly PersonHint[],
): OutreachParse {
  const m = columnMapping(csv.headers, OUTREACH_FIELDS);
  const entries: OutreachEntry[] = [];
  const issues: ImportIssue[] = [];
  const seen = new Set<string>();
  let notSent = 0;
  let autoReplies = 0;

  csv.rows.forEach((r, i) => {
    const where = `outreach line ${csv.lines[i]}`;
    const cell = (f: OutreachField) => (r[m[f]] ?? "").trim();
    const file = FILE_RE.exec(cell("file"));
    if (!file) return issues.push({ where, reason: "file name is not '<code> <name> (<firm>).eml' or '<code> <firm>.eml'" });
    const code = file[1];
    if (!isMemberCode(`${CODE_PREFIX}${code}`)) return issues.push({ where, reason: "code is not a safe key" });
    const sent = SENT_RE.exec(cell("status"));
    if (!sent) {
      notSent += 1;
      return;
    }
    const email = normalizeEmail(cell("to"));
    if (!email) return issues.push({ where, reason: "no single email address" });
    if (seen.has(code)) return issues.push({ where, reason: "code repeated" });
    seen.add(code);

    const result = cell("result");
    const bounce = /^bounced\b/i.test(result) ? result.replace(/^bounced\s*:?\s*/i, "").trim() || "bounced" : undefined;
    if (result && !bounce) autoReplies += 1;
    const group = cell("group");
    const person = personByEmail(email, people);
    const briefKey = briefKeys.get(code);
    if (!briefKey) issues.push({ where, reason: "no brief key for this code; member added without one" });

    entries.push({
      line: csv.lines[i],
      code,
      email,
      // "<code> <name> (<firm>).eml" for a person; "<code> <firm>.eml" for a firm's general inbox.
      hints: merge(
        file[3] ? { name: file[2], organizationName: file[3], kind: "investor" } : { organizationName: file[2], kind: "investor" },
        hintsOf(person),
      ),
      group: group ? (/^\d+$/.test(group) ? `G${group}` : group) : undefined,
      template: cell("template") || undefined,
      briefKey,
      sentAt: zonedToIso(`${sent[1]}T${SEND_HOUR}`, SEND_ZONE),
      bounce,
      reply: cell("reply") || undefined,
      person,
    });
  });
  return { entries, notSent, autoReplies, issues };
}

// ---------------------------------------------------------------------------
// Calendar export.

export type MeetingEntry = {
  /** Stable per event: its start and subject. */
  key: string;
  subject: string;
  start: string;
  /** Outside attendees, normalized. */
  attendees: string[];
};

export type CalendarParse = { meetings: MeetingEntry[]; cancelled: number; internalOnly: number; issues: ImportIssue[] };

export function parseCalendar(data: unknown): CalendarParse {
  if (!Array.isArray(data)) throw new Error("calendar export: expected a list of events");
  const meetings: MeetingEntry[] = [];
  const issues: ImportIssue[] = [];
  let cancelled = 0;
  let internalOnly = 0;
  data.forEach((raw, i) => {
    const where = `calendar event ${i + 1}`;
    const e = (raw ?? {}) as Record<string, unknown>;
    if (e.isCancelled === true) {
      cancelled += 1;
      return;
    }
    const start = (e.start ?? {}) as Record<string, unknown>;
    const dateTime = str(start.dateTime);
    const zone = str(start.timeZone) ?? "UTC";
    if (!dateTime) return issues.push({ where, reason: "no start time" });
    let iso: string;
    try {
      iso = zonedToIso(dateTime, zone);
    } catch (err) {
      return issues.push({ where, reason: (err as Error).message });
    }
    const list = Array.isArray(e.attendees) ? e.attendees : [];
    const attendees = [
      ...new Set(
        list
          .map((a) => normalizeEmail(typeof a === "string" ? a : (a as { email?: unknown })?.email))
          .filter((a): a is string => Boolean(a) && !a!.endsWith(`@${OWN_DOMAIN}`)),
      ),
    ];
    if (!attendees.length) {
      internalOnly += 1;
      return;
    }
    const subject = str(e.subject) ?? "Meeting";
    meetings.push({ key: sha256(`${dateTime}|${subject}`).slice(0, 16), subject, start: iso, attendees });
  });
  return { meetings, cancelled, internalOnly, issues };
}

// ---------------------------------------------------------------------------
// The plan.

export type PlannedMember = {
  email: string;
  hints: ContactHints;
  code?: string;
  briefKey?: string;
  briefLabel?: string;
  group?: string;
  templateLabel?: string;
};

export type ImportPlan = {
  /** One per contact, outreach first, so a Summit-only person is added as a Summit member. */
  members: PlannedMember[];
  /** Activity inputs without the contact: `email` finds the contact. */
  activities: ActivityInput[];
  /** The campaign's dates (US Eastern): the send to the last Summit meeting. */
  window?: { startDate: string; endDate: string };
  counts: {
    outreachRows: number;
    sent: number;
    bounced: number;
    replies: number;
    autoReplies: number;
    notSent: number;
    missingBriefKeys: number;
    meetings: number;
    meetingActivities: number;
    summitOnly: number;
    summitAlsoOutreach: number;
    peopleMatched: number;
    contextNotes: number;
    contextShortened: number;
  };
  issues: ImportIssue[];
};

const NOTE_MAX = 280;
const idOf = (email: string) => emailHash(email).slice(0, 16);

/** The calendar date of an instant in US Eastern, as YYYY-MM-DD. */
export function localDate(iso: string, zone = SEND_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(iso),
  );
}

export function buildPlan(
  outreach: OutreachParse,
  calendar: CalendarParse,
  people: readonly PersonHint[],
  outreachRows: number,
): ImportPlan {
  const members = new Map<string, PlannedMember>();
  const activities: ActivityInput[] = [];
  const matched = new Map<string, PersonHint>();
  const firstSeen = new Map<string, string>();
  const base = { source: TLTF_SOURCE, visibility: TLTF_CAMPAIGN.visibility, campaignSlug: TLTF_SLUG } as const;

  let bounced = 0;
  let replies = 0;
  for (const e of outreach.entries) {
    members.set(e.email, {
      email: e.email,
      hints: e.hints,
      code: `${CODE_PREFIX}${e.code}`,
      briefKey: e.briefKey,
      briefLabel: `${LABEL_PREFIX}${e.code}`,
      group: e.group,
      templateLabel: e.template ? `Template ${e.template}` : undefined,
    });
    if (e.person) matched.set(e.email, e.person);
    firstSeen.set(e.email, e.sentAt);
    const sentMs = Date.parse(e.sentAt);
    activities.push({
      ...base,
      type: "email.sent",
      sourceId: `sent:${e.code}`,
      occurredAt: e.sentAt,
      email: e.email,
      contactHints: e.hints,
      summary: `TLTF Summit outreach email sent${e.template ? ` (template ${e.template})` : ""}`,
    });
    if (e.bounce) {
      bounced += 1;
      activities.push({
        ...base,
        type: "email.bounced",
        sourceId: `bounced:${e.code}`,
        occurredAt: new Date(sentMs + 5 * 60_000).toISOString(),
        email: e.email,
        summary: `Bounced: ${e.bounce}`,
      });
    }
    if (e.reply) {
      replies += 1;
      const date = ISO_DATE_RE.exec(e.reply)?.[1];
      const at = date && Date.parse(date) >= sentMs ? zonedToIso(`${date}T12:00:00`, SEND_ZONE) : new Date(sentMs + 3_600_000).toISOString();
      activities.push({
        ...base,
        type: "email.received",
        sourceId: `reply:${e.code}`,
        occurredAt: at,
        email: e.email,
        summary: `Reply, from the outreach list${date ? "" : " (date not recorded)"}: ${e.reply}`,
      });
    }
  }

  let meetingActivities = 0;
  let summitOnly = 0;
  let summitAlsoOutreach = 0;
  const countedSummit = new Set<string>();
  for (const mtg of calendar.meetings) {
    // A person matched only by the subject can be placed when the meeting has one outside attendee.
    const bySubject =
      mtg.attendees.length === 1 ? people.find((p) => p.match.some((s) => mtg.subject.toLowerCase().includes(s))) : undefined;
    for (const email of mtg.attendees) {
      const person = personByEmail(email, people) ?? bySubject;
      if (person && !matched.has(email)) matched.set(email, person);
      if (!countedSummit.has(email)) {
        countedSummit.add(email);
        if (members.has(email)) summitAlsoOutreach += 1;
        else summitOnly += 1;
      }
      if (!members.has(email)) members.set(email, { email, hints: hintsOf(person), group: "Summit" });
      if (!firstSeen.has(email) || mtg.start < firstSeen.get(email)!) firstSeen.set(email, mtg.start);
      meetingActivities += 1;
      activities.push({
        ...base,
        type: "meeting.in_person",
        sourceId: `meeting:${mtg.key}:${idOf(email)}`,
        occurredAt: mtg.start,
        email,
        contactHints: members.get(email)!.hints,
        subject: mtg.subject,
        summary: "TLTF Summit meeting, imported from the calendar",
      });
    }
  }

  // Context notes from the Summit people file, dated with the first outreach or meeting.
  let contextNotes = 0;
  let contextShortened = 0;
  for (const [email, person] of matched) {
    if (!person.context) continue;
    contextNotes += 1;
    if (person.context.length > NOTE_MAX) contextShortened += 1;
    activities.push({
      ...base,
      type: "note",
      sourceId: `context:${idOf(email)}`,
      occurredAt: new Date(Date.parse(firstSeen.get(email)!) - 60_000).toISOString(),
      email,
      summary: person.context,
    });
  }

  const times = [...firstSeen.values(), ...calendar.meetings.map((m) => m.start)].sort();
  return {
    members: [...members.values()],
    activities,
    window: times.length ? { startDate: localDate(times[0]), endDate: localDate(times[times.length - 1]) } : undefined,
    counts: {
      outreachRows,
      sent: outreach.entries.length,
      bounced,
      replies,
      autoReplies: outreach.autoReplies,
      notSent: outreach.notSent,
      missingBriefKeys: outreach.entries.filter((e) => !e.briefKey).length,
      meetings: calendar.meetings.length,
      meetingActivities,
      summitOnly,
      summitAlsoOutreach,
      peopleMatched: matched.size,
      contextNotes,
      contextShortened,
    },
    issues: [...outreach.issues, ...calendar.issues],
  };
}
