# Product knowledge — reference

**Phase**: 0 (T05) · first draft, team revises in T11.
**Purpose**: factual reference about the Spaarke product so a writer can make accurate claims without re-deriving them every session. Not narrative. Pulled in selectively per piece.

Sources cited inline. Anything uncertain is tagged **TBD — confirm**.

---

## 1. The platform in one paragraph

Spaarke is a Legal Operations Intelligence platform for the business, in-house counsel, and outside counsel — built on Microsoft 365 (Power Platform, Dataverse, SharePoint Embedded, Microsoft 365 Apps, Azure AI Foundry). It consolidates matters, projects, documents, communications, spend, performance, AI, and agentic workflows into a single shared platform that runs inside the customer's Microsoft tenant rather than on vendor-controlled infrastructure. Spaarke launched in 2026 and is in early access as of 2026-05-06 (per the website's primary CTA, "Get access," on `/platform` and `/`).

Source: `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md` §Project; `src/app/platform/page.tsx`; `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.

Boilerplate-ready short form (one to two sentences):

> Spaarke is a Legal Operations Intelligence platform built on Microsoft 365. It connects the business, in-house counsel, and outside counsel on a single platform — matters, documents, collaboration, AI, and spend — inside the customer's own tenant.

---

## 2. Architecture

### 2.1 The five capability modules

Module names and descriptions below are canonical, verbatim from `src/content/home/capabilities.ts` as of 2026-05-06. Module IDs (used as `/platform` deep-link anchors) in parentheses.

1. **Matter Management** (`matter-management`). A unified system for managing matters with complete visibility into work, documents, collaboration, and external counsel. Features: matter and project records, personal workspaces, daily briefings, smart to-do, AI quick create.

2. **Documents & Email** (`documents-email`). Every document and email connected to its matter, AI-summarized, and discoverable through semantic search. Features: document records, Find similar (Azure AI semantic search), relationship graph, email capture (Outlook), Office integration (Word/Excel/PowerPoint save-to-Spaarke).

3. **Collaboration** (`collaboration`). Secure shared workspaces for everyone working a matter — internal teams, business clients, and outside counsel. Features: secure project workspaces, outside counsel access, Word co-creation, shared matters and projects, Teams app.

4. **AI & Automation** (`ai-automation`). AI summaries, Copilot-native experiences, and event-driven playbooks. Features: AI-generated matter summaries, M365 Copilot integration, auto-created document profiles, Word Copilot drafting, AI and automation playbooks.

5. **Spend & Performance** (`spend-performance`). The financial and operational truth about every matter and every firm — invoices, budgets, OCG compliance, outcomes. Features: outside counsel performance metrics, matter report cards, billing-to-matter roll-up, budget tracking, Power BI dashboards.

Earlier names (Workspace, Document Intelligence, Outside Counsel Engagement, AI Workflows, Performance Intelligence) are retired per `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md`.

### 2.2 The Microsoft foundation

The seven Microsoft surfaces named on the platform foundation card (`src/content/home/capabilities.ts`, `foundation.logos`): Power Platform, SharePoint, Microsoft 365 Apps, Outlook, Teams, Microsoft 365 Copilot, Azure AI Foundry.

Underneath, per `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`:

- **Runtime**: model-driven and canvas Power Apps on Dataverse.
- **Data layer**: Microsoft Dataverse — matters, invoices, workflows, operational memory.
- **Document storage**: SharePoint Embedded (SPE) is the canonical document layer. SPE stores documents inside the customer's own Microsoft 365 tenant rather than in vendor-controlled storage, lets Spaarke control the user experience and the integration with the Legal Operations Intelligence platform, and makes every file semantic-indexed so it is reachable by Spaarke AI without leaving the tenant. Native SharePoint capabilities — versioning, metadata, co-authoring — apply.
- **Identity**: Microsoft Entra ID (formerly Azure AD).
- **Automation**: Power Automate.
- **Analytics**: Power BI (embedded dashboards on the Dataverse data model).
- **AI**: Microsoft 365 Copilot integration; Azure AI Foundry for grounded inference.

### 2.3 Hosting models

Two deployment models, surfaced on `/platform` via the architecture compare slider (`src/components/sections/DeploymentModels.tsx`):

- **Spaarke-Hosted**. Spaarke runs Platform Modules, Portal, Data & Analytics, and Infrastructure on Spaarke-managed tenancy. The customer's M365 tenant connects via Entra ID, Exchange, SharePoint, and Copilot Studio.

- **Customer-Hosted** (also "Tenant Dedicated Deployment" in long-form — see `content/blog/2026-02-08-tenant-dedicated-deployment.mdx`). Spaarke modules and portal sit inside the customer's own M365 tenant. Same architecture, customer's tenancy, customer's governance. Data never leaves the customer environment; existing Entra ID, Conditional Access, DLP, sensitivity labels, and audit logging cover Spaarke automatically.

Platform-page positioning: "Spaarke is the only legal SaaS solution that offers the option of fully hosted or customer-tenant deployment." We are not aware of another legal-operations platform that deploys inside the customer's own M365 tenant; some vendors offer customer-dedicated tenants, but those run in the vendor's cloud rather than the customer's.

---

## 3. The AI layer — the three "Spaarke AI" pillars

Spaarke's AI is a structured layer with three named pillars. We don't say "AI-powered" — we say which pillar is doing what.

Pillar source: `src/app/platform/page.tsx` (SpaarkeAI section) describes "Foundry IQ knowledge, Copilot Studio orchestration, and the Agent Framework" surfacing as "generative, agentic, and autonomous capabilities across Teams, Outlook, Word, and Microsoft 365."

### 3.1 Foundry IQ — knowledge grounding

Foundry IQ is the knowledge layer. It indexes matters, documents, emails, tasks, prior work, and counsel-and-firm history into a structured grounding source so AI features operate on the customer's actual legal data rather than generic web text. In product it shows up in Find similar (semantic search), the relationship graph, AI-generated matter and document summaries, and the knowledge source M365 Copilot queries against. Built on Azure AI Foundry (per `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md`). Lets the user ask matter-specific questions in M365 Copilot and get answers grounded in their department's prior work — not generic public-model answers.

### 3.2 Copilot Studio — orchestration

Copilot Studio is the orchestration layer — the connective tissue between user prompts, knowledge grounding, and downstream actions. Used to compose Spaarke's matter-aware experiences inside M365 Copilot and Teams (matter Q&A, briefings, intake flows, approvals) and to expose Spaarke as a Copilot knowledge source rather than a separate chat UI. Microsoft Copilot Studio is the named Microsoft product Spaarke builds on. Lets the user ask once, in the Copilot they already use, and have the right grounding plus the right action wired in.

### 3.3 Agent Framework — execution

The Agent Framework is the execution layer — the agentic capability that turns playbooks into running automations. The third pillar maps to **Microsoft Agent Framework** — Microsoft's enterprise-grade platform for building and orchestrating agentic and autonomous agents, comparable in scope to the agent frameworks emerging from other major AI vendors. It is a real Microsoft product, not Spaarke-coined terminology.

AI and automation playbooks (in the AI & Automation module) build on this layer: visual workflows that combine AI analysis, conditional routing, and matter-aware actions. Agents read Foundry IQ grounding, take bounded actions in the platform (open matters, route invoices, draft via Word Copilot, post to Teams), and surface what they did to a human. The framing is "AI-directed, human-controlled" (per `projects/content-platform/tasks/00-inputs.md` §7).

---

## 4. Integration surfaces

Where the product shows up for users. Each is a surface inside a Microsoft tool the team already runs — not a separate Spaarke UI.

- **Outlook (native add-in)** — save emails to the right matter, project, or document set without leaving Outlook. Native because email is where matter correspondence happens; a separate UI defeats the point.

- **Word (native add-in)** — save Word/Excel/PowerPoint files directly to Spaarke; co-author Word documents in place, every version anchored to its matter. Native because drafting is a Word activity; users won't leave Word to file a draft.

- **Microsoft Teams (Spaarke Teams app)** — matter-centric chat, files, and tasks inside Teams. Native because cross-functional matter conversations already happen in Teams.

- **Microsoft 365 Copilot (knowledge source)** — Spaarke shows up in M365 Copilot so users ask matter-context questions from anywhere Copilot runs; "Word Copilot" drafts in-Word grounded in matter content. Native because Copilot is becoming the cross-app surface for AI questions; Spaarke's value is grounding it, not replacing it.

- **SharePoint (document storage)** — matter documents live in SharePoint document libraries with native versioning, metadata, and co-authoring; existing SharePoint governance covers Spaarke documents. Native because SharePoint is already the customer's document substrate; no parallel DMS.

- **Power BI (cross-matter analytics)** — embedded dashboards on the Dataverse data model: cross-matter spend, performance, operational analytics. Native because the customer's analytics team already runs Power BI.

Additional surfaces in product but not headlined as integrations: **Power Automate** (workflow engine for matter routing, approvals, notifications) and the **Dataverse Web API** (standard REST for custom integrations).

---

## 5. What we don't claim

Negative-space list — claims we explicitly do not make. From `projects/content-platform/tasks/00-inputs.md` §4 plus product-specific disclaimers. Nine entries.

1. **Replaces lawyers or paralegals.** Philosophy is "AI-directed, human-controlled" (T00 §7). The product augments judgment; it does not substitute for it.

2. **A productivity multiplier (10x, 5x, 3x).** Per T00 §4, unverifiable and simplistic. Story is operational intelligence and improved execution, not a numeric multiplier.

3. **"AI-powered."** Per T00 §4, too generic by 2026. We name what the AI does — Foundry IQ grounding, Copilot Studio orchestration, Agent Framework execution — and which surface it appears on.

4. **"Fully autonomous" / "autonomous legal AI."** Per T00 §4, overstates current maturity and undermines trust. Agentic execution is bounded and supervised.

5. **Instant deployment.** Per `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`, deployments complete in weeks, not months — but the timeline driver is configuration scope (matter taxonomies, workflow rules, security roles, migration), not technology. Real implementations have real effort.

6. **AI accuracy numbers without citing the underlying evaluation.** If a piece references accuracy, recall, or hallucination rates, it cites the eval. Otherwise it doesn't make the claim.

7. **"Transform your legal department."** Per T00 §4, empty consulting language. We describe operational improvements concretely.

8. **"ChatGPT for legal" / "Copilot for lawyers."** Per T00 §4, both undersell the platform and put Spaarke in the wrong category. Spaarke is the substrate Copilot and other AI run on, not a wrapper around them.

9. **Copilot accessory / contract-review tool / e-billing platform.** Per the v1.4 brief, those are crowded categories owned by other vendors. Spaarke is in a different category.

---

## 6. Differentiators

Factual statements supporting positioning — not sales superlatives. Framed as comparisons to alternatives.

- **Microsoft-native deployment, not adjacent SaaS.** Spaarke runs inside the customer's M365 tenant on Power Platform / Dataverse / SharePoint Embedded, not on vendor multi-tenant infrastructure with a Microsoft-flavored UI. Source: `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`, `content/blog/2026-02-08-tenant-dedicated-deployment.mdx`.

- **Customer-tenant hosting option.** Customer-Hosted (Tenant Dedicated Deployment) runs Spaarke inside the customer's own M365 tenant. We are not aware of another legal-operations platform that does this. Some vendors offer "customer-dedicated" tenants, but those still live in the vendor's cloud — not the customer's. Frame factually: "Spaarke deploys inside the customer's own M365 tenant; we are not aware of another legal-operations platform that does this. Other vendors offer dedicated-tenant deployments, but those run in the vendor's cloud."

- **Single platform across five modules, not point tools.** Five modules on one Dataverse schema. Most alternatives cover one or two and integrate across the boundary.

- **Three-stakeholder coverage: business, in-house counsel, outside counsel.** Per `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md`, this is the moat. Other platforms see one or two parties — and even when they see all three at the document level, the underlying AI grounding does not survive the engagement. Outside counsel use their own AI tool, grounded separately, on the same matter the in-house team is working in another tool. Spaarke's three-stakeholder model puts in-house and outside-counsel work against the same matter record, the same operational memory, and the same AI grounding. Source: positioning logic from `content/blog/2026-02-15-what-attorneys-need-to-know-about-ai.mdx` §Decision Four; consequences in `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx` (Outside-Counsel Data Question section) and `content/blog/2026-02-08-tenant-dedicated-deployment.mdx`.

- **Built-in AI, not bolted-on.** AI is a structured layer (Foundry IQ + Copilot Studio + Agent Framework) grounded in the platform's own data — not generic AI applied to unstructured email and documents.

- **Inherited Microsoft security posture.** Existing Entra ID, Conditional Access, DLP, sensitivity labels, audit logging, retention, and tenant-level compliance certifications (SOC 2 Type II, ISO 27001, HIPAA, FedRAMP, GDPR) cover Spaarke automatically. No separate vendor security perimeter. Source: `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`, `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.

