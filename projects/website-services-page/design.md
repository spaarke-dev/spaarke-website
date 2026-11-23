# Spaarke Managed Legal Operations (MLO): Website Page Design

Status: draft v2, revised 2026-11-21 for the site build (v1 for discussion, 2026-11-20)
Scope: one marketing page at `/services` (nav label "Services") presenting Spaarke Managed Legal Operations to two audiences, law firms and corporate legal departments, with a page-wide audience toggle.
Out of scope: ethics and regulatory strategy, entity structure, equity mechanics (see Guardrails).
Companion files: `spec.md` (implementation spec), `plan.md`, `tasks/`, `prototype/` (the React and Vite prototype this design shipped with), `notes/prototype-handoff.md`.

> **Public repo.** This repository is public. Competitive notes and references to private project documents were moved to the private archive (`spaarke-research/2026-11-services-page/README.md`) on 2026-11-21. Keep strategy, prospect names and private file names out of this folder.

---

## 0. Site fit (added in v2)

This section records how the design maps onto the existing Spaarke site, so the build follows the site rather than the prototype shell.

- **Route and nav.** The page lives at `/services`. The nav label is "Services", placed between Platform and Why Spaarke. The page title and H1 use "Managed Legal Operations".
- **Header.** The site's global header stays as it is. The page adds its own sticky bar directly under it, holding the section anchors, the audience switch and the primary CTA (section 3).
- **Brand tokens** (resolves v1 open item 5). Use the site's v2 tokens in `src/app/globals.css`:
  - Surfaces: near-black `#0a0a0a` (dark sections), warm cream `#f6f6f4` (light sections), soft blue `#ebf2ff` with the site's blue gradient (one feature section), black `#000000` with the radial blue glow (closing).
  - Accent: the CTA blue `#5078DC` and glow blue `#82A5EB`. In the diagrams this is the operator (MLO) color; the firm or department side is neutral gray.
  - Positive values (profit, savings) use one muted green. The spectral brand colors stay in the logo and are not used for data.
  - Type: Inter Tight for headings, Inter for body text, JetBrains Mono for eyebrows, source lines and small labels.
- **Section rhythm.** Alternate dark and light bands, as the Platform page does: hero dark, section 2 cream, section 3 dark, section 4 soft blue, section 5 dark, section 6 cream, section 7 dark, FAQ cream, closing black.
- **Components.** Build sections from the site primitives (`Slab`, `Shell`, `Eyebrow`, `Heading`, `Lede`, `Button`). Copy lives in one typed content file so wording changes do not touch layout.
- **Copy rules.** Follow `content-platform/voice/` (no em dashes, no AI-sounding constructions, US spelling) and run `npm run voice:lint` on the content file. Do not lead with Microsoft; the platform link goes to `/platform`.
- **Indexing.** The page is `noindex` and left out of the sitemap until counsel has reviewed the copy and the function labels.

---

## 1. Positioning and terminology

**Core idea.** Legal is a business with unusual requirements. Generic outsourcing and generic MSOs were not designed for them. Managed Legal Operations is our approach to meeting those requirements.

- **MSO** (Managed Services Organization) is the *type of entity*. It runs the non-legal side of a practice under a services agreement.
- **MLO** (Managed Legal Operations) is the *service the MSO provides*. It is the operating model, the technology and the shared expertise.
- Use each term in its own context (owner decision, 2026-11-21). "MSO" names the entity wherever the page means an organization: the firm's or department's MSO, and Spaarke as the MSO operator. "MLO" names the service package the MSO uses to deliver legal operations. Diagrams, calculator labels, the boundary line and the FAQ refer to the MSO; the offer, the section names and the closing refer to Managed Legal Operations.
- AI and transformation are separate capabilities. AI is a technology and functional capability; transformation is the reengineering of business processes and of the firm's or department's business model. AI can help bring transformation about, but the page never merges the two.

