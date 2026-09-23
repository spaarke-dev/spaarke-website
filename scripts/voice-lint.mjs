// Voice lint for Spaarke content drafts. Enforces the hard punctuation
// rule in content-platform/voice/style-guide.md (no em dashes or dash
// substitutes) and flags the words and constructions listed in
// content-platform/voice/examples/ai-tells.md. Errors exit 1; warnings
// do not, unless --strict is passed. The construction checks are
// partial: a clean run does not replace the ai-tells.md checklist.
// Run from repo root: `node scripts/voice-lint.mjs <file> [<file>...] [--strict]`.
//
// The checks fall in two groups. The punctuation, vocabulary, phrase and
// paragraph checks run on every file, because the guides and the templates
// are written to the same house rules as the articles. The structure and
// stance checks read the shape of a published article, so they run only on
// an article draft (see isArticleDraft below). A rules file has no opening,
// no close and no section budget, and a warning that fires on every guide
// file teaches the writer to ignore the warning stream.
//
// Two checks read the piece's own declared values from a plan.md sitting
// beside the linted file: the thesis formula and the per-section word
// budget. Where there is no plan.md, or it declares neither, both checks
// are skipped in silence. Nothing here requires that file to exist.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const files = args.filter((a) => !a.startsWith("--"));

if (files.length === 0) {
  console.error("Usage: node scripts/voice-lint.mjs <file> [<file>...] [--strict]");
  process.exit(2);
}

// Dash characters are built from code points so this file contains none of them.
const EM = String.fromCharCode(0x2014);
const BAR = String.fromCharCode(0x2015);
const EN = String.fromCharCode(0x2013);
// The workflow marker is a tool token, not prose. It is matched as a plain string.
const TBD_MARKER = "**TBD " + EM + " confirm**";

// A form of "to be" followed by a past participle. Used for the passive-share
// statistic only (style guide section 2); it never raises an error, because a
// legitimate passive is common and the judgement belongs to the writer.
const PASSIVE_IRREGULAR =
  "written|given|taken|made|held|seen|known|built|done|kept|shown|found|brought|put|set|sent|told|left|drawn|run|paid|met|lost|won|read|understood|chosen|driven|begun|spent|dealt|sold|bought|caught|taught|thought|meant|felt|led|said|heard";
const PASSIVE = new RegExp(
  `\\b(is|are|was|were|be|been|being)\\b(\\s+\\w+ly)?\\s+((?:${PASSIVE_IRREGULAR})|\\w+ed)\\b`,
  "i"
);

// Hard errors: punctuation the house style bans outright.
const ERRORS = [
  { re: new RegExp("[" + EM + BAR + "]", "g"), msg: "em dash: restructure with a comma pair, colon, parentheses, or a new sentence" },
  { re: new RegExp("[ ]" + EN + "[ ]", "g"), msg: "spaced en dash used as a dash: restructure the sentence" },
  { re: new RegExp("[A-Za-z]" + EN + "[A-Za-z]", "g"), msg: "en dash between words: restructure the sentence" },
  { re: new RegExp("[0-9][0-9,.]*%?" + EN + "[$]?[0-9]", "g"), msg: "en dash in a range: write ranges with the word to" },
  { re: /(?<=[A-Za-z0-9])[ ]--[ ](?=[A-Za-z0-9])/g, msg: "double hyphen used as a dash: restructure the sentence" },
  // Same line only, and never at a list marker, so plain bullet lists do not trip it.
  { re: /(?<=[A-Za-z0-9,)])[ ]-[ ](?=[A-Za-z0-9(])/g, msg: "spaced hyphen used as a dash: restructure the sentence" },
];

// Soft punctuation checks, reported as warnings.
const RANGE_HYPHEN = /(?<![0-9-])[0-9][0-9,.]*%?-[$]?[0-9][0-9,.]*%?(?![0-9-])/g;
const ISO_DATE = /[0-9]{4}-[0-9]{2}(?:-[0-9]{2})?(?![0-9])/g;