- **Substrate for AI tools, not a Copilot accessory.** M365 Copilot, Word Copilot, and external tools (Harvey, Legora, custom agents) run on top of Spaarke's structured legal data — "AI tools run on Spaarke, not the reverse" per the v1.4 brief.

- **Native surfaces, not embedded iframes.** Outlook add-in, Word add-in, Teams app, Copilot knowledge source — first-class Microsoft surfaces, not Spaarke web views dropped into Microsoft chrome.

---

## 7. Common misconceptions

What readers often assume that's wrong. At least four entries (have six).

1. **"Spaarke is a SaaS app on vendor infrastructure."** Not when deployed Customer-Hosted. The Tenant Dedicated Deployment model runs Spaarke inside the customer's own M365 tenant — data stays in the customer environment, governed by the customer's existing Microsoft policies. The Spaarke-Hosted model exists for customers who want Microsoft-native without operating it themselves.

2. **"Spaarke is for litigation."** It's for all matter types — corporate legal work, contracts, M&A, regulatory, IP, investigations, employment, and litigation. The data model uses "matter" because the term spans all these (per the vocabulary discussion in `projects/content-platform/spec.md` §5.6 and `content/blog/2026-03-31-spaarke-feature-specification.mdx`).

3. **"Spaarke needs a separate identity provider or user directory."** No. Authentication runs through the customer's Microsoft Entra ID. Existing SSO, MFA, and Conditional Access policies apply automatically. There are no Spaarke credentials for users to manage.