**The unique requirements** (the "why legal is different" block, used in section 2 and revisited in 4):
- Professional independence: legal judgment stays with lawyers.
- Privilege and client confidentiality shape what data and staff can move.
- Matter-based economics: work is priced and tracked per matter, not per seat.
- Fee rules: what a firm may pay a service provider is regulated.
- Partner compensation and succession are unlike a normal company's.
- Billing models under pressure (hourly and fixed fees that track human effort).

**What differentiates Spaarke** (supporting strip, not a headline):
- Technology-led: AI and legal technology platform sit inside the operating model.
- Serves both law firms and corporate legal departments, with a different configuration for each.
- Firm-specific design: every structure is tailored to the client's goals and requirements.
- A network: firms build long-term value in the operator network.
- Capital is optional. The page may mention private equity as a possible source of capital or an exit route, never as a requirement.

---

## 2. Audience toggle

**Control.** One sticky page-wide switch: **Law Firm | Corporate**. Not per section, so the page can never show a mixed state (for example firm economics beside a corporate structure).

**Behavior.**
- Default: Law Firm. Honor `?audience=corporate` and `?audience=firm` so campaigns and emails land on the right view. The server reads the parameter, so the first render is already correct.
- Remember the choice (localStorage, wrapped in try/catch; fall back gracefully). A URL parameter wins over the remembered choice.
- Switching animates content in place with a short cross-fade (about 250 ms) and does not scroll the page.
- Respect `prefers-reduced-motion` (swap instantly).
- Changing the switch updates the URL (`replaceState`) so the view is shareable.

**What flips:**

| Section | Shared | Flips |
|---|---|---|
| 1 Hero | Headline, imagery | Subhead and CTA |
| 2 What is MLO | Definition, "why legal is different" | Benefits list, one example |
| 3 Why now | Section frame | Stat set and chart emphasis |
| 4 How it works | Diagram component | Function lists, fee language |
| 5 Operator and network | Hub diagram | Who is on the spokes, capability emphasis |
| 6 Financial opportunity | Sankey and calculator component | Model, inputs and outputs, value story |
| 7 Design, implement, operate | Three-phase frame | Phase detail |

---

## 3. Page architecture

1. Hero
2. What is Managed Legal Operations
3. Why MLO, why now
4. How MLO works: the functional structure
5. The operating company and the MLO member network
6. The financial opportunity
7. Designing, implementing and operating MLO
8. Closing CTA, short FAQ, disclaimers footer

Sticky page bar (under the site header): section anchors, the audience switch, primary CTA ("Start a conversation"). On phones the anchors collapse and the bar keeps the switch and the CTA.

---

## 4. Section specs

### 4.1 Hero
**Goal.** Make the human side of managed services felt in two seconds. Follow the humanized-AI approach of Harvey, Legora and similar companies. (Not yet reviewed; see Open items.)

**Visual.** One large, full-bleed photograph of real people working in a relationship: a lawyer with a client, and an operations teammate working alongside them, clearly sharing the load. Warm natural light, candid framing, working environment (not a stock boardroom). No robots, glowing networks or handshakes. See section 8 for sourcing. Until the photograph exists the page shows a clearly labeled placeholder frame.

**Headline.** "Practice law. We'll run the operations." (owner decision 2026-11-21, both audiences). Candidates considered: "Practice law. We'll run the business.", "Run legal like a business.", "Legal, operated."

**Subhead by audience.**
- Firm: "Managed Legal Operations that gives your lawyers the technology, team and economics of a much larger firm, and leaves your clients, your judgment and your practice yours."
- Corporate: "Managed Legal Operations that gives your legal team the AI, technology and operating discipline to do more, at lower cost, with privilege and control intact."

**CTA.** "Start a conversation" (primary), "See how it works" (scrolls to section 4).

