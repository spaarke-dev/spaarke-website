// Check the composed insights prompt: the static invariants offline, then four
// real calls against Foundry to confirm what only a real call can confirm.
//
// Task 011. The offline half fails the run on a broken cache prefix or a voice
// violation in the instructions. The live half is the acceptance evidence for
// "cache reads confirmed on turn two" and for the provenance behaviour, neither
// of which can be asserted from the prompt text alone.
//
//   npx tsx scripts/check-insights-prompt.ts            all checks, about 0.50 USD
//   npx tsx scripts/check-insights-prompt.ts --offline  static checks only, free
//
// Reads FOUNDRY_* from .env.local.

import { readFileSync } from "node:fs";
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import { buildSystemBlocks, buildUserTurn, INSTRUCTIONS } from "@/lib/insights/prompt";
import {
  extractQuotations,
  holdPartialMarker,
  parseAnswer,
  verifyQuote,
} from "@/lib/insights/citations";
import { allArticles } from "@/lib/corpus";
import { entryOptions, validateQuestion } from "@/lib/insights/questions";
import type { Provenance } from "@/lib/insights/types";

/** The build's ceiling, from scripts/build-corpus-manifest.mjs. */
const CONTEXT_CEILING = 160_000;

const offline = process.argv.includes("--offline");
let failures = 0;

/**
 * The same dashes scripts/voice-lint.mjs rejects, with its lookarounds so that
 * markdown bullets and hyphenated words do not read as dash usage.
 */
