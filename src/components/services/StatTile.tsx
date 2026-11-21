"use client";

import { Person24Filled } from "@fluentui/react-icons";
import type { WhyNowStat } from "@/app/services/content";
import { useAudience, useInView } from "./audience";

/**
 * One "why now" tile. Review round 3 (2026-11-21): the headline and
 * description sit on the left and a small chart with its number on the
 * right: a donut for one share of a whole, ten figures for "x in ten", or
 * two columns for a before and after. One accent for the highlighted value,
 * gray for context, direct labels, no gridlines. Charts draw once on
 * scroll-in (700 ms); reduced motion shows them complete.
 */

type Tone = "dark" | "light";

/** Chart colors per band tone; text colors come from the band's data-tone tokens. */
const PALETTE: Record<
  Tone,
  { accent: string; context: string; track: string; underline: string; hover: string; card: string; border: string }
> = {
  dark: {
    accent: "#82A5EB",
    context: "rgba(255, 255, 255, 0.22)",
    track: "rgba(255, 255, 255, 0.08)",
    underline: "rgba(255,255,255,0.25)",
    hover: "#82A5EB",
    card: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.12)",
  },
  light: {
    accent: "#5078DC",
    context: "rgba(10, 10, 10, 0.18)",
    track: "rgba(80, 120, 220, 0.12)",
    underline: "rgba(10,10,10,0.25)",
    hover: "#3F5FD9",
    card: "#f7f9fe",
    border: "rgba(80,120,220,0.16)",
  },
};

type Palette = (typeof PALETTE)[Tone];

export function StatTile({ stat, tone = "dark" }: { stat: WhyNowStat; tone?: Tone }) {
  const { audience } = useAudience();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const c = PALETTE[tone];

  return (
    <article
      className="grid grid-cols-1 gap-6 rounded-3xl border p-6 sm:grid-cols-[1fr_auto] sm:items-center md:p-8"
      style={{ backgroundColor: c.card, borderColor: c.border }}
    >
      <div className="flex min-w-0 flex-col">
        <p className="font-mono-display text-fg-low text-[11px] uppercase tracking-[0.16em]">{stat.theme}</p>
        <h3 className="font-display text-fg mt-3 text-[clamp(19px,1.5vw,22px)] font-medium leading-snug tracking-[-0.01em]">
          {stat.title[audience]}
        </h3>
        <p className="text-fg-mid mt-3 text-[15px] leading-relaxed">{stat.caption}</p>
        <p className="font-mono-display text-fg-low mt-5 text-[11px] uppercase leading-relaxed tracking-wider">
          Source:{" "}
          <a
            href={stat.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--stat-hover)]"
            style={{ textDecorationColor: c.underline, ["--stat-hover" as string]: c.hover }}
          >
            {stat.source.name}
          </a>
          {stat.source.date ? `, ${stat.source.date}` : ""}
          {stat.source.note ? `. ${stat.source.note}` : ""}
        </p>
      </div>
      <div ref={ref} className="flex justify-center sm:w-[168px]">
        <Chart stat={stat} draw={inView} c={c} label={`${stat.title[audience]}. ${describe(stat)}`} />
      </div>
    </article>
  );
}

const EASE = "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out";

function Chart({ stat, draw, c, label }: { stat: WhyNowStat; draw: boolean; c: Palette; label: string }) {
  if (stat.chart === "donut") {
    const r = 58;
    const len = 2 * Math.PI * r;
    const share = Math.min(100, Math.max(0, stat.value ?? 0)) / 100;
    return (
      <div className="relative h-[152px] w-[152px]" role="img" aria-label={label}>
        <svg viewBox="0 0 152 152" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="76" cy="76" r={r} fill="none" stroke={c.track} strokeWidth="14" />
          <circle
            cx="76"
            cy="76"
            r={r}
            fill="none"
            stroke={c.accent}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={draw ? len * (1 - share) : len}
            className={EASE}
          />
        </svg>
        <span
          aria-hidden="true"
          className="font-display text-fg absolute inset-0 flex items-center justify-center font-medium tracking-tight"
          style={{ fontSize: 34 }}
        >
          {stat.figure}
        </span>
      </div>
    );
  }

  if (stat.chart === "waffle") {
    const on = Math.round(stat.value ?? 0);
    return (
      <div className="flex flex-col items-center" role="img" aria-label={label}>
        <span aria-hidden="true" className="font-display text-fg font-medium leading-none tracking-tight" style={{ fontSize: 44 }}>
          {stat.figure}
        </span>
        <div aria-hidden="true" className="mt-4 grid grid-cols-5 gap-x-1 gap-y-2">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={`${EASE} flex`}
              style={{
                color: i < on ? c.accent : c.context,
                opacity: draw ? 1 : 0,
                transform: draw ? "none" : "translateY(4px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <Person24Filled />
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Columns: two or three values, the highlighted one in the accent color.
  const data = stat.data ?? [];
  const max = Math.max(...data.map((d) => d.value), 1);
  const hi = stat.highlight ?? data.length - 1;
  return (
    <div className="flex h-[168px] w-[152px] items-end justify-center gap-4" role="img" aria-label={label}>
      {data.map((d, i) => (
        <div key={d.label} aria-hidden="true" className="flex h-full w-[60px] flex-col items-center justify-end">
          <span
            className={`font-display font-medium leading-none tracking-tight ${i === hi ? "text-fg" : "text-fg-low"}`}
            style={{ fontSize: i === hi ? 24 : 18 }}
          >
            {d.display}
          </span>
          <div
            className={`${EASE} mt-2 w-full rounded-t-[6px]`}
            style={{
              height: draw ? `${(d.value / max) * 104}px` : "0px",
              backgroundColor: i === hi ? c.accent : c.context,
              transitionDelay: `${i * 120}ms`,
            }}
          />
          <span className="font-mono-display text-fg-low mt-2 text-center text-[10px] uppercase leading-tight tracking-[0.08em]">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function describe(stat: WhyNowStat): string {
  if (stat.chart === "columns") return (stat.data ?? []).map((d) => `${d.label}: ${d.display}`).join("; ");
  return `${stat.figure ?? ""} ${stat.caption}`;
}