### 4.2 What is Managed Legal Operations
**Content.**
- Plain-language definition: three lines.
- One sentence on MSO versus MLO (see section 1).
- Short "why legal is different" row: six icons with one-line captions (requirements list in section 1).
- Benefits, 4 to 6 bullets.

**Benefits by audience.**
- Firm: lower cost to deliver each matter; technology that keeps pace with AI-native competitors; lawyers freed from running the business; capacity to grow; a way to build lasting value in the practice's operations.
- Corporate: lower cost per matter; less dependence on outside counsel for routine work; access to legal AI and operations technology that is hard to buy and integrate through normal IT channels; stronger reporting and control; risk reduction.

**Visual.** Simple split graphic: "The practice of law" (judgment, clients, privilege) and "The business of law" (everything that runs it), joined by a services agreement line. This sets up section 4.

### 4.3 Why MLO, why now
**Goal.** Prove the pressure is structural, using six stat tiles, one per theme.

**Chart style (McKinsey-like).**
- Action titles: each chart's title states the takeaway ("Seven in ten attorneys now use AI weekly"), not the topic.
- One restrained palette: a single accent color for the highlighted data, neutral grays for context.
- Direct labels on bars and lines instead of legends; minimal or no gridlines; light axis.
- Source line under every chart, with survey name, date and sample.
- Large number plus small chart, never chart junk. Animate once on scroll-in (bars grow, lines draw), 600 to 800 ms, no looping.
- Each tile links to its source.

**Six themes and candidate stats** (see section 10 for sources and status):

| Theme | Candidate stat | Chart form |
|---|---|---|
| Technology is transforming practice | 70% of law-firm attorneys use AI at least weekly; 61% of legal departments in AI deployment phases | Two big-number tiles with a thin bar |
| New service delivery dynamics | AI-native firms and legal tech funding growth (about $1B in 2023 to over $4B in 2025, per Gavel) | Column chart, two to three points |
| Downward pressure on effort-based fees | AI pressures the billable hour; fixed fees tied to human effort face repricing | Illustrative line: price per matter falling while cost holds flat |
| Cost and complexity of technology | Value comes mostly from workflow redesign, which small organizations cannot fund alone | Stacked bar: with versus without redesign |
| Competition from AI-native firms | Funding, pricing and unit-economics claims from AI-native firms | Comparison bars |
| Clients re-patriating work | Share of in-house teams cutting outside counsel work; expectations for outside counsel spend fell | Paired bars: last year versus this year |

**Toggle.** Firm view leads with fee pressure and competition. Corporate view leads with insourcing, budget pressure and the build-versus-partner problem. Keep one nuance tile in both views: AI reallocates the profit pool rather than compressing it uniformly (Stout and Piper Sandler), so the page does not read as alarmist.

**Bridge line at the end.** "The firms and teams that win will not just buy AI tools. They will redesign how legal is operated."

### 4.4 How MLO works: the functional structure
**Goal.** Show, at a glance, what stays with the lawyers and what the MLO takes on.

**Diagram** (based on the concept sketch supplied; labels are placeholders to refine).
- Two rounded panels, left "Law Firm" and right "MSO", with a thin connector between them labeled "Services agreement".
- Items build in one at a time as the section scrolls into view (stagger about 120 ms), left first, then right. A replay button and a pause under reduced motion (show final state).
- Hover or tap an item for a one-line explanation.

**Firm view, draft labels.**
- Law firm keeps: partners, associates, client relationships, client data, billings and revenue, partner and professional compensation.
- MSO takes: non-attorney staff, technical staff, IT systems, accounting and finance, marketing, HR and talent, facilities and vendors, legal technology and AI.

**Corporate view, draft labels.**
- Legal department keeps: lawyers and privileged work, legal strategy, outside counsel relationships, company data, decisions and sign-off.
- MLO takes: legal operations, matter and spend management, contract operations, vendor and panel management, technology and AI platform, reporting and benchmarking.

