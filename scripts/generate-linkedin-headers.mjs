// Generate 1920×1080 LinkedIn header images from each article's hero.
// Per-article output: public/articles/<slug>/linkedin-1920x1080.{png|jpg}
//   SVG hero → PNG (preserves vector crispness)
//   JPG hero → JPG (matches source format)
//
// Run:  node scripts/generate-linkedin-headers.mjs

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ARTICLES_DIR = 'public/articles';
const OUTPUT_BASENAME = 'linkedin-1920x1080';
const W = 1920;
const H = 1080;
const NAVY_FALLBACK = { r: 10, g: 10, b: 14, alpha: 1 };

const slugs = fs
  .readdirSync(ARTICLES_DIR)
  .filter((d) => fs.statSync(path.join(ARTICLES_DIR, d)).isDirectory())
  .sort();

let processed = 0;
let skipped = 0;

for (const slug of slugs) {
  const dir = path.join(ARTICLES_DIR, slug);
  const svgPath = path.join(dir, 'hero.svg');
  const jpgPath = path.join(dir, 'hero.jpg');

  let source;
  let outputExt;
  let label;

  if (fs.existsSync(svgPath)) {
    source = svgPath;
    outputExt = 'png';
    label = 'SVG→PNG';
  } else if (fs.existsSync(jpgPath)) {
    source = jpgPath;
    outputExt = 'jpg';
    label = 'JPG→JPG';
  } else {
    console.log(`  SKIP    no hero in ${slug}`);
    skipped++;
    continue;
  }

  const outputPath = path.join(dir, `${OUTPUT_BASENAME}.${outputExt}`);
  const meta = await sharp(source).metadata();

  let pipeline = sharp(source).resize(W, H, {
    fit: 'cover',
    position: 'center',
    background: NAVY_FALLBACK,
  });

  if (outputExt === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
  }

  await pipeline.toFile(outputPath);
  const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
  const srcDims = meta.width && meta.height ? `${meta.width}×${meta.height}` : '(vector)';
  console.log(
    `  ${label}  src=${srcDims.padEnd(11)} → ${W}×${H}  ${sizeKb.toString().padStart(4)}KB  ${outputPath}`,
  );
  processed++;
}

console.log(`\nProcessed: ${processed}  Skipped: ${skipped}`);
