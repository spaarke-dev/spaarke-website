# The Spaarke Method: Envision, Design, Build, Deploy, and Manage

<!--
SUPERSEDED for decisions by brief.md (v3) and plan.md: where this file and the brief differ, the brief governs. In particular, the brief uses "legal operations" as the inclusive term, has no separate law firm section, uses "forward-deployed" for the legal engineers, and draws the distinction between a system of record and the platform sharply.

Draft idea, rev. 2, 2026-10-05, with the writer's eleven clarifications
applied. First article of a new series on how Spaarke envisions, designs,
builds, deploys, and manages a Legal Operations Intelligence platform with
a law department or a law firm. This piece is the overview; each phase
then gets its own detailed article.
Target: about 4,000 words, plus or minus, with no hard cap
(length_target: open in the brief). Release this week, with the display
date equal to the real publish date.
Run /idea-to-brief the-spaarke-method once the open questions at the end
are settled.
-->

## The one-sentence topic

How Spaarke works with a law department, or with a law firm, to build its Legal Operations Intelligence platform and the internal AI capability that depends on it: five phases (envision, design, build, deploy, manage), one recurring decision at a time, carried by legal engineers who sit inside the work, ending in a model the customer owns and runs.

## Standing of this piece

This is article 1 of a new series, and it differs in kind from the five before it. The earlier series argued what a department should do: what the mandate is, what the platform is, what the ontology holds, and why business intelligence and knowledge management belong inside it. Those articles are general, and any department could act on them with any provider. This series is about Spaarke. It describes how we envision, design, build, deploy, and manage the platform with a customer. It is a method article and not a general discussion, and it should read as one: specific about who does what, in what order, and what exists at each stage.

It is not a sales document. It makes no price, timeline, or results claims, and it does not argue against any provider. It describes the way we work with enough precision that a buyer can judge it, and it leaves the judgment to the buyer.

**Series structure (settled 2026-10-05).** This piece sets out the overview and the five components. Each phase then gets its own detailed article, so the series runs to at least six pieces: the overview, then envision, design, build, deploy, and manage. Further articles are open (see "The series" below).

The piece links back to the existing series wherever the link carries the argument. Every target must carry an earlier display date than this piece, and all of these do.

| Link target | Where it fits |
|---|---|
| `managing-legal-operations` (article 1, the mandate) | Envision: why the outcomes come first and who sets them |
| `building-the-legal-operations-intelligence-platform` (article 2) | The overall frame: process, people, then technology; the decision sentence (user, surface, decision, inputs, action); one decision as the right scope for a first build; legal engineer roles |
| `legal-operations-ontology` (article 3) | Design: build the model backward from decisions, agree the definitions, one use case at a time |
| `from-spend-analytics-to-legal-operations-intelligence` (article 4) | Design and Manage: the deterministic dimension, measures that compute the same way every time |
| `knowledge-management-legal-operations-intelligence` (article 5) | Build and Manage: the context AI needs, and who keeps it current |
| `legal-ops-is-not-it-for-lawyers` | Envision and Manage: ownership of the platform belongs inside the legal department |
| `probabilistic-vs-deterministic` | Deploy: where AI proposes and where a calculation decides |
| `the-ux-that-legal-iq-requires` | Build and Deploy: the surfaces where the decision is made |
| `tenant-dedicated-deployment` and `your-legal-data-belongs-to-you` | Deploy and Manage: the customer's tenant, the customer's data, the customer's model |

## Why this matters, why now

A legal operations director has now read a year of material on AI in legal and has heard from three frontier model providers and from Microsoft. What the director rarely gets is a plain answer to the practical question: if we start, what happens in the first week, who does what, and what do we have at the end of each stage? The five earlier articles answered what to build. A buyer also needs to know how the work is done, because the same ontology and platform can be built well or badly, and the difference lies in the method.

