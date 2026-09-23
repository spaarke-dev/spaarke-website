// Build the Sources block for an article from the research library.
//
// Every figure in the finished articles traces to a record in findings.json,
// which carries the claim, the publisher, the title and the URL. This assembles
// the foot-of-article source list from those records rather than by hand, so a
// link can never drift from the claim it supports.
//
//   node scripts/build-sources.mjs <article-slug> [--write]
import fs from "node:fs";

const FINDINGS = "content-platform/research/2026-09-loi-series/findings.json";
const slug = process.argv[2];
const write = process.argv.includes("--write");
if (!slug) { console.error("usage: node scripts/build-sources.mjs <article-slug> [--write]"); process.exit(1); }

const draftPath = `content-platform/articles/${slug}/draft.mdx`;
const raw = fs.readFileSync(draftPath, "utf8");
const body = raw.replace(/^---[\s\S]*?\n---\n/, "");

const j = JSON.parse(fs.readFileSync(FINDINGS, "utf8"));
const recs = [];
for (const v of Object.values(j)) for (const f of (v && v.findings) || []) {
  if (f && /^https?:/.test(f.source_url || "")) recs.push(f);
}

// A record matches when a distinctive figure from its claim appears in the
// article AND the article names its publisher. Both conditions, because a bare
// number collides across sources.
const figuresOf = (s) => [...String(s).matchAll(/\d[\d,.]*\s?(?:%|billion|million)/g)].map(m => m[0].replace(/[\s,]/g, ""));
const norm = (s) => String(s).toLowerCase();
const bodyNorm = norm(body).replace(/\\$/g, "$").replace(/[\s,]/g, "");
const bodyWords = norm(body);

const hits = new Map(); // url -> {title, publisher, at}
for (const r of recs) {
  const pub = (r.publisher || "").split(/[,(]/)[0].trim();
  const pubKey = norm(pub).replace(/\b(the|institute|inc\.?|llp|group|law)\b/g, "").trim().split(/\s+/)[0];
  if (!pubKey || pubKey.length < 3) continue;
  if (!bodyWords.includes(pubKey)) continue;
  const figs = [...new Set([...figuresOf(r.claim), ...figuresOf(r.detail), ...figuresOf(r.exact_quote)])];
  const matched = figs.filter(f => bodyNorm.includes(norm(f)));
  if (!matched.length) continue;
  const at = bodyWords.indexOf(pubKey);
  const prev = hits.get(r.source_url);
  if (!prev || at < prev.at) hits.set(r.source_url, { title: r.source_title || "", publisher: pub, at, date: r.source_date || "" });
}

const list = [...hits.entries()].sort((a, b) => a[1].at - b[1].at);
const lines = list.map(([url, m]) => {
  const label = m.title && !norm(m.title).startsWith(norm(m.publisher).slice(0, 6))
    ? `${m.publisher}, ${m.title}` : (m.title || m.publisher);
  return `- [${label.replace(/\s+/g, " ").trim()}](${url})`;
});

const block = `**Sources**\n\n${lines.join("\n")}\n`;
console.log(`${slug}: ${lines.length} distinct sources\n`);
console.log(block);

if (write) {
  if (raw.includes("**Sources**")) { console.error("A Sources block already exists; not writing."); process.exit(1); }
  const anchor = "**Related reading:**";
  if (!raw.includes(anchor)) { console.error("No Related reading anchor found."); process.exit(1); }
  fs.writeFileSync(draftPath, raw.replace(anchor, block + "\n" + anchor), "utf8");
  console.error("written to " + draftPath);
}
