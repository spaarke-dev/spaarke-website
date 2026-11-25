import { randomUUID } from "node:crypto";
import type { TableClient } from "@azure/data-tables";
import { getTable, statusOf } from "@/lib/market/tables";
import { aliasKeys, contactKeys, emailHash, hashPartition, monthKey } from "@/lib/market/keys";
import { getContact } from "@/lib/market/contacts";
import { idempotencyKey, recordActivity, type RecordResult } from "@/lib/market/activity";
import { audit } from "@/lib/market/audit";
import { widen } from "@/lib/market/visibility";
import {
  CONTACT_KINDS,
  CONTACT_STAGES,
  VISIBILITIES,
  type ActivityType,
  type Contact,
  type ContactKind,
  type ContactStage,
  type Visibility,
} from "@/lib/market/types";

/**
 * Admin changes to a contact (task 031): edit, notes and logged touches,
 * merge and delete. Every change that alters a record writes an audit row
 * (NFR-06); the audit never holds an email address.
 *
 * Follow-ups (task 034) live in MaFollowUps, partitioned by contact ID, with
 * index rows elsewhere in the table that carry a `contactId` property. Merge
 * and delete handle both, so nothing is left behind once follow-ups exist.
 */

const CONTACT_ID_RE = /^[0-9a-f]{64}$/;

type Row = Record<string, unknown> & { partitionKey: string; rowKey: string; etag?: string };

function strip(row: Row): Row {
  const { etag: _etag, timestamp: _ts, ...rest } = row as Row & { timestamp?: unknown };
  void _etag;
  void _ts;
  return rest as Row;
}

async function listRows(table: TableClient, filter: string): Promise<Row[]> {
  const out: Row[] = [];
  for await (const e of table.listEntities<Row>({ queryOptions: { filter } })) out.push(e as Row);
  return out;
}

async function deleteRow(table: TableClient, pk: string, rk: string): Promise<void> {
  try {
    await table.deleteEntity(pk, rk);
  } catch (err) {
    if (statusOf(err) !== 404) throw err;
  }
}

// ----- Edit -----

export const EDITABLE_FIELDS = [
  "name",
  "title",
  "linkedinUrl",
  "phone",
  "kind",
  "stage",
  "tags",
  "owner",
  "visibility",
] as const;
export type EditableField = (typeof EDITABLE_FIELDS)[number];

export type ContactPatch = {
  name?: string | null;
  title?: string | null;
  linkedinUrl?: string | null;
  phone?: string | null;
  kind?: ContactKind;
  stage?: ContactStage;
  tags?: string[];
  owner?: string | null;
  visibility?: Visibility;
};

const TEXT_MAX: Record<string, number> = { name: 200, title: 200, linkedinUrl: 400, phone: 40, owner: 200 };

export class PatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PatchError";
  }
}

