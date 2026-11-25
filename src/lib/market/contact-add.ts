import { recordActivity } from "@/lib/market/activity";
import { audit } from "@/lib/market/audit";
import { PatchError } from "@/lib/market/contact-admin";
import { findContactByEmail, isTombstoned, resolveContact } from "@/lib/market/contacts";
import { contactKeys, normalizeEmail } from "@/lib/market/keys";
import { getTable } from "@/lib/market/tables";
import { CONTACT_KINDS, VISIBILITIES, type ContactKind, type Visibility } from "@/lib/market/types";
import { isVisibleTo } from "@/lib/market/visibility";

/**
 * Add one contact by hand (phase 2 FR-02, task 011).
 *
 * The form uses the same resolution as every import and writer, so an address
 * that already belongs to a contact creates nothing; the answer points to that
 * contact instead. Fields typed here count as edited by hand, so later forms
 * and imports never replace them.
 */

export const ADDED_SOURCE = "admin-add";

export type NewContact = {
  email: string;
  name?: string;
  title?: string;
  organization?: string;
  linkedinUrl?: string;
  phone?: string;
  kind: ContactKind;
  visibility: Visibility;
};

const KEYS = new Set(["email", "name", "title", "organization", "linkedinUrl", "phone", "kind", "visibility"]);
const MAX: Record<string, number> = { name: 200, title: 200, organization: 200, linkedinUrl: 400, phone: 40 };

/** Check the form's body. Throws PatchError. */
export function parseNewContact(body: unknown): NewContact {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new PatchError("Expected an object");
  const input = body as Record<string, unknown>;
  for (const key of Object.keys(input)) if (!KEYS.has(key)) throw new PatchError(`${key} cannot be set`);
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : null;
  if (!email) throw new PatchError("Enter an email address");

  const out: NewContact = { email, kind: "prospect", visibility: "general" };
  for (const field of ["name", "title", "organization", "linkedinUrl", "phone"] as const) {
    const v = input[field];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string") throw new PatchError(`${field} must be text`);
    const t = v.replace(/\s+/g, " ").trim();
    if (t.length > MAX[field]) throw new PatchError(`${field} is too long`);
    if (t) out[field] = t;
  }
  if (out.linkedinUrl && !/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(out.linkedinUrl)) {
    throw new PatchError("The LinkedIn profile must be a linkedin.com address");
  }
  if (input.kind !== undefined) {
    if (!(CONTACT_KINDS as readonly unknown[]).includes(input.kind)) throw new PatchError("Unknown kind");
    out.kind = input.kind as ContactKind;
  }
  if (input.visibility !== undefined) {
    if (!(VISIBILITIES as readonly unknown[]).includes(input.visibility)) throw new PatchError("Unknown visibility");
    out.visibility = input.visibility as Visibility;
  }
  return out;
}

export type AddResult =
  | { status: "created"; contactId: string }
  /** The address belongs to a contact already; the ID only when this user may see it. */
  | { status: "exists"; contactId?: string }
  | { status: "deleted" }
  | { status: "unavailable" };

/** Fields the form sets that a writer or import could otherwise fill. */
const PROTECTED = ["name", "title", "linkedinUrl", "phone", "kind"] as const;

export async function addContactByHand(
  input: NewContact,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<AddResult> {
  const existing = await findContactByEmail(input.email);
  if (existing) return { status: "exists", contactId: isVisibleTo(existing, roles) ? existing.id : undefined };
  if (await isTombstoned(input.email)) return { status: "deleted" };

  const r = await resolveContact(
    {
      email: input.email,
      name: input.name,
      title: input.title,
      organizationName: input.organization,
      linkedinUrl: input.linkedinUrl,
      phone: input.phone,
      kind: input.kind,
    },
    { visibility: input.visibility, source: "contact.added", now },
  );
  if (r.status === "found") return { status: "exists", contactId: isVisibleTo(r.contact, roles) ? r.contact.id : undefined };
  if (r.status === "tombstoned") return { status: "deleted" };
  if (r.status !== "created") return { status: "unavailable" };
  const contactId = r.contact.id;

  // What was typed here counts as edited by hand.
  const edited = PROTECTED.filter((f) => (f === "kind" ? input.kind !== "other" : Boolean(input[f])));
  if (edited.length) {
    const table = await getTable("contacts");
    await table?.updateEntity({ ...contactKeys(contactId), editedFields: JSON.stringify(edited) }, "Merge");
  }

  await recordActivity({
    type: "contact.added",
    source: ADDED_SOURCE,
    sourceId: contactId,
    occurredAt: now,
    contactId,
    visibility: input.visibility,
    summary: "Added by hand",
  });
  // The audit names which fields were set, not their values or the address.
  await audit(
    {
      who,
      action: "contact.create",
      entity: "contact",
      entityId: contactId,
      after: {
        kind: input.kind,
        visibility: input.visibility,
        fields: ["name", "title", "organization", "linkedinUrl", "phone"].filter((f) => Boolean(input[f as keyof NewContact])),
      },
    },
    now,
  );
  return { status: "created", contactId };
}
