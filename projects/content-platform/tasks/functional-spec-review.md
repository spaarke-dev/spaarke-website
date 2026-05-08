# Functional spec — voice & accuracy review

Read-only review of `content/blog/2026-03-31-spaarke-feature-specification.mdx`
against the Phase 0 voice constitution
(`projects/content-platform/voice/*`) and the live platform copy
(`src/content/home/capabilities.ts`, `src/app/platform/page.tsx`).

The team will decide whether to apply the suggested edits. This review
does not modify the spec.

---

## 1. Document profile

- **File path**: `c:\code_files\spaarke-website-wt-content-platform\content\blog\2026-03-31-spaarke-feature-specification.mdx`
- **Word count**: 2,676 words (`wc -w`).
- **Frontmatter**:
  - `title`: "The Spaarke Platform: Feature Specification"
  - `date`: "2026-03-31" / `posted`: "2026-04-01"
  - `author`: "Spaarke Team"
  - `tags.theme`: `iq-stack, legal-operations-intelligence, platform, microsoft-ecosystem, buyer-enablement`
  - `tags.topic`: matter-management, invoicing, e-billing, legal-spend, dms, workflow, contracts, reporting, ai-copilot, compliance, vendor-management
  - `draft`: false
- **Top-level structure (H2 list)**:
  1. (Untitled lead, lines 17–22)
  2. Platform Foundation
  3. Data Layer Capabilities — H3 children: Unified Matter Management, Legal Spend Management, Document Management, Workflow Engine, Data Integration
  4. Memory Layer Capabilities — H3 children: Matter Context Capture, Precedent Library, Relationship Intelligence, Process Templates
  5. Inference Layer Capabilities — H3 children: Spend Analytics and Forecasting, Matter Intelligence, Copilot Integration, Reporting and Dashboards, Alerts and Automation
  6. Cross-Functional Capabilities (no H3 subsections)
  7. Where to Go Next
- **Last modified (git)**: 2026-05-01T14:40:30-04:00 (commit `feat(content): hero images for all 16 articles + per-article positioning`). The file is `draft: false` and is currently published-ready in the blog content tree.

---

## 2. Accuracy assessment

Symbol key: ✅ matches voice/product-knowledge and platform copy · ⚠ conflicts with the voice constitution · ? unverifiable from current sources, flag for team.

### Microsoft foundation

⚠ **Line 27 — "built on Microsoft Power Platform — Power Apps, Power Automate, Dataverse, and Power BI."**
Per `voice/product-knowledge.md` §2.2, the canonical Microsoft foundation has **seven** named surfaces (Power Platform, SharePoint, Microsoft 365 Apps, Outlook, Teams, M365 Copilot, Azure AI Foundry). The spec collapses this to four Power Platform components and omits Azure AI Foundry, M365 Copilot, Microsoft 365 Apps, Teams, and Outlook from the foundation list. Two consequences: (a) Azure AI Foundry never appears anywhere in the spec, (b) the "Built on Microsoft" framing is narrower than what the homepage and product-knowledge document tell the reader.

⚠ **Line 29 — "Documents live in SharePoint."** This is the single most important inaccuracy in the doc. Per `voice/product-knowledge.md` §2.2, §7.4, and `voice/vocabulary.md` (DMS row), Spaarke documents live in **SharePoint Embedded (SPE)** — not vanilla SharePoint document libraries. SPE is a deliberate architectural choice and a differentiator: it stores documents inside the customer's own M365 tenant, lets Spaarke control the document UX and the integration with the LOI platform, and makes every file semantic-indexed for AI grounding. The spec uses "SharePoint" alone seven times (lines 29, 60, 62, 63, 65, 82, 100) and never uses "SharePoint Embedded." This conflicts with product-knowledge §7.4 ("Spaarke replaces SharePoint as a DMS — No. Documents live in SharePoint Embedded… Spaarke adds matter context, AI summaries, semantic search, and a relationship graph on top.")

⚠ **Lines 60–66 — "SharePoint-native storage… No separate DMS to license, manage, or integrate."** The framing that Spaarke "does not require a separate DMS" because documents "live in SharePoint" understates the architecture. In SPE, documents are stored in customer-tenant containers managed through Spaarke's SPE app, with semantic indexing tied to Foundry IQ. The current copy reads as "we use the SharePoint your team already uses for files," which is not accurate.

