# Verification notes: r2-ontology-date-discipline

Checked 2026-09-21 by an independent fact-check pass. Every URL below was fetched directly (curl to the scratchpad, GitHub REST API for commit dates, Wayback captures downloaded and text-extracted). Raw downloads are in `fetch/` beside this file. No repository file was touched.

Summary: 23 findings. 20 confirmed, 3 corrected, 0 refuted, 0 unverified. The corrections all concern Wayback coverage or page modification dates, not the quoted text. Three captures the research track said did not exist do exist (LawVu 2026-06-08, Claude for Legal 2026-07-15, Gartner 2026-05-19), and the Claude for Legal page carries a post-publication dateModified that the finding did not mention.

## 1. Ontology overview: March capture and May revision carry the definition sentences

Verdict: confirmed.

- Wayback capture 20260306100720 fetched. Meta: ms.date 2025-10-06, updated_at 2026-02-17T06:08Z, footer "Last updated on 2026-01-28". Contains verbatim: "An ontology is a shared, machine-understandable vocabulary of your business."; the things/facts/connect sentence; the four-bullet business context layer list including "A query surface that lets you ask questions about concepts (not just tables), supporting federated queries across sources"; the NL2Ontology sentence (with the typo "an Natural"); the data-binding paragraph; the manual-refresh note ("Any updates in upstream data sources (like new rows) need to be manually refreshed..."); the preview banner ("Important This feature is in preview").
- raw.githubusercontent.com at 33b11595fc fetched: ms.date 10/06/2025; all the same sentences present ("a Natural"). The refresh note and preview banner are `[!INCLUDE]` directives in the source, so their text comes from include files; rendered page shows them.
- Commit 33b11595fc: 2026-05-14T17:30:05Z (a merge commit, "Merge branch 'main' of fabric-docs-pr into 4-13-scale-ux-howto-4"). GitHub history for docs/iq/ontology/overview.md shows it is the last commit touching the file before 57cc7aa7f1 on 2026-07-21T17:26Z, so the revision was live on 2026-07-13. Confirmed.
- Minor differences between March capture and May source that do not affect the claim: March reads "part of the IQ (preview) workload", May reads "part of the Fabric IQ (preview) workload"; May adds a second intro paragraph ("Ontology provides a scaled, secure, and governed shared business model...").
- usable_by 2026-06-14 is consistent with a source dated 2026-03-06 (text present since at least 2026-02-17).

## 2. Query surface bullet and NL2Ontology sentence unchanged

Verdict: confirmed.

- Both the 2026-03-06 capture and the 33b11595fc source contain the query-surface bullet and the NL2Ontology sentence verbatim. Typo "an Natural" in March, "a Natural" in May: confirmed.
- Live page fetched 2026-09-21 (updated_at 2026-08-28T22:03Z) still contains both sentences, so "same wording as the current page" holds.
- usable_by 2026-06-14 fine.

## 3. Fabric IQ overview three-layer sentence, live 2026-06-02 and unchanged at 2026-07-09

Verdict: confirmed.

