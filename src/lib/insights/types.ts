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

/** What the model emits: the two fields it can be trusted to produce. */
export type CitationRef = {
  slug: string;
  anchor: string;
};

/** What the client renders, after the reference is resolved against the manifest. */
export type Citation = {
  slug: string;
  /** Article title, from the manifest rather than from the model. */
  title: string;
  /** Heading text, from the manifest rather than from the model. */
  heading: string;
  anchor: string;
  /** Deep link into the rendered page. */
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
};

/**
 * The markers, defined once. `prompt.ts` interpolates these into the
 * instructions and the parser matches them, so the two cannot drift.
 */
export const MARKERS = {
  /** First line of every reply: [[provenance:corpus]] */
  provenance: (p: Provenance) => `[[provenance:${p}]]`,
  /** Inline, after the claim it supports: [[cite:slug#anchor]] */
  citation: (slug: string, anchor: string) => `[[cite:${slug}#${anchor}]]`,
  /** Start of a paragraph resting on general knowledge: [[general]] */
  general: "[[general]]",
  /** Last line, the one question asked back: [[ask]] Does your team ... */
  ask: "[[ask]]",
} as const;

export const MARKER_PATTERNS = {
  provenance: /\[\[provenance:(corpus|general|mixed|contact)\]\]/,
  /** Global. Slug and anchor exclude "]" and "#" so a malformed marker fails to match rather than swallowing prose. */
  citation: /\[\[cite:([^\]#\s]+)#([^\]#\s]+)\]\]/g,
  generalLead: /^\s*\[\[general\]\]\s*/,
  askLine: /^\s*\[\[ask\]\]\s*(.+)$/,
  /** Any marker at all, for the final strip and for the "model emitted junk" check. */
  any: /\[\[(?:provenance:[a-z]+|cite:[^\]]*|general|ask)\]\]/g,
} as const;
