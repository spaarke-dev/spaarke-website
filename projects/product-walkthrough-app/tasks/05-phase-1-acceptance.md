# T05 — Phase 1 acceptance

**Phase**: 1
**Wave**: 5
**Dependencies**: T01–T04 all complete

## Goal

Verify the Phase 1 engine works end-to-end against the spec's
acceptance criteria. Identify and fix small issues; flag larger ones
for follow-up. Produce a concise report.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` — §10 Phase 1 deliverable.
- `projects/product-walkthrough-app/tasks/README.md` — file touch
  matrix for verifying the right files exist.
- All Phase 1 task files for context.

## Procedure

### 1. Static checks

```bash
npm run typecheck
npm run lint  # if available; ignore if not configured
```

Both must pass clean.

### 2. Dev-server smoke

```bash
npm run dev
# in another shell, after dev server is up on :3000:
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tour
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tour/full-walkthrough
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tour/does-not-exist
```

Expected:
- `/tour` → 307/308 redirect → 200 (final page)
- `/tour/full-walkthrough` → 200
- `/tour/does-not-exist` → 404

### 3. Behavior checks

In a browser at `/tour/full-walkthrough`:

- [ ] TourHeader renders with **Matter Management** active (solid blue
      pill), other sections as dashed-outline buttons. "Get access" CTA
      on the right links to `/access-request`.
- [ ] TourStage shows the screenshot (broken image is OK — placeholder
      asset).
- [ ] Callout overlays at the documented anchor — verify with
      `?grid=1`. Callout's anchor x≈0.18, y≈0.22 should land near "18%
      from left, 22% from top" on the grid.
- [ ] StepNav shows "1 of 2" with prev disabled, next enabled.
- [ ] Click next → URL updates to `?section=matter-management&step=2`,
      stage shows step-2 callout (anchor 0.50, 0.30).
- [ ] Click prev → URL returns to step=1.
- [ ] Press → on keyboard → advances to step 2.
- [ ] Press ← on keyboard → returns to step 1.
- [ ] At step 2 (the last step in the only section), `hasNext` should be
      false and the next button disabled. (Once Phase 2 adds more
      sections, hasNext at the end of section 1 becomes true and rolls
      into section 2.)

### 4. Mobile guard

In Chrome devtools, toggle device toolbar to a 375px viewport:
- [ ] Engine is hidden; "View on larger screen" message renders.

Toggle to ≥1024px:
- [ ] Engine renders normally.

### 5. Author mode (if T03 implemented it)

At `/tour/full-walkthrough?author=1`, click somewhere on the screenshot:
- [ ] Console logs `[author] { x: 0.NNN, y: 0.NNN }`
- [ ] Clipboard contains the same string

If author mode was deferred to Phase 4, skip this step.

### 6. SEO / metadata

```bash
curl -s http://localhost:3000/tour/full-walkthrough | grep -oE 'name="robots"[^>]+'
```

Expected: `name="robots" content="noindex,follow"` (or similar).

### 7. File audit

Verify the files match the touch matrix in `tasks/README.md`. Flag any
unexpected files or missing files.

```bash
find c:/code_files/spaarke-website/src/components/tour -type f
find c:/code_files/spaarke-website/src/content/tours -type f
find c:/code_files/spaarke-website/src/app/tour -type f
```

## Deliverables

- A short report (under 250 words) summarizing:
  - Each numbered check above: pass / fail.
  - Any small fixes made (typos, missing imports, off-by-one).
  - Any larger issues that warrant a separate follow-up task.
  - Final confidence level on Phase 1 readiness.

If small issues are found, fix them in place — don't open a new task
for one-line corrections. If a structural issue surfaces (e.g.,
TourShell's URL state has a race), document it as a follow-up.

## Out of scope

- Adding new features.
- Producing real screenshots.
- Wiring telemetry (Phase 4).
- Cosmetic polish beyond what's required to make the engine visually
  acceptable for a Phase 1 demo.

## Prompt

> You are running Phase 1 acceptance for the product walkthrough app
> at `c:\code_files\spaarke-website\projects\product-walkthrough-app`.
>
> Execute the steps in
> `projects/product-walkthrough-app/tasks/05-phase-1-acceptance.md` in
> order: typecheck/lint, dev-server smoke (curl status codes), behavior
> checks (you can verify in code where browser interaction isn't
> possible — read TourShell to confirm goPrev/goNext logic, etc.),
> mobile guard, SEO metadata, file audit.
>
> For browser interaction checks that need real eyes, describe what
> *should* happen and assert based on code review rather than screenshot.
>
> If you find small issues (missing import, off-by-one, typo, broken
> Tailwind class) — fix them in place. If you find a larger issue —
> document it but don't try to fix it in this task.
>
> Produce a concise report (≤250 words) with the pass/fail of each
> check, fixes you made, and remaining follow-ups. Don't run a full
> production build (`npm run build`) — typecheck is sufficient.
