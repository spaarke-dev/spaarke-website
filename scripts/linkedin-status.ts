// scripts/linkedin-status.ts
//
// Read-only health-check CLI for the LinkedIn integration. Inspects
// stored tokens in Key Vault for both `member` and `org` apps,
// reports expiry, runs a lightweight LinkedIn API call to confirm
// the token actually works, and surfaces the last publish per
// target by scanning `content-platform/calendar.md`.
//
// Never triggers a refresh. Never prints secret values. Exit code:
// 0 if both apps OK or pre-OAuth, 1 if any warning, 2 if any error.
//
// See projects/linkedin-publishing/tasks/040 for the full contract.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  type App,
  type LinkedInTokens,
  getTokens,
} from "./linkedin-shared.ts";
import { daysUntilExpiry } from "./linkedin-refresh-token.ts";

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */

const useColor = process.stdout.isTTY === true;

const C = {
  reset: useColor ? "\x1b[0m" : "",
  green: useColor ? "\x1b[32m" : "",
  yellow: useColor ? "\x1b[33m" : "",
  red: useColor ? "\x1b[31m" : "",
  dim: useColor ? "\x1b[2m" : "",
};

function green(s: string): string {
  return `${C.green}${s}${C.reset}`;
}
function yellow(s: string): string {
  return `${C.yellow}${s}${C.reset}`;
}
function red(s: string): string {
  return `${C.red}${s}${C.reset}`;
}
function dim(s: string): string {
  return `${C.dim}${s}${C.reset}`;
}

/* ------------------------------------------------------------------ */
/*  Severity tracking                                                  */
/* ------------------------------------------------------------------ */

type Severity = "ok" | "warn" | "error";

function worse(a: Severity, b: Severity): Severity {
  const rank: Record<Severity, number> = { ok: 0, warn: 1, error: 2 };
  return rank[a] >= rank[b] ? a : b;
}

/* ------------------------------------------------------------------ */
/*  LinkedIn validity probe                                            */
/* ------------------------------------------------------------------ */

type Validity = "valid" | "invalid" | "unknown";

async function probeToken(app: App, accessToken: string): Promise<Validity> {
  const url =
    app === "member"
      ? "https://api.linkedin.com/v2/userinfo"
      : "https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED";

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (app === "org") {
    headers["LinkedIn-Version"] = "202604";
    headers["X-Restli-Protocol-Version"] = "2.0.0";
  }

  try {
    const res = await fetch(url, { method: "GET", headers });
    if (res.status === 200) return "valid";
    if (res.status === 401) return "invalid";
    return "unknown";
  } catch {
    return "unknown";
  }
}

/* ------------------------------------------------------------------ */
/*  Last-publish lookup                                                */
/* ------------------------------------------------------------------ */

interface LastPublish {
  date: string;
  slug: string;
}

/**
 * Scans `content-platform/calendar.md` for rows that reference
 * `LinkedIn (<target>)` and returns the most-recent (date, slug)
 * for the requested target. Returns null if no row matches.
 *
 * Tolerant of arbitrary table column ordering — we extract the
 * first ISO date (YYYY-MM-DD) and the first plausible slug
 * (lowercase + hyphens) from any line that mentions LinkedIn (target).
 */
function findLastPublish(
  calendar: string,
  target: App,
): LastPublish | null {
  const needle = `LinkedIn (${target})`;
  const dateRe = /\b(\d{4}-\d{2}-\d{2})\b/;
  const slugRe = /\b([a-z0-9]+(?:-[a-z0-9]+)+)\b/;

  let best: LastPublish | null = null;
  for (const line of calendar.split(/\r?\n/)) {
    if (!line.includes(needle)) continue;
    const dateMatch = line.match(dateRe);
    if (!dateMatch) continue;
    const slugMatch = line.match(slugRe);
    const slug = slugMatch ? slugMatch[1] : "(unknown)";
    const candidate: LastPublish = { date: dateMatch[1], slug };
    if (!best || candidate.date > best.date) best = candidate;
  }
  return best;
}

async function loadCalendar(): Promise<string> {
  const path = resolve(process.cwd(), "content-platform", "calendar.md");
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/*  Per-app report                                                     */
/* ------------------------------------------------------------------ */

interface AppReport {
  severity: Severity;
  lines: string[];
}

async function reportApp(
  app: App,
  calendar: string,
): Promise<AppReport> {
  const lines: string[] = [];
  let severity: Severity = "ok";

  let tokens: LinkedInTokens | null;
  try {
    tokens = await getTokens(app);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    lines.push(`  ${red("✗")} ${app}: KV read failed — ${msg}`);
    return { severity: "error", lines };
  }

  if (!tokens) {
    // Pre-OAuth state: not an error, not a warning. Exit-code stays 0.
    lines.push(
      `  ${dim("·")} ${app}: Not authenticated. ` +
        `Run \`npx tsx scripts/linkedin-auth.ts --app=${app}\`.`,
    );
    return { severity: "ok", lines };
  }

  const days = daysUntilExpiry(tokens);
  const daysFmt = days.toFixed(1);
  const expiresAt = tokens.expiresAt;
  const urn = tokens.authorUrn;

  // Token-expiry assessment (independent of API probe).
  let expiryGlyph: string;
  let expirySummary: string;
  if (days < 0) {
    severity = worse(severity, "error");
    expiryGlyph = red("✗");
    expirySummary = `token expired ${Math.abs(days).toFixed(1)} days ago`;
  } else if (days < 14) {
    severity = worse(severity, "warn");
    expiryGlyph = yellow("⚠");
    expirySummary = `token expires in ${daysFmt} days`;
  } else {
    expiryGlyph = green("✓");
    expirySummary = `token valid, ${daysFmt} days remaining`;
  }

  // Lightweight API probe (skip if token is already known-expired —
  // the 401 would just be noise).
  let validitySuffix = "";
  if (days >= 0) {
    const validity = await probeToken(app, tokens.accessToken);
    if (validity === "invalid") {
      severity = worse(severity, "error");
      expiryGlyph = red("✗");
      validitySuffix = " " + red("[API rejected token]");
    } else if (validity === "unknown") {
      severity = worse(severity, "warn");
      if (expiryGlyph === green("✓")) expiryGlyph = yellow("⚠");
      validitySuffix = " " + yellow("[API check inconclusive]");
    }
  }

  lines.push(
    `  ${expiryGlyph} ${app}: ${expirySummary} (${urn})${validitySuffix}`,
  );
  lines.push(`      ${dim(`expires at ${expiresAt}`)}`);

  const last = findLastPublish(calendar, app);
  if (last) {
    lines.push(`      Last publish: ${last.date} — ${last.slug}`);
  } else {
    lines.push(`      Last publish: none recorded`);
  }

  return { severity, lines };
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<number> {
  console.log("LinkedIn integration status:");

  const calendar = await loadCalendar();
  const apps: App[] = ["member", "org"];

  let overall: Severity = "ok";
  for (const app of apps) {
    const report = await reportApp(app, calendar);
    overall = worse(overall, report.severity);
    for (const line of report.lines) console.log(line);
  }

  if (overall === "error") return 2;
  if (overall === "warn") return 1;
  return 0;
}

main()
  .then((code) => {
    process.exit(code);
  })
  .catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(red(`ERROR: ${msg}`));
    process.exit(2);
  });