**Label caution.** Some functions are hybrid in practice (for example client-facing admin, IT that touches client data, billing roles). Counsel must confirm the placement of each label before launch.

**Copy points.**
- "Every structure is tailored." Show a small service-menu graphic: three different firms with different checked items.
- "Every MSO is operated by Spaarke." Link to section 5.
- Restate the boundary in one line: the MLO does not practice law or direct legal judgment, and its fee is never tied to legal fees.

### 4.5 The operating company and the MLO member network
**Goal.** Show Spaarke as the central center of excellence serving many MSOs.

**Diagram** (based on the network sketch supplied).
- Large central circle: "Spaarke: MSO operator".
- Capability labels inside: Technology platform, AI capabilities, Business transformation, Shared services, Employment services (PEO), Best practices and playbooks, Vendor and partner agreements.
- Around it, six pairs of boxes: client | MSO, each pair on a line out from the hub (MSO nearer the hub). Both views show law firms and legal departments together, generically labeled "Law firm" and "Legal department"; the visitor's own type comes first and is emphasized (owner decisions 2026-11-21). Gray thin line = governed services agreement. Blue line = operator services to the MSO.
- Animation: "the network grows" on scroll (owner decision 2026-11-21: build it). Pairs join one at a time as the visitor scrolls through the section and the ring re-balances to stay evenly spaced; a subtle pulse travels outward along the blue lines. Under reduced motion the full network shows with no pulse.
- Legend to explain line colors.

**Copy blocks.**
- Center of excellence: playbooks, standards, training.
- Technology: one platform instead of a dozen vendors per firm.
- Shared services: scale purchasing and operations.
- Network learning: what works at one MLO benefits the others (benchmarking only in aggregate and subject to counsel review).
- Corporate view: a company and its outside firms can work on the same platform, which reduces re-keying and improves visibility.

### 4.6 The financial opportunity
**Goal.** Let a visitor see, in their own terms, how moving functions changes cost, capex, opex and profit. This is the signature interactive of the page. Full spec in section 7.

**Narrative.**
- Firm: moving operating functions to an MLO can lower opex, convert hard-to-fund technology capex into a predictable service cost, and raise profit per partner. Over time, the firm builds long-term equity value in the operator network. **No numbers, ratios or terms for equity.**
- Corporate: cost savings and access to technology. No equity message.
- Network value: each MLO that joins increases purchasing power, learning and capability for all.

**Capital note.** One sentence: private capital may be available for firms that want it as a growth or exit option. Keep it factual, no promises.

### 4.7 Designing, implementing and operating MLO
**Layout.** Horizontal three-phase timeline. Each phase opens to a short list and an outcome.

1. **Design.** Goals and baseline; choose the services; fix the fee method on an independent benchmark; ethics and regulatory review.
2. **Implement.** Set up the MLO; transition people and technology; run old and new side by side before cutover.
3. **Operate.** Service levels and reporting; continuous improvement from the operator's center of excellence; annual governance review.

**Tagline idea.** "Designed in weeks. Judged over years."

**CTA.** "Request an assessment."

### 4.8 Closing
Closing CTA, a four-to-six question FAQ (What is MLO? Does the MLO practice law? How are fees set? Who owns what? How long does it take? How is data protected?), and a full disclaimer footer.

---

## 5. Visual system

- **Brand.** The site's v2 tokens, as listed in section 0.
- **Tone.** Calm, confident, editorial. Generous whitespace. Large type with one idea per screen.
- **Diagrams.** Flat, rounded rectangles, thin lines, one accent color for the operator (CTA blue), neutral for the firm or client side. Same visual language across sections 4, 5 and 6 so they read as one system.
- **Motion.** Purposeful and short. Build, connect, count. No looping or parallax-heavy effects. Every animation has a reduced-motion final state.
- **Photography.** One hero image; consider a small second set of people images in section 7. Consistent grade across them.
- **Responsive.** Diagrams collapse to stacked cards on mobile. Sankey becomes a vertical two-lane view. The calculator becomes a step flow.

