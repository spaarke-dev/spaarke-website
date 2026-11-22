import { audit } from "@/lib/market/audit";
import { hasActivity, recordActivity } from "@/lib/market/activity";
import { addMember, getMember, type Campaign } from "@/lib/market/campaigns";
import { findContactByEmail, getContact } from "@/lib/market/contacts";
import { checkMapping, CsvError, mapRows, parseCsv, type LeadMapping, type LeadRow } from "@/lib/market/csv";
import { normalizeEmail, sha256 } from "@/lib/market/keys";
import { mapLimit, recomputeCampaign } from "@/lib/market/results";
import { isVisibleTo } from "@/lib/market/visibility";

/**
 * LinkedIn Lead Gen Form import (FR-14, task 053).
 *
 * The admin page sends the export's text in a JSON body. It is parsed here in
 * memory, checked, previewed, and on confirm each lead becomes a contact and a
 * `linkedin.lead` activity tagged with the chosen campaign. The text is never
 * written to storage, disk or logs; only the contacts and activities are.
 *
 * Re-importing adds nothing: the activity's idempotency key is the source plus
 * the Lead ID, or a hash of the email and submitted time when the export has
 * no Lead ID column.
 */

export const LEAD_SOURCE = "linkedin-csv";
export const MAX_CSV_CHARS = 3_000_000;
// Live Table Storage is slower per call than the emulator; 500 keeps a request well under the function timeout.
export const MAX_LEADS = 500;
const SAMPLE_SIZE = 10;
const SKIPPED_SHOWN = 50;
const CONCURRENCY = 8;

export type ImportRequest = {
  csv: string;
  mapping?: unknown;
  campaign?: string;
  confirm: boolean;
};

const KEYS = new Set(["csv", "mapping", "campaign", "confirm"]);

/** Check the request body. Throws CsvError. */
export function parseImportRequest(body: unknown): ImportRequest {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new CsvError("Expected an object");
  const input = body as Record<string, unknown>;
  for (const key of Object.keys(input)) if (!KEYS.has(key)) throw new CsvError(`${key} cannot be set`);
  if (typeof input.csv !== "string" || !input.csv.trim()) throw new CsvError("Choose a CSV file");
  if (input.csv.length > MAX_CSV_CHARS) throw new CsvError("The file is too large; split it and import each part");
  if (input.campaign !== undefined && input.campaign !== null && typeof input.campaign !== "string") {
    throw new CsvError("campaign must be a short name");
  }
  if (input.confirm !== undefined && typeof input.confirm !== "boolean") throw new CsvError("confirm must be true or false");
  return {
    csv: input.csv,
    mapping: input.mapping,
    campaign: (input.campaign as string | undefined) || undefined,
    confirm: input.confirm === true,
  };
}

export type CheckedLead = LeadRow & {
  /** Normalized email, when valid. */
  normalized?: string;
  sourceId?: string;
  skip?: string;
};

/** Mark each row ready or skipped, and give ready rows their source ID. */
export function checkLeads(rows: readonly LeadRow[]): CheckedLead[] {
  const seen = new Set<string>();
  return rows.map((row) => {
    if (!row.email) return { ...row, skip: "No email" };
    const normalized = normalizeEmail(row.email);
    if (!normalized) return { ...row, skip: "Not an email address" };
    if (row.submittedRaw && !row.submittedAt) return { ...row, normalized, skip: "Submitted time not understood" };
    if (!row.leadId && !row.submittedAt) return { ...row, normalized, skip: "No lead ID or submitted time" };
    const sourceId = row.leadId ?? `h:${sha256(`${normalized}|${row.submittedAt}`)}`;
    if (seen.has(sourceId)) return { ...row, normalized, sourceId, skip: "Repeats an earlier row" };
    seen.add(sourceId);
    return { ...row, normalized, sourceId };
  });
}

export type SkippedRow = { line: number; reason: string };

export type PreviewRow = {
  line: number;
  email?: string;
  name?: string;
  company?: string;
  title?: string;
  submittedAt?: string;
  state: "ready" | "imported" | "skipped";
  reason?: string;
};

export type Preview = {
  headers: string[];
  mapping: LeadMapping;
  total: number;
  ready: number;
  alreadyImported: number;
  skipped: number;
  skippedRows: SkippedRow[];
  sample: PreviewRow[];
};

function readFile(req: ImportRequest): { headers: string[]; mapping: LeadMapping; leads: CheckedLead[] } {
  const csv = parseCsv(req.csv, { maxRows: MAX_LEADS });
  if (!csv.rows.length) throw new CsvError("The file has column names but no leads");
  const mapping = checkMapping(req.mapping, csv.headers);
  return { headers: csv.headers, mapping, leads: checkLeads(mapRows(csv, mapping)) };
}

