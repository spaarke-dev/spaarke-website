// azure/functions/content-reminder/src/notify/digest.ts
//
// Pure templating module for the content-reminder daily digest email.
// Takes already-filtered CalendarRow[] (caller applies the window
// filter from parse-calendar) and produces { subject, text, html }
// for sendgrid.ts to deliver as a multipart message.
//
// No I/O, no async, no env reads. Easy to unit-test by passing fixture
// rows + a fixed `today`.
//
// See projects/content-orchestration/spec.md §5.

import type { CalendarRow } from "../calendar/types.js";
import { daysUntilPublish } from "../calendar/parse-calendar.js";
import { buildAllLinksFor } from "../integrations/links.js";

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export interface RenderedDigest {
  subject: string;
  text: string;
  html: string;
}

/**
 * Render the digest email body for a set of due rows.
 *
 * @param rows           Calendar rows already filtered to the window.
 *                       This function does NOT re-filter — caller is
 *                       responsible for `filterDueInWindow`.
 * @param today          Reference date for relative-day formatting.
 *                       Defaults to `new Date()`; tests inject a fixed
 *                       value for determinism.
 * @param patExpiryDays  Days until the GitHub PAT expires, or `null`
 *                       when the PAT has no expiry (classic, never-
 *                       expiring tokens). When `< 14`, a warning
 *                       footer is appended to both bodies.
 *
 * Caller MUST ensure `rows.length > 0` before calling — per spec §2
 * the function skip-day rule means we don't render an empty digest.
 * If called with an empty array we still produce a sensible (but odd)
 * "0 pieces" subject; logic upstream should prevent that path.
 */
export function renderDigest(
  rows: CalendarRow[],
  today: Date = new Date(),
  patExpiryDays: number | null = null,
): RenderedDigest {
  // Sort by daysUntilPublish ascending (most urgent first: overdue ->
  // today -> tomorrow -> ...). Stable enough for our row counts; ties
  // fall back to slug for determinism in tests.
  const sorted = [...rows].sort((a, b) => {
    const da = daysUntilPublish(a, today);
    const db = daysUntilPublish(b, today);
    if (da !== db) return da - db;
    return a.slug.localeCompare(b.slug);
  });

  const subject = renderSubject(sorted, today);
  const text = renderText(sorted, today, patExpiryDays);
  const html = renderHtml(sorted, today, patExpiryDays);

  return { subject, text, html };
}

/* ------------------------------------------------------------------ */
/*  Subject                                                            */
/* ------------------------------------------------------------------ */

const RELATIVE_FMT = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * Format a day-count as a human-friendly relative phrase.
 *   0 -> "today"
 *   1 -> "tomorrow"
 *   3 -> "in 3 days"
 *  -1 -> "yesterday"
 *  -3 -> "3 days ago"
 *
 * `numeric: "auto"` is what gives us "today/tomorrow/yesterday" instead
 * of the literal "in 0 days" / "in 1 day".
 */
function formatRelativeDays(days: number): string {
  return RELATIVE_FMT.format(days, "day");
}

function renderSubject(rows: CalendarRow[], today: Date): string {
  if (rows.length === 1) {
    const r = rows[0];
    const rel = formatRelativeDays(daysUntilPublish(r, today));
    // The calendar has no `title` column — slug stands in. A future
    // refinement (per task 013 notes) would peek at the frontmatter of
    // content/blog/<date>-<slug>.mdx to lift the real H1 title.
    return `[Spaarke content] Due ${rel}: "${r.slug}"`;
  }
  return `[Spaarke content] ${rows.length} pieces due in the next week`;
}

/* ------------------------------------------------------------------ */
/*  Plain text body                                                    */
/* ------------------------------------------------------------------ */

// 46 box-drawing dashes — matches the example in spec §5.2.
const SEPARATOR = "──────────────────────────────────────────────";

const FOOTER_TEXT =
  "(No reply needed — this is an automated daily digest.)";

