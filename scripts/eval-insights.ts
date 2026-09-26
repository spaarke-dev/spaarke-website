// Evaluation runner for the article insights assistant.
//
// Task 012. Runs the cases in projects/article-insights-assistant/eval/cases.json
// against the real composed prompt and reports pass or fail per case. This is
// the gate before the interface is built: a console that looks finished invites
// shipping regardless of answer quality.
//
//   npm run insights:eval                        every case, about $2.00 warm
//   npm run insights:eval -- --category stance   one category
//   npm run insights:eval -- --id fp-01,st-05    named cases
//   npm run insights:eval -- --review            print every answer, not only the flagged ones
//   npm run insights:eval -- --base http://localhost:3000   check anchors locally
//
// Anchors are checked against the rendered page rather than the manifest,
// because the manifest is what produced the citation in the first place. A
// generator checking its own output proves nothing.
//
// Reads FOUNDRY_* from .env.local. Writes the full run to eval/last-run.json.

import { readFileSync, writeFileSync } from "node:fs";
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import { buildMessageRequest, INSTRUCTIONS } from "@/lib/insights/prompt";
import { detectInstructionLeak, parseAnswer, verifyQuotations } from "@/lib/insights/citations";
import type { ParsedAnswer, Provenance } from "@/lib/insights/types";

const CASES_FILE = "projects/article-insights-assistant/eval/cases.json";
const OUT_FILE = "projects/article-insights-assistant/eval/last-run.json";