/** Parse, map and check, and count what an import would add. Writes nothing. */
export async function previewImport(req: ImportRequest): Promise<Preview> {
  const { headers, mapping, leads } = readFile(req);
  const done = await mapLimit(leads, 16, (l) => (l.skip ? Promise.resolve(false) : hasActivity(LEAD_SOURCE, l.sourceId!)));
  const skipped = leads.filter((l) => l.skip);
  const alreadyImported = done.filter(Boolean).length;
  return {
    headers,
    mapping,
    total: leads.length,
    ready: leads.length - skipped.length - alreadyImported,
    alreadyImported,
    skipped: skipped.length,
    skippedRows: skipped.slice(0, SKIPPED_SHOWN).map((l) => ({ line: l.line, reason: l.skip! })),
    sample: leads.slice(0, SAMPLE_SIZE).map((l, i) => ({
      line: l.line,
      email: l.email,
      name: l.name,
      company: l.company,
      title: l.title,
      submittedAt: l.submittedAt,
      state: l.skip ? "skipped" : done[i] ? "imported" : "ready",
      reason: l.skip,
    })),
  };
}

export type ImportResult = {
  total: number;
  imported: number;
  newContacts: number;
  alreadyImported: number;
  skipped: number;
  skippedRows: SkippedRow[];
  membersAdded: number;
};

/**
 * Record each ready lead and add its contact to the campaign. Rows for the
 * same email run one after another, so two leads from one person never race
 * to create the same contact.
 */
export async function runImport(
  req: ImportRequest,
  campaign: Campaign,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<ImportResult> {
  const { leads } = readFile(req);
  const skippedRows: SkippedRow[] = leads.filter((l) => l.skip).map((l) => ({ line: l.line, reason: l.skip! }));

  const groups = new Map<string, CheckedLead[]>();
  for (const l of leads) {
    if (l.skip) continue;
    const g = groups.get(l.normalized!) ?? [];
    g.push(l);
    groups.set(l.normalized!, g);
  }

  let imported = 0;
  let newContacts = 0;
  let alreadyImported = 0;
  const contactIds = new Set<string>();

  await mapLimit([...groups.values()], CONCURRENCY, async (group) => {
    for (const l of group) {
      const existed = Boolean(await findContactByEmail(l.normalized!));
      const r = await recordActivity({
        type: "linkedin.lead",
        source: LEAD_SOURCE,
        sourceId: l.sourceId!,
        occurredAt: l.submittedAt ?? now,
        email: l.normalized,
        contactHints: {
          name: l.name,
          title: l.title,
          organizationName: l.company,
          linkedinUrl: l.linkedinUrl,
          phone: l.phone,
          kind: "prospect",
        },
        visibility: campaign.visibility,
        campaignSlug: campaign.slug,
        utm: { source: "linkedin", medium: "paid", campaign: campaign.utmCampaign },
        summary: l.formName ? `LinkedIn lead form: ${l.formName}` : "LinkedIn lead form",
      });
      if (r.status === "recorded") {
        imported += 1;
        if (!existed) newContacts += 1;
        contactIds.add(r.contactId);
      } else if (r.status === "duplicate") {
        alreadyImported += 1;
        contactIds.add(r.contactId);
      } else {
        const reason =
          r.reason === "tombstoned" ? "Deleted contact; not added back" : r.reason === "invalid" ? "Not an email address" : "Not saved; try again";
        skippedRows.push({ line: l.line, reason });
      }
    }
  });

  // Members: every lead's contact the user may see, so the campaign page lists them.
  let membersAdded = 0;
  const touched = new Set<string>();
  await mapLimit([...contactIds], CONCURRENCY, async (id) => {
    const contact = await getContact(id);
    if (!contact || !isVisibleTo(contact, roles)) return;
    const existing = await getMember(campaign.slug, id);
    if (!existing) {
      await addMember({ campaignSlug: campaign.slug, contactId: id, group: "LinkedIn lead" }, now);
      membersAdded += 1;
    }
    touched.add(id);
  });
  if (touched.size) await recomputeCampaign(campaign.slug, { now, only: touched });

  skippedRows.sort((a, b) => a.line - b.line);
  const result: ImportResult = {
    total: leads.length,
    imported,
    newContacts,
    alreadyImported,
    skipped: skippedRows.length,
    skippedRows: skippedRows.slice(0, SKIPPED_SHOWN),
    membersAdded,
  };
  // Counts only: the audit never holds the leads themselves.
  await audit(
    {
      who,
      action: "import.linkedin",
      entity: "campaign",
      entityId: campaign.slug,
      after: {
        rows: result.total,
        imported,
        newContacts,
        alreadyImported,
        skipped: result.skipped,
        membersAdded,
      },
    },
    now,
  );
  return result;
}
