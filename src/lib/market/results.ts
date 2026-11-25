import { getTable } from "@/lib/market/tables";
import { invertedTime } from "@/lib/market/keys";
import { activityFromEntity } from "@/lib/market/activity";
import { getContact } from "@/lib/market/contacts";
import { isVisibleTo } from "@/lib/market/visibility";
import { loadContacts, visibleCampaigns } from "@/lib/market/queries";
import {
  getCampaign,
  listCampaigns,
  listMembers,
  markResults,
  saveDerived,
  MEMBER_STAGES,
  type Campaign,
  type Member,
  type MemberStage,
  type MemberStatus,
} from "@/lib/market/campaigns";
import type { Activity, ActivityType } from "@/lib/market/types";
import { engagedHits, type Hit } from "@/lib/market/engagement";

/**
 * Campaign results (FR-09, FR-10).
 *
 * A member's status is derived from the activity log: the furthest stage the
 * log shows them reaching, in the order sent, bounced, engaged, replied,
 * meeting. A manual override wins and is shown as such; a recompute never
 * touches it.
 *
 * Which activities count toward a member:
 *  - an activity tagged with this campaign (a brief read or Ask AI click
 *    through the member's code, or an import that names the campaign);
 *  - an untagged email or meeting with the contact from the campaign's start
 *    date (or the day the member was added, when there is no start date) to
 *    60 days after its end date. Mail sync does not know campaigns, so this
 *    window is how a sent email or a reply finds its campaign.
 * An activity tagged with a different campaign never counts.
 *
 * Engagement: brief reads and Ask AI clicks pass the link scanner filter
 * (engagement.ts, task 051) first; only the hits a person made count. A
 * LinkedIn lead tagged with the campaign counts without it.
 *
 * Statuses are stored on the member rows, so a page view reads one partition.
 * They are derived again after each mail sync (task 042 calls
 * recomputeAllCampaigns) and on a page view when the stored ones are older
 * than STALE_MS.
 */

export const STALE_MS = 15 * 60_000;
const AFTER_END_DAYS = 60;
// Point reads and partition queries are small; 32 at a time keeps a 500-member campaign well inside NFR-04.
const CONCURRENCY = 32;

const STAGE_OF: Partial<Record<ActivityType, MemberStage>> = {
  "email.sent": "sent",
  "email.bounced": "bounced",
  "brief.read": "engaged",
  "ask_ai.click": "engaged",
  // A Lead Gen Form submission tagged with the campaign (task 053).
  "linkedin.lead": "engaged",
  "email.received": "replied",
  "meeting.booked": "meeting",
  "meeting.rescheduled": "meeting",
  "meeting.in_person": "meeting",
  // A calendar meeting counts once it has taken place (phase 2 FR-08); booked, moved and canceled do not.
  "calendar.held": "meeting",
};

/** Untagged activities of these kinds count inside the campaign's window. */
const WINDOWED = new Set<ActivityType>([
  "email.sent",
  "email.bounced",
  "email.received",
  "meeting.booked",
  "meeting.rescheduled",
  "meeting.in_person",
  "calendar.held",
]);

const RANK: Record<MemberStage, number> = { sent: 1, bounced: 2, engaged: 3, replied: 4, meeting: 5 };

export type Derived = { status: MemberStatus; reached: MemberStage[]; lastActivityAt?: string };

/** The time range in which untagged email and meetings count toward a member. */
export function campaignWindow(
  campaign: Pick<Campaign, "startDate" | "endDate">,
  member: Pick<Member, "createdAt">,
): { from: string; to?: string } {
  const from = campaign.startDate ? `${campaign.startDate}T00:00:00.000Z` : member.createdAt;
  const to = campaign.endDate
    ? new Date(Date.parse(`${campaign.endDate}T23:59:59.999Z`) + AFTER_END_DAYS * 86_400_000).toISOString()
    : undefined;
  return { from, to };
}

/** The activities that count toward this member of this campaign. */
export function memberActivities(
  campaign: Pick<Campaign, "slug" | "startDate" | "endDate">,
  member: Pick<Member, "createdAt">,
  activities: readonly Activity[],
): Activity[] {
  const { from, to } = campaignWindow(campaign, member);
  return activities.filter((a) => {
    if (a.campaignSlug) return a.campaignSlug === campaign.slug;
    if (!WINDOWED.has(a.type)) return false;
    return a.occurredAt >= from && (!to || a.occurredAt <= to);
  });
}

