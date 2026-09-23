---
slug: legal-operations-ontology
type: blog-post
publish_date: 2026-07-21            # display date (a Tuesday, settled 2026-09-22); article 3 of 5 in the Legal Operations Intelligence series. The real publish date goes in posted.
channels: [website, linkedin]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: high                      # first public expression of the ontology frame; time-sensitive against the "context graph" framing that entered the legal vocabulary in May 2026; the key article for Spaarke: it defines the foundation of the solution (writer, 2026-09-22)
audience: legal-ops-director        # primary; corporate-counsel and legal-tech-cio secondary
length_target: open                 # long-form article; the length is whatever the topic requires (content-types/blog-post.md section 2.1)
byline: spaarke                     # organizational byline, which the series decision keeps (voice/bylines.md section 1); the closing contact line names Ralph Schroeder, Founder and CEO (section 6)
campaign: 2026-06-legal-operations-intelligence   # the series campaign (content-platform/campaigns/2026-06-legal-operations-intelligence.md; GitHub milestone "2026-06 Legal Operations Intelligence", number 5), which carries each article as an asset
github_issue: 79   # https://github.com/spaarke-dev/spaarke-website/issues/79 (created by content-pipeline, 2026-09-22)
triggered_by: Ontology-centric platform strategy synopsis v2.0 (Ralph / Claude working session; kept outside this public repository) and idea.md rev. 4 (series refinement); writer's brief feedback applied 2026-09-22 (the brief moves from v2 to v3)

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: "The Legal Operations Intelligence Ontology"
description: "The foundation of legal operations intelligence is an ontology, the model of the entities a department works on and the actions it may take on them."
summary: "Every legal department has a matter table, a document repository, and an invoice feed, and each holds one dimension of the work, bounded by its own data model. An ontology holds the context across all of them: the relationships among those records, the actions the department may take, and the record of what it decided to do. That context is what turns a record into an insight, and it is why the ontology is the foundation of legal operations intelligence."
date: 2026-07-21                    # display date
posted: "**TBD — confirm**"         # the real publish date: push week 3 Tuesday of the campaign's distribution sequence, entered when the push start date is set (writer, 2026-09-22)
author: "Spaarke Team"
tags:
  organization: [corporate-legal]
  function: [operations, it, executive]
  topic: [matter-management, workflow, legal-spend, compliance, ai-copilot]
  theme: [legal-operations-intelligence, operational-memory, platform, iq-stack, ai-strategy]
heroImage: "/articles/legal-operations-ontology/hero.svg"
heroImagePosition: "center"
draft: true
keyTakeaways:
  - "An ontology adds relationships, permitted actions, inquiries, typed outputs, and governing rules to the tables a department already has. Most departments have a matter table; few hold the relationships, such as the invoice line bound to the budget."
  - "A system of record sees one dimension of the department's work, bounded by its own data model, and it returns raw data without the context that makes data insight. The ontology holds the context across every system, and that is why it is the foundation of legal operations intelligence and why no single system of record can be."
  - "Business intelligence reports what happened and does that job well. An ontology also records what the department decided to do about it, who acted, and under which policy, and business intelligence reads that record too."
  - "AI lowers the cost of building the model, and agents raise the value of having one. An agent that reads governed entities has less room to invent them, and all agents share one vocabulary."
  - "An AI model can be replaced through configuration, and the ontology belongs to the department. Solutions built on it inherit its definitions and permissions, which requires the systems beneath to expose documented, permission-aware interfaces."
  - "Rules dominate a legal ontology: privilege travels with the entity, counterparty paper is an adversarial source, and ethical walls partition the graph. Generic enterprise models carry none of these rules."
---

# Topic

An overview of what an *ontology* is when it serves as the foundation of
a Legal Operations Intelligence platform. The ontology is the model of
the entities a legal department works on (matter, project, invoice,
request, document, communication, obligation, policy), the
relationships among them, the actions the department may take on them
under rules it wrote, the inquiries that can be put to them, and the
typed outputs those actions produce. It is bound to the systems where
the department's data already sits, and it holds the context across
all of those systems that no one of them holds. It supplies the entity
and action model, and its purpose is to make information actionable
for people, for business intelligence (BI), and for AI agents. Article
2 of the series,
[How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform),
describes the platform as the department's capabilities across process,
people, and technology, with technology as the tangible instantiation,
and its final section introduces the ontology in five concepts: the
platform combines data and information with context, by integrating
multiple sources and by augmenting them with organizational knowledge;
a system of record gives one-dimensional insight bounded by its own
data model; the ontology is the foundation and provides
multidimensional insight across the systems of record; the ontology
carries actions, inquiries, policies, typed outputs, and governance;
and the ontology must be built with a deep understanding of process
and people. This piece opens from there and develops each of those
five concepts. It introduces the term to a legal operations reader
who has heard "data model", "knowledge graph", and "context graph" and
needs to know why this one is different and why it matters more than
whichever AI model sits on top.

# Angle / Point of view

[The AI Readiness Gap in Legal Departments](/why-spaarke/the-ai-readiness-gap)
argued that the data architecture, more than the tool, limits what
legal AI can do. This piece names what that architecture has to be. The
thesis is a direct statement, and it leads with the definition and the
reason the ontology is foundational. The writer asked on 2026-09-22
that the definition and its value come up front, so the opening may
introduce the word early, provided that the scene or the gap comes
first within the first section (`voice/style-guide.md` section 3). The
sentence that will appear in the opening: *The foundation of legal
operations intelligence is an ontology: a shared model of the entities
a department works on, the relationships among them, the actions it
may take on them, and the rules that govern those actions.* The
sentence that follows it says why that model is high-value: *That
model is the one layer that people, business intelligence, and AI
agents can all read from and act through, and it holds the context
across every system the department uses, which is what turns the
records those systems hold into insight.* The reader should walk away
believing four things:

1. **An ontology adds relationships, permitted actions, and governing
   rules to the tables a department already has.** Most departments
   have a matter table. Few hold the relationships, such as the email
   thread bound to the matter, the invoice line bound to the budget,
   and the department's matter bound to the firm's matter, and those
   relationships are the asset.
2. **A system of record holds one dimension of the work, and the
   ontology holds the context across all of them.** Matter management,
   contract lifecycle management, document management, and e-billing
   each see one dimension of the department's work, bounded by their
   own data models. Where a system has no field for a piece of
   information, that information does not exist for it. Each holds raw
   data and returns raw data, without the context that turns data into
   insight. The ontology holds the comprehensive context: the entities
   across all of those systems, their attributes and relationships,
   the actions permitted on them, the inquiries that can be put to
   them, the policies that govern them, the typed outputs they
   produce, and the governance around all of it. That is the
   difference between a record and an insight. It is also why the
   ontology is the foundation of legal operations intelligence,
   because no single system of record holds enough of the context to
   be that foundation. The contrast concerns the data model of any
   single system, which applies to Spaarke's own system of record
   capabilities as much as to any vendor's, so it stays consistent
   with the both-modes positioning, names no vendor, and disparages no
   product category. The article states this belief strongly, because
   the piece defines the foundation of the solution.
3. **The unit of value is a governed decision.** Business intelligence
   and its dashboards report what happened, and they do that job well.
   The ontology adds the record of what the organization decided to do
   about it (who acted, under which policy, and on which facts), and
   business intelligence reads that record as well. Across 200 matters
   and four quarters the decision record becomes evidence that the
   department could not otherwise assemble, because the decisions were
   never captured as data.
4. **An AI model can be replaced through configuration, and the
   ontology belongs to the department.** Rebuilding the semantic layer
   that makes a department's data intelligible takes years. Where a
   department runs several AI tools at once, the lasting asset is the
   layer that gives all of them the same definitions.

What Spaarke pushes back on is the treatment of a data warehouse, a
data lake, or a single system of record as the platform's foundation.
The warehouse and the lake can hold every record the department
produces, and neither models what may be done to those records, by
whom, or under which rule. A single system of record models its own
slice of the work and nothing beyond its data model, so it returns raw
data without the context that makes data insight, whereas the
ontology, which holds the context across all of the systems, provides
the insight. Business intelligence is the deterministic dimension of
the platform: it reads across the entities the ontology defines,
computes facts such as a budget variance the same way every time, and
reports them, and the ontology gives it a place to act and a decision
record to read back. The two "context graph" announcements of May 2026
cover document management content and activity. The first lists
documents organized by matter, communications, people, activity, and
permissions, and it does not mention spend, e-billing, outside counsel
management, or matter management; the second was reported with a
similar scope. Context drawn from documents is therefore one layer of
the model, and the department's operations reach further. The article
names neither provider and argues that observation on its merits. The
ontology gives structure to the Data and Memory layers of the Legal IQ
stack, and it is what lets Inference read over a record instead of a
pile.

# Why now

Every bullet rests on evidence dated on or before 2026-07-20, the
cut-off for a display date of 2026-07-21. The statuses come from the
evidence tables in `idea.md` and from
`content-platform/research/2026-09-loi-series/DIGEST.md`. The
round-two note `notes/r2-ontology-date-discipline.md` was run against
the earlier display date of 2026-07-14, and on 2026-09-22 every source
in it was re-checked against 2026-07-20; the week of 2026-07-14 to
2026-07-20 moves three items inside the window (two archive captures
and one critique that stays out by decision) and changes no argument.

- **Several AI tools at once is the steady state.** CLOC's 2026 State
  of the Industry report (released 2026-03-02; 135 departments; based
  on the 2025 Harbor Law Department Survey) found that 85% of
  departments have dedicated AI oversight or resources and that 80%
  name technology strategy as a priority. Both figures are confirmed,
  and the release wording is the wording to use. A department that runs
  several assistants and agents needs a layer that governs, routes, and
  measures them and that gives all of them the same definitions of
  "matter", "budget", and "obligation". Survey evidence on how many
  tools a department runs is thin, and the article says so; the writer
  has left out the vendor-commissioned surveys, and the point is made
  as discussion. One vendor observation is usable once, attributed as
  such: iManage's chief executive said on 2026-05-14 that "Customers
  are not choosing one AI tool and stopping there." The sentence is
  researcher-read from the 2026-06-11 capture of the release, and the
  fact-checker did not itemize it, so it stays **TBD — confirm** until
  it is checked (evidence table E).
