// Generate the three suggested questions shown on each article's entry card.
//
// Task 013. Run on demand, never at build time and never per request. The
// output is committed to content/insights/suggested-questions.json and read by
// the corpus manifest, so a reader who opens the console causes no model call
// before they have asked anything.
//
//   npx tsx scripts/generate-suggested-questions.ts                 every article missing questions
//   npx tsx scripts/generate-suggested-questions.ts --slug <slug>   one article, overwriting it
//   npx tsx scripts/generate-suggested-questions.ts --all           every article, overwriting all
//
// About $0.035 an article against a warm cache. Reads FOUNDRY_* from .env.local.
//
// These are reader-facing copy. Read what comes out before committing it, and
// record the pass in notes/suggested-questions-review.md.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import { buildSystemBlocks } from "@/lib/insights/prompt";
import { allArticles, type CorpusArticle } from "@/lib/corpus";
import { QUESTIONS_FILE, validateQuestion } from "@/lib/insights/questions";

const args = process.argv.slice(2);
const slugArg = args.indexOf("--slug");
const only = slugArg !== -1 ? args[slugArg + 1] : null;
const all = args.includes("--all");

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

/**
 * Three shapes, one per question. Each one only works if the article exists,
 * which is the test that separates an extending question from a summary prompt.
 */
const TASK = (article: CorpusArticle, others: string[]) => `Write three questions a reader might put to the assistant after reading this article.

<article-slug>${article.slug}</article-slug>
<article-title>${article.title}</article-title>

One question of each shape, in this order:

1. **The decision.** A question about a choice the reader actually faces, which this article takes a position on. Name the circumstance: a department of a given size, one with no legal operations function, one whose spend data sits in four systems, one that has bought a tool and not adopted it.
2. **The objection.** A question that pushes back on the article's argument, or asks how it holds up against the way vendors or analysts frame the same thing. A reader who disagrees is the reader worth answering.
3. **The rest of the library.** A question that reaches into another published article by name or by subject, so the answer has to cross pieces. These are the other articles available: ${others.join(", ")}.

Rules for all three:

- Written in the reader's own voice, as they would type it. First person where that is natural.
- Between 8 and 20 words. A question that runs longer than one line will be cut off in the rail.
- Specific to this article. If the question would work with another article's title swapped in, it is wrong.
- No em dash, no en dash, no double hyphen. Ranges take "to".
- Do not ask for a summary, an overview, an explanation of the basics, or "the key takeaways". The entry card offers a summary separately, and these three exist to send the reader further in.
- No consultant filler. Not "unpack", not "deep dive", not "leverage", not "at a high level".
- Each question must be answerable from the library. Do not ask about pricing, availability or anything the articles do not cover.

Return only JSON, with no prose around it and no code fence:

{"questions": ["...", "...", "..."]}`;

type QuestionFile = Record<string, string[]>;

const existing: QuestionFile = existsSync(QUESTIONS_FILE)
  ? (JSON.parse(readFileSync(QUESTIONS_FILE, "utf8")) as QuestionFile)
  : {};

const articles = allArticles();
const titles = new Map(articles.map((a) => [a.slug, a.title]));

const targets = articles.filter((a) => {
  if (only) return a.slug === only;
  if (all) return true;
  return !existing[a.slug] || existing[a.slug].length !== 3;
});

if (targets.length === 0) {
  console.log("Nothing to generate. Pass --all to regenerate, or --slug <slug> for one.");
  process.exit(0);
}

console.log(`Generating for ${targets.length} article(s) of ${articles.length}.\n`);

async function generate(article: CorpusArticle): Promise<string[]> {
  const others = articles
    .filter((a) => a.slug !== article.slug)
    .map((a) => a.title)
    .slice(0, 23);

  const res = await client.messages.create({
    model: FOUNDRY_DEPLOYMENT!,
    max_tokens: 500,
    system: buildSystemBlocks() as never,
    messages: [{ role: "user", content: TASK(article, others) }],
  });

  const raw = ((res.content ?? []) as { text?: string }[]).map((c) => c.text ?? "").join("").trim();
  const json = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  const parsed = JSON.parse(json) as { questions?: unknown };
  if (!Array.isArray(parsed.questions) || parsed.questions.length !== 3) {
    throw new Error(`expected three questions, got ${JSON.stringify(parsed).slice(0, 200)}`);
  }
  return parsed.questions.map((q) => String(q).trim());
}

async function main() {
  let failures = 0;

  for (const article of targets) {
    try {
      const questions = await generate(article);
      const problems = questions.flatMap((q) =>
        validateQuestion(q).map((p) => `${p}: ${q}`),
      );

      console.log(`${article.slug}  (${titles.get(article.slug)})`);
      for (const q of questions) console.log(`  - ${q}`);
      if (problems.length > 0) {
        failures += 1;
        for (const p of problems) console.log(`  REJECTED  ${p}`);
        console.log("  not written; rerun with --slug to try again\n");
        continue;
      }
      existing[article.slug] = questions;
      console.log("");
    } catch (err) {
      failures += 1;
      console.log(`${article.slug}  FAILED  ${err instanceof Error ? err.message : String(err)}\n`);
    }
  }

  // Written in manifest order rather than generation order, so regenerating one
  // article produces a one-entry diff instead of reordering the file.
  const ordered: QuestionFile = {};
  for (const a of articles) if (existing[a.slug]) ordered[a.slug] = existing[a.slug];

  if (!existsSync(dirname(QUESTIONS_FILE))) mkdirSync(dirname(QUESTIONS_FILE), { recursive: true });
  writeFileSync(QUESTIONS_FILE, `${JSON.stringify(ordered, null, 2)}\n`);

  console.log(`-> ${QUESTIONS_FILE}, ${Object.keys(ordered).length} article(s) with questions`);
  if (failures > 0) console.log(`${failures} article(s) need another pass.`);
  return failures;
}

main().then(
  (failures) => process.exit(failures > 0 ? 1 : 0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