function renderText(
  rows: CalendarRow[],
  today: Date,
  patExpiryDays: number | null,
): string {
  const parts: string[] = [];

  parts.push("Spaarke content — pieces due in the next 7 days");
  parts.push("");
  parts.push(`[${rows.length} ${pluralPieces(rows.length)}, sorted by publish date]`);
  parts.push("");

  for (const row of rows) {
    parts.push(SEPARATOR);
    parts.push(renderRowText(row, today));
    parts.push("");
  }

  parts.push(SEPARATOR);
  parts.push("");
  parts.push(FOOTER_TEXT);

  const expiryWarning = patExpiryWarningText(patExpiryDays);
  if (expiryWarning) {
    parts.push("");
    parts.push(expiryWarning);
  }

  return parts.join("\n");
}

function renderRowText(row: CalendarRow, today: Date): string {
  const rel = formatRelativeDays(daysUntilPublish(row, today));
  const links = buildAllLinksFor(row.slug);

  const headerLine = `[${rel} · ${row.status}]  ${row.slug}`;
  const notesLine = row.notes && row.notes.trim().length > 0 ? row.notes : "";
  const metaLine =
    `Publish: ${row.publishDate} · Author: ${row.author || "—"}` +
    ` · Campaign: ${row.campaign ?? "—"}`;

  const lines: string[] = [headerLine];
  if (notesLine) lines.push(notesLine);
  lines.push(metaLine);
  lines.push("");
  lines.push(`  Workspace:  ${links.workspace}`);
  lines.push(`  Issue:      ${links.issueSearch}`);
  lines.push(`  Continue:   ${links.continueInClaude}`);

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  HTML body                                                          */
/* ------------------------------------------------------------------ */

/**
 * HTML structure (Gmail-safe, no CSS frameworks, all inline styles):
 *
 *   <div wrapper>
 *     <h2>Spaarke content — pieces due in the next 7 days</h2>
 *     <p>[N pieces, sorted by publish date]</p>
 *
 *     [for each row:]
 *     <table>
 *       <tr><td>  [in 2 days · brief]  the-iq-stack  </td></tr>
 *       <tr><td>  Notes (if present)                  </td></tr>
 *       <tr><td>  Publish: ... · Author: ... · ...    </td></tr>
 *       <tr><td>
 *         Workspace: <a>...</a><br>
 *         Issue:     <a>...</a><br>
 *         Continue:  <a>...</a>
 *       </td></tr>
 *     </table>
 *
 *     <p>(No reply needed ...)</p>
 *     <p style="color:#b54708">⚠ GitHub PAT expires in N days ...</p>  (conditional)
 *   </div>
 *
 * Each <table> renders as its own block — Gmail renders nested tables
 * cleanly, and a per-row table keeps responsive width simple. Total
 * size for ~10 rows is well under 30 KB.
 */
function renderHtml(
  rows: CalendarRow[],
  today: Date,
  patExpiryDays: number | null,
): string {
  const wrapperStyle = [
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
    "font-size:14px",
    "line-height:1.5",
    "color:#1f2328",
    "max-width:680px",
    "margin:0 auto",
    "padding:16px",
  ].join(";");

  const parts: string[] = [];
  parts.push(`<div style="${wrapperStyle}">`);
  parts.push(
    `<h2 style="font-size:18px;margin:0 0 12px 0;color:#1f2328">` +
      `Spaarke content — pieces due in the next 7 days` +
      `</h2>`,
  );
  parts.push(
    `<p style="margin:0 0 16px 0;color:#57606a">` +
      `[${rows.length} ${pluralPieces(rows.length)}, sorted by publish date]` +
      `</p>`,
  );

  for (const row of rows) {
    parts.push(renderRowHtml(row, today));
  }

  parts.push(
    `<p style="margin:24px 0 0 0;color:#57606a;font-size:13px">` +
      escapeHtml(FOOTER_TEXT) +
      `</p>`,
  );

  const expiryWarning = patExpiryWarningText(patExpiryDays);
  if (expiryWarning) {
    parts.push(
      `<p style="margin:8px 0 0 0;color:#b54708;font-size:13px">` +
        escapeHtml(expiryWarning) +
        `</p>`,
    );
  }

  parts.push(`</div>`);
  return parts.join("");
}

function renderRowHtml(row: CalendarRow, today: Date): string {
  const rel = formatRelativeDays(daysUntilPublish(row, today));
  const links = buildAllLinksFor(row.slug);

  const tableStyle = [
    "width:100%",
    "border-collapse:collapse",
    "margin:0 0 16px 0",
    "border:1px solid #d0d7de",
    "border-radius:6px",
    "background:#ffffff",
  ].join(";");

  const cellPad = "padding:10px 14px";
  const labelColor = "color:#57606a";

  const headerCell =
    `<tr><td style="${cellPad};border-bottom:1px solid #d0d7de;background:#f6f8fa">` +
      `<span style="display:inline-block;padding:2px 8px;border-radius:10px;` +
        `background:#dbeafe;color:#0a3069;font-size:12px;font-weight:600;` +
        `margin-right:8px">` +
        escapeHtml(rel) +
      `</span>` +
      `<span style="display:inline-block;padding:2px 8px;border-radius:10px;` +
        `background:#fff8c5;color:#7d4e00;font-size:12px;font-weight:600;` +
        `margin-right:8px">` +
        escapeHtml(row.status) +
      `</span>` +
      `<strong style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;` +
        `font-size:14px">` +
        escapeHtml(row.slug) +
      `</strong>` +
    `</td></tr>`;

  const notesCell =
    row.notes && row.notes.trim().length > 0
      ? `<tr><td style="${cellPad};color:#1f2328;font-style:italic">` +
          escapeHtml(row.notes) +
        `</td></tr>`
      : "";

  const metaCell =
    `<tr><td style="${cellPad};${labelColor};font-size:13px">` +
      `Publish: <strong style="color:#1f2328">${escapeHtml(row.publishDate)}</strong>` +
      ` &middot; Author: <strong style="color:#1f2328">${escapeHtml(row.author || "—")}</strong>` +
      ` &middot; Campaign: <strong style="color:#1f2328">${escapeHtml(row.campaign ?? "—")}</strong>` +
    `</td></tr>`;

  const linkStyle = "color:#0969da;text-decoration:none";
  const linksCell =
    `<tr><td style="${cellPad};border-top:1px solid #d0d7de;background:#fafbfc;font-size:13px">` +
      `<div><span style="${labelColor};display:inline-block;width:88px">Workspace:</span>` +
        `<a href="${escapeAttr(links.workspace)}" style="${linkStyle}">${escapeHtml(links.workspace)}</a></div>` +
      `<div style="margin-top:4px"><span style="${labelColor};display:inline-block;width:88px">Issue:</span>` +
        `<a href="${escapeAttr(links.issueSearch)}" style="${linkStyle}">${escapeHtml(links.issueSearch)}</a></div>` +
      `<div style="margin-top:4px"><span style="${labelColor};display:inline-block;width:88px">Continue:</span>` +
        `<a href="${escapeAttr(links.continueInClaude)}" style="${linkStyle}">Open in Claude</a></div>` +
    `</td></tr>`;

  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${tableStyle}">` +
      headerCell +
      notesCell +
      metaCell +
      linksCell +
    `</table>`
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pluralPieces(n: number): string {
  return n === 1 ? "piece" : "pieces";
}

function patExpiryWarningText(patExpiryDays: number | null): string | null {
  if (patExpiryDays === null) return null;
  if (patExpiryDays >= 14) return null;
  return `⚠ GitHub PAT expires in ${patExpiryDays} days — rotate before the function loses access.`;
}

/**
 * Minimal HTML-text escaper. We only emit content into element bodies
 * and double-quoted attribute values, so the standard 5-char set is
 * sufficient. No need for a full sanitization library — input shape is
 * known (CalendarRow strings parsed from our own markdown).
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  // Same set is safe for double-quoted attributes.
  return escapeHtml(s);
}
