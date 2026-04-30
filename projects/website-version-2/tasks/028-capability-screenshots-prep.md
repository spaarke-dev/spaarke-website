# Task 028: Capability screenshots prep

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 1 hour
**Dependencies:** 004
**Tags:** assets, image-prep

## Context

Section 4 (Task 022) needs five focused product screenshots — one per capability row. Verify the candidates from `resources/screenshots/` match the mockup framing per [home_03-2 through home_03-6](../v2%20mockup%20screenshots/), then place them at `public/brand/capabilities/` with consistent naming.

**Mapping:**

| Capability | Source | Destination | Mockup ref |
|---|---|---|---|
| Operations | `resources/screenshots/corporate-workspace.png` | `public/brand/capabilities/operations.png` | home_03-2 |
| Documents & Knowledge | `resources/screenshots/document-record.png` | `public/brand/capabilities/documents.png` | home_03-3 |
| Collaboration | `resources/screenshots/external-access-site.png` | `public/brand/capabilities/collaboration.png` | home_03-4 |
| Agents & Automation | `resources/screenshots/ai-playbook-builder.png` | `public/brand/capabilities/automation.png` | home_03-5 |
| Spend & Performance | `resources/screenshots/matter-record.png` | `public/brand/capabilities/spend-performance.png` | home_03-6 |

**Verify each source:**
- [ ] No SANDBOX badge
- [ ] No version footer
- [ ] Realistic legal data (no obvious test rows)
- [ ] Contrast appropriate for light slab presentation
- [ ] Resolution ≥1600px wide (capability cards are smaller than hero, so 1600px is sufficient)

If any source needs cleanup, flag back to the user — don't retouch in code.

Image format optimization (WebP/AVIF) is deferred to Task 042 — this task only places source PNGs.

## Acceptance (will expand when Phase 2 begins)

- [ ] All five files placed at `public/brand/capabilities/` with correct names
- [ ] Cleanup checklist verified for each
- [ ] Source dimensions documented (so Task 042 has the right `sizes` strategy)
