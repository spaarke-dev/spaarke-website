# Gap research: BI technology state (2025 to Sept 2026) and BI as the deterministic layer

Research date: 2026-09-21. Supports Article 2 (primary) and Article 4 (BI alongside the ontology).

## Method and limits (read first)

- The WebSearch tool was unavailable: the session had already used its 200-search budget, so every WebSearch call was refused. No keyword web searches were run. Public search engines (DuckDuckGo, Bing, Brave, Google) fetched through WebFetch returned CAPTCHA, junk or HTTP 429.
- Substitute method: direct retrieval of primary pages (vendor docs, vendor newsrooms, release notes, analyst blogs), plus on-site searches and index pages (salesforce.com/news search, barc.com search, Forrester author index, docs.getdbt.com/blog index, Databricks and Snowflake release-note indexes, cloud.google.com BI blog index, Microsoft Fabric blog sitemap).
- About 75 pages were downloaded with curl and converted to text; every quote below was copied from the downloaded page text, not from a model summary. Raw files: `scratchpad/research/raw/bi/*.txt`.
- Blocked (HTTP 403): gartner.com (newsroom, reprints, Peer Insights), tableau.com marketing pages, powerbi.microsoft.com blog. Consequence: no Gartner text was read directly. Everything about the 2026 Magic Quadrant below is a vendor's own characterisation on its reprint landing page or press release.
- Dates: "page date" is the publisher's own metadata (article:published_time, ms.date, "Last updated"). Docs pages without a date are marked "undated, accessed 2026-09-21".

---

## (a) Conversational and on-demand BI: release status as of September 2026

### Microsoft Power BI Copilot
- Source: "Overview of Copilot for Power BI", Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction (ms.date 2026-08-24; updated 2026-08-31). Primary.
- Status: mixed. Quote: "The report agent Copilot pane available on the right side of reports is generally available."
- Quote: "The Power BI agent available as a standalone, full-screen experience accessible from the Power BI left navigation is in preview."
- Copilot in apps is also preview. Microsoft now names these "report agent", "Power BI agent", "Power BI app agent".
- Licensing: "A Power BI Pro or Premium Per User (PPU) license alone isn't sufficient—Copilot requires organizational capacity." Capacity: paid Fabric F2+ or Premium P1+.
- Source 2: "Standalone Copilot experience in Power BI (preview)". https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-chat-with-data-standalone (ms.date 2026-07-06; last updated 2026-08-27). Still preview. Also in preview in the Power BI mobile apps.
- Important nuance for the "deterministic" thesis. Quote: "it then uses the measures and other data fields in your semantic model (or even creates new DAX calculations) to generate the answer for you." So Copilot prefers governed measures but can generate new DAX; it is not strictly "call, never recompute".
- "Prepare your data for AI to improve Copilot results (preview)" https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-prepare-data-ai (ms.date 2026-05-26): AI data schemas, verified answers, AI instructions, still labelled preview. "All verified answers are saved to the semantic model."
- Caching detail (copilot-introduction): same prompt on unchanged model within a rolling 24 hours returns the cached response.

### Microsoft Fabric data agents
- Source: "Fabric data agent concepts", Microsoft Learn. https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent (ms.date 2026-05-11; updated 2026-09-09). Primary.
- Status: GA. Quote: "Data agent in Microsoft Fabric is a generally available feature that enables you to build your own conversational Q&A systems by using generative AI."
- GA announcement: Arun Ulag, "FabCon and SQLCon 2026: Unifying databases and Fabric on a single, complete platform", Azure Blog, 2026-03-18. https://azure.microsoft.com/en-us/blog/fabcon-and-sqlcon-2026-unifying-databases-and-fabric-on-a-single-data-platform/ Quote: "I'm excited to share that Fabric data agents are now generally available."
- Read-only. Quote: "The Fabric data agent strictly enforces read-only access, maintaining read-only data connections to all data sources."
- Sources: lakehouse, warehouse, Power BI semantic model, KQL database, mirrored database, ontology, Microsoft Graph; up to five per agent. NL2SQL, NL2DAX, NL2KQL.
- Routing guidance in the doc: "direct questions about financial metrics to a Power BI semantic model, assign queries involving raw data exploration to the lakehouse".
- Reach: usable from Microsoft 365 Copilot, Copilot Studio, Azure AI Foundry, Teams. Quote: "External orchestrators and multi-agent runtimes can invoke Fabric data agents to support end-to-end agentic workflows, while the data agents remain focused on read-only, governed data access." (26 words)
- Power BI MCP servers: https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview (ms.date 2026-09-01). Quote: "The Power BI MCP servers are Model Context Protocol (MCP) servers that AI agents use to discover and call tools to author and query Power BI semantic models and reports."

