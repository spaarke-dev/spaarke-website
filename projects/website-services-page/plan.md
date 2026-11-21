# Services Page (Managed Legal Operations): Implementation Plan

Source: `spec.md`. Branch: `feature/website-services-page` (worktree `c:\code_files\spaarke-website-wt-services-page`).

## Phase overview

| Phase | Name | Deliverable | Tasks |
|---|---|---|---|
| 0 | Project setup | Project folder tracked, design v2, spec, plan, tasks | 001 |
| 1 | Page shell and audience | Route, content file, audience provider, page bar, hero, sections 2 and 3 | 010, 011, 012 |
| 2 | Diagrams | Allocation diagram (section 4), network diagram (section 5) | 020, 021 |
| 3 | Calculator | Model, tests and Sankey ported; calculator UI in site style (section 6) | 030, 031 |
| 4 | Remaining sections and site wiring | Timeline, FAQ, closing, disclaimers; nav link, metadata, noindex | 040, 041 |
| 5 | Review and launch inputs | First-draft review with the owner; counsel, finance and photo inputs; indexing | 050, 051, 052 |
| Wrap-up | | Verification, Lighthouse, lessons learned | 090 |

## Milestones

1. **First draft for review** (end of phase 4): every section renders in both views on the branch preview. Acceptance: spec success criteria 1 to 7.
2. **Content final** (phase 5): counsel and finance inputs applied, headline and photograph chosen, stats verified.
3. **Launch** (phase 5): `noindex` removed, sitemap entry added, merged to `main`.

## Dependencies

- Phase 1 before everything else (content file and audience context are shared).
- Phases 2, 3 and 4 depend only on phase 1.
- Phase 5 depends on the first draft and on owner, counsel and finance input.

## Risks

| Risk | Mitigation |
|---|---|
| Hydration mismatch from audience state | Server reads `searchParams`; localStorage applied after mount only when no URL parameter |
| Public repo exposes strategy | Competitive notes and private file names live in `spaarke-research/2026-11-services-page/` |
| Calculator read as a projection or offer | Illustrative note beside every number; disclaimer footer; no personal data collected |
| Compliance wording drifts during copy edits | Guardrail tests; boundary line rendered from one content field; counsel review before indexing |
| Sankey labels overlap at narrow widths | Mobile view uses the table alternative and stacked KPI cards |
