#!/usr/bin/env node
/**
 * Process a raw walkthrough screenshot for the tour engine:
 *   1. Mask out the dev "SANDBOX" badge in the global header.
 *   2. Resize to the web target width.
 *   3. Re-encode as compressed PNG.
 *
 * Usage:
 *   node scripts/process-tour-screenshot.mjs \
 *     --source resources/walkthroughs/full-walkthrough/<section>/<file>.png \
 *     --out    public/tours/full-walkthrough/<section>/step-N-<id>.png \
 *     [--mask "x,y,w,h"]      # override default SANDBOX rect
 *     [--no-mask]              # skip masking entirely
 *     [--target-width 2400]    # default 2400
 *
 * Defaults assume a ~5120-wide retina capture. If you capture at a
 * different resolution the SANDBOX position shifts — re-measure and
 * pass --mask, or document the per-shot override in the section's
 * _guide.md.
 */
import sharp from "sharp";
import { parseArgs } from "node:util";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const { values } = parseArgs({
  options: {
    source: { type: "string", short: "s" },
    out: { type: "string", short: "o" },
    mask: { type: "string" },
    "no-mask": { type: "boolean" },
    "target-width": { type: "string", default: "2400" },
  },
});

if (!values.source || !values.out) {
  console.error(
    "Usage: process-tour-screenshot.mjs --source <in.png> --out <out.png> " +
      '[--mask "x,y,w,h"] [--no-mask] [--target-width 2400]',
  );
  process.exit(1);
}

const targetWidth = Number.parseInt(values["target-width"], 10);

// Default SANDBOX mask for a 5120-wide retina capture of the Spaarke
// dev shell. Calibrated against the matter-management workspace
// screenshot via pixel scan; per-screenshot variation in font hinting
// can push the leftmost "S" stem ~60px further left than the
// calibration row caught, so the mask is widened to absorb that.
// Header bg is solid white, so a flat fill is invisible in the result.
// If your capture resolution differs, re-measure and pass --mask.
const DEFAULT_MASK = { left: 4150, top: 0, width: 470, height: 100 };

let maskRect = null;
if (!values["no-mask"]) {
  if (values.mask) {
    const parts = values.mask.split(",").map((s) => Number.parseInt(s, 10));
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
      console.error('Invalid --mask. Expected "x,y,w,h" (integers).');
      process.exit(1);
    }
    maskRect = { left: parts[0], top: parts[1], width: parts[2], height: parts[3] };
  } else {
    maskRect = DEFAULT_MASK;
  }
}

// Disable sharp's input cache so repeat runs always read the latest source.
sharp.cache(false);

const meta = await sharp(values.source).metadata();
console.log(`Source: ${values.source}`);
console.log(`  ${meta.width}×${meta.height}, ${meta.format}, ${meta.channels}ch`);

const willResize = meta.width > targetWidth;
const scale = willResize ? targetWidth / meta.width : 1;

let pipeline = sharp(values.source);

// Resize first so composite coords land in output-image space.
if (willResize) {
  pipeline = pipeline.resize({ width: targetWidth, withoutEnlargement: true });
  console.log(`  Resize: → ${targetWidth}px wide (scale ${scale.toFixed(3)})`);
} else {
  console.log(`  Resize: skipped (source ${meta.width}px ≤ target ${targetWidth}px)`);
}

if (maskRect) {
  if (
    maskRect.left + maskRect.width > meta.width ||
    maskRect.top + maskRect.height > meta.height
  ) {
    console.warn("  WARNING: mask region (in source coords) extends past image bounds.");
  }
  // Scale source-coord mask into post-resize coords for the composite.
  const scaledMask = {
    left: Math.round(maskRect.left * scale),
    top: Math.round(maskRect.top * scale),
    width: Math.round(maskRect.width * scale),
    height: Math.round(maskRect.height * scale),
  };
  pipeline = pipeline.composite([
    {
      input: {
        create: {
          width: scaledMask.width,
          height: scaledMask.height,
          channels: 3,
          background: "#ffffff",
        },
      },
      left: scaledMask.left,
      top: scaledMask.top,
    },
  ]);
  console.log(
    `  Mask: source ${maskRect.width}×${maskRect.height} at (${maskRect.left}, ${maskRect.top}) → output ${scaledMask.width}×${scaledMask.height} at (${scaledMask.left}, ${scaledMask.top}), white fill`,
  );
} else {
  console.log("  Mask: skipped");
}

// Format inferred from output extension. WebP is the default per spec §8.1
// (≤ 250 KB target vs ≤ 400 KB for PNG); the Azure SWA Functions deploy
// bundles /public/ into the SSR package, so smaller per-file sizes matter
// for that deploy succeeding.
const outExt = values.out.split(".").pop()?.toLowerCase();
if (outExt === "webp") {
  pipeline = pipeline.webp({ quality: 80 });
} else if (outExt === "png") {
  pipeline = pipeline.png({ compressionLevel: 9, palette: false });
} else {
  console.error(`Unsupported output extension: .${outExt}. Use .webp or .png.`);
  process.exit(1);
}

await mkdir(dirname(values.out), { recursive: true });
const info = await pipeline.toFile(values.out);

console.log(`Output: ${values.out}`);
console.log(
  `  ${info.width}×${info.height}, ${(info.size / 1024).toFixed(1)} KB`,
);
