// Assemble every published article into a single manifest for the article
// insights assistant.
//
// The assistant holds the whole corpus in a cached model context rather than
// retrieving from it (see projects/article-insights-assistant/spec.md KD-01),
// so the corpus has to be assembled deterministically at build time. There is
// no chunking, no embedding, and no vector store.
//
// The token ceiling is the safety rail on that decision. When the library
// outgrows a single context window the build should say so rather than
// degrade quietly.
//
//   node scripts/build-corpus-manifest.mjs [--ceiling N] [--quiet]
//
// Output: src/generated/corpus.json (git ignored, regenerated on every build)

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const BLOG_DIR = "content/blog";
const OUT_DIR = "src/generated";
const OUT_FILE = join(OUT_DIR, "corpus.json");

const args = process.argv.slice(2);
const quiet = args.includes("--quiet");
const ceilingArg = args.indexOf("--ceiling");
// 200K context window. The corpus measured 137,341 real tokens on 2026-09-26
// (task 002), so 160K leaves about 40K for the conversation and the answer and
// roughly four more articles of headroom. WARN_AT announces the approach
// rather than letting the build fail without notice one article later.
const CEILING = ceilingArg !== -1 ? Number(args[ceilingArg + 1]) : 160_000;
const WARN_AT = Math.round(CEILING * 0.9);

/**
 * Build-time estimate for the ceiling check only. The API reports the real
 * count and that governs the cost model.
 *
 * Calibrated directly against a measured 137,341 tokens for the assembled
 * corpus on 2026-09-26 (task 002): 64,125 words, so 2.142 tokens per word, or
 * about 3.2 characters per token. Sonnet 5 uses the tokenizer introduced with
 * Claude 4.7, which produces roughly 30% more tokens than earlier models, so
 * a ratio borrowed from older guidance will read low.
 *
 * Recalibrate by running scripts/measure-insights-cost.mjs and dividing the
 * reported token count by the assembled word count. Guessing at this constant
 * produced errors of 27% and then 13% before it was measured.
 */
const TOKENS_PER_WORD = 2.142;

/** Mean tokens per article at 24 articles and 137,341 measured, used only to
 *  say how many more articles fit before the ceiling. */
const AVG_ARTICLE_TOKENS = 5700;

function estimateTokens(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.round(words * TOKENS_PER_WORD);
}

/**
 * Heading anchors must match what rehype-slug puts on the rendered page, or a
 * citation links to an anchor that does not exist: it looks correct in the
 * answer and does nothing when clicked. Same slugger, same order, including
 * its de-duplication of repeated headings.
 *
 * Every depth from h1 to h6, for two reasons. The table of contents shows only
 * h2 and h3, but rehype-slug anchors all of them, so a deeper heading is a
 * legitimate citation target. Capping this at h3 left 46 sections of the
 * functional specification uncitable, and on the first live run the assistant
 * invented an anchor rather than declining to cite. The slugger also has to see
 * every heading in document order, because its de-duplication counter is what
 * decides whether a repeated title becomes "foo" or "foo-1", and feeding it a
 * subset is how anchors drift from the rendered page.
 */
function extractHeadings(content) {
  const slugger = new GithubSlugger();
  const headings = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "");
    headings.push({ depth: m[1].length, text, anchor: slugger.slug(text) });
  }
  return headings;
}

// Entry card questions, generated once by scripts/generate-suggested-questions.ts
// and committed as reviewed copy. Missing questions are a warning rather than a
// build failure: the console can open without chips, and a nicety must not stop
// an article from publishing.
const QUESTIONS_FILE = "content/insights/suggested-questions.json";
const suggested = existsSync(QUESTIONS_FILE)
  ? JSON.parse(readFileSync(QUESTIONS_FILE, "utf8"))
  : {};

// Which articles the assistant holds in full and which it holds as an outline.
// Tier 1 is the default and the file is expected to be empty: the lever exists so
// that demoting an article later is a one-line change rather than a redesign at
// the moment the ceiling is hit. See tasks/051-tiered-corpus.md.
//
// A slug listed here that does not exist is a build failure rather than a
// warning. A typo would silently fail to demote anything, which is the one
// outcome this file must not have: it would be discovered as a ceiling error
// three articles later with no clue that the lever had been pulled at all.
const TIERS_FILE = "content/insights/corpus-tiers.json";
const tierConfig = existsSync(TIERS_FILE)
  ? JSON.parse(readFileSync(TIERS_FILE, "utf8"))
  : { tier2: [] };
