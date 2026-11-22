# Services Page (Managed Legal Operations): AI Implementation Specification

> **Status**: Ready for Implementation (first draft in progress)
> **Created**: 2026-11-21
> **Source**: `design.md` (v2) and the prototype in `prototype/`

## Executive Summary

Add a `/services` page, labeled "Services" in the site nav, that presents Spaarke Managed Legal Operations (MLO) to law firms and to corporate legal departments. A page-wide audience switch (Law Firm | Corporate) changes the copy, the diagrams and an interactive cost calculator so each visitor sees the offer in their own terms. The page follows the site's existing design system and keeps the compliance guardrails set in the design (no equity figures, fixed fees set at fair market value (owner decision 2026-11-22; the draft said cost-based), illustrative labeling, boundary language).

## Scope

### In Scope
- New route `src/app/services/page.tsx` with eight sections (design.md section 3).
- Audience state: provider, sticky page bar with section anchors, switch and CTA; URL parameter, localStorage and cross-fade behavior (design.md section 2).
- Typed content file holding all copy, stats, diagram labels and FAQ.
- Section 3 stat tiles with small hand-built charts and source lines.
- Section 4 functional allocation diagram (build-in animation, hover or focus detail, replay).
- Section 5 operator network diagram (line draw and pulse, legend).
- Section 6 calculator: the prototype's model, Sankey and controls, restyled to the site.
- Section 7 three-phase timeline, FAQ, closing CTA and disclaimer footer.
- "Services" nav link; page metadata; `noindex` until counsel review.
- Model tests ported to Node's built-in test runner (the site has no Vitest).

### Out of Scope
- The final hero photograph (a labeled placeholder ships in the draft).
- Final calculator defaults (finance) and final function labels (counsel).
- Primary-source verification of statistics marked R, D or P.
- Drag-to-move between Sankey lanes, smooth path morphing, the "add a firm" interaction.
- Scenario pre-attachment (dropped 2026-11-21: "Discuss your numbers" goes to `/meet`).
- Ethics, regulatory and entity strategy.

### Affected Areas
- `src/app/services/`: the route, its content file and page-only components
- `src/components/services/`: audience context, toggle, diagrams, calculator
- `src/content/nav.ts`: nav link
- `src/app/globals.css`: two keyframe utilities (fade, pulse) if not expressible in Tailwind
- `package.json`: `d3-sankey`, `@types/d3-sankey`

## Requirements

### Functional Requirements
1. **FR-01**: `/services` renders the eight sections in design order, each with an `id` the page bar links to. Acceptance: every anchor scrolls to its section below the sticky bars.
2. **FR-02**: The audience switch flips all audience-dependent content (design.md section 2 table) with no mixed state. Acceptance: switching changes hero subhead, benefits, stat order, both diagrams, calculator and phase detail together.
3. **FR-03**: `?audience=corporate|firm` sets the first render on the server; the switch writes the URL with `replaceState` and stores the choice. Acceptance: loading `/services?audience=corporate` shows the corporate view with no flash of the firm view.
4. **FR-04**: Switching cross-fades content in about 250 ms without scrolling; with `prefers-reduced-motion` the swap is instant.
5. **FR-05**: Six stat tiles, ordered per audience by `rank`, each with action title, figure, small chart where data exists, caption and a source link; a nuance tile and the bridge line follow.
6. **FR-06**: The allocation diagram shows the "keeps" and "takes" panels joined by a services-agreement connector, builds in item by item when scrolled into view, explains an item on hover or focus, and has a replay control. The boundary line sits beside it.
7. **FR-07**: The network diagram shows the Spaarke operating company with its capabilities, surrounded by client and MLO pairs, with gray agreement lines, blue operator lines and a legend.
8. **FR-08**: The calculator reproduces the prototype's model outputs exactly for the same inputs, shows the Sankey with a table alternative, the KPI cards, and the illustrative note beside the numbers.
9. **FR-09**: The calculator has no input that sets the fee as a share of revenue, legal fees or profit; ported tests marked GUARDRAIL pass.
10. **FR-10**: Section 7 shows Design, Implement and Operate, each opening to its list and outcome.
11. **FR-11**: FAQ (six questions) as disclosure widgets, a closing CTA and a disclaimer footer (not legal advice, not an offer of securities, illustrative figures).
12. **FR-12**: "Services" appears in the site nav between Platform and Why Spaarke and is highlighted on `/services`.

