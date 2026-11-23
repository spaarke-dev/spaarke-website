import { getTable, statusOf } from "@/lib/market/tables";
import { contactKeys, emailDomain, isFreeMailDomain, isSafeKey } from "@/lib/market/keys";
import { getOrganization, organizationIdForDomain, resolveOrganization } from "@/lib/market/organizations";
import { contactTimeline, loadContacts, scanOrganizations, type ActivityRow, type ContactRow } from "@/lib/market/queries";
import { audit } from "@/lib/market/audit";
import { isVisibleTo } from "@/lib/market/visibility";
import {
  CONTACT_KINDS,
  VISIBILITIES,
  type ContactKind,
  type Organization,
  type Visibility,
} from "@/lib/market/types";

/**
 * Organizations in the admin area (task 032, FR-04, FR-15): the list with
 * contact counts, one organization with its contacts and recent activity,
 * edits by hand, and domain overrides.
 *
 * A domain override points an email domain at another organization, for a
 * company that writes from several domains. Adding one moves the contacts at
 * that domain to the chosen organization; the organization the domain had of
 * its own is removed once nothing is left in it. Removing an override sends
 * the domain's contacts back to an organization of their own. Every change
 * writes an audit row (NFR-06), which never holds an email address.
 *
 * Counts and lists only include what the signed-in user may see (FR-02).
 */

const ORG = "org";
const OVERRIDE = "override";

export class OrgError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrgError";
  }
}

// ----- Reads -----

export type OrgRow = Organization & {
  /** Contacts the user may see. */
  contactCount: number;
  lastActivityAt?: string;
  /** Domains pointed at this organization by an override. */
  otherDomains: string[];
};

type OverrideRow = { domain: string; organizationId: string };

export async function listOverrides(): Promise<OverrideRow[]> {
  const table = await getTable("organizations");
  if (!table) return [];
  const out: OverrideRow[] = [];
  for await (const e of table.listEntities<{ rowKey: string; organizationId?: string }>({
    queryOptions: { filter: `PartitionKey eq '${OVERRIDE}'` },
  })) {
    if (typeof e.organizationId === "string" && e.organizationId) {
      out.push({ domain: e.rowKey, organizationId: e.organizationId });
    }
  }
  return out.sort((a, b) => a.domain.localeCompare(b.domain));
}

function rowsFor(orgs: Map<string, Organization>, contacts: readonly ContactRow[], overrides: readonly OverrideRow[]) {
  const counts = new Map<string, { n: number; last?: string }>();
  for (const c of contacts) {
    if (!c.organizationId) continue;
    const k = counts.get(c.organizationId) ?? { n: 0 };
    k.n++;
    const t = c.lastActivityAt ?? c.createdAt;
    if (!k.last || t > k.last) k.last = t;
    counts.set(c.organizationId, k);
  }
  const domains = new Map<string, string[]>();
  for (const o of overrides) domains.set(o.organizationId, [...(domains.get(o.organizationId) ?? []), o.domain]);
  return [...orgs.values()].map<OrgRow>((o) => ({
    ...o,
    contactCount: counts.get(o.id)?.n ?? 0,
    lastActivityAt: counts.get(o.id)?.last,
    otherDomains: domains.get(o.id) ?? [],
  }));
}

/** Every organization the user may see, most recent activity first. */
export async function loadOrganizations(roles: readonly string[]): Promise<OrgRow[]> {
  const [orgs, contacts, overrides] = await Promise.all([
    scanOrganizations(roles),
    loadContacts(roles),
    listOverrides(),
  ]);
  return rowsFor(orgs, contacts, overrides).sort(
    (a, b) =>
      (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? "") || a.name.localeCompare(b.name),
  );
}

export type OrgQuery = { q?: string; page?: number; pageSize?: number };
export type OrgPage = { rows: OrgRow[]; total: number; page: number; pageCount: number };

