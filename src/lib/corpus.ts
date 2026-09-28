import manifest from "@/generated/corpus.json";

/**
 * The published article corpus, assembled at build time by
 * scripts/build-corpus-manifest.mjs.
 *
 * The article insights assistant holds all of this in a cached model context
 * rather than retrieving from it, so there is no search function here and
 * there should not be one. See projects/article-insights-assistant/spec.md,
 * KD-01. If a retrieval helper starts to look necessary, the corpus has
 * probably outgrown a single context window, and that is a design decision
 * rather than a missing utility.
 */

export type CorpusHeading = {
  depth: number;
  text: string;
  /** Matches the id rehype-slug puts on the rendered page. */
  anchor: string;
};

export type CorpusArticle = {
  slug: string;
  title: string;
  date: string | null;
  posted: string | null;
  description: string | null;
  summary: string | null;
  keyTakeaways: string[];
  tags: Record<string, string[]>;
  campaign: string | null;
  url: string;
  headings: CorpusHeading[];
  /**
   * The three entry card questions, generated once and committed as reviewed
   * copy in content/insights/suggested-questions.json. Empty when an article has
   * not been through the generator, which is a degraded console rather than a
   * broken one. See src/lib/insights/questions.ts.
   */
  suggestedQuestions: string[];
  /**
   * How much of this article the assistant holds.
   *
   * 1 is the default and today's behaviour: the whole body, with a citation
   * marker on every heading. 2 holds the header, summary, takeaways and heading
   * markers only, which is about 350 tokens against roughly 4,900.
   *
   * A tier 2 article is still in the index, still citable as a whole and by
   * section, and still reasoned about. What it loses is verbatim quotation. The
   * point is that the corpus degrades one article at a time instead of the
   * design collapsing into retrieval the day the ceiling is hit.
   *
   * Set in content/insights/corpus-tiers.json, not in article frontmatter: it is
   * an operational decision about the context budget rather than a fact about
   * the writing.
   */
  tier: 1 | 2;
  body: string;
};

export type Corpus = {
  generatedFrom: string;
  articleCount: number;
  articles: CorpusArticle[];
};

export const corpus = manifest as Corpus;

/** Every published article, in filename order. */
export function allArticles(): CorpusArticle[] {
  return corpus.articles;
}

/** One article by slug, or null. Used to bias the prompt toward the page the reader is on. */
export function articleBySlug(slug: string): CorpusArticle | null {
  return corpus.articles.find((a) => a.slug === slug) ?? null;
}

/** True when a citation points at a heading that actually exists on the page. */
export function anchorExists(slug: string, anchor: string): boolean {
  const article = articleBySlug(slug);
  if (!article) return false;
  return article.headings.some((h) => h.anchor === anchor);
}