### Non-Functional Requirements
- **NFR-01**: Visual system matches the site (design.md section 0): v2 tokens, section rhythm, primitives, CTA blue accent.
- **NFR-02**: WCAG 2.2 AA: keyboard-operable switch, sliders, chips, diagram items and disclosures; visible focus; text alternatives for every chart and diagram.
- **NFR-03**: Every animation has a reduced-motion final state; nothing loops except the network pulse, which stops under reduced motion.
- **NFR-04**: Layout works from 360 px wide with no horizontal scroll; diagrams stack on phones.
- **NFR-05**: Copy follows the content-platform voice (no em dashes, US spelling); `npm run voice:lint` reports 0 errors on the content file.
- **NFR-06**: `npm run typecheck` and `npm run build` pass; no console errors on the page.
- **NFR-07**: Only one new runtime dependency (`d3-sankey`).

## Technical Constraints

### Tech Stack
- Next.js 16 App Router (TypeScript), React 19, Tailwind v4
- Azure Static Web Apps via GitHub Actions

### Key Decisions
- The page is a server component; it reads `searchParams.audience` and passes the initial audience to a client provider. This replaces the prototype's `window`-based initial read, which would cause a hydration mismatch.
- Diagrams and stat charts are hand-built SVG and CSS (no Recharts, Nivo or Framer Motion), animated with CSS transitions and IntersectionObserver.
- The calculator model, defaults and Sankey data mapping are ported from the prototype with behavior unchanged; only presentation changes.
- The page is `noindex` and absent from the sitemap until counsel review.

## Success Criteria

1. [ ] Page renders both views with all eight sections. Verify by: browser preview at desktop and 375 px
2. [ ] `?audience=corporate` lands on the corporate view on first paint. Verify by: load the URL, read the hero subhead
3. [ ] Calculator outputs match the prototype defaults (corporate savings $1.50M on $25.75M). Verify by: ported model tests and the KPI cards
4. [ ] GUARDRAIL tests pass. Verify by: `npm run test:services`
5. [ ] Typecheck and build pass. Verify by: `npm run typecheck`, `npm run build`
6. [ ] Voice lint clean on the content file. Verify by: `npm run voice:lint`
7. [ ] No console errors. Verify by: preview console

## Dependencies

### Prerequisites
- Design v2 (`design.md`) and the prototype (`prototype/`).

### External Dependencies
- `d3-sankey` (npm). No new Azure resources.

## Owner Clarifications

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Process | Pause at each pipeline gate? | Owner asked to set up the project and proceed to a first draft for joint review (2026-11-21) | Gates run without stops; open items carried as assumptions below |
| Nav label | What is the tab called? | "Services" (2026-11-19) | Nav link label |
| Terms | How are MSO and MLO used? | MSO is the entity (the client's MSO, and Spaarke as MSO operator); MLO is the service package the MSO delivers (2026-11-21) | All copy, diagram and calculator labels |
| AI and transformation | One hub capability or two? | Two: AI is a technology and functional capability; transformation is process and business model reengineering (2026-11-21) | Network hub list |
| CTAs | Where does each button go? | "Start a conversation" and "Discuss your numbers" to `/meet`; "Request an assessment" to `/contact?reason=mlo` with a new "Managed Legal Operations" contact reason (2026-11-21) | All CTAs; `src/lib/contact.ts` and `/contact` gain the reason and the `?reason=` preselect |
| Network pairs | How many, which clients, what labels, grow on scroll? | Six; law firms and legal departments in both views, own type emphasized; generic labels; build "the network grows" (2026-11-21) | FR-07 diagram and its phone list |
| Nav timing | When does the nav link ship? | At first merge (2026-11-21) | FR-12 ships with the page |
| Value lines | Keep the firm-view value and capital lines? | Keep as written for counsel review (2026-11-21) | Section 2 benefits, section 6 narrative and capital note |

## Assumptions

- **Hero image**: interim Unsplash photo tagged "Interim image" until the licensed photo is chosen. Affects hero.
- **Stats**: the six prototype stats ship with their verification status shown only in code comments, not on the page. Affects section 3.
- **Calculator defaults and labels**: prototype placeholders. Affects section 6.

## Unresolved Questions

- [x] Final headline: "Practice law. We'll run the operations." for both audiences (2026-11-21)
- [ ] Hero photograph: exclusive stock license chosen as the route (2026-11-21); the image itself is still to be picked. An interim Unsplash photo stands in. Blocks: launch
- [ ] Counsel review of function labels, boundary and fee language, FAQ answers. Blocks: launch and indexing
- [ ] Finance-set calculator defaults and ranges. Blocks: launch
- [ ] Primary sources for stats marked R, D, P. Blocks: launch
- [x] Link to the Spaarke Method: under the section 7 phases, with a bridging sentence (2026-11-21)

---

*AI-optimized specification. Original design: design.md*
