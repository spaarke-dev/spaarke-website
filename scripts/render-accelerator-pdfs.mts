// Render the accelerator brief and the readiness checklist as 1080 by 1350
// PDFs for LinkedIn Document ads and the site, from the same copy the web
// pages use (src/app/accelerator/documents.ts).
//
//   npm run accelerator:pdf [-- --out <dir>]
//
// Writes public/accelerator/<name>.pdf, plus page PNGs, a contact sheet, and
// an overflow report (measured with the real fonts loaded) in the work dir
// (default: <os tmp>/accelerator-pdfs). Needs Chrome or Edge, and network
// access for Google Fonts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { basename, resolve, sep } from "node:path";
import type { AcceleratorDocument, Block } from "../src/app/accelerator/documents.ts";
import * as documents from "../src/app/accelerator/documents.ts";

// The repo is not "type": "module", so tsx loads documents.ts as CommonJS and
// its exports arrive on `default`.
const D = ((documents as { default?: typeof documents }).default ?? documents) as typeof documents;
const { BRIEF, CHECKLIST, CONTACT_EMAIL, EXHIBIT_1, EXHIBIT_2 } = D;

const ROOT = resolve(import.meta.dirname, "..");
const PUBLIC = resolve(ROOT, "public");
const outArg = process.argv.indexOf("--out");
const WORK = resolve(outArg > 0 ? process.argv[outArg + 1] : resolve(tmpdir(), "accelerator-pdfs"));
mkdirSync(WORK, { recursive: true });
mkdirSync(resolve(PUBLIC, "accelerator"), { recursive: true });

const BROWSER = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => existsSync(p));
if (!BROWSER) throw new Error("Chrome or Edge not found");

