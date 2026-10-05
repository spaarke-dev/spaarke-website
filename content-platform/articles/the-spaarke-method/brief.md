---
slug: the-spaarke-method
type: blog-post
publish_date: 2026-10-05            # proposed display date and real publish date (a Tuesday, within the writer's "today or tomorrow"); confirm the day
channels: [website, linkedin]
status: published                   # brief | outline | draft | review | scheduled | published
priority: high                      # first article of a new series; the writer wants it released this week (2026-10-05)
audience: legal-ops-director        # co-primary for this piece: firm-operations-leader (writer's notes, 2026-10-05: law departments and law firms equally); secondary: corporate-counsel
length_target: 4000                 # long-form article; about 4,000 words plus or minus, a planning estimate and not a cap (content-types/blog-post.md section 2.1). Section budget goes in plan.md.
byline: spaarke                     # organizational byline; closing contact line names Ralph Schroeder, Founder and CEO (voice/bylines.md section 6)
campaign: 2026-10-the-spaarke-method   # new campaign for the series; file created 2026-10-05, milestone opened at the content-pipeline step
github_issue: 119   # https://github.com/spaarke-dev/spaarke-website/issues/119 (created by content-pipeline, 2026-10-05)
triggered_by: idea.md rev. 2 (2026-10-05), the writer's answers and review notes on briefs v1 and v2, and the writer's refinements of 2026-10-05 (inclusive term, forward deployment, systems of record versus intelligence); this is brief v3

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: "The Spaarke Method: Envision, Design, Build, Deploy, and Manage"
description: "How the Spaarke Method takes legal operations, in law departments and firms, from data to intelligence and from AI tools to an AI capability of its own."
summary: "Systems of record give legal operations data, and a legal operations intelligence platform gives it intelligence. This article sets out the Spaarke Method, the five phases through which Spaarke builds that platform with legal operations in law departments and law firms alike, who does the work in each, and how mastering the phases builds, grows, and perfects the organization's own AI capability."
date: 2026-10-05                    # display date, equal to the real publish date
posted: 2026-10-05
author: "Spaarke Team"
tags:
  organization: [corporate-legal, law-firm]
  function: [operations, executive, attorney]
  topic: [workflow, matter-management, ai-copilot]
  theme: [legal-operations-intelligence, platform, ai-strategy, buyer-enablement]
heroImage: "/articles/the-spaarke-method/hero.svg"
heroImagePosition: "center"
draft: true
keyTakeaways:
  - "Systems of record give legal operations data. A legal operations intelligence platform gives it intelligence: the context, authority, and governed action that turn a record into a decision."
  - "Without intelligence, legal operations stays data-rich and insight-poor, and AI added to that data gives fragmented answers faster. Intelligence gives AI the context it needs to be accurate and safe."
  - "The Spaarke Method builds the platform through five phases that form a loop, one decision at a time, and each decision leaves behind entities, connections, and governance that the next one reuses."
  - "Forward-deployed legal engineers work with experienced practitioners and the organization's own end users from the first day and in every phase, and turn how legal operations decides into the platform."
  - "The Spaarke Method joins technology, consulting, and managed services through one ontology that the organization owns, so what each learns about how legal operations decides is held in the model the others use."
  - "An organization builds, grows, and perfects its AI capability by mastering the five phases: context and guardrails in design, an evaluation set in build, proposals a person confirms in deploy, and wider autonomy on evidence in manage."
---

# Topic

How Spaarke works with legal operations to build its Legal Operations Intelligence platform and the internal AI capability that depends on it: five phases (envision, design, build, deploy, and manage), one decision at a time, carried by forward-deployed legal engineers who work with the organization's own practitioners and end users.

This is article 1 of a new series, "The Spaarke Method". It is the overview. The series then gives each phase its own detailed article, so this piece has to stand alone for a reader who has seen none of the earlier articles and give each later article a place to hang.

**Legal operations as the inclusive term (writer's notes, 2026-10-05).** Legal operations is a function in law departments and in law firms alike, so the draft uses "legal operations" as the subject wherever the earlier drafts wrote "a law department or a law firm", and "the organization" where the sentence needs the owner of the model or the platform. The opening says once, in one sentence, that legal operations is a function in both kinds of organization and that the method applies to both; after that the draft does not repeat the distinction. There is no separate section for law firms. What is specific to a firm lives where it belongs: in the scenes (a firm accepting new work, a client's general counsel and the engagement record), in the Design phase (the engagement a firm shares with each client), and in the vocabulary, with the firm operations leader still a co-primary reader. The writer's earlier ruling that Spaarke works with law firms equally stands, and the draft keeps firms visible without the repeated formula.

