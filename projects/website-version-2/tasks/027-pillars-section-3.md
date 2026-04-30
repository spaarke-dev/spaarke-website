# Task 027: Section 3 — Pillars (light slab)

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 3 hours
**Dependencies:** 005, 006
**Tags:** component, home, light-slab

## Context

Build per [mockup `home_03-1.jpg`](../v2%20mockup%20screenshots/home_03-1.jpg). This section is **NEW** to the production plan — the design handoff dropped Pillars from its App composition, but the v1.4 brief and the latest mockup include it. It serves as a deliberate breath-of-air light moment between dark Sections 2 and 4 — and structurally, its umbrella heading also covers Section 4 (which has no standalone heading).

**Layout:**
- Light slab (`<Slab tone="light">`) — bg `#f6f6f4`
- Centered umbrella heading at top (large, bold, black)
- Three rounded cards in a row below, white surface
- This slab continues into Section 4 without a break (same `<Slab tone="light">` boundary)

**Copy** (from `src/content/home/pillars.ts`, created in Task 006):

**Umbrella heading** (centered, large): "One platform. All sides. Every matter."

**Three pillar cards** (typography-only, no icons; thin divider between operational claim and callback line):

| Card | Headline | Operational claim | Callback line |
|---|---|---|---|
| 1 | One platform for the work, the data, and the AI. | Matters, projects, documents, spend, and AI — connected on one Microsoft 365-native foundation that serves the business, the legal team, and the firms they work with. Replace four point solutions with one platform that knows what a matter is. | No more bolt-ons. No more parallel logins. No more *which tool was that in again?* |
| 2 | All sides of the engagement, finally aligned. | Business clients, in-house counsel, and outside counsel — working in shared, secure spaces where the matter, the documents, the tasks, and the outcomes live in one record. Ethical walls and matter-level permissions enforced throughout. | Partnership replaces reconciliation. The business gets answers. The team gets visibility. The firms get clarity. |
| 3 | Every matter, every project, every detail. | The full scope of legal work — matters, projects, documents, emails, invoices, deadlines, outcomes — connected, findable, governable. Nothing slips between systems because nothing lives outside the platform. | The work itself is the record. Visibility and governance built in, not bolted on. |

**Per-card visual treatment:**
- White surface (`<Slab tone="light">` cards on `surface-light: #ffffff`)
- Soft shadow (light)
- Rounded corners (~24px radius — generous)
- Padding inside card (~32px)
- Headline: `<Heading level={3}>` (or weight 600 if Heading 3 is too restrained — match mockup)
- Operational claim: body text, text-mid-light color
- Thin horizontal divider (hairline, light)
- Callback line: smaller, text-mid-light color, italic NOT preferred — match mockup typography

**Mobile (≤960):**
- Cards stack vertically
- Umbrella heading scales down per type clamp

## Acceptance (will expand when Phase 2 begins)

- [ ] Light slab background matches mockup (`#f6f6f4`)
- [ ] Umbrella heading "One platform. All sides. Every matter." centered, bold
- [ ] Three pillar cards render with correct copy
- [ ] Each card has thin divider between operational claim and callback line
- [ ] No icons (typography-only)
- [ ] Cards stack on mobile
- [ ] Slab transitions cleanly into Section 4 (no visual gap; same light slab continues)
- [ ] Content sourced from `src/content/home/pillars.ts`
