# Verification notes — track "open-platforms-api-mcp-build"

Checked 2026-09-21. Method: WebFetch of each cited URL plus primary sources where found. WebSearch budget for the session was already exhausted (0 searches available), so discovery of un-cited secondary sources relied on site archive pages and PR Newswire org pages. Anything I could not open myself is marked unverified.

Legend: CONFIRMED / CORRECTED / UNVERIFIED / REFUTED

---

## 1. Anthropic Claude for Legal (2026-05-12) — CONFIRMED
- URL: https://claude.com/blog/claude-for-the-legal-industry (dated May 12, 2026)
- Seen verbatim: "Today we're introducing 20+ new MCP connectors ... and 12 new plugins tailored to specific legal work and practice areas."
- Box quote exact: "connects Claude to content stored in Box to search and access files, query documents, create or update content, and extract metadata fields".
- Datasite: "...to set up folder structures, invite users, search documents, track buyer Q&A, and audit data room readiness." Relativity: "lets Claude stand up matters, shape workspace schema, govern access, and analyze usage". iManage: "permission-bound, auditable access to governed iManage content". NetDocuments: "search and retrieve documents ... and draft new documents based on your precedents".
- Legal Builder Hub: "finds and installs community-built legal skills from public registries, running a security review, license check, and freshness check on every install and update."
- Named: Accenture (Mindy Lok), Holland & Knight (Manfred Gabriel), Freshfields (Gerrit Beckhaus).
- Nuance: "20+" is Anthropic's wording ("more than 20" is Legal IT Insider's paraphrase, 2026-05-13). Legal Builder Hub is itself one of the 12 plugins; the 12 also include Law Student and Legal Clinic, so "12 practice-area plugins" is loose. LexisNexis, Mitratech, Onit, Brightflag, Icertis, Agiloft are absent from the page.

## 2. iManage MCP Server GA (2026-05-14) — CORRECTED
- Primary: https://imanage.com/resources/resource-center/news/mcp-server-available-broader-ai-ecosystem/ (May 14, 2026). Confirmed: Harvey, Legora, ChatGPT, Claude, Microsoft Copilot, firm's own agents; 32% integration-complexity figure from iManage Knowledge Work Benchmark Report 2026; authenticated / permission-bound / fully logged; ethical walls respected; Mike Peters (Information Manager, RSM Australia) quote exact.
- Legal IT Insider piece: https://legaltechnology.com/imanage-unveils-open-protocol/ (May 14, 2026). Neil Cameron is the BYLINE AUTHOR (lead analyst), not a quoted third party. His sentence is: "The product's value proposition is that one MCP connection replaces a proliferating list of custom API integrations, and that new AI systems can be added or swapped without an IT project each time." The finding's quote is a capitalised fragment of that sentence.
- NOT SEEN: "read-only at launch" — neither the iManage release nor the LII article uses "read-only"/"read only" in three separate passes. "No bulk export" is the release's framing (bulk extraction not required), not a stated technical restriction. Treat read-only as unverified.

## 3. OpenAI Astra for Law (2026-09-17) — CORRECTED (minor)
- LII: https://legaltechnology.com/breaking-news-openai-unveils-astra-for-law/ (Sep 17, 2026). Confirmed verbatim: "launches with 26 partner plugins from providers including Thomson Reuters, Intapp, Harvey, Legora, DeepJudge and iManage"; "nine community plugins from lawyers and legal engineers at LegalQuants, LECG, and Skills.law, with 47 custom skills"; "Thomson Reuters is bringing HighQ matter context into ChatGPT and previewing a forthcoming CoCounsel Legal connector"; iManage: "a lawyer can draft a negotiation brief in ChatGPT and save it to the matter file". Quote is Jason Boehmig (head of OpenAI's legal vertical, ex-Ironclad founder) — exact. No in-house mention; early adopters all law firms (Sullivan & Cromwell, Ropes & Gray, Cooley; AL adds Latham).
- Artificial Lawyer (Sep 18): "Astra for Law will initially be offered to selected firms through Trusted Access in ChatGPT and Codex, with API access coming soon." The word "US" does NOT appear there — "selected US firms" is unverified (the only "U.S." in LII refers to 200 U.S. legal research test questions). LII says "API customers including Harvey and Legora will be able to build on Astra for Law."
- Partner list (NetDocuments, Box, Clio, Ironclad Contracts, Relativity, Docusign, Laurel, LECG Spend Management Analysis, CourtListener, LegalZoom, Intapp Celeste, DeepJudge) comes from the AL Sep 18 plugin article, not LII. AL's launch article says "47 community plugins" — conflicts with LII's "nine community plugins ... 47 custom skills"; LII wording looks like OpenAI's own.
- OpenAI primary page: HTTP 403 for me too.

