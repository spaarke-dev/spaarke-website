"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

/**
 * Animated product demo that shows the workspace, zooms into the
 * "My To Do" widget, then opens the full Smart To Do app view.
 *
 * Steps:
 *  0 – Full workspace (browser mockup)
 *  1 – Zoom into the My To Do widget area (CSS transform on workspace image)
 *  2 – Crossfade to the zoomed-in widget screenshot
 *  3 – Transition to the full Smart To Do app screenshot
 */

const STEP_DURATION_MS = 3000; // time each step stays visible
const TOTAL_STEPS = 4;

const STEP_LABELS = [
  "Legal Operations Workspace",
  "Smart To Do — prioritized tasks",
  "AI-scored priorities at a glance",
  "Full detail view with scoring breakdown",
];

export default function ProductDemo() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    setStep((s) => (s + 1) % TOTAL_STEPS);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(advance, STEP_DURATION_MS);
    return () => clearInterval(id);
  }, [isPaused, advance]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <h3 className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
        See it in action
      </h3>

      {/* Browser chrome mockup */}
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-muted shadow-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-4 flex-1 rounded-md bg-background/60 px-3 py-1 text-center text-xs text-muted-foreground">
            app.spaarke.com
          </span>
        </div>

        {/* Image viewport */}
        <div className="relative aspect-[16/9] w-full bg-white">
          {/* Step 0 & 1 — full workspace (zoom on step 1) */}
          <div
            className="absolute inset-0 transition-all duration-1000 ease-in-out"
            style={{
              opacity: step <= 1 ? 1 : 0,
              transform:
                step === 1
                  ? "scale(2.8) translate(16%, -22%)"
                  : "scale(1) translate(0, 0)",
              transformOrigin: "bottom left",
            }}
          >
            <Image
              src="/images/demo/workspace.png"
              alt="Spaarke Legal Operations Workspace"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Step 2 — zoomed widget screenshot */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: step === 2 ? 1 : 0 }}
          >
            <Image
              src="/images/demo/smart-to-do-list.jpeg"
              alt="Smart To Do widget with AI-scored priorities"
              fill
              className="object-contain"
            />
          </div>

          {/* Step 3 — full Smart To Do app */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: step === 3 ? 1 : 0 }}
          >
            <Image
              src="/images/demo/smart-to-do-open-app.jpeg"
              alt="Smart To Do full application view with detail panel"
              fill
              className="object-contain"
            />
          </div>

          {/* Highlight ring on step 1 to draw eye to the widget area */}
          <div
            className="pointer-events-none absolute bottom-[4%] left-[2%] h-[42%] w-[48%] rounded-lg border-2 border-spaarke-orange/70 shadow-[0_0_20px_rgba(255,148,0,0.3)] transition-opacity duration-700"
            style={{ opacity: step === 0 ? 1 : 0 }}
          />
        </div>
      </div>

      {/* Step label + progress indicators */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-foreground transition-opacity duration-500">
          {STEP_LABELS[step]}
        </p>

        <div className="flex gap-2">
          {STEP_LABELS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}`}
              className="group relative h-2 w-8 rounded-full bg-border transition-colors"
            >
              {/* Progress fill */}
              <span
                className="absolute inset-0 rounded-full bg-spaarke-orange transition-all duration-300"
                style={{
                  width: step === i ? "100%" : step > i ? "100%" : "0%",
                  opacity: step === i ? 1 : step > i ? 0.4 : 0,
                }}
              />
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {isPaused ? "Paused — hover off to resume" : "Hover to pause"}
        </p>
      </div>
    </section>
  );
}