/** Search by name, domain or website, and page. Pure, so the checks can run it. */
export function filterOrganizations(all: readonly OrgRow[], query: OrgQuery): OrgPage {
  const terms = (query.q ?? "").toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8);
  const matched = terms.length
    ? all.filter((o) => {
        const haystack = [o.name, o.domain, o.website, ...o.otherDomains].filter(Boolean).join(" ").toLowerCase();
        return terms.every((t) => haystack.includes(t));
      })
    : [...all];
  const pageSize = query.pageSize ?? 50;
  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
  const page = Math.min(Math.max(1, Math.floor(query.page ?? 1)), pageCount);
  return { rows: matched.slice((page - 1) * pageSize, page * pageSize), total: matched.length, page, pageCount };
}

/** One organization the user may see, or null. */
export async function visibleOrganization(id: string, roles: readonly string[]): Promise<Organization | null> {
  if (!isSafeKey(id)) return null;
  const org = await getOrganization(id);
  return org && isVisibleTo(org, roles) ? org : null;
}

export type OrgDetail = { org: OrgRow; contacts: ContactRow[]; activity: ActivityRow[] };

/**
 * An organization with its visible contacts (most recent first) and the
 * latest activity across them.
 */
export async function organizationDetail(id: string, roles: readonly string[]): Promise<OrgDetail | null> {
  const org = await visibleOrganization(id, roles);
  if (!org) return null;
  const [contacts, overrides] = await Promise.all([loadContacts(roles), listOverrides()]);
  const mine = contacts.filter((c) => c.organizationId === org.id);
  const [row] = rowsFor(new Map([[org.id, org]]), mine, overrides);

  // The newest activity sits on the most recently active contacts.
  const recent = mine.slice(0, 20);
  const pages = await Promise.all(recent.map((c) => contactTimeline(c.id, roles, { limit: 10 })));
  const activity: ActivityRow[] = [];
  pages.forEach((p, i) => {
    for (const a of p.rows) activity.push({ ...a, contactName: recent[i].name, contactEmail: recent[i].email });
  });
  activity.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return { org: row, contacts: mine, activity: activity.slice(0, 25) };
}

// ----- Edit -----

export const ORG_EDITABLE = ["name", "website", "kind", "notes", "visibility"] as const;

export type OrgPatch = {
  name?: string;
  website?: string | null;
  kind?: ContactKind | null;
  notes?: string | null;
  visibility?: Visibility;
};

/** Check and normalize an edit from a request body. Throws OrgError on bad input. */
export function parseOrgPatch(body: unknown): OrgPatch {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new OrgError("Expected an object");
  const input = body as Record<string, unknown>;
  for (const key of Object.keys(input)) {
    if (!(ORG_EDITABLE as readonly string[]).includes(key)) throw new OrgError(`${key} cannot be edited`);
  }
  const patch: OrgPatch = {};
  if ("name" in input) {
    if (typeof input.name !== "string") throw new OrgError("name must be text");
    const t = input.name.replace(/\s+/g, " ").trim();
    if (!t) throw new OrgError("An organization needs a name");
    if (t.length > 200) throw new OrgError("name is too long");
    patch.name = t;
  }
  if ("website" in input) {
    const v = input.website;
    if (v === null || v === "") patch.website = null;
    else {
      if (typeof v !== "string") throw new OrgError("website must be text");
      const t = v.trim();
      let ok = false;
      try {
        const u = new URL(t);
        ok = (u.protocol === "https:" || u.protocol === "http:") && Boolean(u.hostname);
      } catch {
        ok = false;
      }
      if (!ok || t.length > 400) throw new OrgError("website must be a web address starting with https://");
      patch.website = t;
    }
  }
  if ("kind" in input) {
    const v = input.kind;
    if (v === null || v === "") patch.kind = null;
    else if ((CONTACT_KINDS as readonly unknown[]).includes(v)) patch.kind = v as ContactKind;
    else throw new OrgError("Unknown kind");
  }
  if ("notes" in input) {
    const v = input.notes;
    if (v === null || v === "") patch.notes = null;
    else {
      if (typeof v !== "string") throw new OrgError("notes must be text");
      const t = v.replace(/\r\n/g, "\n").trim();
      if (t.length > 2000) throw new OrgError("notes are too long (2,000 characters at most)");
      patch.notes = t || null;
    }
  }
  if ("visibility" in input) {
    if (!(VISIBILITIES as readonly unknown[]).includes(input.visibility)) throw new OrgError("Unknown visibility");
    patch.visibility = input.visibility as Visibility;
  }
  return patch;
}

