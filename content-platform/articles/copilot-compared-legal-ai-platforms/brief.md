---
slug: copilot-compared-legal-ai-platforms
type: blog-post
publish_date: TBD                      # writer ruling 2026-11-12: draft now, set dates later
channels: [website, linkedin]
status: brief
priority: normal
audience: legal-ops-director           # secondary: corporate-counsel, legal-tech-cio, firm-operations-leader
length_target: open                    # house calibration 4,300 to 5,500 words, 8 to 11 sections
byline: ralph-schroeder                # writer ruling 2026-11-12
campaign: 2026-11-legal-ai-platforms   # new campaign; created by content-pipeline
related: [copilot-legal-ai-platform, implementing-copilot-for-legal]

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: "Copilot Among the Legal AI Platforms: Where It Leads and Where It Falls Short"
published_slug: copilot-among-the-legal-ai-platforms   # /why-spaarke/copilot-among-the-legal-ai-platforms
description: "How Microsoft Copilot compares with Claude for Legal, OpenAI's Astra for Law, Harvey, and Legora, and when a platform serves a legal team better than an application."
summary: "Legal teams can now build on an AI platform from a frontier provider or buy a legal AI application from a specialist vendor. We think the platform approach gives most teams more flexibility and capability. This article compares Copilot with Claude for Legal, Astra for Law, Harvey, and Legora on the same terms, sets out where Copilot leads and where it falls short, and recommends how teams of different kinds should combine them."
date: TBD
author: "Ralph Schroeder"
tags:
  organization: [corporate-legal, law-firm]
  function: [operations, executive, it]
  topic: [ai-copilot, contracts, dms]
  theme: [ai-strategy, microsoft-ecosystem, platform]
heroImage: /articles/copilot-among-the-legal-ai-platforms/hero.svg
heroImagePosition: center
draft: true
keyTakeaways:
  - "Frontier providers now offer a general AI platform with core legal components on top, and for many legal teams that is a better foundation than a legal AI application."
  - "Copilot leads where legal work depends on Microsoft's applications, the organization's content, and the organization's own governance, and on the ability to build with low-code and developer tools."
  - "Copilot falls short today on proprietary legal research content, on independent evidence of quality, and on some forms of collaboration with clients and outside counsel."
  - "For most legal teams that run on Microsoft 365, the better answer is Copilot as the base, with specialist tools connected where research or client collaboration requires them."
featured: false
---

# Topic

A comparison of Microsoft's approach to legal AI with Anthropic's Claude for
Legal, OpenAI's Astra for Law, and two legal AI vendors, Harvey and Legora. It
explains how each is built, where Copilot leads, where it matches the others,
and where it falls short, and it recommends how legal teams of different kinds
should combine them.

A companion to `copilot-legal-ai-platform` and `implementing-copilot-for-legal`,
linked by subject and theme and never numbered. Pieces on Anthropic, OpenAI,
and Google will follow on the same terms; Harvey and Legora appear in the
comparisons only.

# Angle / Point of view

The premise: an AI platform gives a legal team more flexibility and capability
to build, manage, govern, and use its AI than a legal AI application does. The
frontier providers (Microsoft, Anthropic, OpenAI, Google) now supply both the
general platform and core legal components on top of it, and for many legal
teams that is the better approach. Harvey and Legora are strong legal
applications, and both now connect into the frontier platforms as well.

The position of this piece: Copilot leads where legal work depends on
Microsoft's applications, the organization's content, and the organization's
own governance, and where the team wants to build with both low-code and
developer tools. It falls short today on proprietary legal research content,
on independent evidence of quality, and on some forms of collaboration with
clients and outside counsel. For most legal teams that run on Microsoft 365,
Copilot should be the base, with specialist tools connected where those needs
apply.

The piece is objective in method and has a view. It states Copilot's strengths
with confidence, states its limits as plainly, and describes every other
product fairly and in its own terms.

**The phrase to repeat** in the opening, in the heading of the section that
makes the main case, and in the close: "Copilot as the base, with specialist
tools connected where the work requires them" (wording for the writer to
settle).

# What has changed

2026 has been the year the frontier providers introduced legal solutions on
their platforms, and they will keep adding legal solutions and building blocks
designed to be configured, extended, and customized. At the same time the
legal AI vendors have connected their products to those platforms. The choice
in front of a legal team has become which platform to build on and which
specialist tools to connect to it. Say this briefly; do not anchor it on any
one release date.

# The direction legal teams are taking

This section replaces the template's "concession" (writer ruling 2026-11-12).
Legal teams are moving from buying AI one application at a time toward a
platform they can build on, and toward capturing their own knowledge,
playbooks, and precedents in forms they control. Skills and MCP connections now
work in much the same way across the frontier platforms, so what a team builds
can travel with it. The forward-deployed legal engineers and legal operations
experts described in the companion pieces are how a team captures that
knowledge; mention them once here and link the Spaarke Method article.

