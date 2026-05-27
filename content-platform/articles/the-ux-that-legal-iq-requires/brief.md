---
slug: the-ux-that-legal-iq-requires
type: blog-post
publish_date: TBD                     # standalone — no campaign-driven date
channels: [website, linkedin]         # blog + LinkedIn syndication
status: brief                         # brief | outline | draft | review | scheduled | published
priority: normal
audience: legal-ops-director          # primary; corporate-counsel + legal-tech-cio secondary (see Voice notes)
length_target: 1800                   # words; high end of blog range — six patterns + three surfaces
byline: spaarke                       # organizational
campaign: none                        # standalone

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: The UX That Legal IQ Requires
description: Conversational AI alone doesn't meet the UX expectations Legal IQ requires — across AI outputs and deterministic ones like reports and search.
summary: |
  Conversational AI was the right starting point for attorney drafting and document Q&A — but Legal IQ embedded in a system of record needs more. The shift is from passive viewing to active engagement with information, across AI outputs and deterministic ones alike.
date: TBD                             # set at scheduling gate
posted:                               # optional — separate from date if backdating
author: spaarke
tags:
  organization: [corporate-legal]
  function: [attorney, operations, it, executive]
  topic: [ai-copilot, workflow, matter-management, reporting]
  theme: [ai-strategy, iq-stack, platform, buyer-enablement]
heroImage: /articles/the-ux-that-legal-iq-requires/hero.svg
heroImagePosition: center
draft: true
keyTakeaways:
  - Users now expect to interact with enterprise systems differently — across AI outputs and deterministic ones like reports, search, and workflows. The shift is from passive viewing to active engagement.
  - First-generation generative AI made conversation the primary UX — and that was right for tasks like attorney drafting and document Q&A. Embedded enterprise AI needs more than that.
  - Adding a conversational side pane to an existing application does not embed AI into the system, and does not meet the new UX expectations.
  - The new patterns work across AI-derived and deterministic outputs alike — active interaction, multi-modal intent capture, grounding and provenance, action from insight, and cross-surface continuity.
  - Spaarke organizes Legal IQ around three coordinated surfaces — Assistant, Workspace, and Context — plus inline AI inside content. Not one surface that does everything.
featured: false
---

# Topic

Users now expect to interact with enterprise systems differently —
across both AI-derived outputs and deterministic ones like search,
reports, and workflows. Legal IQ — AI inference embedded in a
system of record — is the situation where this matters most for
legal practice, and meeting those UX expectations requires more
than adding a conversational surface to an existing application.

# Angle / Point of view

First-generation generative AI made conversation the primary UX,
and that is right for tasks like attorney drafting, document
Q&A, and exploratory research — where natural-language input
matches the work. But embedding AI inference into a system of
record changes what the UI is *for*, and bolting a conversational
surface onto a forms-and-clicks application does not embed AI or
meet the new expectations. The reader walks away believing: Legal
IQ requires a different UX, organized around active engagement
with information — drilling, pivoting, asking follow-ups, acting
on insight in place, with grounding and provenance visible — and
that this expectation now applies to deterministic outputs (search,
reports, workflows) as much as to AI outputs. Spaarke is building
exactly that, structured around three coordinated surfaces
(Assistant, Workspace, Context) plus inline AI inside content and
continuity across surfaces.

# Why now

A wave of "AI-native" demos is hitting the legal market — most of
them conversational interfaces dropped on top of existing
applications. Attorneys, legal-ops leaders, and IT leaders are
being asked to evaluate them, often without vocabulary for what's
missing. This piece gives them that vocabulary. It also picks up
the thread from [Legal AI Is Not Deterministic — And That
Matters](/blog/probabilistic-vs-deterministic) (2026-05-21), which
established that AI inference is probabilistic and that tools must
make that visible. This piece argues the broader UX consequences —
not just for probabilistic outputs, but for how users now expect
to engage with enterprise legal software generally.

# Must include

The piece has a defined structural payload. Each item is required
unless the outline gate explicitly drops it with sign-off.

