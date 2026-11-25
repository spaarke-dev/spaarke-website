import { audit } from "@/lib/market/audit";
import { recordActivity } from "@/lib/market/activity";
import { addMember, getMember, type Campaign } from "@/lib/market/campaigns";
import { findContactByEmail, resolveContact } from "@/lib/market/contacts";
import { CsvError, parseCsv } from "@/lib/market/csv";
import { normalizeEmail, sha256 } from "@/lib/market/keys";
import {
  checkTargetMapping,
  FIELD_MAX,
  mapTargetRows,
  MAX_TARGET_CHARS,
  MAX_TARGET_ROWS,
  RUN_CHUNK,
  TARGET_FIELD_LABELS,
  type TargetField,
  type TargetMapping,
  type TargetRow,
} from "@/lib/market/target-fields";
import { mapLimit, recomputeCampaign } from "@/lib/market/results";
import type { Visibility } from "@/lib/market/types";

/**
 * Target list import (phase 2 FR-01, task 010).
 *
 * The admin page sends a CSV's text in a JSON body. It is parsed here in
 * memory, mapped to the target fields, checked and previewed; on confirm each
 * row becomes a contact (through the phase 1 resolution, so existing contacts
 * gain only empty fields) and a member of the chosen campaign. The text is
 * never written to storage, disk or logs.
 *
 * A run covers at most RUN_CHUNK rows from `from`, and answers with the next
 * row to send, so a 2,000-row file stays inside the function timeout. Every
 * write is keyed, so a repeated chunk or a second import adds nothing.
 */

export const TARGET_SOURCE = "target-import";
const SAMPLE_SIZE = 10;
const SKIPPED_SHOWN = 50;
const CONCURRENCY = 8;

export type CheckedTarget = TargetRow & { normalized?: string; skip?: string };

const LIMITED: (keyof TargetRow)[] = ["name", "title", "organization", "linkedinUrl", "phone", "group", "template"];

function fieldOf(key: keyof TargetRow): TargetField {
  return key === "name" ? "fullName" : (key as TargetField);
}

/** Mark each row ready or skipped, with the reason. */
export function checkTargets(rows: readonly TargetRow[]): CheckedTarget[] {
  const seen = new Set<string>();
  return rows.map((row) => {
    if (!row.email) return { ...row, skip: "No email" };
    const normalized = normalizeEmail(row.email);
    if (!normalized) return { ...row, skip: "Not an email address" };
    const long = LIMITED.find((f) => String(row[f] ?? "").length > FIELD_MAX);
    if (long) return { ...row, normalized, skip: `${TARGET_FIELD_LABELS[fieldOf(long)]} is longer than ${FIELD_MAX} characters` };
    if ((row.group ?? "").length > 100 || (row.template ?? "").length > 100) {
      return { ...row, normalized, skip: "Group or template is longer than 100 characters" };
    }
    if (seen.has(normalized)) return { ...row, normalized, skip: "Repeats an earlier row" };
    seen.add(normalized);
    return { ...row, normalized };
  });
}

export type TargetRequest = {
  csv: string;
  mapping?: unknown;
  campaign?: string;
  visibility: Visibility;
  confirm: boolean;
  /** The first row (0-based, among data rows) a run handles. */
  from: number;
};

const KEYS = new Set(["csv", "mapping", "campaign", "visibility", "confirm", "from"]);