### Tenant-dedicated deployment

⚠ **Line 27 — "deploys directly into your organization's Microsoft 365 tenant through Tenant Dedicated Deployment."** Per `voice/product-knowledge.md` §2.3, Spaarke offers **two** deployment models: **Spaarke-Hosted** and **Customer-Hosted** (long-form: Tenant Dedicated Deployment). The spec presents customer-tenant deployment as the only option, which understates flexibility and contradicts the architecture compare slider on `/platform` (`src/components/sections/DeploymentModels.tsx`). Customer-tenant is the differentiator the team wants emphasized — but as one of two, not as the only model.

? **Line 29 — "AI capabilities operate through the Microsoft 365 Copilot plane, within your tenant boundary, with no data egress."** "Microsoft 365 Copilot plane" is not a phrase used in `voice/product-knowledge.md` and does not appear on `/platform`. Product-knowledge §3 names three pillars — Foundry IQ (Azure AI Foundry), Copilot Studio, Agent Framework — that together comprise Spaarke's AI layer. The "Copilot plane" framing also conflicts with §7.5 ("Spaarke is a Microsoft 365 Copilot wrapper — No. Copilot is one of several AI surfaces Spaarke exposes. The architectural claim is the reverse: Copilot runs on top of Spaarke."). Flag for team.

### The five capability modules

⚠ **Section structure (lines 35–193).** The spec organizes the platform around the **Legal IQ stack layers** (Data / Memory / Inference / Cross-Functional) rather than the **five capability modules** that the home page and `/platform` are built on. Per `voice/product-knowledge.md` §2.1, the canonical modules — verbatim from `src/content/home/capabilities.ts` as of 2026-05-06 — are:

| Canonical module name | Description (from capabilities.ts) | Where in this spec? |
|---|---|---|
| **Matter Management** | "A unified system for managing matters with complete visibility into work, documents, collaboration, and external counsel." | Partial — "Unified Matter Management" subsection (line 39) |
| **Documents & Email** | "Every document and email connected to its matter, AI-summarized, and discoverable through semantic search." | Partial — "Document Management" subsection (line 58); email capture / Outlook native add-in are not named |
| **Collaboration** | "Secure shared workspaces for everyone working a matter — internal teams, business clients, and outside counsel, in one place." | **Absent.** No section on outside-counsel access, secure project workspaces, Teams app, or Word co-creation. |
| **AI & Automation** | "AI summaries, Copilot-native experiences, and event-driven playbooks…" | Partial — "Copilot Integration" subsection (line 153); **AI and automation playbooks** as the canonical Spaarke product surface are missing as a named feature (only the generic "Workflow Engine" is described). |
| **Spend & Performance** | "The financial and operational truth about every matter and every firm — invoices, budgets, OCG compliance, and outcomes." | Partial — "Legal Spend Management" (line 48) plus "Spend Analytics and Forecasting" (line 134); the canonical phrase "Spend & Performance" and the **outside counsel report card / matter report card** features are not named. |

The five-module taxonomy is the structure the home page and `/platform` are built on. A "feature specification" article that does not match it creates an alignment problem the team will hit on every cross-link. The Legal IQ stack frame is not wrong — but it is the *narrative* frame, not the *product* frame. Compare with `voice/brand-positioning.md` §2 (themes 3–4): the Legal IQ stack names the architecture; the five modules are the proof points.

### Three Spaarke AI pillars

⚠ **Section "Copilot Integration" (lines 153–161).** Per `voice/product-knowledge.md` §3, Spaarke AI has three named pillars: **Foundry IQ** (knowledge grounding, Azure AI Foundry), **Copilot Studio** (orchestration), and **Microsoft Agent Framework** (execution, agentic). The spec names none of these. "Copilot Integration" is the only AI section, and it describes only the Copilot surface — the cross-app question pane — not the underlying AI architecture. Result:

- Foundry IQ → not named anywhere
- Copilot Studio → not named anywhere
- Microsoft Agent Framework → not named anywhere
- Azure AI Foundry → not named anywhere

This is the second-largest gap in the doc (after SharePoint Embedded). The product-knowledge doc warns explicitly: "We don't say 'AI-powered' — we say which pillar is doing what." See §4 below for the consequence.