- **Agents can now reach legal systems.** Anthropic entered the legal
  vertical by name with Claude for Legal on 2026-05-12, with "20+ new
  MCP connectors" and 12 plugins. In the same weeks iManage released
  its MCP Server (2026-05-14), naming Harvey, Legora, ChatGPT, Claude,
  Microsoft Copilot, and a firm's own agents as clients; Thomson
  Reuters connected CoCounsel Legal to Claude through MCP (2026-05-12);
  and LawVu announced an MCP server for its legal workspace
  (2026-06-02) with stated write actions for the initial release. Most
  of this was announced for law firms, some of it is in preview or
  stated in the future tense, and the write capability of most
  connectors is unconfirmed. A connection also does not tell an agent
  what the things in those systems are or what may be done to them,
  and that question is the subject of this piece.
- **A general-purpose platform vendor now ships an ontology beside
  BI.** Microsoft announced Fabric IQ as generally available at Build
  on 2026-06-02 and said that ontologies in Fabric IQ were expected to
  become generally available in the coming months; its documentation
  as of 2026-07-09 still labelled the ontology item a preview. The
  article states this neutrally, as evidence that the ontology has
  become a product category in enterprise data platforms, and offers
  no build-versus-buy commentary.
- **Analysts now tie agent accuracy to semantics.** A Gartner press
  release of 2026-05-11 predicts that organizations that prioritize
  semantics in AI-ready data will improve agentic AI accuracy by up to
  80% and reduce costs by up to 60% by 2027. The release is confirmed
  from gartner.com. The writer's decision is to use it once, framed as
  the analyst's prediction (`voice/domain-knowledge.md` section 6).
- **"Context graph" entered the legal vocabulary in May 2026.** Two
  document management providers announced a context layer within weeks
  of each other (2026-05-14 and 2026-05-22), and both announcements
  are scoped to document management content and activity. The article
  keeps the frame generic and names neither vendor. The LinkedIn post
  `context-is-only-one-layer` first stated the position that context
  is one layer, and the library has no long-form piece that says what
  the broader structure is.
- **The library has a gap.** The published articles argue for unified
  data and operational memory, and none names the form that unified
  data has to take. This is the missing foundational piece between
  `the-iq-stack` and `probabilistic-vs-deterministic`.
- **Departments are taking more work and more control in house.** The
  ACC and Everlaw survey (released 2025-10-14; 657 in-house
  professionals in 30 countries) found that 64% expect to rely less on
  outside counsel and that generative AI use rose to 52% from 23%. The
  fact-checker saw both figures. One research track reads the 52%
  figure as United States respondents only, so the draft confirms its
  base before use or uses only the 64% figure. The survey speaks to
  control, and it does not measure demand for open platforms or for
  building.
- **Reported adoption and reported value diverge.** The Thomson Reuters
  blog of 2026-07-02 summarizes the 2026 Future of Professionals Report
  and states that 78% of corporate clients call AI-enabled quality
  improvements very important or essential, while 6% say most of their
  providers deliver it. Those figures are confirmed on the blog page,
  and the bullet is optional. The phrasing "gap between adoption and
  realized value" stays **TBD — confirm** against the report itself,
  and the draft uses the confirmed figures instead if the phrasing is
  not confirmed.

# Must include

The bullets follow the order the plan should try first. Each names the
evidence it rests on; the status of every row is in `idea.md` (evidence
tables A to I) and in the research digest.

- **A concrete opening that reaches the definition within the first
  section and states, in the same passage, why the ontology is
  high-value and why it is the core and foundational basis of legal
  operations intelligence.** Open on the budget-variance scene or on
  "every department has a matter table", and let the reader feel the
  gap before the word arrives. The reader is experienced, so the build
  is short, the word may arrive early (writer, 2026-09-22), and the
  definition lands by the end of the first H2. The working definition
  the reader can carry: *an ontology is a model of the things a legal
  department works on, the attributes of those things, the
  relationships among them, the actions that may be taken on them, and
  the rules that govern those actions, bound to the systems where the
  data already sits.* The same passage says why that model is
  high-value and foundational: it holds the context across every
  system the department uses, that context is what turns the records
  those systems hold into insight, and it is the one layer that
  people, business intelligence, and AI agents can all read from and
  act through, so everything else in legal operations intelligence
  rests on it. The definition uses "relationships"; after it,
  the article may use "links" as the shorter working word. "Bound to
  the systems where the data already sits" is Spaarke's design
  principle, and the article attributes live or copy-free behaviour to
  no researched source. Microsoft Learn informs the definition and may
  be named: its ontology overview (the revision of 2026-05-14, which
  stayed live through 2026-07-20) defines an ontology as "a shared,
  machine-understandable vocabulary of your business", made of things,
  facts, and connections, kept consistent by constraints and rules, and
  linked by data bindings to the organization's data sources. The same
  page says that upstream changes must be refreshed manually before
  they appear, so the article does not describe Microsoft's binding as
  live. The operational platform model research
  (`notes/palantir-intelligence-platform-model.md`) is the background
  for the decision-centred idea, which the article states from the
  legal department's side: the model holds, for each decision the
  department takes, the rule that evaluated it, the person who
  released it, and the outcome, alongside the records the decision was
  about. The article states that idea in Spaarke's own words and
  attributes it to no one. Neither the article nor the plan reuses the
  construction "represents the decisions ... as well as the data", in
  any wording, because it mirrors the source's headline sentence. Cite
  [What Is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence)
  once, near the definition.
- **The concepts article 2 introduced, developed here.** Article 2,
  [How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform),
  introduces the ontology in its final section, and the first of the
  two planned in-body links to article 2 belongs here, where this
  piece picks the concepts up (the second is in the section on the
  systems already in place). Each of the five is developed in a named
  place:
  - *Data and information combined with context*, by integrating
    multiple sources and by augmenting them with organizational
    knowledge: developed in the definition and in the contrast
    section.
  - *One-dimensional insight from a system of record*, bounded by its
    own data model: developed in the contrast section.
  - *Multidimensional insight across the systems of record*: developed
    in the relationships part and in the worked example.
  - *Actions, inquiries, policies, typed outputs, and governance*:
    developed in "The three parts" and in the worked example.
  - *A model built with a deep understanding of process and people*:
    developed in "How it is built".
- **The three-way distinction, in one paragraph, or two if one is not
  enough.** A data lake stores data, a data warehouse organizes data
  for reporting, and both hold records without the context that makes
  them insight. The ontology holds the comprehensive context that
  insight requires: the entities, their attributes, the relationships
  among them across every system, the actions permitted on them, the
  inquiries that can be put to them, the policies that govern the
  actions, the typed outputs they produce, and the governance around
  all of it. It is what turns the records the lake and the warehouse
  hold into something a person, a BI measure, or an agent can
  understand and act on. The passage says in plain words that the
  ontology provides insight where a database provides raw data without
  context, and it says that the ontology still sits alongside the lake
  and the warehouse and replaces neither. The full list of context
  elements is prescribed for the definition passage, for this
  distinction, and for the contrast section that follows; the plan
  spells it out once, wherever it lands best, and refers to it in
  short form elsewhere (the context described above), so that the
  draft does not print the same enumeration three times. No feature
  table. The glossary definitions in the research notes were not
  fact-checked, so the passage is in Spaarke's words and quotes
  nothing (see References, table A).
- **A system of record holds one dimension of the work, and the
  ontology holds the context across all of them.** A section under
  that candidate heading (sentence case; the plan may shorten it),
  placed after the three-way distinction and before "The three parts",
  drives the contrast home. A system of record, whether matter
  management, contract lifecycle management, document management, or
  e-billing, sees one dimension of the department's work, bounded by
  its own data model. Where it has no field for a piece of
  information, that information does not exist for it. It holds raw
  data and returns raw data, without the context that turns data into
  insight. One concrete illustration carries the section: the same
  matter seen through the matter system, the document system, the
  e-billing platform, and the inbox, each holding a slice (the budget
  and the status, the drafts and the executed agreement, the invoice
  lines, the correspondence with the firm) and none holding the
  relationships among the slices, so that nobody can read from any one
  of them which invoice line belongs to which scope change or which
  email settled the question the invoice describes. The ontology holds
  the context across all four: the entities, their attributes and
  relationships, the actions permitted on them, the inquiries that can
  be put to them, the policies that govern them, the typed outputs
  they produce, and the governance around all of it. The section says
  plainly that the ontology provides insight where a database provides
  raw data without context, and it draws the conclusion in the
  article's own voice, that the foundation of legal operations
  intelligence has to be the layer that holds the context across all
  of the systems, and that no single system of record holds it. The
  contrast concerns the data model of any single system, so it applies
  to Spaarke's own system of record capabilities as much as to any
  vendor's, names no vendor, disparages no product category, and stays
  consistent with the both-modes section later in the piece.
