"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Props = {
  /** Inline SVG markup for the top (Spaarke-hosted) layer. The slimmed
   * SVG references external assets via <image href>, which only resolve
   * when the SVG is part of the page DOM (not loaded as <img>/<object>),
   * so the parent reads the file server-side and passes content here. */
  topSvg: string;
  topAlt: string;
  topLabel: string;
  bottomSvg: string;
  bottomAlt: string;
  bottomLabel: string;
  /** Stage aspect ratio — should match the SVG viewBox. */
  aspectRatio?: string;
  /** Initial divider position as percentage (0–100). */
  initialPct?: number;
};

/**
 * Two-image compare slider with a draggable divider. The "top" image
 * (Spaarke-hosted) is clipped from the right via inset(); the "bottom"
 * image (customer-hosted) is fully visible underneath. Drag the
 * handle, click the stage, or use ←/→ keys.
 *
 * Layout:
 *   [Spaarke Hosted pill]  ⊙  [Customer Hosted pill]   ← control bar
 *   ────────────────────────────────────────────────   ← gap
 *   ┌──────────────────────────────────────────────┐
 *   │   diagram (with vertical wipe divider)       │   ← stage
 *   └──────────────────────────────────────────────┘
 *
 * Both source SVGs MUST share identical coordinates so the wipe
 * boundary lines up with the same architectural elements in both
 * versions.
 */
export function ArchitectureCompareSlider({
  topSvg,
  topAlt,
  topLabel,
  bottomSvg,
  bottomAlt,
  bottomLabel,
  aspectRatio = "1400 / 900",
  initialPct = 50,
}: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [pct, setPct] = useState(initialPct);

  const setPosition = useCallback((p: number) => {
    setPct(Math.max(0, Math.min(100, p)));
  }, []);

  const pctFromClientX = useCallback((clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return 50;
    const rect = stage.getBoundingClientRect();
    const x = clientX - rect.left;
    return (x / rect.width) * 100;
  }, []);

  const startDrag = useCallback(
    (clientX: number, target: HTMLElement | null, pointerId?: number) => {
      draggingRef.current = true;
      if (target?.setPointerCapture && pointerId !== undefined) {
        try {
          target.setPointerCapture(pointerId);
        } catch {
          // best-effort
        }
      }
      setPosition(pctFromClientX(clientX));
    },
    [pctFromClientX, setPosition],
  );

  // Window-level move/up listeners so the drag tracks even after the
  // pointer leaves the stage / handle bounds.
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setPosition(pctFromClientX(e.clientX));
    };
    const onPointerUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [pctFromClientX, setPosition]);

  const onStageDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    startDrag(e.clientX, e.currentTarget, e.pointerId);
    e.preventDefault();
  };

  const onHandleDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    startDrag(e.clientX, e.currentTarget, e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  };

  const onStageClick = (e: MouseEvent<HTMLDivElement>) => {
    setPosition(pctFromClientX(e.clientX));
  };

  const onHandleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      setPosition(pct - step);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setPosition(pct + step);
      e.preventDefault();
    } else if (e.key === "Home") {
      setPosition(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setPosition(100);
      e.preventDefault();
    }
  };

  return (
    <div className="relative w-full">
      {/* Control bar — sits ABOVE the stage with breathing room. The
          bar's positioning container has reserved height = handle
          height (48px), and mb-N below provides the visible gap to
          the diagram. The bar (pills + handle) translates to the
          divider position so it visually anchors the wipe boundary. */}
      <div className="relative mb-5 h-12 sm:mb-6">
        <div
          className="absolute top-0 flex items-center gap-2"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
        >
          <span
            className="pointer-events-none whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-white"
            style={{
              backgroundColor: "#0E2A47",
              boxShadow: "0 2px 6px rgba(15, 23, 42, 0.18)",
              opacity: pct >= 50 ? 1 : pct / 50,
              transition: "opacity 120ms linear",
            }}
          >
            {topLabel}
          </span>

          <button
            type="button"
            data-slider-handle
            role="slider"
            aria-label={`Drag to compare ${topLabel} and ${bottomLabel} architectures`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            tabIndex={0}
            onPointerDown={onHandleDown}
            onKeyDown={onHandleKey}
            className="flex h-12 w-12 cursor-ew-resize items-center justify-center rounded-full bg-white transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]/60"
            style={{
              color: "#0E2A47",
              touchAction: "none",
              boxShadow:
                "0 2px 6px rgba(15, 23, 42, 0.15), 0 8px 24px rgba(15, 23, 42, 0.18)",
            }}
          >
            <svg
              className="h-[22px] w-[22px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 6 3 12 9 18" />
              <polyline points="15 6 21 12 15 18" />
            </svg>
          </button>

          <span
            className="pointer-events-none whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.04em]"
            style={{
              backgroundColor: "#C5D9F0",
              color: "#0E2A47",
              border: "1px solid #B8C9DD",
              boxShadow: "0 2px 6px rgba(15, 23, 42, 0.10)",
              opacity: pct <= 50 ? 1 : (100 - pct) / 50,
              transition: "opacity 120ms linear",
            }}
          >
            {bottomLabel}
          </span>
        </div>
      </div>

      {/* Stage — diagram + wipe divider */}
      <div
        ref={stageRef}
        onPointerDown={onStageDown}
        onClick={onStageClick}
        className="relative w-full select-none overflow-hidden rounded-2xl"
        style={{
          aspectRatio,
          backgroundColor: "#F7F8FA",
          boxShadow:
            "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 32px rgba(15, 23, 42, 0.08)",
          touchAction: "none",
        }}
      >
        {/* Bottom layer (revealed on the right): customer-hosted.
            SVG markup is inlined into the DOM (server reads the file
            and passes content as a string) so its external <image href>
            references for the embedded Microsoft logos resolve normally.
            Fades out as the divider moves toward the right edge. */}
        <div
          aria-label={bottomAlt}
          role="img"
          className="pointer-events-none absolute inset-0 block h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
          style={{
            opacity: pct <= 50 ? 1 : (100 - pct) / 50,
            transition: "opacity 120ms linear",
          }}
          dangerouslySetInnerHTML={{ __html: bottomSvg }}
        />

        {/* Top layer (revealed on the left): spaarke-hosted, clipped
            from right. Symmetric fade with the bottom. */}
        <div
          aria-label={topAlt}
          role="img"
          className="pointer-events-none absolute inset-0 block h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
          style={{
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
            opacity: pct >= 50 ? 1 : pct / 50,
            transition: "opacity 120ms linear",
          }}
          dangerouslySetInnerHTML={{ __html: topSvg }}
        />

        {/* Wipe divider — vertical line at the clip boundary */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-0"
          style={{
            left: `${pct}%`,
            width: "2px",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow:
              "0 0 0 1px rgba(15, 23, 42, 0.10), 0 0 20px rgba(15, 23, 42, 0.15)",
          }}
        />
      </div>
    </div>
  );
}
