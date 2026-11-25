import { randomBytes } from "node:crypto";
import { audit } from "@/lib/market/audit";
import { listMembers } from "@/lib/market/campaigns";
import { STEP_ANCHORS, STEP_AUDIENCES, STEP_DAYS_MAX, describeStep, type StepAnchor, type StepAudience } from "@/lib/market/step-text";
import { getTable, statusOf } from "@/lib/market/tables";

/**
 * Follow-up steps (phase 2 FR-09, owner decision 5). A step says when a
 * follow-up is due and for whom: "7 days after first email, no reply". The
 * daily job (task 041) turns steps into follow-ups; this module only keeps
 * the steps.
 *
 *   MaSteps  partition: campaign slug   row key: step ID
 *
 * Removing a step keeps the follow-ups it already made.
 */

export { STEP_ANCHORS, STEP_AUDIENCES, STEP_DAYS_MAX, describeStep, type StepAnchor, type StepAudience };

const NAME_MAX = 120;
const GROUP_MAX = 100;
const ID_RE = /^[0-9a-f]{12}$/;

export type Step = {
  campaignSlug: string;
  id: string;
  /** The follow-up's title. */
  name: string;
  days: number;
  anchor: StepAnchor;
  audience: StepAudience;
  /** Only members with this group label; unset means every group. */
  group?: string;
  order: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StepInput = { name: string; days: number; anchor: StepAnchor; audience: StepAudience; group?: string };
export type StepPatch = Partial<Omit<StepInput, "group">> & { group?: string | null; enabled?: boolean };

export class StepError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "StepError";
  }
}

const FIELDS = new Set(["name", "days", "anchor", "audience", "group", "enabled"]);

/** Check a step body. With `partial`, only the fields sent are checked. Throws StepError. */
export function parseStep(body: unknown, opts: { partial: true }): StepPatch;
export function parseStep(body: unknown, opts?: { partial?: false }): StepInput;
export function parseStep(body: unknown, opts: { partial?: boolean } = {}): StepInput | StepPatch {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new StepError("Expected an object");
  const input = body as Record<string, unknown>;
  for (const k of Object.keys(input)) if (!FIELDS.has(k)) throw new StepError(`${k} cannot be set`);
  if (!opts.partial && "enabled" in input) throw new StepError("enabled cannot be set on a new step");
  const out: StepPatch = {};
  const need = (k: string) => !opts.partial || k in input;

  if (need("name")) {
    const v = typeof input.name === "string" ? input.name.replace(/\s+/g, " ").trim() : "";
    if (!v) throw new StepError("A step needs a name");
    if (v.length > NAME_MAX) throw new StepError(`The name is longer than ${NAME_MAX} characters`);
    out.name = v;
  }
  if (need("days")) {
    const v = typeof input.days === "string" && input.days.trim() ? Number(input.days) : input.days;
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > STEP_DAYS_MAX) {
      throw new StepError(`Days must be a whole number from 0 to ${STEP_DAYS_MAX}`);
    }
    out.days = v;
  }
  if (need("anchor")) {
    if (!(STEP_ANCHORS as readonly unknown[]).includes(input.anchor)) throw new StepError("Unknown anchor");
    out.anchor = input.anchor as StepAnchor;
  }
  if (need("audience")) {
    if (!(STEP_AUDIENCES as readonly unknown[]).includes(input.audience)) throw new StepError("Unknown audience");
    out.audience = input.audience as StepAudience;
  }
  if ("group" in input) {
    const v = input.group;
    if (v === null || v === "" || v === undefined) out.group = opts.partial ? null : undefined;
    else if (typeof v !== "string" || v.length > GROUP_MAX) throw new StepError("The group must be short text");
    else out.group = v.replace(/\s+/g, " ").trim() || (opts.partial ? null : undefined);
  }
  if ("enabled" in input) {
    if (typeof input.enabled !== "boolean") throw new StepError("enabled must be true or false");
    out.enabled = input.enabled;
  }
  return out;
}

type StepEntity = Omit<Step, "campaignSlug" | "id"> & { partitionKey: string; rowKey: string };

function fromEntity(e: StepEntity): Step {
  return {
    campaignSlug: e.partitionKey,
    id: e.rowKey,
    name: e.name,
    days: Number(e.days) || 0,
    anchor: (STEP_ANCHORS as readonly string[]).includes(e.anchor) ? e.anchor : "first-email",
    audience: (STEP_AUDIENCES as readonly string[]).includes(e.audience) ? e.audience : "everyone",
    group: e.group || undefined,
    order: Number(e.order) || 0,
    enabled: e.enabled !== false,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

function toEntity(s: Step): StepEntity {
  const { campaignSlug, id, group, ...rest } = s;
  return { partitionKey: campaignSlug, rowKey: id, ...rest, group: group ?? "" };
}

async function table() {
  const t = await getTable("steps");
  if (!t) throw new StepError("Storage is not configured", 503);
  return t;
}

/** A campaign's steps in order. */
export async function listSteps(slug: string): Promise<Step[]> {
  const t = await getTable("steps");
  if (!t) return [];
  const out: Step[] = [];
  for await (const e of t.listEntities<StepEntity>({ queryOptions: { filter: `PartitionKey eq '${slug.replace(/'/g, "''")}'` } })) {
    out.push(fromEntity(e));
  }
  return out.sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt));
}

