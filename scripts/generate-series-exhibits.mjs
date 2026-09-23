// Exhibits for the Legal Operations Intelligence series.
// Palette: content-platform/voice/visual-identity.md section 3.
// Each exhibit's concept and title sentence come from the article's plan.md.
// The article body is dark by default, so each exhibit draws its own panel and
// reads as a figure on that canvas. No em dash anywhere in the output.
import { writeFileSync, mkdirSync } from "node:fs";

const A = "public/articles/";

const C = {
  panel: "#13132B",
  panelEdge: "#2A2A52",
  box: "#262450",
  boxEdge: "#4060DC",
  focal: "#3A3576",
  focalEdge: "#7B5BFF",
  hot: "#4C63FF",
  text: "#E8ECFF",
  dim: "#A8B4D8",
  thread: "#A8C2FF",
};

const FONT =
  "system-ui, -apple-system, 'Segoe UI', Inter, Helvetica, Arial, sans-serif";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg({ w, h, title, desc, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="ex-title ex-desc" font-family="${FONT}">
  <title id="ex-title">${esc(title)}</title>
  <desc id="ex-desc">${esc(desc)}</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.thread}"/>
    </marker>
    <marker id="arrowHot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.hot}"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="14" fill="${C.panel}" stroke="${C.panelEdge}" stroke-width="2"/>
${body}
</svg>
`;
}

// Rough advance width for this font stack, used to keep a label inside its box.
const WIDTH_PER_PX = 0.53;
const fits = (s, size, max) => s.length * size * WIDTH_PER_PX <= max;
// Shrink a line until it fits, rather than letting it overhang the box edge.
function autofit(s, size, max, floor = 12) {
  let f = size;
  while (f > floor && !fits(s, f, max)) f -= 0.5;
  return f;
}

// A rounded box with centred label lines, each fitted to the box width.
function box(x, y, w, h, lines, opts = {}) {
  const fill = opts.focal ? C.focal : C.box;
  const edge = opts.focal ? C.focalEdge : opts.edge || C.boxEdge;
  const size = opts.size || 19;
  const arr = Array.isArray(lines) ? lines : [lines];
  const inner = w - 22;
  const sizes = arr.map((l, i) => autofit(l, i === 0 ? size : size - 2, inner));
  const lh = size + 6;
  const startY = y + h / 2 - ((arr.length - 1) * lh) / 2 + size / 3;
  const text = arr
    .map(
      (l, i) =>
        `    <text x="${x + w / 2}" y="${startY + i * lh}" text-anchor="middle" font-size="${sizes[i]}" fill="${i === 0 ? C.text : C.dim}" font-weight="${i === 0 ? 500 : 400}">${esc(l)}</text>`
    )
    .join("\n");
  return `    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${fill}" stroke="${edge}" stroke-width="${opts.focal ? 2.4 : 1.8}"/>
${text}`;
}

const arrow = (x1, y1, x2, y2, hot = false) =>
  `    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${hot ? C.hot : C.thread}" stroke-width="${hot ? 2.4 : 1.7}" opacity="0.9" marker-end="url(#${hot ? "arrowHot" : "arrow"})"/>`;

const path = (d, hot = false, dashed = false) =>
  `    <path d="${d}" fill="none" stroke="${hot ? C.hot : C.thread}" stroke-width="${hot ? 2.4 : 1.7}" opacity="0.9"${dashed ? ' stroke-dasharray="7 6"' : ""} marker-end="url(#${hot ? "arrowHot" : "arrow"})"/>`;

const label = (x, y, s, opts = {}) =>
  `    <text x="${x}" y="${y}" text-anchor="${opts.anchor || "start"}" font-size="${opts.size || 17}" fill="${opts.fill || C.dim}" font-weight="${opts.weight || 400}"${opts.italic ? ' font-style="italic"' : ""}>${esc(s)}</text>`;

const caption = (w, s) =>
  `    <text x="${w / 2}" y="44" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">${esc(s)}</text>`;

const out = {};

/* ============================================ article 1, exhibit 1 */
{
  const w = 1240, h = 720;
  const channels = [
    ["Business self-service", "inside guardrails"],
    ["Automated or AI-assisted", "workflow"],
    ["In-house lawyer"],
    ["Outside counsel"],
    ["Alternative provider"],
  ];
  const bx = 760, bw = 400, bh = 64;
  const ys = channels.map((_, i) => 116 + i * 80);
  const doorY = 252;
  out["managing-legal-operations/exhibit-1.svg"] = svg({
    w, h,
    title: "Where legal work gets done",
    desc: "A request enters through the legal front door and is routed to one of five channels: business self-service inside guardrails, an automated or AI-assisted workflow, an in-house lawyer, outside counsel, or an alternative provider. Legal operations holds the routing rules and the risk thresholds, and the data returned from every channel comes back to it.",
    body: [
      caption(w, "Legal operations owns the routing rules, the risk thresholds,"),
      `    <text x="${w / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">and the data that returns from every channel.</text>`,
      // The dashed region is what legal operations owns: the door, the rules, and the data that comes back.
      `    <rect x="214" y="110" width="472" height="510" rx="12" fill="none" stroke="${C.focalEdge}" stroke-width="1.8" stroke-dasharray="8 7"/>`,
      label(450, 146, "Legal operations", { anchor: "middle", fill: C.text, weight: 600, size: 19 }),
      label(450, 170, "routing rules and risk thresholds", { anchor: "middle", size: 16 }),
      box(52, 252, 136, 64, ["Request"], { size: 18 }),
      arrow(192, 284, 242, 284),
      box(250, doorY - 16, 260, 96, ["Legal front door", "intake and triage"], { focal: true }),
      ...channels.map((c, i) => box(bx, ys[i], bw, bh, c, { size: 18 })),
      ...ys.map((y) =>
        path(`M 516 ${doorY + 32} C 620 ${doorY + 32}, 640 ${y + bh / 2}, ${bx - 8} ${y + bh / 2}`)
      ),
      box(250, 470, 400, 96, ["Data returned from every channel", "demand, cost, turnaround, outcome"], { size: 18 }),
      // A collector down the right of the stack, with a stub from each channel,
      // so the return reads as coming from all five and not from the last one.
      ...ys.map(
        (y) =>
          `    <line x1="${bx + bw}" y1="${y + bh / 2}" x2="1192" y2="${y + bh / 2}" stroke="${C.thread}" stroke-width="1.5" opacity="0.75" stroke-dasharray="7 6"/>`
      ),
      `    <line x1="1192" y1="${ys[0] + bh / 2}" x2="1192" y2="${ys[4] + bh / 2}" stroke="${C.thread}" stroke-width="1.7" opacity="0.8" stroke-dasharray="7 6"/>`,
      path(`M 1192 ${ys[4] + bh / 2} L 1192 640 L 450 640 L 450 574`, false, true),
      label(700, 688, "Every channel returns data to the function that routed the work.", { anchor: "middle", size: 15, italic: true }),
    ].join("\n"),
  });
}

/* ============================================ article 1, exhibit 2 */
{
  const w = 1240, h = 520;
  const mid = 620, line = 250;
  const pro = [["Spend trend"], ["Capacity gap"], ["Recurring risk"]];
  const re = [["Subpoena"], ["Budget overrun"], ["Sudden departure"]];
  // The six signals the article names, shown as one band serving both sides,
  // because the text's point is that the same information does both jobs.
  const signals = [
    "Business impact", "Risk level", "Cost",
    "Timing", "Required skills", "Resource availability",
  ];
  const sw = 190, sgap = 6, sy = line + 122;
  const stotal = signals.length * sw + (signals.length - 1) * sgap;
  const sx0 = (w - stotal) / 2;
  out["managing-legal-operations/exhibit-2.svg"] = svg({
    w, h,
    title: "The readiness timeline",
    desc: "A timeline with proactive readiness before the event and reactive readiness after it, and beneath both a single band naming the six signals that serve each: business impact, risk level, cost, timing, required skills, and resource availability.",
    body: [
      caption(w, "The same six signals serve proactive readiness before an event"),
      `    <text x="${w / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">and reactive readiness after it.</text>`,
      `    <line x1="70" y1="${line}" x2="1170" y2="${line}" stroke="${C.thread}" stroke-width="2" opacity="0.55"/>`,
      `    <polygon points="${mid},${line - 30} ${mid + 26},${line} ${mid},${line + 30} ${mid - 26},${line}" fill="${C.hot}"/>`,
      // One label row: each word centred over what it names, the event over the
      // diamond and the two states over their own boxes.
      label(324, 128, "Proactive", { anchor: "middle", fill: C.text, weight: 600, size: 20 }),
      label(mid, 128, "The event", { anchor: "middle", fill: C.text, weight: 600, size: 20 }),
      label(944, 128, "Reactive", { anchor: "middle", fill: C.text, weight: 600, size: 20 }),
      ...pro.map((t, i) => box(80 + i * 168, line - 96, 152, 56, t, { size: 17 })),
      ...re.map((t, i) => box(700 + i * 168, line - 96, 152, 56, t, { size: 17 })),
      ...pro.map((_, i) => `    <line x1="${156 + i * 168}" y1="${line - 40}" x2="${156 + i * 168}" y2="${line - 10}" stroke="${C.thread}" stroke-width="1.6" opacity="0.8"/>`),
      ...re.map((_, i) => `    <line x1="${776 + i * 168}" y1="${line - 40}" x2="${776 + i * 168}" y2="${line - 10}" stroke="${C.thread}" stroke-width="1.6" opacity="0.8"/>`),
      // Both sides draw on one band of signals, drawn once and shared.
      `    <path d="M 324 ${line + 34} L 324 ${line + 62} L ${mid} ${line + 62} L 944 ${line + 62} L 944 ${line + 34}" fill="none" stroke="${C.thread}" stroke-width="1.6" opacity="0.7"/>`,
      // The bracket alone carries the connection; a vertical arrow here struck
      // through the label that explains it.
      label(mid, line + 98, "Both are read from the same six signals", { anchor: "middle", fill: C.text, weight: 600, size: 19 }),
      ...signals.map((s, i) =>
        box(sx0 + i * (sw + sgap), sy, sw, 62, [s], { size: 16, focal: false })
      ),
    ].join("\n"),
  });
}

/* ============================================ article 2, exhibit 1 */
{
  const w = 1240, h = 660;
  out["building-the-legal-operations-intelligence-platform/exhibit-1.svg"] = svg({
    w, h,
    title: "Legal within the corporate structure",
    desc: "A legal department inside the corporate structure, with strategic and tactical input flowing out to the board and the business units, requests and data flowing in, and the department's process, people, and technology shown inside the legal box.",
    body: [
      caption(w, "Legal sits inside the corporate structure and supplies strategic"),
      `    <text x="${w / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">and tactical input to it.</text>`,
      `    <rect x="48" y="104" width="1144" height="506" rx="14" fill="none" stroke="${C.panelEdge}" stroke-width="2"/>`,
      label(72, 136, "The company", { fill: C.text, weight: 600, size: 18 }),
      box(96, 168, 210, 62, ["Board"], { size: 18 }),
      box(96, 250, 210, 62, ["CEO"], { size: 18 }),
      box(96, 332, 210, 62, ["Business units"], { size: 18 }),
      box(96, 414, 210, 62, ["Finance"], { size: 18 }),
      box(96, 496, 210, 62, ["IT"], { size: 18 }),
      `    <rect x="742" y="188" width="392" height="346" rx="11" fill="${C.focal}" stroke="${C.focalEdge}" stroke-width="2.4"/>`,
      label(938, 226, "Legal department", { anchor: "middle", fill: C.text, weight: 600, size: 20 }),
      box(776, 256, 324, 60, ["Process"], { size: 18, edge: C.focalEdge }),
      box(776, 330, 324, 60, ["People"], { size: 18, edge: C.focalEdge }),
      box(776, 404, 324, 60, ["Technology"], { size: 18, edge: C.focalEdge }),
      label(938, 506, "the platform, across all three", { anchor: "middle", size: 16, italic: true }),
      // Horizontal arrows with their labels stacked above, so no line crosses text.
      label(530, 190, "Strategic input", { anchor: "middle", fill: C.text, weight: 500, size: 17 }),
      label(530, 212, "risk appetite, market entry, M&A,", { anchor: "middle", size: 15 }),
      label(530, 232, "regulatory posture, governance", { anchor: "middle", size: 15 }),
      arrow(736, 250, 322, 250),
      label(530, 320, "Tactical input", { anchor: "middle", fill: C.text, weight: 500, size: 17 }),
      label(530, 342, "contracts, disputes, employment questions,", { anchor: "middle", size: 15 }),
      label(530, 362, "the advice needed this week", { anchor: "middle", size: 15 }),
      arrow(736, 380, 322, 380),
      label(530, 456, "Requests and data", { anchor: "middle", fill: C.text, weight: 500, size: 17 }),
      label(530, 478, "what the business asks for, and what it reports", { anchor: "middle", size: 15 }),
      arrow(322, 496, 736, 496),
    ].join("\n"),
  });
}

/* ============================================ article 2, exhibit 2 */
{
  const w = 1240, h = 580;
  const steps = [
    ["Exception flagged", "rate cap exceeded"],
    ["Context attached", "terms, budget, history"],
    ["Decision in the queue", "approve, reduce, return"],
    ["Recorded", "invoice, matter, firm"],
  ];
  const bw = 250, bh = 96, y = 170;
  out["building-the-legal-operations-intelligence-platform/exhibit-2.svg"] = svg({
    w, h,
    title: "The decision loop",
    desc: "An invoice exception moving through a queue to a decision, with the record written against the invoice, the matter, and the firm, the approved amount returned to the e-billing platform, and a report card accumulating over four quarters.",
    body: [
      caption(w, "A decision taken inside the platform leaves a record"),
      `    <text x="${w / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">that the department can learn from.</text>`,
      ...steps.map((s, i) => box(48 + i * 296, y, bw, bh, s, { size: 18, focal: i === 2 })),
      ...steps.slice(0, -1).map((_, i) => arrow(48 + i * 296 + bw, y + bh / 2, 48 + (i + 1) * 296 - 8, y + bh / 2)),
      path(`M ${48 + 3 * 296 + bw / 2} ${y + bh} L ${48 + 3 * 296 + bw / 2} 352`, true),
      box(898, 360, 250, 78, ["Written back", "to the e-billing platform"], { size: 17 }),
      path(`M 898 399 L 620 399`, false),
      box(376, 360, 244, 78, ["The firm's report card", "four quarters on"], { size: 17, focal: true }),
      path(`M 376 399 L 180 399 L 180 ${y + bh + 8}`, false),
      label(620, 494, "The record exists only because each decision was captured as data.", { anchor: "middle", size: 15, italic: true }),
      label(620, 522, "In a reporting environment the decision happens in email and leaves nothing behind.", { anchor: "middle", size: 15, italic: true }),
    ].join("\n"),
  });
}

/* ============================================ article 3, exhibit 1 */
{
  const w = 1240, h = 700;
  const spine = [
    { x: 400, y: 250, t: "Matter" },
    { x: 400, y: 430, t: "Invoice" },
    { x: 640, y: 340, t: "Project" },
  ];
  const ops = [
    { x: 150, y: 150, t: "Request" },
    { x: 150, y: 330, t: "Communication" },
    { x: 150, y: 510, t: "Document" },
    { x: 400, y: 600, t: "Budget" },
    { x: 660, y: 570, t: "Timekeeper" },
    { x: 900, y: 500, t: "Clause" },
    { x: 940, y: 300, t: "Obligation" },
    { x: 700, y: 140, t: "Party" },
    { x: 940, y: 140, t: "Policy" },
  ];
  const node = (n, focal) =>
    focal
      ? `    <rect x="${n.x - 76}" y="${n.y - 30}" width="152" height="60" rx="30" fill="${C.focal}" stroke="${C.focalEdge}" stroke-width="2.4"/>
    <text x="${n.x}" y="${n.y + 7}" text-anchor="middle" font-size="19" fill="${C.text}" font-weight="600">${esc(n.t)}</text>`
      : `    <rect x="${n.x - 78}" y="${n.y - 26}" width="156" height="52" rx="26" fill="${C.box}" stroke="${C.boxEdge}" stroke-width="1.8"/>
    <text x="${n.x}" y="${n.y + 6}" text-anchor="middle" font-size="${autofit(n.t, 17, 142)}" fill="${C.text}">${esc(n.t)}</text>`;
  const edge = (a, b, hot = false) =>
    `    <line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${hot ? C.hot : C.thread}" stroke-width="${hot ? 2.6 : 1.5}" opacity="${hot ? 0.95 : 0.5}"/>`;
  // Labelled at the midpoint of the edge it names, with a panel behind so the
  // line does not strike through the words.
  const edgeLabel = (a, b, s, hot = false) => {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const size = 14, tw = s.length * size * WIDTH_PER_PX + 14;
    return `    <rect x="${mx - tw / 2}" y="${my - 13}" width="${tw}" height="22" rx="5" fill="${C.panel}" opacity="0.94"/>
    <text x="${mx}" y="${my + 3}" text-anchor="middle" font-size="${size}" fill="${hot ? C.hot : C.dim}" font-weight="${hot ? 600 : 400}">${esc(s)}</text>`;
  };
  const firmMatter = { x: 1058, y: 250, t: "The firm's matter" };
  const byName = Object.fromEntries([...spine, ...ops].map((n) => [n.t, n]));
  // Explicit edges, so every line means something a legal reader would accept.
  const EDGES = [
    ["Request", "Matter"], ["Communication", "Matter"], ["Document", "Matter"],
    ["Party", "Matter"], ["Policy", "Project"], ["Budget", "Invoice"],
    ["Timekeeper", "Invoice"], ["Clause", "Obligation"], ["Obligation", "Matter"],
  ];
  out["legal-operations-ontology/exhibit-1.svg"] = svg({
    w, h,
    title: "The entity and action model",
    desc: "A spine of matter, project, and invoice at the centre, with the operational entities of a legal department arranged around them and four example relationships labelled, including the engagement relationship that binds the department's matter to the firm's matter.",
    body: [
      caption(w, "The relationships among a department's records are the asset,"),
      `    <text x="${w / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">and most departments hold the records without them.</text>`,
      ...EDGES.map(([a, b]) => edge(byName[a], byName[b])),
      edge(spine[0], spine[1]), edge(spine[1], spine[2]), edge(spine[2], spine[0]),
      edge(spine[0], firmMatter, true),
      ...ops.map((o) => node(o, false)),
      ...spine.map((s) => node(s, true)),
      node(firmMatter, false),
      edgeLabel(byName.Communication, byName.Matter, "thread to matter"),
      edgeLabel(byName.Budget, byName.Invoice, "line to budget"),
      edgeLabel(byName.Clause, byName.Obligation, "clause to obligation"),
      // The heavier hot edge carries the emphasis on its own; a second caption
      // here collided with the Obligation node and the prose makes the point.
      edgeLabel(spine[0], firmMatter, "engagement", true),
      label(620, 664, "An ontology adds the relationships, the permitted actions, and the rules that govern them.", { anchor: "middle", size: 15, italic: true }),
    ].join("\n"),
  });
}

/* ============================================ article 4, exhibit 1 */
{
  const w = 1240, h = 620;
  out["business-intelligence-for-legal-operations/exhibit-1.svg"] = svg({
    w, h,
    title: "The governed measure loop",
    desc: "Records feed a governed measure, the measure feeds a person who decides and an automated process that routes, the resulting action is recorded as an outcome, and the outcome returns as the next period's input.",
    body: [
      caption(w, "A governed measure feeds a person and an automated process,"),
      `    <text x="${w / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">and the recorded outcome returns as the next period's input.</text>`,
      box(64, 268, 230, 96, ["Records", "matters, invoices, requests"], { size: 18 }),
      box(360, 268, 230, 96, ["Governed measure", "defined once, computed the same way"], { size: 18, focal: true }),
      arrow(298, 316, 352, 316),
      box(678, 150, 250, 86, ["A person reads it", "and decides"], { size: 18 }),
      box(678, 392, 250, 86, ["An automated process", "triggers, routes, escalates"], { size: 18 }),
      path("M 594 300 C 640 300, 636 193, 670 193"),
      path("M 594 332 C 640 332, 636 435, 670 435", true),
      box(990, 268, 196, 96, ["Outcome", "recorded"], { size: 18 }),
      path("M 928 193 C 968 193, 1080 236, 1082 260"),
      path("M 928 435 C 968 435, 1080 396, 1082 372", true),
      path("M 1088 364 C 1088 540, 180 556, 178 372", false, true),
      label(620, 540, "The recorded outcome is the next period's input.", { anchor: "middle", size: 16, italic: true }),
      label(620, 578, "When a measure triggers an action, its definition and its currency matter more than when it fills a chart.", { anchor: "middle", size: 15, italic: true }),
    ].join("\n"),
  });
}

/* ============================================ article 5, exhibit 2 */
{
  const w = 1240, h = 640;
  out["the-newfound-importance-of-knowledge-management/exhibit-2.svg"] = svg({
    w, h,
    title: "The curation loop",
    desc: "Nine sources of knowledge feed curation, curation feeds the four uses that make a model specific to a department, those uses produce AI output, an expert corrects the output, and the correction returns to the sources so the corpus improves with use.",
    body: [
      caption(w, "Expert corrections of AI output return to the sources of knowledge,"),
      `    <text x="${w / 2}" y="70" text-anchor="middle" font-size="21" fill="${C.text}" font-weight="600">so the corpus improves with use.</text>`,
      box(56, 204, 236, 140, ["Sources of knowledge", "precedents, playbooks, matter", "history, email, transcripts,", "negotiation and billing records"], { size: 17 }),
      box(352, 204, 236, 140, ["Curation", "owner, standards, review,", "retirement, permissions"], { size: 17, focal: true }),
      arrow(296, 274, 344, 274),
      box(648, 204, 236, 140, ["Four uses", "ground, instruct,", "exemplify, evaluate"], { size: 17 }),
      arrow(592, 274, 640, 274),
      box(944, 204, 240, 140, ["AI output", "an answer the department", "can defend, or cannot"], { size: 17 }),
      arrow(888, 274, 936, 274),
      box(648, 424, 236, 86, ["Expert correction", "the most direct signal"], { size: 17, focal: true }),
      path("M 1064 348 C 1064 424, 940 467, 890 467", true),
      path("M 644 467 C 420 467, 174 440, 174 352", true, true),
      label(408, 512, "the correction returns to the sources", { anchor: "middle", fill: C.hot, size: 15 }),
      label(620, 588, "A repository holds what was filed. A corpus fit for grounding has an owner, a status, and a way to test what it produces.", { anchor: "middle", size: 15, italic: true }),
    ].join("\n"),
  });
}

for (const [rel, body] of Object.entries(out)) {
  const dir = A + rel.split("/")[0];
  mkdirSync(dir, { recursive: true });
  writeFileSync(A + rel, body);
  const em = body.includes(String.fromCharCode(0x2014));
  console.log((em ? "EM DASH " : "ok      ") + A + rel + "  " + body.length + " bytes");
}