**Authority check.** Under `stance.md` section 2, legal operations builds, facilitates, curates, and manages, and the organization's leadership decides, owns, sets, approves, and accepts. "Legal operations builds its platform" is correct; "legal operations decides what its agents may do" is not. The draft says the organization decides.

# Angle / Point of view

The five earlier articles in the Legal Operations Intelligence series argued what legal operations should build and why. This piece describes how Spaarke does the work, in specific terms, from the first conversation to the running service. It is a method article that states a viewpoint and does not survey the field or compare providers. It is not a sales document: it carries no price, timeline, or results claim, and it says what happens, who does it, and what exists at the end of each phase, so that a buyer can judge the approach.

The central distinction, which the writer asked the piece to draw sharply: **a system of record is fundamentally a database with a specifically defined scope and structure, and a legal operations intelligence platform defines the entire operation and the business around it, multi-dimensional and from all sources.** A matter system, an e-billing platform, and a document repository each fix a scope and a structure in advance for one function, and each holds one dimension of the work (article 3 makes the point). The platform models how legal operations works as a whole and how it connects to the business: the entities across every system, the relationships among them, the policy and authority that govern each decision, and the actions that follow. It draws on every source, including the systems of record, the email and documents that no system structures, and the knowledge held by the people who do the work. That is a different kind of solution, and it is built differently. A database is specified from requirements about what people record, and a competent team can build it. The platform is built from knowledge about how people decide, which sits with experienced practitioners and with the organization's end users, so the work has to be done with them, from the beginning and across every phase of the method, by people who understand both the legal work and the model.

The thesis formula, which the opening, the heading of the proving section, and the close repeat in the same words (revised after the writer's review of 2026-10-05, which found the earlier formula, "Legal operations builds its platform one decision at a time...", described a method and made no important point; the writer's distinction is the thesis):

> Systems of record give legal operations data, and a legal operations intelligence platform gives it intelligence

The method follows as the article's answer, in a sentence that is not part of the formula: "The Spaarke Method is how legal operations builds that platform, one decision at a time, through five phases that form a loop." Why the distinction is critical (the writer: "this is the entire crux of why Spaarke is important"): data records what happened, and intelligence turns a record into a decision by bringing it, with its context, to the person with authority, acting through a governed process, and recording the outcome. A department without it stays data-rich and insight-poor, AI added to its data gives fragmented answers faster, and no single system of record can supply intelligence, because the limitation is inherent in the architecture of legal systems.

Naming (same review): the article says "The Spaarke Method", never "Spaarke's method" or "in Spaarke's method". The AI capability is something the organization "builds, grows, and perfects by mastering the five phases".

# Prime mover

The force is the AI imperative on the legal function. Driven by it, legal operations needs a model of how the organization decides that AI can read, and it needs the operating discipline to widen AI's role safely. Everything else in the piece is subordinate to that: the method is how Spaarke builds that model and that discipline with a customer, and forward-deployed legal engineers, the shared ontology, and the managed service are the means. The article names the AI imperative in the second sentence of the opening, as the earlier series does, and never lists the means as coequal drivers.

(Approved by the writer, 2026-10-05.)

# The concession

A legal operations function can buy software, engage advisers, and start AI pilots without having decided which decisions they are meant to improve. Those that buy first and define later pay for the definitions anyway, in configuration work and change requests, and a build that starts before the owner is named tends to stall at the first action that needs a named approver (article 2 carries both points).

The draft states it as a direct predicate with the function as the subject, in the first section, with the mechanism, and pairs it with the remedy in the same section. The organization's own acknowledgment is the preferred voice ("legal operations teams increasingly acknowledge that..."). It is said about the function and never about a named department, firm, or person.

(Approved by the writer, 2026-10-05.)

# What we assert from practice

These claims carry no citation and are stated flat, with the mechanism, under `style-guide.md` section 5, rule 12. They are the only unsourced claims the draft may make. Several restate positions in the five earlier articles. The writer should correct any that overstate.

