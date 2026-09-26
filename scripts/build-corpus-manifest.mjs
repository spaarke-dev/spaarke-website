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

    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "");
    headings.push({ depth: m[1].length, text, anchor: slugger.slug(text) });
  }
  return headings;
}

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
    body: content.trim(),
  });
}

const manifest = {
  generatedFrom: BLOG_DIR,
  articleCount: articles.length,
  articles,
};

const serialized = JSON.stringify(manifest, null, 2);

// Estimate what the endpoint actually sends, not just the prose. The system
// block carries a per-article index (title, slug, url, date, summary, heading
// anchors) ahead of each body, and leaving it out understated the corpus by
// about 9% against the measured figure.
const assembled = [
  "# Spaarke published articles",
  ...articles.map(
    (a) =>
      `## ${a.title}\nslug: ${a.slug}\nurl: ${a.url}\ndate: ${a.date}\n` +
      `summary: ${a.summary ?? a.description ?? ""}\n` +
      `headings: ${a.headings.map((h) => h.anchor).join(", ")}\n\n${a.body}`,
  ),
].join("\n\n");

const tokens = estimateTokens(assembled);

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
