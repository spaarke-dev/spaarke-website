# Task 022: Section 4 — Capabilities + Microsoft foundation

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 5 hours
**Dependencies:** 013, 028, 006
**Tags:** component, home, zigzag

## Context

Build per [mockup `home_03-2` through `home_03-7`](../v2%20mockup%20screenshots/). This is Section 4 in the v1.4 brief; it has **no standalone heading** — it inherits the umbrella heading from Section 3 (Pillars).

**Layout:**
- Light slab (`<Slab tone="light">`) — continues from Section 3 Pillars without break
- Five capability rows in **zigzag** (alternating image-left/image-right)
- Followed by the Microsoft foundation card (full-width, light)

**Skip** (per decisions): the brief's transitional line ("Built on Microsoft, designed for legal — every capability connected...") and the brief's "Explore the full platform →" CTA. Mockup omits both.

**Five capability rows** (from `src/content/home/capabilities.ts`):

| # | Name | Body | Bullets (3) | Screenshot | Layout |
|---|---|---|---|---|---|
| 01 | **Operations** | Matters, projects, tasks, and people — the operational backbone for the legal team and the work they own. | Daily briefing · Smart to-dos · Performance tracking | `corporate-workspace.png` | text left / image right |
| 02 | **Documents & Knowledge** | Every document, email, and contract — connected, searchable, and AI-aware. Built on SharePoint Embedded with Azure AI semantic search and Find Similar. | Matter-aware search · SharePoint-native · Privilege-safe AI | `document-record.png` | text right / image left |
| 03 | **Collaboration** | Secure shared workspaces for outside counsel, business clients, and anyone working a matter — without sending another email attachment. | Shared matters · Tasks & invoices · Cross-firm access | `external-access-site.png` | text left / image right |
| 04 | **Agents & Automation** | AI agents, automated workflows, and event-driven rules — the operational intelligence that runs in the background and shows up in Copilot. | Copilot-native · Azure AI Foundry · Context-aware | `ai-playbook-builder.png` | text right / image left |
| 05 | **Spend & Performance** | Invoices, budgets, OCG compliance, and matter outcomes — the financial and operational truth about every matter and every firm. | OCG compliance · Spend signals · Cross-firm view | `matter-record.png` | text left / image right |

**Per-row visual treatment:**
- Capability name: `<Heading level={2}>`
- Body: 17px, line-height 1.6, text-mid color, max ~38ch
- "KEY FEATURES" eyebrow (`<Eyebrow>`)
- 3 bullet list, weight 500
- Screenshot in light frame with subtle shadow (mockup shows clean light frame, not the dark frame from the handoff prototype)

**Microsoft foundation card** (per [home_03-7](../v2%20mockup%20screenshots/home_03-7.jpg)):
- Single rounded card, full-width within shell
- Eyebrow: "BUILT ON MICROSOFT"
- Heading: "Microsoft, end to end."
- Body: "Spaarke runs natively on the Microsoft tools your team already uses, inside the security perimeter your IT team already approved. No new identity, no parallel governance."
- **Seven logo tiles** on the right side (rounded squares, soft shadow), in order:
  1. Power Platform (`public/brand/logos/powerplatform-scalable.svg`)
  2. SharePoint (`public/brand/logos/sharepoint-512.png`)
  3. M365 Apps (`public/brand/logos/microsoft-365-apps-logo.png`)
  4. Outlook (`public/brand/logos/outlook-512.png`)
  5. Teams (`public/brand/logos/Microsoft_Office_Teams.svg`)
  6. M365 Copilot (`public/brand/logos/microsoft-365-copilot-badge.svg`)
  7. Azure (`public/brand/logos/azure-256x256-padded.png`)

(Both M365 Apps AND Outlook included per latest decision — mockup showed M365 Apps; brief said Outlook; user confirmed both.)

**Mobile (≤960):**
- Each capability row stacks (image above text)
- Microsoft foundation card stacks logos in a wrapping row below the heading/body

## Acceptance (will expand when Phase 2 begins)

- [ ] Five capability rows render with correct copy and bullets
- [ ] Image-left / image-right alternation correct (matches mockup)
- [ ] All five screenshots load (placed in Task 028)
- [ ] Microsoft foundation card renders with all seven logos in correct order
- [ ] No transitional line, no Section CTA (per decisions)
- [ ] Mobile stacks cleanly
- [ ] Content sourced from `src/content/home/capabilities.ts`
