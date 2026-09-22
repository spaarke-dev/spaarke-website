---
slug: the-newfound-importance-of-knowledge-management
type: blog-post
publish_date: 2026-09-15            # display date; article 5 of 5 in the Legal Operations Intelligence series (a Tuesday; moved from 2026-09-14 on 2026-09-22). The real publish date goes in posted.
channels: [website, linkedin]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: high                      # closes the series and carries the full argument for a claim that article 1 makes in one sentence; the "knowledge is the constraint" framing moved quickly through 2026, so the piece is exposed to being overtaken
audience: legal-ops-director        # primary; corporate-counsel secondary; legal-tech-cio as the sanity check on grounding, permissions, and retention
length_target: open                 # long-form article; the length is whatever the topic requires (content-types/blog-post.md section 2.1)
byline: spaarke                     # organizational byline, which the series decision keeps (voice/bylines.md section 1); the closing contact line names Ralph Schroeder, Founder and CEO (section 6)
campaign: 2026-06-legal-operations-intelligence   # content-platform/campaigns/2026-06-legal-operations-intelligence.md; GitHub milestone "2026-06 Legal Operations Intelligence" (number 5)
github_issue: 81   # https://github.com/spaarke-dev/spaarke-website/issues/81 (created by content-pipeline, 2026-09-22)
triggered_by: idea.md rev. 4 (2026-09-21, re-dated to 2026-09-15 on 2026-09-22); the writer's direction of 2026-09-21 that added the piece to the series as article 5; writer's brief feedback applied 2026-09-22

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: "The Newfound Importance of Knowledge Management"
description: "AI has made a legal department's own knowledge the context its systems need in order to be accurate, and curating that knowledge now falls to legal operations."
summary: "Legal departments have managed knowledge for years. AI changes what counts as knowledge, what it is for, how it is captured, codified, and curated, and where it goes, because the department's own material is the context an AI system needs to answer accurately. That work already sits with legal operations."
date: 2026-09-15                    # display date
posted: "**TBD — confirm**"         # the real publish date: push week 5 Tuesday of the campaign's distribution sequence, entered when the push start date is set (writer, 2026-09-22)
author: "Spaarke Team"
tags:
  organization: [corporate-legal]
  function: [operations, executive, it]
  topic: [dms, ai-copilot, compliance, matter-management, contracts]
  theme: [legal-operations-intelligence, operational-memory, ai-strategy, iq-stack, data-sovereignty]
heroImage: "/articles/the-newfound-importance-of-knowledge-management/hero.svg"
heroImagePosition: "center"
draft: true
keyTakeaways:
  - "Four in five legal operations teams already count knowledge management among their responsibilities. AI changes what that responsibility requires, and the function that runs the systems where new knowledge is created is its natural curator."
  - "A model becomes specific to a department through four mechanisms (grounding, instruction, example, and evaluation), and each one consumes a knowledge asset that someone in the department has to maintain."
  - "Legal research tools built on retrieval over curated content still hallucinated 17% to 33% of the time in the Stanford RegLab study, so corpus quality and an evaluation set are management responsibilities."
  - "Knowledge now includes email, transcripts, negotiation history, billing narratives, intake answers, and expert corrections of AI output, and material that grounds an AI answer needs a known author, date, status, and permissions."
  - "The practical work is capture and codification. An obligation from a contract, a position taken in a negotiation, or a lawyer's correction of an AI draft is recorded with an owner, a date, a status, and permissions, and bound to the matter, party, or obligation it concerns, so the ontology carries it to every measure, workflow, or agent that reaches that entity."
  - "Curation includes deciding what AI must not see. Privilege, ethical walls, retention, and stale content each become a rule about what enters the corpus, who may retrieve it, and when it is retired."
---

# Topic

Knowledge management in a corporate legal department, and what AI has
changed about it. Legal departments and legal operations teams have
collected, organized, and reused their work product for a long time,
and in the CLOC 2025 State of the Industry Report 79% of legal
operations teams counted knowledge management among their
responsibilities. What has changed is the reader of that knowledge. A
general-purpose model knows nothing about a department's positions,
history, or standards, and everything it can see when it answers is
the context the department supplies. The department's own knowledge
has therefore become the material on which the accuracy of its AI
systems depends. Article 2,
[How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform),
names context as the platform's differentiator and gives it two
sources, integration across the systems the department runs and
augmentation with the organization's own knowledge. In the AI sense
this piece uses, context is everything the model sees, which combines
the data and information from those systems with the department's
knowledge, and the knowledge is the part only the department can
supply. The two senses agree, because article 2 names the two sources
and this piece describes what the model receives once both are
combined. The changed reader raises the importance of an established
function and adds new dimensions to it: what counts as knowledge, what
knowledge is for, how it is captured, codified, and curated, where it
goes, and what it must be kept from. The piece is article 5 of 5 in
the Legal Operations Intelligence series, and it closes the series. It
carries the full argument for a sentence in article 1,
[The New Mandate for Legal Operations](/why-spaarke/managing-legal-operations),
which states that legal operations is taking on the curation of the
department's knowledge as AI becomes more integral to the work. It also
describes the material that the entity and action model of article 3,
[The Legal Operations Intelligence Ontology](/why-spaarke/legal-operations-ontology),
organizes and that the model's agents consume. Knowledge management
supplies the source material, and the ontology gives that material
structure and makes it actionable. The practical work in between is
capturing and codifying that material so that it can be bound to the
entities the ontology holds. Business intelligence is the
deterministic dimension, and the platform is the set of department
capabilities (process, people, and technology, with technology as the
tangible instantiation) that brings them together. The piece never
presents knowledge management as a replacement for any of the other
three.

# Angle / Point of view

[Institutional Knowledge Is Walking Out the Door](/why-spaarke/institutional-knowledge)
argued that context leaves with people and that documentation alone
does not retain it. This piece begins where that article's single
paragraph on AI stops. The thesis, in the single sentence that will
appear in the opening, is written so that it does not wait for any new
term (`voice/style-guide.md` section 3): *A legal department's own
knowledge has become the context on which the accuracy of its AI
systems depends, and curating that knowledge for AI is now part of the
legal operations mandate.* The sentence that follows gives the reason:
*Legal operations already carries the responsibility in most
departments, and it already runs the systems in which the new sources
of knowledge are created.* The reader should walk away believing six
things:

1. **The constraint has moved from the model to the knowledge, and the
   knowledge is something departments already manage.** The earlier
   debate concerned whether the models were good enough. By 2026 the
   knowledge management community, the trade press, the publishers,
   and the consultancies describe an organization's own knowledge as
   the limiting factor. The piece reports that consensus with its
   limits stated: most of the voices are law firm knowledge leaders
   and vendors with an interest in the conclusion, the hard numbers are
   thin, and Stephen Embry, the skeptical voice, holds that
   consultancy figures published without their methodology deserve a
   grain of salt.
2. **Context is what a department supplies, and the reasons are
   technical.** Everything a model can see when it answers sits in a
   window of fixed size, and a model becomes specific to a department
   through four mechanisms, grounding, instruction, example, and
   evaluation, each of which consumes a knowledge asset that someone
   has to maintain. The department's knowledge is a core part of what
   drives context for AI, alongside the data and information from the
   systems of record that article 2 describes; context is the
   combination, and knowledge is the part only the department can
   supply. Retrieval alone does not make AI accurate, which is why the
   last two mechanisms matter as much as the first.
3. **What knowledge is, and what it is for, have both changed, and so
   have the criteria for curation.** AI systems can draw on material
   the department already produces and never wrote as knowledge, and
   the larger use of knowledge is now as the material that grounds,
   instructs, exemplifies, and tests the systems that help produce the
   work product. A document that grounds an answer needs a known
   author, date, status, and permissions, because the system applies
   it without the judgment a lawyer would have applied.
4. **The practical challenge is capturing and codifying the
   department's knowledge and making it available to the ontology.**
   Much of that knowledge is created in email, transcripts,
   negotiations, billing narratives, intake answers, and expert
   corrections, and it is never written as knowledge. Capture and
   codification put it into forms with a known author, date, status,
   and permissions, and the destination is the ontology, the entity
   and action model of article 3, which is where knowledge becomes
   part of the context an agent or a person acts on. Knowledge
   management supplies the material, the ontology organizes it and
   makes it actionable, and the piece keeps that division.
5. **Legal operations already holds the responsibility and is the
   natural curator of the department's knowledge for AI.** The
   frameworks that define the function still describe knowledge
   management as people reusing work product, and no industry body has
   described what the responsibility now requires. The piece states
   the case as its own position, states the role, and limits it to the
   owner, the standards, the review and retirement cycle, and the
   measures.
6. **Curation includes deciding what AI must not see.** Privilege,
   confidentiality, ethical walls, stale content, provenance,
   retention, and unregulated tools each become a rule about what
   enters the corpus, who may retrieve it, when it is reviewed, and
   when it is retired.

What Spaarke pushes back on is the treatment of model choice as the
decisive variable in legal AI, and the assumption that pointing an
assistant at a document repository is knowledge management for AI. A
repository holds what was filed; a corpus fit for grounding has an
owner, a status for every item, permissions that travel with every
passage, and a way to test the answers it produces. The piece also
observes, with respect for both bodies, that the CLOC Core 12 and the
ACC Legal Operations Maturity Model 2.0 do not mention AI in their
knowledge management text, and it fills the gap they leave. A second
view in the field, associated with Winston Weinberg of Harvey and Ed
Walters of Clio, holds that situational context matters more than the
size of the library. The piece treats that view as support, because
context is also something the organization has to supply, and it uses
context as the concept that organizes the argument. In the vocabulary
of the existing library, the department's curated knowledge is the
Memory layer of the Legal IQ stack, which Spaarke calls operational
memory, and the piece uses that term once.

# Why now

Every bullet rests on evidence dated on or before 2026-09-14. A source
dated on the display date itself is out. The statuses come from the
evidence tables in `idea.md` (groups A to G) and from
`content-platform/research/2026-09-loi-series/DIGEST.md`.

- **The practice is established, and the piece says so at the start.**
  In the CLOC 2025 State of the Industry Report (released 2025-02-12;
  data from the 2024 Harbor Law Department Survey in collaboration
  with CLOC; 186 organizations), 79% of respondents placed knowledge
  management within their legal operations team's responsibilities,
  the sixth most common of 15 services. Confirmed from the PDF text.
  Both the CLOC Core 12 and the ACC Legal Operations Maturity Model
  2.0 name a knowledge management function, and neither text is
  recent. The piece is about what has changed, and it opens on what
  has not.
- **The industry's account of the problem changed within about a
  year.** Inside Practice built its New York program of 2026-04-29 on
  the line "Artificial intelligence is no longer the bottleneck for law
  firms. Knowledge is." (confirmed verbatim). Harbor's brief on ILTACON
  2026 (2026-09-11) reports that "clean, connected data is the
  precondition for AI producing anything useful" (confirmed, raw
  text), and CCBJ's editor wrote from the same conference that the
  bottleneck "may not always be model quality; it may be record
  quality" (2026-08-31; confirmed, and the sentence is Kristin Calve's
  own). The ILTA 2026 Technology Survey executive summary (2026-09-14;
  508 responding firms) gives the same account in survey form, and its
  quotations carry **TBD — confirm** until they are checked against
  the PDF.
- **Context is the organizing concept, and the field's own vocabulary
  has moved to it.** Anthropic's engineering post of 2025-09-29 defines
  context as "the set of tokens included when sampling from a
  large-language model (LLM)" and context engineering as "the set of
  strategies for curating and maintaining the optimal set of tokens
  (information) during LLM inference" (confirmed, raw HTML). In
  Artificial Lawyer's predictions of 2026-01-08, Ed Walters of Clio
  wrote "Out: Prompt engineering. In: Context engineering." and
  Winston Weinberg of Harvey wrote "In 2026, context wins" (both
  confirmed verbatim). Every kind of knowledge management content a
  department maintains maps to an AI mechanism that consumes it, and
  the piece shows the mapping.
- **In-house adoption has passed law firm adoption.** The Thomson
  Reuters 2026 AI in Professional Services Report, as summarized on the
  Thomson Reuters legal blog on 2026-07-02, found that 47% of
  corporate legal departments and 41% of law firms said their legal
  teams were using generative AI, up from 23% and 28% in 2025
  (confirmed). The inference that in-house departments reach the
  knowledge problem at least as early as firms do is the article's own.
  The further point that they reach it with less capacity rests on two
  confirmed facts, the median legal operations function of 5 FTEs
  (CLOC 2025 report, page 11) and the ACC model's advanced-stage marker
  of one full-time knowledge management professional, and it is
  presented as discussion, because no in-house knowledge management
  headcount benchmark was found.
- **Professionals state the requirement themselves.** In the Thomson
  Reuters 2026 Future of Professionals Report (same summary), 94% of
  respondents demanded outputs grounded in authoritative content and
  96% demanded safeguards for confidential data (confirmed; sample size
  **TBD — confirm**).
- **The frameworks have not caught up.** The CLOC Core 12 knowledge
  management page and the ACC Legal Operations Maturity Model 2.0
  knowledge management function do not mention AI (confirmed; both
  texts seen verbatim). The research found no framework or association
  text that describes what the function becomes when the first reader
  of the department's knowledge is an AI system, and this piece
  supplies that description.
- **The accuracy evidence gives the argument weight.** In the Stanford
  RegLab study, now citable in its peer-reviewed form (Journal of
  Empirical Legal Studies, volume 22, issue 2, 2025), the legal research
  tools from LexisNexis and Thomson Reuters, all built on retrieval
  over curated content, "each hallucinate between 17% and 33% of the
  time" (confirmed). The quality of the corpus and the ability to test
  outputs have become management responsibilities.
- **The risks became concrete in 2026.** In United States v. Heppner
  (S.D.N.Y.), Judge Rakoff's written memorandum of 2026-02-17 held that
  exchanges with a consumer generative AI tool were not protected by
  privilege or work product (corrected: cite the memorandum, since the
  Debevoise post of 2026-02-11 predates it). Mayer Brown's client alert
  of 2026-06-03 describes how AI notetaker transcripts widen retention
  and discovery exposure (confirmed). Opening a department's knowledge
  to AI is now a governance decision as well as a productivity
  decision.