function comparable(o: Organization): Record<string, unknown> {
  return { name: o.name, website: o.website, kind: o.kind, notes: o.notes, visibility: o.visibility };
}

/** Apply an edit by hand. Returns the updated organization, or null when there is none. */
export async function editOrganization(
  id: string,
  patch: OrgPatch,
  who: string,
  now = new Date(),
): Promise<Organization | null> {
  const table = await getTable("organizations");
  const org = await getOrganization(id);
  if (!table || !org) return null;

  const before = comparable(org);
  const next: Organization = { ...org };
  for (const [k, v] of Object.entries(patch)) (next as Record<string, unknown>)[k] = v === null ? undefined : v;
  const after = comparable(next);
  const changed = Object.keys(after).filter((k) => after[k] !== before[k]);
  if (changed.length === 0) return org;

  const row: Record<string, unknown> = { partitionKey: ORG, rowKey: id, updatedAt: now.toISOString() };
  // An emptied field is stored as "" (Merge cannot remove a property); readers treat "" as unset.
  for (const k of changed) row[k] = after[k] ?? "";
  await table.updateEntity(row as { partitionKey: string; rowKey: string }, "Merge");
  await audit({ who, action: "organization.edit", entity: "organization", entityId: id, before, after }, now);
  return { ...next, updatedAt: now.toISOString() };
}

// ----- Domain overrides -----

const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/;

/**
 * A domain typed by hand: "Acme.com", "@acme.com" or "https://www.acme.com/"
 * all give "acme.com". Throws OrgError for anything else, and for free mail.
 */
