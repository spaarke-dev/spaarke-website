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
// 200K context window. 150K leaves room for the conversation and the answer,
// and lands well before anything breaks.
const CEILING = ceilingArg !== -1 ? Number(args[ceilingArg + 1]) : 150_000;

/**
 * Sonnet 5 uses the tokenizer introduced with Claude 4.7, which produces
 * roughly 30% more tokens for the same text than earlier models. This is a
 * build-time estimate for the ceiling check only. Task 002 measures the real
 * count against the API, and that measurement governs the cost model.
 */
function estimateTokens(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.round(words * 1.33 * 1.3);
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
const tokens = estimateTokens(articles.map((a) => a.body).join("\n"));

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, serialized);

if (!quiet) {
  console.log(`corpus: ${articles.length} articles, ${skipped} draft(s) skipped`);
  console.log(`         ~${tokens.toLocaleString()} estimated tokens (ceiling ${CEILING.toLocaleString()})`);
  console.log(`         ${articles.reduce((n, a) => n + a.headings.length, 0)} headings`);
  console.log(`         -> ${OUT_FILE} (${(serialized.length / 1024).toFixed(0)} kB)`);
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
