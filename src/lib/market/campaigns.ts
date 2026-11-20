import { getTable, statusOf } from "@/lib/market/tables";
import { isSafeKey, sha256 } from "@/lib/market/keys";
import type { Visibility } from "@/lib/market/types";

/**
 * Campaigns and their members (FR-09).
 *
 *   MaCampaigns  partition: campaign      row key: slug
 *   MaMembers    partition: <slug>        row key: contact ID     the member
 *                partition: code          row key: recipient code -> campaign and contact
 *                partition: brief         row key: brief label    -> campaign and contact
 *
 * The two index partitions let a brief read or an Ask AI click, which carry no
 * email, find their member in one point read (FR-06). Slugs therefore can
 * never be "code" or "brief". Only a hash of a brief key is stored: the key is
 * the secret in the link, and the label is enough to resolve a read.
 */

export const CAMPAIGN_KINDS = ["outreach", "event", "linkedin", "website", "other"] as const;
export type CampaignKind = (typeof CAMPAIGN_KINDS)[number];

export const MEMBER_STATUSES = ["planned", "sent", "bounced", "replied", "engaged", "meeting", "done"] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export type Campaign = {
  slug: string;
  name: string;
  kind: CampaignKind;
  utmCampaign?: string;
  startDate?: string;
  endDate?: string;
  owner?: string;
  visibility: Visibility;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Member = {
  campaignSlug: string;
  contactId: string;
  code?: string;
  briefKeyHash?: string;
  briefLabel?: string;
  group?: string;
  templateLabel?: string;
  /** Derived from the activity log (task 033). */
  status: MemberStatus;
  /** Set by hand; shown and kept over the derived status. */
  statusOverride?: MemberStatus;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
};

/** Where an index row points. `contactId` is absent when a brief label is shared. */
export type MemberRef = { campaignSlug: string; contactId?: string };

const CAMPAIGN_PARTITION = "campaign";
const CODE_PARTITION = "code";
const BRIEF_PARTITION = "brief";
const RESERVED_SLUGS = new Set([CODE_PARTITION, BRIEF_PARTITION, CAMPAIGN_PARTITION]);

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}$/;
// The same characters the Ask AI route keeps from `src`.
const CODE_RE = /^[A-Za-z0-9_-]{1,32}$/;
const CONTACT_ID_RE = /^[0-9a-f]{64}$/;

export class MemberConflictError extends Error {
  constructor(what: string) {
    super(`${what} already belongs to another member`);
    this.name = "MemberConflictError";
  }
}

export function isCampaignSlug(value: unknown): value is string {
  return typeof value === "string" && SLUG_RE.test(value) && !RESERVED_SLUGS.has(value);
}

export function isMemberCode(value: unknown): value is string {
  return typeof value === "string" && CODE_RE.test(value);
}

function isBriefLabel(value: unknown): value is string {
  return typeof value === "string" && value.length <= 100 && isSafeKey(value);
}

function isMemberStatus(value: unknown): value is MemberStatus {
  return typeof value === "string" && (MEMBER_STATUSES as readonly string[]).includes(value);
}

function clean(value: string | undefined, max: number): string | undefined {
  const v = value?.replace(/\s+/g, " ").trim();
  return v ? v.slice(0, max) : undefined;
}

function stripUndefined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

type CampaignEntity = Omit<Campaign, "slug"> & { partitionKey: string; rowKey: string };
type MemberEntity = Omit<Member, "campaignSlug" | "contactId"> & { partitionKey: string; rowKey: string };
type IndexEntity = { partitionKey: string; rowKey: string; campaignSlug: string; contactId?: string; shared?: boolean };

