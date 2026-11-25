/**
 * The links export as CSV (phase 2 FR-05). Pure, so the browser builds the
 * file and it is never written on the server.
 */

export const LINK_PROVIDERS = ["claude", "chatgpt", "gemini"] as const;
export type LinkProvider = (typeof LINK_PROVIDERS)[number];

export type MemberLinks = {
  contactId: string;
  email: string;
  name?: string;
  organization?: string;
  group?: string;
  templateLabel?: string;
  code: string;
  /** Empty when the member has no brief, or the briefs are off. */
  briefUrl?: string;
  ask: Record<LinkProvider, string>;
  /** The site page Ralph entered, tagged for this member. */
  pageUrl?: string;
};

const HEADER = [
  "Email",
  "Name",
  "Organization",
  "Group",
  "Template",
  "Code",
  "Brief link",
  "Ask Claude",
  "Ask ChatGPT",
  "Ask Gemini",
  "Page link",
];

/**
 * One cell. Quotes when needed, and a leading = + - @ (or a tab or return)
 * gets an apostrophe, so a spreadsheet never runs a cell as a formula.
 */
export function csvCell(value: string | undefined): string {
  let v = value ?? "";
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** The whole file, with a byte order mark so Excel reads it as UTF-8. */
export function linksCsv(rows: readonly MemberLinks[]): string {
  const lines = [HEADER.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.email,
        r.name,
        r.organization,
        r.group,
        r.templateLabel,
        r.code,
        r.briefUrl,
        r.ask.claude,
        r.ask.chatgpt,
        r.ask.gemini,
        r.pageUrl,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return `﻿${lines.join("\r\n")}\r\n`;
}
