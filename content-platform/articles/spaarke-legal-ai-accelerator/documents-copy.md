# Accelerator brief and readiness checklist: copy for review

Draft copy from PR #134. Edit this file directly: change the text, strike what should go, and add notes in `> **Note:** ...` lines. Revised copy goes back into `src/app/accelerator/documents.ts`, which builds both the web pages and the PDFs.

Each PDF page is fixed at 1080 by 1350. The space left on each page is noted under its heading, so you can see which pages can take more text. Roughly, one more line of body text needs about 35px. Where a page has no room, longer copy means cutting elsewhere on that page or moving content to another page.

Rules for paid copy: no competitor names, no claims the article doesn't support, no Microsoft endorsement implied, no prices.


---

# Accelerator brief: The Spaarke Legal AI Accelerator for Microsoft Copilot

**Description** (used on the web page, the `/accelerator` card, and search results): Seven pages on legal AI on Microsoft: the platform, how it is built, the three layers of legal content, what the accelerator includes, and how the week runs.


## Page 1 of 7 (cover), about 30px spare

**Eyebrow:** Spaarke Legal AI Accelerator for Microsoft Copilot

**Title:** Legal AI on Microsoft, one practice in one week.

Microsoft 365 now carries legal skills in Word and Cowork, inside the tenant a legal team already governs. The accelerator brings core legal skills, practice packs, calculation tools, and forward-deployed legal engineers to put that platform to work for your team.

*Contents:*

2. Microsoft is now the platform for legal AI
3. How legal AI on Microsoft is built
4. Three layers of legal content
5. What the accelerator includes
6. The week
7. What carries forward


## Page 2 of 7 (platform), about 23px spare

**Eyebrow:** The platform

**Title:** Microsoft is now the platform for legal AI.

Most legal teams have tested AI in proofs of concept and pilots. Those projects showed where AI fits in legal work, but they run outside the core legal systems and under each vendor's own controls. Microsoft 365 now brings the models, the legal skills, and the governance into the environment legal teams already run.

- **The models.** Copilot runs Anthropic's Claude, OpenAI's GPT models, and Microsoft's own models, and the organization chooses which to use as the models improve.
- **The legal skills.** On October 15, Microsoft made more than 20 legal skills generally available as Copilot for Legal. In Word a lawyer can review a contract against a playbook, and the Legal for Cowork plugin reviews, summarizes, drafts, and redlines across many files.
- **The tenant.** Copilot works inside the Microsoft 365 service boundary and shows each user only what that user may already see. Entra ID, sensitivity labels, and retention in Microsoft Purview apply to legal AI as they apply to everything else.

Each team tunes the platform to its own practice. Plugins package skills, tools, and MCP connectors to other systems, playbooks turn a team's written procedures into skills, and administrators govern all of it through a plugin registry.


## Page 3 of 7 (build), about 67px spare

**Eyebrow:** How it is built

**Title:** Legal AI on Microsoft is built in layers, from enterprise governance to legal skills.

Each layer inherits what the layers below it provide. Microsoft supplies the governance and the services at the base, a legal platform of systems of record and a decision support ontology sits in the middle, and legal skills run on top.

