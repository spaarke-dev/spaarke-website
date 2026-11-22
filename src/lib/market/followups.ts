import { randomUUID } from "node:crypto";
import { getTable, statusOf } from "@/lib/market/tables";
import { sha256 } from "@/lib/market/keys";
import type { Visibility } from "@/lib/market/types";

/**
 * Follow-ups (FR-11, task 034).
 *
 *   MaFollowUps  partition: contact ID      row key: follow-up ID   the follow-up
 *                partition: due:<yyyy-mm>   row key: follow-up ID   index row while it is open
 *
 * The index lets the admin home list what is due and overdue without reading
 * every contact. Only open follow-ups (`todo`, `drafted`) have an index row,
 * so the scan stays small. Index rows carry `contactId`, which is how a
 * contact merge or delete (task 031) finds and moves or removes them.
 */

export const FOLLOWUP_STATUSES = ["todo", "drafted", "sent", "replied", "skipped"] as const;
export type FollowUpStatus = (typeof FOLLOWUP_STATUSES)[number];
const OPEN = new Set<FollowUpStatus>(["todo", "drafted"]);

export type FollowUp = {
  id: string;
  contactId: string;
  title: string;
  /** YYYY-MM-DD, a day in the host's time zone. */
  dueDate: string;
  status: FollowUpStatus;
  notes?: string;
  campaignSlug?: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
  /** When it left `todo` or `drafted`. */
  closedAt?: string;
};

