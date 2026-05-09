"use client";

import Image from "next/image";
import type { CSSProperties, MouseEventHandler } from "react";
import type { CalloutNav, TourStep } from "@/content/tours/types";
import { Callout } from "@/components/tour/Callout";
import { CoordinateGrid } from "@/components/tour/CoordinateGrid";
import { InterstitialOverlay } from "@/components/tour/InterstitialOverlay";

type Props = {
  step: TourStep;
  /** When true, overlays the 5%-step coordinate grid (`?grid=1`). */
  showGrid?: boolean;
  /**
   * When true, clicking the stage prints + copies the click position as
   * normalized `{x, y}` coords (`?author=1`). Author aid for placing
   * callout anchors; production users never reach this.
   */
  authorMode?: boolean;
  /**
   * Step navigation passed straight through to the inline nav row inside
   * the callout. When omitted, the callout renders without nav controls.
   */
  nav?: CalloutNav;
  /**
   * Identifiers forwarded to the inline FeedbackWidget rendered inside
   * the callout. `stepId` is derived from `step.id` at the Callout call
   * site, so only the slug + section need plumbing here.
   */
  tourSlug?: string;
  sectionId?: string;
};

/**
 * The screenshot + overlay container. Establishes the normalized
 * coordinate space everything inside positions against:
 *
 * - Outer wrapper sets `aspect-ratio` from the screenshot's intrinsic
 *   dimensions and a dark letterbox background.
 * - The screenshot is rendered at intrinsic size with `w-full` so it
 *   fills the wrapper at any width.
 * - `<Callout>` and `<CoordinateGrid>` are absolutely positioned over
 *   the screenshot in the same coordinate space.
 *
 * No `role` / `aria-label` here — `TourShell` wraps with a labeled
 * region that knows the section + step indices.
 */
export function TourStage({
  step,
  showGrid = false,
  authorMode = false,
  nav,
  tourSlug,
  sectionId,
}: Props): React.ReactElement {
  const { screenshot, callout } = step;

  const wrapperStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio: `${screenshot.width} / ${screenshot.height}`,
    backgroundColor: "#0a0a0a",
    overflow: "hidden",
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!authorMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const coords = `{ x: ${x.toFixed(3)}, y: ${y.toFixed(3)} }`;
    console.log("[author]", coords);
    void navigator.clipboard?.writeText(coords);
  };

  const isInterstitial = step.interstitial === true;

  return (
    <div style={wrapperStyle} onClick={authorMode ? handleClick : undefined}>
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        priority
        className="block h-auto w-full"
        style={isInterstitial ? { opacity: 0.55 } : undefined}
      />
      {isInterstitial ? (
        <>
          {/* Translucent backdrop dims and softly blurs the screenshot
              so the centered card reads as a paused state on top of the
              tour, not a hard page break. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(15,23,42,0.35)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              pointerEvents: "none",
            }}
          />
          <InterstitialOverlay callout={callout} nav={nav} stepId={step.id} />
        </>
      ) : (
        <Callout
          callout={callout}
          nav={nav}
          tourSlug={tourSlug}
          sectionId={sectionId}
          stepId={step.id}
        />
      )}
      <CoordinateGrid enabled={showGrid} />
    </div>
  );
}