# What we assert from practice

Proposed for the writer to confirm or reword. Until confirmed, the draft
treats each as a claim needing a source.

- "A demonstration of one task shows how a tool behaves on the vendor's
  documents, and says little about how it will reach the team's own work or
  answer to the team's controls."
- "Most legal teams will use more than one of these products, and the decision
  that matters is which one is the base."
- "A playbook written once in a portable format is worth more to a team than
  the same playbook built into one vendor's product."

# Where the reader starts

Name the decisions that last, in a sentence or two: which platform is the
team's base; which needs the base does not meet, and which specialist tool
meets each; and in what format the team keeps its playbooks, precedents, and
connections so they move with it. Then point forward to the coming piece on
Anthropic's platform.

# Why now

Legal teams are hearing the same claims from four frontier providers and from
the legal AI vendors, and the products now depend on one another. A
comparison on the same terms, with a stated view, is what a team needs to
decide where its AI will live.

# Must include

- **The opening.** State the change, what is at stake (which platform to build
  on, and what to connect to it), our standing and our interest, and what the
  article sets out to show. Main claim by word 250.
- **Our standing, our interest, and our earlier claims.** One first-person link
  to [Microsoft Is Now the Platform for Legal AI](/why-spaarke/microsoft-is-now-the-platform-for-legal-ai),
  and one sentence saying Spaarke builds on Microsoft. The writer ruled on
  2026-11-12 that the piece names every product and qualifies our earlier
  claims where the evidence requires it. Two are tested in the body:
  - That SharePoint sites and Teams channels with restricted access and
    sensitivity labels serve as the confidential work rooms Harvey offers as
    Vault and Legora as Portal. Weigh Harvey Shared Spaces, with ethical walls
    for clients and co-counsel, and Legora Portal, with its Intapp Walls and
    iManage Security Policy Manager integrations.
  - That Claude, ChatGPT, Harvey, and Legora all work from outside the legal
    team's tenant. Account for Legora running on Microsoft Azure and for Claude
    and Harvey reaching Microsoft 365 through add-ins and connectors.
  Where the evidence supports a claim, say so; where it qualifies one, say how,
  in the first person ("In our earlier article we wrote ...; on closer
  comparison ..."). Writer to settle the wording.
- **How we compare.** The same six layers used in `copilot-legal-ai-platform`
  (where people work, how work is done, what the AI knows about the
  organization, the models, how the team builds, and governance), plus legal
  research content and collaboration with clients and outside counsel. Every
  product is described against what legal work needs. No scores.
- **Platforms and applications, and how they connect** (Exhibit 1). The
  frontier platforms with legal components (Microsoft, Anthropic, OpenAI, with
  Google in a sentence) and the legal AI applications (Harvey, Legora). They
  share models: Anthropic and OpenAI models run in Copilot, Harvey, and Legora.
  Copilot Cowork is built on the technology behind Claude Cowork. Harvey and
  Legora connect into Copilot and ChatGPT. Skills and MCP appear across all of
  them. Argue the premise here: why a platform gives a legal team more room to
  build, manage, govern, and use its AI, and when an application is still the
  better choice.
- **Where Copilot leads.** The four strengths set out in
  `copilot-legal-ai-platform`, now as comparisons:
  - The work already lives in Microsoft's applications, and Copilot edits in
    Word itself, where the others work through an add-in.
  - Work IQ reaches the organization's content within each user's existing
    permissions, under the governance IT already runs.
  - Copilot works the same way across the applications people use.
  - Business users and developers can both build, on one platform and under
    one governance, with a choice of OpenAI and Anthropic models.
- **Where it matches.** Multi-step work in Cowork; skills and MCP; document
  management integration through iManage, NetDocuments, and Box.
- **Where it falls short today**, each with what a team does about it:
  - **Legal research content.** Westlaw, CoCounsel, and LexisNexis were not
    among Microsoft's launch partners (LexisNexis Protégé is available in
    Copilot separately); OpenAI built a U.S. legal search index into Astra for
    Law; Claude for Legal connects to Thomson Reuters CoCounsel, Westlaw, and
    Practical Law.
  - **Independent evidence of quality.** Microsoft has published internal
    evaluations only. Say this in one clause. Do not present Harvey's BigLaw
    Bench as independent.
  - **Collaboration with clients and outside counsel.** The first of our
    earlier claims is tested here.
  - **Maturity.** Several capabilities are in Frontier or preview; say which.
  - **Depth of ready-made legal workflows.** Harvey reports more than 500
    lawyer-built agents; Legora offers Tabular Review, Monitors, and Portal.
