// Rasterise every article SVG to PNG so the images can actually be looked at.
// Markup review does not catch overflow, collision, or a label that no longer
// matches the prose; every round of image work on this series has found a
// defect that the SVG source did not show.
//
//   node scripts/rasterize-assets.mjs [outDir] [slugFilter]
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const outDir = process.argv[2] || "review/.assets";
const filter = process.argv[3] || "";
const base = "public/articles";

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const jobs = [];
for (const slug of readdirSync(base)) {
  if (filter && !slug.includes(filter)) continue;
  if (!statSync(join(base, slug)).isDirectory()) continue;
  for (const f of readdirSync(join(base, slug))) {
    if (f.endsWith(".svg")) jobs.push([join(base, slug, f), join(outDir, `${slug}__${f.replace(/\.svg$/, ".png")}`)]);
  }
}

let ok = 0;
for (const [src, dst] of jobs) {
  try {
    const info = await sharp(src, { density: 130 }).png().toFile(dst);
    console.log(`ok   ${basename(dst).padEnd(70)} ${info.width}x${info.height}`);
    ok++;
  } catch (e) {
    console.log(`ERR  ${src}  ${e.message}`);
  }
}
console.log(`\n${ok}/${jobs.length} rasterised into ${outDir}`);
