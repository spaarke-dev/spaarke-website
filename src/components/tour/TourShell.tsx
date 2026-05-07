"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SectionId, Tour } from "@/content/tours/types";
import {
  trackTourEvent,
  trackTourEventOnUnload,
} from "@/lib/tour-tracking";
import { TourHeader } from "./TourHeader";
import { TourStage } from "./TourStage";

type Props = {
  tour: Tour;
};

/** Sessions storage flag — we only fire `tour.started` once per browser
 * session, regardless of how many step navigations happen on this page.
 * Per-session means: clears when the user closes the tab. */
const SESSION_STARTED_KEY = "tour.started";
const SESSION_COMPLETED_KEY = "tour.completed";

/** How the user got to the current step. Tracking this lets us answer
 * "how many people arrow-key through vs jump to specific sections". */
type NavMode = "deeplink" | "keyboard" | "click" | "section-jump";

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

  /* ------------------------------------------------------------------
   * Telemetry refs
   *
   * - `tourStartTimestamp`: wall-clock millis when this session entered
   *   the tour. Used for session-total durations on completed/abandoned.
   * - `lastNavTimestamp`: when the most recent step view fired. Used to
   *   compute `dwellMsPrevious` on the next step view.
   * - `lastSectionId`: previous section, lets us detect cross-section
   *   transitions and emit `tour.section_enter` separately.
   * - `lastStepKey`: previous step's `${section}/${id}`, lets us
   *   distinguish a real step change from a re-render.
   * - `nextNavVia`: how the next step change is being triggered. Set by
   *   each navigation handler before it calls `writeUrl`, then cleared
   *   after it's read by the step-view effect.
   * - `sectionsViewed` / `stepsViewed`: unique sets so we can report
   *   how much the user actually saw.
   * - `feedbackSubmitted`: ever-true flag if the user has interacted
   *   with the FeedbackWidget. Read on completed/abandoned.
   * ------------------------------------------------------------------ */
  const tourStartTimestamp = useRef<number>(0);
  const lastNavTimestamp = useRef<number>(0);
  const lastSectionId = useRef<string | null>(null);
  const lastStepKey = useRef<string | null>(null);
  const nextNavVia = useRef<NavMode | null>(null);
  const sectionsViewed = useRef<Set<string>>(new Set());
  const stepsViewed = useRef<Set<string>>(new Set());

  const overallStepIndex = useMemo(() => {
    let acc = 0;
    for (let i = 0; i < sectionIndex; i++) {
      acc += tour.sections[i].steps.length;
    }
    return acc + stepIndex;
  }, [tour.sections, sectionIndex, stepIndex]);

  // -- Navigation helpers ----------------------------------------------
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
    if (nextNavVia.current === null) nextNavVia.current = "click";
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
    if (nextNavVia.current === null) nextNavVia.current = "click";
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
      nextNavVia.current = "section-jump";
      writeUrl(id, 1);
    },
    [writeUrl],
  );

  // Keyboard navigation: tag the upcoming step view as "keyboard"-driven.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextNavVia.current = "keyboard";
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextNavVia.current = "keyboard";
        goNext();
      }
      // Esc: no-op for now (user can use browser back).
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  /* ------------------------------------------------------------------
   * tour.started — fires once per browser session on first step view.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!currentStep) return;

    let alreadyStarted = false;
    try {
      alreadyStarted =
        sessionStorage.getItem(`${SESSION_STARTED_KEY}:${tour.slug}`) === "1";
    } catch {
      // sessionStorage can throw in some embedded contexts; treat as fresh.
    }

    tourStartTimestamp.current = Date.now();
    if (!alreadyStarted) {
      try {
        sessionStorage.setItem(`${SESSION_STARTED_KEY}:${tour.slug}`, "1");
      } catch {
        // ignore
      }
      const tourSession =
        typeof document !== "undefined"
          ? /(?:^|;\s*)tour_session=/.test(document.cookie)
          : false;
      const url = new URL(window.location.href);
      trackTourEvent("tour.started", {
        tourSlug: tour.slug,
        entrySection: activeSection.id,
        entryStep: currentStep.id,
        referrer:
          (typeof document !== "undefined" ? document.referrer : "") || "",
        utm_source: url.searchParams.get("utm_source") ?? "",
        utm_medium: url.searchParams.get("utm_medium") ?? "",
        utm_campaign: url.searchParams.get("utm_campaign") ?? "",
        hasTourSession: tourSession,
      });
    }
    // We deliberately omit deps — this effect is meant to fire on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------
   * tour.step_view + tour.section_enter — fire on every step change.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!currentStep) return;
    const stepKey = `${activeSection.id}/${currentStep.id}`;
    if (stepKey === lastStepKey.current) return;

    const now = Date.now();
    const dwellMsPrevious =
      lastNavTimestamp.current === 0 ? 0 : now - lastNavTimestamp.current;
    const via: NavMode = nextNavVia.current ?? "deeplink";
    nextNavVia.current = null;

    // tour.section_enter — only when the section actually changed.
    if (lastSectionId.current !== activeSection.id) {
      const enteredVia: NavMode | "forward" | "backward" =
        via === "section-jump"
          ? "section-jump"
          : via === "deeplink"
            ? "deeplink"
            : lastSectionId.current === null
              ? "deeplink"
              : sectionIndex >
                  tour.sections.findIndex((s) => s.id === lastSectionId.current)
                ? "forward"
                : "backward";
      trackTourEvent("tour.section_enter", {
        tourSlug: tour.slug,
        sectionId: activeSection.id,
        sectionIndex,
        enteredVia,
      });
    }

    trackTourEvent("tour.step_view", {
      tourSlug: tour.slug,
      sectionId: activeSection.id,
      stepId: currentStep.id,
      stepIndexInSection: stepIndex,
      stepIndexOverall: overallStepIndex,
      via,
      dwellMsPrevious,
      isInterstitial: currentStep.interstitial === true,
      prevSectionId: lastSectionId.current ?? "",
    });

    sectionsViewed.current.add(activeSection.id);
    stepsViewed.current.add(stepKey);
    lastNavTimestamp.current = now;
    lastSectionId.current = activeSection.id;
    lastStepKey.current = stepKey;

    // tour.completed — fires once per session when the outro is reached.
    if (currentStep.id === "tour-outro") {
      let alreadyCompleted = false;
      try {
        alreadyCompleted =
          sessionStorage.getItem(`${SESSION_COMPLETED_KEY}:${tour.slug}`) ===
          "1";
      } catch {
        // ignore
      }
      if (!alreadyCompleted) {
        try {
          sessionStorage.setItem(
            `${SESSION_COMPLETED_KEY}:${tour.slug}`,
            "1",
          );
        } catch {
          // ignore
        }
        trackTourEvent("tour.completed", {
          tourSlug: tour.slug,
          totalDurationMs: now - tourStartTimestamp.current,
          sectionsViewed: sectionsViewed.current.size,
          stepsViewed: stepsViewed.current.size,
        });
      }
    }
  }, [
    tour.slug,
    tour.sections,
    activeSection.id,
    sectionIndex,
    stepIndex,
    currentStep,
    overallStepIndex,
  ]);

  /* ------------------------------------------------------------------
   * tour.abandoned — fire on tab close / hide if we never reached outro.
   * Best-effort delivery via navigator.sendBeacon.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fireAbandoned = () => {
      if (!currentStep) return;
      let completed = false;
      try {
        completed =
          sessionStorage.getItem(`${SESSION_COMPLETED_KEY}:${tour.slug}`) ===
          "1";
      } catch {
        // ignore
      }
      if (completed) return;
      trackTourEventOnUnload("tour.abandoned", {
        tourSlug: tour.slug,
        lastSectionId: activeSection.id,
        lastStepId: currentStep.id,
        lastStepIndexOverall: overallStepIndex,
        totalDurationMs:
          tourStartTimestamp.current > 0
            ? Date.now() - tourStartTimestamp.current
            : 0,
        sectionsViewed: sectionsViewed.current.size,
        stepsViewed: stepsViewed.current.size,
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") fireAbandoned();
    };
    window.addEventListener("beforeunload", fireAbandoned);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", fireAbandoned);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [
    tour.slug,
    activeSection.id,
    currentStep,
    overallStepIndex,
  ]);

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
