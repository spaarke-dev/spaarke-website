# Verification notes: palantir-intelligence-platform-model

Checked 2026-09-21. Method: WebFetch of each cited URL. WebSearch budget for the session was exhausted, so no independent searching was possible; where a cited page did not carry the claimed text I guessed sibling doc URLs. Palantir marketing pages (palantir.com/platforms/...) are JS-rendered and return an empty shell to a plain fetch; those and Medium-hosted blog.palantir.com posts (HTTP 403 direct) were read through the r.jina.ai rendering proxy. The FY2025 10-K PDF was downloaded and text-extracted locally with pdftotext (scratchpad/research/pltr-10k-fy2025.txt).

Palantir docs pages carry no visible publication date; "unknown" is correct for all of them.

## 1. Decision-centric definition (data, logic, action, security) - CONFIRMED
- https://www.palantir.com/docs/foundry/ontology/why-ontology
- Quote exact: "The Ontology represents the decisions in an enterprise, not simply the data." ("decisions" italicised in source.)
- Four component definitions seen verbatim: Data "The information leveraged to make the decision."; Logic "The heuristics and computational processes that evaluate a decision."; Action "The orchestration and execution of the chosen decision."; Security "The assurance that the decision complies with operational policies."
- Blog "Connecting Agents to Decisions", 2026-04-28, https://blog.palantir.com/connecting-agents-to-decisions-277dee8ddb40 : same four definitions. Blog wording of the headline sentence differs slightly: "The Ontology is a system designed to represent the decisions in an enterprise, not simply the data."
- "Supersedes the older semantic/kinetic/dynamic framing" is the researcher's interpretation; docs overview still uses semantic/kinetic wording (see 4).

## 2. Closing the action loop - CONFIRMED
- Same why-ontology page. Quote exact: "Closing the action loop as decisions are made in real-time is what distinguishes an operational system from an analytical system."
- "...requires a different architecture than a classical database management solution optimized for reporting and analytics." seen.
- "golden tables that flatten the richness of operations into narrow schemas" seen in the 2026-04-28 blog (not in the docs page).

## 3. "Not a semantic layer" - CONFIRMED (core); Cognizant sub-claim UNVERIFIED
- https://www.palantir.com/docs/foundry/architecture-center/ontology-system
- Quote exact. Language / Engine / Toolchain grouping seen; "semantics must be paired with kinetics" seen; nouns/verbs metaphor seen; Change Data Capture mention seen ("mechanisms like Change Data Capture for extremely low-latency mirroring with other operational systems").
- Cognizant partner material calling it a semantic layer: not checked (no URL given, no search available).

## 4. Semantic / kinetic / dynamic wording - CORRECTED (quote attribution not verifiable)
- Foundry page https://www.palantir.com/platforms/foundry/ (rendered): "It integrates the semantic, kinetic, and dynamic elements of your business" - seen.
- Docs overview https://www.palantir.com/docs/foundry/ontology/overview : "In many settings, the Ontology serves as a digital twin of the organization, containing both the semantic elements (objects, properties, links) and kinetic elements (actions, functions, dynamic security) needed to enable use cases of all types." - seen.
- The exact_quote attributed to https://www.palantir.com/platforms/aip/ ("a developer toolchain that surfaces the full power of the semantic data, dynamic logic, and kinetic action integrated into the Ontology") was NOT found on the rendered AIP page on 2026-09-21: strings "semantic data", "kinetic action", "full power" all absent. Also absent from /platforms/ontology/ and /docs/foundry/aip/overview. It may live on another page or have been removed. Do not cite that quote to the AIP page without re-locating it. The semantic=data / kinetic=action / dynamic=logic mapping therefore rests on an unverified quote.

## 5. Action log and decision lineage - CONFIRMED (one sub-detail unverified)
- https://www.palantir.com/docs/foundry/action-types/action-log : quote exact; "What decision was made, by whom, when, and in what context?" seen.
- why-ontology: "The end-to-end 'decision lineage' of when a given decision was made, atop which version of enterprise data, and through which application, is automatically captured and securely accessible to both human developers and agents." and "The aggregate decisions made by thousands of users and agents throughout Ontology can be securely leveraged as training data when fine-tuning models, and can be distilled into targeted principles that are called upon during agent prompting." - both seen.
- "Use-case docs describe 'capturing decisions as data' as closing the operational loop": not found on the use-case pages I checked (delivering-a-use-case, use-case-life-cycle overview / solution-design / sequencing-development). Unverified.

