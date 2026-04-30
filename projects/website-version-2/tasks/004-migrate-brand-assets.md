# Task 004: Migrate brand assets to `public/brand/`

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 001
**Tags:** assets, public, organization

## Goal

Place all v2 brand assets under `public/brand/` with a clean, versioned folder structure so components reference them with stable URLs. Existing `public/images/` (v1 assets) is left untouched.

## Context

Assets land in five subfolders under `public/brand/`:
- `logos/` — Microsoft product logos for Section 4 foundation card and Section 5 diagram
- `icons/` — Capability icons for the Section 5 LOI diagram
- `hero/` — Hero workspace screenshot + (optional) hero glow background
- `capabilities/` — Section 4 per-capability screenshots (placed in Task 028, folder created here)
- `(spaarke logos)` — Spaarke wordmark/icon SVGs (from the design handoff)

Source assets currently live at:
- User-provided: `resources/logos/`, `resources/icons/`, `resources/screenshots/`
- Handoff: `projects/website-version-2/design_handoff_spaarke_website_v2/brand/assets/`

## Steps

1. Create destination folders under `public/brand/`:
   - `public/brand/logos/`
   - `public/brand/icons/`
   - `public/brand/hero/`
   - `public/brand/capabilities/` (empty — Task 028 populates)

2. **Microsoft logos** — copy from `resources/logos/` to `public/brand/logos/`:
   - `Microsoft_Office_Teams.svg`
   - `azure-256x256-padded.png`
   - `microsoft-365-apps-logo.png`
   - `microsoft-365-copilot-badge.svg`
   - `outlook-512.png`
   - `powerplatform-scalable.svg`
   - `sharepoint-512.png`

3. **Section 5 icons** — copy all 17 SVGs from `resources/icons/` to `public/brand/icons/`:
   `analysis.svg`, `assign.svg`, `charttype.svg`, `client.svg`, `contact.svg`, `document.svg`, `email.svg`, `event.svg`, `invoices.svg`, `kpiassessment.svg`, `matter.svg`, `playbook.svg`, `project.svg`, `task.svg`, `teams.svg`, `timekeeper.svg`, `workassignment.svg`
   (Task 023 picks the 8 used in the diagram; rest available for Platform page or future use.)

4. **Hero screenshot** — copy from user resources:
   - `resources/screenshots/spaarke-screenshot-darkmode.png` → `public/brand/hero/hero-workspace-dark.png`

5. **Spaarke wordmark logos** — copy from the design handoff to `public/brand/logos/`:
   - `projects/website-version-2/design_handoff_spaarke_website_v2/brand/assets/logos/spaarke-logo-white.svg`
   - `projects/website-version-2/design_handoff_spaarke_website_v2/brand/assets/logos/spaarke-logo-black.svg`
   - `projects/website-version-2/design_handoff_spaarke_website_v2/brand/assets/logos/spaarke-icon.svg` (if present — used in footer)

6. **Hero glow** (optional — mockup uses a soft vignette around the screenshot, not the linear-style ellipse from the prototype):
   - Skip the handoff `hero-glow-bg.png` for now. If we decide later to add a hero glow, copy it then. The mockup's hero is cleaner without it.

7. Spot-check each folder: list contents and verify against the inventory above.

8. Do NOT modify `public/images/`.

9. Verify dev server can resolve `http://localhost:3000/brand/logos/sharepoint-512.png` etc.

10. Commit: `feat(v2): migrate brand assets to public/brand/`.

11. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- `public/brand/logos/` — Microsoft logos + Spaarke wordmarks (~9-10 files)
- `public/brand/icons/` — 17 capability icon SVGs
- `public/brand/hero/hero-workspace-dark.png`
- `public/brand/capabilities/` (empty folder — Task 028 populates)

## Acceptance Criteria

- [ ] All folders match the inventory above
- [ ] Microsoft logos accessible via `/brand/logos/...` paths in dev
- [ ] Section 5 icons accessible via `/brand/icons/...` paths
- [ ] Hero screenshot at `/brand/hero/hero-workspace-dark.png`
- [ ] Spaarke wordmarks (white + black) at `/brand/logos/`
- [ ] `public/images/` untouched

## Notes

- Capability screenshots are placed in Task 028, not here, so we can verify cleanup before they ship.
- Image format optimization (WebP/AVIF, sizing) is deferred to Task 042 — this task only places source files.
- The handoff `brand/assets/modules/` and `brand/assets/substrate/` folders are NOT migrated — we use user-provided logos/icons instead, which align with the latest mockup and brief.
