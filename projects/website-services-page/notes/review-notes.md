# First-draft review notes

Draft built 2026-11-21 on `feature/website-services-page`. Use this file to record decisions from the review (task 050).

## How to view it

Run the dev server in the worktree and open `/services`; add `?audience=corporate` for the corporate view.

## Decisions to make

| # | Topic | Draft choice | Decision |
|---|---|---|---|
| 1 | Headline | "Practice law. We'll run the business." | "Practice law. We'll run the operations." for both audiences, hero and closing (2026-11-21) |
| 2 | Hero image | Labeled placeholder frame | Exclusive stock license, picked before launch. Interim: Unsplash XjJmfN7QJj4 (Vitaly Gariev, Unsplash License) at `public/services/hero-interim.jpg`, tagged "Interim image"; task 052 swaps it out (2026-11-21) |
| 3 | "Start a conversation" destination | `/meet` | Keep `/meet` (2026-11-21) |
| 4 | "Request an assessment" and "Discuss your numbers" | `/contact` (no scenario attached) | Assessment: `/contact?reason=mlo`, preselecting a new "Managed Legal Operations" reason on the site's contact form. Numbers: `/meet` (2026-11-21) |
| 5 | Nav link timing | "Services" added in this branch, between Platform and Why Spaarke | Ship the nav link at first merge (2026-11-21) |
| 6 | Hub capability label "AI and transformation" | Kept from the design; the voice guide lists "transformation" as a word to avoid | Split into two capabilities: "AI capabilities" (a technology and functional capability) and "Business transformation" (reengineering process and the business model). "Transformation" stays, used in that specific sense (2026-11-21) |
| 9 | MSO and MLO terms | Mixed: right panel "MSO", caption "MLO takes on", network pairs "MLO" | MSO is the entity (the firm's or department's MSO, and Spaarke as MSO operator); MLO is the service package the MSO delivers. Applied across diagrams, calculator, FAQ and boundary line (2026-11-21) |
| 10 | Value and capital lines in the firm view ("Lasting value", "long-term value in the operator network", private capital note) | As drafted | Keep as written; counsel rules on them in task 051 (2026-11-21) |
| 7 | Link to the Spaarke Method services message | Not linked | Linked under the phases in section 7 with a bridging sentence (2026-11-21) |
| 8 | Network pairs | Six pairs | Six pairs, generic labels, law firms and legal departments in both views with the visitor's type emphasized; "network grows" scroll interaction built (2026-11-21) |

## Review round 2: section by section (2026-11-21)

Owner feedback items 1 to 15, applied on the same branch.

| # | Feedback | Applied |
|---|---|---|
| 1 | Remove the section nav bar and its CTA | Page bar removed (`PageBar.tsx` deleted, `anchors` dropped); sections keep a 96 px scroll margin under the site header |
| 2 | Move the audience switch below the hero text | Switch sits under the subhead |
| 3 | "Start a conversation" as a text link to `/meet` | Text link with arrow; "See how it works" now points to `#what-is-mlo` |
| 4 | Hero background video, placed like the Platform hero, with the dark glowing fade | Video behind the right 68% of the hero, a left wash into the dark page, top and bottom fades and the site's blue glow; phones dim it evenly. The clip is an unlicensed Stocksy comp (5947226): it is copied to `public/services/hero-comp.mp4` in the local worktree only, gitignored and never committed. Deployed builds have no clip, so they show the interim photo. Under reduced motion the video stays paused |
| 5 | Match title and subhead type to home and Platform | Title now uses the Platform hero spec (clamp 56 to 112 px, weight 600, -0.025em); the subhead uses the home hero's Lede (clamp 18 to 25 px), since it is a full sentence rather than Platform's one-line tagline |
| 6 to 9 | Why now: move up to section 2, white band, eyebrow spelled out, centered head, 2 x 3 stats | Done; read as two columns by three rows. Stat tiles gained a light-band palette |
| 10 | Give the profit-pool line and the bridge line their own highlighted section | New black band with a centered blue glow, the profit-pool statement large, its source, then the bridge line in light blue |
| 11 to 13 | Merge What is MLO with How it works; new title; vertical diagram | One section: "The operating model built for how legal works". Definition, MSO note and the how-it-works intro on the left; the allocation diagram on the right, client on top and the MSO below, spelled out. The boundary line stays in the section |
| 14 | Remove the "Every structure is tailored" subsection | Removed from the page; content kept (task 060) |
| 15 | Hide "What firms gain / What legal departments gain" | Hidden behind a flag, with the "Why Spaarke" list beside it; content kept (task 060) |
| FAQ | Remove or hide | Hidden behind a flag; content kept (task 060) |
| Order | Financial before network | Hero, why now, highlight, what is MLO, financial, network, approach, closing. Approach moved to a white band so two dark bands do not sit together |

