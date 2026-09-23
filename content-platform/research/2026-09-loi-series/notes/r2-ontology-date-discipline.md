# Research notes: date-discipline support for "The Legal Operations Intelligence Ontology"

Track: r2-ontology-date-discipline. Research date: 2026-09-21.
Target display date: 2026-07-14. Usable sources are dated on or before 2026-07-13.
Extends: `content-platform/research/2026-09-loi-series/notes/ontology-landscape-and-ai.md` (and `.verified.md`) and `open-platforms-api-mcp-build.md` (and `.verified.md`).

## Method and limits

- WebSearch was not used. Every item below was fetched directly by URL, through curl (raw HTML saved under `scratchpad/research-r2/raw/`) or through the Internet Archive.
- The Wayback CDX API (`web.archive.org/cdx/search/cdx`) returned an "Internet Archive: Temporarily Offline" page on every attempt, so snapshot discovery used the availability API (`archive.org/wayback/available?url=...&timestamp=...`), probed at many timestamps. That API returns only the closest single capture to a timestamp, so the "latest snapshot on or before 2026-07-13" figures below are the latest the probes found, not an exhaustive capture list.
- Raw snapshots were downloaded with the `id_` flag (`web.archive.org/web/<timestamp>id_/<url>`), which returns the archived page without the Wayback toolbar. One snapshot (gartner.com) came back gzip-compressed and was decompressed locally.
- For the Microsoft Learn pages, a second and more precise dating method was used: the public source repository `github.com/MicrosoftDocs/fabric-docs` (the Learn page metadata names `fabric-docs-pr` as origin; the public mirror carries the same commits). The GitHub commits API gives the exact commit dates of every revision of each page, and `raw.githubusercontent.com/MicrosoftDocs/fabric-docs/<sha>/docs/iq/...` gives the exact text that was live on 2026-07-13. This is stronger than a Wayback capture, because it dates every sentence.
- Quotes are exact and at most 30 words. Quotes that contain an em dash in the original are not reproduced here (house rule); they are described instead.

## Part A. Microsoft Learn snapshots

### Summary table

| Page | Snapshot URL (Wayback) | Snapshot date | ms.date in snapshot | updated_at in snapshot | Quote check result |
|---|---|---|---|---|---|
| What is ontology (preview)? `learn.microsoft.com/en-us/fabric/iq/ontology/overview` | https://web.archive.org/web/20260306100720/https://learn.microsoft.com/en-us/fabric/iq/ontology/overview | 2026-03-06 (latest capture found on or before 2026-07-13; next capture is 2026-08-18) | 2025-10-06 | 2026-02-17 (page footer shows "Last updated on 2026-01-28") | PASS. Definition sentence, entity types / properties / relationships sentence, "query surface ... concepts (not just tables)" bullet, NL2Ontology sentence, manual-refresh note, data-binding sentence all present with the same wording as the current page |
| Same page, exact text live on 2026-07-13 (GitHub) | https://raw.githubusercontent.com/MicrosoftDocs/fabric-docs/33b11595fc/docs/iq/ontology/overview.md | commit 2026-05-14 (next commit 2026-07-21) | 10/06/2025 | n/a | PASS. Same sentences present verbatim. One added paragraph since March: "Ontology provides a scaled, secure, and governed shared business model used across teams, agents, and workflows in Fabric IQ." |
| What is Fabric IQ? `learn.microsoft.com/en-us/fabric/iq/overview` | https://web.archive.org/web/20260602212517/https://learn.microsoft.com/en-us/fabric/iq/overview | 2026-06-02 (latest capture found on or before 2026-07-13; next capture is 2026-07-23) | 2026-05-26 | 2026-06-02T20:16Z (footer "Last updated on 2026-06-02") | PASS with one wording note. Three-layer sentence and the "generated directly from semantic models already in production" sentence verbatim. The operational-intelligence sentence reads "Ontologies define core business entities, relationships, properties, rules, and actions." in this capture (no "(preview)") |
| Same page, exact text live on 2026-07-13 (GitHub) | https://raw.githubusercontent.com/MicrosoftDocs/fabric-docs/5c02cff68f/docs/iq/overview.md | commit 2026-07-09 (next commit 2026-07-29) | 07/08/2026 | n/a | PASS. All quotes verbatim, including "Ontology (preview) defines core business entities, relationships, properties, rules, and actions." This resolves the TBD in idea.md evidence table A |
| Agent integration concepts `learn.microsoft.com/en-us/fabric/iq/ontology/concepts-agent-integration` | none | No Wayback capture exists at any date (availability API returned no snapshot for 2025-11 through 2026-09-20) | 2026-07-09 (live page) | 2026-07-23 (live page) | FAIL for date discipline. The article was first published on 2026-07-23 (GitHub commit 3d670368db, "Add ontology agent integration concept article (#15381)", which created the file). Its ms.date of 2026-07-09 is an authoring date, not a publication date. It cannot be cited under a 2026-07-14 display date |
| Substitute: Consume ontology (preview) as an MCP server `learn.microsoft.com/en-us/fabric/iq/ontology/how-to-use-ontology-mcp-server` | none on or before cutoff (earliest Wayback capture is 2026-07-29); exact text via https://raw.githubusercontent.com/MicrosoftDocs/fabric-docs/5c02cff68f/docs/iq/ontology/how-to-use-ontology-mcp-server.md | file created 2026-03-31; last pre-cutoff commit 2026-06-30 | 04/14/2026 | live updated_at 2026-06-30 | PASS. Carries the MCP-server statement in near-identical words to the agent-integration page |

