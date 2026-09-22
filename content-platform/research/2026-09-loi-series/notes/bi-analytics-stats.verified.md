# bi-analytics-stats — fact-check notes (2026-09-21)

Method: fetched each source URL directly; PDFs were downloaded and text-extracted locally with pdftotext (extracts in `research/fc/`). WebSearch budget for the session was already exhausted (200/200), so no independent searching was possible; verification relied on the given URLs, URLs in the researcher's notes, and publisher pages. Anything that needed a search to locate is marked unverified.

## 1. TR 2025 LDO Index — spend metrics dominate — CONFIRMED
- PDF p.5 methodology: "conducted in July 2025. There were 128 responses ... across the United States."
- Figure 3: total spend by law firm 62%, by matter type 50%, matters opened/closed 37%, legal spend to revenue 21%, quality of legal outcomes 18%, savings from legal tech 8%, OC evaluation 7%, diversity 6%. Mid-chart labels (cycle time, costs avoided, AI usage, AFA savings, avg matter spend) sit among values 13/13/13/13/12/9/8, so "all under 15%" holds even though exact label-to-value mapping is ambiguous in text extraction.
- Quote exact (p.9): "...corporate legal departments are tracking metrics related nearly exclusively to cost and to a lesser extent, efficiency."
- 47% of GCs "slightly more" or "heavily" focused on service vs 7% on cost: exact (p.7). Note a second, different 47%: GCs who focus *equally* on both. Do not conflate.
- Dates: TR Institute post dated 2025-09-24 (title "Legal Department Operations Index 2025: LDO teams join GCs' quest for value", with Buying Legal Council); analysis article 2025-10-08 by Zach Warren, which says service metrics are "captured by less than 20% of respondent legal departments".

## 2. TR 2025 LDO Index Figure 16 — CONFIRMED
- Legal business intelligence: 16% valuable / 21% underutilized / 19% looking to procure / 33% not important / 11% don't know. 16+21 = 37%.
- E-billing/spend management: 42 / 18 / 16 / 16 / 7 -> 60%.
- Legal workflow automation: 13 / 25 / 25 / 24 / 13 -> 38%.
- 63% legal-ops-background vs 29% GCs use data analytics to identify cost savings: exact (p.11).
- Caveat for prose: TR's own text lists KM, workflow automation, task management, contract AI as the "more underutilized than valuable" examples; legal BI fits the pattern (21 > 16) but TR does not name it in that sentence.