## 4. Thomson Reuters CoCounsel Legal via MCP — CORRECTED
- The exact quote "Wherever lawyers are working, the full power of CoCounsel Legal is available to them." is NOT in the Aug 20 release. It is in the MAY 12, 2026 release, said by Joel Hron, CTO, Thomson Reuters: https://www.prnewswire.com/news-releases/thomson-reuters-and-anthropic-expand-partnership-to-connect-claude-with-cocounsel-legal-302769890.html
- Aug 20 release (TR site + PRN 302855801) verbatim: "forthcoming MCP connection designed to extend CoCounsel Legal's trusted, verifiable legal AI into Amazon Quick, AWS's AI companion built for work, as well as other AWS offerings." => product is AMAZON QUICK, not "Amazon Q".
- Aug 20: "Built on Anthropic's Claude Agent SDK, CoCounsel Legal can plan, reason, and execute..." — it is next-gen CoCounsel Legal that is built on the Agent SDK, not the MCP. Separately: "the launch of an expanded CoCounsel Legal MCP with Claude in August." Reveal from October confirmed. "Thomson Reuters Fiduciary-Grade AI(TM) principles" confirmed.
- May 12: MCP integration presented as live; "general availability for the next generation of CoCounsel Legal expected this summer" (GA refers to next-gen CoCounsel, not the MCP). "Deep legal research is the first capability callable from Claude" — NOT SEEN in the May release. Westlaw / Practical Law / KeyCite grounding confirmed (also in Anthropic's connector copy).

## 5. Docusign MCP Server to every agent 2026-09-30 — CONFIRMED
- https://www.prnewswire.com/news-releases/docusign-agreement-layer-for-the-agentic-enterprise-coming-to-every-agent-302870029.html (Sep 4, 2026)
- Verbatim: "Docusign will open its Model Context Protocol (MCP) Server to every AI agent on September 30"; "now callable natively from Claude, ChatGPT, Gemini, Copilot, Slack, and any MCP client"; analyze / send / track; account-level admin controls, global multi-region, multilingual; Docusign Iris. Quote exact, Allan Thygesen (CEO).
- "clearest vendor statement that write-back is production-grade" is the researcher's interpretation, not in source.

## 6. Brightflag MCP connector (2026-08-18) — CORRECTED
- https://brightflag.com/resources/brightflag-mcp-connector/ (Aug 18, 2026). Confirmed: Claude, ChatGPT, any MCP-compatible workspace; "Brightflag is one of the first systems of record in legal to build on MCP"; "it doesn't create a new permission layer — it inherits the one you already have"; exact quote "Build one MCP server, and any compatible AI can connect to your data instantly."
- "read-only" NOT on the page (two passes). Described capability is question-answering over Brightflag data, consistent with read, but the term is absent. Unverified.
- The buyer advice and "already behind" are in the May 26 blog, not the connector page: https://brightflag.com/resources/blog-mcp-server-legal-tech/ (Michael Dineen, Director of Data Science): "ELM vendors without MCP roadmaps are already behind"; "The most useful question to ask your ELM vendor right now is straightforward: do you have an MCP server?"
- Mitratech ARIES "proprietary AI ecosystem": not verified (could not reach a Mitratech 2026 newsroom page). Negative-evidence claim about other vendors: untestable here; keep the researcher's caveat.

## 7. ILTACON 2026 / Above the Law "Polycule" — CORRECTED
- https://abovethelaw.com/2026/09/welcome-to-the-legal-tech-polycule-iltacon-2026/ (Joe Patrice, Sep 1, 2026). Confirmed: open-interconnection theme; heading "The single pane of glass got smashed"; "DISCO is making the counter-bet that document review is a dedicated discipline that requires a specialized platform"; NetDocuments "MCP partner roster to Google Gemini, Perplexity, Anthropic, Harvey, and Legora"; Everlaw "Connections to Gemini Enterprise for Legal, Microsoft Copilot, Harvey, and CoCounsel"; token-cost anxiety ("burning $75 million in tokens").
- Quote attribution: "accuracy problems in legal AI are usually data problems wearing a model costume" is Patrice's PARAPHRASE of a conversation with HIKE2 ("resulted in the memorable frame that ..."), not a direct quote from a named person.
- Timing: ILTACON 2026 (Nashville) ran in late August, not early September — LII says Google announced Gemini for Legal "during ILTACON" (Aug 25). Coverage is early September.
- Not in this article: Relativity-Gemini, Oddr MCP server, Legora-Intapp / Intapp Time, Everlaw "read access / system of record". Relativity-Gemini via MCP independently confirmed: PRN Aug 25, 2026 https://www.prnewswire.com/news-releases/relativity-accelerates-enterprise-ai-transformation-with-google-clouds-gemini-enterprise-for-legal-302858717.html. Oddr and Legora-Intapp: unverified.
- LII quote is a sentence fragment, unattributed editorial voice, no byline: "...the landscape is ever more complex, and law firms need to be able to create their own ecosystem." https://legaltechnology.com/iltacon-2026-context-is-king-but-transformation-is-still-the-hard-part/ (Sep 2, 2026).
- DISCO as "closed" is an inference; ATL says "counter-bet".

## 8. Sam Grange (iManage), Vendor View 2026 — CONFIRMED
- https://legaltechnology.com/2026/01/15/the-vendor-view-2026-a-breakthrough-ai-year-and-one-of-reckoning/ (Jan 15, 2026). Exact quote confirmed. Also: "While proprietary, closed AI partnerships have served their purpose by maintaining tight control – and with good reason too – the industry will embrace open innovation-led AI systems..." and "Apple ... is abandoning its walled-garden approach in favour of open integration, with the arrival of Model Context Protocol (MCP)." Sid Jiwnani (Knovos, Solicitor and Director) BYOLLM/BYOC quotes confirmed.
- Nuance: Grange says closed partnerships "have served their purpose" — "had their day" is a fair paraphrase.

## 9. LexisNexis selective MCP stance — CONFIRMED
- https://www.lexisnexis.com/blogs/hk-legal/b/industry-insights/posts/what-we-learned-from-evaluating-mcp-based-workflows-for-authoritative-legal-ai (Greg Dickason, CTO LexisNexis Legal & Professional, June 10, 2026). Both quotes exact. Fuller: "if an LLM has access to our MCP connector – and introduces additional legal interpretations, adjacent statutes, or citations not provided by LexisNexis – our criteria for moving forward with an integration is not met." Consistency: "asking the same legal question multiple times through an LLM should not produce meaningfully different outputs."
- LII Feb 25, 2026 confirmed: https://legaltechnology.com/from-market-meltdown-to-strategic-realignment-harvey-and-lexisnexis-chart-diverging-paths-with-anthropic/ — Harvey (Weinberg: "their MCP program means easier access to Harvey") vs LexisNexis embedding Anthropic capabilities in Protégé.
- LexisNexis absent from Anthropic page and Google release: confirmed by my reads.
- Note the URL is the HK-legal blog instance; a US/global instance may exist.

## 10. In-house teams building — CORRECTED (quote wording)
- Bloomberg Law (Evan Ochsner, Jan 5, 2026): Patricija "Patty" Corey, Legal Operations Manager, HUMAN — quote exact.
- Anthropic: https://claude.com/blog/how-anthropic-uses-claude-legal (Dec 8, 2025). Four tools, MCP to Google Drive/JIRA/Slack/Calendar, 2-3 days -> 24 hours: confirmed.
- Mark Pike quote is MISQUOTED. Actual: "I partner with Claude to tackle certain projects that involve coding, but I am not the one coding." (preceded by "I wouldn't say what I'm doing is learning to code"). Title: Associate General Counsel.
- "built ... without a coding lawyer" is inference; the page does not say no engineers were involved.
- AL May 12, 2026 confirmed verbatim: "in-house legal ops teams are open-sourcing outside counsel management tools on GitHub so peers can fork them" — Pike reporting responses to a LinkedIn poll (hearsay, not a named team).

## 11. Legal vibe-coding movement — CORRECTED
- AL Jan 26, 2026 confirmed: founders Chris Bridges, Matt Pollins, Alex Baker; "Projects built by non-developers through AI-assisted coding aren't production-ready out of the box"; asked whether DIY supplants platforms: "No, we don't think so."
- Quote is elided. Actual: "Vibe-coding is a catalyst for change: it lets domain experts (e.g. lawyers) demonstrate ideas rather than just describe them, validate concepts before investing in full development..."
- "builders primarily in-house lawyers" NOT SEEN in the article.
- Tso (AL Jan 5, 2026; senior associate, Clifford Chance): "just-in-time, disposable software" confirmed. The maintenance line is Tso CONCEDING the traditional buy argument: "Traditionally, the argument for buying is totally fair: software needs maintenance, security, support, and it has to scale." — then he argues the economics are shifting. Do not present it as his bottom line.
- Linklaters (James Phoenix time-recording tool) and Debevoise (AI policy training game) come from ATL/ILTA Peer to Peer, Paul Giedraitis (Orgaimi CEO), June 25, 2026: https://abovethelaw.com/2026/06/people-prompts-and-product-the-vibe-coding-revolution-in-biglaw/ — not from the AL pieces.
- Bloomberg Law June 25, 2026 Ropes & Gray CIO quote: UNVERIFIED (could not locate).

## 12. Risk commentary cluster — CORRECTED
- Legal Wire (Nicola Taljaard, Aug 3, 2026): five attack classes and CVE-2025-49596 (CVSS 9.4) confirmed.
- Exact quote is WRONG. Actual: "The protocol layer disappears into the substrate, and the products above it get sorted by whether they added value the substrate could not commodify."
- MCP 2026-07-28 spec: authorization hardening confirmed from primary (RFC 9207 iss validation, issuer-bound credentials, DCR deprecated for CIMD) — https://blog.modelcontextprotocol.io/posts/2026-07-28/ and https://modelcontextprotocol.io/specification/2026-07-28/changelog. But it does NOT "add" Enterprise Managed Authorization: EMA is a pre-existing extension (SEP-990); the release formalises the extensions framework "with Tasks joining other extensions, such as MCP Apps and Enterprise Managed Authorization (EMA)". Legal Wire does not mention EMA. Legal Wire also relays SecurityWeek: the new version "shifts critical security responsibilities from the protocol itself to developers and platform operators" — a counterweight worth keeping.
- BCG 54% / Clio 44%: confirmed in ATL/ILTA P2P June 25, 2026 (secondary; BCG 2025 global study via Law Practice Magazine; Clio 2025 Legal Trends Report).
- Microsoft MC1388706 confirmed via mirror https://mc.merill.net/message/MC1388706: "Microsoft 365 Copilot: Legal agent available in Frontier worldwide", published June 12, 2026, updated Aug 24, 2026; "enabled by default for tenants enrolled in Frontier"; "no dedicated admin or user toggle"; GA "early October 2026 (previously early September)". Scope caveat: default-on applies to Frontier-enrolled tenants; access is controlled via Frontier enrollment + Copilot licence.
- US v. Heppner: not checked here (finding itself says vendor-blog sourcing only).
- "six points" is the researcher's synthesis.

## 13. Lock-in at the AI-platform layer — CONFIRMED
- AL Sep 18, 2026 exact: "As noted above all of this means that once you move your work into Astra, you will find it easier to stay there."
- ComplexDiscovery May 13, 2026: https://complexdiscovery.com/claude-for-legal-arrives-and-the-legal-ai-stack-gets-re-segmented-overnight/ — "A team that spends a quarter teaching a plugin its house style, its fallback clauses, its escalation thresholds, and its risk tolerances is building institutional knowledge inside the model — not inside a vendor's product. That cuts both ways. It deepens the lock-in to Claude."
- Patrice on consumption/token cost: confirmed in ATL Sep 1 piece.

## 14. CLOC 2026 State of the Industry — CONFIRMED
- https://cloc.org/newsdesk/... (March 2, 2026): 135 departments, $13B median revenue, based on 2025 Harbor Law Department Survey; 80% technology strategy; 85% dedicated AI oversight or resources; 37% vs 58%. Snell quote exact.
- LII CGI piece: https://legaltechnology.com/cloc-global-institute-2026-a-market-in-transition/ (Toby Weston, May 15, 2026). "The era of the point solution is ending..." is the AUTHOR's synthesis. Snell: "The AI conversation has matured. Teams are now sharing what has worked, what broke, and how they are governing it."
- Nuance: 80% is the share naming technology strategy as a priority alongside financial management (72%) and outside counsel/vendor management (62%).

## 15. Google Gemini Enterprise for Legal (2026-08-25) — CONFIRMED
- https://www.googlecloudpresscorner.com/2026-08-25-Google-Cloud-Launches-Gemini-Enterprise-for-Legal. Preview; 11 MCP integrations exactly as listed; customers Cleary, Freshfields, Weil, Williams & Connolly; integrators include Accenture, Deloitte, KPMG, Eudia, Factor Law (+ Devoteam, Tribe AI, Valtech, Zazmic, Zencore, 66degrees). No Mitratech/Onit/Icertis/Agiloft/LexisNexis.
- "three frontier vendors within roughly four months": May 12 -> Sep 17 = 4 months 5 days. "Near-identical rosters" is interpretive; overlap is real but Anthropic 20+, Google 11, OpenAI 26.
