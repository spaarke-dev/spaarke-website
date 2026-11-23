import { getTable, statusOf } from "@/lib/market/tables";
import { emailDomain, emailHash, isFreeMailDomain, normalizeEmail } from "@/lib/market/keys";
import { emailSourceId, messageKey, SYNC_SOURCE } from "@/lib/market/mail-keys";
import { addAlternateEmail, findContactByEmail, resolveContact } from "@/lib/market/contacts";
import { recordActivity } from "@/lib/market/activity";
import { audit } from "@/lib/market/audit";
import { getMailbox } from "@/lib/market/mailboxes";
import { isVisibleTo, widen } from "@/lib/market/visibility";
import type { Visibility } from "@/lib/market/types";

/**
 * The triage queue for `capture-new` mailboxes (FR-08, NFR-05): inbound mail
 * from senders who are not contacts yet, waiting for a person to accept, link
 * or dismiss it. Nothing here is a contact.
 *
 *   MaTriage  partition: sender email hash   row key: message key   one queued message
 *             partition: block               row key: sender:<hash> or domain:<domain>
 *
 * Only the sender, display name, subject, time, Outlook link and mailbox are
 * kept. The sync (task 042) queues messages; /admin/triage (task 043) acts on
 * a sender:
 *
 * - accept creates the contact (with the mailbox's default visibility) and an
 *   `email.received` activity for each queued message, then empties the queue
 *   for that sender;
 * - link adds the sender as an alternate email on an existing contact, then
 *   does the same;
 * - dismiss blocks the sender, or the whole domain, so the sync stops queueing
 *   them; dismissed entries are deleted after 30 days (`cleanupDismissed`).
 *
 * The activities use the source IDs the sync would have used, so mail the sync
 * sees again after an accept is never logged twice.
 */

export const TRIAGE_STATES = ["new", "dismissed"] as const;
export type TriageState = (typeof TRIAGE_STATES)[number];

export type TriageInput = {
  sender: string;
  name?: string;
  subject?: string;
  receivedAt: string;
  webLink?: string;
  mailboxId: string;
  mailbox: string;
  /** Stable per message (see messageKey). */
  messageKey: string;
};

const BLOCK = "block";

function trimTo(value: string | undefined, max: number): string | undefined {
  const v = value?.replace(/\s+/g, " ").trim();
  if (!v) return undefined;
  return v.length > max ? `${v.slice(0, max - 3)}...` : v;
}

export { messageKey };

/** Whether a sender, or their domain, was dismissed for good. */
export async function isBlocked(raw: string): Promise<boolean> {
  const email = normalizeEmail(raw);
  const table = await getTable("triage");
  if (!email || !table) return false;
  for (const rowKey of [`sender:${emailHash(email)}`, `domain:${emailDomain(email)}`]) {
    try {
      await table.getEntity(BLOCK, rowKey);
      return true;
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
  }
  return false;
}

/**
 * Queue one message. Returns false when it was already queued (a repeat sync,
 * or the same message in a second mailbox), so a dismissed entry stays
 * dismissed.
 */
export async function queueTriage(input: TriageInput, now = new Date()): Promise<boolean> {
  const sender = normalizeEmail(input.sender);
  const table = await getTable("triage");
  if (!sender || !table) return false;
  try {
    const row = {
      partitionKey: emailHash(sender),
      rowKey: input.messageKey,
      sender,
      name: trimTo(input.name, 200),
      subject: trimTo(input.subject, 300),
      receivedAt: input.receivedAt,
      webLink: trimTo(input.webLink, 2000),
      mailboxId: input.mailboxId,
      mailbox: input.mailbox,
      state: "new" satisfies TriageState,
      queuedAt: now.toISOString(),
    };
    await table.createEntity(Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined)) as typeof row);
    return true;
  } catch (err) {
    if (statusOf(err) === 409) return false;
    throw err;
  }
}

// ---- Reading the queue (task 043) ----

export const DISMISSED_KEEP_DAYS = 30;

export type TriageEntry = {
  partitionKey: string;
  rowKey: string;
  sender: string;
  name?: string;
  subject?: string;
  receivedAt: string;
  webLink?: string;
  mailboxId: string;
  mailbox: string;
  state: TriageState;
  queuedAt: string;
  dismissedAt?: string;
};

export type TriageMessage = { key: string; subject?: string; receivedAt: string; webLink?: string; mailbox: string };