### AI feature claims

⚠ **Line 159 — "Recommendations: Suggested outside counsel, estimated budgets, and recommended approaches based on your organization's own precedent."** The "outside counsel recommendation" capability is not in `src/content/home/capabilities.ts` as a named feature and is not named in `voice/product-knowledge.md` §2.1 or §3. The Spend & Performance module names "outside counsel performance metrics" and "report cards," which is benchmarking/scoring, not recommendation. Flag for team — either this is a roadmap claim that should be removed, or the capabilities canon needs to be updated.

? **Line 160 — "Draft generation: Matter summaries, board reports, and status updates generated from structured data. A quarterly litigation summary that once took days can be drafted in minutes."** The "days → minutes" claim is unsourced. Per `voice/style-guide.md` §5 item 12 ("No claims without a defense"), this needs either an evaluation citation or removal. Flag for team.

? **Line 142 — "Anomaly detection: Invoices outside historical norms are flagged for review automatically."** Anomaly detection is plausibly an Agent Framework playbook outcome, but it is not in the canonical capabilities list. Flag — confirm or attribute to the playbook layer.

? **Line 76 — "Power Automate's 500+ pre-built connectors"** and line 83 — "500+ pre-built connectors for enterprise systems including SAP, ServiceNow, Salesforce, Workday, and DocuSign." Microsoft's published connector count is over 1,000 (and changes monthly). "500+" is a Spaarke-side figure that should either cite a source or be replaced with "Power Automate's library of pre-built connectors." Flag.

### Things that match

✅ **Line 17 reference to the Legal IQ stack series.** Pieces are cross-linked correctly to `the-iq-stack`, `tenant-dedicated-deployment`, `spaarke-for-your-it-team`, `the-20b-blind-spot`, `institutional-knowledge`, `breaking-the-silo`, `loi-maturity-model`, `what-is-legal-operations-intelligence`, `what-attorneys-need-to-know-about-ai`, `ai-without-giving-away-the-keys`. All are real, published articles.

✅ **Line 28 — "Identity management flows through Microsoft Entra ID."** Matches product-knowledge §2.2.

✅ **Line 75 — "Notifications flow through Teams, Outlook, and in-app alerts."** Matches integration-surfaces story, §4 of product-knowledge.

✅ **Line 167 — "Power BI embedded analytics."** Matches product-knowledge §4 (Power BI as a named integration surface).

✅ **Line 191 — board reporting and finance-integration framing.** Matches the cross-functional story in `breaking-the-silo` and brand-positioning §2 ("the system of record for legal work — all sides, every matter").

---

## 3. Completeness assessment

### What product-knowledge covers that the spec misses

1. **SharePoint Embedded** as the document layer — see §2 above. No mention.
2. **Three Spaarke AI pillars** (Foundry IQ, Copilot Studio, Agent Framework) — none named.
3. **Azure AI Foundry** — not named.
4. **Two deployment models** — only customer-tenant is described.
5. **Collaboration module** — outside-counsel access, secure project workspaces, Teams app, Word co-creation: none of these named features appear, even though Collaboration is one of the five canonical modules and the three-stakeholder coverage (business / in-house / outside counsel) is one of the four core narrative themes (`brand-positioning.md` §2 and §4 proof points).
6. **Native Outlook add-in** as a product surface — line 82 mentions "M365 native integration" in passing but does not name the Outlook add-in (save-to-Spaarke), which is the integration-surface story per product-knowledge §4.
7. **Native Word add-in** — same; Word/Excel/PowerPoint save-to-Spaarke is not named.
8. **Find similar (Azure AI semantic search)** — the canonical Documents & Email feature is missing.
9. **Relationship graph** — canonical Documents & Email feature missing.
10. **AI-generated matter summaries** as a named feature — described generically as "Draft generation" but not by its product name.
11. **AI quick create** — canonical Matter Management feature, missing.
12. **OCG compliance** — vocabulary §3 calls this out as the key acronym, and Spend & Performance is canonically about "OCG compliance and outcomes." The spec mentions "billing guideline enforcement" but never uses the term "OCG" or "outside counsel guidelines." For corporate-counsel and legal-ops-director personas, OCG is the acronym they use daily (`audience-personas.md`).
13. **Inherited M365 security posture** (Conditional Access, DLP, sensitivity labels, Purview, SOC 2 / ISO 27001 / HIPAA / FedRAMP / GDPR) — line 28 names Conditional Access and DLP in passing but does not lean on the inherited-compliance story that legal-tech-cio personas need (`audience-personas.md`).
14. **Three-stakeholder framing** ("business, in-house counsel, outside counsel") — `brand-positioning.md` §4 calls this out as the moat; the spec does not foreground it. Cross-Functional capabilities (lines 184–193) names finance and business units but only obliquely names outside counsel.
15. **"AI-directed, human-controlled"** — the canonical AI philosophy line per `vocabulary.md` and product-knowledge §3.3. The spec does not use this phrase even though most of the Inference layer copy implicitly relies on it.

