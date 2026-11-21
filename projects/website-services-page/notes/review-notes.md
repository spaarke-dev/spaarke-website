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
| 7 | Link to the Spaarke Method services message | Not linked | |
| 8 | Network pairs | Six pairs | Six pairs, generic labels, law firms and legal departments in both views with the visitor's type emphasized; "network grows" scroll interaction built (2026-11-21) |

## Known gaps in the draft

- Fixed 2026-11-21: Sankey labels were scaled down to about 8 px and sat on the flows. The diagram now draws at the container's real width with label gutters, and below 560 px it shows a labeled list under the diagram instead.
- Fixed 2026-11-21: the economics section heading now leads the section, like the others.
- Sankey transitions are not animated; the diagram redraws on each input change.
- The stat tiles use plain bars; the "illustrative line" chart form in design.md 4.3 is not built.
- No analytics events on the switch, calculator or CTAs yet.
- Copy for sections 4 to 8 and the FAQ answers are first drafts for counsel review.
- The page is `noindex` and not in the sitemap.

## Checked in the draft

- Both audiences render all eight sections; `?audience=corporate` renders the corporate view on first paint.
- The switch updates the URL and remembers the choice.
- Corporate calculator defaults show savings of $1.50M on $25.75M, matching the prototype.
- No horizontal scroll at 375 px; the network diagram switches to a stacked version on phones.
- `npm run test:services`: 18 of 18 pass, including the GUARDRAIL tests.
