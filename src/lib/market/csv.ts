/**
 * A small CSV reader and the LinkedIn Lead Gen Form column mapping (FR-14,
 * task 053). Pure: no storage, no file system. The import route hands it the
 * text it received and keeps nothing.
 */

export type ParsedCsv = {
  headers: string[];
  rows: string[][];
  /** The line each row starts on in the file (the header is line 1). */
  lines: number[];
};

export class CsvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsvError";
  }
}

/** Comma, tab or semicolon: whichever the header line uses most outside quotes. */
function detectDelimiter(text: string): string {
  let inQuotes = false;
  const counts: Record<string, number> = { ",": 0, "\t": 0, ";": 0 };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && (ch === "\n" || ch === "\r")) break;
    else if (!inQuotes && ch in counts) counts[ch] += 1;
  }
  const [best, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return n > 0 ? best : ",";
}

/**
 * Parse CSV text (RFC 4180): quoted fields, doubled quotes, line breaks inside
 * quotes, CRLF or LF, and a leading byte order mark. Blank lines are dropped.
 */
export function parseCsv(input: string, opts: { maxRows?: number } = {}): ParsedCsv {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const delimiter = detectDelimiter(text);
  const records: string[][] = [];
  const starts: number[] = [];
  let field = "";
  let record: string[] = [];
  let inQuotes = false;
  let quotedField = false;
  let line = 1;
  let recordStart = 1;

  const endField = () => {
    record.push(quotedField ? field : field.trim());
    field = "";
    quotedField = false;
  };
  const endRecord = () => {
    endField();
    if (record.some((f) => f !== "")) {
      records.push(record);
      starts.push(recordStart);
      if (opts.maxRows && records.length > opts.maxRows + 1) {
        throw new CsvError(`The file has more than ${opts.maxRows} rows; split it and import each part`);
      }
    }
    record = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === "\n" || (ch === "\r" && text[i + 1] !== "\n")) line += 1;
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"' && field.trim() === "") {
      inQuotes = true;
      quotedField = true;
      field = "";
    } else if (ch === delimiter) {
      endField();
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      endRecord();
      line += 1;
      recordStart = line;
    } else {
      field += ch;
    }
  }
  if (inQuotes) throw new CsvError("A quoted field is not closed");
  if (field !== "" || record.length) endRecord();

  if (!records.length) throw new CsvError("The file is empty");
  const headers = records[0].map((h) => h.trim());
  if (headers.every((h) => !h)) throw new CsvError("The first line has no column names");
  return { headers, rows: records.slice(1), lines: starts.slice(1) };
}

/** The fields an import reads from a lead export. */
export const LEAD_FIELDS = [
  "email",
  "firstName",
  "lastName",
  "company",
  "title",
  "linkedinUrl",
  "phone",
  "submittedAt",
  "leadId",
  "formName",
] as const;
export type LeadField = (typeof LEAD_FIELDS)[number];

export const LEAD_FIELD_LABELS: Record<LeadField, string> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  company: "Company",
  title: "Job title",
  linkedinUrl: "LinkedIn profile",
  phone: "Phone",
  submittedAt: "Submitted at",
  leadId: "Lead ID",
  formName: "Form name",
};

/** Field to column name. A field left out is not imported. */
export type LeadMapping = Partial<Record<LeadField, string>>;

/** Header names LinkedIn and common edits of its export use, compared without case, spaces or punctuation. */
const ALIASES: Record<LeadField, string[]> = {
  email: ["email address", "email", "work email", "business email", "work email address"],
  firstName: ["first name", "firstname", "given name"],
  lastName: ["last name", "lastname", "surname", "family name"],
  company: ["company name", "company", "organization", "organisation"],
  title: ["job title", "title", "position"],
  linkedinUrl: ["linkedin profile url", "linkedin profile", "linkedin url", "profile url"],
  phone: ["phone number", "phone", "mobile phone", "mobile phone number", "work phone"],
  submittedAt: ["submitted at", "submitted on", "date submitted", "submission date", "submitted", "lead created at", "created at"],
  leadId: ["lead id", "leadid", "lead"],
  formName: ["form name", "lead form name", "lead gen form name", "form"],
};