### What's in the spec but not in product-knowledge

These may indicate product-knowledge gaps to address in T11, or they may be the spec's invented claims:

- **Stage-gate processes** (lines 45, 72) — not in product-knowledge as a named capability. Likely a real configurable behavior; consider adding to §2.1 or §6.
- **LEDES format support** (line 52) — vocabulary §3 names LEDES as a term; product-knowledge does not name LEDES support specifically. Worth adding to §2.1 Spend & Performance.
- **Accrual tracking** (line 55) — not named in product-knowledge §2.1 Spend & Performance, but mentioned in `audience-personas.md` (legal-ops-director: "accruals" in vocabulary they use). Worth adding.
- **Rate management / rate cards** (line 56) — not in product-knowledge as a named feature.
- **Clause library** (line 108) — not in product-knowledge; would belong under Documents & Email if it ships.
- **Playbooks (matter-type-specific)** (line 109) — distinct from "AI and automation playbooks" in capabilities.ts. The spec describes a different artifact (best-practice templates per matter type). Confirm whether this exists.
- **Outside counsel profiles, counterparty intelligence, vendor performance tracking** (lines 115–117) — not surfaced in product-knowledge §2.1 by these names; partially overlaps with Spend & Performance "outside counsel performance metrics."
- **Onboarding accelerators / role-based dashboards** (line 125) — not in product-knowledge.
- **Predictive spend forecasting, matter outcome prediction, duration estimation, risk scoring, workload analysis** (lines 140, 148–151) — none in product-knowledge §2.1 or §3 as named AI features. These read as roadmap or aspirational; if they exist, they need to be attributed to the Foundry IQ + Agent Framework architecture rather than to "the Inference layer" generically.
- **Custom report builder, scheduled report delivery** (lines 170–171) — not in product-knowledge. Likely true Power BI capability; worth confirming.
- **Business unit portals** (line 190) — not in product-knowledge §2.1.

---

## 4. Voice / messaging alignment

Findings against `voice/style-guide.md` §5 and `voice/examples/avoid-this.md`. Each line reference is line number → offending text → suggested rewrite.

### A. Recap-opener boilerplate (style-guide §5 item 11)

⚠ **Line 17 — "Throughout this series, we have defined Legal Operations Intelligence as a category, described the Legal IQ stack as its architectural foundation, explored why platform choice matters, and addressed IT architecture and deployment in detail. Each article advanced a piece of the picture. This article assembles the complete view."**

Style guide §5 item 11 calls this out by name: "No 'Throughout this series, we…' recap-openers. They flatten the first paragraph. Weave the connective tissue into the body; spend the opening on the hook of *this* piece." `examples/avoid-this.md` shows the better pattern from `the-iq-stack`.

**Suggested rewrite**: lead with what *this* article is — the operator's reference for what the platform actually does. e.g. *"Procurement teams, IT reviewers, and business stakeholders all ask the same question: what does this platform actually do? The answer follows — every major capability of Spaarke, organized by the five modules the platform is built on, mapped to the operational outcome each one produces."*

### B. "Compounding intelligence" phrase

⚠ **Frontmatter `summary` (line 4) — "the compounding intelligence loop that defines Legal Operations Intelligence."**
`vocabulary.md` §2 row "compounding intelligence — (cut, or 'compound' as a verb tied to a layer) — audit flags overuse; the verb works, the noun phrase is a tell."

**Suggested rewrite**: "the Legal IQ stack — Data, Memory, Inference — that defines Legal Operations Intelligence."

### C. AI-tell / vendor adjective