## The opening move

- A specific observation about the current legal-AI demo landscape
  (chat-first surfaces shown as "AI-native") — operator-to-operator
  register, no generic AI-tell opener.
- The frame: this is a UX problem, not a UI problem; users now
  expect a different experience, not just a different interface.

## The terminology aside (short, plain-language)

A single short section defining UX vs UI in plain industry terms:

- **UX** — how the user and the system collaborate: interaction
  patterns, modalities, feedback, the experience over time.
- **UI** — the visible surface: visual design and the controls
  through which UX is delivered.

Define cleanly once, then use both terms with discipline. Not an
academic lecture — three or four sentences total.

## The five-section structural argument

The body H2 sections, in order:

1. **The generational shift, and the gap that gets diagnosed
   wrong.** AI is a generational software shift; most of the
   industry diagnoses the gap as a UI problem. The deeper problem
   is UX — interaction design, not visual design.

2. **Conversation was the right first move — for the tasks it
   was best at.** Attorney drafting, document Q&A, exploratory
   research. Natural-language input matches the work; output is
   meant to be read or refined; a conversation thread is the
   easiest way to show what a language model can do. This is
   acknowledged, not critiqued.

3. **Adding a conversational side pane does not embed AI into
   the system.** A conversation panel bolted onto a forms-and-
   clicks application leaves the underlying interaction
   structure unchanged. The user still fills forms, still pages
   through queues, still hunts through tabs for the records that
   ground the answer. Calling that "AI-native" is the
   marketing-led error.

4. **The bigger UX shift: active engagement with information.**
   This is the driver. Users now expect to interact with reports,
   search results, workflows, matter lists, dashboards — not just
   read them. The shift is broader than AI; AI accelerates it.

5. **Legal IQ makes the shift concrete in legal practice.** The
   Legal IQ stack (Data → Memory → Inference) is what we mean by
   AI embedded in a system of record: the inference layer reasons
   *over* the deterministic record layer, on the same surface.

## The six UX patterns (the structural payload)

Each pattern is an interaction-level requirement first; the UI
consequences follow. Each needs both a deterministic and a
probabilistic example *except* pattern 4, which is probabilistic-
specific.

1. **Active interaction over passive viewing.** From any system-
   derived view, the user can pivot, drill, filter, ask a
   follow-up, or change the lens without leaving the surface.
   - Deterministic: a matter list refined by "show only matters
     with budget overruns this quarter" via natural language; a
     Power BI-style report drilled to the firms driving a number.
   - Probabilistic: an AI-summarized matter where the user can
     ask "what's the basis for this?" and pivot to the underlying
     documents.

2. **Multi-modal intent capture.** How the user expresses what
   they want depends on the task — sometimes a form, sometimes a
   structured query, sometimes a natural-language sentence,
   sometimes a selection. UI consequence: input affordances are
   picked per task, not forced into one universal surface.

3. **Grounding and provenance for every system output.** From any
   insight the system surfaces, the user can step to what
   produced it.
   - Deterministic: a billing report aggregation drillable to the
     invoices behind it; a workflow decision traceable to the OCG
     rule that fired.
   - Probabilistic: an AI classification with the documents that
     grounded it, reachable in one step.

4. **Inference vs facts, visibly distinguished** *(probabilistic-
   specific).* The user can tell at a glance which parts of a
   record are deterministic facts and which are AI inference.
   Consistent visual treatment distinguishes the two, with
   confidence cues for the inferred parts.

5. **Action from insight, in place.** When the user sees
   something that warrants action, the action is one step from
   the surface that showed it.
   - Deterministic: an exception in a workflow queue resolved
     inline.
   - Probabilistic: an AI-flagged OCG concern accepted,
     rejected, or escalated without leaving the invoice.

6. **Cross-surface continuity.** Actions and context carry across
   the surfaces the user moves between. A matter pinned in one
   view stays present in the next; a search refined in one place
   is recognized in another. Applies to deterministic surfaces as
   much as to AI ones.

