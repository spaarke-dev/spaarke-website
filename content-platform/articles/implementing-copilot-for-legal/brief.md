---
slug: implementing-copilot-for-legal
type: blog-post
publish_date: TBD                      # writer ruling 2026-11-12: draft now, set dates later
channels: [website, linkedin]
status: brief
priority: normal
audience: legal-ops-director           # secondary: legal-tech-cio (confirm; see Unresolved)
length_target: open                    # house calibration 4,300 to 5,500 words, 8 to 11 sections
byline: ralph-schroeder                # writer ruling 2026-11-12
campaign: 2026-11-legal-ai-platforms   # new campaign; created by content-pipeline
related: [copilot-legal-ai-platform, copilot-compared-legal-ai-platforms]

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: "Implementing Copilot for Legal: What the Legal Team and IT Build"
published_slug: implementing-copilot-for-legal   # /why-spaarke/implementing-copilot-for-legal
description: "How a legal team and its IT department set up Microsoft Copilot as the team's legal AI platform: governance, knowledge, connections, building, and rollout."
summary: "Microsoft supplies the platform and the core legal skills. A legal team makes it its own by capturing its knowledge as skills and playbooks, connecting its legal systems, building the tools its work needs, and rolling the work out under the governance the organization already runs. This article sets out each step, who does it, and what IT and legal each need to decide."
date: TBD
author: "Ralph Schroeder"
tags:
  organization: [corporate-legal]
  function: [operations, it]
  topic: [ai-copilot, compliance, dms, workflow]
  theme: [microsoft-ecosystem, buyer-enablement, platform]
heroImage: /articles/implementing-copilot-for-legal/hero.svg
heroImagePosition: center
draft: true
keyTakeaways:
  - "Microsoft supplies the platform and the core legal skills; a legal team makes them its own by capturing its positions, precedents, and playbooks as skills."
  - "The governance the organization already runs, from sensitivity labels to retention and eDiscovery, extends to Copilot, so IT configures legal AI with controls it already knows."
  - "Forward-deployed legal engineers and legal operations experts are the people who turn a team's knowledge into skills, playbooks, and evaluations that work on the platform."
  - "Low-code tools let lawyers and legal operations build for themselves, and developer tools take over where the work needs an integration or a custom application."
  - "Start with one workload where the playbook and the measure already exist, such as contract review, and extend from there."
featured: false
---

# Topic

How a legal team and its IT department set up Microsoft Copilot as the team's
legal AI platform: what each of them configures, captures, connects, and
builds, in what order, and why. Technical enough for IT to act on and plain
enough for legal operations to plan with.

A companion to `copilot-legal-ai-platform` and
`copilot-compared-legal-ai-platforms`, linked by subject and theme and never
numbered.

# Angle / Point of view

The shared premise: a platform gives a legal team more flexibility and
capability to build, manage, govern, and use its AI than a legal AI
application. This piece shows what that flexibility asks of the team.

Microsoft supplies the platform, the governance, and the core legal skills. A
legal team makes the platform its own in five steps, each building on the one
before: enable Copilot and the legal skills under the organization's existing
governance; capture the team's knowledge as skills and playbooks; connect the
legal systems; build the tools the work needs, with low-code tools and
developer tools as each case requires; and roll out delegated work one
workload at a time, with a measure and a budget.

**The phrase to repeat** in the opening, in the heading of the section that
makes the main case, and in the close: "a legal team makes the platform its
own" (wording for the writer to settle).

# What has changed

As in the companion pieces: 2026 has been the year the frontier providers
brought legal solutions onto their platforms, and they will keep adding
building blocks meant to be configured, extended, and customized. The more of
those building blocks a provider supplies, the more of the remaining work is
the team's own: its knowledge, its systems, and its choices about what to
automate. Say this in a sentence or two and move on.

# The direction legal teams are taking

This section replaces the template's "concession" (writer ruling 2026-11-12).
Legal teams are capturing their knowledge and intellectual capital in forms
the platform can use: playbooks with positions and fallbacks, approved
precedents, house styles, and the review habits of their most experienced
lawyers. That work needs people who understand both the legal practice and the
platform. Forward-deployed legal engineers and legal operations experts sit
with the team, write its positions into skills, set up the evaluations that
show whether the output is right, and hand the capability over so the team can
maintain it. This is the centre of the piece, and the section on capturing
knowledge carries it.

