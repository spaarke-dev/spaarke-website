/**
 * Types and wire markers for the article insights assistant.
 *
 * The model writes prose for a reader and structure for the client in the same
 * stream. The structure is carried by markers rather than by a JSON envelope,
 * because the answer streams and the client has to render citations and the
 * general-knowledge treatment as tokens arrive rather than at the end.
 *
 * Every marker is on its own line or is a single self-closing token, so a
 * partial marker at a chunk boundary can be detected and held rather than
 * printed. See projects/article-insights-assistant/spec.md, FR-03 and KD-06.
 */

/** Where an answer came from. The first line of every reply declares one. */
export type Provenance = "corpus" | "general" | "mixed" | "contact";

/**
 * What the model emits. The anchor is absent when the citation points at an
 * article as a whole, which the assistant needs a legal way to do: without one
 * it slugified an article title into an anchor that does not exist.
 */
export type CitationRef = {
  slug: string;
  anchor?: string;
};

/** What the client renders, after the reference is resolved against the manifest. */
export type Citation = {
  slug: string;
  /** Article title, from the manifest rather than from the model. */
  title: string;
  /** Heading text, from the manifest rather than from the model. Empty for a whole article. */
  heading: string;
  /** Absent when the citation is to the article rather than to one of its sections. */
  anchor?: string;
  /** Deep link into the rendered page, or the page itself for a whole article. */
  href: string;
};

/**
 * Verdicts follow the BFF's GroundingVerifier: a citation is mechanically
 * checked and given a verdict, never assumed correct because the model wrote it.
 * Spec KD-04.
 */
export type CitationVerdict =
  | "verified"
  /** The slug is not in the corpus. The model invented an article. */
  | "unknown-slug"
  /** The article exists, the heading does not. A chip that looks right and goes nowhere. */
  | "unknown-anchor";

export type VerifiedCitation = {
  ref: CitationRef;
  verdict: CitationVerdict;
  /**
   * True when the reference did not resolve as written and was repaired, either
   * by ignoring punctuation in the anchor or by moving the citation to the one
   * article that carries it. Counted rather than hidden, so the rate stays
   * visible to the evaluation run.
   */
  corrected: boolean;
  /** Populated only when the verdict is "verified". */
  citation: Citation | null;
};

/** Verdicts for a verbatim quotation checked against the article text. */
export type QuoteVerdict =
  | "verified"
  /** Matched a window of the article on token overlap, not character for character. */
  | "verified-approximate"
  | "not-found"
  | "unknown-slug";

export type InsightsTurn = {
  role: "user" | "assistant";
  content: string;
};

export type InsightsRequest = {
  question: string;
  /** The article the reader is on. Biases the answer; never limits it. Spec KD-05. */
  articleSlug: string | null;
  /** Prior turns, oldest first. Excludes the question above. */
  history: InsightsTurn[];
};

/** A streamed answer after markers have been lifted out of the prose. */
export type ParsedAnswer = {
  provenance: Provenance;
  /** The reply with every marker removed, ready to render as markdown. */
  text: string;
  citations: VerifiedCitation[];
  /** Indices, into the paragraphs of `text`, of paragraphs resting on general knowledge. */
  generalParagraphs: number[];
  /** The one question the assistant chose to ask back, or null. Always skippable. */
  askedQuestion: string | null;
  /**
   * What had to be repaired before this was fit to show a reader. Every one of
   * these is a model behaviour the prompt is trying to reduce, so the counts are
   * reported by the evaluation run rather than quietly absorbed.
   */
  repairs: {
    /** Citations that resolved only after the anchor or the slug was corrected. */
    citationsCorrected: number;
    /**
     * Quotation marks removed because the words were not verbatim, or because the
     * quoted sentence carried a dash that house voice does not allow. The claim
     * and its citation survive as a paraphrase.
     */
    quotationsDemoted: number;
    /** Dashes replaced, which the corpus models because the articles predate the rule. */
    dashesNormalized: number;
  };
};

/**
 * The markers, defined once. `prompt.ts` interpolates these into the
 * instructions and the parser matches them, so the two cannot drift.
 */
export const MARKERS = {
  /** First line of every reply: [[provenance:corpus]] */
  provenance: (p: Provenance) => `[[provenance:${p}]]`,
  /** Inline, after the claim it supports: [[cite:slug#anchor]], or [[cite:slug]] for a whole article. */
  citation: (slug: string, anchor?: string) =>
    anchor ? `[[cite:${slug}#${anchor}]]` : `[[cite:${slug}]]`,
  /** Start of a paragraph resting on general knowledge: [[general]] */
  general: "[[general]]",
  /** Last line, the one question asked back: [[ask]] Does your team ... */
  ask: "[[ask]]",
} as const;

export const MARKER_PATTERNS = {
  provenance: /\[\[provenance:(corpus|general|mixed|contact)\]\]/,
  /** Global. Slug and anchor exclude "]" and "#" so a malformed marker fails to match rather than swallowing prose. */
  citation: /\[\[cite:([^\]#\s]+)(?:#([^\]#\s]+))?\]\]/g,
  /** The same marker, not global, for finding the citation attached to a quotation. */
  attribution: /\[\[cite:([^\]#\s]+)(?:#[^\]#\s]+)?\]\]/,
  generalLead: /^\s*\[\[general\]\]\s*/,
  askLine: /^\s*\[\[ask\]\]\s*(.+)$/,
  /** Any marker at all, for the final strip and for the "model emitted junk" check. */
  any: /\[\[(?:provenance:[a-z]+|cite:[^\]]*|general|ask)\]\]/g,
} as const;
