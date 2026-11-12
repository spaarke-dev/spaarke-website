# Copilot Among the Legal AI Platforms: Where It Leads and Where It Falls Short

<!--
SUPERSEDED by brief.md (rev. 2, 2026-11-12). The writer's feedback of
2026-11-12 changed the framing: the platform premise and Microsoft's four
strengths lead; the pieces are companions and are never numbered; no single
release date anchors them; the concession is restated as the direction legal
teams are taking; oversharing is dropped; Work IQ is named and the other IQ
products are not. Where this file and the brief differ, the brief governs.
-->

<!--
Idea, rev. 1, 2026-11-12. Article 3 of the three-article Copilot series.
The series notes (relation to the accelerator article, objectivity rules,
the shared six-layer frame, and the open series-level rulings) are in
articles/copilot-legal-ai-platform/idea.md. Read that first; open rulings
1 to 3 there bear directly on this piece.
Target: long-form, about 4,500 to 5,500 words (length_target: open).
Source briefing: C:\code_files\spaarke-research\2026-11-copilot-legal-platform\microsoft-ai-platform-for-legal-2026-11-11.md
Run /idea-to-brief copilot-compared-legal-ai-platforms after article 2's brief.
-->

## The one-sentence topic

How Microsoft's approach to an enterprise legal AI platform compares with Anthropic's Claude for Legal, OpenAI's Astra for Law, Harvey, and Legora: where Copilot matches them, where it does more, and where it does less, judged against what legal work requires.

## Why this matters, why now

Four AI companies built legal verticals in five months (Anthropic, Google, OpenAI, Microsoft), while Harvey and Legora have grown into platforms of their own and plug into the horizontal platforms as well. A general counsel now hears the same claims from all of them. The platforms also depend on one another: Anthropic and OpenAI models run inside Copilot, Harvey, and Legora; Copilot Cowork is built on the technology behind Claude Cowork; Harvey and Legora publish plugins into Copilot and into ChatGPT. A reader needs a comparison that explains how each is built and where the differences actually come from, and that does not pretend Spaarke has no interest.

## Who this is for

Primary: **legal-ops-director**, who has to recommend a platform strategy. Secondary: **corporate-counsel** (the general counsel who decides) and **legal-tech-cio**.

## The argument

Drafting thesis: Copilot leads where legal work depends on the Microsoft 365 estate and the organization's own controls: Office file fidelity, grounding across mail, meetings, and files under existing permissions, governance the department already runs, and a choice of models. It trails where legal work depends on curated legal content, deep legal workflow libraries, independent evidence of quality, and collaboration across the engagement boundary. Most departments that run on Microsoft 365 will be best served by Copilot as the base layer, with specialists connected where research content or firm-side collaboration requires them. The durable asset is the department's own context (its playbooks, precedents, and model of its matters), and because skills and MCP are shared standards, that asset carries across whichever platforms the department runs.

The recommendation (stance section 8) is given by kind of department, not as a ranking: for example, a department whose work lives in Microsoft 365 and whose IT runs Purview; a department with heavy research or litigation demand; a law firm whose work crosses client boundaries. The brief should settle which profiles to use.

## Method (stated in the article before any comparison)

- The same criteria for every platform, taken from the six-layer frame in article 1: experience, work modes, context, models, extensibility, trust and governance. Two legal-specific criteria are added: legal content (research, precedent, practice knowledge) and collaboration across the engagement boundary.
- Each platform judged against what legal work requires, not ranked against the others.
- Primary sources, dated; vendor-reported results labeled. Microsoft has published internal evaluations only; Harvey's BigLaw Bench is Harvey's own benchmark.
- An "as of" date, with Frontier, preview, and trusted-access availability stated.
- The disclosure from the series notes.

## What the article covers

