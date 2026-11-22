import { audit } from "@/lib/market/audit";
import { recordActivity } from "@/lib/market/activity";
import { getContact } from "@/lib/market/contacts";
import { getCampaign, isCampaignSlug, isMemberStatus } from "@/lib/market/campaigns";
import {
  bulkFollowUpId,
  createFollowUp,
  deleteFollowUp,
  dueFollowUps,
  FOLLOWUP_STATUSES,
  isDueDate,
  isFollowUpStatus,
  isOpen,
  todayKey,
  updateFollowUp,
  type FollowUp,
  type FollowUpPatch,
  type FollowUpStatus,
} from "@/lib/market/followups";
import { loadContacts } from "@/lib/market/queries";
import { campaignResults, mapLimit } from "@/lib/market/results";
import { isVisibleTo } from "@/lib/market/visibility";
import { matchesSelection, type Selection } from "@/lib/market/followup-select";
import type { Contact } from "@/lib/market/types";

/**
 * Admin changes to follow-ups (FR-11, task 034): add, edit, change status and
 * delete on a contact, and bulk create for a campaign segment. Every change
 * writes an audit row (NFR-06); audit rows hold titles and dates, never an
 * email address.
 */

export class FollowUpError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "FollowUpError";
  }
}

const TITLE_MAX = 200;
const NOTES_MAX = 2000;
const BULK_MAX = 1000;

function text(input: Record<string, unknown>, key: string, max: number, required: boolean): string | null | undefined {
  if (!(key in input)) return undefined;
  const v = input[key];
  if (v === null || v === "") {
    if (required) throw new FollowUpError(`${key} cannot be empty`);
    return null;
  }
  if (typeof v !== "string") throw new FollowUpError(`${key} must be text`);
  // Notes keep their line breaks; a title is one line.
  const t = key === "notes" ? v.replace(/[ \t]+/g, " ").trim() : v.replace(/\s+/g, " ").trim();
  if (!t && required) throw new FollowUpError(`${key} cannot be empty`);
  if (t.length > max) throw new FollowUpError(`${key} is too long`);
  return t || null;
}

function object(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new FollowUpError("Expected an object");
  return body as Record<string, unknown>;
}

function only(input: Record<string, unknown>, allowed: readonly string[]): void {
  for (const key of Object.keys(input)) if (!allowed.includes(key)) throw new FollowUpError(`${key} cannot be set`);
}

function dueDate(input: Record<string, unknown>, required: boolean): string | undefined {
  if (!("dueDate" in input)) {
    if (required) throw new FollowUpError("Pick a due date");
    return undefined;
  }
  if (!isDueDate(input.dueDate)) throw new FollowUpError("The due date must be a date like 2026-11-30");
  return input.dueDate;
}

export type NewFollowUp = { title: string; dueDate: string; notes?: string; campaignSlug?: string };

/** Check a new follow-up for one contact. */
export function parseNewFollowUp(body: unknown): NewFollowUp {
  const input = object(body);
  only(input, ["title", "dueDate", "notes", "campaignSlug"]);
  const title = text(input, "title", TITLE_MAX, true);
  if (!title) throw new FollowUpError("A follow-up needs a title");
  const notes = text(input, "notes", NOTES_MAX, false) ?? undefined;
  let campaignSlug: string | undefined;
  if (input.campaignSlug !== undefined && input.campaignSlug !== null && input.campaignSlug !== "") {
    if (!isCampaignSlug(input.campaignSlug)) throw new FollowUpError("Unknown campaign");
    campaignSlug = input.campaignSlug;
  }
  return { title, dueDate: dueDate(input, true)!, notes, campaignSlug };
}

/** Check a change to a follow-up. */
export function parseFollowUpPatch(body: unknown): FollowUpPatch {
  const input = object(body);
  only(input, ["title", "dueDate", "notes", "status"]);
  const patch: FollowUpPatch = {};
  const title = text(input, "title", TITLE_MAX, true);
  if (title) patch.title = title;
  const notes = text(input, "notes", NOTES_MAX, false);
  if (notes !== undefined) patch.notes = notes;
  const due = dueDate(input, false);
  if (due) patch.dueDate = due;
  if ("status" in input) {
    if (!isFollowUpStatus(input.status)) throw new FollowUpError(`The status is one of ${FOLLOWUP_STATUSES.join(", ")}`);
    patch.status = input.status;
  }
  if (!Object.keys(patch).length) throw new FollowUpError("Nothing to change");
  return patch;
}

function auditFields(f: FollowUp): Record<string, unknown> {
  return { title: f.title, dueDate: f.dueDate, status: f.status, notes: f.notes, campaignSlug: f.campaignSlug };
}