- Wayback capture 20260602212517 fetched. Meta: ms.date 2026-05-26, updated_at 2026-06-02T20:16Z, ai-usage ai-assisted. Contains "Fabric IQ brings three layers of business context into Microsoft IQ: unified data, business intelligence, and operational intelligence." and "Ontologies can be generated directly from semantic models already in production, keeping business language consistent across experiences."
- raw source at 5c02cff68f (commit 2026-07-09T09:58:50Z, "Remove Ops Agent Preview references (#15278)", ms.date 07/08/2026) contains both sentences verbatim (links in markdown, same rendered text).
- File history for docs/iq/overview.md: 5c02cff68f is the last commit before f57cce6f0b on 2026-07-29, so it was live on 2026-07-13. Commit 694af590c8 "Pillars > Layers" is 2026-05-28T18:56Z; I fetched the file at that commit and at the prior commit 3cb93be6e0: the "three layers" wording first appears at 694af590c8, the prior revision says "pillars". Rewrite window 2026-05-28 to 2026-06-02 confirmed (further commits 06-01 and 06-02 "Add MS IQ link" at 20:28Z, which is after the capture's 20:16Z build).
- usable_by 2026-06-14 fine.

## 4. "Ontology (preview) defines core business entities..." confirmed in 2026-07-09 revision

Verdict: confirmed.

- 5c02cff68f source line: "[Ontology (preview)](ontology/overview.md) defines core business entities, relationships, properties, rules, and actions. Agents understand what actions are available and how to invoke them." Verbatim.
- 2026-06-02 capture: "Ontologies define core business entities, relationships, properties, rules, and actions. Agents understand what actions are available and how to invoke them." Confirmed, no "(preview)".
- Commit 1da1fae1e9 "Clarify ontology preview" dated 2026-06-03T17:52Z, in file history. Confirmed.
- usable_by 2026-07-10 for the "(preview)" form is right; the non-preview form is usable from 2026-06-02.

## 5. Agent-integration page first published 2026-07-23, no Wayback capture

Verdict: confirmed.

- GitHub history for docs/iq/ontology/concepts-agent-integration.md: exactly one commit, 3d670368db, 2026-07-23T17:16:46Z, "Add ontology agent integration concept article (#15381)". Files: concepts-agent-integration.md added; how-to-create-operations-agent.md, tutorial-4-create-data-agent.md and docs/iq/toc.yml modified. Confirmed.
- Live page meta: ms.date 2026-07-09, updated_at 2026-07-23T22:11Z, ai-usage ai-generated, ms.topic concept-article. Both quotes present: "Consistency: Every agent that shares the ontology uses the same definitions, rules, and metrics, so answers stay consistent across teams and tools." and "An ontology can function as a Model Context Protocol (MCP) server, exposing an API so external AI systems and custom agents can discover and interact with it through MCP."
- Wayback availability API probed at 20260601, 20260713, 20260801, 20260920: no snapshot. CDX returned 504. Confirmed no capture found.
- usable_by 2026-09-01 is an editorial choice (the next display date after 2026-07-23); consistent with the source date.

## 6. MCP how-to page (ms.date 04/14/2026) says ontology can function as an MCP server

Verdict: confirmed.

- raw source at 5c02cff68f: ms.date 04/14/2026; "Ontology can function as an MCP server, exposing an API so that external AI systems can interact with it through the MCP protocol." Preview include present. Orchestrator sentence names "GPT-5, GPT-4.1, Claude Sonnet 4.5, Gemini 2.5 pro, and many more" in public preview. Confirmed.
- File history: created 87ef5b2efd 2026-03-31T19:11Z "Add MCP article"; last commit a73be408a9 2026-06-30T16:15Z "Freshness pass of Fabric feature SKU (#15255)". Live page updated_at 2026-06-30T17:04Z, ms.date 2026-04-14. Confirmed.
- Wayback: no capture at 20260601, 20260713, 20260728; earliest is 20260729203206. Confirmed.
- usable_by 2026-06-14 fine.

## 7. "every agent starts with the same understanding of the business" is on the Fabric IQ overview from 2026-06-02

Verdict: confirmed.

- 2026-06-02 capture and 5c02cff68f both contain "Fabric IQ's three layers ensure that every agent starts with the same understanding of the business and can apply it correctly across workflows." Also "Ontology grounds agents in shared business language and rules so they can reason across domains and trigger governed actions." and "Fabric IQ provides structured grounding for copilots and agents, so answers reflect your enterprise language as defined in your ontology" (the 07-09 revision adds "(preview)" after "ontology"; the 06-02 capture does not).
- Build blog (see 8) contains "This three-tiered foundation helps ensure that every agent starts with the same understanding of the business". Confirmed.

## 8. Build 2026 blog: Fabric IQ GA, ontologies expected GA in coming months

Verdict: confirmed.

- Wayback capture 20260613064313 and the live page both fetched. Meta: datePublished 2026-06-02T16:59:00+00:00, dateModified 2026-06-11T00:57:17+00:00. Byline "Arun Ulag, Executive Vice President, Azure Data, Microsoft".
- Verbatim in both: "Fabric IQ, now generally available, addresses this gap."; "Ontologies in Fabric IQ, expected to be generally available in the coming months, extend semantic models by adding operational context."; "Operations agents, now generally available"; "We're announcing the general availability of graph in Fabric, with general availability of the planning in Fabric coming later this month." (curly apostrophe in source); "Now in preview, Ontologies are accessible directly from Microsoft Foundry as knowledge sources"; "Also in preview, Fabric IQ is now integrated with Microsoft Agent 365 as a first-party model context protocol (MCP) tool".
- Note: the availability API did not return the 20260613 capture in my probes even though a direct fetch of that timestamp works; see finding 23.
- usable_by 2026-06-14 fine.

## 9. Ontology in preview on 2026-06-02 and 2026-07-13

Verdict: confirmed.

- 2026-06-02 capture workload table: "Ontology (preview)", "Plan (preview)", "Graph (preview)", "Operations agent (preview)", and "the IQ (preview) workload". 5c02cff68f (2026-07-09): "Ontology (preview)", "the *IQ (preview)* workload"; Graph and Operations agent without preview label. Commit 43c5743196 "Remove preview from Graph" 2026-06-04T22:42Z; 5c02cff68f "Remove Ops Agent Preview references" 2026-07-09. Confirmed.
- Negative claim (no Microsoft GA announcement for ontology on or before 2026-07-13): consistent with everything seen. The live Learn page on 2026-09-21 is still titled "What Is Ontology (Preview)?" with updated_at 2026-08-28 and the preview banner, so the item was still labelled preview well past the cutoff. A web search surfaced only third-party posts claiming otherwise; none from Microsoft.
- usable_by 2026-07-10 fine.

## 10. iManage MCP Server release, 2026-05-14

Verdict: confirmed.

- Wayback capture 20260611223242 and live page fetched; identical body. Title "iManage MCP Server is now Available to Connect Governed Knowledge to the Broader AI Ecosystem"; dateline "CHICAGO, May 14, 2026" (with an em dash in source). Clients: "whether Harvey, Legora, ChatGPT, Claude, Microsoft Copilot, or a firm's own AI agents". Verbatim: "All AI access to iManage content via MCP is authenticated, permission-bound, and fully logged, respecting existing ethical walls and access controls."; "A single MCP connection replaces a growing list of custom API integrations."; "32% cite integration complexity as one of the biggest barriers to AI adoption" attributed to the iManage Knowledge Work Benchmark Report 2026.
- "general availability", "read-only" and "read only" do not appear. Confirmed.
- usable_by 2026-06-14 fine.

## 11. LawVu MCP server announcement, 2026-06-02, write actions listed

Verdict: corrected (Wayback detail only).

- Correction: a Wayback capture does exist, at 20260608210141 (2026-06-08T21:01Z), which post-dates the page's modified time (2026-06-08T10:46+12:00 = 2026-06-07T22:46Z), so it holds the updated text. The finding said no capture exists. The live URL returns HTTP 403 to plain curl (bot protection) but loads through a normal fetcher.
- Everything else confirmed from the capture and the live page: author Sam Kidd; article:published_time 2026-06-02T08:00:08+12:00; article:modified_time 2026-06-08T10:46:56+12:00; visible "Updated June 8, 2026". "In the initial release, the LawVu MCP server will enable legal teams to use their AI tool of choice to:" followed by five bullets including "Create matters or trigger contract workflows directly from an AI tool" and "Update matter status, create tasks, and set deadlines from connected AI workflows". Clients "such as Claude, ChatGPT, Microsoft Copilot". Governance wording present. Closing "Customers can now bring tools like Claude and ChatGPT into the way legal work runs". No "generally available" / "general availability".
- usable_by 2026-06-14 fine.

## 12. Claude for Legal launch page connector descriptions

Verdict: corrected (Wayback and modification details; quotes confirmed).

- Corrections: (a) a Wayback capture exists at 20260715141014; the finding said none exists. (b) The page carries a dateModified after publication: the 2026-07-15 capture shows datePublished "May 12, 2026", dateModified "Jun 21, 2026"; the live page on 2026-09-21 shows dateModified "Jul 20, 2026". The finding presented the page as simply dated May 12, 2026.
- All quoted connector descriptions are verbatim in both the 2026-07-15 capture and the live page: Box ("search and access files, query documents, create or update content, and extract metadata fields, while enforcing existing Box security and access policies"), Datasite ("to set up folder structures, invite users, search documents, track buyer Q&A, and audit data room readiness"), Relativity ("lets Claude stand up matters, shape workspace schema, govern access, and analyze usage in its AI platform for legal data intelligence, RelativityOne"), Docusign ("orchestrate agreement workflows across the contract lifecycle"), iManage ("permission-bound, auditable access to governed iManage content"), NetDocuments ("draft new documents based on your precedents"), and "Today we're introducing 20+ new MCP connectors ... and 12 new plugins".
- Date discipline: the wording is proven as of a version modified 2026-06-21 and live on 2026-07-15. It was almost certainly present at launch, but no capture before 2026-06-21 exists, so for a display date earlier than 2026-06-21 the exact wording rests on the live page alone. For the 2026-07-14 display date this is fine. Suggested usable_by: 2026-06-21 if strictness is wanted; 2026-06-14 is defensible but unproven.

## 13. Gartner press release primary: London summit attribution

Verdict: confirmed.

- Wayback capture 20260709022118 fetched (curl --compressed handled the gzip). Dateline "LONDON, U.K., May 11, 2026". Text: "Speaking at the Gartner Data & Analytics Summit in London today, Rita Sallam, Distinguished VP Analyst at Gartner, said:" followed by the quotation beginning "Agentic AI outcomes depend on context including semantic representations of data." Summit "May 11-13 in London". Confirmed.
- Bonus: an earlier capture exists at 20260519122104 (2026-05-19) with identical text, which is inside the 2026-06-14 window and better than the 07-09 capture for date discipline.
- I cannot see the "earlier verified note" this finding says it corrects, but the primary supports both the press-release attribution and the stage attribution.

## 14. Gartner prediction and context-layer advice verbatim

Verdict: confirmed.

- Same captures (2026-05-19 and 2026-07-09). Verbatim: "Gartner predicts that by 2027, organizations that prioritize semantics in AI-ready data will increase their agentic AI accuracy by up to 80% and reduce costs by up to 60%."; "Gartner advises data and analytics (D&A) leaders to establish a context layer as a core component of their D&A infrastructure."; "Traditional schema-based data models alone no longer suffice for agentic AI because they lack business context and data meaning."; Sallam: "Context with semantic coherence will become a cost-control and trust strategy, not a nice-to-have". It is framed as a prediction. Confirmed.

## 15. MCP 2025-06-18 changelog: OAuth resource servers, RFC 8707, security page; authorization optional

Verdict: confirmed.

- Changelog page fetched: "Classify MCP servers as OAuth Resource Servers, adding protected resource metadata to discover the corresponding Authorization server. (PR #338)"; "Require MCP clients to implement Resource Indicators as described in RFC 8707 to prevent malicious servers from obtaining access tokens. (PR #734)"; "Clarify security considerations and best practices in the authorization spec and in a new security best practices page." Verbatim.
- Authorization page fetched: "Authorization is OPTIONAL for MCP implementations." and "Authorization servers MUST implement OAuth 2.1 with appropriate security". Verbatim.
- GitHub history of docs/specification/2025-06-18/basic/authorization.mdx: created d2cac4fd14 2025-06-18T19:41Z; last commit 0a736f347d 2025-09-23 ("Run prettier"); intermediate commits are link and wording fixes. Confirmed.

## 16. MCP 2025-06-18 tools page: human in the loop, confirmation prompts, untrusted annotations

Verdict: confirmed.

- Live tools page: all three sentences verbatim. Also checked the original 2025-06-18 revision (d2cac4fd14) of tools.mdx: same sentences present (wrapped across lines with **SHOULD** / **MUST** markup). The file was edited as recently as 2026-07-20 (structuredContent clarification), which does not touch these sentences.

## 17. MCP security best practices 2025-06-18 source file

Verdict: confirmed.

- raw file at d1935d2ce9 fetched. Verbatim: "The primary audience for this document includes developers implementing MCP authorization flows, MCP server operators, and security professionals evaluating MCP-based systems." Sections: Confused Deputy Problem, Token Passthrough, Session Hijacking. "Token passthrough is explicitly forbidden in the [authorization specification](...) as it introduces a number of security risks" (link in the middle of the sentence; rendered text matches the quote).
- History: created d2cac4fd14 2025-06-18; d1935d2ce9 2025-08-11T19:52Z "Format with Prettier"; removed fcc57c725e 2026-03-25T20:05Z "docs: remove spec security_best_practices files covered by redirects" (commit message names docs/tutorials/security/security_best_practices as the target). Live URL today returns 308 to /docs/2025-11-25/tutorials/security/security_best_practices, the versioned path of that living page. Confirmed.

## 18. MCP 2025-11-25 changelog and anniversary post

Verdict: confirmed.

- Changelog 2025-11-25 fetched: "Add support for OAuth Client ID Metadata Documents as a recommended client registration mechanism (SEP-991, PR #1296)"; "Enhance authorization flows with incremental scope consent via WWW-Authenticate (SEP-835)"; "Updated the Security Best Practices guidance." Verbatim.
- Anniversary post fetched (article:published_time 2025-11-25, modified 2026-03-12): "SEP-1024: Client security requirements for local server installation"; "SEP-835: Default scopes definition in authorization specification"; "SEP-1046: OAuth client credentials support for machine-to-machine authorization"; Extensions section with "Optional", "Additive", "Composable", "Versioned independently"; "Authorization Extensions" subsection; "MCP is not just a hobby protocol - we've seen it adopted in some of the most mission-critical workloads." Verbatim.

## 19. 2026-07-28 release candidate post dated 2026-05-21

Verdict: confirmed.

- Live post: article:published_time 2026-05-21T09:00Z, article:modified_time 2026-07-24. Wayback capture 20260716064405 fetched: same published_time, modified_time 2026-05-22T00:51-07:00, and it already contains every quoted sentence: "The release candidate is locked as of May 21, 2026. The final specification will be published on July 28, 2026."; "Six SEPs harden the authorization specification to align more closely with how OAuth 2.0 and OpenID Connect are deployed in practice."; "Clients must now validate the iss parameter on authorization responses per RFC 9207 (SEP-2468)."; "This is a low-cost mitigation for a class of mix-up attack that is more prevalent in MCP's single-client, many-server deployment pattern."; feature lifecycle "with at least twelve months between deprecation and the earliest possible removal"; stateless core, Extensions framework, Tasks, MCP Apps all present.
- So the text is proven as of 2026-05-22 at the latest. usable_by 2026-06-14 fine.

## 20. Enterprise-Managed Authorization stable 2026-06-18

Verdict: confirmed.

- Post fetched: "June 18, 2026 · 5 min · Paul Carleton (Core Maintainer)"; article:published_time 2026-06-18T17:00Z (modified 2026-07-09). Verbatim: "The Enterprise-Managed Authorization (EMA) extension is now stable."; "The extension is being adopted by Anthropic, Microsoft, Okta and a growing number of MCP servers."; "Okta is the first supported identity provider."; "Anthropic has implemented the extension in its shared MCP layer for Claude."; "Centralized policy and audit: access decisions live in the IdP admin console". Wayback capture exists at 20260619180351. usable_by 2026-07-10 fine.

## 21. Tool annotations post, 2026-03-16

Verdict: confirmed.

- Post fetched: article:published_time 2026-03-16 (modified 2026-03-18). Authors Ola Hungerford, Sam Morrow, Luca Chang present. Verbatim: "Every property is a hint. The spec is explicit about this: annotations are not guaranteed to faithfully describe tool behavior, and clients must treat them as untrusted unless they come from a trusted server."; "The defaults are deliberately cautious: a tool with no annotations is assumed to be non-read-only, potentially destructive, non-idempotent, and open-world."; "Many servers ship without them, and clients vary in how strictly they honor the pessimistic defaults."; "the risk profile is a property of the session, not of any single server."

## 22. Build blog three-layer list

Verdict: confirmed.

- 2026-06-13 capture: "It provides three integrated layers of business context: Unified data: OneLake unifies the organization's data estate, spanning analytical and operational data into a single, accessible layer. Business intelligence: Semantic models provide structured, governed representations of that data which organizations already rely on for trusted business metrics and analyze their business. Operational intelligence: Ontologies capture operational context by defining business entities and their relationships so agents can reason in the language of the business." Verbatim.

## 23. CDX API offline; availability API used for point probes

Verdict: corrected (the method note is accurate; the capture list is incomplete).

- CDX status today: web.archive.org/cdx/search/cdx returned an "Internet Archive: Temporarily Offline" page on one call and an nginx 504 on another. Confirmed offline.
- The availability API works but is inconsistent: in one run it returned no snapshot for the ontology overview at 20260117 and 20260306 even though the 20260306100720 capture fetches fine, and no snapshot for the Build blog at 20260613 even though that capture fetches fine. Point probes therefore under-report.
- Captures the finding missed: LawVu article 20260608210141; Claude for Legal 20260715141014; Gartner release 20260519122104 (earlier than the 20260709 capture cited). Captures I additionally saw: ontology overview 20251118230025 and 20260818200509; Fabric IQ overview 20260105134926, 20260429235214, 20260602212517, 20260723213046, 20260824205712; iManage 20260611223242; EMA post 20260619180351; RC post 20260716064405. The statement "LawVu and Anthropic pages none" is wrong.

## usable_by check

All usable_by dates are on or after the source dates and consistent with what the captures prove, with one caveat: finding 12 (Claude for Legal) is proven only from a version modified 2026-06-21, so a strict usable_by would be 2026-06-21 rather than 2026-06-14. Finding 5's usable_by of 2026-09-01 is an editorial display-date choice after the 2026-07-23 publication, consistent with the source.
