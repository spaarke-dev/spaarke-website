import { getTable, statusOf } from "@/lib/market/tables";
import { emailHash, normalizeEmail } from "@/lib/market/keys";
import { audit } from "@/lib/market/audit";
import { VISIBILITIES, type Visibility } from "@/lib/market/types";
import { getMailSettings, listMessagesSince, MailGraphError, type MailDeps, type MailSettings } from "@/lib/market/graph-mail";

/**
 * The mailbox registry (FR-08): which mailboxes the mail sync reads.
 *
 *   MaMailboxes  partition: mailbox   row key: SHA-256 of the address
 *
 * Addresses live only here, never in code or app settings. Registering a
 * mailbox does not grant access: it must also be in the Exchange management
 * scope (docs/market-access-mailboxes.md). The sync (task 042) records each
 * run's outcome with `recordSync`; "Check access" on the page records its
 * outcome with `recordCheck`, kept apart so a check never hides a sync error.
 */

export const MAILBOX_KINDS = ["personal", "shared"] as const;
export type MailboxKind = (typeof MAILBOX_KINDS)[number];

export const MAILBOX_MODES = ["known-only", "capture-new"] as const;
export type MailboxMode = (typeof MAILBOX_MODES)[number];

export type Mailbox = {
  /** SHA-256 of the normalized address; the row key. */
  id: string;
  address: string;
  label: string;
  kind: MailboxKind;
  /** `known-only` logs mail with known contacts; `capture-new` also queues new senders for triage. */
  mode: MailboxMode;
  /** Visibility of contacts and activities this mailbox creates. */
  visibility: Visibility;
  enabled: boolean;
  /** The last sync that finished without an error. */
  lastSyncAt?: string;
  /** The last sync's error, cleared by a sync that succeeds. */
  lastError?: string;
  lastErrorAt?: string;
  /** The last "Check access" from the page, and its error if it failed. */
  checkedAt?: string;
  checkError?: string;
  createdAt: string;
  updatedAt: string;
};

export class MailboxError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "MailboxError";
  }
}

const PARTITION = "mailbox";
const LABEL_MAX = 100;
const ERROR_MAX = 300;
const ID_RE = /^[0-9a-f]{64}$/;

export function isMailboxId(id: string): boolean {
  return ID_RE.test(id);
}

type Entity = {
  partitionKey: string;
  rowKey: string;
  address: string;
  label: string;
  kind: string;
  mode: string;
  visibility: string;
  enabled: boolean;
  lastSyncAt?: string;
  lastError?: string;
  lastErrorAt?: string;
  checkedAt?: string;
  checkError?: string;
  createdAt: string;
  updatedAt: string;
};

function pick<T extends string>(list: readonly T[], value: string, fallback: T): T {
  return (list as readonly string[]).includes(value) ? (value as T) : fallback;
}

