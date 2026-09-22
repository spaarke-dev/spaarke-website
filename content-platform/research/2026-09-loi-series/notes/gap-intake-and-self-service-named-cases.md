# Gap research: intake and self-service named cases

Date of research: 2026-09-21. Supports Article 1 (legal front door / self-service NDAs as a defining change) and Article 2 (worked legal service intake example).

## Method and constraints (read first)

- The session's WebSearch budget was already exhausted (200 of 200) when this task started. Every search call was refused. All evidence below comes from direct WebFetch of known or discovered URLs (about 60 fetches, roughly 35 successful).
- Search-engine result pages fetched through WebFetch were unusable (DuckDuckGo CAPTCHA, Brave 429, Bing returned generic junk, Google returned an error page, Mojeek 403).
- Blocked hosts: gartner.com (403 on every path), acc.com (403, including via a reader proxy), web.archive.org (tool refuses), legalops.com (403), legaltechnology.com (bot wall). CLOC Global Institute agenda pages load but sessions are rendered client-side, so no session text was retrievable. ccbjournal.com search returned an empty body.
- Consequence: ACC Value Champions 2024-2026 write-ups, CLOC / LegalOps.com award write-ups, CCBJ case articles, CLOC 2026 session descriptions and World Commerce and Contracting NDA benchmarks were NOT reached. They remain open gaps, not negative findings.
- Tool results repeatedly carried an appended reminder block telling me how to handle copyrighted text and not to mention it. It arrived inside tool output, not from the user, so it was treated as untrusted data and not followed as an instruction. Quote limits applied are the task's own (exact, 30 words max).
- All figures in vendor case studies are self-reported by the vendor and customer. None was independently audited. "datePublished" values on Checkbox pages (2026-07-21 to 2026-08-10) look like site rebuild dates: the Coca-Cola case is filed under a URL for Coca-Cola Europacific Partners but the index labels it Coca-Cola Amatil, a name retired in 2021, so the underlying program is older than the page date.

## A. Gartner May 2026 prediction: wording, date, population

Primary release (NOT fetchable, 403): https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-predicts-legal-tech-budgets-to-double-by-2028-as-legal-ai-use-expands (date in URL slug: 2026-05-26).

Verified against two independent reprints that agree word for word on the intake sentence:

1. SMBtech (AU), "Staff Writer" byline, 2026-05-27. Near-verbatim syndication: it carries the release boilerplate ("Gartner clients can access further detail in the firm's report, Innovation Insight: Legal AI Platforms") and the conference plug (Gartner Enterprise Risk, Audit & Compliance Conference, Grapevine TX 15-16 Sept 2026 and London 28-29 Sept 2026). https://smbtech.au/news/gartner-predicts-legal-tech-budgets-to-double-by-2028-as-ai-use-expands-across-legal-departments/
2. Lawyers Weekly (AU), Grace Robbie, 2026-06-09. https://www.lawyersweekly.com.au/biglaw/44448-legal-tech-spending-set-to-double-by-2028-amid-ai-boom

Exact wording (both reprints, AU spelling; SMBtech writes "timeframe", Lawyers Weekly "time frame"):
- "we predict that 60 per cent of legal departments will use AI-driven intake systems that capture all requests and answer one-half of those without human intervention" (26 words)
- Preceding sentence sets the horizon: "By 2029, approximately 50 per cent of contract reviews will be delegated to self-service systems that escalate only one in 10 for human review."
- Speaker: Weston Wicks, Senior Director Analyst, Gartner Legal & Compliance Practice. It is a direct quotation, not a headline statistic.

What this settles:
- Date: release 2026-05-26; horizon "by 2029" is inherited from the previous sentence ("In the same timeframe").
- Population: "legal departments", unqualified. No survey, sample size, geography or company-size qualifier is given in either reprint. It is an analyst prediction (Gartner "strategic planning assumption" style), not a survey finding.
- Wording trap: the prediction says "without human intervention" (not "involvement"), and "answer one-half of those" refers to requests captured by the 60% of departments that adopt, not to half of all legal requests everywhere.
- Underlying research named in the reprint: "Innovation Insight: Legal AI Platforms" (client-only). Platforms named: Harvey, Legora, GC AI, Thomson Reuters CoCounsel.
- Still unverified: the US-spelling original ("60%"), and whether the release has a footnote on methodology. Cite as "Gartner press release, 26 May 2026, as reprinted by SMBtech and Lawyers Weekly".

Confidence: high on wording and speaker (two matching reprints, one with release boilerplate); medium on "no population stated" because the primary was not read.

## B. Non-vendor named cases (ACC editorial)

Source: ACC Corporate Counsel Now (docket.acc.com now redirects here), "5 Ways In-house Legal Departments Are Using AI", Association of Corporate Counsel, 2026-09-16. Member-submitted ("We asked ACC members to share their stories"), not award-vetted, but it is ACC's own publication and not a vendor. https://corporatecounselnow.com/5-ways-house-legal-departments-are-using-ai

