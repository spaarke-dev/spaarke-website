// Exercise the insights defences against real Table Storage.
//
// Task 021. The existing in-process limiter's failure mode is invisible in
// development, because the process never recycles there, which is exactly why it
// survived this long. So this runs against a real storage account, in its own
// table, and the durability check is performed by running the script twice in two
// processes rather than by reasoning about it.
//
//   npx tsx scripts/check-insights-defences.ts            first pass, leaves counters behind
//   npx tsx scripts/check-insights-defences.ts --second   second pass, asserts they survived
//   npx tsx scripts/check-insights-defences.ts --clean    delete the self-test rows
//
// Needs STORAGE_ACCOUNT_CONNECTION in the environment or in .env.local. Writes
// only to the table named by INSIGHTS_COUNTER_TABLE, which this script sets to
// InsightsCountersSelfTest, so production counters are never touched.

import { existsSync, readFileSync } from "node:fs";
import { TableClient, odata } from "@azure/data-tables";

process.env.INSIGHTS_COUNTER_TABLE = "InsightsCountersSelfTest";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

if (!process.env.STORAGE_ACCOUNT_CONNECTION) {
  console.error(
    "STORAGE_ACCOUNT_CONNECTION is not set. Pass it in the environment, for example\n" +
      "  STORAGE_ACCOUNT_CONNECTION=$(az staticwebapp appsettings list --name swa-spaarke-website --query \"properties.STORAGE_ACCOUNT_CONNECTION\" -o tsv) npx tsx scripts/check-insights-defences.ts",
  );
  process.exit(1);
}

// Imported after the environment is set, because the table name is read at module load.
const { checkDurableLimits, isSessionVerified, markSessionVerified, LIMITS, sweepExpiredCounters, utcDay, utcHour } =
  await import("@/lib/insights/rate-limit-durable");
const { ceilingState, recordSpend, turnCostUsd } = await import("@/lib/insights/ceiling");

const second = process.argv.includes("--second");
const cleanOnly = process.argv.includes("--clean");

/** Distinct per run so two passes of the first phase do not collide. */
const IP = second ? "selftest-durable" : process.argv.includes("--durable") ? "selftest-durable" : "selftest-limits";
const SESSION = second ? "selftestdurable" : "selftestlimits";

let failures = 0;
function check(ok: boolean, label: string, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
}

const table = TableClient.fromConnectionString(
  process.env.STORAGE_ACCOUNT_CONNECTION!,
  process.env.INSIGHTS_COUNTER_TABLE!,
);

async function ensureSelfTestTable(): Promise<void> {
  try {
    await table.createTable();
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode !== 409) throw err;
  }
}

async function removeSelfTestRows(): Promise<number> {
  let deleted = 0;
  for await (const row of table.listEntities<{ partitionKey: string; rowKey: string }>()) {
    if (!row.rowKey.startsWith("selftest") && row.partitionKey !== "global") continue;
    await table.deleteEntity(row.partitionKey, row.rowKey);
    deleted += 1;
  }
  return deleted;
}

