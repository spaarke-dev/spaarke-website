"use client";

import { Fragment, useState, type KeyboardEvent } from "react";
import { approach } from "@/app/services/content";
import { useAudience } from "./audience";

const TONES = {
  dark: {
    rule: "rgba(255,255,255,0.14)",
    marker: "#0a0a0a",
    accent: "#82A5EB",
    selected: "rgba(80,120,220,0.18)",
    border: "rgba(130,165,235,0.45)",
  },
  light: {
    rule: "rgba(10,10,10,0.14)",
    marker: "#ffffff",
    accent: "#3F5FD9",
    selected: "#EBF2FF",
    border: "rgba(80,120,220,0.35)",
  },
};

/**
 * Three-phase timeline (design.md 4.7): Design, Implement, Operate on one
 * line. Review round 5 (2026-11-21): the show and hide buttons are gone.
 * Each phase is a tab: selecting one highlights it in light blue and shows
 * its steps and outcome in the panel below, which shares the highlight; the
 * other phases' detail is hidden. The first phase starts selected. The step
 * lists flip with the audience. On phones the panel opens under the selected
 * phase. `tone` matches the band: dark or light.
 */
export function Phases({ tone = "dark" }: { tone?: keyof typeof TONES }) {
  const c = TONES[tone];
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
        {/* Timeline rule behind the markers (desktop). */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[43px] hidden h-px md:block"
          style={{ backgroundColor: c.rule }}
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
              className="relative flex cursor-pointer flex-col items-start justify-start rounded-2xl border p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
              style={{
                backgroundColor: selected ? c.selected : "transparent",
                borderColor: selected ? c.border : "transparent",
              }}
            >
              <span
                aria-hidden="true"
                className="font-mono-display relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-[13px]"
                style={{
                  backgroundColor: selected ? "#5078DC" : c.marker,
                  borderColor: "#5078DC",
                  color: selected ? "#ffffff" : c.accent,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-fg mt-5 block text-[28px] font-medium tracking-[-0.02em]">
                {p.name}
              </span>
              <span className="text-fg-mid mt-2 block text-[16px] leading-relaxed">{p.summary}</span>
            </button>
          );
          // Phones: the panel opens right under the selected phase.
          return selected ? (
            <Fragment key={p.id}>
              {tab}
              <div className="md:hidden">
                <PhasePanel tone={tone} index={i} />
              </div>
            </Fragment>
          ) : (
            tab
          );
        })}
      </div>

      {/* Wider screens: one panel under the row of phases. */}
      <div id="phase-panel" role="tabpanel" aria-labelledby={`phase-tab-${phase.id}`} className="mt-4 hidden md:block">
        <PhasePanel tone={tone} index={index} />
      </div>
    </div>
  );
}

function PhasePanel({ tone, index }: { tone: keyof typeof TONES; index: number }) {
  const { audience } = useAudience();
  const c = TONES[tone];
  const phase = approach.phases[index];
  return (
    <div
      className="grid grid-cols-1 gap-8 rounded-2xl border p-6 md:grid-cols-[3fr_2fr] md:gap-12 md:p-10"
      style={{ backgroundColor: c.selected, borderColor: c.border }}
    >
      <div>
        <p className="font-mono-display text-fg-low text-[11px] uppercase tracking-[0.16em]">
          {String(index + 1).padStart(2, "0")} {phase.name}: what happens
        </p>
        <ol className="mt-5 space-y-4">
          {phase.steps[audience].map((s, i) => (
            <li key={s} className="text-fg flex gap-4 text-[18px] leading-snug">
              <span className="font-mono-display mt-[3px] shrink-0 text-[13px]" style={{ color: c.accent }}>
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="md:border-l md:pl-12" style={{ borderColor: c.border }}>
        <p className="font-mono-display text-fg-low text-[11px] uppercase tracking-[0.16em]">Outcome</p>
        <p className="font-display text-fg mt-5 text-[22px] font-medium leading-snug tracking-[-0.01em]">
          {phase.outcome[audience]}
        </p>
      </div>
    </div>
  );
}