/** Add a follow-up to a contact the user may see. */
export async function addFollowUp(
  contact: Contact,
  input: NewFollowUp,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<FollowUp> {
  if (input.campaignSlug) {
    const c = await getCampaign(input.campaignSlug);
    if (!c || !isVisibleTo(c, roles)) throw new FollowUpError("Unknown campaign");
  }
  const r = await createFollowUp({ ...input, contactId: contact.id, visibility: contact.visibility }, now);
  if (!r) throw new FollowUpError("Storage is not configured", 503);
  await audit(
    { who, action: "followup.create", entity: "followup", entityId: `${contact.id}/${r.followUp.id}`, after: auditFields(r.followUp) },
    now,
  );
  return r.followUp;
}

const DONE_STATUSES = new Set<FollowUpStatus>(["sent", "replied"]);

/**
 * Change a follow-up, audited. Closing it as sent or replied also puts a
 * `followup.done` entry on the contact's timeline, once per status.
 */
export async function changeFollowUp(
  contactId: string,
  id: string,
  patch: FollowUpPatch,
  who: string,
  now = new Date(),
): Promise<FollowUp | null> {
  const r = await updateFollowUp(contactId, id, patch, now);
  if (!r) return null;
  const before = auditFields(r.before);
  const after = auditFields(r.after);
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    const action = r.before.status !== r.after.status ? "followup.status" : "followup.edit";
    await audit({ who, action, entity: "followup", entityId: `${contactId}/${id}`, before, after }, now);
  }
  if (isOpen(r.before.status) && DONE_STATUSES.has(r.after.status)) {
    await recordActivity({
      type: "followup.done",
      source: "followup",
      sourceId: `${id}:${r.after.status}`,
      occurredAt: now,
      contactId,
      campaignSlug: r.after.campaignSlug,
      summary: `${r.after.title} (${r.after.status})`,
    });
  }
  return r.after;
}

export async function removeFollowUp(contactId: string, id: string, who: string, now = new Date()): Promise<boolean> {
  const before = await deleteFollowUp(contactId, id);
  if (!before) return false;
  await audit({ who, action: "followup.delete", entity: "followup", entityId: `${contactId}/${id}`, before: auditFields(before) }, now);
  return true;
}

// ----- Bulk -----

export type BulkInput = Selection & { title: string; dueDate: string; notes?: string };

export function parseBulk(body: unknown): BulkInput {
  const input = object(body);
  only(input, ["title", "dueDate", "notes", "statuses", "group", "tag"]);
  const title = text(input, "title", TITLE_MAX, true);
  if (!title) throw new FollowUpError("A follow-up needs a title");
  const notes = text(input, "notes", NOTES_MAX, false) ?? undefined;
  const raw = input.statuses ?? [];
  if (!Array.isArray(raw) || !raw.every(isMemberStatus)) throw new FollowUpError("statuses must be a list of member statuses");
  const group = text(input, "group", 100, false) ?? undefined;
  const tag = text(input, "tag", 100, false) ?? undefined;
  return { title, dueDate: dueDate(input, true)!, notes, statuses: [...new Set(raw)], group, tag };
}

export type BulkResult = { matched: number; created: number; existing: number };

/**
 * One follow-up for each member the user may see who matches the selection.
 * The ID comes from the campaign, title and contact, so running it again finds
 * the follow-ups it made and adds none (FR-11).
 */
export async function bulkCreate(
  slug: string,
  input: BulkInput,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<BulkResult> {
  const results = await campaignResults(slug, roles, { now });
  if (!results) throw new FollowUpError("No such campaign", 404);
  const tags = new Map((await loadContacts(roles)).map((c) => [c.id, c.tags]));
  const picked = results.rows.filter((r) =>
    matchesSelection({ status: r.effective, group: r.group, tags: tags.get(r.contactId) ?? [] }, input),
  );
  if (picked.length > BULK_MAX) throw new FollowUpError(`That selects more than ${BULK_MAX} members; narrow it`);

  let created = 0;
  let existing = 0;
  await mapLimit(picked, 8, async (r) => {
    const out = await createFollowUp(
      {
        id: bulkFollowUpId(slug, input.title, r.contactId),
        contactId: r.contactId,
        title: input.title,
        dueDate: input.dueDate,
        notes: input.notes,
        campaignSlug: slug,
        visibility: r.contactVisibility === "investor" ? "investor" : "general",
      },
      now,
    );
    if (out?.created) created += 1;
    else if (out) existing += 1;
  });

  await audit(
    {
      who,
      action: "followup.bulk_create",
      entity: "campaign",
      entityId: slug,
      after: {
        title: input.title,
        dueDate: input.dueDate,
        statuses: input.statuses.join(",") || undefined,
        group: input.group,
        tag: input.tag,
        matched: picked.length,
        created,
        existing,
      },
    },
    now,
  );
  return { matched: picked.length, created, existing };
}

// ----- Home -----

export type DueRow = {
  id: string;
  contactId: string;
  contactName?: string;
  contactEmail: string;
  title: string;
  dueDate: string;
  status: FollowUpStatus;
  campaignSlug?: string;
  overdue: boolean;
};

/** Open follow-ups due today or earlier, oldest first, for contacts the user may see. */
export async function dueForHome(roles: readonly string[], now = new Date()): Promise<DueRow[]> {
  const today = todayKey(now);
  const due = (await dueFollowUps(today)).filter((f) => isVisibleTo(f, roles));
  const rows = await mapLimit(due, 16, async (f): Promise<DueRow | null> => {
    const c = await getContact(f.contactId);
    // The contact's own visibility decides; it may have changed since the follow-up was made.
    if (!c || !isVisibleTo(c, roles)) return null;
    return {
      id: f.id,
      contactId: f.contactId,
      contactName: c.name,
      contactEmail: c.email,
      title: f.title,
      dueDate: f.dueDate,
      status: f.status,
      campaignSlug: f.campaignSlug,
      overdue: f.dueDate < today,
    };
  });
  return rows.filter((r): r is DueRow => r !== null);
}
