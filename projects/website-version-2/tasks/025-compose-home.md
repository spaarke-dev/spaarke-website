# Task 025: Compose home page at `/`

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 1 hour
**Dependencies:** 020, 021, 022, 023, 024, 027, 029
**Tags:** home, composition

## Context

Replace the body of [src/app/page.tsx](../../../src/app/page.tsx) with the v2 home page composition.

**Render order** (note: differs from task ID order because Pillars (Task 027) was added after the rest of Phase 2 was scaffolded):

```tsx
<main>
  <Hero />               {/* Task 020 */}
  <GapStats />           {/* Task 021 */}
  <Pillars />            {/* Task 027 — Section 3, light slab */}
  <Capabilities />       {/* Task 022 — Section 4, light slab */}
  <LOIDiagram />         {/* Task 023 — Section 5, dark slab */}
  <Closing />            {/* Task 024 — Section 6, dark slab */}
</main>
```

(NotificationBar, SiteHeader, Footer, and the WatchDemoModal trigger come from root layout, set up in Task 013.)

**Metadata** (`src/app/page.tsx` `metadata` export):
- Title: "Spaarke — See all sides of every matter."
- Description: "The shared platform for legal departments, business stakeholders, and outside counsel. Built on Microsoft 365."
- OpenGraph image: configured in Task 044

**Cleanup:**
- Remove all v1 imports from `page.tsx` (`Hero`, `FeatureGrid`, `CTA`, `Container` from old paths)
- Verify only v2 component imports remain

## Acceptance (will expand when Phase 2 begins)

- [ ] Home page renders all six v2 sections in correct render order
- [ ] No v1 imports remain in `page.tsx`
- [ ] Metadata reflects v2 copy
- [ ] Watch demo modal can be opened from hero CTA
- [ ] Page passes Lighthouse smoke check (no console errors, no broken imports)
