# Brand positioning

> **Note added 2026-09-21.** This file says what to argue, and article prose follows `style-guide.md` rather than the phrasing here. The file predates the September 2026 revision of the guide, and several theme lines use constructions that the guide now prohibits in articles (the `X, not Y` tagline, negation followed by correction, and stacked fragments; see section 5, rules 14 to 16). Do not reproduce those lines as taglines. State the same position as a positive claim with its reason. A slogan may be quoted only where an article quotes the live site.

> **Note added 2026-09-22.** Positioning aligned with the series decision the writer settled on 2026-09-21. Spaarke provides both system of record capabilities and ontology architecture over the systems a department already runs, and neither mode is the rule. The earlier working principle "originate the workflow, reference the record" and the earlier ban on consolidation claims are withdrawn. The record and model theme in section 2 and the competitive frame in section 3 carry the wording.

What Spaarke argues for, narratively. Read this to know *what to argue*; read
`style-guide.md` to know *how*. Pulled from the site and the LOI series.

---

## 1. Positioning statement

**Spaarke is the Legal Operations Intelligence platform: a Microsoft-native
system of record where legal work, data, and AI run together across every
matter, every document, and every side of the engagement.**

The home and platform pages already carry it: "Legal Operations Intelligence,"
"All your legal work, connected," "A single system for legal work, data, and
decisions." (The platform page still prints the second heading with an
unspaced em dash, U+2014, in place of the comma; the dash is not
reproduced here.)

---

## 2. Core narrative themes

Four themes. Almost everything we publish lives in at least one.

**Built for AI across the lifecycle, not bolted on.**
Most legal AI today is drafting tools layered onto fragmented environments.
They improve specific tasks but can't reach the full context of a matter
because they don't sit on a system of record. AI becomes operationally
valuable only when it's grounded in matters, documents, spend, and
collaboration as one connected system. Shows up in the home hero and in the
Spaarke architecture (Foundry IQ for grounding and operational memory; Microsoft Agent Framework for orchestration and execution; Power Platform + M365 as the user experience layer).

**Microsoft-native: built on Microsoft, not adjacent to it.**
Most legal platforms integrate *with* Microsoft. Spaarke runs *inside* it:
Power Platform, SharePoint, Outlook, Teams, Word, M365 Copilot, Azure AI
Foundry. That isn't a deployment preference; it's the precondition for the
operational intelligence we claim. Identity, governance, and the security
perimeter are the ones IT already approved. Copilot can reason across legal
work because legal work lives where Copilot looks.

**The record and the model for legal work: all sides, every matter.**
Matter systems track matters, document systems hold documents, and billing
systems track spend, and each of them holds one part of the record. Spaarke
provides both system of record capabilities and ontology architecture over
the systems a department already runs, and it supports both modes (settled
by the writer on 2026-09-21). In the first mode, Spaarke is the system of
record for legal work: the record where matters, projects, emails,
documents, tasks, metrics, and outside counsel collaboration connect, and
where the process entities that no other system holds (the request, the
disposition, the obligation, the policy, the inquiry, and the action
record) live with them. In the second mode, Spaarke is the ontology
architecture over the systems the department keeps: the document
management system owns the documents, the e-billing platform owns the
invoices, and the ontology binds each entity to the system where its data
lives and references what it does not own. A department may run either
mode or both at once, and neither is the rule. In both modes the ontology
is the foundation of legal operations intelligence: the model of the
entities a department works on, the relationships among them, and the
actions it may take on them under rules the department wrote.

Business intelligence is the deterministic dimension of the same
platform. It computes facts such as a budget variance the same way every
time, and the ontology gives it consistent entities to read across
systems, a place to act on what it shows, and a decision record to read
back. Spaarke is also where business clients, in-house counsel, and
outside counsel work in shared spaces with ethical walls and matter-level
permissions enforced. That's what "One platform. All sides. Every
matter." compresses, and why we say "system of record" not "matter
management." The extension we increasingly emphasize is that AI grounding
stays on one record too: outside counsel work against the customer's
operational memory, not a parallel firm-side AI grounded separately on
the same matter.

**Operational intelligence, not productivity AI.**
The market keeps shipping productivity features: faster drafting, review,
summarization. Useful, but they don't change how legal work *runs*.
Operational intelligence is the layer above: visibility into spend, counsel
performance, matter status, and outcomes, with AI directing and humans
controlling. The Legal IQ stack (Data → Memory → Inference) names the architecture;
the proof is that Spaarke answers questions about *your* 200 matters, not
generic legal ones.