- **Article 1 makes a claim that this piece has to defend.** Article 1
  states that legal operations is taking on the curation of the
  department's knowledge. The CLOC 2025 figure shows that the
  responsibility already sits with legal operations in four departments
  out of five, and no industry body has described what it now requires,
  which leaves the position open for this piece to state.
- **The library has a gap.** `institutional-knowledge` treats AI in a
  single paragraph near its end, and `the-ai-readiness-gap` treats data
  and knowledge readiness as the precondition for AI without saying
  what a department's knowledge has to become. No published piece maps
  knowledge management content to the mechanisms that consume it.

# Must include

The bullets follow the order the plan should try first. Each names the
evidence it rests on; the status of every row is in `idea.md`
(evidence groups A to G) and in the research digest.

- **An opening that states the established practice before the
  change, and reaches the thesis by the third paragraph.** The reader
  has practised knowledge management for years, so the opening says so
  in its first paragraph, with the CLOC 2025 figure (79% of 186
  departments) as the evidence that the responsibility is already
  common. The complication is the changed reader: the first reader of
  the department's knowledge is now, in many departments, an AI
  system. The thesis sentence from the Angle follows, within the first
  250 words. The shape differs from the ontology article, which opens
  on a scene; this one may follow the model in
  `voice/examples/consulting-register.md` section 6.2, a tension
  between two figures, using the 94% of professionals who demand
  grounded outputs beside the 17% to 33% error rate of tools that
  already ground on curated content. Link
  [Institutional Knowledge Is Walking Out the Door](/why-spaarke/institutional-knowledge)
  once, early, as the article this one extends, and link
  [What Is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence)
  where the piece first uses the term.
- **The consensus and its limits (argument 1).** Give the change in
  the industry's own account, with each voice's scope stated. Inside
  Practice framed its April 2026 New York program on the line quoted
  in Why now. Oz Benamram wrote in Artificial Lawyer (2026-01-08) that
  "Clean, structured, context-rich KM (precedents, outcomes, expertise
  signals) becomes decisive" (confirmed verbatim; the phrase "exposes
  poor KM" is paraphrased and not quoted, **TBD — confirm** against
  the live page). His reading of the 2026 SKILLS survey of 130 of the
  world's largest law firms, published on a vendor's blog (Harvey,
  2026-03-13), is that firms "have identified the knowledge management
  layer as the next priority" (confirmed verbatim; name the host as a
  vendor's blog). The ILTACON 2025 roundtable, relayed by Artificial
  Lawyer from a vendor's notes (2025-08-13), described knowledge
  professionals "shifting from maintaining knowledge bases to
  orchestrating AI workflows and ensuring data quality" (confirmed
  verbatim; second-hand). Harbor's ILTACON 2026 brief (2026-09-11)
  reports clean, connected data as the recurring theme of the
  knowledge management sessions (confirmed). The ILTA 2026 Technology
  Survey (508 responding firms, representing over 139,000 lawyers)
  reports that 94% of responding firms are engaged with generative AI
  and that "knowledge infrastructure remains dramatically
  underdeveloped" (sample and date confirmed; quotations
  **TBD — confirm**). State in the citing sentence that the ILTA
  sample is law firms only. Link
  [The AI Readiness Gap in Legal Departments](/why-spaarke/the-ai-readiness-gap)
  where the constraint is stated. Then give the limits in one
  paragraph: the voices are mostly law firm knowledge leaders and
  vendors with an interest in the conclusion, the hard numbers are
  thin, and Stephen Embry (Above the Law, 2026-08-25), the skeptical
  voice, holds that consultancy figures published without their
  methodology deserve "a grain of salt" (confirmed, raw HTML). Embry
  stands alone in that role, cited on his own sentences. The Harbor
  measurement sentence is not used (see Must NOT include). Close the
  section on the context-over-content view (Weinberg, Walters), which
  introduces the concept that organizes the next section.
- **Context, and the four mechanisms that make a model specific to a
  department (argument 2).** Open the section with the sentence that
  the department's knowledge is a core part of what drives context for
  AI, alongside the data and information from the systems of record
  that article 2 describes; context is the combination, and knowledge
  is the part only the department can supply. Then define context and
  context engineering from the Anthropic engineering post (2025-09-29;
  confirmed), with the point that recall degrades as the window fills,
  so every item in the department's corpus competes for the same finite
  capacity, which is why curation and selection matter. Then the four
  mechanisms, each with the knowledge asset it consumes, as H3
  subsections or as four paragraphs under one H2:
  - *Grounding and retrieval.* The system searches the department's
    own material at question time and hands the best matches to the
    model before it answers (Lewis et al., 2020-05-22; confirmed). The
    asset is a curated corpus that is current, authoritative,
    permissioned, and tagged well enough to be found. Microsoft
    describes its semantic index as providing "the grounding data for
    knowledge retrieval" (Microsoft Learn, ms.date 2026-04-23, updated
    2026-08-18; confirmed, raw text). The piece defines grounding in
    its own words, because no dated neutral one-sentence definition
    passes the display date. Link
    [What Attorneys Need to Know About AI Architecture](/why-spaarke/what-attorneys-need-to-know-about-ai),
    which explains retrieval-augmented generation, so that the
    explanation is not repeated here.
  - *Instruction.* System prompts, playbooks, clause libraries with
    fallback positions, and agent skills tell the system what the
    department's position is and when to escalate. Anthropic's Agent
    Skills are "folders that include instructions, scripts, and
    resources that Claude can load when needed" (2025-10-16;
    confirmed), and the company's legal plugin, added on 2026-01-30
    (LawSites, 2026-02-03; corrected date), is "configurable to your
    organization's playbook," set "in a local settings file to define
    standard positions, acceptable ranges, and escalation triggers"
    (product page; re-verified in round two). Both are neutral examples
    under the series naming rule.
  - *Example.* Few-shot examples (Brown et al., 2020-05-28; confirmed)
    and gold-standard answers show the system what good work looks
    like in this department: model documents, the department's
    strongest memos, and approved intake answers.
  - *Evaluation.* Evaluation sets, built from real questions with
    approved answers and correctness criteria, tell the department
    whether the system is right. The Vals Legal AI Report (2025-02-27;
    confirmed verbatim) shows the pattern: "The Consortium Firms
    together created the dataset used for the study," and the eight
    firms supplied over 500 samples of questions, reference documents,
    ideal responses, and correctness criteria, so finished work product
    became the benchmark.
- **The context map, as Exhibit 1.** The table pairs each AI term with
  a one-sentence definition for a legal operations reader, the
  knowledge management content that maps to it, and a dated source that
  passes the display date. The definitions are the article's own
  wording, offered as discussion; the quoted phrases in the References
  are the citable text. The exhibit's title states the finding as a
  full sentence: *Every kind of knowledge management content a
  department maintains maps to an AI mechanism that consumes it.* In
  the article, the source column may move to linked citations in the
  surrounding prose if the table is too wide for the reading column.

  | AI term | Definition for a legal operations reader | Knowledge management content that maps to it | Dated source that passes 2026-09-15 |
  |---|---|---|---|
  | Context; context window | Everything the model can see when it answers, within a fixed capacity whose recall degrades as it fills. | All of the department's curated material, because every item competes for the same finite window; the reason curation and selection matter. | Anthropic engineering post, 2025-09-29 (confirmed) |
  | Context engineering | The discipline of choosing what information, instructions, examples, and tools the model is given for a task. | The whole knowledge management output, consumed as a set: corpus, playbooks, examples, and evaluation material assembled per task. | Willison, 2025-06-27 (Lütke and Karpathy quotations; confirmed); Anthropic, 2025-09-29 (confirmed); Artificial Lawyer, 2026-01-08 (Walters, Weinberg; confirmed) |
  | Grounding | Tying an answer to specific source material supplied at answer time so that it can be checked. | Precedents, memos, policies, and matter records with known author, date, and status; the material the answer must cite. | Microsoft Learn semantic index page, 2026-04-23 (confirmed; uses the term without a one-sentence definition); Thomson Reuters blog, 2026-07-02 (94% demand grounding; confirmed) |
  | Retrieval-augmented generation | Searching a document set at question time and handing the best matches to the model before it answers. | The precedent bank, clause library, matter histories, and intake answers, indexed so they can be found; the quality of the corpus is the controlling variable. | Lewis et al., 2020-05-22 (confirmed); Stanford RegLab, JELS 2025 (confirmed); LexisNexis, 2024-05-03 (confirmed) |
  | Embeddings, chunking, vector search | Numeric representations of meaning, produced from passages cut from documents and searched by similarity rather than by keyword. | Every document in the corpus, cut into passages; the step where document-level metadata (author, date, status, permissions) is lost unless carried with each chunk. | Microsoft Learn, Azure AI Search chunking page, 2026-06-08 (confirmed); Microsoft Learn semantic index page, 2026-04-23 (vector definition; confirmed) |
  | System prompts and instructions | Standing instructions that set the model's role, rules, and behaviour for every conversation. | Department standards: tone, approval rules, what to escalate, what never to do; the written policy that used to live in an onboarding guide. | Anthropic engineering post, 2025-09-29 (confirmed) |
  | Agent skills, tools, and playbooks as configuration | Packaged procedures the model loads when relevant (skills), functions it may call (tools), and configuration files stating positions and escalation triggers (playbooks). | Negotiation playbooks with fallback positions, clause libraries, checklists, and process guides, rewritten as machine-readable configuration. | Anthropic Agent Skills, 2025-10-16 (confirmed); Anthropic legal plugin, release 2026-01-30 per LawSites 2026-02-03 (corrected date) |
  | Few-shot examples and gold-standard answers | Worked examples placed in the prompt, and approved answers to known questions. | Model documents, the department's strongest memos, and approved intake answers; expert corrections of AI output become the next examples. | Brown et al., 2020-05-28 (confirmed); Anthropic engineering post, 2025-09-29 (confirmed) |
  | Evaluation sets and benchmarks | Real questions with approved answers and grading criteria, used to measure how often the system is right. | Finished work product repurposed as reference answers; correctness criteria written by practice-area reviewers; decision logs that record what the right call was. | Vals Legal AI Report, 2025-02-27 (confirmed); Stanford RegLab, JELS 2025 (confirmed) |
  | Fine-tuning versus retrieval | Changing the model by further training, versus leaving it unchanged and supplying material at answer time. | Retrieval consumes the curated corpus; fine-tuning would consume a training set, which no department or firm was found to build from its own knowledge. | OpenAI's Harvey case study, 2024-04-02 (a vendor case study on public case law; corrected: do not call it the only such case); LexisNexis, 2024-05-03 (confirmed) |

  The mapping to the writer's six content types belongs in the prose
  around the exhibit:
  - precedents map to grounding, retrieval, and chunking (they are the
    corpus);
  - clause libraries to playbooks as configuration and to grounding;
  - playbooks to system prompts, skills, and configuration files;
  - matter histories to retrieval and grounding and to situational
    context (the Weinberg point);
  - decision logs to evaluation sets and few-shot examples;
  - expert corrections to gold-standard answers and evaluation sets,
    the least collected content and the most direct feedback signal.
- **Curated retrieval still leaves roughly one answer in five wrong,
  which is why evaluation is a management responsibility.** The
  Stanford RegLab study (JELS 2025; confirmed) found that the legal
  research tools it tested, all retrieval-based, "each hallucinate
  between 17% and 33% of the time." Rebecca Fordon's review of the
  literature (AI Law Librarians, 2026-02-19; confirmed verbatim)
  attributes the better performance of legal platforms to "curated,
  verified legal databases with citators" and still concludes that
  "roughly one in five responses contains errors." Interpret the
  numbers: the first consequence is that the quality of the retrieved
  corpus is the variable a department controls; the second is that a
  department needs a way to test accuracy on its own work, which is
  the purpose of an evaluation set. Link
  [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic)
  (short title as link text) where the error rates are discussed. State
  the absence of evidence on fine-tuning as absence. The research found
  no source describing a legal department or firm fine-tuning a model
  on its own knowledge as a mainstream practice. The legal research
  products describe themselves as retrieval-based (LexisNexis,
  2024-05-03; confirmed), and the one vendor case study of a
  custom-trained legal model concerns public case law rather than a
  customer's knowledge (OpenAI on Harvey, 2024-04-02; corrected: the
  piece does not call it unique). A department's influence over the
  quality of its AI therefore runs through what it supplies at answer
  time and how it tests the result.
- **What counts as knowledge has widened past finished work product
  (argument 3).** Traditional knowledge management collected memos,
  templates, precedents, and know-how notes. AI systems can draw on a
  wider set of material, most of which the department already produces
  and none of which was written to be knowledge:
  - email and chat;
  - meeting transcripts;
  - matter metadata;
  - negotiation and redline history;
  - decision logs and approvals;
  - outside counsel work product;
  - billing narratives;
  - intake requests and the answers given to them;
  - expert corrections of AI output.

  For each source, one sentence says what it teaches an AI system that
  a finished document does not. Negotiation history shows which
  positions the department conceded and under what conditions. Billing
  narratives describe the work a matter type required. Intake requests
  and answers show what the business asks and what legal has already
  said. Expert corrections may be the most valuable source and the
  least collected, because each one records a gap between what the
  system produced and what the department's standard requires, and
  each becomes the next gold-standard example or evaluation case. State
  the evidence as uneven. Practitioners confirm the widening: Tom
  Humberstone of Womble Bond Dickinson says repositories "have evolved
  beyond traditional, curated know-how to encompass a broader set of
  sources now" (Tiger Eye, 2025-12-19; confirmed verbatim), Benamram
  lists precedents, outcomes, and expertise signals, and the ILTACON
  2025 roundtable described knowledge "scattered across OneDrive,
  SharePoint, Teams, and personal folders" (confirmed verbatim). The
  research found no neutral source that describes billing narratives,
  decision logs and approvals, outside counsel work product, intake
  answers, or expert corrections being managed as knowledge assets.
  Those items are the article's own argument and are presented that
  way. The writer confirmed on 2026-09-22 that no named practitioner
  example is available, so the section stands on the confirmed
  practitioner lines above and on the article's own argument.