- **What a system of record is, and what the platform is.** A system of record is a database with a defined scope and structure. A legal operations intelligence platform defines the whole operation and the business around it, across every dimension and from every source. (The writer's own definition, 2026-10-05.) The mechanism is the one in "Angle": a database records what its design anticipated, and decisions draw on evidence, authority, and exceptions that no single design anticipated.
- **How the three have usually been bought, and what is different here.** Organizations have bought technology, advice, and operational support separately, often from different providers, and some providers now offer two of the three together. The draft says this once, without naming anyone and without a count, in terms that acknowledge the mix ("often", "sometimes combined") and claims nothing about any other provider's method. The point of the passage is that Spaarke's method is one specific, integrated structure and fits neither description, as a bundle of three offerings or as one leading to another: technology to consulting, or consulting to technology. The three run in both directions, and through the managed service as well.
- **How the integration works.** Technology, consulting, and managed services are connected by one ontology. What the consulting work finds about how an organization decides is held in the model the platform runs on; what the platform shows is tested against the real questions the organization asks; and what the managed service learns from running the platform changes the next design. The same legal engineers carry the work across the phases, so no handover loses the context. (The writer's framing; this is Spaarke's account of its own method.)
- **Why the platform needs a different approach from a database.** The knowledge of how people decide is often tacit and sits in the experience of practitioners, in the exceptions they grant, and in the thresholds nobody wrote down. A team that builds from requirements and schemas produces a reporting layer, because the decision logic never reached the specification. That knowledge has to come from the people who hold it, so experienced practitioners and the organization's end users take part from the beginning of the project and in every aspect of the method. (The writer's notes, 2026-10-05.)
- **Who legal engineers are, and how they relate to the practitioners.** Attorneys, legal operations professionals, and specialty practitioners (in intellectual property, contracts, litigation, regulatory work, or a firm's own practice areas) who understand how legal work is done and translate it into the ontology and the decision platform. They work with the organization's experienced practitioners and end users, on the organization's own data, in its own tenant, and they are accountable for what they scope and for what they deliver. The role does not replace subject matter experts. Subject matter experts have always been part of technology projects, usually consulted at the start and at review. In this method the practitioners and end users are participants throughout, and the legal engineer is the person who works with them to turn what they know into the model and the platform. (The writer's definition and positioning, 2026-10-05: the draft must not sound uninformed about the subject matter expert role or arrogant about it.)
- **Forward deployment.** The legal engineers are forward deployed: they sit inside the organization's operations from the first day, work on its real data, and answer for what they promise and deliver. The writer wants the terms "forward-deployed" and "forward deployment" used, as a term of art and a catch phrase, and open to another term that captures the concept. The draft uses "forward-deployed legal engineers" and "forward deployment" sparingly (the section on legal engineers and the close at most), explains the idea in plain words each time, and says nothing about where the phrase comes from. A plainer companion term, "embedded", is available for variety in running prose.
- **What the model reflects.** The model reflects how the organization decides, which cannot be derived from the schemas of its systems. The hardest part is agreement on definitions (article 3).
- **Real data, early.** A first model built on real data with the people who own the decision teaches more than a long discovery period. It will be wrong in places and become less wrong with each cycle. The organization keeps the model, and keeps the right to correct it.
- **Systems of record.** Working from the Spaarke system of record has real advantages: entities, identifiers, permissions, ethical walls, and the decision record are native to the platform, so there is no identity resolution across systems to build, no refresh cycle to schedule, and no write-back limit to design around. Where the organization needs data from systems it keeps, those processes and their limits have to be addressed as part of the design. (Stated as a requirement and a limit; see Must NOT include.)
- **AI.** AI starts by proposing actions that a person confirms, with the decision and its evidence recorded, and its latitude widens as the organization gains confidence in the results. The organization can narrow it again.
- **Capability.** An organization's AI capability cannot be bought as a product. It has to be built from context, definitions, permissions, governed actions, an evaluation set drawn from its own questions, and skills, and then kept current.
- **Ownership.** The organization owns what is built. The ontology, definitions, policies, playbooks, and decision record belong to it and run in its tenant, so a change of model or provider leaves the capability in place.
- **Value is broader than cost.** The decisions that matter most to a general counsel or a managing partner are usually about risk caught earlier, speed to the business or the client, consistency, quality of judgment, and the relationship with the other side of the engagement. The draft treats cost as one outcome among these and never as the measure of the method (writer's note, 2026-10-05).

# Where the reader starts

The close carries these as imperatives, after the sentence that discharges the title. The title is a list of phases and so names no single noun to discharge; the plan sets the close's key term as "method" and proposes the discharge sentence.

- Write down the ten decisions your general counsel or your managing partner would name as most important, and for each, who makes it, where, what they consult, and where the outcome is recorded.
- Name an owner for the platform inside the organization, and treat any decision with no owner, or with three, as the first finding.
- Choose one recurring decision to build first, and set a baseline for it: how long it takes today, how often it is revisited, and what it risks or delays when it goes wrong.
- Decide where AI is wanted and where a calculation that returns the same answer every time is the right tool, before a model is chosen.
- Agree how you will tell that the first decision has improved, and what evidence would widen or narrow what AI may do.

The forward pointer in beat four hands off to the next article in the series, the detailed piece on the Envision phase. Its working title, settled with the writer on 2026-10-05: "Envision: How Legal Operations Defines Its Intelligence" (alternatives the writer offered: "How Legal Operations Defines Its Legal IQ", or a title using the forward-deployment term).

# Why now

The conversation about AI in legal has moved from adoption to operating discipline, on both sides of the engagement. The Harbor 2026 Maturity Index (May 11, 2026) says "Technology is in place. The operating model has not kept up." The Axiom 2026 Legal AI Survey (July 9, 2026; 528 in-house leaders) finds that 7% have scaled AI beyond pilots. For firms, the ILTA 2026 Technology Survey (508 firms; released September 14, 2026) finds "Nearly every responding firm (94%) is now engaged with GenAI, up 14 points from last year", and its executive summary concludes that "The platform migration is largely complete, but the governance migration has yet to begin." The model layer is becoming easier to obtain from several directions at once (the writer's read of the market, stated without naming a provider), which leaves the organization's own model of how it decides, which no provider supplies, as the part that decides the result.

Within the library, the five earlier articles say what to build, and a buyer evaluating any provider also needs to know how the work is organized. This article answers that, and it is the first in a series that answers it in detail.

# Must include

- **The thesis formula** at three anchors (opening, the heading of the section that proves it, the close), in the same words, with the full "legal operations intelligence platform" named once in the opening before it.
- **The distinction between a system of record and a legal operations intelligence platform**, in the writer's terms (see "Angle"), as the first argument of the piece and in its own section. A system of record is a database with a defined scope and structure, and the platform defines the entire operation and the business, multi-dimensional and from all sources. The section says what a system of record does well in one clause, says that Spaarke's own system of record is one source among the platform's many (the data layer the Spaarke system of record supplies where an organization wants it), and never frames the two as rivals or as two modes. Cross-link to the ontology article for "each system of record holds one dimension of the work".
- **The loop of five phases**, each with what happens, who is involved, what exists at the end, what it contributes to the organization's AI capability, and what it looks like in a law firm where that differs:
  - **Envision.** Start from the outcomes the general counsel, the CFO, and business unit leaders need, or for a firm, the managing partner, the practice leaders, and the client's expectations. Write each decision as the single sentence from article 2 (the user, the working surface, the decision, the inputs, the action), find decisions with no owner or three, choose the first decision, name the platform's owner, and set the baseline.
  - **Design.** Build the model backward from the decision: evidence, entities and relationships, source systems, the policy and authority that govern the decision, and the governed action. Agree the definitions. Record the source of truth for each entity and the limits that follow. Define permissions, ethical walls, and what an agent may do. For a firm, design includes the engagement it shares with each client.
  - **Build.** Work on real data with the people who own the decision from the first days. Connect sources, create the entities the organization lacks a system for, define the governed actions, build the surface, and test with the questions the general counsel or the managing partner asks repeatedly, put to the surface, to a new joiner, and to the AI, and timed.
  - **Deploy.** Put the platform where people work (Outlook, Teams, Word, the matter page) and into the organization's tenant under its identity and governance. Start AI in proposing mode with a person confirming, agree who is accountable, and measure against the baseline.
  - **Manage.** The phase covers ongoing execution and continuous improvement, and it is where Spaarke's managed services, technical and legal, run alongside the organization. Keep definitions and playbooks current, operate the platform and its connections, review the decision record, widen or narrow AI latitude on that evidence, and choose the next decision.
- **Practitioners and end users in every phase, and why the work needs forward-deployed legal engineers** (a section of its own, and the heart of the piece alongside the thesis): practitioners and end users take part from the beginning and across every aspect of the method, and say what each phase asks of them in a sentence or two (the decision owners name and test the decisions in envision, agree the definitions in design, test with their own questions in build, work in the platform and confirm what AI proposes in deploy, and review the decision record in manage). The section then defines the legal engineer once, using the term as an industry term of art (it is in use across the market) and defining Spaarke's usage without rebutting anyone else's, and introduces forward deployment in plain words. The legal engineer works with the practitioners and end users and does not stand in for them. The draft acknowledges the subject matter expert's long place in technology projects, in respectful and accurate terms, and says what is different here: the practitioners and users are participants throughout and are not consulted at the start and at review. Four working traits: they start from the decision and go to where the work is done; they learn from the practitioners why a practice exists before changing it; they leave the organization's authority over its own model and its agents intact; and they work with named staff in every phase so the capability stays when the engagement ends. The register is collegial throughout. No sentence claims that earlier projects lacked expertise, that legal engineers know the work better than the people who do it, or that subject matter experts were a flawed model.
- **Technology, consulting, and managed services, integrated** (writer's note 4): the subtle statement in "What we assert from practice", in one passage, with the ontology as the connecting structure and the same legal engineers carrying the work across the phases. The article never says that nobody else combines them, and it never characterizes any other provider. It says what Spaarke's structure is.
- **Building the internal AI capability**, shown phase by phase (context and guardrails from design, an evaluation set from build, proposing mode and recorded decisions from deploy, widening autonomy on evidence from manage, skills from legal engineers working alongside staff) and stated as a requirement the method meets. The evidence is the figures in "Why now" plus the roles finding carried in article 2 (reference it: "As the second article noted, ...").
- **One ontology, supported by systems of record**: Spaarke can provide the system of record, and an organization can connect third-party systems of record. The article states, in one place and plainly, the advantages of working from the Spaarke system of record and the work and limits that come with pulling data from external systems (source of truth, identifier matching, refresh, and what the third party's interface permits for reading and writing).
- **A set of short scenes in place of one worked example** (writer's note 6, confirmed 2026-10-05: "use the scenes"). Each phase carries one short scene, told with "Consider" in the present tense, with no invented figures, from different parts of legal work and from both kinds of organization. The scenes show strategic and operational value of several kinds. The plan fixes the five:
  - Envision (legal operations in a corporate department): a business unit's request for a standard agreement, and who decides whether it needs a lawyer (speed to the business, and the guardrails that make it safe).
  - Design (a law firm): accepting new work after a conflicts check, a capacity check, and a view of the client (growth and risk together).
  - Build (a corporate department): a regulatory inquiry, and who must be told, what must be preserved, and who decides (readiness).
  - Deploy (a law firm): what a client's general counsel needs to see this week about an engagement (the relationship).
  - Manage (a corporate department): early legal involvement, and which transactions trigger a review before terms are agreed (risk caught earlier).
  The matter budget decision from article 2 may appear once, in a passing reference, and carries no phase of its own.
- **Cross-links in the citing first person** ("In our earlier article, [title], we discussed...", five or six in a long-form piece), every target dated earlier than 2026-10-06:
  - [The New Mandate for Legal Operations](/why-spaarke/managing-legal-operations)
  - [How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform)
  - [The Legal Operations Intelligence Ontology](/why-spaarke/legal-operations-ontology)
  - [From Spend Analytics to Legal Operations Intelligence](/why-spaarke/from-spend-analytics-to-legal-operations-intelligence)
  - [Knowledge Management: The Context Behind Legal Operations Intelligence](/why-spaarke/knowledge-management-legal-operations-intelligence)
  - [Legal Ops Is Not IT for Lawyers](/why-spaarke/legal-ops-is-not-it-for-lawyers), for ownership inside the organization
  - [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic), for the point at which a calculation decides and AI proposes (cite by the short title, per `style-guide.md` section 4)
  - [The UX That Legal IQ Requires](/why-spaarke/the-ux-that-legal-iq-requires), for the surfaces
  - [Tenant-Dedicated Deployment](/why-spaarke/tenant-dedicated-deployment) and [Your Legal Data Belongs to You](/why-spaarke/your-legal-data-belongs-to-you), for the tenant and the data
  The plan keeps six in the body, where each carries a point, and puts the rest in related reading. Confirm each slug against `content/blog/` at polish.
- **The close**: four beats under a heading that reuses the key term from the title (the plan sets it as "method"): a short synthesis paragraph; the thesis formula and the sentence that discharges the title; the first moves above; and the hand-off to the Envision article.
- **The closing contact line** from `voice/bylines.md` section 6, after the final paragraph and any related-reading links.

# Must NOT include

- **Any other provider by name, any provider comparison, and any provider fact.** The writer ruled on 2026-10-05 that this is a viewpoint piece and not a fact piece. The comparison table, the consulting-method research, and the neutral-naming rule from the October report are not used. Where the article contrasts technology, consulting, and managed services, it speaks of the three in general terms, acknowledges that they are sometimes combined, states what Spaarke does, and makes no claim about how any other provider works. It does not call another approach inadequate. (The research stays in `idea.md` for later pieces.)
- **A claim that Spaarke's combination is unique.** The article describes a specific, integrated structure and does not assert that no one else offers two or three of the elements.
- **A framing of the system of record and the platform as rivals, as two modes, or as a migration path.** There is one ontology, supported by systems of record, with Spaarke as the system of record where that suits and integrations where it does not. No sentence frames Spaarke as either a system of record or an overlay, and none says "start where you are, move when you want." Nor does the article belittle systems of record: it says what they do well and that they are one source among the platform's many.
- **The repeated formula "a law department or a law firm".** It appears at most once, in the opening, where the method is said to apply to both. After that the draft says "legal operations" or "the organization".
- **Claims `voice/product-knowledge.md` rules out:** a zero-copy or live-binding claim for third-party systems, a shipped write-back to a third-party system of record, identity resolution or bitemporality as shipped capability, Spaarke's own MCP server (roadmap), internal layer numbers, entity or service names, waves, and pricing.
- **The source of the forward-deployment idea.** The writer wants "forward-deployed" and "forward deployment" used as terms of art (ruling of 2026-10-05, superseding the earlier instruction to avoid them). The article uses them sparingly and without explanation of their origin, mentions no company as their source, and does not use other terms from that program ("bootcamp", "AIP", "Foundry", and product or platform names). One caution for the writer: the phrase is closely associated with one company in the minds of some readers, which is a reason to define the idea in plain words each time and to keep the usage light. A plainer companion ("embedded") is available if the writer prefers.
- **Cost or finance as the measure of the method.** Cost, spend, and budget decisions are one kind of value among several. No section or scene frames the method as a way to save money, and the closing first moves carry no savings target.
- **One example carrying the article, or an example told in the style of a case study with figures.** The scenes are short, varied, drawn from both kinds of organization, and carry no invented before and after figures.
- **Any sentence that reads as uninformed or arrogant about subject matter experts, practitioners, or end users** (writer's note, 2026-10-05). Legal engineers are not presented as a successor to subject matter experts or as people who know the work better than those who do it. The practitioners' and users' knowledge is the source material of the platform, and the draft says so.
- **A sales close, a price, a timeline, or a result claim.** There is no referenceable customer engagement, so the piece states the mechanism and uses illustrative scenes. If a real engagement becomes referenceable before publication, the writer decides whether to use it.
- **A restatement of articles 2 and 3.** Those articles say what to build and why; this one says how the work is organized and links back for the reasoning. A figure an earlier article carried is referenced, not restated.
- **A rigid waterfall, or a trademark symbol on the method.** The phases overlap in practice and the name is used plainly.
- **An AI-first frame.** AI is a capability the method builds, and the starting point is the decision. Both claims from `stance.md` section 9 appear together: AI is the force reshaping the legal function's operating model, and today's AI has limits that make a deterministic calculation the right tool for some decisions, so the piece names which decisions use which.
- **Authority verbs wrong for the party** (`stance.md` section 2): the organization decides, owns, sets, approves, and accepts; legal operations and legal engineers build, facilitate, curate, and manage. No sentence has legal engineers or Spaarke deciding what the organization's agents may do. Business teams manage clearly scoped activities inside guardrails the department sets, and no sentence has legal risk attaching to the business.
- **A corporate-only voice.** No section assumes the reader is an in-house lawyer. A firm reader sees their own decisions, their own vocabulary (realization, utilization, practice area, client billing guidelines), and their own role in the shared engagement, in the scenes and in the phases.
- **Em dashes and the constructions in `voice/examples/ai-tells.md`,** in particular negation followed by correction in describing how other models work, "X, not Y" taglines for the method's claims ("a platform, not a project"; "a platform, not a database"), and a colon reveal for the five phases.
- **Items from `voice/examples/avoid-this.md`,** and the words in `vocabulary.md` section 2.
- **A counted list of causes.** The five phases are things the reader performs, which meets the test for a counted framework. They are delivered as one section with a bold bare-noun label for each (one of at most three bold lead-in lists), all labels worded the same way.

# References

Internal:

- The five earlier articles of the Legal Operations Intelligence series and the articles listed in Must include.
- `content-platform/voice/brand-positioning.md` (positioning, section 2), with the caveat in "Unresolved" below.
- `content-platform/voice/product-knowledge.md` (limits on claims).

External sources, only those already in the research library, each given with source, instrument, year, and sample on first use, in short form (the writer, 2026-10-05: do not over-engineer the attribution). Every one is re-read against its source at the polish gate.

- Harbor, 2026 Maturity Index, May 11, 2026: "Technology is in place. The operating model has not kept up." (confirmed; sample not disclosed, so no sample is printed.) Harbor release: https://harborglobal.com/about/press-releases/new-harbor-research-finds-legal-departments-surging-ahead-on-ai-but-operating-model-gaps-are-limiting-scale/
- Axiom, 2026 Legal AI Survey, July 9, 2026, 528 in-house leaders in six countries, fielded March 2026: 7% have scaled AI beyond pilots (corrected). Release: https://www.axiomlaw.com/resources/press-releases/legal-ai-is-everywhere-but-only-7-of-legal-teams-have-made-it-work
- ILTA, 2026 Technology Survey, announced September 14, 2026, 508 law firms: "Nearly every responding firm (94%) is now engaged with GenAI, up 14 points from last year", and, at the close of its cloud discussion, "The platform migration is largely complete, but the governance migration has yet to begin." Both sentences read verbatim from the executive summary on 2026-10-05, and the 508 firms from the release. Release: https://www.iltanet.org/blogs/ilta-news1/2026/09/15/ilta-releases-2026-legal-technology-survey-results ; executive summary PDF: https://higherlogicdownload.s3.amazonaws.com/ILTANET/ce7f3e74-fb70-402e-a1b3-5dc0abe72260/UploadedImages/Misc%20PDFs/2606_ILTA_Executive_Summary_FINAL__1_.pdf
- Deloitte UK, The AI Imperative, July 9, 2026, 121 senior legal leaders: 84% have not redesigned roles around AI. Carried in article 2, so referenced there and not restated.

Not cited, by decision: Axiom's 83% finding on AI spend and Harbor's "0% have a mature framework for measuring AI's business impact" (the first because the piece avoids framing value as spend, the second because it needs a disclaimer about its methodology that `style-guide.md` section 5, rule 12, converse, says to cut), provider websites and announcements, and consulting-method summaries.

No companion white paper. LinkedIn syndication posts (a company-page post and a founder post) follow through `content-pipeline` as separate pieces, as with the earlier series.

# Voice notes

- **Register.** The strategy-consulting long-form register of `voice/style-guide.md`, in the form the writer settled after the Legal Operations Intelligence series (`voice/examples/house-exemplar.md` and `author-calibration.md`): an informed colleague explaining a position, operator to operator. The article describes Spaarke's own practice, so the arguing "we" is available throughout ("we start", "in our experience") where the experience is real, and the citing "we" introduces the cross-links. The announcement "we" stays out.
- **Audience.** The draft is written to the legal operations director and the firm operations leader together. The persona file lists the law-firm operations leader as secondary and the department-side readers as primary; this brief departs from that on the writer's instruction, and the departure applies to this piece and its revisions only. "Legal operations" is the inclusive term for both. Firm vocabulary comes from `voice/audience-personas.md` (realization, utilization, practice area, client billing guidelines, originating partner), and "matter type" is the department register while "practice area" is the firm register (`vocabulary.md` section 3).
- **Opening.** The first sentence states the claim in Spaarke's voice with no source attached, the second names the AI imperative as the force, and the first attributed figure arrives no earlier than the third sentence. The thesis formula arrives within the first 250 words. One sentence says that legal operations is a function in law departments and law firms alike and that the method applies to both.
- **Headings** render verdicts, in sentence case. The proving section's heading repeats the thesis formula. Imperative headings are available where a section is the move itself.
- **Terms.** "Legal professionals" for shared operational work, and "attorneys" only for attorney-only activity (`vocabulary.md` section 3). One term for one thing: "legal engineer", "phase", "decision", "ontology", "system of record", "legal operations", "the organization". "Legal operations intelligence platform" and "the platform" for Spaarke's product, per `vocabulary.md`. "Forward-deployed" and "forward deployment" used as the writer asked, sparingly and defined in plain words.
- **Phase labels.** The five bold labels use bare nouns ("**Envision.**"), one grammar across the set, each followed by what happens, who does it, and what exists at the end.
- **Scenes.** Told with "Consider" in the present tense, no blanket disclaimer that they are illustrative, no invented figures. Each closes on which part of the work was hard, in the manner of the published article (`house-exemplar.md`, pair 4.11).
- **Exhibits.** One exhibit is drawn: the loop of five phases with what exists at the end of each. Its title is a full sentence stating the claim, the caption, alt text, and the section's labels use the same words, and the five labels match the five bold labels in the body.
- **Related reading** follows the close as a plain list of links, then the contact line.
- **Gates for a release this week.** The writer wants release this week, with the display date equal to the real publish date and no source dated on or after it. The gates still run in order. The compressed path agreed on 2026-10-05: plan with the writer's sign-off (given, subject to the refinements in this version), one drafting pass, the voice lint with 0 errors, the four review lenses (voice, fidelity, evidence, stance), hero, then a human-driven publish.

# Hero graphic

**Direction (writer's note 7, approved 2026-10-05: "let's try the new scheme"):** the series hero keeps the same vibe, which is geometric, abstract, confident, and uncluttered, and drops the dark navy and purple of the earlier series. The earlier series used deep blue, violet, gold and amber, rust, and magenta, all on a dark canvas. This series uses a **teal-to-green family carried through the whole composition**, with a **warm coral accent** on the focal node, a lifted canvas that is deep teal and visibly lighter than near-black, and a clearly lighter set of shape fills so the geometry reads at thumbnail size.

This departs from `voice/visual-identity.md`, which describes a dark, navy-and-blue palette and lists the five hues already taken. The guide's own series rule ("carry the hue through the whole composition", "separate the canvas from the geometry by value, not by hue") is followed, and a new hue family is added for this series. At the Hero gate the guide gains a section for it, and the palette goes in `scripts/recolour-series-heroes.mjs` alongside the existing ones so later articles in the series take their own hues from the same family. Each later article then gets its own variant (for instance a lime, a cyan, and a deep green), so the series reads as one family on the index.

Proposed palette, to be tuned at the Hero gate against the contact sheet:

| Role | Colour | Note |
|---|---|---|
| Canvas gradient | `#0F3B3A` centre to `#0A2A2C` to `#06181B` edge | deep teal, two or three steps darker than the shapes |
| Plane and node fills | `#1E6F66`, `#2B8F7F`, `#3FB59A` | mid to lifted teal, readable against the canvas |
| Fine lines and edges | `#B5F2DC` at 1.6 to 2.4px | pale mint, high contrast on the canvas |
| Focal accent | `#FF7A59` (coral) | one node only, small, not a wash |
| Glow | `#3FE0B5` at 20 to 28% | restrained, large and soft |

**Prompt** (paste-ready; the default route is hand-written SVG, so this serves as the specification):

Minimalist geometric vector illustration, abstract and symbolic, no text, no people. Five identical rounded nodes arranged on a gentle circle and joined by a thin continuous line that closes on itself, to show a loop. The line leaves the fifth node and rejoins the first. One node, the first, is slightly larger and carries a single coral accent, to suggest the first decision. Deep teal canvas with a soft lifted centre, shapes in mid and light teal, pale mint hairlines, a restrained green glow behind the focal node. Centered focal element, generous negative space, shallow 2.5D depth, flat shading. Editorial illustration in the McKinsey Quarterly and Harvard Business Review house style. 16:9. No gavels, scales, or columns, no robots or neural meshes, no circuit patterns, no futuristic dashboards, no glowing particles, no Microsoft marks, no navy or violet.

**Style preset**: minimalist geometric, deep teal canvas with a lighter teal set and one coral accent, shallow 2.5D.

**Aspect ratio**: 16:9.

**Alt text**: A loop of five connected nodes in shades of teal, the first drawn larger and in coral, on a deep teal background.

**Generator notes**: SVG by default per `CLAUDE.md`; build the loop as vector shapes at 1600 by 900, then run `node scripts/rasterize-assets.mjs` and `node scripts/hero-contact-sheet.mjs`, and judge the result at the thumbnail size the index renders as well as at full size. Regenerate the LinkedIn header with `scripts/generate-linkedin-headers.mjs`, and write the SVG's `<desc>` so that it names the actual colours.

# Unresolved

Markers still open, and decisions the brief depends on.

1. **Positioning guides disagree with the new wording.** `voice/brand-positioning.md` (2026-09-22) and `voice/product-knowledge.md` still describe Spaarke as supporting "both modes". The writer decided on 2026-10-05 to adopt the one-ontology wording ("for SOR, yes adopt the wording and use it"). The draft uses the new wording now. The two files and the October report's idea.md get a matching edit after the article ships, and the writer's definition of a system of record and of the platform (see "Angle") is worth adding to `brand-positioning.md` at the same time.
2. **The campaign.** Settled 2026-10-05. The campaign file exists, and the milestone and Issue are created at the content-pipeline step.
3. **The managed services line.** Settled 2026-10-05: the article says they run alongside the organization in the Manage phase, and what each includes stays out.
4. **External figures.** Harbor and Axiom are confirmed in the research library. The ILTA figures are confirmed against the primary on 2026-10-05. All are re-read at the polish gate, and the quoted sentences are checked verbatim.
5. **The legal engineer definition, the term, and forward deployment.** Settled 2026-10-05 as recorded in "What we assert from practice". The article makes no statement about any other provider's use of the title or any certification.
6. **The scenes.** Settled 2026-10-05: use the five scenes in Must include. The writer may add or swap a scene from practice at any gate.
7. **The hero palette.** Approved 2026-10-05. The visual identity guide and the recolour script get the matching update at the Hero gate.
8. **The close's key term and the discharge sentence.** The plan sets "method" and proposes the sentence; the writer approved the outline on 2026-10-05, subject to the refinements in this version.
9. **The Envision article.** Working title set: "Envision: How Legal Operations Defines Its Intelligence". Slug to be settled when that article is briefed.
10. **The source essay.** Settled 2026-10-05: it is saved with the other research materials that the repository does not publish, in the private archive `C:\code_files\spaarke-research\2026-10-spaarke-method\`. This brief does not cite it.