⚠ **Line 158 — "ask questions in plain language… and receive answers grounded in your actual data, not generic benchmarks."** The phrase "answers grounded in your actual data" is on-voice and good; the surrounding paragraph is fine. Flagging only because the M365 Copilot framing in this section sits on a hidden assumption (Copilot Studio orchestration) that the article never names. See §2 above.

### D. Empty intensifiers (style-guide §5 item 5; vocabulary §2)

⚠ **Line 41 — "designed to capture not just status, but the full context of how legal work progresses."** "Full context" is generic. Vocabulary §2 doesn't list "full context" specifically, but the paragraph reads as marketing rhythm rather than operator description.
**Suggested rewrite**: *"Spaarke matter records hold what status systems leave out: the decisions made along the way, who was involved, and what was conceded — not just where the matter is now."*

⚠ **Line 67 — "Configurable templates by matter type ensure consistency."** "Ensure consistency" is filler.
**Suggested rewrite**: *"Configurable templates by matter type so recurring documents start from approved language, not from scratch."*

⚠ **Line 70 — "Legal work follows patterns, but those patterns are rarely simple."** Plausible but unsupported.
**Suggested rewrite (cut the sentence)**: lead the section with the routing and approvals examples directly.

⚠ **Line 91 — "what separates Spaarke from conventional legal technology."** "Conventional legal technology" is a hand-wave.
**Suggested rewrite**: *"The Memory layer is the difference between matter systems that remember status and matter systems that remember decisions."*

⚠ **Line 102 — "Institutional knowledge is only valuable if it is retrievable."** A truism. The next sentence does the work; this one is a setup line that adds nothing.
**Suggested rewrite (cut)**.

⚠ **Line 105 — "Relevant precedent surfaces in seconds rather than requiring someone to remember it."** "In seconds" is a 10x-style claim without measurement.
**Suggested rewrite**: *"Past matters become searchable by counterparty, jurisdiction, terms, and outcome — so a new dispute starts from what your team has already seen, not from someone's memory."*

⚠ **Line 130 — "The Inference layer is where the Legal IQ stack delivers its most visible return."** "Most visible return" is a vendor framing.
**Suggested rewrite**: *"The Inference layer is where unified data and structured memory turn into usable predictions — spend forecasts, outcome estimates, anomaly flags."*

⚠ **Line 165 — "Reporting moves from periodic manual exercises to live, interactive intelligence."** "Live, interactive intelligence" is filler.
**Suggested rewrite**: *"Power BI dashboards run on the live Dataverse data, so reporting reflects this morning's matters rather than last quarter's spreadsheet."*

⚠ **Line 171 — "deliver themselves."** Cute but vendorly.
**Suggested rewrite**: *"Scheduled distribution sends monthly spend reports, weekly matter summaries, and quarterly board packages by email or to a Teams channel."*

⚠ **Line 175 — "Intelligence without action is just information."** Aphorism-stack opener.
**Suggested rewrite (cut)**: open the section with the threshold-alert example directly.

⚠ **Line 191 — "becomes a data product rather than a manual assembly project."** Marketing rhythm.
**Suggested rewrite**: *"Quarterly board content — litigation summary, spend overview, key metrics, trend analysis — assembles from the live data instead of being rebuilt in slides each quarter."*

### E. "AI-powered" usage (style-guide §5 item 6; product-knowledge §5.3; vocabulary §2)

⚠ **Throughout — "AI capabilities" used as the catch-all (lines 29, 132, 153, 154, 161).** The constitution is explicit: "We don't say 'AI-powered' — we say which pillar is doing what" (product-knowledge §3 prologue). The spec's AI section is named "Copilot Integration" and frames everything as "operating through Microsoft 365 Copilot." This is the wrong altitude — Copilot is the surface; Foundry IQ + Copilot Studio + Agent Framework is the architecture.

**Suggested rewrite (substantive)**: rename the section "Spaarke AI" and split it into three paragraphs — Foundry IQ (knowledge grounding), Copilot Studio (orchestration), Agent Framework (execution). Then describe Copilot, Word Copilot, and Teams as the surfaces these pillars show up on. See `voice/product-knowledge.md` §3 for the exact framing.

### F. Cross-functional H2 has no subsection structure