async function main() {
  console.log(`table ${process.env.INSIGHTS_COUNTER_TABLE}, ip ${IP}\n`);

  await ensureSelfTestTable();

  if (cleanOnly) {
    const deleted = await removeSelfTestRows();
    console.log(`removed ${deleted} self-test row(s).`);
    return 0;
  }

  if (second) {
    // The recycle test. This is a fresh process with an empty in-process Map, so
    // any count it sees came out of storage.
    console.log("second pass, a new process with no in-memory state");
    const decision = await checkDurableLimits(IP, SESSION);
    const hourRow = await table.getEntity<{ count: number }>("ip-hour", `${IP}-${utcHour()}`);
    check(
      hourRow.count > 1,
      "the per-IP hourly count survived the process ending",
      `count is now ${hourRow.count}`,
    );
    check(
      await isSessionVerified(SESSION),
      "the verified session survived the process ending",
    );
    check(
      hourRow.count > LIMITS.perIpHour ? decision.allowed === false : decision.allowed === true,
      "the decision follows the stored count rather than a fresh one",
      JSON.stringify(decision),
    );
    return failures;
  }

  console.log("first pass");

  // Start clean so the counts asserted below are this run's.
  await removeSelfTestRows();

  // Per-IP hourly limit.
  let blocked: Awaited<ReturnType<typeof checkDurableLimits>> | null = null;
  for (let i = 1; i <= LIMITS.perIpHour + 1; i += 1) {
    const decision = await checkDurableLimits(IP, SESSION);
    if (!decision.allowed) {
      blocked = decision;
      check(i === LIMITS.perIpHour + 1, "the hourly limit blocks on the request after the limit", `blocked on ${i}`);
      break;
    }
  }
  check(blocked !== null && !blocked.allowed, "the hourly limit blocks at all");
  check(
    blocked !== null && !blocked.allowed && blocked.scope === "ip-hour",
    "the block names the scope that fired",
    blocked && !blocked.allowed ? blocked.scope : "none",
  );
  check(
    blocked !== null && !blocked.allowed && blocked.retryAfterSeconds > 0,
    "the block carries a retry-after",
    blocked && !blocked.allowed ? `${blocked.retryAfterSeconds}s` : "",
  );

  // Session verification, which is what stops a fabricated history from skipping
  // the captcha on every request.
  check(!(await isSessionVerified("selftestunknown")), "an unverified session reads as unverified");
  await markSessionVerified(SESSION);
  check(await isSessionVerified(SESSION), "a verified session reads as verified");

  // The ceiling, in its own table so the real spend row is untouched.
  const warmTurn = { input: 100, output: 750, cacheRead: 152_000, cacheWrite: 0 };
  const coldTurn = { input: 100, output: 750, cacheRead: 0, cacheWrite: 152_000 };
  check(
    Math.abs(turnCostUsd(warmTurn) - 0.0418) < 0.01,
    "a warm turn costs about four cents",
    `$${turnCostUsd(warmTurn).toFixed(4)}`,
  );
  check(
    turnCostUsd(coldTurn) > turnCostUsd(warmTurn) * 8,
    "a cache miss costs an order of magnitude more, which is why the ceiling counts money",
    `$${turnCostUsd(coldTurn).toFixed(4)} against $${turnCostUsd(warmTurn).toFixed(4)}`,
  );

  const before = await ceilingState();
  await recordSpend(warmTurn);
  const after = await ceilingState();
  check(
    after.spentUsd > before.spentUsd && after.turns === before.turns + 1,
    "recorded spend accumulates",
    `$${before.spentUsd.toFixed(4)} to $${after.spentUsd.toFixed(4)}`,
  );

  process.env.INSIGHTS_DAILY_CEILING_USD = "0.0001";
  const tripped = await ceilingState();
  check(tripped.reached, "the ceiling trips when spend passes it", `$${tripped.spentUsd.toFixed(4)} of $${tripped.ceilingUsd}`);
  delete process.env.INSIGHTS_DAILY_CEILING_USD;

  // The sweep, which keeps the counter table from growing without bound.
  await table.createEntity({
    partitionKey: "ip-hour",
    rowKey: `selftest-stale-${utcDay()}`,
    count: 1,
    expiresAt: new Date(Date.now() - 100 * 3_600_000).toISOString(),
  });
  const swept = await sweepExpiredCounters();
  check(swept > 0, "the sweep deletes counter rows whose window has closed", `${swept} row(s)`);
  const remaining = table.listEntities({
    queryOptions: { filter: odata`RowKey eq ${`selftest-stale-${utcDay()}`}` },
  });
  let staleStillThere = false;
  for await (const _row of remaining) staleStillThere = true;
  check(!staleStillThere, "the stale row is gone");

  // The guard as the route calls it, which is where the ordering and the captcha
  // bypass live.
  const { guardRequest } = await import("@/lib/insights/guard");
  const guardIp = "selftest-guard";

  const noToken = await guardRequest({ ipHash: guardIp, sessionId: "selftestguard1", isFirstTurn: true, captchaToken: "" });
  check(
    !noToken.ok && noToken.code === "CAPTCHA_REQUIRED",
    "a first question with no captcha token is refused before the model is called",
    !noToken.ok ? noToken.defence : "allowed",
  );

  const badToken = await guardRequest({
    ipHash: guardIp,
    sessionId: "selftestguard1",
    isFirstTurn: true,
    captchaToken: "not-a-real-token",
  });
  check(
    !badToken.ok && (badToken.code === "CAPTCHA_FAILED" || badToken.code === "CAPTCHA_REQUIRED"),
    "a bad captcha token is refused",
    !badToken.ok ? badToken.code : "allowed",
  );

  // The bypass this closes: claiming a conversation is already under way to skip
  // the only turn that is gated.
  const fakeHistory = await guardRequest({
    ipHash: guardIp,
    sessionId: "selftestguardfake",
    isFirstTurn: false,
    captchaToken: "",
  });
  check(
    !fakeHistory.ok && fakeHistory.code === "CAPTCHA_REQUIRED",
    "a fabricated history cannot skip the captcha, because the verified session is recorded",
    !fakeHistory.ok ? fakeHistory.defence : "allowed",
  );

  await markSessionVerified("selftestguardok");
  const verified = await guardRequest({
    ipHash: guardIp,
    sessionId: "selftestguardok",
    isFirstTurn: false,
    captchaToken: "",
  });
  check(verified.ok, "a later turn in a verified session is not re-gated", verified.ok ? "" : verified.defence);

  process.env.INSIGHTS_DAILY_CEILING_USD = "0.0001";
  const atCeiling = await guardRequest({
    ipHash: guardIp,
    sessionId: "selftestguardok",
    isFirstTurn: false,
    captchaToken: "",
  });
  check(
    !atCeiling.ok && atCeiling.code === "DAILY_CEILING",
    "the ceiling refuses everybody, before the captcha and before the counters",
    !atCeiling.ok ? `${atCeiling.defence}: ${atCeiling.detail}` : "allowed",
  );
  delete process.env.INSIGHTS_DAILY_CEILING_USD;

  console.log(
    "\nNow run the same script again with --durable, then with --second, to prove the\n" +
      "counters survive the process ending. The second pass reads what this one wrote.",
  );
  return failures;
}

main().then(
  (failed) => {
    console.log(failed > 0 ? `\n${failed} check(s) failed.\n` : "\nAll checks passed.\n");
    process.exit(failed > 0 ? 1 : 0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
