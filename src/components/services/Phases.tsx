"use client";

import { useState } from "react";
import { approach } from "@/app/services/content";
import { useAudience } from "./audience";

const TONES = {
  dark: { rule: "rgba(255,255,255,0.14)", marker: "#0a0a0a", accent: "#82A5EB", button: "rgba(255,255,255,0.18)" },
  light: { rule: "rgba(10,10,10,0.14)", marker: "#ffffff", accent: "#3F5FD9", button: "rgba(10,10,10,0.18)" },
};

/**
 * Three-phase timeline (design.md 4.7): Design, Implement, Operate on one
 * line. Each phase opens to its steps and outcome; the step lists flip with
 * the audience. The first phase starts open so the pattern is visible.
 * `tone` matches the band: dark or light.
 */
export function Phases({ tone = "dark" }: { tone?: keyof typeof TONES }) {
  const { audience } = useAudience();
  const c = TONES[tone];
  const [open, setOpen] = useState<Record<string, boolean>>({ [approach.phases[0].id]: true });

  return (
    <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      {/* Timeline rule behind the markers (desktop). */}
      <div aria-hidden="true" className="absolute left-0 right-0 top-[19px] hidden h-px md:block" style={{ backgroundColor: c.rule }} />
      {approach.phases.map((p, i) => {
        const isOpen = !!open[p.id];
        const panelId = `phase-${p.id}`;
        return (
          <li key={p.id} className="relative">
            <span
              aria-hidden="true"
              className="font-mono-display relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-[13px]"
              style={{ backgroundColor: c.marker, borderColor: "#5078DC", color: c.accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-fg mt-5 text-[28px] font-medium tracking-[-0.02em]">{p.name}</h3>
            <p className="text-fg-mid mt-2 text-[16px] leading-relaxed">{p.summary}</p>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))}
              className="font-body text-fg mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--phase-button)] px-4 py-1.5 text-[13px] transition-colors hover:border-[#5078DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
              style={{ ["--phase-button" as string]: c.button }}
            >
              {isOpen ? "Hide detail" : "Show detail"}
              <span aria-hidden="true" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                &#9662;
              </span>
            </button>
            <div id={panelId} hidden={!isOpen} className="mt-5">
              <ul className="text-fg-mid space-y-2 text-[15px] leading-relaxed">
                {p.steps[audience].map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: c.accent }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <p className="border-line mt-5 border-t pt-4 text-[15px]">
                <span className="font-mono-display text-fg-low block text-[11px] uppercase tracking-[0.16em]">
                  Outcome
                </span>
                <span className="text-fg mt-1 block">{p.outcome[audience]}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
