# Task 037: Error + 404 pages styled with v2 system

**Phase:** 3 — Reskin Existing Pages
**Status:** not-started (stub — to be expanded when Phase 3 begins)
**Estimated:** 1 hour
**Dependencies:** 030
**Tags:** error-handling, app-router, resilience

## Context

Next.js App Router renders `error.tsx` for runtime errors and `not-found.tsx` for 404s. Verify both exist in the project; if not, create. Style with the v2 page template primitives so they feel like part of the site, not raw Next.js defaults.

## Steps (when Phase 3 begins)

1. Check existing files:
   - `src/app/not-found.tsx` — global 404
   - `src/app/error.tsx` — global error boundary (must be a Client Component with `"use client"`)
   - Optional: per-route `error.tsx` for routes with high error surface (forms)
2. If missing, create. Both should:
   - Wrap content in v2 page template (`<Slab tone="dark">`, `<Shell>`, `<PageHeader>`)
   - Eyebrow + H1 + lede block
   - Primary action: "Back home" `<Button>` to `/`
   - Secondary action: "Contact us" link
3. **404 copy**: keep it tasteful — "We couldn't find that page. Check the URL or head back to the home page."
4. **Error copy**: "Something went wrong on our end. Please try again or get in touch if it persists." Include a `reset()` button that calls the prop `reset` from Next.js so users can retry.
5. Test by navigating to a non-existent route (404) and by triggering a client error in dev (e.g., temporarily throw in a component) to verify both render.

## Acceptance (will expand when Phase 3 begins)

- [ ] `src/app/not-found.tsx` exists and uses v2 page template
- [ ] `src/app/error.tsx` exists, marked `"use client"`, uses v2 page template
- [ ] Both pages have "Back home" and "Contact us" actions
- [ ] Error page has working `reset()` retry button
- [ ] No regression on existing routes
