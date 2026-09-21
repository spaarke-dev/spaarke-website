---
slug: legal-operations-ontology
type: blog-post
publish_date: 2026-10-06            # Tuesday; see Unresolved — could pull to 2026-09-29 inside the Aug–Sep campaign
channels: [website, linkedin]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: high                      # first public expression of the ontology frame; time-sensitive vs. "context graph" market framing
audience: legal-ops-director        # primary; legal-tech-cio secondary; corporate-counsel as sanity check
length_target: 1500                 # words; range 1,400–1,700 if the worked example needs room
byline: spaarke                     # positioning piece → organizational byline per voice/bylines.md §1
campaign: none                      # standalone for now — see Unresolved; candidate anchor for the 2026-Q4 campaign
triggered_by: Ontology-centric platform strategy synopsis v2.0 (Ralph / Claude working session, 2026-09-19)

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: What an ontology does for legal operations
description: A legal operations ontology models the objects a department runs on, how they connect, and what may be done to them. Why it matters more than the model on top.
summary: Every legal department has a matter table, a document repository, and an invoice feed. None of them records what the department decided to do. A legal operations ontology does — and that record, not the AI reading it, is the asset.
date: 2026-10-06
author: spaarke
tags:
  organization: [corporate-legal]
  function: [operations, it, executive]
  topic: [matter-management, workflow, legal-spend, compliance]
  theme: [legal-operations-intelligence, operational-memory, platform, iq-stack]
heroImage: "/articles/legal-operations-ontology/hero.svg"
heroImagePosition: "center"
draft: true
keyTakeaways:
  - An ontology is not a data model with a better name. It defines the objects a legal department runs on, the links between them, and the actions that may be taken against them, under rules.
  - Everyone has a matter table. The defensible asset is the links — the email thread to the matter, the invoice line to the budget, the clause to the obligation, the department's matter to the firm's.
  - A warehouse records what happened to the business. An ontology records what the organization decided to do about it, who authorized it, and on what evidence. That record compounds.
  - Models are rented and interchangeable. The semantic work of teaching a system what a matter, an obligation, and a policy mean in your department is not. That is where the switching cost lives.
  - A legal ontology is constraint-dominated — privilege travels with the object, counterparty paper is an adversarial source, and ethical walls partition the graph. Generic enterprise models have none of this.
---

# Topic

An overview of what an *ontology* is when applied to a Legal Operations
Intelligence platform: the model of the objects a legal department runs
on (matter, project, invoice, request, document, communication,
obligation, policy), the links between them, and the governed actions
that may be taken against them. The piece introduces the term to a
legal-ops reader who has heard "data model," "knowledge graph," and
"context graph" and needs to know why this one is different and why it
matters more than whichever AI model sits on top.

# Angle / Point of view

`the-ai-readiness-gap` argued that the tool is not the bottleneck, the
data architecture is. This piece names what that architecture has to
be. The reader should walk away believing three things:

1. **A table is not an ontology.** An ontology is objects *plus* links
   *plus* permitted actions *plus* the rules that govern them. The
   links are the asset — everyone has a matter table; almost nobody has
   the email thread bound to the matter, the invoice line bound to the
   budget, or the department's matter bound to the firm's.
2. **The unit of value is a governed decision, not a report.** A
   warehouse with dashboards records what happened. An ontology records
   what the organization decided to do about it — who acted, under
   which policy, on which facts — and that record is what compounds
   across 200 matters and four quarters into something no dashboard
   can produce.
3. **Models are rented; the ontology is owned.** Switching AI vendors
   is configuration. Rebuilding the semantic layer that makes a
   department's data intelligible is years of work. In a market where
   every department runs several AI tools at once, the durable asset is
   the layer that makes all of them mean the same thing.

What Spaarke pushes back on: the idea that a context graph over
documents *is* the ontology (it is document-centric by construction and
will never hold intake, spend, or disposition), and the idea that
operational intelligence comes from a warehouse plus BI. Neither
captures the decision. The ontology is the Data and Memory layers of
the Legal IQ stack given structure — it is what lets Inference read
over a record instead of a pile.

# Why now

