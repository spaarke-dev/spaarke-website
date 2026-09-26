// Two paths deliver the same answer. Prove the reader sees it once.
//
// Task 023. `poll-client.ts` merges the poll route and the buffered POST, and the
// failure it has to not have is a sentence rendered twice. Live runs cannot test
// this properly, because the ordering is the whole question: locally the POST
// streams and wins, on Azure Static Web Apps it is buffered and loses. So this
// drives the client with a stubbed fetch and runs both orderings, plus the ones
// that only happen when something is broken.
//
//   npx tsx scripts/check-insights-dedup.mts
//
// No model call, no storage, no network. Costs nothing and runs in a second.

import type { InsightsEvent } from "@/lib/insights/stream";

let failures = 0;
function check(ok: boolean, label: string, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
}

/** The answer under test: a provenance label, five sentences, a citation, a done. */
const ANSWER: InsightsEvent[] = [
  { type: "provenance", value: "corpus" },
  { type: "text", text: "Spend analytics reports what was spent. ", general: false },
  { type: "citation", citation: { slug: "spend-analytics", title: "Spend analytics", anchor: undefined } as never },
  // Deliberately identical to an earlier sentence. An answer that cites the same
  // article twice produces repeated prose more often than it sounds, and a
  // deduplication that compared text would silently drop this one.
  { type: "text", text: "Spend analytics reports what was spent. ", general: false },
  { type: "text", text: "Intelligence reasons about it. ", general: false },
  { type: "text", text: "The difference is the data model. ", general: false },
  {
    type: "done",
    provenance: "corpus",
    repairs: { citationsCorrected: 0, quotationsDemoted: 0, dashesNormalized: 0 },
    usage: { input: 10, output: 10, cacheRead: 10, cacheWrite: 0 },
  },
];

type Scenario = {
  name: string;
  /** How many events the poller gets to deliver before the POST body is read. */
  polledBeforePost: number;
  /** How many events the POST delivers. Fewer than all means the connection died. */
  postDelivers: number;
  /** The poll route answering as if partials are switched off. */
  pollUnavailable?: boolean;
  /** The POST failing outright, after whatever the poller already delivered. */
  postFails?: boolean;
  expectStatus: string;
  expectDelivered: number;
};

const SCENARIOS: Scenario[] = [
  {
    name: "the platform buffers, so the poller delivers everything first",
    polledBeforePost: ANSWER.length,
    postDelivers: ANSWER.length,
    expectStatus: "answered",
    expectDelivered: ANSWER.length,
  },
  {
    name: "the POST streams and wins, so every poll is a duplicate",
    polledBeforePost: 0,
    postDelivers: ANSWER.length,
    expectStatus: "answered",
    expectDelivered: ANSWER.length,
  },
  {
    name: "the two interleave, which is the ordinary case",
    polledBeforePost: 4,
    postDelivers: ANSWER.length,
    expectStatus: "answered",
    expectDelivered: ANSWER.length,
  },
  {
    name: "partials are switched off, so the POST carries the whole answer",
    polledBeforePost: 0,
    postDelivers: ANSWER.length,
    pollUnavailable: true,
    expectStatus: "answered",
    expectDelivered: ANSWER.length,
  },
  {
    name: "a proxy kills the POST after the poller delivered prose",
    polledBeforePost: 5,
    postDelivers: 0,
    postFails: true,
    expectStatus: "answered-without-close",
    expectDelivered: 5,
  },
  {
    name: "the POST fails before anything was polled",
    polledBeforePost: 0,
    postDelivers: 0,
    postFails: true,
    expectStatus: "error",
    expectDelivered: 0,
  },
];

async function run(scenario: Scenario) {
  const delivered: InsightsEvent[] = [];
  /** Released once the poller has delivered its quota, so the orderings are exact. */
  let releasePost: () => void = () => {};
  const postGate = new Promise<void>((resolve) => (releasePost = resolve));
  let polled = 0;

  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);

    if (url.includes("/partial")) {
      if (scenario.pollUnavailable) {
        releasePost();
        return json({ ok: true, events: [], cursor: 0, complete: false, available: false });
      }
      const after = Number(new URL(url, "http://x").searchParams.get("after") ?? "0");
      const upTo = Math.min(scenario.polledBeforePost, ANSWER.length);
      const events = ANSWER.slice(after, upTo);
      polled = Math.max(polled, after + events.length);
      if (polled >= upTo) releasePost();
      const cursor = after + events.length;
      const complete = events.some((e) => e.type === "done" || e.type === "error");
      return json({ ok: true, available: true, events, cursor, complete });
    }

    // The POST waits for the poller to reach its quota, which is what makes the
    // ordering deterministic rather than a race this script would sometimes lose.
    if (scenario.polledBeforePost > 0 || scenario.pollUnavailable) {
      await Promise.race([postGate, sleep(4_000)]);
    }
    if (scenario.postFails) throw new Error("connection reset");
    return ndjson(ANSWER.slice(0, scenario.postDelivers));
  }) as typeof fetch;

  try {
    const { askInsights } = await import("@/lib/insights/poll-client");
    const outcome = await askInsights({
      question: "What is the difference?",
      articleSlug: null,
      history: [],
      sessionId: "dedupselftest",
      onEvent: (event) => delivered.push(event),
    });

    console.log(`\n${scenario.name}`);
    check(outcome.status === scenario.expectStatus, `outcome is ${scenario.expectStatus}`, `got ${outcome.status}`);
    check(
      delivered.length === scenario.expectDelivered,
      `${scenario.expectDelivered} event(s) reached the reader`,
      `got ${delivered.length}`,
    );
    check(
      JSON.stringify(delivered) === JSON.stringify(ANSWER.slice(0, scenario.expectDelivered)),
      "in the right order, with nothing repeated and nothing dropped",
    );
    const sentences = delivered.filter((e) => e.type === "text").length;
    const expectSentences = ANSWER.slice(0, scenario.expectDelivered).filter((e) => e.type === "text").length;
    check(sentences === expectSentences, `${expectSentences} sentence(s), including the repeated one`, `got ${sentences}`);
  } finally {
    globalThis.fetch = realFetch;
  }
}

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function ndjson(events: InsightsEvent[]): Response {
  const body = events.map((e) => `${JSON.stringify(e)}\n`).join("");
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/x-ndjson" },
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("merging the poll route and the buffered POST");
for (const scenario of SCENARIOS) await run(scenario);

console.log(failures === 0 ? "\nall checks passed." : `\n${failures} check(s) failed.`);
if (failures > 0) process.exit(1);