const DASH_RE =
  /—|[ ]–[ ]|(?<=[A-Za-z0-9])[ ]--[ ](?=[A-Za-z0-9])|(?<=[A-Za-z0-9,)])[ ]-[ ](?=[A-Za-z0-9(])/;

function check(ok: boolean, label: string, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
}

/**
 * Fixtures for the parser. Every one of these is a real behaviour observed on a
 * live run, so a regression here is a regression the reader would have seen.
 */
function parserChecks() {
  console.log("\nparser checks");

  const full = [
    "[[provenance:corpus]]",
    "",
    "The department sets the terms of that delegation [[cite:managing-legal-operations#the-department-decides-what-the-business-may-handle]].",
    "",
    "[[general]] Our articles do not cover cutover mechanics. Generally, departments run parallel systems.",
    "",
    "[[ask]] Which system are you moving off?",
  ].join("\n");
  const parsed = parseAnswer(full);
  check(parsed.provenance === "corpus", "provenance is read from the first line", parsed.provenance);
  check(parsed.askedQuestion === "Which system are you moving off?", "the asked question is lifted out");
  check(!parsed.text.includes("[["), "no marker survives into the prose");
  check(
    parsed.generalParagraphs.length === 1 && parsed.generalParagraphs[0] === 1,
    "the general paragraph is identified by index",
    JSON.stringify(parsed.generalParagraphs),
  );
  check(
    parsed.text.split("\n\n")[0].endsWith("delegation."),
    "a stripped citation leaves no gap before the full stop",
    JSON.stringify(parsed.text.split("\n\n")[0].slice(-40)),
  );

  const generalThroughout = parseAnswer("[[provenance:general]]\n\nOne.\n\nTwo.");
  check(
    generalThroughout.generalParagraphs.length === 2,
    "a reply labeled general throughout needs no per-paragraph marker",
  );

  // The failure this regex had: rejecting a short candidate on length, then
  // pairing a closing quote mark with the next opening one.
  const twoShortQuotes =
    'what "active" means and how "matter type" maps, which is the definitional problem underneath it.';
  check(
    extractQuotations(twoShortQuotes).length === 0,
    "short quoted words do not produce a quotation spanning the prose between them",
    JSON.stringify(extractQuotations(twoShortQuotes)),
  );

  const realQuote = "Legal operations is the facilitator and catalyst for that decision";
  check(
    verifyQuote("managing-legal-operations", realQuote) === "verified",
    "a verbatim quotation verifies",
  );
  check(
    verifyQuote("managing-legal-operations", "the processes, tools, and information these decisions require") !==
      "verified",
    "a tightened paraphrase inside quotation marks does not verify",
  );
  check(verifyQuote("no-such-article", realQuote) === "unknown-slug", "an invented slug is reported");

  const invented = parseAnswer(
    "[[provenance:corpus]]\n\nClaim [[cite:legal-operations-ontology#an-illustrative-example-the-invoice-exception]].",
  );
  check(
    invented.citations.length === 1 && invented.citations[0].verdict === "unknown-anchor",
    "an invented anchor is caught rather than rendered",
    invented.citations[0]?.verdict,
  );

  const { safe, held } = holdPartialMarker("text with a split [[cite:slug#anc");
  check(safe === "text with a split " && held === "[[cite:slug#anc", "a marker split across chunks is held back");
}

/**
 * The entry card copy. These are reader-facing sentences committed as data, so
 * they get checked like copy rather than trusted because a model produced them.
 */
function questionChecks() {
  console.log("\nentry card checks");

  const articles = allArticles();
  const missing = articles.filter((a) => a.suggestedQuestions.length !== 3);
  check(
    missing.length === 0,
    "every article has three questions",
    missing.length ? missing.map((a) => a.slug).join(", ") : `${articles.length} articles`,
  );

  const problems = articles.flatMap((a) =>
    a.suggestedQuestions.flatMap((q) => validateQuestion(q).map((p) => `${a.slug}: ${p}`)),
  );
  check(problems.length === 0, "every question passes the copy rules", problems.slice(0, 3).join(" | "));

  // A template with the title swapped in is the failure mode task 013 names, and
  // an exact repeat across articles is the visible form of it.
  const all = articles.flatMap((a) => a.suggestedQuestions);
  const duplicates = all.filter((q, i) => all.indexOf(q) !== i);
  check(duplicates.length === 0, "no question is repeated across articles", duplicates.join(" | "));

  const options = entryOptions(articles[0].slug);
  check(options[0].kind === "question", "summarize is never the first option", options[0].kind);
  check(
    options.at(-1)?.kind === "summarize" && options.length === 4,
    "summarize is offered last, after the three",
    `${options.length} options`,
  );
  check(
    entryOptions("no-such-article").length === 1,
    "an article without questions still offers summarize rather than nothing",
  );
}

function staticChecks() {
  console.log("\nstatic checks");

  const blocksA = buildSystemBlocks();
  const blocksB = buildSystemBlocks();
  check(
    JSON.stringify(blocksA) === JSON.stringify(blocksB),
    "the cached prefix is identical between builds",
  );

  // The per-request framing must sit outside the cached blocks, or every article
  // rewrites the cache at roughly twelve times the price of a cached turn.
  const prefix = blocksA.map((b) => b.text).join("\n");
  const turnOne = buildUserTurn({
    question: "What is an ontology?",
    articleSlug: "legal-operations-ontology",
  });
  const turnTwo = buildUserTurn({
    question: "And for knowledge management?",
    articleSlug: "the-iq-stack",
  });
  check(turnOne !== turnTwo, "the user turn varies with the article");
  check(!prefix.includes("reader-context"), "no per-request content inside the cached blocks");
  check(
    blocksA.length === 2 && blocksA[1].cache_control?.type === "ephemeral",
    "the cache breakpoint sits on the last system block",
    `ttl ${blocksA[1].cache_control?.ttl}`,
  );

  // House voice bans the em dash everywhere, and the assistant writes
  // Spaarke-voiced prose in front of readers.
  const dashes = DASH_RE.exec(INSTRUCTIONS);
  check(
    dashes === null,
    "the instructions carry no em dash or substitute",
    dashes ? `found ${JSON.stringify(dashes[0])}` : "",
  );

  // Every heading has to carry a copyable marker. A heading without one is a
  // section the assistant cannot cite, and the first live run showed it will
  // invent an anchor rather than decline.
  const markers = (blocksA[0].text.match(/\[\[cite:[^\]]+\]\]/g) ?? []).length;
  const headings = allArticles().reduce((n, a) => n + a.headings.length, 0);
  check(
    markers === headings,
    "every heading carries its citation marker",
    `${markers} markers, ${headings} headings`,
  );

  console.log(
    `\n  cached prefix: ${prefix.length.toLocaleString()} chars, instructions ${INSTRUCTIONS.length.toLocaleString()} chars`,
  );
}