/** Check and normalize a patch from a request body. Throws PatchError on bad input. */
export function parsePatch(body: unknown): ContactPatch {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new PatchError("Expected an object");
  const input = body as Record<string, unknown>;
  const patch: ContactPatch = {};
  for (const key of Object.keys(input)) {
    if (!(EDITABLE_FIELDS as readonly string[]).includes(key)) throw new PatchError(`${key} cannot be edited`);
  }
  for (const field of ["name", "title", "linkedinUrl", "phone", "owner"] as const) {
    if (!(field in input)) continue;
    const v = input[field];
    if (v === null || v === "") {
      patch[field] = null;
      continue;
    }
    if (typeof v !== "string") throw new PatchError(`${field} must be text`);
    const t = v.replace(/\s+/g, " ").trim();
    if (t.length > TEXT_MAX[field]) throw new PatchError(`${field} is too long`);
    patch[field] = t || null;
  }
  if (patch.linkedinUrl && !/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(patch.linkedinUrl)) {
    throw new PatchError("linkedinUrl must be a linkedin.com address");
  }
  if ("kind" in input) {
    if (!(CONTACT_KINDS as readonly unknown[]).includes(input.kind)) throw new PatchError("Unknown kind");
    patch.kind = input.kind as ContactKind;
  }
  if ("stage" in input) {
    if (!(CONTACT_STAGES as readonly unknown[]).includes(input.stage)) throw new PatchError("Unknown stage");
    patch.stage = input.stage as ContactStage;
  }
  if ("visibility" in input) {
    if (!(VISIBILITIES as readonly unknown[]).includes(input.visibility)) throw new PatchError("Unknown visibility");
    patch.visibility = input.visibility as Visibility;
  }
  if ("tags" in input) {
    if (!Array.isArray(input.tags) || input.tags.some((t) => typeof t !== "string")) {
      throw new PatchError("tags must be a list of text");
    }
    const seen = new Map<string, string>();
    for (const raw of input.tags as string[]) {
      const t = raw.replace(/\s+/g, " ").trim().slice(0, 40);
      if (t && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
    }
    if (seen.size > 20) throw new PatchError("At most 20 tags");
    patch.tags = [...seen.values()];
  }
  return patch;
}

/** Fields a writer or import could fill; editing them by hand protects them. */
const PROTECTED = new Set(["name", "title", "linkedinUrl", "phone", "kind"]);

function comparable(c: Contact): Record<string, unknown> {
  return {
    name: c.name,
    title: c.title,
    linkedinUrl: c.linkedinUrl,
    phone: c.phone,
    kind: c.kind,
    stage: c.stage,
    tags: c.tags,
    owner: c.owner,
    visibility: c.visibility,
  };
}

/** Apply an edit by hand. Returns the updated contact, or null when there is none. */
export async function editContact(
  contactId: string,
  patch: ContactPatch,
  who: string,
  now = new Date(),
): Promise<Contact | null> {
  const table = await getTable("contacts");
  const contact = await getContact(contactId);
  if (!table || !contact) return null;

  const before = comparable(contact);
  const next: Contact = { ...contact };
  for (const [k, v] of Object.entries(patch)) {
    (next as Record<string, unknown>)[k] = v === null ? undefined : v;
  }
  const after = comparable(next);

  const changed = Object.keys(after).filter((k) => JSON.stringify(after[k]) !== JSON.stringify(before[k]));
  if (changed.length === 0) return contact;

  const edited = new Set(contact.editedFields);
  for (const k of changed) if (PROTECTED.has(k)) edited.add(k);

  const row: Row = { ...contactKeys(contactId), updatedAt: now.toISOString(), editedFields: JSON.stringify([...edited]) };
  for (const k of changed) {
    const v = after[k];
    row[k] = k === "tags" ? JSON.stringify(v ?? []) : (v ?? "");
  }
  // An emptied field is stored as "" (Merge cannot remove a property); readers treat "" as unset.
  await table.updateEntity(row, "Merge");
  await audit({ who, action: "contact.edit", entity: "contact", entityId: contactId, before, after }, now);
  return { ...next, editedFields: [...edited], updatedAt: now.toISOString() };
}

// ----- Notes and logged touches -----

export const LOGGABLE_TYPES = ["note", "call", "email.sent", "email.received", "meeting.in_person", "linkedin.message"] as const satisfies readonly ActivityType[];
export type LoggableType = (typeof LOGGABLE_TYPES)[number];

export function isLoggableType(value: unknown): value is LoggableType {
  return typeof value === "string" && (LOGGABLE_TYPES as readonly string[]).includes(value);
}

/** A note, phone call, email, in-person meeting or LinkedIn message entered by hand. */
export async function logActivity(
  contactId: string,
  input: { type: LoggableType; summary: string; occurredAt?: string },
  now = new Date(),
): Promise<RecordResult> {
  const summary = input.summary.replace(/\s+/g, " ").trim();
  if (!summary) throw new PatchError("Write something first");
  let occurredAt = now;
  if (input.occurredAt) {
    const ms = Date.parse(input.occurredAt);
    if (!Number.isFinite(ms)) throw new PatchError("The date is not valid");
    // Up to a day ahead, for time zones; nothing logged far in the future.
    if (ms > now.getTime() + 86_400_000) throw new PatchError("The date is in the future");
    occurredAt = new Date(ms);
  }
  return recordActivity({
    type: input.type,
    source: "admin",
    sourceId: randomUUID(),
    occurredAt,
    contactId,
    summary,
  });
}

// ----- Shared moves -----

type ActivityRow = Row & { contactId: string; source: string; sourceId: string; occurredAt: string; memberId?: string };

function markerKeys(source: string, sourceId: string) {
  const hash = idempotencyKey(source, sourceId);
  return { partitionKey: `idem-${hashPartition(hash)}`, rowKey: hash };
}

async function contactActivities(contactId: string): Promise<{ table: TableClient; rows: ActivityRow[] } | null> {
  const table = await getTable("activities");
  if (!table) return null;
  return { table, rows: (await listRows(table, `PartitionKey eq '${contactId}'`)) as ActivityRow[] };
}

/** Membership rows for a contact, across campaigns (index rows have other row keys). */
async function memberRows(contactId: string): Promise<{ table: TableClient; rows: Row[] } | null> {
  const table = await getTable("members");
  if (!table) return null;
  const rows = await listRows(table, `RowKey eq '${contactId}'`);
  return { table, rows: rows.filter((r) => r.partitionKey !== "code" && r.partitionKey !== "brief") };
}

async function indexRowsFor(table: TableClient, contactId: string): Promise<Row[]> {
  return listRows(table, `(PartitionKey eq 'code' or PartitionKey eq 'brief') and contactId eq '${contactId}'`);
}

async function followUpRows(contactId: string): Promise<{ table: TableClient; own: Row[]; index: Row[] } | null> {
  const table = await getTable("followUps");
  if (!table) return null;
  const own = await listRows(table, `PartitionKey eq '${contactId}'`);
  const index = await listRows(table, `PartitionKey ne '${contactId}' and contactId eq '${contactId}'`);
  return { table, own, index };
}

async function aliasRowsFor(contactId: string): Promise<Row[]> {
  const table = await getTable("contacts");
  if (!table) return [];
  return listRows(table, `rowType eq 'alias' and contactId eq '${contactId}'`);
}

// ----- Merge -----

export type MergeSummary = {
  survivorId: string;
  mergedId: string;
  activities: number;
  memberships: number;
  followUps: number;
  aliases: number;
};

export class MergeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MergeError";
  }
}