- **Multi-tool is the steady state.** The ILTA 2026 Technology Survey
  (14 Sep 2026; 500+ firms) found nine separate AI tools above 50%
  pilot adoption and only two above 50% full deployment; the largest
  firms run three or more assistants concurrently. **TBD — confirm**
  the exact figures against the ILTA primary source (the synopsis cites
  a LawNext summary). CLOC's 2026 State of the Industry reports 85% of
  legal departments now have dedicated AI resources or committees
  (**TBD — confirm**). Thomson Reuters' 2026 Future of Professionals
  report warns of a widening gap between AI adoption and realized value
  (**TBD — confirm** phrasing). Read together: departments do not need
  another way to draft a clause; they need the layer that governs,
  routes, and measures the tools they already bought.
- **"Context graph" has entered the legal vocabulary** since May 2026,
  and it is a document-centric frame. Our LinkedIn post
  `context-is-only-one-layer` planted the counter-position in a
  paragraph; the library has no long-form piece that says what the
  broader structure actually is. This fills that gap.
- **Library gap.** Sixteen articles argue for unified data and
  operational memory; none names the model that unified data has to
  take. This is the missing foundational piece between `the-iq-stack`
  and `probabilistic-vs-deterministic`.

# Must include

- **A patient build to the definition.** Do what
  `what-is-legal-operations-intelligence` did: open with a specific
  scene, show the gap, and only then name the term. Working definition
  the reader can carry: *an ontology is the model of the things a legal
  department runs on, how they relate to each other, and what may be
  done to them, under rules the department wrote.*
- **The three parts, in order: objects, links, actions.**
  - *Objects.* A spine of matter, project, and invoice that everything
    else connects to; operational objects around them — request,
    document, communication, party, engagement, timekeeper, obligation,
    deadline, clause, budget, policy. Two deserve a sentence each:
    **policy** as a first-class object (OCG rules, triage rules, SLA
    definitions, delegation thresholds are the same thing — legal-
    authored, versioned, deterministically evaluable) and
    **obligation** as a first-class object (extracted from documents,
    linked to parties and dates, changing status over time).
  - *Links.* The line "everyone has a matter table; the links are the
    asset." Name the edges concretely: communication → thread → matter;
    invoice line → timekeeper → activity code → matter → budget;
    document → clause → obligation → party → date; request → matter;
    and the engagement edge — the department's matter bound to the
    firm's matter, which no document- or billing-centric model holds.
  - *Actions, with gates.* Actions are bound to objects and carry
    authority (who, under which delegation policy) and provenance
    (which rule, which policy version, which evidence, which human
    confirmed). Describe the release envelope as green auto-release,
    yellow confirm, red counsel review. This is "AI-directed,
    human-controlled" expressed as structure rather than slogan.
- **The worked example, run twice.** *"This matter is running over
  budget; ask outside counsel to investigate."* First as warehouse +
  BI: a report shows variance; someone opens it, switches to Outlook,
  writes from memory, gets a reply in two days, notes it in a
  spreadsheet; next quarter the system knows nothing more. Then through
  the ontology: variance computed deterministically as a **fact** with
  provenance; a **policy** evaluates it into an **observation** linked
  to matter, invoice lines, and engagement; a proposed **budget
  inquiry** action, gated; the reply classified back onto the inquiry
  thread; a typed outcome (write-off, accrual revision, approved scope
  change, no action). Nothing wrote to the e-billing system. Across 200
  matters and four quarters, that history is the outside-counsel
  report card — which exists only because the intervention was captured
  as an object.
- **The landing line for that section:** *A warehouse records what
  happened to the business. An ontology records what the organization
  decided to do about it — and that record is the asset.*
- **Fact / observation / inference as three epistemic classes**, with
  the rule that facts are computed deterministically — no model call
  produces the variance. Link to `probabilistic-vs-deterministic` as
  the piece that explains why that split matters. (**TBD — confirm**
  that fact / observation / inference is approved public vocabulary;
  see Unresolved.)
- **Why a legal ontology is not a generic enterprise one.** Five
  structural differences, each one sentence: privilege and work product
  are object attributes that travel with the object, not access rules;
  the document is frequently the record itself, not a description of
  it; counterparty paper is an adversarial source and extracted values
  carry a different trust class; rule density is extreme (OCG, billing
  guidelines, retention, ethical walls, delegation) — legal's ontology
  is constraint-dominated where generic ones are constraint-sparse; and
  ethical walls partition the graph, not just the rows.
