import { randomBytes } from "node:crypto";
import { getTable } from "@/lib/market/tables";
import { invertedTime, monthKey } from "@/lib/market/keys";

/**
 * Admin audit log (NFR-06): who changed what, and when.
 *
 *   MaAudit  partition: yyyy-mm (UTC)   row key: inverted time + random suffix
 *
 * Only the names of changed fields and short versions of their values are
 * kept, so the log never becomes a second copy of the records.
 */

const VALUE_MAX = 80;
const MAX_CHANGES = 40;

export type AuditInput = {
  /** The signed-in user's address, or "system" for automated changes. */
  who: string;
  /** For example "contact.edit", "contact.merge", "member.status_override". */
  action: string;
  /** For example "contact", "organization", "member". */
  entity: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
};

export type AuditChange = { field: string; from?: string; to?: string };

export type AuditEntry = {
  id: string;
  at: string;
  who: string;
  action: string;
  entity: string;
  entityId: string;
  changes: AuditChange[];
};

function short(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const s = typeof value === "string" ? value : JSON.stringify(value);
  const one = s.replace(/\s+/g, " ").trim();
  return one.length > VALUE_MAX ? `${one.slice(0, VALUE_MAX - 3)}...` : one;
}

/** The fields that differ between two versions of a record. */
export function diffFields(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined,
): AuditChange[] {
  const fields = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  const changes: AuditChange[] = [];
  for (const field of [...fields].sort()) {
    const from = before?.[field];
    const to = after?.[field];
    if (JSON.stringify(from) === JSON.stringify(to)) continue;
    changes.push({ field, from: short(from), to: short(to) });
  }
  return changes.slice(0, MAX_CHANGES);
}

type AuditEntity = {
  partitionKey: string;
  rowKey: string;
  at: string;
  who: string;
  action: string;
  entity: string;
  entityId: string;
  changes: string;
};

/**
 * Write one audit entry. Throws on storage errors, so an admin edit can fail
 * rather than go unrecorded. Returns null without storage.
 */
export async function audit(input: AuditInput, now = new Date()): Promise<AuditEntry | null> {
  if (!input.who || !input.action || !input.entity || !input.entityId) {
    throw new Error("Audit entries need who, action, entity and entityId");
  }
  const table = await getTable("audit");
  if (!table) return null;
  const ms = now.getTime();
  const changes = diffFields(input.before, input.after);
  const row: AuditEntity = {
    partitionKey: monthKey(ms),
    rowKey: `${invertedTime(ms)}-${randomBytes(4).toString("hex")}`,
    at: now.toISOString(),
    who: input.who.slice(0, 200),
    action: input.action.slice(0, 100),
    entity: input.entity.slice(0, 50),
    entityId: input.entityId.slice(0, 200),
    changes: JSON.stringify(changes),
  };
  await table.createEntity(row);
  return { id: row.rowKey, at: row.at, who: row.who, action: row.action, entity: row.entity, entityId: row.entityId, changes };
}

/** Audit entries for one month, newest first. */
export async function listAudit(month: string, max = 200): Promise<AuditEntry[]> {
  const table = await getTable("audit");
  if (!table || !/^\d{4}-\d{2}$/.test(month)) return [];
  const out: AuditEntry[] = [];
  for await (const e of table.listEntities<AuditEntity>({ queryOptions: { filter: `PartitionKey eq '${month}'` } })) {
    let changes: AuditChange[] = [];
    try {
      changes = JSON.parse(e.changes) as AuditChange[];
    } catch {
      // A malformed row still shows who and when.
    }
    out.push({ id: e.rowKey, at: e.at, who: e.who, action: e.action, entity: e.entity, entityId: e.entityId, changes });
    if (out.length >= max) break;
  }
  return out;
}
