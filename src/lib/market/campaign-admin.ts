import { audit } from "@/lib/market/audit";
import { findContactByEmail, getContact } from "@/lib/market/contacts";
import { normalizeEmail } from "@/lib/market/keys";
import { isVisibleTo } from "@/lib/market/visibility";
import {
  addMember,
  CAMPAIGN_KINDS,
  editCampaign,
  getCampaign,
  getMember,
  isCampaignSlug,
  isMemberStatus,
  setStatusOverride,
  upsertCampaign,
  type Campaign,
  type CampaignKind,
  type CampaignPatch,
  type Member,
  type MemberStatus,
} from "@/lib/market/campaigns";
import { checkPrefixChange, isCodePrefix } from "@/lib/market/codes";
import { recomputeCampaign } from "@/lib/market/results";
import { VISIBILITIES, type Visibility } from "@/lib/market/types";

/**
 * Admin changes to campaigns (task 033): create, edit, add members, and set
 * or clear a member's status override. Each writes an audit row (NFR-06).
 */

export class CampaignError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "CampaignError";
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TEXT_FIELDS = ["name", "utmCampaign", "startDate", "endDate", "notes"] as const;
const FIELDS = new Set<string>([...TEXT_FIELDS, "slug", "kind", "visibility", "codePrefix"]);
const MAX: Record<(typeof TEXT_FIELDS)[number], number> = {
  name: 200,
  utmCampaign: 100,
  startDate: 10,
  endDate: 10,
  notes: 2000,
};
const MAX_MEMBERS_PER_ADD = 500;

function isDate(v: string): boolean {
  return DATE_RE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
}

/** Check a campaign body. Empty text becomes null (clear). Throws CampaignError. */
export function parseCampaign(body: unknown): CampaignPatch & { slug?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new CampaignError("Expected an object");
  const input = body as Record<string, unknown>;
  for (const key of Object.keys(input)) if (!FIELDS.has(key)) throw new CampaignError(`${key} cannot be set`);
  const out: CampaignPatch & { slug?: string } = {};
  if ("slug" in input) {
    if (!isCampaignSlug(input.slug)) {
      throw new CampaignError("The short name takes lowercase letters, digits and dashes, and cannot be code, brief or campaign");
    }
    out.slug = input.slug;
  }
  for (const field of TEXT_FIELDS) {
    if (!(field in input)) continue;
    const v = input[field];
    if (v !== null && typeof v !== "string") throw new CampaignError(`${field} must be text`);
    const t = (v ?? "").replace(/\s+/g, " ").trim();
    if (t.length > MAX[field]) throw new CampaignError(`${field} is too long`);
    if (t && (field === "startDate" || field === "endDate") && !isDate(t)) {
      throw new CampaignError(`${field} must be a date like 2026-11-20`);
    }
    out[field] = t || null;
  }
  if ("name" in out && !out.name) throw new CampaignError("A campaign needs a name");
  if ("kind" in input) {
    if (!(CAMPAIGN_KINDS as readonly unknown[]).includes(input.kind)) throw new CampaignError("Unknown kind");
    out.kind = input.kind as CampaignKind;
  }
  if ("visibility" in input) {
    if (!(VISIBILITIES as readonly unknown[]).includes(input.visibility)) throw new CampaignError("Unknown visibility");
    out.visibility = input.visibility as Visibility;
  }
  if ("codePrefix" in input) {
    const v = input.codePrefix;
    if (v === null || v === "") out.codePrefix = null;
    else if (isCodePrefix(v)) out.codePrefix = v;
    else throw new CampaignError("The code prefix takes letters, digits, - and _, up to 24 characters, and cannot end in -");
  }
  return out;
}

function dateOrder(c: Pick<Campaign, "startDate" | "endDate">): void {
  if (c.startDate && c.endDate && c.endDate < c.startDate) throw new CampaignError("The end date is before the start date");
}

function auditFields(c: Campaign): Record<string, unknown> {
  const { createdAt: _c, updatedAt: _u, resultsAt: _r, ...rest } = c;
  void _c;
  void _u;
  void _r;
  return rest;
}

export async function createCampaign(
  input: CampaignPatch & { slug?: string },
  who: string,
  now = new Date(),
): Promise<Campaign> {
  if (!input.slug) throw new CampaignError("A campaign needs a short name");
  if (!input.name) throw new CampaignError("A campaign needs a name");
  if (await getCampaign(input.slug)) throw new CampaignError("A campaign with that short name exists", 409);
  dateOrder({ startDate: input.startDate ?? undefined, endDate: input.endDate ?? undefined });
  const created = await upsertCampaign(
    {
      slug: input.slug,
      name: input.name,
      kind: input.kind,
      utmCampaign: input.utmCampaign ?? undefined,
      startDate: input.startDate ?? undefined,
      endDate: input.endDate ?? undefined,
      notes: input.notes ?? undefined,
      // Set explicitly by the form; the store's own default is investor.
      visibility: input.visibility ?? "general",
    },
    now,
  );
  if (!created) throw new CampaignError("Storage is not configured", 503);
  await audit({ who, action: "campaign.create", entity: "campaign", entityId: created.slug, after: auditFields(created) }, now);
  return created;
}

