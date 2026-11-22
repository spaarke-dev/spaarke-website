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
| Legal department view | Unchanged: the round 5 cost calculator. The new model is about partners and firm equity, and the design keeps equity out of the corporate view |
| Details | `/services/estimate`, a page of its own with the calculator and "How the estimate works" (profit-per-partner waterfall, today against with the MSO, how it works, the structure, the assumptions). The inputs travel in the query string. From /services it opens as a modal over the page, scrolled to "How the estimate works"; reloading shows the full page. Esc, the close button and the backdrop close it. The modal and the section share the inputs, so a change in one shows in the other |
| Copy | As in the handoff, in US spelling ("license") |

**Needs counsel before launch (task 051):** the estimate shows equity figures (an equity stake value, the firm's 75% share of MSO profit, a 10x platform roll-up value, Spaarke's 25% stake). The design's guardrail (design.md section 9) says no equity numbers anywhere. The owner chose this calculator, so it is built as specified, and the page stays noindex. It also names the audience as US IP boutiques.

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