/** Counts for the confirmation step, without changing anything. */
export async function previewMerge(survivorId: string, otherId: string): Promise<MergeSummary> {
  if (survivorId === otherId) throw new MergeError("Pick a different contact");
  const [acts, members, fus, aliases] = await Promise.all([
    contactActivities(otherId),
    memberRows(otherId),
    followUpRows(otherId),
    aliasRowsFor(otherId),
  ]);
  return {
    survivorId,
    mergedId: otherId,
    activities: acts?.rows.length ?? 0,
    memberships: members?.rows.length ?? 0,
    followUps: fus?.own.length ?? 0,
    aliases: aliases.length + 1,
  };
}

/**
 * Merge `otherId` into `survivorId`: every activity, membership and follow-up
 * moves to the survivor, the other contact's emails become the survivor's
 * alternates, and the other record is deleted. Safe to run again after a
 * failure part way: each step skips what is already done.
 */
export async function mergeContacts(
  survivorId: string,
  otherId: string,
  who: string,
  now = new Date(),
): Promise<MergeSummary> {
  if (!CONTACT_ID_RE.test(survivorId) || !CONTACT_ID_RE.test(otherId)) throw new MergeError("Not a contact ID");
  if (survivorId === otherId) throw new MergeError("Pick a different contact");
  const contacts = await getTable("contacts");
  const survivor = await getContact(survivorId);
  const other = await getContact(otherId);
  if (!contacts || !survivor || !other) throw new MergeError("Both contacts must exist");

  const summary: MergeSummary = { survivorId, mergedId: otherId, activities: 0, memberships: 0, followUps: 0, aliases: 0 };

  // Activities: same row key under the survivor's partition, month index and marker pointed at it.
  const acts = await contactActivities(otherId);
  const byMonth = await getTable("activityByMonth");
  if (acts && byMonth) {
    for (const a of acts.rows) {
      const moved: Row = { ...strip(a), partitionKey: survivorId, contactId: survivorId };
      if (a.memberId === otherId) moved.memberId = survivorId;
      try {
        await acts.table.createEntity(moved);
      } catch (err) {
        if (statusOf(err) !== 409) throw err;
      }
      const monthPatch: Row = { partitionKey: monthKey(Date.parse(a.occurredAt)), rowKey: a.rowKey, contactId: survivorId };
      if (a.memberId === otherId) monthPatch.memberId = survivorId;
      try {
        await byMonth.updateEntity(monthPatch, "Merge");
      } catch (err) {
        if (statusOf(err) !== 404) throw err;
      }
      const mk = markerKeys(a.source, a.sourceId);
      try {
        await acts.table.updateEntity({ ...mk, contactId: survivorId }, "Merge");
      } catch (err) {
        if (statusOf(err) !== 404) throw err;
      }
      await deleteRow(acts.table, otherId, a.rowKey);
      summary.activities++;
    }
  }

  // Memberships: keep the survivor's row where both are members, filling gaps from the other's.
  const members = await memberRows(otherId);
  if (members) {
    for (const m of members.rows) {
      const campaign = m.partitionKey;
      let existing: Row | null = null;
      try {
        existing = (await members.table.getEntity<Row>(campaign, survivorId)) as Row;
      } catch (err) {
        if (statusOf(err) !== 404) throw err;
      }
      if (existing) {
        const fill: Row = { partitionKey: campaign, rowKey: survivorId };
        for (const f of ["code", "briefKeyHash", "briefLabel", "group", "templateLabel", "statusOverride", "stopSteps"]) {
          if (!existing[f] && m[f]) fill[f] = m[f];
        }
        if (Object.keys(fill).length > 2) await members.table.updateEntity(fill, "Merge");
      } else {
        await members.table.upsertEntity({ ...strip(m), rowKey: survivorId, updatedAt: now.toISOString() }, "Replace");
      }
      await deleteRow(members.table, campaign, otherId);
      summary.memberships++;
    }
    // A code or brief label that found the other contact now finds the survivor.
    for (const ix of await indexRowsFor(members.table, otherId)) {
      await members.table.updateEntity({ partitionKey: ix.partitionKey, rowKey: ix.rowKey, contactId: survivorId }, "Merge");
    }
  }

  // Follow-ups.
  const fus = await followUpRows(otherId);
  if (fus) {
    for (const f of fus.own) {
      await fus.table.upsertEntity({ ...strip(f), partitionKey: survivorId, contactId: survivorId }, "Replace");
      await deleteRow(fus.table, otherId, f.rowKey);
      summary.followUps++;
    }
    for (const ix of fus.index) {
      await fus.table.updateEntity({ partitionKey: ix.partitionKey, rowKey: ix.rowKey, contactId: survivorId }, "Merge");
    }
  }

  // Emails: the other's primary and its alternates now point at the survivor.
  const aliases = await aliasRowsFor(otherId);
  for (const a of aliases) {
    await contacts.updateEntity({ partitionKey: a.partitionKey, rowKey: a.rowKey, contactId: survivorId }, "Merge");
    summary.aliases++;
  }
  await contacts.upsertEntity(
    { ...aliasKeys(emailHash(other.email)), rowType: "alias", contactId: survivorId },
    "Replace",
  );
  summary.aliases++;

  // The survivor keeps its own values and takes the other's where it has none.
  const before = comparable(survivor);
  const patch: Row = { ...contactKeys(survivorId), updatedAt: now.toISOString() };
  for (const f of ["name", "title", "linkedinUrl", "phone", "owner", "organizationId"] as const) {
    if (!survivor[f] && other[f]) patch[f] = other[f];
  }
  if (survivor.kind === "other" && other.kind !== "other") patch.kind = other.kind;
  const tags = new Map(survivor.tags.map((t) => [t.toLowerCase(), t]));
  for (const t of other.tags) if (!tags.has(t.toLowerCase())) tags.set(t.toLowerCase(), t);
  if (tags.size !== survivor.tags.length) patch.tags = JSON.stringify([...tags.values()].slice(0, 20));
  const vis = widen(survivor.visibility, other.visibility);
  if (vis !== survivor.visibility) patch.visibility = vis;
  if (other.createdAt && other.createdAt < survivor.createdAt) {
    patch.createdAt = other.createdAt;
    if (other.source) patch.source = other.source;
  }
  if (other.lastActivityAt && (!survivor.lastActivityAt || other.lastActivityAt > survivor.lastActivityAt)) {
    patch.lastActivityAt = other.lastActivityAt;
  }
  patch.editedFields = JSON.stringify([...new Set([...survivor.editedFields, ...other.editedFields])]);
  await contacts.updateEntity(patch, "Merge");

  await deleteRow(contacts, hashPartition(otherId), otherId);

  const merged = await getContact(survivorId);
  await audit(
    {
      who,
      action: "contact.merge",
      entity: "contact",
      entityId: survivorId,
      before: { ...before, mergedFrom: undefined },
      after: { ...(merged ? comparable(merged) : {}), mergedFrom: otherId, movedActivities: summary.activities },
    },
    now,
  );
  await audit(
    { who, action: "contact.merged_into", entity: "contact", entityId: otherId, before: null, after: { mergedInto: survivorId } },
    now,
  );
  return summary;
}