- **Where the ontology sits relative to the systems already in place.**
  The document management system owns documents; the e-billing platform
  owns invoices. The ontology references what it does not own and
  originates the process objects nobody owns — the request, the
  disposition, the obligation, the policy, the inquiry, the action
  record. State it as a principle: *originate the workflow, reference
  the record.* (**TBD — confirm** this is approved public positioning;
  it is a change from the consolidation framing in
  `spaarke-for-your-it-team`. See Unresolved.)
- **Freshness and provenance shown, not hidden.** One sentence of the
  form: *"This obligation was inferred from a contract indexed four
  hours ago and confirmed by counsel on the 8th"* — the kind of answer
  a department can defend.
- **The Legal IQ stack used structurally, not name-checked.** The
  ontology is what the Data and Memory layers are made of; Inference
  reads over it. One paragraph, linking to `the-iq-stack`; do not
  restate that article.
- **Cross-links (2–3 in body, 1 in CTA):**
  `/why-spaarke/the-iq-stack`, `/why-spaarke/probabilistic-vs-deterministic`,
  `/why-spaarke/what-is-legal-operations-intelligence` (once, near the
  definition). CTA to `/platform` or `/why-spaarke/institutional-knowledge`.
- **One supporting diagram** (the argument is structural — per
  `content-types/blog-post.md` §4 this is required): the spine objects
  with operational objects around them and three or four labeled
  example edges. Original SVG in the visual-identity palette, abstract,
  no product UI. Alt text a real sentence.

# Must NOT include

- **Anything from the internal roadmap or component model.** No binding
  modes as a commercial claim ("start where you are, move when you
  want"), no waves, no bootcamp, no pricing, no Phase 0, no layer
  numbers (L0–L6), no entity or service names (`sprk_*`,
  `MatterResolutionService`), no connector manifest, no MCP server
  plans, no open-decision register. This is a concept piece, not a
  design disclosure.
- **Microsoft platform build-vs-buy commentary.** No Foundry IQ vs.
  hand-built retrieval, Work IQ, Agent 365, Entra Agent ID, Agent
  Framework vs. Semantic Kernel, SharePoint Embedded SDK, or the Legal
  Agent for Word overlap. None of it belongs in a reader-facing
  overview and several items are unverified.
- **Competitor or vendor names.** No Harvey, Legora, iManage,
  NetDocuments, CoCounsel, LexisNexis, Claude for Legal, Astra for Law,
  or the Microsoft legal-department anecdote. Cite the surveys in
  aggregate; the brand frame is implicit, not sideways.
- **The Palantir business model.** No forward-deployed engineers, no
  bootcamp conversion rates, no services-ratio figures, no "adopt
  Palantir's model" framing. (One neutral mention of Palantir as where
  the term became familiar in enterprise software is allowed — see
  Voice notes — but nothing about how the company sells.)
- **Consolidation or replacement framing.** Do not claim Spaarke
  replaces the DMS or the e-billing platform, and do not reuse "no
  separate DMS to license" from `spaarke-for-your-it-team`. The
  synopsis retires that posture; this piece should not reintroduce it.
- **Open architectural questions presented as fact.** Bitemporality,
  identity resolution across systems, and edge-storage decisions are
  unresolved internally. If the draft needs the two-clocks idea (when
  something was true vs. when it was known), state it as a requirement
  legal places on the model, not as a shipped capability.
- **Do-not-say list items lifted from the synopsis.** The synopsis uses
  "one-click confirm" — write "a single confirmation" or "yellow
  confirm." No "transform," "seamless," "AI-powered," "robust,"
  "unlock," "leverage," "ecosystem" (when "set of tools" works), no
  exclamation points, no rhetorical-question headings.
- **A restated body of `the-iq-stack` or `probabilistic-vs-deterministic`.**
  Reference and link; do not replicate.
- **Demo CTA.** The close points to substance.
- **AI-tell openers, hedging, and self-congratulation** per
  `voice/examples/avoid-this.md`.

# References

Internal (link from the draft):

- [The Legal IQ Stack: Data, Memory, Inference](/why-spaarke/the-iq-stack) —
  the ontology is the structure of the Data and Memory layers; link where
  the stack is invoked.
- [Legal AI Is Not Deterministic — And That Matters](/why-spaarke/probabilistic-vs-deterministic) —
  the deterministic-facts / probabilistic-inference split behind the
  fact / observation / inference classes.
- [What Is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence) —
  category definition; cite once near the working definition.
- [Institutional Knowledge Is Walking Out the Door](/why-spaarke/institutional-knowledge) —
  the operational-memory case; candidate CTA target.