---

## 6. Interactive components

The site adds one dependency for this page (`d3-sankey`, layout only). Diagrams and stat charts are hand-built SVG and CSS, animated with CSS transitions and an IntersectionObserver, so no chart or motion library is added.

### 6.1 Functional allocation diagram
- React component driven by a data file (arrays of functions per side per audience) so counsel can change labels without code changes.
- Animation: CSS transitions with a per-item delay, triggered by IntersectionObserver.
- States: build, hover or focus detail, replay.

### 6.2 Operator network diagram
- SVG, data-driven so the number of pairs can change.
- Animated line draw (stroke-dashoffset) and a traveling pulse.
- Optional "add a firm" interaction.

### 6.3 Stat charts
- Hand-built SVG or CSS bars styled to the principles in section 4.3.
- Each chart ships with a text alternative and a source link.

### 6.4 Sankey and calculator
See section 7. The prototype's model (`prototype/src/components/MloCalculator/model.ts`) and its tests carry over unchanged in behavior. The interaction model: sliders and option chips in, itemized result and headline numbers out.

---

## 7. Financial opportunity: Sankey and calculator

### 7.1 Layout
- **Left panel: inputs.** A few sliders and option cards.
- **Center: Sankey.** Redraws live as inputs change.
- **Right or bottom: results.** Four headline figures with deltas versus baseline: Revenue, Opex, Capex, Profit (plus margin).
- A "Compare" toggle shows baseline versus with-MLO side by side.

### 7.2 Law firm model (illustrative)
**Inputs** (sensible defaults, all adjustable):
- Number of lawyers, or annual revenue.
- Cost structure by category as % of revenue: non-attorney staff, technology, occupancy and facilities, finance and administration, marketing, other.
- For each function category: **stays with firm / moves to MLO** (toggle; drag a card between lanes as an enhancement).
- MLO unit-cost advantage versus the firm's internal cost, as a percent range.
- Technology investment the firm would otherwise fund itself (capex).
- Scenario: Baseline, or Fee pressure (revenue falls by a chosen percent).

**Sankey structure.**
- Source: Revenue.
- Middle: cost categories, each colored by where it sits (firm lane or MLO lane).
- Sink: Profit, and "MLO service fee" flowing to the MLO lane, which splits into the MLO's functional costs.
- Moving a function relabels its node from firm to MLO, and the flow reroutes through the service fee.

**Center numbers.** Revenue, Opex, Capex, Profit. Capex that the firm no longer funds shows as a smaller capex number and a service fee inside opex. Highlight this ("technology moves from a capital project to a predictable operating cost").

**Rules baked into the model (compliance).**
- The MLO fee is computed as units of service times a unit price (per-unit or cost-plus). **It is never a percentage of revenue, legal fees or profit**, and the UI never offers that option.
- Revenue changes only through a stated assumption (capacity or fee-pressure scenario), never as a direct effect of the fee.
- No equity values, returns or terms anywhere in the model.

### 7.3 Corporate model (illustrative)
**Inputs.**
- Annual legal budget; split between outside counsel, internal team and operations or technology.
- Share of routine work that could move to the MLO's technology and services.
- Functions moved (legal ops, contract ops, matter and spend management, reporting).
- MLO efficiency assumption.

**Sankey structure.** Legal budget flows to outside counsel, internal team, operations and technology, and the MLO; savings appear as a distinct flow.

**Outputs.** Total cost of legal, outside-counsel spend, cost per matter, capex avoided. No profit or equity.

### 7.4 Calculator guardrails
- Every number is labeled **Illustrative**, with a one-line assumptions note and a "not a projection or offer" disclaimer.
- Show ranges where possible.
- Defaults and ranges come from finance and counsel, not from marketing copy.
- No collection of personal data inside the calculator. A "Discuss your numbers" CTA goes to the `/meet` booking page (owner decision 2026-11-21; no scenario is carried over).

