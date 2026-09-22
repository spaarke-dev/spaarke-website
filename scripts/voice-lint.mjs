// Voice lint for Spaarke content drafts. Enforces the hard punctuation
// rule in content-platform/voice/style-guide.md (no em dashes or dash
// substitutes) and flags the words and constructions listed in
// content-platform/voice/examples/ai-tells.md. Errors exit 1; warnings
// do not, unless --strict is passed. The construction checks are
// partial: a clean run does not replace the ai-tells.md checklist.
// Run from repo root: `node scripts/voice-lint.mjs <file> [<file>...] [--strict]`.

import { readFileSync } from "node:fs";

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
  "foster", "fosters", "fostering", "leverage", "leverages", "leveraging",
  "seamless", "seamlessly", "robust", "unlock", "unlocks", "unleash", "harness",
  "empower", "empowers", "empowering", "transform", "transforms", "transformative",
  "transformation", "revolutionize", "revolutionary", "game-changing", "game-changer",
  "cutting-edge", "best-in-class", "world-class", "innovative", "holistic", "synergy",
  "ecosystem", "journey", "navigate", "navigating", "elevate", "elevates", "supercharge",
  "streamline", "streamlines", "ever-evolving", "fast-paced", "myriad", "plethora",
  "multifaceted", "nuanced", "intricate", "vibrant", "boasts", "showcasing", "groundbreaking",
];

const PHRASES = [
  { re: /\bin today's\b/gi, msg: "stock opener (\"in today's ...\")" },
  { re: /\bit(?:'s| is) (?:important|worth) (?:to note|noting)\b/gi, msg: "filler hedge" },
  { re: /\bhere(?:'s| is) the (?:thing|catch|kicker|reality|truth)\b/gi, msg: "signposting" },
  { re: /\b(?:let's|let us) (?:dive|dig|explore|unpack|take a look)\b/gi, msg: "signposting" },
  { re: /\bthe (?:result|upshot|catch|takeaway|bottom line|answer|reality|truth)\s*[?:]/gi, msg: "colon or question reveal" },
  { re: /\bnot (?:just|only|merely|simply)\b[^.?!\n]{0,120}\b(?:but|it is|it's|they are)\b/gi, msg: "\"not just X but Y\" construction: state the point directly" },
  { re: /\b(?:is|are|was|were|isn't|aren't) not? ?(?:about |a |an |the )?[^.?!\n]{1,70}[.;]\s+(?:it|they|this|that) (?:is|are|was|were)\b/gi, msg: "negation-then-correction (\"It is not X. It is Y.\"): state what it is" },
  { re: /\bhere(?:'s| is) (?:why|how|what)\b/gi, msg: "signposting" },
  { re: /\bnot because\b[^.?!\n]{1,90}[.,;]\s*(?:but )?because\b/gi, msg: "\"not because X, but because Y\": give the reason directly" },
  { re: /\b(?:stands|serves) as a (?:testament|reminder)\b/gi, msg: "inflated significance" },
  { re: /\bplays? a (?:key|crucial|vital|pivotal|significant) role\b/gi, msg: "inflated significance" },
  { re: /\bat the end of the day\b|\bwhen it comes to\b|\bthe fact of the matter\b/gi, msg: "filler phrase" },
  { re: /\bin (?:conclusion|summary)\b|\bto sum up\b|\bultimately,/gi, msg: "summary closer: end on substance, not a recap" },
  { re: /\bmore than ever\b|\bnow more than ever\b/gi, msg: "stock intensifier" },
  { re: /,\s(?:highlighting|underscoring|emphasizing|showcasing|reflecting|signaling|demonstrating)\s/gi, msg: "present-participle tail: make it a sentence with a subject" },
];

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

let errorCount = 0;
let warnCount = 0;

for (const file of files) {
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const text = stripNonProse(raw);
  const lines = raw.split("\n");
  const report = [];

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
  const paras = [];
  let cursor = 0;
  for (const m of body.matchAll(/\n[ \t]*\n/g)) {
    paras.push({ at: cursor, para: body.slice(cursor, m.index) });
    cursor = m.index + m[0].length;
  }
  paras.push({ at: cursor, para: body.slice(cursor) });

  let oneSentenceParas = 0;
  let paraCount = 0;
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
    // A short lead-in that ends with a colon introduces a list; it is not a dramatic one-liner.
    if (sentences.length === 1 && p.split(/\s+/).length <= 12 && !p.endsWith(":")) {
      oneSentenceParas++;
      push("warn", start, "one-sentence paragraph used for effect: fold it into the paragraph it belongs to");
    }
    const last = sentences.slice(-2);
    if (last.length === 2 && last.every((s) => s.split(/\s+/).length <= 7)) {
      push("warn", start + Math.max(0, p.lastIndexOf(last[0])), "paragraph ends on two clipped sentences (aphoristic landing): finish with a complete thought");
    }
    if (/\?\s+[A-Z]/.test(p) && /\?/.test(sentences[0] || "")) {
      push("warn", start, "paragraph opens with a question and then answers it: make the claim instead");
    }
  }

  report.sort((a, b) => a.n - b.n);
  const errors = report.filter((r) => r.level === "error");
  const warns = report.filter((r) => r.level === "warn");
  errorCount += errors.length;
  warnCount += warns.length;

  const tbd = raw.split(TBD_MARKER).length - 1;
  console.log(`\n${file}: ${errors.length} error(s), ${warns.length} warning(s), ${paraCount} paragraphs, ${oneSentenceParas} one-sentence${tbd ? `, ${tbd} TBD marker(s) still open` : ""}`);
  if (sentenceLengths.length >= 10) {
    // Readability figures for the style guide's sentence and paragraph targets (body paragraphs only).
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const share = (a, f) => Math.round((100 * a.filter(f).length) / a.length);
    const median = [...paraLengths].sort((x, y) => x - y)[Math.floor(paraLengths.length / 2)];
    console.log(
      `  stats: mean sentence ${mean(sentenceLengths).toFixed(1)} words (target 15 to 25); ` +
        `${share(sentenceLengths, (n) => n <= 8)}% of sentences at 8 words or fewer; ` +
        `${share(sentenceLengths, (n) => n >= 40)}% at 40 or more; median paragraph ${median} words`
    );
  }
  for (const r of report) {
    console.log(`  ${r.level === "error" ? "ERROR" : "warn "} L${r.n}: ${r.msg}\n         ${r.excerpt}`);
  }
}

console.log(`\nTotal: ${errorCount} error(s), ${warnCount} warning(s)`);
process.exit(errorCount > 0 || (strict && warnCount > 0) ? 1 : 0);
