// Tile the series heroes at the size the index renders them.
//
// Full-size review lies: five heroes look varied at 1600x900 and identical as
// 128px thumbnails. The index crops square (preserveAspectRatio slice), so
// this crops square too, and puts them side by side on the index's own
// near-white card background.
//
//   node scripts/hero-contact-sheet.mjs [px] [out.png]
import sharp from "sharp";

const PX = Number(process.argv[2] || 128);
const OUT = process.argv[3] || "review/.assets/hero-contact-sheet.png";
const SLUGS = [
  "managing-legal-operations",
  "building-the-legal-operations-intelligence-platform",
  "legal-operations-ontology",
  "from-spend-analytics-to-legal-operations-intelligence",
  "knowledge-management-legal-operations-intelligence",
];

const PAD = Math.round(PX * 0.18);
const tiles = [];
for (const [i, slug] of SLUGS.entries()) {
  const buf = await sharp(`public/articles/${slug}/hero.svg`, { density: 300 })
    .resize(PX, PX, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  tiles.push({ input: buf, top: PAD, left: PAD + i * (PX + PAD) });
}

const W = PAD + SLUGS.length * (PX + PAD);
const H = PX + PAD * 2;
await sharp({ create: { width: W, height: H, channels: 3, background: "#F7F7F8" } })
  .composite(tiles)
  .png()
  .toFile(OUT);
console.log(`${SLUGS.length} heroes at ${PX}px -> ${OUT}  (${W}x${H})`);
