// Extract embedded base64 images from SVG files in /public/brand/diagrams/
// and rewrite the SVGs to reference the extracted files. Slims 1.2 MB
// SVGs down to ~5–20 KB each and lets browsers cache the images
// independently. Run from repo root: `node scripts/slim-svgs.mjs`.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const DIAGRAM_DIR = "public/brand/diagrams";
const IMG_DIR = `${DIAGRAM_DIR}/_extracted`;

// Only slim the diagrams we actually render.
const TARGETS = [
  "architecture-customer-hosted.svg",
  "architecture-spaarke-hosted.svg",
  "microsoft-connect-v2-light.svg",
  "platform-arch-v3-dark.svg",
  "spaarke-ai-architecture.svg",
];

mkdirSync(IMG_DIR, { recursive: true });

const dataUriRe =
  /data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([A-Za-z0-9+/=]+)/g;

const extToMime = {
  png: "png",
  jpg: "jpg",
  jpeg: "jpg",
  gif: "gif",
  webp: "webp",
  "svg+xml": "svg",
};

let totalBefore = 0;
let totalAfter = 0;
const dedupe = new Map(); // hash -> filename

for (const file of TARGETS) {
  const path = join(DIAGRAM_DIR, file);
  const before = readFileSync(path, "utf8");
  totalBefore += Buffer.byteLength(before);

  let count = 0;
  const after = before.replace(dataUriRe, (_match, mime, b64) => {
    const ext = extToMime[mime] ?? mime.replace(/[^a-z]/g, "");
    const hash = createHash("sha1").update(b64).digest("hex").slice(0, 12);
    const name = `img-${hash}.${ext}`;
    if (!dedupe.has(hash)) {
      const buf = Buffer.from(b64, "base64");
      writeFileSync(join(IMG_DIR, name), buf);
      dedupe.set(hash, name);
    }
    count++;
    return `/brand/diagrams/_extracted/${dedupe.get(hash)}`;
  });

  writeFileSync(path, after, "utf8");
  totalAfter += Buffer.byteLength(after);
  console.log(
    `${file}: extracted ${count} images, ${Buffer.byteLength(before)} → ${Buffer.byteLength(after)} bytes`,
  );
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024).toFixed(0)} KB across ${TARGETS.length} SVGs`,
);
console.log(`Unique extracted assets: ${dedupe.size} in ${IMG_DIR}/`);
