# Task 020: Section 1 — Hero

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 3.5 hours
**Dependencies:** 013, 027
**Tags:** component, home, hero

## Context

Build the v2 hero per [mockup `home_01.jpg`](../v2%20mockup%20screenshots/home_01.jpg).

**Layout:**
- Dark slab (`<Slab tone="dark">`)
- Centered content: H1, subhead, CTAs, then full-width product screenshot below
- Generous whitespace; no full-bleed glow ellipse (mockup is cleaner — just a soft vignette around the screenshot)

**Copy** (from `src/content/home/hero.ts`, created in Task 006):
- **H1**: "See all sides of every matter." with a controlled break: line 1 = "See all sides of", line 2 = "every matter." (use `<br/>` or `<Heading>` prop for break)
- **Subhead**: "The shared platform for legal departments, business stakeholders, and outside counsel."
- **CTAs**: 
  - Secondary (left): "Watch demo" (outline) — opens the demo modal (Task 029)
  - Primary (right): "Get access" (solid blue) — links to `/access-request`
- **Trust strip below product**: "Built on Microsoft 365 · Copilot-native · Azure AI Foundry — OpenAI, Anthropic, and any frontier model" *(brief copy; verify against mockup)*

**Screenshot:**
- Source: `public/brand/hero/hero-workspace-dark.png` (placed in Task 026)
- Centered, with subtle drop shadow per mockup

**Mobile (≤640):**
- H1 line break still applies — keep "every matter." on its own line
- CTAs stack vertically
- Screenshot scales down with appropriate `sizes` attribute

## Acceptance (will expand when Phase 2 begins)

- [ ] Renders centered hero per mockup
- [ ] H1 line break correct
- [ ] CTAs in correct order (Watch demo left, Get access right)
- [ ] "Watch demo" opens modal (Task 029 must be wired)
- [ ] "Get access" navigates to `/access-request`
- [ ] Screenshot uses Next.js `<Image>` with `priority`
- [ ] Trust strip present below screenshot
- [ ] Mobile renders cleanly at 640 / 960
- [ ] LCP < 2.5s on home (mobile, throttled)
