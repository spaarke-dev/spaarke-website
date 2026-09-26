import { articleBySlug } from "@/lib/corpus";
import {
  MARKER_PATTERNS,
  type Citation,
  type CitationRef,
  type ParsedAnswer,
  type Provenance,
  type QuoteVerdict,
  type VerifiedCitation,
} from "./types";

/**
 * Parsing and mechanical verification of what the model emits.
 *
 * The approach comes from the product's own citation verifier,
 * Services/Ai/CitationVerification/GroundingVerifier.cs in the Spaarke repo:
 * check the citation against the source with plain string work, give it a
 * verdict, and never treat a citation as correct because the model produced it
 * (spec KD-04). A chip pointing at an anchor that does not exist looks right
 * and does nothing, which is worse than no chip.
 *
 * Nothing here calls a model.
 */

// ---------------------------------------------------------------------------
// Citations
// ---------------------------------------------------------------------------

/** Resolves a reference against the build-time manifest and grades it. */
export function verifyCitation(ref: CitationRef): VerifiedCitation {
  const article = articleBySlug(ref.slug);
  if (!article) return { ref, verdict: "unknown-slug", citation: null };

  const heading = article.headings.find((h) => h.anchor === ref.anchor);
  if (!heading) return { ref, verdict: "unknown-anchor", citation: null };

  const citation: Citation = {
    slug: article.slug,
    title: article.title,
    heading: heading.text,
    anchor: heading.anchor,
    href: `${article.url}#${heading.anchor}`,
  };
  return { ref, verdict: "verified", citation };
}

