# Research notes: the broader ontology landscape and why AI has elevated ontology architecture

Research date: 2026-09-21. Track: ontology landscape and AI.
Method: 19 web searches run (session search budget then exhausted), ~45 page fetches attempted, ~35 successful.
Convention: every claim is followed by its source URL and the source date. "Verbatim" means the quote was returned verbatim by the fetch tool; quotes are 30 words or fewer. Where a page returned HTTP 403 and I relied on a mirror or search snippet, that is stated.

---

## 1. Microsoft Fabric IQ and the ontology item

### 1.1 What it is and how Microsoft positions it (primary docs)

- Fabric IQ is part of "Microsoft IQ," alongside Work IQ, Foundry IQ and Web IQ. Microsoft's division of labour: Work IQ = how employees work; Foundry IQ = policies and authoritative documents; Web IQ = the web; Fabric IQ = "context on business entities and data."
  Source: https://learn.microsoft.com/en-us/fabric/iq/overview (ms.date 2026-07-08; updated_at 2026-08-31)
- Verbatim: "Fabric IQ brings three layers of business context into Microsoft IQ: unified data, business intelligence, and operational intelligence."
  Same source. The three layers map to: OneLake (unified data), Power BI semantic models (business intelligence), ontology (operational intelligence).
- Verbatim: "These layers are delivered through two core items in the Fabric IQ workload, ontology (preview) and semantic model, creating shared context over business data in OneLake."
  Same source.
- Operational intelligence layer, verbatim: "Ontology (preview) defines core business entities, relationships, properties, rules, and actions. Agents understand what actions are available and how to invoke them."
  Same source.
- The "why," verbatim: "Organizations work with data at the level of tables and schemas, which are structures built for machines, not meaning."
  And: "Without semantic understanding, AI remains unfit for high-stakes decisions because each question requires manual translation by a domain expert."
  Same source.
- Items in the IQ workload per the docs table: Ontology (preview), Power BI semantic model, Planning, Graph, Data agent, Operations agent. OneLake is the foundation but not an "item" in the workload.
  Same source.
- Item relationships, verbatim: "Ontology declares what connects and why. Graph stores and traverses those connections."
  Same source.

### 1.2 The ontology item: core concepts (primary docs)

- Definition, verbatim: "An ontology is a shared, machine-understandable vocabulary of your business."
  Source: https://learn.microsoft.com/en-us/fabric/iq/ontology/overview (ms.date 2025-10-06; updated_at 2026-08-28)
- It is made up of things (entity types), facts (properties) and connections (relationships), "while offering constraints and rules that keep representations consistent." Same source.
- Core concepts enumerated in the docs: entity type, entity instance, property, relationship (typed, directional, with attributes and cardinality), data binding, ontology graph, ontology querying (including NL2Ontology). Same source.
- Entity types, verbatim: "By elevating the concept above any single table, entity types eliminate conflicting column level definitions across sources."
  Same source.
- Data binding connects definitions to "lakehouse tables, eventhouse streams, and Power BI semantic models," and "bindings turn raw rows and events into governed business objects." Same source.
- Query surface, verbatim: "A query surface that lets you ask questions about concepts (not just tables), supporting federated queries across sources."
  Same source. NL2Ontology "converts your natural language questions into structured queries"; the layer routes to GQL (Graph) or KQL (Eventhouse). Same source.
- Limitation noted in docs: upstream data updates "need to be manually refreshed before they're visible in the ontology item." Same source.

### 1.3 Rules and actions

- Verbatim: "Rules transform ontologies from static information models to operationalized ones."
  And: "The ontology becomes capable of automatically initiating business processes through alerts and automated actions, all within a seamless and context-aware environment."
  Source: https://learn.microsoft.com/en-us/fabric/iq/ontology/how-to-use-rules (ms.date 2026-04-24; updated_at 2026-05-14)
- Rules are built on Fabric Activator, evaluated per entity instance, support temporal conditions and aggregations, and require at least one time-series property binding. Rules are preview. Same source.
- Caveat for an article: in the Microsoft implementation, "actions" are currently Activator-style alert/automation triggers and agent-invoked actions, not Palantir-style governed write-back action types. (My reading of the docs; Microsoft does not make this comparison itself.)

### 1.4 Agents

- Verbatim: "An ontology (preview) item gives AI agents a governed, shared understanding of your business, including key entity types, relationships, definitions, rules, and source mappings."
  Source: https://learn.microsoft.com/en-us/fabric/iq/ontology/concepts-agent-integration (ms.date 2026-07-09; updated_at 2026-07-23; page is flagged "ai-usage: ai-generated" in its metadata)
- Four listed benefits of grounding an agent in an ontology: business meaning, consistency ("Every agent that shares the ontology uses the same definitions, rules, and metrics"), governance, explainability. Same source.
- Agents that can use an ontology as a source: Fabric operations agent, Fabric data agent, Foundry IQ agent, Copilot Studio agent, and custom agents via an ontology MCP server. Same source.
- Verbatim: "An ontology can function as a Model Context Protocol (MCP) server, exposing an API so external AI systems and custom agents can discover and interact with it through MCP."
  Same source.