- [The AI Readiness Gap in Legal Departments](/why-spaarke/the-ai-readiness-gap) —
  "the tool is not the bottleneck, the data architecture is"; this piece
  is the sequel. Optional link.
- `articles/context-is-only-one-layer/` — the LinkedIn post that planted
  the "context graph is one layer" counter-position. Do not link
  (LinkedIn); use for continuity.
- `/platform` — CTA candidate for the reader who wants to see the
  objects and actions in product.

External (every named number needs one; all figures **TBD — confirm**
against the primary source before publish):

- ILTA 2026 Technology Survey — nine tools above 50% pilot adoption,
  two above 50% full deployment; 94% using or exploring generative AI.
  Trade summary: https://www.lawnext.com/2026/09/which-ai-product-is-most-popular-among-law-firms-findings-of-iltas-tech-survey-may-surprise-you.html
  — locate and cite the ILTA primary.
- CLOC 2026 State of the Industry (2 Mar 2026) — 85% of departments
  with dedicated AI resources or committees.
  https://cloc.org/blog/soti/clocs-2026-state-of-the-industry-report-benchmarking-data-is-the-compass-for-legal-operations-to-navigate-change/
- Thomson Reuters Future of Professionals (Jun 2026) — gap between AI
  adoption and realized value.
  https://www.lawnext.com/2026/06/thomson-reuters-future-of-professionals-report-warns-of-widening-gap-between-ai-adoption-and-ai-value.html
  — locate the TR primary.
- ACC / Everlaw GenAI report (Oct 2025, 657 in-house professionals) —
  52% actively using GenAI; 64% plan to rely less on outside counsel.
  Optional; use only if the draft needs an in-house adoption figure.
  https://www.acc.com/about/newsroom/news/acc-genai-report-corporate-law-departments-ai-use-everlaw
- Palantir ontology concept — if the one neutral mention is kept, cite
  Palantir's own product documentation for the ontology concept, not a
  third-party blog. **TBD — confirm** URL.
- `voice/domain-knowledge.md` and `voice/research-sources.md` for any
  additional CLOC / ACC framework citation.

Companion pieces (not written here): a LinkedIn syndication (company
page, organizational byline) and a founder-voice post picking up the
"the record is the asset" line. Track separately in the calendar.

# Voice notes

- **Register.** Operator explaining a system to another operator.
  Closer to `the-iq-stack` and `probabilistic-vs-deterministic` than to
  the trade press. Read both openings for cadence before drafting.
- **Build to the term.** Do not open with "An ontology is…". Open on
  the budget-variance scene or on "everyone has a matter table," and
  let the reader feel the gap before the word arrives. The definition
  lands at the end of the first H2, not the first paragraph.
- **The worked example carries the argument.** It should be the
  longest section and the most concrete. Typed outcomes, named objects,
  no abstractions. "200 matters" is a library motif; use it.