Authority stays where `stance.md`, section 2, puts it: the department sets the
positions, fallbacks, and escalation rules; legal engineers and legal
operations write them into skills and curate the precedents; IT configures the
controls.

# What we assert from practice

Proposed for the writer to confirm or reword. Until confirmed, the draft
treats each as a claim needing a source.

- "The first skill a team writes is usually its most-repeated review, because
  the positions are already settled and the volume shows the benefit quickly."
- "A playbook a senior lawyer carries in their head becomes useful to the rest
  of the team only when someone writes it down in a form the platform can run."
- "The work of tuning the platform takes legal expertise as much as technical
  skill."

# Where the reader starts

A run of short instructions to legal operations and IT, each one earned by a
section: enable Copilot and the legal skills for one group of users under the
existing governance; extend retention and legal hold to AI interactions; write
the team's most-repeated review as its first skill; connect the document
management system; and turn on delegated work for one workload with a spending
limit and a measure. Then a sentence pointing to
`copilot-compared-legal-ai-platforms` by title.

# Why now

Legal teams that have tried Copilot are now deciding how to set it up for
legal work. Microsoft documents each control in its own admin guide, and none
of those guides is written for a legal team, where privilege,
confidentiality, client obligations, and legal hold apply to what the AI reads
and writes.

# Must include

- **The opening.** State that Microsoft now supplies the platform and the core
  legal skills, that the team's own knowledge and systems are what make it a
  legal platform, our standing (one first-person link to
  `copilot-legal-ai-platform` once published, or to our earlier article
  [Microsoft Is Now the Platform for Legal AI](/why-spaarke/microsoft-is-now-the-platform-for-legal-ai),
  with the same one-sentence disclosure), and what the article sets out. Main
  claim by word 250.
- **The five steps** as the structure of the article (Exhibit 1), with the same
  step names in the opening, the headings, the exhibit, and the close. A
  numbered sequence is correct here because each step depends on the one
  before it.
- **Step 1: enable Copilot and the legal skills under existing governance.**
  Present governance as a strength the team inherits:
  - Licensing by role (Exhibit 2): which users need the full Copilot license to
    work in Word, and which work is billed by usage (Cowork, Code, Autopilot,
    some models). Budget by workload as well as by seat. All prices
    **TBD — confirm** after Ignite.
  - Cowork is off by default; IT enables it by group.
  - Sensitivity labels and data loss prevention protect privileged and
    client-confidential content in Chat and Cowork.
  - Copilot respects each user's existing permissions, and AI interactions are
    captured for audit, retention, and eDiscovery like any other content. Say
    what legal hold practice adds for AI interactions.
  - Model choice and data residency: Anthropic is a Microsoft subprocessor, and
    administrators control Claude models in the EU, EFTA, and UK. Check
    against client and outside counsel guidelines.
  - Present permissions as part of that strength. The writer's position is that
    governed collaboration and governed AI are among the platform's advantages.
- **Step 2: capture the team's knowledge.** Playbooks as skills (Cowork
  discovers a user's skills automatically; shared skills appear for the team);
  approved precedents in SharePoint, which the legal skills draft from; house
  styles. Forward-deployed legal engineers and legal operations experts, what
  they do, and how the capability passes to the team. Link
  [The Spaarke Method](/why-spaarke/the-spaarke-method) and the knowledge
  management article in the first person.
- **Step 3: connect the legal systems.** Partner plugins for document
  management (iManage, NetDocuments, Box), e-signature, research, and
  e-discovery. Recommend when to use a Copilot connector (to let Copilot search
  and reason over content from another system) and when to use an MCP server
  (to let Copilot take actions in or query a system of record, such as opening
  a matter or pulling spend data).
- **Step 4: build what the work needs.** Low-code tools for lawyers and legal
  operations (skills in plain language, Agent Builder, Copilot Studio, Code
  with the Copilot Managed Runtime) and developer tools where the work needs an
  integration or a custom application (Microsoft Foundry, plugins, custom
  agents). Every Copilot Studio agent gets its own identity in Entra, and
  Agent 365 gives IT one inventory of agents. Recommend where a legal team
  should start.
