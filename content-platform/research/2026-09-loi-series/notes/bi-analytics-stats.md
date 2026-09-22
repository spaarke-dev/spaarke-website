# Research notes: BI, analytics, metrics, and reporting in corporate legal departments

Research date: 2026-09-21. Researcher: Claude research subagent for Spaarke.
Track: latest statistics and viewpoints on business intelligence, analytics, metrics, and reporting in corporate legal departments.

## Method and caveats

- 30 distinct web searches were run before the session's shared WebSearch budget was exhausted (hard cap hit mid-research); 45+ page fetches followed using known URLs.
- Several primary PDFs were downloaded and text-extracted locally (pdftotext) so figures could be read directly: ACC 2026 CLO Survey Key Findings, ACC/MLA 2026 Law Department Management Benchmarking Report (full), Thomson Reuters 2025 Legal Department Operations Index (full), Thomson Reuters 2026 State of the Corporate Law Department (full), ACC Legal Operations Maturity Model 2.0 (full), and four vendor press releases hosted by CLOC Global Institute.
- Blocked (HTTP 403) primary pages: all gartner.com newsroom pages, acc.com HTML pages, wolterskluwer.com pages, globallegalpost.com, pramata.com. Where those sources are cited, the claim comes from a secondary source or a search-result snippet and is labelled as such.
- Bar-chart figures extracted from PDFs lose label-to-value alignment. Where alignment was ambiguous I did not record the number (noted inline).
- Framing note: the brief asked for evidence of maturity and change, not "legal is a laggard". I have followed that, but I have not suppressed data that cuts the other way (for example, Thomson Reuters' 2025 finding that only 37% of departments report having a dedicated "legal business intelligence" solution). Those data points are useful because they define where the maturity frontier actually is: spend analytics is mature; service, cycle-time, outcome, and AI-value metrics are not.

---

## Theme 1. Current adoption and maturity of legal analytics, dashboards, spend analytics, and metrics programs

### 1.1 Thomson Reuters Institute, 2025 Legal Department Operations (LDO) Index (primary; with Buying Legal Council)
- Published 2025-09-24 (report landing page); companion analysis article 2025-10-08 (Zach Warren). Survey fielded July 2025; n = 128 legal department professionals and GCs (55% legal ops professionals, 45% "GC tasked to run legal operations"), United States.
  - Report page: https://www.thomsonreuters.com/en-us/posts/corporates/ldo-index-report-2025/ (2025-09-24)
  - Full PDF: https://www.thomsonreuters.com/en-us/posts/wp-content/uploads/sites/20/2025/09/Legal-Department-Operations-Index-2025.pdf
  - Analysis article: https://www.thomsonreuters.com/en-us/posts/corporates/2025-ldo-index-legal-success-metrics/ (2025-10-08)
- 82% have at least one dedicated legal ops role on the team (PDF p.5; note the search snippet said 81%, the PDF says 82%).
- Metrics routinely reported (Figure 3): total spend by law firm 62%; total spend by matter type 50%; number of matters opened and closed 37%; forecast/budget vs actual and spend by business unit in the mid-30s (35%/34%, label alignment ambiguous); spend by practice group 27%; legal spend to revenue 21%; quality of legal outcomes 18%. Cycle time, costs avoided, AFA savings, AI usage, savings from legal tech (8%), outside counsel evaluation results (7%), and law firm diversity (6%) are all below 15%.
- Exact quote (PDF p.9): "corporate legal departments are tracking metrics related nearly exclusively to cost and to a lesser extent, efficiency."
- Exact quote (analysis article): "Law departments want to move away from being a cost center, but in order to truly accomplish that goal, they need to update their metrics and data gathering."
- Legal ops professionals vs GCs: 81% of legal ops professionals routinely report total spend by law firm vs 45% of GCs (Figure 4). 63% of respondents with legal ops backgrounds use data analytics to identify cost savings vs 29% of GC respondents (PDF p.11).
- Technology installed base (Figure 16; "valuable" + "underutilized" = have it):
  - E-billing / spend management: 42% valuable + 18% underutilized = 60% have it; 16% looking to procure within 24 months.
  - Legal business intelligence: 16% valuable + 21% underutilized = 37% have it; 19% looking to procure within 24 months; 33% "not important"; 11% don't know.
  - Legal workflow automation: 13% + 25% = 38% have it; 25% looking to procure.
  - GenAI tool: 17% + 16% = 33%; 29% looking to procure.
  - Observation: for legal BI, workflow automation, knowledge management, and task management, "underutilized" exceeds "valuable". The maturity issue is utilization of tools already owned, not absence of tools.
- GC priorities: 47% of GCs say they are more focused on service enhancement than cost reduction; only 7% of GCs prioritize cost reduction; legal ops professionals 36% service enhancement vs 22% cost reduction. The metrics tracked (cost) do not match the stated priority (service).
- Recommendation 5 in the report's closing list: "Implement key metrics for data-driven decision making".

### 1.2 CLOC 2026 State of the Industry Report (primary press release; underlying data is the 2025 Harbor Law Department Survey in collaboration with CLOC)
- CLOC press release 2026-03-02: https://cloc.org/newsdesk/cloc-releases-2026-state-of-the-industry-report-rising-legal-demand-outpaces-budget-and-staffing-growth-forcing-operational-shift/
- Harbor press release 2025-12-08 (via PRWeb): https://www.prweb.com/releases/harbor-2025-law-department-survey-reveals-surge-in-ai-integration-falling-outside-counsel-spend-302635093.html
- CLOC blog by Kevin Clem (Harbor), 2026-03-02: https://cloc.org/blog/soti/clocs-2026-state-of-the-industry-report-benchmarking-data-is-the-compass-for-legal-operations-to-navigate-change/
- Trade coverage, Lexpert 2026-03-04: https://www.lexpert.ca/news/in-house-lawyer/cloc-finds-legal-department-structural-productivity-gap-with-demand-outpacing-resources/394024
- Sample: 135 corporate law departments, 15+ industries, median revenue US$13B. 22nd annual Harbor survey. Field dates not stated in any public page.
- Legal ops priorities: technology strategy 80%; financial management 72%; outside counsel / vendor management 62%.
- 85% have a dedicated resource or committee to manage AI use.
- Expect outside counsel spend to increase: 37% (from 58%). Expect inside spend increase: 47% (from 65%). Expect lawyer headcount increase: 32% (from 42%).
- Workload drivers: regulatory 63%; cybersecurity / IT governance 58%; contracts 53%.
- 76% use AFAs (from 70%); 61% completed or implementing preferred provider panels (from 50%); 65% made intentional efforts to retain work in-house.
- Exact quote (Oyango Snell, CLOC President and CEO): "Demand is accelerating in areas like regulatory compliance and cybersecurity, yet budget and staffing growth are not keeping pace."
- Exact quote (Kevin Clem, Harbor, in Lexpert): "The latest data poses a paradox: accelerating AI adoption comes at the same time that hiring and spending are leveling off."
- The public materials contain NO statistic on analytics, dashboards, BI, or intake. The full report is a CLOC member benefit; the detailed benchmarking lives in Harbor's online portal. (Gap.)

### 1.3 ACC / Major, Lindsey & Africa, 2026 Law Department Management Benchmarking Report (primary, full PDF read)
- PDF: https://www.acc.com/sites/default/files/2026-06/2026-ACC-Law-Department-Management-Benchmarking-Report.pdf (file path indicates June 2026 publication; Legal Reader coverage 2026-07-09: https://www.legalreader.com/total-legal-spend-by-company-revenue-hits-six-year-low-in-2026/)
- Sample: 576 legal departments, 45 countries. Seventh annual. Field period: opened 2026-02-11, closed 2026-04-17 (Methodology, p.47).
- Total legal spend as % of revenue: 0.43% (median), a six-year low, from a prior high of 0.63%.
- Median company employees per lawyer: 367 (up from 300 per MLA summary). Median 3 lawyers per US$1B revenue.
- Lawyers per legal operations professional: 8:1. Legal operations professionals have held at about 5% of department staff since 2022.
- Legal technology: median 3% of total legal spend (US$130K median; US$65K under $1B revenue; US$2.5M at $20B+). Technology/overhead is 5% of inside spend; ALSPs 3% of outside spend.
- Who funds legal tech: 53% entirely within the legal budget; shared-services model 29% (up from 25% in 2024); no legal tech budget 18% (down from 22% in 2024). At US$5B-$20B companies shared funding rose to 43% from 29% in 2024; at $20B+ it is 45%.
- Exact quote (p.36): "as revenue grows, the legal department's technology stack shifts from a siloed departmental expense to a shared enterprise resource."
- The report frames benchmarking as "PERFORMANCE STORYTELLING": "It enables legal leaders to translate complex legal activities into the language of the business" (p.4). Participants receive the metrics "through an online interactive dashboard".
- Exact quote (Greg Richter, MLA, in Legal Reader): "Legal departments are being asked to take on more strategic responsibility, but they aren't necessarily getting the investment"
- The report has no questions on analytics/BI adoption, dashboards, or intake. (Gap.)

### 1.4 ACC Legal Operations Maturity Model 2.0, "Metrics & Analytics" function (primary, PDF read)
- PDF: https://www.acc.com/sites/default/files/program-materials/upload/Legal-Opertaitons-Maturity-Model-2.0---ACC.pdf . Version 2.0; the PDF carries no publication date and the acc.com HTML pages returned 403, so the date is unverified in this session (original model 2017 per the PDF's own text).
- Definition: "The system to collect, organize and use data to inform decision making and performance management."
- Early: manual tracking; spend tracked only in high-cost practice areas; "Uneven integrity/cleanliness of data"; little to no reporting.
- Intermediate: foundational metrics for GC alignment; "Most metrics generated through manual synthesis of data from disparate systems"; reported manually / via email.
- Advanced: "Department leaders directly access dashboards to filter data and answer questions to derive insights and make better and faster operational, financial, and legal strategy decisions"; leading and lagging indicators against baselines, benchmarks, targets; central data source; predictive analytics; annual review that discards metrics "not supporting decisions"; "Metrics support business intelligence, driving continuous improvement".
- Useful for the article: ACC's own "Advanced" definition is self-service dashboards. That is now the baseline the market is moving past (see Theme 2: natural-language answers instead of dashboards).

### 1.5 CLOC Compass (launched at CLOC Global Institute 2026)
- CLOC press release 2026-05-12: https://cloc.org/newsdesk/cloc-launches-compass-an-interactive-platform-to-advance-legal-operations-maturity-in-partnership-with-neota-logic/
- Interactive maturity-assessment platform built with Neota Logic, companion to the CLOC Core 12 Maturity Assessment Playbook; four maturity stages; beta, CLOC members only.
- A vendor recap (Steno, Jeff Cox, 2026-06-03, https://brief.steno.com/cloc-global-institute-2026-recap) says Compass "plots" maturity across Business Intelligence, Financial Management, Firm & Vendor Management, and Information Governance, through stages Reactive, Emerging, Developing, Leading. CLOC's own release does not list those four areas, so treat the area list as secondary.
- Exact quote (Oyango Snell): "Legal departments across industries told us the same thing: more work, tighter budgets, flat headcount."

### 1.6 Gartner (primary pages blocked; secondary only)
- Gartner press release 2025-10-01, survey of 104 GCs in July 2025: 36% focused on adopting AI, building AI skills, or AI risk management; 9% want advanced contract analytics to manage contract risk and cost. URL (403 for me): https://www.gartner.com/en/newsroom/press-releases/2025-10-01-gartner-survey-shows-ai-and-contract-analytics-ar-urgent-priorities-for-general-counsel . Secondary: https://theaiinnovator.com/gartner-ai-and-contract-analytics-move-up-in-priority-for-general-counsel/ (2025-10-29).
- Gartner press release 2025-12-17 (title only, 403): only 20% of legal matters sent to outside counsel stay within budget range. https://www.gartner.com/en/newsroom/press-releases/2025-12-17-gartner-survey-reveals-only-20-percent-of-legal-matters-to-outside-counsel-stay-within-budget-range
- Smarter With Gartner, "3 Steps to Turn Legal Data Into Insights" (403; date unknown, believed several years old): search snippet says nearly 60% of legal departments use descriptive analytics, only 16% diagnostic. DO NOT present as current; it is undated and unverified.
- Gartner also publishes "Tool: Sample Dashboards for Every Legal Department" (https://www.gartner.com/en/documents/5650423), paywalled.

### 1.7 FTI Technology / Relativity, The General Counsel Report 2026 (seventh annual) (vendor/consultancy-sponsored research)
- FTI press release 2026-03-11: https://www.fticonsulting.com/about/newsroom/press-releases/ai-adoption-in-corporate-legal-departments-doubles-according-to-the-general-counsel-report (an earlier release on the same report was dated 2026-02-18 per search results).
- Method: 30 in-depth interviews with GCs/CLOs (September 2025) plus a 224-respondent quantitative survey (summer 2025); organizations with $100M+ revenue and 1,000+ employees.
- 87% of GCs report using generative AI in their teams (44% a year earlier). 53% have a formalized technology roadmap (25% a year earlier). About 70% plan to invest in new technology in the next 12 months. 39% view AI as a strategic priority.

### 1.8 Blickstein Group, 18th Annual Law Department Operations Survey (2025), with FTI Technology
- Blickstein page: https://blicksteingroup.com/resources/2025-ldo-survey-report-2/ ; WK-hosted copy (403): https://www.wolterskluwer.com/en/expert-insights/report-2025-blickstein-group-law-department-operations-survey ; webinar takeaways (Integreon, Diane Homolak; page fetch returned date 2026-07-09): https://www.integreon.com/ai-in-legal-ops-5-takeaways-from-the-blickstein-group-18th-annual-law-department-operations-survey-webinar/
- Sample: 68 companies per the Wolters Kluwer summary (search snippet); "more than 70 participating companies" per Blickstein's own page. Field dates not found.
- Business process and workflow automation rated a technology modernization priority by more than 55% (snippet). Workflow automation described as "a baseline for operational maturity".
- 23% describe themselves as "fully operational" with AI. Usability has surpassed security as the top AI concern for the first time. Roughly one-third of legal ops leaders advise on or own AI governance company-wide.
- I could not open the full report; no metrics/dashboard statistics were retrievable. (Gap.)

### 1.9 Wolters Kluwer LegalVIEW Insights 2026 (vendor data product; pages 403)
- Vol. 2026-1 "Rate Pressure Paradox" and Vol. 2026-2 "Rate Reality": https://www.wolterskluwer.com/en/expert-insights/report-legalview-insights-volume-2026-2-rate-reality
- Per search snippets: draws on more than $230B of legal invoice data in the LegalVIEW database; analyzes full-year 2025 and year-to-date 2026 invoices through 2026-03-31. An earlier volume reported top-25-firm partner rate growth of 6.3% (2025) vs 10.4% (2024) for first-half services.
- Relevance: shows the maturity of spend/rate analytics as a category: benchmark data sets of this scale are now routine inputs.

---

## Theme 2. Demand for more sophisticated, easier, on-demand BI as the GC aligns with day-to-day business

### 2.1 Thomson Reuters Institute, 2026 State of the Corporate Law Department (primary, full PDF read)
- Landing page 2026-03-24: https://www.thomsonreuters.com/en/institute/reports/state-of-the-corporate-law-department-report-2026 ; PDF: https://cdn.prod.website-files.com/69d6be3496563612043e552e/6a58f1aa70bfac39919afdb1_6a58f1a8eb5a7f924a856e74_2026%2520State%2520of%2520the%2520Corporate%2520Law%2520Department%2520Report.pdf ; TR Legal blog 2026-06-16: https://legal.thomsonreuters.com/blog/what-the-2026-state-of-corporate-law-department-report-means-for-general-counsel/
- Basis: "more than 2,300 interviews with corporate general counsel" (PDF p.3; the TR Legal blog says "2,400+"). Field dates not stated. C-suite comparison data comes from a separate TR C-suite survey; its sample size is not given in the pages I read.
- The "visibility gap": 86% of GCs say their department contributes significantly to organizational objectives; only 17% of C-suite respondents agree; 42% of C-suite say legal contributes little or nothing.
- Technology cited as a strategic priority doubled from 14% to 28%; 86% of those mentions reference AI. 47% of departments have access to GenAI tools.
- 68% of GCs rate internal dialogue with business units as their most valuable source on emerging risks; 36% rate technology highly valuable for risk management.
- AI benefits (Figure 15): "Decision-making using analytics" already experienced by 19%, anticipated within 12 months by a further 39%. Response times: 34% already, 37% anticipated. (Text attributes underlying data to the TR Future of Professionals Report 2025, June 2025; the figure is labelled "Source: Thomson Reuters 2026".)
- Exact quote (PDF p.29): "GCs need to institute metrics for success that translate to the rest of the business."
- Exact quote (PDF p.23): "GCs should be positioning the department's efficiency metrics in the context of larger business goals, rather than in the language of the legal department."
- Exact quote (PDF p.10): "legal departments are putting their efforts into unlocking capacity while the business will only see where capacity is deployed."
- TR recommends departments grade themselves on the metrics they apply to outside counsel: "the same matter cycle time metrics that outside counsel use can be calculated internally as well" (p.18), plus early risk detection and audit reduction rates.
- Landing-page copy (as returned by fetch; medium confidence on verbatim): GCs are "evaluating outside counsel and their own operations alike with a wider suite of new metrics and KPIs"; "very few are collecting success metrics around AI's implementation or linking its use to business revenue".

### 2.2 2026 ACC Chief Legal Officers Survey (primary Key Findings PDF read)
- PDF: https://www.acc.com/sites/default/files/2026-01/2026-ACC-Chief-Legal-Officers-Survey-Key-Findings.pdf (file path indicates January 2026). Resource page: https://www.acc.com/resource-library/2026-acc-chief-legal-officers-survey . Sponsor: FTI Technology.
- Sample: 1,049 CLOs, 20 industries, 43 countries. Field dates not in the key findings.
- 84% of CLOs report directly to the CEO (record; 79% prior year per Lexpert). 79% "almost always" attend board meetings. 74% provide proactive strategic counsel.
- CLO oversees compliance (64%) and corporate secretary (62%).
- Operational efficiency is the top strategic initiative (53%); budget/resource constraints are the top barrier (35%).
- 36% in active deployment of GenAI; 63% expect headcount to remain stable. 47% say technology/AI proficiency is the primary area their CEO wants them to develop; prioritization of technological fluency for department lawyers rose 17 points to 34%.
- Exact quote: "legal expertise is now integrated into business planning during the inception of projects rather than at the point of crisis."
- Relevance: the structural alignment (CEO reporting line, board presence, risk hub) is what drives demand for on-demand, business-language reporting.

### 2.3 Vendor signal: "answers, not dashboards" (all vendor; CLOC Global Institute 2026 announcements, May 2026)
- Legal.io, 2026-05-11: AI assistant for natural-language questions over rate, panel, and spend data. https://globalinstitute.cloc.org/wp-content/uploads/2026/05/Legal.io-Press-Release.pdf
  - Exact quote (Pieter Gunst, CEO): "In-house teams don't need another dashboard. They need answers."
  - Exact quote (Hannah Konitshek, COO): "Legal operations has matured into a discipline that runs on data, but most teams are still stitching that data together manually."
- Mitratech ARIES, 2026-05-11: "ambient" AI that surfaces context without search, on-demand AI that executes tasks; tracks spend against budget in real time within matter views; answers natural-language questions about outside counsel performance. https://finance.yahoo.com/sectors/technology/articles/mitratech-heads-cloc-2026-showcase-135800343.html
  - Exact quote (Justin Silverman, COO, Mitratech Legal): "Legal teams don't want another AI tool to evaluate; they want AI that already understands their matters, their spend, and their workflows."
- Wolters Kluwer LegalVIEW BillAnalyzer Invoice Review Agent, 2026-05-05: "Natural Language controls: Legal teams can interrogate invoices for spend and compliance trends". https://globalinstitute.cloc.org/wp-content/uploads/2026/05/Wolters-Kluwer-Press-Release.pdf
- Blickstein 2025 (1.8 above): usability overtook security as the top AI concern, and "efficiency and ease of use" ranked highest in defining technology effectiveness (snippet).

### 2.4 CLOC leadership view
- Oyango Snell, CLOC blog 2026-03-10: https://cloc.org/blog/cloc-global/legal-ops-in-2026-signals-from-london-new-york-and-beyond/ . Legal ops leaders use "operational metrics such as cycle time, risk exposure, and outside counsel spend" to inform leadership decisions; legal operations is reaching "a new level of operational maturity".
- Snell at CGI 2026 (Legal IT Insider, Toby Weston, 2026-05-15, https://legaltechnology.com/cloc-global-institute-2026-a-market-in-transition/): "The AI conversation has matured. Teams are now sharing what has worked, what broke, and how they are governing it."

---

## Theme 3. The expanding audience for legal department information (CFO, board, audit committee, business units, procurement, risk, compliance)

- CEO and board: 84% of CLOs report to the CEO; 79% almost always attend board meetings; nearly half report increased depth of board-level engagement (ACC 2026 CLO Survey, 1,049 CLOs, PDF dated 2026-01; URL in 2.2).
- Risk and compliance: CLO has majority oversight of compliance (64%) and the corporate secretary function (62%), "the enterprise's central authority for non-financial risk" (same source).
- C-suite as a sceptical consumer: 86% vs 17% visibility gap; 42% of C-suite say legal contributes little or nothing (TR 2026, 2.1). C-suites want legal spend shown "as a percentage of revenue" (TR 2026 PDF p.23).
- IT, procurement, and shared funding: shared-services funding of legal technology rose to 29% overall and to 43%-45% at $5B+ companies; ACC reads this as legal tech becoming "a cross-functional investment, likely coordinated with the IT or procurement departments" (ACC/MLA 2026 Benchmarking, n=576, fielded 2026-02-11 to 2026-04-17). Implication: legal data now sits in an enterprise stack and is visible to enterprise stakeholders.
- CFO (vendor/ALSP source): Axiom, 2026 In-House Legal Budgeting Survey Report, published 2025-09-08, 500+ respondents (GCs, CLOs, deputy GCs, and CFOs), eight countries: https://www.axiomlaw.com/resources/articles/legal-budgeting-survey-report-2026
  - 49% of legal departments changed their budgeting models in the past 12 months; another 36% plan changes in 2026.
  - 89% of legal leaders rate the CFO relationship as excellent, "but a 18-point authority gap": per search snippet, 50% of CFOs say they control legal budget-setting vs 32% of legal leaders who say the CFO has independent authority.
  - 78% "are mandated to implement AI without dedicated budgets".
- Business units as data consumers and suppliers: legal ops spend-by-business-unit reporting is tracked by roughly a third of departments (TR LDO 2025); 59% cite improving collaboration between legal and business units as the top way to improve effectiveness (TR LDO 2025, Figure 5, first-listed item).
- Enterprise AI governance: about one-third of legal ops leaders now advise on or own AI governance company-wide (Blickstein 18th survey, via Integreon webinar summary).
- I found NO survey statistic specifically on audit-committee reporting, or on what share of departments produce board-level legal dashboards. (Gap.)

---

## Theme 4. Legal data and insights as inputs to AI-orchestrated process automation and agentic workflows

### 4.1 Gartner predictions, press release 2026-05-26 (primary 403; secondary: Lawyers Weekly, Grace Robbie, 2026-06-09)
- https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-predicts-legal-tech-budgets-to-double-by-2028-as-legal-ai-use-expands ; secondary https://www.lawyersweekly.com.au/biglaw/44448-legal-tech-spending-set-to-double-by-2028-amid-ai-boom
- Legal technology budgets to double by 2028.
- Exact quote (Weston Wicks, Senior Director Analyst): "By 2029, approximately 50 per cent of contract reviews will be delegated to self-service systems that escalate only one in 10 for human review"
- Exact quote (Wicks): "we predict that 60 per cent of legal departments will use AI-driven intake systems that capture all requests and answer one-half of those without human intervention"
- Exact quote (Wicks): "Early evidence suggests multi-agent legal applications offer gains in productivity, reduced reliance on external counsel, and improvements in compliance"
- These are analyst predictions, not survey measurements.

### 4.2 Gartner, "five themes set to transform legal functions by 2030", press release 2026-07-15 (primary 403; secondary: Lawyers Weekly 2026-07-28)
- https://www.lawyersweekly.com.au/corporate-counsel/44730-5-forces-set-to-redefine-legal-departments-by-2030
- 56% of legal departments anticipate a headcount freeze or reduction in 2026 (survey sample not stated in secondary coverage).
- Exact quote (Raashi Rastogi, Gartner): "Legal departments that begin preparing now will be better positioned to manage rising complexity, support growth and improve how they deliver value to the enterprise"

### 4.3 CLOC Global Institute 2026 (May 11-14, Chicago; 2,300+ attendees per CLOC news hub: https://globalinstitute.cloc.org/news-hub/)
- Trade press (Legal IT Insider 2026-05-15): dominant theme was embedded intelligence, workflow automation, and integration rather than standalone tools; Mitratech positioned "agentic AI systems that do not just assist but act".
- Vendor recap (Steno 2026-06-03): three-tier agent architecture attributed to Trent Mosley (Anthropic): human in the loop, lawyer in the loop, agent in the loop; Mike Haven (Meta) four-pillar AI value framework: Deflection, Internal Focus, Organizational Efficiency, New Capabilities. "Deflection" as a first-class value pillar is directly relevant to intake metrics.
- Announcements (all vendor):
  - Wolters Kluwer BillAnalyzer Invoice Review Agent (2026-05-05): agentic AI that "identifies non-compliant invoice line items and automatically implements adjustments", auditable and reversible; built on "more than $200 billion in actual legal invoice data". Exact quote (Dean Sonderegger): "Future-ready legal teams know that it isn't enough to simply flag non-compliance".
  - Streamline AI In-House Legal AI Platform (2026-05-11; https://globalinstitute.cloc.org/wp-content/uploads/2026/05/Streamline-AI-Press-Release.pdf): "a system of interconnected AI agents"; Velo Copilot coordinating agent; Featherline contract review agent that can "report on contract metrics". Exact quote (Kathy Zhu, CEO): "we're moving legal technology beyond systems that track work and toward a platform that organizes, manages, and executes it." Vendor claims: efficiency up more than 40% and 20% of capacity freed for named customers (self-reported).
  - Checkbox AI Agent Actions (2026-05-11): conversation-to-matter creation, automatic triage and workflow kickoff (see Theme 5).
  - Mitratech ARIES (2026-05-11): extracts structured data from legal documents to populate matters; builds docket timelines; flags non-compliant invoice items before approval.
  - Harbor "2026 Legal Department Maturity Index Survey": per the CLOC news hub summary, departments "have achieved near-universal AI adoption but lack the operating model infrastructure to scale it effectively". I could not locate the release or any figures. (Gap.)

### 4.4 Adoption measurements for agents
- ILTA 2026 Technology Survey (law firms, not departments): 508 firms, 139,661 attorneys; results released ~2026-09-14. 13% already use agentic AI on the business side or in practice; 94% using or exploring GenAI (80% prior year); 78% have a formal GenAI policy; accuracy is the top concern (63%). Secondary sources: eDiscovery Today (Doug Austin) 2026-09-14 https://ediscoverytoday.com/2026/09/14/ilta-2026-technology-survey-results-released-legal-technology-trends/ ; LawSites (Bob Ambrogi) 2026-09-14 https://www.lawnext.com/2026/09/which-ai-product-is-most-popular-among-law-firms-findings-of-iltas-tech-survey-may-surprise-you.html ; ILTA page https://www.iltanet.org/resources/publications/surveys/ts26 . Field dates not published. No BI/analytics figures are public.
- LegalOn / In-House Connect, "2026 State of AI for In-House Legal" (vendor; n=452; date within 2026 not shown): 80% of legal teams exploring or evaluating AI agents; 67% say AI helps them respond faster to the business; 79% report reduced time on routine tasks. https://www.legalontech.com/resources/2026-state-of-ai-for-in-house-legal
- Axiom, "2026 In-House Legal AI Report" (ALSP vendor; published 2026-06-29; n=528 in-house legal leaders, six countries; fielded March 2026 by InsightDynamo): 83% of legal teams cannot measure whether their AI spending is working; only 7% have scaled AI across the organization; 100% of teams using AI plan to raise AI budget. https://www.axiomlaw.com/resources/articles/legal-ai-survey-report
- The Legal Stack, "Legal AI Agentic Deployment Readiness Report 2026" (publisher unfamiliar; describes itself as independent with no vendor funding; published 2026-06-17; n=200, fielded March-April 2026; only 55 respondents are Fortune 1000 in-house). 38% overall report at least one agentic workflow in production; 47% of the in-house subgroup (n=55, so about 26 departments); legal operations is the leading function at 54%. 58% self-describe as "agentic ready" but 11% met all four test criteria. 22% of those with production deployments report an incident of "an agent acting on outdated information" (e.g. invoice processed after dispute resolved: 11% of e-billing users). https://www.thelegalstack.org/research/the-legal-ai-agentic-deployment-readiness-report-2026-how . LOW CONFIDENCE: verify publisher before citing.

---

## Theme 5. Legal service intake ("legal front door") metrics

- No independent (non-vendor) benchmark of request volumes, cycle times, triage, or self-service deflection was found. CLOC SOTI, ACC Benchmarking, and TR LDO public materials do not report intake metrics. This is the largest gap in the track.
- Closest independent data point: TR LDO Index 2025 shows cycle time ("average period of time between opening and closing a matter") is routinely reported by fewer than one in five departments (analysis article says "less than 20%"; figure suggests low teens). "Increased triaging of new matters" appears as a minor cost-management lever (Figure 6).
- ACC Maturity Model 2.0 lists "Legal service request intake and triage function" and "legal service intake/triage" systems as maturity markers in other functions (PDF lines on service delivery and technology).
- Gartner prediction (4.1): by 2029, 60% of legal departments will use AI-driven intake that captures all requests and answers half without human intervention. This is the only analyst-grade deflection number found, and it is a forecast.
- Meta's Mike Haven reportedly uses "Deflection" as the first of four AI value pillars (Steno recap, vendor, 2026-06-03).
- Checkbox press release 2026-05-11 (vendor): https://globalinstitute.cloc.org/wp-content/uploads/2026/05/Checkbox-Press-Release.pdf
  - Exact quote: "Cycle time is one of the most important metrics for legal as it helps to reveal where delays are coming from and proves that the bottleneck is often the business, not legal."
  - "Intelligent Status Update" sets matter status from message activity under plain-English rules so that cycle-time data separates "time spent by legal from time spent waiting on the business"; supports SLA reporting. The announcement names the data-quality problem directly: reliable cycle-time data "has traditionally depended on whether someone remembered to move a matter".
  - Routing model: every request is "answered instantly, escalated into a process, or routed to the right attorney", i.e. self-service, workflow, or attorney review.
- Streamline AI benchmark claims (vendor; page undated; sample sizes not given): https://www.streamline.ai/article/what-is-legal-intake
  - "63% of business professionals wait four or more days for a routine contract review and 80% have little to no visibility into where their request stands"
  - "93.7% of teams in the 2025 benchmark have no self-service knowledge base at all"
  - Teams perceived as bottlenecks score 26%-29% lower; 60.8% struggle to justify resources; average team at about 45% "efficiency"; teams on purpose-built platforms score 70%-83% higher on the vendor's "Legal Efficiency Score" than teams on email and spreadsheets.
  - Treat as vendor marketing data: methodology not disclosed.
- Juro, State of In-House 2026 (vendor; n=130+ in-house lawyers, 16 countries): 67% say routine contracts could work without daily legal involvement. https://juro.com/state-of-in-house-2026
- CLOC (Snell blog 2026-03-10): departments demonstrate improvement through "faster contract turnaround or clearer intake processes".

---

## Theme 6. Data quality and data foundation issues

- ACC Maturity Model 2.0: data integrity is the first hurdle ("Uneven integrity/cleanliness of data; working to improve data integrity through naming conventions, standard groupings"); at the intermediate stage "Most metrics generated through manual synthesis of data from disparate systems".
- Legal.io COO, 2026-05-11 (vendor): "most teams are still stitching that data together manually." The release describes rate cards, panel performance, spend history, and matter context as "scattered across e-billing systems, spreadsheets, and inboxes".
- Checkbox, 2026-05-11 (vendor): cycle-time data has depended on humans updating matter status; AI now maintains status so "cycle time reporting that they can finally stand behind".
- TR LDO 2025: many tools are owned but underutilized (legal BI 21% underutilized vs 16% valuable; workflow automation 25% vs 13%; knowledge management 27% vs 16%). TR advises "a thorough and honest assessment of why these tools are underutilized".
- TR 2026: "very few are collecting success metrics around AI's implementation" (landing page copy). Axiom 2026 (vendor): 83% cannot measure whether AI spend is working.
- The Legal Stack 2026 (low confidence): 22% of production agentic deployments have had an incident from stale data; examples include duplicate docketing (9% of litigation respondents), NDA execution after a relationship ended (7% of CLM users), and invoice processing after a dispute was resolved (11% of e-billing users). This is the only quantified link found between data currency and agent failure in legal.
- Harbor 2026 Legal Department Maturity Index (summary only): near-universal AI adoption without the operating-model infrastructure to scale.
- CGI 2026 session "Fiduciary-Grade AI at Scale" (Barclay Blair, PiperAI; Pia Opulencia, DLA Piper): "Accuracy is non-negotiable." (Steno recap, vendor, 2026-06-03.)
- Wolters Kluwer expert insight "Would you bet your AI strategy on your current data? Why governance is key" exists (https://www.wolterskluwer.com/en/expert-insights/would-you-bet-your-ai-strategy-on-your-current-data-why-governance-is-key) but returned 403; content and date not verified.
- Reveal/Onna "2026 Collaboration Data Risk & Readiness Report" (vendor; via CLOC news hub summary): "80% of organizations face cost overruns" on matters affected by collaboration-data management challenges. Not independently verified.

---

## Conferences: dates, locations, themes

- CLOC Global Institute 2026: May 11-14, 2026, Chicago. 2,300+ attendees (CLOC news hub). Compass launched May 12. Themes per trade press: AI conversation matured to governance and measurement; embedded intelligence, workflow automation, integration. 202 session proposals received (vendor blog, unverified).
- ILTACON 2026: August 23-27, 2026, Gaylord Opryland Resort & Convention Center, Nashville, Tennessee. "Over 80 educational sessions" (iltacon.org agenda overview: https://www.iltacon.org/agenda/overview). Keynote Wednesday: Reena SenGupta (RSGI). Agenda emphasis per a vendor guide (Ajax, https://joinajax.com/blog/iltacon-2026): AI governance, practical applications, ROI measurement, cybersecurity, eDiscovery, data privacy. The same vendor guide says "over 1,600 attendees", which looks low against ILTACON's historical scale; do not cite. No session-level data/analytics recaps were retrievable (search budget exhausted). Registration opened 2026-04-14.
- ILTA 2026 Technology Survey: released around 2026-09-14; 508 firms; law-firm focused; full results paywalled; executive summary free.
- RLLB 2026 (Running Legal Like a Business, LegalOps.com): September 8-11, 2026, Fontainebleau Las Vegas; 900+ attendees expected; 100+ sessions; tracks: GCs & CLOs, Legal Operations, Litigation Operations, Legal Project Management, IP Operations, AI, Leadership & Personal Effectiveness. Workshop: "The AI ROI Playbook for Legal Teams" (Mori Kabiri), on "whether a specific AI investment is producing meaningful, measurable value". https://rllb-2026.legalops.com/ . No post-event recaps or data-session detail found (event ended 10 days before this research).

---

## Distinct viewpoints found

1. Thomson Reuters Institute: the problem is no longer capability but visibility. Departments hit their own internal metrics, yet the C-suite does not see it; metrics must be re-expressed in business-outcome language.
2. TR LDO Index: measurement is mature on spend and immature on service, outcomes, cycle time, and technology value; GCs want service enhancement but still measure cost.
3. CLOC / Harbor: a structural productivity gap (rising demand, flat budget and headcount) makes operational discipline, technology strategy, and governance the main levers; maturity assessment itself is being productized (Compass).
4. ACC: the CLO is now a CEO-reporting, board-attending enterprise risk hub; benchmarking is "performance storytelling"; legal tech is becoming a shared enterprise resource.
5. Gartner: multi-agent legal applications and AI-driven intake will deflect half of requests by 2029; budgets double by 2028; headcount frozen.
6. Vendors (Legal.io, Mitratech, Wolters Kluwer, Checkbox, Streamline AI): dashboards are giving way to natural-language answers embedded in workflow, and to agents that act on legal data (adjust invoices, create matters, update status, triage requests).
7. Sceptical / cautionary: Axiom (83% cannot measure AI value; 7% scaled), The Legal Stack (self-assessed agent readiness 58% vs 11% tested; stale-data incidents), Blickstein (only 23% "fully operational" with AI), TR (tools owned but underutilized).

---

## Gaps (could not find or could not verify)

- CLOC 2026 State of the Industry: no public figures on analytics, BI, dashboards, metrics programs, or intake; full report is member-gated. Field dates for the underlying 2025 Harbor survey not published.
- ACC 2025 Law Department Management Benchmarking Report: not reviewed (only the 2026 edition was read). ACC 2026 CLO Survey full report (beyond Key Findings) not reviewed; field dates not found.
- Thomson Reuters 2026 LDO Index: not yet published as of 2026-09-21 as far as I could find (2025 edition was published 2025-09-24).
- Blickstein Group survey: full 2025 report not accessible; no metrics/analytics figures retrieved; conflicting sample size (68 vs "more than 70").
- Gartner: all primary pages blocked (403). No Gartner statistic on legal dashboards/analytics maturity that is both current and verifiable. The "60% descriptive / 16% diagnostic analytics" figure is undated.
- ILTACON 2026 and RLLB 2026: no session-level recaps on data/analytics found. ILTA 2026 Technology Survey BI/data findings are paywalled.
- Legal front door / intake: no independent benchmark of request volumes, cycle times, triage accuracy, or self-service deflection rates. Only vendor claims and one Gartner forecast.
- Audit committee / board reporting: no statistic on the share of departments producing board or audit-committee reporting from legal data.
- Harbor 2026 Legal Department Maturity Index Survey: only a one-line summary found; no release URL, sample, or figures.
- Brightflag, Onit, LawVu: no 2026 survey-based reports found (LawVu's latest located is the 2024 In-House Legal Technology Report, fielded October 2023; Onit ELR report dates to 2022; Brightflag was acquired by Wolters Kluwer in May 2025 per search results).
- Wolters Kluwer LegalVIEW Insights 2026 pages returned 403; details come from search snippets only.
- WebSearch budget for the session was exhausted partway through, so EY, Deloitte, KPMG, and Everlaw/ACC-type GC studies were not checked.
