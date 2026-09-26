// Measure what one turn of the article insights assistant actually costs.
//
// Task 002. Every rate limit and the whole cost model rest on this number,
// and until this runs it is an estimate. Makes two calls: the first writes
// the corpus to the cache, the second must read it back. If the second call
// reports a cache write rather than a read, caching is not working and the
// cost model is wrong by roughly a factor of ten.
//
//   node scripts/measure-insights-cost.mjs
//
// Reads FOUNDRY_* from .env.local. Costs a few cents to run.

import { readFileSync } from "node:fs";
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const { FOUNDRY_BASE_URL, FOUNDRY_API_KEY, FOUNDRY_DEPLOYMENT } = process.env;
if (!FOUNDRY_BASE_URL || !FOUNDRY_API_KEY || !FOUNDRY_DEPLOYMENT) {
  console.error("Missing FOUNDRY_BASE_URL, FOUNDRY_API_KEY or FOUNDRY_DEPLOYMENT.");
  process.exit(1);
}

// Published Claude Sonnet 5 rates, USD per million tokens, confirmed
// 2026-09-26. The deployment is DataZoneStandard, which applies 1.1x to every
// category. Re-check these before trusting any figure computed here.
const RATE = { input: 2.0, output: 10.0, cacheRead: 0.2, cacheWrite5m: 2.5, cacheWrite1h: 4.0 };
const DATA_ZONE_MULTIPLIER = 1.1;

const corpus = JSON.parse(readFileSync("src/generated/corpus.json", "utf8"));

// The same shape the endpoint will send: an index the model can navigate,
// then the full text of every article.
const corpusText = [
  "# Spaarke published articles",
  "",
  ...corpus.articles.map(
    (a) =>
      `## ${a.title}\nslug: ${a.slug}\nurl: ${a.url}\ndate: ${a.date}\n` +
      `summary: ${a.summary ?? a.description ?? ""}\n` +
      `headings: ${a.headings.map((h) => h.anchor).join(", ")}\n\n${a.body}`,
  ),
].join("\n\n");

const client = new AnthropicFoundry({
  apiKey: FOUNDRY_API_KEY,
  baseURL: FOUNDRY_BASE_URL,
  apiVersion: "2023-06-01",
});

async function turn(question, label) {
  const started = Date.now();
  const res = await client.messages.create({
    model: FOUNDRY_DEPLOYMENT,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: corpusText,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: question }],
  });
  const ms = Date.now() - started;
  const u = res.usage ?? {};
  return {
    label,
    ms,
    input: u.input_tokens ?? 0,
    output: u.output_tokens ?? 0,
    cacheWrite: u.cache_creation_input_tokens ?? 0,
    cacheRead: u.cache_read_input_tokens ?? 0,
    text: res.content?.map((c) => c.text ?? "").join("").slice(0, 300),
  };
}

function cost(u, writeRate) {
  const raw =
    (u.input * RATE.input +
      u.output * RATE.output +
      u.cacheRead * RATE.cacheRead +
      u.cacheWrite * writeRate) /
    1_000_000;
  return raw * DATA_ZONE_MULTIPLIER;
}

function report(u) {
  const c = cost(u, RATE.cacheWrite5m);
  console.log(`\n${u.label}  (${(u.ms / 1000).toFixed(1)}s)`);
  console.log(`  input ${u.input.toLocaleString()}   output ${u.output.toLocaleString()}`);
  console.log(`  cache write ${u.cacheWrite.toLocaleString()}   cache read ${u.cacheRead.toLocaleString()}`);
  console.log(`  cost $${c.toFixed(4)} (data zone 1.1x applied)`);
  return c;
}

console.log(`corpus: ${corpus.articleCount} articles, ${corpusText.length.toLocaleString()} chars`);
console.log(`model:  ${FOUNDRY_DEPLOYMENT}`);

const first = await turn("In one sentence, what is a legal operations ontology?", "call 1, expect cache WRITE");
const c1 = report(first);

const second = await turn("In one sentence, what does the knowledge management article add to it?", "call 2, expect cache READ");
const c2 = report(second);

console.log("\n--- verdict ---");
const cachingWorks = second.cacheRead > 0 && second.cacheWrite < first.cacheWrite;
console.log(cachingWorks ? "Prompt caching is working: call 2 read the cache." : "PROBLEM: call 2 did not read the cache. The cost model is wrong.");

const realTokens = first.cacheWrite + first.input;
console.log(`\nMeasured corpus size: ${realTokens.toLocaleString()} tokens (build estimate was ~107,808)`);

const CEILING = 500;
const perWarmTurn = c2;
console.log(`\nWarm turn:        $${perWarmTurn.toFixed(4)}`);
console.log(`Cold turn (5m):   $${c1.toFixed(4)}`);
console.log(`Turns at $${CEILING}/mo: ${Math.floor(CEILING / perWarmTurn).toLocaleString()} warm, ${Math.floor(CEILING / c1).toLocaleString()} cold`);
const warmingPerMonth = (perWarmTurn * 24 * 30);
console.log(`Hourly cache warming: ~$${warmingPerMonth.toFixed(2)}/mo`);

console.log(`\nSample answer: ${second.text}`);
