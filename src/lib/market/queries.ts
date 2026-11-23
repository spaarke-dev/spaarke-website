import { getTable } from "@/lib/market/tables";
import { activityFromEntity, listActivitiesInMonth } from "@/lib/market/activity";
import { getMember, listCampaigns, listMembers, type Campaign, type Member } from "@/lib/market/campaigns";
import { getContact } from "@/lib/market/contacts";
import { getOrganization } from "@/lib/market/organizations";
import { monthKey } from "@/lib/market/keys";
import { canSeeInvestor, filterVisible, isVisibleTo, visibilityFilter } from "@/lib/market/visibility";
import {
  CONTACT_KINDS,
  CONTACT_STAGES,
  type Activity,
  type Contact,
  type ContactKind,
  type ContactStage,
  type Organization,
} from "@/lib/market/types";

/**
 * Read models for the admin pages (FR-15). Every function takes the signed-in
 * user's roles and leaves out investor records unless the roles include
 * `investor` (FR-02), so no list or count on a page can include one.
 *
 * The contacts list is a filtered scan of MaContacts with a short in-process
 * cache (task 030). At the Phase 1 scale of 10,000 contacts a scan is a few
 * pages of 1,000 rows; see projects/market-access/tasks/030 for the measured
 * time.
 */

/** A contact with the fields the lists need, joined to its organization. */
export type ContactRow = Contact & { organizationName?: string; organizationDomain?: string };

const CACHE_MS = 30_000;

type Snapshot = { at: number; contacts: ContactRow[] };
// Next.js loads this module separately for pages and for API routes, so a
// plain module-level map would let a route clear its own copy while the page
// kept serving the old list. One map per process, on globalThis, is shared.
const store = globalThis as typeof globalThis & { __maContactSnapshots?: Map<string, Snapshot> };
const snapshots = (store.__maContactSnapshots ??= new Map<string, Snapshot>());

function scopeKey(roles: readonly string[]): string {
  return canSeeInvestor(roles) ? "investor" : "general";
}

/** Drop the cached scans, for check scripts and after an admin edit. */
export function clearQueryCache(): void {
  snapshots.clear();
}

type ContactEntity = Record<string, unknown> & { partitionKey: string; rowKey: string };

function parseList(value: unknown): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function contactFromEntity(e: ContactEntity): Contact {
  return {
    id: e.rowKey,
    email: String(e.email ?? ""),
    name: str(e.name),
    title: str(e.title),
    organizationId: str(e.organizationId),
    linkedinUrl: str(e.linkedinUrl),
    phone: str(e.phone),
    kind: (CONTACT_KINDS as readonly string[]).includes(String(e.kind)) ? (e.kind as ContactKind) : "other",
    stage: (CONTACT_STAGES as readonly string[]).includes(String(e.stage)) ? (e.stage as ContactStage) : "new",
    tags: parseList(e.tags),
    owner: str(e.owner),
    // A missing value reads as investor, as in visibility.ts.
    visibility: e.visibility === "general" ? "general" : "investor",
    source: str(e.source),
    createdAt: String(e.createdAt ?? ""),
    updatedAt: String(e.updatedAt ?? ""),
    lastActivityAt: str(e.lastActivityAt),
    editedFields: parseList(e.editedFields),
  };
}

export async function scanOrganizations(roles: readonly string[]): Promise<Map<string, Organization>> {
  const table = await getTable("organizations");
  const out = new Map<string, Organization>();
  if (!table) return out;
  const vis = visibilityFilter(roles);
  const filter = ["PartitionKey eq 'org'", vis].filter(Boolean).join(" and ");
  for await (const e of table.listEntities<ContactEntity>({ queryOptions: { filter } })) {
    const org: Organization = {
      id: e.rowKey,
      name: String(e.name ?? e.rowKey),
      domain: str(e.domain),
      website: str(e.website),
      kind: str(e.kind),
      notes: str(e.notes),
      visibility: e.visibility === "general" ? "general" : "investor",
      createdAt: String(e.createdAt ?? ""),
      updatedAt: String(e.updatedAt ?? ""),
    };
    if (isVisibleTo(org, roles)) out.set(org.id, org);
  }
  return out;
}