function fromEntity(e: Entity): Mailbox {
  return {
    id: e.rowKey,
    address: e.address,
    label: e.label || e.address,
    kind: pick(MAILBOX_KINDS, e.kind, "personal"),
    mode: pick(MAILBOX_MODES, e.mode, "known-only"),
    visibility: pick(VISIBILITIES, e.visibility, "general"),
    enabled: e.enabled !== false,
    lastSyncAt: e.lastSyncAt || undefined,
    lastError: e.lastError || undefined,
    lastErrorAt: e.lastErrorAt || undefined,
    checkedAt: e.checkedAt || undefined,
    checkError: e.checkError || undefined,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

/** One line, at most ERROR_MAX characters. Errors from the Graph client never carry message content. */
function shortError(message: string): string {
  const one = message.replace(/\s+/g, " ").trim() || "The sync failed";
  return one.length > ERROR_MAX ? `${one.slice(0, ERROR_MAX - 3)}...` : one;
}

// ---- Input (pure) ----

export type NewMailbox = {
  address: string;
  label: string;
  kind: MailboxKind;
  mode: MailboxMode;
  visibility: Visibility;
};

export type MailboxPatch = Partial<Omit<NewMailbox, "address">> & { enabled?: boolean };

const EDITABLE = new Set(["label", "kind", "mode", "visibility", "enabled"]);

function oneOf<T extends string>(list: readonly T[], value: unknown, field: string): T {
  if (typeof value !== "string" || !(list as readonly string[]).includes(value)) {
    throw new MailboxError(400, `${field} must be one of: ${list.join(", ")}`);
  }
  return value as T;
}

function labelOf(value: unknown): string {
  if (typeof value !== "string") throw new MailboxError(400, "label must be text");
  return value.replace(/\s+/g, " ").trim().slice(0, LABEL_MAX);
}

/**
 * A new mailbox from the add form. The kind decides the defaults: a personal
 * mailbox logs known contacts only; a shared one also queues new senders.
 */
export function parseNewMailbox(body: unknown): NewMailbox {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new MailboxError(400, "Send an object");
  const b = body as Record<string, unknown>;
  const address = normalizeEmail(b.address);
  if (!address) throw new MailboxError(400, "Enter one mailbox address");
  const kind = b.kind === undefined ? "personal" : oneOf(MAILBOX_KINDS, b.kind, "kind");
  const mode =
    b.mode === undefined || b.mode === "" ? (kind === "shared" ? "capture-new" : "known-only") : oneOf(MAILBOX_MODES, b.mode, "mode");
  const visibility = b.visibility === undefined || b.visibility === "" ? "general" : oneOf(VISIBILITIES, b.visibility, "visibility");
  const label = b.label === undefined ? "" : labelOf(b.label);
  return { address, label: label || address, kind, mode, visibility };
}

/** An edit: only the editable fields, each checked. The address is fixed; remove and add again to change it. */
export function parseMailboxPatch(body: unknown): MailboxPatch {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new MailboxError(400, "Send an object");
  const b = body as Record<string, unknown>;
  const unknown = Object.keys(b).filter((k) => !EDITABLE.has(k));
  if (unknown.length) throw new MailboxError(400, `Not editable: ${unknown.join(", ")}`);
  const patch: MailboxPatch = {};
  if ("label" in b) patch.label = labelOf(b.label);
  if ("kind" in b) patch.kind = oneOf(MAILBOX_KINDS, b.kind, "kind");
  if ("mode" in b) patch.mode = oneOf(MAILBOX_MODES, b.mode, "mode");
  if ("visibility" in b) patch.visibility = oneOf(VISIBILITIES, b.visibility, "visibility");
  if ("enabled" in b) {
    if (typeof b.enabled !== "boolean") throw new MailboxError(400, "enabled must be true or false");
    patch.enabled = b.enabled;
  }
  if (Object.keys(patch).length === 0) throw new MailboxError(400, "Nothing to change");
  return patch;
}

// ---- Storage ----

async function table() {
  const t = await getTable("mailboxes");
  if (!t) throw new MailboxError(503, "Storage is not configured");
  return t;
}

/** Every registered mailbox, by label. Empty without storage. */
export async function listMailboxes(): Promise<Mailbox[]> {
  const t = await getTable("mailboxes");
  if (!t) return [];
  const out: Mailbox[] = [];
  for await (const e of t.listEntities<Entity>({ queryOptions: { filter: `PartitionKey eq '${PARTITION}'` } })) {
    out.push(fromEntity(e));
  }
  return out.sort((a, b) => a.label.localeCompare(b.label) || a.address.localeCompare(b.address));
}

/** The enabled mailboxes, for the sync. */
export async function enabledMailboxes(): Promise<Mailbox[]> {
  return (await listMailboxes()).filter((m) => m.enabled);
}

export async function getMailbox(id: string): Promise<Mailbox | null> {
  if (!isMailboxId(id)) return null;
  const t = await getTable("mailboxes");
  if (!t) return null;
  try {
    return fromEntity(await t.getEntity<Entity>(PARTITION, id));
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

function auditable(m: Mailbox | NewMailbox | MailboxPatch): Record<string, unknown> {
  const { label, kind, mode, visibility } = m as Mailbox;
  const out: Record<string, unknown> = { label, kind, mode, visibility };
  if ("address" in m) out.address = m.address;
  if ("enabled" in m) out.enabled = m.enabled;
  return out;
}

export async function addMailbox(input: NewMailbox, who: string, now = new Date()): Promise<Mailbox> {
  const t = await table();
  const at = now.toISOString();
  const row: Entity = {
    partitionKey: PARTITION,
    rowKey: emailHash(input.address),
    address: input.address,
    label: input.label,
    kind: input.kind,
    mode: input.mode,
    visibility: input.visibility,
    enabled: true,
    createdAt: at,
    updatedAt: at,
  };
  try {
    await t.createEntity(row);
  } catch (err) {
    if (statusOf(err) === 409) throw new MailboxError(409, "This mailbox is already registered");
    throw err;
  }
  const mailbox = fromEntity(row);
  await audit({ who, action: "mailbox.add", entity: "mailbox", entityId: mailbox.id, after: auditable(mailbox) }, now);
  return mailbox;
}

/** Change the label, kind, mode, visibility, or pause and resume. */
export async function editMailbox(id: string, patch: MailboxPatch, who: string, now = new Date()): Promise<Mailbox> {
  const before = await getMailbox(id);
  if (!before) throw new MailboxError(404, "No such mailbox");
  const t = await table();
  const changes: Partial<Entity> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined && v !== before[k as keyof Mailbox]) (changes as Record<string, unknown>)[k] = v;
  }
  if (Object.keys(changes).length === 0) return before;
  if (changes.label === "") changes.label = before.address;
  const update = { partitionKey: PARTITION, rowKey: id, ...changes, updatedAt: now.toISOString() };
  await t.updateEntity(update, "Merge");
  const after = { ...before, ...changes, updatedAt: update.updatedAt } as Mailbox;
  const action = "enabled" in changes && Object.keys(changes).length === 1 ? (changes.enabled ? "mailbox.resume" : "mailbox.pause") : "mailbox.edit";
  await audit({ who, action, entity: "mailbox", entityId: id, before: auditable(before), after: auditable(after) }, now);
  return after;
}

/**
 * Take a mailbox out of the registry, so the sync stops reading it. Activities
 * already logged from it stay on their contacts. It does not remove Exchange
 * access; that is a separate admin step.
 */
export async function removeMailbox(id: string, who: string, now = new Date()): Promise<Mailbox> {
  const before = await getMailbox(id);
  if (!before) throw new MailboxError(404, "No such mailbox");
  const t = await table();
  try {
    await t.deleteEntity(PARTITION, id);
  } catch (err) {
    if (statusOf(err) !== 404) throw err;
  }
  await audit({ who, action: "mailbox.remove", entity: "mailbox", entityId: id, before: auditable(before) }, now);
  return before;
}

/**
 * Record a sync run's outcome (task 042). Success sets the last sync time and
 * clears the error; a failure keeps the last good time and records the error.
 * A merge, so an admin edit made during the run is kept. A mailbox removed
 * during the run is left removed.
 */
export async function recordSync(id: string, outcome: { error?: string }, now = new Date()): Promise<void> {
  const t = await getTable("mailboxes");
  if (!t || !isMailboxId(id)) return;
  const at = now.toISOString();
  const fields =
    outcome.error === undefined
      ? { lastSyncAt: at, lastError: "", lastErrorAt: "" }
      : { lastError: shortError(outcome.error), lastErrorAt: at };
  try {
    await t.updateEntity({ partitionKey: PARTITION, rowKey: id, ...fields }, "Merge");
  } catch (err) {
    if (statusOf(err) !== 404) throw err;
  }
}

/** Record a "Check access" outcome from the page. */
export async function recordCheck(id: string, outcome: { error?: string }, now = new Date()): Promise<void> {
  const t = await getTable("mailboxes");
  if (!t || !isMailboxId(id)) return;
  const fields = { checkedAt: now.toISOString(), checkError: outcome.error === undefined ? "" : shortError(outcome.error) };
  try {
    await t.updateEntity({ partitionKey: PARTITION, rowKey: id, ...fields }, "Merge");
  } catch (err) {
    if (statusOf(err) !== 404) throw err;
  }
}

/**
 * Ask Graph for one Inbox message from the last day, to show whether the
 * mailbox is inside the Exchange scope before the first sync. Records and
 * returns the outcome. Reads metadata only, like the sync.
 */
export async function checkAccess(
  mailbox: Mailbox,
  opts: MailDeps & { settings?: MailSettings | null } = {},
  now = new Date(),
): Promise<{ ok: true } | { ok: false; error: string }> {
  const settings = opts.settings === undefined ? getMailSettings() : opts.settings;
  if (!settings) throw new MailboxError(503, "The Graph settings are not configured");
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  let error: string | undefined;
  try {
    for await (const _ of listMessagesSince(settings, mailbox.address, "inbox", since, { fetch: opts.fetch, token: opts.token, max: 1 })) {
      void _;
    }
  } catch (err) {
    error = err instanceof MailGraphError ? err.message : "Microsoft Graph did not answer. Try again in a minute.";
    if (!(err instanceof MailGraphError)) console.error("[mailboxes] access check failed:", (err as Error).message);
  }
  await recordCheck(mailbox.id, { error }, now);
  return error === undefined ? { ok: true } : { ok: false, error };
}
