# r2-bi-supporting-claims: verification notes

Checked 2026-09-21. Method: fetched each cited URL (WebFetch, or curl with a browser UA where WebFetch was blocked), followed to primaries where the citation was secondary or gated. Downloaded files sit in this folder (legalops.html, complete-ref.webp/.png, pyramid.png, sb-schedule.json, acc-mm.pdf/.txt, harbor.html, core12*.html, rllb-*.html, elevate.html, lw-forces.html, smbtech.html, gcp-legal.html, everlaw.html, brightflag.html, snowflake.html, lexpert.html, ossie-spec.md).

Verdict key: confirmed = seen at the source; corrected = a detail differs; unverified = could not see it.

## 1. ACC and Everlaw survey (2025-11-17, n=284) : CONFIRMED
- Everlaw release, dateline "November 17, 2025 OAKLAND, Calif." Title matches exactly.
- "Based on a survey of 284 CLOs, GCs, and legal operations professionals worldwide" verbatim.
- 83% track outside counsel spend; 28% time-to-resolution; 12% outside counsel performance; 9% impact on business outcomes; 96% say GenAI can help demonstrate value. All present.
- Nuance: the headline says "81% of CLOs" but the body sentence reads "81% of legal leaders cite greater speed of legal support and matter resolution as top benefits." Quote the body wording if using 81%.
- Report title confirmed: The Role of Generative AI in Proving Corporate Law Department Value (part two of the 2025 GenAI Strategic Value series). Report itself gated.
- usable_by 2026-06-14 vs source 2025-11-17: OK.

## 2. ACC Corporate Counsel Now article (2026-07-30) : CONFIRMED
- Title, authors (Blake E. Garcia, PhD and Mauro Whiteman), date 30 July 2026 confirmed.
- Barriers verbatim: "Lack of time or resources: 57 percent"; "Data scattered across systems: 50 percent"; "Limited tools for automation: 43 percent"; "Difficulty aligning metrics with business priorities: 29 percent."
- Tracking figures verbatim: "Outside counsel spend is tracked by 83 percent of teams"; 28, 12, 9 percent present.
- No sample size in the article. Article does name Everlaw as the report partner, so an ACC citation still implies the Everlaw co-sponsorship.
- usable_by 2026-09-01 vs 2026-07-30: OK.

## 3. LegalOps.com reference model, 15 practice areas : CONFIRMED (with a date caution)
- Page returns 200 via curl with a browser UA (403 to WebFetch). Text contains: "LegalOps.com identifies 15 core practice areas that form the foundation of operational excellence in every legal department." and the definition sentence "Legal operations management is the oversight of how legal services are delivered across a department, ensuring they meet the right quality, cost, and risk thresholds for the enterprise."
- Diagram: new_assets/images/complete-refrence-modal-new.webp, HTTP 200 with a Referer header, Last-Modified Sat, 04 Jul 2026 11:42:01 GMT, 2992x2120. Inspected: 15 hexagons in a 1-2-3-4-5 pyramid. Row 3: Practice Area Enablement, Litigation Management Enablement, Performance Analysis. Bottom row: Strategic Planning, Financial Management, Service Delivery Solutions & Management, Legal Dept Org Design & Management, Data & Document Management.
- Gating confirmed: "Members gain exclusive access to detailed definitions, downloadable frameworks, and best-practice examples."
- Caution: the image file was modified 2026-07-04, after the 2026-06-14 usable_by; the page carries no date. Cite with an access date.

## 4. ILTACON 2026 dates and venue : CONFIRMED
- ILTA event page: "ILTACON 2026 Annual Educational Conference", August 23-27, 2026, "Gaylord Opryland Resort and Convention Center, 2800 Opryland Drive, Nashville, TN 37214."
- iltacon.org/announcements: "23-27 August".
- Wrap-up page https://www.iltanet.org/live-events/iltacon2026-wrapup: "5,780 Total Attendees", "241 Booths", plus 97.17% check-in rate. Undated.

## 5. Snowflake CoWork GA 2025-11-04 : CONFIRMED
- Page title: "Nov 04, 2025: Snowflake CoWork (General availability) | Snowflake Documentation". Canonical URL still ends in -snowflake-intelligence.
- Verbatim: "With this release, we are pleased to announce the general availability of Snowflake CoWork, which was previously available as a preview feature."
- "Snowflake Intelligence" appears on the page only in side-nav links to other release notes, not in the body.

