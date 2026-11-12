# How Microsoft Assembles a Legal AI Platform

<!--
SUPERSEDED by brief.md (rev. 2, 2026-11-12). The writer's feedback of
2026-11-12 changed the framing: the platform premise and Microsoft's four
strengths lead; the pieces are companions and are never numbered; no single
release date anchors them; the concession is restated as the direction legal
teams are taking; oversharing is dropped; Work IQ is named and the other IQ
products are not. Where this file and the brief differ, the brief governs.
-->

<!--
Idea, rev. 1, 2026-11-12. Article 1 of a three-article series on building
an enterprise legal AI platform on Microsoft Copilot. This file also
carries the series-level notes (relation to the accelerator article,
objectivity rules, the shared frame, open rulings); articles 2 and 3
point back here.
Target: long-form, about 4,500 to 5,500 words (length_target: open in
the brief).
Source briefing: C:\code_files\spaarke-research\2026-11-copilot-legal-platform\microsoft-ai-platform-for-legal-2026-11-11.md
(private archive; as of 2026-11-11, before Microsoft Ignite).
Run /idea-to-brief copilot-legal-ai-platform once the open rulings at the
end are settled.
-->

## The one-sentence topic

How Microsoft's AI platform is put together for legal work, layer by layer, and how the layers work together when a legal team uses it: the surfaces, the work modes, Copilot for legal, the Microsoft IQ context layer, the models, the extensibility model, and the governance stack.

## The series

| # | Working title | Slug | Job |
|---|---|---|---|
| 1 | How Microsoft Assembles a Legal AI Platform | `copilot-legal-ai-platform` | What the platform is made of and how the parts connect |
| 2 | Implementing Copilot for Legal: What the Department and IT Build | `implementing-copilot-for-legal` | What legal and IT configure, curate, connect, and govern, in order |
| 3 | Copilot Among the Legal AI Platforms: Where It Leads and Where It Falls Short | `copilot-compared-legal-ai-platforms` | An objective comparison with Claude for Legal, OpenAI Astra for Law, Harvey, and Legora |

A parallel treatment of Claude, OpenAI, and Google (and possibly other frontier providers) follows later, using the same frame and the same comparison criteria so a reader can compare across series. Harvey and Legora do not get their own series; they appear in the comparison articles only.

## Relation to the accelerator article (read first)

On 2026-11-03 we published "Microsoft Is Now the Platform for Legal AI" (`content/blog/2026-11-03-microsoft-is-now-the-platform-for-legal-ai.mdx`), the founder article of the active `2026-11-legal-ai-accelerator` campaign. It argues that Microsoft is the platform on which a legal team should build its AI, sets out a four-layer build (enterprise governance; Microsoft 365 and Power Platform; the legal platform of systems of record and the decision support ontology; legal AI on top), and introduces the Spaarke Legal AI Accelerator for Microsoft Copilot.

This series is a different kind of piece. The founder article is an argument for a position and closes on a scoping session. This series is the detailed, technical, and objective account behind that position: how the platform works, how it is implemented, and where it leads and trails the alternatives. It must stay consistent with the founder article or say plainly where it refines it. Three places need care:

- **The frame.** The founder article's Exhibit 1 is the department's build stack. This series describes the anatomy of the AI platform a provider supplies. The two fit together: the six layers below describe what Microsoft supplies, which sits across the founder article's bottom two layers and its top layer. Article 1 should say this in a sentence and link the founder article.
- **The comparative claims.** The founder article says SharePoint sites and Teams channels with restricted access and sensitivity labels serve as the confidential work rooms that Harvey offers as Vault and Legora as Portal, and that Claude, ChatGPT, Harvey, Legora, and the AI in systems of record all work from outside the legal team's tenant. Article 3 tests those claims. Where the evidence supports them, the series confirms them; where it qualifies them (for example ethical walls and client delivery in Harvey Shared Spaces and Legora Portal, or Legora running on Azure), the series says so. See open ruling 2.
- **The pitch.** The series does not mention the accelerator in the body and does not close on a meeting. The disclosure (below) names Spaarke's interest.

## Why this matters, why now

On 2026-10-15 Microsoft made Copilot for legal generally available: more than 20 legal skills plus partner plugins, working in Word and Cowork. Trade press called Microsoft the fourth major AI company in five months to build a legal vertical, after Anthropic, Google, and OpenAI. Legal departments that already run on Microsoft 365 are now asking what the platform actually contains, how the parts fit, and what it takes to implement. Microsoft's own documentation answers those questions one product page at a time, under names that changed during 2026 (Copilot Notebooks became Workspaces, Scout became Autopilot). Nobody has assembled the account for a legal reader.