- Operations agent: "continuously monitors your ontology, surfaces insights against your business goals"; can notify in Teams "or take configured actions when it detects a condition that matches your goals." Same source.

### 1.5 Relationship to Power BI semantic models

- Verbatim: "Ontologies can be generated directly from semantic models already in production, keeping business language consistent across experiences."
  Source: https://learn.microsoft.com/en-us/fabric/iq/overview (2026-07-08 / 2026-08-31)
- Verbatim: "Semantic models deliver trusted KPIs; ontology (preview) defines shared business language for those KPIs."
  Same source (abridged from a longer sentence in "All items together").
- Generation mechanics: tables become entity types; columns become static properties with data bindings; semantic-model relationships become relationship types. Manual follow-up: bind time-series data, review keys, bind relationship types, review the whole ontology.
  Source: https://learn.microsoft.com/en-us/fabric/iq/ontology/concepts-generate (ms.date 2026-01-20; updated_at 2026-05-14)
- Material limitations in that doc: data-binding generation is supported only for Direct Lake mode (not Import or DirectQuery); querying via bindings excludes measures and calculated columns; Fabric Graph "doesn't currently support the Decimal type," so monetary Decimal columns return nulls; only managed lakehouse tables; cannot generate from "My workspace." Same source.
  Relevance for legal ops: spend data is typically Decimal. This is a concrete, citable caution.
- Search-snippet only (NOT verified on a page I could open; Microsoft community blog returned 403): the Microsoft Fabric community blog reportedly frames the difference as a semantic model describing how data is stored versus an ontology describing "what your business actually is."
  Candidate source (403 for me): https://community.fabric.microsoft.com/t5/IQ-Community-Blog/Fabric-IQ-and-Ontology-when-your-data-speaks-the-language-of/ba-p/5176825 (date not confirmed). Do not quote without re-verifying.

### 1.6 Status as of September 2026

- Announced at Ignite, November 2025, with the ontology item in public preview. (Search results citing the Fabric Updates blog; the blog itself returned 403.)
  Candidate primary (403): https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/From-Data-Platform-to-Intelligence-Platform-Introducing/ba-p/5172484
- Build 2026 (2 June 2026), Arun Ulag, EVP Azure Data, Microsoft. Verbatim: "Fabric IQ, now generally available, addresses this gap." Operations agents GA; Graph GA; Planning GA "later this month." Ontology: "Ontologies in Fabric IQ, expected to be generally available in the coming months."
  Source: https://azure.microsoft.com/en-us/blog/microsoft-build-2026-building-agentic-apps-with-microsoft-fabric-and-microsoft-databases/ (2026-06-02)
- Same post, verbatim: "It powers a continuous operational loop where people and agents observe live signals, reason over shared context, and take governed action."
- As of the docs' last update (2026-08-28 and 2026-08-31), Microsoft Learn still labels both the item and the workload as preview: "ontology (preview)" and "the IQ (preview) workload."
  Sources: https://learn.microsoft.com/en-us/fabric/iq/ontology/overview ; https://learn.microsoft.com/en-us/fabric/iq/overview
- Inconsistency to handle carefully: the Build blog says Fabric IQ is GA; Learn still calls the workload "IQ (preview)." A vendor/partner blog (MILL5, 2026-07-06) claims the ontology layer itself is GA; that contradicts Microsoft's own sources and should not be relied on.
  Source of the weaker claim: https://mill5.com/fabric-iq-general-availability/ (2026-07-06)
- I found no Microsoft source announcing ontology GA between June and 21 September 2026. Safe wording: "in preview as of September 2026, with Microsoft saying in June 2026 that general availability was expected in the coming months."
- FabCon Atlanta (March 2026) "What's next for Fabric IQ Ontology" blog exists but returned 403; content not verified.
  https://blog.fabric.microsoft.com/en-us/blog/whats-next-for-fabric-iq-ontology-the-operational-context-that-powers-your-ai-agents-preview/

### 1.7 Independent assessments of Fabric IQ

- Barry Briggs, CTO, Directions on Microsoft (ex-Microsoft), 2025-12-02. Verbatim: "Of all the announcements at Ignite, the IQs will become the most important and consequential."
  Cautions, verbatim: "Creating an ontology, in Fabric or elsewhere, is a major effort and requires on-going maintenance." And: "Few enterprises have a well-architected enterprise data model."
  He recommends starting at department level, and compares with Palantir Foundry (more mature, cohesive metamodel, but consulting-heavy and expensive).
  Source: https://www.directionsonmicrosoft.com/cio-talk-microsoft-gets-iq/ (2025-12-02)
