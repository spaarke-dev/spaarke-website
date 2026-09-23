# Research notes: How the role of legal operations is changing (2025-2026)

Research date: 2026-09-21. Researcher: Claude research subagent for Spaarke.
Track thesis: legal ops is changing because the legal department/function is changing and because companies are changing how they work with, and what they expect from, outside counsel.

## Source-handling caveats (read first)

- "VERIFIED-TEXT" = I read the source text directly (PDF extracted with pdftotext). Quotes are exact.
- "EXTRACTED" = pulled through the WebFetch summarizer model from the live page. Statistics are reliable; quotes should be re-checked against the page before publishing. Where the same quote appeared identically in two independent sources I note "2-source match".
- 403-blocked (could not fetch directly): gartner.com (all pages), acc.com newsroom HTML, axios.com, forbes.com, globallegalpost.com, lexology.com, wolterskluwer.com. For Gartner and ACC I used secondary coverage plus the ACC Key Findings PDF (which did download).
- WebSearch budget for the session was exhausted after ~28 searches; remaining work was done by direct fetch.
- Temp text extractions of PDFs are in `scratchpad/research/tmp/` (acc-clo-2026.txt, deloitte-clo-2026.txt, tr-ldo-2025.txt).

---

## Theme 0. The macro frame: demand up, budget/headcount flat, outside counsel no longer the release valve

**CLOC 2026 State of the Industry Report** (published 2026-03-02; data = 2025 Harbor Law Department Survey run with CLOC; 135 law departments, 15+ industries, median revenue US$13B).
- Workload increases driven by regulatory compliance (63%), cybersecurity (58%); contracts 53% (Harbor release).
- Only 37% expect outside counsel spend to increase, down from 58% prior year. 47% expect inside spend to increase, down from 65%. 32% expect lawyer headcount increases (down from 42%).
- 85% have a dedicated resource or committee to manage AI use.
- Legal ops focus areas: technology strategy 80%, financial management 72%, outside counsel/vendor management 62%.
- Quote (2-source match: CLOC press release + Lexpert), Oyango Snell, CLOC President & CEO: "Demand is accelerating in areas like regulatory compliance and cybersecurity, yet budget and staffing growth are not keeping pace."
- Quote (EXTRACTED, CLOC release), Lauren Chung, Harbor: "The shift away from relying on outside counsel as a pressure valve signals a deeper transformation."
- Quote (EXTRACTED, Lexpert), Kevin Clem, Harbor: "The latest data poses a paradox: accelerating AI adoption comes at the same time that hiring and spending are leveling off."
- Sources:
  - https://cloc.org/newsdesk/cloc-releases-2026-state-of-the-industry-report-rising-legal-demand-outpaces-budget-and-staffing-growth-forcing-operational-shift/ (2026-03-02, primary)
  - https://cloc.org/blog/soti/clocs-2026-state-of-the-industry-report-benchmarking-data-is-the-compass-for-legal-operations-to-navigate-change/ (2026-03-02, Kevin Clem, Harbor)
  - https://www.lexpert.ca/news/in-house-lawyer/cloc-finds-legal-department-structural-productivity-gap-with-demand-outpacing-resources/394024 (2026-03-04, trade press)

