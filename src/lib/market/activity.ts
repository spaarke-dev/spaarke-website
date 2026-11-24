import { getTable, statusOf } from "@/lib/market/tables";
import { hashPartition, invertedTime, monthKey, sha256 } from "@/lib/market/keys";
import { getContact, resolveContact, touchLastActivity } from "@/lib/market/contacts";
import { findMemberByBriefLabel, findMemberByCode, type MemberRef } from "@/lib/market/campaigns";
import { trackEvent } from "@/lib/logger";
import type { Activity, ActivityType, ContactHints, Utm, Visibility } from "@/lib/market/types";
import { isActivityType } from "@/lib/market/types";

/**
 * The activity log (FR-05): an append-only list of dated activities on a
 * contact, written exactly once per source event.
 *
 *   MaActivities       partition: contact ID   row key: inverted time + hash slice
 *                      partition: idem-hh      row key: idempotency hash -> where it was written
 *   MaActivityByMonth  partition: yyyy-mm      row key: same as the activity row key
 *
 * The idempotency marker is written last. If a write is cut off part way, a
 * retry finds no marker, tries the activity again (the deterministic row key
 * turns that into a 409, not a second row) and then writes the marker.
 */

export const SUMMARY_MAX = 280;
const SUBJECT_MAX = 300;

export type ActivityInput = {
  type: ActivityType;
  /** Where the event came from, for example the source table or `graph:<mailbox>`. */
  source: string;
  /** The event's ID in that source. With `source`, the idempotency key. */
  sourceId: string;
  occurredAt: Date | string | number;
  /** Either an email (the contact is found or created) or a known contact ID. */
  email?: string;
  contactId?: string;
  contactHints?: ContactHints;
  /** Visibility for a contact this creates, and for the activity itself. */
  visibility?: Visibility;
  campaignSlug?: string;
  memberId?: string;
  /**
   * A recipient code (the `src` on a tracked link) or brief label. When it
   * resolves to a campaign member, the activity carries the campaign and
   * member links, and an input without an email or contact ID uses the
   * member's contact (FR-06).
   */
  memberCode?: string;
  briefLabel?: string;
  utm?: Utm;
  summary?: string;
  subject?: string;
  webLink?: string;
  mailbox?: string;
};

export type RecordResult =
  | { status: "recorded"; contactId: string; activityId: string }
  | { status: "duplicate"; contactId: string; activityId: string }
  | { status: "skipped"; reason: "unavailable" | "invalid" | "tombstoned" | "no_contact" };

type ActivityEntity = {
  partitionKey: string;
  rowKey: string;
  contactId: string;
  type: ActivityType;
  source: string;
  sourceId: string;
  occurredAt: string;
  recordedAt: string;
  visibility: Visibility;
  campaignSlug?: string;
  memberId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  summary?: string;
  subject?: string;
  webLink?: string;
  mailbox?: string;
  codeRewritten?: boolean;
};

type MarkerEntity = { partitionKey: string; rowKey: string; contactId: string; activityId: string };

export function idempotencyKey(source: string, sourceId: string): string {
  return sha256(`${source}:${sourceId}`);
}

function toMs(value: Date | string | number): number {
  const ms = value instanceof Date ? value.getTime() : typeof value === "number" ? value : Date.parse(value);
  if (!Number.isFinite(ms)) throw new Error("occurredAt is not a valid time");
  return ms;
}

function trimTo(value: string | undefined, max: number): string | undefined {
  const v = value?.replace(/\s+/g, " ").trim();
  if (!v) return undefined;
  return v.length > max ? `${v.slice(0, max - 3)}...` : v;
}

function trimUtm(value: string | undefined): string | undefined {
  return trimTo(value, 100);
}

function markerKeys(hash: string) {
  return { partitionKey: `idem-${hashPartition(hash)}`, rowKey: hash };
}

/** Whether an event from this source is already in the log (an import's preview). */
export async function hasActivity(source: string, sourceId: string): Promise<boolean> {
  const activities = await getTable("activities");
  if (!activities) return false;
  const mk = markerKeys(idempotencyKey(source, sourceId));
  try {
    await activities.getEntity<MarkerEntity>(mk.partitionKey, mk.rowKey);
    return true;
  } catch (err) {
    if (statusOf(err) === 404) return false;
    throw err;
  }
}