- Nikola Ilic (Data Mozart), 2026-02-03. Verbatim: "If your organization struggles to agree on basic definitions now, an ontology won't magically create consensus."
  Also notes heavy capacity consumption and early-stage glitches. Frames lakehouse as where data lives and ontology as what data means.
  Source: https://data-mozart.com/beyond-the-lakehouse-first-thoughts-on-fabric-iq/ (2026-02-03)

---

## 2. Distinctions: ontology, knowledge graph, semantic layer, data warehouse, data lake / lakehouse

Working set of citable definitions. Note there is no single neutral authority; the best approach for an article is to cite each term to the most authoritative source available and state the distinction in the author's own words.

| Term | What it is | Citable source |
|---|---|---|
| Data lake | "A low-cost storage system for raw data in any format" | Databricks glossary, https://www.databricks.com/glossary/data-lakehouse (undated) |
| Data warehouse | "A structured, SQL-optimized system for business intelligence" | Same |
| Lakehouse | Architecture that "combines the flexibility, cost-efficiency, and scale of data lakes with the data management and ACID transactions of data warehouses" | Same |
| Semantic layer | Julian Hyde's definition as quoted by Simon Späti: "lies between business users and the database, and lets those users compose queries in the concepts that they understand" | https://www.ssp.sh/blog/semantic-context-layer-primer/ (2026-09-12); secondary quotation of Hyde |
| Semantic model (Microsoft) | "a logical description of a domain, like a business"; "curated analytics layer with measures, hierarchies, and dimensions" | https://learn.microsoft.com/en-us/fabric/iq/ontology/concepts-generate (2026-01-20) and https://learn.microsoft.com/en-us/fabric/iq/overview (2026-07-08) |
| Ontology | "a shared, machine-understandable vocabulary of your business": entity types, properties, relationships, constraints and rules | https://learn.microsoft.com/en-us/fabric/iq/ontology/overview (2025-10-06 / 2026-08-28) |
| Ontology (operational, Palantir sense) | "The Ontology is designed to represent the complex, interconnected decisions of an enterprise, not simply the data." | https://www.palantir.com/docs/foundry/architecture-center/ontology-system (undated, (c) 2026) |
| Knowledge graph | Instance-level graph of entities and relationships, governed by a schema/ontology. Canonical academic reference: Hogan et al., "Knowledge Graphs" (covers "the roles of schema, identity, and context") | https://arxiv.org/abs/2003.02320 (submitted 2020-03-04, revised 2021-09-11) |
| Ontology graph (Microsoft) | "a queryable instance graph built from your data bindings and relationship definitions"; nodes are entity instances, edges are links | https://learn.microsoft.com/en-us/fabric/iq/ontology/overview |
| Context graph | "A living record of decision traces stitched across entities and time so precedent becomes searchable." | https://foundationcapital.com/ideas/context-graphs-ais-trillion-dollar-opportunity (published 2025-12-22 per multiple secondary sources; see 4.1 on date) |

Distinctions in plain terms (my synthesis; each element traces to a source above):
- Lake / warehouse / lakehouse answer "where does data live and how is it stored and queried." Ontology answers "what does it mean." (Data Mozart framing, 2026-02-03.)
- A semantic layer standardises measurement (metrics, dimensions) for human BI consumption; an ontology standardises meaning (things, relationships, rules) for reasoning by people and machines. Jessica Talisman, verbatim: "Meaning isn't the same as measurement."
  Source: https://contextandchaos.substack.com/p/ontologies-context-graphs-and-semantic (2026-01-22; Atlan-published newsletter, so vendor-adjacent)
- Ontology is the model (types); a knowledge graph is the populated instance data conforming to it. Microsoft's own docs make this split: ontology "declares what connects and why," Graph "stores and traverses those connections." (learn.microsoft.com/en-us/fabric/iq/overview)
- a16z's framing of the scope gap, verbatim: "A modern context layer should essentially become a superset of what a semantic layer would traditionally cover" including "canonical entities, identity resolution, specific instructions, and governance guidance."
  Source: https://a16z.com/your-data-agents-need-context/ (2026-03-10). Note: the second fragment was returned joined by an ellipsis; re-verify exact wording before quoting as one sentence.
- Vendor explainers that draw the same lines (use as secondary only): Timbr, https://timbr.ai/semantic-layer-vs-ontology-vs-knowledge-graph-vs-context-graph/ ; DataHub, https://datahub.com/blog/ontology-vs-semantic-layer/ ; Atlan, https://atlan.com/know/ontology-vs-semantic-layer/ ; Alation, https://www.alation.com/blog/semantic-layer-vs-ontology-vs-enterprise-context-layer/ (not fetched; dates unknown).

---

## 3. Why LLMs and agents have made ontologies more capable and more necessary

### 3.1 Analysts (Gartner)