const fileUrl = (p: string) => "file:///" + p.split(sep).join("/");
const asset = (sitePath: string) => fileUrl(resolve(PUBLIC, sitePath.replace(/^\//, "")));
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const num = (n: number) => String(n).padStart(2, "0");
// Keep "e-billing" on one line.
const nb = (s: string) => esc(s).replace(/e-billing/g, "e&#8209;billing");

// The campaign's palette: the hero and the exhibits are deep teal with a
// coral accent, so the documents match the ads they sit beside.
const CSS = `
*{box-sizing:border-box}html,body{margin:0;padding:0}
@page{size:1080px 1350px;margin:0}
:root{--bg0:#0F3B3A;--bg1:#0A2A2C;--bg2:#06181B;--fg:#E6FBF4;--mid:#B5F2DC;--low:#8FCFBB;
  --line:#1E6F66;--line2:#2B8F7F;--coral:#FF7A59;--coral2:#FF9A7E;--card:rgba(30,111,102,.16);
  --display:'Inter Tight',system-ui,sans-serif;--body:Inter,system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace}
.page{position:relative;width:1080px;height:1350px;overflow:hidden;break-after:page;color:var(--fg);font-family:var(--body);
  background:radial-gradient(ellipse 90% 70% at 55% 35%,var(--bg0),var(--bg1) 55%,var(--bg2));
  -webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;flex-direction:column}
.main{flex:1;padding:84px 84px 0;display:flex;flex-direction:column;gap:34px;min-height:0}
.eyebrow{font:500 19px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--coral2)}
h1,h2{font-family:var(--display);font-weight:600;letter-spacing:-.02em;margin:0;text-wrap:balance}
h1{font-size:78px;line-height:1.02}
h2{font-size:54px;line-height:1.06;margin-top:-14px}
.page:not(.cover) h1{font-size:64px;line-height:1.04;margin-top:-14px}
p{margin:0}
.text p{font-size:25px;line-height:1.48;color:var(--mid)}
.text p+p{margin-top:16px}
.items{display:grid;gap:26px}
.items.c2{grid-template-columns:1fr 1fr;gap:20px 40px}
.item{border-top:2px solid var(--line);padding-top:16px}
.item b{display:block;font:600 25px/1.3 var(--display);color:var(--fg)}
.item span{display:block;margin-top:6px;font-size:22px;line-height:1.42;color:var(--mid)}
.items.c1 .item span{font-size:24px}
.steps{display:grid;gap:20px;margin:0;padding:0;list-style:none}
.steps li{display:flex;gap:22px}
.steps .n{font:500 22px var(--mono);color:var(--coral2);width:36px;flex:none;padding-top:3px}
.steps b{display:block;font:600 25px/1.3 var(--display)}
.steps span{display:block;margin-top:4px;font-size:22px;line-height:1.42;color:var(--mid)}
.list .lead{font:600 25px/1.3 var(--display)}
.list ul{margin:12px 0 0;padding:0 0 0 26px;font-size:22px;line-height:1.42;color:var(--mid)}
.list li+li{margin-top:6px}
.list li::marker{color:var(--coral)}
.checks{display:grid;gap:19px;margin:0;padding:0;list-style:none}
.checks li{display:flex;gap:22px}
.checks .box{width:30px;height:30px;flex:none;border:3px solid var(--coral);border-radius:5px;margin-top:2px}
.checks b{font:600 24px/1.3 var(--display)}
.checks .owner{display:inline-block;margin-left:14px;font:500 14px var(--mono);letter-spacing:.12em;text-transform:uppercase;
  color:var(--low);border:1.5px solid var(--line2);border-radius:999px;padding:3px 10px;vertical-align:3px}
.checks .q{display:block;margin-top:4px;font-size:22px;line-height:1.38;color:var(--fg)}
.checks .why{display:block;margin-top:4px;font-size:18px;line-height:1.4;color:var(--low)}
.contents{margin:0;padding:0;list-style:none;display:grid;gap:12px;border-top:2px solid var(--line);padding-top:24px}
.contents li{display:flex;gap:22px;font-size:24px;color:var(--mid)}
.contents .n{font:500 21px var(--mono);color:var(--coral2);width:36px;padding-top:2px}
.book{border:2px solid var(--coral);border-radius:20px;padding:26px 34px;background:rgba(255,122,89,.07)}
.book b{display:block;font:600 36px/1.15 var(--display)}
.book p{margin-top:12px;font-size:23px;line-height:1.45;color:var(--mid)}
.book .contact{margin-top:16px;display:flex;align-items:baseline;gap:28px}
.book .url{font:600 30px var(--display);color:var(--coral2)}
.book .mail{font-size:21px;color:var(--low)}
.foot{height:96px;flex:none;margin:0 84px;border-top:1.5px solid var(--line);display:flex;align-items:center;justify-content:space-between;
  font:500 16px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--low)}
.foot img{height:26px;display:block}
.foot .r{display:flex;gap:28px;align-items:center}
.hero{height:470px;flex:none;background-size:cover;background-position:center 58%;margin-bottom:-28px}
.cover .main{padding-top:64px}
/* Exhibit 1 */
.ex1{display:flex;gap:16px}
.ex1 .reach{width:66px;flex:none;border-radius:14px;background:rgba(43,143,127,.35);border:1.5px solid var(--line2);display:flex;align-items:center;justify-content:center}
.ex1 .reach div{transform:rotate(-90deg);white-space:nowrap;text-align:center;font:600 21px var(--display)}
.ex1 .reach small{display:block;font:400 16px var(--body);color:var(--mid)}
.ex1 .stack{flex:1;display:grid;gap:10px}
.ex1 .layer{border-radius:14px;background:var(--card);border:1.5px solid var(--line);padding:15px 22px}
.ex1 .layer b{font:600 24px var(--display)}
.ex1 .layer span{display:block;margin-top:4px;font-size:19px;color:var(--mid)}
.ex1 .layer.acc{border:2.5px solid var(--coral);background:rgba(255,122,89,.08);display:flex;justify-content:space-between;align-items:center}
.ex1 .tag{font:500 15px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--coral2)}
.ex1 .onto{margin-top:12px;border-radius:10px;background:rgba(43,143,127,.28);padding:12px 16px}
.ex1 .onto b{font-size:20px}.ex1 .onto span{font-size:17px}
.ex1 .sor{margin-top:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.ex1 .sor div{border-radius:10px;border:1.5px solid var(--line2);padding:10px 12px;font:600 18px/1.25 var(--display)}
.ex1 .sornote{margin-top:8px;font:500 14px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--low)}
.ex1 .sor small{display:block;font:500 12px var(--mono);letter-spacing:.1em;color:var(--low);margin-bottom:4px}
/* Exhibit 2 */
.ex2{display:grid;grid-template-columns:repeat(3,1fr);gap:0 14px;align-content:start}
.ex2 .h{font:600 21px/1.2 var(--display);padding-bottom:12px}
.ex2 .h small{display:block;font:400 16px var(--body);color:var(--mid);margin-top:3px}
.ex2 .h.c3{color:var(--coral2)}
.ex2 .row{grid-column:1/-1;font:500 15px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--low);padding:11px 0 7px;border-top:1.5px solid var(--line)}
.ex2 .cell{border-radius:10px;background:var(--card);padding:10px 14px;font-size:19px;line-height:1.35}
.ex2 .cell.c3{background:rgba(43,143,127,.30)}
`;

const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=block">`;

function exhibit1(): string {
  const e = EXHIBIT_1;
  const layer = (l: (typeof e.layers)[number]) => {
    if (l.accelerator)
      return `<div class="layer acc"><div><b>${esc(l.name)}</b><span>${esc(l.body)}</span></div><div class="tag">${esc(e.acceleratorLabel)}</div></div>`;
    if (!l.body)
      return `<div class="layer"><b>${esc(l.name)}</b>
        <div class="onto"><b>${esc(e.ontology.name)}</b><span>${esc(e.ontology.body)}</span></div>
        <div class="sor">${e.systems.map((s) => `<div><small>SYSTEM OF RECORD</small>${nb(s)}</div>`).join("")}</div>
        <div class="sornote">Systems of record: ${esc(e.systemsNote)}</div></div>`;
    return `<div class="layer"><b>${esc(l.name)}</b><span>${esc(l.body)}</span></div>`;
  };
  return `<div><div class="ex1"><div class="reach"><div>${esc(e.reach[0])}<small>${esc(e.reach[1])}</small></div></div>
    <div class="stack">${e.layers.map(layer).join("")}</div></div>
    </div>`;
}

function exhibit2(): string {
  const e = EXHIBIT_2;
  const head = e.columns
    .map((c, i) => `<div class="h${i === 2 ? " c3" : ""}">${esc(c.name)}${c.sub ? `<small>${esc(c.sub)}</small>` : ""}</div>`)
    .join("");
  const rows = e.rows
    .map(
      (r) =>
        `<div class="row">${esc(r.name)}</div>` +
        r.cells.map((c, i) => `<div class="cell${i === 2 ? " c3" : ""}">${esc(c)}</div>`).join(""),
    )
    .join("");
  return `<div><div class="ex2">${head}${rows}</div></div>`;
}

function block(b: Block): string {
  switch (b.kind) {
    case "text":
      return `<div class="text">${b.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
    case "items":
      return `<div class="items c${b.columns}">${b.items
        .map((i) => `<div class="item"><b>${esc(i.name)}</b><span>${esc(i.body)}</span></div>`)
        .join("")}</div>`;
    case "steps":
      return `<ol class="steps">${b.items
        .map((i, n) => `<li><div class="n">${num(n + 1)}</div><div><b>${esc(i.name)}</b><span>${esc(i.body)}</span></div></li>`)
        .join("")}</ol>`;
    case "list":
      return `<div class="list"><div class="lead">${esc(b.lead)}</div><ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`;
    case "checks":
      return `<ul class="checks">${b.items
        .map(
          (c) =>
            `<li><div class="box"></div><div><b>${esc(c.name)}</b>${c.owner ? `<span class="owner">${esc(c.owner)}</span>` : ""}` +
            `<span class="q">${esc(c.question)}</span>${c.why ? `<span class="why">${esc(c.why)}</span>` : ""}</div></li>`,
        )
        .join("")}</ul>`;
    case "exhibit":
      return b.exhibit === 1 ? exhibit1() : exhibit2();
    case "contents":
      return `<ol class="contents">${b.items.map((i, n) => `<li><span class="n">${num(n + 2)}</span>${esc(i)}</li>`).join("")}</ol>`;
    case "book":
      return `<div class="book"><b>${esc(b.title)}</b><p>${esc(b.body)}</p><div class="contact"><div class="url">spaarke.com/accelerator</div><div class="mail">${esc(CONTACT_EMAIL)}</div></div></div>`;
  }
}

function pages(doc: AcceleratorDocument): string[] {
  const logo = asset("/brand/logos/spaarke-logo-white.svg");
  return doc.pages.map((p, i) => {
    const cover = doc === BRIEF && i === 0;
    const heading = i === 0 ? `<h1>${esc(p.title)}</h1>` : `<h2>${esc(p.title)}</h2>`;
    return `<section class="page${cover ? " cover" : ""}" data-page="${p.id}">
${cover ? `<div class="hero" style="background-image:url('${asset("/articles/microsoft-is-now-the-platform-for-legal-ai/hero.svg")}')"></div>` : ""}
<div class="main"><div class="eyebrow">${esc(p.eyebrow)}</div>${heading}${p.blocks.map(block).join("")}</div>
<div class="foot"><img src="${logo}" alt="Spaarke"><div class="r"><span>${esc(doc.shortTitle)}</span><span>${num(i + 1)} / ${num(doc.pages.length)}</span></div></div>
</section>`;
  });
}

// After the fonts load, report anything that leaves its page or runs into the
// footer band.
const CHECK = `<script>
document.fonts.ready.then(() => {
  const out = [];
  out.push("fonts " + [["Inter",400],["Inter Tight",600],["JetBrains Mono",500]].map(([f,w]) => f + ":" + document.fonts.check(w + " 16px '" + f + "'")).join(" "));
  document.querySelectorAll(".page").forEach((s, i) => {
    const r = s.getBoundingClientRect(), issues = [];
    const main = s.querySelector(".main"), footTop = s.querySelector(".foot").getBoundingClientRect().top;
    let lowest = 0;
    for (const el of main.querySelectorAll("*")) {
      const e = el.getBoundingClientRect();
      if (!e.width || !e.height) continue;
      lowest = Math.max(lowest, e.bottom);
      const name = (el.textContent || el.tagName).trim().replace(/\\s+/g, " ").slice(0, 50);
      if (e.right > r.right - 40 || e.left < r.left + 40) issues.push("outside margin: " + name);
      if (el.children.length === 0 && e.bottom > footTop - 24) issues.push("into footer by " + Math.round(e.bottom - footTop + 24) + "px: " + name);
    }
    out.push("page " + (i + 1) + " (" + s.dataset.page + "): " + (issues.length ? [...new Set(issues)].join(" | ") : "ok, " + Math.round(footTop - 24 - lowest) + "px spare"));
  });
  const pre = document.createElement("pre"); pre.id = "report"; pre.textContent = out.join("\\n"); document.body.append(pre);
});
</script>`;

const html = (title: string, body: string, extra = "") =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>${FONTS}<style>${CSS}${extra}</style></head><body>${body}</body></html>`;

const browser = (args: string[], opts: Parameters<typeof execFileSync>[2] = { stdio: "ignore" }) =>
  execFileSync(BROWSER, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--virtual-time-budget=15000", ...args], opts);

for (const doc of [BRIEF, CHECKLIST]) {
  const name = basename(doc.pdf, ".pdf");
  const dir = resolve(WORK, name);
  mkdirSync(dir, { recursive: true });
  const ps = pages(doc);
  writeFileSync(resolve(dir, "doc.html"), html(doc.title, ps.join("\n")));
  writeFileSync(resolve(dir, "check.html"), html("check", ps.join("\n") + CHECK));
  writeFileSync(
    resolve(dir, "sheet.html"),
    html("sheet", `<div class="sheet">${ps.map((p) => `<div class="cell">${p}</div>`).join("")}</div>`,
      `body{background:#777}.sheet{display:grid;grid-template-columns:repeat(4,324px);gap:16px;padding:16px}.cell{width:324px;height:405px;overflow:hidden}.cell .page{transform:scale(.3);transform-origin:0 0}`),
  );
  ps.forEach((p, i) => writeFileSync(resolve(dir, `page-${num(i + 1)}.html`), html("page", p)));

  const pdf = resolve(PUBLIC, doc.pdf.replace(/^\//, ""));
  browser(["--no-pdf-header-footer", `--print-to-pdf=${pdf}`, fileUrl(resolve(dir, "doc.html"))]);
  // The PDF's title metadata comes from <title>; Chrome sets it on print.
  browser(["--window-size=1376,860", `--screenshot=${resolve(dir, "sheet.png")}`, fileUrl(resolve(dir, "sheet.html"))]);
  ps.forEach((_, i) =>
    browser(["--window-size=1080,1350", `--screenshot=${resolve(dir, `page-${num(i + 1)}.png`)}`, fileUrl(resolve(dir, `page-${num(i + 1)}.html`))]),
  );
  const dom = browser(["--window-size=1080,1350", "--dump-dom", fileUrl(resolve(dir, "check.html"))], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }) as string;
  const report = (dom.match(/<pre id="report">([\s\S]*?)<\/pre>/) || [, "no report (fonts never loaded?)"])[1]!.replace(/&amp;/g, "&");
  const kb = Math.round(readFileSync(pdf).length / 1024);
  console.log(`\n${doc.shortTitle}: ${doc.pdf} (${kb} KB), previews in ${dir}\n${report}`);
}