export function parseDomain(raw: unknown): string {
  if (typeof raw !== "string") throw new OrgError("Give a domain, such as example.com");
  let d = raw.trim().toLowerCase();
  d = d.replace(/^[a-z]+:\/\//, "").replace(/[/?#].*$/, "").replace(/^@/, "").replace(/^www\./, "");
  if (d.includes("@")) d = d.slice(d.lastIndexOf("@") + 1);
  if (!DOMAIN_RE.test(d) || !isSafeKey(d)) throw new OrgError("Give a domain, such as example.com");
  if (isFreeMailDomain(d)) throw new OrgError("Free-mail domains never belong to an organization");
  return d;
}

type ContactLink = { id: string; email: string; organizationId?: string; visibility: Visibility };

/** Every contact whose primary email is at the domain, read across the whole table. */
async function contactsAtDomain(domain: string): Promise<ContactLink[]> {
  const table = await getTable("contacts");
  if (!table) return [];
  const out: ContactLink[] = [];
  for await (const e of table.listEntities<Record<string, unknown> & { rowKey: string }>({
    queryOptions: { filter: "rowType eq 'contact'", select: ["RowKey", "email", "organizationId", "visibility"] },
  })) {
    const email = typeof e.email === "string" ? e.email : "";
    if (!email || emailDomain(email) !== domain) continue;
    out.push({
      id: e.rowKey,
      email,
      organizationId: typeof e.organizationId === "string" && e.organizationId ? e.organizationId : undefined,
      visibility: e.visibility === "general" ? "general" : "investor",
    });
  }
  return out;
}

async function hasContacts(orgId: string): Promise<boolean> {
  const table = await getTable("contacts");
  if (!table) return false;
  for await (const _ of table.listEntities({
    queryOptions: { filter: `rowType eq 'contact' and organizationId eq '${orgId.replace(/'/g, "''")}'`, select: ["RowKey"] },
  })) {
    void _;
    return true;
  }
  return false;
}

async function relink(ids: readonly string[], orgId: string, now: Date): Promise<void> {
  const table = await getTable("contacts");
  if (!table) return;
  for (const id of ids) {
    await table.updateEntity({ ...contactKeys(id), organizationId: orgId, updatedAt: now.toISOString() }, "Merge");
  }
}

export type DomainResult = {
  domain: string;
  /** Contacts the user may see that moved. */
  moved: number;
  /** The organization the domain had of its own, when it was removed. */
  removedOrganization?: string;
};

/**
 * Point a domain at an organization and move the domain's contacts to it.
 * The domain's own organization, when left empty and unused by any other
 * override, is removed, and its website, kind and notes fill the target's
 * empty fields.
 */
export async function addDomain(
  targetId: string,
  rawDomain: unknown,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<DomainResult> {
  const table = await getTable("organizations");
  const target = await visibleOrganization(targetId, roles);
  if (!table || !target) throw new OrgError("No such organization");
  const domain = parseDomain(rawDomain);
  if (domain === target.id || domain === target.domain) throw new OrgError("That is already this organization's domain");

  const previousId = await organizationIdForDomain(domain);
  if (previousId === target.id) throw new OrgError("That domain already belongs to this organization");
  const previous = await getOrganization(previousId);
  // A domain whose organization the user may not see is not theirs to move.
  if (previous && !isVisibleTo(previous, roles)) throw new OrgError("That domain cannot be moved here");

  await table.upsertEntity({ partitionKey: OVERRIDE, rowKey: domain, organizationId: target.id }, "Replace");

  const moving = (await contactsAtDomain(domain)).filter((c) => c.organizationId !== target.id);
  await relink(
    moving.map((c) => c.id),
    target.id,
    now,
  );

  // The organization rule: a general contact joining makes it general.
  const patch: Record<string, unknown> = {};
  if (target.visibility === "investor" && moving.some((c) => c.visibility === "general")) patch.visibility = "general";

  let removedOrganization: string | undefined;
  const overridesToPrevious = (await listOverrides()).some((o) => o.organizationId === previousId);
  if (previous && previous.id === domain && !overridesToPrevious && !(await hasContacts(previous.id))) {
    if (!target.website && previous.website) patch.website = previous.website;
    if (!target.kind && previous.kind) patch.kind = previous.kind;
    if (!target.notes && previous.notes) patch.notes = previous.notes;
    try {
      await table.deleteEntity(ORG, previous.id);
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
    removedOrganization = previous.name;
    await audit(
      {
        who,
        action: "organization.merged_into",
        entity: "organization",
        entityId: previous.id,
        before: comparable(previous),
        after: { mergedInto: target.id },
      },
      now,
    );
  }
  if (Object.keys(patch).length) {
    await table.updateEntity({ partitionKey: ORG, rowKey: target.id, ...patch, updatedAt: now.toISOString() }, "Merge");
  }

  await audit(
    {
      who,
      action: "organization.domain_add",
      entity: "organization",
      entityId: target.id,
      before: { domain, organizationId: previousId },
      after: { domain, organizationId: target.id, movedContacts: moving.length },
    },
    now,
  );
  return { domain, moved: moving.filter((c) => isVisibleTo(c, roles)).length, removedOrganization };
}

/**
 * Remove an override. The domain's contacts in this organization go back to
 * an organization of their own, found or created as a new contact's would be.
 */
export async function removeDomain(
  targetId: string,
  rawDomain: unknown,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<DomainResult> {
  const table = await getTable("organizations");
  const target = await visibleOrganization(targetId, roles);
  if (!table || !target) throw new OrgError("No such organization");
  const domain = parseDomain(rawDomain);
  const overrides = await listOverrides();
  if (!overrides.some((o) => o.domain === domain && o.organizationId === target.id)) {
    throw new OrgError("That domain is not pointed at this organization");
  }

  try {
    await table.deleteEntity(OVERRIDE, domain);
  } catch (err) {
    if (statusOf(err) !== 404) throw err;
  }

  const moving = (await contactsAtDomain(domain)).filter((c) => c.organizationId === target.id);
  const contacts = await getTable("contacts");
  for (const c of moving) {
    const orgId = await resolveOrganization(c.email, { visibility: c.visibility, now });
    if (contacts && orgId) {
      await contacts.updateEntity({ ...contactKeys(c.id), organizationId: orgId, updatedAt: now.toISOString() }, "Merge");
    }
  }

  await audit(
    {
      who,
      action: "organization.domain_remove",
      entity: "organization",
      entityId: target.id,
      before: { domain, organizationId: target.id },
      after: { domain, organizationId: domain, movedContacts: moving.length },
    },
    now,
  );
  return { domain, moved: moving.filter((c) => isVisibleTo(c, roles)).length };
}