- Gartner press release, 2026-05-11 (D&A Summit London), Rita Sallam, Distinguished VP Analyst. Verbatim via mirror: "Agentic AI outcomes depend on context including semantic representations of data." And: "Context with semantic coherence will become a cost-control and trust strategy."
  Prediction: by 2027, organizations that prioritize semantics in AI-ready data will increase agentic AI accuracy by up to 80% and reduce costs by up to 60%. Gartner advises establishing "a context layer" as a core part of D&A infrastructure.
  Primary (403 for me): https://www.gartner.com/en/newsroom/press-releases/2026-05-11-gartner-says-lack-of-semantics-causes-inaccurate-artificial-intelligence-agents-and-wasted-spending
  Mirror actually read: https://it-online.co.za/2026/05/12/lack-of-semantics-causes-inaccurate-ai-agents-wasted-spending/ (2026-05-12)
- Gartner press release, 2026-06-16 (D&A Summit Sydney), Carlie Idoine, VP Analyst: six top D&A trends, including "Reducing AI Agent Risk with Decision Governance" and "Handling Complex Use Cases with GraphRAG." Predictions: explicitly modeled business decisions will be "five times more trusted and 80% faster than ungoverned decisions by 2029"; 40% of enterprises will leverage GraphRAG by 2029.
  Primary (403 for me): https://www.gartner.com/en/newsroom/press-releases/2026-06-16-gartner-identifies-the-top-trends-for-data-and-analytics
  Mirror actually read: https://www.marketscreener.com/news/gartner-identifies-the-top-trends-for-data-and-analytics-ce7f5cdfdb8cff26 (2026-06-16/17)
- Gartner D&A Summit (Orlando, March 2026) as reported by an Atlan-published newsletter (secondary, vendor-adjacent; treat numbers as reported, not verified): Andres Garcia-Rodeja prediction that by 2028, 60% of agentic analytics projects relying solely on MCP will fail without a consistent semantic layer; Rita Sallam on universal semantic layers as critical infrastructure by 2030; 44% of data leaders have implemented semantic layers.
  Source: https://contextandchaos.substack.com/p/gartner-d-and-a-2026-where-the-context (2026-03-19)
- Gartner research note title (paywalled, not read): "Top Trends in D&A for 2026: Making Composite Semantic Layers Interoperable," https://www.gartner.com/en/documents/7440462
- Search-snippet only (Atlan page, not fetched): Gartner predicts 50%+ of AI agent systems will leverage context graphs by 2028. Unverified. https://atlan.com/know/gartner-context-graphs/
- Gartner's Afraz Jaffri on the term, as quoted by George Anadiotis, verbatim: "Using context as an adjective to describe a graph is redundant as a graph implicitly holds context."
  Source: https://dev.to/ganadiotis/beyond-context-graphs-how-ontology-semantics-and-knowledge-graphs-define-context-the-year-of-1apn (originally 2026-03-19; DEV repost 2026-04-18)

### 3.2 Investors

- a16z, Jason Cui and Jennifer Li, 2026-03-10. Verbatim: "Data and analytics agents are essentially useless without the right context."
  They note Palantir has "a long history of constructing ontologies for organizations." Fabric IQ is not mentioned.
  Source: https://a16z.com/your-data-agents-need-context/
- Foundation Capital, Jaya Gupta and Ashu Garg, "AI's trillion-dollar opportunity: Context graphs." See section 4.

### 3.3 Platform vendors

- Microsoft: see section 1. Grounding, shared vocabulary across agents, NL querying over concepts, MCP exposure, governance are all explicit in primary docs.
- Palantir (the longest-standing commercial "ontology" product). Verbatim: "The Ontology models decisions through the four-fold integration of data, logic, action, and security."
  Source: https://www.palantir.com/docs/foundry/architecture-center/ontology-system (undated)
  Semantic elements (object types, properties, link types) vs kinetic elements (action types, functions). Verbatim: "Action types enable you to capture data from operators in your organization or orchestrate decision-making processes that connect to your existing systems."
  Source: https://www.palantir.com/docs/foundry/ontology/overview (undated)
  Actions as tools for agents: in Palantir's agent tooling, an "Ontology action" tool "Gives your chatbot the ability to execute an ontology edit," configurable to run automatically or after user confirmation; object-query and function tools are also exposed.
  Source: https://www.palantir.com/docs/foundry/agent-studio/tools (undated)
- ServiceNow (acquired data.world in 2025). ServiceNow community article, 2025-11-17, verbatim: "In AI terminology, this is known as an ontology, which defines the language, structure, and logic the AI will use." Also: "The Knowledge Graph serves as enterprise memory, and the AI layer becomes the reasoning engine."
  Source: https://www.servicenow.com/community/now-assist-articles/servicenow-knowledge-graph-the-semantic-foundation-for/ta-p/3429209 (2025-11-17)
- Juan Sequeda (ServiceNow, ex-data.world), 2026-06-10. Verbatim: "AI agents need to understand the context of the business to act on your behalf. They are consumers of the semantics." Practical advice, verbatim: "Start small and think big. Do not walk in on day one and try to model your entire enterprise ontology."
  Source: https://juansequeda.substack.com/p/servicenow-is-joining-open-semantic (2026-06-10)