/** Every citation marker in the order it appears, deduplicated by slug and anchor. */
export function extractCitations(raw: string): VerifiedCitation[] {
  const seen = new Set<string>();
  const out: VerifiedCitation[] = [];
  for (const m of raw.matchAll(MARKER_PATTERNS.citation)) {
    const key = `${m[1]}#${m[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(verifyCitation({ slug: m[1], anchor: m[2] }));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Quote grounding, ported in approach from GroundingVerifier
// ---------------------------------------------------------------------------

const WINDOW_SIZE = 200;
const WINDOW_STEP = 100;
const APPROXIMATE_MATCH_THRESHOLD = 0.7;
const MIN_APPROXIMATE_QUOTE_LENGTH = 12;

function normalize(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function tokens(text: string): string[] {
  return text.split(/[^a-z0-9]+/).filter(Boolean);
}

/**
 * Is this quotation actually in the article? Exact substring first, then a
 * sliding window on token overlap so that light paraphrase inside quotation
 * marks is reported as approximate rather than as fabrication. Used by the
 * evaluation runner (task 012) and available to the endpoint.
 */
export function verifyQuote(slug: string, quote: string): QuoteVerdict {
  const article = articleBySlug(slug);
  if (!article) return "unknown-slug";

  const needle = normalize(quote);
  if (needle.length === 0) return "not-found";

  const haystack = normalize(article.body);
  if (haystack.includes(needle)) return "verified";
  if (needle.length < MIN_APPROXIMATE_QUOTE_LENGTH) return "not-found";

  const needleTokens = tokens(needle);
  if (needleTokens.length === 0) return "not-found";

  for (let start = 0; start < haystack.length; start += WINDOW_STEP) {
    const window = new Set(tokens(haystack.slice(start, start + WINDOW_SIZE)));
    let hits = 0;
    for (const t of needleTokens) if (window.has(t)) hits += 1;
    if (hits / needleTokens.length >= APPROXIMATE_MATCH_THRESHOLD) return "verified-approximate";
  }
  return "not-found";
}

/**
 * Every double-quoted run of at least four words, for grounding checks.
 *
 * Pairs the quote marks positionally rather than with a regex. A regex that
 * rejects a candidate on length carries on scanning from inside it, so the next
 * pair it finds is a closing mark joined to the following opening mark, and the
 * "quotation" it returns is the prose between two unrelated quotations.
 */
export function extractQuotations(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split("\n")) {
    const parts = line.split('"');
    for (let i = 1; i < parts.length; i += 2) {
      const candidate = parts[i];
      if (candidate.length > 400) continue;
      if (tokens(normalize(candidate)).length >= 4) out.push(candidate);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Parsing a whole reply
// ---------------------------------------------------------------------------

/**
 * Closes the gaps a removed marker leaves behind: two spaces where a citation
 * sat mid-sentence, and a space before the full stop where it sat at the end.
 * Leading whitespace is preserved because it carries list indentation.
 */
function tidy(paragraph: string): string {
  return paragraph
    .split("\n")
    .map((line) => {
      const indent = /^[ \t]*/.exec(line)?.[0] ?? "";
      const rest = line
        .slice(indent.length)
        .replace(/[ \t]{2,}/g, " ")
        .replace(/[ \t]+([.,;:!?)])/g, "$1")
        .trimEnd();
      return rest.length > 0 ? indent + rest : "";
    })
    .join("\n")
    .trim();
}

/**
 * Lifts the markers out of a complete reply and returns prose the client can
 * render plus the structure it needs. A reply with no provenance marker is
 * graded "general", the conservative reading: an unlabeled answer is treated as
 * not resting on the articles rather than as resting on them.
 */
export function parseAnswer(raw: string): ParsedAnswer {
  const citations = extractCitations(raw);

  const provenanceMatch = MARKER_PATTERNS.provenance.exec(raw);
  const provenance = (provenanceMatch?.[1] ?? "general") as Provenance;

  const lines = raw.split("\n");
  let askedQuestion: string | null = null;
  const kept: string[] = [];
  for (const line of lines) {
    const ask = MARKER_PATTERNS.askLine.exec(line);
    if (ask) {
      // Only the first survives. The prompt allows one; more than one is a
      // prompt failure and the reader should not see the overflow.
      askedQuestion ??= ask[1].trim();
      continue;
    }
    kept.push(line);
  }

  const withoutMarkers = kept
    .join("\n")
    .replace(MARKER_PATTERNS.citation, "")
    .replace(MARKER_PATTERNS.any, "");

  const paragraphs = withoutMarkers.split(/\n{2,}/).map(tidy).filter((p) => p.length > 0);

  // Paragraph boundaries are recomputed on the text as the model wrote it, so a
  // [[general]] lead can be attributed to the paragraph it opened. Empty
  // paragraphs are dropped from both lists in the same way, to keep the indices
  // aligned with the rendered text.
  const rawParagraphs = kept
    .join("\n")
    .replace(MARKER_PATTERNS.provenance, "")
    .split(/\n{2,}/)
    .filter((p) => tidy(p.replace(MARKER_PATTERNS.citation, "").replace(MARKER_PATTERNS.any, "")).length > 0);

  const generalParagraphs: number[] = [];
  rawParagraphs.forEach((p, i) => {
    // A reply labeled general throughout does not repeat the marker per
    // paragraph, and asking it to was the rule the model read differently on
    // the first live run. The declared provenance settles it.
    if (provenance === "general" || MARKER_PATTERNS.generalLead.test(p.trimStart())) {
      generalParagraphs.push(i);
    }
  });

  const text = paragraphs.join("\n\n");

  return { provenance, text, citations, generalParagraphs, askedQuestion };
}

/**
 * Streaming helper. A marker can be split across two chunks, and half of
 * "[[cite:slug#anchor]]" rendered into the page is a visible defect. Returns
 * the part of the chunk that is safe to render now and the tail to prepend to
 * the next one.
 */
export function holdPartialMarker(chunk: string): { safe: string; held: string } {
  const open = chunk.lastIndexOf("[[");
  if (open === -1) {
    // A lone trailing "[" could become "[[" on the next chunk.
    if (chunk.endsWith("[")) return { safe: chunk.slice(0, -1), held: "[" };
    return { safe: chunk, held: "" };
  }
  if (chunk.indexOf("]]", open) !== -1) return { safe: chunk, held: "" };
  return { safe: chunk.slice(0, open), held: chunk.slice(open) };
}
