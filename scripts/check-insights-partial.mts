// Exercise the partial answer store against real Table Storage.
//
// Task 023. The reader-facing claim is that a sentence written during the request
// can be read back during the request, that it can only be read back by the
// session that wrote it, and that it is gone afterwards. None of those are things
// to reason about in development against a mock, so this runs against a real
// storage account in its own table.
//
//   npx tsx scripts/check-insights-partial.mts           run every check
//   npx tsx scripts/check-insights-partial.mts --clean    delete the self-test rows
//
// Needs STORAGE_ACCOUNT_CONNECTION in the environment or in .env.local. Writes
// only to the table named by INSIGHTS_PARTIAL_TABLE, which this script sets to
// InsightsPartialsSelfTest, so live partials are never touched.

import { existsSync, readFileSync } from "node:fs";
import { TableClient, odata } from "@azure/data-tables";

process.env.INSIGHTS_PARTIAL_TABLE = "InsightsPartialsSelfTest";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

if (!process.env.STORAGE_ACCOUNT_CONNECTION) {
  console.error(
    "STORAGE_ACCOUNT_CONNECTION is not set. Pass it in the environment, for example\n" +
      '  STORAGE_ACCOUNT_CONNECTION=$(az staticwebapp appsettings list --name swa-spaarke-website --query "properties.STORAGE_ACCOUNT_CONNECTION" -o tsv) npx tsx scripts/check-insights-partial.mts',
  );
  process.exit(1);
}

// Imported after the environment is set, because the table name is read at module load.
const {
  PartialWriter,
  readPartial,
  discardPartial,
  sweepExpiredPartials,
  validRequestId,
  partialAvailable,
  PARTIAL_TTL_MS,
} = await import("@/lib/insights/partial");
type InsightsEvent = import("@/lib/insights/stream").InsightsEvent;

const cleanOnly = process.argv.includes("--clean");

let failures = 0;
function check(ok: boolean, label: string, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
}

const table = TableClient.fromConnectionString(
  process.env.STORAGE_ACCOUNT_CONNECTION!,
  process.env.INSIGHTS_PARTIAL_TABLE!,
);

/** Distinct ids per run, so a previous run cannot make this one pass. */
const stamp = Date.now().toString(36);
const ID = `selftest${stamp}aaaaaaaa`.slice(0, 32);
const OTHER_ID = `selftestother${stamp}aaa`.slice(0, 32);
const SESSION = "selftestsession";
const WRONG_SESSION = "selftestwrongses";

const text = (t: string): InsightsEvent => ({ type: "text", text: t, general: false });

async function removeSelfTestRows(): Promise<number> {
  let deleted = 0;
  try {
    const rows = table.listEntities<{ partitionKey: string; rowKey: string }>({
      queryOptions: { filter: odata`PartitionKey ge 'selftest' and PartitionKey lt 'selftesu'` },
    });
    for await (const row of rows) {
      await table.deleteEntity(row.partitionKey, row.rowKey);
      deleted += 1;
    }
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode !== 404) throw err;
  }
  return deleted;
}