- **The work is capture and codification, and the destination is the
  ontology.** A section under that candidate heading (sentence case)
  follows the new sources and precedes the curation section. It
  extends argument 3 as the article's own position, with no new
  sources. Most of the material in the list above is created in
  email, transcripts, negotiations, billing narratives, intake answers,
  and expert corrections, and it is never written as knowledge, so the
  practical challenge is to capture it, codify it, and make it
  available to the ontology. The section takes the three in turn.
  Capture is the act that turns work into a record, and the section
  names it for each new source: an obligation extracted from a
  contract, a position taken in a negotiation, a reason recorded when
  an invoice line is reduced, an answer given at intake, a correction
  a lawyer makes to an AI draft. Codification gives each record a
  defined shape, an owner, a date, a status, and permissions that
  travel with it. Available to the ontology means bound to the entity
  the record is about, so that the matter, the party, the policy, or
  the obligation carries it, and so that a measure, a workflow, or an
  agent that reaches the entity reaches the knowledge too. The
  ontology is the entity and action model of article 3, and the
  section links
  [The Legal Operations Intelligence Ontology](/why-spaarke/legal-operations-ontology)
  at the sentence that names the destination; the series-placement
  section may link it again if the distance warrants. Knowledge
  management supplies the material, the ontology organizes it and
  makes it actionable, and the section keeps that division without
  setting one against the other.
- **Knowledge now trains the systems that produce the work product,
  and the curation criteria change with it.** Finished work product
  used to be the end product of knowledge management: a lawyer found
  the memo and reused it, and that use continues. The larger use now
  is as material that trains the AI systems that help produce the work
  product. The piece uses "training" in the sense legal AI systems use
  it, which is grounding, instruction, example, and evaluation, and it
  says so in a sentence when the word first appears. The CLOC Global
  Institute 2026 case study from Uber's legal operations team refers to
  "training the model on our curated legal knowledge base to ensure
  relevance and verifiable accuracy" in that sense (session
  description; **TBD — confirm**). The shift changes the criteria for
  curation. A document kept for human reuse needed to be findable and
  roughly right, because the lawyer who reused it applied judgment. A
  document that grounds an AI answer needs a known author and date, a
  known status (current, superseded, or withdrawn), known permissions,
  and where possible a known outcome, because the system applies it
  without that judgment. Give the technical root. Retrieval pipelines
  cut documents into passages small enough to embed and search
  (Microsoft Learn, Azure AI Search, ms.date 2026-06-08; confirmed: a
  starting chunk size of "512 tokens (approximately 2,000 characters)"
  with 25% overlap). A passage loses its document-level wrapper of
  author, date, status, and permissions unless the pipeline carries
  that metadata with every chunk, and that inference is the article's
  own, presented as discussion. Josh Baxter of NetDocuments
  described the result of uncontrolled copying to CCBJ (2026-08-31;
  confirmed) as "micro and incomplete DMSs," which Calve glossed as
  "partial representations of institutional knowledge assembled for
  particular applications and potentially governed differently," and
  that is the failure mode a curation standard exists to prevent.
- **Four worked examples, each in one paragraph and each presented as
  an illustration of process.** The examples describe what happens and
  carry no invented measurements. If the writer has a real case from
  their network, it replaces the illustration and is marked
  **TBD — confirm** until the facts are checked.
  - *The NDA thread*, which runs through the four mechanisms and
    returns in the closing section. The corpus is the approved
    template and the prior negotiated NDAs, each with a known status
    and, where the department recorded it, a known outcome. The
    playbook states the standard positions, the acceptable ranges, and
    the escalation triggers. The examples are three of the
    department's strongest negotiated NDAs. The evaluation set is a
    dozen real questions the business has asked about NDAs, each with
    an approved answer. When a lawyer corrects an AI answer, the
    correction becomes the next test case.
  - *The superseded clause.* An indemnity position that the department
    withdrew after a regulatory change stays in the repository. A
    lawyer who found it would recognize it as out of date; a retrieval
    system with no status field retrieves it and applies it. The
    example shows why status is a curation criterion and not a filing
    nicety.
  - *The intake answer.* A business unit asks whether a vendor contract
    needs a data processing addendum, and legal answers by email. Six
    months later another business unit asks the same question. Where
    the earlier answer was kept as knowledge with its author, date, and
    status, the assistant grounds on it, cites it, and the department
    can show which source produced the answer, which is what provenance
    means in practice.
  - *The transcript.* An AI notetaker's transcript of a matter meeting
    enters the corpus and becomes retrievable by people who were not in
    the room, and it widens the scope of any later legal hold (Mayer
    Brown, 2026-06-03; confirmed). The example shows that retention
    rules apply at the point of entry.
- **The frameworks that define the function have not caught up
  (argument 4).** Quote both texts. The CLOC Core 12 defines the
  knowledge management function as implementing "processes and
  standards to collect, structure, and organize knowledge to save time
  and improve outcomes" (confirmed verbatim; the page has no mention of
  AI). The ACC Legal Operations Maturity Model 2.0 defines it as "The
  process of capturing, distributing, and effectively using both
  structured and tacit knowledge assets, from work products (such as
  legal memos) to understanding of an issue due to prior experience"
  (confirmed verbatim, PDF pages 22 to 23). Neither knowledge
  management text mentions AI, and the ACC model does mention AI in
  other functions (eDiscovery, intellectual property, metrics and
  analytics, technology), which makes the silence in the knowledge
  management function more noticeable. Both definitions describe
  people reusing work product. State the observation as one about the
  published text, with respect for both bodies, and do not write
  "requires only one" of the ACC advanced-stage marker. Close the
  section with the note that AI is entering CLOC's program through
  training. CLOC announced a practitioner-led AI Intensive on
  2026-08-19, with a first workshop announced for 2026-10-27 in New
  York for about 40 participants covering "real-time prompting
  exercises, workflow and agent design, and implementation planning"
  (confirmed). The workshop date falls after the display date, so the
  piece describes it in the release's own terms, as announced, and
  never as an event that has taken place. The string "knowledge
  management" appears nowhere in the release, and the Core 12 text is
  unchanged. The Core 12 revision date (2020-04-07)
  and the ACC publication year (2020) come from a gap track and carry
  **TBD — confirm**; the piece can say "neither text is recent" without
  them.
- **Legal operations already holds the responsibility, and it is the
  natural curator (argument 5).** Open the section with the CLOC 2025
  figure, so that the responsibility is shown to exist before the
  piece says what it now requires. Then the capacity point, as
  discussion. Law firms meet the knowledge problem with knowledge
  departments, professional support lawyers, and chief knowledge
  officers, and the ILTA 2026 survey reports that "Many firms
  anticipate additional headcount needs across IT, innovation,
  security, training, knowledge management, and data science" without
  a percentage (law firms only; quotation **TBD — confirm**). The
  median in-house legal operations function is 5 FTEs (CLOC 2025
  report, page 11; confirmed) and carries knowledge management
  alongside 11 other services, and the ACC model lists "At least one
  full-time dedicated KM professional" as one of 13 advanced-stage
  markers (confirmed). No in-house knowledge management staffing
  benchmark was found, and the piece says so. Then the case, stated as
  Spaarke's own position, because no industry body assigns the role.
  CLOC and Harbor frame the legal operations role in AI as governance
  and operating model, and 85% of departments now "have dedicated AI
  oversight or resources" (CLOC 2026 State of the Industry Report,
  135 departments, 2026-03-02; confirmed from the release). The case
  rests on three observations. First, legal operations already runs
  the systems in which the new sources are created: intake, matter
  management, e-billing, outside counsel management, and the
  technology stack. Second, legal operations is the function that CLOC
  and Harbor already associate with AI governance, and ownership
  elsewhere is fragmented. Harbor's ILTACON 2026 brief reports "a
  recurring frustration raised in roundtable discussions" over
  "fragmented ownership of AI security and governance decisions across
  IT, Risk, the General Counsel's office, and knowledge management" and
  concludes that "Governance needs a clear owner" (confirmed, raw
  text). Use the observation as an analogy, say that it describes law
  firm roundtables, and note that no equivalent in-house data was
  found. Third, curation is operational work (ownership, standards,
  review cycles, retirement, and measurement) of the kind the function
  already performs for spend and vendors. Lawyers remain the authors
  of the knowledge and the judges of its quality, and legal operations
  owns the system that collects, qualifies, and maintains it. The
  in-house example is the CLOC Global Institute 2026 session
  (2026-05-12) led by legal operations and knowledge staff from
  JPMorganChase and Guggenheim Investments. Its speakers include a
  knowledge management librarian and a managing director whose remit
  joins eDiscovery, legal operations, and knowledge management, and its
  description states that "legal operations struggle with fragmented
  information and missed collaboration opportunities" (corrected;
  confirmed from the agenda feed). Describe the session in the piece's
  own words and do not quote its title. Jamal Brown's employer is
  **TBD — confirm**, so name no employer for him. Mary
  O'Carroll's remark in Law360 Pulse (2026-06-08; corrected
  attribution) that new roles are harder to get approved may support
  the capacity point in a clause. Link article 1,
  [The New Mandate for Legal Operations](/why-spaarke/managing-legal-operations),
  where the curator case is made, and
  [Legal Ops Is Not IT for Lawyers](/why-spaarke/legal-ops-is-not-it-for-lawyers),
  which already says that strategic legal operations builds
  institutional memory, as a precedent for the case. State the role
  and then limit it: the piece names the owner, the standards, the
  review and retirement cycle, and the measures, and it stops there. A
  later article will expand the operating model, the roles involved,
  and the case for CLOC and ACC to update their definitions.
- **Curation includes deciding what AI must not see (argument 6).**
  Each risk becomes a curation rule about what enters the corpus, who
  may retrieve it, when it is reviewed, and when it is retired. The
  piece cites rulings as facts, describes operational consequences,
  and gives no legal advice on privilege.
  - *Privilege.* United States v. Heppner (S.D.N.Y.; written memorandum
    filed 2026-02-17, ECF No. 27; corrected quote source). Read the
    full sentence that begins "Because Claude is not an attorney" in
    the filing before quoting it, and cite the memorandum.
  - *Confidentiality.* 96% of professionals demand safeguards for
    confidential data (Thomson Reuters 2026 Future of Professionals
    Report, via the 2026-07-02 summary; confirmed; sample
    **TBD — confirm**).
  - *Ethical walls and need-to-know access.* The OWASP Top 10 for LLM
    Applications 2025 lists vector and embedding weaknesses (list
    released 2024-11-17; confirmed; cite the resolved URL). It warns
    that "Inadequate or misaligned access controls can lead to
    unauthorized access to embeddings containing sensitive
    information," and it prescribes "permission-aware vector and
    embedding stores" with strict partitioning between groups.
    Microsoft Learn documents how an enterprise index enforces the
    rule. The semantic index honors "the user identity-based access
    boundary so that the grounding process only accesses content that
    the current user is authorized to access" (ms.date 2026-04-23;
    confirmed). Every item indexed through a Graph connector carries an
    access control list in which "deny takes precedence over grant,"
    and non-directory groups such as ethical-wall teams are replicated
    as external groups (ms.date 2024-11-07; confirmed). Microsoft also
    warns that "Overshared or poorly governed content can affect
    Copilot results and increase risk" (ms.date 2026-08-17; confirmed).
    State the operational lesson
    neutrally: any pipeline that copies documents into a separate store
    has to rebuild permission trimming, and OWASP treats the failure to
    do so as a top-ten weakness. Jenni Tellyn of 3Kites observes that
    stricter access means "you have to work even harder at your
    knowledge management" (Tiger Eye, 2025-12-19; confirmed verbatim).
    The ConfusedPilot preprint (arXiv, 2024-08-09; confirmed) is an
    optional academic complement; paraphrase its abstract rather than
    quoting it.
  - *Stale content.* A superseded precedent that a lawyer would have
    recognized as out of date can be retrieved and applied by a system
    that does not (the superseded-clause example).
  - *Provenance.* The department must be able to show which sources
    produced an answer (the intake-answer example). The ClearPeople
    line on provenance is not fact-checked, and the point is made as
    discussion without it.
  - *Retention and meeting transcripts.* Mayer Brown (2026-06-03;
    confirmed): transcripts create records that "may be accessed by
    individuals who were not present" and widen legal hold scope and
    discovery cost.
  - *Unregulated tools.* In the iManage Knowledge Work Benchmark Report
    2026 (press release 2026-02-11), nearly one-third of organizations
    reported a policy-impacting incident related to unregulated AI
    tools. The sample was 3,185 business and technology decision-makers
    in 26 countries across legal, accounting and tax, financial
    services, and asset management, fielded September to October 2025
    (corrected: "nearly one-third," and "almost 30%" is the share that
    delayed adoption). Label it as vendor research from a document
    management provider in the sentence that cites it.
  Link one of
  [AI Without Giving Away the Keys](/why-spaarke/ai-without-giving-away-the-keys)
  or
  [Your Legal Data Belongs to You](/why-spaarke/your-legal-data-belongs-to-you)
  where the location and control of the department's knowledge bears
  on privilege and confidentiality.
- **Where knowledge management sits in legal operations intelligence
  (argument 7).** Near the end, place the function within the series
  in one section. Knowledge management supplies the source material,
  which is the context that AI needs. The ontology
  ([The Legal Operations Intelligence Ontology](/why-spaarke/legal-operations-ontology),
  article 3) gives that material structure by attaching it to the
  entities and actions it concerns, and that structure is what makes it
  actionable. The capture and codification section has already named
  the ontology as the destination for captured knowledge, so this
  section places the function in the series without repeating that
  point. Business intelligence
  ([A Business Intelligence Approach to Legal Operations](/why-spaarke/business-intelligence-for-legal-operations),
  article 4) is the deterministic dimension, the measures and facts
  computed from records and never generated by a model; link
  [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic)
  again here if the first link is far above. The platform
  ([How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform),
  article 2) is the set of department capabilities (process, people,
  and technology) that brings them together, with technology as the
  tangible instantiation. In the vocabulary of the existing library,
  this is the Memory layer of the Legal IQ stack, which Spaarke calls
  operational memory: use the term once, here, with the link to
  [The Legal IQ Stack: Data, Memory, Inference](/why-spaarke/the-iq-stack).
  That sentence is the default Spaarke reference. One further mention
  is permitted where it helps the reader, if the piece touches where
  the department's knowledge lives: a statement that Spaarke provides
  the Legal Operations Intelligence platform and supports both modes,
  as the system of record for legal work and as the ontology
  architecture over the systems a department already runs. No product
  features are described.