Open from round 2:

- Superseded in round 3: MSO was first spelled out as "Managed Services Organization". The owner corrected it to "Management Services Organization" (see round 3, item 1).
- The video needs a license (or a different clip) before launch; task 052 covers it.

## Review round 3: section by section (2026-11-21)

Owner feedback items 1 to 12, applied on the same branch.

| # | Feedback | Applied |
|---|---|---|
| 1 | MSO stands for "Management Services Organization"; MLO is Managed Legal Operations | Corrected in the diagram, the definitions band, the FAQ answer and the content comments. Decision: MSO is spelled out as "Management Services Organization" everywhere |
| 2 | Hero video: Stocksy 5947230 | Copied locally to `public/services/hero-comp-1.mp4` (gitignored) |
| 3 | Random hero video on each load; second clip 5947223 | `hero.media.videos` holds both clips (the second is `hero-comp-2.mp4`); one is picked after mount, so server and client markup match. The gitignore now covers `hero-comp*` |
| 4 | Law firm intro for why now | Owner copy used as written |
| 5 | Legal department intro for why now | Owner copy used as written |
| 6 | Four stats in a 2 x 2 grid, more graphical, text left and chart right | Law firm: AI use (ten figures, seven filled), fee pressure (donut), insourcing (columns), AI-native capital (columns). Legal department: deployment (donut), redesign (columns), insourcing with a department headline, AI use with a department headline ("Seven in ten of your outside counsel now use AI every week"). The other two stats per audience are hidden; content kept |
| 7 | Replace the profit-pool band with a light-blue band defining MSO and MLO, per the mockup | Two term cards with the large acronym tile, the term and its definition. The MSO text is the owner's. The legal department version drops the ownership clause, since corporate arrangements have no ownership element. The MLO text is new, because the mockup repeated the MSO text: "The managed service an MSO delivers to a law firm: the technology, AI, operations, finance and administration that run the business side of legal, so lawyers can concentrate on the practice of law." Counsel reviews both. The profit-pool statement and bridge line are kept in content (task 060) |
| 8 | What is MLO: dark band; equal-size law firm and MSO blocks; no animation; functions not shown as tags; bigger services agreement; drop the hover definitions | Dark band with the site glow. The diagram runs full width under the heading, intro and boundary line. Both panels have the same height (equal grid rows). Each function is shown with an icon, its name and its one-line explanation, all visible. The build animation, Replay and hover line are removed. The services agreement is a labeled block on the spine, with "Services to the law firm" (up) and "Cost-based fee to the MSO" (down). The definition and MSO note paragraphs moved to the new definitions band |
| 9 | Remove "Legal is a business with unusual requirements" | Removed from the page; content kept (task 060) |
| 10 | Financial: law firm on the left, MSO on the right, costs shift across | The Sankey is replaced by a shift chart. Each cost line is a row; client bars grow left from the middle, MSO bars grow right. Ticking a function in the chart moves its bar across: the dashed outline is today's cost and the solid bar is the MSO fee, so the gap is the saving. Profit (firm) or savings (department) is in the bottom row |
| 11 | Bars should change size as the parameters change | All bars share one scale, so they resize with the price advantage, fee pressure, routine work shifted and the functions moved. The revenue or budget slider scales every line together, so it changes the dollar figures and the bars keep their proportions |
| 12 | Parameters on a top row, full-width chart | Sliders sit in a row across the top (three for firms, four for departments), then the chart runs full width, then the KPI cards. The function chips are gone; the tick boxes in the chart replace them |