### A.1 Ontology overview: quote-by-quote check against the 2026-03-06 capture and the 2026-05-14 source

All of the following are present, word for word, in both the 2026-03-06 Wayback capture and the GitHub text that was live on 2026-07-13:

- "An ontology is a shared, machine-understandable vocabulary of your business."
- "It's made up of the things in your environment (represented as entity types), their facts (represented as properties on entity types), and the ways they connect (represented as relationships)," followed by "while offering constraints and rules that keep representations consistent."
- "A query surface that lets you ask questions about concepts (not just tables), supporting federated queries across sources"
- "It also includes a Natural Language to Ontology (NL2Ontology) query layer, which converts your natural language questions into structured queries and returns relevant results." (The March capture has the typo "an Natural"; the May source has "a Natural".)
- "This enables you to ask questions using business terms, instead of needing to know the details of how your data is stored in different systems."
- "By elevating the concept above any single table, entity types eliminate conflicting column level definitions across sources."
- Data binding: "connects your ontology's definitions (including entity types, properties, and relationships) to concrete data living in OneLake, including lakehouse tables, eventhouse streams, and Power BI semantic models."
- "bindings turn raw rows and events into governed business objects."
- Manual refresh note: "Any updates in upstream data sources (like new rows) need to be manually refreshed before they're visible in the ontology item." (In the source this is an include file, `includes/refresh-graph-model.md`, unchanged since 2025-11-18 apart from formatting.)
- "Both humans and AI agents can use this language for cross-domain reasoning and decision-ready actions."
- "This feature is in preview." banner; title "What is ontology (preview)?"; the workload is "IQ (preview)".

Revision history of the page (GitHub, `docs/iq/ontology/overview.md`): commits on 2025-11-18 (Ignite release), 2025-11-19 to 2025-12-10, 2026-01-13 to 2026-02-16, 2026-04-02, 2026-04-09, 2026-04-22, 2026-04-30, 2026-05-06, 2026-05-13, 2026-05-14, then 2026-07-21 ("Remove obsolete setting") and 2026-08-28 ("Update ontology terminology"). The 2026-08-28 revision is the one the idea file cites; the quoted sentences predate it.

### A.2 Fabric IQ overview: quote-by-quote check against the 2026-06-02 capture and the 2026-07-09 source

Present verbatim in both:

- "Fabric IQ brings three layers of business context into Microsoft IQ: unified data, business intelligence, and operational intelligence."
- "Ontologies can be generated directly from semantic models already in production, keeping business language consistent across experiences."
- "Agents understand what actions are available and how to invoke them. Operations agents monitor live data, detect anomalies, and take governed action."
- "You can also query your ontology using natural language through the NL2Ontology query layer, which converts business questions into structured queries."
- "Organizations work with data at the level of tables and schemas, which are structures built for machines, not meaning."
- "Without semantic understanding, AI remains unfit for high-stakes decisions because each question requires manual translation by a domain expert."
- "Ontology declares what connects and why. Graph stores and traverses those connections"
- Agent grounding: "Fabric IQ provides structured grounding for copilots and agents, so answers reflect your enterprise language as defined in your ontology"
- Shared understanding across agents: "Fabric IQ's three layers ensure that every agent starts with the same understanding of the business and can apply it correctly across workflows."
- "Ontology grounds agents in shared business language and rules so they can reason across domains and trigger governed actions."