### 7.5 Technical notes
- Pure client-side calculation, deterministic function, unit tests for the model.
- Keyboard accessible sliders and toggles; Sankey has a table alternative.
- Debounce redraw; animate node and link transitions about 300 ms.

---

## 8. Hero image sourcing

**Goal.** A distinctive image that competitors will not also use, and that does not look like AI.

**Decision (2026-11-21).** Option 2, an exclusive or buyout stock license, picked before launch. Until then an interim Unsplash photo (XjJmfN7QJj4, Vitaly Gariev, Unsplash License) stands in with an "Interim image" tag; task 052 removes it.

**Options, in order of recommendation.**
1. **Commissioned photoshoot.** Hire a documentary-style photographer, cast real professionals (or your own team), shoot in a real office. You own or exclusively license the result, which is the best way to avoid a lookalike. Budget more than stock, less than a major campaign.
2. **Exclusive or buyout license from a curated library.** Curated agencies such as Stocksy and the premium tiers of Getty offer extended or exclusive licenses that take the image out of circulation. Ask for the exclusive or buyout license in writing and confirm the model releases cover commercial web use for the term.
3. **AI-assisted.** Possible, but risky for this brief. Faces, hands and offices still tend to read as synthetic, and in the US, purely AI-generated imagery generally has no copyright protection, so you cannot stop others from copying it. If used, limit it to backgrounds or abstract elements and retouch heavily by hand; do not use it for the lead human image.

**Brief for the photographer.**
- Two or three people at work in a collaborative moment, not posed.
- Shows both a legal professional and an operations professional.
- Natural light, real workspace, shallow depth of field, diverse and non-clichéd casting.
- Shoot a vertical and a horizontal version, plus a few detail shots for section 4.7.

(These sourcing notes come from general knowledge, not fresh research. Confirm current license terms with the vendor.)

---

## 9. Guardrails

- **Equity.** Describe how firms build equity in the operator network. Give no numbers, percentages, vesting terms or return claims anywhere (copy, charts, calculator).
- **Corporates.** No equity. Value is cost savings and technology access.
- **Practice agnostic.** No IP-specific wording in headlines or core copy. IP may appear later as an example or case study.
- **Boundary language.** Present wherever the structure is explained: the MLO does not practice law, share in legal fees or direct legal judgment.
- **Fee language.** Fees are fixed, per-unit or cost-plus at benchmarked fair market value; never tied to legal fees.
- **PE mention.** Allowed as a possible source of capital or exit. Factual, no solicitation.
- **Claims.** Every statistic carries its source and date. Vendor-sourced figures (for example Axiom) are labeled as such.
- **Regulatory and ethics strategy.** Out of scope for this page and this document. Counsel reviews final copy before publication.
- **Disclaimer footer.** Not legal advice; not an offer of securities; illustrative figures.

---

## 10. Statistics bank

Status key: **R** = retrieved as a search snippet; verify against the primary report before publishing. **D** = taken from a secondary citation in internal strategy notes; find and verify the primary source. **P** = from a private project document; find a public primary before quoting. The private sources are listed in the private archive.

