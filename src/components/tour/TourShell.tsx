"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SectionId, Tour } from "@/content/tours/types";
import { TourHeader } from "./TourHeader";
import { TourStage } from "./TourStage";

type Props = {
  tour: Tour;
};

/**
 * Top-level wrapper for the walkthrough engine. Owns URL state
 * (`?section=…&step=…&grid=…&author=…`), keyboard navigation, and the
 * mobile guard. Composes <TourHeader> and <TourStage>; navigation
 * controls (prev/next + counter) live inline inside the callout, passed
 * down through TourStage as `nav`.
 *
 * Uses `router.replace` (never `push`) so browser back/forward jump
 * between pages, not steps. Reads search params via `useSearchParams`,
 * which requires a parent <Suspense> boundary on static-rendered pages.
 */
export function TourShell({ tour }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  // Resolve active section: explicit ?section=… wins; fall back to first.
  const requestedSectionId = params.get("section") as SectionId | null;
  const activeSection =
    (requestedSectionId &&
      tour.sections.find((s) => s.id === requestedSectionId)) ||
    tour.sections[0];

  // Resolve active step: clamp to [1, total].
  const rawStep = Number(params.get("step") ?? 1);
  const stepNum = Number.isFinite(rawStep)
    ? Math.max(1, Math.min(activeSection.steps.length, Math.floor(rawStep)))
    : 1;
  const stepIndex = stepNum - 1;
  const currentStep = activeSection.steps[stepIndex];

  const showGrid = params.get("grid") === "1";
  const authorMode = params.get("author") === "1";

  const sectionIndex = tour.sections.findIndex(
    (s) => s.id === activeSection.id,
  );
  const hasPrev = stepIndex > 0 || sectionIndex > 0;
  const hasNext =
    stepIndex < activeSection.steps.length - 1 ||
    sectionIndex < tour.sections.length - 1;

  const writeUrl = useCallback(
    (nextSectionId: SectionId, nextStep: number) => {
      const next = new URLSearchParams(params.toString());
      next.set("section", nextSectionId);
      next.set("step", String(nextStep));
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const goPrev = useCallback(() => {
    // TODO: trackEvent("tour.step_view", { tour: tour.slug, ... })
    if (stepIndex > 0) {
      writeUrl(activeSection.id, stepNum - 1);
      return;
    }
    if (sectionIndex > 0) {
      const prev = tour.sections[sectionIndex - 1];
      writeUrl(prev.id, prev.steps.length);
    }
  }, [
    activeSection.id,
    sectionIndex,
    stepIndex,
    stepNum,
    tour.sections,
    writeUrl,
  ]);

  const goNext = useCallback(() => {
    // TODO: trackEvent("tour.step_view", { tour: tour.slug, ... })
    if (stepIndex < activeSection.steps.length - 1) {
      writeUrl(activeSection.id, stepNum + 1);
      return;
    }
    if (sectionIndex < tour.sections.length - 1) {
      const next = tour.sections[sectionIndex + 1];
      writeUrl(next.id, 1);
    }
  }, [
    activeSection.id,
    activeSection.steps.length,
    sectionIndex,
    stepIndex,
    stepNum,
    tour.sections,
    writeUrl,
  ]);

  const onSectionClick = useCallback(
    (id: SectionId) => {
      // TODO: trackEvent("tour.section_enter", { tour: tour.slug, section: id })
      writeUrl(id, 1);
    },
    [writeUrl],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
      // Esc: no-op for now (user can use browser back).
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const hasSteps = activeSection.steps.length > 0;
  const ariaLabel = hasSteps
    ? `${activeSection.label}, step ${stepNum} of ${activeSection.steps.length}: ${currentStep.callout.title ?? currentStep.callout.body}`
    : `${activeSection.label} — coming soon`;

  return (
    <>
      {/* Mobile guard: below lg breakpoint the engine is too dense to use. */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-[640px] rounded-2xl bg-[#0a0a0a] px-6 py-12 text-center text-white/80">
          <p className="font-display text-[15px] leading-relaxed">
            This interactive walkthrough is built for desktop and tablet
            displays. Open this page on a wider screen to view the tour.
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <div
          role="region"
          aria-roledescription="slide"
          aria-label={ariaLabel}
          className="mx-auto max-w-[1440px] rounded-2xl bg-[#0a0a0a]"
        >
          <TourHeader
            sections={tour.sections}
            activeSectionId={activeSection.id}
            onSectionClick={onSectionClick}
          />
          <div className="px-6 md:px-10 pb-6">
            {hasSteps ? (
              <TourStage
                step={currentStep}
                showGrid={showGrid}
                authorMode={authorMode}
                tourSlug={tour.slug}
                sectionId={activeSection.id}
                nav={{
                  index: stepIndex,
                  total: activeSection.steps.length,
                  hasPrev,
                  hasNext,
                  onPrev: goPrev,
                  onNext: goNext,
                }}
              />
            ) : (
              <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-8 py-16 text-center">
                <p className="font-display text-[15px] leading-relaxed text-white/70">
                  {activeSection.label} steps are coming soon. Pick another
                  section above to continue the tour.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