## 6. dbt Labs 2026 benchmark : CONFIRMED
- April 7, 2026; Jason Ganz, Benoit Perigaud. claude-sonnet-4-6: 90.0% text-to-SQL vs 98.2% Semantic Layer; gpt-5.3-codex: 84.1% vs 100.0%. 11 questions, 20 runs each. 32.7% (2023, GPT-4) to 64.5% (2026). Failure-mode sentence verbatim.

## 7. Forrester June 2, 2026 : CONFIRMED
- Four authors (Evelson, Bandyopadhyay, Dai, Yuhanna). Both quotes verbatim. "deterministic" absent.

## 8. Forrester April 10, 2025 : CONFIRMED
- Boris Evelson. "BI is alive and well." "GenAI is not the end of BI." "BI continues to be a crucial enabler in the data-to-decisions process, which is essential for data-driven enterprises." All present.

## 9. Power BI standalone Copilot (preview) : CONFIRMED (with date cautions)
- Title "Standalone Copilot experience in Power BI (preview)"; ms.date 2026-07-06; updated_at 2026-08-27. The URL now canonicalizes to /power-bi/explore-reports/copilot-chat-with-data-standalone.
- Verbatim: "it then uses the measures and other data fields in your semantic model (or even creates new DAX calculations) to generate the answer for you."
- Overview page (copilot-introduction): ms.date 2026-08-24, updated_at 2026-08-31: "The report agent Copilot pane available on the right side of reports is generally available. The Power BI agent available as a standalone, full-screen experience accessible from the Power BI left navigation is in preview."
- Cautions: the standalone page was revised 2026-08-27, after the 2026-07-10 usable_by; the overview page's 2026-08-24 ms.date is itself after usable_by. Cite both with access dates.

## 10. Fabric IQ overview : CONFIRMED
- ms.date 2026-07-08; updated_at 2026-08-31. Quote verbatim. Every ontology mention carries "(preview)"; the IQ workload itself is "(preview)".

## 11. Apache Ossie : CORRECTED (source of the draft status)
- Incubator status page: "2026-06-22 Project enters incubation." Confirmed.
- Rename post: Josh Klahr, July 10, 2026; "Ossie is an open specification for both semantic layer and ontology." verbatim; "grown from 17 launch partners to more than 50 organizations" confirmed.
- Snowflake launch post: September 23, 2025; 16 named partners plus Snowflake. Confirmed.
- "Draft specification": not on the rename post or anywhere on ossie.apache.org (its /spec/ page is an empty placeholder). It is in the GitHub repo, core-spec/spec.md: "DRAFT version, in development, schema may change before 0.2.0 is released." "Version: 0.2.0.dev0". Cite https://github.com/apache/ossie/blob/main/core-spec/spec.md for draft status.

## 12. CLOC Global Institute 2026 agenda : CONFIRMED
- Sessionboard feed (embed bf699bda-0971-49fd-a6eb-b9e274de521d, dataType=schedule) holds 351 items. Event May 11-14, 2026, Chicago.
- "Fix, Grow, Run, Transform - the executive report": 2026-05-12 15:00 CT, format Case Study, track Resource Optimization & Spend Management, tags Business Intelligence and Financial Management, speakers Petra Stirling (Westpac Group Legal) and Steven Robert (Westpac Banking Corporation). Verbatim: "With 30+ practice areas and 200 lawyers, Westpac Legal leverages semi-automated data platforms and BI tools to showcase how legal enables the business to Fix, Run, Grow, and Transform."
- "The CFO's Love Language: Financial Fluency for the Modern Legal Leaders" (tags Business Intelligence, Financial Management; Kshitij Dua among speakers).
- "From Invoices to Insight: How Data Is Reshaping Outside Counsel Strategy" ("Presented by Wolters Kluwer"; Jennifer McIver).
- "The Legal Front Door: The Foundation You Need Before AI Can Deliver" is a 15-minute slot (2:00-2:15 pm, May 13) inside the "Legal Hacks" sponsored block, "Presented by Checkbox AI" (Evan Wong).
- Descriptions only; no findings. Confirmed.

## 13. CLOC post-event release : CONFIRMED
- Published May 15, 2026. Headline "More Than 2,300"; body "nearly 2,400", "more than 26 countries", "more than 90 educational sessions"; themes include "data-driven decision making". Snell quote verbatim (continues: "That shift tells you everything about where this profession is...").

## 14. Harbor Maturity Index release : CONFIRMED
- "May 11, 2026 (Chicago, IL)". Verbatim: "98% of legal departments report implementing or exploring AI, with 57% already live and 24% in pilot." "81% of departments rank it as their primary operational focus for 2026". No sample size, methodology or field dates anywhere in the release. Kevin Clem quoted; full findings released at CGI May 11-14.