- **Where a department starts (argument 8), and a close on
  consequence.** The article ends on practice. A department can begin
  with an inventory of the knowledge sources it already has and who
  controls each one, a named owner in legal operations, and one
  recurring deliverable (the NDA thread, or the answer to a common
  intake question) for which the corpus, the playbook, and a small
  evaluation set are built and maintained. Rules for review and
  retirement follow. Harbor's advice in its ILTACON 2026 brief, drawn
  from law firm sessions, is similar and confirmed verbatim: "govern
  only the data behind a specific, recurring deliverable, such as a
  report produced regularly or a request fielded constantly, and expand
  from there." The final paragraph states what a legal operations
  director can do in the next quarter and what grows if nothing is
  done (the next assistant grounds on an ungoverned repository, and
  its errors reach decisions sooner), and it adds something new rather
  than restating the argument. No summary, no "Conclusion" heading, no
  pitch.
- **One supporting diagram, as Exhibit 2.** The argument is a loop, so
  `content-types/blog-post.md` section 4 requires it. The diagram shows
  a flow from the sources of knowledge (the nine items in argument 3),
  through curation (owner, standards, review, retirement, permissions),
  to the four uses (ground, instruct, exemplify, evaluate), to AI
  output, to expert correction, and back into the sources. The four
  uses may
  carry the AI terms from the context map as secondary labels. Original
  SVG in the visual-identity palette, abstract, with no product UI, at
  `public/articles/the-newfound-importance-of-knowledge-management/exhibit-2.svg`.
  The exhibit title states the finding as a full sentence: *Expert
  corrections of AI output return to the sources of knowledge, so the
  corpus improves with use.* The alt text is a real sentence: *A loop
  diagram on a deep navy field in which nine knowledge sources on the
  left feed a curation stage, which feeds four uses (ground, instruct,
  exemplify, evaluate), which produce AI output, and expert corrections
  of that output return along the bottom edge to the sources.* Refer
  to it in parentheses at the end of the sentence that states the
  finding, in the form "(Exhibit 2)".
- **Series wiring.** In-body links to articles 1 to 4 are permitted,
  because all four carry earlier display dates (2026-06-16, 2026-07-14,
  2026-07-21, and 2026-09-01). Link article 1 where the curator case is
  made, article 3 at the capture and codification section, and
  articles 2 and 4 where the piece places knowledge management in the
  series; article 2 may also be linked earlier, in the context section,
  at the sentence on the systems of record it describes. The article
  must also stand alone, so the links support the argument and are
  never a prerequisite for it. A series-navigation block at the end of
  the article lists articles 1 to 4 for readers who arrive at the
  series here, and it lists the
  standalone companion, The State of Legal Operations (Fall 2026)
  (`state-of-legal-operations-fall-2026`, display date 2026-10-20),
  added when it ships. The standalone appears nowhere in the body. The
  block is the related-reading list for this piece, so no second list
  is needed; `/platform` is optional and never a call to action.