### Tableau Next and Tableau Agent (Salesforce)
- Tableau Next GA: Salesforce news, "Salesforce Redefines Business Intelligence with Tableau Next", 2025-04-15. https://www.salesforce.com/news/stories/tableau-next-announcement/ Quote: "Tableau Next is now generally available with the Tableau+ SKU." and "Tableau Semantics is now generally available with Tableau Next."
- Same page: "Tableau Semantics serves as the semantic layer, providing Tableau Next and Agentforce with a unified understanding of business data."
- 2026 state: Salesforce news, "Tableau Unveils the Agentic Analytics Platform: Built on Trusted Knowledge", 2026-05-05. https://www.salesforce.com/news/stories/tableau-agentic-analytics-platform-announcement/
  - "Tableau Agent conversational analytics capabilities are generally available now, with new capabilities coming to dashboards in June."
  - "Tableau MCP servers are generally available for Tableau Next, Cloud, and Server."
  - "New integrations for Microsoft Teams, Slack, and Google Workspace are generally available starting today."
  - "The Agentic Analytics Command Center is generally available in the Fall." "Auto Knowledge Graph is generally available in July."
  - Forward-looking disclaimer on the page: some features unreleased.
- Tableau Next overview (help.tableau.com, undated, accessed 2026-09-21): https://help.tableau.com/current/tableau-next/en-us/tableau_next_overview.htm Quote: "Tableau Next is a flexible, API-first analytics platform built with a unified data layer and trusted semantics, and integrating Salesforce with Agentforce."
- Tableau Agent help: https://help.tableau.com/current/online/en-us/web_author_einstein.htm (undated).