Removed as a result: `Sankey.tsx`, `sankeyData.ts`, and the `d3-sankey` and `@types/d3-sankey` dependencies. The model tests now check that the chart rows add up to the model's fee, totals, profit and savings.

Open from round 3:

- Counsel: the MSO definition's "enable non-lawyer ownership" clause, and the new MLO and legal department definitions.
- Owner: the stat headlines rewritten in the legal department's voice (AI use and insourcing).

## Review round 4 (2026-11-21)

Owner feedback items 1 to 4, applied on the same branch.

| # | Feedback | Applied |
|---|---|---|
| 1 | The operating-model diagram: the fifth "keeps" item sat alone on its own line; add a sixth and lay them out 3 x 2. Firm sixth: "Firm name and brand"; suggest a corporate sixth | Firm: "Firm name and brand" ("The firm’s name, reputation and standing with clients stay its own."). Legal department: "Business partnership" ("The department stays the trusted legal advisor to the company’s leaders and business units."). Panels with six items sit three across |
| 2 | Corporate MSO panel 3 x 2 | Done by the same rule (six items, three across). The law firm MSO panel has eight items and stays four across |
| 3 | Corporate stat: "experimenting" becomes "POC" | "Legal departments have moved from POC to deploying AI" |
| 4 | The calculator chart was hard to follow; use stacked bars that show costs moving to the MSO and the total improving through its efficiencies | The shift chart is replaced by three stacked bars on one scale: 01 Today (every cost inside the firm or department), 02 Move functions to the MSO (the chosen functions turn blue at today’s cost, so the total is unchanged), 03 The MSO runs them at scale (the blue part shrinks by the price advantage and a dashed green segment shows the saving). Each bar shows its total and a split line. The function tick boxes sit above the bars, and a result line under them shows profit (firm) or total cost of legal (department), today against with the MSO |

Decided in round 4: the owner kept "Business partnership" as the legal department sixth item (2026-11-21).

## Review round 5 (2026-11-21)

Owner feedback items 1 to 3 (item 4 arrived empty).

| # | Feedback | Applied |
|---|---|---|
| 1 | Calculator: vertical bars, so the category labels can sit on the left | The three stages are now stacked columns on one scale: lines that stay at the bottom, lines that move above them, the saving as a dashed band on top of the third column. Each cost line is named on the left, level with its band in the first column, with its cost and "moves" if it moves; names are nudged apart so none overlap. Totals sit above the columns and each stage is described below its column. Phones drop the left names and list the lines under the chart |
| 2 | Headline: "Designed in weeks. Value delivered over years." | Changed; each sentence sits on its own line |
| 3 | Phase detail was hard to read; remove show and hide, open one phase at a time, highlighted in light blue | Each phase is a tab. The selected phase is highlighted light blue and its detail opens in a light-blue panel below, with numbered steps in larger type and the outcome beside them; the others are hidden. Arrow keys move between phases. On phones the panel opens under the selected phase |

## New firm calculator: the MSO value estimate (2026-11-22)

The owner supplied a new calculator (`notes/calculator-sample/`, with `HANDOFF.md`) and asked for "See the details" to be a separate page that opens as a modal, carrying the calculator too so it works on its own, and opening at "How the estimate works" when reached from the link. Built as task 070.

| Topic | Applied |
|---|---|
| Law firm view | The financial section shows the MSO value estimate: the headline "Run leaner, compete on technology, and build equity", the lede, firm-size presets (mid-size by default), three sliders, three objective cards, a summary line and the disclaimer. The model is ported unchanged and matches the handoff's golden values. The old firm cost calculator, the network-value line and the private capital note no longer show in the firm view (content kept) |
| Legal department view | Superseded the same day by the department estimate (task 071, below) |
| Details | `/services/estimate`, a page of its own with the calculator and "How the estimate works" (profit-per-partner waterfall, today against with the MSO, how it works, the structure, the assumptions). The inputs travel in the query string. From /services it opens as a modal over the page, scrolled to "How the estimate works"; reloading shows the full page. Esc, the close button and the backdrop close it. The modal and the section share the inputs, so a change in one shows in the other |
| Copy | As in the handoff, in US spelling ("license") |

