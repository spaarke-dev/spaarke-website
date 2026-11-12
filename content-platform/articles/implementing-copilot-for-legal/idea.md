# Implementing Copilot for Legal: What the Department and IT Build

<!--
SUPERSEDED by brief.md (rev. 2, 2026-11-12). The writer's feedback of
2026-11-12 changed the framing: the platform premise and Microsoft's four
strengths lead; the pieces are companions and are never numbered; no single
release date anchors them; the concession is restated as the direction legal
teams are taking; oversharing is dropped; Work IQ is named and the other IQ
products are not. Where this file and the brief differ, the brief governs.
-->

<!--
Idea, rev. 1, 2026-11-12. Article 2 of the three-article Copilot series.
The series notes (relation to the accelerator article, objectivity rules,
the shared six-layer frame, and the open series-level rulings) are in
articles/copilot-legal-ai-platform/idea.md. Read that first.
Target: long-form, about 4,500 to 5,500 words (length_target: open).
Source briefing: C:\code_files\spaarke-research\2026-11-copilot-legal-platform\microsoft-ai-platform-for-legal-2026-11-11.md
Run /idea-to-brief implementing-copilot-for-legal after article 1's brief.
-->

## The one-sentence topic

What a legal department and its IT team configure, curate, connect, and govern, and in what order, to turn Microsoft Copilot into the department's legal AI platform.

## Why this matters, why now

Article 1 explains what the platform is made of. A reader who accepts it immediately asks what it takes to implement. Microsoft documents each control in its own admin guide, and none of those guides is written for a legal department, where privilege, confidentiality, client obligations, and legal hold attach to the AI's inputs and outputs. The department needs one account of the decisions, in order, with the legal reason for each.

## Who this is for

Primary: **legal-tech-cio**, or the IT and security lead who will run the implementation. Secondary: **legal-ops-director**, who builds the legal content and owns the rollout with the department. The article has to be technical enough for IT to act on and plain enough for legal operations to plan with. Open: whether legal-ops-director should be primary (question for the brief).

## The argument

Drafting thesis: Copilot arrives configured for no one in particular. It becomes a legal platform through work done in a sequence: fix permissions, then set the controls that protect privilege and records, then curate the content the AI will work from, then connect the legal systems, then turn on delegated work under cost limits. Each step depends on the one before it, and a department that skips to delegated work first inherits every problem the earlier steps would have fixed.

The concession (stance section 4): in most organizations SharePoint permissions are wider than anyone intends. Copilot works within existing permissions, so that oversharing becomes an AI problem the moment Copilot is turned on. State the fault plainly, with the mechanism, and pair it with the remedy in the same section.

Authority (stance section 2): the department sets the positions, the fallbacks, and the escalation rules. Legal operations builds the skills, curates the precedents, and runs the rollout. IT configures the controls, and the draft keeps each party to its own verbs throughout.

## What the article covers

1. **Licensing by role.** Copilot Chat (no added cost), the Microsoft 365 Copilot add-on, the Business tiers, E7 and Agent 365, and usage billing in Copilot Credits. The in-app labels (Basic, Premium) and what they mean for a lawyer. Redlining in Word needs licensed seats. Two users with the same license can produce very different costs, so budget by workload as well as by seat.
2. **Permissions come first.** Why oversharing in SharePoint and OneDrive becomes an AI problem, and what to review before rollout. **TBD — confirm** which Microsoft tools to name for this (to be checked against current Microsoft Learn guidance after Ignite; do not name a tool the briefing does not support).
3. **Privilege and confidentiality.** Sensitivity labels for privileged and client-confidential content; Purview DLP across Chat and Cowork (public preview in October 2026); web-search leakage controls; model subprocessors (Anthropic is a Microsoft subprocessor; Claude models are on by default for most commercial tenants and admin-controlled in the EU, EFTA, and UK); outside counsel guidelines and client restrictions on AI.
4. **Records.** Prompts and responses in the unified audit log; eDiscovery of AI interactions, which are discoverable ESI; retention policies for AI interactions and Copilot memory; Teams intelligent recap without a saved transcript. What legal hold practice has to change.
5. **The content the department curates.** Precedents and clause banks in SharePoint, playbooks written as skills, knowledge bases in Foundry IQ, the SharePoint knowledge base. Who writes a playbook, who approves it, who keeps it current. Link the knowledge management article.
6. **Connecting the legal systems.** DMS plugins (iManage, NetDocuments, Box); the decision rule between a Copilot connector (bring content into the index so Copilot can search and reason over it) and an MCP server (take live actions or queries in a system of record); matter, intake, and spend systems; research content through partner plugins.
7. **Choosing the builder tool.** From skills in Chat and Cowork, to Agent Builder, to Code with the Copilot Managed Runtime, to Copilot Studio and its three harnesses, to Microsoft Foundry, to custom engine agents. Who builds with each. Entra Agent ID for every Copilot Studio agent.
8. **Turning on delegated work.** Cowork is off by default and enabled by group; approval pauses before consequential actions; Automations for event-driven work; Autopilot for standing responsibilities; spending limits by tenant, group, and user, with per-task credit visibility; Agent 365 for the inventory of every agent touching legal data.
9. **Rollout by persona, and what to measure** (Exhibit: a phased plan). Commercial counsel and NDA triage first is one plausible order; the article recommends one order and says why (stance section 8). Measures: suggestions kept, time to first response on requests, review turnaround, credit spend per workload.
10. **Close.** The first three moves for legal operations and IT, then the handoff to article 3.

## Exhibits

- Exhibit 1: the implementation sequence as a dependency chain (permissions, controls, content, connections, delegated work).
- Exhibit 2: licensing by role (who needs which seat and which usage).
- Exhibit 3: the rollout plan by persona.

## Evidence

From the source briefing, sections 7, 8, 9, and 10. Every item **TBD — confirm** against primary sources after Ignite, especially prices, preview status, and anything Microsoft renames.

## Links to earlier articles

- Article 1 of this series.
- `2026-11-03-microsoft-is-now-the-platform-for-legal-ai`.
- `knowledge-management-legal-operations-intelligence` (curating the content).
- `spaarke-for-your-it-team` and `tenant-dedicated-deployment` (IT governance on Microsoft).
- `legal-ops-is-not-it-for-lawyers` (who owns what).

## What this should not become

- An admin guide that repeats Microsoft Learn. The article gives the legal reason for each decision and the order; it links to Microsoft for the clicks.
- A Spaarke implementation guide or an accelerator pitch.
- A list of every setting. Only the decisions that change legal risk or legal outcomes.

## Open questions for the brief

1. Primary persona: legal-tech-cio or legal-ops-director.
2. The recommended rollout order (which practice and workflow first).
3. Whether this piece should later become a downloadable white paper for IT (the `content/papers` route is not built yet).