/** Check the request body. Throws CsvError. */
export function parseTargetRequest(body: unknown): TargetRequest {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new CsvError("Expected an object");
  const input = body as Record<string, unknown>;
  for (const key of Object.keys(input)) if (!KEYS.has(key)) throw new CsvError(`${key} cannot be set`);
  if (typeof input.csv !== "string" || !input.csv.trim()) throw new CsvError("Choose a CSV file");
  if (input.csv.length > MAX_TARGET_CHARS) throw new CsvError("The file is larger than 2 MB; split it and import each part");
  if (input.campaign !== undefined && input.campaign !== null && typeof input.campaign !== "string") {
    throw new CsvError("campaign must be a short name");
  }
  const visibility = input.visibility ?? "general";
  if (visibility !== "general" && visibility !== "investor") throw new CsvError("visibility must be general or investor");
  if (input.confirm !== undefined && typeof input.confirm !== "boolean") throw new CsvError("confirm must be true or false");
  const from = input.from ?? 0;
  if (typeof from !== "number" || !Number.isInteger(from) || from < 0 || from > MAX_TARGET_ROWS) {
    throw new CsvError("from must be a row number");
  }
  return {
    csv: input.csv,
    mapping: input.mapping,
    campaign: (input.campaign as string | undefined) || undefined,
    visibility,
    confirm: input.confirm === true,
    from,
  };
}

function readFile(req: TargetRequest): { headers: string[]; mapping: TargetMapping; rows: CheckedTarget[] } {
  const csv = parseCsv(req.csv, { maxRows: MAX_TARGET_ROWS });
  if (!csv.rows.length) throw new CsvError("The file has column names but no people");
  const mapping = checkTargetMapping(req.mapping, csv.headers);
  return { headers: csv.headers, mapping, rows: checkTargets(mapTargetRows(csv, mapping)) };
}

export type SkippedRow = { line: number; reason: string };
export type TargetState = "new" | "existing" | "member" | "skipped";

export type TargetPreviewRow = {
  line: number;
  email?: string;
  name?: string;
  organization?: string;
  group?: string;
  state: TargetState;
  reason?: string;
};

export type TargetPreview = {
  headers: string[];
  mapping: TargetMapping;
  total: number;
  newContacts: number;
  existingContacts: number;
  alreadyMembers: number;
  skipped: number;
  skippedRows: SkippedRow[];
  sample: TargetPreviewRow[];
};

/**
 * Parse, map and check, and count what an import would do. Writes nothing.
 * `existingContacts` counts people already known who are not yet members.
 */
export async function previewTargets(req: TargetRequest): Promise<TargetPreview> {
  const { headers, mapping, rows } = readFile(req);
  const states = await mapLimit(rows, 16, async (r): Promise<TargetState> => {
    if (r.skip) return "skipped";
    const contact = await findContactByEmail(r.normalized!);
    if (!contact) return "new";
    if (req.campaign && (await getMember(req.campaign, contact.id))) return "member";
    return "existing";
  });
  const skipped = rows.filter((r) => r.skip);
  const n = (s: TargetState) => states.filter((x) => x === s).length;
  return {
    headers,
    mapping,
    total: rows.length,
    newContacts: n("new"),
    existingContacts: n("existing"),
    alreadyMembers: n("member"),
    skipped: skipped.length,
    skippedRows: skipped.slice(0, SKIPPED_SHOWN).map((r) => ({ line: r.line, reason: r.skip! })),
    sample: rows.slice(0, SAMPLE_SIZE).map((r, i) => ({
      line: r.line,
      email: r.email,
      name: r.name,
      organization: r.organization,
      group: r.group,
      state: states[i],
      reason: r.skip,
    })),
  };
}

export type TargetResult = {
  total: number;
  /** Rows this run handled, from `from`. */
  from: number;
  to: number;
  /** The next `from` to send, or null when the file is done. */
  next: number | null;
  newContacts: number;
  existingContacts: number;
  membersAdded: number;
  alreadyMembers: number;
  notesAdded: number;
  skipped: number;
  skippedRows: SkippedRow[];
};

/** Source IDs for the import's own activities, so a second run finds them. */
export function importSourceId(slug: string, contactId: string): string {
  return `list:${slug}:${contactId}`;
}
export function noteSourceId(slug: string, normalizedEmail: string, note: string): string {
  return `note:${slug}:${sha256(`${normalizedEmail}|${note}`)}`;
}

