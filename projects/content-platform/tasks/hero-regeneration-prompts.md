# Hero regeneration prompts — 7 articles

Seven hero images need regeneration under the locked visual identity in
`voice/visual-identity.md`. The existing heroes for these pieces lean
on the futuristic-HUD / circuit-board / wireframe-hand / data-particle
tropes the new identity moves away from — the half of the library the
new identity codifies *against*, not the half (`the-iq-stack`,
`loi-maturity-model`, `what-is-legal-operations-intelligence`,
`why-we-built-on-microsoft`) it codifies *for*. The prompts below are
written to be paste-ready in **Midjourney v6.1+**, **DALL-E 3 / GPT-4o**,
**Adobe Firefly (Image 3+)**, and **ComfyUI** (SDXL or FLUX base). The
prompt body is tool-agnostic; per-tool flag adjustments are summarized
once below and only piece-specific notes appear per entry.

---

## How to use this file

1. Pick one of the seven articles below. Pick a generator (Midjourney
   default; Firefly when commercial-safety matters; DALL-E 3 when
   composition fidelity matters; ComfyUI for batched runs).
2. Copy the **Prompt (paste-ready)** block verbatim. Append the
   per-tool flags from the table below.
3. Generate **4–8 candidates**. Vary the subject metaphor; keep the
   style prefix and negative list constant.
4. Pick the first frame that earns the title. Don't over-iterate.
5. Save to the **Output path** in the entry. Update the article's
   `heroImage` frontmatter only if the path changes.
6. If a generated image doesn't match the visual identity, refine the
   prompt rather than picking a not-quite-right candidate. Capture
   refinements back into this file. Reference `voice/visual-identity.md`
   if a section is unclear.

## Per-tool flags (apply to every prompt below)

- **Midjourney v6.1+** — append `--ar 16:9 --style raw --s 50` to 100
  (lower stylize for the geometric pieces, mid-stylize for the
  ring/strata pieces). Pin `--seed` once a candidate frame works,
  then iterate variations.
- **DALL-E 3 / GPT-4o** — paste the prompt as-is. Specify "16:9
  landscape" if the tool defaults elsewhere. DALL-E is the strongest
  tool for compositions defined by precise absence or specific
  placement ("centered, lower-third left, generous negative space").
- **Adobe Firefly (Image 3+)** — select "Art" content-type, "Vector
  look" style preset, paste the prompt. First choice when commercial
  safety matters (white papers, LinkedIn carousels, anything reused
  off-blog).
- **ComfyUI** — SDXL or FLUX base. Consider training a brand LoRA on
  the four strong heroes (`the-iq-stack`, `loi-maturity-model`,
  `what-is-legal-operations-intelligence`, `why-we-built-on-microsoft`)
  for tighter consistency across the batch — most useful if running
  more than three of the seven pieces through this tool.

---

## welcome-to-spaarke

**Source**: `projects/content-platform/drafts/blog-posts/welcome-to-spaarke.mdx`
**Argument the hero should evoke**: Spaarke is not a tool added to the
stack — it is the operating layer above the tools, running inside the
customer's tenant rather than next to it.
**Concept**: An abstract emblem of nested boundaries. A solid inner
form held inside a frame, held inside another frame still —
"platform within tenant within governance." Disciplined, geometric,
single confident accent. No attempt to render a platform UI.

**Prompt (paste-ready)**:

