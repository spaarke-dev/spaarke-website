// azure/functions/content-reminder/src/calendar/parse-calendar.ts
//
// Pure-functional markdown table parser for content-platform/calendar.md.
// Schema-flex via header-name lookup so column reordering doesn't break.
// Quarter rows (Publish = "YYYY-Qn") are dropped at parse time — they
// have no concrete publish date and can't be in the next-7-day window.
//
// See projects/content-orchestration/spec.md §4 for the full spec.

import type { CalendarRow, CalendarStatus } from "./types.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MD_LINK = /\[([^\]]+)\]\(([^)]+)\)/;

/**
 * Parse the full calendar.md content into CalendarRow[]. Returns every
 * row regardless of date or status — callers apply the window filter.
 */
export function parseCalendar(markdown: string): CalendarRow[] {
  // Split on H2 boundaries. The first chunk before any `^## ` is preamble.
  const sections = markdown.split(/^## /m).slice(1);

  const rows: CalendarRow[] = [];
  for (const section of sections) {
    // Skip the "Idea backlog" section — different table shape.
    const firstLine = section.split("\n", 1)[0] ?? "";
    if (firstLine.trim().toLowerCase().startsWith("idea backlog")) continue;

    rows.push(...parseTablesInSection(section));
  }
  return rows;
}

/**
 * Filter to pieces likely to need a reminder: status in {brief, outline}
 * AND publish date within [today - 1, today + 7].
 *
 * Per spec §4.4. The 1-day overdue window is intentional — we want the
 * operator to see "yesterday's piece never moved past brief" on today's
 * digest, not to silently lose visibility on Day 0+1.
 */
export function filterDueInWindow(
  rows: CalendarRow[],
  today: Date = new Date(),
): CalendarRow[] {
  const todayUtcMidnight = utcMidnight(today);
  const windowStart = addDays(todayUtcMidnight, -1);
  const windowEnd = addDays(todayUtcMidnight, 7);

  return rows.filter((row) => {
    if (row.status !== "brief" && row.status !== "outline") return false;
    if (!ISO_DATE.test(row.publishDate)) return false;
    const pub = new Date(`${row.publishDate}T00:00:00Z`);
    return pub >= windowStart && pub <= windowEnd;
  });
}

/**
 * Days until a row publishes, relative to `today`. Negative for overdue.
 * Used by the digest template to sort + render "in N days" / "yesterday".
 */
export function daysUntilPublish(
  row: CalendarRow,
  today: Date = new Date(),
): number {
  const todayUtcMidnight = utcMidnight(today);
  const pub = new Date(`${row.publishDate}T00:00:00Z`);
  return Math.round(
    (pub.getTime() - todayUtcMidnight.getTime()) / (1000 * 60 * 60 * 24),
  );
}

/* ------------------------------------------------------------------ */
/*  Internals                                                          */
/* ------------------------------------------------------------------ */

function parseTablesInSection(section: string): CalendarRow[] {
  const lines = section.split("\n");
  const rows: CalendarRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!isTableHeader(lines[i], lines[i + 1])) continue;
    const headers = splitTableRow(lines[i]).map((h) => h.toLowerCase());
    // Skip header + separator
    i += 2;
    while (i < lines.length && isTableDataRow(lines[i])) {
      const cells = splitTableRow(lines[i]);
      const row = buildRow(headers, cells);
      if (row) rows.push(row);
      i++;
    }
    // Step back one so the outer loop re-evaluates the line we stopped on
    i--;
  }
  return rows;
}

function isTableHeader(line: string | undefined, next: string | undefined): boolean {
  if (!line || !next) return false;
  if (!line.trim().startsWith("|") || !line.trim().endsWith("|")) return false;
  // The separator row looks like `|---|---|...`
  return /^\|\s*[-:]+/.test(next.trim());
}

function isTableDataRow(line: string | undefined): boolean {
  if (!line) return false;
  const t = line.trim();
  if (!t.startsWith("|") || !t.endsWith("|")) return false;
  // Reject separator rows that have leaked through.
  if (/^\|[\s\-:|]+\|$/.test(t)) return false;
  return true;
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function buildRow(headers: string[], cells: string[]): CalendarRow | null {
  // Map header-name → cell value (lowercased keys for case-insensitive lookup).
  const map = new Map<string, string>();
  for (let i = 0; i < headers.length; i++) {
    map.set(headers[i], cells[i] ?? "");
  }

  const slug = map.get("slug") ?? "";
  const publishRaw = map.get("publish") ?? "";

  // Drop rows without a slug or with quarter publish dates.
  if (!slug) return null;
  if (!ISO_DATE.test(publishRaw)) return null;

  return {
    slug,
    type: map.get("type") ?? "",
    publishDate: publishRaw,
    status: (map.get("status") ?? "") as CalendarStatus | string,
    author: map.get("author") ?? "",
    campaign: nonEmpty(map.get("campaign")),
    linkedinPersonal: extractUrl(map.get("linkedin (personal)")),
    linkedinCompany: extractUrl(map.get("linkedin (company)")),
    notes: map.get("notes") ?? "",
  };
}

function nonEmpty(s: string | undefined): string | null {
  const v = (s ?? "").trim();
  return v.length === 0 ? null : v;
}

function extractUrl(cell: string | undefined): string | null {
  if (!cell) return null;
  const m = MD_LINK.exec(cell);
  return m ? m[2] : null;
}

function utcMidnight(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d.getTime());
  result.setUTCDate(result.getUTCDate() + n);
  return result;
}