## 6. Actions, webhooks, write-back, no duplication - CONFIRMED with source corrections
- https://www.palantir.com/docs/foundry/action-types/webhooks : "A webhook is a concept in Data Connection that enables sending a request to an external system, such as Salesforce, SAP, or any configured HTTP server"; "When configured as a writeback, the webhook will be executed before any other rules are evaluated; if the webhook execution fails, no other changes will be made." - seen. The exact_quote sentence ("This enables workflows in Foundry to connect directly with source systems and write back data and decisions into those systems.") was not returned verbatim by my fetch; treat as probable but not eyeballed.
- Submission criteria https://www.palantir.com/docs/foundry/action-types/submission-criteria : conditions on current user (ID, groups, attributes) and parameters (object properties) - seen.
- "never requires data to be duplicated" is NOT on the virtual tables page; it is on https://www.palantir.com/docs/foundry/architecture-center/multimodal-data-plane : "MMDP allows Iceberg catalogs to be managed within Palantir, or as virtual catalogs and virtual tables that are registered from these (or other) providers. This means that leveraging data in the Ontology for operational applications and AI-driven automations never requires data to be duplicated."
- ERP quote: blog "Enterprise Business Software and the Mixed-Up Chameleon Problem", 2026-05-29, https://blog.palantir.com/enterprise-business-software-and-the-mixed-up-chameleon-problem-f16df333bc71 : "The ERP becomes what it always should have been: the system of record for accountability, not the system of constraint for operations." - seen (via proxy).

## 7. Org structure as ordinary entities / actions - CONFIRMED (one nuance)
- https://www.palantir.com/docs/foundry/action-types/overview : quote exact (code-formatted names). Link to new Manager, notification to old and new manager seen.
- Nuance: docs say "Validate that authorized employees such as those working in human resources can perform the action." - not "only HR".
- https://www.palantir.com/docs/foundry/object-link-types/link-types-overview : "Direct Report <-> Manager" self-link on Employee, and "Employee -> Employer" between Employee and Company - seen.
- "Process definitions include tasks, transitions and teams": not verified.
- "No separate org-chart module" is flagged by the researcher as inference; keep it flagged.

## 8. Security travels with data - CONFIRMED
- https://www.palantir.com/docs/foundry/security/markings : quote exact. "Markings are a mandatory control, while roles are a discretionary control." "All resources derived from a marked file, folder, or Project will assume a Marking unless the Marking is explicitly removed."
- https://www.palantir.com/docs/foundry/security/overview : "Mandatory controls (markings, Classification-based Access Controls, and organizations) travel with each unit of data through derivation".
- https://www.palantir.com/docs/foundry/object-permissioning/object-security-policies : row / column / cell security; "independently of the permissions on the backing data source"; "These controls do not extend to downstream outputs or exports." plus recommendation to pair with markings / CBAC - seen. Note: that page describes evaluation against user markings, organizations and classification; "group attributes from SSO" wording not seen.
- Checkpoints https://www.palantir.com/docs/foundry/checkpoints/overview : "supports purpose justification and auditability" - seen.
- Approvals https://www.palantir.com/docs/foundry/approvals/overview : "Requests are persisted even if they have been completed, so you can reference them as an audit log of past decisions." - seen.

## 9. Build method: decision-focused use case - CORRECTED (details come from different pages)
- https://www.palantir.com/docs/foundry/getting-started/delivering-a-use-case : quote exact ("A use case is a time-bound effort by a dedicated team to support a specific decision-making process."). Sales-dashboard guidance is on this page.
- But "A use case is not 'integrate source system X' or 'apply ML technique Y'." is on https://www.palantir.com/docs/foundry/use-case-life-cycle/overview , which defines a use case differently: "A use case is a time-bound effort by a dedicated team to deliver new capabilities on the platform for a set of users."
- Template "[User Type] [Interface] [Decision] [Decision Inputs] [Action]" and "What is the ultimate decision being made? What are the intermediate decisions? Which users go with which decisions?" are on https://www.palantir.com/docs/foundry/use-case-life-cycle/distilling-functional-requirements .
- Sequencing ("data asset" (1) and "guided decision-making" (2) first; then model-driven workflows) is on https://www.palantir.com/docs/foundry/use-case-life-cycle/sequencing-development .

## 10. Entity modelling guidance - CONFIRMED
- https://www.palantir.com/docs/foundry/ontology/ontology-best-practices : quote exact; four prioritized principles seen; anti-pattern "Properties mapped 1:1 from source columns without business curation" seen; action types for human or agentic decisions vs pipelines for automated transformations seen.
- https://www.palantir.com/docs/foundry/ontology/ontology-design-validation ("Ontology design: Validation"): timed connected drill-down, "What do leaders repeatedly ask their teams?", run same questions with people and with AI (AIP Analyst) - seen. "Unseen" questions wording not specifically confirmed.