/**
 * A member's derived status from the activities that count toward them
 * (FR-09): the furthest stage reached. The override is not applied here; see
 * effectiveStatus.
 */
export function deriveMemberStatus(_member: Pick<Member, "contactId">, activities: readonly Activity[]): Derived {
  const reached = new Set<MemberStage>();
  let last: string | undefined;
  for (const a of withoutScanners(activities)) {
    const stage = STAGE_OF[a.type];
    if (stage) reached.add(stage);
    if (!last || a.occurredAt > last) last = a.occurredAt;
  }
  let status: MemberStatus = "planned";
  for (const s of reached) if (status === "planned" || RANK[s] > RANK[status as MemberStage]) status = s;
  return { status, reached: MEMBER_STAGES.filter((s) => reached.has(s)), lastActivityAt: last };
}

const HIT_KIND: Partial<Record<ActivityType, Hit["kind"]>> = { "brief.read": "read", "ask_ai.click": "click" };

/**
 * The activities without the brief reads and Ask AI clicks the scanner filter
 * gives to machines. Hits before the member's first sent email are tests.
 */
export function withoutScanners(activities: readonly Activity[]): Activity[] {
  const hits: (Hit & { a: Activity })[] = [];
  let since: number | undefined;
  for (const a of activities) {
    const at = Date.parse(a.occurredAt);
    const kind = HIT_KIND[a.type];
    if (kind) hits.push({ kind, at, rewritten: a.codeRewritten, a });
    else if (a.type === "email.sent" && (since === undefined || at < since)) since = at;
  }
  if (!hits.length) return [...activities];
  const kept = new Set(engagedHits(hits, { since }).map((h) => (h as Hit & { a: Activity }).a));
  return activities.filter((a) => !HIT_KIND[a.type] || kept.has(a));
}

export function effectiveStatus(member: Pick<Member, "status" | "statusOverride">): MemberStatus {
  return member.statusOverride ?? member.status;
}

export type Funnel = {
  members: number;
  sent: number;
  delivered: number;
  engaged: number;
  replied: number;
  meeting: number;
};

/**
 * The funnel (FR-10). A member counts at each stage the log shows them
 * reaching. An override counts at its own stage too, and as sent unless it
 * is `planned`. Delivered is sent minus the members whose status is bounced.
 */
export function funnelOf(members: readonly Pick<Member, "status" | "statusOverride" | "reached">[]): Funnel {
  const f: Funnel = { members: members.length, sent: 0, delivered: 0, engaged: 0, replied: 0, meeting: 0 };
  for (const m of members) {
    const status = effectiveStatus(m);
    const at = (stage: MemberStage) => m.reached.includes(stage) || m.statusOverride === stage;
    const sent = at("sent") || (m.statusOverride !== undefined && m.statusOverride !== "planned");
    if (sent) f.sent += 1;
    if (sent && status !== "bounced") f.delivered += 1;
    if (at("engaged")) f.engaged += 1;
    if (at("replied")) f.replied += 1;
    if (at("meeting")) f.meeting += 1;
  }
  return f;
}

/** Run `fn` over `items`, at most `limit` at a time, keeping the order. */
export async function mapLimit<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
}

type ActivityEntity = Parameters<typeof activityFromEntity>[0];

/** A contact's activities from `fromIso` on (row keys are inverted time, so this is a range). */
async function activitiesSince(contactId: string, fromIso: string): Promise<Activity[]> {
  const table = await getTable("activities");
  if (!table) return [];
  const fromMs = Date.parse(fromIso);
  const parts = [`PartitionKey eq '${contactId}'`];
  // "." sorts after "-", so every row key for that millisecond and newer is included.
  if (Number.isFinite(fromMs)) parts.push(`RowKey lt '${invertedTime(fromMs)}.'`);
  const out: Activity[] = [];
  for await (const e of table.listEntities<ActivityEntity>({ queryOptions: { filter: parts.join(" and ") } })) {
    out.push(activityFromEntity(e));
  }
  return out;
}

function sameDerived(m: Member, d: Derived): boolean {
  return m.status === d.status && m.reached.join(",") === d.reached.join(",") && m.lastActivityAt === d.lastActivityAt;
}

export type RecomputeSummary = { members: number; changed: number };

/**
 * Derive every member's status again from the log, writing only the rows that
 * changed. Overrides are left alone. `only` limits it to some contacts (after
 * adding members).
 */
