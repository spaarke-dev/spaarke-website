# Task 026: Hero screenshot prep

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 30 minutes
**Dependencies:** 004
**Tags:** assets, image-prep

## Context

The cleaned hero screenshot is at `resources/screenshots/spaarke-screenshot-darkmode.png`. Task 004 already places it at `public/brand/hero/hero-workspace-dark.png`. This task verifies the cleanup checklist and ensures the source quality is production-ready.

**Verify the v1.4 brief §"Product screenshot specs" cleanup checklist is satisfied:**
- [ ] No SANDBOX badge in the top right
- [ ] No version footer ("v1.0.2 — Built ..." line)
- [ ] Realistic legal data (matter names, document titles, to-do items — not test data)
- [ ] Contrast lifted slightly for marketing readability
- [ ] Copilot panel prompts kept ("What are my overdue tasks?", "Find documents for the Acme matter", "Run a risk scan on this contract")

If any item is missing, request a fresh export rather than retouching in code.

Final image optimization (WebP/AVIF, sizing variants, multiple sources) is in Task 042 — this task only confirms source quality.

## Acceptance (will expand when Phase 2 begins)

- [ ] All cleanup checklist items satisfied
- [ ] PNG dimensions appropriate for hero use (≥2× retina target — recommend ~2400px wide source)
- [ ] File at `public/brand/hero/hero-workspace-dark.png`