export type TriageSender = {
  /** The sender's email hash; the partition key. */
  id: string;
  sender: string;
  name?: string;
  domain: string;
  /** Investor when any message came through an investor mailbox. */
  visibility: Visibility;
  messages: TriageMessage[];
  latestAt: string;
};

export class TriageError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "TriageError";
  }
}

const SENDER_ID_RE = /^[0-9a-f]{64}$/;

async function table() {
  const t = await getTable("triage");
  if (!t) throw new TriageError(503, "Storage is not configured");
  return t;
}

async function entries(filter: string): Promise<TriageEntry[]> {
  const t = await getTable("triage");
  if (!t) return [];
  const out: TriageEntry[] = [];
  for await (const e of t.listEntities<TriageEntry>({ queryOptions: { filter } })) out.push(e);
  return out;
}

/** Each mailbox's default visibility, looked up once per call. A removed mailbox counts as general. */
async function visibilityOf(mailboxIds: Iterable<string>): Promise<Map<string, Visibility>> {
  const out = new Map<string, Visibility>();
  for (const id of new Set(mailboxIds)) out.set(id, (await getMailbox(id))?.visibility ?? "general");
  return out;
}

/** Group queued entries by sender, newest sender first. Pure, so the checks can run it. */
export function groupBySender(rows: readonly TriageEntry[], vis: ReadonlyMap<string, Visibility>): TriageSender[] {
  const by = new Map<string, TriageSender>();
  for (const e of rows) {
    let g = by.get(e.partitionKey);
    if (!g) {
      g = { id: e.partitionKey, sender: e.sender, domain: emailDomain(e.sender), visibility: "general", messages: [], latestAt: e.receivedAt };
      by.set(e.partitionKey, g);
    }
    if (e.name && !g.name) g.name = e.name;
    g.visibility = widen(g.visibility, vis.get(e.mailboxId));
    g.messages.push({ key: e.rowKey, subject: e.subject, receivedAt: e.receivedAt, webLink: e.webLink, mailbox: e.mailbox });
    if (e.receivedAt > g.latestAt) g.latestAt = e.receivedAt;
  }
  for (const g of by.values()) g.messages.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  return [...by.values()].sort((a, b) => b.latestAt.localeCompare(a.latestAt));
}

/** The senders waiting in triage that the user may see. */
export async function listTriage(roles: readonly string[]): Promise<TriageSender[]> {
  const rows = await entries("state eq 'new'");
  const vis = await visibilityOf(rows.map((r) => r.mailboxId));
  return groupBySender(rows, vis).filter((g) => isVisibleTo(g, roles));
}

async function senderQueue(senderId: string, roles: readonly string[]): Promise<{ group: TriageSender; rows: TriageEntry[] }> {
  if (!SENDER_ID_RE.test(senderId)) throw new TriageError(404, "No such sender in triage");
  const rows = await entries(`PartitionKey eq '${senderId}' and state eq 'new'`);
  const group = groupBySender(rows, await visibilityOf(rows.map((r) => r.mailboxId)))[0];
  // A sender the user may not see is reported as not found.
  if (!group || !isVisibleTo(group, roles)) throw new TriageError(404, "No such sender in triage");
  return { group, rows };
}

// ---- Accept and link ----

export type AcceptResult = { contactId: string; created: boolean; activities: number };