const tier2 = new Set(Array.isArray(tierConfig.tier2) ? tierConfig.tier2 : []);

const articles = [];
let skipped = 0;

for (const file of readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx")).sort()) {
  const raw = readFileSync(join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);

  if (data.draft === true) {
    skipped++;
    continue;
  }

  // Filename is <date>-<slug>.mdx, matching src/lib/blog.ts.
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");

  articles.push({
    slug,
    title: data.title ?? slug,
    date: data.date ?? null,
    posted: data.posted ?? null,
    description: data.description ?? null,
    summary: data.summary ?? null,
    keyTakeaways: data.keyTakeaways ?? [],
    tags: data.tags ?? {},
    campaign: data.campaign ?? null,
    url: `/why-spaarke/${slug}`,
    headings: extractHeadings(content),
    suggestedQuestions: Array.isArray(suggested[slug]) ? suggested[slug] : [],
    tier: tier2.has(slug) ? 2 : 1,
    body: content.trim(),
  });
}

const knownSlugs = new Set(articles.map((a) => a.slug));
const unknownTier2 = [...tier2].filter((slug) => !knownSlugs.has(slug));
if (unknownTier2.length > 0) {
  console.error(
    `\nERROR: ${TIERS_FILE} lists ${unknownTier2.length} slug(s) that are not published articles:\n` +
      unknownTier2.map((s) => `  ${s}`).join("\n") +
      `\nA typo here demotes nothing and looks like it worked. Fix the slug or remove it.`,
  );
  process.exit(1);
}

// Six are generated per article and the console shows a rotating three, so an
// article with fewer than three cannot fill a card. Fewer than six means the
// rotation has nothing to rotate, which is worth saying but is not a fault.
const QUESTIONS_EXPECTED = 6;
const withoutQuestions = articles.filter((a) => a.suggestedQuestions.length < QUESTIONS_EXPECTED);

const manifest = {
  generatedFrom: BLOG_DIR,
  articleCount: articles.length,
  articles,
};

const serialized = JSON.stringify(manifest, null, 2);

// Estimate what the endpoint actually sends, not just the prose. The system
// block carries a corpus index, a tagged header per article, and a copyable
// citation marker on every heading, all of which count against the context
// window. Leaving them out understated the corpus by about 9%.
//
// src/lib/insights/prompt.ts composes the real thing and
// `npx tsx scripts/check-insights-prompt.ts --offline` measures it. This
// estimate exists so that `npm run build` can fail without a model call, and
// the two have to be kept in step when the prompt format changes.
/**
 * One article as the prompt will carry it, at the tier given.
 *
 * Tier 2 drops the body and keeps everything that makes the article findable
 * and citable: its header, summary, takeaways and every heading marker. The
 * shape has to track src/lib/insights/prompt.ts, which composes the real thing.
 */
function articleEstimate(a, tier) {
  const head = [
    `<article slug="${a.slug}" published="${a.date}">`,
    `title: ${a.title}`,
    `summary: ${a.summary ?? a.description ?? ""}`,
    "key takeaways:",
    ...a.keyTakeaways.map((t) => `- ${t}`),
    ...a.headings.map((h) => `[[cite:${a.slug}#${h.anchor}]]`),
  ];
  if (tier === 2) return [...head, "</article>"].join("\n");
  return [...head, a.body, "</article>"].join("\n");
}

const corpusIndex = [
  `<corpus articles="${articles.length}">`,
  ...articles.map((a) => `- ${a.slug} | ${a.title} | ${a.date ?? "undated"}`),
];

const assembled = [
  ...corpusIndex,
  ...articles.map((a) => articleEstimate(a, a.tier)),
].join("\n\n");

// The instruction block is static text, so a measured constant is honest here
// where a guess would not be. 8,943 characters on 2026-09-26.
const INSTRUCTION_TOKENS = 2_400;

const tokens = estimateTokens(assembled) + INSTRUCTION_TOKENS;