export async function updateCampaign(
  slug: string,
  patch: CampaignPatch & { slug?: string },
  who: string,
  now = new Date(),
): Promise<Campaign | null> {
  if (patch.slug !== undefined && patch.slug !== slug) throw new CampaignError("The short name cannot change");
  const { slug: _s, ...rest } = patch;
  void _s;
  const current = await getCampaign(slug);
  if (!current) return null;
  const pick = <K extends "startDate" | "endDate">(k: K) => (k in rest ? (rest[k] ?? undefined) : current[k]);
  dateOrder({ startDate: pick("startDate"), endDate: pick("endDate") });
  if ("codePrefix" in rest) {
    const problem = await checkPrefixChange(current, rest.codePrefix ?? null);
    if (problem) throw new CampaignError(problem, 409);
  }
  const r = await editCampaign(slug, rest, now);
  if (!r) return null;
  const before = auditFields(r.before);
  const after = auditFields(r.after);
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    await audit({ who, action: "campaign.edit", entity: "campaign", entityId: slug, before, after }, now);
  }
  return r.after;
}

export type AddMembersInput = { contacts: string[]; group?: string; templateLabel?: string };

/** Check an add-members body: a list of emails or contact IDs (or one per line). */
export function parseAddMembers(body: unknown): AddMembersInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new CampaignError("Expected an object");
  const input = body as Record<string, unknown>;
  const raw = input.contacts;
  const list =
    typeof raw === "string" ? raw.split(/[\n,;]+/) : Array.isArray(raw) && raw.every((x) => typeof x === "string") ? raw : null;
  if (!list) throw new CampaignError("contacts must be a list of emails or contact IDs");
  const contacts = [...new Set(list.map((s) => s.trim()).filter(Boolean))];
  if (!contacts.length) throw new CampaignError("Add at least one email");
  if (contacts.length > MAX_MEMBERS_PER_ADD) throw new CampaignError(`Add at most ${MAX_MEMBERS_PER_ADD} at a time`);
  const text = (k: "group" | "templateLabel") => {
    const v = input[k];
    if (v === undefined || v === null || v === "") return undefined;
    if (typeof v !== "string" || v.length > 100) throw new CampaignError(`${k} must be short text`);
    return v.replace(/\s+/g, " ").trim() || undefined;
  };
  return { contacts, group: text("group"), templateLabel: text("templateLabel") };
}

export type AddMembersResult = { added: number; updated: number; notFound: string[] };

/**
 * Add existing contacts the user may see. Entries that match no visible
 * contact are returned as not found; nothing is created here, so a typo never
 * makes a new contact.
 */
export async function addMembers(
  slug: string,
  input: AddMembersInput,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<AddMembersResult> {
  const result: AddMembersResult = { added: 0, updated: 0, notFound: [] };
  const touched = new Set<string>();
  for (const entry of input.contacts) {
    const contact = /^[0-9a-f]{64}$/.test(entry)
      ? await getContact(entry)
      : normalizeEmail(entry)
        ? await findContactByEmail(entry)
        : null;
    if (!contact || !isVisibleTo(contact, roles)) {
      result.notFound.push(entry);
      continue;
    }
    if (touched.has(contact.id)) continue;
    const existing = await getMember(slug, contact.id);
    await addMember({ campaignSlug: slug, contactId: contact.id, group: input.group, templateLabel: input.templateLabel }, now);
    touched.add(contact.id);
    if (existing) result.updated += 1;
    else result.added += 1;
  }
  if (touched.size) {
    await recomputeCampaign(slug, { now, only: touched });
    await audit(
      {
        who,
        action: "campaign.members_add",
        entity: "campaign",
        entityId: slug,
        after: { added: result.added, updated: result.updated, group: input.group, templateLabel: input.templateLabel },
      },
      now,
    );
  }
  return result;
}

/** Check an override body: `{ status: <status> | null }`. */
export function parseOverride(body: unknown): MemberStatus | null {
  if (!body || typeof body !== "object" || Array.isArray(body) || !("status" in body)) {
    throw new CampaignError("Send a status, or null to clear it");
  }
  const s = (body as { status: unknown }).status;
  if (s === null || s === "") return null;
  if (!isMemberStatus(s)) throw new CampaignError("Unknown status");
  return s;
}

/** Set or clear a member's override, audited (NFR-06). */
export async function overrideStatus(
  slug: string,
  contactId: string,
  status: MemberStatus | null,
  who: string,
  now = new Date(),
): Promise<Member | null> {
  const r = await setStatusOverride(slug, contactId, status, now);
  if (!r) return null;
  if ((r.before.statusOverride ?? null) !== status) {
    await audit(
      {
        who,
        action: "member.status_override",
        entity: "member",
        entityId: `${slug}/${contactId}`,
        before: { statusOverride: r.before.statusOverride },
        after: { statusOverride: status ?? undefined },
      },
      now,
    );
  }
  return r.after;
}