type FollowUpEntity = Omit<FollowUp, "id"> & { partitionKey: string; rowKey: string };
type IndexEntity = {
  partitionKey: string;
  rowKey: string;
  contactId: string;
  dueDate: string;
  title: string;
  status: FollowUpStatus;
  campaignSlug?: string;
  visibility: Visibility;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[0-9a-f]{32}$/;
const CONTACT_ID_RE = /^[0-9a-f]{64}$/;

export function isFollowUpStatus(value: unknown): value is FollowUpStatus {
  return typeof value === "string" && (FOLLOWUP_STATUSES as readonly string[]).includes(value);
}

export function isOpen(status: FollowUpStatus): boolean {
  return OPEN.has(status);
}

export function isFollowUpId(value: unknown): value is string {
  return typeof value === "string" && ID_RE.test(value);
}

export function isDueDate(value: unknown): value is string {
  return typeof value === "string" && DATE_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/**
 * The ID of a bulk follow-up: one per campaign, title and contact, so running
 * the same bulk create again finds the ones it made (FR-11).
 */
export function bulkFollowUpId(campaignSlug: string, title: string, contactId: string): string {
  const t = title.replace(/\s+/g, " ").trim().toLowerCase();
  return sha256(`bulk|${campaignSlug}|${t}|${contactId}`).slice(0, 32);
}

export function newFollowUpId(): string {
  return randomUUID().replace(/-/g, "");
}

function hostZone(): string {
  const tz = process.env.MEET_HOST_TIME_ZONE?.trim() || "America/New_York";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "America/New_York";
  }
}

/** Today as YYYY-MM-DD in the host's time zone, the zone the admin pages show. */
export function todayKey(now = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: hostZone(), year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function indexPartition(dueDate: string): string {
  return `due:${dueDate.slice(0, 7)}`;
}

function fromEntity(e: FollowUpEntity): FollowUp {
  return {
    id: e.rowKey,
    contactId: e.contactId,
    title: e.title,
    dueDate: e.dueDate,
    status: isFollowUpStatus(e.status) ? e.status : "todo",
    notes: e.notes || undefined,
    campaignSlug: e.campaignSlug || undefined,
    visibility: e.visibility === "investor" ? "investor" : "general",
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    closedAt: e.closedAt || undefined,
  };
}

function stripUndefined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

/** Keep the due index in step with a follow-up: a row while it is open, none once it is closed. */
async function syncIndex(before: FollowUp | null, after: FollowUp | null): Promise<void> {
  const table = (await getTable("followUps"))!;
  if (before && isOpen(before.status) && (!after || !isOpen(after.status) || indexPartition(after.dueDate) !== indexPartition(before.dueDate))) {
    try {
      await table.deleteEntity(indexPartition(before.dueDate), before.id);
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
  }
  if (after && isOpen(after.status)) {
    const row: IndexEntity = stripUndefined({
      partitionKey: indexPartition(after.dueDate),
      rowKey: after.id,
      contactId: after.contactId,
      dueDate: after.dueDate,
      title: after.title,
      status: after.status,
      campaignSlug: after.campaignSlug,
      visibility: after.visibility,
    });
    await table.upsertEntity(row, "Replace");
  }
}

export type FollowUpInput = {
  contactId: string;
  title: string;
  dueDate: string;
  notes?: string;
  campaignSlug?: string;
  visibility: Visibility;
  /** A fixed ID (bulk create); a new one otherwise. */
  id?: string;
};

/**
 * Create a follow-up. With a fixed ID that already exists, nothing changes and
 * `created` is false. Returns null without storage.
 */
export async function createFollowUp(
  input: FollowUpInput,
  now = new Date(),
): Promise<{ followUp: FollowUp; created: boolean } | null> {
  if (!CONTACT_ID_RE.test(input.contactId)) throw new Error("Invalid contact ID");
  if (!isDueDate(input.dueDate)) throw new Error("Invalid due date");
  const table = await getTable("followUps");
  if (!table) return null;
  const at = now.toISOString();
  const id = input.id ?? newFollowUpId();
  if (!isFollowUpId(id)) throw new Error("Invalid follow-up ID");
  const entity: FollowUpEntity = stripUndefined({
    partitionKey: input.contactId,
    rowKey: id,
    contactId: input.contactId,
    title: input.title,
    dueDate: input.dueDate,
    status: "todo" as const,
    notes: input.notes,
    campaignSlug: input.campaignSlug,
    visibility: input.visibility,
    createdAt: at,
    updatedAt: at,
  });
  try {
    await table.createEntity(entity);
  } catch (err) {
    if (statusOf(err) !== 409) throw err;
    const existing = await getFollowUp(input.contactId, id);
    if (!existing) throw err;
    // Repair a missing index row left by a cut-off earlier write.
    await syncIndex(null, existing);
    return { followUp: existing, created: false };
  }
  const followUp = fromEntity(entity);
  await syncIndex(null, followUp);
  return { followUp, created: true };
}

export async function getFollowUp(contactId: string, id: string): Promise<FollowUp | null> {
  const table = await getTable("followUps");
  if (!table || !CONTACT_ID_RE.test(contactId) || !isFollowUpId(id)) return null;
  try {
    return fromEntity(await table.getEntity<FollowUpEntity>(contactId, id));
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

/** A contact's follow-ups: open ones first by due date, then closed ones, newest first. */
export async function listContactFollowUps(contactId: string): Promise<FollowUp[]> {
  const table = await getTable("followUps");
  if (!table || !CONTACT_ID_RE.test(contactId)) return [];
  const out: FollowUp[] = [];
  for await (const e of table.listEntities<FollowUpEntity>({ queryOptions: { filter: `PartitionKey eq '${contactId}'` } })) {
    out.push(fromEntity(e));
  }
  return out.sort((a, b) => {
    const ao = isOpen(a.status);
    const bo = isOpen(b.status);
    if (ao !== bo) return ao ? -1 : 1;
    return ao ? a.dueDate.localeCompare(b.dueDate) : (b.closedAt ?? b.updatedAt).localeCompare(a.closedAt ?? a.updatedAt);
  });
}

export type FollowUpPatch = {
  title?: string;
  dueDate?: string;
  /** null clears. */
  notes?: string | null;
  status?: FollowUpStatus;
};

/** Change a follow-up. Returns null when it does not exist. */
export async function updateFollowUp(
  contactId: string,
  id: string,
  patch: FollowUpPatch,
  now = new Date(),
): Promise<{ before: FollowUp; after: FollowUp } | null> {
  const before = await getFollowUp(contactId, id);
  if (!before) return null;
  if (patch.dueDate !== undefined && !isDueDate(patch.dueDate)) throw new Error("Invalid due date");
  const at = now.toISOString();
  const after: FollowUp = {
    ...before,
    title: patch.title ?? before.title,
    dueDate: patch.dueDate ?? before.dueDate,
    notes: patch.notes === null ? undefined : (patch.notes ?? before.notes),
    status: patch.status ?? before.status,
    updatedAt: at,
  };
  if (isOpen(before.status) && !isOpen(after.status)) after.closedAt = at;
  if (isOpen(after.status)) after.closedAt = undefined;

  const table = (await getTable("followUps"))!;
  const { id: _id, ...rest } = after;
  void _id;
  await table.upsertEntity(stripUndefined({ ...rest, partitionKey: contactId, rowKey: id }), "Replace");
  await syncIndex(before, after);
  return { before, after };
}

export async function deleteFollowUp(contactId: string, id: string): Promise<FollowUp | null> {
  const before = await getFollowUp(contactId, id);
  if (!before) return null;
  const table = (await getTable("followUps"))!;
  await syncIndex(before, null);
  try {
    await table.deleteEntity(contactId, id);
  } catch (err) {
    if (statusOf(err) !== 404) throw err;
  }
  return before;
}

export type DueFollowUp = Pick<FollowUp, "id" | "contactId" | "title" | "dueDate" | "status" | "campaignSlug" | "visibility">;

/** Open follow-ups due on or before a day, oldest first, from the due index. */
export async function dueFollowUps(throughDate: string): Promise<DueFollowUp[]> {
  const table = await getTable("followUps");
  if (!table || !isDueDate(throughDate)) return [];
  const out: DueFollowUp[] = [];
  const filter = `PartitionKey ge 'due:' and PartitionKey le '${indexPartition(throughDate)}' and dueDate le '${throughDate}'`;
  for await (const e of table.listEntities<IndexEntity>({ queryOptions: { filter } })) {
    if (!isFollowUpStatus(e.status) || !isOpen(e.status)) continue;
    out.push({
      id: e.rowKey,
      contactId: e.contactId,
      title: e.title,
      dueDate: e.dueDate,
      status: e.status,
      campaignSlug: e.campaignSlug || undefined,
      visibility: e.visibility === "investor" ? "investor" : "general",
    });
  }
  return out.sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title));
}