/** Import rows [from, from + RUN_CHUNK) into the campaign. */
export async function runTargets(
  req: TargetRequest,
  campaign: Campaign,
  who: string,
  now = new Date(),
): Promise<TargetResult> {
  const { rows } = readFile(req);
  const from = Math.min(req.from, rows.length);
  const to = Math.min(from + RUN_CHUNK, rows.length);
  const chunk = rows.slice(from, to);
  const skippedRows: SkippedRow[] = chunk.filter((r) => r.skip).map((r) => ({ line: r.line, reason: r.skip! }));

  let newContacts = 0;
  let existingContacts = 0;
  let membersAdded = 0;
  let alreadyMembers = 0;
  let notesAdded = 0;
  const touched = new Set<string>();

  // Emails are unique after checkTargets, so rows never race for one contact.
  await mapLimit(
    chunk.filter((r) => !r.skip),
    CONCURRENCY,
    async (r) => {
      const res = await resolveContact(
        {
          email: r.normalized!,
          name: r.name,
          title: r.title,
          organizationName: r.organization,
          linkedinUrl: r.linkedinUrl,
          phone: r.phone,
          kind: "prospect",
        },
        { visibility: req.visibility, source: "list.import", now },
      );
      if (res.status !== "created" && res.status !== "found") {
        const reason =
          res.status === "tombstoned" ? "Deleted contact; not added back" : res.status === "invalid" ? "Not an email address" : "Not saved; try again";
        skippedRows.push({ line: r.line, reason });
        return;
      }
      if (res.status === "created") newContacts += 1;
      else existingContacts += 1;
      const contactId = res.contact.id;

      const member = await getMember(campaign.slug, contactId);
      if (!member) {
        await addMember({ campaignSlug: campaign.slug, contactId, group: r.group, templateLabel: r.template }, now);
        membersAdded += 1;
      } else {
        alreadyMembers += 1;
        // Fill labels the member does not have yet; never replace one.
        const group = member.group ? undefined : r.group;
        const templateLabel = member.templateLabel ? undefined : r.template;
        if (group || templateLabel) await addMember({ campaignSlug: campaign.slug, contactId, group, templateLabel }, now);
      }
      touched.add(contactId);

      await recordActivity({
        type: "list.import",
        source: TARGET_SOURCE,
        sourceId: importSourceId(campaign.slug, contactId),
        occurredAt: now,
        contactId,
        visibility: res.contact.visibility,
        campaignSlug: campaign.slug,
        memberId: contactId,
        summary: `Added to ${campaign.name} from a target list`,
      });

      if (r.note) {
        const note = await recordActivity({
          type: "note",
          source: TARGET_SOURCE,
          sourceId: noteSourceId(campaign.slug, r.normalized!, r.note),
          occurredAt: now,
          contactId,
          visibility: res.contact.visibility,
          campaignSlug: campaign.slug,
          summary: r.note,
        });
        if (note.status === "recorded") notesAdded += 1;
      }
    },
  );

  if (touched.size) await recomputeCampaign(campaign.slug, { now, only: touched });

  skippedRows.sort((a, b) => a.line - b.line);
  const result: TargetResult = {
    total: rows.length,
    from,
    to,
    next: to < rows.length ? to : null,
    newContacts,
    existingContacts,
    membersAdded,
    alreadyMembers,
    notesAdded,
    skipped: skippedRows.length,
    skippedRows: skippedRows.slice(0, SKIPPED_SHOWN),
  };
  // Counts only: the audit never holds the people themselves.
  await audit(
    {
      who,
      action: "import.targets",
      entity: "campaign",
      entityId: campaign.slug,
      after: {
        rows: result.total,
        from,
        to,
        visibility: req.visibility,
        newContacts,
        existingContacts,
        membersAdded,
        alreadyMembers,
        notesAdded,
        skipped: result.skipped,
      },
    },
    now,
  );
  return result;
}