⚠ **Lines 184–193 — Cross-Functional Capabilities.** This is one of the only sections in the article without H3 subsections, and the bullets (executive dashboards, finance integration, business unit portals, board reporting) are all four-six lines of prose-list. The closing aphorism "Legal does not operate in isolation — and neither should its platform" reads breathless. The section also fails to name the three-stakeholder differentiator (`brand-positioning.md` §4: "three-stakeholder coverage: business, in-house counsel, outside counsel… this is the moat").

### G. Title

⚠ **Title — "The Spaarke Platform: Feature Specification."** Style-guide §4 prefers sentence-case headings; the colon-and-subtitle pattern is fine for posts but the title is also slightly off-positioning: per `voice/vocabulary.md`, "platform" is preferred over "feature specification" framing. Consider a title that lands the article's job, e.g. *"What Spaarke does — the platform reference"* or *"The Spaarke platform, by capability"*. Flag for the editor.

### H. Final close — points to substance ✅ (mostly)

✅ **Line 197 — "Where to Go Next."** Matches the library's pattern (style-guide §5 item 4). The cross-links go to substance, not to a demo CTA. Good.

⚠ Closing paragraph could be tightened — line 199 ends mid-thought. Consider replacing with a single sentence that lands the article's argument: *"The full picture is the five modules running on one record, in one tenant, with AI grounded in your own work — not the Legal IQ stack as a slogan but as the architecture of every section above."*

---

## 5. Top 5–10 highest-priority edits

Ranked by impact on the document's accuracy and on-voice quality.

### 1. Replace "SharePoint" with "SharePoint Embedded" in the Document Management section

**Location**: lines 29, 60, 62, 63, 65 (and one passing reference at 82 and 100).
**Current**: "Documents live in SharePoint." / "All documents reside in SharePoint within your M365 tenant. No separate DMS to license, manage, or integrate."
**Proposed**: *"Documents live in **SharePoint Embedded (SPE)** — Microsoft's developer-grade SharePoint storage that runs inside your own M365 tenant. SPE gives Spaarke control over the document UX (matter-linked libraries, AI summaries, semantic indexing, the relationship graph) while the underlying storage uses native SharePoint capabilities — versioning, metadata, co-authoring, sensitivity labels, retention. There is no separate DMS to license, manage, or integrate, and Spaarke documents inherit your existing SharePoint governance."*
**Reason**: SPE is the canonical document layer per `voice/product-knowledge.md` §2.2 and §7.4. "SharePoint" alone is wrong. This is the largest single accuracy issue in the doc.

### 2. Replace "Copilot Integration" with "Spaarke AI" — name the three pillars

**Location**: H3 heading at line 153 and the bullets through line 161.
**Current**: "Copilot Integration… Spaarke's AI capabilities operate through Microsoft 365 Copilot, within your tenant boundary."
**Proposed**: rename the section "Spaarke AI" and structure it as three pillars. Open with one short paragraph naming **Foundry IQ** (knowledge grounding on Azure AI Foundry, indexing matters/documents/emails into a structured grounding source), **Copilot Studio** (orchestration: matter-aware experiences inside M365 Copilot and Teams), and **Microsoft Agent Framework** (execution: bounded agentic actions surfacing in playbooks). Then describe Copilot, Word Copilot, Teams app, and the relationship graph as the surfaces these pillars show up on. Keep the "tenant-boundary processing" bullet. Use the verbatim source at `voice/product-knowledge.md` §3 (Foundry IQ §3.1, Copilot Studio §3.2, Agent Framework §3.3).
**Reason**: product-knowledge §3 prologue: "We don't say 'AI-powered' — we say which pillar is doing what." The current section never names Foundry IQ, Copilot Studio, Agent Framework, or Azure AI Foundry. This is the second-largest accuracy gap.

### 3. Restructure the article around the five canonical modules — or at least map Legal IQ stack to modules explicitly