- Snowflake, Salesforce et al.: Open Semantic Interchange (OSI) announced 2025-09-23 by Snowflake with Salesforce, BlackRock, dbt Labs, RelationalAI, ThoughtSpot, Alation, Atlan, Mistral AI and others; vendor-neutral semantic model spec. The announcement does not use the word "ontology"; it is a semantic-model interchange standard. Search snippet (not verified): accepted into the Apache Incubator as "Apache Ossie (Incubating)" in July 2026; ServiceNow joined in June 2026 per Sequeda.
  Source: https://www.snowflake.com/en/blog/open-semantic-interchange-ai-standard/ (2025-09-23)
- SAP: SAP Knowledge Graph grounds Joule agents in SAP business semantics; announced at TechEd 2024, positioned in February 2025 as the "semantic bridge" between Joule agents and Business Data Cloud. Search-snippet level only; page not fetched.
  Candidate source: https://news.sap.com/2025/02/joule-sap-uniquely-delivers-ai-agents/ (2025-02)
- Databricks and Salesforce-specific statements on ontology: not retrieved (search budget exhausted). See gaps.

### 3.4 Evidence that semantics improve LLM accuracy

- Sequeda, Allemang, Jacob (data.world), arXiv 2311.07509, submitted 2023-11-13. Verbatim: "question answering using GPT-4, with zero-shot prompts directly on SQL databases, achieves an accuracy of 16%." Accuracy "increases to 54% when questions are posed over a Knowledge Graph representation."
  Source: https://arxiv.org/abs/2311.07509 (2023-11-13). Note: pre-2025 and uses GPT-4; the absolute numbers are dated, the direction is what is citable.
- Follow-up (search snippet, not fetched): "Increasing the LLM Accuracy for Question Answering: Ontologies to the Rescue!" reports 72% with ontology-based query check and LLM repair. https://arxiv.org/abs/2405.11706 (2024-05)
- LLM-assisted graph construction from unstructured documents: Microsoft Research GraphRAG paper (Edge et al.), verbatim fragment: uses "an LLM to build a graph index in two stages: first, to derive an entity knowledge graph from the source documents."
  Source: https://arxiv.org/abs/2404.16130 (submitted 2024-04-24; revised 2025-02-19)

### 3.5 The six mechanisms, each with its best source

1. Grounding / fewer hallucinations: Gartner 2026-05-11; Microsoft agent-integration doc 2026-07-09; Sequeda benchmark 2023-11-13.
2. Shared vocabulary across multiple agents: Microsoft, "Every agent that shares the ontology uses the same definitions, rules, and metrics" (2026-07-09).
3. Natural-language querying over concepts, not tables: Microsoft NL2Ontology (ontology overview, updated 2026-08-28).
4. LLM-assisted entity extraction and resolution from documents: GraphRAG paper (2024/2025); NetDocuments legal context graph "extracted entities" at document level (2026-05-14); a16z lists "identity resolution" as a context-layer function (2026-03-10).
5. Actions as tools for agents: Palantir agent tools doc (undated); Microsoft overview, "Agents understand what actions are available and how to invoke them" (2026-07-08); ontology MCP server (2026-07-09).
6. Governance: Microsoft (bindings, provenance, access controls carried by the ontology, 2026-07-09); Gartner "decision governance" trend (2026-06-16); Legal IT Insider's auditability concern for legal (2026-05-14).

---

## 4. The "context graph" discussion

### 4.1 Enterprise software

