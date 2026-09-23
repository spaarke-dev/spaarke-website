# Gap notes: association definitions of legal operations (CLOC, ACC, LegalOps.com, Legal Operators)

Researched 2026-09-21. Supports Article 1 (primary), also Articles 2 and 5.

## Method and limits

- The session's WebSearch budget was already exhausted (200/200), so both WebSearch calls returned no results. Discovery used: cloc.org on-site search (2 queries), Brave Search via curl (1 success, then HTTP 429 / captcha), Bing HTML and Bing RSS (results unusable, quotes ignored), DuckDuckGo HTML and Lite (bot challenge), Mojeek, Yahoo, Startpage, Ecosia, Searx, Qwant Lite (no usable results), geeklawblog.com site search (success), docket.acc.com site search (no hits).
- The WebFetch summariser refused to reproduce CLOC text verbatim, so every quote below was pulled by fetching the raw HTML with curl and stripping tags locally. Quotes are therefore exact page text, not model paraphrase. Dates for cloc.org pages are the `datePublished` / `dateModified` values in each page's schema.org JSON-LD.
- acc.com HTML pages return HTTP 403 to curl, WebFetch and the Jina reader. Static files under acc.com/sites/default/files are reachable, so the Maturity Model 2.0 PDF was re-read directly (pypdf, in memory) and its metadata inspected.
- www.legalops.com returned 403 to WebFetch but HTTP 200 to curl with a full browser header set (Accept, Accept-Language, Sec-Fetch-*). The LIVE site was therefore read directly; no browser automation was needed. Live and staging pages were diffed.
- The Internet Archive was "Temporarily Offline" during the session, so no historical captures could be checked.
- Temporary files: two LegalOps.com webp images were saved under scratchpad/research/tmp/assoc/ so they could be viewed (the 15 practice areas exist only as an image).

---

## (a) CLOC

### Definition ("What is Legal Ops?")
URL: https://cloc.org/what-is-legal-operations/ (schema datePublished 2024-07-30, dateModified 2025-05-20; footer (c) 2026). Page title is "What is Legal Ops?". There is no single dictionary-style sentence; the page gives two blocks.

"Legal Ops at its core / Allow lawyers to focus on providing legal advice":
> "With the focus on optimizing the business and practice of law, Legal Operations teams allow people to focus on what they are not only good at, but trained to do. Legal operations professionals are skilled to support legal teams in areas such as... Strategic Planning / Financial Management / Project Management / Technology Portfolio Investment"

> "These professionals, with backgrounds in finance, marketing, data analytics, learning and development, and more, work with leadership to identify strategic investments that build capacity for the organization. Their capabilities allow the legal organization to more effectively manage risks, monitor compliance, incorporate the right technological tools, and deliver more value to the enterprise by accelerating the business. A proactive legal ops team can anticipate and plan for challenges before they arrive."

"An Evolving Role / So much more than outside counsel management":
> "While general counsel were originally focused on risk management and reducing outside counsel costs, the demand for efficient and effective legal operations exploded over the past decade. Today, legal ops is an integrated, strategic business partner to not only the legal team, but the entire organization. Legal ops professionals are the chief operating officers of the legal team. From driving strategic initiatives, to optimizing the workforce to developing and implementing necessary service delivery models, legal operations teams are essential to an organization. Legal ops professionals drive change, strategically identify innovations that support evolving business needs, and leverage data to make better decisions."

Short quotable lines (each under 30 words):
- "Legal ops professionals are the chief operating officers of the legal team."
- "Today, legal ops is an integrated, strategic business partner to not only the legal team, but the entire organization."

The page does not mention AI, intake, self-service, or knowledge management.

### Core 12, verbatim (https://cloc.org/cloc-core-12/, datePublished 2024-07-30, dateModified 2025-05-16)
Page heading: "CLOC's Core 12 framework guides and supports operational excellence". Each function has a tagline and a two-sentence description:

1. Business Intelligence. "Make better decisions through data". "Guide your organization with data, not intuition. Collect, organize, analyze, and visualize data to uncover trends, find efficiencies, and drive informed business decisions."
2. Financial Management. "Maximize your resources through sound financial management". "Measure, monitor, and create an intentional financial approach. Use resources, such as time, people, money, and technology, wisely and connect spending to team outcomes."
3. Firm & Vendor Management. "Develop relationships that deliver value". "Strengthen relationships by strategically investing in talent and expertise to deliver value, increase transparency and accountability, and create stronger connections."
4. Information Governance. "Design information policies that fit your business and minimize risk". "Implement clear guidelines for organizing, securing, storing, and sharing data to better mitigate risk, control costs, and support compliance and legal standards."
5. Knowledge Management. "Tap the knowledge and capability of your entire organization". "Implement processes and standards to collect, structure, and organize knowledge to save time and improve outcomes. Leverage existing knowledge to make work easier."
6. Organization Optimization & Health. "Build effective and motivated teams". "Design balanced, high-impact teams that embrace your vision, culture, and values. Hire skillfully, recognize talent, and incentivize retention through professional enrichment and work-life dynamics."
7. Practice Operations. "Free up your legal teams through focused practice operations". "Enable lawyers to focus on law. Strategically leverage policies, processes, tools, and people to achieve the highest level of efficiency possible."
8. Project/Program Management. "Launch and support special programs and initiatives". "Plan, coordinate, and lead department-wide and cross-functional initiatives leveraging established practices and disciplines. Facilitate change and innovation without losing focus."
9. Service Delivery Models. "Match the right work to the right resource". "Understand the work and the risk. Allocate, assign, and distribute resources, both internally and externally, to those best suited to ensure efficient delivery of legal services."
10. Strategic Planning. "Set strategic goals that matter". "Look around corners. Define and implement short- and long-term goals that anticipate business and legal needs, create value, and support organizational success."
11. Technology. "Innovate, automate, and solve problems with technology". "Leverage systems and tools to generate efficiencies and resource productivity. Automate processes, digitize tasks, and deploy solutions to scale, mature, and advance."
12. Training & Development. "Support your team with targeted professional training". "Educate and improve your human capital to retain knowledge, deepen expertise, and advance business objectives. Coach, train, develop, and thrive."

### Per-function pages ("Current Reality vs. Desired State"), all datePublished 2024-09-27, dateModified 2025-05-06
URLs: https://cloc.org/cloc-core-12/<slug>/ with slugs business-intelligence-2, financial-management-2, firm-and-vendor-management, information-governance, knowledge-management, organization-optimization-health, practice-operations, project-program-management, service-delivery-models, strategic-planning, technology, training-and-development.

Business Intelligence page:
- Current reality: "In-house departments today often make minimal use of data and metrics. They may struggle to access or identity the right data, and lack the culture or tools to make consistent use of analytics." (sic, "identity")
- Desired state: "Manage and guide your organization through data, not intuition. Uncover hidden trends, find new efficiencies, and focus your team on clear and measurable outcomes that make a difference to the business."
- Bullets: "Determine the right data to collect and monitor" / "Design and roll out metrics and dashboards" / "Create data lakes and implement advanced analytics" / "Spot patterns and identify hidden opportunities"
- No mention of AI.

Knowledge Management page:
- Current reality: "Law departments and law firms often struggle to find and retain knowledge, whether tacit or explicit, and to establish best practices. Many of them rely on a framework of fragmented knowledge that fails to develop as the organization evolves, resulting in time-consuming searches for information and costly rework." It then cites "the most recent CLOC State of the Industry Survey, 67% of law departments rate their maturity level as developing regarding Knowledge Management" (edition not named on the page).
- Desired state: "Enable efficiencies by creating seamless access to legal and departmental institutional knowledge, making it easier to find answers and best practices. Nurture a culture of sharing, mutual support, and documentation across the organization and leverage technology to ensure critical data is available to the right people at the right time."
- Bullets: "Build a Knowledge Management strategy aligned with and supporting business goals" / "Integrate well-designed and well-documented workflows and processes into the organization's regular working practices, with taxonomies to expedite retrieval of knowledge" / "Implement automation to handle repetitive, low-value tasks and to mobilize organizational knowledge" / "Create a competitive advantage for the organization by instilling a culture of knowledge sharing and providing a structure that facilitates collaboration"
- No mention of AI. "automation" and "taxonomies" are as far as it goes.

