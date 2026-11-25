import { CsvError, type ParsedCsv } from "@/lib/market/csv";

/**
 * Target list fields and checks (phase 2 FR-01, task 010). Pure: no storage,
 * so the import form can use the field list and labels in the browser.
 */

export const MAX_TARGET_ROWS = 2_000;
export const MAX_TARGET_CHARS = 2_000_000;
/** Rows one import request handles; the form sends a large file in parts. */
export const RUN_CHUNK = 250;
/** Longest value kept in a contact or member field. */
export const FIELD_MAX = 400;

export const TARGET_FIELDS = [
  "email",
  "firstName",
  "lastName",
  "fullName",
  "title",
  "organization",
  "linkedinUrl",
  "phone",
  "group",
  "template",
  "note",
] as const;
export type TargetField = (typeof TARGET_FIELDS)[number];
export type TargetMapping = Partial<Record<TargetField, string>>;

export const TARGET_FIELD_LABELS: Record<TargetField, string> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  fullName: "Full name",
  title: "Job title",
  organization: "Organization",
  linkedinUrl: "LinkedIn profile",
  phone: "Phone",
  group: "Group",
  template: "Template",
  note: "Note",
};

/** Header names a target list commonly uses, compared without case, spaces or punctuation. */
const ALIASES: Record<TargetField, string[]> = {
  email: ["email", "email address", "e-mail", "work email", "business email", "work email address"],
  firstName: ["first name", "firstname", "given name", "first"],
  lastName: ["last name", "lastname", "surname", "family name", "last"],
  fullName: ["full name", "name", "contact name", "contact"],
  title: ["job title", "title", "position", "role"],
  organization: ["organization", "organisation", "company", "company name", "firm", "employer", "account"],
  linkedinUrl: ["linkedin", "linkedin url", "linkedin profile", "linkedin profile url", "profile url"],
  phone: ["phone", "phone number", "mobile", "mobile phone", "work phone", "telephone"],
  group: ["group", "segment", "tier", "list", "cohort"],
  template: ["template", "template label", "email template", "version", "variant"],
  note: ["note", "notes", "comment", "comments"],
};

function squash(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Default mapping: each field to the first unused header that matches one of its names. */
export function defaultTargetMapping(headers: readonly string[]): TargetMapping {
  const out: TargetMapping = {};
  const used = new Set<string>();
  for (const field of TARGET_FIELDS) {
    for (const alias of ALIASES[field]) {
      const hit = headers.find((h) => h && !used.has(h) && squash(h) === squash(alias));
      if (hit) {
        out[field] = hit;
        used.add(hit);
        break;
      }
    }
  }
  return out;
}

/** Keep only mappings to headers the file has. Throws CsvError on anything else. */
export function checkTargetMapping(value: unknown, headers: readonly string[]): TargetMapping {
  if (value === undefined || value === null) {
    const guess = defaultTargetMapping(headers);
    if (!guess.email) throw new CsvError("Pick the column that holds the email address");
    return guess;
  }
  if (typeof value !== "object" || Array.isArray(value)) throw new CsvError("The column mapping must be an object");
  const out: TargetMapping = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (!(TARGET_FIELDS as readonly string[]).includes(k)) throw new CsvError(`Unknown field ${k}`);
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string" || !headers.includes(v)) throw new CsvError(`The file has no column named ${String(v)}`);
    out[k as TargetField] = v;
  }
  if (!out.email) throw new CsvError("Pick the column that holds the email address");
  return out;
}

export type TargetRow = {
  /** The line in the file, counting the header as line 1. */
  line: number;
  email?: string;
  name?: string;
  title?: string;
  organization?: string;
  linkedinUrl?: string;
  phone?: string;
  group?: string;
  template?: string;
  note?: string;
};

/** Apply a mapping to the parsed rows. A full name column wins over first and last name. */
export function mapTargetRows(csv: ParsedCsv, mapping: TargetMapping): TargetRow[] {
  const index = Object.fromEntries(
    Object.entries(mapping).map(([field, header]) => [field, csv.headers.indexOf(header!)]),
  ) as Partial<Record<TargetField, number>>;
  const get = (row: string[], field: TargetField): string | undefined => {
    const i = index[field];
    if (i === undefined || i < 0) return undefined;
    const v = field === "note" ? row[i]?.trim() : row[i]?.replace(/\s+/g, " ").trim();
    return v || undefined;
  };
  return csv.rows.map((row, i) => ({
    line: csv.lines[i] ?? i + 2,
    email: get(row, "email"),
    name: get(row, "fullName") ?? ([get(row, "firstName"), get(row, "lastName")].filter(Boolean).join(" ") || undefined),
    title: get(row, "title"),
    organization: get(row, "organization"),
    linkedinUrl: get(row, "linkedinUrl"),
    phone: get(row, "phone"),
    group: get(row, "group"),
    template: get(row, "template"),
    note: get(row, "note"),
  }));
}