const argv = process.argv.slice(2);
const flag = (name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const categoryFilter = flag("category");
const idFilter = flag("id")?.split(",").map((s) => s.trim());
const showAll = argv.includes("--review");
const base = flag("base") ?? "https://spaarke.com";
const concurrency = Number(flag("concurrency") ?? 4);

/** Same dashes scripts/voice-lint.mjs rejects, with its lookarounds. */
const DASH_RE =
  /—|[ ]–[ ]|(?<=[A-Za-z0-9])[ ]--[ ](?=[A-Za-z0-9])|(?<=[A-Za-z0-9,)])[ ]-[ ](?=[A-Za-z0-9(])/;

type Expect = {
  provenance?: Provenance[];
  citesSlugs?: string[];
  minDistinctSlugs?: number;
  minCitations?: number;
  generalParagraph?: boolean;
  asksQuestion?: boolean;
  contains?: string[];
  containsAny?: string[];
  notContains?: string[];
  minChars?: number;
};

type Case = {
  id: string;
  category: string;
  articleSlug: string | null;
  question: string;
  expect?: Expect;
  review?: boolean;
  reviewFor?: string;
};

const { cases } = JSON.parse(readFileSync(CASES_FILE, "utf8")) as { cases: Case[] };

const selected = cases.filter((c) => {
  if (idFilter) return idFilter.includes(c.id);
  if (categoryFilter) return c.category === categoryFilter;
  return true;
});

if (selected.length === 0) {
  console.error("No cases matched.");
  process.exit(1);
}

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const { FOUNDRY_BASE_URL, FOUNDRY_API_KEY, FOUNDRY_DEPLOYMENT } = process.env;
if (!FOUNDRY_BASE_URL || !FOUNDRY_API_KEY || !FOUNDRY_DEPLOYMENT) {
  console.error("Missing FOUNDRY_BASE_URL, FOUNDRY_API_KEY or FOUNDRY_DEPLOYMENT in .env.local.");
  process.exit(1);
}

const client = new AnthropicFoundry({
  apiKey: FOUNDRY_API_KEY,
  baseURL: FOUNDRY_BASE_URL,
  apiVersion: "2023-06-01",
});

const RATE = { input: 2.0, output: 10.0, cacheRead: 0.2, cacheWrite1h: 4.0 };
const DATA_ZONE_MULTIPLIER = 1.1;

// One fetch per article per run, shared by every case that cites it.
const pages = new Map<string, string | null>();
async function renderedPage(slug: string): Promise<string | null> {
  if (pages.has(slug)) return pages.get(slug) ?? null;
  try {
    const res = await fetch(`${base}/why-spaarke/${slug}`);
    const html = res.ok ? await res.text() : null;
    pages.set(slug, html);
    return html;
  } catch {
    pages.set(slug, null);
    return null;
  }
}

type Result = {
  id: string;
  category: string;
  passed: boolean;
  repairs: ParsedAnswer["repairs"];
  failures: string[];
  warnings: string[];
  provenance: Provenance;
  citations: string[];
  askedQuestion: string | null;
  chars: number;
  cost: number;
  ms: number;
  answer: string;
};

async function assertAnchors(parsed: ParsedAnswer, failures: string[], warnings: string[]) {
  for (const c of parsed.citations) {
    if (!c.citation) continue;
    const html = await renderedPage(c.citation.slug);
    if (html === null) {
      warnings.push(`could not fetch ${base}/why-spaarke/${c.citation.slug} to check its anchors`);
      continue;
    }
    // A citation to a whole article has no anchor to check. Fetching the page is
    // the whole assertion there.
    if (!c.citation.anchor) continue;
    if (!html.includes(`id="${c.citation.anchor}"`)) {
      failures.push(
        `anchor ${c.citation.anchor} is in the manifest but not on the rendered ${c.citation.slug}`,
      );
    }
  }
}

function assertExpectations(parsed: ParsedAnswer, raw: string, testCase: Case, failures: string[]) {
  const e = testCase.expect ?? {};
  const text = parsed.text;
  const lower = text.toLowerCase();
  const slugs = [...new Set(parsed.citations.map((c) => c.ref.slug))];

  // Applied to every case, whatever it is testing.
  if (text.length === 0) failures.push("the answer is empty");
  if (text.includes("[[")) failures.push("a marker leaked into the prose");
  const dash = DASH_RE.exec(text);
  if (dash) failures.push(`dash in the answer: ${JSON.stringify(dash[0])}`);
  for (const c of parsed.citations) {
    if (c.verdict !== "verified") failures.push(`citation ${c.ref.slug}#${c.ref.anchor} is ${c.verdict}`);
  }
  // Only attributed quotations are assertions about an article, and only those
  // can be wrong in the way that matters. A quoted phrase with no citation after
  // it is the assistant's own prose, so it is reported and not failed.
  for (const q of verifyQuotations(raw)) {
    if (q.verdict === "unattributed") continue;
    if (q.verdict !== "verified" && q.verdict !== "verified-approximate") {
      failures.push(`quotation is not in ${q.slug}: ${q.quote.slice(0, 70)}`);
    }
  }

  for (const leak of detectInstructionLeak(text, INSTRUCTIONS)) {
    failures.push(`the system prompt leaked into the answer: ${leak.slice(0, 80)}`);
  }

  const lastLine = text.trimEnd().split("\n").at(-1) ?? "";
  if (lastLine.trimEnd().endsWith("?")) failures.push("a question was asked in the prose, where it cannot be skipped");

  // Case by case.
  if (e.provenance && !e.provenance.includes(parsed.provenance)) {
    failures.push(`provenance ${parsed.provenance}, expected ${e.provenance.join(" or ")}`);
  }
  for (const slug of e.citesSlugs ?? []) {
    if (!slugs.includes(slug)) failures.push(`did not cite ${slug}`);
  }
  if (e.minDistinctSlugs && slugs.length < e.minDistinctSlugs) {
    failures.push(`cited ${slugs.length} article(s), expected at least ${e.minDistinctSlugs}`);
  }
  if (e.minCitations && parsed.citations.length < e.minCitations) {
    failures.push(`${parsed.citations.length} citation(s), expected at least ${e.minCitations}`);
  }
  if (e.generalParagraph === true && parsed.generalParagraphs.length === 0) {
    failures.push("no paragraph is labeled as general knowledge");
  }
  if (e.generalParagraph === false && parsed.generalParagraphs.length > 0) {
    failures.push("a paragraph is labeled general where the answer should rest on the articles");
  }
  if (e.asksQuestion === false && parsed.askedQuestion) {
    failures.push(`asked the reader a question where none was warranted: ${parsed.askedQuestion}`);
  }
  if (e.asksQuestion === true && !parsed.askedQuestion) failures.push("asked the reader nothing");
  for (const needle of e.contains ?? []) {
    if (!lower.includes(needle.toLowerCase())) failures.push(`does not contain ${JSON.stringify(needle)}`);
  }
  if (e.containsAny && !e.containsAny.some((n) => lower.includes(n.toLowerCase()))) {
    failures.push(`contains none of ${JSON.stringify(e.containsAny)}`);
  }
  for (const needle of e.notContains ?? []) {
    if (lower.includes(needle.toLowerCase())) failures.push(`contains ${JSON.stringify(needle)}`);
  }
  if (e.minChars && text.length < e.minChars) {
    failures.push(`${text.length} characters, expected at least ${e.minChars}`);
  }
}

async function run(testCase: Case): Promise<Result> {
  const started = Date.now();
  const res = await client.messages.create(
    buildMessageRequest({
      model: FOUNDRY_DEPLOYMENT!,
      request: { question: testCase.question, articleSlug: testCase.articleSlug, history: [] },
    }) as never,
  );
  const ms = Date.now() - started;

  const u = (res.usage ?? {}) as Record<string, number>;
  const cost =
    (((u.input_tokens ?? 0) * RATE.input +
      (u.output_tokens ?? 0) * RATE.output +
      (u.cache_read_input_tokens ?? 0) * RATE.cacheRead +
      (u.cache_creation_input_tokens ?? 0) * RATE.cacheWrite1h) /
      1_000_000) *
    DATA_ZONE_MULTIPLIER;

  const raw = ((res.content ?? []) as { text?: string }[]).map((c) => c.text ?? "").join("");
  const parsed = parseAnswer(raw);

  const failures: string[] = [];
  const warnings: string[] = [];
  if (res.stop_reason === "max_tokens") failures.push("the reply was cut off at max_tokens");
  assertExpectations(parsed, raw, testCase, failures);
  const unattributed = verifyQuotations(raw).filter((q) => q.verdict === "unattributed");
  if (unattributed.length > 0) {
    warnings.push(
      `${unattributed.length} quotation(s) carry no citation, so they read as the assistant's own words: ` +
        unattributed.map((q) => q.quote.slice(0, 40)).join(" | "),
    );
  }
  await assertAnchors(parsed, failures, warnings);

  return {
    id: testCase.id,
    category: testCase.category,
    passed: failures.length === 0,
    repairs: parsed.repairs,
    failures,
    warnings,
    provenance: parsed.provenance,
    citations: parsed.citations.map((c) => `${c.ref.slug}#${c.ref.anchor}`),
    askedQuestion: parsed.askedQuestion,
    chars: parsed.text.length,
    cost,
    ms,
    answer: parsed.text,
  };
}

function report(result: Result, testCase: Case) {
  const mark = result.passed ? "pass" : "FAIL";
  console.log(
    `${mark}  ${result.id.padEnd(6)} ${result.category.padEnd(15)} ${result.provenance.padEnd(8)} ` +
      `${String(result.citations.length).padStart(2)} cite  ${String(result.chars).padStart(4)} ch  ` +
      `${(result.ms / 1000).toFixed(1)}s  $${result.cost.toFixed(4)}`,
  );
  for (const f of result.failures) console.log(`        ${f}`);
  for (const w of result.warnings) console.log(`        warning: ${w}`);
  if (!result.passed || showAll || testCase.review) {
    if (testCase.reviewFor) console.log(`        review: ${testCase.reviewFor}`);
    console.log(
      result.answer
        .split("\n")
        .map((l) => `        | ${l}`)
        .join("\n"),
    );
    if (result.askedQuestion) console.log(`        | [ask] ${result.askedQuestion}`);
    console.log("");
  }
}

async function main() {
  console.log(
    `${selected.length} case(s), anchors checked against ${base}, model ${FOUNDRY_DEPLOYMENT}\n`,
  );

  const results: Result[] = [];

  // The first case runs alone. Four concurrent calls against a cold cache would
  // write the corpus four times, which costs eight times what the whole run
  // should cost.
  const [first, ...rest] = selected;
  const firstResult = await run(first);
  results.push(firstResult);
  report(firstResult, first);

  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, rest.length) }, async () => {
      while (next < rest.length) {
        const testCase = rest[next++];
        try {
          const result = await run(testCase);
          results.push(result);
          report(result, testCase);
        } catch (err) {
          results.push({
            id: testCase.id,
            category: testCase.category,
            passed: false,
            repairs: { citationsCorrected: 0, quotationsDemoted: 0, dashesNormalized: 0 },
            failures: [`the call failed: ${err instanceof Error ? err.message : String(err)}`],
            warnings: [],
            provenance: "general",
            citations: [],
            askedQuestion: null,
            chars: 0,
            cost: 0,
            ms: 0,
            answer: "",
          });
          console.log(`FAIL  ${testCase.id}  the call failed: ${err instanceof Error ? err.message : err}`);
        }
      }
    }),
  );

  const byCategory = new Map<string, { passed: number; total: number }>();
  for (const r of results) {
    const entry = byCategory.get(r.category) ?? { passed: 0, total: 0 };
    entry.total += 1;
    if (r.passed) entry.passed += 1;
    byCategory.set(r.category, entry);
  }

  const passed = results.filter((r) => r.passed).length;
  const spend = results.reduce((n, r) => n + r.cost, 0);

  console.log("\n--- by category ---");
  for (const [category, { passed: p, total }] of [...byCategory].sort()) {
    console.log(`  ${category.padEnd(16)} ${p}/${total}`);
  }
  console.log(`\n${passed} of ${results.length} passed. Run cost $${spend.toFixed(2)}.`);

  // Repairs are not failures, because the reader never sees what was repaired.
  // They are the rate at which the instructions are not landing, so they are
  // reported on every run rather than quietly absorbed.
  const repaired = {
    citations: results.reduce((n, r) => n + r.repairs.citationsCorrected, 0),
    quotations: results.reduce((n, r) => n + r.repairs.quotationsDemoted, 0),
    dashes: results.reduce((n, r) => n + r.repairs.dashesNormalized, 0),
  };
  console.log(
    `repairs: ${repaired.citations} citation(s) corrected, ${repaired.quotations} quotation(s) ` +
      `demoted to paraphrase, ${repaired.dashes} dash(es) replaced. None reached a reader; all of it is prompt work.`,
  );

  const review = results.filter((r) => selected.find((c) => c.id === r.id)?.review);
  console.log(
    `${review.length} case(s) are marked for human judgement. Structural passes there are necessary and not sufficient.`,
  );

  writeFileSync(
    OUT_FILE,
    `${JSON.stringify({ base, model: FOUNDRY_DEPLOYMENT, spend, results }, null, 2)}\n`,
  );
  console.log(`-> ${OUT_FILE}`);

  return results.length - passed;
}

main().then(
  (failed) => process.exit(failed > 0 ? 1 : 0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
