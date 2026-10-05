// Hero and exhibit for "The Spaarke Method" series.
// Palette: content-platform/voice/visual-identity.md, section "Series hue family:
// teal and coral" (the writer approved the new scheme on 2026-10-05).
// Concept and exhibit title come from content-platform/articles/the-spaarke-method/plan.md.
// No em dash anywhere in the output.
//
//   node scripts/generate-method-series-assets.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const DIR = "public/articles/the-spaarke-method/";
mkdirSync(DIR, { recursive: true });

const FONT = "system-ui, -apple-system, 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ------------------------------------------------------------------ hero
function hero() {
  const cx = 800;
  const cy = 450;
  const R = 270;
  const pts = [0, 1, 2, 3, 4].map((i) => {
    const a = ((-90 + 72 * i) * Math.PI) / 180;
    return { x: +(cx + R * Math.cos(a)).toFixed(1), y: +(cy + R * Math.sin(a)).toFixed(1) };
  });
  const nodes = pts
    .map((p, i) => {
      if (i === 0) {
        return `
    <circle cx="${p.x}" cy="${p.y}" r="96" fill="url(#coralHalo)"/>
    <circle cx="${p.x}" cy="${p.y}" r="50" fill="url(#coral)" stroke="#FFD9CC" stroke-width="2.4"/>
    <circle cx="${p.x}" cy="${p.y}" r="18" fill="#FFF1EB" opacity="0.9"/>`;
      }
      return `
    <circle cx="${p.x}" cy="${p.y}" r="40" fill="url(#tealNode)" stroke="#B5F2DC" stroke-width="2"/>
    <circle cx="${p.x}" cy="${p.y}" r="13" fill="#B5F2DC" opacity="0.85"/>`;
    })
    .join("");
  // satellite dots, small and quiet
  const dots = [
    [330, 220], [420, 700], [1250, 180], [1330, 640], [1180, 760], [260, 520], [1410, 400], [610, 120],
  ]
    .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 5 : 3.5}" fill="#B5F2DC" opacity="${i % 2 ? 0.45 : 0.7}"/>`)
    .join("\n    ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="hero-title hero-desc">
  <title id="hero-title">The Spaarke Method: Envision, Design, Build, Deploy, and Manage</title>
  <desc id="hero-desc">A loop of five connected nodes in shades of teal on a deep teal field, the first node larger and coral, joined by a pale mint line that closes on itself, suggesting five phases that return to the first decision.</desc>

  <defs>
    <radialGradient id="bg" cx="50%" cy="52%" r="82%">
      <stop offset="0%" stop-color="#0F3B3A"/>
      <stop offset="52%" stop-color="#0A2A2C"/>
      <stop offset="100%" stop-color="#06181B"/>
    </radialGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3FE0B5" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="#3FE0B5" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#3FE0B5" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="tealNode" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3FB59A"/>
      <stop offset="100%" stop-color="#1E6F66"/>
    </linearGradient>
    <radialGradient id="coralHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF7A59" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#FF7A59" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FF7A59" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="coral" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FF9A7E"/>
      <stop offset="100%" stop-color="#FF7A59"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy}" r="420" fill="url(#halo)"/>
  <g>
    ${dots}
  </g>
  <circle cx="${cx}" cy="${cy}" r="${R + 78}" fill="none" stroke="#2B8F7F" stroke-width="1.4" opacity="0.5"/>
  <circle cx="${cx}" cy="${cy}" r="${R - 78}" fill="none" stroke="#2B8F7F" stroke-width="1.4" opacity="0.5"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#B5F2DC" stroke-width="2.4" opacity="0.85"/>
  <g>${nodes}
  </g>
</svg>
`;
}

// --------------------------------------------------------------- exhibit
function exhibit() {
  const W = 1240;
  const H = 600;
  const C = {
    panel: "#0B2B2D",
    panelEdge: "#1E6F66",
    box: "#14504B",
    boxEdge: "#3FB59A",
    coral: "#FF7A59",
    text: "#E6FBF4",
    dim: "#9CD9C6",
    line: "#B5F2DC",
    band: "#0F3B3A",
  };
  const phases = [
    ["Envision", ["A chosen first decision,", "a named owner,", "and a baseline"]],
    ["Design", ["A written model of the", "decision, with signed", "definitions"]],
    ["Build", ["A working model,", "tested on real data", "by its users"]],
    ["Deploy", ["The decision made in", "live work, and", "recorded"]],
    ["Manage", ["A measured result,", "and the next", "decision"]],
  ];
  const bw = 200;
  const gap = 40;
  const x0 = 40;
  const by = 170;
  const bh = 90;
  const parts = phases
    .map(([name, lines], i) => {
      const x = x0 + i * (bw + gap);
      const first = i === 0;
      const box = `<rect x="${x}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="${C.box}" stroke="${first ? C.coral : C.boxEdge}" stroke-width="${first ? 2.6 : 1.8}"/>
    <text x="${x + bw / 2}" y="${by + 54}" text-anchor="middle" font-size="26" font-weight="700" fill="${C.text}">${name}</text>`;
      const label = `<text x="${x + bw / 2}" y="${by + bh + 34}" text-anchor="middle" font-size="14" fill="${C.dim}">Ends with</text>` +
        lines
          .map((l, k) => `<text x="${x + bw / 2}" y="${by + bh + 62 + k * 24}" text-anchor="middle" font-size="17" fill="${C.text}">${esc(l)}</text>`)
          .join("");
      const arrow = i < 4
        ? `<line x1="${x + bw + 4}" y1="${by + bh / 2}" x2="${x + bw + gap - 6}" y2="${by + bh / 2}" stroke="${C.line}" stroke-width="2.2" marker-end="url(#arrow)"/>`
        : "";
      return `${box}\n    ${label}\n    ${arrow}`;
    })
    .join("\n    ");
  const lastX = x0 + 4 * (bw + gap) + bw / 2;
  const firstX = x0 + bw / 2;
  const ret = `<path d="M ${lastX} ${by - 4} L ${lastX} 124 L ${firstX} 124 L ${firstX} ${by - 10}" fill="none" stroke="${C.coral}" stroke-width="2.4" marker-end="url(#arrowHot)"/>
    <text x="${(lastX + firstX) / 2}" y="112" text-anchor="middle" font-size="16" fill="${C.coral}" font-weight="600">The next decision begins the next cycle</text>`;
  const bandY = 440;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="ex-title ex-desc" font-family="${FONT}">
  <title id="ex-title">Each phase ends with something the organization can inspect, and the last phase begins the next cycle</title>
  <desc id="ex-desc">A loop of five phases: envision ends with a chosen first decision, a named owner, and a baseline; design with a written model of the decision and signed definitions; build with a working model tested on real data by its users; deploy with the decision made in live work and recorded; and manage with a measured result and the next decision, which begins the next cycle at envision. A band beneath all five phases reads that practitioners and end users take part in every phase, with forward-deployed legal engineers working alongside them from the first day.</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.line}"/>
    </marker>
    <marker id="arrowHot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.coral}"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="${C.panel}" stroke="${C.panelEdge}" stroke-width="2"/>
  <text x="${W / 2}" y="44" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">Each phase ends with something the organization can inspect,</text>
  <text x="${W / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">and the last phase begins the next cycle.</text>
    ${ret}
    ${parts}
  <rect x="40" y="${bandY}" width="${W - 80}" height="100" rx="12" fill="${C.band}" stroke="${C.boxEdge}" stroke-width="1.6" stroke-dasharray="8 7"/>
  <text x="${W / 2}" y="${bandY + 44}" text-anchor="middle" font-size="21" font-weight="600" fill="${C.text}">Practitioners and end users take part in every phase</text>
  <text x="${W / 2}" y="${bandY + 74}" text-anchor="middle" font-size="17" fill="${C.dim}">Forward-deployed legal engineers work alongside them from the first day</text>
</svg>
`;
}

writeFileSync(DIR + "hero.svg", hero());
writeFileSync(DIR + "exhibit-1.svg", exhibit());
console.log("wrote", DIR + "hero.svg", DIR + "exhibit-1.svg");