- **On Palantir.** The term is familiar in enterprise software because
  of Palantir Foundry. One neutral clause acknowledging that is
  acceptable if it helps the reader place the concept ("the approach
  Palantir made familiar in defense and manufacturing"). Nothing about
  their commercial model, and no comparison of Spaarke to Palantir.
  If the sentence feels like name-dropping, cut it.
- **Vocabulary.** "Legal professionals" / "the legal team" for shared
  operational work, "counsel" where the act is attorney-only (red-gate
  review). "Outside counsel," not "external counsel." "E-billing
  platform." "Operational memory" is our term for the layer; use it
  once where the stack is invoked.
- **Headings** are sentence-case statements. Candidate H2 set for the
  plan (merge if two only need a paragraph): *Everyone has a matter
  table* · *The links are the asset* · *Actions belong on objects,
  with a gate* · *Why a legal ontology is not a generic one* · *Models
  are rented; the ontology is owned*.
- **Images.** Hero SVG (below) plus one supporting diagram of the
  object spine and example edges. Both abstract, both in the
  visual-identity palette. No product screenshots.
- **CTA.** Contextual to a legal-ops reader: point to `/platform` or
  the institutional-knowledge piece. No contact form.

# Hero graphic

**Concept** (SVG-via-Claude, default per `voice/visual-identity.md` §6):

An abstract graph rendered as disciplined geometry. Three heavier
nodes — small hexagons in `#4D4890` with a `#7B5BFF` stroke — form a
loose triangle just left of center, standing in for the spine. Around
them, eight to ten smaller circles in `#3D3B72` with `#4060DC` strokes,
connected by hairline edges in `#A8C2FF` at 80% opacity. One edge,
running from the spine out to a lone node at far right, is drawn
heavier in Spaarke Blue `#000BFF` — the engagement edge, the one link
nobody else holds. A soft `#7B5BFF` halo at 24% opacity sits behind
the spine triangle. Background: radial gradient `#34325E → #23224A →
#161630`, centered 50%/55%. Generous negative space upper-right so the
title reads cleanly. Focal element stays in the center band to survive
the 21:9 crop.

**Prompt** (paste-ready if a raster generator is used instead):

Minimalist geometric vector illustration, deep navy radial background
(#34325E center fading to #161630 edge). An abstract network of small
geometric nodes: three slightly larger hexagons forming a loose
triangle left of center, surrounded by eight to ten small circles,
joined by fine light-blue hairlines (#A8C2FF). One single edge drawn
heavier in electric blue (#000BFF) reaching from the triangle to an
isolated node at the far right. Soft purple glow (#7B5BFF, 24%
opacity) behind the triangle. 16:9 landscape, generous negative space
upper-right, flat 2.5D, editorial illustration in the McKinsey
Quarterly / Harvard Business Review house style. No text, no people,
no logos, no neural-network mesh, no glowing brain, no HUD panels, no
streaming data particles, no circuit-board diagonals.

**Style preset**: minimalist geometric graph, deep-navy canvas,
`#A8C2FF` hairlines, single Spaarke Blue edge, soft purple halo

**Aspect ratio**: 16:9 (default — matches `ArticleHeader.tsx`).

**Output path**: `public/articles/legal-operations-ontology/hero.svg`
(1600×900 viewBox).

**Alt text**: A constellation of small geometric nodes joined by fine
light-blue lines on a deep navy field, three heavier hexagons at the
center and a single electric-blue edge reaching out to a lone node at
the right, suggesting an ontology of connected legal objects.

**Generator notes**: SVG-via-Claude. Keep node count low (13 or fewer)
so the silhouette reads from across the room; the temptation with a
graph motif is clutter. Sibling of the `probabilistic-vs-deterministic`
hero (same canvas recipe and hairline accent) — differentiate by the
hexagon spine and the single hot edge. Produce in the polish step after
the draft is approved.

---

## Unresolved (resolve before drafting unless marked otherwise)

Blocking questions the skill would normally ask were answered with the
defaults below because the session ran unattended. Confirm or override.

- [ ] **Argument / take** — applied as stated in §Angle (a table is not
  an ontology; the governed decision is the unit of value; models are
  rented, the ontology is owned). Confirm this is the take.
- [ ] **Primary audience** — `legal-ops-director`, with `legal-tech-cio`
  secondary. Alternative: `corporate-counsel` primary if the piece
  should read as a category/strategy piece rather than an
  operating-model piece.
- [ ] **Campaign** — set to `none`. Options: (a) publish 2026-09-29
  inside `2026-08-operating-model-and-spend` (theme fits; window ends
  2026-09-30; tight for outline → draft → review); (b) hold for
  2026-10-06 as the opening piece of the not-yet-created 2026-Q4
  campaign; (c) standalone. Recommendation: (b).
- [ ] **Positioning change** — "originate the workflow, reference the
  record" and "sits above the DMS and e-billing platform" are not yet
  in `voice/brand-positioning.md` or `voice/product-knowledge.md`, and
  `spaarke-for-your-it-team` still carries consolidation framing.
  Confirm this piece may be the first public expression; if yes, log a
  separate task to update the two voice docs.
- [ ] **Fact / observation / inference** as public vocabulary — used in
  internal doctrine; confirm it may appear in reader-facing copy.
- [ ] **Title** — "What an ontology does for legal operations" is the
  working title. Alternates: "The legal operations ontology: objects,
  links, and governed actions"; "Legal operations needs an ontology,
  not another dashboard."
- [ ] **Palantir mention** — include the one neutral clause, or omit.
- [ ] **Source material location** — the synopsis lives on the Desktop,
  outside the repo. Decide whether to copy it into this workspace
  (it contains internal strategy and unverified market claims) or
  keep it external and rely on this brief.
- [ ] **TBD — confirm** every external figure in §References against
  its primary source before the draft cites it. (Can wait for the
  polish gate.)
