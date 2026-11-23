// TLTF Summit 2026 import (projects/market-access, task 050, FR-12).
//
// Builds the tltf-2026 campaign (visibility investor) from the private files:
// the outreach list, the brief keys, the Summit people and the calendar
// export. Every Summit meeting in the calendar is imported as held; correct
// the ones that did not happen with the member status override.
//
//   npm run market:import-tltf -- \
//     --outreach <index.csv> --brief-keys <brief-keys.csv> \
//     --people <people.json> --calendar <calendar.json> [--dry-run]
//
// --dry-run reads the files and prints counts only; it never touches storage.
// A real run needs STORAGE_ACCOUNT_CONNECTION (or STORAGE_CS). It prints
// counts, never names or addresses, and writes nothing under the repo. Run it
// again safely: nothing is added twice.

import { readFileSync } from "node:fs";

const USAGE =
  "Usage: npm run market:import-tltf -- --outreach <csv> --brief-keys <csv> --people <json> --calendar <json> [--dry-run]";

function args(argv: string[]) {
  const out: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) throw new Error(`Unexpected argument: ${a}\n${USAGE}`);
    const name = a.slice(2);
    if (name === "dry-run") out[name] = true;
    else if (argv[i + 1] && !argv[i + 1].startsWith("--")) out[name] = argv[++i];
    else throw new Error(`--${name} needs a path\n${USAGE}`);
  }
  for (const k of ["outreach", "brief-keys", "people", "calendar"]) {
    if (typeof out[k] !== "string") throw new Error(`Missing --${k}\n${USAGE}`);
  }
  return out as { outreach: string; "brief-keys": string; people: string; calendar: string; "dry-run"?: true };
}

const opts = args(process.argv.slice(2));
const dryRun = Boolean(opts["dry-run"]);
if (!process.env.STORAGE_ACCOUNT_CONNECTION?.trim() && process.env.STORAGE_CS?.trim()) {
  process.env.STORAGE_ACCOUNT_CONNECTION = process.env.STORAGE_CS;
}

// The library modules compile as CommonJS under tsx, so named imports come from dynamic imports.
const { parseCsv } = await import("@/lib/market/csv");
const tltf = await import("@/lib/market/tltf-import");

const read = (p: string) => readFileSync(p, "utf8");
const outreachCsv = parseCsv(read(opts.outreach), { maxRows: 5000 });
const keysCsv = parseCsv(read(opts["brief-keys"]), { maxRows: 5000 });
const people = tltf.parsePeople(JSON.parse(read(opts.people)));
const calendar = tltf.parseCalendar(JSON.parse(read(opts.calendar)));

const outreachMap = tltf.columnMapping(outreachCsv.headers, tltf.OUTREACH_FIELDS);
const keysMap = tltf.columnMapping(keysCsv.headers, tltf.BRIEF_KEY_FIELDS);
console.log("Column mapping (field -> column):");
for (const [f, i] of Object.entries(outreachMap)) console.log(`  outreach ${f.padEnd(9)} -> ${outreachCsv.headers[i]}`);
for (const [f, i] of Object.entries(keysMap)) console.log(`  brief keys ${f.padEnd(7)} -> ${keysCsv.headers[i]}`);

const briefKeys = tltf.parseBriefKeys(keysCsv);
const outreach = tltf.parseOutreach(outreachCsv, briefKeys, people);
const plan = tltf.buildPlan(outreach, calendar, people, outreachCsv.rows.length);

console.log("\nPlan:");
for (const [k, v] of Object.entries(plan.counts)) console.log(`  ${k.padEnd(20)} ${v}`);
console.log(`  ${"calendarCancelled".padEnd(20)} ${calendar.cancelled}`);
console.log(`  ${"calendarInternal".padEnd(20)} ${calendar.internalOnly}`);
console.log(`  ${"members".padEnd(20)} ${plan.members.length}`);
console.log(`  ${"activities".padEnd(20)} ${plan.activities.length}`);
console.log(`  ${"campaign dates".padEnd(20)} ${plan.window ? `${plan.window.startDate} to ${plan.window.endDate}` : "none"}`);
if (plan.issues.length) {
  console.log("\nIssues:");
  for (const i of plan.issues) console.log(`  ${i.where}: ${i.reason}`);
}

if (dryRun) {
  console.log("\nDry run: nothing written.");
  process.exit(0);
}

const { isMarketConfigured, tableName } = await import("@/lib/market/tables");
if (!isMarketConfigured()) {
  console.error("\nSet STORAGE_ACCOUNT_CONNECTION (or STORAGE_CS) to write, or pass --dry-run.");
  process.exit(1);
}
console.log(`\nWriting to tables such as ${tableName("contacts")} ...`);
const { runTltfImport } = await import("@/lib/market/tltf-run");
const result = await runTltfImport(plan, "import-tltf");

console.log(`\nCampaign: ${result.campaign}`);
console.log(`Contacts: ${JSON.stringify(result.contacts)}`);
console.log(`Members: ${JSON.stringify(result.members)}`);
console.log(`Activities: ${JSON.stringify(result.activities)}`);
console.log(`Funnel: ${JSON.stringify(result.funnel)}`);
if (result.issues.length) {
  console.log("Issues:");
  for (const i of result.issues) console.log(`  ${i.where}: ${i.reason}`);
}

// Compare with the outreach list (FR-09 acceptance). Bounced members are sent minus delivered.
const checks: [string, number, number][] = [
  ["sent", plan.counts.sent, result.funnel.sent],
  ["bounced", plan.counts.bounced, result.funnel.sent - result.funnel.delivered],
  ["replied", plan.counts.replies, result.funnel.replied],
];
console.log("\nAgainst the outreach list (expected / campaign):");
let mismatch = false;
for (const [name, want, got] of checks) {
  const same = want === got;
  if (!same) mismatch = true;
  console.log(`  ${name.padEnd(8)} ${want} / ${got}${same ? "" : "  <- differs"}`);
}
if (mismatch) {
  console.log("A difference can come from an override or from mail logged by the sync for the same people.");
  process.exitCode = 2;
}