// Warnings: vocabulary that marks prose as machine-written or as marketing copy.
const WORDS = [
  "delve", "delves", "delving", "tapestry", "testament", "realm", "landscape",
  "pivotal", "crucial", "paramount", "underscore", "underscores", "underscoring",
  "foster", "fosters", "fostering", "leverages", "leveraging",
  "seamless", "seamlessly", "robust", "unlock", "unlocks", "unleash", "harness",
  "empower", "empowers", "empowering", "transform", "transforms", "transformative",
  "transformation", "revolutionize", "revolutionary", "game-changing", "game-changer",
  "cutting-edge", "best-in-class", "world-class", "innovative", "holistic", "synergy",
  "ecosystem", "journey", "navigate", "navigating", "elevate", "elevates", "supercharge",
  "streamline", "streamlines", "ever-evolving", "fast-paced", "myriad", "plethora",
  "multifaceted", "nuanced", "intricate", "vibrant", "boasts", "showcasing", "groundbreaking",
];

const PHRASES = [
  // From the writer's author calibration, September 2026.
  { re: /\bGeneral Counsel\b(?!\s+[A-Z])/g, msg: "\"general counsel\" is lowercase in our own prose" },
  { re: /\bwe hear\b/gi, msg: "\"we hear\": state the trend directly" },
  { re: /\bthis (?:final|last) article\b/gi, msg: "finale framing: name the series instead" },
  { re: /\bWhat [a-z][^.?!\n]{5,60} (?:is|does|adds|matters) is\b/g, msg: "cleft sentence: state the subject directly" },
  // The verb takes an object; the noun does not. "what leverage existed" is the
  // field's own word and stays (style guide, section 5, rule 27).
  { re: /\bleverage (?:the|our|its|their|a|an|this|existing|these)\b/gi, msg: "word to avoid: \"leverage\" as a verb" },
  { re: /\bin today's\b/gi, msg: "stock opener (\"in today's ...\")" },
  { re: /\bit(?:'s| is) (?:important|worth) (?:to note|noting)\b/gi, msg: "filler hedge" },
  { re: /\bhere(?:'s| is) the (?:thing|catch|kicker|reality|truth)\b/gi, msg: "signposting" },
  { re: /\b(?:let's|let us) (?:dive|dig|explore|unpack|take a look)\b/gi, msg: "signposting" },
  { re: /\bthe (?:result|upshot|catch|takeaway|bottom line|answer|reality|truth)\s*[?:]/gi, msg: "colon or question reveal" },
  { re: /\bnot (?:just|merely)\b[^.?!\n]{0,120}\b(?:but|it is|it's|they are)\b/gi, msg: "\"not just X but Y\" construction: state the point directly" },
  { re: /\b(?:is|are|was|were|isn't|aren't) not (?!simply|only|just|merely)(?:about |a |an |the )?[^.?!\n]{1,70}[.;]\s+(?:it|they|this|that) (?:is|are|was|were)\b/gi, msg: "negation-then-correction (\"It is not X. It is Y.\"): state what it is" },
  { re: /\bhere(?:'s| is) (?:why|how|what)\b/gi, msg: "signposting" },
  { re: /\bnot because\b[^.?!\n]{1,90}[.,;]\s*(?:but )?because\b/gi, msg: "\"not because X, but because Y\": give the reason directly" },
  { re: /\b(?:stands|serves) as a (?:testament|reminder)\b/gi, msg: "inflated significance" },
  { re: /\bplays? a (?:key|crucial|vital|pivotal|significant) role\b/gi, msg: "inflated significance" },
  { re: /\bat the end of the day\b|\bwhen it comes to\b|\bthe fact of the matter\b/gi, msg: "filler phrase" },
  { re: /\bin (?:conclusion|summary)\b|\bto sum up\b|\bultimately,/gi, msg: "summary closer: end on substance, not a recap" },
  { re: /\bmore than ever\b|\bnow more than ever\b/gi, msg: "stock intensifier" },
  { re: /,\s(?:highlighting|underscoring|emphasizing|showcasing|reflecting|signaling|demonstrating)\s/gi, msg: "present-participle tail: make it a sentence with a subject" },
];

// Structure and stance checks, added September 2026 from the article 1
// rewrite, and run on article drafts only. Every threshold below was derived
// from a single before-and-after pair, so each is named here and meant to be
// retuned once more articles have been measured against it. All of these
// report warnings or statistics. The one exception, and the only error in
// this block, is a keyTakeaways count above the ceiling, which is a
// frontmatter contract rather than a judgement about prose.
const BIBLIOGRAPHIC_WE_RATIO = 0.5; // "In our earlier article" per link to a Spaarke article
const TERMINAL_CAVEATS_PER_1000 = 1; // caveats that end on what a figure cannot show
const FULL_DATES_PER_1000 = 3; // "Month D, YYYY" density
const SECTION_WEIGHT_RATIO = 2; // a section against the median section
const BOLD_LIST_MIN_ITEMS = 3; // consecutive bold lead-in items that make a block
// Bold lead-in lists are permitted and reviewed at use (writer, 2026-09-23).
// The count is reported as a statistic; there is no ceiling to fail.
const LONG_FORM_WORDS = 3000; // above this, a piece is expected to carry at least one block
const THESIS_FORMULA_ANCHORS = 3; // opening, the heading that proves it, the close
const KEY_TAKEAWAYS_MAX = 6;
const KEY_TAKEAWAYS_WITH_STATISTIC_MAX = 1;
const CLOSE_IMPERATIVES_MIN = 2;
  "^(?:\\*\\*)?(?:Then |First |Next |Begin by )?(?:Understand|Define|Make|Designate|Put|Start|Agree|Decide|Name|Record|Write|Govern|Settle|Choose|Pick|Map|Identify|Assign|Document|Review|Confirm|Begin|Establish|Set|List|Check|Ask|Treat|Keep|Build|Add|Run)\\b"
const CLOSE_FIRST_STEP = /(?:the )?(?:practical )?first (?:step|move)\b|starts? by\b|begins with\b|where to start\b|the strongest candidates are\b|the (?:lasting|first|real|important) (?:decisions?|questions?|choices?) (?:are|is)\b|the decisions? that matters?\b|who defines\b|the practical (?:instruction|step|move)|the instruction for|the sequence (?:is|for)\b|\bis to (?:name|start|begin|choose|define|govern|write|build|inventory|map|settle|identify|assign|pick|set|agree|record)\b/i;

// A heading that reports a movement instead of rendering a verdict
// (style guide section 4). The plain "is or are plus a gerund" test the
// audit proposed fires on the approved exemplar's own headings ("AI is
// redefining the department's people and roles", "The economics of outside
// counsel are being reset"), both of which render a verdict, so the check is
// narrowed to verbs that name a movement rather than a judgement.
const MOVEMENT_VERBS =
  "settling|shifting|moving|becoming|emerging|evolving|growing|rising|expanding|converging|changing|trending|heading|drifting|migrating|coalescing";
const MOVEMENT_HEADING = new RegExp(`\\b(?:is|are)\\s+(?:\\w+ly\\s+)?(?:${MOVEMENT_VERBS})\\b`, "i");

const BIBLIOGRAPHIC_WE = /\bIn our (?:earlier|previous) articles?\b/gi;
const SPAARKE_ARTICLE_LINK = /\]\(\/why-spaarke\//g;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+(.*)$/;
const TERMINAL_CAVEATS = [
  /\bso (?:they|it|the pair|neither|that)\b[^.]*\bnot\b/gi,
  /cannot show|is not disclosed|no survey base|does not exist/gi,
];
const FULL_DATE =
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+[0-9]{1,2},\s+[0-9]{4}\b/g;
// An ordinal standing in for a counted cause, used as a handle that points at
// another section (consulting register section 4.4): "as the third driver
// showed", "the alternative provider market described under the fifth
// driver". Two limits are deliberate, and both come from testing the general
// form against the approved article.
//
// The nouns are a closed list rather than a bare \w+. The general form flags
// ordinary prose: "stay with the department's lawyers from the first draft",
// "the department can report, for the first time", "the second of those
// questions". None of those is a reference handle, and a check that fires on
// the house exemplar is a check the writer will switch off. The list holds
// the nouns an enumerated cause actually takes; extend it when a draft
// coins a new one, not speculatively. "Decision" was tried and removed: it
// names an act that recurs in time, so "the second decision costs less than
// the first" counts occasions rather than pointing at a numbered item.
//
// The ordinal also has to carry a definite determiner, which is what makes it
// point away from the sentence it sits in. An indefinite ordinal introduces
// its item on the spot ("The front door has a second value: it is the
// department's best source of information about its own demand"), and the
// partitive form counts against a set the reader has just read ("the second
// of those questions"), which the noun list excludes on its own.
const ORDINAL_NOUNS =
  "driver|gap|area|pressure|force|cause|factor|reason|shift|trend|theme|development|challenge|pillar|capability|channel|signal|principle|requirement|point";
const ORDINAL_HANDLE = new RegExp(
  "\\b(?:the|this|that|these|those)\\s+" +
    "(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\\s+" +
    `(?:${ORDINAL_NOUNS})s?\\b`,
  "gi"
);
const CLOSE_IMPERATIVE = new RegExp(
  "^(?:\\*\\*)?(?:Understand|Define|Make|Designate|Put|Start|Agree|Decide|Name|Record)\\b"
);
// Words that end the title's leading noun phrase, used for the title-discharge check.
const TITLE_STOPWORDS = new Set([
  "the", "a", "an", "of", "for", "and", "or", "in", "on", "to", "with", "as",
  "at", "by", "from", "is", "are", "that", "why", "how", "what", "when", "your", "our",
]);

function stripNonProse(text) {
  // Blank out code fences, inline code, link targets, HTML comments, and import lines,
  // preserving line count so reported line numbers stay accurate.
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return text
    // The workflow marker is a tool token, not prose. It is counted separately below.
    .split(TBD_MARKER).join(" ".repeat(TBD_MARKER.length))
    .replace(/```[\s\S]*?```/g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/`[^`\n]*`/g, blank)
    .replace(/\]\([^)\n]*\)/g, (m) => "]" + blank(m.slice(1)))
    .replace(/^(?:import|export)\s.*$/gm, blank);
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function squash(s) {
  return s.replace(/\s+/g, " ").trim();
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let n = 0;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    n++;
    i = haystack.indexOf(needle, i + needle.length);
  }
  return n;
}

// The piece's own declared values, read from a plan.md beside the linted
// file. A missing file, an unreadable one, or a template placeholder left
// unfilled all return nothing, and the two checks that depend on this are
// then skipped without a warning.
function readPlan(file) {
  let plan;
  try {
    plan = readFileSync(join(dirname(file), "plan.md"), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return { thesisFormula: "", budgets: [] };
  }
  const filled = (s) => (s && !/^</.test(s.trim()) ? squash(s) : "");

  // Either a declared key, or the blockquote under the "Thesis formula" heading.
  let thesisFormula = filled((/^\s*thesis_formula:\s*"?([^"\n]+)"?\s*$/m.exec(plan) || [])[1]);
  if (!thesisFormula) {
    const heading = /^##\s+Thesis formula[^\n]*\n/m.exec(plan);
    if (heading) {
      const from = heading.index + heading[0].length;
      const next = plan.indexOf("\n## ", from);
      const quoted = plan
        .slice(from, next === -1 ? plan.length : next)
        .split("\n")
        .filter((l) => /^\s*>/.test(l))
        .map((l) => l.replace(/^\s*>\s?/, ""))
        .join(" ");
      thesisFormula = filled(quoted);
    }
  }

  const budgets = [...plan.matchAll(/\*\*Word budget:\*\*\s*(?:about\s*)?([0-9][0-9,]*)\b/gi)].map((m) =>
    Number(m[1].replace(/,/g, ""))
  );

  return { thesisFormula, budgets };
}

// Whether the file is an article draft, as against a guide, a template, a
// brief or a routing document. The structure and stance checks all govern the
// shape of a published article and are meaningless anywhere else, so every one
// of them is gated on this test.
//
// Location settles most cases: the publish target is content/blog/, and the
// per-piece workspace is content-platform/articles/<slug>/draft.mdx. The
// frontmatter contract catches a draft linted from anywhere else, such as a
// copy under review or a version pulled out of git history, and it is the
// article fields together rather than any one of them.
//
// Two files in this repository would otherwise be mistaken for drafts, and
// both are excluded on purpose. templates/article-template.mdx carries the
// whole frontmatter contract, because printing the shape a draft has to fill
// in is its job. A brief.md carries the same field names for the same reason,
// which is why the contract counts only for an .mdx file.
function isArticleDraft(file, frontmatter) {
  const path = file.replace(/\\/g, "/");
  if (/(?:^|\/)templates\//.test(path)) return false;
  if (/(?:^|\/)content\/blog\/[^/]+\.mdx?$/i.test(path)) return true;
  if (/(?:^|\/)articles\/[^/]+\/draft\.mdx?$/i.test(path)) return true;
  if (!/\.mdx$/i.test(path)) return false;
  const declares = (k) => new RegExp(`^${k}:`, "m").test(frontmatter);
  return declares("title") && declares("description") && declares("keyTakeaways");
}

let errorCount = 0;
let warnCount = 0;

for (const file of files) {
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const text = stripNonProse(raw);
  const lines = raw.split("\n");
  const report = [];
  const frontmatter = (/^---\n([\s\S]*?)\n---\n/.exec(raw) || [])[1] || "";
  const article = isArticleDraft(file, frontmatter);

  const push = (level, index, msg) => {
    const n = lineOf(text, index);
    report.push({ level, n, msg, excerpt: (lines[n - 1] || "").trim().slice(0, 110) });
  };

  for (const { re, msg } of ERRORS) {
    for (const m of text.matchAll(re)) push("error", m.index, msg);
  }
  // Hyphenated numeric ranges ("40-60 matters"). ISO dates are blanked first so they do not match.
  const noDates = text.replace(ISO_DATE, (m) => " ".repeat(m.length));
  for (const m of noDates.matchAll(RANGE_HYPHEN)) push("warn", m.index, "hyphenated range: write ranges with the word to");

  for (const w of WORDS) {
    const re = new RegExp(`\\b${w}\\b`, "gi");
    for (const m of text.matchAll(re)) push("warn", m.index, `word to avoid: "${m[0]}"`);
  }
  for (const { re, msg } of PHRASES) {
    for (const m of text.matchAll(re)) push("warn", m.index, msg);
  }

  // Structural checks on body paragraphs (frontmatter, headings, lists, and quotes excluded).
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, (m) => m.replace(/[^\n]/g, " "));
  const bodyWords = body.split(/\s+/).filter(Boolean).length;

  // The H2 sections, in document order. Indices run against body, which keeps
  // the character positions of raw, so they can be passed straight to push.
  const sections = [...body.matchAll(/^##[ \t]+(.+)$/gm)].map((m) => ({
    at: m.index,
    heading: m[1].trim(),
    start: m.index + m[0].length,
  }));
  for (let i = 0; i < sections.length; i++) {
    sections[i].end = i + 1 < sections.length ? sections[i + 1].at : body.length;
    sections[i].words = body.slice(sections[i].start, sections[i].end).split(/\s+/).filter(Boolean).length;
  }
  // The close is the last H2 of an article. A guide's last section is not a
  // close, so the exemption it earns below does not extend to one.
  const closeSection = article && sections.length ? sections[sections.length - 1] : null;

  const paras = [];
  let cursor = 0;
  for (const m of body.matchAll(/\n[ \t]*\n/g)) {
    paras.push({ at: cursor, para: body.slice(cursor, m.index) });
    cursor = m.index + m[0].length;
  }
  paras.push({ at: cursor, para: body.slice(cursor) });

  let oneSentenceParas = 0;
  let paraCount = 0;
  let passiveSentences = 0;
  const sentenceLengths = [];
  const paraLengths = [];
  for (const { at, para } of paras) {
    const start = at + (para.length - para.trimStart().length);
    const p = para.trim();
    if (!p || /^(#|[-*>|]|\d+\.|<)/.test(p)) continue;
    paraCount++;
    const sentences = p.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 0);
    paraLengths.push(p.split(/\s+/).length);
    for (const s of sentences) sentenceLengths.push(s.split(/\s+/).length);
    // Passive share, reported as a statistic (style guide section 2). A quoted
    // span is excluded, because a source's wording is never rewritten.
    for (const s of sentences) {
      if (PASSIVE.test(s.replace(/"[^"]*"/g, " "))) passiveSentences++;
    }
    // The opening's first sentence states the claim in our own voice, and the
    // evidence follows it (style guide section 3; section 5, rule 3).
    if (article && paraCount === 1 && /[0-9%]/.test(sentences[0] || "")) {
      push("warn", start, "statistic in the opening sentence: state the claim in our own voice and bring the evidence in after it");
    }
    // A short lead-in that ends with a colon introduces a list; it is not a dramatic one-liner.
    // A paragraph opening on a bold label is a lead-in to what follows it, which is
    // house form for a previewed framework or a diagnostic set (style guide section 4).
    if (sentences.length === 1 && p.split(/\s+/).length <= 12 && !p.endsWith(":") && !p.startsWith("**")) {
      oneSentenceParas++;
      push("warn", start, "one-sentence paragraph used for effect: fold it into the paragraph it belongs to");
    }
    // The close runs on bare imperatives, which land as short sentences by design,
    // so the aphoristic-landing check does not apply to the final section.
    const inCloseSection = closeSection !== null && start >= closeSection.at;
    const last = sentences.slice(-2);
    if (!inCloseSection && last.length === 2 && last.every((s) => s.split(/\s+/).length <= 7)) {
      push("warn", start + Math.max(0, p.lastIndexOf(last[0])), "paragraph ends on two clipped sentences (aphoristic landing): finish with a complete thought");
    }
    if (/\?\s+[A-Z]/.test(p) && /\?/.test(sentences[0] || "")) {
      push("warn", start, "paragraph opens with a question and then answers it: make the claim instead");
    }
  }

  const plan = readPlan(file);

  // Bold lead-in lists. The house pattern for a parallel enumeration, in the three
  // cases in style guide section 4. The count is a statistic and is printed for
  // every file; the ceiling that goes with it is an article rule and is applied
  // in the block below, so the pattern does not return as the device the 2026
  // audit counted 303 times.
  let boldListBlocks = 0;
  let boldRun = 0;
  let blankRun = 0;
  let firstBoldList = 0;
  let offset = 0;
  for (const line of body.split("\n")) {
    const item = LIST_ITEM.exec(line);
    if (item) {
      blankRun = 0;
      if (item[1].startsWith("**")) {
        boldRun++;
        if (boldRun === BOLD_LIST_MIN_ITEMS) {
          boldListBlocks++;
          if (!firstBoldList) firstBoldList = offset;
        }
      } else {
        boldRun = 0;
      }
    } else if (line.trim() === "") {
      // One blank line separates items in a loose list; two end the list.
      if (++blankRun >= 2) boldRun = 0;
    } else {
      boldRun = 0;
      blankRun = 0;
    }
    offset += line.length + 1;
  }

  // ==========================================================================
  // Article-only checks. Each one reads the shape of a published article: its
  // opening, its headings, its evidence density, its citation practice, its
  // section weights and its close. A guide, a template, a brief or a routing
  // document has none of those, so a check that runs on one reports a defect
  // the file cannot have. Anything added here inherits the gate; a check that
  // belongs on every file goes above this block.
  // ==========================================================================
  if (article) {
    // Our own library is cited in the bibliographic first person, with Spaarke as
    // the actor (style guide section 1; section 5, rule 11). Links inside a list,
    // which is where related reading sits, are not part of the ratio.
    const proseOnly = raw
      .replace(/^---\n[\s\S]*?\n---\n/, (m) => m.replace(/[^\n]/g, " "))
      .split("\n")
      .map((l) => (LIST_ITEM.test(l) ? " ".repeat(l.length) : l))
      .join("\n");
    const spaarkeLinks = [...proseOnly.matchAll(SPAARKE_ARTICLE_LINK)];
    const biblioWe = [...text.matchAll(BIBLIOGRAPHIC_WE)].length;
    if (spaarkeLinks.length > 0 && biblioWe / spaarkeLinks.length < BIBLIOGRAPHIC_WE_RATIO) {
      push(
        "warn",
        spaarkeLinks[0].index,
        `${biblioWe} citing "we" against ${spaarkeLinks.length} links to Spaarke articles: introduce our own work as "In our earlier article, [title], we ..."`
      );
    }

    // Headings render a verdict (style guide section 4).
    for (const s of sections) {
      if (MOVEMENT_HEADING.test(s.heading)) {
        push("warn", s.at, "heading reports a movement; render a verdict");
      }
    }

    // A limitation is a subordinate clause, and the sentence ends on what the
    // evidence supports (style guide section 3).
    const caveats = TERMINAL_CAVEATS.flatMap((re) => [...body.matchAll(re)]).sort((a, b) => a.index - b.index);
    const caveatDensity = bodyWords ? (1000 * caveats.length) / bodyWords : 0;
    if (caveatDensity > TERMINAL_CAVEATS_PER_1000) {
      push(
        "warn",
        caveats[0].index,
        `${caveats.length} terminal caveats in ${bodyWords} words (${caveatDensity.toFixed(1)} per 1,000, ceiling ${TERMINAL_CAVEATS_PER_1000}): subordinate the limit and end on what the figure supports`
      );
    }

    // A date earns its place when it changes how a finding should be weighed
    // (style guide section 1).
    const fullDates = [...body.matchAll(FULL_DATE)];
    const dateDensity = bodyWords ? (1000 * fullDates.length) / bodyWords : 0;
    if (dateDensity > FULL_DATES_PER_1000) {
      push(
        "warn",
        fullDates[0].index,
        `${fullDates.length} full dates in ${bodyWords} words (${dateDensity.toFixed(1)} per 1,000, ceiling ${FULL_DATES_PER_1000}): keep the dates that change how a finding is weighed`
      );
    }

    // An ordinal is never a reference handle (consulting register section 4.4).
    for (const m of body.matchAll(ORDINAL_HANDLE)) {
      push("warn", m.index, `ordinal used as a reference handle ("${squash(m[0])}"): argue the material where the argument needs it`);
    }

    // Section weights. A long section is usually holding an inventory that belongs
    // distributed into the argument (style guide section 3).
    if (sections.length >= 3) {
      const lengths = sections.map((s) => s.words).sort((a, b) => a - b);
      const medianSection = lengths[Math.floor(lengths.length / 2)];
      for (const s of sections) {
        if (s.words > SECTION_WEIGHT_RATIO * medianSection) {
          push(
            "warn",
            s.at,
            `section runs ${s.words} words against a median section of ${medianSection}: it is usually holding an inventory`
          );
        }
      }
    }

    // Per-section word budget, read from plan.md. Skipped in silence where the plan
    // declares no budgets, or declares a different number of them than the piece has
    // sections, because the mapping is then unsafe to guess at.
    if (plan.budgets.length > 0 && plan.budgets.length === sections.length) {
      sections.forEach((s, i) => {
        if (s.words > SECTION_WEIGHT_RATIO * plan.budgets[i]) {
          push("warn", s.at, `section runs ${s.words} words against a declared budget of ${plan.budgets[i]}`);
        }
      });
    }


    // The thesis is a formula repeated at three anchors (style guide section 3).
    // Skipped in silence where plan.md declares none.
    if (plan.thesisFormula) {
      const anchors = countOccurrences(squash(body).toLowerCase(), plan.thesisFormula.toLowerCase());
      if (anchors !== THESIS_FORMULA_ANCHORS) {
        push(
          "warn",
          sections.length ? sections[0].at : 0,
          `thesis formula appears ${anchors} time(s), against ${THESIS_FORMULA_ANCHORS} anchors: the opening, the heading of the section that proves it, and the close`
        );
      }
    }

    // keyTakeaways carry the article's positions (content-types/blog-post.md section 6).
    const takeawayBlock = /^keyTakeaways:[ \t]*\n((?:[ \t]+.*(?:\n|$))*)/m.exec(frontmatter);
    if (takeawayBlock) {
      const takeaways = takeawayBlock[1].split("\n").filter((l) => /^[ \t]+-[ \t]/.test(l));
      const withStatistic = takeaways.filter((t) => /%|\(/.test(t)).length;
      const at = frontmatter.indexOf("keyTakeaways:") + 4;
      if (takeaways.length > KEY_TAKEAWAYS_MAX) {
        push("error", at, `${takeaways.length} keyTakeaways against a ceiling of ${KEY_TAKEAWAYS_MAX}`);
      }
      if (withStatistic > KEY_TAKEAWAYS_WITH_STATISTIC_MAX) {
        push(
          "warn",
          at,
          `${withStatistic} keyTakeaways carry a statistic or a parenthetical, against ${KEY_TAKEAWAYS_WITH_STATISTIC_MAX}: rewrite the rest as the position the research supports`
        );
      }
    }

    if (closeSection) {
      const closeText = body.slice(closeSection.start, closeSection.end);
      // Beat 3 of the close is a paragraph of bare imperatives (style guide section 3).
      const imperatives = closeText
        .split(/(?<=[.?!])\s+|\n[ \t]*\n/)
        .map((s) => s.trim())
        .filter((s) => CLOSE_IMPERATIVE.test(s)).length;
      // The reader's next move may sit in a dedicated section just before the close
      // ("Start with one recurring deliverable"), which leaves the close free to
      // synthesise. Test both, and warn only when neither carries it.
      const priorSection = sections.length > 1 ? sections[sections.length - 2] : null;
      const priorText = priorSection ? body.slice(priorSection.start, priorSection.end) : "";
      const scope = closeText + " " + priorText;
      const namesFirstStep = CLOSE_FIRST_STEP.test(scope);
      if (imperatives < CLOSE_IMPERATIVES_MIN && !namesFirstStep) {
        push("warn", closeSection.at, "the close names no first move: give the reader a run of imperatives, or name one first step");
      }
      // Where the title names something, the close says what it is and what it
      // changes (style guide section 3).
      const title = (/^title:\s*"?([^"\n]+?)"?\s*$/m.exec(frontmatter) || [])[1];
      if (title) {
        let titleForKey = title;
        const fromTo = /^\s*from\s+.+?\s+to\s+(.+)$/i.exec(title);
        if (fromTo) titleForKey = fromTo[1];
        const words = titleForKey.toLowerCase().replace(/[^a-z0-9\s']/g, " ").split(/\s+/).filter(Boolean);
        let i = 0;
        while (i < words.length && TITLE_STOPWORDS.has(words[i])) i++;
        const phrase = [];
        while (i < words.length && !TITLE_STOPWORDS.has(words[i])) phrase.push(words[i++]);
        const key = phrase.join(" ");
        const head = phrase[phrase.length - 1] || "";
        const closeLower = squash(closeText).toLowerCase();
        const discharged = (key && closeLower.includes(key)) || (head.length > 4 && closeLower.includes(head));
        if (key && !discharged) {
          push("warn", closeSection.at, `the close does not discharge the title ("${key}"): say what it is and what it changes`);
        }
      }
    }
  }

  report.sort((a, b) => a.n - b.n);
  const errors = report.filter((r) => r.level === "error");
  const warns = report.filter((r) => r.level === "warn");
  errorCount += errors.length;
  warnCount += warns.length;

  const tbd = raw.split(TBD_MARKER).length - 1;
  console.log(`\n${file}: ${errors.length} error(s), ${warns.length} warning(s), ${paraCount} paragraphs, ${oneSentenceParas} one-sentence, ${boldListBlocks} bold lead-in list(s)${tbd ? `, ${tbd} TBD marker(s) still open` : ""}`);
  if (sentenceLengths.length >= 10) {
    // Readability figures for the style guide's sentence and paragraph targets (body paragraphs only).
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const share = (a, f) => Math.round((100 * a.filter(f).length) / a.length);
    const median = [...paraLengths].sort((x, y) => x - y)[Math.floor(paraLengths.length / 2)];
    console.log(
      `  stats: mean sentence ${mean(sentenceLengths).toFixed(1)} words (target 15 to 25); ` +
        `${share(sentenceLengths, (n) => n <= 8)}% of sentences at 8 words or fewer; ` +
        `${share(sentenceLengths, (n) => n >= 40)}% at 40 or more; median paragraph ${median} words; ` +
        `${Math.round((100 * passiveSentences) / sentenceLengths.length)}% of sentences passive (ceiling about 15)`
    );
  }
  for (const r of report) {
    console.log(`  ${r.level === "error" ? "ERROR" : "warn "} L${r.n}: ${r.msg}\n         ${r.excerpt}`);
  }
}

console.log(`\nTotal: ${errorCount} error(s), ${warnCount} warning(s)`);
process.exit(errorCount > 0 || (strict && warnCount > 0) ? 1 : 0);