export async function getStep(slug: string, id: string): Promise<Step | null> {
  if (!ID_RE.test(id)) return null;
  const t = await table();
  try {
    return fromEntity(await t.getEntity<StepEntity>(slug, id));
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

/** The group labels members of the campaign carry. */
export async function campaignGroups(slug: string): Promise<string[]> {
  return [...new Set((await listMembers(slug)).map((m) => m.group).filter((g): g is string => Boolean(g)))].sort();
}

async function checkGroup(slug: string, group: string | null | undefined): Promise<void> {
  if (!group) return;
  if (!(await campaignGroups(slug)).includes(group)) throw new StepError("No member of this campaign has that group");
}

function auditable(s: Step): Record<string, unknown> {
  return { name: s.name, days: s.days, anchor: s.anchor, audience: s.audience, group: s.group, order: s.order, enabled: s.enabled };
}

export async function createStep(slug: string, input: StepInput, who: string, now = new Date()): Promise<Step> {
  await checkGroup(slug, input.group);
  const t = await table();
  const existing = await listSteps(slug);
  const at = now.toISOString();
  const step: Step = {
    campaignSlug: slug,
    id: randomBytes(6).toString("hex"),
    name: input.name,
    days: input.days,
    anchor: input.anchor,
    audience: input.audience,
    group: input.group,
    order: existing.length ? Math.max(...existing.map((s) => s.order)) + 1 : 0,
    enabled: true,
    createdAt: at,
    updatedAt: at,
  };
  await t.createEntity(toEntity(step));
  await audit({ who, action: "step.create", entity: "step", entityId: `${slug}/${step.id}`, after: auditable(step) }, now);
  return step;
}

/**
 * Change a step. A change of `enabled` alone is audited as step.switch;
 * anything else as step.edit. Returns null when there is no such step.
 */
export async function editStep(slug: string, id: string, patch: StepPatch, who: string, now = new Date()): Promise<Step | null> {
  const before = await getStep(slug, id);
  if (!before) return null;
  if (patch.group) await checkGroup(slug, patch.group);
  const after: Step = { ...before };
  if (patch.name !== undefined) after.name = patch.name;
  if (patch.days !== undefined) after.days = patch.days;
  if (patch.anchor !== undefined) after.anchor = patch.anchor;
  if (patch.audience !== undefined) after.audience = patch.audience;
  if ("group" in patch) after.group = patch.group ?? undefined;
  if (patch.enabled !== undefined) after.enabled = patch.enabled;
  const b = auditable(before);
  const a = auditable(after);
  const changed = Object.keys(a).filter((k) => a[k] !== b[k]);
  if (!changed.length) return before;
  after.updatedAt = now.toISOString();
  await (await table()).updateEntity(toEntity(after), "Replace");
  const action = changed.length === 1 && changed[0] === "enabled" ? "step.switch" : "step.edit";
  await audit({ who, action, entity: "step", entityId: `${slug}/${id}`, before: b, after: a }, now);
  return after;
}

/** Put the steps in the order given; the list must name every step once. */
export async function reorderSteps(slug: string, ids: unknown, who: string, now = new Date()): Promise<Step[]> {
  const steps = await listSteps(slug);
  if (!Array.isArray(ids) || ids.length !== steps.length || new Set(ids).size !== ids.length) {
    throw new StepError("Send every step once, in the new order");
  }
  const byId = new Map(steps.map((s) => [s.id, s]));
  if (!ids.every((id) => typeof id === "string" && byId.has(id))) throw new StepError("Send every step once, in the new order");
  const t = await table();
  const out: Step[] = [];
  for (const [i, id] of (ids as string[]).entries()) {
    const s = byId.get(id)!;
    if (s.order !== i) await t.updateEntity({ partitionKey: slug, rowKey: id, order: i, updatedAt: now.toISOString() }, "Merge");
    out.push({ ...s, order: i });
  }
  await audit(
    { who, action: "step.order", entity: "campaign", entityId: slug, before: { order: steps.map((s) => s.id).join(",") }, after: { order: ids.join(",") } },
    now,
  );
  return out;
}

/** Remove a step. The follow-ups it already made stay. Returns false when there is no such step. */
export async function deleteStep(slug: string, id: string, who: string, now = new Date()): Promise<boolean> {
  const before = await getStep(slug, id);
  if (!before) return false;
  await (await table()).deleteEntity(slug, id);
  await audit({ who, action: "step.delete", entity: "step", entityId: `${slug}/${id}`, before: auditable(before) }, now);
  return true;
}