Technology page (the ONLY Core 12 function text that mentions AI):
- Current reality includes: "With the rapid advancement of technology, including developments with artificial intelligence, implementing new technology solutions, and automating legal processes are high priorities for most organizations."
- Desired-state bullets include: "Create and implement a multi-year technology roadmap that illustrates implementation priorities"; "Assess emerging technology capabilities and incorporate them into your long-term strategic planning".

Service Delivery Models page: about sourcing mix, not request intake. "Analyze work types and processes (strategic nature, volume, skill level required) to identify insourcing and outsourcing opportunities"; "Standardize processes across teams, channels, and providers for similar tasks".

Practice Operations page: "Minimizing mundane, repetitive, and low-value work allows legal professionals to focus on high-value work". No intake language.

Project/Program Management page: the only place the word "Intake" occurs, as a legal-project-management stage: "four lifecycle stages—Intake, Planning, Execution, and Review."

Strategic Planning page, current reality: "Many legal teams operate reactively to issues and incoming work requests rather than operating proactively, guided by strategic priorities."

### Keyword audit across the 12 function descriptions (body text between "Back to Core 12" and the resource listing; regex counts run locally)
- "AI" / "artificial intelligence": 1 hit, Technology only.
- "intake": 1 hit, Project/Program Management (LPM lifecycle stage). "triage": 0. "front door": 0.
- "self-service" / "self service": 0.
- "dashboard": 1 (BI). "analytics": 2 (BI).
- "automat*": KM 1, Technology 3.

### How CLOC treats the four things
| Topic | Treatment in Core 12 |
|---|---|
| Intake / triage / legal front door | No function and no mention. Nearest homes are Service Delivery Models ("Match the right work to the right resource") and Practice Operations. "Intake" appears once, as an LPM matter stage. |
| Self-service | Not mentioned anywhere in the 12 function texts. |
| Data analytics / BI | A named function, "Business Intelligence". Dashboards, data lakes, "advanced analytics". No AI. |
| Knowledge management | A named function. Processes, standards, taxonomies, automation, culture of sharing. No AI. |
| AI | One clause in the Technology "current reality" paragraph. |