4. **"Spaarke replaces SharePoint as a DMS."** No. Documents live in SharePoint Embedded — inside the customer's own M365 tenant — with SharePoint's native versioning, metadata, and co-authoring. Spaarke adds matter context, AI summaries, semantic search, and a relationship graph on top.

5. **"Spaarke is a Microsoft 365 Copilot wrapper."** No. Copilot is one of several AI surfaces Spaarke exposes. The architectural claim is the reverse: Copilot runs on top of Spaarke as the cross-app question surface, grounded in Spaarke's structured legal data.

6. **"Spaarke needs significant infrastructure to deploy."** No virtual machines to provision, no databases to administer, no separate vendor servers. Deployment is a Power Platform managed-solution import into a Dataverse environment (per `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`). The deployment-timeline driver is configuration scope, not infrastructure.

---

## 8. Useful technical and numeric facts

Reference list — facts stable enough to reuse without re-verifying. Source or **TBD — confirm** on each.

- **Capability modules: 5** (Matter Management, Documents & Email, Collaboration, AI & Automation, Spend & Performance). Source: `src/content/home/capabilities.ts`.
- **Microsoft foundation surfaces on the foundation card: 7** (Power Platform, SharePoint, Microsoft 365 Apps, Outlook, Teams, M365 Copilot, Azure AI Foundry). Source: `src/content/home/capabilities.ts` `foundation.logos`.
- **Named integration surfaces in §4: 6** (Outlook, Word/Office, Teams, M365 Copilot, SharePoint, Power BI).
- **Spaarke AI pillars: 3** (Foundry IQ, Copilot Studio, Agent Framework). Source: `src/app/platform/page.tsx`.
- **Hosting models: 2** (Spaarke-Hosted, Customer-Hosted). Source: `src/components/sections/DeploymentModels.tsx`.
- **Runtime stack**: Power Apps (model-driven and canvas) on Dataverse; Power Automate; SharePoint Embedded (canonical document layer, in the customer's tenant); Power BI; M365 Copilot; Azure AI Foundry. Source: `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.
- **Identity**: Microsoft Entra ID (formerly Azure AD).
- **Compliance certifications inherited from the M365 tenant**: SOC 2 Type II, ISO 27001, HIPAA, FedRAMP, GDPR. Source: `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`.
- **Power Platform SLA inherited**: 99.9% uptime. Source: `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.
- **Backup model**: standard Dataverse backup, automatic every 24 hours, on-demand backups, point-in-time restore within retention window. Source: same.
- **M365 / Copilot adoption — Fortune 500**: more than 70% of the Fortune 500 had adopted M365 Copilot at Microsoft FY25 Q1 (October 2024). The Microsoft 2026 Work Trend Index reports 15M paid M365 Copilot seats and 420M monthly active Copilot users in early 2026. Use the F500 Copilot figure as a proxy for "Microsoft is where enterprise legal departments already live" — Copilot adoption requires M365, so the install-base implication holds. Source: `voice/research-sources.md` (Microsoft FY25 Q1 earnings call; Microsoft 2026 Work Trend Index).
- **Copilot adoption — corporate legal specifically**: among in-house legal departments using AI, ~40% use Microsoft Copilot — second only to ChatGPT at ~74% (Counselwell/Spellbook 2025; n=256, Canadian-skewed). 92% of legal professionals use at least one AI tool daily (Wolters Kluwer 2026 Future Ready Lawyer; n=810, multi-country, mixed firm/in-house). 52% of in-house legal departments now use generative AI, up from 23% the prior year (ACC × Everlaw 2025). Source: `voice/research-sources.md`. **Note**: the previous in-platform claim ">50% of legal organizations use Microsoft Copilot as their AI tool" (in `content/blog/2026-01-25-why-we-built-on-microsoft.mdx`) overstates Microsoft-specific adoption — verified figures are closer to 40% Copilot among AI-adopting in-house legal. Flag for blog-post correction in T11.
- **Product launch year**: 2026. Primary CTA is "Get access" (early access) as of 2026-05-06.
- **Spaarke licensing**: per-user; includes managed solution, configuration support, updates, standard support. Implementation services scoped separately. Source: `content/blog/2026-03-28-spaarke-for-your-it-team.mdx`.
- **Microsoft licensing prerequisites**: M365 E3 or E5 (or equivalent); Power Apps per-user or per-app; Dataverse storage; M365 Copilot (optional, required for AI features). Source: same.
- **Canonical positioning line**: "Spaarke — The Legal Operations Intelligence Platform / Built to Raise the IQ of Legal Work." Source: `projects/content-platform/tasks/00-inputs.md` §7.
- **Platform-page tagline**: "One platform. All sides. Every matter." Subhead: "All your legal work—connected." Source: `src/app/platform/page.tsx`.
- **Home-page tagline (v1.4 brief)**: "See all sides of every matter." Source: `projects/website-version-2/spaarke-home-page-creative-brief-v1.4.md`.

---

*End of reference document. Update when product surfaces change in `src/app/platform/page.tsx`, `src/content/home/capabilities.ts`, or `src/components/sections/DeploymentModels.tsx`. Resolve **TBD — confirm** items in T11.*

---

*Locked 2026-05-07 — see git log for history.*