/**
 * Every contact the user may see, with organization names, newest activity
 * first. Cached for 30 seconds per visibility scope.
 */
export async function loadContacts(roles: readonly string[], now = Date.now()): Promise<ContactRow[]> {
  const key = scopeKey(roles);
  const hit = snapshots.get(key);
  if (hit && now - hit.at < CACHE_MS) return hit.contacts;

  const table = await getTable("contacts");
  if (!table) return [];
  const vis = visibilityFilter(roles);
  // Contact rows only: alias rows share the table.
  const filter = ["rowType eq 'contact'", vis].filter(Boolean).join(" and ");

  const [orgs, rows] = await Promise.all([
    scanOrganizations(roles),
    (async () => {
      const out: Contact[] = [];
      for await (const e of table.listEntities<ContactEntity>({ queryOptions: { filter } })) {
        out.push(contactFromEntity(e));
      }
      return out;
    })(),
  ]);

  const contacts: ContactRow[] = filterVisible(rows, roles).map((c) => {
    // An organization the user may not see is left off, name and all.
    const org = c.organizationId ? orgs.get(c.organizationId) : undefined;
    return { ...c, organizationName: org?.name, organizationDomain: org?.domain };
  });
  contacts.sort(byRecent);

  snapshots.set(key, { at: now, contacts });
  return contacts;
}

function byRecent(a: ContactRow, b: ContactRow): number {
  const ta = a.lastActivityAt ?? a.createdAt;
  const tb = b.lastActivityAt ?? b.createdAt;
  return tb.localeCompare(ta);
}

export type ContactQuery = {
  q?: string;
  kind?: string;
  stage?: string;
  tag?: string;
  /** Contact IDs in the chosen campaign, when filtering by campaign. */
  campaignMembers?: ReadonlySet<string>;
  page?: number;
  pageSize?: number;
};

export type ContactPage = {
  rows: ContactRow[];
  total: number;
  page: number;
  pageCount: number;
};

export const PAGE_SIZE = 50;