### Databricks AI/BI Genie (now the "Genie" family)
- GA: Databricks blog, "AI/BI Genie is now Generally Available", 2025-06-12. https://www.databricks.com/blog/aibi-genie-now-generally-available Quote: "AI/BI Genie is now generally available, enabling users to ask data questions in natural language and receive instant insights."
- Adoption in same post: "over 4000 customers adopted AI/BI Genie during its preview to democratize data and to empower their non-technical users."
- Rename: Databricks release notes, July 2026. https://docs.databricks.com/aws/en/release-notes/product/2026/july Entry dated July 8, 2026: "Genie Spaces are now called Genie Agents." "The name changed across the documentation, but the product's capabilities are unchanged."
- Current product family (docs "Genie", last updated Sep 18, 2026): https://docs.databricks.com/aws/en/genie/ Genie One (business-user interface), Genie Agents (curated domain spaces), Genie Code (developer assistant). Quote: "Every answer is grounded in your organization's data and governed through Unity Catalog."
- Pricing note on same page: "Genie One and Genie Agents usage by users is free through January 31, 2027."
- Release-note index (https://docs.databricks.com/aws/en/release-notes/product/) shows: Genie app for Slack Public Preview (June 2026), Genie app in Microsoft Teams Public Preview (July 2026), Genie One in Microsoft Excel and Google Sheets (Aug 2026), Connect Genie Agents to Microsoft Copilot Studio Public Preview (Nov 2025), Genie One account-level access Beta (Sept 2026). GA status of Genie One itself not confirmed (listed as "Public Preview" in the index, under its September 2025 entry).
- Semantic layer: Unity Catalog metric views, https://docs.databricks.com/aws/en/metric-views/ (last updated Sep 11, 2026). Quote: "you define the metric once, for example sum of revenue divided by distinct customer count, and users can group by any available field. The query engine generates the correct computation."

### Snowflake Cortex Analyst (and Snowflake Intelligence / CoWork, Cortex Agents)
- Cortex Analyst docs (undated, accessed 2026-09-21): https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst Quote: "With Cortex Analyst, business users can ask questions in natural language and receive direct answers without writing SQL."
- Quote on semantics: "Generic AI solutions often struggle with text-to-SQL conversions when given only a database schema, as schemas lack critical knowledge like business process definitions and metrics handling."
- Semantic views are now "the recommended approach"; legacy YAML semantic models still supported. Release-note index shows "Defining semantic views (General availability)" and "Querying semantic views (General availability)" during 2025.
- New in Aug 2026: release note "Aug 28, 2026: Snowflake recommends transitioning from Cortex Analyst to Cortex Agents". https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents Quote: "Your semantic views carry over unchanged. Cortex Agents uses the same semantic views for SQL generation, so you don't need to rebuild your semantic layer." The Cortex Analyst REST API remains available; Cortex Agents uses Cortex Analyst as its structured-data tool.
- Cortex Agents GA: Nov 04, 2025 (release-note index). Cortex Agents for Microsoft Teams and Copilot GA: Nov 05, 2025.
- Snowflake Intelligence GA: release note Nov 04, 2025. https://docs.snowflake.com/en/release-notes/2025/other/2025-11-04-snowflake-intelligence The product is rendered in current docs as "Snowflake CoWork" (page title "Overview of Snowflake CoWork"); I did not find a dated rename notice, so treat the rename date as unknown. "Automations in Snowflake CoWork" GA Sep 11, 2026 (scheduled re-runs of a question, emailed).

### Looker Conversational Analytics (Google Cloud)
- Docs: https://cloud.google.com/looker/docs/conversational-analytics-overview (last updated 2026-09-18 UTC). Quote: "It uses the Looker semantic model — the LookML definitions of your data — as its source of truth to ensure that responses are accurate and consistent."
- Architecture quote: "Instead of querying your database directly, Conversational Analytics determines which fields, filters, sorts, and limits should be used in the query." Next sentence: "Looker then composes and executes the query by using the underlying LookML model."
- Status: Google Cloud blog, 2026-07-28, https://cloud.google.com/blog/products/data-analytics/conversational-analytics-in-google-data-cloud-in-q326 Quote: "BigQuery Conversational Analytics and the Conversational Analytics API are now generally available, adding to the general availability of Conversational Analytics in Looker last year."
- Next '26 post, 2026-04-22, https://cloud.google.com/blog/products/business-intelligence/looker-updates-for-agentic-bi-at-next26 : Conversational Analytics agent "already GA"; Dashboard Agents (Preview); Embedded Conversational Experiences (GA); Agentic Workflows (Preview); managed Looker MCP server (Preview).

### ThoughtSpot (Spotter)
- Product page: https://www.thoughtspot.com/product/spotter (modified 2026-09-10). Quote: "Instead of direct text-to-SQL, Spotter translates questions into search tokens grounded in your governed semantic layer—producing fully traceable, auditable queries." Heading above it: "Deterministic Insights, Full Verifiability".
- Spotter Semantics press release, 2026-03-12: https://www.thoughtspot.com/press-releases/thoughtspot-introduces-spotter-semantics-to-bring-trust-and-context-to-enterprise-ai
- Adoption press release, 2025-10-28: https://www.thoughtspot.com/press-releases/thoughtspot-doubles-user-adoption-on-surging-agentic-analytics-demand Quote: "more than 52% of ThoughtSpot customers were actively leveraging the product to deliver true self-service analytics." The March 2026 release says "over 64% of all customers".
- Spotter 3 plus SpotterViz, SpotterModel, SpotterCode agents named in the 2026-07-01 MQ press release. ThoughtSpot MCP server; connectors "Integrates with Claude, Gemini, Cursor".

---

## (b) Semantic / metrics layer as the governed definition of measures

### Open Semantic Interchange, now Apache Ossie (incubating)
- Launch: Snowflake blog, "Snowflake Unites Industry Leaders to Unlock AI's Potential with the Open Semantic Interchange Initiative", Josh Klahr, Khushboo Bhatia, Nick El-Rayess, 2025-09-23 (visible byline date; page JSON-LD datePublished says 2025-11-04, dateModified 2026-07-23). https://www.snowflake.com/en/blog/open-semantic-interchange-ai-standard/
  - Launch participants named: Alation, Atlan, BlackRock, Blue Yonder, Cube, dbt Labs, Elementum AI, Hex, Honeydew, Mistral AI, Omni, RelationalAI, Salesforce, Select Star, Sigma, ThoughtSpot (plus Snowflake = 17).
  - Quote: "this vendor-agnostic standard ensures that your data's definitions and value remain consistent as they are interchanged between AI agents, BI platforms, and all other tools in your ecosystem".
  - Kleinerman quote: "to solve a foundational challenge for AI — the lack of a common semantic standard."
- Apache: Apache Incubator status page, https://incubator.apache.org/projects/ossie.html Quote: "2026-06-22 Project enters incubation." Description: "It is an open specification that defines a vendor-neutral format for expressing business metrics, dimensions, and their relationships."
- Rename post: "Apache Ossie (Incubating): The New Name for Open Semantic Interchange", Josh Klahr, 2026-07-10. https://ossie.apache.org/updates/ossie-enters-apache-incubator/
  - "Ossie is an open specification for both semantic layer and ontology." (relevant to Article 4)
  - "The participating coalition has grown from 17 launch partners to more than 50 organizations"
  - "When a human analyst or an AI agent runs a query, they shouldn't have to guess which definition is correct."
  - Repo opened November 2025; three working groups: Metric Language, Catalog, Ontology; converters for dbt Semantic Layer and Apache Polaris merged.
- Ecosystem page (https://ossie.apache.org/ecosystem/, accessed 2026-09-21) now lists Microsoft, Databricks, Qlik, Oracle, Collibra, Informatica, ServiceNow, NVIDIA, JetBrains, AtScale, GoodData, Metabase, Lightdash, among others.
- Spec maturity: core-spec/spec.md in https://github.com/apache/ossie says "DRAFT version — in development, schema may change before 0.2.0 is released." Version 0.2.0.dev0. Dialects enumerated include DAX, TABLEAU, THOUGHTSPOT, SNOWFLAKE, DATABRICKS, BIGQUERY, MDX. So: early-stage, not a ratified standard.
- April 2026 community update: https://ossie.apache.org/updates/osi-april-2026-community-update/ (2026-04-28).

### dbt Semantic Layer
- Docs: https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl (page date 2026-08-18). Quote: "If a metric definition changes in dbt, it's refreshed everywhere it's invoked and creates consistency across all applications." Available on dbt platform Starter, Enterprise, Enterprise+.
- dbt MCP server docs: https://docs.getdbt.com/docs/dbt-ai/about-mcp (2026-07-23). "This ensures consistent, governed access to models, metrics, lineage, and freshness across your AI tools."

### Accuracy evidence: governed semantic layer vs raw text-to-SQL
1. dbt Labs, "Semantic Layer vs. Text-to-SQL: 2026 Benchmark Update", Jason Ganz and Benoit Perigaud, dbt Developer Blog, 2026-04-07. https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026 (vendor-run, open-source, reproducible: dbt-labs/dbt-llm-sl-bench)
   - Setup: ACME Insurance benchmark (Sequeda et al., data.world), 11 questions x 20 runs.
   - Modeled project results: claude-sonnet-4-6 Text-to-SQL 90.0% vs Semantic Layer 98.2%; gpt-5.3-codex Text-to-SQL 84.1% vs Semantic Layer 100.0%.
   - On the original normalized schema, in-scope questions: SL 100% for both models vs text-to-SQL 62.5% / 51.2%; all questions: 72.7% SL vs 64.5% text-to-SQL (SL cannot answer out-of-scope questions, returns an error).
   - 2023 vs 2026: text-to-SQL went from 32.7% to 64.5% on the full set.
   - Quote: "The Semantic Layer's deterministic query generation means the LLM can't produce subtly wrong results."
   - Quote: "With text-to-SQL, failure looks like a plausible but incorrect answer. With the Semantic Layer, failure looks like an error message."
   - Quote: "When accuracy matters (board data, auditors, OKRs, KPIs, weekly reports): configure a Semantic Layer and connect your LLM to it."
   - Caveats stated by authors: small benchmark; text-to-SQL was given the entire schema as context, "which isn't practical for larger datasets"; recommendation is both approaches for different jobs. Honest counterpoint: the gap has narrowed sharply since 2023.
2. Sequeda, Allemang, Jacob (data.world), arXiv 2311.07509, submitted 2023-11-13. https://arxiv.org/abs/2311.07509 Quote: "question answering using GPT-4, with zero-shot prompts directly on SQL databases, achieves an accuracy of 16%. Notably, this accuracy increases to 54% when questions are posed over a Knowledge Graph representation". Outside the 2025 to 2026 window; it is the origin benchmark.
3. dbt Labs 2023 original: https://www.getdbt.com/blog/semantic-layer-as-the-data-interface-for-llms (2023-11-30): "83% accuracy rate" on eight addressable questions. Outside window.
4. Google Cloud, "How Looker's semantic layer enhances gen AI trustworthiness", Richard Kuzma and Jesse Sherb, 2025-05-07. https://cloud.google.com/blog/products/business-intelligence/how-lookers-semantic-layer-enhances-gen-ai-trustworthiness Quote: "Our own internal testing has shown that Looker's semantic layer reduces data errors in gen AI natural language queries by as much as two thirds." Internal, unpublished methodology.
5. Snowflake engineering blog, "Snowflake Cortex Analyst: Evaluating Text-to-SQL Accuracy for Real-World Business Intelligence Scenarios", 2024-08-29. https://www.snowflake.com/en/engineering-blog/cortex-analyst-text-to-sql-accuracy-bi/ Quote: "when we tested a state-of-the-art language model, GPT-4o, using our internal evaluation set, its accuracy plummeted to 51%." Cortex Analyst with semantic model "90%+ SQL accuracy"; internal 150-question benchmark. Outside window (2024).

---

## (c) Statements that governed BI metrics are the deterministic, auditable layer for AI agents

### Gartner 2026 Magic Quadrant (vendor reprint pages only; Gartner text NOT read)
- Citation details confirmed by two vendors: "Gartner, Magic Quadrant for Analytics and Business Intelligence Platforms, Anirudh Ganeshan, Christopher Long, Edgar Macari, 29 June 2026" (Qlik reprint landing page, https://www.qlik.com/us/gartner-magic-quadrant-business-intelligence ; Google gives the same title, authors, date).
- Google Cloud, "Google named a Leader in 2026 Gartner Magic Quadrant for Analytics and Business Intelligence Platforms for third year in a row", 2026-07-01. https://cloud.google.com/blog/products/business-intelligence/looker-in-2026-gartner-analytics-and-bi-platforms-mq
  - Vendor's own words (not Gartner's): "we help ensure your autonomous AI agents operate on verified enterprise metrics, not hallucinated guesswork."
  - "a universal semantic layer that establishes a foundation of truth, and Gemini's deep reasoning capabilities that turn that truth into autonomous business action."
- ThoughtSpot press release, 2026-07-01. https://www.thoughtspot.com/press-releases/thoughtspot-named-a-leader-in-the-2026-gartner-magic-quadrant-for-analytics-and-bi-platforms
  - CEO Ketan Karkhanis: "intelligent agents that can understand business context, generate trusted deterministic insights, and drive action"
  - "This ensures employees receive consistent, deterministic insights regardless of how—or in what language—a question is posed."
- Leaders confirmed from their own pages: Google, ThoughtSpot, Qlik. Microsoft and Salesforce (Tableau) positions not verified (pages blocked).

### Forrester (primary: analyst blog posts)
- Boris Evelson, "Multimodal, Semantic, And Agentic Enterprise Data Consumption Is The Future", 2026-07-23. https://www.forrester.com/blogs/the-future-of-enterprise-data-consumption-is-multimodal-semantic-and-agentic/
  - "What matters is grounding them in the same semantic layer so that every agent interprets business terms, metrics, relationships, and context consistently."
  - "The organizations that succeed will be those that treat semantic layers and context graphs not as analytics features but as enterprise infrastructure for data, analytics, and AI."
  - Forrester has launched coverage of semantic layer platforms: landscape report Q4 2026, Wave Q1 2027.
- Boris Evelson with Indranil Bandyopadhyay, "Build Meaning Before Machines: Why Semantics, Ontologies, And Knowledge Graphs Matter For Agentic AI", 2026-06-02. https://www.forrester.com/blogs/build-meaning-before-machines-why-semantics-ontologies-and-knowledge-graphs-matter-for-agentic-ai/
  - "Without explicit context, they guess. And when agents guess, they get joins wrong, misinterpret metrics, and act on flawed assumptions."
  - "Semantic layers have long ensured business-intelligence consistency. In the agentic era, they also give agents the governed context needed to turn natural language into accurate queries and actions."
  - "Most organizations are not yet ready to build a knowledge graph. The semantic layer is the right starting point." (Article 4: semantic layer first, knowledge graph/ontology as destination.)
- Evelson et al., "The Next Evolution Of AI Will Rely On Context Layers", 2026-08-20. https://www.forrester.com/blogs/the-next-evolution-of-ai-will-rely-on-context-layers/ Defines a "context layer" combining "business semantics and governance of semantic layers with the ontological modeling of knowledge graphs."
- Evelson, "Key Takeaways From The Forrester Wave: Business Intelligence Platforms, Q2 2025", 2025-04-10. https://www.forrester.com/blogs/key-takeaways-from-the-forrester-wave-business-intelligence-platforms-q2-2025-research/ "BI is alive and well." "GenAI is not the end of BI."
- Forrester does not use the word "deterministic" in these posts.

### BARC
- "Data quality beats AI hype" (Trend Monitor 2026 commentary), 2025-11-12. https://barc.com/data-quality-beats-ai-hype/ 1,579 participants. "data quality management has returned to the number one spot". Best-in-class companies "put significantly higher importance on decision intelligence and automation, data valuation and monetization, and embedded analytics and AI."
- Trend Monitor 2026 pages: management summary 2026-01-16, trends in detail 2026-01-26, recommendations 2026-02-02 (barc.com/data-bi-analytics-trend-monitor-2026-*). Full report is gated; not read.
- No BARC statement found that frames BI metrics as the deterministic layer for agents. BARC is useful as a counterweight: practitioners rank foundations above gen AI.

### Vendors (explicit "deterministic" language)
- dbt Labs (2026-04-07, above): MetricFlow "handle[s] the actual query generation deterministically." "it can't produce correct-looking numbers that are subtly different across runs: the logic is codified and deterministic."
- dbt Labs, "The dbt MCP server comes to Claude", 2026-07-23. https://docs.getdbt.com/blog/dbt-mcp-server-claude "Your metrics are defined explicitly, so when Claude answers a question about revenue or active users, it returns the trusted number."
- dbt Labs, "dbt_context_engineering", 2026-09-16. https://docs.getdbt.com/blog/dbt-context-engineering "an agent can pull a governed, tested metric through the semantic layer today."
- Google Looker (2025-05-07, above): "Deterministic advanced calculations: Ideal for complex mathematical or logistical operations, Looker eliminates randomness and provides predictable and repeatable outcomes."
- ThoughtSpot (2026-03-12, Francois Lopitaux): "Critically, this deterministic approach relies on our patented search tokens, not text-to-SQL powered by LLMs, which is why we can guarantee the most consistent, trustworthy insights on the market."
- Tableau Pulse release notes, entry "Added July 2, 2026". https://help.tableau.com/current/online/en-us/pulse_intro.htm "Note that this model doesn't analyze your data. Instead, it draws upon pre-calculated insights that are rooted in statistical analysis done by Tableau to answer questions about your metrics." This is the cleanest "LLM narrates, platform computes" statement found.
- Microsoft, Kim Manis, "Why data teams are emerging as leaders in AI agent adoption", 2026-06-29. https://www.microsoft.com/en-us/microsoft-fabric/blog/2026/06/29/why-data-teams-are-emerging-as-leaders-in-ai-agent-adoption/ "It provides a consistent semantic layer across data, allowing agents to work with business entities, relationships, rules, and metrics rather than disconnected tables and schemas." Survey figures from Microsoft and MIT Technology Review research cited in the post: "A majority, 59%, plan to keep humans actively involved in decision-making"; "53% are increasing observability".
- Microsoft does not use "deterministic" for semantic models in the pages read.

### Article 4 link: BI semantic model alongside ontology
- Microsoft Learn, "What is Fabric IQ?" https://learn.microsoft.com/en-us/fabric/iq/overview (ms.date 2026-07-08). "Semantic models and ontologies work together. You can generate or align ontologies directly from semantic models so terminology and KPIs stay consistent across reports, agents, and applications." Ontology item is still "(preview)". "Ontologies can be generated from existing Power BI semantic models, allowing you to bootstrap from trusted logic and definitions already in production."
- Azure Blog 2026-03-18: "Already delivering insights to more than 35 million active users, semantic models provide the ideal foundation for training agents through Fabric IQ." Also "planning in Fabric IQ" and ontologies via MCP server (preview, "soon").
- Apache Ossie covers both semantic layer and ontology (above). Looker: LookML "can support graph models and complex semantic ontologies with BigQuery Graph and Snowflake Semantic Views" (Google, 2026-07-01).

---

## (d) BI audiences widening beyond analysts

- Microsoft, Arun Ulag, FabCon Vienna post, 2025-09-16. https://www.microsoft.com/en-us/microsoft-fabric/blog/2025/09/16/fabcon-vienna-build-data-rich-agents-on-an-enterprise-ready-foundation/ "With more than 30 million monthly active Power BI and Fabric users, it's already the default source of data and insights." Also "more than 25,000 customers, including about 80% of the Fortune 500" and "more than 7 million actively building data visuals."
- Microsoft, Azure Blog 2026-03-18: Fabric "serving more than 31,000 customers"; semantic models "more than 35 million active users".
- Power BI in Teams: https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-collaborate-microsoft-teams (ms.date 2026-06-08): Power BI app in Teams, report tabs in channels and chats, link previews.
- Salesforce 2026-05-05: Tableau "Trusted by 97% of the Fortune 100"; "33 million semantic models built by the DataFam"; headless delivery "directly into Slack, Salesforce, Microsoft Teams, Claude, ChatGPT".
- Tableau Pulse release notes, "Added August 26, 2026": "Receive metric digests and alerts in Microsoft Teams". Slack and email digests already existed.
- Google 2026-07-01: "PayPal, which successfully scaled accurate conversational analytics to 3,000+ users via Claude Desktop and Looker MCP."
- Databricks: Genie in Slack, Teams, Excel, Google Sheets, Copilot Studio (release notes 2025-11 to 2026-09); 4,000+ preview customers (2025-06-12).
- Snowflake Cortex Analyst docs: integrate "where business users already operate, such as Streamlit apps, Slack, Teams, custom chat interfaces".
- ThoughtSpot 2025-10-28: embedded examples: "Thrive Learning deployed ThoughtSpot Embedded in just six weeks to over 20,000 customers"; Navan "over 1,000 customers". Same release relays a Gartner prediction second-hand: "Gartner predicts that by 2026, over 80% of business consumers will prefer intelligence assistance and embedded analytics over traditional dashboards." Not verified against Gartner.
- Forrester baseline (outside window, 2024-07-01), Evelson, "Bring Data To The Other 80% Of Business Intelligence Users": https://www.forrester.com/blogs/bring-data-to-the-other-80-of-business-intelligence-users/ "out of all enterprise decision-makers who could and should be using analytical applications and platforms hands-on, only 20% do so today." Predicts NL (+10%), ML alerting (+20%), embedded/ambient (the rest).
- Forrester 2026-07-23: "Often, the best analytics experience is the one users never consciously recognize as analytics."

## (e) BI metric or threshold triggering automated or agent-run workflow

- Power BI data alerts to Power Automate: https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-flow-integration (ms.date 2025-12-01). "use a template to create a flow that's triggered by a Power BI data alert (notification)."
- Power BI data alerts: https://learn.microsoft.com/en-us/power-bi/create-reports/service-set-data-alerts (ms.date 2026-08-24). "You can automate and integrate alerts with Power Automate." Limits: alerts only on gauges, KPIs, cards pinned to dashboards; "Alerts only work on refreshed data."
- Fabric Activator: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction (ms.date 2026-04-17). "Fabric Activator is a no-code event detection engine that transforms data streams into automated actions." "These actions can include sending emails or Teams notifications, launching Power Automate flows, or integrating with third-party systems." Actions also include Fabric pipelines, notebooks, dataflows, user data functions. Power BI "Serves as an event source for Activator rules on report visuals".
- Activator from Power BI reports: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-get-data-power-bi (ms.date 2026-02-09).
- Power Automate visual in reports: https://learn.microsoft.com/en-us/power-automate/trigger-flow-powerbi-report (ms.date 2025-12-10): user-clicked, data-contextual flows.
- Fabric operations agents: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/operations-agent (ms.date 2026-08-03). "The operations agent monitors real-time data and suggests actionable decisions." Azure Blog 2026-03-18: "Operations agents complement them by monitoring real-time data, detecting patterns, and taking proactive action."
- Tableau Pulse: "You receive an alert when a metric that you're following crosses into an unfavorable threshold range or has a new unfavorable trend." (release notes page above). Tableau Next: "Dashboards can also pull in actions that are driven by Salesforce Flows." Salesforce 2026-05-05: "Tableau's decision engine turns insights into decision and actions, directly triggering workflows so every person and every agent can act on what the data is telling them." (marketing; use case example: auto-create a Salesforce case on declining CSAT.)
- Looker Agentic Workflows (preview), Google Cloud blog 2026-07-29. https://cloud.google.com/blog/products/business-intelligence/looker-adds-agentic-workflows-for-data-monitoring-and-insights "When a metric crosses your defined threshold, the background agent does more than send a basic notification." It runs Key Driver Analysis and posts to Slack or email. Preview, Looker 26.08+.
- ThoughtSpot Spotter page: "Turns insights into action by automatically creating Jira tickets, updating Salesforce opportunities, posting to Slack, or triggering workflows in enterprise systems."
- Snowflake CoWork Automations GA 2026-09-11 (scheduled question re-runs, emailed).
- Forrester 2026-07-23 ("agentic-based subscription analytics"): "These agents can deliver alerts when thresholds are crossed, anomalies emerge, trends shift, or opportunities arise — and eventually recommend or initiate next best actions within governance guardrails."

---

## Viewpoints and tensions worth keeping in the article

1. Vendor consensus: every major platform now routes natural-language questions through a governed semantic model (Power BI semantic model, Tableau Semantics, LookML, Snowflake semantic views, Unity Catalog metric views, dbt MetricFlow, ThoughtSpot search tokens).
2. "Deterministic" is vendor language (dbt, Looker, ThoughtSpot), not analyst language. Forrester says "governed context" and "consistency". Gartner wording unverified.
3. The strict "call, not recompute" pattern is real in dbt MetricFlow, Looker, ThoughtSpot and Tableau Pulse; it is looser in Power BI Copilot (can author new DAX) and Genie/Cortex (LLM writes SQL guided by semantics).
4. The accuracy gap is narrowing: dbt's own 2026 rerun shows text-to-SQL at 84 to 90% on well-modeled data. The durable argument is failure mode (error vs plausible wrong number) and auditability, not raw accuracy.
5. Much of the conversational layer is still preview: Power BI standalone Copilot, Fabric ontology, Looker Agentic Workflows and Dashboard Agents, Genie in Teams/Slack. "Mature" applies to the semantic model and dashboards; "on demand" conversational is GA at Tableau, Databricks, Snowflake, Looker, Fabric data agents.
6. BARC counterweight: practitioners rank data quality, security, culture, governance above gen AI.
7. Standardisation is early: Apache Ossie entered incubation 2026-06-22; spec is a 0.2.0 dev draft.
8. Product names are churning (Genie Spaces to Genie Agents; Snowflake Intelligence shown as Snowflake CoWork; Cortex Analyst folding into Cortex Agents; Data Cloud to Data 360). Name products with a date.

## Gaps
See structured result.