Timing: Microsoft Ignite runs 2026-11-17 to 2026-11-20 and is expected to change modes, plugins, agents, and pricing. Write the brief and outline now, draft after Ignite, and re-verify every claim against primary sources before drafting.

## Who this is for

Primary: **legal-ops-director**, who will design and run the platform. Secondary: **corporate-counsel** (the general counsel deciding where the department's AI will live) and **legal-tech-cio** (who will implement it). Article 2 is written more directly for IT.

## The argument

Drafting thesis, for the writer to sharpen:

Anthropic and OpenAI models now run inside Copilot, Harvey, and Legora alike, so the model is the layer that distinguishes legal AI platforms least. What distinguishes them is where the context sits, how the work is organized, what legal content comes with it, and which controls govern it. Microsoft's platform is distinctive because its context and its controls sit inside the tenant the department already governs, and because its legal layer works in Word itself. Understanding the platform means understanding six layers and how a piece of legal work moves through them.

Prime mover (stance section 3): AI is the force; the shift it has produced is that the horizontal AI platforms now ship legal layers, and the question for a department has moved from which tool to which platform. The thesis names that force once and subordinates the rest.

The tool claim (stance section 9) has a natural home here. Microsoft's Legal Agent produces tracked-change redlines through a deterministic resolution layer instead of having the model generate every edit directly. That is the deterministic alternative named by a vendor in its own product, and it links to our earlier article on probabilistic and deterministic AI.

## The shared frame: six layers of an enterprise legal AI platform

This is the section the later Claude, OpenAI, and Google series reuse. It is stated without reference to any vendor, then applied to Microsoft.

1. **Experience:** where people meet the AI (an app, and the applications where legal work is already done).
2. **Work modes:** how work is done, from a single question to delegated, multi-step, long-running work.
3. **Context:** what the AI knows about the organization's work, and under whose permissions.
4. **Models:** the reasoning engines, and who chooses among them.
5. **Extensibility:** how a department or vendor adds skills, connections, agents, and applications.
6. **Trust and governance:** identity, data protection, records, supervision, agent governance, and cost control.

## What the article covers

1. **The six layers** (Exhibit 1: the frame, Microsoft's components on each layer).
2. **Experience.** One Copilot app across web, desktop, and mobile, and Copilot inside Word, Outlook, Teams, SharePoint, OneDrive, Excel, and PowerPoint. Word as the core legal surface: Agent Mode, the legal plugin, precedent drafting from SharePoint, content controls, defined-terms navigation.
3. **Work modes.** Chat, Cowork, Code, and Autopilot; Projects, Workspaces, scheduled tasks, Automations, and user-created skills. Microsoft's own guidance to choose the least setup that meets the need, mapped to legal work (a tested prompt, a scheduled summary, an event-driven NDA triage, a bounded Cowork package, a Code tool, an Autopilot responsibility).
4. **Copilot for legal.** The five skill areas (draft and prepare; review and negotiate; obligations; research into guidance; moving matters forward), the Legal Agent and its deterministic redline layer, and the partner plugins by category.
5. **Microsoft IQ, the context layer.** Work IQ, Fabric IQ, Foundry IQ, and Web IQ. Work IQ can draw in Dataverse and Copilot connector data. What the context layer knows (mail, files, meetings, chats, people) and what it does not know until someone models it: what a matter, an obligation, or a request is, and how they relate. State this generically and link the ontology and knowledge management articles. No Spaarke claim here.
6. **Models.** Multi-model choice (OpenAI and Anthropic models, Auto routing, the ability to restrict model families). Nadella's point that orchestration, context, and memory are separated from any single model, and what follows for a department's investment.
7. **Extensibility.** Skills (`SKILL.md`), Copilot connectors, MCP servers, declarative agents, and plugins as the installable unit; the unified plugin registry. The builder tools from simplest to most technical: skills in Chat and Cowork, Agent Builder, Code with the Copilot Managed Runtime, Copilot Studio, Microsoft Foundry, custom engine agents.
8. **Trust and governance.** Entra identity, Purview (labels, DLP, audit, eDiscovery, retention), Agent 365. The concession: Copilot inherits the department's permissions, so it inherits any oversharing too.
9. **How the layers work together.** One in-house contract request traced end to end: an email arrives, an automation fires, Cowork triages it, the playbook skill and the counterparty paper are pulled in, Word produces tracked-change redlines, the cover email waits for a lawyer's approval, the version is filed to the DMS, the obligations tracker is updated, and Purview records the whole interaction (Exhibit 2).
10. **Close.** The first move for the reader, then the handoff to article 2.

## Objectivity rules for the series

- **Disclosure, up front, in each article.** Spaarke builds on Microsoft 365 and Power Platform and offers a Legal AI Accelerator for Microsoft Copilot. Wording to be settled (open ruling 1).
- **Every vendor claim to a primary source,** with the date. Vendor-reported results are labeled as such (Microsoft's roughly seven-in-ten kept suggestions and its internal fluency, conciseness, and relevance scores; no independent benchmark has been published).
- **Availability is stated.** Features in the Frontier program, in preview, or rolling out are labeled, and the article carries an "as of" date.
- **No Spaarke product claims in the body,** beyond the disclosure and links to our earlier articles.

## Evidence

All from the source briefing, which cites Microsoft Learn, the Official Microsoft Blog, the Microsoft Tech Community, Microsoft Support, LawSites, and Computerworld inline. Every item is **TBD — confirm** against the primary source after Ignite. Key items:

- Copilot for legal GA 2026-10-15; more than 20 skills; five skill areas; partner plugin launch list (Microsoft Tech Community; LawSites).
- Legal Agent's deterministic resolution layer for redlines (Microsoft Tech Community, Legal Agent post).
- Cowork GA 2026-06-16; built on the technology platform behind Claude Cowork; off by default; up to 50 custom skills (Microsoft Copilot Blog; Microsoft Learn).
- Microsoft's three pillars: Copilot, Microsoft IQ, Agent 365 (Official Microsoft Blog, 2026-10-27).
- Plugin definition and registry; admin management of plugins, skills, and MCP servers (Microsoft Learn).
- Purview coverage of Copilot and AI interactions (Microsoft Learn).
- Agent Mode GA 2026-04-22; the Office Agent runs on Anthropic models (Microsoft Copilot Blog; Microsoft Support).

## Links to earlier articles

- `2026-11-03-microsoft-is-now-the-platform-for-legal-ai` (the position this series details).
- `probabilistic-vs-deterministic` (the deterministic redline layer).
- `legal-operations-ontology` and `knowledge-management-legal-operations-intelligence` (what the context layer does not supply).
- `why-we-built-on-microsoft` (disclosure context).
- `ai-without-giving-away-the-keys` and `what-attorneys-need-to-know-about-ai` (governance and grounding).

## What this should not become

- A restatement of the founder article, or a pitch for the accelerator.
- A product catalog. Each component appears because it does a job in legal work, and the article says what the job is.
- A feature list without the connections. The value of the piece is how the layers work together.
- Breathless. No "game-changer", no "revolutionize", no superlatives that the evidence does not carry.

## Open rulings (series-level)

1. **Disclosure wording.** Proposed: "Spaarke builds on Microsoft 365 and Power Platform, and we offer a Legal AI Accelerator for Microsoft Copilot. This series describes the platform as it is, including where it falls short." Confirm or rewrite.
2. **Naming competitors and testing the founder article.** `voice/brand-positioning.md` section 3 says we do not take shots at named competitors. Article 3 names Harvey, Legora, Anthropic, and OpenAI and compares them component by component. Rule that this is permitted as description, and rule whether the series may qualify the founder article's comparative claims where the evidence does.
3. **"Claude Code" or Claude for Legal.** The comparison uses Claude for Legal (Claude.ai, Cowork, the Microsoft 365 add-ins, the legal plugins, Managed Agents), with Claude Code mentioned as one runtime for the plugins. Confirm.
4. **The shared frame.** Confirm that the six layers above are the frame the Claude, OpenAI, and Google series reuse.
5. **Campaign.** This series could sit inside `2026-11-legal-ai-accelerator`, but that campaign's rule is that every asset leads to a meeting, which conflicts with an objective series. Proposed: a new campaign for the multi-provider platform series, cross-linked to the accelerator campaign.
6. **Display dates.** Proposed after Ignite: article 1 on 2026-12-01, article 2 on 2026-12-08, article 3 on 2026-12-15. **TBD — confirm**.
7. **Byline.** Founder byline, as on the accelerator article, or the company byline. See `voice/bylines.md`.