## 11. Agents, staged proposals, widening autonomy - CONFIRMED
- why-ontology: exact_quote seen verbatim. Also: "In the default case, these actions (like changing the status of a work order or pushing a reallocation plan) can only be staged by the AI, before being handed off to a human for final review."; "...the latitude given to AI can be expanded or contracted."; "Each constructed and deployed agent can be treated like a new team member that is gradually granted a wider purview as Onyx team members gain confidence in its performance."
- Caveat: these sentences describe a fictional illustrative company (Onyx) in the docs, not a stated platform-wide default setting.
- https://www.palantir.com/docs/foundry/agent-studio/tools : tools are Action, Object query, Function, Update application variable, Command, Request clarification, plus legacy Ontology semantic search. Action tool "can be configured to run automatically or to run after confirmation from the user."
- https://www.palantir.com/docs/foundry/agent-studio/overview : "AIP Chatbot Studio was previously known as AIP Agent Studio, and AIP Chatbots were previously known as AIP Agents."
- "Same permissions as humans": why-ontology says "Every agentic or human action depends on precise authorization grants..." - consistent, exact parity wording not seen.

## 12. OAG beyond RAG - CONFIRMED
- https://blog.palantir.com/building-with-palantir-aip-logic-tools-for-rag-oag-fdaf8938d02e , 2024-01-31. Quote exact. "LLMs are great at a lot of things - like contextual reasoning - they're not great at traditional types of computation, like forecasting or linear optimization." seen.
- "complement the non-deterministic reasoning of LLMs" seen on why-ontology docs page (full: "...operational tools which complement the non-deterministic reasoning of LLMs and multi-modal models.").
- "Coins" is not verifiable; say "uses".

## 13. 2022 RFx definition - CONFIRMED
- https://blog.palantir.com/ontology-finding-meaning-in-data-palantir-rfx-blog-series-1-399bd1a5971b , 2022-10-03, title exact, quote exact. Requirements list matches (separate pipelines and applications, Dynamic Metadata, Object Set, Object Function, Object Action, performant real-time object storage, Webhooks / write-back, enterprise security).
- "Security resident in the ontology so app builders need not re-implement it" is a paraphrase I did not see verbatim.

## 14. Bootcamps and 10-K - CONFIRMED
- 10-K PDF https://investors.palantir.com/files/2025%20FY%20PLTR%2010-K.pdf , fiscal year ended 2025-12-31, signed "Date: February 17, 2026".
- "One example of this is our use of AIP bootcamps, which allow us to deliver real workflows on actual customer data in days." - exact.
- Risk factor: "...our sales model has historically required us to spend months and invest significant resources working with customers on pilot deployments at no or low cost to them. Though we have integrated shorter, more cost-effective programs such as bootcamps, these initial deployments (including bootcamps) may result in no or minimal future revenue." - exact.
- Trademarks: "we have registered "Palantir" as a trademark in the United States and other jurisdictions. We also have registered trademarks for "Gotham," "Palantir Foundry," and our corporate logo" - seen. The word "only" is the researcher's inference (the filing lists these; it does not say no others exist).
- Bootcamp page https://www.palantir.com/platforms/aip/bootcamp/ (rendered): "From 0 to use case in 5 days."; three aims seen.
- 2026-04-28 blog: "including our AIP AgentCamps - where customers are hands-on-keyboards and achieving outcomes with AI in a matter of hours" - seen. The blog does not say AgentCamps replace or rename bootcamps; "newer name" is inference.

## 15. Elementum critique - CORRECTED (title)
- https://www.elementum.ai/blog/palantir-ontology-explained , dated July 16, 2026, author "Elementum Team".
- Actual page title / H1: "What Is Palantir's Ontology, and Where Does Your Data Actually Go?" (not "Palantir Ontology Explained: What It Means for Your Data").
- Full sentence: "The Ontology still needs its own indexed copy of the data, regardless of whose cloud that copy sits in." - exact fragment confirmed.
- "Mapping a customer's source systems into object types, link types, and actions is specialized, judgment-heavy work. Palantir's own engineers typically lead it, at least at first, and often stay involved through later workflow additions." - seen.
- Palantir counter: virtual tables + Iceberg confirmed on the multimodal-data-plane docs page (see 6). The word "federation" does not appear there.
- Caruso Medium explainer (2025-06-13): no URL supplied, not checked. Unverified.