function campaignFromEntity(e: CampaignEntity): Campaign {
  return {
    slug: e.rowKey,
    name: e.name,
    kind: e.kind,
    utmCampaign: e.utmCampaign,
    startDate: e.startDate,
    endDate: e.endDate,
    owner: e.owner,
    visibility: e.visibility === "general" ? "general" : "investor",
    notes: e.notes,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

function memberFromEntity(e: MemberEntity): Member {
  return {
    campaignSlug: e.partitionKey,
    contactId: e.rowKey,
    code: e.code,
    briefKeyHash: e.briefKeyHash,
    briefLabel: e.briefLabel,
    group: e.group,
    templateLabel: e.templateLabel,
    status: isMemberStatus(e.status) ? e.status : "planned",
    statusOverride: isMemberStatus(e.statusOverride) ? e.statusOverride : undefined,
    lastActivityAt: e.lastActivityAt,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

export type CampaignInput = {
  slug: string;
  name: string;
  kind?: CampaignKind;
  utmCampaign?: string;
  startDate?: string;
  endDate?: string;
  owner?: string;
  visibility?: Visibility;
  notes?: string;
};

/** Create or update a campaign. Returns null without storage. */
export async function upsertCampaign(input: CampaignInput, now = new Date()): Promise<Campaign | null> {
  if (!isCampaignSlug(input.slug)) throw new Error(`Invalid campaign slug: ${String(input.slug)}`);
  const name = clean(input.name, 200);
  if (!name) throw new Error("A campaign needs a name");
  if (input.kind && !(CAMPAIGN_KINDS as readonly string[]).includes(input.kind)) {
    throw new Error(`Unknown campaign kind: ${input.kind}`);
  }
  const table = await getTable("campaigns");
  if (!table) return null;

  const existing = await getCampaign(input.slug);
  const at = now.toISOString();
  const entity: CampaignEntity = stripUndefined({
    partitionKey: CAMPAIGN_PARTITION,
    rowKey: input.slug,
    name,
    kind: input.kind ?? existing?.kind ?? "outreach",
    utmCampaign: clean(input.utmCampaign, 100) ?? existing?.utmCampaign,
    startDate: clean(input.startDate, 10) ?? existing?.startDate,
    endDate: clean(input.endDate, 10) ?? existing?.endDate,
    owner: clean(input.owner, 200) ?? existing?.owner,
    // Unset means investor-only, so a campaign is never exposed by omission (FR-02).
    visibility: input.visibility ?? existing?.visibility ?? "investor",
    notes: clean(input.notes, 2000) ?? existing?.notes,
    createdAt: existing?.createdAt ?? at,
    updatedAt: at,
  });
  await table.upsertEntity(entity, "Replace");
  return campaignFromEntity(entity);
}

export async function getCampaign(slug: string): Promise<Campaign | null> {
  if (!isCampaignSlug(slug)) return null;
  const table = await getTable("campaigns");
  if (!table) return null;
  try {
    return campaignFromEntity(await table.getEntity<CampaignEntity>(CAMPAIGN_PARTITION, slug));
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

export async function listCampaigns(): Promise<Campaign[]> {
  const table = await getTable("campaigns");
  if (!table) return [];
  const out: Campaign[] = [];
  for await (const e of table.listEntities<CampaignEntity>({
    queryOptions: { filter: `PartitionKey eq '${CAMPAIGN_PARTITION}'` },
  })) {
    out.push(campaignFromEntity(e));
  }
  return out;
}

export type MemberInput = {
  campaignSlug: string;
  contactId: string;
  code?: string;
  /** The key in /brief/<key>. Only its hash is stored. */
  briefKey?: string;
  briefLabel?: string;
  group?: string;
  templateLabel?: string;
  status?: MemberStatus;
};

/**
 * Point an index row at this member. A code belongs to one member, so a code
 * already pointing elsewhere is a conflict. A brief label can be shared (one
 * brief sent to a whole group); a shared label resolves to the campaign only.
 */
async function claimIndex(partition: string, key: string, ref: Required<MemberRef>): Promise<void> {
  const table = (await getTable("members"))!;
  const row: IndexEntity = { partitionKey: partition, rowKey: key, ...ref };
  try {
    await table.createEntity(row);
    return;
  } catch (err) {
    if (statusOf(err) !== 409) throw err;
  }
  const current = await table.getEntity<IndexEntity>(partition, key);
  if (current.campaignSlug === ref.campaignSlug && current.contactId === ref.contactId) return;
  if (partition === CODE_PARTITION) throw new MemberConflictError(`Code ${key}`);
  if (!current.shared) {
    await table.updateEntity(
      { partitionKey: partition, rowKey: key, campaignSlug: current.campaignSlug, contactId: "", shared: true },
      "Replace",
      { etag: current.etag },
    );
  }
}

/**
 * Add a contact to a campaign, or update the member's details. The derived
 * status is set only when the member is new, so a re-import never resets it.
 * Returns null without storage.
 */
export async function addMember(input: MemberInput, now = new Date()): Promise<Member | null> {
  if (!isCampaignSlug(input.campaignSlug)) throw new Error(`Invalid campaign slug: ${String(input.campaignSlug)}`);
  if (!CONTACT_ID_RE.test(input.contactId)) throw new Error("Invalid contact ID");
  if (input.code !== undefined && !isMemberCode(input.code)) throw new Error(`Invalid member code: ${input.code}`);
  if (input.briefLabel !== undefined && !isBriefLabel(input.briefLabel)) {
    throw new Error(`Invalid brief label: ${input.briefLabel}`);
  }
  if (input.status !== undefined && !isMemberStatus(input.status)) throw new Error(`Unknown status: ${input.status}`);

  const table = await getTable("members");
  if (!table) return null;
  if (!(await getCampaign(input.campaignSlug))) throw new Error(`No campaign ${input.campaignSlug}`);

  const ref = { campaignSlug: input.campaignSlug, contactId: input.contactId };
  // Claim the lookups first, so a conflicting code stops the write before the member row exists.
  if (input.code) await claimIndex(CODE_PARTITION, input.code, ref);
  if (input.briefLabel) await claimIndex(BRIEF_PARTITION, input.briefLabel, ref);

  const existing = await getMember(input.campaignSlug, input.contactId);
  const at = now.toISOString();
  const entity: MemberEntity = stripUndefined({
    partitionKey: input.campaignSlug,
    rowKey: input.contactId,
    code: input.code ?? existing?.code,
    briefKeyHash: input.briefKey ? sha256(input.briefKey) : existing?.briefKeyHash,
    briefLabel: input.briefLabel ?? existing?.briefLabel,
    group: clean(input.group, 100) ?? existing?.group,
    templateLabel: clean(input.templateLabel, 100) ?? existing?.templateLabel,
    status: existing?.status ?? input.status ?? "planned",
    statusOverride: existing?.statusOverride,
    lastActivityAt: existing?.lastActivityAt,
    createdAt: existing?.createdAt ?? at,
    updatedAt: at,
  });
  await table.upsertEntity(entity, "Replace");
  return memberFromEntity(entity);
}

export async function getMember(campaignSlug: string, contactId: string): Promise<Member | null> {
  if (!isCampaignSlug(campaignSlug) || !CONTACT_ID_RE.test(contactId)) return null;
  const table = await getTable("members");
  if (!table) return null;
  try {
    return memberFromEntity(await table.getEntity<MemberEntity>(campaignSlug, contactId));
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

async function readIndex(partition: string, key: string): Promise<MemberRef | null> {
  const table = await getTable("members");
  if (!table) return null;
  try {
    const e = await table.getEntity<IndexEntity>(partition, key);
    return { campaignSlug: e.campaignSlug, contactId: e.shared || !e.contactId ? undefined : e.contactId };
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

/** The member a recipient code belongs to, in one point read. */
export async function findMemberByCode(code: string): Promise<MemberRef | null> {
  return isMemberCode(code) ? readIndex(CODE_PARTITION, code) : null;
}

/** The member a brief label belongs to, in one point read; no contact when the label is shared. */
export async function findMemberByBriefLabel(label: string): Promise<MemberRef | null> {
  return isBriefLabel(label) ? readIndex(BRIEF_PARTITION, label) : null;
}

export async function listMembers(campaignSlug: string): Promise<Member[]> {
  if (!isCampaignSlug(campaignSlug)) return [];
  const table = await getTable("members");
  if (!table) return [];
  const out: Member[] = [];
  for await (const e of table.listEntities<MemberEntity>({
    queryOptions: { filter: `PartitionKey eq '${campaignSlug}'` },
  })) {
    out.push(memberFromEntity(e));
  }
  return out;
}