**Harbor 2025 Law Department Survey** (22nd annual; press release 2025-12-08; same 135-department dataset).
- 98% implementing or exploring AI; 57% live, 24% pilot (from search-result summary of Harbor's later release "Legal Departments Surging Ahead on AI, but Operating Model Gaps Are Limiting Scale"; that page did not render in fetch - treat as medium confidence).
- 76% use AFAs (up from 70%). 61% have completed or are implementing convergence/preferred-provider panels (up from 50%). 65% made intentional efforts to keep work in-house in the past 1-2 years.
- Staffing: 41% expanded in the past year; 45% contracted.
- Quote (EXTRACTED), Oyango Snell: "Legal operations has become the engine that keeps the function running efficiently"
- Source: https://www.prweb.com/releases/harbor-2025-law-department-survey-reveals-surge-in-ai-integration-falling-outside-counsel-spend-302635093.html (2025-12-08, primary press release)
- Harbor's second release (not fetchable): https://harborglobal.com/about/press-releases/new-harbor-research-finds-legal-departments-surging-ahead-on-ai-but-operating-model-gaps-are-limiting-scale/ - claim per search snippet: most departments "have not yet built the integrated workflows, governance structures, and talent models needed to scale what they have deployed."

**Thomson Reuters Institute 2025 Legal Department Operations Index** (published 2025-09-24; survey July 2025; 128 US respondents; with Buying Legal Council). VERIFIED-TEXT from the PDF.
- 82% have at least one dedicated legal ops role (note: TR's blog post says 81%; the PDF says 82% twice). 45% classify themselves as "General Counsel tasked to run legal operations."
- 56% under-resourced; 46% expect more work to be brought in-house; 55% flat or decreasing budgets; 51% flat legal-tech budgets; 73% plan to use advanced technology to automate tasks; 45% call pace of tech change "slow"; 81% report increasing matter volumes; 59% aim to improve collaboration between legal and business units; 70% expect GenAI to influence interactions with internal business stakeholders.
- Exact text: "Legal operations work is expanding beyond its origins as primarily a cost-control function to include a focus on systems, processes, and technology."
- Finding: when legal ops is run by a legal-ops professional rather than a GC doing double duty, departments show more legal tech use, growing tech budgets, more sophisticated spend management, and more ALSP/AFA use.
- AFA reality check, exact text: "AFAs are used in about 20% of legal matters consistently." And AFA expansion "still remains largely a discussion rather than a plan of action".
- Panels: only 16% have a formal panel (18% in 2024); informal panel/preferred list rose to a plurality (chart shows 46% vs 34% prior year - chart extraction is messy; verify in PDF p.18).
- Anonymous practitioner quote (exact): "The role of legal operations is to take the everyday tasks off the attorney's desk so they can perform the high-value work they were hired to do." - Legal operations, Pharmaceuticals/Bioscience
- Sources:
  - https://www.thomsonreuters.com/en-us/posts/wp-content/uploads/sites/20/2025/09/Legal-Department-Operations-Index-2025.pdf (2025-09, primary)
  - https://www.thomsonreuters.com/en-us/posts/corporates/ldo-index-report-2025/ (2025-09-24)
  - Related TR post (search snippet only): 47% of GCs more focused on service enhancement than cost reduction vs 7% more focused on cost - https://www.thomsonreuters.com/en-us/posts/corporates/2025-ldo-index-legal-success-metrics/

---

## Theme 1. The business gets directly involved in its own legal risk management (front door, self-service, guided answers)

**Gartner (2026-05-26 press release, "Gartner Predicts Legal Tech Budgets to Double by 2028 as Legal AI Use Expands").** Gartner.com is 403-blocked; content taken from secondary reprints (SMBtech 2026-05-27; Lawyers Weekly AU 2026-06-09). 2-source match on the quotes.
- Legal technology budgets to double by 2028, driven by specialized legal AI platforms (release names Harvey, Legora, GC AI, Thomson Reuters CoCounsel per search snippet).
- By 2029: about 50% of contract reviews delegated to self-service systems that escalate only one in 10 for human review.
- By 2029: 60% of legal departments will use AI-driven intake systems that capture all requests and answer half without human intervention.
- Quote, Weston Wicks, Senior Director Analyst, Gartner Legal & Compliance: "60 per cent of legal departments will use AI-driven intake systems that capture all requests and answer one-half of those without human intervention" (trimmed from a longer sentence; "per cent" spelling is the AU reprint's - the US original likely says "60%").
- Quote, Wicks: "approximately 50 per cent of contract reviews will be delegated to self-service systems that escalate only one in 10 for human review"
- Quote, Wicks: "Early evidence suggests multi-agent legal applications offer gains in productivity, reduced reliance on external counsel, and improvements in compliance"
- Sources:
  - https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-predicts-legal-tech-budgets-to-double-by-2028-as-legal-ai-use-expands (2026-05-26, primary, not fetchable)
  - https://smbtech.au/news/gartner-predicts-legal-tech-budgets-to-double-by-2028-as-ai-use-expands-across-legal-departments/ (2026-05-27)
  - https://www.lawyersweekly.com.au/biglaw/44448-legal-tech-spending-set-to-double-by-2028-amid-ai-boom (2026-06-09)
- Also exists, title only (paywalled): Gartner, "Predicts 2026: AI and Agentic AI Will Enable Legal Self-Service" - https://www.gartner.com/en/documents/7226630 (date not retrievable). The title alone is evidence that Gartner frames self-service as the 2026 theme.
- Gartner case study on intake/triage platform exists but is blocked: https://www.gartner.com/en/legal-compliance/trends/case-study-intake-triage-platform

**Deloitte, "2026 Predictions for Chief Legal Officers"** (Deloitte US CLO Program; copyright 2026; exact publication date not on document). VERIFIED-TEXT.
- Exact text: "Legal departments should consider establishing frameworks, processes, guardrails, and escalation procedures for risk evaluations to happen closer to where business occurs"
- Also: "real-time, business-embedded decision-making is also likely to increase."
- This is the strongest named-firm statement that legal risk evaluation is moving out to the business, with legal supplying the guardrails.
- Source: https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/programs/2026/us-2026-predictions-for-chief-legal-officers.pdf (2026, primary)

**Juro, State of In-House 2026** (vendor survey; 130+ in-house lawyers, 16 countries, EMEA + US; date on page: 2026).
- 67% say routine contracts could work without daily legal involvement (54% "could work", 13% already doing it). So actual adoption of full business self-service is about 13% in this sample; the rest is belief.
- Source: https://juro.com/state-of-in-house-2026 (2026, vendor)

**KPMG 2026 Global General Counsel Outlook** (468 GCs/senior legal leaders, 28 jurisdictions; survey Nov 2025-Feb 2026).
- Quote (EXTRACTED), Christian Athanasoulas, Head of KPMG Legal Services, KPMG US: "Legal insight is most valuable when provided at the business decision point, helping leaders weigh risk and opportunity."
- Source: https://kpmglawus.com/us/en/articles/2026-kpmg-global-general-counsel-outlook.html (2026, primary)

**Vendor market signal (treat as vendor):**
- Checkbox "AI Legal Front Door" release 2026-05-11 (timed to CLOC Global Institute): AI Agent Actions create structured matters from business requests without manual triage; attorney corrections feed future answers; cycle-time reporting separates legal time from time waiting on the business. https://www.prnewswire.com/news-releases/checkbox-expands-ai-legal-front-door-with-new-capabilities-for-workflow-automation-institutional-knowledge-capture-and-cycle-time-reporting-302767399.html
- Other vendors using the "front door" framing: ServiceNow Legal Service Delivery, Streamline AI, Coheso; Deloitte Legal Germany has a "Designing Your Legal Front Door: Five Approaches" piece (https://www.deloittelegal.de/dl/en/services/legal/perspectives/designing-your-legal-front-door.html - not fetched, date unknown).

**TR 2026 State of the Corporate Law Department** (see Theme 2): 68% of GCs rate internal conversations with business units as highly valuable for risk intelligence vs 36% for technology - risk sensing is already a business-side conversation.

GAP: no neutral, survey-based adoption number for "legal front door"/intake portals or NDA self-service in 2025-2026 was found. Best available: Gartner's forward prediction (60% by 2029), Juro's 13% "already doing", TR LDO's 59% aiming to improve legal/business collaboration.

---

## Theme 2. Legal ops enabling the GC/CLO to play a more strategic role

**ACC 2026 Chief Legal Officers Survey - Key Findings** (1,049 CLOs, 43 countries, 20 industries; PDF filed under acc.com 2026-01; press coverage 2026-02-02; produced with FTI Technology). VERIFIED-TEXT from Key Findings PDF.
- Exact: "The transition from "head lawyer" to "business executive" has reached a structural peak, with a record 84% of CLOs now reporting directly to the CEO." (79% in prior year per Lexpert.)
- "Chief Legal Officer" title adoption up to 34%.
- CLO oversight: compliance 64%, corporate secretary 62%; extends to ethics, privacy, cybersecurity.
- 47% say technology and AI proficiency is the primary area their CEO wants them to develop. Prioritization of technological fluency for department lawyers "surged 17 points to 34% in a single year."
- 36% already in active deployment of GenAI; 63% expect headcount to remain stable. Heading: "AI Adoption Targets Role Evolution Over Headcount Reduction".
- 74% provide proactive strategic counsel; 79% "almost always" attend board meetings.
- Operational efficiency (53%) is again the top strategic initiative; budget/resource constraints are the top barrier (35%).
- Exact: "CLOs face a fundamental dilemma: while they are mandated to lead an AI-driven transformation, they are hampered by chronic budget and resource constraints"
- Counter-signal on outside counsel: for regulatory surges, "Use of outside counsel jumped to 48% and consultants to 27%" - ACC frames external resources as the regulatory "pressure valve". This is in tension with CLOC/Harbor's "no longer the release valve" framing (different question: regulatory surge support vs overall spend expectation).
- Regulatory priorities: trade/tariffs 30%, AI regulation 24% (Lexpert reported 21% for AI regulation - PDF says 24%; use the PDF).
- Secondary (Kevin McGee Substack, 2026-02-19, citing full report): 62% of CLOs regularly sought for input on strategic business decisions, up from 43% in 2025 (65% in 2023). NOT verified against the full ACC report - treat as medium/low.
- Quote (EXTRACTED, Lexpert), Jason L. Brown, ACC President & CEO: "CLOs are being asked to lead AI adoption, manage geopolitical risk and drive strategic value - often with constrained budgets." (Lexpert may have shortened this; verify.)
- Sources:
  - https://www.acc.com/sites/default/files/2026-01/2026-ACC-Chief-Legal-Officers-Survey-Key-Findings.pdf (2026-01, primary)
  - https://www.acc.com/resource-library/2026-acc-chief-legal-officers-survey (primary landing, 403 to fetch)
  - https://www.lexpert.ca/news/in-house-lawyer/most-chief-legal-officers-are-now-working-directly-with-ceos-association-of-corporate-counsel/393946 (2026-02-02)
  - https://www.ftitechnology.com/spotlight/2026-acc-clo-survey (2026; demographics: 64% US respondents, 59% private cos.)
  - https://kevinmcgee.substack.com/p/2026-as-strategic-gc-involvement (2026-02-19, other)

**Thomson Reuters Institute, 2026 State of the Corporate Law Department** (published 2026-03-24; subtitle "GCs align strategy to corporate imperatives, but C-Suites want more").
- 86% of GCs see legal as a significant contributor to business objectives; only 17% of other C-suite executives agree; 42% of C-suite say legal contributes little or not at all.
- ~48% of GCs cite staffing/resource constraints as the biggest barrier.
- 36% of GCs expect to increase outside counsel spend next year; 20% plan to decrease.
- Technology as strategic priority doubled from 14% to 28%; 86% of technology mentions reference AI; ~49% of departments have enterprise-wide GenAI tools.
- TR's point: departments adopt AI for efficiency but few measure success or tie it to business outcomes. Message: communicate outcomes, not tasks.
- Sources:
  - https://www.thomsonreuters.com/en/institute/reports/state-of-the-corporate-law-department-report-2026 (2026-03-24, primary)
  - https://legal.thomsonreuters.com/blog/what-the-2026-state-of-corporate-law-department-report-means-for-general-counsel/ (2026-06-16)
- This perception gap (86 vs 17) is the most useful single datapoint for the article: the GC's strategic role is asserted by legal but not yet credited by the business. Legal ops' job in the new paradigm is evidence production.

**KPMG 2026 Global GC Outlook**: 75% of legal leaders regularly advise on non-legal business issues; AI implementation is the #1 operational priority for the next three years; pressures: regulatory volume/complexity 39%, expanding issues requiring legal input 36%, faster demands for advice 31%.
- Quote (EXTRACTED), Tom Greenaway, Principal, KPMG Law US: "Legal teams face more work, tighter timelines, little room for headcount - forcing a rethink of how legal work is organized." (looks condensed by the extractor; verify.)
- Source: https://kpmglawus.com/us/en/articles/2026-kpmg-global-general-counsel-outlook.html

**CLOC, Oyango Snell blog "Legal Ops in 2026: Signals from London, New York, and Beyond"** (2026-03-10): ops professionals now influence executive decision-making by presenting operational metrics (cycle time, risk exposure, outside counsel spend) that connect legal activity to business outcomes; legal professionals becoming "stewards of trust" in the AI era; people-and-process first, technology second.
- Source: https://cloc.org/blog/cloc-global/legal-ops-in-2026-signals-from-london-new-york-and-beyond/

**Practitioner viewpoint - Gio DiLuca, Senior Director of Legal Operations, Lowe's** (ACC Corporate Counsel Now, 2026-03-03), "10 Ways Legal Ops Has Evolved": process owner -> strategic business partner; tool implementation -> platform architecture; cost manager -> value and data leader; departmental role -> enterprise integrator; vendor management -> ecosystem orchestration; tactical communicator -> executive storyteller; innovator -> AI governance steward.
- Quotes (EXTRACTED): "Five years ago, the Head of Legal Operations role was largely defined by efficiency." / "Legal Ops has become both an innovation catalyst and a compliance steward."
- Source: https://corporatecounselnow.com/10-ways-legal-ops-has-evolved-meet-future-corporate-law

**EY Law 2025 General Counsel Study** (1,000 GCs/CLOs, US$1B+ revenue, 21 countries; fieldwork Nov 2024-Mar 2025; published 2025-04): 83% expect budget increases while 87% say cost reduction is a top priority; only 11% did stakeholder interviews in the last 12 months; only 20% have a continuous feedback cycle for operating-model improvement; 60% plan to increase ALSP usage (per secondary blog headline). From search snippets only - not fetched.
- Source: https://www.ey.com/en_gl/newsroom/2025/04/ey-law-study-reveals-disruptors-prompting-the-evolution-of-legal-departments-and-the-key-barriers-to-change (2025-04)

---

## Theme 3. Legal ops taking ownership of AI governance, AI enablement, knowledge curation; new titles and team structures

**Governance is now near-universal; scaling is not.**
- CLOC/Harbor: 85% have a dedicated AI resource or committee (2025-12 / 2026-03).
- CLOC Global Institute 2026 (Chicago, May 11-14, 2026; theme "Stronger by Design"; ~2,400 attendees, 26+ countries, 90+ sessions). Program themes: AI training and governance, resource optimization and spend management, career pathways, skills development, organizational design. CLOC described legal ops as "the strategic architecture behind the modern legal department."
  - Quote (2-source match: Legal IT Insider + search snippet), Oyango Snell: "The AI conversation has matured. Teams are now sharing what has worked, what broke, and how they are governing it."
  - Quote (2-source match: Lexpert + CCBJ), Snell: "Legal operations leaders aren't waiting for permission anymore. They're building, proving, and leading."
  - CLOC Compass launched at CGI 2026: interactive maturity self-assessment built with Neota Logic on the CLOC Core 12 framework; positioned as a readiness check before AI implementation.
  - Legal IT Insider's read (Toby Weston, 2026-05-15, "A Market in Transition"): vendors (Mitratech, Bloomberg Law, NetDocuments named) are competing to be the "operating system" for the legal department; embedded AI + workflow integration is the battleground; the open question is whether departments have the organizational readiness to use what they already own.
  - Sources: https://legaltechnology.com/cloc-global-institute-2026-a-market-in-transition/ (2026-05-15); https://www.lexpert.ca/news/in-house-lawyer/legal-operations-evolving-role-the-central-theme-of-2026-cloc-global-institute/394253 (2026-05-21); https://ccbjournal.com/news/cloc-2026-2-300-leaders-gather-as-legal-ops-claims-strategic-seat (2026-05, date not shown)
- Axiom 2026 Legal AI Survey (press release 2026-07-09; 528 in-house legal leaders incl. CLOs/GCs/DGCs/legal ops; six countries; fielded by InsightDynamo; 77% from $1B+ companies): only 7% have scaled AI beyond pilots into use/optimize/measure; 83% cannot show whether last year's AI spend paid off; 66% run general-purpose AI in default configuration; 100% of current AI users plan to spend more; 98% of AI users want outside guidance on tool selection.
  - Quote (EXTRACTED), Chris Frickland, VP AI Solutions, Axiom: "The technology is not the hard part. The layer around it is where value either shows up or it doesn't."
  - Note Axiom's own title: Sara Morgan, "Chief Legal AI and Talent Officer."
  - Source: https://www.axiomlaw.com/resources/press-releases/legal-ai-is-everywhere-but-only-7-of-legal-teams-have-made-it-work (2026-07-09, vendor/ALSP)
- FTI Consulting + Relativity General Counsel Report 2026, Part 2 (2026-03-11): GenAI use in legal teams 87% vs 44% in 2025; formal technology roadmap at all-time high 53% (from 25%); 39% name AI a strategic priority; ~70% plan new tech investment in next 12 months. (Search-snippet level; release not fetched.)
  - Source: https://www.globenewswire.com/news-release/2026/03/11/3253654/0/en/AI-Adoption-in-Corporate-Legal-Departments-Doubles-According-to-The-General-Counsel-Report.html (2026-03-11)
- Deloitte UK "The AI Imperative: Reshaping of the Legal Industry" (press release 2026-07-09; 121 senior legal leaders incl. legal ops directors; surveyed Apr-May 2026): 61% in deployment phases, 10% fully embedded; 2% no adoption (vs 76% in 2024); 61% experimenting with/piloting agentic AI; 79% raised AI investment, average budget increase 67%; **84% have not yet redesigned roles around AI**; 96% say tech/AI literacy will grow in importance; legal work expected to be saved/automated in 2-3 years: 28% average. ~3/4 expect department size to stay the same; 20% expect to shrink (up from 10% in 2024) (Bloomberg Law snippet).
  - Quote (EXTRACTED), Tom Brunt, Partner, Deloitte Legal: "AI is rapidly shifting from a productivity tool to a structural force in the legal sector."
  - Source: https://www.deloitte.com/uk/en/about/press-room/ai-set-to-reshape-legal-work-law-firm-pricing-and-legal-careers.html (2026-07-09, primary)

**Who actually owns AI in the department? Evidence is mixed.**
- Blickstein Group / FTI Consulting 18th annual Law Department Operations Survey (2025; reported by Legal.io 2025-12-19 citing Legaltech News; 68 mostly North American companies): fewer than 40% of legal ops respondents have responsibility for selecting AI legal assistants; >90% name efficiency/performance as the primary AI driver vs 57.7% cost savings; about two-thirds can show non-financial benefits, only about one-third measurable cost savings. SECONDARY source - full Blickstein PDF not retrieved.
  - Source: https://www.legal.io/blog/5770721/In-house-Legal-Teams-Pull-Ahead-Of-Law-Firms-On-Generative-AI-Adoption (2025-12-19)
  - Primary landing pages: https://blicksteingroup.com/resources/2025-ldo-survey-report-2/ ; https://www.wolterskluwer.com/en/expert-insights/report-2025-blickstein-group-law-department-operations-survey (403)
- TR LDO Index: 45% of "legal ops" respondents are GCs doing the job on the side. So "legal ops owns AI governance" is true in mature large departments (CLOC's base: $13B median revenue) and much less true in the mid-market.

**New titles and team structures.**
- Law360 Pulse, "AI Boom Gives Rise To In-House Legal Engineers" (Anna Scott Farrell, 2026-06-08): in-house legal engineer roles appearing (examples: John Deere legal ops; an unnamed large pharma sought a legal engineer for its legal ops team).
  - Quote (EXTRACTED), Elly Meenan, founder, The Legal Ops Job Board: "From what I see, the legal engineer is already in-house. We just haven't seen the title, salary shift yet." And: "You map it, you build it, you own it."
  - Quote (EXTRACTED), Mary O'Carroll (ex-Google legal ops head, former CLOC president; now LegalEng): "With these roles that are new and not well understood, it's even more challenging to get headcount approved."
  - Source: https://www.law360.com/pulse/articles/2487125/ai-boom-gives-rise-to-in-house-legal-engineers (2026-06-08)
- Deloitte US 2026 Predictions for CLOs (VERIFIED-TEXT): "Roles not traditionally found in corporate legal departments are expected to become more common. Examples include project managers, data scientists, and technology specialists." Also predicts CLO-CIO collaboration becomes crucial, "skill expiration" accelerates, and CLOs "will begin to pursue strategies to establish centralized data repositories" (the knowledge/data curation point).
- Eudia CEO Omar Haroun (Artificial Lawyer, 2026-01-14) cites a customer who was "promoted to head of AI" after a deployment - anecdotal evidence of legal staff moving into enterprise AI roles.
- Law-firm-side mirror: Ropes & Gray named Gretchen Greene first chief of AI strategy (search snippet; not fetched). Aggregator claim "78% of Am Law 200 firms have created at least one AI-focused position" and "LinkedIn legal AI postings up 340% Jan 2024-Jan 2026" came from low-quality aggregator pages (legalaiinsights.com / aivortex.io) - DO NOT USE without a primary source.
- Combined "Chief of Staff & Head of Legal Operations" titles are visible in live postings (Okta, Chime, Dimensional Fund Advisors) per search results - anecdotal.

**Knowledge curation.** Direct survey evidence that legal ops "owns knowledge curation" was NOT found. Indirect: Deloitte's centralized-data-repository prediction; Axiom's 66% running AI in default config (i.e., not grounded in department knowledge/playbooks); Checkbox's "institutional knowledge capture" via attorney corrections; Snell's note that AI is embedded in "contract review, knowledge management, and risk analysis." Ironically, Baker McKenzie's Feb 2026 cuts hit know-how/research staff (see Theme 4).

---

## Theme 4. Changing expectations of outside counsel

**Expectation vs realized savings - the central tension.**
- ACC/Everlaw "GenAI's Growing Strategic Value for Corporate Law Departments" (released 2025-10-14; 657 in-house professionals, 30 countries; fieldwork 2025-06-18 to 07-18): GenAI active use 52% vs 23% in 2024; 64% expect reduced reliance on outside counsel (58% in 2024); 50% expect lower outside counsel costs (46%); planned insourcing: drafting 78%, contract management 71%, research 62%; 61% plan to push for service/pricing changes; only 24% satisfied with law firm GenAI adoption; policy bans on GenAI fell to 9% from 29%. 59% have seen "no noticeable savings yet" from firms' AI use; 24% "very likely" to push for change to billable hour; 60% unaware whether firms use GenAI on their matters (NatLawReview secondary).
  - Quote (EXTRACTED, Bloomberg Law), Weston Wicks, Gartner: "Law firms don't know how to charge clients for using AI tools" (first clause of a longer sentence).
  - Quote (EXTRACTED), Veta T. Richardson, then ACC President/CEO: "Clients have a lot more options now in terms of how they assure that the services their organizations need are provided."
  - Sources: https://www.everlaw.com/press/release/acc-report-2025/ (2025-10-14, primary release); https://news.bloomberglaw.com/in-house-counsel/ai-does-little-to-reduce-law-firm-billable-hours-survey-shows (2025-10-14); https://molawyersmedia.com/missouriinhouse/2026/04/30/survey-gcs-not-seeing-savings-from-outside-counsels-use-of-ai/ (2026-04-30)
- Blickstein/FTI LDO Survey 2025 (secondary via Legal.io 2025-12-19): legal research GenAI use 72.3% in-house vs 23.4% at their outside firms; 93.8% say AI will enable more work in-house; 87.5% expect reduced law firm spend; but fewer than one in five have pressed firms to show AI-driven savings; about two-thirds report ALSP spend declined.
  - Quote (EXTRACTED; attributed via Legaltech News), Brad Blickstein: "Many law departments lack a clear strategy for what they want firms to deliver using AI." (may be paraphrase - verify)
- Axiom 2026 Legal AI Survey (2026-07-09): 92% of in-house teams expect or negotiate AI-related rate cuts from outside counsel; for AI-enabled work 52% prefer ALSPs vs 24% law firms.
- Juro State of In-House 2026: 79% say clients should pay less if AI makes firms faster; 84% have seen no fee/hour reductions; 11% report fees increased; 72% believe firms keep all/most AI savings; only 7% say their firms openly adopted AI, 38.6% believe firms use it without disclosing; 44% confident they could manage legal risk with a 50% cut in external spend. (Vendor, small sample, EMEA-heavy.)
- KPMG 2026 GC Outlook: 82% expect law firms to explain AI usage clearly; 67% expect greater focus on technology-enabled services.
- Fulkerson Advisors study (2026-09-16): of 1,054 publicly findable outside counsel guidelines (dated Dec 2022+), only 20 (2%) mention AI. Of the 20: 12 require disclosure, 9 keep client data out of public tools, 8 require lawyer review, 9 change billing, 3 require prior approval, 1 bans. Named: Microsoft (2024), Zscaler (2025), UBS, The Hartford, FDIC (2026). Zscaler exact clause per extractor: "Any time and cost associated with AI-generated work product shall not be passed on to Zscaler". Small consultancy, open-web sample (biased toward public bodies) - but the only hard count found.
  - Source: https://www.fulkersonadvisors.com/research/ai-in-outside-counsel-guidelines (2026-09-16)
- Law.com Corporate Counsel (Amit Dungarani, 2026-01-06, paywalled): "Legal departments are becoming more demanding in their expectations around the use of artificial intelligence (AI)." Argues legal ops needs a structured framework to test firm AI claims. https://www.law.com/corpcounsel/2026/01/06/how-legal-operations-can-evaluate-outside-counsel-in-the-age-of-ai/

**Pricing and AFAs.**
- Deloitte UK (2026-07-09): 85% believe AI will change law firm pricing models; respondents expect hourly-rate work to fall from 72% to 44% of external work within 2-3 years; 78% cite cost reduction as leading benefit expected from external providers' AI.
- Reality check: TR LDO Index 2025 - AFAs ~20% of matters for a decade; expansion is "largely a discussion rather than a plan of action". Harbor: 76% of departments use AFAs at all (up from 70%) - usage breadth, not share of spend. Search snippet (Best Law Firms/PERSUIT): ~90% of legal spend still billed hourly - not verified.
- Gartner (2025-12-17 press release, title only; blocked): "Only 20% of Legal Matters Sent to Outside Counsel Stay Within Budget Range." https://www.gartner.com/en/newsroom/press-releases/2025-12-17-gartner-survey-reveals-only-20-percent-of-legal-matters-to-outside-counsel-stay-within-budget-range

**Panel consolidation vs panel dissolution - two opposed readings.**
- Consolidation: ACC/MLA 2025 Law Department Management Benchmarking Report (2025-06-17; 395 departments, 23 industries, 34 countries): median number of law firms used fell from 14 to 10 in a year; ALSP use rising esp. at $1B+ companies (search-snippet level; ACC PDF at https://www.acc.com/sites/default/files/2025-06/ACC_2025_Law_Department_Management_Benchmarking_Report.pdf not fetched). Harbor: 61% completed/implementing convergence programs (up from 50%).
- Dissolution: Axiom's Daniel Hayter (MD & VP, Axiom Europe; 2026-06): "Law firm panels are not only irrelevant, they also hamper cost effectiveness and productivity." Argues for a dynamic per-matter decision on "the right combination of talent, technology, and price". Interested party (ALSP). https://www.axiomlaw.com/blog/the-era-of-the-law-firm-panel-is-ending
- TR LDO: formal panels rare (16%), informal preferred lists growing; AFAs and technology are top selection criteria.

**Insourcing.**
- Axiom 2026 GC Survey Report (2026-02-10; 516 global GCs per Axiom's later blog): 80% plan to move significant law firm work in-house or to ALSPs within 24 months (55% will move 10-25%; 43% will move 26-50%); 66% got budget increases averaging 12% yet 90% face efficiency pressure; 61% send work to firms out of habit; ALSP "extreme satisfaction" 25% vs 8% for law firms. https://www.axiomlaw.com/resources/articles/gc-survey-report
- Harbor: 65% made intentional efforts to keep work in-house. TR LDO: 46% expect more work in-house. ACC/Everlaw: 64%. Juro: 47% think 11-25% of outsourced work could come in-house.
- Counter: ACC CLO 2026 - outside counsel use for regulatory surges rose to 48%. TR State of CLD 2026 - 36% still expect to raise outside spend vs 20% decrease.

**Law firms restructuring roles.**
- Baker McKenzie (announced ~2026-02-11): cutting up to ~10% of global business services staff (reported 600-1,000 roles) across know-how, research, marketing, secretarial, offshore centers, citing AI in part; closed Tampa back-office site (Above the Law, 2026-03). ABA Journal experts cautioned AI is not the only driver. Sources: https://abovethelaw.com/2026/02/baker-mckenzie-blamed-ai-for-massive-layoff-but-the-problem-is-much-more-complicated/ ; https://www.abajournal.com/news/article/could-biglaw-blame-ai-for-staffing-cuts-experts-weigh-in ; https://news.bloomberglaw.com/business-and-practice/wake-up-call-hundreds-laid-off-at-baker-mckenzie-as-ai-grows (search-snippet level; not fetched)
- Associate pyramid: Axios 2026-05-02 "AI threatens Big Law's talent pipeline"; Forbes (Joseph Andrew) 2026-06-19 "The Collapse Of The Pyramid"; Lawyer Monthly 2026-01. All 403 or unfetched - cite only as "commentary exists"; no hard hiring statistics were verified.
- Artificial Lawyer guest piece (Daniel Lewis, LegalOn CEO, 2026-05-12): "If an associate uses AI to finish a five-hour task in one hour, the firm has effectively reduced revenue by 80%." - incentive argument for why in-house, not firms, will lead productivity gains. Vendor viewpoint. https://www.artificiallawyer.com/2026/05/12/legal-ais-next-act-is-in-house-productivity/
- Deloitte US predictions (VERIFIED-TEXT): CLOs will look at delivery "through an ecosystem lens versus a purely outside versus inside lens".
- Counter-narrative: Above the Law Sept 2026 headlines "AI ROI For Law Firms: There's Not Any" and "AI Didn't Kill the Billable Hour: Why Law Firms Are Booming" (Best Law Firms) - firm revenues remain strong; not fetched.

---

## Theme 5. New legal service delivery models

**ALSPs (baseline).** Thomson Reuters Institute / Georgetown / Oxford Saïd ALSP 2025 Report (2025-01-28): market US$28.5B; 18% CAGR 2021-2023; law-firm captive/affiliate ALSPs only $1.8B of that; 57% of corporate law departments use ALSPs; 40% of corporate respondents find GenAI-leading ALSPs more attractive; "emerging market bifurcation." IBA article adds: 44% of legal departments buy from independent ALSPs, 33% use law firm affiliate ALSPs. (Older than the 2025-26 window's core but still the latest biennial edition found; a 2027 edition would be next.)
- Source: https://www.thomsonreuters.com/en/press-releases/2025/january/alternative-legal-services-providers-2025-report-shows-segment-comprises-28-billion-of-the-legal-market (2025-01)
- Mixed signal: Blickstein 2025 - about two-thirds report ALSP spend declined (possibly AI substituting for ALSP labor), while Axiom 2026 says 52% prefer ALSPs for AI-enabled work and EY 2025 says 60% plan to increase ALSP use.

**AI-native law firms.**
- IBA, "The AI-native law firm: regulatory innovation and the fundamental restructuring of legal service delivery" (Shreya Vajpei, ILTN; Saranya Mishra, Khaitan & Co; 2025-12-11): Norm Ai/Norm Law ($140M+ total funding; Blackstone-backed Nov 2025; "the first AI-native full-service law firm for global institutional clients"; 35+ lawyers as "legal engineers"); Crosby (seed $5.8M Sequoia/Bain; 58-minute median contract turnaround); Covenant ($4M seed; LPA reviews at $900/document, ~90% below traditional pricing); Lawhive (acquired Woodstock Legal Services Sept 2025); Garfield.Law approved by UK SRA May 2025 as first AI-driven firm; Arizona ABS program enabling Eudia Counsel (also KPMG, Axiom, LegalZoom, Elevate hold ABS licences). https://www.ibanet.org/AI-native-law-firm-regulatory-innovation-and-fundamental-restructuring-of-legal-service-delivery
- Crosby Series B US$60M (Lux Capital, Index Ventures; ~2026-04-01); claims >$1B in contracts negotiated (LegalTech.ca snippet; not fetched). https://legaltech.ca/2026/04/01/ai-law-firm-crosby-raises-60m-series-b/
- Artificial Lawyer, "How Do AI-Native Law Firms Work?" (Richard Tromans interview with JP Mohler, General Legal; 2026-03-31): fixed price $500 per standard contract review, $250 for NDAs/under 3 pages; 2.2-hour turnaround vs 8-10 hours; 40-50% margins; hires only experienced lawyers (5-8 yrs Big Law or 10-15 in-house), no juniors. Quote (EXTRACTED): "as soon as a document comes in, the first set of eyes on that document is not a lawyer. It's an AI." https://www.artificiallawyer.com/2026/03/31/how-do-ai-native-law-firms-work/
- Eudia (Artificial Lawyer interview with CEO Omar Haroun, 2026-01-14): AI platform + ALSP (Johnson Hana, acquired) + Arizona ABS law firm (Eudia Counsel) + Out-House acquisition; $105M Series A led by General Catalyst (2025); >$20M ARR by Dec 2025; fixed-fee/outcome-based; claimed outcomes incl. 20% cut in outside counsel bills. Quote (EXTRACTED): "the needs of in-house teams are not only different, but often at odds with the needs of law firms." https://www.artificiallawyer.com/2026/01/14/market-disruptor-eudias-2026-strategy/
- Skeptic headline: Global Legal Post - "'A fancy deck and a round of funding doesn't make a law firm'" (not fetched, 403). https://www.globallegalpost.com/news/a-fancy-deck-and-a-round-of-funding-doesnt-make-a-law-firm-708945371

**Law firm restructuring for outside capital (MSO model).**
- ABA Journal (John Roemer, 2026-02-10): McDermott Will & Schulte confirmed preliminary talks on outside investment via a two-entity structure (lawyer-owned firm + investor-owned managed services organization). Quote (EXTRACTED), Stephen Gillers, NYU Law: "if an innovation will benefit enough lawyers and clients, the money will find a way." Lucian Pera (Adams & Reese): properly structured MSO does not trigger fee-sharing prohibitions. https://www.abajournal.com/web/article/mcdermott-will-schultes-private-equity-plan-could-test-longstanding-prohibitions-on-outside-funding-for-law-firms
- Search snippet (LawFuel, 2026): May 2026 Massumi + Consoli sold back-office stake to Trive Capital; Morgan & Morgan exploring outside capital with JPMorgan - not fetched; verify before use.

**Managed services.** KPMG 2026 GC Outlook: legal teams seek managed-services support for high-volume work to free internal capacity for strategic matters. Deloitte: "ecosystem lens." No 2026 managed-services market-size figure found.

---

## Distinct viewpoints (for the article's "who says what")

1. **CLOC / Harbor (association + consultancy):** structural productivity gap; outside counsel is no longer the pressure valve; legal ops is "the strategic architecture" / "the engine"; AI conversation has matured to governance.
2. **ACC:** the CLO is now a business executive (84% report to CEO), mandated to lead AI transformation but resource-starved; roles evolve rather than headcount shrinking; outside counsel still the regulatory pressure valve.
3. **Thomson Reuters Institute:** the strategic GC is self-assessed - the C-suite doesn't see it (86% vs 17%); legal ops must produce outcome evidence; AFAs and panels have barely moved in a decade despite the talk.
4. **Gartner (Weston Wicks):** the future is self-service and AI intake (60% of departments by 2029; half of requests answered without humans); neither firms nor clients know how to price AI.
5. **Deloitte:** AI is "a structural force"; hourly billing expected to fall from 72% to 44%; 84% haven't redesigned roles; ecosystem lens; risk evaluation should move "closer to where business occurs".
6. **Blickstein (Brad Blickstein):** departments are ahead of their firms on AI but have no strategy for what to demand from firms; <20% have pressed for savings.
7. **Axiom (ALSP, interested party):** panels are obsolete; 80% will move work away from firms; only 7% have made AI work - the wrapper (process, people, measurement) is the hard part.
8. **Legal AI vendors (LegalOn's Daniel Lewis; Eudia's Omar Haroun):** incentives mean in-house, not law firms, is where AI productivity lands; in-house and law-firm interests are "at odds."
9. **AI-native firms (General Legal, Crosby, Norm Law, Covenant):** AI-first review, fixed fees, senior-only lawyers, no junior pyramid.
10. **Skeptics:** Above the Law / ABA Journal experts - AI is a convenient label for ordinary cost-cutting (Baker McKenzie); firm revenue is still booming; Forrester via NatLawReview - 25% of planned AI spend deferred to 2027, only 15% saw EBITDA lift. Mary O'Carroll - new legal-engineering roles are hard to get headcount for.
11. **Practitioner (Gio DiLuca, Lowe's):** head of legal ops has moved from efficiency to ecosystem orchestration, executive storytelling, and AI governance stewardship.

---

## Gaps

- No neutral adoption statistic for legal front door / intake portals / NDA self-service in 2025-26 (only Gartner's 2029 prediction and vendor surveys).
- Could not open the CLOC 2026 State of the Industry full report (gated); only press release, CLOC blog and trade coverage. No CLOC data on legal ops team size, reporting line, or who owns AI governance.
- CLOC Global Institute 2026 session-level content (titles, speakers) and detail on CLOC Compass beyond launch facts not retrieved.
- Gartner primary pages all 403; Gartner statistics are from secondary reprints of the press release. "Predicts 2026: AI and Agentic AI Will Enable Legal Self-Service" content is paywalled.
- ACC full CLO 2026 report (gated) not read; the 62%-strategic-input figure comes from a Substack. ACC 2025/2026 Law Department Management Benchmarking PDF not opened (14 -> 10 firms figure is from search snippet). No 2026 edition of the benchmarking report confirmed. ACC Legal Operations Maturity Model: nothing new found.
- Blickstein 2025 LDO Survey: full report not retrieved; all figures secondary (Legal.io citing Legaltech News).
- EY Law GC Study: only the 2025 edition (April 2025) found; no 2026 edition found. Figures from search snippets.
- No hard data on law firm associate hiring-class reductions or partner-role restructuring; only commentary (Axios, Forbes, Lawyer Monthly - not fetchable).
- No survey evidence that legal ops specifically owns knowledge curation; only indirect signals.
- No current managed-services or law-firm-subsidiary market sizing for 2026; latest ALSP sizing is TR's Jan 2025 report.
- Several quotes are EXTRACTED via a summarizer and need verbatim re-check before publication (flagged inline).
