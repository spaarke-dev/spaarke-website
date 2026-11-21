# First-draft review notes

Draft built 2026-11-21 on `feature/website-services-page`. Use this file to record decisions from the review (task 050).

## How to view it

Run the dev server in the worktree and open `/services`; add `?audience=corporate` for the corporate view.

## Decisions to make

| # | Topic | Draft choice | Decision |
|---|---|---|---|
| 1 | Headline | "Practice law. We'll run the business." | |
| 2 | Hero image | Labeled placeholder frame | |
| 3 | "Start a conversation" destination | `/meet` | |
| 4 | "Request an assessment" and "Discuss your numbers" | `/contact` (no scenario attached) | |
| 5 | Nav link timing | "Services" added in this branch, between Platform and Why Spaarke | |
| 6 | Hub capability label "AI and transformation" | Kept from the design; the voice guide lists "transformation" as a word to avoid | |
| 7 | Link to the Spaarke Method services message | Not linked | |
| 8 | Network pairs | Six pairs | |

## Known gaps in the draft

- Sankey labels in the middle column overlap link ribbons in some configurations (carried over from the prototype).
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
