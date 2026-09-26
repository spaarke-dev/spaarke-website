import { allArticles, articleBySlug } from "@/lib/corpus";
import {
  MARKER_PATTERNS,
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

/** Anchors differ only in punctuation often enough to be worth a second look. */
function loosen(anchor: string): string {
  return anchor.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Resolves a reference against the build-time manifest and grades it.
 *
 * Two recoveries before giving up, both of which turn a dead chip into a working
 * one and both of which came from watching the evaluation run fail.
 *
 * The first is punctuation. The model typed `today's-business-intelligence`
 * where the slugger produced `todays-business-intelligence`, so an anchor that
 * matches once punctuation is ignored is taken as the anchor meant.
 *
 * The second is the slug. The model cited one article of a series for a heading
 * that belongs to its neighbour. Anchors are long enough to be effectively
 * unique across 24 articles, so when exactly one article carries the anchor, the
 * citation is repaired to point there. When more than one does, the ambiguity is
 * real and the citation fails.
 */
export function verifyCitation(ref: CitationRef): VerifiedCitation {
  const article = articleBySlug(ref.slug);

  const asCitation = (
    found: NonNullable<ReturnType<typeof articleBySlug>>,
    heading: { text: string; anchor: string },
    corrected: boolean,
  ): VerifiedCitation => ({
    ref,
    verdict: "verified",
    corrected,
    citation: {
      slug: found.slug,
      title: found.title,
      heading: heading.text,
      anchor: heading.anchor,
      href: `${found.url}#${heading.anchor}`,
    },
  });

  if (article && !ref.anchor) {
    // A citation to the article rather than to a section.
    return {
      ref,
      verdict: "verified",
      corrected: false,
      citation: { slug: article.slug, title: article.title, heading: "", href: article.url },
    };
  }

  const wanted = ref.anchor ?? "";

  if (article && wanted) {
    const exact = article.headings.find((h) => h.anchor === wanted);
    if (exact) return asCitation(article, exact, false);

    const loose = article.headings.find((h) => loosen(h.anchor) === loosen(wanted));
    if (loose) return asCitation(article, loose, true);

    // An anchor made from the article's own title, which is not a heading. The
    // article as a whole is what was meant.
    if (loosen(article.title) === loosen(wanted)) {
      return {
        ref,
        verdict: "verified",
        corrected: true,
        citation: { slug: article.slug, title: article.title, heading: "", href: article.url },
      };
    }
  }

  // The anchor may belong to a different article than the one cited.
  const elsewhere = allArticles().flatMap((a) => {
    const h = a.headings.find((x) => loosen(x.anchor) === loosen(wanted));
    return h ? [{ article: a, heading: h }] : [];
  });
  if (elsewhere.length === 1) {
    return asCitation(elsewhere[0].article, elsewhere[0].heading, true);
  }

  if (!article) return { ref, verdict: "unknown-slug", corrected: false, citation: null };
  return { ref, verdict: "unknown-anchor", corrected: false, citation: null };
}

/** Every citation marker in the order it appears, deduplicated by slug and anchor. */
export function extractCitations(raw: string): VerifiedCitation[] {
  const seen = new Set<string>();
  const out: VerifiedCitation[] = [];
  for (const m of raw.matchAll(MARKER_PATTERNS.citation)) {
    const key = `${m[1]}#${m[2] ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(verifyCitation({ slug: m[1], anchor: m[2] || undefined }));
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

/** How far after a closing quote mark a citation marker still counts as attached to it. */
const ATTRIBUTION_WINDOW = 160;

/**
 * The slug of the citation attached to a quotation, or null when there is none.
 *
 * Stops at the end of the sentence the quotation sits in. A marker in the next
 * sentence belongs to that sentence, and reading it as attribution failed a case
 * where the assistant quoted a question a reader might ask and a citation for the
 * following claim happened to fall inside the window.
 */
function attributionOf(after: string): string | null {
  const sentence = after.slice(0, ATTRIBUTION_WINDOW).split(/(?<=[.!?])\s/)[0];
  return MARKER_PATTERNS.attribution.exec(sentence)?.[1] ?? null;
}

export type QuotationCheck = {
  quote: string;
  /** The slug the citation after the quote points at, or null when there is none. */
  slug: string | null;
  verdict: QuoteVerdict | "unattributed";
};

/**
 * Checks quotations against the article each one is attributed to.
 *
 * Runs on the raw reply, before markers are stripped, because attribution is
 * carried by the marker that follows the closing quote mark. The prompt requires
 * exactly that: a quotation reproduces article text and is followed by its
 * citation. So a quotation with no marker after it is reported as unattributed
 * rather than checked against whatever else the reply happened to cite, which is
 * what an earlier version did. That version failed replies for quoting a
 * sentence a reader might say, and passed a real misquote whenever the reply
 * cited several articles and one of them happened to contain the words.
 */
export function verifyQuotations(raw: string): QuotationCheck[] {
  const out: QuotationCheck[] = [];
  for (const line of raw.split("\n")) {
    const parts = line.split('"');
    // An odd number of quote marks means one is unpaired, so every pairing after
    // it is off by one and the spans returned are the prose between unrelated
    // quotations. Better to check nothing on the line than to report fiction.
    if (parts.length % 2 === 0) continue;
    let cursor = 0;
    for (let i = 1; i < parts.length; i += 2) {
      // Position of the text following this quotation on the line.
      cursor = line.indexOf(`"${parts[i]}"`, cursor);
      const after = cursor === -1 ? "" : line.slice(cursor + parts[i].length + 2, cursor + parts[i].length + 2 + ATTRIBUTION_WINDOW);
      if (cursor !== -1) cursor += parts[i].length + 2;

      const quote = parts[i];
      if (quote.length > 400) continue;
      if (tokens(normalize(quote)).length < 4) continue;

      const slug = attributionOf(after);
      if (!slug) {
        out.push({ quote, slug: null, verdict: "unattributed" });
        continue;
      }
      out.push({ quote, slug, verdict: verifyQuote(slug, quote) });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Parsing a whole reply
// ---------------------------------------------------------------------------

/**
 * Runs of the system prompt reproduced in the answer.
 *
 * One evaluation case came back telling the reader that an article states plainly
 * that "Do not take sides between in-house departments and law firms", which is a
 * sentence from the instructions rather than from any article. That is a leak and
 * a false attribution at once, so it is detected rather than trusted to a rule.
 *
 * Compares eight-word windows, which is long enough that ordinary phrasing does
 * not collide and short enough to catch a partial quotation.
 */
const LEAK_WINDOW = 8;
let instructionShingles: Set<string> | null = null;
let normalizedCorpus: string | null = null;

export function detectInstructionLeak(text: string, instructions: string): string[] {
  const shingle = (source: string) => {
    const words = normalize(source).split(" ").filter(Boolean);
    const out: string[] = [];
    for (let i = 0; i + LEAK_WINDOW <= words.length; i += 1) {
      out.push(words.slice(i, i + LEAK_WINDOW).join(" "));
    }
    return out;
  };

  instructionShingles ??= new Set(shingle(instructions));

  const words = normalize(text).split(" ").filter(Boolean);
  const leaks: string[] = [];
  let i = 0;
  while (i + LEAK_WINDOW <= words.length) {
    if (!instructionShingles.has(words.slice(i, i + LEAK_WINDOW).join(" "))) {
      i += 1;
      continue;
    }
    // Extend the span while it keeps matching, so one leak is reported once.
    let end = i + LEAK_WINDOW;
    while (
      end < words.length &&
      instructionShingles.has(words.slice(end - LEAK_WINDOW + 1, end + 1).join(" "))
    ) {
      end += 1;
    }
    leaks.push(words.slice(i, end).join(" "));
    i = end;
  }

  // The instructions quote the articles in places, for instance the list of
  // deterministic alternatives, so an overlap that is also in the corpus is the
  // assistant citing an article rather than reciting its own rules.
  normalizedCorpus ??= allArticles()
    .map((a) => normalize(a.body))
    .join(" ");
  return leaks.filter((leak) => !normalizedCorpus!.includes(leak));
}

/** The dashes house voice does not allow, with voice-lint's lookarounds. */
const DASH_RE =
  /—|[ ]–[ ]|(?<=[A-Za-z0-9])[ ]--[ ](?=[A-Za-z0-9])|(?<=[A-Za-z0-9,)])[ ]-[ ](?=[A-Za-z0-9(])/;

/**
 * Removes the quotation marks from a quoted span that cannot stand as a
 * quotation, leaving the claim and its citation in place as a paraphrase.
 *
 * Two reasons to demote. The words are not actually in the article the citation
 * points at, which the evaluation run showed the model doing about once every
 * eight answers, usually by tightening a sentence. Or the quoted sentence carries
 * an em dash, which several articles do because they predate the rule, and house
 * voice does not allow the mark in front of a reader.
 *
 * Demoting rather than deleting is deliberate. The claim is almost always right;
 * it is the promise of exact wording that is wrong.
 */
function demoteQuotations(raw: string): { text: string; demoted: number } {
  let demoted = 0;
  const lines = raw.split("\n").map((line) => {
    const parts = line.split('"');
    // An odd number of marks means pairing is a guess. Leave the line alone.
    if (parts.length % 2 === 0) return line;

    let out = parts[0];
    for (let i = 1; i < parts.length; i += 2) {
      const quote = parts[i];
      const after = parts[i + 1] ?? "";
      const slug = attributionOf(after);
      const substantial = tokens(normalize(quote)).length >= 4;

      let demote = false;
      if (substantial && slug) {
        const verdict = verifyQuote(slug, quote);
        demote = verdict !== "verified" && verdict !== "verified-approximate";
      }
      if (substantial && DASH_RE.test(quote)) demote = true;

      if (demote) {
        demoted += 1;
        out += quote + after;
      } else {
        out += `"${quote}"${after}`;
      }
    }
    return out;
  });
  return { text: lines.join("\n"), demoted };
}

/**
 * Replaces the dashes house voice bans. The corpus is full of them, because the
 * published articles predate the rule, so the model mirrors them however firmly
 * the instructions say not to. Quotations that carried one have already been
 * demoted, so nothing here alters text still presented as verbatim.
 */
function normalizeDashes(text: string): { text: string; changed: number } {
  let changed = 0;
  const replaced = text
    .replace(/ *— */g, () => {
      changed += 1;
      return ", ";
    })
    .replace(/ – /g, () => {
      changed += 1;
      return ", ";
    })
    .replace(/(?<=[A-Za-z0-9]) -- (?=[A-Za-z0-9])/g, () => {
      changed += 1;
      return ", ";
    })
    .replace(/(?<=[A-Za-z0-9,)]) - (?=[A-Za-z0-9(])/g, () => {
      changed += 1;
      return ", ";
    })
    // A dash next to existing punctuation leaves a doubled comma behind.
    .replace(/,\s*,/g, ",");
  return { text: replaced, changed };
}

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
  // A reply cut off at max_tokens can end inside a marker. Half a marker
  // rendered into the page is a visible defect, so drop the fragment here as
  // well as in the streaming path.
  const { safe } = holdPartialMarker(raw);
  const demotion = demoteQuotations(safe);
  raw = demotion.text;

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

  const dashes = normalizeDashes(paragraphs.join("\n\n"));

  return {
    provenance,
    text: dashes.text,
    citations,
    generalParagraphs,
    askedQuestion,
    repairs: {
      citationsCorrected: citations.filter((c) => c.corrected).length,
      quotationsDemoted: demotion.demoted,
      dashesNormalized: dashes.changed,
    },
  };
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