- Origin: Foundation Capital, Jaya Gupta and Ashu Garg, "AI's trillion-dollar opportunity: Context graphs." Multiple secondary sources date it 2025-12-22. (The page's own metadata, as read by my fetch tool, showed a 2026-09-17 timestamp, which appears to be a page-modified or render timestamp, not the original publication date. Cite as December 2025 and verify the day.)
  Source: https://foundationcapital.com/ideas/context-graphs-ais-trillion-dollar-opportunity
- Verbatim definition: "A living record of decision traces stitched across entities and time so precedent becomes searchable."
- Verbatim on decision traces: the "exceptions, overrides, precedents, and cross-system context that currently live in Slack threads, deal desk conversations, escalation calls, and people's heads." (fragment of a longer sentence)
- Verbatim thesis: "Systems of record for decisions, not just objects."
- Verbatim on why incumbents struggle: "Capturing decision traces requires being in the execution path at commit time, not bolting on governance after the fact."
- Commercial framing reported in secondary coverage (not verified on the primary page): the prize is the roughly $4.6 trillion enterprises spend on salaries and services, not the ~$200 billion SaaS market. Search snippet, Forbes 2026-04-03 (403 for me): https://www.forbes.com/sites/josipamajic/2026/04/03/vcs-say-context-graphs-might-be-the-next-big-thing-in-ai/

### 4.2 The critique

- "Rebranding": Jessica Talisman, as summarised by George Anadiotis: "context graph" is a rebranding of existing knowledge-graph and ontology practice and needs solid knowledge-management foundations to materialise.
  Sources: https://hackernoon.com/context-graphs-ontologies-and-the-race-to-fix-enterprise-ai (2026-03-25) and https://dev.to/ganadiotis/beyond-context-graphs-how-ontology-semantics-and-knowledge-graphs-define-context-the-year-of-1apn (2026-03-19 / 2026-04-18). The exact Talisman wording was returned as a paraphrase; do not present it as a direct quote without re-checking.
- Gartner's Afraz Jaffri, verbatim: "Using context as an adjective to describe a graph is redundant as a graph implicitly holds context." (same dev.to source)
- Andreas Blumauer (Graphwise) takes the conciliatory position: context graphs are an evolution of knowledge graphs adding temporal intelligence and decision lineage. (same source)
- Anadiotis names "The Logic Gap": the distance between recording a decision and understanding its meaning, i.e. traces without an ontology are logs. (HackerNoon, 2026-03-25; returned as a near-quote, re-verify wording.)
- "Solved years back in capital markets" counter-view exists: Steve Wilcockson, Finextra. Not fetched. https://www.finextra.com/blogposting/31629/context-graphs-ais-trillion-dollar-opportunity-solved-years-back-in-capmarkets

### 4.3 Legal: NetDocuments (14 May 2026) and iManage (May 2026)

- NetDocuments press release, 2026-05-14: "NetDocuments Unveils the First Context Graph for Legal Work — and a Reimagined Platform Built Around It." Claims the "first system that continuously maps how every matter, document, and communication in a firm connects across hundreds of millions of records," respecting permissions and ethical walls; moves the platform "from a system that stores legal work to a system that truly understands it."
  Source: https://www.netdocuments.com/company-news/netdocuments-unveils-context-graph-legal-platform/ (2026-05-14). Business Wire copy: https://www.businesswire.com/news/home/20260514051456/en/
- Executive quotes (verbatim as returned): Dan Hauck, CPO: "This is the deepest piece of platform engineering we have ever shipped." Josh Baxter, CEO, was returned with an ellipsis ("Legal data is fundamentally different...unlocking its meaning requires understanding it as a connected whole."); re-verify the full sentence before quoting.
- Three levels per LawSites (Bob Ambrogi, 2026-05-14): document level (classification, extracted entities, version history); matter level (how documents in a matter relate); global level (firm-wide expertise, experience, practice patterns). Built with AWS and Elastic; model-agnostic. Private preview opened 2026-05-14 for enterprise AI tier customers; public preview "in the coming months." Hauck, verbatim: "You cannot retrofit this. It has to be built into the core."
  Source: https://www.lawnext.com/2026/05/netdocuments-unveils-legal-context-graph-to-map-legal-knowledge-alongside-a-reimagined-platform.html (2026-05-14)
- NetDocuments' own definition (Scott Kelly, VP Product and AI Strategy; blog undated): a legal context graph is "a live, governed map of legal work" connecting documents with matters, people, communications, activity, legal concepts and permissions. It distinguishes itself from a knowledge graph by analogy: knowledge graph as static map, context graph as real-time navigation. Sources mentioned include emails, spreadsheets, notes, time entries and audit trails.
  Source: https://www.netdocuments.com/blog/understanding-legal-context-graphs-for-ai-agents/ (date not shown)
- Scope observation (mine, from reading the primary sources): every source in the NetDocuments graph is content held in, or activity on, the DMS. Neither the press release nor the explainer mentions spend, invoices, budgets, outside counsel panels or rates, matter-management structured data, or business-system data. This is the factual basis for the "document-centric context is one layer" argument. It is an inference from absence, not a published critique.
- Note the term drift: Foundation Capital's context graph is defined by decision traces captured in the execution path. NetDocuments' use is closer to a permission-aware knowledge graph over documents plus activity; it does not claim to capture decision traces in the Foundation Capital sense. (My comparison of the two primary sources.)
- iManage, ConnectLive 2026: "context fabric" that "understands and reasons over content, relationships, and real-time activity across the organization"; iManage MCP Server; Claude integration. LawSites (Ambrogi, 2026-05-22) says no GA dates or pricing were in the release; a search snippet of iManage's own release says next-generation platform GA October 2026. Conflict unresolved; verify at https://imanage.com/resources/resource-center/news/next-evolution-platform-connectlive-2026/
  Source read: https://www.lawnext.com/2026/05/imanage-touts-ai-momentum-and-a-context-fabric-as-it-unveils-platform-overhaul-at-connectlive-2026.html (2026-05-22)
- Published analysis closest to a critique: Neil Cameron, Legal IT Insider, 2026-05-14. Verbatim: "AI in legal work is only as useful as the context it can reach." And: "The DMS sits in a privileged position to be the trust-and-governance substrate for legal AI." He notes NetDocuments and iManage converged on "context" within weeks of each other, and flags an unresolved governance gap: whether a supervising partner can audit exactly which documents and context fed a given AI output ("a live issue for the whole industry").
  Source: https://legaltechnology.com/netdocuments-reimagines-the-dms-around-context/ (2026-05-14)
- I did not find a published piece that explicitly argues "document-centric context is only one layer" for legal operations. That argument appears to be open ground for Spaarke. See gaps.

---

## 5. Legal-specific standards and ontologies a legal operations ontology would align with

- SALI LMSS (Legal Matter Specification Standard), SALI Alliance. sali.org describes it as "the SALI Alliance's standard taxonomy for labeling legal work" (Services, Areas of Law, Industry, etc.). The GitHub repo describes LMSS.owl as "SALI's primary taxonomy/ontology," with over 18,000 tags, each with a unique IRI; OWL/RDF; MIT licence. LMSS v3 is being released "attribute-by-attribute" via the LMSS Viewer; the repo states that until a formal release, commits remain subject to public review.
  Sources: https://sali.org/explore-the-standard/ ((c) 2026, no page date); https://github.com/sali-legal/LMSS (no release date captured); https://docs.kelvin.legal/docs/models/model-sali/ ((c) 2023)
  Framing point: SALI is a classification vocabulary for describing matters (what kind of work). It is not an operational entity-relationship-action model. An operations ontology would use SALI IRIs as property values on Matter, not as its schema.
- LEDES and UTBMS: the LEDES Oversight Committee is "an international, voluntary, not-for-profit organization." Standards listed on ledes.org: LEDES 98B, 98BI, 2000, XML Ebilling 2.0/2.1/2.2, XML Budgeting, XML Timekeeper Attributes, IPMM Invention Disclosure schema, LEDES API v1 (2020), UTBMS code sets. Latest news item visible: Standardized Error Codes V2 ratified September 2024. XML 2.2.1 ratified May 2023 (search snippet, https://ledes.org/ledes-xml-revisions-press-release-11-may-2023/).
  Source: https://ledes.org/ (fetched 2026-09-21)
  Framing point: LEDES is an exchange format for invoices, budgets and timekeepers; UTBMS is a task/activity/expense code set. They define the shape of spend facts, not the entities around them.
- FIBO (Financial Industry Business Ontology), EDM Council, standardised by OMG, OWL. Verbatim: "The Financial Industry Business Ontology (FIBO) defines the sets of things that are of interest in financial business applications and the ways that those things can relate to one another."
  Source: https://spec.edmcouncil.org/fibo/ (release not shown on fetched page). Search snippet (unverified): 2026/Q2 production release has 2,442 classes; quarterly releases. Relevant modules for legal ops: Business Entities (legal entities, ownership and control), which is the natural alignment for a corporate entity-management domain.
- Akoma Ntoso (OASIS LegalDocML): XML standard for parliamentary, legislative and judicial documents; Version 1.0 is an OASIS Standard (approved August 2018 per search snippet). A search snippet claims a revision was scheduled for approval by end of July 2026; unverified.
  Source: https://www.oasis-open.org/standard/akn-v1-0/ (not fetched; via search)
- LegalRuleML Core Specification v1.0: OASIS Standard, approved 2021-08-30; purpose is to "represent the particularities of the legal normative rules with a rich, articulated, and meaningful mark-up language."
  Source: https://www.oasis-open.org/standard/legalruleml/
  Framing point: Akoma Ntoso and LegalRuleML model the law (texts and norms), not legal department operations. They are adjacent, relevant mainly to regulatory-obligation domains.
- Legal vendor knowledge-graph work found: NetDocuments legal context graph (2026-05-14); iManage context fabric (May 2026); 273 Ventures' Kelvin supporting LMSS via "Kelvin Graph." I did not retrieve anything on Thomson Reuters, LexisNexis, Harvey, Legora, or ELM vendors (Onit, Mitratech, Brightflag, SimpleLegal) publishing an ontology or knowledge graph. See gaps.

---

## 6. Entity-and-action model versus dashboards; decision intelligence

- Palantir's statement is the cleanest citable articulation that an ontology is about decisions. Verbatim: "The Ontology is designed to represent the complex, interconnected decisions of an enterprise, not simply the data."
  And: "The Ontology models decisions through the four-fold integration of data, logic, action, and security."
  Source: https://www.palantir.com/docs/foundry/architecture-center/ontology-system (undated, (c) 2026)
- Microsoft's version: ontology enables "cross-domain reasoning and decision-ready actions"; Build 2026 describes "a continuous operational loop where people and agents observe live signals, reason over shared context, and take governed action."
  Sources: https://learn.microsoft.com/en-us/fabric/iq/ontology/overview ; https://azure.microsoft.com/en-us/blog/microsoft-build-2026-building-agentic-apps-with-microsoft-fabric-and-microsoft-databases/ (2026-06-02)
- Microsoft, verbatim: "Rules transform ontologies from static information models to operationalized ones." (how-to-use-rules, 2026-04-24)
- Talisman, verbatim fragment: "LLMs need context and meaning, not dashboards" (contextandchaos.substack.com, 2026-01-22; re-verify exact wording).
- Decision intelligence (Gartner):
  - 2026 Gartner Magic Quadrant for Decision Intelligence Platforms, published 2026-01-26, authors David Pidsley, Carlie Idoine, Kevin R. Quinn, Gareth Herschel, Kjell Carlsson; 17 vendors; Leaders reported by vendors include SAS, FICO, Quantexa. It is a relatively new MQ. (Search results from vendor reprint pages; Gartner doc https://www.gartner.com/en/documents/7363830 is paywalled.)
  - Definition as paraphrased by a vendor reprint page (ACTICO): platforms that help organisations "design, execute, monitor, and govern decisions end to end" using data, analytics, AI, rules and human judgement. Not verified against Gartner's own text; the Gartner glossary page returned 403.
    Source: https://www.actico.com/knowledge-center/gartner-magic-quadrant-decision-intelligence-platforms-2026/ (2026)
  - June 2026 D&A trend "Reducing AI Agent Risk with Decision Governance": explicitly modeled business decisions "five times more trusted and 80% faster than ungoverned decisions by 2029." (mirror, 2026-06-16)
- Synthesis for the article (mine): a dashboard presents measures and leaves the reader to infer which decision is due and then leave the tool to act. An entity-and-action model attaches state, rules and available actions to the business object itself (a matter over budget, an invoice out of guideline), so the required decision, the supporting information and the means to act arrive together. Palantir (data + logic + action + security), Microsoft (entities + rules + actions + operations agents) and Gartner (explicit decision modeling) are three independent statements of the same shift. Foundation Capital adds the fourth element: record the decision trace so precedent becomes queryable.

---

## 7. Viewpoints found

1. Platform-vendor view (Microsoft, Palantir, ServiceNow, SAP): the ontology is the shared business context layer that makes agents trustworthy and able to act.
2. Analyst view (Gartner): semantics and a context layer are now critical infrastructure for agentic AI; decisions should be explicitly modeled and governed; universal semantic layer is elusive, so "composite" semantic layers.
3. Investor view (Foundation Capital, a16z): context is the next platform layer; Foundation Capital stresses decision traces, a16z stresses a context layer as a superset of the semantic layer.
4. Knowledge-graph practitioner view (Talisman, Jaffri, Anadiotis, Sequeda, Cagle): "context graph" is largely a rebrand; ontologies and knowledge graphs already cover this; without knowledge-management foundations, context graphs will not materialise. Start small.
5. Pragmatic sceptics of Fabric IQ (Briggs, Ilic): important but early; ontology is a major, ongoing effort; tooling does not create organisational consensus; capacity cost and preview limitations are real.
6. Legal DMS vendor view (NetDocuments, iManage): the DMS is the natural home of legal context because that is where work product, permissions and ethical walls live.
7. Legal trade-press view (Cameron): convergence on "context" is real; auditability of what context fed an AI output is unproven.
8. Interoperability view (Snowflake OSI, Salesforce, dbt Labs, ServiceNow): fix semantics through an open, vendor-neutral interchange standard for semantic models rather than a single vendor's ontology.

---

## 8. Gaps and cautions

- Web search budget for the session was exhausted after 19 searches in this track; Databricks, Salesforce, Forrester and legal-vendor follow-ups could not be searched.
- Gartner primary press releases and glossary returned 403; Gartner quotes and numbers were read from mirrors (IT-Online, MarketScreener) or reported by an Atlan-published newsletter. Verify against gartner.com before publication.
- Microsoft Fabric community/blog posts (Ignite announcement, FabCon "What's next," June 2026 "shared context layer") returned 403. The "semantic model describes how data is stored; ontology describes what your business is" line is from a search snippet only.
- No Microsoft source found that announces ontology GA as of 2026-09-21. Ignite 2026 is likely the next milestone; not confirmed.
- Foundation Capital exact publication day: 2025-12-22 per secondary sources; fetch tool showed a 2026-09-17 page timestamp.
- No published critique located that explicitly says legal "context graphs" are document-centric and therefore only one layer; the scope observation is my inference from NetDocuments' own materials.
- No evidence found of ELM/matter-management vendors publishing a legal operations ontology or of CLOC/ACC publishing a data model. Absence of evidence only.
- Forrester: nothing retrieved.
- Databricks and Salesforce: no direct 2025-2026 statement on ontology retrieved (Salesforce appears only as an OSI participant).
- SALI LMSS v3 release status and date not pinned down. FIBO 2026/Q2 class count and Akoma Ntoso 2026 revision are from search snippets only.
- iManage GA timing conflict (LawSites says no date; a search snippet of iManage's release says October 2026).
- Sequeda benchmark figures (16% to 54%) date from November 2023 on GPT-4; use as directional evidence only.