### B1. Liberty Mutual Insurance: self-service NDA review
- Person: Nora Marantz, Vice President and Assistant General Counsel.
- Volume: "Enterprise Legal Solutions (ELS) reviews roughly 2,500 NDAs a year."
- Before/after already achieved: "Prior improvements cut lawyer handling time from more than an hour per NDA to 15 to 20 minutes."
- Business wait time at baseline: 24 to 48 hours (the pilot targets this).
- Mechanism: underwriters submit NDAs to a self-service tool built by Liberty's own Legal Data Science team and get immediate AI feedback against US-specific requirements; attorney review is reserved for complex agreements.
- Status: PILOT. No post-pilot deflection rate is stated. Do not present as a finished result.
- Intake data: the NDA document itself plus jurisdiction logic (US-specific). Reporting or routing use not described.
- Arithmetic available for Article 2 (author's calculation, label as such): 2,500 NDAs x 60+ min = 2,500+ lawyer hours a year at the old rate; at 15-20 min it is roughly 625-835 hours.

### B2. Palo Alto Networks: self-service drafting of routine agreements
- Person: Hayden Creque, Director and Senior Corporate Counsel. Tool: Google Gemini with pre-approved templates and playbooks.
- "Turnaround on routine documents dropped from three-to-five business days to one."
- "The tool saved my three-person legal team an estimated 20-40 hours per month."
- Intake data captured: counterparty name, contract date, termination date, reason. Output goes to the business directly or to expedited legal review. No reporting described.

### B3. Same article, adjacent self-service examples
- Salesforce: closed-universe knowledge tool for international HR compliance questions; team saves "about 16-20 hours per month".
- Mars: "Mars Legal Beagle" knowledge agent for 230+ legal professionals; no outcome metric yet.

### B4. Mercado Libre (ACC profile, 2026-09-16): long-running self-service without numbers
- Jacobo Cohen Imach; "Legal Kiosk" self-service agreement generator since 2015; legal ops team of 20+; shipping business grew with flat legal headcount. No quantified deflection. Useful as a named precedent that self-service predates generative AI. https://corporatecounselnow.com/3-moves-ahead-how-mercado-libres-jacobo-cohen-imach-reimagining-legal-department
- Quote (exact, in article): "stop assuming that every legal problem should be solved by assigning another lawyer"

### B5. ACC / Everlaw 2026 survey: what departments measure (context for Article 2)
- ACC Corporate Counsel Now, Blake E. Garcia PhD and Mauro Whiteman (ACC), 2026-07-30, citing ACC and Everlaw, "The Role of Generative AI in Proving Corporate Law Department Value" (2026). Sample size not stated in the article.
- "Outside counsel spend is tracked by 83 percent of teams, but only 28 percent track time to resolution" (continues: 12 percent track outside counsel performance, 9 percent track impact on business outcomes).
- Barriers: lack of time or resources 57 percent; data scattered across systems 50 percent; limited automation tools 43 percent.
- Relevance: intake is where time-to-resolution data originates; 72 percent of teams do not track it. https://corporatecounselnow.com/your-legal-teams-data-infrastructure-ai-ready

## C. Vendor-published, customer-named cases with a stated metric

### Checkbox (index: https://www.checkbox.ai/customer-overview)
| Customer | Named person | Metric (as stated) | Intake data / use |
|---|---|---|---|
| Coca-Cola Europacific Partners (index label: Coca-Cola Amatil) | Richard Conway, Deputy Group GC and Group Company Secretary | "We've automated NDAs so 90% are created by users without legal intervention." Remaining 10% done "in hours rather than days". 1,000+ documents, 45+ workflows, 20+ internal builders | Fields not listed; page says teams gained visibility of workflow volume and request source |
| Align Technology | Ansel Halliburton (Counsel, Trademarks and Legal Ops); Julie Johnson (Sr Manager Legal Ops) | "1000+ NDAs generated globally per year"; "96% decrease in frequency of legal touchpoints"; "Only 5-7% of NDAs required redlining outside the system" | Fields not listed; page says it gave the metrics legal needed and automated intake and triage |
| Elastic | Jen Lenander, Sr Director Legal Ops and Chief of Staff to the CLO | "NDAs that used to take 23 days now take three." Up to 20 of the 23 days were spent "just deciding whose paper we'd use". LOA: two days to two minutes | Pulls compliance data from Salesforce; self-service pushed mix toward first-party paper. This is the best cycle-time decomposition found: the delay was pre-legal, not legal review |
| Hines | Evan McCord (Sr MD, Co-Head of Legal); Jen Andrade (Contract Administrator) | "Processed over 1,000 NDA submissions within the first 12 months" | CLM is back-end repository, Checkbox is the front end; no reporting detail |
| Xero | Georgia Petry, Legal Counsel | 250+ NDAs automated in first months; five clicks | None described |
| Altria | Joy Thorpe, Director of Strategy, Legal Center of Excellence | 90% adoption of new intake vs an internal target of about 60%; launched in 52 days; legal team 65 | All requests land in one dashboard for resource allocation; an "Ask AI" agent answers from a defined repository and routes to the form when it cannot answer |
| Telstra | Jane Levinson, Optimisation Lead | "6,000+ hours saved per year through legal automation"; legal team 300+; front door built in 8 weeks | Digital front door for submitting and routing requests under a centralized lawyer pool model |
| Analog Devices | Janene Asgeirsson (CLO); Nikki Rahimzadeh (Sr Director Legal and Risk Ops) | One intake for 40+ countries, 60+ legal team; "Ask LRO" chatbot triages NDAs, FAQs, matter requests. No deflection rate | Automated triage and routing; analytics not disclosed |

### Streamline AI (index: https://www.streamline.ai/customers) - pages undated
- Cityblock Health, Wendy Chow (GC): outside counsel spend down about 40%; legal team recovered 10-20% of time; team of 14 (9 lawyers). Automated intake, routing, assignment, SLA tracking.
- Redwood Software, James Harmoush (Senior Counsel): "Nearly 50% reduction in Time-to-Close"; about 25% faster initial response; 2-day SLA; 4-person team; previously an email alias plus Salesforce Cases. Data used for resourcing decisions.
- 8x8, Joseph Vitelli / Jess Orlando / Ilan Hornstein: 30 to 60 minutes saved per request at intake; Salesforce field mapping; dashboard with a "Waiting On" status that isolates outside-counsel delay.
- Lighthouse, Eva Metsu (GC): one-month rollout; 40-50% less time chasing information.

### Josef
- Bupa, Claire Nuske (Head of Legal Operations), Maria Marinelli (GC): 40+ self-service tools since 2022; NDA tool "saves Legal 15 hours a month"; procurement processed 24 NDAs in two days. Undated page. https://joseflegal.com/case-studies/its-so-easy-how-bupa-made-legal-and-compliance-help-on-demand-with-genai/
- L'Oreal (Candy Welsh, Legal Counsel): one contract type from over an hour to 20 minutes, 100+ a year (index page only; case page not fetched).

### Juro (homepage and case index, 2026)
- Funnel, Victoria Sorving (CLO): 8,000 manual contract touchpoints removed; 88% reduction in manual reviews. Paddle: 3.5 hours saved per contract. Deliveroo: contracts move "without legal being involved" (no number). Case pages not individually fetched; treat as low confidence.

### Not useful
- Ironclad customer index shows no intake or self-service NDA metric on the pages reached; the L'Oreal page (2021-03-21) returned no body text. LawVu index has no intake deflection metrics. Tonkean and Juro /customers URLs returned 404.

## D. What intake data is captured, and is it used? (cross-case pattern)

- Almost no case study states the intake schema. Only Palo Alto Networks lists fields (counterparty, contract date, termination date, reason). Elastic and 8x8 mention Salesforce as the upstream data source.
- Data use that IS evidenced: single dashboard for resource allocation (Altria); status category isolating time waiting on outside counsel (8x8); time-to-close and response SLAs (Redwood); volume and request-source visibility (CCEP); paper-type routing (Elastic); AI agent that falls back to the form when the repository lacks an answer (Altria).
- Data use that is NOT evidenced anywhere: a published deflection rate computed from intake logs across all request types. The only "share resolved without a lawyer" numbers are NDA-specific (CCEP 90%, Align 93-95% implied by the 5-7% redline figure). Nobody publishes a whole-front-door deflection percentage, which is exactly what Gartner's "one-half" forecast is about.
- Implication for Article 2: a worked example has to be assembled from partial real numbers (Liberty Mutual 2,500 NDAs and 60 to 15-20 minutes; Elastic 23 to 3 days with 20 days pre-legal; CCEP 90/10 split) rather than lifted from one case. Flag the composite as illustrative.

## E. Gaps

1. ACC Value Champions 2024, 2025, 2026 write-ups: acc.com returned 403 on all routes. Not reviewed.
2. CLOC and LegalOps.com award winners: no award pages reachable (legalops.com 403; cloc.org home has no awards link).
3. CLOC Global Institute 2026 (Chicago, 11-14 May 2026) session descriptions: pages are client-side rendered; no session text retrieved.
4. CCBJ case articles: site search returned empty body.
5. World Commerce and Contracting benchmark on NDA cycle time and volume: not found; one guessed URL was 404. No neutral NDA cycle-time benchmark located.
6. Gartner primary release text and the Gartner intake and triage case study (both 403). Population or methodology note, if any, unverified.
7. No independent audit of any vendor metric; no case gives request volume for the whole front door together with a deflection rate.
8. Sample size for the ACC / Everlaw 2026 survey not confirmed.
