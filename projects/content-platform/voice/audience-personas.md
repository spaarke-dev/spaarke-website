# Audience personas

**Phase**: 0 (T04). First draft for revision in T11. **Source**: T00 §2 sketches, T01 audit, T00 §5 calendar, `/platform` and `/why-spaarke` copy.

The four readers Spaarke writes for. Real people in real jobs. Every brief picks one; the draft is written *to* that person, in their language, with the skepticisms they carry.

---

## Persona: Corporate counsel

**Slug**: `corporate-counsel`
**Role**: GC, Deputy GC, or AGC at a Fortune 1000 or upper-mid-market company (legal department of 8–60).
**Primary or secondary?**: primary

### What they're hired for
They own legal risk and the operational performance of the legal function — and outside-counsel spend, the second- or third-largest line in their function. The board expects predictability: known cost, known cycle time, no unbudgeted blow-ups. They are promoted on whether the department runs like a function the CFO can plan around.

### What they care about
- Outside-counsel spend visibility by matter, panel firm, and practice area — enough fidelity to enforce OCG in real time.
- Cycle time on workflows the business notices (NDAs, vendor contracts, M&A diligence), measured in days defensible to the COO.
- Defensible matter handoffs when an attorney leaves: deal context and open commitments stay behind.
- An AI policy answer that doesn't require re-explaining to the audit committee every quarter.
- Business alignment they can articulate to the CEO and board — legal as a function the business plans around, not a bottleneck the business routes around.

### What they don't trust
- Vendors who can't say, on the first call, how privilege and work-product are handled across tenants.
- Demos where the AI "looks right" but the demo data hides where it would be wrong.
- "Replaces lawyers" or "10x the legal department" — both read as ignorance or willingness to mislead.
- Tools that need a quarter of legal-ops time before producing any useful output.
- Products that add operational complexity (a separate identity store, a parallel portal per matter type) when the pitch was reducing it.

### Where they read
ACC Docket, Bloomberg Law, Thomson Reuters Institute, *Harvard Business Review*, LinkedIn (specific people, not hashtags).

### Vocabulary they use
matter, outside counsel, panel firm, OCG, spend management, accruals, e-billing, privilege, work product, exposure.

### Vocabulary they roll their eyes at
disrupt, transform your legal department, AI-powered, autonomous legal AI, ChatGPT for legal, replace lawyers, 10x productivity, one-click, the future of law.

### Best content angle for this persona
Operational outcomes the GC owns and the consequences when they drift: spend visibility, OCG enforcement, matter handoffs, defensible AI. Frame Spaarke as the quiet way to get there inside the Microsoft estate they already run. A named situation beats category claims.

---

## Persona: Legal operations director

**Slug**: `legal-ops-director`
**Role**: Director or Head of Legal Operations at a Fortune 1000 or large mid-cap; reports to the GC, often dotted-line to the CFO.
**Primary or secondary?**: primary

### What they're hired for
They run the operating system of the legal function: intake, matter management, e-billing, vendor management, the technology stack, and the metrics that defend the budget. Usually the only person whose full-time job is making legal measurable — and the one scarred by the vendor that promised eight weeks and delivered eleven months.

### What they care about
- Matter-cycle time and intake throughput chartable against last quarter, not a 2022 industry benchmark.
- E-billing that catches OCG violations on the way in, not after invoice approval.
- Reporting they can hand to the GC without three days of cleanup.
- An integrated short list of systems, not fourteen tools each owned by a different attorney's preference.
- A platform that integrates with Microsoft 365 — Teams, Outlook, SharePoint, Entra — rather than another standalone destination users have to be trained into.

### What they don't trust
- Vendors who quote implementation timelines without asking about existing matter taxonomy or e-billing.
- "Workflow automation" demos that paper over data sitting in seven shapes across three databases.
- AI layered on fragmented data — they have lived "fragmented answers, faster" and can spot it from the demo.
- "Integration" that turns out to mean an iPaaS connector and a quarterly batch sync.
- AI vendors who don't understand real legal workflows — products built by people who have never sat through an intake-routing review or an OCG dispute.

### Where they read
CLOC (community Slack as much as the conference), ACC Legal Operations, Artificial Lawyer, *Legaltech News*, Thomson Reuters Institute, the LinkedIn legal-ops community.

### Vocabulary they use
intake, matter taxonomy, e-billing, OCG, AFAs, realization, matter lifecycle, workflow orchestration, spend analytics, system of record.

### Vocabulary they roll their eyes at
synergies, paradigm shift, AI-powered everything, frictionless, seamless, end-to-end, low-code magic, holistic, leverage (as a verb), unlock.

### Best content angle for this persona
Operational rigor written like a peer, not a vendor. Specific problems — billing-compliance enforcement, intake routing, matter handoffs, taxonomy drift — outperform transformation framing. They will read 1,500 words on OCG enforcement intelligence; not 800 on how AI is changing legal.

---

## Persona: Legal-technology CIO

