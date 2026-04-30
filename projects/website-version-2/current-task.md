# Current Task

## Quick Recovery
| Field | Value |
|-------|-------|
| **Task** | 001 |
| **Step** | 4 (open draft PR) |
| **Status** | In progress |
| **Next Action** | Open draft PR; verify SWA preview URL |

## Details
- **Task File:** tasks/001-create-feature-branch.md
- **Phase:** 0 — Foundations
- **Started:** 2026-04-30

## Completed Steps

- 2026-04-30: Verified clean working tree on `main`
- 2026-04-30: Created `v2` branch and pushed to origin (tracking set)

## Decisions Made

- **Branch strategy**: feature branch `v2`, atomic merge cutover, revert as rollback
- **No V2 filename suffix**: replace v1 components in place on the branch
- **Asset path**: `public/brand/` (not `public/images/`) for v2-era assets
- **Manrope**: self-host the variable TTF from the handoff
- **Insights URL**: rename `/blog` → `/insights` with a redirect rule
- **Hero screenshot source**: `resources/screenshots/spaarke-screenshot-darkmode.png` (already cleaned)
- **Mobile**: baked into every section task, not deferred to a polish phase

## Notes

Project kicks off 2026-04-30. Source of truth for design = [design_handoff_spaarke_website_v2/README.md](design_handoff_spaarke_website_v2/README.md).