- **The three parts, in order: entities, relationships, and actions
  governed by rules, with inquiries and typed outputs named inside the
  actions part and governance called by that name.**
  - *Entities.* A spine of matter, project, and invoice that everything
    else connects to, with the operational entities around them:
    request, document, communication, party, engagement, timekeeper,
    obligation, deadline, clause, budget, and policy. Two deserve a
    sentence each. **Policy** is a first-class entity (OCG rules,
    triage rules, SLA definitions, and delegation thresholds are the
    same kind of thing: legal-authored, versioned, and deterministically
    evaluable). **Obligation** is a first-class entity (extracted from
    documents, linked to parties and dates, and changing status over
    time).
  - *Relationships.* Every department has a matter table, and the
    relationships are the asset. Name them concretely: communication to
    thread to matter; invoice line to timekeeper to activity code to
    matter to budget; document to clause to obligation to party to
    date; request to matter; and the engagement relationship, the
    department's matter bound to the firm's matter, which few
    departments hold today.
  - *Actions, with gates.* Actions are bound to entities and carry
    authority (who, under which delegation policy) and provenance
    (which rule, which policy version, which evidence, and which person
    confirmed). Describe the release envelope as automatic release, a
    single confirmation, and counsel review (green, yellow, and red).
    The release envelope is what "AI-directed, human-controlled" means
    in structural terms. The article states it as Spaarke's design and
    cites no vendor's default for it.
  - *Inquiries and typed outputs, inside the actions part.* The
    **inquiries** are the questions that can be put to the model in
    business terms (which matters are running over budget, which
    obligations fall due this quarter, which firm's invoices carry the
    most rejected lines), and the model answers them from the entities
    and relationships, which no single system's tables can supply. The
    **typed outputs** are what actions and inquiries produce: the
    fact, the observation, the outcome, and the report card, each with
    a defined shape that a person, a BI measure, or an agent can read.
    Governance is the rules and the release envelope taken together,
    and the article uses that word for it, so that every element the
    writer listed (entities, attributes, relationships, actions,
    inquiries, policies, typed outputs, and governance) is named in
    this section.
- **The worked example, run twice.** *"This matter is running over
  budget; ask outside counsel to investigate."* Business intelligence
  does its job in both runs: it computes the variance and shows that
  the matter is over budget. In the first run there is nowhere to act
  and no record of what was done. Someone opens the report, switches to
  Outlook, writes to the firm from memory, gets a reply in two days,
  and notes it in a spreadsheet, and next quarter the system knows
  nothing more than it did. In the second run the entity and action
  model is underneath. The same variance is a **fact** on the matter,
  computed deterministically and carrying its provenance; a **policy**
  evaluates it into an **observation** linked to the matter, the
  invoice lines, and the engagement; a proposed **budget inquiry**
  action goes out through its gate; the reply is classified back onto
  the inquiry thread; and a typed outcome (write-off, accrual revision,
  approved scope change, or no action) is recorded against the matter.
  Nothing writes to the e-billing system. Across 200 matters and four
  quarters that outcome history is the outside counsel report card,
  which exists only because each intervention was captured as an
  entity, and it returns to business intelligence as new input. The
  contrast is reporting only against reporting with entities and
  actions. This remains the longest and most concrete section.
- **The sentence that closes that section:** *A warehouse records what
  happened to the business, an ontology also records what the
  organization decided to do about it and the context that connects
  them, and business intelligence reads both records.*
- **The dashboard contrast, in one explicit paragraph, written so that
  the dashboard remains a legitimate BI output.** A dashboard does its
  job when it shows that a matter is over budget. The reader must still
  work out which decision is due, gather the supporting information
  from other systems, and leave the tool to act. An entity and action
  model attaches state, rules, and available actions to the entity
  itself, so the decision that is required, the information needed to
  make it, and the means to act arrive in one place, and the outcome
  is recorded against the same entity, which is what "makes information
  actionable" means in this piece.
- **Business intelligence and the ontology work together.** Business
  intelligence is the deterministic dimension of the platform, and it
  computes facts such as the budget variance the same way every time.
  Article 4 develops that argument at length and carries a later
  display date, so this piece makes the complementary point itself in
  one section and reaches article 4 only through the series-navigation
  block. The ontology gives BI consistent entities to read across
  systems, gives the department somewhere to act on what BI shows, and
  returns the record of decisions and outcomes to BI as new input. Two
  Microsoft sources dated before the cut-off corroborate the pairing.
  The Fabric IQ overview (the revision of 2026-07-09) lists business
  intelligence and operational intelligence as separate layers of
  business context beside unified data and says that ontologies can be
  generated from a BI semantic model already in production, and the
  Build announcement of 2026-06-02 says that ontologies "extend
  semantic models by adding operational context". The reading that the
  ontology item supplies the operational layer is the researcher's
  mapping, and the article presents it as a reading. One practitioner's
  distinction is usable and attributed to the author: a BI semantic
  layer standardizes measurement, and an ontology standardizes meaning
  (Jessica Talisman, 2026-01-22).
- **Fact, observation, and inference as three epistemic classes**, with
  the rule that facts are computed deterministically, so that no model
  call produces the variance. Link to
  [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic)
  as the piece that explains why that split matters. The writer
  confirmed on 2026-09-22 that fact, observation, and inference is
  approved public vocabulary (see Unresolved).
- **Why AI has raised what an ontology can do, and why agents need
  one.** The argument runs in two directions: AI lowers the cost of
  building and maintaining the model, and agents raise the value of
  having it. Develop six mechanisms, each with a pre-cut-off source
  from evidence table B.
  - *Grounding.* An agent that reads governed entities and
    deterministic facts has less room to invent them. Gartner's release
    of 2026-05-11 is the analyst's prediction, used once. The Sequeda,
    Allemang, and Jacob paper (2023) is directional only and stays
    unverified (see References, table B).
  - *A shared vocabulary across several agents and tools.* Every agent
    that shares the model uses the same definitions and rules, which
    addresses the difficulty a department faces when each tool defines
    "matter" in its own way. The pre-cut-off Microsoft source is the
    Fabric IQ overview's sentence that its three layers "ensure that
    every agent starts with the same understanding of the business"
    (the revision of 2026-07-09; the Build blog of 2026-06-02 makes the
    same statement).
  - *Questions asked in business terms.* People and agents ask about
    matters, firms, and obligations, and the model translates the
    question into queries against the underlying tables. The Microsoft
    Learn ontology overview (the revision of 2026-05-14) carries the
    confirmed sentence on asking questions in business terms.
  - *Extraction and entity resolution from unstructured documents.*
    Language models can now pull parties, clauses, dates, and
    obligations out of documents and match them to existing entities,
    which used to require manual abstraction. Identity resolution
    across systems remains an open architectural question (see Must NOT
    include), so the article states it as a requirement and describes
    no shipped capability. The GraphRAG paper stays unverified (see
    References, table B).
  - *Actions exposed to agents as governed tools.* An agent receives
    the same defined actions a person has, with the same preconditions,
    permissions, and audit record, in place of open write access to the
    underlying systems. The neutral sources are the MCP specification
    of 2025-06-18 (a human in the loop able to deny tool invocations;
    confirmation prompts) and Microsoft's how-to page on exposing an
    ontology as an MCP server (ms.date 2026-04-14).
  - *Human review of proposed actions.* An agent stages an action, and
    a person with authority releases it; latitude widens as the
    department gains confidence. This is the release envelope, stated
    as Spaarke's design.

  The fourth belief in the Angle follows from these mechanisms: an AI
  model can be replaced through configuration, whereas the semantic
  work that makes a department's data intelligible takes years and
  belongs to the department.
- **A legal ontology carries rules that generic enterprise models
  lack.** Five structural differences, each stated in a sentence or
  two and no longer compressed to fit a word limit: privilege and work
  product are attributes that travel with the entity, where a generic
  model applies access rules from outside; the document is frequently
  the record itself, where in most enterprise models a row describes a
  thing that exists elsewhere; counterparty paper is an adversarial
  source, and values extracted from it carry a different trust class;
  rule density is extreme (OCG, billing guidelines, retention, ethical
  walls, and delegation), so most of what the legal model holds is a
  rule about what may be done; and ethical walls partition the graph
  as well as the rows. The plan carries two instructions. If the
  article uses "constraint-dominated", it explains the word in a clause on
  first use (the rule density it names) and does not pair it with
  "constraint-sparse" as a label. The contrast wording varies from
  difference to difference, so that the section does not read as a
  list of "X rather than Y" pairs.
- **How it is built.** The build starts from a decision the department
  has to make, where many data projects start from a source system or
  a dashboard request. It models the department's reality in the
  department's own terms, for the reason the writer's sentence below
  gives. It begins with the spine of matter, project, and invoice,
  defines each entity once, binds it to the systems where the data
  lives, adds the relationships, and then adds policies and gated
  actions. It grows one use case at a time and is tested against the
  questions that leaders repeatedly ask their teams. Each step depends
  on people who know how intake, matter management, invoice review,
  and outside counsel management run, where the information sits and
  in what shape, and what a general counsel or a finance partner needs
  in order to decide. The article states the writer's point in one
  sentence of its own, and states it once in this section: the
  ontology must be built with a deep understanding of the department's
  processes and its people, and a model built from the systems' tables
  alone reproduces their limits, including the fragmentation the model
  was meant to resolve. Independent observers of the general-purpose
  offerings make the same point, and both quotations are confirmed
  verbatim: "Creating an ontology, in Fabric or elsewhere, is a major
  effort and requires on-going maintenance, so there's no getting out
  of the hard work" (Barry Briggs, Directions on Microsoft,
  2025-12-02), and "If your organization struggles to agree on basic
  definitions now, an ontology won't magically create consensus"
  (Nikola Ilic, 2026-02-03). Existing legal standards supply
  vocabulary and exchange formats that the model uses and does not
  replace: SALI's matter taxonomy supplies values for matter
  attributes, and LEDES and UTBMS define the shape of spend facts. The
  five structural differences above are the legal expression of this
  knowledge. The build method draws on the operational platform model
  research for background, and the article states each step in its own
  words with no attribution. This section respects every exclusion in
  Must NOT include: no roadmap, no waves, no binding modes as a
  commercial claim, and no internal layer or entity names.
- **Where the ontology sits relative to the systems already in
  place.** The settled positioning governs this section: Spaarke
  provides both system of record capabilities and ontology
  architecture over third-party systems, and the article supports both
  modes without setting one against the other. Where a department
  keeps its document management system and its e-billing platform,
  those systems own the documents and the invoices, and the ontology
  binds each entity to the system where the data lives and references
  what it does not own. Where a department uses Spaarke as the system
  of record for the process entities that no other system holds (the
  request, the disposition, the obligation, the policy, the inquiry,
  and the action record), the model and the record live in one place.
  The honest point stays in either mode: the ontology binds to systems
  it does not own wherever that is how a department deploys it, and
  the article says so plainly. The integration purpose belongs here as
  well. The ontology is how information and context from the systems
  already in place become part of the platform that article 2
  describes, and the section links to article 2. Identity across
  systems is stated as a requirement, and no shipped capability is
  described. The "context graph" observation from the Angle belongs in
  this section, argued generically.
