# Task 030: Page template pattern (shared layout for content pages)

**Phase:** 3 — Reskin Existing Pages
**Status:** not-started (stub — to be expanded when Phase 3 begins)
**Estimated:** 1.5 hours
**Dependencies:** 013
**Tags:** layout, primitives, content-pages

## Context

Establish the shared visual pattern for non-home content pages — `/insights`, `/contact`, `/access-request`, `/privacy`, `/terms`, `/signin`, `/platform`, `/why-spaarke`. The handoff doesn't spec these directly; we extrapolate from the v2 system.

Pattern recommendation:
- Dark by default (matching the v2 brand) OR a single light slab pattern for forms/legal — pick one and apply consistently
- `<Shell>` container around all page bodies
- v2 type scale (`.v2-h1` for page titles, `.v2-h2` for major sections, `.v2-h3` for subsections, `.v2-lede` for ledes, body in `--v2-body`)
- Hairline rules between sections rather than thick borders
- Top padding clamp `clamp(80px, 12vh, 160px)`

Build a `<PageHeader>` primitive: eyebrow + H1 + lede block, with consistent spacing. Build a `<Slab>` primitive that takes a `tone` prop ('dark' | 'light') and applies the right background + text colors.

Decide based on best legibility: forms (contact, access-request, signin) might be better on a light slab; legal (privacy, terms) and editorial (insights post) might be better on dark with a generous max-width text column.

## Acceptance (will expand when Phase 3 begins)

- [ ] `<PageHeader>` primitive exists in `src/components/v2/`
- [ ] `<Slab>` primitive exists in `src/components/v2/`
- [ ] Sample stub page rendered using only these primitives looks clean
- [ ] Pattern documented inline in component JSDoc

## Notes

- Resist over-engineering. We need a small kit of primitives, not a full design system.
- If a page has unique needs (e.g., the form layout), it can compose the primitives bespoke; we don't need a "FormPage" template.
