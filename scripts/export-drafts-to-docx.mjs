// Export the series drafts to .docx for review in Word, with the hero and the
// exhibits embedded as images. Word is the review surface: track changes and
// comments survive the round trip, and the marked-up file reads straight back.
//
//   node scripts/export-drafts-to-docx.mjs
//
// Output: review/<n>-<slug>.docx  (the review folder is git ignored)
// Requires pandoc on PATH and sharp from the project's dependencies.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import sharp from "sharp";

const A = "content-platform/articles/";
const REVIEW = "review";
const TMP = "review/.assets";

const SLUGS = [
  "managing-legal-operations",
  "building-the-legal-operations-intelligence-platform",
  "legal-operations-ontology",
  "from-spend-analytics-to-legal-operations-intelligence",
  "knowledge-management-legal-operations-intelligence",
];

mkdirSync(REVIEW, { recursive: true });
mkdirSync(TMP, { recursive: true });

// Word will not place an SVG, so each figure is rasterised once at print width.
async function png(svgPath, outPath, width) {
  await sharp(Buffer.from(readFileSync(svgPath))).resize(width).png().toFile(outPath);
  return outPath;
}

let n = 0;
for (const slug of SLUGS) {
  n++;
  const { data, content } = matter(readFileSync(A + slug + "/draft.mdx", "utf8"));
  const words = content.split(/\s+/).filter(Boolean).length;

  const heroSrc = `public/articles/${slug}/hero.svg`;
  const heroPng = await png(heroSrc, `${TMP}/${slug}-hero.png`, 1400);

  let body = content;

  // Drop the JSX comment placeholder, which is not prose.
  body = body.replace(/\{\/\*[\s\S]*?\*\/\}\s*/g, "");

  // Replace each figure with an image Word can show, plus its caption.
  const figRe = /<figure>\s*<img src="([^"]+)" alt="([^"]*)" \/>\s*<figcaption>([\s\S]*?)<\/figcaption>\s*<\/figure>/g;
  const figs = [...body.matchAll(figRe)];
  for (const f of figs) {
    const [whole, src, , cap] = f;
    const rel = src.replace(/^\//, "public/");
    const outName = `${TMP}/${src.split("/").slice(-2).join("-").replace(".svg", "")}.png`;
    await png(rel, outName, 1500);
    const abs = outName.replace(/\\/g, "/");
    body = body.replace(
      whole,
      `\n![${cap.trim()}](${abs})\n\n*${cap.trim()}*\n`
    );
  }

  const takeaways = (data.keyTakeaways || [])
    .map((t) => `- ${t}`)
    .join("\n");

  const md = `---
title: "${String(data.title).replace(/"/g, "'")}"
---

# ${data.title}

*Article ${n} of 5, Legal Operations Intelligence series. Display date ${data.date}. About ${words.toLocaleString()} words.*

*This file is for review. Use Word's track changes and comments; the marked-up file reads straight back into the draft. The source of truth stays \`content-platform/articles/${slug}/draft.mdx\`.*

![Hero](${heroPng.replace(/\\/g, "/")})

**Description (search result, ${String(data.description).length} characters):** ${data.description}

**Summary (article card):** ${data.summary}

**Key takeaways**

${takeaways}

---

${body.trim()}
`;

  const mdPath = `${TMP}/${slug}.md`;
  writeFileSync(mdPath, md);

  const docx = `${REVIEW}/${n}-${slug}.docx`;
  execFileSync(
    "pandoc",
    [mdPath, "-f", "markdown+raw_html", "-o", docx, "--standalone", "--toc", "--toc-depth=2"],
    { stdio: "pipe" }
  );
  console.log(`${docx}  (${words.toLocaleString()} words, ${figs.length} exhibit${figs.length === 1 ? "" : "s"})`);
}

rmSync(`${TMP}`, { recursive: true, force: true });
console.log(`\nOpen the files in ${REVIEW}/ in Word. Track changes and comments both round trip.`);