async function main() {
  if (cleanOnly) {
    const deleted = await removeSelfTestRows();
    console.log(`removed ${deleted} self-test row(s) from ${process.env.INSIGHTS_PARTIAL_TABLE}`);
    return;
  }

  console.log(`partial answer store, table ${process.env.INSIGHTS_PARTIAL_TABLE}\n`);

  // ---------------------------------------------------------------- id shape
  console.log("request id validation");
  check(validRequestId("a".repeat(22)) === "a".repeat(22), "a 22 character id is accepted");
  check(validRequestId("tooshort") === null, "an 8 character id is refused", "it is the only secret here");
  check(validRequestId("has spaces in it aaaa") === null, "a space is refused");
  check(validRequestId("bad/chars/aaaaaaaaaaa") === null, "a slash is refused", "it would be a partition key");
  check(validRequestId(undefined) === null, "a missing id is refused");
  check(partialAvailable(), "partials are available with a connection string");

  // --------------------------------------------------------- write then read
  console.log("\nwriting during the request and reading it back");
  const writer = new PartialWriter(ID, SESSION);
  writer.push([{ type: "provenance", value: "corpus" }, text("First sentence. ")]);
  writer.push([text("Second sentence. ")]);
  const settledFirst = await writer.settled();
  check(settledFirst.written === 3, "three events written", `wrote ${settledFirst.written}`);
  check(settledFirst.error === null, "no write error", settledFirst.error ?? "");

  const first = await readPartial({ requestId: ID, session: SESSION, after: 0 });
  check(first.events.length === 3, "three events read back", `got ${first.events.length}`);
  check(first.cursor === 3, "cursor is the last sequence", `cursor ${first.cursor}`);
  check(first.complete === false, "not complete before a done event");
  check(
    first.events[0]?.type === "provenance" &&
      (first.events[1] as { text?: string })?.text === "First sentence. " &&
      (first.events[2] as { text?: string })?.text === "Second sentence. ",
    "events come back in the order they were produced",
  );

  // The client derives each event's position from cursor minus length, so this
  // invariant is what makes deduplication against the POST exact rather than
  // approximate. If it breaks, a reader sees a sentence twice.
  check(first.cursor - first.events.length === 0, "cursor minus length is the previous cursor");

  // ------------------------------------------------------------- the cursor
  console.log("\npolling with a cursor");
  writer.push([text("Third sentence. ")]);
  await writer.settled();
  const second = await readPartial({ requestId: ID, session: SESSION, after: first.cursor });
  check(second.events.length === 1, "only the new event is returned", `got ${second.events.length}`);
  check(
    (second.events[0] as { text?: string })?.text === "Third sentence. ",
    "and it is the right one",
  );
  check(second.cursor === 4, "cursor advanced", `cursor ${second.cursor}`);
  check(second.cursor - second.events.length === first.cursor, "positions stay contiguous across polls");

  const nothingNew = await readPartial({ requestId: ID, session: SESSION, after: second.cursor });
  check(nothingNew.events.length === 0, "a poll with nothing new returns nothing");
  check(nothingNew.cursor === second.cursor, "and does not move the cursor");

  // ------------------------------------------------------------- completion
  console.log("\ncompletion");
  writer.push([
    {
      type: "done",
      provenance: "corpus",
      repairs: { citationsCorrected: 0, quotationsDemoted: 0, dashesNormalized: 0 },
      usage: { input: 1, output: 1, cacheRead: 1, cacheWrite: 0 },
    },
  ]);
  await writer.settled();
  const afterDone = await readPartial({ requestId: ID, session: SESSION, after: second.cursor });
  check(afterDone.complete === true, "complete is true once done has been written");

  const errorWriter = new PartialWriter(OTHER_ID, SESSION);
  errorWriter.push([{ type: "error", code: "TIMEOUT", message: "stopped" }]);
  await errorWriter.settled();
  const afterError = await readPartial({ requestId: OTHER_ID, session: SESSION, after: 0 });
  check(afterError.complete === true, "and true on an error event, so the poller stops");

  // ---------------------------------------------------------------- privacy
  console.log("\nwhat another reader sees");
  const wrongSession = await readPartial({ requestId: ID, session: WRONG_SESSION, after: 0 });
  check(wrongSession.events.length === 0, "a guessed id with the wrong session returns nothing");
  check(wrongSession.complete === false, "and nothing that says the id was real");

  const unknownId = await readPartial({
    requestId: "neverwrittenaaaaaaaaaa",
    session: SESSION,
    after: 0,
  });
  check(unknownId.events.length === 0, "an unknown id returns nothing");
  check(
    JSON.stringify(unknownId) === JSON.stringify(wrongSession),
    "an unknown id and a wrong session are indistinguishable",
    "otherwise the difference is an oracle",
  );

  // ------------------------------------------------------------------ expiry
  console.log("\nexpiry");
  const ttlMinutes = Math.round(PARTIAL_TTL_MS / 60_000);
  check(ttlMinutes <= 60, "the time to live is under an hour", `${ttlMinutes} minutes`);

  const discarded = await discardPartial(ID);
  check(discarded === 5, "discard removed every row for that request", `deleted ${discarded}`);
  const afterDiscard = await readPartial({ requestId: ID, session: SESSION, after: 0 });
  check(afterDiscard.events.length === 0, "and the request reads as if it never ran");
  const otherSurvived = await readPartial({ requestId: OTHER_ID, session: SESSION, after: 0 });
  check(otherSurvived.events.length === 1, "and left the other request alone");

  // A row written with an expiry in the past, which is what a request killed
  // between its first sentence and its close leaves behind.
  const orphanId = `selftestorphan${stamp}aa`.slice(0, 32);
  await table.createEntity({
    partitionKey: orphanId,
    rowKey: "0001",
    payload: JSON.stringify(text("orphaned. ")),
    session: SESSION,
    expiresAt: new Date(Date.now() - 60_000).toISOString(),
  });
  const swept = await sweepExpiredPartials();
  check(swept >= 1, "the sweep deleted the expired row", `deleted ${swept}`);
  const orphanGone = await readPartial({ requestId: orphanId, session: SESSION, after: 0 });
  check(orphanGone.events.length === 0, "and it is gone");
  const liveStillThere = await readPartial({ requestId: OTHER_ID, session: SESSION, after: 0 });
  check(liveStillThere.events.length === 1, "and the sweep left an unexpired row alone");

  // ----------------------------------------------------------------- tidy up
  await removeSelfTestRows();
  console.log("\nself-test rows removed.");

  console.log(
    failures === 0
      ? "\nall checks passed."
      : `\n${failures} check(s) failed.`,
  );
  if (failures > 0) process.exit(1);
}

await main();