Wording that differs between the two versions:

- 2026-06-02 capture (ms.date 2026-05-26): "Ontologies define core business entities, relationships, properties, rules, and actions." and "These layers are delivered through two core items in the Fabric IQ workload, ontology and semantic model".
- 2026-07-09 source (ms.date 07/08/2026, live on 2026-07-13): "Ontology (preview) defines core business entities, relationships, properties, rules, and actions." and "ontology (preview) and semantic model". The "(preview)" labels were added by the commit "Clarify ontology preview" on 2026-06-03, the day after Build.
- Item table as of 2026-07-09: Ontology (preview), Power BI semantic model, Plan (preview), Graph (no preview label; removed 2026-06-04), Data agent, Operations agent (no preview label; removed 2026-07-09). Workload still "IQ (preview)". In the 2026-06-02 capture, Graph and Operations agent still carried "(preview)".

Revision history (GitHub, `docs/iq/overview.md`): heavy revision 2026-05-11 to 2026-06-02 ("Incorporate Microsoft IQ", "Pillars > Layers" on 2026-05-28, "Add Web IQ" 2026-06-01), then 2026-06-03, 2026-06-04, 2026-07-09, 2026-07-29, 2026-08-24, 2026-08-31. The three-layer sentence in its current form therefore dates from the 2026-05-28 to 2026-06-02 rewrite.

### A.3 Agent integration page: cannot be used, and what replaces it

- The file `docs/iq/ontology/concepts-agent-integration.md` did not exist in the docs repository before commit 3d670368db on 2026-07-23T17:16Z. That commit's message is "Add ontology agent integration concept article (#15381)" and it also added the page to `toc.yml`. The live page's `updated_at` is 2026-07-23T22:11Z and its `ai-usage` metadata is `ai-generated`. The `ms.date` of 2026-07-09 is the author's date field, set before publication.
- Consequence for the article: the quotations "Every agent that shares the ontology uses the same definitions, rules, and metrics, so answers stay consistent across teams and tools." and "An ontology can function as a Model Context Protocol (MCP) server" cannot be cited under a display date of 2026-07-14. They become usable from the 2026-09-01 display date onward.
- Substitutes dated on or before 2026-07-13:
  1. Shared vocabulary across agents: Fabric IQ overview (version live 2026-06-02 onward): "Fabric IQ's three layers ensure that every agent starts with the same understanding of the business and can apply it correctly across workflows." Also the Build 2026 blog (2026-06-02): "This three-tiered foundation helps ensure that every agent starts with the same understanding of the business and can apply it correctly across workflows."
  2. Agent grounding: Fabric IQ overview: "Ontology grounds agents in shared business language and rules so they can reason across domains and trigger governed actions." Ontology overview (since 2026-05-14): "It provides a shared context layer that can be consumed by Fabric agents and Real-Time Intelligence components for consistent reasoning and actions."
  3. MCP server: "Consume ontology (preview) as an MCP server" (ms.date 04/14/2026; file created 2026-03-31; last pre-cutoff revision 2026-06-30): "Ontology can function as an MCP server, exposing an API so that external AI systems can interact with it through the MCP protocol." The page also says the server URL takes the form `https://api.fabric.microsoft.com/v1/mcp/dataPlane/workspaces/<workspace-ID>/items/<ontology-item-ID>/ontologyEndpoint` and names GPT-5, GPT-4.1, Claude Sonnet 4.5 and Gemini 2.5 pro as orchestrators available in public preview. Preview banner present.
  4. A second Microsoft MCP statement dated 2026-06-02 (Build blog): "Also in preview, Fabric IQ is now integrated with Microsoft Agent 365 as a first-party model context protocol (MCP) tool".