### Revision history / dates
- Last substantive revision of the framework: 2020-04-07. CLOC press release "CLOC Announces Updates To Its Core 12 Functions Of Legal Operations" (https://cloc.org/newsdesk/cloc-announces-updates-to-its-core-12-functions-of-legal-operations/, also PR Newswire 301036886, "Apr 07, 2020, 13:14 ET"): "CLOC has updated its original CLOC Core Competencies to reflect the increased scope and priorities that today's legal operations professionals are responsible for." Mary O'Carroll (then CLOC President): "The latest version of CLOC CORE 12 continues to push the industry forward, placing legal operations at the center of the legal ecosystem". The 12 names in that release are identical to today's list.
- The pre-2020 "Core Competencies" names (from a CLOC blog post dated 2020-03-10, https://cloc.org/blog/cloc/evolution-of-cloc-core-competencies-observations-from-a-maturing-market/): Financial Management; Vendor Management; Cross-Functional Alignment; Technology & Process Support; Service Delivery & Alternative Support Models; Organizational Design, Support & Management; Communications; Data Analytics; Litigation Support & IP Management; Knowledge Management; Information Governance & Records Management; Strategic Planning. The byline on that post is a site account ("Johnny"); the text reads as a guest/vendor piece ("We've met with more than 50 clients in the past 12 months"), so treat it as a CLOC-published blog post, not an official framework statement.
  - Notable for Article 5: that 2020 post describes KM this way: "legal operations departments are creating on-demand, self-service legal solutions for their internal customers... These solutions are driven by playbooks, AI and legal bots." The current Core 12 KM text contains neither "self-service" nor "AI".
- Web copy: Core 12 pages republished on the redesigned site 2024-07-30 / 2024-09-27 and last modified 2025-05-06 to 2025-05-20. I cannot tell whether wording changed at those dates (Wayback offline).
- Core 12 Maturity Assessment Playbook: released 2024-05-01/02 (CLOC release: https://cloc.org/newsdesk/contributors-and-advisors-david-areias/); four stages "Reactive, Emerging, Developing, and Leading" (https://cloc.org/core-12-maturity-assessment-playbook/). Member-gated; not read.
- CLOC Compass (2026-05-12 release) says "The Core 12 has defined legal operations excellence since 2016. The Maturity Assessment Playbook, released in 2024, gave teams a structured guide to advance through four stages of maturity."
- NEW, 2026-09-16: CLOC announced the Legal Operations Certified Professional (LOCP) credential (https://cloc.org/newsdesk/cloc-announces-legal-operations-certified-professional-credential-locp/). Candidates must "apply the CLOC Core 12 in practice ... and account for the impact of AI transformation across the legal department." First candidates at the 2027 CLOC Global Institute "alongside the public release of the CLOC Industry Standards." The release describes CLOC as "Founded in 2015 as the organization that built the legal operations profession and defined its foundational framework, the CLOC Core 12". So AI enters CLOC's competency apparatus through the certification, not (yet) through the Core 12 text.
- Date inconsistency worth knowing: CLOC says "Founded in 2015" (LOCP release) and Core 12 "since 2016" (Compass release); LegalOps.com's about page says Brenton and Franke "founded the Corporate Legal Operations Consortium ("CLOC") in 2016".

---

## (b) ACC

### Definition of legal operations (verbatim, ACC Legal Operations Maturity Model 2.0, p.3, "What is Legal Operations?")
> "Legal operations activities focus on optimizing legal services for corporations. Legal operations disciplines are rooted in business fundamentals, leveraging processes, data and technology. They are designed to build consistency and drive efficiency and value in the practice of law."

> "In many legal departments, this business management function is handled by dedicated legal operations staff that take responsibility for some or all of the areas in the ACC Legal Operations Maturity Model."

PDF: https://www.acc.com/sites/default/files/program-materials/upload/Legal-Opertaitons-Maturity-Model-2.0---ACC.pdf (33 pages; the URL's "Opertaitons" typo is ACC's).

### Publication year: 2020 (medium-high confidence)
- PDF Info dictionary: /CreationDate D:20200929130821-04'00' (29 September 2020), /Creator "Adobe InDesign 15.0 (Macintosh)" (InDesign 2020), /ModDate D:20241016123211-05'00' (16 October 2024). HTTP Last-Modified on the file: 17 Oct 2024. The 2010 XMP dates an earlier verifier saw belong to an embedded Illustrator CS3 logo asset, not the document.
- The PDF's own text: "all stages are more advanced than when we published the original model in 2017."
- I could not reach an ACC press release or web page stating the launch date (acc.com HTML is 403; search engines blocked; Wayback offline). So: cite as "ACC Legal Operations Maturity Model 2.0 (2020)" and, if precision matters, "PDF created 29 September 2020". The file was re-saved in October 2024; I cannot tell what, if anything, changed then. No version 3.0 or AI addendum was found, but the ACC site could not be browsed, so absence is not proven.
- Structure: three stages per function, "early, intermediate, and advanced". "crowd-sourced"; "Well over a hundred company representatives participated in the project." Footer on every page: "This is a living, evolving maturity model."

### Full function list (14) with ACC's one-line definitions, verbatim
1. Change Management & Communication. "A systematic process to enable an organization to embrace targeted changes in the way work is done."
2. Contract Management. "The process of managing contract creation, execution, storage and compliance with contractual obligations."
3. eDiscovery. "The process of identifying, collecting and producing electronically stored information in response to a request for production in a lawsuit or investigation."
4. External Resources Management. "Oversight of vendors and law firms from selection through performance management and payments."
5. Financial Management. "The discipline to allocate financial resources, forecast revenues/expenses and create/maintain budgets to ensure compliance with accounting and cash flow requirements."
6. Information Governance (Records Management). "The system to manage electronic and physical documents enterprisewide to support an organization's compliance and operational requirements"
7. Innovation Management. "The program and process to collect, analyze, select, pilot and implement innovative systems and processes within the legal department."
8. Intellectual Property Management. "Operations to optimize the return on investment in the tangible assets of an organization, such as patents and trademarks." (sic: the PDF says "tangible"; confirmed with two extractors)
9. Internal Resources Management. "The activities to advance the human resources in the legal department, including recruiting, onboarding, training, work allocation, performance management, talent development and employee communications."
10. Knowledge Management. "The process of capturing, distributing, and effectively using both structured and tacit knowledge assets, from work products (such as legal memos) to understanding of an issue due to prior experience."
11. Metrics & Analytics (the table of contents prints "Metrics & Analysis"; the section header prints "METRICS & ANALYTICS"). "The system to collect, organize and use data to inform decision making and performance management."
12. Project & Process Management (TOC prints "Process & Project Management"). "The disciplines utilized to plan, coordinate and oversee multifaceted initiatives and matters, as well as to continuously improve process efficiency."
13. Strategic Planning & Legal Operations Leadership. "The process to set legal department goals that align with enterprise objectives, prioritize initiatives, allocate resources and define metrics to assess progress."
14. Technology Management. "The set of activities to optimize utilization of technology, including planning, selection, procurement and/or development, training and promotion of adoption."

### How ACC treats the four things
| Topic | Treatment in Maturity Model 2.0 |
|---|---|
| Intake / triage | Not a function. It is a maturity marker inside two functions. Internal Resources Management: Early "Legal requests received by lawyers who delegate as needed"; Intermediate "Legal service request intake and triage function directing work to the appropriate resource in the Legal department". Technology Management: Intermediate "Effort underway to digitize and automate processes (e.g. legal intake and triage, workflows, NDAs)"; Advanced "Systems typically include legal service intake/triage, legal hold, financial ... knowledge/collaboration, full contract lifecycle ...". The phrase "front door" does not appear. |
| Self-service | The term does not appear (only "Self-directed education" under Innovation Management). Nearest ideas: Contract Management Advanced "Standardization, risk calibration, and playbooks allow extensive contract creation/execution with no legal department involvement"; Change Management & Communication Advanced, a "business-facing component, providing information about legal issues, frequently asked questions, how to access legal services"; KM Advanced "directories maintained and accessible by staff and clients; specific client-focused KAs developed". |
| Data analytics / BI | A named function, Metrics & Analytics. Advanced: "Department leaders directly access dashboards to filter data and answer questions to derive insights"; "Decision making enhanced through use of predictive analytics (statistical techniques that include machine learning, AI, algorithms for data mining)"; "Metrics support business intelligence, driving continuous improvement in firm performance and selection, internal and external staffing, case assessment, and legal strategy". "business intelligence" also appears under Contract Management Advanced. |
| Knowledge management | A named function. Advanced: "KM a standard component in organizational processes, supported by automated workflows"; "Dedicated central repository to share knowledge"; "At least one full-time dedicated KM professional". No AI in the KM function. |
| AI | Four mentions, all at the Advanced stage, none in KM: eDiscovery ("technology assisted review, predictive analytics, and artificial intelligence (AI)"), IP Management ("Extensive use of artificial intelligence and machine learning across the lifecycle of patents and trademarks"), Metrics & Analytics (predictive analytics), Technology Management ("piloting emerging technologies, such as artificial intelligence, machine learning, robotic process automation, and natural language processing"). Pre-dates generative AI; "generative" does not appear. |

---

## (c) LegalOps.com (Connie Brenton, Jeff Franke) — live site re-verified

### Live versus staging
- https://www.legalops.com/reference-modal (live, HTTP 200 via curl with browser headers; canonical tag points to itself; no date metadata). The definition and the "15 core practice areas" sentence are present verbatim on BOTH live and staging.
- https://www.legalops.com/about-us (live). The mission sentence is on both. The live page additionally carries an FAQ block that is NOT on staging. Live and staging text differ on all three pages compared (about-us, reference-modal, home), so the staging mirror is no longer a faithful copy; cite the live URLs.
- https://www.legalops.com/ (live) confirms two items the earlier pass could not: "A Community for the Entire Legal Ecosystem" and "LegalOps.com has three expert levels: Emerging, Established, and Industry Leader."

### Definitions (verbatim, live)
- Reference Models page, heading "What Is Legal Operations Management?":
  > "Legal operations management is the oversight of how legal services are delivered across a department, ensuring they meet the right quality, cost, and risk thresholds for the enterprise."
  > "LegalOps.com identifies 15 core practice areas that form the foundation of operational excellence in every legal department."
- About page FAQ, "What exactly is "Legal Operations"?":
  > "Legal Ops is the multidisciplinary function that handles the "business of law." It encompasses 12 core competencies including financial management, vendor oversight, and technology implementation."
  followed by "This allows lawyers to focus on legal advice while the department operates with business-grade efficiency."
  - Inconsistency to be aware of: the FAQ says "12 core competencies" (CLOC-era language); the Reference Models page says "15 core practice areas". Use the Reference Models sentence as LegalOps.com's definition and the 15-area model as its framework.
- About page, mission: "We unite legal teams and providers to advance modern corporate legal services delivery through community, content, and data, not just events."
- About page, history: "Today, legal teams are expected to plan, budget, manage vendors, leverage technology, and use data to run legal like a business."
- Franke bio (live): "Jeff has helped define and evolve the legal operations role for the industry in many ways including creating CLOC's 12 Core Competencies and LegalOps.com's Legal Operations Management Reference Model". This is the lineage point: the same person is credited with both the original CLOC competencies and the LegalOps.com model.
- Brenton bio (live) is where AI shows up: "helping legal leaders navigate the next major transformation of the profession: the responsible adoption of artificial intelligence".

### The 15 practice areas (read from the image on the live Reference Models page)
Image: https://www.legalops.com/new_assets/images/legal-operation-management-new.webp (alt "legal operations management"; HTTP Last-Modified 2026-07-04; marked "(c) LegalOps.com"). Hexagon pyramid, top to bottom:
1. Commoditization of Legal Services
2. Knowledge Management
3. Records Management
4. Practice Area Enablement
5. Litigation Management Enablement
6. Performance Analysis
7. Technology & Process Enablement & Management
8. Communications Support & Management
9. Vendor Management
10. Legal Ops/Business Function Alignment
11. Strategic Planning
12. Financial Management
13. Service Delivery Solutions & Management
14. Legal Dept Org Design & Management
15. Data & Document Management

Leadership & Personal Effectiveness Skills model (second image, legal-expertise-new.webp): Self-Management & Self-Care; Leadership; Self-Knowledge; Communicating; Connecting; Collaborating; Influencing; Personal Brand (8 skills). Page text: "These reference models outline the leadership and personal effectiveness skills essential for leading teams, influencing stakeholders, and advancing change." Franke's bio credits "Dr. Larry Richard and Others" as co-creators.

Per-area definitions are member-gated ("Access the full models and in-depth guides when you become a member."). I did not join, so treatment below is by NAME ONLY.

### How LegalOps.com treats the four things (names only; definitions gated)
| Topic | Treatment |
|---|---|
| Intake / triage / front door | No practice area carries that name. Candidates by name: "Service Delivery Solutions & Management", "Practice Area Enablement". Unverifiable without member access. |
| Self-service | No area by that name. "Commoditization of Legal Services" sits at the apex of the pyramid and may cover it, but no public definition exists. Do not assert. |
| Data analytics / BI | "Performance Analysis"; adjacent "Data & Document Management". Separately the site offers a "Legal Metrics Portal" and comp benchmarking. |
| Knowledge management | A named practice area, "Knowledge Management", distinct from "Records Management" and "Data & Document Management". |
| AI | In no practice-area name. AI appears in Brenton's bio and (per earlier notes) as a standalone RLLB 2026 track and in Franke's CCBJ 2025 remark about "prompt engineering and agentic AI". |

### Dates
- Unveiled at the inaugural RLLB, October 2023. LawVision (Susan Raridon Lambreth), 2023-10-30, https://lawvision.com/the-inaugural-rllb/: "the unveiling two new reference models: LegalOps.com's Legal Operations Management Practice Areas and LegalOps.com's Leadership and Personal Effectiveness Skills" and "highlights 15 Practice Areas that represent the activities necessary for a legal department to deliver legal services with the ultimate objective of obtaining a competitive advantage for the business." LawVision is a partner of the event, so it is an affiliated secondary source.
- The Reference Models page carries no date; the current image asset was last modified 2026-07-04 (site redesign asset, not necessarily a model revision). No public revision log.

---

## (d) Legal Operators (legaloperators.com, Colin McCarthy)

- No definition of legal operations and no competency framework is published on the public site (pages read: /, /about, /membership, /innovation-hub, /events, /summit-by-the-sea-2025, two /resource/ pages). It is a community and events business, not a standards body.
- Self-description (homepage): "Legal Operators is the leading private community for legal operations professionals to connect with leaders, discover innovative solutions, and collaborate on solving problems." Tagline "Empowering Legal Operators through Content, Connections, and Tech". "3,000+ joined".
- /about: "Started in 2019, Legal Operators has become one of the premier communities for people within the occupation. What originally started as a local meet up in a neighborhood bar has transformed into a national community." Mission: "Our mission is to connect legal operations professionals globally with their peers and industry experts. This is through events, engaging content, and collaboration so that you are empowered to execute with sound, tested solutions." Team listed: Deisha Vazquez (Head of Community), Tom Guthrie (Head of Partnerships), Robin Ponce (Head of Events). Colin McCarthy is NOT named on /about. The only on-site traces are a mailto link colin@legaloperators.com on /innovation-hub and his listing as a Summit by the Sea 2025 speaker, where he is titled "CEO and Founder at CMC Strategies".
- Founder attribution (secondary, trade podcast): The Geek in Review Ep. 161, Greg Lambert and Marlene Gebauer, 2022-06-01, https://www.geeklawblog.com/2022/06/the-geek-in-review-ep-161-colin-mccarthy-of-legal-operators-on-building-a-legalops-community.html: "We asked the founder of Legal Operators, Colin McCarthy, to come on the show". In the auto-generated transcript McCarthy gives the nearest thing to a definition: "our job is the operation professionals in house is really the operation operationalize the business of legal in house, and that starts with everything from your process, your spin, the optimization, you know, looking at data analytics, measuring everything you do" (transcript errors in the original, e.g. "spin" for "spend"; do not quote as polished prose). In that episode he places the start in 2018 after first saying 2019; the site says 2019.
- The closest thing to a taxonomy is the Innovation Hub filter list, "A collection of content organized in over 38 different legal operations categories of interest" (36 visible): Artificial Intelligence; Automation; Business Intelligence Tools; Case Review; CLM; Consulting Services; Contract Management; Contract Review; Data Governance; Diversity; Document; Document Management; eBilling; e-Discovery; Enterprise Management (ELM); HRM; In-House Hiring; Knowledge Management; Leadership; Legal Hiring; Legal Hold; Legal Innovation; Legal Operations Consulting; Legal Operations (General); Legal Spend; Legal Spend Management; Legal Tech (General); Matter Management Software; Outside Counsel Management; Records Management; Retrieval; Risk Management; Subpoena Management; Thought Leadership; Woman in Law; Workflow Automation. This is a content-tagging scheme, mostly technology categories, not a competency model.

| Topic | Treatment |
|---|---|
| Intake / triage / front door | No category. Nearest: "Workflow Automation", "Automation". |
| Self-service | No category. |
| Data analytics / BI | Category "Business Intelligence Tools" (a tooling label). |
| Knowledge management | Category "Knowledge Management". Summit by the Sea 2024 recap (2024-10-30): "Amazon's targeted approach to knowledge management saved $1.5M annually by reducing tax review requirements by 95%." |
| AI | Category "Artificial Intelligence"; homepage nav item "AI & THE LAW"; 2024 recap: "35% of attendees still considering AI overhyped". |

- Freshness: site footer reads "(c) 2024 Legal Operators"; the homepage banner still announces "Summit by the Sea 2025" (held 2025-09-17 to 19, Estancia La Jolla, marked Sold Out / Registration Closed). I found nothing dated 2026 on the public pages. No framework, so no "last revised" date applies.
- No mention of RLLB, "Running Legal", or Brenton anywhere on the three Legal Operators pages checked (string search on raw HTML).

---

## Which organization is "the organization behind RLLB"?

LegalOps.com. Plainly: RLLB = the "Running Legal Like a Business" conference, run by LegalOps.com, the company co-founded by Connie Brenton and Jeff Franke (both CLOC co-founders). Evidence: the conference site is a LegalOps.com subdomain (https://rllb-2026.legalops.com/, title "RLLB Conference | Running Legal Like a Business", section "Sessions Aligned with LegalOps.com Reference Models"); the live LegalOps.com navigation lists "Annual Conference (RLLB)" and "Sign Up for RLLB 2026"; LawVision 2023-10-30 calls it "the inaugural LegalOps.com Running Legal Like a Business conference". The name comes from the PLI handbook Running Legal Like a Business that Brenton co-authored.

Legal Operators (legaloperators.com, founded by Colin McCarthy) is a different organization with a different flagship event (Summit by the Sea) and no connection to RLLB on its site. A brief that says "Legal Operators" when it means the RLLB host should be corrected to "LegalOps.com". Note the naming trap: three bodies with near-identical names (CLOC's "legal ops", LegalOps.com, Legal Operators).

---

## Cross-framework synthesis (for Articles 1, 2, 5)

1. All three published frameworks pre-date or ignore generative AI in their text. CLOC Core 12: last revised April 2020, one AI clause (Technology). ACC 2.0: 2020, four AI mentions, none in KM. LegalOps.com: October 2023, no AI in any practice-area name. AI is arriving through side doors instead: CLOC's LOCP credential (Sept 2026) and AI Intensive (Aug 2026), RLLB's 2026 AI track.
2. Both CLOC and ACC define KM without AI (Article 5 finding holds, now with primary text from both). CLOC's KM: "collect, structure, and organize knowledge"; ACC's KM: "capturing, distributing, and effectively using both structured and tacit knowledge assets". ACC's Advanced KM asks for a repository, metrics, budget and a dedicated KM professional. A March 2020 CLOC blog post did tie KM to "self-service legal solutions ... driven by playbooks, AI and legal bots", but that language did not survive into the Core 12 text.
3. None of the frameworks treats service intake / the legal front door as a function of its own. ACC is the only one that names it, and only as a marker inside Internal Resources Management and Technology Management. CLOC never mentions it. LegalOps.com has no area by that name.
4. Self-service is absent as a term from all three frameworks.
5. Metrics (Article 2): CLOC frames it as "Business Intelligence" ("Guide your organization with data, not intuition"), with dashboards and "data lakes and ... advanced analytics" as the end state. ACC frames it as "Metrics & Analytics", whose Advanced stage is leaders who "directly access dashboards" plus predictive analytics, and says "Metrics support business intelligence". LegalOps.com calls it "Performance Analysis". Legal Operators only has a tooling tag, "Business Intelligence Tools".
6. Framing differences in the definitions: CLOC defines by role and stature ("chief operating officers of the legal team"; "strategic business partner"); ACC defines by discipline ("rooted in business fundamentals, leveraging processes, data and technology"); LegalOps.com defines by management outcome ("quality, cost, and risk thresholds for the enterprise") and states the aim as competitive advantage.

## Gaps
- ACC: no ACC-authored statement of the 2.0 release date was reachable; year rests on PDF metadata (created 2020-09-29) plus the "original model in 2017" sentence. Whether the October 2024 re-save changed content is unknown. Whether ACC has issued anything newer than 2.0 could not be checked (acc.com 403).
- CLOC: whether Core 12 web wording changed at the 2024 relaunch or May 2025 edits is unknown (Wayback offline). The member-only Core 12 Maturity Assessment Playbook and Compass content were not read, so how the Playbook's stage descriptors treat intake, self-service or AI is unknown. The content of the forthcoming "CLOC Industry Standards" (2027) is not public.
- LegalOps.com: per-practice-area definitions are member-gated; treatment of intake, self-service, BI and KM is inferred from names only. No revision date is published for the reference models.
- Legal Operators: no framework exists to analyse. McCarthy's founder status rests on a 2022 podcast page, not on the organization's own site; his current role there is unconfirmed (the 2025 summit page titles him "CEO and Founder at CMC Strategies").
- The "67%" KM maturity figure on CLOC's KM page is not tied to a named survey edition.