/** Search and filter a loaded list. Pure, so the checks can run it. */
export function filterContacts(all: readonly ContactRow[], query: ContactQuery): ContactPage {
  const terms = (query.q ?? "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  const tag = query.tag?.trim().toLowerCase();

  const matched = all.filter((c) => {
    if (query.kind && c.kind !== query.kind) return false;
    if (query.stage && c.stage !== query.stage) return false;
    if (tag && !c.tags.some((t) => t.toLowerCase() === tag)) return false;
    if (query.campaignMembers && !query.campaignMembers.has(c.id)) return false;
    if (terms.length === 0) return true;
    const haystack = [c.name, c.email, c.organizationName, c.organizationDomain]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    // Every word must appear somewhere: "jane acme" finds Jane at Acme.
    return terms.every((t) => haystack.includes(t));
  });

  const pageSize = query.pageSize ?? PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
  const page = Math.min(Math.max(1, Math.floor(query.page ?? 1)), pageCount);
  return {
    rows: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    page,
    pageCount,
  };
}

/** Campaigns the user may see, newest first, for the filter list. */
export async function visibleCampaigns(roles: readonly string[]): Promise<Campaign[]> {
  const all = filterVisible(await listCampaigns(), roles);
  return all.sort((a, b) => (b.startDate ?? b.createdAt).localeCompare(a.startDate ?? a.createdAt));
}

/** Contact IDs in a campaign, or null when the user may not see the campaign. */
export async function campaignMemberIds(slug: string, roles: readonly string[]): Promise<Set<string> | null> {
  const campaign = (await visibleCampaigns(roles)).find((c) => c.slug === slug);
  if (!campaign) return null;
  return new Set((await listMembers(slug)).map((m) => m.contactId));
}

/** Tags in use on the contacts the user may see, for the filter list. */
export function tagsInUse(contacts: readonly ContactRow[]): string[] {
  const seen = new Map<string, string>();
  for (const c of contacts) for (const t of c.tags) if (!seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

export type ActivityRow = Activity & { contactName?: string; contactEmail?: string };

/**
 * Recent activity for the home page: this month and last, newest first. An
 * activity is shown only when both it and its contact are visible, since a
 * contact can be made investor after its early activities were written.
 */
export async function recentActivity(
  roles: readonly string[],
  opts: { now?: Date; limit?: number } = {},
): Promise<ActivityRow[]> {
  const now = opts.now ?? new Date();
  const limit = opts.limit ?? 25;
  const thisMonth = monthKey(now.getTime());
  const lastMonth = monthKey(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));

  const [current, previous, contacts] = await Promise.all([
    listActivitiesInMonth(thisMonth, 500),
    listActivitiesInMonth(lastMonth, 500),
    loadContacts(roles, now.getTime()),
  ]);
  const byId = new Map(contacts.map((c) => [c.id, c]));

  const rows: ActivityRow[] = [];
  for (const a of filterVisible([...current, ...previous], roles)) {
    const c = byId.get(a.contactId);
    if (!c) continue;
    rows.push({ ...a, contactName: c.name, contactEmail: c.email });
  }
  // Row keys sort newest first within a month; across the two, sort by time.
  rows.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return rows.slice(0, limit);
}

/** Contacts created in the last `days` days, newest first. */
export async function newContacts(
  roles: readonly string[],
  opts: { now?: Date; days?: number } = {},
): Promise<ContactRow[]> {
  const now = opts.now ?? new Date();
  const since = new Date(now.getTime() - (opts.days ?? 7) * 86_400_000).toISOString();
  const contacts = await loadContacts(roles, now.getTime());
  return contacts
    .filter((c) => c.createdAt >= since)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** A contact the user may see, with its organization when that is visible too. */
export async function visibleContact(contactId: string, roles: readonly string[]): Promise<ContactRow | null> {
  const c = await getContact(contactId);
  if (!c || !isVisibleTo(c, roles)) return null;
  const org = c.organizationId ? await getOrganization(c.organizationId) : null;
  const shown = org && isVisibleTo(org, roles) ? org : null;
  return { ...c, organizationName: shown?.name, organizationDomain: shown?.domain };
}

export type TimelinePage = { rows: Activity[]; next?: string };

/**
 * One page of a contact's timeline, newest first. `after` is the last row key
 * of the previous page. Activities the user may not see are left out.
 */
export async function contactTimeline(
  contactId: string,
  roles: readonly string[],
  opts: { after?: string; limit?: number } = {},
): Promise<TimelinePage> {
  const table = await getTable("activities");
  if (!table || !/^[0-9a-f]{64}$/.test(contactId)) return { rows: [] };
  const limit = opts.limit ?? 50;
  const parts = [`PartitionKey eq '${contactId}'`];
  if (opts.after && /^[0-9]{13}-[0-9a-f]{12}$/.test(opts.after)) parts.push(`RowKey gt '${opts.after}'`);
  const rows: Activity[] = [];
  let lastKey: string | undefined;
  let more = false;
  for await (const e of table.listEntities<Parameters<typeof activityFromEntity>[0]>({
    queryOptions: { filter: parts.join(" and ") },
  })) {
    if (rows.length >= limit) {
      more = true;
      break;
    }
    lastKey = e.rowKey;
    const a = activityFromEntity(e);
    if (isVisibleTo(a, roles)) rows.push(a);
  }
  return { rows, next: more ? lastKey : undefined };
}

export type MembershipRow = Member & { campaignName: string };

/** The campaigns a contact belongs to, among those the user may see. */
export async function contactMemberships(contactId: string, roles: readonly string[]): Promise<MembershipRow[]> {
  const table = await getTable("members");
  if (!table || !/^[0-9a-f]{64}$/.test(contactId)) return [];
  const campaigns = new Map((await visibleCampaigns(roles)).map((c) => [c.slug, c]));
  const out: MembershipRow[] = [];
  for (const c of campaigns.values()) {
    const m = await getMember(c.slug, contactId);
    if (m) out.push({ ...m, campaignName: c.name });
  }
  return out;
}
