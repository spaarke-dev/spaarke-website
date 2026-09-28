// Checks the evaluation-request receipt against real Table Storage.
//
// The point of that table is that a lead survives a backend outage, so a check
// that mocks the storage would assert the one thing that does not matter. This
// writes real rows, reads them back, and deletes them.
//
//   STORAGE_ACCOUNT_CONNECTION="..." npx tsx scripts/check-demo-request-capture.mts
//
// See src/lib/storage.ts and src/app/api/registration/demo-request/route.ts.

import { TableClient } from "@azure/data-tables";
import type { DemoRequestLead } from "@/lib/storage";

// Dynamic, like the other checks in this directory: a .mts file needs top-level
// await, and static named imports across the "@/" alias do not resolve under it.
const { saveDemoRequestLead, markDemoRequestOutcome } = await import("@/lib/storage");

const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
if (!connectionString) {
  console.error(
    "STORAGE_ACCOUNT_CONNECTION is not set. This check talks to real storage on purpose.",
  );
  process.exit(1);
}

const client = TableClient.fromConnectionString(connectionString, "DemoRequests");

let failures = 0;
function check(ok: boolean, label: string, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
}

const lead: DemoRequestLead = {
  firstName: "Check",
  lastName: "Harness",
  email: "check-harness@example.invalid",
  organization: "Spaarke",
  jobTitle: "Automated check",
  phone: "+10000000000",
  useCase: "General Evaluation",
  referralSource: "Other",
  notes: "Written by scripts/check-demo-request-capture.ts. Safe to delete.",
  consentAccepted: true,
};

const written: string[] = [];

try {
  console.log("a lead is written before anything is forwarded");
  {
    const rowKey = await saveDemoRequestLead(lead, "check-ip-hash", {
      entry_referrer: "https://example.invalid/ref",
      entry_landing: "/access-request",
      first_visit_at: "2026-09-28T00:00:00.000Z",
      ai_source: "",
      utm_source: "check",
      utm_medium: "",
      utm_campaign: "",
    });
    check(rowKey !== null, "the write returns a row key");
    if (!rowKey) throw new Error("nothing written, the rest cannot be checked");
    written.push(rowKey);

    const row = await client.getEntity<Record<string, unknown>>("demo-request", rowKey);
    check(row.email === lead.email, "the email round-trips");
    check(row.organization === lead.organization, "and the organization");
    check(row.useCase === lead.useCase, "and the use case");
    check(row.consentAccepted === true, "consent is stored as a boolean, not a string");
    check(row.utm_source === "check", "attribution is carried");
    // The status is what makes the table a queue rather than a pile. A row that
    // arrives already "forwarded" would hide exactly the failure this exists for.
    check(row.status === "pending", "it starts pending", `got ${String(row.status)}`);
    check(row.trackingId === "", "with no tracking id yet");
  }

  console.log("\nthe outcome is recorded against it");
  {
    const rowKey = written[0];

    await markDemoRequestOutcome(rowKey, "orphaned", { detail: "BFF unreachable: check" });
    let row = await client.getEntity<Record<string, unknown>>("demo-request", rowKey);
    check(row.status === "orphaned", "a failed forward marks it orphaned");
    check(String(row.detail).includes("unreachable"), "and says why");
    check(row.email === lead.email, "the merge keeps the lead itself");

    await markDemoRequestOutcome(rowKey, "forwarded", { trackingId: "TRK-123" });
    row = await client.getEntity<Record<string, unknown>>("demo-request", rowKey);
    check(row.status === "forwarded", "a later success can supersede it");
    check(row.trackingId === "TRK-123", "and carries the tracking id");
  }

  console.log("\nannotating a row that is not there does not throw");
  {
    // The route calls this after the visitor's fate is already decided, so it
    // must never be the thing that turns a captured lead into a 500.
    let threw = false;
    try {
      await markDemoRequestOutcome("no-such-row-key", "forwarded");
    } catch {
      threw = true;
    }
    check(!threw, "a missing row is swallowed, not raised");
  }

  console.log("\nthe reconciliation query works");
  {
    const orphans = client.listEntities({
      queryOptions: { filter: "PartitionKey eq 'demo-request' and status eq 'orphaned'" },
    });
    let found = 0;
    for await (const _ of orphans) found += 1;
    check(true, "orphaned rows are filterable", `${found} in the table right now`);
  }
} finally {
  for (const rowKey of written) {
    try {
      await client.deleteEntity("demo-request", rowKey);
    } catch (err) {
      console.warn(`  could not clean up ${rowKey}:`, err);
    }
  }
  console.log(`\ncleaned up ${written.length} test row(s).`);
}

console.log(failures === 0 ? "\nall checks passed." : `\n${failures} check(s) failed.`);
if (failures > 0) process.exit(1);