export async function recomputeCampaign(
  slug: string,
  opts: { now?: Date; only?: ReadonlySet<string> } = {},
): Promise<RecomputeSummary | null> {
  const campaign = await getCampaign(slug);
  if (!campaign) return null;
  const all = await listMembers(slug);
  const members = opts.only ? all.filter((m) => opts.only!.has(m.contactId)) : all;
  let changed = 0;
  await mapLimit(members, CONCURRENCY, async (m) => {
    const from = campaignWindow(campaign, m).from;
    const acts = await activitiesSince(m.contactId, from);
    const derived = deriveMemberStatus(m, memberActivities(campaign, m, acts));
    if (sameDerived(m, derived)) return;
    await saveDerived(slug, m.contactId, derived);
    changed += 1;
  });
  if (!opts.only) await markResults(slug, (opts.now ?? new Date()).toISOString());
  return { members: members.length, changed };
}

/** For the mail sync (task 042): derive every campaign's statuses after new mail is logged. */
export async function recomputeAllCampaigns(now = new Date()): Promise<RecomputeSummary> {
  const total: RecomputeSummary = { members: 0, changed: 0 };
  for (const c of await listCampaigns()) {
    const r = await recomputeCampaign(c.slug, { now });
    if (r) {
      total.members += r.members;
      total.changed += r.changed;
    }
  }
  return total;
}

export function isStale(campaign: Pick<Campaign, "resultsAt">, now = new Date()): boolean {
  if (!campaign.resultsAt) return true;
  const at = Date.parse(campaign.resultsAt);
  return !Number.isFinite(at) || now.getTime() - at > STALE_MS;
}

export type ResultRow = Member & {
  effective: MemberStatus;
  contactName?: string;
  contactEmail: string;
  contactVisibility: "general" | "investor";
};

export type CampaignResults = {
  campaign: Campaign;
  funnel: Funnel;
  rows: ResultRow[];
  groups: string[];
};

/**
 * One campaign's funnel and member rows (FR-10), for a user who may see the
 * campaign. Members whose contact the user may not see are left out of both
 * the rows and the counts (FR-02). Derives statuses first when the stored
 * ones are stale.
 */
export async function campaignResults(
  slug: string,
  roles: readonly string[],
  opts: { now?: Date; recompute?: boolean } = {},
): Promise<CampaignResults | null> {
  const now = opts.now ?? new Date();
  let campaign = await getCampaign(slug);
  if (!campaign || !isVisibleTo(campaign, roles)) return null;
  if (opts.recompute !== false && isStale(campaign, now)) {
    await recomputeCampaign(slug, { now });
    campaign = { ...campaign, resultsAt: now.toISOString() };
  }

  const members = await listMembers(slug);
  const contacts = await mapLimit(members, CONCURRENCY, (m) => getContact(m.contactId));
  const rows: ResultRow[] = [];
  members.forEach((m, i) => {
    const c = contacts[i];
    if (!c || !isVisibleTo(c, roles)) return;
    rows.push({
      ...m,
      effective: effectiveStatus(m),
      contactName: c.name,
      contactEmail: c.email,
      contactVisibility: c.visibility,
    });
  });
  rows.sort(
    (a, b) =>
      (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? "") ||
      (a.contactName ?? a.contactEmail).localeCompare(b.contactName ?? b.contactEmail),
  );
  const groups = [...new Set(rows.map((r) => r.group).filter((g): g is string => Boolean(g)))].sort();
  return { campaign, funnel: funnelOf(rows), rows, groups };
}

/**
 * Every campaign the user may see, with its funnel from the stored statuses,
 * for the list page. Members whose contact is hidden from the user are not
 * counted (FR-02).
 */
export async function campaignSummaries(
  roles: readonly string[],
): Promise<{ campaign: Campaign; funnel: Funnel }[]> {
  const [campaigns, contacts] = await Promise.all([visibleCampaigns(roles), loadContacts(roles)]);
  const visible = new Set(contacts.map((c) => c.id));
  return mapLimit(campaigns, CONCURRENCY, async (campaign) => ({
    campaign,
    funnel: funnelOf((await listMembers(campaign.slug)).filter((m) => visible.has(m.contactId))),
  }));
}

/** Rows filtered by status and group, for the table. */
export function filterResults(
  rows: readonly ResultRow[],
  q: { status?: MemberStatus; group?: string; q?: string },
): ResultRow[] {
  const words = (q.q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return rows.filter((r) => {
    if (q.status && r.effective !== q.status) return false;
    if (q.group && r.group !== q.group) return false;
    const hay = `${r.contactName ?? ""} ${r.contactEmail}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
