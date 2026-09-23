# Verification notes: ontology-landscape-and-ai

Checked 2026-09-21. Method: WebFetch plus raw curl of each source page (WebSearch budget was exhausted for the
session, and public search engines returned CAPTCHA/429, so primary-source discovery relied on direct URLs,
sitemaps and Substack archive APIs). Gartner.com returned 403 on every attempt.

Legend: CONFIRMED = seen with my own eyes on a credible page. CORRECTED = substance right, detail wrong.
UNVERIFIED = could not see it.

---

## 1. Fabric IQ = three layers of business context — CONFIRMED
- URL: https://learn.microsoft.com/en-us/fabric/iq/overview (ms.date 2026-07-08, updated_at 2026-08-31)
- Exact quote present: "Fabric IQ brings three layers of business context into Microsoft IQ: unified data,
  business intelligence, and operational intelligence."
- Work IQ, Foundry IQ, Web IQ all named. IQ workload table lists exactly: Ontology (preview), Power BI semantic
  model, Planning, Graph, Data agent, Operations agent.
- "Ontology declares what connects and why. Graph stores and traverses those connections" — present verbatim.
- Caveat: page still calls the workload "IQ (preview)" and the item "ontology (preview)".

## 2. Ontology item definition / NL2Ontology — CONFIRMED
- URL: https://learn.microsoft.com/en-us/fabric/iq/ontology/overview (ms.date 2025-10-06, updated_at 2026-08-28)
- Exact quote present: "An ontology is a shared, machine-understandable vocabulary of your business."
- Core concepts, binding sources (lakehouse tables, eventhouse streams, Power BI semantic models), manual
  refresh note, NL2Ontology, "query surface that lets you ask questions about concepts (not just tables)" all seen.
- "This feature is in preview" banner present.

## 3. Ontology still preview; Fabric IQ / graph / operations agents GA at Build 2 June 2026 — CONFIRMED
- URL: https://azure.microsoft.com/en-us/blog/microsoft-build-2026-building-agentic-apps-with-microsoft-fabric-and-microsoft-databases/
  (datePublished 2026-06-02, dateModified 2026-06-11), author Arun Ulag, EVP Azure Data.
- Verbatim: "Fabric IQ, now generally available, addresses this gap." / "Ontologies in Fabric IQ, expected to be
  generally available in the coming months, extend semantic models by adding operational context." /
  "We're announcing the general availability of graph in Fabric, with general availability of the planning in
  Fabric coming later this month." / "I'm excited to share operations agents are now generally available."
- Still preview as of my check: ontology FAQ (updated_at 2026-09-11) and Fabric "What's new" both say
  "ontology (preview)". Learn docs also still say "IQ (preview) workload" — a docs/blog inconsistency worth
  knowing about, not an error by the researcher.
- MILL5 blog confirmed: https://mill5.com/fabric-iq-general-availability/ (2026-07-06) says "Fabric IQ is now
  generally available, including the ontology layer" — contradicts Microsoft. Do not use.
- Could not run a search for a later GA announcement (FabCon Europe etc.); Fabric blog returned 403. Absence of
  GA is supported by the 2026-09-11 docs timestamp only.

## 4. Generate ontology from semantic model; Decimal nulls; Direct Lake only — CORRECTED (quote location)
- URL: https://learn.microsoft.com/en-us/fabric/iq/ontology/concepts-generate (ms.date 2026-01-20, updated_at 2026-05-14)
- All substantive limitations confirmed verbatim: Decimal -> "you see null values returned for those properties
  on all queries"; "Fabric Graph doesn't currently support the `Decimal` type"; Decimal "most commonly used for
  representing monetary values"; bindings generated only in Direct Lake mode (and ONLY when backing lakehouse is
  in a workspace with inbound public access enabled; relationship bindings ONLY when primary key identified);
  querying "Supported (without measures and calculated columns)"; manual follow-up for time series, keys,
  relationship bindings.
- CORRECTION: the exact_quote "Ontologies can be generated directly from semantic models already in production,
  keeping business language consistent across experiences." is NOT on concepts-generate. It is on the Fabric IQ
  overview page (https://learn.microsoft.com/en-us/fabric/iq/overview). Cite it there.

## 5. Rules operationalise ontology; ontology grounds multiple agent types — CONFIRMED
- Rules: https://learn.microsoft.com/en-us/fabric/iq/ontology/how-to-use-rules (ms.date 2026-04-24, updated 2026-05-14).
  Verbatim: "Rules transform ontologies from static information models to operationalized ones." Fabric
  Activator dependency and "evaluated per entity instance" seen. Preview.
- Agents: https://learn.microsoft.com/en-us/fabric/iq/ontology/concepts-agent-integration (ms.date 2026-07-09,
  updated 2026-07-23). Four benefits verbatim, including "Consistency: Every agent that shares the ontology uses
  the same definitions, rules, and metrics, so answers stay consistent across teams and tools." Five agent
  options listed. Verbatim: "An ontology can function as a Model Context Protocol (MCP) server".