- **Two or three shorter uses beside the long example**, drawn from
  evidence table C: a question asked in the department's terms rather
  than in table terms; several AI tools that mean the same thing by
  "matter"; business intelligence reading across consistent entities;
  and an answer that shows its freshness and provenance.
- **Every answer shows its freshness and provenance.** One sentence of
  the form *"This obligation was inferred from a contract indexed four
  hours ago and confirmed by counsel on the 8th"*, which is the kind of
  answer a department can defend.
- **APIs, the Model Context Protocol, and open environments, in one
  section.** An entity and action model needs to read from the systems
  of record and, where an action completes in one of them, to write
  back through an interface that system governs. Between May and early
  July 2026 the legal solution providers and one frontier model
  provider moved in that direction: document management, e-discovery,
  agreement, legal research, and matter management providers published
  MCP servers or appeared as connectors. The confirmed write examples
  are administrative and workflow actions, and each is attributed to
  the source that states it. The Box, Datasite, Relativity, and
  Docusign examples (create or update content; set up folder
  structures and invite users; stand up matters and shape workspace
  schema; orchestrate agreement workflows) are connector descriptions
  on Anthropic's Claude for Legal page, so they are Anthropic's words
  about those connectors. The LawVu examples (create matters, trigger
  contract workflows, update matter status, create tasks, and set
  deadlines) are in the vendor's own launch article, stated in the
  future tense for the initial release, so the article writes
  "announced". The iManage release describes governed access to content
  and states no write action, so the article does not call it
  read-only. Three limits hold. First, the research could not confirm
  whether several connectors are read-only, so the article applies no
  read-only or write-capable label beyond what the cited source states.
  Second, the research found no confirmed example of an agent writing
  spend data into an e-billing or matter management system of record.
  Third, the case that legal solution vendors must provide open
  environments is voiced mainly by vendors that ship connectors, by the
  trade press, and by individual practitioners, and the research found
  no formal statement from CLOC, ACC, or ILTA. The article makes the
  case as Spaarke's own argument: a department can succeed with an
  entity and action model only if the systems it depends on expose
  documented, permission-aware interfaces for reading and writing. One
  paragraph gives the counter-positions: a content provider that is
  selective about MCP on grounds of authority and attribution
  (LexisNexis, 2026-06-10); the security responsibilities the protocol
  leaves to implementers and operators, drawn from the specification
  of 2025-06-18 (authorization is optional; a human in the loop should
  be able to deny tool invocations; annotations are untrusted unless
  the server is trusted), the maintainers' post of 2026-03-16 (a tool
  with no annotations is assumed potentially destructive, and clients
  vary in how strictly they honour the defaults), and the release
  candidate of 2026-05-21 that hardened authorization (the post names
  the date on which the final specification was to be published; that
  final release is out by date, and the article cites the release
  candidate only); and the dependence that forms one layer up when a
  department's playbooks are encoded inside a single AI provider's
  plugin format (ComplexDiscovery, 2026-05-13). In the worked example
  nothing writes to the e-billing system, and that remains correct. An
  expanded article on this subject will follow.
- **Control and building, in one section.** The commentary is
  consistent, and the documented builds are few. One in-house legal
  operations manager forecasts, in Bloomberg Law (2026-01-05), that
  the teams that stand out will build and iterate on solutions
  quickly, and the article presents that as a forecast because it
  describes no build. CLOC programming appears to assume that some
  members have already built agents (a roundtable page of 2026-02-03
  asks whether members have built their own agents or are just getting
  started, and it names no builds); that reading stays
  **TBD — confirm** and is paraphrased rather than quoted. One AI
  company's own legal department has published what it built
  (2025-12-08), and the article notes that the company is in the AI
  industry. The research found no corporate legal survey that reports
  a build-versus-buy percentage, no survey that ranks openness or API
  access as a selection criterion, and no verified named build by a
  corporate legal department outside the AI industry, so the article
  says so and presents building as an emerging practice. The argument
  connects to the fourth belief: a department's requirements are
  specific to its business, so it will need custom solutions, and
  custom solutions built on a governed entity and action model inherit
  its definitions, permissions, and audit record, whereas solutions
  built directly on each system's tables must establish all three
  again for each tool. The cautions get a sentence each: tools built by
  domain experts with AI assistance are often not ready for production
  use, and someone has to maintain them. This section holds the single
  product reference the writer has allowed. Spaarke may be named once
  as providing a Legal Operations Intelligence ontology solution,
  stated as a fact about what the company offers and without a
  comparison. An expanded article on this subject will follow.
- **The Legal IQ stack used as structure in one paragraph.** The
  ontology is what the Data and Memory layers are made of, and
  Inference reads over it. Link to
  [The Legal IQ Stack: Data, Memory, Inference](/why-spaarke/the-iq-stack)
  and do not restate that article. Use "operational memory" once, where
  the stack is invoked.
- **Series wiring.** In-body links to article 1,
  [The New Mandate for Legal Operations](/why-spaarke/managing-legal-operations),
  and article 2,
  [How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform),
  where each supports a point. The article must also stand alone, so
  the links support the argument and are never a prerequisite for it.
  A series-navigation block at the end of the article reaches article 4
  (business intelligence), article 5 (knowledge management), and the
  standalone companion, added as each ships. The close ends on
  consequence, and the closing contact line follows it, outside the
  argument, in the approved wording from `voice/bylines.md` section 6:
  *For questions or comments about this article, contact Ralph
  Schroeder, Founder and CEO of Spaarke, at ralph.schroeder@spaarke.com,
  or visit spaarke.com.* The email address and the site are links in
  the MDX (`mailto:ralph.schroeder@spaarke.com` and
  `https://spaarke.com`), and the line is set apart from the body in
  italics after a horizontal rule. The ban on a demo call to action
  stays.