/**
 * Append one activity, once. Throws on storage errors; public routes call
 * recordActivitySafe instead.
 */
export async function recordActivity(input: ActivityInput): Promise<RecordResult> {
  // No email bodies, ever (FR-05). The type has no such field; this stops a
  // caller that spreads a larger object into the input.
  if ("body" in (input as Record<string, unknown>)) throw new Error("Activities never store a body");
  if (!isActivityType(input.type)) throw new Error(`Unknown activity type: ${String(input.type)}`);
  if (!input.source || !input.sourceId) throw new Error("source and sourceId are required");

  const activities = await getTable("activities");
  const byMonth = await getTable("activityByMonth");
  if (!activities || !byMonth) return { status: "skipped", reason: "unavailable" };

  const hash = idempotencyKey(input.source, input.sourceId);
  const mk = markerKeys(hash);
  try {
    const m = await activities.getEntity<MarkerEntity>(mk.partitionKey, mk.rowKey);
    return { status: "duplicate", contactId: m.contactId, activityId: m.activityId };
  } catch (err) {
    if (statusOf(err) !== 404) throw err;
  }

  const occurredMs = toMs(input.occurredAt);
  const occurredAt = new Date(occurredMs).toISOString();
  let visibility: Visibility = input.visibility ?? "general";

  // Brief reads and Ask AI clicks carry no email: the code or label finds the member.
  let member: MemberRef | null = null;
  if (input.memberCode) member = await findMemberByCode(input.memberCode);
  // A code that matches nobody while the brief key finds the member: a mail gateway rewrote the link (task 051).
  const codeRewritten = Boolean(input.memberCode && !member && input.briefLabel);
  if (!member && input.briefLabel) member = await findMemberByBriefLabel(input.briefLabel);

  let contactId = input.contactId ?? (input.email ? undefined : member?.contactId);
  if (contactId) {
    const c = await getContact(contactId);
    if (!c) return { status: "skipped", reason: "no_contact" };
    if (c.visibility === "investor") visibility = "investor";
  } else if (input.email) {
    const r = await resolveContact(
      { email: input.email, ...input.contactHints },
      { visibility, source: input.type, now: new Date() },
    );
    if (r.status === "invalid" || r.status === "tombstoned" || r.status === "unavailable") {
      return { status: "skipped", reason: r.status };
    }
    contactId = r.contact.id;
    // An activity on an investor contact is an investor record too (FR-02).
    if (r.contact.visibility === "investor") visibility = "investor";
  } else {
    return { status: "skipped", reason: "no_contact" };
  }

  // Links come from the member only when it is this contact's membership; a
  // shared brief label links the campaign alone.
  let campaignSlug = input.campaignSlug;
  let memberId = input.memberId;
  if (member && (!member.contactId || member.contactId === contactId)) {
    campaignSlug = campaignSlug ?? member.campaignSlug;
    // A member's ID is its contact ID within the campaign (MaMembers row key).
    if (member.contactId) memberId = memberId ?? member.contactId;
  }

  const activityId = `${invertedTime(occurredMs)}-${hash.slice(0, 12)}`;
  const entity: ActivityEntity = {
    partitionKey: contactId,
    rowKey: activityId,
    contactId,
    type: input.type,
    source: trimTo(input.source, 100)!,
    sourceId: trimTo(input.sourceId, 200)!,
    occurredAt,
    recordedAt: new Date().toISOString(),
    visibility,
    campaignSlug: trimTo(campaignSlug, 100),
    memberId: trimTo(memberId, 100),
    utmSource: trimUtm(input.utm?.source),
    utmMedium: trimUtm(input.utm?.medium),
    utmCampaign: trimUtm(input.utm?.campaign),
    utmTerm: trimUtm(input.utm?.term),
    utmContent: trimUtm(input.utm?.content),
    summary: trimTo(input.summary, SUMMARY_MAX),
    subject: trimTo(input.subject, SUBJECT_MAX),
    webLink: trimTo(input.webLink, 2000),
    mailbox: trimTo(input.mailbox, 200),
    codeRewritten: codeRewritten && member ? true : undefined,
  };
  const row = stripUndefined(entity);

  try {
    await activities.createEntity(row);
  } catch (err) {
    // 409: a previous attempt wrote the row but not the marker.
    if (statusOf(err) !== 409) throw err;
  }
  await byMonth.upsertEntity({ ...row, partitionKey: monthKey(occurredMs) }, "Replace");
  await touchLastActivity(contactId, occurredAt);
  await activities.upsertEntity<MarkerEntity>({ ...mk, contactId, activityId }, "Replace");

  return { status: "recorded", contactId, activityId };
}