### A.4 Live page metadata as of 2026-09-21 (for the idea file's citations)

| Page | ms.date | updated_at | ai-usage |
|---|---|---|---|
| ontology/overview | 2025-10-06 | 2026-08-28T22:03Z | none |
| iq/overview | 2026-07-08 | 2026-08-31T22:15Z | ai-assisted |
| ontology/concepts-agent-integration | 2026-07-09 | 2026-07-23T22:11Z | ai-generated |
| ontology/how-to-use-ontology-mcp-server | 2026-04-14 | 2026-06-30T17:04Z | none |

These match the values in idea.md evidence tables A and B, except that the idea file does not yet know that the agent-integration page was published on 2026-07-23 rather than 2026-07-09.

## Part B. Primary-source confirmations dated on or before 2026-07-13

### B.1 Fabric IQ general availability at Build 2026 (2026-06-02), and the ontology item's status

- Source: Arun Ulag (EVP, Azure Data), "Microsoft Build 2026: Building agentic apps with Microsoft Fabric and Microsoft Databases", Microsoft Azure Blog, https://azure.microsoft.com/en-us/blog/microsoft-build-2026-building-agentic-apps-with-microsoft-fabric-and-microsoft-databases/ . JSON-LD datePublished 2026-06-02T16:59Z, dateModified 2026-06-11.
- Pre-cutoff snapshot read: https://web.archive.org/web/20260613064313/ (capture 2026-06-13). Text confirmed there:
  - Heading: "3. Curating semantic meaning with Fabric IQ, now generally available"
  - "Fabric IQ, now generally available, addresses this gap."
  - "Ontologies in Fabric IQ, expected to be generally available in the coming months, extend semantic models by adding operational context."
  - Next sentence: "They define business entities, relationships, properties, rules, and actions, and connect to live signals from Fabric Real-Time Intelligence."
  - "Operations agents, now generally available, then reason over shared live context, make decisions based on policy, and take action in the moment."
  - "We're announcing the general availability of graph in Fabric, with general availability of the planning in Fabric coming later this month."
  - "It powers a continuous operational loop where people and agents observe live signals, reason over shared context, and take governed action in the moment"
  - The three layers, in the blog's words: "Unified data", "Business intelligence", "Operational intelligence: Ontologies capture operational context by defining business entities and their relationships so agents can reason in the language of the business."
  - "Now in preview, Ontologies are accessible directly from Microsoft Foundry as knowledge sources"
- Ontology status on 2026-06-02 and on 2026-07-13: preview. Evidence: the Build blog wording above; the Learn "What is Fabric IQ?" page captured 2026-06-02 lists "Ontology (preview)" in the workload table; the docs commit "Clarify ontology preview" on 2026-06-03 added "(preview)" to further mentions; the page version live on 2026-07-13 still reads "Ontology (preview)" and "IQ (preview) workload". No Microsoft source dated on or before 2026-07-13 announces ontology GA.
- Safe wording for a 2026-07-14 display date: "Microsoft announced Fabric IQ as generally available at Build on 2 June 2026 and said that ontologies in Fabric IQ were expected to become generally available in the coming months; Microsoft's documentation labelled the ontology item a preview."

### B.2 iManage MCP Server (2026-05-14)

- Source: iManage press release, "iManage MCP Server is now Available to Connect Governed Knowledge to the Broader AI Ecosystem", https://imanage.com/resources/resource-center/news/mcp-server-available-broader-ai-ecosystem/ . Dateline in the text: Chicago, May 14, 2026 (the original dateline separates the city and date with an em dash, which is not reproduced here).
- Pre-cutoff snapshot read: https://web.archive.org/web/20260611223242/ (capture 2026-06-11). Confirmed:
  - "today announced iManage MCP (Model Context Protocol) Server, a standardized, open-protocol connection that enables any artificial intelligence (AI) systems to securely access governed iManage content"
  - Clients: "any AI system whether Harvey, Legora, ChatGPT, Claude, Microsoft Copilot, or a firm's own AI agents."
  - "All AI access to iManage content via MCP is authenticated, permission-bound, and fully logged, respecting existing ethical walls and access controls."
  - "A single MCP connection replaces a growing list of custom API integrations."
  - Neil Araujo (CEO): "Customers are not choosing one AI tool and stopping there."
  - Mike Peters (Information Manager, RSM Australia): the MCP Server "provides a practical pathway to do that without treating each AI use case as a bespoke integration project."
  - 32% integration-complexity figure, attributed to the iManage Knowledge Work Benchmark Report 2026.