## 3. TR 2026 State of the Corporate Law Department — CORRECTED (attribution of two sub-stats)
- Landing page dated March 24, 2026. PDF: "drawn directly from more than 2,300 interviews with corporate general counsel". TR Legal blog (2026-06-16) says "more than 2,400 GCs worldwide".
- 86% vs 17%, 42% "A little/Not at all": confirmed; TR itself uses the term "visibility gap".
- Technology priority 28% vs 14%: confirmed.
- CORRECTION: the 47% GenAI access figure is cited in the report from TR Institute's *2026 AI in Professional Services Report* (Feb 2026), not from the GC interviews.
- CORRECTION: Figure 15 "Decision-making using analytics" 19% / 39% is "according to data from the Thomson Reuters Future of Professionals Report 2025" (June 2025), reproduced in the 2026 report. It is 2025 cross-profession-survey data about legal departments, not a 2026 GC-interview finding.
- Quote is in the PDF: "This also means that GCs need to institute metrics for success that translate to the rest of the business." (finding's quote drops the lead-in; wording exact).
- "presenting legal spend ... as a percentage of revenue" (landing page) and "the same matter cycle time metrics that outside counsel use can be calculated internally as well" (PDF): confirmed.
- C-suite sample size: not stated, as the finding says.

## 4. ACC 2026 CLO Survey key findings — CONFIRMED (sponsor unverified)
- 1,049 participants, 20 industries, 43 countries; 84% report to CEO; 79% "almost always" attend board meetings; compliance 64%, corporate secretary 62%; 74% proactive strategic counsel; operational efficiency 53%; budget/resource constraints 35%; 36% active GenAI deployment; 47% CEO wants tech/AI proficiency. Quote exact.
- The key-findings PDF does not name a sponsor. "Sponsored by FTI Technology" could not be checked (acc.com HTML pages return 403). Treat sponsor as unverified.
- Date: only the file path (2026-01) dates it.

## 5. ACC/MLA 2026 Benchmarking Report — CONFIRMED
- 576 departments, 45 countries; "survey opened on February 11, 2026, and closed on April 17, 2026"; seventh annual.
- 53% entirely within legal; shared services 29% (25% in 2024); no tech budget 18%. $5B-$20B: 43% from 29%. $20B+: 45%. Quote exact.
- Tech = 3% of total spend (all departments), US$130K median; US$2.5M at $20B+; smallest companies US$65K / 5%.
- 0.43% six-year low (previous high 0.63%); 367 employees per lawyer; 8:1 lawyers per legal ops professional; legal ops 5% since 2022.
- No BI/analytics/intake questions: confirmed by text search (only "dashboard" hit is ACC's own participant dashboard).
- Publication month "June 2026" rests on the file path only.
- REUSE FLAG: the report's copyright notice requires "Reprinted with permission from the Association of Corporate Counsel 2026. All Rights Reserved." on extracts and prohibits uploading into AI tools. Check before quoting at length.

## 6. CLOC 2026 State of the Industry — CONFIRMED
- CLOC release dated March 2, 2026. "135 law departments representing more than 15 industries and organizations with median revenues of $13 billion." "The 2026 findings reveal a structural productivity gap..." Quote is Oyango Snell, CLOC President & CEO.
- 80 / 72 / 62; 85% dedicated AI resource/committee; 37% (58%); 47% (65%); 32% lawyer headcount (Harbor release adds: down from 42%).
- Harbor PRWeb release dated December 8, 2025. No analytics/dashboard/BI/intake content in either release. Field dates not published.

## 7. ACC Legal Operations Maturity Model 2.0 — CONFIRMED (date still unknown)
- All three quoted strings are exact. Advanced stage also lists central data source, predictive analytics, annual review/pressure-testing of metrics.
- Naming: table of contents calls the function "Metrics & Analysis"; the section header is "METRICS & ANALYTICS". Use the section header.
- PDF says only that the original model was published in 2017. Embedded XMP create date (2010) is a template artifact, not a publication date. Version date remains unverified.

## 8. Gartner predictions via Lawyers Weekly — CONFIRMED as trade-press report; Gartner primary UNVERIFIED
- Lawyers Weekly, Grace Robbie, 2026-06-09: quote exact; Weston Wicks, Senior Director Analyst, Gartner Legal and Compliance Practice; contract review "approximately 50 per cent ... escalate only one in 10". "In the same time frame" = 2029.
- The article does not give the Gartner release date. gartner.com returned 403, so "2026-05-26" rests only on the URL slug in the researcher's notes. Cite as "Gartner, reported by Lawyers Weekly, 9 June 2026".
- Second item: Lawyers Weekly 2026-07-28 (Grace Robbie), "56 per cent of legal departments anticipate a headcount freeze or reduction in 2026" — confirmed in the article; quoted analyst Raashi Rastogi. Gartner release date 2026-07-15 not verified.

## 9. Legal.io / Mitratech / WK natural-language positioning — CONFIRMED (attribution added)
- Legal.io release, Chicago, May 11, 2026. "In-house teams don't need another dashboard. They need answers." is said by **Pieter Gunst, CEO**. The "stitching that data together manually" quote is Hannah Konitshek, COO. Both exact.
- Mitratech, Austin, May 11, 2026: ARIES "tracks spend against budget in real time within the matter view, and answers natural-language questions about outside counsel performance".
- WK, Houston, May 5, 2026: "Natural Language controls: Legal teams can interrogate invoices for spend and compliance trends".

## 10. Agents that act — CONFIRMED
- WK quotes exact; speaker Dean Sonderegger, SVP & GM, Wolters Kluwer ELM Solutions. "fully auditable and reversible"; "more than $200 billion in actual legal invoice data".
- Checkbox May 11, 2026: AI Agent Actions "automatically create a fully populated matter ... and kick off the right workflow".
- Streamline AI, Burlingame, May 11, 2026: "orchestrate a system of interconnected AI agents"; Kathy Zhu quote exact.
- Legal IT Insider, Toby Weston, 2026-05-15, "CLOC Global Institute 2026: a market in transition": embedded intelligence, workflow automation, integration as "the new battleground".

## 11. Checkbox cycle time — CONFIRMED
- All quotes exact. Cross-reference to TR LDO holds. Streamline benchmark claims (93.7%) not checked; keep them out.

## 12. Axiom AI report — CONFIRMED for headline; supporting items mixed
- Axiom page, June 29, 2026: "survey of 528 in-house legal leaders across six countries, conducted by InsightDynamo for Axiom in March 2026." 83% "cannot measure whether their AI spending is working"; 7% "have actually scaled AI across the organization." Vendor (ALSP) research.
- TR landing-page line confirmed. FTI/Relativity: release March 11, 2026; 224 survey respondents (summer 2025) + 30 interviews (Sept 2025); 87% vs 44%; roadmap 53% vs 25% — all confirmed.
- Blickstein: 23% "fully operational" and usability-over-security confirmed only via Integreon webinar recap (2026-07-09), a secondary source. Blickstein's own site says "more than 70 companies", not "68-70".
- RLLB "The AI ROI Playbook for Legal Teams" workshop: confirmed on rllb-2026.legalops.com.

## 13. The Legal Stack agentic report — UNVERIFIED; recommend do not cite
- The page does say what the finding reports (June 17, 2026; n=200: AmLaw 200 n=84, regional firms n=61, Fortune 1000 in-house n=55; 38% / 47% / 54%; 58% vs 11%; 22% stale-data incidents; 11% of e-billing users).
- Credibility problems: the About page names no people, publishes without bylines, discloses no organisation or location, and says AI tools are used for research and drafting. The stated "margin of error ±4.8% at 95% confidence" is arithmetically inconsistent with n=200 (that gives ±6.9%; ±4.8% needs roughly n=417). No independent corroboration found. The in-house subgroup is about 26 departments.
- ILTA comparison is solid: eDiscovery Today 2026-09-14, "508 firms"; "13% of respondents said they are already using Agentic AI".

## 14. Axiom budgeting survey — CONFIRMED for page-level stats; 50%/32% UNVERIFIED
- Axiom page: released September 8, 2025; 500+ GCs, CLOs, deputy GCs, CFOs; eight countries; 49% / 36%; 78%; "89% of legal leaders rate CFO relationships as excellent, but a 18-point authority gap".
- The 50% vs 32% breakdown is not on the public page. Arithmetic fits, but I did not see it. Do not print the breakdown without the gated report.

## 15. Conference facts — CONFIRMED (one vendor-only detail)
- CGI: May 11-14, 2026, Chicago (McCormick Place per Legal.io release), 2,300+ attendees (CLOC news hub).
- Compass: CLOC release May 12, 2026; Neota Logic; companion to Core 12 Maturity Assessment Playbook; four stages; beta; members only. Quote is Oyango Snell. CLOC's release does not list the four areas or stage names — those come only from Steno's recap (2026-06-03), which also reports Mike Haven (Meta) and "Deflection" as the first of four pillars.
- ILTACON 2026: venue Gaylord Opryland, Nashville confirmed by ILTA wrap-up page (5,780 attendees, 241 booths). Dates Aug 23-27 and "80+ sessions" seen only on a vendor blog (joinajax.com); ILTA's own pages no longer show 2026 dates.
- RLLB 2026: September 8-11, Fontainebleau Las Vegas, 900+ attendees, 100+ sessions — confirmed on the event site.