## 15. ACC Maturity Model 2.0 PDF : CONFIRMED
- PDF metadata: CreationDate D:20200929130821-04'00'; ModDate D:20241016123211-05'00' (XMP shows a 2010 template date, ignore). 33 pages.
- Page 25 header "METRICS & ANALYTICS" (the table of contents spells it "Metrics & Analysis"). Definition verbatim: "The system to collect, organize and use data to inform decision making and performance management."
- "all stages are more advanced than when we published the original model in 2017" confirmed. Stage headers EARLY STAGE / INTERMEDIATE STAGE / ADVANCED STAGE confirmed.
- Intake and triage markers confirmed: "Legal service request intake and triage function directing work to the appropriate resource" (Internal Resources Management) and "legal intake and triage" / "legal service intake/triage" (Technology Management).

## 16. CLOC Core 12 Business Intelligence : CONFIRMED (URL note)
- Core 12 page: tagline "Make better decisions through data"; description verbatim; JSON-LD dateModified 2025-05-16T16:36:11+00:00.
- The BI function page lives at https://cloc.org/cloc-core-12/business-intelligence-2/ (the /business-intelligence/ path returns an SVG). dateModified 2025-05-06T22:09:33+00:00. Current reality verbatim: "In-house departments today often make minimal use of data and metrics."
- Press release "CLOC Announces Updates To Its Core 12 Functions Of Legal Operations", SAN JOSE, CA, April 7, 2020. Confirmed.

## 17. RLLB 2025 Data-Driven award : CORRECTED
- The Edge Room article (Sept 4, 2025) carries the byline Tanya Amyote, not Connie Brenton (Brenton may be quoted; confirm before attributing). It lists PayPal (Emily Teuben), Phillips 66 (Michael Voutsinas) and Total Quality Logistics, and contains "The strongest entries demonstrated business outcomes backed by data." Its own criteria wording: "This award honors departments that use data and analytics to drive decisions, optimize operations, and demonstrate value to the business."
- The criteria wording in the finding ("Honoring a legal team that has successfully leveraged data analytics, metrics, and reporting to improve decision-making, resource allocation, and overall legal performance") is on rllb-2025.legalops.com/rllb-awards, which is the 2025 nomination page and lists 2024 winners, not 2025.
- The 2025 winners appear on rllb-2026.legalops.com/rllb-awards with different wording: "Recognizing legal departments that masterfully leverage data, metrics, and analytics to optimize daily operations and unlock strategic business value."
- Elevate release (datePublished 2025-09-09): "PayPal earned the Data-Driven Legal Department of the Year Award... In partnership with Elevate". Confirmed as PayPal-only framing.

## 18. Gartner intake forecast (60 per cent) : CONFIRMED
- Lawyers Weekly, Grace Robbie, June 9, 2026: "In the same time frame, we predict that 60 per cent of legal departments will use AI-driven intake systems that capture all requests and answer one-half of those without human intervention." Speaker Weston Wicks, senior director analyst.
- SMBtech (smbtech.au, Staff Writer, May 27, 2026; note the domain is smbtech.au, not smbtech.com.au): same sentence with "timeframe" as one word. SMBtech carries the standard Gartner release tail (report access line for "Innovation Insight: Legal AI Platforms" and conference plug) but no "About Gartner" paragraph.
- Gartner primary URL (slug 2026-05-26) appears in search results; gartner.com returns 403 to both WebFetch and curl. Neither reprint states a release date. The 2026-05-26 date still rests on the slug.

## 19. Gartner headcount (56 per cent) : CORRECTED (five-forces wording)
- Lawyers Weekly, Grace Robbie, July 28, 2026. Verbatim: "Gartner found that 56 per cent of legal departments anticipate a headcount freeze or reduction in 2026". No sample size.
- Rastogi is introduced as "Gartner's research director in the legal and compliance practice, Raashi Rastogi".
- The article gives the five themes twice with different wording. Article list: "regulatory change, political and geopolitical uncertainty, technological advancement, legal talent and sourcing market shifts, and organisational forces." Rastogi quote: "regulatory shifts, geopolitical and regulatory uncertainty, technological advancement, evolving talent markets, and organisational forces." The finding mixes the two lists. Also: "nine transformative forces across five key themes".

## 20. Forrester July 23, 2026 : CONFIRMED
- Boris Evelson. Both quotes verbatim. "a Q4 2026 landscape report and a Q1 2027 Forrester Wave evaluation planned". Alerts sentence: "These agents can deliver alerts when thresholds are crossed, anomalies emerge, trends shift, or opportunities arise".
- Companion post exists: "The Next Evolution Of AI Will Rely On Context Layers", Evelson and Bandyopadhyay, August 20, 2026.