Two findings from the research already in the repo make the timing good. The Harbor 2026 Maturity Index (2026-05-11) says "Technology is in place. The operating model has not kept up." The Axiom 2026 Legal AI Survey (2026-07-09; 528 in-house leaders; Axiom is an ALSP and an interested party) finds that 7% have scaled AI beyond pilots and that 83% cannot show whether last year's AI spend paid off. Both are confirmed in the research library (`r2-km-ai-alignment`, and the October report's evidence table) and can be reused with the same caveats. Both describe a gap that a method has to close: the operating model, the definitions, the measurement, and the people, as distinct from the tools.

## Who this is for

Primary: **legal-ops-director**, who would sponsor or run the work and who has been through a vendor implementation that ran late. Secondary: **corporate-counsel**, who needs to know what is asked of the department's lawyers and when. A shorter section is written for **firm-operations-leader**, because the method also applies to a law firm building its own platform, and because the firm is a party to the department's engagement record.

## What the reader should walk away believing

1. **The platform is built one decision at a time, and every phase serves that decision.** The department chooses a decision that recurs and matters. The second decision costs less than the first, because the entities, connections, and governance built for the first are largely what the second needs. Articles 2 and 3 state this; here it becomes the organizing principle of an engagement.
2. **There are five phases, and they form a loop.** Envision, design, build, deploy, and manage. Manage feeds the next envision, since a running platform shows which decision to take on next. The phases overlap in practice: a first working model on real data is often what makes the design real to the people who own the decision.
3. **Legal engineers carry the method.** These are attorneys, legal operations professionals, and specialty practitioners who understand how legal work is actually done and can translate that work into the ontology and the decision platform. They sit inside the department's problem, work on its real data in its own tenant, and are accountable for what they scope and for what they deliver. They are the reason the model reflects how the department decides, as distinct from how its systems happen to store data.
4. **Spaarke combines technology, consulting, and managed services, and the method keeps them connected.** Most departments meet these as three separate purchases: software from one provider, advice from another, and operational support from a third. Each hands over to the next, and context is lost at every handover. In the Spaarke Method the three run together and stay linked to one ontology: the technology is shaped by what the consulting work finds, the consulting work is tested in the running platform, and the managed services operate and improve what was built, using what they learn to change the next design.
5. **The method builds a department's own AI capability, which is a critical part of the platform.** A department cannot buy a durable AI capability as a product. It has to build the context, definitions, permissions, governed actions, evaluation, and skills that make AI accurate and safe in its own work, and then keep them current. Each phase contributes one of those parts. AI starts by proposing actions that a person confirms, and its latitude widens as the department gains confidence in the results.
6. **The customer owns what is built.** The ontology, the definitions, the policies, the playbooks, and the decision record belong to the department and live in its tenant. This is the point article 3 makes about lock-in one layer up, and the method is designed around it.

## The shape of the platform the method builds (one model, grounded in systems of record)

The method builds one ontology. The ontology is supported by data and information from systems of record, and it binds each entity to the system where that data lives. Spaarke can supply the system of record for legal work, and a department can also connect third-party systems of record. This is a single approach and not two alternatives, and the article must not present it as a choice between two modes or as a migration path.

What the article does say, in one place and plainly, is that the source of the data affects the work:

- **Working from the Spaarke system of record gives real advantages.** The entities, identifiers, permissions, ethical walls, and decision record are native to the platform. There is no identity resolution across systems to build, no refresh cycle to schedule, no write-back limitation to design around, and the same governance applies to a person and to an agent. The data arrives in the form the model expects.
- **Pulling data from external systems has to be addressed as its own work.** The department has to settle which system is the source of truth for each attribute, how identifiers are matched (the same matter may carry a different number in the matter system, on the firm's bill, and in a folder name), how often data refreshes, and what the third-party interface permits for reading and for writing. These are the processes and the inherent limitations that the Design and Build phases handle. The article states them as requirements and limits, consistent with `voice/product-knowledge.md`: no zero-copy or live-binding claim, no shipped write-back claim, and no mention of Spaarke's own MCP server, which is roadmap.

**Conflict to resolve before the brief.** `voice/brand-positioning.md` (2026-09-22) and the October report's idea record the writer's earlier decision that Spaarke "supports both modes", and that neither is the rule. The writer's note today refines that position: one ontology, supported by systems of record, with Spaarke as the system of record where that makes sense and integrations where it does not, and with the advantages of the integrated platform said openly. The voice guides and the October report need a follow-up edit to match, and the article should use the new framing.

## The five phases

Each phase states what happens, who is involved, what exists at the end, and what it contributes to the department's AI capability. The detail is a first pass for discussion and has to be checked against how Spaarke delivers before the brief is written.

**Envision.** Start from the outcomes the general counsel, the CFO, and business unit leaders need and from the decisions they rely on legal to make or inform. Write each decision as the single sentence from article 2: the user, the working surface, the decision, the inputs it needs, and the action it produces. Run the test from that article, which asks for the ten decisions the general counsel would name as most important and, for each, who makes it, where, what they consult, and where the outcome is recorded. Find the decisions with no owner and the decisions with three. Choose the first decision. Name an owner for the platform inside the department. Set a baseline: how long the decision takes today, how often it is revisited, and what it costs when it goes wrong. A legal engineer leads this work with the decision owner.
*AI capability contribution:* the department decides where AI is wanted and where a deterministic calculation is the right tool, sets the success measure before any model is chosen, and names who is accountable for AI-assisted decisions.
*At the end:* a ranked list of decisions, one chosen first use case with a named owner, a baseline, and a short statement of what better looks like.

**Design.** Build the model backward from the decision: the evidence it requires, the entities and relationships that hold that evidence, the systems where the data lives, the policy and authority that govern the decision, and the governed action that carries it out. Agree the definitions, which is the hardest part (what counts as a matter, an engagement, an approved exception). For each entity, record the source of truth: the Spaarke system of record where the platform holds it, or the third-party system, with the identity, refresh, and write limits that follow. Define security, ethical walls, and what an agent may and may not do.
*AI capability contribution:* the definitions and policies become the context and the guardrails that AI works within. Permission to act is kept separate from permission to see, and applies equally to a person and to an agent.
*At the end:* a written model of one decision's entities, relationships, policies, and actions; a source map with its limits stated; and the definitions, agreed by the people who own them.

**Build.** Work on real data, with the people who own the decision, from the first days. Connect the source systems, create the entities the department lacks a system for, define the governed actions, and build the surface where the decision is made. Validate with the questions the general counsel or practice leader asks repeatedly. Put them to the new surface, to a recent joiner, and to the AI the department will rely on, and time each. A question that takes longer on the platform than by telephone shows what the model has missed. The few-day working session in article 2 is the nearest published description of this phase.
*AI capability contribution:* the repeated questions become the department's own evaluation set, so that accuracy is measured on its work, with its data, and not on a vendor's demonstration.
*At the end:* a working model and surface on real data, tested by the decision owner against their own questions.

**Deploy.** Put the platform where people already work (Outlook, Teams, Word, the matter page) and into the department's tenant under its existing identity and governance. Start AI in proposing mode, where an agent stages an action and a person confirms it. Train the people who make the decision, and agree who is accountable when the platform and a person disagree. Measure against the baseline set in Envision.
*AI capability contribution:* the department gains experience of AI in live work under its own controls, and each decision, who made it, on what evidence, and what followed is recorded.
*At the end:* the decision made through the platform in live work, with a record of each decision.

**Manage.** The phase covers continuing execution and continuous improvement, and it is where Spaarke's managed services plug in, both technical and legal. On the technical side: operating the platform, the connections, the permissions, and the model's performance. On the legal side: keeping definitions, policies, and playbooks current as the business changes, handling defined volumes of routine work under the department's rules, and extending the model to the next decision. Review the decision record: where people overrode a proposal, why, and whether the model or the person was right. Widen or narrow AI latitude on that evidence. Choose the next decision and begin the loop again, with most of the entities and governance already in place.
*AI capability contribution:* autonomy widens on evidence the department has gathered. The department keeps the knowledge current. Legal engineers work alongside the department's own staff, so the capability stays in the department when an engagement ends.
*At the end of each cycle:* a measured result against the baseline, an updated model, and the next decision chosen.

**On the name of the fifth phase.** The phase has to cover ongoing execution, continuous improvement, and the managed services. "Manage" matches the managed services and is what the title already uses. The strongest single-word alternatives are "Operate", which reads most plainly as running the platform, and "Evolve", which carries improvement but loses the idea of execution. "Sustain" and "Improve" each capture half. My recommendation is to keep "Manage", because it names the service the department can buy and parallels the verbs of the other four phases, with "Operate" as the only alternative worth weighing.

## The legal engineer

The writer has asked that the article emphasize Spaarke's version of the embedded expert. The article calls this person a legal engineer and defines the role the way Spaarke uses it.

A legal engineer is an attorney, a legal operations professional, or a specialty practitioner (for example in intellectual property, contracts, litigation, or regulatory work) who understands how legal work is done and can translate that work into the ontology and the decision platform. The role needs three abilities: understanding the department's process and judgment well enough to be trusted by the lawyers, modeling that process as entities, relationships, policies, and actions, and building, or directing the building of, the surface and the governed actions that put the model to work. The legal engineer is accountable for both the promise and the delivery: the person who scopes what the platform will do is the person who makes it work, which removes a familiar gap between what was sold and what was built.

Four points to make about how legal engineers work:

- **They start from the decision and go to the ground.** They spend time with the people who make the decision, in the matter team, in finance, in the outside counsel management function, and they work with the real documents, emails, invoices, and spreadsheets. The model they produce is a representation of the department's operating knowledge, and they treat it as a model that will be wrong in places and will get less wrong with each cycle.
- **They respect what already works.** Before changing a practice or a definition they learn why it exists. A department's exceptions, thresholds, and informal rules often hold judgment that the formal process lost.
- **They keep the customer's authority intact.** The department decides what the model contains and what an agent may do. Access to context is used to serve the department, and the model that results is the department's own.
- **They transfer the capability.** In every phase they work with named staff of the department, so that the department can run and extend the model itself. This is how the method builds an internal capability and not a dependency.

Legal engineering as a role is already visible in the market. The first article in the earlier series described legal engineer roles, and several providers and publications now use the title, with somewhat different meanings (Brightflag, Clio, and Harvey each publish a definition, all vendor sources and interested parties). The article should say that the term is in use and then define Spaarke's usage in a sentence, as a definition and without a rebuttal of the others.

## Building an internal AI capability

The writer has asked that the article show how the method supports the particular requirements of law departments and firms building their own AI capability, which is a critical part of the platform. The article does not become an AI article; it shows where the method meets the requirements.

The requirements the research supports, each mapped to a phase:

| Requirement | Why it is specific to legal | Phase | Source in the repo |
|---|---|---|---|
| Context that is accurate and current | AI answers questions about the department's own matters and obligations, and a model grounded on the wrong or stale record is wrong in ways that carry risk | Build and Manage | Article 5; `knowledge-management-and-ai` notes |
| Agreed definitions | A model cannot be consistent where the department disagrees about what a matter or an approved exception is | Design | Article 3, including the Data Mozart caution |
| Authority and permissions that apply to an agent as to a person | Privilege, ethical walls, and delegation of authority bind agents too | Design and Deploy | Article 2, permissions section |
| A way to measure whether it works | Harbor: "0% of participating top-tier law firms and global in-house departments have a mature framework for measuring AI's business impact" (2026-09-11; consultancy source, methodology not disclosed; Embry's critique of its methodology belongs beside it); Axiom: 83% cannot show whether last year's spend paid off | Envision and Build | October report evidence table |
| A human in the loop with accountability | Lawyers remain accountable for outcomes, and review has to be designed | Deploy | Articles 2 and the probabilistic versus deterministic piece |
| Autonomy that widens on evidence | Departments need to see what the agent did and why before they extend its latitude | Deploy and Manage | Article 2 |
| Skills and roles | Deloitte UK (2026-07-09; 121 senior legal leaders): 84% have not redesigned roles around AI | Manage (and legal engineers throughout) | Article 2 |
| A model layer that can change | The model arrives through several doors at once and the knowledge and playbooks should not be locked in one provider's format | Design and Manage | Article 3; October report |

The method's argument is that a department builds this capability through the same five phases it uses to build the platform, and not as a separate program. The department's evaluation set comes out of Build, its context and guardrails out of Design, its confidence out of Deploy, and its improvement out of Manage.

## Technology, consulting, and managed services as one

The writer's framing is that Spaarke combines what departments usually buy separately. The article states it as a positive claim about how the work is organized. It does not describe either of the other models as inadequate.

The three familiar models, described fairly:

- **Technology providers** sell software that a department configures. The strength is a tested product. The department often supplies the process knowledge, and the implementation is scoped around the product's own data model.
- **Consulting firms**, including the legal practices of the large professional services firms, advise on strategy, operating model, maturity, process, and sourcing. Deloitte Legal's Legal Business Services pairs legal management consulting with technology-enabled managed services; KPMG Law lists target operating model design and a legal operations and technology maturity assessment and roadmap; EY Law's legal function consulting says it supports clients "from the analysis and design phases through implementation and maintenance". The strength is framing and change management, and the work frequently ends with a recommendation, a roadmap, or a program.
- **Managed services and alternative legal service providers** run defined volumes of legal and legal operations work. Epiq publishes its Service Cloud and Metrics that Matter for legal service management. UnitedLex embeds in departments to run workflows such as contract management, litigation support, and intellectual property operations. Elevate presents flexible talent, a software platform, consulting, and managed services together; Axiom presents on-demand talent and AI-enabled services. The strength is operational capacity at scale.

An honest comparison has to acknowledge that several of these providers already combine two or three elements. Deloitte pairs consulting and managed services. Elevate presents software, consulting, and managed services in one portfolio. So the distinction Spaarke claims cannot be that nobody else combines them. The distinction has to be what connects them. In the Spaarke Method the three share one ontology, so that what the consulting work learns about a department's decisions is held in the model the technology runs on, and what the managed services learn from operating the platform changes the model. The same legal engineers carry the work across phases, so there is no handover where context is lost. The writer should confirm that this is the distinction Spaarke wants to make, and the article should hold it to what Spaarke can show.

Direction of travel. Many readers will assume that technology leads to consulting (a vendor adds services to support the product) or that consulting leads to technology (an adviser adds a platform to implement its recommendations). The Spaarke Method has the work moving in both directions and in a third, so that technology, consulting, and managed services each change the others. The article states this once and explains it through the example below.

## What we borrow from the established methods

The writer asked for other consulting methods, and the legal-services research is added here. All of it comes from search results and secondary sources and every row stays **TBD — confirm** until a primary source is read.

| Method | What it is | What the Spaarke Method takes or adds | Source (secondary, to confirm) |
|---|---|---|---|
| McKinsey problem solving | Seven steps: state the problem, disaggregate issues, prioritize issues, build a work plan, conduct analysis, synthesize findings, prepare communication. Hypothesis-driven, with issue trees that are mutually exclusive and collectively exhaustive | Envision takes the discipline of stating the problem as a question and breaking it into parts; the decision sentence plays the part of the hypothesis | Umbrex, https://umbrex.com/resources/mckinsey-problem-solving/ |
| McKinsey Rewired (Lamarre, Smaje, Zemmel, 2023) | Six capabilities for digital and AI transformation: roadmap, talent, operating model, technology, data, adoption and scaling | Manage and the people component take the point that adoption and operating model decide the result as much as technology | Publisher listing, https://www.booksamillion.com/p/Rewired/Eric-Lamarre/9781394207114 ; find the McKinsey page |
| BCG deploy, reshape, invent; 10-20-70 | Three plays for AI; BCG states an allocation of 10% algorithms, 20% technology and data, 70% people and processes | Supports process, people, then technology as the order of work | BCG, https://www.bcg.com/en-us/capabilities/artificial-intelligence |
| BCG X | 3,000+ builders and designers who pair consulting with building software | The large firms now build as well as advise; the comparison turns on what stays with the customer | BCG press release, 2022-12-01, https://www.bcg.com/press/1december2022-bcg-x-new-hybrid-of-consulting-and-tech-build-design-capabilities |
| Bain Results Delivery | Predicts, measures, and manages adoption risk from the first day | Deploy and Manage measure adoption from the start | Umbrex, https://umbrex.com/resources/frameworks/project-management-frameworks/bain-results-delivery/ ; find the Bain page |
| Double Diamond (design) | Discover, define, develop, deliver: two rounds of diverging then converging | Envision and Design diverge on decisions and converge on one; Build and Deploy test at small scale before widening | Umbrex and others; origin with the UK Design Council, **TBD — confirm** |
| Deloitte Legal, Legal Business Services | Legal management consulting plus technology-enabled legal managed services for corporate legal departments; launched in the US in 2020 | The nearest published combination of advice and operation | Deloitte, https://www.deloitte.com/us/en/services/tax/services/legal-managed-services.html ; LawNext, 2020-07, https://www.lawnext.com/2020/07/deloitte-targets-u-s-legal-market-with-new-legal-business-services-practice.html |
| KPMG Law, legal operations consulting | Target operating model, process design, benchmarking, outside counsel management, maturity assessment and roadmap, KPI dashboard | Envision borrows the maturity assessment as a starting point | KPMG Law, https://kpmg-law.de/3m85 |
| EY Law, legal function consulting | Analysis and design through implementation and maintenance; talent, data, technology, sourcing | Confirms the consulting firms already span design to maintenance | EY, https://www.ey.com/en_us/services/law/legal-function-consulting |
| Epiq | Service Cloud and Metrics that Matter for legal service management (2022-05-09) | Operations measured against a shared metric set | GlobeNewswire, https://www.globenewswire.com/fr/news-release/2022/05/09/2438838/10374/en/Epiq-Launches-Metrics-that-Matter-A-Sophisticated-Legal-Operations-Performance-Management-Solution.html |
| UnitedLex | Embeds in corporate legal departments to run workflows; technology-enabled managed services | Embedding is the managed-services counterpart of the legal engineer | Secondary summaries only; find UnitedLex's own pages |
| Elevate and Axiom | Elevate: flexible talent, ELM software, consulting, managed services. Axiom: on-demand talent and AI-enabled services | Shows both a combined portfolio and a talent-led model | Elevate and Axiom own sites; confirm |

Still to do before the brief: read a primary page for each; look for Accenture, Consilio, Integreon, and the legal-specific consultancies; look for any published account of how these providers structure a first engagement; and decide whether any of the providers should be named in the article. The neutral-naming rule from the October report applies: name providers factually with a source for each named fact, never position Spaarke against a named vendor, and use no competitor marketing collateral as evidence beyond what a page itself states.

## The principles the method is built on

Spaarke's delivery follows an operating model that the writer wants carried over into legal. The article states the principles in Spaarke's own words and without reference to where they came from. Each of these is already visible in the plan above.

1. **The model represents decisions, and the data serves them.** The ontology is built backward from decisions, and a platform that only reports on data has not closed the loop. (Envision, Design.)
2. **Context is not available until someone goes and gets it.** The department's real knowledge sits in email, spreadsheets, and the judgment of its people, and it does not assemble itself. Legal engineers go to where the work is done. (Envision, Build.)
3. **The map never fully matches the territory.** The aim is a model that is less wrong each cycle, and the first working version is expected to be corrected. (Build, Manage.)
4. **The customer's sovereignty comes first.** The model, the data, and the decision record belong to the department and run in its tenant. Context entrusted to Spaarke is used to serve that department. (Design, Deploy, Manage.)
5. **Security travels with the data.** Permissions, ethical walls, and purpose of access apply to every action, human or agent, and every action is logged. (Design, Deploy.)
6. **Real data, quickly.** A working session on real data produces more learning than a long discovery. (Build.)
7. **One accountable person for the promise and the delivery.** (Legal engineers, throughout.)
8. **Autonomy follows evidence.** AI proposes first, and its latitude is widened or narrowed on the decision record. (Deploy, Manage.)

The source essay for these principles is third-party material and is not cited by name. See the open questions.

## How the method applies to a law firm

The firm's version has the same five phases and a different set of decisions: staffing, realization against client billing guidelines, matter profitability, and handling a client's outside counsel guidelines. A firm also has a second role. It is a party to its clients' engagement records, and in a Spaarke deployment it can work against the customer's record and operational memory instead of rebuilding its own on the same matter (`voice/brand-positioning.md`, "engagement boundary preserved"). The piece says how a firm joins a client's engagement during Design, and how a firm builds its own platform for its own decisions. The firm-operations-leader persona's caution applies: never anti-firm, and realistic about partnership economics. The firm builds its own AI capability the same way a department does.

## The worked example: the matter budget decision, through all five phases

Use the decision article 2 already carries, because it ties the series together and the writer has approved its reuse. The head of litigation reviews matters approaching their budget and decides whether to raise the budget, change the staffing, or move the matter, using current spend, the firm's forecast, and the exposure estimate. The outcome updates the matter record and notifies the firm. The example is labelled illustrative.

- **Envision.** A legal engineer sits with the head of litigation and the finance partner, writes the decision as one sentence, and finds that two people believe they own it. The baseline: how many days it takes to get the three inputs together today.
- **Design.** The entities are the matter, engagement, firm, timekeepers, budget, and scope change. The policy sets who may approve an increase and at what threshold. The source map records that the matter lives in the Spaarke system of record and that invoices come from the e-billing system, with its matching rule for the matter identifier and its refresh interval.
- **Build.** The surface shows matters against budget. The legal engineer puts the head of litigation's three recurring questions to the surface, to a new joiner, and to the AI, and times each. One question exposes a missing field, which the model gains.
- **Deploy.** The surface goes into the head of litigation's working day. An agent stages a recommended action with its evidence, and the head of litigation confirms or changes it. Each decision is recorded.
- **Manage.** After a quarter, the record shows where the head of litigation overrode a recommendation and why. The team widens the agent's latitude for one category of increase and narrows it for another, and chooses the next decision, the invoice exception. That decision costs less to build because the matter, firm, and budget entities already exist. The technology, the consulting work, and the managed service each changed what the others did.

## What this should NOT become

- Not a sales pitch, a price list, or a promise of timeline or results. There is no referenceable customer engagement, so the piece states the mechanism and uses the illustrative example above. If a real engagement becomes referenceable before publication, the writer decides whether to use it.
- Not a rigid waterfall, and not a methodology dressed in a trademark symbol. "The Spaarke Method" is the writer's name for it and the article uses it plainly.
- Not a critique of the consultancies, the managed services providers, or the software vendors.
- Not a presentation of two modes or a migration path. One ontology, supported by systems of record, with Spaarke as the system of record where that suits and integrations where it does not.
- Not a restatement of articles 2 and 3. They say what to build; this piece says how the work is organized, who does what, and what exists at the end of each phase, and it links back for the reasoning.
- Not an AI article, and not "AI-first". AI is addressed as a capability the method builds, and the starting point stays the decision.
- Not carrying any program names, role titles, or product terms from the source of the operating model. The list in `voice/product-knowledge.md` applies, and "forward-deployed" is not used. Internal layer numbers, wave names, and pricing stay out.

## The series

Settled structure: article 1 is this overview; articles 2 to 6 are one detailed piece per phase (envision, design, build, deploy, manage). Further articles are not yet defined. Candidates:

- **Legal engineers:** who they are and how they work with a department.
- **Building the internal AI capability:** the evaluation set, the guardrails, the widening of autonomy.
- **Working with outside counsel:** how a firm joins a client's engagement and how a firm builds its own platform.
- **Systems of record:** what changes when the data comes from the Spaarke system of record and when it comes from third-party systems.
- **A worked engagement,** once a customer can be referenced.

The series needs a name, a campaign file, and a place in the display dates. The existing Legal Operations Intelligence series ran June to September 2026 and sits in `campaigns/2026-06-legal-operations-intelligence.md`.

## Timeline

The writer wants release this week, today (2026-10-05) or tomorrow (2026-10-06). The display date is the real publish date, so frontmatter `date` and `posted` carry the same value and no source may be dated on or after it. The gates still run in order: brief, plan with sign-off, draft, revise, polish with the voice lint and the four review lenses, hero, ship. The gate that sets the pace is the evidence: every provider claim has to be read from a primary page, and anything unverified is cut or marked, since a fast release does not change the rule against unverified claims. A compressed path is to draft in one pass from a short plan, with the consulting comparison reduced to a short paragraph and a Sources block if the primary pages cannot all be read in time. This does not conflict with the October report, which keeps its 2026-10-20 slot.

## Open questions

1. **Series name, campaign, and navigation.** Does the series take a name ("The Spaarke Method") and a campaign file of its own? Do the five earlier articles gain a link forward?
2. **The fifth phase.** Keep "Manage", or move to "Operate"? (My recommendation is to keep "Manage".)
3. **Confirm the substance of each phase** against how Spaarke delivers today: who from Spaarke is involved, what the customer provides, what the first working session looks like, what is committed at the end of each phase, and how the managed services (technical and legal) are scoped. Anything not yet decided stays out.
4. **The integration distinction.** Is "one ontology that links technology, consulting, and managed services, carried by the same legal engineers" the distinction the writer wants to claim, given that Deloitte and Elevate already combine some of the three?
5. **Naming providers.** Does the article name Deloitte Legal, Epiq, UnitedLex, and others as examples, with a source for each fact, or does it speak of the three models in general and put the providers in the Sources block?
6. **Legal engineer definition.** Does the written definition above match the writer's intent, particularly the inclusion of attorneys and specialty practitioners as well as technically trained staff?
7. **Systems of record wording.** The voice guides still say "supports both modes". May I align `voice/brand-positioning.md`, `voice/product-knowledge.md`, and the October report's idea with the new wording after the article is settled?
8. **Evidence on AI capability.** The table above rests on survey findings and our earlier articles. Is that enough, or does the writer want additional primary evidence on what makes internal AI capability succeed or fail in legal departments?
9. **Release.** Confirm the compressed path above, and which day.
10. **The source essay.** Settled 2026-10-05: it is saved with the other research materials the repository does not publish, in the private archive `C:\code_files\spaarke-research\2026-10-spaarke-method\`.

## Voice and mechanics

Long-form, about 4,000 words plus or minus, with no hard cap (`length_target: open`; the target is guidance, and the test is whether each section advances the argument). Byline "Spaarke Team", with the closing contact line to Ralph Schroeder, Founder and CEO. Strategy-consulting register in the manner of McKinsey and Harvard Business Review, per `voice/style-guide.md`. No em dashes. None of the constructions in `voice/examples/ai-tells.md`. The work in each phase uses the department's own vocabulary and the terms of art in `voice/domain-knowledge.md` section 3. Run `npm run voice:lint -- <draft>` before every review. Every figure carries its source, date, and sample where known, and the Sources block lists a source even where no public URL exists.
