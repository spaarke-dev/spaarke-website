# T04 — TourShell + page wire-up

**Phase**: 1
**Wave**: 4
**Dependencies**: T01, T02b (StepNav), T02d (TourHeader), T03 (TourStage)

## Goal

Compose the engine: the top-level `<TourShell>` that owns URL state,
keyboard nav, the mobile guard, and the section/step composition; and
the `[slug]/page.tsx` route handler that renders it. After this task,
visiting `/tour` works end-to-end with the sample content.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.1 (routes), §3.2
  (component tree), §5.6 (TourShell spec), §7.1 (URL state), §7.3
  (a11y), §7.4 (mobile strategy).
- `src/content/tours/types.ts`, `src/content/tours/registry.ts`.
- `src/components/tour/TourHeader.tsx` (T02d output).
- `src/components/tour/TourStage.tsx` (T03 output).
- `src/components/tour/StepNav.tsx` (T02b output).
- `src/app/tour/[slug]/page.tsx` (skeleton from T01) — this task
  replaces its body.
- `src/app/tour/page.tsx` (redirect from T01) — no changes needed.

## Deliverables

### 1. `src/components/tour/TourShell.tsx`

Client component (`"use client"`). Owns:

- **State derivation from URL**: read `searchParams` for `section`,
  `step`, `grid`, `author`. Default `section = tour.sections[0].id`,
  `step = 1`. Clamp invalid values to nearest valid.
- **URL writes** via `router.replace` — never `push` (back/forward
  should jump between pages, not steps). Use Next's `useRouter`
  (from `next/navigation`).
- **Keyboard listener**: window-level `keydown`. ←/→ call
  `goPrev()` / `goNext()`. Esc clears focus / no-op for now (we don't
  navigate away from the tour on Esc — user can use back button).
- **Telemetry**: stub for now. Wrap nav handlers with `// TODO:
  trackEvent("tour.step_view", ...)` comments. Phase 4 fills in.
- **Mobile guard**: at the top of the render body, render a "View on
  larger screen" message inside a `lg:hidden` block, and the engine
  inside a `hidden lg:block` block. The message: `"This interactive
  walkthrough is built for desktop and tablet displays. Open this
  page on a wider screen to view the tour."` Use the same dark
  background as the engine.

Composition:
```tsx
"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Tour, SectionId } from "@/content/tours/types";
import { TourHeader } from "./TourHeader";
import { TourStage } from "./TourStage";
import { StepNav } from "./StepNav";

type Props = { tour: Tour };

export function TourShell({ tour }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const sectionId = (params.get("section") as SectionId | null) ?? tour.sections[0].id;
  const activeSection = tour.sections.find(s => s.id === sectionId) ?? tour.sections[0];

  const stepNum = Math.max(1, Math.min(activeSection.steps.length, Number(params.get("step") ?? 1)));
  const stepIndex = stepNum - 1;
  const currentStep = activeSection.steps[stepIndex];

  const showGrid = params.get("grid") === "1";
  const authorMode = params.get("author") === "1";

  const writeUrl = useCallback((nextSectionId: SectionId, nextStep: number) => {
    const next = new URLSearchParams(params);
    next.set("section", nextSectionId);
    next.set("step", String(nextStep));
    router.replace(`?${next.toString()}`, { scroll: false });
  }, [params, router]);

  const goPrev = useCallback(() => {
    if (stepIndex > 0) {
      writeUrl(activeSection.id, stepNum - 1);
      return;
    }
    // jump to previous section's last step
    const idx = tour.sections.findIndex(s => s.id === activeSection.id);
    if (idx > 0) {
      const prev = tour.sections[idx - 1];
      writeUrl(prev.id, prev.steps.length);
    }
  }, [activeSection, stepIndex, stepNum, tour.sections, writeUrl]);

  const goNext = useCallback(() => {
    if (stepIndex < activeSection.steps.length - 1) {
      writeUrl(activeSection.id, stepNum + 1);
      return;
    }
    const idx = tour.sections.findIndex(s => s.id === activeSection.id);
    if (idx < tour.sections.length - 1) {
      const next = tour.sections[idx + 1];
      writeUrl(next.id, 1);
    }
  }, [activeSection, stepIndex, stepNum, tour.sections, writeUrl]);

  const onSectionClick = useCallback((id: SectionId) => {
    writeUrl(id, 1);
  }, [writeUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // ... compute hasPrev / hasNext (both edges)

  return (
    <>
      {/* Mobile guard */}
      <div className="lg:hidden ..."> ... message ... </div>

      <div className="hidden lg:block">
        <div
          role="region"
          aria-roledescription="slide"
          aria-label={`${activeSection.label}, step ${stepNum} of ${activeSection.steps.length}: ${currentStep.callout.title ?? currentStep.callout.body}`}
          className="bg-[#0a0a0a] mx-auto max-w-[1440px] rounded-2xl"
        >
          <TourHeader sections={tour.sections} activeSectionId={activeSection.id} onSectionClick={onSectionClick} />
          <div className="px-6 md:px-10 pb-6">
            <TourStage step={currentStep} showGrid={showGrid} authorMode={authorMode} />
            <div className="mt-6">
              <StepNav
                index={stepIndex}
                total={activeSection.steps.length}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrev={goPrev}
                onNext={goNext}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

`hasPrev` / `hasNext` should account for cross-section nav: `hasPrev =
stepIndex > 0 || sectionIndex > 0`; `hasNext = stepIndex <
section.steps.length - 1 || sectionIndex < tour.sections.length - 1`.

### 2. Update `src/app/tour/[slug]/page.tsx`

Replace the placeholder body (T01 rendered `<main>{tour.title}</main>`)
with a render of the real shell:

```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOURS, getTour } from "@/content/tours/registry";
import { TourShell } from "@/components/tour/TourShell";