> Minimalist geometric vector illustration, deep navy background
> (#0A0A0A fading radially to #2D1F5E in the lower-third), single
> confident electric-blue accent (#000BFF) with a faint soft-purple
> glow halo (#7B5BFF at 15% opacity). An abstract emblem of nested
> containment: three concentric square frames of varying line weight,
> each rotated a few degrees off the next, with a small solid
> Spaarke-blue cube held precisely at center — a system held inside a
> boundary held inside a boundary. Centered focal point, 16:9
> landscape, generous negative space on all sides, flat 2.5D vector,
> editorial illustration in the McKinsey Quarterly / Harvard Business
> Review house style. No text, no people, no UI panels, no neural
> network mesh, no robotic hands, no futuristic HUD, no data
> particles, no glowing brain, no Microsoft logos, no gavels or
> scales, no photo-real 3D renders, no clip-art.

**Style preset**: minimalist geometric, deep-navy + electric-blue accent, soft purple glow, 2.5D
**Aspect ratio**: 16:9
**Output path**: `/public/images/blog/welcome-to-spaarke.jpg`
**Alt text**: Three concentric square frames on a deep navy field, with a single Spaarke-blue cube held at center, suggesting a system held inside a tenant boundary.

**Piece-specific note**: Geometric clarity is what carries the meaning;
prefer Midjourney `--s 50` (low stylize) so line weights stay crisp.

---

## breaking-the-silo

**Source**: `content/blog/2026-03-21-breaking-the-silo.mdx`
**Argument the hero should evoke**: Legal data is structurally
disconnected from the rest of the enterprise — a function that has
not yet been bridged into the shared operational layer.
**Concept**: An asymmetric isometric grid where most cells share a
unifying line that passes through them, while a single cluster sits
clearly outside that line. No literal walls, no chains, no broken
padlocks.

**Prompt (paste-ready)**:

> Minimalist geometric vector illustration, deep navy background
> (#0A0A0A to #0A0A14 gradient). An abstract isometric composition: a
> loose orthogonal grid of small flat tiles in muted navy and slate,
> arranged across the lower two-thirds of the frame. A single
> confident electric-blue line (#000BFF) traces horizontally through
> most of the tiles, suggesting a shared layer; a small cluster of
> three warm-orange tiles (~#D9803A) sits separately to the upper
> right, off the line, suggesting an unjoined function. Off-center
> lower-left composition with generous negative space upper-right,
> 16:9 landscape, flat 2.5D vector with subtle paper grain, editorial
> illustration in the McKinsey Quarterly / Harvard Business Review
> house style. No text, no people, no UI panels, no walls, no chains,
> no broken padlocks, no neural network mesh, no robotic hands, no
> futuristic HUD, no data particles, no Microsoft logos, no gavels
> or scales, no photo-real 3D renders, no clip-art.

**Style preset**: minimalist geometric, navy + warm-orange dissent accent, 2.5D isometric
**Aspect ratio**: 16:9
**Output path**: `/public/images/blog/breaking-the-silo.jpg` (existing frontmatter uses `/articles/breaking-the-silo/hero.jpg` — either path is acceptable; confirm convention before saving)
**Alt text**: An isometric grid of flat navy tiles connected by a single electric-blue line, with three warm-orange tiles sitting unconnected to the upper right.

**Piece-specific note**: The "unjoined cluster" reading must be
unambiguous — review candidates for whether the warm-orange tiles
read as deliberately separate, not just a different color.

---

## the-ai-readiness-gap

**Source**: `content/blog/2026-03-01-the-ai-readiness-gap.mdx`
**Argument the hero should evoke**: AI is not the bottleneck — the
data architecture underneath it is. The IQ Stack sequence (Data →
Memory → Inference) is what closes the gap.
**Concept**: A staircase of three rising blocks where the lower two
are partially formed (dashed outline, half-filled) and the top sits
solid and confident — an inference layer attempting to stand on
incomplete foundations. The image carries "missing structural rungs,"
not "speed lines."

**Prompt (paste-ready)**:

> Minimalist geometric vector illustration, deep navy background
> (#0A0A0A radiating to #1A1230 in the upper-left). An abstract
> composition of three rising stepped blocks ascending from lower
> right to upper left in 2.5D isometric projection: the bottom block
> rendered as a dashed-line outline only (incomplete), the middle
> block half-filled in muted slate, and the top block solid and
> confident in electric-blue (#000BFF), suggesting an inference layer
> sitting on incomplete foundations. Subtle copper-gold highlight
> (~#CB9959) along one edge of the top block. Centered composition
> with generous negative space upper-right and lower-left, 16:9
> landscape, flat 2.5D vector with subtle paper grain, editorial
> illustration in the McKinsey Quarterly / Harvard Business Review
> house style. No text, no people, no UI panels, no neural network
> mesh, no glowing brain, no robotic hands, no futuristic HUD, no
> data particles, no light streaks, no speed lines, no Microsoft
> logos, no photo-real 3D renders, no clip-art.

**Style preset**: minimalist geometric, navy + electric-blue + copper-gold, 2.5D isometric stair
**Aspect ratio**: 16:9
**Output path**: `/public/images/blog/the-ai-readiness-gap.jpg` (or keep `/articles/the-ai-readiness-gap/hero.jpg`)
**Alt text**: A three-step rising stair on a navy field, with the bottom step rendered as a dashed outline, the middle half-filled, and the top step solid in electric blue.

**Piece-specific note**: The dashed-outline-vs-solid contrast is what
carries meaning. DALL-E 3 follows "dashed outline" instructions more
reliably than Midjourney; if Midjourney loses the contrast, switch
generators rather than retry seeds.

---

## your-legal-data-belongs-to-you

**Source**: `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx`
**Argument the hero should evoke**: Sovereignty is structural, not
contractual. The security perimeter and the data boundary should be
the same boundary.
**Concept**: A single solid form held entirely inside a larger,
clearly-drawn perimeter. Containment without walls — geometric
boundary, not literal vault, not literal lock.

**Prompt (paste-ready)**:

> Minimalist geometric vector illustration, deep navy background
> (#0A0A0A to #0A0A14 gradient with a faint #1A1230 wash in the
> upper-right). A single confident geometric perimeter — a hexagon
> drawn in a thin Spaarke-blue line (#000BFF) at roughly two-thirds
> the frame width, centered — with a smaller solid hexagonal form in
> muted CTA-blue (#4060DC) held precisely at center inside it,
> visualizing data held cleanly inside its own boundary. Faint
> magenta glow halo (#FF4DCB at 12% opacity) along the perimeter's
> outer edge. Centered composition, 16:9 landscape, generous negative
> space outside the perimeter, flat 2.5D vector with subtle grain,
> editorial illustration in the McKinsey Quarterly / Harvard Business
> Review house style. No text, no people, no padlocks, no vaults, no
> shields, no chain links, no UI panels, no neural network mesh, no
> robotic hands, no futuristic HUD, no data particles, no Microsoft
> logos, no gavels, no photo-real 3D renders, no clip-art.

**Style preset**: minimalist geometric, deep-navy + Spaarke-blue perimeter + CTA-blue core, faint magenta halo
**Aspect ratio**: 16:9
**Output path**: `/public/images/blog/your-legal-data-belongs-to-you.jpg` (or keep `/articles/your-legal-data-belongs-to-you/hero.jpg`)
**Alt text**: A thin Spaarke-blue hexagonal perimeter on a deep navy field, holding a smaller solid CTA-blue hexagon precisely at its center.

**Piece-specific note**: First-choice generator is Adobe Firefly for
this image — sovereignty-themed material is most likely to be reused
in white papers and external decks where Firefly's commercial-safety
matters.

---

## what-attorneys-need-to-know-about-ai

**Source**: `content/blog/2026-02-15-what-attorneys-need-to-know-about-ai.mdx`
**Argument the hero should evoke**: Three architectural decisions
matter — *where* the AI runs, *what* grounds its outputs, *what* it
actually costs. Three questions held simultaneously, not features.
**Concept**: Three vertical bars of equal height — a
typographic-feeling triad reading as columns or pillars without being
literal columns. The eye lands on the middle bar (the brand accent),
then registers the symmetric two on either side.

**Prompt (paste-ready)**:

> Minimalist geometric vector illustration, deep navy background
> (#0A0A0A radiating to #2D1F5E in the lower band). An abstract
> typographic-feeling composition: three vertical bars of equal
> height, evenly spaced across the centered band of the frame, the
> outer two rendered in muted slate with a subtle copper-gold edge
> highlight (~#CB9959), the middle bar rendered as a solid confident
> electric-blue (#000BFF) with a faint soft-purple glow halo
> (#7B5BFF at 15% opacity) — three architectural decisions held
> together as a triad. Each bar is a clean rectangle, no serifs, no
> typographic detail. Centered focal point, 16:9 landscape, generous
> negative space above and below the bars, flat 2.5D vector with
> subtle grain, editorial illustration in the McKinsey Quarterly /
> Harvard Business Review house style. No text, no people, no UI
> panels, no neural network mesh, no robotic hands, no futuristic
> HUD, no data particles, no glowing brain, no Microsoft logos, no
> gavels or scales, no Greek columns, no photo-real 3D renders, no
> clip-art.

**Style preset**: minimalist typographic triad, deep-navy + Spaarke-blue center + copper-gold edges
**Aspect ratio**: 16:9
**Output path**: `/public/images/blog/what-attorneys-need-to-know-about-ai.jpg` (or keep `/articles/what-attorneys-need-to-know-about-ai/hero.jpg`)
**Alt text**: Three evenly-spaced vertical bars on a deep navy field, the outer two in muted slate with copper-gold edges and the middle one in confident electric blue with a faint purple glow.

**Piece-specific note**: Watch generators for adding spurious serif
or character detail to the bars — a clean rectangle is what's wanted.
If output reads as type, lower stylize and re-prompt.

---

## institutional-knowledge

**Source**: `content/blog/2026-03-14-institutional-knowledge.mdx`
**Argument the hero should evoke**: Knowledge is not the documents —
it's the context behind them, the rationale that walks out the door
when the senior practitioner leaves. Operational memory makes that
context durable.
**Concept**: A series of nested concentric rings, each a different
line weight, with the outer rings thinning toward the edge of the
frame — accumulated layers of institutional context. Reads as "tree
rings" or "strata" without being either literally.

**Prompt (paste-ready)**:

> Minimalist geometric vector illustration, deep navy background
> (#0A0A0A fading radially to #2D1F5E at the corners). An abstract
> emblem of accumulated layers: seven concentric rings of varying
> line weight centered in the frame, the innermost a small solid
> disc in confident electric-blue (#000BFF), the next two rings
> rendered in CTA-blue (#4060DC) at decreasing weight, the outer
> four rings in muted slate at progressively thinner weight, with
> the outermost ring barely visible — visualizing institutional
> memory as accumulated, layered, durable context. Faint copper-gold
> highlight (~#CB9959) at one point on the second-innermost ring.
> Centered focal point, 16:9 landscape, generous negative space
> outside the outermost ring, flat 2.5D vector with subtle grain,
> editorial illustration in the McKinsey Quarterly / Harvard Business
> Review house style. No text, no people, no UI panels, no neural
> network mesh, no glowing brain, no robotic hands, no futuristic
> HUD, no data particles, no Microsoft logos, no gavels or scales,
> no actual tree imagery, no photo-real 3D renders, no clip-art.

**Style preset**: minimalist concentric rings, deep-navy + Spaarke-blue core + slate strata + copper accent
**Aspect ratio**: 16:9
**Output path**: `/public/images/blog/institutional-knowledge.jpg` (or keep `/articles/institutional-knowledge/hero.jpg`)
**Alt text**: Seven concentric rings of progressively thinner weight on a deep navy field, with a solid Spaarke-blue disc at the center and a small copper-gold highlight on one ring.

**Piece-specific note**: This composition pairs visually with
`what-is-legal-operations-intelligence` (tree rings), so a ComfyUI
brand LoRA trained on the four strong heroes will pull this one
toward the existing house aesthetic. Mid-stylize on Midjourney
(`--s 100`) reads cleanest.

---

## the-20b-blind-spot

**Source**: `content/blog/2026-03-07-the-20b-blind-spot.mdx`
**Argument the hero should evoke**: Legal spend is the last major
corporate function operating without a dashboard — visible to the
function but opaque to everyone else. The piece is about a missing
operational view, not about money. No dollar signs, no coins, no cash.
**Concept**: A clean geometric grid of small filled cells covering
most of the frame, with a single rectangular region in the upper-third
where the cells are *absent* and the dark navy ground shows through —
a missing tile in an otherwise complete pattern. The void is the
visualization.

**Prompt (paste-ready)**:

> Minimalist geometric vector illustration, deep navy background
> (#0A0A0A to #0A0A14 gradient). An abstract composition: a clean
> orthogonal grid of small filled tiles in muted CTA-blue (#4060DC)
> and slate, covering most of the frame, rendered in flat 2.5D
> isometric projection — except for a single clean rectangular
> region in the upper-third-left where the tiles are absent and the
> dark navy ground shows through, visualizing a missing operational
> view inside an otherwise complete pattern. The empty region's edge
> is traced in a thin confident electric-blue line (#000BFF) so the
> void reads as deliberate, not unfinished. Off-center upper-left
> composition with generous negative space lower-right, 16:9
> landscape, flat 2.5D vector with subtle paper grain, editorial
> illustration in the McKinsey Quarterly / Harvard Business Review
> house style. No text, no people, no dollar signs, no money, no
> coins, no charts, no UI panels, no dashboards, no neural network
> mesh, no robotic hands, no futuristic HUD, no data particles, no
> Microsoft logos, no gavels or scales, no photo-real 3D renders,
> no clip-art.

**Style preset**: minimalist geometric, navy + CTA-blue tile field + electric-blue void edge
**Aspect ratio**: 16:9
**Output path**: `/public/images/blog/the-20b-blind-spot.jpg` (or keep `/articles/the-20b-blind-spot/hero.jpg`)
**Alt text**: An isometric grid of muted CTA-blue tiles on a deep navy field, with a single clean rectangular region in the upper-left where the tiles are absent and the dark ground shows through, traced by a thin electric-blue line.

**Piece-specific note**: The negative-space-as-subject composition is
DALL-E 3's strongest mode — first-choice generator. If SDXL fills
the void on ComfyUI runs, switch to FLUX or pin a stronger
negative-prompt weight.

---

## A note on workflow

These prompts are starting points, not final answers. If a generated
candidate doesn't match the visual identity (`voice/visual-identity.md`
§2 and §5 are the binding sections), refine the prompt rather than
picking the closest near-miss. When you find a refinement that works,
update the prompt entry in this file so the next round benefits from
it. Save the picked image to the documented output path and update
the article's `heroImage` frontmatter only if the path changes — most
existing files reference `/articles/<slug>/hero.jpg`, which is also
acceptable and matches the convention used by the four strong heroes.