- Status wording: the title says "is now Available"; the body says "today announced". The phrase "general availability" does not appear. The words "read-only" do not appear (consistent with the earlier fact-check). The release describes access to content and says nothing about writing.

### B.3 LawVu MCP server (June 2026)

- Source: Sam Kidd, "Connecting AI tools to the legal operating system: Introducing the LawVu MCP Server", https://lawvu.com/articles/connecting-ai-tools-to-the-legal-operating-system-introducing-the-lawvu-mcp-server/ . No Wayback capture exists; read live on 2026-09-21. Page metadata: article:published_time 2026-06-02T08:00+12:00 (New Zealand time), article:modified_time 2026-06-08T10:46+12:00; visible line "Updated June 8, 2026". Both dates are before the cutoff.
- Write actions stated, under the heading "What the LawVu MCP server enables at launch" and the lead-in "In the initial release, the LawVu MCP server will enable legal teams to use their AI tool of choice to:":
  - "Search and query matters and contracts in natural language, with structured results and links back to LawVu"
  - "Summarize and report across matters or contracts, including key details, gaps, risks, and status updates"
  - "Retrieve policy and knowledge answers grounded in internal legal content"
  - "Create matters or trigger contract workflows directly from an AI tool"
  - "Update matter status, create tasks, and set deadlines from connected AI workflows"
- Framing sentences: "This moves AI from "ask to answer" toward "ask to act."" Clients named: "Claude, ChatGPT, Microsoft Copilot". Governance: "LawVu provides that governance and audit layer" with "permissions that respect what record access is appropriate based on who is using the tool" and workflows "from human approvals through to more autonomous execution over time."
- Availability: the list uses the future tense ("will enable"), while the closing section says "Customers can now bring tools like Claude and ChatGPT into the way legal work runs". The page does not use the words "generally available" or "beta". Treat GA as unconfirmed and attribute the write actions to the vendor's launch article. This is a vendor source (voice/domain-knowledge.md section 6).
- Correction to the older track: `open-platforms-api-mcp-build.md` section 1 lists LawVu under "nothing found"; the gap track and this note supersede that.

### B.4 Anthropic, Claude for Legal (2026-05-12): connector descriptions with write verbs