**Needs counsel before launch (task 051):** the estimate shows equity figures (an equity stake value, the firm's 75% share of MSO profit, a 10x platform roll-up value, Spaarke's 25% stake). The design's guardrail (design.md section 9) says no equity numbers anywhere. The owner chose this calculator, so it is built as specified, and the page stays noindex. It also names the audience as US IP boutiques.

## Legal department estimate (2026-11-22)

The owner asked for the legal department equivalent of the MSO value estimate. Built as task 071.

| Topic | Applied |
|---|---|
| Legal department view | The financial section now shows the department estimate in place of the round 5 cost calculator: "Run leaner, work like a much larger team, and lock in the savings", department-size presets, three sliders (in-house lawyers, legal operations and support staff, annual legal budget), three cards (lower cost of legal, technology edge, lasting value), a summary line and a disclaimer |
| Model | New, with the same MSO levers as the law firm model. Savings come from the lower MSO fee, routine outside counsel work brought in-house with freed lawyer time, and routine work the MSO handles at half its outside cost. Mid-size: $25.0M to $23.5M, $1.47M a year (6%). Assumptions in task 071; finance to set them |
| No equity | The department owns no part of the MSO and gets no profit share. The third card is the three-year saving, Spaarke-funded deployment, the fixed fee and $0 capital. A guardrail test enforces it |
| Details | The same page and modal as the law firm estimate, with `?audience=corporate`: a savings bridge stepping down from today to with the MSO, the comparison table, how it works, the structure and the assumptions |

## Structure visual and operator network (2026-11-22)

The owner supplied two design handoffs: the MSO structure visual (`notes/mso-structure-visual/`) and the operator network section (`notes/mso-operator-network/`), the second to be converted to a dark background. Built as task 072.

| Topic | Applied |
|---|---|
| What is Managed Legal Operations | The structure visual replaces the allocation diagram: five tabs (the full picture, who owns what, who directs the work, how money moves, where value builds), a wide diagram above md and a tall one on phones, a legend and three caption cards per view. The title and lede are the handoff's ("Your firm keeps the practice. Spaarke runs the operations."); the eyebrow and the boundary line stay |
| Operator network | The handoff's hub replaces NetworkDiagram and the four blocks, on the dark band: three step tabs (1, 3, 8 members), a ring of six capabilities linked to six cards, a flywheel line and two panels. Pulses run along the spokes at full size |
| Legal department view | Both handoffs are law firm only, so the department copy is a draft: the company keeps the legal function, Spaarke owns the MSO, a fixed fee, and "upgrades and network learning" as the value flow. No equity in either section; the network's second panel is "Working with your outside firms" |
| Matched to the site | Site fonts (Inter Tight titles, Inter body, JetBrains Mono eyebrows), dark band tokens for surfaces, lines and text, the site blue for the MSO accent in place of the handoff's indigo, rounded-2xl cards, left-aligned section heads, and pill tabs styled like the Phases tabs and the audience switch. Every MSO pill is blue (the handoff's gray for department MSOs read as second-class) |
| Kept from the handoffs | The five edge colors (ownership violet, money amber, services slate, direction pink, value teal), because each is a meaning in the legend, and teal for "you" and value |
| Retired | `AllocationDiagram.tsx` and `NetworkDiagram.tsx` are no longer on the page; their content stays in `content.ts` until the owner signs off (task 060) |

Open, for the owner and counsel:

- Fee basis: **decided 2026-11-22, fair market value.** The boundary line, the money captions, the department estimate lede and details, the disclaimer, the Design phase steps and the (hidden) FAQ now say the fee is fixed and set at fair market value by an independent study, never tied to legal fees. "Below today's cost" stays as the outcome the study is expected to show. spec.md is updated to match.
- Equity copy in the law firm view ("receives equity in Spaarke", the illustrative pie) goes beyond design.md section 9, as the firm estimate does. Counsel to confirm.
- The department copy in both sections is new and needs the owner's read.

