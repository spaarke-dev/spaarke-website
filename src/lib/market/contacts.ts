import { getTable, statusOf } from "@/lib/market/tables";
import { aliasKeys, contactKeys, emailHash, normalizeEmail } from "@/lib/market/keys";
import { resolveOrganization } from "@/lib/market/organizations";
import { widen } from "@/lib/market/visibility";
import {
  CONTACT_KINDS,
  HINT_FIELDS,
  type Contact,
  type ContactHints,
  type ContactKind,
  type Visibility,
} from "@/lib/market/types";

/**
 * Contacts: one record per person, keyed by the hash of the normalized email
 * (FR-03). Alternate emails are alias rows in the same table that point to
 * the contact. A tombstone (FR-17) stops a deleted contact from coming back.
 *
 *   MaContacts    partition hh          row key: contact ID (email hash)
 *                 partition alias-hh    row key: alias email hash -> contactId
 *   MaTombstones  partition "email"     row key: email hash
 */

type ContactEntity = {
  partitionKey: string;
  rowKey: string;
  rowType: "contact";
  email: string;
  name?: string;
  title?: string;
  organizationId?: string;
  linkedinUrl?: string;
  phone?: string;
  kind: ContactKind;
  stage: Contact["stage"];
  tags: string;
  owner?: string;
  visibility: Visibility;
  source?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  editedFields: string;
};

type AliasEntity = { partitionKey: string; rowKey: string; rowType: "alias"; contactId: string };

function parseList(value: unknown): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function fromEntity(e: ContactEntity): Contact {
  return {
    id: e.rowKey,
    email: e.email,
    name: e.name,
    title: e.title,
    organizationId: e.organizationId,
    linkedinUrl: e.linkedinUrl,
    phone: e.phone,
    kind: e.kind,
    stage: e.stage,
    tags: parseList(e.tags),
    owner: e.owner,
    visibility: e.visibility,
    source: e.source,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    lastActivityAt: e.lastActivityAt,
    editedFields: parseList(e.editedFields),
  };
}

function clean(value: string | undefined, max = 200): string | undefined {
  const v = value?.trim();
  return v ? v.slice(0, max) : undefined;
}

export async function getContact(contactId: string): Promise<Contact | null> {
  const table = await getTable("contacts");
  if (!table || !/^[0-9a-f]{64}$/.test(contactId)) return null;
  const k = contactKeys(contactId);
  try {
    return fromEntity(await table.getEntity<ContactEntity>(k.partitionKey, k.rowKey));
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

/** The contact an email belongs to, as its primary or an alternate address. */
export async function findContactByEmail(raw: string): Promise<Contact | null> {
  const email = normalizeEmail(raw);
  if (!email) return null;
  const hash = emailHash(email);
  const primary = await getContact(hash);
  if (primary) return primary;

  const table = await getTable("contacts");
  if (!table) return null;
  const k = aliasKeys(hash);
  try {
    const alias = await table.getEntity<AliasEntity>(k.partitionKey, k.rowKey);
    return getContact(alias.contactId);
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

export async function isTombstoned(normalizedEmail: string): Promise<boolean> {
  const table = await getTable("tombstones");
  if (!table) return false;
  try {
    await table.getEntity("email", emailHash(normalizedEmail));
    return true;
  } catch (err) {
    if (statusOf(err) === 404) return false;
    throw err;
  }
}

export type ResolveResult =
  | { status: "created" | "found"; contact: Contact }
  | { status: "invalid" }
  | { status: "tombstoned" }
  | { status: "unavailable" };

export type ResolveOptions = {
  visibility?: Visibility;
  /** The activity type that brought the contact in. Set only on creation. */
  source?: string;
  now?: Date;
};

/**
 * Find or create the one contact for an email (FR-03).
 *
 * On a later call, hints fill fields that are still empty, but never a field a
 * person edited by hand. Visibility only ever widens to `investor`.
 */
export async function resolveContact(
  input: { email: string } & ContactHints,
  opts: ResolveOptions = {},
): Promise<ResolveResult> {
  const email = normalizeEmail(input.email);
  if (!email) return { status: "invalid" };

  const table = await getTable("contacts");
  if (!table) return { status: "unavailable" };
  if (await isTombstoned(email)) return { status: "tombstoned" };

  const visibility: Visibility = opts.visibility ?? "general";
  const now = (opts.now ?? new Date()).toISOString();

  const existing = await findContactByEmail(email);
  if (existing) return { status: "found", contact: await fillFromHints(existing, input, visibility, now) };

  const id = emailHash(email);
  const organizationId =
    (await resolveOrganization(email, { name: clean(input.organizationName), visibility, now: opts.now })) ??
    undefined;
  const kind: ContactKind =
    input.kind && (CONTACT_KINDS as readonly string[]).includes(input.kind) ? input.kind : "other";

  const entity: ContactEntity = {
    ...contactKeys(id),
    rowType: "contact",
    email,
    name: clean(input.name),
    title: clean(input.title),
    organizationId,
    linkedinUrl: clean(input.linkedinUrl, 400),
    phone: clean(input.phone, 40),
    kind,
    stage: "new",
    tags: "[]",
    visibility,
    source: opts.source,
    createdAt: now,
    updatedAt: now,
    editedFields: "[]",
  };

  try {
    await table.createEntity(stripUndefined(entity));
    return { status: "created", contact: fromEntity(entity) };
  } catch (err) {
    if (statusOf(err) !== 409) throw err;
    // Created by a concurrent call between our read and write.
    const raced = await getContact(id);
    if (!raced) throw err;
    return { status: "found", contact: await fillFromHints(raced, input, visibility, now) };
  }
}

async function fillFromHints(
  contact: Contact,
  hints: ContactHints,
  visibility: Visibility,
  now: string,
): Promise<Contact> {
  const patch: Record<string, string> = {};
  const edited = new Set(contact.editedFields);
  for (const field of HINT_FIELDS) {
    const value = clean(hints[field], field === "linkedinUrl" ? 400 : field === "phone" ? 40 : 200);
    if (value && !contact[field] && !edited.has(field)) patch[field] = value;
  }
  if (hints.kind && contact.kind === "other" && !edited.has("kind")) patch.kind = hints.kind;
  const v = widen(contact.visibility, visibility);
  if (v !== contact.visibility) patch.visibility = v;

  if (Object.keys(patch).length === 0) return contact;
  const table = await getTable("contacts");
  if (!table) return contact;
  await table.updateEntity({ ...contactKeys(contact.id), ...patch, updatedAt: now }, "Merge");
  return { ...contact, ...patch, updatedAt: now } as Contact;
}

/** Move lastActivityAt forward. Never backward, so backfills keep the latest. */
export async function touchLastActivity(contactId: string, occurredAt: string): Promise<void> {
  const table = await getTable("contacts");
  if (!table) return;
  const k = contactKeys(contactId);
  for (let attempt = 0; attempt < 2; attempt++) {
    let current: ContactEntity & { etag: string };
    try {
      current = await table.getEntity<ContactEntity>(k.partitionKey, k.rowKey);
    } catch (err) {
      if (statusOf(err) === 404) return;
      throw err;
    }
    if (current.lastActivityAt && current.lastActivityAt >= occurredAt) return;
    try {
      await table.updateEntity({ ...k, lastActivityAt: occurredAt }, "Merge", { etag: current.etag });
      return;
    } catch (err) {
      if (statusOf(err) !== 412) throw err;
    }
  }
}

function stripUndefined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}