const DEFAULT_TIMEOUT_MS = 1500;

function timeoutMs(): number {
  const n = Number(process.env.MA_ACTIVITY_TIMEOUT_MS);
  return Number.isFinite(n) && n >= 100 && n <= 10_000 ? n : DEFAULT_TIMEOUT_MS;
}

export type SafeResult = RecordResult | { status: "failed"; reason: "timeout" | "error" };

/**
 * recordActivity for public routes (FR-06, NFR-03). Awaited, but raced against
 * a timeout and never throws, so a visitor's request is never failed and never
 * held up for long by the log.
 *
 * Awaited rather than left running after the response: on Static Web Apps'
 * managed functions a promise that outlives the response can be frozen, and
 * the write would be lost without a trace.
 */
export async function recordActivitySafe(input: ActivityInput, limitMs = timeoutMs()): Promise<SafeResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<SafeResult>((resolve) => {
    timer = setTimeout(() => resolve({ status: "failed", reason: "timeout" }), limitMs);
  });
  const work: Promise<SafeResult> = recordActivity(input).catch((err: unknown) => {
    console.warn(`[market] recordActivity failed for ${input.type} from ${input.source}:`, (err as Error)?.message);
    return { status: "failed", reason: "error" } as const;
  });

  const result = await Promise.race([work, timeout]);
  clearTimeout(timer);
  if (result.status === "failed") {
    // Never the email or the source ID: only what kind of write failed and why.
    try {
      trackEvent("market.activity_failed", { type: input.type, source: input.source, reason: result.reason });
    } catch {
      // Telemetry must not turn a swallowed failure into a thrown one.
    }
  }
  return result;
}

/** Shape an activity row for readers. */
export function activityFromEntity(e: ActivityEntity): Activity {
  const utm: Utm = {
    source: e.utmSource,
    medium: e.utmMedium,
    campaign: e.utmCampaign,
    term: e.utmTerm,
    content: e.utmContent,
  };
  const hasUtm = Object.values(utm).some(Boolean);
  return {
    id: e.rowKey,
    contactId: e.contactId,
    type: e.type,
    source: e.source,
    sourceId: e.sourceId,
    occurredAt: e.occurredAt,
    recordedAt: e.recordedAt,
    visibility: e.visibility,
    campaignSlug: e.campaignSlug,
    memberId: e.memberId,
    utm: hasUtm ? utm : undefined,
    summary: e.summary,
    subject: e.subject,
    webLink: e.webLink,
    mailbox: e.mailbox,
    codeRewritten: e.codeRewritten === true ? true : undefined,
  };
}

/** A contact's timeline, newest first. */
export async function listContactActivities(contactId: string, max = 100): Promise<Activity[]> {
  const table = await getTable("activities");
  if (!table || !/^[0-9a-f]{64}$/.test(contactId)) return [];
  const out: Activity[] = [];
  const pages = table.listEntities<ActivityEntity>({
    queryOptions: { filter: `PartitionKey eq '${contactId}'` },
  });
  for await (const e of pages) {
    out.push(activityFromEntity(e));
    if (out.length >= max) break;
  }
  return out;
}

/** Activities recorded in one month, newest first (the recent-activity views). */
export async function listActivitiesInMonth(month: string, max = 200): Promise<Activity[]> {
  const table = await getTable("activityByMonth");
  if (!table || !/^\d{4}-\d{2}$/.test(month)) return [];
  const out: Activity[] = [];
  const pages = table.listEntities<ActivityEntity>({
    queryOptions: { filter: `PartitionKey eq '${month}'` },
  });
  for await (const e of pages) {
    out.push(activityFromEntity(e));
    if (out.length >= max) break;
  }
  return out;
}

function stripUndefined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}