type Case = {
  label: string;
  question: string;
  articleSlug: string | null;
  expect: Provenance[];
  /** Slugs the answer should cite, to show the reasoning crossed articles. */
  wantCitedSlugs?: string[];
  wantGeneralParagraph?: boolean;
  wantContactLink?: boolean;
};

const CASES: Case[] = [
  {
    label: "cross-article, corpus only",
    question:
      "The ontology article and the knowledge management article both talk about context. Do they mean the same thing by it, and how do the two arguments fit together?",
    articleSlug: "legal-operations-ontology",
    expect: ["corpus", "mixed"],
    wantCitedSlugs: [
      "legal-operations-ontology",
      "knowledge-management-legal-operations-intelligence",
    ],
  },
  {
    label: "outside the corpus, must still answer",
    question:
      "How do departments usually handle the cutover when they move off a legacy matter management system mid-year? Your articles may not cover it.",
    articleSlug: "managing-legal-operations",
    expect: ["general", "mixed"],
    wantGeneralParagraph: true,
  },
  {
    label: "scope boundary",
    question:
      "What does Spaarke cost for a department of 40 lawyers, and can I get a demo next week?",
    articleSlug: "what-is-legal-operations-intelligence",
    expect: ["contact"],
    wantContactLink: true,
  },
  {
    label: "stance trap: who decides",
    question:
      "So legal operations is the function that decides which contracts the business is allowed to sign on its own, right?",
    articleSlug: "managing-legal-operations",
    expect: ["corpus", "mixed"],
  },
];

const RATE = { input: 2.0, output: 10.0, cacheRead: 0.2, cacheWrite1h: 4.0 };
const DATA_ZONE_MULTIPLIER = 1.1;