## The "how Spaarke is building this" section (§7)

Concreteness level **(b)** — conceptual + named product
capabilities, no screenshots. Land each surface as a UX concept,
then ground it with real Spaarke product capabilities so the
section is concrete rather than abstract. *Do not* name internal
code paths, technical implementation details, or project
codenames.

- **The Assistant surface.** Conversational AI — natural-language
  access, exploratory questions, drafting, intent capture. The
  inheritor of the first-gen pattern, kept where it actually
  works. Named capabilities to ground: matter Q&A, find-similar,
  summarization, drafting, the Copilot-native experiences in
  Microsoft 365.

- **The Workspace surface.** Where actual work happens. The
  record with information embedded in it — both deterministic
  facts (matter fields, billing line items, calendar entries)
  and inferred ones (AI summaries, similar-matter suggestions,
  OCG pattern flags, confidence cues, citations). Named
  capabilities to ground: matter records with AI summaries,
  intake with similar-matter suggestions, document records with
  relationship graphs, invoice review with OCG flags, daily
  briefings, Power BI dashboards on the Dataverse model.

- **The Context surface.** The supporting surface for evidence,
  provenance, and audit. When the Assistant or the Workspace
  surfaces an output, the Context surface answers: what records
  grounded it, what policy or rule applied, what the system was
  uncertain about, what action history led here. Describe
  conceptually; less branded as a single product feature today.

- **Inline AI inside content.** Not a separate surface — the same
  AI capability available *inside* the work the user is already
  doing. Named capabilities to ground: Word in-place co-authoring
  with grounded Copilot; selection-driven AI actions inside
  documents and analysis surfaces (describe conceptually — don't
  name internal projects).