- Source: https://claude.com/blog/claude-for-the-legal-industry , dated "May 12, 2026" on the page. No Wayback capture exists; read live on 2026-09-21. The blog index around it shows later posts dated Jun 18, Sep 15 and Sep 17, 2026, so the page itself is unchanged in date.
- Exact connector descriptions (Anthropic's words about each connector):
  - Box: "connects Claude to content stored in Box to search and access files, query documents, create or update content, and extract metadata fields, while enforcing existing Box security and access policies"
  - Datasite: "to set up folder structures, invite users, search documents, track buyer Q&A, and audit data room readiness."
  - Relativity: "lets Claude stand up matters, shape workspace schema, govern access, and analyze usage in its AI platform for legal data intelligence, RelativityOne."
  - Docusign: "connects Claude to your agreement data so you can quickly surface key terms like renewal dates and obligations, and orchestrate agreement workflows across the contract lifecycle"
  - iManage: "gives Claude permission-bound, auditable access to governed iManage content, including matter history, documents, and institutional knowledge"
  - NetDocuments: "lets Claude search and retrieve documents from your NetDocuments repository and draft new documents based on your precedents"
  - Ironclad: "lets Claude access your contract repository and workflows and ask questions about contracts in plain language, with results automatically scoped to each user's permissions."
  - Everlaw: "lets Claude search, organize, and retrieve documents from Everlaw projects using metadata, keywords, and document types, with direct review links"
- Count wording: "Today we're introducing 20+ new MCP connectors that link Claude to the software the legal industry already relies on, and 12 new plugins tailored to specific legal work and practice areas."
- Also on the page: "The plugin and skill ecosystem are open protocols, and early contributors including Box, Legal Quants, Lawve AI, and Thomson Reuters have already shipped skills, plugins, and style conventions of their own."

### B.5 Gartner press release, 2026-05-11, read from gartner.com through the Internet Archive

- Primary URL: https://www.gartner.com/en/newsroom/press-releases/2026-05-11-gartner-says-lack-of-semantics-causes-inaccurate-artificial-intelligence-agents-and-wasted-spending (gartner.com refuses direct automated access).
- Pre-cutoff snapshot read: https://web.archive.org/web/20260709022118/ (capture 2026-07-09; the archived response was gzip-encoded and was decompressed locally). Title: "Gartner Says Lack of Semantics Causes Inaccurate AI Agents and Wasted Spending". Dateline: "LONDON, U.K., May 11, 2026".
- Confirmed verbatim on the primary:
  - "Speaking at the Gartner Data & Analytics Summit in London today, Rita Sallam, Distinguished VP Analyst at Gartner, said:" then "Agentic AI outcomes depend on context including semantic representations of data."
  - "Gartner predicts that by 2027, organizations that prioritize semantics in AI-ready data will increase their agentic AI accuracy by up to 80% and reduce costs by up to 60%."
  - "Context with semantic coherence will become a cost-control and trust strategy, not a nice-to-have," said Sallam.
  - "Gartner advises data and analytics (D&A) leaders to establish a context layer as a core component of their D&A infrastructure."
  - "Traditional schema-based data models alone no longer suffice for agentic AI because they lack business context and data meaning."
  - "Gartner expects that regulators will demand greater semantic transparency, and boards will increasingly treat semantic governance as both a strategic risk and a competitive opportunity."
  - The summit dates: "May 11-13 in London".
- Correction to the earlier `.verified.md` note (item 7): the primary release does attribute the quotation to Sallam "Speaking at the Gartner Data & Analytics Summit in London today". The IT-Online mirror omitted that sentence. The article may therefore say "in a Gartner press release of 11 May 2026" or "speaking at Gartner's Data & Analytics Summit in London on 11 May 2026"; both are supported. It remains a prediction and should be cited as one.
- One sentence in the release contains an em dash and is not reproduced here; it says that organizations that fail to adopt comprehensive context structures supported by a robust data layer will perpetuate data inefficiencies and face heightened financial costs, as well as legal and reputational damage.

## Part C. Model Context Protocol: authorization and security sources dated on or before 2026-07-13

The idea file cites the 2026-07-28 specification release (blog post of 2026-07-28), which is after the cutoff. The following primary sources cover the same ground earlier.

### C.1 Specification revision 2025-06-18 (final)

- Changelog: https://modelcontextprotocol.io/specification/2025-06-18/changelog . Verbatim: "Classify MCP servers as OAuth Resource Servers, adding protected resource metadata to discover the corresponding Authorization server." and "Require MCP clients to implement Resource Indicators as described in RFC 8707 to prevent malicious servers from obtaining access tokens." and "Clarify security considerations and best practices in the authorization spec and in a new security best practices page."
- Authorization: https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization . Verbatim: "Authorization is OPTIONAL for MCP implementations." and "Authorization servers MUST implement OAuth 2.1 with appropriate security" and "MCP servers MUST validate that access tokens were issued specifically for them as the intended audience". The page's security section lists Token Audience Binding and Validation, Token Theft, Communication Security, Authorization Code Protection, Open Redirection, Confused Deputy Problem, and Access Token Privilege Restriction. GitHub history: created 2025-06-18, editorial fixes through 2025-09-23, nothing after.
- Tools (server side): https://modelcontextprotocol.io/specification/2025-06-18/server/tools . Verbatim: "For trust & safety and security, there SHOULD always be a human in the loop with the ability to deny tool invocations." Applications "SHOULD" "Present confirmation prompts to the user for operations, to ensure a human is in the loop". And: "For trust & safety and security, clients MUST consider tool annotations to be untrusted unless they come from trusted servers."
- Security best practices (2025-06-18 version): the source file `docs/specification/2025-06-18/basic/security_best_practices.mdx` was created 2025-06-18 and removed on 2026-03-25 in favour of a redirect to a living page at `docs/tutorials/security/security_best_practices`. The live URL therefore now serves later content (it includes sections on local server compromise and OAuth URL validation that the 2025 file did not have). The dated text is at https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/d1935d2ce9/docs/specification/2025-06-18/basic/security_best_practices.mdx (commit 2025-08-11, formatting only). Its sections: Confused Deputy Problem, Token Passthrough, Session Hijacking. Verbatim: "The primary audience for this document includes developers implementing MCP authorization flows, MCP server operators, and security professionals evaluating MCP-based systems." and "Token passthrough is explicitly forbidden in the authorization specification". This sentence about audience is the cleanest primary statement that the protocol's security guidance is addressed to implementers and operators.

### C.2 Specification revision 2025-11-25 (final) and its release post

- Blog: "One Year of MCP: November 2025 Spec Release", MCP Core Maintainers, 2025-11-25, https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/ . Verbatim: "MCP is not just a hobby protocol - we've seen it adopted in some of the most mission-critical workloads." Lists "SEP-1024: Client security requirements for local server installation" and "SEP-835: Default scopes definition in authorization specification". Introduces extensions ("Optional", "Additive", "Composable", "Versioned independently") and authorization extensions, the first being "SEP-1046: OAuth client credentials support for machine-to-machine authorization". Also: SEP-991 "URL-based client registration using OAuth Client ID Metadata Documents".
- Changelog: https://modelcontextprotocol.io/specification/2025-11-25/changelog . Verbatim items: "Enhance authorization flows with incremental scope consent via WWW-Authenticate (SEP-835)"; "Add support for OAuth Client ID Metadata Documents as a recommended client registration mechanism (SEP-991, PR #1296)"; "Updated the Security Best Practices guidance."; "Align OAuth 2.0 Protected Resource Metadata discovery with RFC 9728".
- Note on MCP's origin for a background sentence: the 2025-11-25 post is titled "One Year of MCP" and the 2025-12-09 post is "MCP joins the Agentic AI Foundation" (https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/, not read in this pass). The idea file's "introduced by Anthropic as an open standard in November 2024" remains TBD as a verbatim primary statement, but the anniversary post's title and date support "November 2024" as the launch month.

### C.3 MCP blog posts before the cutoff that cover the 2026-07-28 changes

- "The 2026-07-28 MCP Specification Release Candidate", 2026-05-21, https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ . Verbatim: "The release candidate is locked as of May 21, 2026. The final specification will be published on July 28, 2026." Section "Authorization Hardening": "Six SEPs harden the authorization specification to align more closely with how OAuth 2.0 and OpenID Connect are deployed in practice." and "Clients must now validate the iss parameter on authorization responses per RFC 9207 (SEP-2468)." and "This is a low-cost mitigation for a class of mix-up attack that is more prevalent in MCP's single-client, many-server deployment pattern." Also: a stateless protocol core, the Extensions framework, Tasks, MCP Apps, and "a formal deprecation policy" with "at least twelve months between deprecation and the earliest possible removal". With this source the article can keep the authorization-hardening point under a 2026-07-14 display date, described as a release candidate that was due to become final on 28 July.
- "Enterprise-Managed Authorization: Zero-touch OAuth for MCP", Paul Carleton (Core Maintainer), 2026-06-18, https://blog.modelcontextprotocol.io/posts/enterprise-managed-auth/ . Verbatim: "The Enterprise-Managed Authorization extension to the Model Context Protocol is now stable, enabling organizations to centrally provision MCP server access through their identity provider". "The extension is being adopted by Anthropic, Microsoft, Okta and" others (sentence continues). "Centralized policy and audit: access decisions live in the IdP admin console". "Okta is the first supported identity provider." This confirms, from the primary, the earlier fact-check's point that EMA pre-dates the 2026-07-28 release.
- "Tool Annotations as Risk Vocabulary: What Hints Can and Can't Do", Ola Hungerford, Sam Morrow (GitHub), Luca Chang (AWS), 2026-03-16, https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/ . Verbatim: "Every property is a hint. The spec is explicit about this: annotations are not guaranteed to faithfully describe tool behavior, and clients must treat them as untrusted unless they come from a trusted server." and "The defaults are deliberately cautious: a tool with no annotations is assumed to be non-read-only, potentially destructive, non-idempotent, and open-world." and "Many servers ship without them, and clients vary in how strictly they honor the pessimistic defaults." and, on prompt injection, "the risk profile is a property of the session, not of any single server." This is the best pre-cutoff primary statement that the protocol leaves the decision about confirmation and trust to each client and operator.
- "Evolving OAuth Client Registration in the Model Context Protocol", 2025-08-22, https://blog.modelcontextprotocol.io/posts/client_registration/ (listed in the feed; not read in this pass).

### C.4 Suggested replacement wording for the idea file's MCP row

Evidence table E currently reads: "MCP specification release, 2026-07-28, Authorization hardening". Replace with two rows usable at 2026-07-14: (1) MCP specification 2025-06-18 and 2025-11-25 (authorization is OAuth 2.1 based and optional; servers are resource servers; resource indicators required; security best practices addressed to implementers and operators; human in the loop SHOULD for tool invocations; annotations untrusted by default); (2) MCP blog, release candidate of 2026-05-21 (authorization hardening, iss validation, due to become final on 2026-07-28) and EMA extension stable on 2026-06-18. The trade-press view that the July release "shifts critical security responsibilities" to developers and operators (SecurityWeek via The Legal Wire, 2026-08-03) is after the cutoff; the 2025-06-18 audience sentence and the 2026-03-16 annotations post make the same point earlier, in the project's own words.

## What changes in idea.md for a 2026-07-14 display date

1. Evidence table A: keep the ontology overview and Fabric IQ overview citations; change the "updated" dates cited to the versions that were live on 2026-07-13 (ontology overview: revision of 2026-05-14, ms.date 2025-10-06; Fabric IQ overview: revision of 2026-07-09, ms.date 2026-07-08). The sentence "Ontology (preview) defines core business entities, relationships, properties, rules, and actions." is confirmed verbatim in the 2026-07-09 revision and can lose its TBD marker.
2. Evidence table B: drop the agent-integration page row (published 2026-07-23). Replace its two quotations with the Fabric IQ overview "every agent starts with the same understanding of the business" sentence and the MCP how-to page "Ontology can function as an MCP server" sentence.
3. Evidence table B: the Gartner row can now cite gartner.com directly (verified through the 2026-07-09 archive capture) and may mention the London summit.
4. Evidence table C: the Build blog row is confirmed from a 2026-06-13 capture; the phrase "the documentation updated on 2026-09-11 still labels the item a preview" must be replaced by "the documentation as of 9 July 2026 still labelled the item a preview".
5. Evidence table E: iManage (2026-05-14), Anthropic (2026-05-12) and LawVu (2026-06-02, updated 2026-06-08) are all usable; Docusign (2026-09-04), Brightflag (2026-08-18), Google (2026-08-25), OpenAI Astra (2026-09-17), Relativity and Google (2026-08-25), Thomson Reuters August release, Artificial Lawyer 2026-09-18 and ComplexDiscovery items dated after 2026-07-13 are not. The LawVu article becomes the most recent confirmed write-action example available to the piece. The MCP row changes as in C.4 above.
6. "Why now": the three-frontier-provider sentence loses Google (2026-08-25) and OpenAI (2026-09-17); only Anthropic (2026-05-12) is usable.

## Gaps

- The Wayback CDX API was offline throughout, so the capture lists are the product of point probes. A later run should re-query CDX to confirm there is no capture of the ontology overview between 2026-03-06 and 2026-07-13, and none of the agent-integration page at all.
- No archive capture exists for the LawVu article or the Anthropic launch page; both were read live. Their published dates come from page metadata and visible date lines, which is normal but not a third-party timestamp. A Save Page Now capture could be made, but it would only carry today's date.
- The MCP blog post "MCP joins the Agentic AI Foundation" (2025-12-09) and "Evolving OAuth Client Registration" (2025-08-22) were listed from the RSS feed but not read.
- The Microsoft Fabric blog and community blog (blog.fabric.microsoft.com, community.fabric.microsoft.com) were not attempted in this pass; the Azure blog by Arun Ulag is the primary used for Build 2026.
- The 2025-11-25 version of the security best practices page was not read; the 2025-06-18 version was, and the 2025-11-25 changelog says the guidance was updated.