"Your data, your environment, your control" sits inside Microsoft-native,
because deployment is what makes sovereignty real, not the slogan.

---

## 3. Competitive frame

We don't punch sideways at named competitors. The frame is implicit.

- **Market category we claim:** Legal Operations Intelligence, the category
  the LOI series defines. Not "matter management," not "ELM," not "legal AI."
  We sit underneath the Microsoft surfaces the team already uses.

- **Systems we sit with:** The platform sits with the document management
  system and the e-billing platform, and it can bind to both: the document
  management system keeps the documents, the e-billing platform keeps the
  invoices, and the ontology references what it does not own. Where the
  department has no system of record for its process entities, Spaarke
  supplies one. We make no claim that a department must replace either
  system; the department decides which systems it keeps.

- **What we displace:** We displace the fragmentation between the point
  tools a department runs (an ELM or matter system, a document repository,
  often SharePoint as a folder, an e-billing platform, a contract tool,
  and AI-drafting tools on top), where each does its job, no shared model
  connects them, and the department reconciles them by hand. Spaarke
  closes that gap in either mode, as the system of record where the
  department lacks one or as the ontology bound to the systems already in
  place.

- **The implicit "vs.":** Spaarke vs. the walled-garden SaaS hosting
  model (we run in your tenant, and an ELM the department keeps is bound
  to rather than replaced). Spaarke vs. AI-drafting tools (we are the
  system those tools should be grounded in). Spaarke vs. generic M365 (we
  add the legal operating model M365 doesn't ship with). Spaarke vs.
  "ChatGPT for legal" (operational infrastructure, not a chat surface).

---

## 4. Proof points

- **Architectural: runs in your tenant, on Microsoft.** Built on Power
  Platform, SharePoint, and M365. Data sits inside the tenant the customer
  already governs. `tenant-dedicated-deployment` and
  `your-legal-data-belongs-to-you` carry the long form.

- **Functional: five capability modules, one record.** Matter Management,
  Documents & Email, Collaboration, AI & Automation, Spend & Performance. The
  point isn't the count; it's the shared record. A matter has its documents,
  emails, tasks, workspace, budget, and counsel performance attached.

- **Industry: built where the work already happens.** Outlook, Teams, Word,
  SharePoint, Power BI, M365 Copilot, Azure AI Foundry. >85% of Fortune 500
  are on M365.

- **Practical: IT deploys without a parallel governance regime.** No new
  identity, no separate security model, no parallel audit story.
  `spaarke-for-your-it-team` is the long form.

- **Diagnostic: cited frameworks locate the LOI thesis.** CLOC Core 12, ACC
  Maturity Model 2.0, Gartner. We place category claims inside the existing
  legal-ops landscape rather than asserting from outside it.

- **Architectural: engagement boundary preserved.** When the platform runs
  inside the customer's tenant and outside counsel become authorized
  collaborators against the same record, AI grounding does not fragment at
  the engagement boundary. The company's data, operational memory, and AI
  grounding stay inside the company's boundary; the firm operates against
  them rather than re-creating its own. Most legal AI tools today are sold
  to one side or the other and don't share grounding even when the same
  vendor sells to both. `what-attorneys-need-to-know-about-ai` §Decision Four
  carries the long form; `your-legal-data-belongs-to-you` and
  `tenant-dedicated-deployment` carry the data-sovereignty and deployment
  consequences.

---

## 5. Things we are NOT

- **Not "AI-first."** A legal operations platform that uses AI well. AI
  compounds because the rest is already there.

- **Not a productivity app.** No "10x productivity," no "faster drafting," no
  "one-click" anything. The argument is operational intelligence, not how
  fast a single task gets done.

- **Not a billing or e-billing replacement.** Spend & Performance surfaces the
  financial truth about matters and counsel; it doesn't replace the systems
  that process invoices.

- **Not "Copilot for lawyers" or "ChatGPT for legal."** Conversational AI is a
  surface we show up on, not the product.

- **Not for solo practitioners or small firms.** The proof points (tenant, IT
  governance, OCG compliance, multi-side collaboration) only matter at
  mid-market and above.

- **Not anti-lawyer or anti-firm.** AI is directed; humans stay in control.
  We don't argue AI replaces lawyers or eliminates legal labor.

---

*Locked 2026-05-07. Punctuation revised 2026-09-21 (no em dashes). Positioning aligned 2026-09-22 (both deployment modes); see git log for history.*
