import { getTable, statusOf } from "@/lib/market/tables";
import { emailDomain, isFreeMailDomain, isSafeKey } from "@/lib/market/keys";
import type { Organization, Visibility } from "@/lib/market/types";

/**
 * Organizations, keyed by email domain (FR-04). Free-mail domains never create
 * one. A domain override row points a domain at another organization, for
 * companies with several domains.
 *
 *   MaOrganizations  partition "org"       row key: organization ID
 *                    partition "override"  row key: domain -> organizationId
 */

const ORG = "org";
const OVERRIDE = "override";

type OrgEntity = {
  partitionKey: string;
  rowKey: string;
  name: string;
  domain?: string;
  website?: string;
  kind?: string;
  notes?: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
};

function fromEntity(e: OrgEntity): Organization {
  return {
    id: e.rowKey,
    name: e.name,
    domain: e.domain,
    website: e.website || undefined,
    kind: e.kind || undefined,
    notes: e.notes || undefined,
    visibility: e.visibility,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

export async function getOrganization(id: string): Promise<Organization | null> {
  const table = await getTable("organizations");
  if (!table || !isSafeKey(id)) return null;
  try {
    return fromEntity(await table.getEntity<OrgEntity>(ORG, id));
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

/** The organization a domain belongs to, following an override if one exists. */
export async function organizationIdForDomain(domain: string): Promise<string> {
  const table = await getTable("organizations");
  if (!table) return domain;
  try {
    const o = await table.getEntity<{ organizationId: string }>(OVERRIDE, domain);
    return o.organizationId;
  } catch (err) {
    if (statusOf(err) === 404) return domain;
    throw err;
  }
}

/**
 * Find or create the organization for a contact's email. Returns null for
 * free-mail domains and when storage is not configured.
 *
 * An organization created for an investor contact starts as `investor`, so the
 * firm's name is not shown to admins without the role. When a `general`
 * contact later joins it, the organization becomes `general`: the firm is then
 * visible through that contact anyway.
 */
export async function resolveOrganization(
  normalizedEmail: string,
  opts: { name?: string; visibility: Visibility; now?: Date },
): Promise<string | null> {
  const domain = emailDomain(normalizedEmail);
  if (!domain || isFreeMailDomain(domain) || !isSafeKey(domain)) return null;

  const table = await getTable("organizations");
  if (!table) return null;

  const id = await organizationIdForDomain(domain);
  const now = (opts.now ?? new Date()).toISOString();
  const existing = await getOrganization(id);

  if (!existing) {
    const entity: OrgEntity = {
      partitionKey: ORG,
      rowKey: id,
      name: opts.name?.trim() || domain,
      domain,
      visibility: opts.visibility,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await table.createEntity(entity);
      return id;
    } catch (err) {
      // Someone else created it first; fall through to the update rules.
      if (statusOf(err) !== 409) throw err;
    }
  }

  const current = existing ?? (await getOrganization(id));
  if (!current) return id;

  const patch: Partial<OrgEntity> = {};
  if (current.visibility === "investor" && opts.visibility === "general") patch.visibility = "general";
  // Replace a placeholder name (the bare domain) with a real one when given.
  if (opts.name?.trim() && current.name === current.domain) patch.name = opts.name.trim();
  if (Object.keys(patch).length > 0) {
    await table.updateEntity({ partitionKey: ORG, rowKey: id, ...patch, updatedAt: now }, "Merge");
  }
  return id;
}