| Stat | Source | Status |
|---|---|---|
| 70% of law-firm attorneys use AI at least weekly | Law360 Pulse 2026 AI Survey, https://www.law360.com/legalindustry/articles/2454764 | R |
| 61% of legal departments in AI deployment phases; 10% fully embedded (121 senior legal leaders, Apr to May 2026) | Deloitte Legal, https://www.deloitte.com/uk/en/about/press-room/ai-set-to-reshape-legal-work-law-firm-pricing-and-legal-careers.html | R |
| AI is pressuring the billable hour as clients look for time savings to match cost savings | Bloomberg Law, https://news.bloomberglaw.com/legal-ops-and-tech/law-firms-adopt-ai-tools-at-unheard-of-pace-as-enthusiasm-grows | R |
| Legal departments expecting to raise outside counsel spend: 58% last year, 37% this year (135 corporate departments) | Above the Law, citing a corporate law department survey, https://abovethelaw.com/2025/12/biglaws-worst-enemy-isnt-ai-its-clients-using-ai-to-stop-paying-them/ | R |
| 80%+ of legal departments plan to bring significant law-firm work in-house or to ALSPs within 24 months | Axiom 2026 GC Survey (vendor-sourced), https://www.axiomlaw.com/resources/articles/gc-survey-report | R |
| Corporate teams expect the biggest AI gains, though optimism rests more on expectation than on results seen | Bloomberg Law, https://news.bloomberglaw.com/states-of-play/corporate-teams-expect-an-edge-over-law-firms-on-ai-savings | R |
| AI reallocates the law-firm profit pool rather than compressing it uniformly | Stout and Piper Sandler, law firm MSO white paper | P |
| 54% of in-house teams cut work sent to outside counsel because of AI; another 44% plan to within a year | Everlaw In-House Innovation Report | D |
| 67% of IP professionals considering or planning reduced legal spend because of AI; 77% expect AI to disrupt traditional IP supplier models | Legal 500 2026 (IP-specific; use only as an example) | D |
| Legal tech venture funding about $1B (2023) to over $4B (2025) | Gavel | D |
| End-to-end workflow redesign cuts cost about 60% versus under 20% without it; only 37% report positive EBIT impact from AI | BCG and McKinsey | D |
| 36 legal MSO transactions Jan to Sep 2026 | Legal MSO transaction market survey | P |

---

## 11. Competitive notes

Moved to the private archive (`spaarke-research/2026-11-services-page/README.md`, section 1). The finding that shapes this page: no current legal MSO addresses corporate legal departments, and none puts technology and AI at the center of the offer or runs a cross-practice network.

---

## 12. Build notes

- Stack: the site's Next.js App Router with Tailwind v4. The page is a server component; the audience provider, toggle, diagrams and calculator are client components.
- Content and diagram data live in one typed TypeScript file for counsel edits.
- Performance: no new chart library; the calculator and Sankey are code-split so they do not block first paint; hero image under 250 KB (AVIF/WebP, responsive sizes via `next/image`).
- Accessibility: WCAG 2.2 AA; keyboard operable toggle, sliders and diagrams; reduced-motion; text alternatives and data tables for every chart and diagram.
- SEO: use "managed legal operations" and "legal MSO" in headings and metadata; structured FAQ (FAQPage JSON-LD) once the page is indexed.
- Analytics: toggle usage, section reach, calculator interactions, CTA clicks (no personal data in the calculator), through the site's existing analytics layer.

---

## 13. Open items

1. Review Harvey and Legora (and similar) site photography in a browser to calibrate the hero look.
2. Final function labels for the allocation diagram, reviewed by counsel (firm and corporate versions).
3. Calculator defaults and ranges, set with finance.
4. Which stats to feature; verify primaries for items marked R, D and P.
5. ~~Brand tokens for color and type.~~ Resolved in section 0: the site's v2 tokens.
6. Decision on a hero video loop versus still image.
7. CTA destination: decided 2026-11-21. "Start a conversation" and "Discuss your numbers" go to `/meet`; "Request an assessment" goes to `/contact?reason=mlo`, which preselects the new "Managed Legal Operations" reason on the site's contact form.
8. Headline: decided 2026-11-21. "Practice law. We'll run the operations." for both audiences ("the business" read to in-house teams as their company).
9. How this page relates to the Spaarke Method article: decided 2026-11-21. Section 7 links to it under the phases, with one sentence that places the two: these three phases stand up and run the MSO, and inside the MSO the technology and AI work follows the Method's five phases with legal engineers.
10. When to add the nav link to production: decided 2026-11-21, with the first merge.
