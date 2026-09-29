// Lists evaluation access requests that never reached the platform.
//
// These are leads. The BFF is the system of record, but when it could not be
// reached the request was written to our own Table Storage instead so that an
// outage costs a reconciliation step rather than a customer. This is how you
// find the ones waiting.
//
//   STORAGE_ACCOUNT_CONNECTION="..." npm run demo-request:orphans
//   npm run demo-request:orphans -- --all      also show pending and rejected
//   npm run demo-request:orphans -- --days 30  default is 90
//
// After re-entering one in the platform, mark it so it stops appearing:
//   npm run demo-request:orphans -- --forwarded <rowKey>
//
// See docs/demo-request-flow.md.

import { TableClient, odata } from "@azure/data-tables";

const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
if (!connectionString) {
  console.error("STORAGE_ACCOUNT_CONNECTION is not set.");
  process.exit(1);
}

const argv = process.argv.slice(2);
const flag = (name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const showAll = argv.includes("--all");
const days = Number(flag("days") ?? 90);
const markForwarded = flag("forwarded");

const client = TableClient.fromConnectionString(connectionString, "DemoRequests");

if (markForwarded) {
  await client.updateEntity(
    { partitionKey: "demo-request", rowKey: markForwarded, status: "forwarded", detail: "reconciled by hand" },
    "Merge",
  );
  console.log(`Marked ${markForwarded} as forwarded.`);
  process.exit(0);
}

const cutoff = new Date(Date.now() - days * 86_400_000).toISOString();

type Row = {
  rowKey: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  useCase?: string;
  notes?: string;
  detail?: string;
  createdAt?: string;
  trackingId?: string;
};

const rows: Row[] = [];
for await (const row of client.listEntities<Row>({
  queryOptions: { filter: odata`PartitionKey eq 'demo-request' and createdAt ge ${cutoff}` },
})) {
  rows.push(row);
}
rows.sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

const counts = rows.reduce<Record<string, number>>((acc, r) => {
  const key = r.status ?? "unknown";
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});

console.log(`\nEvaluation access requests, last ${days} day(s): ${rows.length}`);
for (const [status, n] of Object.entries(counts).sort()) {
  console.log(`  ${status.padEnd(12)} ${n}`);
}

// "pending" belongs here as well as "orphaned": it means the process died
// between writing the lead and recording what became of it, so nobody knows
// whether the platform got it.
const needsAction = rows.filter(
  (r) => r.status === "orphaned" || r.status === "pending" || (showAll && r.status === "rejected"),
);

if (needsAction.length === 0) {
  console.log("\nNothing waiting. Every request reached the platform.");
  process.exit(0);
}

console.log(`\n${needsAction.length} need re-entering in the platform:\n`);
for (const r of needsAction) {
  console.log(`  ${r.createdAt ?? "?"}  [${r.status}]  rowKey ${r.rowKey}`);
  console.log(`    ${r.firstName ?? ""} ${r.lastName ?? ""} <${r.email ?? ""}>`);
  console.log(`    ${r.organization ?? ""}${r.jobTitle ? `, ${r.jobTitle}` : ""}${r.phone ? `, ${r.phone}` : ""}`);
  console.log(`    use case: ${r.useCase || "-"}`);
  if (r.notes) console.log(`    notes: ${r.notes}`);
  if (r.detail) console.log(`    why: ${r.detail}`);
  console.log("");
}

console.log("Re-enter each in the platform, then:");
console.log("  npm run demo-request:orphans -- --forwarded <rowKey>");