## Owner review of the structure and network (2026-11-22)

| Item | Applied |
|---|---|
| Structure diagram doing too much | Cut to the two blocks: your law firm (or legal department) and its MSO, with "Fixed fee" flowing to the MSO and "Captive services" flowing back. Removed the Spaarke operator, the other members, the equity flow, the "what the firm owns" outline, clients and partners, the direction arrow, the five view tabs, the legend and the caption cards. Other points to be reintroduced later |
| Network: numbers and descriptions | Removed the numbers (step tabs, ring and cards) and the card descriptions; the cards are capability titles only. On phones the ring is unlabeled, because the labels would be too small and the cards name each capability |
| Network: the two panels | Removed "What your firm can offer" and "What your firm owns" (and the department's "Working with your outside firms"). The network section now shows no equity pie |
| Hydration warning | `suppressHydrationWarning` on `<body>` in the root layout, so browser extensions that add body attributes (ColorZilla's `cz-shortcut-listen`) no longer raise the dev overlay |

Equity wording removed from both sections at the owner's request (2026-11-22): the "What is MLO" lede now ends "The firm puts in no cash and lowers its operating cost.", the network intro ends "each firm gets more from its MSO and can offer more to its clients", and the "more members" line ends "More to offer every client". The financial section (the MSO value estimate) still shows equity, as before.

## Owner review of the hero, stats, network and estimate (2026-11-22)

| Item | Applied |
|---|---|
| Hero subhead | Owner copy for both audiences. Law firm: "Spaarke provides the technology, team and back-office operations, at a fixed, per-unit price. Your clients, your legal judgment and your ownership stay yours." Legal department: "Spaarke gives your legal team the technology, process and capacity to meet the demands of stakeholders and deliver results the business can see and measure." |
| Fee pressure stat | Eyebrow "Pressure on effort-based fees"; caption "of legal departments expect AI-related rate cuts from their firms." |
| Insourcing stat (both views) | Caption "63% of legal departments expect to keep level or reduce outside counsel spend." The columns now show the same measure, 42% last year and 63% this year (the survey's 58% and 37% expecting an increase, inverted), so chart and caption agree |
| AI-native capital stat | Caption "Legal tech venture funding quadrupled, from $1B in 2023 to more than $4B in 2025." (two lines at desktop width) |
| Technology stat (department view) | Eyebrow "Technology cost and complexity"; caption cut to 98 characters |
| All stat tiles | Text and chart sit at the top of the card; the source is a footer across the card's full width, one line on tablet and desktop. Applied to every tile so the grid reads as one system. Shortened two source names to fit ("Above the Law"; Deloitte's survey note moved to the link's tooltip) |
| Network | Capability cards and the "See the platform" link removed. The ring keeps its labels above md; phones get a one-line list of the six capabilities under the diagram, and screen readers get the same list |
| Estimate details chart | The profit-per-partner bridge now adds the firm's MSO equity per partner (hatched violet, as in the earlier five-year chart) and a final "Profit and equity" bar, with brackets over the annual profit steps and the equity step and a two-item legend. Annual profit and a one-time stake share one axis, so the bar labels and caption say which is which. Counsel to confirm with the other equity copy |

## Owner review of "What is Managed Legal Operations" (2026-11-22, second pass)

| Item | Applied |
|---|---|
| Body (law firm) | Owner copy: non-legal operations move into a dedicated management services organization (MSO); Spaarke funds the transition, so the firm makes no upfront investment; pricing is designed to cost less per unit than doing the same work in-house. The department body follows the same wording |
| Callout (both views) | "The MSO does not practice law, share in legal fees or direct legal judgment. Its fee is fixed or per-unit, benchmarked to fair market value, and never tied to legal fees. Attorneys review all AI output." No "independent study" until one exists |
| Diagram copy | MSO subhead "Your operations, run to your standards" (both views). Law firm items: "Partners and associates" and "Paralegals and other legal professionals" replace "Lawyers and legal professionals". MSO item "Administrative support and other non-legal staff" replaces "Paralegals, assistants and docketing". Arrows: "Fixed or per-unit fee" and "Operations and technology" |
| Spaarke MSO Operator | New green box under the MSO in both views: technology and AI platform, shared services, business process transformation. No arrow. The client block now runs the full height of the MSO and operator together. Block heights follow their items, and long items wrap to a second line |

Still saying "independent study" or "fair-market-value study" elsewhere, not changed in this pass: the (hidden) FAQ answer, the estimate disclaimers and assumptions, and the Design phase step "Set the fee with an independent fair-market-value study" (a future step, so it may stand).

## Change list, Financial opportunity rows 24 to 35 (2026-11-22)

Source: the owner's `spaarke-website-change-list.md` (Downloads). Applied to the law firm estimate on /services and /services/estimate.

| Row | Applied |
|---|---|
| 24 Subhead | "Your firm moves its back office and technology into a dedicated MSO that Spaarke owns and runs. Spaarke funds the transition, and the firm stays fully lawyer-owned." |
| 25 Inputs | "Other lawyers and professionals" |
| 26 Presets | Small firm, Mid-size firm, Large firm |
| 27, 28 Card 1 | "Lower operating cost": leads with dollars saved a year, then the % lower back-office cost and the fee basis. Margin and profit per partner are out. Formulas are the current model's until the rebuilt calculator arrives |
| 29 to 31 Card 2 | Hours freed shows its assumption (170 hours per lawyer); the revenue line is out; "Technology upgrades included at no extra charge" |
| 32 Card 3 | "Share in the network's growth", "Member equity in Spaarke, earned through use", the three bullets, and "Request the equity model", which goes to the contact form (`/contact?reason=mlo`) until a dedicated gate exists. No dollar amounts, profit share or multiples |
| 33 Summary | "About $X a year in lower operating cost, plus a technology and capacity advantage." X is the fee saving from the current model. No equity figure |
| 34 Disclaimer | Larger (14 px, mid gray) under the summary, in both views. The row's "fair-market-value study that sets the MSO fee" became "the MSO fee, benchmarked to fair market value", per the owner's no-study rule. Counsel to approve |
| 35 Department calculator | Not started; copy to follow |

Open:

- "How the estimate works" (behind "See the details") still shows profit per partner, margin, the firm's 75% stake in its MSO and equity dollar figures, including the equity bar added earlier the same day. That conflicts with rows 28, 32 and 33 and with the structure section (Spaarke owns the MSO). Owner decision 2026-11-22: leave it as is until the rebuilt calculator's formulas arrive.
- Card 1's fee saving and card 2's Spaarke-funded deployment are both 10% of the MSO scope, so they show the same figure ($257k for the mid-size firm).

## Known gaps in the draft

- Fixed 2026-11-21: Sankey labels were scaled down to about 8 px and sat on the flows. The diagram now draws at the container's real width with label gutters, and below 560 px it shows a labeled list under the diagram instead.
- Fixed 2026-11-21: the economics section heading now leads the section, like the others.
- Superseded in round 3: the Sankey was replaced by the shift chart, whose bars animate as inputs change. Superseded in round 4 by the stacked bars.
- The stat tiles use a donut, ten figures or two columns (round 3); the "illustrative line" chart form in design.md 4.3 is not built.
- No analytics events on the switch, calculator or CTAs yet.
- Copy for sections 4 to 8 and the FAQ answers are first drafts for counsel review.
- The page is `noindex` and not in the sitemap.

## Checked in the draft

- Both audiences render all eight sections; `?audience=corporate` renders the corporate view on first paint.
- The switch updates the URL and remembers the choice.
- Corporate calculator defaults show savings of $1.50M on $25.75M, matching the prototype.
- No horizontal scroll at 375 px; the network diagram switches to a stacked version on phones.
- `npm run test:services`: 18 of 18 pass, including the GUARDRAIL tests.