export const metadata: Metadata = {
  title: "Product tour",
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return Object.keys(TOURS).map((slug) => ({ slug }));
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  return (
    <main className="bg-[#0a0a0a] min-h-screen py-8 md:py-12">
      <Suspense>
        <TourShell tour={tour} />
      </Suspense>
    </main>
  );
}
```

The `<Suspense>` boundary is required because `TourShell` calls
`useSearchParams()`, which Next requires to be inside a Suspense
boundary on static-rendered pages.

## Acceptance criteria

- `npm run typecheck` passes.
- Visiting `/tour` redirects to `/tour/full-walkthrough` and renders
  the engine with the Matter Management section + first step.
- Clicking next advances within a section and rolls into the next
  section when at the section's last step.
- Clicking prev mirrors.
- ←/→ keys do the same.
- URL updates as `?section=…&step=…` on every nav.
- Below `lg:` (Chrome devtools mobile emulation), the engine is hidden
  and the "View on larger screen" message appears.
- Visiting `?grid=1` shows the coordinate grid overlay.

## Out of scope

- Telemetry — wire up call sites with TODOs but don't import logger.
- HotspotLayer — Phase 3.
- Author-mode coordinate logging — implemented in T03 if you took the
  recommended path; otherwise stubbed and deferred to Phase 4.
- Visual polish on transitions / animations.
- A "Tour complete" CTA at the end of the last step — Phase 4.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. T01, T02b, T02d, and T03 are
> complete (route skeleton, StepNav, TourHeader, TourStage all exist).
>
> Read `projects/product-walkthrough-app/spec.md` §3.1, §3.2, §5.6,
> §7.1, §7.3, §7.4 and
> `projects/product-walkthrough-app/tasks/04-tour-shell-and-page.md`
> (this file).
>
> Execute T04:
> 1. Create `src/components/tour/TourShell.tsx` per spec — client
>    component, URL state via searchParams, keyboard ←/→, mobile guard
>    using `lg:hidden` / `hidden lg:block`, cross-section navigation,
>    aria-label per spec §7.3.
> 2. Replace the placeholder body of
>    `src/app/tour/[slug]/page.tsx` (T01 currently renders
>    `<main>{tour.title}</main>`) with a render of `<TourShell tour={tour} />`
>    wrapped in a `<Suspense>` boundary (required because TourShell uses
>    `useSearchParams`).
>
> Preserve T01's `metadata.robots`, `generateStaticParams`,
> `notFound()` handling. Do not touch any other files.
>
> Run `npm run typecheck` and start `npm run dev`; verify
> `/tour/full-walkthrough` renders the engine, ←/→ navigate, and
> `?grid=1` shows the grid. Report a short summary including any
> visible issues. Use Bash to confirm the dev server is up but don't
> wait on it; check via curl that the page returns 200.