- **Cross-surface integration.** Surfaces share session, context,
  and intent. Describe the *user-visible* behavior (asking the
  Assistant about a matter pins it in the Workspace; selecting
  text in a document deepens the Assistant's context) — not the
  internal mechanism.

## The legal-specific landing

Privilege, audit, and compliance constraints make grounding and
provenance non-negotiable for any system output — deterministic
or AI-derived. A legal system of record where conclusions can't
be traced back to their basis is a system that can't be defended.
The UX requirements aren't a design preference; they fall out of
the operating environment. Single tight paragraph.

## The close

One short paragraph (2–3 sentences) advancing the argument and
pointing to substance. The natural pointer is the platform
walkthrough — show the surfaces, don't restate them.

## Cross-links (inline, not in a footer block)

Required cross-links, placed where the argument hands off:

- [Legal AI Is Not Deterministic — And That Matters](/blog/probabilistic-vs-deterministic) —
  cite at pattern 4 (Inference vs facts visibly distinguished)
  and again at the legal-specific landing; this is the bedrock
  for the visibility argument.
- [Context Is Only One Layer](/blog/context-is-only-one-layer) —
  reference in §5 (Legal IQ makes the shift concrete) as the
  operating-model prior.
- [The Legal IQ Stack: Data, Memory, Inference](/why-spaarke/the-iq-stack) —
  canonical reference in §5 for what we mean by "embedding AI in
  a system of record."
- [What Is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence) —
  light single reference at §5 for the category-level prior.
- [The AI Readiness Gap in Legal Departments](/blog/the-ai-readiness-gap) —
  single inline reference where the close hands off; readiness in,
  UX-for-engagement out.

# Must NOT include

- **No "chat bubble" or "chat bot" phrasing.** Use *conversational
  surface*, *conversational AI*, *the Assistant surface*,
  *conversation as the primary modality*, *first-generation
  generative AI*. Plain "chat" is fine as a verb (what the user
  *does*) — not as a label for the whole UX.
- **No external research citations.** No Menlo VC, ServiceNow,
  Nielsen Norman Group, Don Norman, ISO, or LinkedIn-post
  attributions. The piece is written in Spaarke voice; the
  informing research is not surfaced as reference material.
- **No UX history lesson.** "How the page became the screen
  became the app" is not in scope. One paragraph on the
  generational-shift framing, then pivot.
- **No critique of conversational AI as a category.** First-gen
  conversational AI was right for the tasks it was best at. The
  argument is "enterprise AI needs more than a conversation side
  pane," not "conversation was a mistake."
- **No three-categories essay** (systems of record / work /
  creation). The piece lands on systems of record (where Legal IQ
  lives) and stays there.
- **No UI-pattern listicle framing.** The six patterns are the
  structural payload; the piece is an argument, not "7 patterns
  for AI-native software."
- **No UX/UI definitions lecture.** Define both terms cleanly
  once, then use with discipline. Three to four sentences.
- **No product pitch.** §7 lands the surfaces because they make
  the argument concrete — that's earned. The closing is short.
- **No demo CTA.** "Schedule a demo" / "Talk to sales" are out
  per `style-guide.md` §5.4; the close points to the walkthrough.
- **No do-not-say vocabulary.** None of: *unlock*, *empower*,
  *AI-powered*, *AI-driven*, *revolutionize*, *transform*,
  *transformation*, *in today's fast-paced*, *seamless*,
  *next-generation*, *robust*, *powerful*, *leverage* (as verb),
  *innovative*, *cutting-edge*, *disrupt*, *harness*,
  *10x productivity*, *one-click*, *paradigm shift*, *synergy*,
  *imagine if*, *journey*, *unleash*, *holistic*, *ecosystem*
  (when "set of products" works), *mission-critical*. Per
  `style-guide.md` §5 and `vocabulary.md` §2.
- **No screenshots.** §7 lands at conceptual + named capability
  level (b) only. Screenshots belong in the walkthrough, not the
  blog.

# References

## Internal cross-links (the draft must include these inline)

- `/blog/probabilistic-vs-deterministic` — *Legal AI Is Not
  Deterministic — And That Matters* (2026-05-21). Bedrock for
  the visibility argument; cited at pattern 4 and at the legal-
  specific landing.
- `/blog/context-is-only-one-layer` — operating-model argument.
  Architectural prior; cited at §5.
- `/why-spaarke/the-iq-stack` — canonical Legal IQ architecture.
  Heavy reuse at §5 and §7.
- `/why-spaarke/what-is-legal-operations-intelligence` —
  category-level prior. Single light reference at §5.
- `/blog/the-ai-readiness-gap` — pairs naturally (readiness in,
  UX-for-engagement out). Single inline reference near the close.

## External sources

None cited. Per writer direction, the informing research (Menlo,
ServiceNow, industry UX/UI definitions) shapes the thinking but
does not appear in the published piece as reference material.

## Companion LinkedIn syndication

- Separate workspace: `the-ux-that-legal-iq-requires-syndication`.
  To be created by `content-pipeline` at brief acceptance.
- Cadence: ~1 week after the blog post publishes. Exact date set
  with the publish date.
- Channel: LinkedIn (organizational), per the
  `probabilistic-vs-deterministic-syndication` pattern.

# Voice notes

- **Byline**: organizational (`spaarke`). The blog default
  register from `style-guide.md` — operator-to-operator,
  plainspoken, authoritative without breathless.
- **Three personas, primary written-to**: legal-ops-director.
  Secondary sanity-check personas: corporate-counsel (attorney
  partners, GCs) and legal-tech-cio (IT leaders, enterprise
  architects). Examples must land for all three.
- **Inclusive language for legal work**: per `vocabulary.md` §3,
  default to *legal professionals*, *the legal team*,
  *practitioners*, or *users* unless the work is genuinely
  attorney-only (drafting privileged advice, asserting privilege,
  signing legal positions). The piece is largely about shared
  operational work — keep inclusive.
- **UX vs UI**: defined cleanly once in plain language, then used
  with discipline. Never lecturing on industry-standard
  definitions.
- **First-gen framing**: "right for tasks like attorney drafting
  and document Q&A" — not "right for that era." This is a new
  framing claim this piece establishes; future pieces can
  cross-ref it.
- **Surface descriptions in §7**: conceptual + named product
  capabilities. Use real capabilities from `product-knowledge.md`
  (matter Q&A, find-similar, AI summaries, OCG flags, daily
  briefings, Power BI dashboards, Word in-place drafting). Do
  *not* name internal code paths or technical implementation.
- **No external citations** in the piece. The voice is Spaarke,
  the argument is ours.
- **Sentence rhythm** per `style-guide.md` §2 — short for
  emphasis, medium for development, no long compound sentences
  carrying the load.
- **The Legal IQ stack** is invoked structurally at §5, not as a
  creed recitation (per `style-guide.md` §5.10). The stack
  organizes that section's argument.
- **Cross-links inline**, not in a footer "related reading"
  block. Each link sits where the argument hands off.

# Hero graphic

**Prompt** (paste-ready for SVG-via-Claude or raster generator —
SVG is the default per `visual-identity.md` §6):

Minimalist geometric vector illustration, deep navy background
(#0A0A0A fading to #2D1F5E in a soft radial centered slightly
lower). An abstract composition: three parallel offset planes
arranged in 2.5D — one tall and narrow on the left, one wider
in the center, one smaller on the right — connected by thin
electric-blue threads (#000BFF) that pass through all three,
suggesting shared context and continuity across surfaces. The
center plane carries a single confident accent: a subtle
horizontal split-line that hints at two registers stacked. A
faint magenta glow halo (#FF4DCB at ~12% opacity) sits behind
the connection points. Centered composition, 16:9 landscape,
generous negative space above and below, flat 2.5D with subtle
paper-grain texture, editorial illustration in the McKinsey
Quarterly / Harvard Business Review house style. No text, no
people, no UI panels, no screenshots, no neural network mesh,
no robotic hands, no futuristic HUD, no data particles streaming
inward, no glowing brain, no Microsoft logos.

**Style preset**: minimalist geometric, deep navy + electric-blue
accent, 2.5D — matches the 2026-05 SVG-via-Claude regeneration
batch.

**Aspect ratio**: 16:9 (default — matches `ArticleHeader.tsx`).

**Alt text**: Three parallel offset planes on a deep-navy field
connected by thin blue threads, suggesting three coordinated
surfaces working as one.

**Generator notes**: SVG-via-Claude is the default per
`visual-identity.md` §6. Write directly to
`public/articles/the-ux-that-legal-iq-requires/hero.svg` at the
hero gate, using a 1600×900 viewBox and the palette stops in
`visual-identity.md` §3. Iterate as text edits — no need to over-
design the first version.

**LinkedIn / social-card raster (REQUIRED for syndication)**:
Generate a PNG sibling at
`public/articles/the-ux-that-legal-iq-requires/hero-og.png` (or
`linkedin-1920x1080.png` per the probabilistic-vs-deterministic
naming) at 1920×1080 — or 1200×630 minimum. LinkedIn, Twitter/X,
and Slack do not reliably render SVG as the `og:image`; the
`probabilistic-vs-deterministic` LinkedIn post lost its image
exactly for this reason. Until `src/lib/seo.ts` is updated to
prefer a PNG sibling when one exists, point the MDX `heroImage`
frontmatter directly at the PNG (`/articles/the-ux-that-legal-iq-
requires/hero-og.png`), not the SVG, so the `og:image` meta tag
gets a raster image. Visual content must match the SVG hero —
same composition, same palette. The PNG is *not* the in-page
hero; it's the social-card image.

# Unresolved

Items the writer or downstream gates will resolve. Not blocking
the brief.

- **publish_date** — set at scheduling gate; standalone, no
  campaign-driven date.
- **Hero SVG file** — generated at the hero gate per the prompt
  above and `visual-identity.md` §8 workflow.
- **LinkedIn syndication slug** — `the-ux-that-legal-iq-requires-
  syndication`; workspace created by `content-pipeline`.
