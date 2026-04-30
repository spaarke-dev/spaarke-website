# Task 022: ModuleGrid (5 alternating rows + substrate)

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 5 hours
**Dependencies:** 013
**Tags:** component, home, parallax, motion

## Context

Light slab. Two parts:

**Part A**: 5 alternating-row product modules (Operations, Documents & Knowledge, Collaboration, Agents & Automation, Spend & Performance). Each row 2-col grid (image left/right alternating), text column has heading + body + KEY FEATURES bullet list, image column has dark frame + drop shadow + blue accent halo. Subtle vertical-parallax effect on the screenshots — `(progress - 0.5) * 48px` translate.

**Part B**: "Works how you work" substrate — eyebrow, "Microsoft, end-to-end." heading, six logo tiles (Power Platform · SharePoint · Microsoft 365 · Teams · M365 Copilot · Azure AI Foundry), three pillar paragraphs.

Reference: [design_handoff/README.md §"ModuleGridV2"](../design_handoff_spaarke_website_v2/README.md) and [design_handoff/design/ModuleGridV2.jsx](../design_handoff_spaarke_website_v2/design/ModuleGridV2.jsx) for exact copy.

Module screenshots in `public/brand/modules/`. Substrate logos in `public/brand/substrate/`.

Mobile: ≤960 stack two-cols (image above text).

A11y: respect `prefers-reduced-motion` — disable parallax for users who opt out.

## Acceptance (will expand when Phase 2 begins)

- [ ] Five module rows render with correct copy
- [ ] Image-left / image-right alternation correct
- [ ] Parallax effect smooth, ~48px travel
- [ ] `prefers-reduced-motion` disables parallax
- [ ] Substrate logos render in correct order
- [ ] Three pillar paragraphs present
- [ ] Mobile stacks cleanly