*Exhibit 1 (drawn on the page; wording matches the article's Exhibit 1):*

- Side bar: Copilot and Cowork, reach across every layer
- **Legal AI:** Skills, playbooks, agents, and tools (tag: "The accelerator starts here")
- **The legal platform:** Decision support ontology: Matters, documents, invoices, obligations, and policies, with the record of each decision. Systems of record: Matter and case management; Document management; Finance, budgeting, and e-billing
- **Microsoft 365 and Power Platform:** Outlook, Teams, Word, SharePoint, Power Apps, and Dataverse
- **Enterprise governance:** Entra ID, conditional access, Purview, and the tenant boundary

The accelerator starts at the top layer, on the governance and services Microsoft already provides, and the platform layers follow.


## Page 4 of 7 (layers), about 205px spare

**Eyebrow:** Three layers of legal content

**Title:** Spaarke maintains two layers of legal content, and your team owns the third.

- **The foundation.** Core legal skills that every practice uses: reviewing a document against a playbook, preparing an issues list, extracting key terms, comparing documents, building a chronology, writing a matter brief, and checking citations.
- **Practice packs.** Specialty skills, playbook templates, checklists, and calculation tools for practices such as NDAs, commercial real estate, M&A, employment, litigation, patents, and trademarks, and an invoice review pack for legal operations.
- **The team's own playbooks.** Your preferred and fallback positions, escalation rules, house style, and approved precedents, captured in files the team owns. Updates to the foundation and the packs never overwrite them.

Most of the effort in a deployment goes into the third layer, because that is where the team's own expertise enters its legal AI. Some work also has to come out the same way every time. A notice deadline, a rent escalation, a patent term, or the arithmetic on an invoice is computed by a calculation tool, and the AI calls the tool when the work needs one.


## Page 5 of 7 (included), about 98px spare

**Eyebrow:** What's included

**Title:** The accelerator delivers nine components into your own tenant.

- **Legal skills.** Foundation and practice pack skills in the Agent Skills format, deployed as plugins to Cowork and Copilot Chat.
- **Playbooks for Word.** Playbooks rendered as Word documents from the team's own positions, for Word's legal drafting and review skills.
- **Knowledge library.** A SharePoint site structure for precedents, the clause library, and checklists, in your own tenant.
- **Agents.** Copilot agents for each practice, grounded on the knowledge library and shared with the team.
- **Tools and MCP connectors.** Calculation tools for the work that must be exact, and connectors to the systems you already license.
- **Setup interview.** A guided skill that walks a practice lead through positions, fallbacks, escalation, and house style.
- **Evaluation set.** Questions and documents for each practice, extended with your own, to test results on your work.
- **Governance and deployment.** Human review guidance in every skill, a summary for IT of how data flows, and an administrator deployment package.
- **Adoption.** Installation guides, training prompts, and a usage baseline from which to measure results.


## Page 6 of 7 (week), about 5px spare

**Eyebrow:** The week

**Title:** The engagement covers one practice in one week.

Spaarke's forward-deployed legal engineers are attorneys, legal operations professionals, and specialty practitioners who work inside the team's own operations.

1. **Choose the tasks and record the baseline.** The team chooses two or three recurring tasks in one practice and records how long they take today.
2. **Write the playbooks.** The legal engineers and the practice lead capture the team's positions with the setup interview and curate its knowledge library.
3. **Configure and connect.** The legal engineers configure the skills, agents, and tools, and connect the systems the practice relies on.
4. **Test on the team's own documents.** The team tests the results on its own documents against the baseline.
5. **Train and hand over.** The legal engineers train the team and hand over the deployment, with an administrator package for IT.

At the end of the week, the team has:

- The team's own playbooks, written with the setup interview and held in its own files.
- The practice pack and agent deployed in your own tenant.
- Results measured on your own documents against today's baseline.
- A deployment package your IT team has reviewed.
- A plan for the next practice.


## Page 7 of 7 (forward), about 47px spare

**Eyebrow:** What carries forward

**Title:** Everything the accelerator builds carries forward onto the Legal Operations Intelligence platform.

*Exhibit 2 (drawn on the page; wording matches the article's Exhibit 2):*

| | Copilot for the individual | The team's legal AI (with the accelerator) | The legal platform (systems of record and the ontology) |
|---|---|---|---|
| The playbook | A document a lawyer attaches | The team's positions, with an owner | A versioned policy, cited on each decision |
| Critical dates and obligations | Extracted in a session | A governed extraction, with exact date calculations | Obligations with owners and lifecycles |
| The issues list | A document | A structured list | Entries in the decision record, with the approver |
| Invoice review | A file reviewed in a session | A guideline review with exact arithmetic | Invoices posted against the matter and its budget |
| Matter context | The lawyer's own knowledge | The knowledge library | The matter record |

*Booking box:* **Book a 30-minute scoping session.** In 30 minutes we choose the practice and the first tasks, confirm the Microsoft setup with your IT lead, and plan the week. Then: spaarke.com/accelerator, ralph.schroeder@spaarke.com


---

# Readiness checklist: Legal AI on Microsoft 365: a readiness checklist for legal and IT

**Description** (used on the web page, the `/accelerator` card, and search results): Three pages on what legal and IT settle before legal AI goes live on Microsoft 365: licences, the Cowork usage policy, plugin and connector approval, labels and retention, and the team's own positions.


## Page 1 of 3 (together), about 93px spare

**Eyebrow:** Readiness checklist for legal and IT

**Title:** Legal AI on Microsoft 365: a readiness checklist for legal and IT.

Legal AI on Microsoft runs inside the organization's own tenant, under the identity, security, and retention controls IT already maintains. That makes the first deployment a joint decision: legal chooses the work and writes down its positions, and IT confirms the licences, policies, and approvals the work depends on. These are the questions the two settle together before the first practice goes live.

- [ ] **The first practice** (Legal)
  - Question: Which practice comes first, and which two or three recurring tasks?
- [ ] **Licences** (IT)
  - Question: Who on the practice team holds a Microsoft 365 Copilot licence?
- [ ] **Cowork** (IT)
  - Question: Is Cowork enabled for the legal team, and under which usage policy?
- [ ] **Approvals** (Legal and IT)
  - Question: Who approves the plugins and connectors the practice needs?
- [ ] **Labels and retention** (Legal and IT)
  - Question: How do sensitivity labels and retention apply to the practice's documents and to Copilot activity?
- [ ] **Deployment route** (Legal and IT)
  - Question: Will the practice deploy itself, or will IT deploy centrally?


## Page 2 of 3 (it), about 107px spare

**Eyebrow:** For IT

**Title:** IT confirms the licences, policies, and approvals the practice depends on.

- [ ] **Licences**
  - Question: Which members of the practice team hold a Microsoft 365 Copilot licence, and is Copilot for Legal available to them in Word?
  - Why it matters: The legal skills in Word and the Legal for Cowork plugin are what the accelerator builds on.
- [ ] **Cowork usage policy**
  - Question: Is Cowork enabled for the legal team, which models may it use, and what usage policy and capacity apply?
  - Why it matters: Cowork runs the multi-file work, such as reviewing a set of agreements or invoices.
- [ ] **Plugins and connectors**
  - Question: Who approves plugins in the plugin registry, and the connectors the practice needs, such as one to the document management system?
  - Why it matters: The accelerator's skills and calculation tools arrive as plugins.
- [ ] **Sensitivity labels**
  - Question: Which sensitivity labels apply to the practice's documents, and what do they allow Copilot to do?
  - Why it matters: Copilot honors the usage rights that labels apply, so labels decide which documents a skill can use.
- [ ] **Retention**
  - Question: What retention applies in Microsoft Purview to Copilot and Cowork activity for the legal team?
  - Why it matters: Prompts and responses about a matter usually belong under the same rules as the matter.
- [ ] **Deployment route**
  - Question: Will the practice add the pack itself in Cowork, or will IT deploy it with the administrator package?
  - Why it matters: Organizations that run Information Barriers, as many law firms do, start with the IT-deployed route.


## Page 3 of 3 (legal), about 30px spare

**Eyebrow:** For legal

**Title:** Legal chooses the work and writes down the positions the AI will apply.

- [ ] **The first practice and tasks**
  - Question: Which practice comes first, and which two or three recurring tasks?
  - Why it matters: A narrow start lets the week end with measured results on real work.
- [ ] **Today's baseline**
  - Question: How long does each task take today, how often does it arrive, and who does it?
  - Why it matters: The baseline is what the team measures the results against.
- [ ] **Positions and fallbacks**
  - Question: For each task, what are the team's preferred positions, its fallbacks, and the points at which it escalates, and to whom?
  - Why it matters: These positions become the team's playbooks, the layer the team owns.
- [ ] **Precedents and house style**
  - Question: Which templates, clauses, and precedents are approved, and where are they kept?
  - Why it matters: They seed the knowledge library that the practice agent draws on.
- [ ] **AI work under way**
  - Question: Which prompts, skills, and pilots have lawyers already built in other AI tools?
  - Why it matters: The first deployment builds on that work rather than starting again.
- [ ] **Owners**
  - Question: Who owns each position, and who signs off when a playbook changes?
  - Why it matters: The team's positions will change as its practice does, and each change needs an owner.

*Booking box:* **Book a 30-minute scoping session.** We review this checklist with your legal and IT leads and plan the week. Then: spaarke.com/accelerator, ralph.schroeder@spaarke.com


---

# On the web pages only

- Header buttons: "Download the PDF (N pages)" and "Book a scoping session"
- Footer links: "Download the PDF", "Read the accelerator brief" or "Read the readiness checklist", and "Read why Microsoft is now the platform for legal AI"
- The web brief shows the article's Exhibit 1 and 2 images, each captioned "Exhibit N." followed by the page title

# On `/accelerator`

**Eyebrow:** Read before the session

**Heading:** Two short documents for the legal team and its IT lead.

Each card shows the document title, its description, a "Read the ..." button, and "Download the PDF (N pages)".

# In the founder article (end of the close)

- Added after the IT preparation step: "Our [readiness checklist](/accelerator/readiness-checklist) sets out the questions legal and IT settle together before the first practice goes live."
- Added after the scoping session paragraph: "The [accelerator brief](/accelerator/brief) sets out the engagement in seven pages."

