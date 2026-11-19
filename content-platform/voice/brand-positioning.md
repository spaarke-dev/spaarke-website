# Brand positioning

> **Note added 2026-11-14.** The writer approved a new overview of Spaarke on 2026-11-14, and this file was rewritten around it. Four changes run through it. The ontology and Legal IQ lead the description. The platform integrates and extends the legal team's core systems, which replaces the earlier framing of two deployment modes. Where the platform runs is described as where legal teams already work, with enterprise scale and governance, and the Microsoft components are named only where a piece needs the technical detail. Service as software (legal engineers and managed services) is part of the positioning. The earlier notes of 2026-09-21 and 2026-09-22 are superseded and their substance is folded in below.

What Spaarke argues for, narratively. Read this to know *what to argue*; read `style-guide.md` to know *how*. Article prose follows the style guide rather than the phrasing here, and a slogan may be quoted only where an article quotes the live site.

---

## 1. The overview

This is the approved description of Spaarke, settled by the writer on 2026-11-14. Use it as written for an "About Spaarke" paragraph, a press note, a deck's opening slide, or a partner profile, and shorten it from the front when space is tight.

> Spaarke is a Legal Operations Intelligence platform built on an ontology: a single model of the matters, documents, requests, obligations, spend and decisions a legal team works on, the relationships among them, and the actions the team may take on them under rules it sets. That ontology is the foundation of Spaarke's Legal IQ, which joins the team's operational data, its institutional memory and AI inference, so that AI works from the full context of the team's legal work. The platform integrates and extends the legal team's core systems, and it is designed to run where legal teams already work, with enterprise scale and governance. Spaarke delivers this as service as software: legal engineers work alongside the team to translate its knowledge and processes into the ontology, and managed services then run and improve the platform, one decision-focused use case at a time.

Short form, for a byline footer or a profile field:

> Spaarke is a Legal Operations Intelligence platform built on an ontology of legal work, delivered as service as software. It integrates and extends a legal team's core systems and runs where legal teams already work, with enterprise scale and governance.

The overview names no Microsoft component. Microsoft is the platform Spaarke runs on, and a piece names it, and its components, where the reader needs the technical detail: an article for IT, a deployment piece, or the legal AI platforms series. The overview does not depend on it.

---

## 2. Core narrative themes

Five themes. Almost everything we publish lives in at least one.

**The ontology is the foundation.**
An ontology is a model of the things a legal team works on, the attributes of those things, the relationships among them, the actions that may be taken on them, and the rules that govern those actions. It is what lets a department reason across its work instead of within one system at a time: a communication belongs to a matter, an invoice line to a timekeeper, a budget and a matter, a clause to an obligation, a party and a date. The relationships are the asset. Actions carry authority (who may act, under which delegation policy) and provenance (which rule, which evidence, which person confirmed), and that structure is what "AI-directed, human-controlled" means in practice. `product-knowledge.md`, section 3.5, holds the full definition and the limits on what a piece may claim.

**Legal IQ: data, memory and inference on one model.**
Legal IQ is Spaarke's name for the intelligence the platform gives a legal team, and it has three layers. Data is the unified operational record. Memory is the team's institutional history and the connections among matters, counsel, outcomes and decisions. Inference is AI directed at that grounded record, with people accountable for the decision. The ontology gives the data and memory layers their structure, and inference reads over it. Most legal AI today is drafting tools layered onto fragmented environments; they improve specific tasks but cannot reach the full context of a matter. Legal IQ is the argument that AI becomes operationally valuable when it works from the department's own model of its work. The proof is that Spaarke answers questions about the department's own matters, spend and counsel, where a general tool can answer only general legal questions.

**Integrates and extends the core systems.**
Legal teams already run systems that serve them well: a document management system, an e-billing platform, a contract tool, a matter system. Spaarke integrates with those systems and extends them. The ontology binds each entity to the system where its data lives and references what it does not own, and where a team has no system for the work, Spaarke supplies the record: for the request, the disposition, the obligation, the policy, the inquiry and the action record, which most departments hold nowhere today. Spaarke is also where business clients, in-house counsel and outside counsel work in shared spaces with ethical walls and matter-level permissions enforced, and AI grounding stays on that one model, so outside counsel work against the client's operational memory instead of a separate firm-side AI grounded on the same matter. Do not present the integration as a choice between modes or as a migration path; the department decides which systems it keeps.

**Runs where legal teams work, with enterprise scale and governance.**
Spaarke is designed to run inside the applications and the environment the legal team and the wider business already use. Identity, security, compliance and audit are the ones the organization has already approved, so IT does not stand up a parallel governance regime, and the platform scales with the enterprise it runs in. "Your data, your environment, your control" belongs here, because where the platform runs is what makes data sovereignty real. In technical pieces this theme is where Microsoft is named: Spaarke runs on Microsoft and can deploy inside the customer's own tenant (`product-knowledge.md`, sections 2.2 and 2.3).

