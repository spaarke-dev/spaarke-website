# Task 060: Deferred extras (backlog)

**Phase:** 6 (after first launch)
**Status:** not-started (backlog)
**Estimated:** pick items one at a time
**Dependencies:** 050
**Tags:** backlog, ui, content

## Goal

Keep one list of the pieces the design describes that the draft does not build, and the content the owner set aside during review, so they can be picked up later. None of these blocks launch unless the owner says so.

## Not built yet

| # | Item | Where it is described | Notes |
|---|---|---|---|
| 1 | Fee-pressure "illustrative line" chart for the stat tiles | design.md 4.3, 6.3 | Tiles use plain bars today |
| 2 | Calculator "Compare" toggle (status quo vs MSO side by side) | design.md 7.1 | Calculator shows the MSO case only |
| 3 | Animated Sankey transitions | design.md 6.4, 7.5 | The Sankey redraws on each input change |
| 4 | Analytics events on the audience switch, calculator and CTAs | design.md 12 | No events wired |
| 5 | "Add a firm" interaction on the network diagram | design.md 6.2 | Out of scope for the draft (spec.md) |
| 6 | Hero still versus video: final choice and licensed asset | design.md 13 open item 6 | Round 2 trials a stock video comp locally; see review-notes round 2 |
| 7 | Calibrate the hero look against home and Platform | design.md 13 open item 1 | Partly done in round 2 |
| 8 | Second people-image set inside the page (for example in the approach section) | design.md 5 | Not started |
| 9 | FAQPage JSON-LD | task 052 | Only once the FAQ is back on the page |

## Hidden in review round 2 (content kept in content.ts)

| # | Item | Content key | Decision needed |
|---|---|---|---|
| 10 | "What firms gain" / "What legal departments gain" benefits, and the "Why Spaarke" differentiators list beside them | `whatIsMlo.benefits`, `whatIsMlo.benefitsTitle`, `whatIsMlo.differentiators` | Where and how to use them |
| 11 | "Every structure is tailored" subsection with the service menu table and the operator note | `howItWorks.tailored`, `howItWorks.operatorNote`, `ServiceMenu` | Whether it returns, and where |
| 12 | FAQ (six questions) | `faq` | Whether it returns; counsel reviews the answers either way |

## Steps

1. Pick an item with the owner
2. Build or restore it on a branch, check it in the browser at desktop and phone
3. Mark it done in this file

## Acceptance Criteria

- [ ] Each item is built, restored, or explicitly dropped by the owner