**Location**: H2 structure (lines 35, 89, 130) and the introductory paragraph at line 19.
**Current**: organized around Data / Memory / Inference / Cross-Functional layers; the five canonical modules (Matter Management, Documents & Email, Collaboration, AI & Automation, Spend & Performance) are not used as the primary organizing principle and the **Collaboration** module is largely absent.
**Proposed (substantive)**: either (a) reorganize H2s to use the five modules as the primary structure with Legal IQ stack threaded through, or (b) add an explicit map at line 19 — "These capabilities cluster into five modules — Matter Management, Documents & Email, Collaboration, AI & Automation, Spend & Performance — and into the three Legal IQ stack layers — Data, Memory, Inference. The article walks the layers; the modules are how the platform is shipped." Then add a Collaboration H3 inside Cross-Functional (or its own H2) covering secure project workspaces, outside-counsel access, Word co-creation, Teams app.
**Reason**: the home page and `/platform` are built on the five modules. Cross-links from a feature-spec article that uses different organizing concepts will create confusion. `voice/product-knowledge.md` §2.1 says module names are "canonical, verbatim from `src/content/home/capabilities.ts`." `brand-positioning.md` §4 names the five modules as a primary proof point.

### 4. Surface both deployment models, not just customer-tenant

**Location**: lines 27–32 (Platform Foundation).
**Current**: "deploys directly into your organization's Microsoft 365 tenant through Tenant Dedicated Deployment."
**Proposed**: *"Spaarke offers two deployment models. **Customer-Hosted** — also called Tenant Dedicated Deployment — runs Spaarke inside your own M365 tenant; data, identity, and governance stay where they already are. **Spaarke-Hosted** runs Spaarke in our managed tenancy and connects to yours through Entra ID, Exchange, SharePoint, and Copilot Studio. Both run on the same Power Platform / Dataverse / SharePoint Embedded architecture; the difference is whose tenant runs the platform. We are not aware of another legal-operations platform that offers customer-tenant deployment as a built-in option."*
**Reason**: `voice/product-knowledge.md` §2.3 names two models; `/platform` exposes both via the architecture compare slider; brand-positioning §4 frames customer-tenant as a differentiator framed *factually* ("we are not aware of another…"), not as the only model.

### 5. Replace the recap-style opener (line 17)

**Location**: line 17, the article's first paragraph.
**Current**: "Throughout this series, we have defined Legal Operations Intelligence as a category, described the Legal IQ stack as its architectural foundation, explored why platform choice matters, and addressed IT architecture and deployment in detail. Each article advanced a piece of the picture. This article assembles the complete view."
**Proposed**: *"Procurement teams, IT reviewers, and business stakeholders ask the same question of every platform under evaluation: what does it actually do? The answer for Spaarke follows — every major capability, organized by the five modules the platform ships in, with each capability mapped to the operational outcome it produces. The Legal IQ stack — Data, Memory, Inference — sits behind the modules as the architecture; the modules are how the platform reaches a user's day."*
**Reason**: `voice/style-guide.md` §5 item 11 explicitly bans "Throughout this series, we…" openers and `voice/examples/avoid-this.md` shows the same anti-pattern at length. The hook has to belong to *this* piece.

### 6. Add a Collaboration section with the named features

**Location**: insert as a new H3 inside whichever section the team chooses, or as its own H2.
**Current**: Collaboration as a module (one of the five) does not appear. Outside-counsel access, secure project workspaces, Word co-creation, and the Teams app are not described.
**Proposed**: a 4–5 bullet section using the canonical feature names from `src/content/home/capabilities.ts`: secure project workspaces (granular invite-only spaces tied to matters), outside counsel access (no email-attachment hand-offs, ethical walls and matter-level permissions), Word co-creation, shared matters and projects, Teams app (matter-centric chat/files/tasks). Frame as "the three-stakeholder shared workspace — business clients, in-house, and outside counsel — on one record."
**Reason**: Collaboration is one of the five canonical modules and the three-stakeholder coverage is the moat per `brand-positioning.md` §4. A "feature specification" that omits one of five modules has a structural gap.

### 7. Use OCG / outside counsel guidelines explicitly in Spend sections

**Location**: lines 53 and around 56 (Legal Spend Management).
**Current**: "Billing guideline enforcement: Configurable rules review invoices automatically. Block billing, excessive hours, unapproved timekeepers, prohibited expense categories — flagged before reaching a human reviewer."
**Proposed**: *"**Outside counsel guidelines (OCG) enforcement.** Configurable OCG rules review every invoice automatically. Block billing, excessive hours, unapproved timekeepers, expense categories outside the policy — flagged on the way in, not after approval. Compliance is reported back to firms in the same workspace where the work runs, so disputes don't accumulate to quarter-end."*
**Reason**: `voice/vocabulary.md` §3 calls OCG out as the canonical acronym for the persona; product-knowledge §2.1 frames Spend & Performance as "OCG compliance and outcomes." For corporate-counsel and legal-ops-director personas (`audience-personas.md`), this is daily vocabulary; the spec never uses the term.