async function liveChecks() {
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

  let spend = 0;

  for (const [i, testCase] of CASES.entries()) {
    const started = Date.now();
    const res = await client.messages.create({
      model: FOUNDRY_DEPLOYMENT,
      // A cross-article answer runs long. 1,200 truncated one mid-sentence.
      max_tokens: 2000,
      system: buildSystemBlocks() as never,
      messages: [{ role: "user", content: buildUserTurn(testCase) }],
    });
    const ms = Date.now() - started;

    const u = (res.usage ?? {}) as Record<string, number>;
    const cacheWrite = u.cache_creation_input_tokens ?? 0;
    const cacheRead = u.cache_read_input_tokens ?? 0;
    const cost =
      (((u.input_tokens ?? 0) * RATE.input +
        (u.output_tokens ?? 0) * RATE.output +
        cacheRead * RATE.cacheRead +
        cacheWrite * RATE.cacheWrite1h) /
        1_000_000) *
      DATA_ZONE_MULTIPLIER;
    spend += cost;

    const blocks = (res.content ?? []) as { type?: string; text?: string }[];
    const raw = blocks.map((c) => c.text ?? "").join("");
    const parsed = parseAnswer(raw);

    console.log(`\n${i + 1}. ${testCase.label}  (${(ms / 1000).toFixed(1)}s, $${cost.toFixed(4)})`);
    // The breakdown says which duration the write was actually accepted at. If a
    // 1 hour write lands as a 5 minute one, the hourly warming design in
    // notes/cost-model.md does not hold and the write rate is 2.5 not 4.0.
    const created = (u as unknown as { cache_creation?: Record<string, number> }).cache_creation;
    console.log(
      `   cache write ${cacheWrite.toLocaleString()}, read ${cacheRead.toLocaleString()}` +
        (created ? `, created ${JSON.stringify(created)}` : ""),
    );

    // One run returned nothing at all where the usage reported 1,227 output
    // tokens. Print enough to tell an empty response from a parse that ate it.
    check(parsed.text.length > 0, "the answer is not empty");
    if (parsed.text.length === 0) {
      console.log(
        `   stop_reason ${res.stop_reason}, blocks ${JSON.stringify(blocks.map((b) => b.type))}, raw ${JSON.stringify(raw.slice(0, 400))}`,
      );
    }

    if (i === 0) {
      // Turn one writes the cache on a cold prefix and reads it when a previous
      // run left one inside the hour. Either is correct; neither is the failure.
      const prefixTokens = cacheWrite + cacheRead;
      check(
        prefixTokens > 100_000,
        "turn one cached the corpus",
        cacheWrite > 0 ? "written cold" : "read from an earlier run",
      );
      // The only unestimated measure of the prefix. The build's ceiling check is
      // a calibrated guess; this is the number the API charged for.
      check(
        prefixTokens < CONTEXT_CEILING,
        "the measured prefix is inside the context ceiling",
        `${prefixTokens.toLocaleString()} of ${CONTEXT_CEILING.toLocaleString()}, ${Math.round((prefixTokens / CONTEXT_CEILING) * 100)}%`,
      );
    } else {
      check(
        cacheRead > 100_000 && cacheWrite === 0,
        "this turn read the cache rather than rewriting it",
      );
    }

    check(
      testCase.expect.includes(parsed.provenance),
      `provenance is one of ${testCase.expect.join(" or ")}`,
      `got ${parsed.provenance}`,
    );

    const bad = parsed.citations.filter((c) => c.verdict !== "verified");
    check(
      bad.length === 0,
      "every citation resolves to a real anchor",
      bad.map((c) => `${c.ref.slug}#${c.ref.anchor} ${c.verdict}`).join(", "),
    );

    const emDash = DASH_RE.exec(parsed.text);
    check(emDash === null, "the answer carries no em dash", emDash ? JSON.stringify(emDash[0]) : "");

    const slugs = parsed.citations.map((c) => c.ref.slug);
    const ungrounded = extractQuotations(parsed.text).filter(
      (q) => slugs.length > 0 && slugs.every((s) => verifyQuote(s, q) === "not-found"),
    );
    check(ungrounded.length === 0, "every quotation is in a cited article", ungrounded.join(" | "));

    if (testCase.wantCitedSlugs) {
      const cited = new Set(slugs);
      const missing = testCase.wantCitedSlugs.filter((s) => !cited.has(s));
      check(
        missing.length === 0,
        "the answer reasons across the expected articles",
        missing.length ? `missing ${missing.join(", ")}` : `${cited.size} article(s) cited`,
      );
    }
    if (testCase.wantGeneralParagraph) {
      check(parsed.generalParagraphs.length > 0, "the passage outside the corpus is labeled");
      check(
        parsed.text.length > 400,
        "the answer is substantive rather than a redirect",
        `${parsed.text.length} chars`,
      );
    }
    if (testCase.wantContactLink) {
      check(parsed.text.includes("/contact"), "the reader is pointed at the contact page");
      check(!/\$\s?\d/.test(parsed.text), "no price is guessed");
    }
    // A question asked in the prose has no skip affordance, which is what FR-06
    // requires of every question the assistant asks.
    const lastLine = parsed.text.trimEnd().split("\n").at(-1) ?? "";
    check(!lastLine.trimEnd().endsWith("?"), "no question asked outside the marker", lastLine.slice(-70));

    if (parsed.askedQuestion) {
      console.log(`   asked back: ${parsed.askedQuestion}`);
    }

    console.log("   ---");
    console.log(
      parsed.text
        .split("\n")
        .map((l) => `   ${l}`)
        .join("\n"),
    );
  }

  console.log(`\ntotal spend for this run: $${spend.toFixed(4)}`);
}

parserChecks();
questionChecks();
staticChecks();

if (offline) {
  console.log(failures === 0 ? "\nAll static checks passed.\n" : `\n${failures} check(s) failed.\n`);
  process.exit(failures === 0 ? 0 : 1);
}

liveChecks().then(
  () => {
    console.log(failures === 0 ? "All checks passed.\n" : `${failures} check(s) failed.\n`);
    process.exit(failures === 0 ? 0 : 1);
  },
  (err) => {
    console.error("\nLive checks failed to run:", err);
    process.exit(1);
  },
);
