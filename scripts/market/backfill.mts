// One-time backfill (projects/market-access, task 052, FR-13).
//
// Copies the site's own tables (ContactSubmissions, DemoRequests,
// DesignPartnerApplications, EarlyReleaseSignups, InvestorOverviewRequests,
// MeetingBookings) and the App Insights brief.read and ask_ai.click events
// into contacts and activities, with their original times and UTM fields.
// It uses the live writers' source IDs, so a second run, or a row the live
// writers already logged, adds nothing.
//
//   npm run market:backfill -- [--from-file <export.json>]... \
//     [--app <app insights name> --resource-group <group>] [--dry-run]
//
// Events come from the private export (task 004) given with --from-file, from
// a live query (always with --offset 90d), or both; repeats are dropped.
// Run it before 2027-02-11, when the 2026-11-13 send leaves App Insights.
//
// --dry-run reads everything and counts what would be added, writing nothing.
// Needs STORAGE_ACCOUNT_CONNECTION (or STORAGE_CS). Prints counts only, never
// names or addresses, and writes nothing under the repo.

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const USAGE =
  "Usage: npm run market:backfill -- [--from-file <json>]... [--app <name> --resource-group <group>] [--dry-run]";

const argv = process.argv.slice(2);
const files: string[] = [];
let app: string | undefined;
let group: string | undefined;
let dryRun = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const value = () => {
    const v = argv[++i];
    if (!v || v.startsWith("--")) throw new Error(`${a} needs a value\n${USAGE}`);
    return v;
  };
  if (a === "--dry-run") dryRun = true;
  else if (a === "--from-file") files.push(value());
  else if (a === "--app") app = value();
  else if (a === "--resource-group") group = value();
  else throw new Error(`Unexpected argument: ${a}\n${USAGE}`);
}
if (Boolean(app) !== Boolean(group)) throw new Error(`--app and --resource-group go together\n${USAGE}`);
if (!files.length && !app) console.warn("No events source given: only the site tables are backfilled.");

if (!process.env.STORAGE_ACCOUNT_CONNECTION?.trim() && process.env.STORAGE_CS?.trim()) {
  process.env.STORAGE_ACCOUNT_CONNECTION = process.env.STORAGE_CS;
}
const connection = process.env.STORAGE_ACCOUNT_CONNECTION?.trim();
if (!connection) {
  console.error("Set STORAGE_ACCOUNT_CONNECTION (or STORAGE_CS): the site tables are read from storage, even in a dry run.");
  process.exit(1);
}

// The library modules compile as CommonJS under tsx, so named imports come from dynamic imports.
const bf = await import("@/lib/market/backfill");
const { FORM_SOURCES } = await import("@/lib/market/writers");
const { getSlotRules } = await import("@/lib/meet/config");

function rowsOfFile(path: string): unknown[] {
  const data = JSON.parse(readFileSync(path, "utf8")) as unknown;
  if (Array.isArray(data)) return data;
  const d = data as { rows?: unknown[]; tables?: { columns: { name: string }[]; rows: unknown[][] }[] };
  if (Array.isArray(d.rows)) return d.rows;
  if (d.tables?.[0]) return tableRows(d.tables[0]);
  throw new Error(`${path}: no rows found`);
}

function tableRows(t: { columns: { name: string }[]; rows: unknown[][] }): unknown[] {
  return t.rows.map((r) => Object.fromEntries(t.columns.map((c, i) => [c.name, r[i]])));
}

function liveEvents(appName: string, rg: string): unknown[] {
  // The query goes through a file (az reads @file), so no shell quoting touches it.
  const dir = mkdtempSync(join(tmpdir(), "ma-backfill-"));
  const queryFile = join(dir, "query.kql");
  writeFileSync(
    queryFile,
    "customEvents | where name in ('brief.read','ask_ai.click') | project timestamp, name, customDimensions | order by timestamp asc",
  );
  try {
    const r = spawnSync(
      "az",
      ["monitor", "app-insights", "query", "--app", appName, "--resource-group", rg, "--offset", "90d", "--analytics-query", `@${queryFile}`, "-o", "json"],
      { encoding: "utf8", shell: process.platform === "win32", maxBuffer: 256 * 1024 * 1024 },
    );
    if (r.status !== 0) throw new Error(`az query failed: ${(r.stderr || "").trim().split("\n")[0]}`);
    const out = JSON.parse(r.stdout) as { tables: { columns: { name: string }[]; rows: unknown[][] }[] };
    return tableRows(out.tables[0]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const rawEvents: unknown[] = [];
for (const f of files) rawEvents.push(...rowsOfFile(f));
if (app && group) rawEvents.push(...liveEvents(app, group));
const events = bf.parseEvents(rawEvents);

const forms: Record<string, Record<string, unknown>[]> = {};
for (const kind of bf.FORM_KINDS) forms[kind] = await bf.readTable(connection, FORM_SOURCES[kind]);
const bookings = await bf.readTable(connection, bf.BOOKINGS_TABLE);

console.log(dryRun ? "Dry run: counting, nothing is written.\n" : "Backfilling.\n");
const counts = await bf.runBackfill(
  { forms, bookings, events, hostTimeZone: getSlotRules().hostTimeZone },
  { write: !dryRun, who: "backfill" },
);

const pad = (s: string | number, n: number) => String(s).padStart(n);
console.log(`${"Source".padEnd(27)}${pad("rows", 6)}${pad("activities", 12)}${pad(dryRun ? "to add" : "added", 8)}${pad("already", 9)}  skipped`);
for (const [source, c] of Object.entries(counts)) {
  const skipped = Object.entries(c.skipped).map(([r, n]) => `${n} ${r}`).join("; ") || "0";
  console.log(`${source.padEnd(27)}${pad(c.rows, 6)}${pad(c.activities, 12)}${pad(c.added, 8)}${pad(c.already, 9)}  ${skipped}`);
}
const span = events.length ? `${new Date(events[0].at).toISOString().slice(0, 16)} to ${new Date(events[events.length - 1].at).toISOString().slice(0, 16)} UTC` : "none";
console.log(`\nEvents read: ${events.length} (${span}).`);
console.log("Every row is accounted for: activities = added + already + skipped.");
