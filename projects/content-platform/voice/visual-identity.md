# Visual identity — heroes for Spaarke pieces

The visual constitution. Read once per session before drafting any
hero prompt. Pairs with `style-guide.md` (voice) and
`brand-positioning.md` (argument). The hero is the visual answer to
the same question the headline answers — what is this piece about,
in one beat, before the reader scrolls.

---

## 1. The visual we're building

A Spaarke hero is a small, dark, abstract image at the top of a
piece — not a billboard. It sits inside a 16:9 (occasionally 21:9)
frame beneath the title and meta. The title carries the language;
the hero carries the mood. Dark surface, disciplined geometry, a
single confident focal element, generous negative space. No people,
no devices, no logos.

The existing 16-piece library skews dark-navy with blue accents and
abstract subjects — that part already works, and the new identity
preserves it. What it tightens is the drift toward generic
"futuristic HUD" tropes (wireframe hands, glowing portals, circuit-
board diagonals, rocket-arrow speed-streaks) that read as stock-AI-
illustration and undercut the McKinsey/HBR calibration the prose
works for. The strongest existing heroes — `loi-maturity-model`
(isometric cubes), `the-iq-stack` (typographic mark), `what-is-
legal-operations-intelligence` (tree rings), `why-we-built-on-
microsoft` (spiral particle field) — show what disciplined looks
like. The new identity codifies those, not the HUD ones.

## 2. Style descriptors

Five contrasts. Treat them like the voice contrasts in the style
guide.

- **Geometric, not organic.** Hard edges, isometric forms, concentric
  rings, typographic shapes. Not painterly clouds, watercolor flows,
  or "fluid AI energy." *Like* `loi-maturity-model`, `the-iq-stack`,
  `why-we-built-on-microsoft`. *Not* the swirling-gas backgrounds AI
  generators default to.

- **Abstract, not literal.** The image represents the concept, not
  the scene. An article on AI doesn't show a robot hand; an article
  on document intelligence doesn't show a stack of folders. *Like*
  tree rings standing in for layered intelligence. *Not* lawyers at
  desks, gavels, magnifying glasses over contracts.

- **Confident, not cluttered.** One strong silhouette. Lots of
  negative space. Readable from across the room. *Like* a single
  typographic monogram on a deep gradient. *Not* the 12-card HUD-
  circuit collages where the eye doesn't know where to land.

- **Disciplined dark, not sci-fi dark.** Dark slab in the brand's
  deep-navy/black family with restrained accent. Avoid the "blue
  glowing futuristic interface" cliché — particles streaming inward,
  holographic UIs, neon-circuit diagonals. *Like* `why-we-built-on-
  microsoft` (black field, single blue spiral, no extra noise).
  *Not* HUD overlays, fake "data" panels, simulated dashboards.

- **Stylized illustration, not photoreal.** Vector-flat or vector-
  with-gradient; subtle grain texture allowed. *Like* the wood-grain
  tree-rings on `what-is-loi`. *Not* a photoreal cube on a marble
  desk, no 3D-render-shiny chrome.

## 3. Color palette

Pulled from `src/app/globals.css`. The site is dark-default and the
hero composition lives inside a `Slab tone="dark"` at the top of the
article.

**Backgrounds (foreground of the hero canvas)**
- `#0A0A0A` — page background (`--v2-bg`).
- `#111111` — surface (`--v2-surface`).
- `#0A0A14` — deepest navy used in the existing Legal IQ stack hero
  gradient.
- `#1A1230` and `#2D1F5E` — deep purple-navy mid-tones from the
  existing Legal IQ stack hero radial.