function squash(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Default mapping: each field to the first header that matches one of its names. */
export function defaultMapping(headers: readonly string[]): LeadMapping {
  const out: LeadMapping = {};
  const used = new Set<string>();
  for (const field of LEAD_FIELDS) {
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

/** Keep only mappings to headers the file has. Throws on anything else. */
export function checkMapping(value: unknown, headers: readonly string[]): LeadMapping {
  if (value === undefined || value === null) return defaultMapping(headers);
  if (typeof value !== "object" || Array.isArray(value)) throw new CsvError("The column mapping must be an object");
  const out: LeadMapping = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (!(LEAD_FIELDS as readonly string[]).includes(k)) throw new CsvError(`Unknown field ${k}`);
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string" || !headers.includes(v)) throw new CsvError(`The file has no column named ${String(v)}`);
    out[k as LeadField] = v;
  }
  if (!out.email) throw new CsvError("Pick the column that holds the email address");
  return out;
}

export type LeadRow = {
  /** The line in the file, counting the header as line 1. */
  line: number;
  email?: string;
  name?: string;
  company?: string;
  title?: string;
  linkedinUrl?: string;
  phone?: string;
  /** ISO time, when the column held one this reader understands. */
  submittedAt?: string;
  /** The raw value, kept to report a date that could not be read. */
  submittedRaw?: string;
  leadId?: string;
  formName?: string;
};

/** Apply a mapping to the parsed rows. */
export function mapRows(csv: ParsedCsv, mapping: LeadMapping): LeadRow[] {
  const index = Object.fromEntries(
    Object.entries(mapping).map(([field, header]) => [field, csv.headers.indexOf(header!)]),
  ) as Partial<Record<LeadField, number>>;
  const get = (row: string[], field: LeadField): string | undefined => {
    const i = index[field];
    if (i === undefined || i < 0) return undefined;
    const v = row[i]?.replace(/\s+/g, " ").trim();
    return v || undefined;
  };
  return csv.rows.map((row, i) => {
    const first = get(row, "firstName");
    const last = get(row, "lastName");
    const submittedRaw = get(row, "submittedAt");
    return {
      line: csv.lines[i] ?? i + 2,
      email: get(row, "email"),
      name: [first, last].filter(Boolean).join(" ") || undefined,
      company: get(row, "company"),
      title: get(row, "title"),
      linkedinUrl: get(row, "linkedinUrl"),
      phone: get(row, "phone"),
      submittedAt: submittedRaw ? parseLeadTime(submittedRaw) ?? undefined : undefined,
      submittedRaw,
      leadId: get(row, "leadId"),
      formName: get(row, "formName"),
    };
  });
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function utc(y: number, mo: number, d: number, h = 0, mi = 0, s = 0): string | null {
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || s > 59) return null;
  const ms = Date.UTC(y, mo - 1, d, h, mi, s);
  const back = new Date(ms);
  if (back.getUTCDate() !== d) return null;
  return back.toISOString();
}

function hour12(h: number, ampm?: string): number {
  if (!ampm) return h;
  const pm = ampm.toLowerCase() === "pm";
  if (h === 12) return pm ? 12 : 0;
  return pm ? h + 12 : h;
}

/**
 * Read a submitted time. Times without a zone are taken as UTC, which is what
 * Campaign Manager exports. Understands ISO (with or without a zone), a space
 * between date and time, US dates (M/D/YYYY with an optional 12- or 24-hour
 * time), "Dec 20, 2026 2:03 PM", and epoch seconds or milliseconds.
 */
export function parseLeadTime(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;

  if (/^\d{10}$/.test(v)) return new Date(Number(v) * 1000).toISOString();
  if (/^\d{13}$/.test(v)) return new Date(Number(v)).toISOString();

  let m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?\s*(Z|[+-]\d{2}:?\d{2}|UTC|GMT)?$/i);
  if (m) {
    const [, y, mo, d, h, mi, s, zone] = m;
    if (zone && !/^(utc|gmt|z)$/i.test(zone)) {
      const ms = Date.parse(`${y}-${mo}-${d}T${(h ?? "0").padStart(2, "0")}:${mi ?? "00"}:${s ?? "00"}${zone.replace(/^([+-]\d{2})(\d{2})$/, "$1:$2")}`);
      return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
    }
    return utc(+y, +mo, +d, +(h ?? 0), +(mi ?? 0), +(s ?? 0));
  }

  m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?)?\s*(?:UTC|GMT)?$/i);
  if (m) {
    const [, mo, d, y, h, mi, s, ampm] = m;
    if (ampm && h && (+h < 1 || +h > 12)) return null;
    return utc(+y, +mo, +d, hour12(+(h ?? 0), ampm), +(mi ?? 0), +(s ?? 0));
  }

  m = v.match(/^([A-Za-z]{3})[a-z]*\.? (\d{1,2}),? (\d{4})(?:,? (\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?)?\s*(?:UTC|GMT)?$/);
  if (m) {
    const [, mon, d, y, h, mi, s, ampm] = m;
    const mo = MONTHS[mon.toLowerCase()];
    if (!mo) return null;
    if (ampm && h && (+h < 1 || +h > 12)) return null;
    return utc(+y, mo, +d, hour12(+(h ?? 0), ampm), +(mi ?? 0), +(s ?? 0));
  }

  return null;
}
