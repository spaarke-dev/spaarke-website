// Recolour the five Legal Operations Intelligence heroes.
//
// The first attempt gave each hero one accent on the halo and the hot element
// and held the rest of the palette constant. At the size the index actually
// renders, near 128px square, the accent is invisible and all five read as one
// dark violet block. The fix is to carry the hue through the whole
// composition: the canvas, the plane fills, the node fills and every stroke.
//
// Geometry is untouched. Only colour changes.
//
//   node scripts/recolour-series-heroes.mjs
import { readFileSync, writeFileSync } from "node:fs";

// The shared family palette every hero was built from. Each article maps the
// whole set, not just the accent.
const FAMILY = {
  planeHi:   "#4D4890",
  planeMid:  "#3D3B72",
  planeMid2: "#332E62",
  planeLow:  "#26244E",
  bgEdge:    "#161630",
  strokeStd: "#4060DC",
  strokeFoc: "#7B5BFF",
  fine:      "#A8C2FF",
};

// Per-article palettes. Hue carries the identity; value and saturation
// separate the two close pairs (blue/violet, gold/rust).
const ARTICLES = {
  "managing-legal-operations": {
    accent: "#4C63FF", hot: "#6E8CFF",
    bg: ["#1B3072", "#0F1B3C", "#06091A"],
    planeHi: "#3E62D2", planeMid: "#2E4AA8", planeMid2: "#24387F", planeLow: "#16255A",
    strokeStd: "#5A86F5", strokeFoc: "#8FAEFF", fine: "#C7DAFF",
  },
  "building-the-legal-operations-intelligence-platform": {
    accent: "#7B5BFF", hot: "#A98CFF",
    bg: ["#3B2183", "#22114E", "#0F0724"],
    planeHi: "#7250E0", planeMid: "#5A3BBC", planeMid2: "#4A2F9E", planeLow: "#301E6B",
    strokeStd: "#9468FA", strokeFoc: "#B993FF", fine: "#DCCBFF",
  },
  "legal-operations-ontology": {
    accent: "#CB9959", hot: "#F6D488",
    bg: ["#6B4D18", "#3B290E", "#160E05"],
    planeHi: "#C28F3C", planeMid: "#A2742E", planeMid2: "#855E24", planeLow: "#523816",
    strokeStd: "#E4AE4C", strokeFoc: "#F6D488", fine: "#FBEBC4",
  },
  "from-spend-analytics-to-legal-operations-intelligence": {
    accent: "#D9803A", hot: "#F58B5E",
    bg: ["#5E1A11", "#340E09", "#140503"],
    planeHi: "#B03E2C", planeMid: "#933122", planeMid2: "#78271B", planeLow: "#4A1710",
    strokeStd: "#DC5C3C", strokeFoc: "#F58B5E", fine: "#FCD0B2",
  },
  "knowledge-management-legal-operations-intelligence": {
    accent: "#FF4DCB", hot: "#FF7FDB",
    bg: ["#6B1659", "#3C0A32", "#170412"],
    planeHi: "#C1329D", planeMid: "#A22483", planeMid2: "#851B6C", planeLow: "#540F44",
    strokeStd: "#E948B8", strokeFoc: "#FF7FDB", fine: "#FFCFEF",
  },
};

const rx = (hex) => new RegExp(hex, "gi");

for (const [slug, p] of Object.entries(ARTICLES)) {
  const path = `public/articles/${slug}/hero.svg`;
  let svg = readFileSync(path, "utf8");

  // The canvas. The centre and mid stops are unique per file, so pull them
  // out of the bg gradient rather than guessing at their values.
  const bg = svg.match(/<radialGradient id="bg"[\s\S]*?<\/radialGradient>/);
  if (!bg) { console.log(`ERR  ${slug}  no bg gradient`); continue; }
  const stops = [...bg[0].matchAll(/stop-color="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
  if (stops.length !== 3) { console.log(`ERR  ${slug}  ${stops.length} bg stops`); continue; }
  let newBg = bg[0];
  stops.forEach((old, i) => { newBg = newBg.replace(`stop-color="${old}"`, `stop-color="${p.bg[i]}"`); });
  svg = svg.replace(bg[0], newBg);

  // Everything else. Order matters: map the family before the accent, since a
  // hero may use an accent that is another article's family colour.
  const map = [
    [FAMILY.planeHi,   p.planeHi],
    [FAMILY.planeMid,  p.planeMid],
    [FAMILY.planeMid2, p.planeMid2],
    [FAMILY.planeLow,  p.planeLow],
    [FAMILY.strokeStd, p.strokeStd],
    [FAMILY.strokeFoc, p.strokeFoc],
    [FAMILY.fine,      p.fine],
    [p.accent,         p.hot],
  ];
  for (const [from, to] of map) svg = svg.replace(rx(from), to);

  writeFileSync(path, svg);
  const left = [...svg.matchAll(/#[0-9A-Fa-f]{6}/g)].map((m) => m[0].toUpperCase());
  console.log(`ok   ${slug.padEnd(56)} ${new Set(left).size} colours`);
}