async function logAndClear(rows: TriageEntry[], contactId: string, visibility: Visibility): Promise<number> {
  const t = await table();
  let logged = 0;
  for (const e of rows) {
    const r = await recordActivity({
      type: "email.received",
      source: SYNC_SOURCE,
      sourceId: emailSourceId("email.received", e.rowKey, e.sender),
      occurredAt: e.receivedAt,
      contactId,
      visibility,
      subject: e.subject,
      webLink: e.webLink,
      mailbox: e.mailbox,
    });
    if (r.status === "recorded") logged++;
    // The message now lives on the timeline; the queue keeps nothing of it.
    try {
      await t.deleteEntity(e.partitionKey, e.rowKey);
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
  }
  return logged;
}

/** Make the sender a contact and log their queued mail. */
export async function acceptSender(senderId: string, roles: readonly string[], who: string, now = new Date()): Promise<AcceptResult> {
  const { group, rows } = await senderQueue(senderId, roles);
  const r = await resolveContact({ email: group.sender, name: group.name }, { visibility: group.visibility, source: "email.received", now });
  if (r.status === "tombstoned") throw new TriageError(409, "This address was deleted from the contacts and cannot be added again");
  if (r.status !== "created" && r.status !== "found") throw new TriageError(503, "The contact could not be created");
  const activities = await logAndClear(rows, r.contact.id, group.visibility);
  await audit(
    { who, action: "triage.accept", entity: "contact", entityId: r.contact.id, after: { messages: rows.length, created: r.status === "created" } },
    now,
  );
  return { contactId: r.contact.id, created: r.status === "created", activities };
}

/** Add the sender as another address of an existing contact, then log their queued mail there. */
export async function linkSender(
  senderId: string,
  contactEmail: string,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<AcceptResult> {
  const { group, rows } = await senderQueue(senderId, roles);
  const contact = normalizeEmail(contactEmail) ? await findContactByEmail(contactEmail) : null;
  if (!contact || !isVisibleTo(contact, roles)) throw new TriageError(404, "No contact has that email address");
  const added = await addAlternateEmail(contact.id, group.sender);
  if (added === "taken") throw new TriageError(409, "This sender is already another contact's address; open that contact instead");
  const activities = await logAndClear(rows, contact.id, group.visibility);
  await audit(
    { who, action: "triage.link", entity: "contact", entityId: contact.id, after: { messages: rows.length, alternateEmail: added } },
    now,
  );
  return { contactId: contact.id, created: false, activities };
}

// ---- Dismiss ----

export type DismissResult = { scope: "sender" | "domain"; domain?: string; dismissed: number };

async function markDismissed(rows: TriageEntry[], now: Date): Promise<number> {
  const t = await table();
  for (const e of rows) {
    await t.updateEntity({ partitionKey: e.partitionKey, rowKey: e.rowKey, state: "dismissed", dismissedAt: now.toISOString() }, "Merge");
  }
  return rows.length;
}

/**
 * Stop queueing a sender, or everyone at their domain, and dismiss what is
 * waiting. A free-mail domain cannot be dismissed as a whole.
 */
export async function dismissSender(
  senderId: string,
  scope: "sender" | "domain",
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<DismissResult> {
  const { group, rows } = await senderQueue(senderId, roles);
  const t = await table();
  if (scope === "sender") {
    await t.upsertEntity({ partitionKey: BLOCK, rowKey: `sender:${senderId}`, kind: "sender", createdAt: now.toISOString() }, "Replace");
    const dismissed = await markDismissed(rows, now);
    await audit({ who, action: "triage.dismiss_sender", entity: "triage", entityId: senderId, after: { messages: dismissed } }, now);
    return { scope, dismissed };
  }
  if (isFreeMailDomain(group.domain)) {
    throw new TriageError(400, `${group.domain} is a free email provider; dismiss the sender instead`);
  }
  await t.upsertEntity(
    { partitionKey: BLOCK, rowKey: `domain:${group.domain}`, kind: "domain", domain: group.domain, createdAt: now.toISOString() },
    "Replace",
  );
  // Everyone waiting from the domain whom the user may see; the block covers the rest from now on.
  const all = await entries("state eq 'new'");
  const vis = await visibilityOf(all.map((r) => r.mailboxId));
  const visible = new Set(groupBySender(all, vis).filter((g) => isVisibleTo(g, roles)).map((g) => g.id));
  const atDomain = all.filter((e) => emailDomain(e.sender) === group.domain && visible.has(e.partitionKey));
  const dismissed = await markDismissed(atDomain, now);
  await audit(
    { who, action: "triage.dismiss_domain", entity: "triage", entityId: `domain:${group.domain}`, after: { messages: dismissed } },
    now,
  );
  return { scope, domain: group.domain, dismissed };
}

/** Delete dismissed entries older than DISMISSED_KEEP_DAYS (NFR-05). The block rows stay. Run by each sync. */
export async function cleanupDismissed(now = new Date()): Promise<number> {
  const t = await getTable("triage");
  if (!t) return 0;
  const cutoff = new Date(now.getTime() - DISMISSED_KEEP_DAYS * 86_400_000).toISOString();
  let removed = 0;
  for (const e of await entries(`state eq 'dismissed' and dismissedAt lt '${cutoff}'`)) {
    try {
      await t.deleteEntity(e.partitionKey, e.rowKey);
      removed++;
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
  }
  return removed;
}