- **Cross-links.** In the body: article 1, article 2,
  `/why-spaarke/the-iq-stack`,
  `/why-spaarke/probabilistic-vs-deterministic` (link text "Legal AI
  Is Not Deterministic"), and
  `/why-spaarke/what-is-legal-operations-intelligence` (once, near the
  definition). Related reading after the close, as a plain list:
  `/why-spaarke/institutional-knowledge` and, optionally, `/platform`.
  No call to action. The two links in the contact line sit outside the
  argument and do not count against that limit.
- **One supporting diagram.** The argument is structural, so
  `content-types/blog-post.md` section 4 requires it: the spine
  entities with the operational entities around them and three or four
  labelled example relationships. Original SVG in the visual-identity
  palette, abstract, with no product UI. The alt text is a real
  sentence.

# Must NOT include

- **Anything from the internal roadmap or component model.** No binding
  modes as a commercial claim ("start where you are, move when you
  want"), no waves, no bootcamp, no pricing, no Phase 0, no layer
  numbers (L0 to L6), no entity or service names (`sprk_*`,
  `MatterResolutionService`), no connector manifest, no open-decision
  register, and no plans for Spaarke's own MCP server. "MCP server
  plans" here means Spaarke's roadmap, and MCP as an industry
  development stays in scope. The piece is a concept piece and
  discloses no design.
- **Microsoft platform build-versus-buy commentary, or an evaluation of
  Microsoft Fabric IQ.** No Foundry IQ versus hand-built retrieval,
  Work IQ, Agent 365, Entra Agent ID, Agent Framework versus Semantic
  Kernel, SharePoint Embedded SDK, or the Legal Agent for Word overlap.
  Microsoft may be named, and Microsoft Learn and the Build
  announcement are cited for definitions, for the agent-grounding
  points, and for the neutral "why now" statement only.
- **Sideways positioning against named vendors.** Vendors may be named
  (frontier model providers and notable legal solution providers) where
  naming lends objectivity and credibility, neutrally, factually, and
  with a source. What stays out: any comparison or positioning of
  Spaarke against a named vendor (`voice/brand-positioning.md` section
  3: "we don't punch sideways at named competitors"), competitor
  marketing collateral used as evidence (`voice/domain-knowledge.md`
  section 6), and the Microsoft legal-department anecdote, which is
  unsourced.
- **The company whose platform model informs the definition.** The
  article does not name the company, quote its documentation, or
  compare Spaarke with it (see
  `notes/palantir-intelligence-platform-model.md`). The text carries no
  mention of the company, none of its proprietary vocabulary, and
  nothing about how it sells or delivers.
- **An article that sets one deployment mode against the other.**
  Spaarke provides both system of record capabilities and ontology
  architecture over third-party systems, and the article supports both
  modes. The earlier ban on consolidation claims is withdrawn, and the
  article does not claim that either mode replaces the other.
- **An argument that the ontology replaces business intelligence, the
  data warehouse, or the data lake.** They work together, and the
  article says how.
- **Open architectural questions presented as fact.** Bitemporality,
  identity resolution across systems, and edge-storage decisions are
  unresolved internally. If the draft needs the two-clocks idea (when
  something was true and when it was known), state it as a requirement
  legal places on the model and describe no shipped capability.
- **Do-not-say list items lifted from the synopsis.** The synopsis uses
  "one-click confirm"; write "a single confirmation". No `transform`,
  `seamless`, `AI-powered`, `robust`, `unlock`, `leverage`, or
  `ecosystem` (when "set of tools" works), no exclamation points, and
  no rhetorical-question headings. The full list is in
  `voice/vocabulary.md` section 2.
- **A restated body of `the-iq-stack` or
  `probabilistic-vs-deterministic`.** Reference and link; do not
  replicate.
- **A scorecard of vendors on openness.** The article names vendors for
  what was announced before the display date and attributes each
  statement to the source that makes it. It does not list vendors for
  which no announcement was found, and it does not call any vendor
  closed.
- **An overstatement of demand.** The article does not write that
  departments "are demanding" open platforms, does not attribute a
  position to CLOC, ACC, or ILTA, and does not transfer law-firm data
  to legal departments.
- **An overstatement of write-back.** The article applies no read-only
  or write-capable label beyond what the cited source states, and it
  does not present a model provider's description of a connector as
  the connector vendor's own statement.
- **A pushback on a named company.** The "context graph" point is an
  observation about scope, argued on its merits, and it names neither
  provider. The v1 phrase "will never hold intake, spend, or
  disposition" was a prediction about other companies' products and is
  removed.
- **A prediction presented as a fact.** The Gartner figures are
  predictions and are cited as such, once.
- **Anything dated on or after 2026-07-21, or a reference to a later
  event.** A source dated on the display date itself is out. The
  held-out list in `idea.md` ("What date discipline means for this
  piece") and the round-two note `notes/r2-ontology-date-discipline.md`
  (run against the earlier cut-off of 2026-07-13 and re-checked
  against 2026-07-20) are the checklist. Held out by date: the ILTA
  2026 Technology Survey and all ILTACON 2026 coverage, the OpenAI and
  Google Cloud legal announcements and their commentary, Docusign's own
  release, the Brightflag connector page, the later Thomson Reuters
  release, the CLOC AI Intensive, the final MCP specification release
  and its trade coverage, the Microsoft Learn agent-integration page
  (first published 2026-07-23) and the later revisions of the ontology
  overview (2026-07-21, which falls on the display date, and
  2026-08-28) and of the Fabric IQ overview (2026-07-29 and later),
  Looker agentic workflows, the later Forrester post, the LegalOn
  survey, and the vendor API check in the openness gap track. Usable by
  date and left out by decision: the Elementum critique of 2026-07-16,
  which disputes the operational platform vendor's no-copy claim, stays
  out because the article names neither that vendor nor its critic and
  presents binding as Spaarke's design principle; the Agiloft release
  of 2026-07-14 stays out because it announces agents inside the
  vendor's own product and states no connector, and the article does
  not list vendors for which no announcement was found.
- **An explanation of legal operations basics, an MCP tutorial, or a
  security review of the protocol.** The cautions receive one
  paragraph.
- **A knowledge management article.** That subject belongs to
  article 5.
- **Demo call to action.** The close ends on consequence, and the
  contact line carries no offer.
- **AI-tell openers, hedging, self-congratulation, and the earlier
  house voice**, per `voice/style-guide.md` section 5,
  `voice/examples/ai-tells.md`, and `voice/examples/avoid-this.md`. The
  published library predates the revised style guide, and the draft
  does not pattern-match against it.

# References

Research library: `content-platform/research/2026-09-loi-series/`
(start with `README.md`, then `DIGEST.md`, which carries every finding
with its fact-check verdict). The tracks for this piece are in
`notes/`: `palantir-intelligence-platform-model.md`,
`ontology-landscape-and-ai.md`, `open-platforms-api-mcp-build.md`,
`changing-role-of-legal-ops.md`, and `bi-analytics-stats.md`, each with
a `.verified.md` fact-check file;
`gap-inhouse-demand-for-openness-and-build.md` and
`gap-bi-technology-state-and-deterministic-role.md`, which were
researcher-read and have no fact-check file, so their findings carry
the marker wherever this brief uses them; and
`r2-ontology-date-discipline.md` with its `.verified.md` file, the
record of which revisions and captures were live before the cut-off.
The evidence tables in `idea.md` (A to I) carry the status of every
row. Confirmed means the fact-checker saw the claim on the cited page;
Corrected means the substance held and the stated correction applies;
Background only means the source informs the writer and the article
neither names nor quotes it; and the marker means the claim was not
fact-checked or could not be seen.

Internal (link from the draft):

- [The New Mandate for Legal Operations](/why-spaarke/managing-legal-operations):
  article 1 of the series (display date 2026-06-16). In-body link where
  the changed mandate supports a point.
- [How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform):
  article 2 (display date 2026-07-14), where the platform is defined.
  Link from the opening (the concepts passage) and from the section on
  the systems already in place.
- [The Legal IQ Stack: Data, Memory, Inference](/why-spaarke/the-iq-stack):
  the ontology gives structure to the Data and Memory layers. Link
  where the stack is invoked, and do not restate that article.
- [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic):
  the split between deterministic facts and probabilistic inference
  behind the fact, observation, and inference classes. Use this short
  title as the link text (`voice/style-guide.md` section 4).
- [What Is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence):
  the category definition. Cite once, near the working definition.
- [Institutional Knowledge Is Walking Out the Door](/why-spaarke/institutional-knowledge):
  the operational memory case. Related reading after the close.
- [The AI Readiness Gap in Legal Departments](/why-spaarke/the-ai-readiness-gap):
  the data architecture argument that this piece continues. Optional.
- [From Reactive to Predictive](/why-spaarke/loi-maturity-model):
  optional, for staging in "how it is built".
- [The UX That Legal IQ Requires](/why-spaarke/the-ux-that-legal-iq-requires):
  optional, for provenance that is reachable from the surface in "how
  it is used".
- [Breaking the Silo Between Legal, Finance, and the Business](/why-spaarke/breaking-the-silo):
  optional, for the relationships that cross into finance and the
  business.
- `articles/context-is-only-one-layer/`: the LinkedIn post that first
  stated the position that context is one layer. Use it for continuity
  and do not link to it.
- `/platform`: optional related reading for the reader who wants to see
  the entities and actions in product. Never a call to action.
- Article 4 (`from-spend-analytics-to-legal-operations-intelligence`), article 5
  (`knowledge-management-legal-operations-intelligence`), and the
  standalone companion (`state-of-legal-operations-fall-2026`) carry
  later display dates and are reached only through the
  series-navigation block.

Every published article linked above carries a display date before
2026-07-21 (checked against the `content/blog/` frontmatter), and
articles 1 and 2 carry the series display dates of 2026-06-16 and
2026-07-14, both earlier than this piece.

External (every named number needs one; the status is the evidence-table
status, and a claim that carries the marker is not cited until it is
checked):

*Definition and platform model (table A).*

- Microsoft Learn, "What is ontology (preview)?",
  https://learn.microsoft.com/en-us/fabric/iq/ontology/overview. The
  revision of 2026-05-14 (ms.date 2025-10-06) was the revision live
  through 2026-07-20 (the next revision, of 2026-07-21, falls on the
  display date and is out); dated text at
  https://raw.githubusercontent.com/MicrosoftDocs/fabric-docs/33b11595fc/docs/iq/ontology/overview.md;
  local copy in `reference materials/`. Confirmed verbatim: the
  definition, the things, facts, and connections sentence, data
  binding, the query surface over concepts rather than tables, and the
  sentence on asking questions in business terms. The item is a
  preview, so say so if product status is mentioned. Bindings are to
  sources in OneLake, and upstream changes are refreshed manually, so
  do not describe the binding as live or copy-free. Cite the revision
  date.
- Microsoft Learn, "What is Fabric IQ?",
  https://learn.microsoft.com/en-us/fabric/iq/overview. The revision of
  2026-07-09 (ms.date 2026-07-08) was the revision live through
  2026-07-20 (the next revision is 2026-07-29); dated text at
  https://raw.githubusercontent.com/MicrosoftDocs/fabric-docs/5c02cff68f/docs/iq/overview.md;
  also captured 2026-06-02. Confirmed verbatim: "Fabric IQ brings three
  layers of business context into Microsoft IQ: unified data, business
  intelligence, and operational intelligence."; "Ontologies can be
  generated directly from semantic models already in production,
  keeping business language consistent across experiences."; "Ontology
  (preview) defines core business entities, relationships, properties,
  rules, and actions."; and "Fabric IQ's three layers ensure that every
  agent starts with the same understanding of the business and can
  apply it correctly across workflows." Cite the revision date.
- Microsoft Learn, "Consume ontology (preview) as an MCP server",
  https://learn.microsoft.com/en-us/fabric/iq/ontology/how-to-use-ontology-mcp-server.
  ms.date 2026-04-14; last pre-cut-off revision 2026-06-30; dated text
  at
  https://raw.githubusercontent.com/MicrosoftDocs/fabric-docs/5c02cff68f/docs/iq/ontology/how-to-use-ontology-mcp-server.md.
  Confirmed verbatim: "Ontology can function as an MCP server, exposing
  an API so that external AI systems can interact with it through the
  MCP protocol." The preview banner is present.
- Arun Ulag, Microsoft Azure blog, Build 2026 announcement,
  https://azure.microsoft.com/en-us/blog/microsoft-build-2026-building-agentic-apps-with-microsoft-fabric-and-microsoft-databases/
  (2026-06-02; capture of 2026-06-13). Confirmed verbatim: "Ontologies
  in Fabric IQ, expected to be generally available in the coming
  months, extend semantic models by adding operational context.";
  "Fabric IQ, now generally available, addresses this gap."; and the
  layer list in which "Ontologies capture operational context by
  defining business entities and their relationships so agents can
  reason in the language of the business." Product status wording for
  the article: documentation as of 2026-07-09 still labelled the
  ontology item a preview, and that revision stayed live through
  2026-07-20.
- Operational platform model research,
  `notes/palantir-intelligence-platform-model.md` and its
  `.verified.md` file. Background only: the article does not name the
  company, does not quote its documentation, and states the
  decision-centred idea and the build method in Spaarke's own words.
  Section 6 of the note carries the translation table for vocabulary.
  The critique of the vendor's no-copy claim (Elementum, 2026-07-16)
  is inside the window under the 2026-07-21 display date and is left
  out by decision, because the article names neither company.
- The three-way distinction (lake, warehouse, ontology): one or two
  paragraphs in Spaarke's words. The glossary definitions in the notes
  were not fact-checked, so **TBD — confirm** if a definition is
  quoted.

*Why AI has raised what an ontology can do (table B).*

- Gartner press release, 2026-05-11,
  https://www.gartner.com/en/newsroom/press-releases/2026-05-11-gartner-says-lack-of-semantics-causes-inaccurate-artificial-intelligence-agents-and-wasted-spending
  (captures of 2026-05-19 and 2026-07-09). Confirmed from gartner.com:
  the prediction of up to 80% better agentic AI accuracy and up to 60%
  lower cost by 2027 for organizations that prioritize semantics; Rita
  Sallam, speaking at the Gartner Data & Analytics Summit in London:
  "Agentic AI outcomes depend on context including semantic
  representations of data."; and "Gartner advises data and analytics
  (D&A) leaders to establish a context layer as a core component of
  their D&A infrastructure." It is a prediction; use it once, framed as
  such.
- a16z, Jason Cui and Jennifer Li, "Your Data Agents Need Context",
  https://a16z.com/your-data-agents-need-context/ (2026-03-10).
  Confirmed verbatim: a context layer that includes "canonical
  entities, identity resolution". The headline quotation is
  mid-sentence in the original, so keep "data" in lower case inside a
  sentence.
- MCP specification, tools page,
  https://modelcontextprotocol.io/specification/2025-06-18/server/tools
  (2025-06-18). Confirmed verbatim: "For trust & safety and security,
  there SHOULD always be a human in the loop with the ability to deny
  tool invocations." Applications should present confirmation prompts.
  It is a protocol statement, and the article says so.
- Forrester, Boris Evelson and Indranil Bandyopadhyay, "Build Meaning
  Before Machines",
  https://www.forrester.com/blogs/build-meaning-before-machines-why-semantics-ontologies-and-knowledge-graphs-matter-for-agentic-ai/
  (2026-06-02). Agents guess without explicit context, and the
  semantic layer is the right starting point for most organizations.
  **TBD — confirm** (researcher-read, not fact-checked).
- Edge et al., GraphRAG paper, https://arxiv.org/abs/2404.16130
  (2024-04-24, revised 2025-02-19). Extraction: a language model
  derives an entity graph from source documents. **TBD — confirm** (not
  fact-checked).
- Sequeda, Allemang, and Jacob, https://arxiv.org/abs/2311.07509
  (2023-11-13). Question answering accuracy of 16% on SQL databases and
  54% over a knowledge graph representation, with GPT-4.
  **TBD — confirm**; it is dated and directional only.
- Gartner press release on data and analytics trends, 2026-06-16 (read
  through a mirror). Usable by date and left out, because the writer
  limits Gartner to the May release.

*Business intelligence and the dashboard contrast (table C).*

- Jessica Talisman, "Ontologies, Context Graphs, and Semantic Layers",
  Metadata Weekly, https://contextandchaos.substack.com/cp/185458632
  (2026-01-22). Confirmed verbatim: "But meaning isn't the same as
  measurement." The newsletter is published by a vendor (Atlan), so
  attribute it to the author.
- dbt Labs benchmark update,
  https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026
  (2026-04-07). A governed layer fails with an error where generated
  SQL fails with a plausible wrong number. **TBD — confirm**; it is
  vendor-run, and it gets one sentence at most, because article 4
  develops the argument and cannot be linked in the body.
- BI tools that trigger actions: Fabric Activator (Microsoft Learn,
  https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction,
  ms.date 2026-04-17); the Power BI flow integration that starts a
  Power Automate flow from a data alert
  (https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-flow-integration,
  ms.date 2025-12-01); and the Tableau Pulse release notes entry of
  2026-07-02 (https://help.tableau.com/current/online/en-us/pulse_intro.htm):
  "this model doesn't analyze your data. Instead, it draws upon
  pre-calculated insights". Honest context for the dashboard contrast:
  BI products are adding alerts and triggers, which supports "in
  conjunction" and rules out a replacement framing. All
  **TBD — confirm** (researcher-read from the BI gap track). The Power
  BI data-alerts page and the Tableau Teams-alerts entry are out by
  date, and the Tableau alert sentence is undated on the page.

*What the build depends on, and legal standards (table D).*

- Barry Briggs, Directions on Microsoft,
  https://www.directionsonmicrosoft.com/cio-talk-microsoft-gets-iq/
  (2025-12-02). Confirmed verbatim: "Creating an ontology, in Fabric or
  elsewhere, is a major effort and requires on-going maintenance, so
  there's no getting out of the hard work." Briggs is an analyst at
  Directions on Microsoft and a former CTO of Microsoft's own IT
  organization.
- Nikola Ilic, Data Mozart,
  https://data-mozart.com/beyond-the-lakehouse-first-thoughts-on-fabric-iq/
  (2026-02-03). Confirmed verbatim: "If your organization struggles to
  agree on basic definitions now, an ontology won't magically create
  consensus."
- Juan Sequeda,
  https://juansequeda.substack.com/p/servicenow-is-joining-open-semantic
  (2026-06-10). Confirmed verbatim (lower case, mid-sentence): "start
  small and think big".
- SALI LMSS (over 18,000 tags, each with a unique identifier),
  https://github.com/sali-legal/LMSS; LEDES and UTBMS,
  https://ledes.org/. The facts are confirmed. The framing (vocabulary
  and exchange format, and no operational model) is the researcher's
  and becomes Spaarke's own statement.

*APIs, MCP, and bi-directional flows (table E).*

- Anthropic, Claude for Legal,
  https://claude.com/blog/claude-for-the-legal-industry (2026-05-12).
  The fact-checker proved the connector wording from an Internet
  Archive capture of 2026-07-15, which carries a page revision date of
  2026-06-21. Under the earlier display date only the revision date sat
  inside the window; under 2026-07-21 the capture does as well, so the
  wording rests on a third-party timestamp inside the window. The live
  page carries a later revision date of 2026-07-20, also inside the
  window, with the connector descriptions unchanged.
  Confirmed verbatim: "20+ new MCP connectors" and 12 plugins; the
  connector descriptions for Box ("create or update content"), Datasite
  (set up folder structures, invite users), Relativity ("stand up
  matters, shape workspace schema, govern access"), and Docusign
  ("orchestrate agreement workflows across the contract lifecycle").
  "20+" and the descriptions are Anthropic's wording, so attribute the
  write verbs to Anthropic's page and to no connector vendor.
- iManage MCP Server release,
  https://imanage.com/resources/resource-center/news/mcp-server-available-broader-ai-ecosystem/
  (2026-05-14; capture of 2026-06-11). Confirmed verbatim: the client
  list (Harvey, Legora, ChatGPT, Claude, Microsoft Copilot, and a
  firm's own agents); "All AI access to iManage content via MCP is
  authenticated, permission-bound, and fully logged, respecting
  existing ethical walls and access controls."; and "A single MCP
  connection replaces a growing list of custom API integrations." Neil
  Araujo's sentence, "Customers are not choosing one AI tool and
  stopping there.", is researcher-read and stays **TBD — confirm**
  before it is quoted. Corrected: "read-only at launch" and "general
  availability" appear in no source; the release describes access to
  content and states no write action.
- Neil Cameron, Legal IT Insider,
  https://legaltechnology.com/imanage-unveils-open-protocol/
  (2026-05-14). Confirmed, with the correction that Cameron is the
  author: "The product's value proposition is that one MCP connection
  replaces a proliferating list of custom API integrations, and that
  new AI systems can be added or swapped without an IT project each
  time." Quote the full sentence.
- LawVu MCP server announcement, Sam Kidd,
  https://lawvu.com/articles/connecting-ai-tools-to-the-legal-operating-system-introducing-the-lawvu-mcp-server/
  (2026-06-02, updated 2026-06-08; capture of 2026-06-08). Confirmed
  verbatim: "Create matters or trigger contract workflows directly from
  an AI tool" and "Update matter status, create tasks, and set
  deadlines from connected AI workflows"; clients Claude, ChatGPT, and
  Microsoft Copilot; governance wording on permissions and on workflows
  "from human approvals through to more autonomous execution over
  time". The list is in the future tense ("will enable") and general
  availability is not stated, so write "announced" and attribute the
  actions to the vendor's launch article. It is a vendor source and the
  most recent confirmed write example available to the piece.
- Thomson Reuters and Anthropic, PR Newswire,
  https://www.prnewswire.com/news-releases/thomson-reuters-and-anthropic-expand-partnership-to-connect-claude-with-cocounsel-legal-302769890.html
  (2026-05-12). CoCounsel Legal reachable from Claude through MCP; Joel
  Hron: "Wherever lawyers are working, the full power of CoCounsel
  Legal is available to them." Corrected: the Hron quotation is in this
  release.
- MCP specification, changelog and authorization pages,
  https://modelcontextprotocol.io/specification/2025-06-18/changelog
  and
  https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
  (2025-06-18). Confirmed verbatim: "Authorization is OPTIONAL for MCP
  implementations."; servers classified as OAuth resource servers;
  clients must implement RFC 8707 resource indicators; a new security
  best practices page.
- MCP security best practices (2025-06-18 version), dated text at
  https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/d1935d2ce9/docs/specification/2025-06-18/basic/security_best_practices.mdx.
  Confirmed verbatim: "The primary audience for this document includes
  developers implementing MCP authorization flows, MCP server
  operators, and security professionals evaluating MCP-based
  systems."; token passthrough is forbidden. The live URL now redirects
  to a later page, so cite the dated text.
- MCP specification 2025-11-25,
  https://modelcontextprotocol.io/specification/2025-11-25/changelog,
  and the release post
  https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/
  (2025-11-25). Confirmed verbatim: Client ID Metadata Documents as the
  recommended client registration mechanism; incremental scope consent;
  updated security guidance; the extensions framework.
- MCP blog, release candidate post,
  https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
  (published 2026-05-21; the date in the slug is the planned
  final-release date and not the post date; the Internet Archive
  capture of 2026-07-16 sits inside the window). Confirmed verbatim: "Six
  SEPs harden the
  authorization specification to align more closely with how OAuth 2.0
  and OpenID Connect are deployed in practice."; clients must validate
  the iss parameter (RFC 9207). The post states the date on which the
  final specification was to be published, which falls after the
  display date, so describe it as a release candidate and cite the
  final release nowhere.
- MCP blog, Paul Carleton, "Enterprise-Managed Authorization:
  Zero-touch OAuth for MCP",
  https://blog.modelcontextprotocol.io/posts/enterprise-managed-auth/
  (2026-06-18). Confirmed verbatim: "The Enterprise-Managed
  Authorization (EMA) extension is now stable."; adopted by Anthropic,
  Microsoft, and Okta; "Centralized policy and audit: access decisions
  live in the IdP admin console".
- MCP blog, Hungerford, Morrow, and Chang, "Tool Annotations as Risk
  Vocabulary",
  https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
  (2026-03-16). Confirmed verbatim: "Every property is a hint."; a tool
  with no annotations "is assumed to be non-read-only, potentially
  destructive, non-idempotent, and open-world."; "Many servers ship
  without them, and clients vary in how strictly they honor the
  pessimistic defaults."
- Greg Dickason, LexisNexis,
  https://www.lexisnexis.com/blogs/hk-legal/b/industry-insights/posts/what-we-learned-from-evaluating-mcp-based-workflows-for-authoritative-legal-ai
  (2026-06-10). Confirmed: the selective position on authority,
  attribution, and consistency of answers.
- ComplexDiscovery,
  https://complexdiscovery.com/claude-for-legal-arrives-and-the-legal-ai-stack-gets-re-segmented-overnight/
  (2026-05-13). Confirmed verbatim: a team that teaches a plugin its
  house style and thresholds "is building institutional knowledge
  inside the model", which "deepens the lock-in to Claude". The original
  sentence contains an em dash, so paraphrase or quote a fragment
  without it.
- MCP introduced by Anthropic as an open standard in November 2024: one
  sentence of background. **TBD — confirm** as a verbatim primary
  statement; the anniversary post's title supports the month.

*Who is asking for open environments (table F).*

- Sam Grange, iManage, in Legal IT Insider's Vendor View 2026
  (2026-01-15). Confirmed; the verbatim wording is in the `.verified.md`
  file. Paraphrase it, because the original uses a word on the house
  do-not-say list. It is a vendor voice.
- Michael Dineen, Brightflag,
  https://brightflag.com/resources/blog-mcp-server-legal-tech/
  (2026-05-26). Advises buyers to ask an enterprise legal management
  vendor whether it has an MCP server. Corrected: the advice is in the
  May post, which is usable; the connector page is out by date. It is a
  vendor voice.
- Ken Callander, former Head of Legal Operations at Uber, Above the
  Law, two parts (2026-06-15 and 2026-06-23). The strongest
  practitioner voice: choose tools with documented, write-capable,
  agent-ready interfaces, and keep workflow logic in house; most buyers
  still score vendors against a five-year-old rubric.
  **TBD — confirm** (researcher-read, not fact-checked). He is a
  consultant and no longer a sitting practitioner.
- CLOC 2026 State of the Industry (2026-03-02): 80% name technology
  strategy as a priority. Confirmed. CLOC, ACC, and ILTA: no formal
  statement on vendor openness was found. Negative evidence; write "the
  research found no statement", never "none exists".

*Control and building (table G).*

- ACC and Everlaw, generative AI survey, 657 in-house professionals in
  30 countries, https://www.everlaw.com/press/release/acc-report-2025/
  (2025-10-14). Confirmed: 64% expect to rely less on outside counsel;
  generative AI use 52%, up from 23%. One research track reads the 52%
  figure as United States respondents only, so confirm its base before
  use. The survey speaks to control and says nothing about openness or
  building.
- Patricija "Patty" Corey, Legal Operations Manager, HUMAN, in
  Bloomberg Law (2026-01-05). Confirmed verbatim: "The teams that stand
  out will use AI, vibe coding, and light tech skills to build and
  iterate on real solutions quickly, without waiting on outside help."
  It is a forecast, and it describes no build.
- Anthropic, "How Anthropic uses Claude in Legal",
  https://claude.com/blog/how-anthropic-uses-claude-legal
  (2025-12-08). Confirmed: an in-house team that built four tools;
  marketing review turnaround cut from two or three days to 24 hours.
  Corrected: the Mark Pike quotation is "I partner with Claude to
  tackle certain projects that involve coding, but I am not the one
  coding." The company is in the AI industry, and the page does not say
  that no engineers were involved.
- Mark Pike in Artificial Lawyer (2026-05-12). Confirmed verbatim:
  in-house teams "open-sourcing outside counsel management tools on
  GitHub so peers can fork them". It is hearsay, and no team is named.
- CLOC San Francisco roundtable, "Working with Agents" (2026-02-03).
  The page asks whether members have built their own agents or are
  just getting started, and it names no builds. **TBD — confirm**
  (researcher-read; paraphrase the page and do not quote it).
- Vibecode-Law founders in Artificial Lawyer (2026-01-26). Confirmed:
  such projects "aren't production-ready out of the box"; asked whether
  building supplants platforms, "No, we don't think so." Corrected: the
  claim that builders are primarily in-house lawyers was not seen.
- Law-firm data on build versus buy, Bloomberg Law (2026-06-25). Law
  firms only, and the CIO quotation in the notes is unverified. Do not
  transfer law-firm data to legal departments.
- Surveys of corporate legal departments on building, openness as a
  selection criterion, or systems per department: none found. Negative
  evidence; the article says survey evidence is thin. The Icertis and
  Axiom surveys are left out by the writer's decision (they are
  vendor-commissioned).

*The "context graph" point (table H).* The article keeps this frame
generic and names neither vendor; these rows give the writer the
sources behind the generic statements.

- A document management provider's press release (2026-05-14). Scope
  of the announced context graph: matters, documents, communications,
  people, activity, and permissions including ethical walls, with no
  mention of spend, e-billing, outside counsel, or matter management.
  Confirmed. Corrected: the three levels and the "model-agnostic"
  description come from LawSites (Bob Ambrogi, 2026-05-14). The
  provider is named in the research library and not in the article.
  The itemized list and the negative statement belong to this
  announcement only. In the article, render the release's "matters" as
  documents organized by matter, so that the scope list and the
  absence of matter management do not read as a contradiction.
- A second document management provider's "context fabric", reported by
  LawSites (2026-05-22). Confirmed through LawSites; the article does
  not name the provider. The scope is recorded as similar to the
  first, so the article writes "reported with a similar scope" and
  attributes the itemized list to the first announcement.
- Neil Cameron, Legal IT Insider,
  https://legaltechnology.com/netdocuments-reimagines-the-dms-around-context/
  (2026-05-14). Confirmed verbatim: the convergence on "context" and an
  open question about auditing which context fed an AI output.
  Corrected: the headline line is Cameron's characterization of the
  vendor's case; if cited, cite the analyst's observation and not the
  vendor.
- Foundation Capital, Jaya Gupta and Ashu Garg,
  https://foundationcapital.com/ideas/context-graphs-ais-trillion-dollar-opportunity
  (2025-12-22). Confirmed verbatim: "a living record of decision traces
  stitched across entities and time so precedent becomes searchable";
  "systems of record for decisions, not just objects". It is the origin
  of the term, and its definition centres on decision records, which
  supports the third belief. Naming the essay is allowed.
- Afraz Jaffri (LinkedIn, about 2026-01-08) and Jessica Talisman, "The
  Trillion-Dollar Rebranding" (2026-01-28). Confirmed, with the primary
  sources named in the `.verified.md` file: the practitioner critique
  that the term renames existing knowledge graph and ontology practice.
- A published critique that legal context graphs are centred on
  documents: none found. The article states the scope observation as
  its own and does not write "critics have noted".

*Figures carried over from v1 (table I).*

- CLOC 2026 State of the Industry,
  https://cloc.org/newsdesk/cloc-releases-2026-state-of-the-industry-report-rising-legal-demand-outpaces-budget-and-staffing-growth-forcing-operational-shift/
  (2026-03-02; 135 departments; median revenue $13B; based on the 2025
  Harbor Law Department Survey). Confirmed: 85% have dedicated AI
  oversight or resources, and 80% name technology strategy as a
  priority. Use the release wording. The v1 wording, "dedicated AI
  resources or committees", follows the Harbor press release of
  2025-12-08 and is replaced.
- Thomson Reuters blog, Marjorie Richter,
  https://legal.thomsonreuters.com/blog/how-ai-is-transforming-the-legal-profession/
  (2026-07-02), summarizing the 2026 Future of Professionals Report.
  Confirmed: 78% of corporate clients say AI-enabled quality
  improvements are very important or essential, and 6% say most of
  their providers deliver it. Optional. The phrasing "gap between
  adoption and realized value" stays **TBD — confirm** against the
  report itself. This entry replaces the v1 LawNext summary.
- ACC and Everlaw: see table G.
- `voice/domain-knowledge.md` and `voice/research-sources.md`: any
  additional CLOC or ACC framework citation the draft needs.

Companion pieces (not written here): a LinkedIn syndication (company
page, organizational byline) and a founder-voice post that takes up
the decision record as the asset. Both are tracked separately in the
calendar and follow the revised voice.

# Voice notes

- **Register.** The series voice decision applies: a strategy-consulting
  register in the manner of McKinsey Quarterly and Harvard Business
  Review, business-like without being stiff, per the revised
  `voice/style-guide.md`. The draft uses no em dashes and none of the
  constructions in `voice/examples/ai-tells.md`. Match the opening, the
  evidence paragraphs, the transitions, and the close against the model
  passages in `voice/examples/consulting-register.md` section 6, and do
  not pattern-match against the published library, which predates the
  revised guide. Run `npm run voice:lint -- <draft>` before every
  review; 0 errors are required, and every warning is read.
- **Audience.** The primary reader is the legal operations director,
  with the general counsel and the legal technology leader as
  secondary readers. All three are experienced, so the article does
  not explain matter management, e-billing, or outside counsel
  guidelines. "Ontology" is the one term they may not use daily, and
  the article defines it plainly and early.
- **Evidence standard.** This is a discussion piece by a practitioner,
  and readers understand that. Use the research library where it has a
  confirmed or corrected finding; where a point has no citation,
  present it as discussion rather than as a sourced fact. Attribute
  every statistic in the sentence that carries it, report survey
  results as what respondents said, and interpret the number.
- **Build to the term.** Do not open with "An ontology is". Open on the
  budget-variance scene or on "every department has a matter table",
  and let the reader feel the gap before the word arrives. The reader
  is experienced, so the build is short and the definition lands within
  the first H2. The writer asked on 2026-09-22 that the definition and
  its value come up front, so the word may arrive early, provided that
  the scene or the gap comes first, and the passage that defines the
  term also says why the ontology is high-value and foundational.
- **The worked example carries the argument.** It should be the longest
  section and the most concrete, with typed outcomes and named entities
  and without abstractions. "200 matters" is a library motif; use it.
- **Vocabulary.** The series vocabulary is *entities and actions*, and
  "objects" is not used. Use the generic terms: entity, attribute,
  relationship, governed action, rule, decision record, write-back, and
  human in the loop. Use "relationships" in the definition and "links"
  as the shorter working word afterwards. Avoid the capitalized product
  sense of "the Ontology", the words "kinetic" and "dynamic" as layer
  names, "object type", "link type", "action type", and the four-part
  formula of data, logic, action, and security stated as a formula (the
  translation table is in `notes/palantir-intelligence-platform-model.md`
  section 6). Write "legal professionals" or "the legal team" for
  shared operational work and "counsel" where the act is attorney-only
  (red-gate review). Write "outside counsel" and never "external
  counsel", and write "e-billing platform". "Operational memory" is our
  term for the layer; use it once where the stack is invoked.
- **The company whose platform model informs the definition.** The
  article does not name the company, does not quote its documentation,
  and states the decision-centred idea in Spaarke's own words, from the
  legal department's side, as the definition bullet in Must include
  words it. It does not reuse the construction "represents the
  decisions ... as well as the data" in any wording. The research is
  in `notes/palantir-intelligence-platform-model.md`.
- **Microsoft.** May be named for definitions, for the agent-grounding
  sentences, and for the neutral "why now" statement, each in the
  revision that was live before the cut-off. No build-versus-buy
  commentary.
- **Other vendors.** Anthropic, iManage, Thomson Reuters, LawVu, and
  the connectors that Anthropic describes may be named for what they
  announced before the display date, with the date and the source.
  Vendor announcements are used only where they add substantive value,
  and a vendor's own publication is checked against
  `voice/domain-knowledge.md` section 6 before it serves as evidence of
  anything beyond what that vendor announced.
- **Headings** are sentence-case statements. Candidate H2 set for the
  plan (merge where two need only a paragraph): *Every department has
  a matter table, and few hold the relationships*; *A system of record
  holds one dimension of the work, and the ontology holds the context
  across all of them*; *The relationships are the asset*; *Actions
  belong on entities, and each carries a gate*; *Business intelligence
  and the ontology read the same record*; *AI has lowered the cost of
  the model and raised its value*; *A legal ontology carries rules
  that generic models lack*; *The build starts from a decision*; *Open
  interfaces make the model practical*; *An owned model makes building
  safe*; *An AI model can be replaced through configuration, and the
  ontology belongs to the department*.
- **Images.** Hero SVG (below) plus one supporting diagram of the entity
  spine and example relationships. Both are abstract and in the
  visual-identity palette, and neither is a product screenshot.
- **Close and contact line.** The close ends on consequence. Related
  reading follows as a plain list, and the closing contact line follows
  that, outside the argument, in the approved wording from
  `voice/bylines.md` section 6, which names Ralph Schroeder, Founder
  and CEO of Spaarke, with the email address ralph.schroeder@spaarke.com
  and the site spaarke.com as links. No demo call to action, no contact
  form, and no offer.

# Hero graphic

**Concept** (SVG-via-Claude, default per `voice/visual-identity.md` §6):

An abstract graph rendered as disciplined geometry. Three heavier
nodes (small hexagons in `#4D4890` with a `#7B5BFF` stroke) form a
loose triangle just left of center, standing in for the spine. Around
them, eight to ten smaller circles in `#3D3B72` with `#4060DC` strokes,
connected by hairline edges in `#A8C2FF` at 80% opacity. One edge,
running from the spine out to a lone node at far right, is drawn
heavier in Spaarke Blue `#000BFF`: the engagement relationship, drawn
heavier because few departments hold it. A soft `#7B5BFF` halo at 24%
opacity sits behind the spine triangle. The background is a radial
gradient from `#34325E` through `#23224A` to `#161630`, centered
50%/55%. Leave generous negative space upper-right so the title reads
cleanly. The focal element stays in the center band to survive the
21:9 crop.

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

**Aspect ratio**: 16:9 (the default, which matches `ArticleHeader.tsx`).

**Output path**: `public/articles/legal-operations-ontology/hero.svg`
(1600×900 viewBox).

**Alt text**: A constellation of small geometric nodes joined by fine
light-blue lines on a deep navy field, three heavier hexagons at the
center and a single electric-blue edge reaching out to a lone node at
the right, suggesting an ontology of connected legal entities.

**Generator notes**: SVG-via-Claude. Keep the node count low (13 or
fewer) so the silhouette reads from across the room, because the
temptation with a graph motif is clutter. It is a sibling of the
`probabilistic-vs-deterministic` hero (same canvas recipe and hairline
accent), differentiated by the hexagon spine and the single hot edge.
Produce it in the polish step after the draft is approved.

---

## Unresolved (resolve before drafting unless marked otherwise)

Schedule dates in this list are the real calendar, and they are exempt
from the display-date rule that governs the rest of the brief.

- [x] **Display date and series position**: settled by the writer on
  2026-09-21 and moved on 2026-09-22 to the Tuesday date. Article 3 of
  5, display date 2026-07-21, with a cut-off for sources of 2026-07-20;
  frontmatter `date` carries the display date and `posted` carries the
  real publish date, which is set when the piece is scheduled.
- [x] **Primary audience**: `legal-ops-director`, with
  `corporate-counsel` and `legal-tech-cio` secondary (the series
  audience decision).
- [x] **Length and format**: long-form article, `length_target: open`,
  with no word limit.
- [x] **Byline and contact line**: organizational byline
  (`byline: spaarke`, `author: "Spaarke Team"`); the closing contact
  line names Ralph Schroeder, Founder and CEO of Spaarke. The contact
  mechanism was confirmed by the writer on 2026-09-22 (the email
  address ralph.schroeder@spaarke.com and the site spaarke.com), and
  the approved wording is in `voice/bylines.md` section 6.
- [x] **Vocabulary**: entities and actions; "relationships" in the
  definition and "links" afterwards.
- [x] **Source material location**: the strategy synopsis stays outside
  this public repository, and the research library at
  `content-platform/research/2026-09-loi-series/` is the evidence base.
- [x] **Positioning change**: settled in the writer's round-two
  feedback of 2026-09-21. Spaarke provides both system of record
  capabilities and ontology architecture over third-party systems;
  "originate the workflow, reference the record" and the ban on
  consolidation claims are withdrawn. A separate task aligns
  `voice/brand-positioning.md` and `voice/product-knowledge.md`.
- [x] **The company whose platform model informs the definition**: not
  named anywhere in the article or in this brief; the notes filename is
  the only identifier.
- [x] **Vendor names**: settled 2026-09-21. Vendors may be named
  (frontier model providers and notable legal solution providers) where
  naming lends objectivity and credibility; Microsoft may be named; the
  two "context graph" providers are not named.
- [x] **Campaign**: settled. The writer decided on 2026-09-21 that the
  piece is part of the series, with one campaign file carrying each
  article as an asset, and that file now exists at
  `content-platform/campaigns/2026-06-legal-operations-intelligence.md`
  (GitHub milestone "2026-06 Legal Operations Intelligence", number 5).
  The frontmatter carries `campaign: 2026-06-legal-operations-intelligence`.
- [x] **Argument / take**: resolved by the writer's brief feedback of
  2026-09-22 ("follow feedback"). The beliefs in §Angle are re-shaped
  by that feedback: the definition-led thesis stated directly, the
  contrast with systems of record as a belief of its own, and the
  comprehensive context as what the ontology holds. The naming
  question follows the series naming decision of 2026-09-21: vendors
  may be named neutrally and with a source, so Anthropic, iManage,
  Thomson Reuters, LawVu, LexisNexis, and the connectors that
  Anthropic describes may be named; Microsoft may be named; the two
  "context graph" providers and the unnamed platform vendor are not.
- [x] **Fact, observation, and inference as public vocabulary**: the
  writer confirmed on 2026-09-22 ("yes keep this terminology"). The
  three words are public vocabulary, the marker on the Must include
  bullet is removed, and the worked example uses them as planned.
- [x] **Title**: "The Legal Operations Intelligence Ontology" is the
  series title, and the writer left it as adopted on 2026-09-22. The
  v1 title, "What an ontology does for legal operations", is no longer
  under consideration.
- [x] **External figures**: the writer answered on 2026-09-22 ("follow
  what provided in research; refine based on final draft requirements;
  no specific reference required if not available"). The draft uses
  the research library as provided and refines at the draft and polish
  gates; where a specific reference is not available, the point is
  presented as the article's own observation, without a citation and
  without a number that would need one. The individual markers on the
  source entries stay (the iManage chief executive's quotation, the
  Thomson Reuters phrasing, the CLOC roundtable reading, the BI
  gap-track findings, the Forrester post, the GraphRAG and Sequeda
  papers, the dbt benchmark, the Callander articles, the MCP origin
  sentence, and the glossary definitions if quoted), because they tell
  the polish gate what to check on any figure or quotation the draft
  does print.
- [x] **`posted`**: follows the campaign schedule (writer, 2026-09-22).
  The article publishes in push week 3, on the Tuesday, of the
  distribution sequence in
  `content-platform/campaigns/2026-06-legal-operations-intelligence.md`;
  the calendar date is entered when the push start date is set, which
  is a scheduling step and not a writer decision.