**Slug**: `legal-tech-cio`
**Role**: CIO, Director of Legal Technology, or enterprise architect with the legal portfolio. Signs off before legal buys anything touching identity, data, or the Microsoft tenant.
**Primary or secondary?**: secondary

### What they're hired for
They keep the legal technology estate compatible with enterprise architecture, security, and identity standards: no shadow SaaS, no parallel identity stores, no AI pulling privileged content into a vendor's training pipeline, no integration bypassing Graph or Purview.

### What they care about
- Tenant isolation and data-residency answers that survive a third-party audit.
- Identity through Entra, mirroring the enterprise rather than a vendor's parallel user model.
- Microsoft-native architecture — Dataverse, SharePoint, Purview, Power Platform, Copilot Studio.
- A clear AI-grounding story: where the model runs, what it sees, what's logged, what isn't retained.
- Reduced technology sprawl — fewer SaaS silos, fewer shadow tools, an extensibility model that fits the platforms enterprise architecture has already standardized on.

### What they don't trust
- Black-box AI with no documentation of what data leaves the tenant.
- "Microsoft-integrated" claims that mean OAuth and an outbound webhook.
- Vendors who can't answer Purview, sensitivity-label, or DLP questions without a security-team follow-up.
- Multi-tenant SaaS for legal data when everything else moved to single-tenant five years ago.
- Disconnected AI systems that promise governance but ship outside the tenant's identity, audit, and retention boundaries.

### Where they read
Microsoft Learn and architecture guidance, Microsoft Tech Community blogs, Gartner and Forrester (when forwarded by procurement), CIO.com, Azure and Power Platform community blogs.

### Vocabulary they use
tenant, single-tenant, Entra, Microsoft Graph, Purview, sensitivity labels, DLP, Dataverse, conditional access, blast radius, residency.

### Vocabulary they roll their eyes at
AI-powered, low-code magic, autonomous, seamless integration, enterprise-grade (as marketing), zero-trust (as marketing), revolutionary, military-grade encryption.

### Best content angle for this persona
Architectural pieces written for an architect — tenant model, identity, grounding, what data crosses what boundary. `why-we-built-on-microsoft` and `tenant-dedicated-deployment` are the template: defensible technical claims with structural reasons.

---

## Persona: Law-firm operations leader

**Slug**: `firm-operations-leader`
**Role**: Managing Partner, COO, or Director of Practice Management at a 20–500 attorney firm.
**Primary or secondary?**: secondary

### What they're hired for
They are responsible for the firm running profitably: realization, utilization, staffing leverage, OCG compliance, and the technology behind it. They sit on the receiving end of corporate-counsel's OCG demands and must deliver without eroding partnership economics.

### What they care about
- Realization against client OCG terms — variances explained without a week of timekeeper reconciliation.
- Staffing leverage the firm's matter and time data actually supports, not what partners assert.
- Client-collaboration tools that don't force corporate-counsel into a separate portal per firm.
- Service-delivery quality on matter execution — the firm's reputation rests on the work, not on how cleverly the time was logged.
- Operational efficiency that protects partnership economics rather than eroding them — modernization that improves margin, not one that quietly compresses it.

### What they don't trust
- Vendors who treat firms as budget holder and corporate counsel as user, when the economics are the inverse.
- Productivity narratives that assume the firm wants to bill fewer hours.
- Client portals that require firm timekeepers to enter time twice.
- "Disrupting Big Law" pitches when the firm is, structurally, what's being disrupted.
- Corporate-counsel AI initiatives positioned only as a fee-reduction mechanism — the framing that treats the firm as a cost line, not a service partner.

### Where they read
Law.com, *American Lawyer*, *Legaltech News*, BTI Consulting reports, ALA materials, LinkedIn feeds of specific firm-operations practitioners.

### Vocabulary they use
realization, utilization, leverage, timekeeper, matter execution, client OCG, billing guidelines, AFAs, fee earner, originating partner, cross-staffing.

### Vocabulary they roll their eyes at
disrupt Big Law, the death of the billable hour, replace firms, eliminate legal labor, commoditize lawyers, the future is fully automated.

### Best content angle for this persona
The shared-platform argument — Spaarke is a system both sides can run on, so the firm is not the obstacle to the client's operational ambitions. Frame OCG compliance and AI as *joint* capabilities. Realistic about firm economics; never anti-firm.

---

## Primary vs. secondary

**Primary**: `corporate-counsel`, `legal-ops-director`. Most pieces written for them.

**Secondary**: `legal-tech-cio` for architecture, deployment, and security (about one in five blog posts, one in four white papers); `firm-operations-leader` for shared-platform and OCG-collaboration topics.

The brief template's `audience` defaults to `corporate-counsel` unless the topic obviously belongs elsewhere. When a piece has both a primary and secondary audience, the brief names both; the draft is written to the primary, with the secondary as sanity check.

---

*Locked 2026-05-07 — see git log for history.*