- **Step 5: roll out delegated work one workload at a time** (Exhibit 3).
  Automations for event-driven work, such as triaging an NDA when it arrives;
  Cowork for bounded multi-step work; Autopilot for standing responsibilities
  (in Frontier). Approval steps before anything is sent. Spending limits by
  group and user. Recommend contract review or NDA triage first, because the
  playbook and the measure already exist. Measures: suggestions kept, time to
  first response, review turnaround, and cost per workload.
- **The close**, under a heading that reuses "Copilot for Legal": a short
  paragraph naming the steps, the main claim in the opening's words, the
  instructions under "Where the reader starts", and the pointer to
  `copilot-compared-legal-ai-platforms`.

# Must NOT include

- "Article 2", "this series", or any numbering.
- Oversharing presented as a hazard, or permissions presented as a problem
  Copilot creates.
- "AI is the force" or similar phrasing.
- 2026-10-15 or any single release date as an anchor.
- A list of the Microsoft IQ sub-products (Foundry IQ, Fabric IQ, Web IQ). Use
  "Work IQ" where the enterprise intelligence layer needs a name.
- A step-by-step admin guide. Give the legal reason for each decision and link
  Microsoft Learn for the procedure.
- A pitch: the accelerator by name or a meeting close.
- Em dashes, the constructions in `voice/examples/ai-tells.md`, and the words in
  `voice/vocabulary.md`, section 2.

# References

**Our earlier articles** (first person):

- `copilot-legal-ai-platform` once published, by its title.
- [Microsoft Is Now the Platform for Legal AI](/why-spaarke/microsoft-is-now-the-platform-for-legal-ai).
- [The Spaarke Method](/why-spaarke/the-spaarke-method).
- [Knowledge Management: The Context Behind Legal Operations Intelligence](/why-spaarke/knowledge-management-legal-operations-intelligence).
- [Spaarke for Your IT Team](/why-spaarke/spaarke-for-your-it-team), optional, for the IT reader.

**External.** All **TBD — confirm**, then checked after Ignite. URLs in the
source briefing, `C:\code_files\spaarke-research\2026-11-copilot-legal-platform\microsoft-ai-platform-for-legal-2026-11-11.md`, sections 7 to 10.

- Microsoft Copilot pricing pages (Enterprise and Business), and the announcement of Microsoft 365 E7 and Agent 365.
- Microsoft Learn: Purview for Copilot; AI subprocessors; managing plugins, skills, and MCP servers; Copilot Studio; Cowork.
- Microsoft's Cowork general availability post (default off, controls, spending limits).

# Voice notes

- **Register.** A strategy consultant advising a peer, in the manner of
  McKinsey or Harvard Business Review. Practical, specific, and positive where
  the platform earns it. Use IT's own terms (tenant, Entra, Purview,
  sensitivity labels, DLP) without explaining them, and give the legal reason
  IT may not know.
- **Primary reader.** Changed to legal operations, with IT as the second
  reader, because the centre of the piece is now the team's knowledge and the
  people who capture it. Confirm.
- **Byline, terms, and timing** as in `copilot-legal-ai-platform`.

# Hero graphic

**Prompt** (SVG drawn by Claude; this is the composition):

Same canvas and accent as the companion pieces (**TBD — confirm**). Five short
horizontal segments rising left to right, each joined to the next by a fine
line; the first is solid and the later ones progressively more outlined. Only
the first carries the accent. Flat 2.5D, open space to the upper right, soft
vignette. No text, people, logos, Microsoft marks, padlocks, shields, UI
panels, neural meshes, gavels, or scales.

**Style preset**: minimalist geometric, dark canvas, one accent, 2.5D.

**Aspect ratio**: 16:9.

**Alt text**: "Five short segments rising left to right, joined by fine lines,
with only the first filled in the accent colour."

**Generator notes**: as `copilot-legal-ai-platform`.

# Unresolved

1. **Primary reader**: legal operations (applied) or IT.
2. **The phrase to repeat** (proposed above).
3. **The first workload to recommend**: contract review or NDA triage.
4. **Prices and product names**: **TBD — confirm** after Ignite.
5. **The claims from practice**: confirm, reword, or cut.
