# Task 004: Migrate brand assets to `public/brand/`

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 001
**Tags:** assets, public, organization

## Goal

Copy the v2 design handoff brand assets into the Next.js public folder under a clean, versioned path so components can reference them with stable URLs.

## Context

The handoff has logos, hero glow, module screenshots, and substrate logos under [design_handoff_spaarke_website_v2/brand/assets/](../design_handoff_spaarke_website_v2/brand/assets/). These need to land in `public/brand/` so they ship with the site. The existing `public/images/` stays untouched — it holds v1 assets that may still be referenced.

The hero workspace screenshot in the handoff (`hero-workspace-dark-v2.png`) is **superseded** by the cleaner export at [resources/screenshots/spaarke-screenshot-darkmode.png](../../../resources/screenshots/spaarke-screenshot-darkmode.png). Use that one for the hero in Task 020.

## Steps

1. Create the destination folders under `public/brand/`:
   - `public/brand/logos/`
   - `public/brand/hero/`
   - `public/brand/modules/`
   - `public/brand/substrate/`
2. Copy contents from the handoff:
   - `design_handoff_spaarke_website_v2/brand/assets/logos/*` → `public/brand/logos/`
   - `design_handoff_spaarke_website_v2/brand/assets/hero/hero-glow-bg.png` → `public/brand/hero/hero-glow-bg.png` *(skip the v2 workspace screenshot — see step 3)*
   - `design_handoff_spaarke_website_v2/brand/assets/modules/*` → `public/brand/modules/`
   - `design_handoff_spaarke_website_v2/brand/assets/substrate/*` → `public/brand/substrate/`
3. Copy the hero screenshot from the user's resources folder:
   - `resources/screenshots/spaarke-screenshot-darkmode.png` → `public/brand/hero/hero-workspace-dark.png`
   - Defer optimization (WebP/AVIF, sizing) to Task 042; for now ship the PNG as-is.
4. Spot-check each folder has the expected files (compare against handoff README §"Inventory").
5. Do not modify `public/images/`.
6. Commit: `feat(v2): migrate brand assets to public/brand/`.
7. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- `public/brand/logos/` populated
- `public/brand/hero/hero-glow-bg.png` and `public/brand/hero/hero-workspace-dark.png`
- `public/brand/modules/` populated
- `public/brand/substrate/` populated

## Acceptance Criteria

- [ ] All asset folders match the handoff inventory
- [ ] Hero screenshot is the cleaned export from `resources/screenshots/`
- [ ] `public/images/` is untouched
- [ ] Assets are accessible via `http://localhost:3000/brand/...` paths in dev

## Notes

- Keep filenames as-is from the handoff so the `.jsx` references in `design_handoff/design/` are easy to translate.
- Image optimization (WebP/AVIF conversion, build-time resizing) is deferred to Task 042 to keep this task scope small.
- We do not delete the handoff `brand/` folder — it's the design source and stays in `projects/`.