**Service as software.**
A legal operations intelligence platform takes the experience and know-how of legal engineers, and software alone does not deliver it. Spaarke joins technology, consulting and managed services through one ontology that the organization owns. Legal engineers, who are attorneys, legal operations professionals or specialty practitioners with deep knowledge of where AI adds value and where it does not, work alongside the team to translate its knowledge and processes into the ontology. Managed services, technical and legal, then run and improve the platform. The work proceeds one decision-focused use case at a time, and each cycle ends with a measured result and a better model for the next. The Spaarke Method article (`content/blog/2026-10-05-the-spaarke-method.mdx`) carries the long form. "Forward-deployed" may describe the legal engineers, sparingly and defined in plain words; `vocabulary.md` holds the terms for this theme.

---

## 3. Competitive frame

We don't punch sideways at named competitors in brand writing, and the frame is implicit. (The legal AI platforms series names vendors because it is an explicit comparison, under `stance.md`, rule 10.)

- **Market category we claim:** Legal Operations Intelligence, the category the LOI series defines. We avoid "matter management", "ELM" and "legal AI" as descriptions of Spaarke, because each names one part of what the ontology connects.
- **Systems we work with:** the document management system, the e-billing platform, the contract tool and the matter system a department keeps. Spaarke integrates with them and extends them, and they stay the record for what they hold. We make no claim that a department must replace any of them.
- **What we displace:** the fragmentation between point tools, where each does its job, no shared model connects them, and the department reconciles them by hand. Also the separate purchase of software, advice and operational support from different providers, which service as software joins.
- **The implicit comparisons:** walled-garden SaaS hosting (Spaarke runs where the customer's work and governance already are); AI drafting tools (Spaarke is the model those tools should be grounded in); generic productivity suites (Spaarke adds the legal operating model they do not ship with); chat products for legal (Spaarke is operational infrastructure that a chat surface can sit on).

---

## 4. Proof points

- **Architectural: one ontology across the department's systems.** Entities, relationships and governed actions bound to the systems where the data lives, with the record supplied where none exists. `product-knowledge.md`, section 3.5, and the ontology article carry the long form.
- **Architectural: runs where the work and the governance already are.** Data sits inside the environment the customer already governs, and existing identity, conditional access, data loss prevention, sensitivity labels and audit logging apply. In technical pieces: Spaarke runs on Microsoft and can deploy inside the customer's own Microsoft 365 tenant. `tenant-dedicated-deployment` and `your-legal-data-belongs-to-you` carry the long form.
- **Functional: five capability modules on one model.** Matter Management, Documents & Email, Collaboration, AI & Automation, Spend & Performance. The point is the shared model: a matter has its documents, emails, tasks, workspace, budget and counsel performance attached.
- **Practical: IT deploys without a parallel governance regime.** No new identity, no separate security model, no parallel audit story. `spaarke-for-your-it-team` is the long form.
- **Services: legal engineers and managed services.** The Spaarke Method runs in phases from envisioning to managed operation, with legal engineers working alongside practitioners and end users in every phase, and the Spaarke Legal AI Accelerator offers a first step on a team's existing AI platform (`product-knowledge.md`, section 3.6).
- **Diagnostic: cited frameworks locate the LOI thesis.** CLOC Core 12, ACC Maturity Model 2.0, Gartner. We place category claims inside the existing legal-ops landscape rather than asserting from outside it.
- **Architectural: engagement boundary preserved.** When outside counsel become authorized collaborators against the same model, AI grounding does not fragment at the engagement boundary. The company's data, operational memory and AI grounding stay inside its boundary, and the firm works against them instead of re-creating its own. Most legal AI tools are sold to one side or the other and don't share grounding even when the same vendor sells to both. `what-attorneys-need-to-know-about-ai`, Decision Four, carries the long form.

---

## 5. What we are not

- **AI-first.** Spaarke is a legal operations platform that uses AI well. AI compounds because the ontology and the record are already there.
- **A productivity app.** No "10x productivity", no "faster drafting", no "one-click" anything. The argument is operational intelligence, and the measure is how legal work runs.
- **A billing or e-billing replacement.** Spend & Performance surfaces the financial picture of matters and counsel and works with the systems that process invoices.
- **"Copilot for lawyers" or "ChatGPT for legal."** Conversational AI is a surface Spaarke shows up on. The product is the model and the platform underneath it.
- **Software sold without the expertise to use it.** Service as software means legal engineers and managed services come with the platform.
- **For solo practitioners or small firms.** The proof points (enterprise governance, IT approval, outside counsel guideline compliance, collaboration across parties) matter at mid-market and above.
- **Anti-lawyer or anti-firm.** AI is directed and people stay in control. We don't argue AI replaces lawyers or eliminates legal labor.

---

*Locked 2026-05-07. Punctuation revised 2026-09-21 (no em dashes). Rewritten 2026-11-14 around the approved overview (ontology and Legal IQ lead; integrates and extends core systems; runs where legal teams work; service as software); see git log for history.*