1. **Disclosure and method.**
2. **Two kinds of platform, and how they depend on each other.** Horizontal AI platforms with a legal layer (Microsoft, Anthropic, OpenAI, Google) and legal-native platforms (Harvey, Legora). Shared models, plugins into each other, shared standards (Exhibit 1: dependency map).
3. **Where Copilot leads.** Tracked changes created in Word itself, where competitors work through an add-in; grounding across mail, meetings, and files that respects permissions and labels; governance through Entra, Purview, and Agent 365 that IT already runs; a choice of OpenAI and Anthropic models with Auto routing; one plugin registry under central IT approval.
4. **Where it matches.** Delegated multi-step work (Cowork shares its technology lineage with Claude Cowork); skills in the `SKILL.md` format and MCP; DMS integration through iManage, NetDocuments, and Box plugins.
5. **Where it falls short.** Each with the requirement it fails to meet and what a department does about it:
   - Legal research content: Westlaw, CoCounsel, and LexisNexis were not on the launch partner list (LexisNexis Protégé is available separately); OpenAI has its own U.S. legal search index; Claude for Legal connects to Thomson Reuters CoCounsel, Westlaw, and Practical Law.
   - Evidence of quality: internal evaluations only, no independent benchmark.
   - Surface parity and maturity: Legal Agent reported in Word desktop only during preview; many features in Frontier or preview.
   - Depth of legal workflows: Harvey reports more than 500 lawyer-built agents; Legora's tabular review, monitors, and portal.
   - Collaboration across the engagement boundary: Harvey Shared Spaces with ethical walls; Legora Portal for client delivery and its Intapp Walls and iManage Security Policy Manager integrations. The founder article treats SharePoint and Teams with guest access as the equivalent; this section tests that claim (series open ruling 2).
   - Cost predictability under usage billing.
6. **Claude for Legal and Astra for Law, seen from Copilot.** Brief, because each gets its own series. How each is built, and where its approach differs from Copilot's (Claude: Cowork, Microsoft 365 add-ins, open-source legal plugins, Managed Agents; OpenAI: a legal-tuned model with its own legal search index, trusted access).
7. **Harvey and Legora: alongside or instead.** Both are inside Copilot as plugins or agents (`@Harvey`, the Legora plugin). When a department runs them alongside Copilot, and when one of them is the better primary platform.
8. **Component comparison** (Exhibit 2: the table, by layer and the two legal criteria).
9. **What carries across platforms, and the recommendation.** Skills and MCP connections are becoming portable; the department's context outlasts its choice of platform. The recommendation by kind of department.
10. **Close.** The first move, then the handoff to the Claude series.

## Evidence

Source briefing section 11 and its sources (Claude product pages and the `anthropics/claude-for-legal` repository; OpenAI's Astra for Law announcement and help center; Harvey's site, blog, and FAQ; Legora's site, newsroom, and the Microsoft Marketplace listing; LawSites). Every item **TBD — confirm** against the primary source, including scale figures (Harvey 3,500+ customers; Legora's Series D) and any claim about where a vendor's service runs.

## Links to earlier articles

- Articles 1 and 2 of this series.
- `2026-11-03-microsoft-is-now-the-platform-for-legal-ai`.
- `what-attorneys-need-to-know-about-ai` (the engagement boundary and grounding).
- `your-legal-data-belongs-to-you` (portability of the department's assets).
- `probabilistic-vs-deterministic`.

## What this should not become

- A ranking, a scorecard with totals, or a winner.
- A competitor attack, or a defense of Microsoft. Each shortfall is stated as plainly as each strength.
- A pitch. No accelerator, no Spaarke product claims, no meeting close.
- A full treatment of Claude or OpenAI, which belongs to their own series.

## Open questions for the brief

1. Series open rulings 1 to 3 (disclosure, naming competitors and testing the founder article, Claude for Legal).
2. Whether Google's Gemini Enterprise for Legal (in preview since 2026-08-25) gets a paragraph here or waits for its own series.
3. The department profiles the recommendation uses.