### 8. Cut the empty-intensifier sentences flagged in §4(D) above

**Location**: lines 41, 67, 70, 91, 102, 105, 130, 165, 171, 175, 191. (Eleven specific edits above.)
**Reason**: each sentence either claims without evidence ("ensure consistency," "intelligence without action is just information") or uses vendor rhythm in place of operator detail. Cutting or rewriting per §4(D) lifts the doc's voice grade noticeably without changing its structure.

### 9. Either source or remove unverifiable AI feature claims

**Location**: line 159 (outside counsel recommendation), line 160 ("days → minutes"), line 76 / line 83 ("500+ pre-built connectors"), and the Inference layer prediction features (lines 140, 148–151).
**Current**: features described as if shipped, no attribution.
**Proposed**: for each, either (a) attribute to the right Spaarke AI pillar (Foundry IQ + Agent Framework playbook) and confirm shipping status with the team, or (b) move to a "roadmap" framing, or (c) remove. Mark unconfirmed items with the project's standard `**TBD — confirm**` per `projects/content-platform/CLAUDE.md` §4.
**Reason**: `voice/style-guide.md` §5 item 12 — "No claims without a defense." For a doc the article itself frames as the procurement-grade reference, unsourced predictive features are a credibility risk.

### 10. Rewrite the closing paragraph

**Location**: lines 197–199.
**Current**: "This article serves as the comprehensive feature reference for the Spaarke platform. For the strategic framework behind these capabilities, start with…"
**Proposed**: *"The five modules — Matter Management, Documents & Email, Collaboration, AI & Automation, Spend & Performance — run on one record, in your tenant, with AI grounded in your own work. The Legal IQ stack — Data, Memory, Inference — names the architecture; the modules are how it reaches a user's day. For the strategic framework, start with [What is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence) and [The Legal IQ stack](/why-spaarke/the-iq-stack). For the technical architecture and deployment, see [Spaarke for Your IT Team](/why-spaarke/spaarke-for-your-it-team)."*
**Reason**: lands the doc on its argument (modules + Legal IQ stack + tenant), keeps the "Where to Go Next" pattern, and uses the three-stakeholder / five-module framing the rest of the site already carries.

---

## 6. Recommendation

**Needs significant rework before it should go live as the team's procurement-grade reference.**

Justification: the article's structural choices (Legal IQ stack layers as the only top-level frame, "SharePoint" instead of SharePoint Embedded, "Copilot Integration" instead of the three Spaarke AI pillars, single deployment model, no Collaboration section, no OCG vocabulary) put it out of alignment with three Phase 0 deliverables — `voice/product-knowledge.md`, `voice/brand-positioning.md`, and `src/content/home/capabilities.ts` — that the Phase 0 review (T11) is locking. The voice issues alone (recap opener, empty-intensifier sentences, unsourced numeric claims) would be a "minor edits" verdict; combined with the architectural mismatches, they sit closer to a rework.

That said, the bones are in place. The article's research is mostly accurate, the cross-links are right, and the cross-functional and finance-integration sections track the brand-positioning themes. Edits 1–4 above (SharePoint Embedded, Spaarke AI three pillars, five-module structure, two deployment models) are the load-bearing changes; edits 5–10 are local cleanup. With those in, the doc becomes the procurement-grade reference the lead paragraph claims it already is.

The fastest path is probably (a) restructure the H2s around the five modules with Legal IQ stack threaded through; (b) rewrite the AI section to name Foundry IQ / Copilot Studio / Agent Framework; (c) replace SharePoint with SharePoint Embedded; (d) cut the recap opener and the eleven empty-intensifier sentences. That is a focused half-day of rewriting, not a from-scratch redraft.

---

*Reviewer: Claude (read-only review, no edits to the spec). All findings reference the canonical sources at `projects/content-platform/voice/*` and the live platform copy at `src/content/home/capabilities.ts` / `src/app/platform/page.tsx` as of 2026-05-06.*