- Caveat: that page's metadata says `ai-usage: ai-generated`. Preview.

## 6. Palantir Ontology = decisions, not just data; actions exposed as agent tools — CONFIRMED
- https://www.palantir.com/docs/foundry/architecture-center/ontology-system — verbatim (with "decisions"
  italicised): "The Ontology is designed to represent the complex, interconnected decisions of an enterprise,
  not simply the data." Data / logic / action / security framing present. Undated ((c) 2026).
- Semantic vs kinetic wording is on https://www.palantir.com/docs/foundry/ontology/overview ("objects,
  properties, and links" vs "action types and functions").
- Agent tool quote is on https://www.palantir.com/docs/foundry/agent-studio/tools — verbatim: "Gives your chatbot
  the ability to execute an ontology edit. This can be configured to run automatically or to run after
  confirmation from the user."

## 7. Gartner May 2026 semantics prediction (80% / 60% by 2027) — CONFIRMED via mirror; event detail UNVERIFIED
- Gartner newsroom 403. IT-Online mirror (2026-05-12) shows verbatim: "by 2027, organisations that prioritize
  semantics in AI-ready data will increase their agentic AI accuracy by up to 80% and reduce costs by up to 60%";
  Rita Sallam, "distinguished vice-president analyst"; both quotes verbatim ("Agentic AI outcomes depend on
  context including semantic representations of data." and "Context with semantic coherence will become a
  cost-control and trust strategy, not a nice-to-have"); "establish a context layer as a core component of their
  D&A infrastructure."
- A search-result snippet dated the Gartner release 2026-05-11. The IT-Online text does NOT mention a summit or
  London. That a Gartner D&A Summit London took place in May 2026 is corroborated by Juan Sequeda's 2026-05-20
  Substack recap, but "said at the London summit on 11 May" was not seen. Attribute to "a Gartner press release
  of 11 May 2026", not to a stage appearance.

## 8. Gartner June 2026 top D&A trends; decision governance; GraphRAG — CONFIRMED via mirror
- MarketScreener mirror (2026-06-16): Carlie Idoine, VP Analyst; D&A Summit Sydney June 16-17. Trend names
  verbatim: "Reducing AI Agent Risk with Decision Governance", "Handling Complex Use Cases with GraphRAG".
  Verbatim: "explicitly modeled business decisions will be five times more trusted and 80% faster than
  ungoverned decisions by 2029, enabled by decision intelligence platform adoption"; "40% of enterprises will
  have leveraged GraphRAG techniques by 2029".
- Magic Quadrant for Decision Intelligence Platforms: title, date 26 January 2026 and authors (David Pidsley,
  Carlie Idoine, Gareth Herschel, Kevin Quinn, Kjell Carlsson) confirmed via Aera's reprint landing page
  https://www.aeratechnology.com/gartner-magic-quadrant-decision-intelligence-leader/. "17 vendors" and "first"
  NOT seen — unverified.

## 9. a16z "Your Data Agents Need Context" — CONFIRMED
- https://a16z.com/your-data-agents-need-context/ datePublished 2026-03-10; Jason Cui and Jennifer Li.
- Quote is mid-sentence in the original: "Over the past year, the market has realized that data and analytics
  agents are essentially useless without the right context - they aren't able to tease apart vague questions..."
  (so lower-case "data" if quoted in running text).
- "superset of what a semantic layer would traditionally cover ... canonical entities, identity resolution,
  specific instructions to dissect tribal knowledge, proper governance guidance" verbatim. Palantir sentence
  verbatim. Zero mentions of Microsoft / Fabric IQ.
- "Context problem, not a model problem" is the researcher's paraphrase, not a16z's wording.

## 10. Foundation Capital context graphs — CONFIRMED (date resolved)
- https://foundationcapital.com/ideas/context-graphs-ais-trillion-dollar-opportunity
- Raw HTML contains `<time datetime="2025-12-22T00:00:00.000Z">Dec 22, 2025</time>` and bylines Jaya Gupta and
  Ashu Garg. The 2026-09-17 timestamp is a site build time, not the publication date.
- All three quotes seen verbatim: "a living record of decision traces stitched across entities and time so
  precedent becomes searchable"; "systems of record for decisions, not just objects"; "Capturing decision traces
  requires being in the execution path at commit time, not bolting on governance after the fact".

## 11. "Context graph" criticised as rebranding — CONFIRMED, with better primary sources
- Jaffri quote is VERBATIM from his own LinkedIn post (approx. 2026-01-08, decoded from the activity ID):
  https://www.linkedin.com/posts/afraz-jaffri_all-the-talk-around-context-graphs-is-exciting-activity-7415141675779452928-AGHp/
  Anadiotis reproduces it without quotation marks, as a paraphrase-style link.
- Anadiotis original: https://yearofthegraph.xyz/newsletter/2026/03/beyond-context-graphs-... datePublished
  2026-03-19. The DEV.to copy cited by the researcher is dated 2026-04-18.
- Blumauer wording in Anadiotis is "adding time and decision lineage" (not "temporal intelligence").
- Talisman primary: "The Trillion-Dollar Rebranding", 2026-01-28,
  https://jessicatalisman.substack.com/p/the-trillion-dollar-rebranding.
- "But meaning isn't the same as measurement." verbatim in Talisman's "Ontologies, Context Graphs, and Semantic
  Layers: What AI Actually Needs in 2026", Metadata Weekly (Atlan), post_date 2026-01-22:
  https://contextandchaos.substack.com/cp/185458632

## 12. NetDocuments context graph, 14 May 2026 — CORRECTED (detail sourcing)
- Press release (2026-05-14) confirmed: title; verbatim "This is the deepest piece of platform engineering we
  have ever shipped, and it is the one that matters most."; "You cannot retrofit this. It has to be built into
  the core." (Dan Hauck, CPO); AWS and Elastic; scope = matters, documents, communications, people, activity,
  permissions/ethical walls; no mention of spend, e-billing, outside counsel or matter management.
- CORRECTION: the press release does NOT contain the three levels, "model-agnostic", or "enterprise AI tier".
  It says only "Private preview is open today for select customers, with broader rollout in the coming months."
  Those three details come from LawSites (Bob Ambrogi, 2026-05-14):
  https://www.lawnext.com/2026/05/netdocuments-unveils-legal-context-graph-to-map-legal-knowledge-alongside-a-reimagined-platform.html
  ("document level ... matter level ... global level"; "model-agnostic"; "select customers on the company's
  enterprise AI tier"; public preview "expected in the coming months"). Legal IT Insider also says
  "Enterprise AI tier".
- iManage "context fabric" at ConnectLive 2026, Chicago, May 2026: confirmed via LawSites 2026-05-22.

## 13. Legal IT Insider on convergence and auditability — CONFIRMED
- https://legaltechnology.com/netdocuments-reimagines-the-dms-around-context/ (2026-05-14), byline "Neil Cameron,
  lead analyst".
- All three phrases verbatim. Note the headline quote is Cameron's summary of NetDocuments' argument: "The
  argument, stripped of slideware, is that AI in legal work is only as useful as the context it can reach..."
  Attribute it to Cameron characterising the vendor's case, not to NetDocuments.
- LawSites pieces of 2026-05-14 and 2026-05-22 confirmed as descriptive, no critique.

## 14. Legal standards are vocabularies / exchange formats — CONFIRMED (facts); framing is the researcher's
- SALI GitHub README verbatim: "LMSS.owl is an XML file that represents SALI's primary taxonomy/ontology,
  providing over 18,000 tags"; "Each SALI LMSS tag has its own unique identifier (IRI)."
- "attribute-by-attribute" v3 release: NOT in the GitHub README; it is on https://sali.org/explore-the-standard/
  ("LMSS v3 'attribute-by-attribute' release process").
- LEDES list confirmed at https://ledes.org/ (98B, 98BI, 2000, XML Ebilling 2.0/2.1/2.2, XML Budgeting,
  Timekeeper Attributes, LOC IPMM Invention Disclosure Schema, LEDES API v1 - 2020, UTBMS code sets).
- LegalRuleML Core v1.0 OASIS Standard 30 August 2021 confirmed (docs.oasis-open.org). Akoma Ntoso v1.0 OASIS
  Standard 29 August 2018 confirmed.
- FIBO sentence verbatim at https://spec.edmcouncil.org/fibo/; OWL and OMG standardisation stated there.

## 15. Independent observers on Fabric IQ — CORRECTED (Briggs' title; quote truncated)
- https://www.directionsonmicrosoft.com/cio-talk-microsoft-gets-iq/ datePublished 2025-12-02. All Briggs quotes
  verbatim. The headline quote is a truncated sentence; the original reads "Creating an ontology, in Fabric or
  elsewhere, is a major effort and requires on-going maintenance, so there's no getting out of the hard work."
  "Of all the announcements..." is prefaced by "My personal opinion is that".
- CORRECTION: Barry Briggs is an Analyst at Directions on Microsoft. He is a FORMER CTO of Microsoft's own IT
  organisation; he is not "CTO, Directions on Microsoft".
- Nikola Ilic, Data Mozart, 2026-02-03, quote verbatim:
  https://data-mozart.com/beyond-the-lakehouse-first-thoughts-on-fabric-iq/
- Juan Sequeda, 2026-06-10, "start small and think big" (lower-case, mid-sentence) verbatim:
  https://juansequeda.substack.com/p/servicenow-is-joining-open-semantic