- **The closing contact line.** After the final paragraph and the
  series-navigation block, the approved wording from
  `voice/bylines.md` section 6 follows, set apart from the body in
  italics after a horizontal rule and written as plain MDX: *For
  questions or comments about this article, contact Ralph Schroeder,
  Founder and CEO of Spaarke, at
  [ralph.schroeder@spaarke.com](mailto:ralph.schroeder@spaarke.com), or
  visit [spaarke.com](https://spaarke.com).* It carries no offer, and
  the ban on a demo call to action stays.
- **Cross-links.** In the body: articles 1, 2, 3, and 4 (article 3 at
  the capture and codification section, where the ontology is named as
  the destination, and again at the series placement if the distance
  warrants); `/why-spaarke/institutional-knowledge` (once, early);
  `/why-spaarke/what-is-legal-operations-intelligence` (once, at the
  first use of the term); `/why-spaarke/the-ai-readiness-gap` (where
  the constraint is stated);
  `/why-spaarke/what-attorneys-need-to-know-about-ai` (at retrieval);
  `/why-spaarke/probabilistic-vs-deterministic` (link text "Legal AI
  Is Not Deterministic", at the error rates and, optionally, at the
  deterministic dimension); `/why-spaarke/legal-ops-is-not-it-for-lawyers`
  (at the curator case); one of `/why-spaarke/ai-without-giving-away-the-keys`
  or `/why-spaarke/your-legal-data-belongs-to-you` (at privilege and
  confidentiality); and `/why-spaarke/the-iq-stack` (once, at the
  single use of "operational memory"). Every published target carries
  a display date before 2026-09-15.

# Must NOT include

- **An introduction to knowledge management.** The reader has practised
  the discipline for years. No primer on taxonomies, precedent banks, or
  the history of the function, and no argument for why a department
  should keep knowledge at all. The opening says that the function is
  established, and the piece is about what AI changes.
- **A repeat of the institutional knowledge article.** No reuse of its
  turnover statistic, its four departure scenarios, or its argument
  that documents are not memory. One link, early, is enough.
- **A law firm knowledge management article.** Most of the evidence
  comes from law firm knowledge leaders, and the piece is about
  in-house departments. Every law firm source is cited with its scope
  stated (the ILTA survey, Harbor's ILTACON brief, the ILTACON 2025
  roundtable, the SKILLS survey, Tiger Eye's practitioners), and the
  piece says where the in-house record is thin.
- **A report that the industry has named legal operations the
  curator.** No body has done so. The article states the case as its
  own, on the confirmed fact that the responsibility already sits with
  legal operations in most departments. Write "the research found no
  statement," never "none exists."
- **A retrieval tutorial or a vendor tour.** Each AI term gets one
  sentence of definition. Products may be named under the series naming
  rule, neutrally and with a source, and no product's features are the
  subject. Microsoft, Anthropic, LexisNexis, Thomson Reuters, OpenAI,
  Harvey, iManage, NetDocuments, and Clio may be named for what their
  pages and executives said before the display date.
- **Knowledge management set against the ontology, business
  intelligence, or the platform.** The four work together, as the
  series decisions state, and no sentence frames one as replacing
  another.
- **A claim that departments train or fine-tune models on their own
  knowledge.** The research does not support it. "Training" is used
  only in the sense stated in Must include, and the Uber session's use
  of the word is quoted as the session's own.
- **A full operating model for the curator.** The role is stated and
  limited to the owner, the standards, the review and retirement cycle,
  and the measures. A later article expands it.
- **Vendor statistics presented as neutral research.** The iManage
  figures carry a vendor label, Harbor's ILTACON lines a consultancy
  label, the SKILLS write-up the name of its vendor host, and the Gartner
  prediction (2025-02-26; cross-industry; corrected sample of 1,203)
  is used, if at all, once and as a prediction. Event-marketing
  statistics stay out. The iManage executive's quotation on
  "foundational work" is not used, because the source punctuates it
  with a spaced hyphen. Harbor's report is cited by description and not
  by its title, and the CLOC Global Institute session is described and
  not titled, because both titles contain words on the house list
  (`voice/vocabulary.md` section 2).
- **Figures that the fact-check moved out of scope.** The Thomson
  Reuters emerging-role figures (39%, 33%, 32%) are 2024 data and are
  not presented as 2026 data. The "71% to 79%" rise in knowledge
  management responsibility is Embry's reading and the 71% is
  unverified; use the 79% alone, or attribute the 71% to Embry and not
  to CLOC. The Core 12 page's "67% developing" maturity figure names no
  survey edition and is not used. The CLOC 2025 report's second
  headcount table (2, 3, 6, 8) could not be found in the PDF and is not
  cited. The Hintyr vendor blog (2026-03-27) is superseded by OWASP and
  Microsoft Learn.
- **The Harbor measurement sentence.** Harbor's "0% of participating
  top-tier law firms and global in-house departments have a mature
  framework for measuring AI's business impact," and Embry's rendering
  of it ("No participating firm in Harbor's 2026 legal lab reported
  having a mature framework"), are not used, by the writer's direction
  of 2026-09-22; the writer doubts the sentence's accuracy. Embry
  remains the skeptical voice alone, cited on his own sentences, and
  Harbor's other ILTACON 2026 lines (clean, connected data; the
  recurring deliverable; fragmented ownership) stay in use.
- **Alarm about risk, or legal advice about privilege.** The piece
  cites rulings as facts and describes operational consequences.
- **A product piece.** Spaarke's term for the layer appears once, in
  the series-placement section, one further mention is permitted where
  it helps the reader, and the piece does not position Spaarke against
  any named vendor (`voice/brand-positioning.md` section 3). No
  competitor marketing collateral as evidence (`voice/domain-knowledge.md`
  section 6). The "context graph" and "context fabric" announcements
  of May 2026 belong to article 3 and appear here only if the plan
  finds a reason.
- **Anything dated on or after 2026-09-15, or a reference to a later
  event.** Held out by date: the CLOC Legal Operations Certified
  Professional credential release (2026-09-16); Inside Practice's
  "Inside Legal KM London" program (2026-09-17), including its line on
  the gap between AI potential and AI performance; CCBJ's recap of
  RLLB 2026 (2026-09-18), including its sentence on who writes the
  instructions agents follow; Google Cloud's Vertex AI grounding
  overview (updated 2026-09-18); Technology.org on OpenAI Astra for Law
  (2026-09-18); the Soutron guide as updated 2026-09-18; and ILTA's own
  news post on the 2026 survey, which carries a 2026-09-15 path (the
  executive summary PDF of 2026-09-14 is the dated anchor). Undated
  documentation pages (the OpenAI accuracy and embeddings guides, the
  Anthropic context-window, evaluation, and API reference pages,
  agentskills.io, and the Model Context Protocol site) inform the
  wording and are not cited in the body. RLLB is the conference of
  LegalOps.com, and "Legal Operators" is a different organization.
- **Do-not-say list items.** Write "institutional knowledge" and never
  "tribal knowledge." Reserve "operational memory" for the single
  permitted use. Use "KM" only inside quotations and write "knowledge
  management" in the prose. No `transform`, `seamless`, `AI-powered`,
  `robust`, `unlock`, `leverage`, `harness`, `ecosystem` (when "set of
  tools" works), `journey`, or `navigate`; no exclamation points; no
  rhetorical-question headings. The full list is in
  `voice/vocabulary.md` section 2.
- **Series recap openers, summary closers, and demo calls to action.**
  Per `voice/style-guide.md` section 5, rules 4, 11, and 25. The
  series connection is worked into the body, and the close ends on
  consequence.
- **AI-tell constructions and the earlier house voice**, per
  `voice/style-guide.md` section 5 (rules 13 to 27),
  `voice/examples/ai-tells.md`, and `voice/examples/avoid-this.md`. The
  published library predates the revised style guide, and the draft
  does not pattern-match against it. No em dash in any field, no
  spaced en dash, no double hyphen, and no spaced hyphen; ranges use
  the word "to."

# References

Research library: `content-platform/research/2026-09-loi-series/`
(start with `README.md`, then `DIGEST.md`, which carries every finding
with its fact-check verdict). The tracks for this piece are in
`notes/`. `knowledge-management-and-ai.md` and its `.verified.md` file
are the round-one track. `r2-km-ai-alignment.md` and its `.verified.md`
file are the round-two track, whose Part A is the context map and
whose Part C second-checked the five gap-track items named below.
`changing-role-of-legal-ops.md` covers the curator question. The gap
tracks `gap-association-definitions-of-legal-ops.md` and
`gap-conference-session-sweep-2026.md` were researcher-read, so they
carry the marker wherever this brief uses a finding that round two did
not second-check. The notes written on 2026-09-21 use the earlier
article numbering; the `r2-` notes use the numbering in this brief.
The evidence groups in `idea.md` (A to G) carry the status of every
row. Confirmed means a fact-checker saw the claim in the source, and
"seen verbatim" means the quotation was matched against the raw page
text. Corrected means the substance held and the stated correction
applies. The marker means the claim was not independently fact-checked
or could not be seen. The fetch tool paraphrased or misattributed
"verbatim" quotations at least three times during the research, so
every quotation is checked against the live page before publication,
including the confirmed ones.

Internal (link from the draft; every target carries a display date
before 2026-09-15):

- [The New Mandate for Legal Operations](/why-spaarke/managing-legal-operations):
  article 1 of the series (display date 2026-06-16). In-body link where
  the curator case is made; the piece supplies the argument for the
  sentence in article 1 that legal operations is taking on the curation
  of the department's knowledge.
- [How to Build the Legal Operations Intelligence Platform](/why-spaarke/building-the-legal-operations-intelligence-platform):
  article 2 (display date 2026-07-14). Link in the series-placement
  section, where the platform is the set of capabilities that brings
  the components together. If the piece uses article 2 earlier, link
  it in the context section, at "the systems of record that article 2
  describes," and the series-placement mention may then stand without
  a second link.
- [The Legal Operations Intelligence Ontology](/why-spaarke/legal-operations-ontology):
  article 3 (display date 2026-07-21). Link at the capture and
  codification section, at the sentence that names the ontology as the
  destination; link again at series placement if the distance
  warrants.
- [A Business Intelligence Approach to Legal Operations](/why-spaarke/business-intelligence-for-legal-operations):
  article 4 (display date 2026-09-01). Link in the series-placement
  section, where business intelligence is the deterministic dimension.
- [Institutional Knowledge Is Walking Out the Door](/why-spaarke/institutional-knowledge):
  the closest existing article, which this piece extends without
  repeating. One link, early.
- [The Legal IQ Stack: Data, Memory, Inference](/why-spaarke/the-iq-stack):
  link once, at the single use of "operational memory."
- [The AI Readiness Gap in Legal Departments](/why-spaarke/the-ai-readiness-gap):
  data and knowledge readiness as the precondition for AI. Link where
  the constraint is stated.
- [What Attorneys Need to Know About AI Architecture](/why-spaarke/what-attorneys-need-to-know-about-ai):
  explains retrieval-augmented generation and says that quality depends
  on which documents are indexed. Link at retrieval so the explanation
  is not repeated.
- [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic):
  link at the error rates and, optionally, at the deterministic
  dimension. Use this short title as the link text, because the full
  title contains an em dash (`voice/style-guide.md` section 4).
- [AI Without Giving Away the Keys](/why-spaarke/ai-without-giving-away-the-keys)
  and
  [Your Legal Data Belongs to You](/why-spaarke/your-legal-data-belongs-to-you):
  link one of them where the location and control of the department's
  knowledge bears on privilege and confidentiality.
- [Legal Ops Is Not IT for Lawyers](/why-spaarke/legal-ops-is-not-it-for-lawyers):
  already says that strategic legal operations builds institutional
  memory. Link at the curator case as a precedent.
- [What Is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence):
  link once, where the piece first uses the term.
- `/platform`: optional related reading. Never a call to action.
- The standalone companion (`state-of-legal-operations-fall-2026`,
  display date 2026-10-20) carries a later display date and is reached
  only through the series-navigation block.

External (every named number needs one; the status is the evidence
group status, and a claim that carries the marker is not cited until
it is checked):

*A. The industry framing and the established practice (argument 1).*

- CLOC, 2025 State of the Industry Report (PDF; released 2025-02-12;
  data from the 2024 Harbor Law Department Survey in collaboration with
  CLOC; 186 organizations across more than 15 industries and 14
  countries). Page 12, chart "WHICH SERVICES FALL WITHIN YOUR LEGAL
  OPERATIONS RESPONSIBILITIES?": Knowledge Management 79%, sixth of 15
  services, after Outside Counsel/Vendor Management 95%, Technology
  Strategy 91%, Technology Administration 88%, Program/Project
  Management 84%, and Financial Management 80%; Business Intelligence
  65%. Text: "At least 50% of departments have 12 of the 15 services
  listed below within their legal operations team's responsibilities."
  [PDF](https://cloc.org/wp-content/uploads/2025/02/2025-CLOC-2025-SOTI-Report.pdf);
  [release](https://cloc.org/newsdesk/2025-state-of-the-industry-report/).
  Confirmed (round two; raw PDF text). Cite it explicitly as the 2025
  report, because a members-only 2026 edition exists. It does not show
  who curates knowledge for AI and does not measure headcount.
- Stephen Embry, Above the Law, "Interpreting The 2025 CLOC In-House
  Survey Results" (2025-05-09): "knowledge management went from 71% to
  79%, suggesting AI tools and data may enable legal ops professionals
  to play a greater role here."
  [abovethelaw.com](https://abovethelaw.com/2025/05/interpreting-the-2025-cloc-in-house-survey-results/).
  The sentence is confirmed; the 71% is unverified because the 2024
  report PDF is not publicly reachable. Recommended handling: use the
  79% alone.
- Inside Practice, "AI x KM: New York" (event 2026-04-29; organizer's
  event page): "Artificial intelligence is no longer the bottleneck for
  law firms. Knowledge is." Speakers include knowledge and innovation
  leaders from DLA Piper, Paul Hastings, McDermott Will & Schulte,
  Fried Frank, McGuireWoods, and Stradley Ronon.
  [insidepractice.com](https://www.insidepractice.com/ai-x-km-2026).
  Confirmed; seen verbatim. Event-organizer copy.
- Oz Benamram (byline "Oz Benamram, Skills"), Artificial Lawyer
  Predictions 2026 (2026-01-08): "Clean, structured, context-rich KM
  (precedents, outcomes, expertise signals) becomes decisive," under
  the heading "Knowledge as a competitive weapon." The same piece
  carries Winston Weinberg (Harvey), "In 2026, context wins," and Ed
  Walters (Clio), "Out: Prompt engineering. In: Context engineering."
  [artificiallawyer.com](https://www.artificiallawyer.com/2026/01/08/artificial-lawyer-predictions-2026/).
  Confirmed; all seen verbatim. The phrase "exposes poor KM" appears in
  the research notes only and is **TBD — confirm**; paraphrase it.
- 2026 SKILLS Legal AI Survey, question-and-answer piece with Benamram
  on the Harvey blog (2026-03-13; responses from 130 of the world's
  largest law firms): the "Consider" numbers for two knowledge layer
  tools "are among the highest in the survey, indicating that firms
  have identified the knowledge management layer as the next
  priority"; "Figuring out RAG infrastructure and data governance will
  be key to AI's long-term success"; "AI amplifies the cost of
  fragmentation."
  [harvey.ai](https://www.harvey.ai/blog/2026-skills-legal-ai-survey-oz-benamram-interview).
  Corrected (the date is 2026-03-13; 2026-03-06 belongs to a companion
  post); quotations seen verbatim. Vendor-hosted; name the host. The
  SKILLS dashboard itself was not read.
- ILTACON 2025 knowledge management roundtable, reported by Artificial
  Lawyer on 2025-08-13 from Draftwise's notes (14 named speakers from
  firms and vendors): "KM professionals are shifting from maintaining
  knowledge bases to orchestrating AI workflows and ensuring data
  quality"; firm knowledge is "scattered across OneDrive, SharePoint,
  Teams, and personal folders."
  [artificiallawyer.com](https://www.artificiallawyer.com/2025/08/13/iltacon-day-two-ai-km-the-hour-human-capital/).
  Confirmed; seen verbatim. Second-hand reporting of a vendor's notes.
- Harbor, "ILTACON 2026: Why AI Usage Isn't the Same as AI Value"
  (Justin Farmer, Practice Group Leader, Enterprise Solutions;
  2026-09-11). Verbatim, raw text: "A recurring theme across ILTACON's
  marketing technology and knowledge management sessions was that
  clean, connected data is the precondition for AI producing anything
  useful"; "point it at a broken one and it will still return a
  confident answer, just a wrong one"; "govern only the data behind a
  specific, recurring deliverable, such as a report produced regularly
  or a request fielded constantly, and expand from there"; "A recurring
  frustration raised in roundtable discussions was fragmented ownership
  of AI security and governance decisions across IT, Risk, the General
  Counsel's office, and knowledge management"; "Governance needs a
  clear owner and a defined, visible conversation." The page also
  summarizes Harbor's own report in a sentence on the share of
  participating firms and in-house departments with a mature framework
  for measuring AI's business impact (the "0%" sentence, which pairs
  the share with a 41% rise in average annual law firm software
  spending from 2021 to 2025). That measurement sentence is not used,
  by the writer's direction of 2026-09-22, who doubts its accuracy
  (Must NOT include); the pointer stays as the record of where the
  claim came from.
  [harborglobal.com](https://harborglobal.com/insights/briefs/iltacon-2026-why-ai-usage-isnt-the-same-as-ai-value/).
  Confirmed (round two; raw text). Consultancy source with undisclosed
  methodology; label it. The conference context is law firms.
- CCBJ, Kristin Calve (Editor), three ILTACON 2026 pieces (2026-08-31).
  "Matter Centricity 2.0: Legal AI Rediscovers the Matter": Calve's own
  narrative sentence, following a quotation from Paul Walker (Global
  Solutions Director, iManage), reads "The bottleneck may not always be
  model quality; it may be record quality." Walker, verbatim: "We're
  right back at taxonomy," "Now it provides context for AI," "It makes
  the AI safe to operate," and, on corporate legal departments, "if
  we're missing parts of the conversation because they never got into
  the matter file." "At ILTACON, Legal AI Confronts 'Good Enough'":
  "What they cannot swap out so readily is what surrounds them: decades
  of documents, matter histories, work product and institutional
  knowledge and a clean answer to who is entitled to see what." "Rented
  Models, Enduring Memory": Josh Baxter (CEO, NetDocuments), "They're
  rented"; "That intelligence, that context, that's going to have a
  place of permanence"; "micro and incomplete DMSs," glossed by Calve
  as "partial representations of institutional knowledge assembled for
  particular applications and potentially governed differently"; the
  Am Law 20 firm with 48 AI applications "that they know of."
  [ccbjournal.com, matter centricity](https://ccbjournal.com/blog/matter-centricity-2-0-legal-ai-rediscovers-the-matter);
  [ccbjournal.com, good enough](https://ccbjournal.com/blog/at-iltacon-legal-ai-confronts-good-enough);
  [ccbjournal.com, rented models](https://ccbjournal.com/blog/rented-models-enduring-memory).
  Confirmed (round two; raw text). The "record quality" sentence is
  Calve's, and the fetch tool misattributed it once. Calve's line on
  enterprise data strategy was not re-located in round two:
  **TBD — confirm** before quoting.
- Tiger Eye, "Legal Knowledge Management Trends for 2026 and Beyond"
  (2025-12-19; consultancy with named practitioner quotations). Tom
  Humberstone (Womble Bond Dickinson): "GenAI is all about high quality
  knowledge to deliver value" and "knowledge repositories have evolved
  beyond traditional, curated know-how to encompass a broader set of
  sources now." Rob Taylor (Tiger Eye): "AI will magnify any data
  issues you may have, and do so at pace, and at scale." Jenni Tellyn
  (3Kites): "you have to work even harder at your knowledge
  management."
  [tigereyeconsulting.com](https://www.tigereyeconsulting.com/legal-knowledge-management-trends-2026/).
  Confirmed; all four seen verbatim. A further Humberstone line on
  security appears only in the notes: **TBD — confirm**.
- Legal IT Insider, "The Vendor View 2026" (2026-01-15). Jean-Remi de
  Maistre, CEO of Jus Mundi: "Firms with the best knowledge management
  will power the best AI skills."
  [legaltechnology.com](https://legaltechnology.com/2026/01/15/the-vendor-view-2026-a-breakthrough-ai-year-and-one-of-reckoning/).
  Confirmed; seen verbatim. His further point on capturing processes,
  prompts, and best practices is a fetch-tool paraphrase:
  **TBD — confirm**. Vendor voice.
- Thomson Reuters legal blog, Marjorie Richter (2026-07-02), a
  publisher's summary of its own research. From the 2026 AI in
  Professional Services Report: "41% of law firms and 47% of corporate
  legal departments say their legal teams are using GenAI, up from 28%
  and 23%, respectively in 2025." From the 2026 Future of Professionals
  Report: 96% demand safeguards for confidential data, 94% demand
  outputs grounded in authoritative content, 90% say AI must produce
  reasoning that can be explained and defended; "78% of corporate
  clients say AI-enabled quality improvements are very important or
  essential, yet only 6% say most of their providers actually deliver
  it."
  [legal.thomsonreuters.com](https://legal.thomsonreuters.com/blog/how-ai-is-transforming-the-legal-profession/).
  Corrected: the figures above are confirmed as 2026 data; the
  emerging-role figures on the same page (39%, 33%, 32%) are 2024 data
  and are not used. Sample sizes for both reports: **TBD — confirm**.
- iManage, Knowledge Work Benchmark Report 2026 (press release
  2026-02-11; 3,185 business and technology decision-makers in 26
  countries across legal, accounting and tax, financial services, and
  asset management; fielded September to October 2025): 85% of firms
  are piloting, implementing, or using AI and 17% have embedded it in
  daily operations; organizations with mature knowledge foundations
  are nearly twice as likely to report year-over-year revenue growth;
  72% plan to invest in a new document or knowledge management platform
  within two years; an average of 37 minutes a day is spent searching
  for information; nearly one-third report a policy-impacting incident
  related to unregulated AI tools; almost 30% have delayed AI adoption
  over security concerns.
  [globenewswire.com](https://www.globenewswire.com/news-release/2026/02/11/3236445/0/en/organizations-with-strong-knowledge-foundations-pull-ahead-on-ai-growth-and-client-trust-new-imanage-study-finds.html).
  Corrected (incidents are "nearly one-third"; "almost 30%" is delayed
  adoption). Vendor research from a document management provider with a
  cross-industry sample; label it in the citing sentence.
- Gartner press release (2025-02-26; cross-industry, not legal):
  "Gartner predicts that through 2026, organizations will abandon 60%
  of AI projects unsupported by AI-ready data"; 63% of organizations
  either do not have or are unsure whether they have the right data
  management practices for AI (survey of 1,203 data management leaders
  in July 2024).
  [gartner.com](https://www.gartner.com/en/newsroom/press-releases/2025-02-26-lack-of-ai-ready-data-puts-ai-projects-at-risk).
  Corrected (the sample is 1,203, not 248). Read through a reader proxy
  because the Gartner site blocks direct access. Present the 60% figure
  as a prediction, once, if at all (`voice/domain-knowledge.md` section
  6). No legal-specific equivalent was found.
- CLOC 2026 State of the Industry Report (press release 2026-03-02; 135
  law departments; produced with Harbor) and the Harbor 2025 Law
  Department Survey release (2025-12-08; the same 135 departments,
  median revenue 13 billion US dollars). CLOC wording: 85% "have
  dedicated AI oversight or resources"; technology strategy is a focus
  for 80%. Neither release mentions knowledge management, which is
  itself useful for argument 5. Oyango Snell's line on legal operations
  as "the strategic lever" is truncated in the notes; the sentence
  continues, so do not quote it as a whole sentence.
  [cloc.org](https://cloc.org/newsdesk/cloc-releases-2026-state-of-the-industry-report-rising-legal-demand-outpaces-budget-and-staffing-growth-forcing-operational-shift/);
  [prweb.com](https://www.prweb.com/releases/harbor-2025-law-department-survey-reveals-surge-in-ai-integration-falling-outside-counsel-spend-302635093.html).
  Confirmed from the press releases; the gated reports were not read.
- Stephen Embry, Above the Law, "Law Firms Are Buying AI: But Are They
  Really Using It?" (2026-08-25), reviewing Harbor's 2026 legal lab.
  Embry's own sentences: "The average spend on technology increased
  41% from 2021 to 2025"; "that spend is now 5% to 6% of overall firm
  revenue"; "without obtaining the methodology and information about
  the data, we have to take them with a grain of salt." He also quotes
  Harbor: "Firms are measuring AI activity more effectively than AI
  impact." Embry presents Harbor's measurement sentence as a quotation
  ("No participating firm in Harbor's 2026 legal lab reported having a
  mature framework for measuring AI's business impact"); that sentence
  is not used in either version, by the writer's direction of
  2026-09-22 (Must NOT include).
  [abovethelaw.com](https://abovethelaw.com/2026/08/law-firms-are-buying-ai-but-are-they-really-using-it/).
  Confirmed (round two; raw HTML). Embry is the skeptical voice of
  argument 1, cited on his own sentences.
- Pillsbury hired Benamram as its first Chief AI Officer (Artificial
  Lawyer, 2026-07-08).
  [artificiallawyer.com](https://www.artificiallawyer.com/2026/07/08/oz-joins-pillsbury-for-top-ai-role/).
  The appointment and date are confirmed. The detail that the role
  oversees both data science and knowledge management appears only in
  the notes: **TBD — confirm**.
- ILTA, "The ILTA Technology Survey: 2026 Executive Summary"
  (2026-09-14; authors Rich Raether of Quarles & Brady, Andrew P.
  Medeiros of Troutman Pepper Locke, and Todd Corham; 508 firms
  representing over 139,000 lawyers and approximately 275,000 total
  users). From the PDF: "Nearly every responding firm (94%) is now
  engaged with GenAI, up 14 points from last year"; "knowledge
  infrastructure remains dramatically underdeveloped across enterprise
  search, expertise management, pricing, procurement, and competitive
  intelligence. The platform migration is largely complete, but the
  governance migration has yet to begin"; "Many firms anticipate
  additional headcount needs across IT, innovation, security, training,
  knowledge management, and data science"; and a respondent quoted as
  saying "The biggest factor won't be GenAI itself; it will be the
  business process discipline, data strategy, and systems integration
  required to use it well." No percentage for knowledge management
  headcount and no data on who leads AI programs.
  [PDF](https://higherlogicdownload.s3.amazonaws.com/ILTANET/ce7f3e74-fb70-402e-a1b3-5dc0abe72260/UploadedImages/Misc%20PDFs/2606_ILTA_Executive_Summary_FINAL__1_.pdf);
  [iltanet.org](https://www.iltanet.org/techsurvey26).
  Usable since the display date moved to 2026-09-15. The 508 figure and
  the 2026-09-14 date are confirmed through eDiscovery Today's report
  of that day (`bi-analytics-stats.verified.md`, section 13); the
  quotations were read from the PDF by the gap-track researcher and not
  second-checked, so they are **TBD — confirm**. Law firms only; say so
  in the citing sentence. Do not cite ILTA's news post (2026-09-15
  path).
- Commentary read but not fact-checked, all from vendors or publishers:
  LexisNexis International, "Why Knowledge Management Is the Real
  Foundation of AI-Powered Legal Drafting" (2026-01-06); ClearPeople,
  "KM trends for 2026" (2025-12-02), with the phrase that knowledge
  "transitions from content to infrastructure"; Harvey, "The
  fundamentals of legal knowledge management" (2026-06-08). Background
  for how the market talks; check each against the rule on competitor
  collateral before citing. **TBD — confirm**.

*B. The AI vocabulary, the technical reasons, and the accuracy evidence
(argument 2 and the context map).*

- Anthropic engineering, "Effective context engineering for AI agents"
  (2025-09-29; Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy
  Hadfield). Verbatim: "Context refers to the set of tokens included
  when sampling from a large-language model (LLM)." "Context
  engineering refers to the set of strategies for curating and
  maintaining the optimal set of tokens (information) during LLM
  inference, including all the other information that may land there
  outside of the prompts." The post contrasts context engineering with
  prompt engineering, introduces "context rot" (recall falls as the
  window fills) and an "attention budget," says few-shot prompting "is
  a well known best practice," and defines tools as the way agents
  "pull in new, additional context as they work."
  [anthropic.com](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
  Confirmed (round two; raw HTML). The dated anchor for context,
  context engineering, system prompts, tools, and few-shot examples.
- Simon Willison, "Context engineering" (2025-06-27), reproducing Tobi
  Lütke, "the art of providing all the context for the task to be
  plausibly solvable by the LLM," and Andrej Karpathy, "the delicate
  art and science of filling the context window with just the right
  information for the next step." Cite Willison's page; the original
  posts were not fetched.
  [simonwillison.net](https://simonwillison.net/2025/Jun/27/context-engineering/).
  Confirmed (round two; raw text).
- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive
  NLP Tasks" (arXiv 2005.11401; v1 2020-05-22; NeurIPS 2020; twelve
  authors led by Patrick Lewis). Abstract: models "which combine
  pre-trained parametric and non-parametric memory for language
  generation." [arxiv.org](https://arxiv.org/abs/2005.11401). Confirmed
  (round two).
- Brown et al., "Language Models are Few-Shot Learners" (arXiv
  2005.14165; v1 2020-05-28). Abstract: "tasks and few-shot
  demonstrations specified purely via text interaction with the
  model." [arxiv.org](https://arxiv.org/abs/2005.14165). Confirmed
  (round two).
- Anthropic, "Introducing Agent Skills" (2025-10-16; the page was
  modified on 2026-06-21 with an update note). Verbatim: "Skills are
  folders that include instructions, scripts, and resources that Claude
  can load when needed." The open standard at agentskills.io (undated)
  is used for wording only. [claude.com](https://claude.com/blog/skills).
  Confirmed (round two). "Organizational expertise" is a paraphrase and
  not the page's wording.
- Anthropic's legal plugin for Claude Cowork. LawSites (Bob Ambrogi,
  2026-02-03) reports that the plugins were added on 2026-01-30. The
  product page says the plugin is "configurable to your organization's
  playbook," set "in a local settings file to define standard
  positions, acceptable ranges, and escalation triggers" (re-verified
  in round two). Ambrogi describes the incumbents' defense as the
  combination of proprietary datasets and subject-matter expertise.
  Legal.io (2026-03-06) reports that on 2026-02-03 Thomson Reuters fell
  as much as 18% during the session, RELX 14%, and Wolters Kluwer 13%.
  [claude.com](https://claude.com/plugins/legal);
  [lawnext.com](https://www.lawnext.com/2026/02/anthropics-legal-plugin-for-claude-cowork-may-be-the-opening-salvo-in-a-competition-between-foundation-models-and-legal-tech-incumbents.html).
  Corrected (release 2026-01-30; market reaction 2026-02-03; the 18% is
  intraday). Name the product neutrally.
- Microsoft Learn, "Semantic indexing for Microsoft Copilot" (ms.date
  2026-04-23; updated 2026-08-18). Verbatim: "Semantic indexing
  provides the grounding data for knowledge retrieval via Microsoft
  Copilot by understanding the intent of your query and appending
  additional information to your Microsoft Copilot prompt." "A vector
  is a numerical representation of a word, image pixel, or other data
  point." Semantically similar data points "are clustered together in
  the vector space."
  [learn.microsoft.com](https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot).
  Confirmed (round two; raw text). The page uses "grounding" without a
  one-sentence definition; the article defines the term in its own
  words and cites this page for the mechanism.
- Microsoft Learn, "How does Microsoft Copilot work?" (ms.date
  2026-09-14; no last-update stamp recorded). As recorded by the
  round-two researcher: "Grounding improves the specificity of your
  prompt, and helps you get answers that are relevant and actionable to
  your specific task." A statement of effect and not a definition.
  [learn.microsoft.com](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-architecture).
  **TBD — confirm** (inside the window since 2026-09-22; the update
  stamp and the quotation need a check). Optional; the semantic index
  page already carries the mechanism.
- Microsoft Learn, Azure AI Search, "Chunk documents" (ms.date
  2026-06-08; updated 2026-08-31). Verbatim: "Partitioning large
  documents into smaller chunks can help you stay under the maximum
  token input limits of chat completion and embedding models." The
  page recommends starting with "a chunk size of 512 tokens
  (approximately 2,000 characters) and an initial overlap of 25%."
  [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents).
  Confirmed (round two; raw text). The inference that chunking is where
  document-level metadata is lost unless carried with each chunk is the
  article's own.
- Stanford RegLab and HAI, "Hallucination-Free? Assessing the
  Reliability of Leading AI Legal Research Tools" (Magesh, Surani,
  Dahl, Suzgun, Manning, Ho). Peer-reviewed: Journal of Empirical Legal
  Studies, volume 22, issue 2, pages 216 to 242 (online 2025-04-23;
  print June 2025). Preprint: arXiv 2405.20362 (2024-05-30). The tools
  from LexisNexis and Thomson Reuters "each hallucinate between 17% and
  33% of the time." Tested Lexis+ AI, Westlaw AI-Assisted Research, and
  Ask Practical Law AI, all retrieval-based.
  [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1111/jels.12413);
  [Stanford PDF](https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf);
  [arxiv.org](https://arxiv.org/abs/2405.20362). Confirmed (journal
  record through Crossref and the Stanford PDF in round two; arXiv
  abstract in round one). Cite the journal version.
- Rebecca Fordon, AI Law Librarians (2026-02-19), a review of the
  literature: legal platforms perform better because they search
  "curated, verified legal databases with citators," and still "roughly
  one in five responses contains errors, even from top-tier specialized
  legal tools." The 58% to 88% range she cites comes from the separate
  "Large Legal Fictions" study of 2023 general-purpose models, and "one
  in five" is her reading of Vals accuracy scores of 78% to 81%.
  [ailawlibrarians.com](https://www.ailawlibrarians.com/2026/02/19/what-the-science-says-about-hallucinations-in-legal-research/).
  Confirmed; seen verbatim.
- Vals Legal AI Report (2025-02-27): "The Consortium Firms together
  created the dataset used for the study." Reed Smith, Fisher Phillips,
  McDermott Will & Emery, Ogletree Deakins, and four anonymous firms
  supplied over 500 samples (questions, reference documents, ideal
  responses, and correctness criteria).
  [vals.ai](https://www.vals.ai/industry-reports/vlair-2-27-25).
  Confirmed; seen verbatim. The October 2025 Vals legal research report
  is a lead and not a source.
- LexisNexis, Serena Wellen (Vice President of Product Management),
  "How Lexis+ AI Delivers Trustworthy Linked Legal Citations"
  (2024-05-03). Verbatim: "RAG is a technique for enhancing the
  accuracy and reliability of Gen AI models with facts fetched from
  authoritative sources." Describes "the proprietary RAG platform we
  have built at LexisNexis."
  [lexisnexis.com](https://www.lexisnexis.com/community/insights/legal/b/product-features/posts/how-lexis-ai-delivers-hallucination-free-linked-legal-citations).
  Confirmed (round two). A vendor's statement of its own architecture.
  No dated Thomson Reuters equivalent was located.
- OpenAI, "Customizing models for legal professionals" (2024-04-02), a
  vendor case study on Harvey. Verbatim: Harvey "tried the obvious
  techniques first: fine-tuning foundation models via public APIs and
  building retrieval-augmented generation (RAG) systems. But they ran
  into limitations"; "Recently, Harvey partnered with OpenAI to create
  a custom-trained case law model"; "the equivalent of 10 billion
  tokens worth of data," starting with Delaware case law; lawyers
  preferred its output "97% of the time." The page says
  "custom-trained," not "fine-tuned."
  [openai.com](https://openai.com/index/harvey/). Corrected (round
  two): the facts hold; the claim that it is the only such case is the
  researcher's framing and is not used.
- Gal Bakal, "Knowledge Activation: AI Skills as the Institutional
  Knowledge Primitive for Agentic Software Development" (arXiv
  2603.14805, submitted 2026-03-16). A software engineering preprint.
  [arxiv.org](https://arxiv.org/abs/2603.14805). **TBD — confirm** (not
  fact-checked; not a legal source). Optional.
- CLOC Global Institute 2026 (2026-05-11 to 2026-05-14) case study from
  Uber's legal operations team (Alexander Shusterman, Staff Technical
  Program Manager, CLO AI; Carolyn Wakulchik, Manager, CLO Operations),
  whose session description refers to "training the model on our
  curated legal knowledge base to ensure relevance and verifiable
  accuracy." [globalinstitute.cloc.org](https://globalinstitute.cloc.org/full-program/).
  **TBD — confirm** (re-read from the agenda feed by the round-two
  researcher; the fact-checker's second check covered only the
  JPMorganChase and Guggenheim session).
- Fine-tuning: the research found no 2025 or 2026 source describing a
  legal department or firm fine-tuning a model on its own knowledge as
  a mainstream practice. Absence of evidence, worded that way.

*C. New sources of knowledge and the change in purpose (argument 3).*

- Humberstone, Benamram, and the ILTACON 2025 roundtable (group A) for
  the widening of the repository. Confirmed.
- CCBJ, "Rented Models, Enduring Memory" (group A) for "micro and
  incomplete DMSs." Confirmed (round two).
- Microsoft Learn chunking page (group B) for the technical root of the
  new curation criteria. Confirmed (round two).
- Mayer Brown, "AI Notetakers: Productivity Tool or Emerging Legal
  Risk?" (client alert, 2026-06-03): transcripts create records that
  "may be accessed by individuals who were not present" and widen legal
  hold scope and discovery cost.
  [mayerbrown.com](https://www.mayerbrown.com/en/insights/publications/2026/06/ai-notetakers-productivity-tool-or-emerging-legal-risk).
  Confirmed.
- Negotiation and redline history: only vendor marketing was located
  (products that convert prior redlines into playbooks), and it may not
  be cited as evidence. The writer confirmed on 2026-09-22 that no
  practitioner example is available, so the point is the article's
  own, presented as discussion.
- Expert corrections of AI output: one vendor press release (Checkbox,
  2026-05-11; recorded in `changing-role-of-legal-ops.md`) describes
  attorney corrections feeding future answers. Vendor collateral and
  unverified; a lead only: **TBD — confirm**.
- Billing narratives, decision logs and approvals, outside counsel work
  product, and intake requests and answers: no neutral, citable source
  describes any of these being managed as a knowledge asset. The
  article's own argument, presented as discussion.

*D. The frameworks (argument 4).*

- CLOC Core 12, Knowledge Management: "Implement processes and
  standards to collect, structure, and organize knowledge to save time
  and improve outcomes."
  [cloc.org](https://cloc.org/cloc-core-12/knowledge-management/).
  Confirmed; seen verbatim; the page has no mention of AI.
- Across all twelve Core 12 function texts, AI is mentioned once, in
  the Technology function; the Core 12 was last revised substantively
  on 2020-04-07; the knowledge management page's "67% developing"
  figure names no survey edition and is not used. **TBD — confirm**
  (gap track `gap-association-definitions-of-legal-ops.md`; not
  second-checked).
- ACC Legal Operations Maturity Model 2.0, Knowledge Management (PDF
  pages 22 to 23): the definition quoted in Must include; early stage,
  "may be getting advice on same topic repeatedly; no effort to
  consolidate legal work product so it can be repurposed"; advanced
  stage, "Mechanisms and tools for curation" and "At least one
  full-time dedicated KM professional," one of 13 advanced-stage
  bullets. The knowledge management function does not mention AI;
  other functions in the same document do.
  [acc.com](https://www.acc.com/sites/default/files/program-materials/upload/Legal-Opertaitons-Maturity-Model-2.0---ACC.pdf).
  Confirmed; seen verbatim. Avoid "requires only one." The publication
  year (2020, from PDF metadata created 2020-09-29) is **TBD — confirm**.
- LegalOps.com (the organization behind RLLB) lists Knowledge
  Management among the 15 practice areas in its reference model; the
  per-area definitions are members-only, and the page carries no date.
  LawVision (Susan Raridon Lambreth, 2023-10-30) reports that the model
  was unveiled at the first RLLB in October 2023, which the fact-checker
  confirmed (`legalops-org-rllb.verified.md`).
  [legalops.com](https://www.legalops.com/reference-modal);
  [lawvision.com](https://lawvision.com/the-inaugural-rllb/). The
  October 2023 unveiling is confirmed; the listing of Knowledge
  Management among the 15 areas is **TBD — confirm** (gap track).
- CLOC, "CLOC Launches 'AI Intensive' Practitioner-Led AI Training for
  Legal Operations" (PRWeb, dateline San Jose, 2026-08-19): "created
  and led by legal operations practitioners to help teams move beyond
  AI experimentation into full enterprise deployment"; inaugural
  in-person event on 2026-10-27 at Eversheds Sutherland in New York
  City, "approximately 40 participants," covering "real-time prompting
  exercises, workflow and agent design, and implementation planning."
  Oyango Snell (President and CEO): "The organizations that win will be
  the ones that move past pilot programs and build real operational
  capability." The release mentions an online hub with "governance
  templates, benchmarking reports" and "Core 12 competency pathways and
  certification curriculum." The string "knowledge management" appears
  zero times.
  [prweb.com](https://www.prweb.com/releases/cloc-launches-ai-intensive-practitioner-led-ai-training-for-legal-operations-302854864.html).
  Confirmed (round two). The source for the closing sentence of
  argument 4, in place of the held-out certification release of
  2026-09-16.

*E. In-house specifics and the curator case (argument 5).*

- CLOC 2025 State of the Industry Report, page 12 (group A): 79%.
  Confirmed (round two). Cite as the 2025 report.
- CLOC 2025 State of the Industry Report, page 11, "Legal Operations
  Headcount": "The size of legal operations teams has remained
  unchanged since 2023, with a median function size of 5 FTEs." Median
  function size by company revenue: 2 FTEs (below 3 billion dollars), 4
  FTEs (3 to 15 billion), 7 FTEs (15 to 40 billion), 10 FTEs (above 40
  billion). Confirmed (round two; raw PDF text). Do not cite the
  "second table" of 2, 3, 6, and 8; the fact-checker could not find it.
  Cite the 2025 report, because the claim that the 2026 report repeats
  the 5 FTE median is unverified.
- Thomson Reuters Institute, "2025 Legal Department Operations Index"
  (survey conducted July 2025; 128 responses from legal departments):
  "A large portion (82%) of respondents indicate their legal department
  has at least one dedicated legal ops role on their team." "45% of
  respondents classify themselves as 'General Counsel tasked to run
  legal operations'." Knowledge management software is among the
  solutions ranked as under-utilized compared to valuable. No knowledge
  management staffing figure.
  [thomsonreuters.com](https://www.thomsonreuters.com/en-us/posts/wp-content/uploads/sites/20/2025/09/Legal-Department-Operations-Index-2025.pdf).
  Confirmed (round two; raw PDF text). A second data point that the
  responsibility exists and the tools are under-used, which is a
  curation problem.
- No source was found in which CLOC, ACC, or any other body assigns
  legal operations the role of curating the department's knowledge for
  AI. Two research tracks reached this conclusion independently
  (`knowledge-management-and-ai.md` and `changing-role-of-legal-ops.md`).
- Legal.io (2026-03-06): "For legal operations professionals, the
  near-term priority is governance rather than product evaluation."
  [legal.io](https://www.legal.io/blog/5798487/Anthropic-s-Claude-Legal-Plugin-One-Month-On-the-Market-Fallout-and-What-It-Means-for-Legal-Teams).
  Confirmed as part of a corrected finding. The "Verification Tax"
  phrase from the same article is in the notes only: **TBD — confirm**.
- Deloitte US CLO Program, "2026 Predictions for Chief Legal Officers"
  (PDF; copyright 2026, publication date not shown): predicts that
  chief legal officers will pursue centralized data repositories and
  that roles such as project managers, data scientists, and technology
  specialists will become more common.
  [deloitte.com](https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/programs/2026/us-2026-predictions-for-chief-legal-officers.pdf).
  The text is confirmed (PDF read directly). The publication date is
  **TBD — confirm**, and the source is usable only if that date falls
  on or before 2026-09-14; the writer's fallback of citing it by
  copyright year applies to article 1 and is recorded there. Optional
  for this piece.
- CLOC Global Institute 2026 (Chicago, 2026-05-11 to 2026-05-14),
  session SESS-159 in the Sessionboard feed behind the public agenda
  (record updated 2026-04-27): Tuesday 2026-05-12, 2:15 to 3:00 PM,
  room W178; track "AI Training, Implementation & Governance"; tags
  Knowledge Management and Technology; CLOC Core 12 mapping Business
  Intelligence, Knowledge Management, Strategic Planning, Technology.
  Speakers as listed: Jamal Brown (Head of Legal Operations, Guggenheim
  Investments; his bio in the same record says JPMorgan Chase), Sadie
  Khodorkovsky (Managing Director eDiscovery Legal Operations and
  Knowledge Management, JPMorganChase), Leslie Jordan (Knowledge
  Management Librarian, JPMorganChase), Jen Hugo (Vice President of
  Legal Operations, JPMorganChase). Description, verbatim: "Currently,
  legal operations struggle with fragmented information and missed
  collaboration opportunities." The CLOC Academy knowledge management
  workshop at the same event (Ben Clemson, AustralianSuper) never
  mentions AI.
  [globalinstitute.cloc.org](https://globalinstitute.cloc.org/full-program/).
  Corrected (round two; raw JSON feed): the tags are Knowledge
  Management and Technology. Describe the session in the piece's own
  words and do not quote its title. Jamal Brown's employer is
  **TBD — confirm**.
- Law360 Pulse, Anna Scott Farrell (2026-06-08), on legal engineer
  roles inside in-house legal operations teams. Mary O'Carroll: "With
  these roles that are new and not well understood, it's even more
  challenging to get that headcount and get it approved." A second
  quotation in the notes belongs to Elly Meenan, founder of The Legal
  Ops Job Board.
  [law360.com](https://www.law360.com/pulse/articles/2487125/ai-boom-gives-rise-to-in-house-legal-engineers).
  Corrected (speaker attribution). Useful for who does the curation
  work.
- Harbor's ILTACON 2026 brief (group A) for the fragmented-ownership
  observation and the "clear owner" conclusion, used as an analogy with
  its law firm scope stated. Confirmed (round two).
- In-House Connect CLE program, "Modernizing Legal Knowledge
  Management: AI Strategies for In-House Efficiency" (21 January, year
  not shown; vendor-sponsored). **TBD — confirm**; low value.

*F. Risks (argument 6).*

- United States v. Heppner, No. 25 Cr. 503 (JSR) (S.D.N.Y.). Bench
  ruling 2026-02-10; written memorandum filed 2026-02-17 (ECF No. 27).
  The sentence to quote begins "Because Claude is not an attorney" and,
  after a record citation, continues "that alone disposes of Heppner's
  claim of privilege." Read the full sentence in the filing before
  quoting it, and cite the memorandum.
  [courtlistener.com](https://www.courtlistener.com/docket/71872024/27/united-states-v-heppner/);
  [harvardlawreview.org](https://harvardlawreview.org/blog/2026/03/united-states-v-heppner/).
  Corrected (quote source).
- Debevoise (2026-02-11), practical takeaways from the bench ruling:
  use enterprise tools with confidentiality terms, document that work
  is done at counsel's direction, and improve privilege logs.
  [debevoisedatablog.com](https://www.debevoisedatablog.com/2026/02/11/district-court-rules-ai-generated-documents-are-not-protected-by-privilege/).
  Part of a corrected finding; check the wording before use.
- OWASP Gen AI Security Project, "LLM08:2025 Vector and Embedding
  Weaknesses" (OWASP Top 10 for LLM Applications 2025; list released
  2024-11-17; page modified 2025-04-28). Verbatim: "Inadequate or
  misaligned access controls can lead to unauthorized access to
  embeddings containing sensitive information." "Implement
  fine-grained access controls and permission-aware vector and
  embedding stores." Mitigation: "strict logical and access
  partitioning of datasets in the vector database." Scenario:
  embeddings from one group "might be inadvertently retrieved in
  response to queries from another group's LLM, potentially leaking
  sensitive business information."
  [genai.owasp.org](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/).
  Confirmed (round two). Cite the resolved address; the old URL
  redirects. The standards-body source that replaces the Hintyr vendor
  blog. It does not use the phrase "strip away the permission
  metadata."
- Microsoft Learn, "Semantic indexing for Microsoft Copilot" (ms.date
  2026-04-23; updated 2026-08-18). Verbatim: "When data is indexed, we
  continue to honor the user identity-based access boundary so that the
  grounding process only accesses content that the current user is
  authorized to access." "Semantic indexing works only with content to
  which your users already have permission." "Sensitivity labels are
  also included in search trimming." "indexing data doesn't change
  access permissions to content."
  [learn.microsoft.com](https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot).
  Confirmed (round two; raw text).
- Microsoft Learn, Microsoft Graph, "Create, update, and delete items in
  a Microsoft Graph connection" (ms.date 2024-11-07; updated
  2025-08-06; the page now calls them Microsoft 365 Copilot
  connectors). Verbatim: "The access control list (ACL) is used to
  specify whether the given roles are granted or denied access to view
  items in Microsoft experiences." "The accessType value deny takes
  precedence over grant." For non-directory groups: "you can create
  external groups in Microsoft Graph by using the group sync APIs to
  replicate the allow or deny permissions."
  [learn.microsoft.com](https://learn.microsoft.com/en-us/graph/connecting-external-content-manage-items).
  Confirmed (round two; raw text).
- Microsoft Learn, "Security for Microsoft Copilot" (ms.date
  2026-08-17; updated 2026-08-18). Verbatim: "Microsoft Copilot
  operates within existing permissions and access controls. Overshared
  or poorly governed content can affect Copilot results and increase
  risk." "Copilot only accesses data that users are authorized to
  access."
  [learn.microsoft.com](https://learn.microsoft.com/en-us/microsoft-365/copilot/security-microsoft-365-copilot).
  Confirmed (round two; raw text).
- RoyChowdhury, Luo, Sahu, Banerjee, Tiwari (University of Texas at
  Austin), "ConfusedPilot: Confused Deputy Risks in RAG-based LLMs"
  (arXiv 2408.04870; v1 2024-08-09; v5 2024-10-23). The abstract
  describes a vulnerability that leaks secret data through the caching
  mechanism used during retrieval, with Copilot for Microsoft 365 as
  the studied setting. [arxiv.org](https://arxiv.org/abs/2408.04870).
  Confirmed (round two; author list checked on the arXiv PDF).
  Optional; paraphrase the abstract, because its own wording contains
  a word on the house list.
- Hintyr (vendor blog, 2026-03-27). Superseded; not cited. Use OWASP
  and Microsoft Learn instead.
- Tiger Eye (group A) for the Tellyn line on need-to-know access.
  Confirmed.
- Stale content and provenance: the LexisNexis interviewee quotation
  on updating precedents and the ClearPeople line that "Provenance and
  auditability become operational requirements" were not fact-checked.
  **TBD — confirm**. Both points are made as discussion without them.
- Meeting transcripts and retention: Mayer Brown (group C). Confirmed.
- Unregulated tools: iManage benchmark (group A), labelled as vendor
  research. Corrected.
- For awareness only: on 2026-05-14 NetDocuments announced a "legal
  context graph," and iManage announced a comparable "context fabric"
  the same month, both scoped to document management content. Article
  3 carries this material.

*G. What the research did not find.*

- A legal-specific statistic for the share of AI projects held back by
  poor knowledge or data quality (Gartner's cross-industry prediction
  is the nearest item).
- An in-house knowledge management headcount or budget benchmark. The
  round-two search covered ACC, CLOC, Thomson Reuters, Blickstein, and
  the ACC and Major, Lindsey & Africa benchmarking release, and found
  nothing dated on or before 2026-09-14. The ILTA 2026 survey speaks to
  law firm headcount plans without a percentage.
- Survey evidence that legal operations owns knowledge curation for AI
  (the CLOC 2025 figure shows only that knowledge management sits
  within the function's responsibilities).
- Data on who owns AI oversight inside corporate legal departments (the
  Harbor observation describes law firm roundtables).
- A dated, neutral one-sentence definition of grounding that passes the
  display date; the piece defines the term in its own words.
- Dated versions of the OpenAI and Anthropic developer documentation
  pages; the dated anchors are Lewis 2020, Brown 2020, and the
  Anthropic engineering post of 2025-09-29.
- A dated Thomson Reuters statement that CoCounsel or Westlaw
  AI-Assisted Research is retrieval-based.
- The 71% prior-year knowledge management figure in the CLOC 2024
  report, and whether the 2026 edition carries a knowledge management
  figure.
- ILTACON 2026 knowledge management session titles and speakers; any
  ACC 2026 Annual Meeting content; Jamal Brown's current employer.

Companion pieces (not written here): a LinkedIn syndication on the
company page (`the-newfound-importance-of-knowledge-management-syndication`,
push week 5 of the campaign) and a founder post two days later. A
further LinkedIn post aimed at in-house knowledge professionals and the
law firm knowledge community (ILTA's knowledge management community,
Inside Practice, SKILLS) is a reasonable derivative and is tracked in
the campaign file if the writer wants it. All follow the revised voice.

# Voice notes

- **Register.** The series voice decision applies: a strategy-consulting
  register in the manner of McKinsey Quarterly and Harvard Business
  Review, business-like without being stiff, per the revised
  `voice/style-guide.md`. The draft uses no em dashes and none of the
  constructions in `voice/examples/ai-tells.md`. Match the opening, the
  evidence paragraphs, the transitions, and the close against the model
  passages in `voice/examples/consulting-register.md` section 6, and do
  not pattern-match against the published library, which predates the
  revised guide. Run `node scripts/voice-lint.mjs <draft>` (or
  `npm run voice:lint -- <draft>`) before every review; 0 errors are
  required, every warning is read, and the lint's count of open TBD
  markers must reach zero before publication.
- **Audience.** The primary reader is the legal operations director,
  who runs the systems where the new sources are created and who in
  most departments already counts knowledge management among the
  function's responsibilities. The general counsel is the secondary
  reader, who answers for accuracy, privilege, and confidentiality and
  who decides whether curation gets an owner and a budget. The legal
  technology leader is the sanity check on grounding, permissions, and
  retention. All three are experienced, so the piece explains no basics
  of knowledge management, matter management, or e-billing. The AI
  terms in the context map are the vocabulary they may not use daily,
  and each gets one plain sentence.
- **Evidence standard.** A discussion piece by a practitioner, and
  readers understand that. Use the research library where it has a
  confirmed or corrected finding; where a point has no citation,
  present it as discussion rather than as a sourced fact. Attribute
  every statistic in the sentence that carries it, report survey
  results as what respondents said, interpret the number, and state
  each law firm source's scope in the citing sentence. Where a
  quotation cannot be confirmed on the live page at the polish gate,
  drop the quotation marks and state the point generically, without
  attribution (writer, 2026-09-22). Apply copyright limits: reuse terms
  where allowed and omit content where prohibited.
- **Opening shape.** Vary it from the ontology article, which opens on
  a scene. The situation is the established practice (the 79% figure);
  the complication is the changed reader; the answer is the thesis
  sentence from the Angle, by the third paragraph. The two-figure
  tension of `consulting-register.md` section 6.2 is the suggested
  alternative if the established-practice opening runs long.
- **Vocabulary.** Write "knowledge management" in the prose and allow
  "KM" only inside quotations. Write "institutional knowledge," never
  "tribal knowledge." "Operational memory" is Spaarke's term for the
  layer and appears once, where the Legal IQ stack is invoked. Keep one
  term for one thing: "corpus" for the curated body of material that
  grounds answers, "playbook" for the instruction asset, "evaluation
  set" for the test asset, "curation" for the work of maintaining all
  three. "Training" is defined in a sentence on first use as the sense
  legal AI systems use (grounding, instruction, example, and
  evaluation), and the piece never suggests fine-tuning. "Context" is
  used in the AI sense defined from the Anthropic post and, after that
  definition, as the organizing concept. Write "legal professionals" or
  "the legal team" for shared operational work and "lawyers" or
  "counsel" where the act is attorney-only, such as judging the quality
  of legal knowledge or asserting privilege. Write "outside counsel,"
  never "external counsel," and "e-billing platform."
- **Headings** are sentence-case statements. Candidate H2 set for the
  plan (merge where two need only a paragraph): *Legal departments have
  managed knowledge for years, and the reader of that knowledge has
  changed*; *The constraint on legal AI has moved from the model to the
  knowledge*; *Context is what a department supplies*; *Four mechanisms
  make a model specific to a department* (with H3s: *Grounding consumes
  the corpus*; *Instruction consumes the playbook*; *Examples consume
  the department's best work*; *Evaluation consumes approved answers*);
  *Curated retrieval still leaves roughly one answer in five wrong*;
  *What counts as knowledge has widened past finished work product*;
  *The work is capture and codification, and the destination is the
  ontology*; *Knowledge now trains the systems that produce the work
  product*; *A document that grounds an answer needs an author, a date,
  a status, and permissions*; *The frameworks that define the function
  have not caught up*; *Legal operations already holds the
  responsibility*; *Curation includes deciding what AI must not see*;
  *Knowledge management supplies the context, and the ontology gives it
  structure*; *A department can start with one recurring deliverable*.
- **Exhibits.** Exhibit 1 is the context map table, Exhibit 2 is the
  curation loop diagram, and both titles state the finding as a full
  sentence. The text refers to each in parentheses at the end of the
  sentence that states the finding and never says that a table or
  chart "below" shows something. Both are abstract and in the
  visual-identity palette, and neither is a product screenshot.
- **Vendors.** Microsoft, Anthropic, OpenAI, LexisNexis, Thomson
  Reuters, Harvey, Clio, iManage, NetDocuments, and Jus Mundi may be
  named for what their pages and executives said before the display
  date, with the date and the source, and only where the mention adds
  substantive value. A vendor's own publication is checked against
  `voice/domain-knowledge.md` section 6 before it serves as evidence of
  anything beyond what that vendor said.
- **Close and contact line.** The close ends on consequence, on
  practice (what the director can do in the next quarter) and on what
  grows if nothing is done. The series-navigation block follows, then
  the closing contact line in italics after a horizontal rule
  (`voice/bylines.md` section 6). No demo call to action, no contact
  form, and no offer.

# Hero graphic

**Concept** (SVG-via-Claude, the default per `voice/visual-identity.md`
section 6):

A fan of thin translucent planes narrowing into a single small
aperture. Seven to nine tall, thin rectangles in `#3D3B72` with `#4060DC`
strokes stand in a loose fan on the left half of the frame, each
slightly rotated so that they read as pages or records seen edge-on,
with their lower edges shaded toward `#26244E`. Hairline threads in
`#A8C2FF` at 80% opacity run from the top edge of each plane toward a
single small square aperture in Spaarke Blue `#000BFF`. The aperture
sits just left of center on the vertical midline, so that the threads
converge as they approach it. It is the only hot color note and stands
for the context window: everything the department keeps competes for
one finite opening. A soft `#7B5BFF` halo at 26% opacity sits behind
the aperture. One plane, third from the front, is drawn in `#4D4890`
with a `#7B5BFF` stroke, the curated item among the many. The
background is a radial gradient from `#34325E` through `#23224A` to
`#161630`, centered 50%/55%. Generous negative space fills the right
third so that the title reads cleanly, and the focal aperture stays in
the center band to survive the 21:9 crop.

**Prompt** (paste-ready if a raster generator is used instead):

Minimalist geometric vector illustration, deep navy radial background
(#34325E center fading to #161630 edge). A loose fan of seven to nine
tall thin translucent rectangles in muted mid-navy on the left half of
the frame, seen edge-on like records in a file, with fine light-blue
hairlines (#A8C2FF) running from each one and converging on a single
small electric-blue square (#000BFF) just left of center. One of the
rectangles is lifted to a brighter navy with a soft purple stroke. Soft
purple glow (#7B5BFF, 26% opacity) behind the square. 16:9 horizontal
frame, generous negative space on the right third, flat 2.5D, editorial
illustration in the McKinsey Quarterly / Harvard Business Review house
style. No text, no people, no logos, no folders, no documents with
visible writing, no glowing brain, no neural-network mesh, no HUD
panels, no streaming data particles, no circuit-board diagonals.

- **Style preset**: minimalist geometric fan of planes, deep-navy
  canvas, `#A8C2FF` hairlines converging on a single Spaarke Blue
  aperture, soft purple halo.
- **Aspect ratio**: 16:9 (the default, which matches
  `ArticleHeader.tsx`); the focal aperture sits in the center band.
- **Output path**:
  `public/articles/the-newfound-importance-of-knowledge-management/hero.svg`
  (1600 by 900 viewBox).
- **Alt text**: A fan of thin translucent navy planes on a deep navy
  field, with fine light-blue threads running from each plane and
  converging on a single small electric-blue square, suggesting a
  department's knowledge narrowing into the context an AI system can
  see.
- **Generator notes**: SVG-via-Claude. Keep the plane count at nine or
  fewer so that the silhouette reads from across the room, and keep the
  threads to one per plane, because the temptation with a convergence
  motif is a starburst. It is a sibling of the `institutional-knowledge`
  hero from the 2026-05 regeneration batch (same canvas recipe) and of
  the `legal-operations-ontology` hero (same hairline accent),
  differentiated by the fan of planes and the single aperture. Produce
  it in the polish step after the draft is approved.

---

## Unresolved (resolve before drafting unless marked otherwise)

Schedule dates in this list are the real calendar, and they are exempt
from the display-date rule that governs the rest of the brief.

- [x] **Display date and series position**: settled by the writer on
  2026-09-21 and re-dated on 2026-09-22. Article 5 of 5, display date
  2026-09-15 (a Tuesday); frontmatter `date` carries the display date
  and `posted` carries the real publish date, which the campaign's
  distribution sequence sets (push week 5, Tuesday).
- [x] **Primary audience**: `legal-ops-director`, with
  `corporate-counsel` secondary and `legal-tech-cio` as the sanity
  check (the series audience decision, applied to this piece in
  `idea.md`).
- [x] **Length and format**: long-form article, `length_target: open`,
  with no word limit.
- [x] **Byline and contact line**: organizational byline
  (`byline: spaarke`, `author: "Spaarke Team"`); the closing contact
  line names Ralph Schroeder, Founder and CEO, with the email address
  and the website confirmed on 2026-09-22 and the approved wording in
  `voice/bylines.md` section 6.
- [x] **Campaign**: `2026-06-legal-operations-intelligence`, the one
  series campaign file, with GitHub milestone "2026-06 Legal
  Operations Intelligence" (number 5). `content-pipeline` creates the
  Issue and assigns the milestone from this field.
- [x] **Argument / take**: the eight arguments in `idea.md` rev. 4,
  reworded here as the thesis and the six beliefs in §Angle (the
  sixth, on capture, codification, and the ontology as the
  destination, added from the writer's feedback of 2026-09-22, which
  also removed the "We argue that" framing from the thesis). Context
  is the organizing concept, "training" is used in the sense legal AI
  systems use it, and the curator role is stated and then limited.
- [x] **Positioning**: Spaarke provides both system of record
  capabilities and ontology architecture over the systems a department
  already runs, and the piece supports both modes where it touches
  where knowledge lives. `voice/brand-positioning.md` was aligned on
  2026-09-22.
- [x] **Vendor names**: settled 2026-09-21 by the series naming rule.
  The vendors listed in Voice notes may be named neutrally, with a
  source, and never with Spaarke positioned against them.
- [x] **Diagram**: confirmed. One curation-loop diagram as Exhibit 2,
  plus the context map as Exhibit 1.
- [x] **Spaarke references**: one default mention ("operational
  memory," with the link to `the-iq-stack`) and one further mention
  permitted where it helps the reader. No product features.
- [x] **The Harbor measurement sentence**: not used. The writer's
  answer of 2026-09-22 was "do not include this; seems not accurate."
  The measurement point (Harbor's "0% of participating top-tier law
  firms and global in-house departments ..." sentence and Embry's
  rendering of it) is dropped from the Angle, Must include, and
  References, it is listed in Must NOT include, and Embry is the
  skeptical voice alone, cited on his own sentences.
- [x] **TBD items that carry weight**: the ILTA 2026 Technology Survey
  quotations (group A; inside the window since 2026-09-22 and used in
  arguments 1 and 5); the sample sizes of the two Thomson Reuters
  reports (group A); the Core 12 revision date and the ACC publication
  year (group D; the piece can say "neither text is recent" without
  them); the LegalOps.com listing of Knowledge Management (group D);
  the Uber session description (group B); Jamal Brown's employer
  (group E); and the Microsoft Copilot architecture page's update stamp
  and quotation (group B; optional). The writer's answer of 2026-09-22
  is "include if helpful; no specific reference required." Each item
  may be used where it helps the piece; where a specific reference
  cannot be confirmed, the point is presented as the article's own
  observation, without a citation and without a number that would need
  one, and the polish gate still checks any figure or quotation the
  draft prints. The safety notes stand regardless: name no employer
  for Brown until resolved, and the Deloitte predictions document
  (group E) stays out unless its date is confirmed. The research
  pointers in References remain the record of where the material came
  from.
- [x] **TBD items the piece can paraphrase or omit**: Benamram's
  "exposes poor KM" phrase; the Humberstone security line; de Maistre's
  further point; the Pillsbury role detail; the Legal.io "Verification
  Tax" phrase; the Bakal preprint; the ClearPeople provenance line and
  the LexisNexis interviewee quotation; Calve's enterprise data
  strategy line; the In-House Connect program; the unverified vendor
  commentary (LexisNexis International, ClearPeople, Harvey). The
  writer's answer of 2026-09-22 is "include if helpful; no specific
  reference required," and the same rule applies: use where it helps,
  present as the article's own observation where a reference cannot
  be confirmed, and let the polish gate check anything the draft
  prints. The pointers stay in References.
- [x] **A named practitioner example** for the new sources of knowledge
  (negotiation history, billing narratives, intake answers, expert
  corrections): the writer's answer of 2026-09-22 is "no other sources
  available; use what provided." No named example; the section stands
  as the article's own argument on the confirmed practitioner lines,
  which the evidence standard allows.
- [x] **Every quotation** is checked against the live page before
  publication, including the confirmed ones, because the fetch tool
  altered "verbatim" quotations at least three times during the
  research. Decision recorded 2026-09-22: the writer's answer is
  "yes; if not specific references available then make generic or
  unattributed." The polish gate checks every quotation, and where a
  quotation cannot be confirmed on the live page, the draft drops the
  quotation marks and states the point generically, without
  attribution. The checking itself is polish-gate work.
- [x] **Article 3's brief frontmatter**: resolved before this revision.
  Article 3's brief now carries `publish_date: 2026-07-21`,
  `date: 2026-07-21`, and
  `campaign: 2026-06-legal-operations-intelligence`, so the stale note
  (2026-07-14 and `campaign: none`) no longer applies. This brief links
  to article 3 by slug, so nothing here depended on the fix. Recorded
  2026-09-22.
- [x] **`posted`**: follows the campaign schedule (push week 5,
  Tuesday, of the distribution sequence in the campaign file), per the
  writer's answer of 2026-09-22. Entering the date is a scheduling
  step once the push start date is set, and it is no longer a writer
  decision.
