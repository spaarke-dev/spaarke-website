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

- Decided 2026-11-21: MSO is spelled out as "Managed Services Organization" everywhere, matching the definition on the page (not "Managed Service Organization" or "Management Services Organization").
- The video needs a license (or a different clip) before launch; task 052 covers it.

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
