# Product knowledge: reference

> **Note added 2026-09-21.** This file is a factual reference, and article prose follows `style-guide.md` rather than the phrasing here. The file predates the September 2026 revision of the guide, and several differentiator headings in section 6 use constructions that the guide now prohibits in articles (the `X, not Y` tagline, negation followed by correction, and stacked fragments; see section 5, rules 14 to 16). Do not reproduce those lines as taglines. State the same position as a positive claim with its reason. A slogan may be quoted only where an article quotes the live site.

> **Note added 2026-09-22.** Positioning aligned with the series decision the writer settled on 2026-09-21: Spaarke provides both system of record capabilities and ontology architecture over third-party systems, and neither mode is the rule. Section 3.5 carries the ontology entry, section 6 was revised where a differentiator contradicted the statement, and section 8 records the two modes.

**Phase**: 0 (T05) · first draft, team revises in T11.
**Purpose**: factual reference about the Spaarke product so a writer can make accurate claims without re-deriving them every session. Not narrative. Pulled in selectively per piece.

Sources cited inline. Anything uncertain is tagged **TBD — confirm**.

---

## 1. The platform in one paragraph

Spaarke is a Legal Operations Intelligence platform for the business, in-house counsel, and outside counsel, built on Microsoft 365 (Power Platform, Dataverse, SharePoint Embedded, Microsoft 365 Apps, Azure AI Foundry). It consolidates matters, projects, documents, communications, spend, performance, AI, and agentic workflows into a single shared platform that runs inside the customer's Microsoft tenant rather than on vendor-controlled infrastructure. Spaarke provides both system of record capabilities and ontology architecture over the systems a department already runs, and a department may deploy it in either mode or both (writer's decision of 2026-09-21; section 3.5). Spaarke launched in 2026 and is in early access as of 2026-05-06 (per the website's primary CTA, "Get access," on `/platform` and `/`).

Source: `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md` §Project; `src/app/platform/page.tsx`; `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.

Boilerplate-ready short form (one to two sentences):

> Spaarke is a Legal Operations Intelligence platform built on Microsoft 365. It connects the business, in-house counsel, and outside counsel on a single platform (matters, documents, collaboration, AI, and spend) inside the customer's own tenant.

---

## 2. Architecture

### 2.1 The five capability modules

Module names and descriptions below are canonical, verbatim from `src/content/home/capabilities.ts` as of 2026-05-06, except that the dashes in the source descriptions are replaced with colons to follow the house punctuation rule. Module IDs (used as `/platform` deep-link anchors) in parentheses.

1. **Matter Management** (`matter-management`). A unified system for managing matters with complete visibility into work, documents, collaboration, and external counsel. Features: matter and project records, personal workspaces, daily briefings, smart to-do, AI quick create.

2. **Documents & Email** (`documents-email`). Every document and email connected to its matter, AI-summarized, and discoverable through semantic search. Features: document records, Find similar (Azure AI semantic search), relationship graph, email capture (Outlook), Office integration (Word/Excel/PowerPoint save-to-Spaarke).

3. **Collaboration** (`collaboration`). Secure shared workspaces for everyone working a matter: internal teams, business clients, and outside counsel. Features: secure project workspaces, outside counsel access, Word co-creation, shared matters and projects, Teams app.

4. **AI & Automation** (`ai-automation`). AI summaries, Copilot-native experiences, and event-driven playbooks. Features: AI-generated matter summaries, M365 Copilot integration, auto-created document profiles, Word Copilot drafting, AI and automation playbooks.

5. **Spend & Performance** (`spend-performance`). The financial and operational truth about every matter and every firm: invoices, budgets, OCG compliance, outcomes. Features: outside counsel performance metrics, matter report cards, billing-to-matter roll-up, budget tracking, Power BI dashboards.

Earlier names (Workspace, Document Intelligence, Outside Counsel Engagement, AI Workflows, Performance Intelligence) are retired per `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md`.

### 2.2 The Microsoft foundation

The seven Microsoft surfaces named on the platform foundation card (`src/content/home/capabilities.ts`, `foundation.logos`): Power Platform, SharePoint, Microsoft 365 Apps, Outlook, Teams, Microsoft 365 Copilot, Azure AI Foundry.

Underneath, per `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`:

- **Runtime**: model-driven and canvas Power Apps on Dataverse.
- **Data layer**: Microsoft Dataverse (matters, invoices, workflows, operational memory).
- **Document storage**: SharePoint Embedded (SPE) is the canonical document layer in the system of record mode. SPE stores documents inside the customer's own Microsoft 365 tenant rather than in vendor-controlled storage, lets Spaarke control the user experience and the integration with the Legal Operations Intelligence platform, and makes every file semantic-indexed so it is reachable by Spaarke AI without leaving the tenant. Native SharePoint capabilities (versioning, metadata, co-authoring) apply. In the ontology mode, a document management system the department keeps stays the record for its documents; how Spaarke binds to it is **TBD — confirm** (section 3.5).
- **Identity**: Microsoft Entra ID (formerly Azure AD).
- **Automation**: Power Automate.
- **Analytics**: Power BI (embedded dashboards on the Dataverse data model).
- **AI**: Microsoft 365 Copilot integration; Azure AI Foundry for grounded inference.

### 2.3 Hosting models

Two hosting models, surfaced on `/platform` via the architecture compare slider (`src/components/sections/DeploymentModels.tsx`):

- **Spaarke-Hosted**. Spaarke runs Platform Modules, Portal, Data & Analytics, and Infrastructure on Spaarke-managed tenancy. The customer's M365 tenant connects via Entra ID, Exchange, SharePoint, and Copilot Studio.

- **Customer-Hosted** (also "Tenant Dedicated Deployment" in long-form; see `content/blog/2026-02-08-tenant-dedicated-deployment.mdx`). Spaarke modules and portal sit inside the customer's own M365 tenant. Same architecture, customer's tenancy, customer's governance. Data never leaves the customer environment; existing Entra ID, Conditional Access, DLP, sensitivity labels, and audit logging cover Spaarke automatically.

Platform-page positioning: "Spaarke is the only legal SaaS solution that offers the option of fully hosted or customer-tenant deployment." We are not aware of another legal-operations platform that deploys inside the customer's own M365 tenant; some vendors offer customer-dedicated tenants, but those run in the vendor's cloud rather than the customer's.

---

## 3. The architecture: three core layers

Spaarke is built around three core layers: **Foundry IQ** for grounding and operational memory, the **Microsoft Agent Framework** for orchestration and execution, and **Microsoft Power Platform and Microsoft 365** for the operational and collaborative user experience. We don't say "AI-powered"; we say which layer is doing what.

### 3.1 Foundry IQ: grounding and operational memory

Foundry IQ is the grounding and memory layer. It indexes matters, documents, emails, tasks, prior work, and counsel-and-firm history into a structured grounding source so AI features operate on the customer's actual legal data rather than generic web text. It also retains operational memory: what the platform learned from prior matters informs what it does on the next one. In product it shows up in Find similar (semantic search), the relationship graph, AI-generated matter and document summaries, and the knowledge source M365 Copilot queries against. Built on Azure AI Foundry. Lets the user ask matter-specific questions in M365 Copilot and get answers grounded in their department's prior work and accumulated context rather than generic public-model answers.

### 3.2 Microsoft Agent Framework: orchestration and execution

The Microsoft Agent Framework is the orchestration and execution layer. It is Microsoft's enterprise-grade platform for building and running agentic and autonomous workflows. Microsoft is consolidating its agentic stack into the Agent Framework, which is why Spaarke's orchestration and execution layer sits there rather than around lower-level tools. AI and automation playbooks (in the AI & Automation module) build on this layer: visual workflows that combine AI analysis, conditional routing, and matter-aware actions. Agents read Foundry IQ grounding, take bounded actions in the platform (open matters, route invoices, draft via Word Copilot, post to Teams), and surface what they did to a human reviewer. The framing is "AI-directed, human-controlled": agents act inside guardrails, and a person stays accountable for the result.

### 3.3 Microsoft Power Platform and Microsoft 365: the user experience layer

This is where users actually meet the platform. Spaarke surfaces inside Outlook, Word, Teams, SharePoint, Microsoft 365 Copilot, and Power BI, plus the model-driven apps Spaarke composes on Power Platform. Native because each of those tools is already where the work happens; a separate Spaarke UI would defeat the point.

### 3.4 A note on Copilot Studio and Power Automate

Spaarke uses Microsoft low-code tools like Copilot Studio and Power Automate where they fit specific user contexts, but they are not core architectural components. Microsoft is consolidating its enterprise-grade agentic capabilities into the Microsoft Agent Framework; that is where Spaarke's orchestration and execution layer sits. Copilot Studio and Power Automate are useful for some user-facing surfaces, similar to how an enterprise might use Word and Excel for ad-hoc work without those being part of the core data architecture.

### 3.5 The legal operations ontology: the foundation

The ontology is the foundation of legal operations intelligence, and Spaarke provides a Legal Operations Intelligence ontology solution. Both statements are series positioning settled by the writer on 2026-09-21 (`articles/legal-operations-ontology/brief.md`, Topic and Must include; `articles/building-the-legal-operations-intelligence-platform/idea.md`, series decisions), and the second is the one product reference the ontology article allows, stated as a fact about what the company offers and without a comparison. The series works from one definition: an ontology is a model of the things a legal department works on, the attributes of those things, the relationships among them, the actions that may be taken on them, and the rules that govern those actions, bound to the systems where the data already sits. It has three parts, in this order.

- **Entities.** The series names a spine of matter, project, and invoice, with request, document, communication, party, engagement, timekeeper, obligation, deadline, clause, budget, and policy around it. Policy (OCG rules, triage rules, SLA definitions, and delegation thresholds, all legal-authored, versioned, and deterministically evaluable) and obligation (extracted from documents, linked to parties and dates, and changing status over time) are first-class entities. This is the conceptual model the article states. Which entities ship in product, and under which names, is **TBD — confirm**; the article discloses no internal entity or service names, per the brief's exclusions, and no piece should either.
- **Relationships.** The relationships are the asset, and the series names them concretely: communication to thread to matter; invoice line to timekeeper to activity code to matter to budget; document to clause to obligation to party to date; request to matter; and the engagement relationship, which binds the department's matter to the firm's matter.
- **Actions governed by rules.** Actions are bound to entities and carry authority (who, under which delegation policy) and provenance (which rule, which policy version, which evidence, and which person confirmed). The release envelope is automatic release, a single confirmation, and counsel review (green, yellow, and red), and it is the structural form of "AI-directed, human-controlled." The article states the envelope as Spaarke's design and cites no vendor's default for it. Whether the envelope ships in the current release, and in which module, is **TBD — confirm**.

Spaarke supports two deployment modes, and neither is the rule. In the first, Spaarke is the system of record for legal work, including the process entities that no other system holds (the request, the disposition, the obligation, the policy, the inquiry, and the action record), and the model and the record live in one place. In the second, Spaarke is the ontology architecture over the systems a department already runs: the document management system owns the documents, the e-billing platform owns the invoices, and the ontology binds each entity to the system where its data lives and references what it does not own. A department may run one mode or both, and a piece may say that the platform connects to existing systems of record where they serve well and supplies system of record capabilities where the department lacks them. These modes are distinct from the hosting models in section 2.3 (Spaarke-Hosted and Customer-Hosted); whether each mode is offered under both hosting models is **TBD — confirm**. The earlier working principle "originate the workflow, reference the record" and the earlier ban on consolidation claims are withdrawn.

Business intelligence is the deterministic dimension of the platform. It reads across the entities the ontology defines, computes facts such as a budget variance the same way every time, and reads back the decision record the ontology holds, and no piece frames the ontology as replacing business intelligence, the data warehouse, or the data lake. In product, Power BI carries this dimension (sections 2.2 and 4). The ontology gives structure to the Data and Memory layers of the Legal IQ stack, and Inference reads over it. How the ontology maps onto the three core layers in sections 3.1 to 3.3 (Foundry IQ, the Microsoft Agent Framework, and the Power Platform and Microsoft 365 surfaces) is **TBD — confirm**.

Several limits govern what a piece may claim about the ontology. Binding to the systems where the data sits is Spaarke's design principle, and no piece describes the binding as live or copy-free (`articles/legal-operations-ontology/brief.md`, Must include, the definition entry) or makes a zero-copy claim (`articles/building-the-legal-operations-intelligence-platform/idea.md`, model section, item 2 caution). Identity resolution across systems, bitemporality, and edge storage are open architectural questions, stated as requirements on the model and never as shipped capability. Write-back to a third-party system of record is stated as a requirement on the systems the department depends on (documented, permission-aware interfaces for reading and writing), the series worked example writes nothing to the e-billing system, and a shipped write-back capability is **TBD — confirm**. "Fact, observation, and inference" as public vocabulary for the three epistemic classes is **TBD — confirm**. Spaarke's own MCP server is roadmap material and is not public, and the internal layer numbers, entity and service names, waves, bootcamp, and pricing stay out of every piece, as does any framing of the two modes as a migration path or a commercial claim ("start where you are, move when you want").

---

## 4. Integration surfaces

Where the product shows up for users. Each is a surface inside a Microsoft tool the team already runs rather than a separate Spaarke UI.

- **Outlook (native add-in).** Save emails to the right matter, project, or document set without leaving Outlook. Native because email is where matter correspondence happens; a separate UI defeats the point.

- **Word (native add-in).** Save Word/Excel/PowerPoint files directly to Spaarke; co-author Word documents in place, every version anchored to its matter. Native because drafting is a Word activity; users won't leave Word to file a draft.

- **Microsoft Teams (Spaarke Teams app).** Matter-centric chat, files, and tasks inside Teams. Native because cross-functional matter conversations already happen in Teams.

- **Microsoft 365 Copilot (knowledge source).** Spaarke shows up in M365 Copilot so users ask matter-context questions from anywhere Copilot runs; "Word Copilot" drafts in-Word grounded in matter content. Native because Copilot is becoming the cross-app surface for AI questions; Spaarke's value is grounding it, not replacing it.

- **SharePoint (document storage).** Matter documents live in SharePoint document libraries with native versioning, metadata, and co-authoring; existing SharePoint governance covers Spaarke documents. Native because SharePoint is already the customer's document substrate; no parallel DMS. In the ontology mode, a document management system the department keeps stays the record for its documents, and how Spaarke binds to that system is **TBD — confirm** (section 3.5).

- **Power BI (cross-matter analytics).** Embedded dashboards on the Dataverse data model: cross-matter spend, performance, operational analytics. Native because the customer's analytics team already runs Power BI.

Additional surfaces in product but not headlined as integrations: **Power Automate** (workflow engine for matter routing, approvals, notifications) and the **Dataverse Web API** (standard REST for custom integrations).

---

## 5. What we don't claim

Negative-space list: claims we explicitly do not make. From `content-platform/tasks/00-inputs.md` §4 plus product-specific disclaimers. Nine entries.

1. **Replaces lawyers or paralegals.** Philosophy is "AI-directed, human-controlled" (T00 §7). The product augments judgment; it does not substitute for it.

2. **A productivity multiplier (10x, 5x, 3x).** Per T00 §4, unverifiable and simplistic. Story is operational intelligence and improved execution, not a numeric multiplier.

3. **"AI-powered."** Per T00 §4, too generic by 2026. We name which layer is doing what (Foundry IQ for grounding and memory, Microsoft Agent Framework for orchestration and execution) and which surface (Power Platform / M365 / Copilot) it appears on.

4. **"Fully autonomous" / "autonomous legal AI."** Per T00 §4, overstates current maturity and undermines trust. Agentic execution is bounded and supervised.

5. **Instant deployment.** Per `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`, deployments complete in weeks, not months. However, the timeline driver is configuration scope (matter taxonomies, workflow rules, security roles, migration), not technology. Real implementations have real effort.

6. **AI accuracy numbers without citing the underlying evaluation.** If a piece references accuracy, recall, or hallucination rates, it cites the eval. Otherwise it doesn't make the claim.

7. **"Transform your legal department."** Per T00 §4, empty consulting language. We describe operational improvements concretely.

8. **"ChatGPT for legal" / "Copilot for lawyers."** Per T00 §4, both undersell the platform and put Spaarke in the wrong category. Spaarke is the substrate Copilot and other AI run on, not a wrapper around them.

9. **Copilot accessory / contract-review tool / e-billing platform.** Per the v1.4 brief, those are crowded categories owned by other vendors. Spaarke is in a different category.

---

## 6. Differentiators

Factual statements supporting positioning, not sales superlatives. Framed as comparisons to alternatives.

- **Microsoft-native deployment, not adjacent SaaS.** Spaarke runs inside the customer's M365 tenant on Power Platform / Dataverse / SharePoint Embedded, not on vendor multi-tenant infrastructure with a Microsoft-flavored UI. Source: `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`, `content/blog/2026-02-08-tenant-dedicated-deployment.mdx`.

- **Customer-tenant hosting option.** Customer-Hosted (Tenant Dedicated Deployment) runs Spaarke inside the customer's own M365 tenant. We are not aware of another legal-operations platform that does this. Some vendors offer "customer-dedicated" tenants, but those still live in the vendor's cloud, not the customer's. Frame factually: "Spaarke deploys inside the customer's own M365 tenant; we are not aware of another legal-operations platform that does this. Other vendors offer dedicated-tenant deployments, but those run in the vendor's cloud."

- **Single platform across five modules.** Five modules on one Dataverse schema, so a matter carries its documents, emails, tasks, workspace, budget, and counsel performance on one record. In the ontology mode, Spaarke binds to the systems a department keeps, and those systems stay the record for what they hold (section 3.5). Most alternatives cover one or two of the five areas.

- **Three-stakeholder coverage: business, in-house counsel, outside counsel.** Per `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md`, this is the moat. Other platforms see one or two parties, and even when they see all three at the document level, the underlying AI grounding does not survive the engagement. Outside counsel use their own AI tool, grounded separately, on the same matter the in-house team is working in another tool. Spaarke's three-stakeholder model puts in-house and outside-counsel work against the same matter record, the same operational memory, and the same AI grounding. Source: positioning logic from `content/blog/2026-02-15-what-attorneys-need-to-know-about-ai.mdx` §Decision Four; consequences in `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx` (Outside-Counsel Data Question section) and `content/blog/2026-02-08-tenant-dedicated-deployment.mdx`.

- **Built-in AI, not bolted-on.** AI is a structured architecture (Foundry IQ for grounding and memory + Microsoft Agent Framework for orchestration and execution + Power Platform / M365 as the user experience) grounded in the platform's own data, not generic AI applied to unstructured email and documents.

- **Inherited Microsoft security posture.** Existing Entra ID, Conditional Access, DLP, sensitivity labels, audit logging, retention, and tenant-level compliance certifications (SOC 2 Type II, ISO 27001, HIPAA, FedRAMP, GDPR) cover Spaarke automatically. No separate vendor security perimeter. Source: `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`, `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.

- **Substrate for AI tools, not a Copilot accessory.** M365 Copilot, Word Copilot, and external tools (Harvey, Legora, custom agents) run on top of Spaarke's structured legal data ("AI tools run on Spaarke, not the reverse," per the v1.4 brief).

- **Native surfaces, not embedded iframes.** The Outlook add-in, Word add-in, Teams app, and Copilot knowledge source are first-class Microsoft surfaces, not Spaarke web views dropped into Microsoft chrome.

---

## 7. Common misconceptions

What readers often assume that's wrong. At least four entries (have six).

1. **"Spaarke is a SaaS app on vendor infrastructure."** Not when deployed Customer-Hosted. The Tenant Dedicated Deployment model runs Spaarke inside the customer's own M365 tenant; data stays in the customer environment, governed by the customer's existing Microsoft policies. The Spaarke-Hosted model exists for customers who want Microsoft-native without operating it themselves.

2. **"Spaarke is for litigation."** It's for all matter types: corporate legal work, contracts, M&A, regulatory, IP, investigations, employment, and litigation. The data model uses "matter" because the term spans all these (per the vocabulary discussion in `content-platform/spec.md` §5.6 and `content/blog/2026-03-31-spaarke-feature-specification.mdx`).

3. **"Spaarke needs a separate identity provider or user directory."** No. Authentication runs through the customer's Microsoft Entra ID. Existing SSO, MFA, and Conditional Access policies apply automatically. There are no Spaarke credentials for users to manage.

4. **"Spaarke replaces SharePoint as a DMS."** No. In the system of record mode, documents live in SharePoint Embedded, inside the customer's own M365 tenant, with SharePoint's native versioning, metadata, and co-authoring. Spaarke adds matter context, AI summaries, semantic search, and a relationship graph on top. In the ontology mode, a document management system the department keeps stays the record for its documents; how Spaarke binds to it is **TBD — confirm** (section 3.5).

5. **"Spaarke is a Microsoft 365 Copilot wrapper."** No. Copilot is one of several AI surfaces Spaarke exposes. The architectural claim is the reverse: Copilot runs on top of Spaarke as the cross-app question surface, grounded in Spaarke's structured legal data.

6. **"Spaarke needs significant infrastructure to deploy."** No virtual machines to provision, no databases to administer, no separate vendor servers. Deployment is a Power Platform managed-solution import into a Dataverse environment (per `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`). The deployment-timeline driver is configuration scope, not infrastructure.

---

## 8. Useful technical and numeric facts

Reference list: facts stable enough to reuse without re-verifying. Source or **TBD — confirm** on each.

- **Capability modules: 5** (Matter Management, Documents & Email, Collaboration, AI & Automation, Spend & Performance). Source: `src/content/home/capabilities.ts`.
- **Microsoft foundation surfaces on the foundation card: 7** (Power Platform, SharePoint, Microsoft 365 Apps, Outlook, Teams, M365 Copilot, Azure AI Foundry). Source: `src/content/home/capabilities.ts` `foundation.logos`.
- **Named integration surfaces in §4: 6** (Outlook, Word/Office, Teams, M365 Copilot, SharePoint, Power BI).
- **Spaarke core layers: 3** (Foundry IQ for grounding and operational memory; Microsoft Agent Framework for orchestration and execution; Power Platform + M365 for the user experience). Source: `src/app/platform/page.tsx`.
- **Hosting models: 2** (Spaarke-Hosted, Customer-Hosted). Source: `src/components/sections/DeploymentModels.tsx`.
- **Deployment modes: 2** (Spaarke as the system of record for legal work; Spaarke as the ontology architecture over the systems a department already runs), distinct from the hosting models in section 2.3, and a department may run both. Whether each mode is offered under both hosting models is **TBD — confirm**. Source: series positioning settled by the writer on 2026-09-21 (section 3.5).
- **Runtime stack**: Power Apps (model-driven and canvas) on Dataverse; Power Automate; SharePoint Embedded (canonical document layer in the system of record mode, in the customer's tenant; see 3.5); Power BI; M365 Copilot; Azure AI Foundry. Source: `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.
- **Identity**: Microsoft Entra ID (formerly Azure AD).
- **Compliance certifications inherited from the M365 tenant**: SOC 2 Type II, ISO 27001, HIPAA, FedRAMP, GDPR. Source: `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`.
- **Power Platform SLA inherited**: 99.9% uptime. Source: `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.
- **Backup model**: standard Dataverse backup, automatic every 24 hours, on-demand backups, point-in-time restore within retention window. Source: same.
- **M365 / Copilot adoption (Fortune 500)**: more than 70% of the Fortune 500 had adopted M365 Copilot at Microsoft FY25 Q1 (October 2024). The Microsoft 2026 Work Trend Index reports 15M paid M365 Copilot seats and 420M monthly active Copilot users in early 2026. Use the F500 Copilot figure as a proxy for "Microsoft is where enterprise legal departments already live." Copilot adoption requires M365, so the install-base implication holds. Source: `voice/research-sources.md` (Microsoft FY25 Q1 earnings call; Microsoft 2026 Work Trend Index).
- **Copilot adoption (corporate legal specifically)**: among in-house legal departments using AI, ~40% use Microsoft Copilot, second only to ChatGPT at ~74% (Counselwell/Spellbook 2025; n=256, Canadian-skewed). 92% of legal professionals use at least one AI tool daily (Wolters Kluwer 2026 Future Ready Lawyer; n=810, multi-country, mixed firm/in-house). 52% of in-house legal departments now use generative AI, up from 23% the prior year (ACC × Everlaw 2025). Source: `voice/research-sources.md`. **Note**: the previous in-platform claim ">50% of legal organizations use Microsoft Copilot as their AI tool" (in `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`) overstates Microsoft-specific adoption; verified figures are closer to 40% Copilot among AI-adopting in-house legal. Flag for blog-post correction in T11.
- **Product launch year**: 2026. Primary CTA is "Get access" (early access) as of 2026-05-06.
- **Spaarke licensing**: per-user; includes managed solution, configuration support, updates, standard support. Implementation services scoped separately. Source: `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.
- **Microsoft licensing prerequisites**: M365 E3 or E5 (or equivalent); Power Apps per-user or per-app; Dataverse storage; M365 Copilot (optional, required for AI features). Source: same.
- **Canonical positioning line**: "Spaarke: The Legal Operations Intelligence Platform / Built to Raise the IQ of Legal Work." Source: `content-platform/tasks/00-inputs.md` §7 (the source joins the name and the descriptor with a spaced em dash, U+2014, and prints the second half on its own line; written here with a colon and a slash per the house punctuation rule, and the dash is not reproduced in this file).
- **Platform-page tagline**: "One platform. All sides. Every matter." Subhead: "All your legal work, connected." Source: `src/app/platform/page.tsx` (the live page joins the two halves of the subhead with an unspaced em dash, U+2014; written here with a comma per the house punctuation rule, and the dash is not reproduced in this file).
- **Home-page tagline (v1.4 brief)**: "See all sides of every matter." Source: `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md`.

---

*End of reference document. Update when product surfaces change in `src/app/platform/page.tsx`, `src/content/home/capabilities.ts`, or `src/components/sections/DeploymentModels.tsx`. Resolve **TBD — confirm** items in T11.*

---

*Locked 2026-05-07. Positioning aligned 2026-09-22 (both deployment modes); see git log for history.*