- **Claude for Legal and Astra for Law, briefly**, because each gets its own
  piece. Claude for Legal: Claude.ai, Cowork, the Microsoft 365 add-ins and
  connector, MCP connectors, open-source legal plugins that run in Cowork or
  Claude Code, and Managed Agents. Astra for Law: a legal-tuned model with its
  own legal search index, in ChatGPT and Codex for selected firms, with an API
  to follow.
- **Harvey and Legora: alongside Copilot or instead of it.** Both connect into
  Copilot. Recommend when a team runs them alongside Copilot and when one of
  them is the better primary choice, for example a law firm whose work is
  shared with clients and co-counsel every day.
- **The comparison table** (Exhibit 2), by the six layers and the two legal
  criteria. No scores or totals.
- **The recommendation**, by kind of legal team (`stance.md`, rule 8). Proposed:
  a corporate legal department whose work lives in Microsoft 365; a team with
  heavy research or litigation demand; a law firm whose work crosses client
  boundaries. For each, the base and the specialist tools to connect.
- **The close**, under a heading that reuses "legal AI platforms": a short
  paragraph naming what the piece compared, the main claim in the opening's
  words, the lasting decisions, and the pointer to the Anthropic piece.

# Must NOT include

- "Article 3", "this series", or any numbering.
- "AI is the force" or similar phrasing.
- 2026-10-15 or any other single release date as the anchor.
- A list of the Microsoft IQ sub-products.
- A ranking, scores, or a winner; equally, a sentence that refuses to choose
  (`ai-tells.md`, section 6.5).
- An attack on another product, or a defence of Microsoft that ignores the
  evidence.
- A pitch: the accelerator by name or a meeting close.
- Vendor size figures (customer counts, valuations) unless the argument needs
  them.
- Em dashes, the constructions in `voice/examples/ai-tells.md`, and the words in
  `voice/vocabulary.md`, section 2.

# References

**Our earlier articles** (first person):

- `copilot-legal-ai-platform` and `implementing-copilot-for-legal` once published, by title.
- [Microsoft Is Now the Platform for Legal AI](/why-spaarke/microsoft-is-now-the-platform-for-legal-ai).
- [The Spaarke Method](/why-spaarke/the-spaarke-method).
- [What Attorneys Need to Know About AI Architecture](/why-spaarke/what-attorneys-need-to-know-about-ai).
- [Your Legal Data Belongs to You](/why-spaarke/your-legal-data-belongs-to-you).

**External.** All **TBD — confirm** against the primary source. URLs in the
source briefing, `C:\code_files\spaarke-research\2026-11-copilot-legal-platform\microsoft-ai-platform-for-legal-2026-11-11.md`, section 11.

- Anthropic: Claude for the legal industry pages and the `anthropics/claude-for-legal` repository.
- OpenAI: the Astra for Law announcement and Help Center article; ChatGPT for in-house legal.
- Harvey: site, FAQ, platform updates, and the Microsoft 365 Copilot integration post.
- Legora: site, integrations announcement, Microsoft Marketplace listing.
- LexisNexis on Protégé in Microsoft 365 Copilot.
- LawSites (LawNext) on the frontier providers' legal offerings and Microsoft's launch partners.

# Voice notes

- **Register.** A strategy consultant giving a client a straight comparison, in
  the manner of a McKinsey or BCG point of view: the recommendation first, the
  evidence after it, and a clear statement of where each option is the right
  one. Positive about Copilot where the evidence supports it.
- **Fairness.** Describe each product in its maker's terms and attribute its
  claims to its maker. Label anything in preview or limited access.
- **Testing our own claims** is done once per claim, plainly, in the first
  person, inside the section where it belongs.
- **Byline, terms, and timing** as in `copilot-legal-ai-platform`. Check every
  vendor fact again before a date is set.

# Hero graphic

**Prompt** (SVG drawn by Claude; this is the composition):

Same canvas and accent as the companion pieces (**TBD — confirm**). Five
columns of six thin stacked planes, side by side at nearly equal heights, with
fine lines joining matching planes across the columns; one column outlined in
the accent colour, the others muted. Flat 2.5D, open space above, soft
vignette. The columns must not read as a ranked bar chart. No text, people,
logos, vendor marks, podiums, UI panels, neural meshes, gavels, or scales.

**Style preset**: minimalist geometric, dark canvas, one accent, 2.5D.

**Aspect ratio**: 16:9.

**Alt text**: "Five columns of thin stacked planes side by side, joined by fine
lines between matching planes, with one column outlined in the accent colour."

**Generator notes**: as `copilot-legal-ai-platform`.

# Unresolved

1. **Wording for testing our two earlier claims.**
2. **The kinds of legal team** the recommendation uses.
3. **Every vendor fact**: **TBD — confirm**, and checked again before a date is
   set.
4. **The claims from practice**: confirm, reword, or cut.
5. **The phrase to repeat** (proposed above).
