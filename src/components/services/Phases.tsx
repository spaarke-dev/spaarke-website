"use client";

import { Fragment, useState, type CSSProperties, type KeyboardEvent } from "react";
import { approach } from "@/app/services/content";
import { useAudience } from "./audience";

const BLUE = "#5078DC";
const INK = "#3F5FD9";
const GAP = 16; // md:gap-4, used to place the panel's pointer under the selected phase

/** Resting and raised card shadows on the light band. */
const SHADOW = "0 1px 2px rgba(10,10,10,0.04), 0 10px 28px rgba(63,95,217,0.08)";
const SHADOW_UP = "0 2px 4px rgba(10,10,10,0.05), 0 22px 54px rgba(63,95,217,0.22)";

/** The dark detail panel: the site's ink with its blue glow. */
const PANEL: CSSProperties = {
  backgroundColor: "#0a0d16",
  color: "#f5f5f5",
  backgroundImage:
    "radial-gradient(ellipse 70% 90% at 85% 0%, rgba(130,165,235,0.20) 0%, rgba(80,120,220,0.08) 40%, transparent 75%), radial-gradient(ellipse 60% 70% at 0% 100%, rgba(80,120,220,0.12) 0%, transparent 70%)",
  borderColor: "rgba(130,165,235,0.32)",
  boxShadow: "0 30px 70px rgba(10,13,22,0.28), 0 6px 18px rgba(10,13,22,0.16)",
};

/**
 * Three-phase timeline (design.md 4.7): Design, Implement, Operate on one
 * line. Each phase is a tab; the first starts selected.
 *
 * Process change list (2026-11-22): the phases are raised white cards on a
 * tinted band, each with a rough duration (Weeks, Months, Ongoing). The
 * selected card lifts and turns blue, and its steps and outcome open in a
 * dark panel below with a pointer under the selected card. The step lists
 * flip with the audience. On phones the panel opens under the selected
 * phase, without the pointer.
 */
export function Phases() {
  const [active, setActive] = useState(approach.phases[0].id);
  const index = approach.phases.findIndex((p) => p.id === active);
  const phase = approach.phases[index];

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = approach.phases.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i + n - 1) % n : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(approach.phases[next].id);
    document.getElementById(`phase-tab-${approach.phases[next].id}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Phases" className="relative grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {/* Timeline rule through the markers; it shows in the gaps between the cards (desktop). */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[48px] hidden h-px md:block"
          style={{ backgroundImage: `linear-gradient(90deg, transparent, ${BLUE} 12%, ${BLUE} 88%, transparent)`, opacity: 0.45 }}
        />
        {approach.phases.map((p, i) => {
          const selected = p.id === active;
          const tab = (
            <button
              key={p.id}
              id={`phase-tab-${p.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="phase-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(p.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={[
                "group relative flex cursor-pointer flex-col items-start justify-start rounded-2xl border bg-white p-7 text-left transition-[transform,box-shadow,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2",
                selected ? "md:-translate-y-1" : "hover:-translate-y-0.5",
              ].join(" ")}
              style={{
                borderColor: selected ? BLUE : "rgba(10,10,10,0.08)",
                boxShadow: selected ? SHADOW_UP : SHADOW,
              }}
            >
              {/* Blue rule along the top of the selected card. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-[3px] rounded-b-full transition-opacity"
                style={{ backgroundColor: BLUE, opacity: selected ? 1 : 0 }}
              />
              <span className="flex w-full items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="font-mono-display relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-[13px] transition-colors"
                  style={{
                    backgroundColor: selected ? BLUE : "#ffffff",
                    borderColor: BLUE,
                    color: selected ? "#ffffff" : INK,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-mono-display rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
                  style={{
                    backgroundColor: selected ? "#EBF2FF" : "#f3f4f7",
                    color: selected ? INK : "rgba(10,10,10,0.72)",
                  }}
                >
                  {p.duration}
                </span>
              </span>
              <span className="font-display text-fg mt-6 block text-[28px] font-medium tracking-[-0.02em]">
                {p.name}
              </span>
              <span className="mt-2 block text-[16px] leading-relaxed text-[rgba(10,10,10,0.78)]">{p.summary}</span>
            </button>
          );
          // Phones: the panel opens right under the selected phase.
          return selected ? (
            <Fragment key={p.id}>
              {tab}
              <div className="md:hidden">
                <PhasePanel index={i} />
              </div>
            </Fragment>
          ) : (
            tab
          );
        })}
      </div>

      {/* Wider screens: one panel under the row of phases, pointing at the selected one. */}
      <div id="phase-panel" role="tabpanel" aria-labelledby={`phase-tab-${phase.id}`} className="relative mt-6 hidden md:block">
        <span
          aria-hidden="true"
          className="absolute -top-[7px] z-10 h-[14px] w-[14px] -translate-x-1/2 rotate-45 border-l border-t transition-[left] duration-300"
          style={{
            left: `calc((100% - ${2 * GAP}px) / 3 * ${index + 0.5} + ${GAP * index}px)`,
            backgroundColor: "#0e1320",
            borderColor: PANEL.borderColor,
          }}
        />
        <PhasePanel index={index} />
      </div>
    </div>
  );
}

function PhasePanel({ index }: { index: number }) {
  const { audience } = useAudience();
  const phase = approach.phases[index];
  return (
    // Explicit light text: the site's tone tokens only flip to light inside a
    // light band, not back to dark, so data-tone="dark" would not help here.
    <div
      className="relative grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border p-6 md:grid-cols-[3fr_2fr] md:gap-12 md:p-10"
      style={PANEL}
    >
      <div>
        <p className="font-mono-display text-[11px] uppercase tracking-[0.16em] text-[rgba(245,245,245,0.72)]">
          {String(index + 1).padStart(2, "0")} {phase.name}: what happens
        </p>
        <ol className="mt-5 space-y-4">
          {phase.steps[audience].map((s, i) => (
            <li key={s} className="flex gap-4 text-[18px] leading-snug">
              <span
                className="font-mono-display mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[12px]"
                style={{ borderColor: "rgba(130,165,235,0.5)", color: "#A9C1F2" }}
              >
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <div
        className="rounded-xl border p-6 md:p-7"
        style={{ backgroundColor: "rgba(130,165,235,0.08)", borderColor: "rgba(130,165,235,0.28)" }}
      >
        <p className="font-mono-display text-[11px] uppercase tracking-[0.16em] text-[#A9C1F2]">Outcome</p>
        <p className="font-display mt-4 text-[22px] font-medium leading-snug tracking-[-0.01em]">
          {phase.outcome[audience]}
        </p>
      </div>
    </div>
  );
}
