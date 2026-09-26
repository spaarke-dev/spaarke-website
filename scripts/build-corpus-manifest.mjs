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
    body: content.trim(),
  });
}

const withoutQuestions = articles.filter((a) => a.suggestedQuestions.length !== 3);

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
const assembled = [
  `<corpus articles="${articles.length}">`,
  ...articles.map((a) => `- ${a.slug} | ${a.title} | ${a.date ?? "undated"}`),
  ...articles.map((a) =>
    [
      `<article slug="${a.slug}" published="${a.date}">`,
      `title: ${a.title}`,
      `summary: ${a.summary ?? a.description ?? ""}`,
      "key takeaways:",
      ...a.keyTakeaways.map((t) => `- ${t}`),
      ...a.headings.map((h) => `[[cite:${a.slug}#${h.anchor}]]`),
      a.body,
      "</article>",
    ].join("\n"),
  ),
].join("\n\n");

// The instruction block is static text, so a measured constant is honest here
// where a guess would not be. 8,943 characters on 2026-09-26.
const INSTRUCTION_TOKENS = 2_400;

const tokens = estimateTokens(assembled) + INSTRUCTION_TOKENS;

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
  console.warn(
    `\nWARNING: corpus is ~${tokens.toLocaleString()} tokens, ${pct}% of the ${CEILING.toLocaleString()} ceiling.\n` +
      `Roughly ${headroom} more article(s) before the build fails. Decide what happens then\n` +
      `before it happens: a larger context window, a trimmed corpus, or retrieval.`,
  );
}

if (tokens > CEILING) {
  console.error(
    `\nERROR: corpus is ~${tokens.toLocaleString()} tokens, over the ${CEILING.toLocaleString()} ceiling.\n` +
      `The assistant holds the whole corpus in context (spec KD-01). Past this point\n` +
      `that decision needs revisiting: a larger context window, a trimmed corpus, or\n` +
      `the retrieval layer this design deliberately avoided.`,
  );
  process.exit(1);
}