// What the tier lever is worth, reported before it is needed rather than
// discovered when the build fails. Which articles to demote is a telemetry
// question, not a build-time one: `insights.answer` records `citedSlugs`, and an
// article nothing has cited in a month is the candidate. What the build can
// answer is how much a demotion buys, so it answers that.
const savings = articles
  .filter((a) => a.tier === 1)
  .map((a) => ({
    slug: a.slug,
    saves: estimateTokens(articleEstimate(a, 1)) - estimateTokens(articleEstimate(a, 2)),
  }))
  .sort((x, y) => y.saves - x.saves);

const demoted = articles.filter((a) => a.tier === 2).length;

/** Tokens freed by demoting the n cheapest and the n dearest, which brackets any real choice of n. */
function demotionRange(n) {
  const k = Math.min(n, savings.length);
  const dearest = savings.slice(0, k).reduce((t, a) => t + a.saves, 0);
  const cheapest = savings.slice(-k).reduce((t, a) => t + a.saves, 0);
  return { k, cheapest, dearest };
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, serialized);

if (!quiet) {
  console.log(`corpus: ${articles.length} articles, ${skipped} draft(s) skipped`);
  console.log(`         ~${tokens.toLocaleString()} estimated tokens (ceiling ${CEILING.toLocaleString()})`);
  console.log(`         ${articles.reduce((n, a) => n + a.headings.length, 0)} headings`);
  console.log(
    `         ${Math.round((tokens / CEILING) * 100)}% of ceiling, room for about ` +
      `${Math.max(0, Math.floor((CEILING - tokens) / AVG_ARTICLE_TOKENS))} more article(s)`,
  );
  const r = demotionRange(8);
  console.log(
    `         ${demoted} article(s) held as an outline, ${articles.length - demoted} in full`,
  );
  console.log(
    `         demoting 8 would free ${r.cheapest.toLocaleString()} to ${r.dearest.toLocaleString()} tokens, ` +
      `about ${Math.floor(r.cheapest / AVG_ARTICLE_TOKENS)} to ${Math.floor(r.dearest / AVG_ARTICLE_TOKENS)} more article(s)`,
  );
  console.log(`         -> ${OUT_FILE} (${(serialized.length / 1024).toFixed(0)} kB)`);
}

if (withoutQuestions.length > 0) {
  console.warn(
    `\nNOTE: ${withoutQuestions.length} article(s) have no entry card questions:\n` +
      withoutQuestions.map((a) => `  ${a.slug}`).join("\n") +
      `\nRun: npx tsx scripts/generate-suggested-questions.ts\n` +
      `The console opens without chips until then, which is degraded rather than broken.`,
  );
}

if (tokens > WARN_AT && tokens <= CEILING) {
  const pct = Math.round((tokens / CEILING) * 100);
  const headroom = Math.max(0, Math.floor((CEILING - tokens) / AVG_ARTICLE_TOKENS));
  const r = demotionRange(8);
  console.warn(
    `\nWARNING: corpus is ~${tokens.toLocaleString()} tokens, ${pct}% of the ${CEILING.toLocaleString()} ceiling.\n` +
      `Roughly ${headroom} more article(s) before the build fails.\n` +
      `\nThe lever is ${TIERS_FILE}. Listing a slug under "tier2" holds that article as\n` +
      `an outline instead of in full: it stays in the index and stays citable, and loses\n` +
      `only verbatim quotation. Demoting ${r.k} frees ${r.cheapest.toLocaleString()} to ${r.dearest.toLocaleString()} tokens.\n` +
      `Pick which from citedSlugs on insights.answer: an article nothing cites is the one.`,
  );
}

if (tokens > CEILING) {
  const r = demotionRange(8);
  console.error(
    `\nERROR: corpus is ~${tokens.toLocaleString()} tokens, over the ${CEILING.toLocaleString()} ceiling.\n` +
      `\nThe cheapest fix is ${TIERS_FILE}. Listing a slug under "tier2" holds that\n` +
      `article as an outline: it stays in the index, stays citable as a whole and by\n` +
      `section, and loses only verbatim quotation. Demoting ${r.k} frees ${r.cheapest.toLocaleString()} to\n` +
      `${r.dearest.toLocaleString()} tokens. Pick which from citedSlugs on insights.answer.\n` +
      `\nIf that is not enough, the decision in spec KD-01 needs revisiting: a larger\n` +
      `context window, or the retrieval layer this design deliberately avoided.`,
  );
  process.exit(1);
}