**Accents (the hero's confident color note)**
- `#000BFF` — Spaarke Blue (`--color-spaarke-blue`); the brand's
  electric primary. Use as a single confident accent, not as a wash.
- `#4060DC` — CTA blue (`--color-cta-blue`); softer, sits in the
  same family as the home-page footlight glow.
- `#7B5BFF` — soft purple from the existing Legal IQ stack hero glow; use
  as a low-opacity wash, not a hard fill.
- `#FF4DCB` — magenta accent from the same hero glow; very low
  opacity (≤ 20%) and only as a glow halo, never as fill.

**Allowed warm/neutral accents (sparingly, one per piece)**
- Muted copper/gold (~`#CB9959`) — used in `the-iq-stack` and
  `what-is-legal-operations-intelligence` heroes; acceptable when the
  piece is foundational/category-defining and a non-blue accent earns
  a second of attention.
- Muted maroon (~`#7A2A2A`) and warm orange (~`#D9803A`) — only as
  small accent shapes inside an otherwise navy/blue composition (see
  `loi-maturity-model`).

Foreground/background convention for hero compositions: **dark slab
background (#0A0A0A → #0A0A14 → #2D1F5E gradient), single blue or
copper accent for the focal element, low-opacity purple/magenta glow
optional.** The article title sits on the surface above the hero, in
white — the hero must read confidently against neighboring white text.

## 4. Composition principles

- **Aspect ratio: 16:9.** This is the default `aspect-[16/9]` in
  `ArticleHeader.tsx`. The component widens to `21:9` on
  `md:` breakpoints, so the focal element should survive a tighter
  vertical crop — keep it in the center band. Never generate at
  `1:1` or `4:5` for an article hero; reserve those for LinkedIn
  carousel covers and portrait crops.
- **Focal point: centered or rule-of-thirds left.** Centered for
  symmetric concepts (the Legal IQ stack mark, a concentric ring, a
  spiral). Off-center to the lower-third-left for asymmetric concepts
  with a strong negative-space right side. Avoid right-weighted
  compositions — the article title overlay sits high-left in the
  reading order.
- **No text in the image.** The article title carries the words. No
  type, no callouts, no labels, no logos. Typographic *forms* (a
  monogram or wordmark used as shape) are the only exception, and
  only when the piece is itself about that form.
- **Edge treatment: soft vignette, no hard borders.** Edges fade to
  the surface color. The container in `ArticleHeader.tsx` has a
  rounded `rounded-xl` border, so don't rely on the image's own
  rectangular frame.
- **Depth: flat or shallow.** Isometric and 2.5D both fine. Avoid
  deep-perspective sci-fi tunnels and "floating dashboard" mockups.

## 5. What to avoid

The do-not-generate list. Visual analogs of the do-not-say list.

- **No people.** No lawyers at desks, no business-suit handshakes,
  no GC frowning at a laptop, no diverse-team-around-a-table.
- **No generic "AI" visuals.** No glowing brain, no neural-network
  mesh, no robot hand reaching toward a human hand, no humanoid
  silhouette with circuits inside. The single biggest tell of a
  generated hero.
- **No futuristic HUD overlays.** No simulated dashboards, no
  holographic UI panels, no cyan circuit-board diagonals, no
  scanner-style rings with tick marks. Half the existing library
  leans on this trope; the new identity moves away from it.
- **No data-particle clichés.** No glowing dots streaming inward,
  no digital-rain columns, no "speed line" light streaks
  (`welcome-to-spaarke`, `the-ai-readiness-gap` are the examples to
  step away from).
- **No clip-art or emoji-flat illustration.** No cartoon mascots,
  no Notion-style doodles. The audience reads HBR.
- **No screenshots — competing or our own.** Platform pages carry
  product screenshots; the blog stays abstract.
- **No Microsoft logos, Power Platform marks, or M365 icons.**
  Microsoft is referenced in the prose, not the image. Even abstract
  "Microsoft-tinted" hexagons are off-limits.
- **No legal-industry clichés.** No gavels, scales, columns, or
  gold-leaf seals. Dated.
- **No photo-real 3D renders.** No marble cubes on tabletops, no
  glossy chrome. The brand reads as research, not retail.

## 6. Recommended generators and settings

In rough order of preference for **this brand specifically** (geometric,
abstract, editorial — see §1, §2):

- **SVG-via-Claude (default).** Heroes produced directly in Claude Code
  as hand-written SVG. Palette-exact, composition-controllable, no
  generator drift, no subscription, instantly editable as text. Pairs
  with this brand because the visual identity is geometric and abstract
  by definition. The 2026-05 hero regeneration batch (`welcome-to-spaarke`,
  `breaking-the-silo`, `the-ai-readiness-gap`, `your-legal-data-belongs-to-you`,
  `what-attorneys-need-to-know-about-ai`, `institutional-knowledge`,
  `the-20b-blind-spot`) is the reference. Limitation: no photographic,
  painterly, or atmospheric imagery — for those, fall through to a raster
  generator below.
- **Midjourney v6.1+** — when a piece genuinely needs raster atmosphere
  beyond what SVG can carry (rare for this brand). Use `--style raw` to
  kill the default cinematic drama. Lock `--ar 16:9`. Use `--stylize 50`
  to dial down decoration (default is 100).
- **Adobe Firefly (Image 3+)** — first choice when commercial-safety
  matters (Firefly is trained on licensed/public-domain content and
  Adobe carries IP indemnification). Less stylistically distinctive;
  rely on a tight prompt prefix.
- **DALL-E 3** — strongest at following composition instructions
  ("centered, lower-third left, generous negative space right").
  Use when the brief specifies composition.
- **Ideogram** — when typographic forms are part of the composition.

### Open-Graph / social-card consideration

SVG works in Next.js's `<Image>` for the in-page hero, but social-card
preview tools (LinkedIn, Twitter/X, Slack unfurl) sometimes don't
render SVG cleanly as the Open Graph image. If a piece is being
syndicated heavily, consider a small raster fallback for `og:image` —
either exported once per piece via a headless renderer or generated at
build time. Not a blocker for in-page heroes; flag for the team when
the first social syndication pipeline lands.

Brand prompt prefix to anchor the look on any of the above:
*"minimalist geometric vector illustration, deep navy background
(#0A0A0A to #2D1F5E gradient), single confident blue accent
(#000BFF or #4060DC), generous negative space, flat or 2.5D,
editorial illustration in the McKinsey Quarterly / Harvard Business
Review house style, no text, no people, no logos."*

## 7. Prompt structure

Every hero prompt assembles four parts in this order:

```
[STYLE PREFIX] · [SUBJECT — abstract concept, not literal scene] ·
[COMPOSITION — aspect, focal point, negative space] ·
[NEGATIVE LIST — what NOT to include]
```

### Worked example 1 — *"Legal IQ and the future of legal operations"* (2026-05-19 blog)

```
Minimalist geometric vector illustration, deep navy background
(#0A0A0A fading to #2D1F5E in a soft radial), single confident
electric-blue accent (#000BFF) with a faint magenta glow halo
(#FF4DCB at 15% opacity). An abstract emblem: three concentric
rings of varying weight, the innermost a solid disc, suggesting
layers of intelligence stacking around a single source. Centered
focal point, 16:9 landscape, generous negative space on all sides,
flat 2.5D, editorial illustration in the McKinsey Quarterly /
Harvard Business Review house style. No text, no people, no UI
panels, no neural network mesh, no robotic hands, no futuristic
HUD, no data particles, no glowing brain.
```

### Worked example 2 — *"Why human-in-the-loop is a competitive advantage"* (2026-06-02 blog)

```
Minimalist geometric vector illustration, dark slab background
(#0A0A0A with a #1A1230 gradient lower-right), single confident
copper-gold accent (~#CB9959) — a hand-drawn-feeling typographic
"loop" or moebius-band form, single continuous line, lower-third
left of the frame. 16:9 landscape, large negative space to the
right, flat illustration with a subtle paper-grain texture, editorial
register in the McKinsey Quarterly / HBR house style. No text, no
people, no robot hands, no neural mesh, no HUD, no glowing particles,
no clip-art.
```

### Worked example 3 — *"The problem with fragmented legal tech"* (2026-06-09 blog)

```
Minimalist geometric vector illustration, deep navy background
(#0A0A0A to #0A0A14 gradient). An abstract isometric composition: a
loose grid of small disconnected cubes in muted navy, slate, and
warm-orange (~#D9803A) accents, scattered across the lower half of
the frame, none touching — visualizing fragmentation. One darker
cube sits separately upper-right, suggesting a missing assembly.
16:9 landscape, off-center lower-left composition, generous
negative space upper-right, flat 2.5D vector with subtle grain in
the McKinsey Quarterly / HBR house style. No text, no people, no
logos, no Microsoft marks, no HUD overlays, no glowing particles,
no neural mesh.
```

## 8. The workflow

After polish, before frontmatter validation:

1. **Read this file** if it's the first hero of the session.
2. **Pick a generator.** SVG-via-Claude is the default — see §6. Raster
   only when the piece genuinely needs photographic / painterly / atmospheric.
3. **For SVG-via-Claude:** sketch the concept in 2–3 sentences (subject,
   composition, palette accents), then write the SVG directly to
   `public/articles/<slug>/hero.svg` using a 1600×900 viewBox and the
   palette stops in §3. Ship the first version that earns the title —
   iteration on SVGs is text edits, no need to over-design up front.
4. **For raster:** draft the prompt using §7. Drop it into the brief's
   `# Hero graphic` section. Generate 4–8 candidates, pick the first
   frame that earns the title, save to `public/articles/<slug>/hero.jpg`.
5. **Wire** in MDX frontmatter:
   `heroImage: "/articles/<slug>/hero.svg"` (or `.jpg` for raster) plus
   `heroImagePosition: "center"` (override only when off-center).
6. **Alt text** in the SVG `<title>` and `aria-label` for SVGs, or as
   article-level alt text for raster. A real sentence — "Three
   concentric rings on a deep navy field, suggesting layers of
   intelligence" — not "hero image."

---

*Locked 2026-05-07 — see git log for history.*