## 21. Looker Agentic Workflows : CONFIRMED
- Indumathi Velusamy, Product Manager, July 29, 2026. Quote verbatim, continues: "It can automatically run a Key Driver Analysis (KDA) across the underlying data model". Slack and email delivery; preview; Looker 26.08 and later.

## 22. Brightflag MCP connector : CONFIRMED
- "Updated August 18, 2026". Quote verbatim. Permissions: "it doesn't create a new permission layer, it inherits the one you already have." Webinar: "Join our webinar on August 4 at 12 PM ET where our Head of Community, Anna Richards, will be doing a walkthrough" (year not stated; the page uses future tense). "read-only" absent. The only statistic is a third-party one (87% of GCs using AI, FTI Consulting and Relativity 2026), no Brightflag usage figures.

## 23. Gemini Enterprise for Legal : CORRECTED (components and connector name)
- "SUNNYVALE, Calif., Aug. 25, 2026". Launch-customer sentence verbatim.
- Four components as the release names them: (1) Purpose-built skills for legal agents; (2) Connectors, described as "secure Model Context Protocol (MCP) integrations"; (3) Third-party agents and partner ecosystem; (4) Secure and governable Gemini Enterprise platform. "Open partner ecosystem" is not a separate component.
- Connectors named: Courtroom5, Docusign, Everlaw, Free Law Project's CourtListener.com database, Harvey, iManage, Legora, NetDocuments, RelativityOne, Solve Intelligence, and Thomson Reuters. "HighQ" does not appear; use "Thomson Reuters".
- The release uses "legal operations" generically twice ("automates and accelerates complex legal operations"; "value... bringing to legal operations") but has no corporate legal department, legal ops function, or analytics content. "analytics" absent.
- Kurian blog (cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-for-legal, Aug 25, 2026): "configured for rapid deployment across firms and corporate legal departments" confirmed.

## 24. ILTACON 2026 coverage : CONFIRMED
- LawSites, Bob Ambrogi, Aug 28, 2026: "As of Wednesday, registrations had reached 5,700, 1,100 more than last year's 4,600". Quote verbatim: "everyone is MCP-ing, API-ing, or otherwise integrating with everyone else." Driver: "the need for better data to drive better AI". No intake, dashboard or BI discussion.
- Artificial Lawyer Day One (Aug 25) bylined Will Seaton, Chief Customer Officer at Draftwise; Day Two (Aug 26) and Day Three (Aug 27) exist.
- CCBJ "Rented Models, Enduring Memory", Kristin Calve, Aug 31, 2026, at ccbjournal.com/blog/rented-models-enduring-memory (the /articles/ path 404s). Quote: "Making more of legal's institutional knowledge available as data potentially gives the department another way to participate in enterprise data strategy."
- Above the Law, Joe Patrice, Sept 1, 2026, "Welcome To The Legal Tech Polycule": 5,782 official attendees. ILTA's own wrap-up says 5,780; note the two-person discrepancy if citing.

## 25. No non-vendor named intake case with numbers : UNVERIFIED (negative claim; one sub-source not found)
- Lexpert, Jacqueline So, 2026-02-23: winners Analog Devices, Medtronic, Rovensa Group. Analog Devices redesign "covered matter intake, outside counsel management, budgeting discipline, and governance frameworks"; worked with Checkbox on "an AI-enabled chatbot"; "saved considerable costs, boosted budget predictability, and cut manual effort". No numbers. Confirmed.
- GlobeNewswire 2025 ACC Value Champions release (March 12, 2025) exists; not examined line by line.
- Pearson: Onit and Morae release on GlobeNewswire, July 22, 2020: "Pearson achieved a 35% cost reduction and 30% improved contract turnaround time" and "a web-based 'legal front door' for incoming service requests". Confirmed as vendor-sourced.
- acc.com champion pages (2020 Pearson, Meet the Champions) return 403. Confirmed.
- The "Liberty Mutual, Palo Alto Networks, Mercado Libre" ACC item dated 2026-09-16 could not be located by search; Liberty Mutual was a 2023 Value Champion. Treat that sub-claim as unverified.
- A negative claim cannot be proven by fetching; the specific supports checked hold up.

## usable_by checks
All source dates fall on or before the stated usable_by except as flagged: item 3 (diagram file 2026-07-04 vs 2026-06-14, page undated), item 9 (overview page ms.date 2026-08-24 and standalone page revision 2026-08-27 vs 2026-07-10), item 10 (revision 2026-08-31 vs 2026-07-10, already flagged in the finding). Item 24's Above the Law piece is dated exactly 2026-09-01.
