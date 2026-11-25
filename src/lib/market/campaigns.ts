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

/** The stages the activity log can show a member reaching (task 033). */
export const MEMBER_STAGES = ["sent", "bounced", "engaged", "replied", "meeting"] as const;
export type MemberStage = (typeof MEMBER_STAGES)[number];

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
  /** The start of the codes this campaign gives out (phase 2 task 020); unset means the slug, cut short. */
  codePrefix?: string;
  createdAt: string;
  updatedAt: string;
  /** When member statuses were last derived from the log (task 033). */
  resultsAt?: string;
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
  /** Set by hand: the daily job makes no step follow-ups for this member (phase 2 FR-09). */
  stopSteps?: boolean;
  /** Every stage the log shows, for the funnel (task 033). */
  reached: MemberStage[];
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

export function isMemberStatus(value: unknown): value is MemberStatus {
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
type MemberEntity = Omit<Member, "campaignSlug" | "contactId" | "reached"> & {
  partitionKey: string;
  rowKey: string;
  /** Comma-separated stages. */
  reached?: string;
};
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
    codePrefix: e.codePrefix || undefined,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    resultsAt: e.resultsAt,
  };
}

export function parseStages(value: unknown): MemberStage[] {
  if (typeof value !== "string" || !value) return [];
  const set = new Set(value.split(","));
  return MEMBER_STAGES.filter((s) => set.has(s));
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
    stopSteps: e.stopSteps === true ? true : undefined,
    reached: parseStages(e.reached),
    lastActivityAt: e.lastActivityAt || undefined,
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
    codePrefix: existing?.codePrefix,
    createdAt: existing?.createdAt ?? at,
    updatedAt: at,
  });
  await table.upsertEntity(entity, "Replace");
  return campaignFromEntity(entity);
}

type CampaignText = "name" | "utmCampaign" | "startDate" | "endDate" | "owner" | "notes";
const CAMPAIGN_TEXT_MAX: Record<CampaignText, number> = {
  name: 200,
  utmCampaign: 100,
  startDate: 10,
  endDate: 10,
  owner: 200,
  notes: 2000,
};

/** A change to a campaign's details. `null` clears a field; a name cannot be cleared. */
export type CampaignPatch = Partial<Record<CampaignText, string | null>> & {
  kind?: CampaignKind;
  visibility?: Visibility;
  /** Checked by the caller (codes.ts); null goes back to the default. */
  codePrefix?: string | null;
};

/**
 * Apply a patch to an existing campaign. Changing its dates drops the results
 * time, so the next view derives member statuses again for the new window.
 * Returns the versions before and after, or null when there is no campaign.
 */
export async function editCampaign(
  slug: string,
  patch: CampaignPatch,
  now = new Date(),
): Promise<{ before: Campaign; after: Campaign } | null> {
  const table = await getTable("campaigns");
  const before = await getCampaign(slug);
  if (!table || !before) return null;
  if (patch.kind && !(CAMPAIGN_KINDS as readonly string[]).includes(patch.kind)) {
    throw new Error(`Unknown campaign kind: ${patch.kind}`);
  }
  const next: Campaign = { ...before, updatedAt: now.toISOString() };
  for (const field of Object.keys(CAMPAIGN_TEXT_MAX) as CampaignText[]) {
    if (!(field in patch)) continue;
    const value = patch[field] === null ? undefined : clean(patch[field] ?? undefined, CAMPAIGN_TEXT_MAX[field]);
    if (field === "name") {
      if (!value) throw new Error("A campaign needs a name");
      next.name = value;
    } else {
      next[field] = value;
    }
  }
  if (patch.kind) next.kind = patch.kind;
  if (patch.visibility) next.visibility = patch.visibility;
  if ("codePrefix" in patch) next.codePrefix = patch.codePrefix ?? undefined;
  if (next.startDate !== before.startDate || next.endDate !== before.endDate) next.resultsAt = undefined;

  const { slug: _slug, ...fields } = next;
  void _slug;
  await table.upsertEntity(
    stripUndefined({ partitionKey: CAMPAIGN_PARTITION, rowKey: slug, ...fields }) as CampaignEntity,
    "Replace",
  );
  return { before, after: next };
}

/** Record when member statuses were last derived (task 033). */
export async function markResults(slug: string, at: string): Promise<void> {
  const table = await getTable("campaigns");
  if (!table) return;
  await table.updateEntity({ partitionKey: CAMPAIGN_PARTITION, rowKey: slug, resultsAt: at }, "Merge");
}

/** Write the derived fields of one member, leaving the rest of the row alone. */
export async function saveDerived(
  slug: string,
  contactId: string,
  derived: { status: MemberStatus; reached: readonly MemberStage[]; lastActivityAt?: string },
): Promise<void> {
  const table = await getTable("members");
  if (!table) return;
  await table.updateEntity(
    {
      partitionKey: slug,
      rowKey: contactId,
      status: derived.status,
      reached: derived.reached.join(","),
      lastActivityAt: derived.lastActivityAt ?? "",
    },
    "Merge",
  );
}

/** Stop or restart step follow-ups for one member. Returns the member before and after, or null. */
export async function setStopSteps(
  slug: string,
  contactId: string,
  stop: boolean,
  now = new Date(),
): Promise<{ before: Member; after: Member } | null> {
  const table = await getTable("members");
  const before = await getMember(slug, contactId);
  if (!table || !before) return null;
  await table.updateEntity({ partitionKey: slug, rowKey: contactId, stopSteps: stop, updatedAt: now.toISOString() }, "Merge");
  return { before, after: { ...before, stopSteps: stop || undefined, updatedAt: now.toISOString() } };
}

/** Set or clear a member's status override. Returns the member before and after, or null. */
export async function setStatusOverride(
  slug: string,
  contactId: string,
  override: MemberStatus | null,
  now = new Date(),
): Promise<{ before: Member; after: Member } | null> {
  if (override !== null && !isMemberStatus(override)) throw new Error(`Unknown status: ${String(override)}`);
  const table = await getTable("members");
  const before = await getMember(slug, contactId);
  if (!table || !before) return null;
  // Merge cannot remove a property; an empty string reads back as no override.
  await table.updateEntity(
    { partitionKey: slug, rowKey: contactId, statusOverride: override ?? "", updatedAt: now.toISOString() },
    "Merge",
  );
  return { before, after: { ...before, statusOverride: override ?? undefined, updatedAt: now.toISOString() } };
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
    stopSteps: existing?.stopSteps,
    reached: existing?.reached.length ? existing.reached.join(",") : undefined,
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