// ----- Delete -----

export type DeleteSummary = { activities: number; memberships: number; followUps: number; emails: number };

/**
 * Remove a contact and everything about it (FR-17), and tombstone each of its
 * email hashes so writers and imports never create it again.
 */
export async function deleteContact(contactId: string, who: string, now = new Date()): Promise<DeleteSummary | null> {
  if (!CONTACT_ID_RE.test(contactId)) return null;
  const contacts = await getTable("contacts");
  const tombstones = await getTable("tombstones");
  const contact = await getContact(contactId);
  if (!contacts || !tombstones || !contact) return null;

  const summary: DeleteSummary = { activities: 0, memberships: 0, followUps: 0, emails: 0 };

  // Tombstones first: from here on no writer can bring the contact back, even mid-delete.
  const aliases = await aliasRowsFor(contactId);
  const hashes = new Set([emailHash(contact.email), ...aliases.map((a) => a.rowKey)]);
  for (const h of hashes) {
    await tombstones.upsertEntity({ partitionKey: "email", rowKey: h, deletedAt: now.toISOString() }, "Replace");
    summary.emails++;
  }

  const acts = await contactActivities(contactId);
  const byMonth = await getTable("activityByMonth");
  if (acts) {
    for (const a of acts.rows) {
      if (byMonth) await deleteRow(byMonth, monthKey(Date.parse(a.occurredAt)), a.rowKey);
      const mk = markerKeys(a.source, a.sourceId);
      await deleteRow(acts.table, mk.partitionKey, mk.rowKey);
      await deleteRow(acts.table, contactId, a.rowKey);
      summary.activities++;
    }
  }

  const members = await memberRows(contactId);
  if (members) {
    for (const m of members.rows) {
      await deleteRow(members.table, m.partitionKey, contactId);
      summary.memberships++;
    }
    for (const ix of await indexRowsFor(members.table, contactId)) {
      await deleteRow(members.table, ix.partitionKey, ix.rowKey);
    }
  }

  const fus = await followUpRows(contactId);
  if (fus) {
    for (const f of [...fus.own, ...fus.index]) {
      await deleteRow(fus.table, f.partitionKey, f.rowKey);
      if (f.partitionKey === contactId) summary.followUps++;
    }
  }

  for (const a of aliases) await deleteRow(contacts, a.partitionKey, a.rowKey);
  await deleteRow(contacts, hashPartition(contactId), contactId);

  // The contact ID is a hash; the audit row holds no email or name.
  await audit(
    { who, action: "contact.delete", entity: "contact", entityId: contactId, before: null, after: { ...summary } },
    now,
  );
  return summary;
}
