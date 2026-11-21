"use client";

import type { WhyNowStat } from "@/app/services/content";
import { useInView } from "./audience";

/**
 * One "why now" tile (design.md 4.3): action title, big figure, a small chart
 * where there is data, caption and source line. Charts are plain HTML bars:
 * one accent for the highlighted value, gray for context, direct labels, no
 * gridlines. Bars grow once on scroll-in (700 ms); reduced motion shows them
 * at full length.
 */

type Tone = "dark" | "light";

/** Chart colors per band tone; text colors come from the band's data-tone tokens. */
const PALETTE: Record<Tone, { accent: string; context: string; track: string; underline: string; hover: string }> = {
  dark: {
    accent: "#82A5EB",
    context: "rgba(255, 255, 255, 0.22)",
    track: "rgba(255, 255, 255, 0.06)",
    underline: "rgba(255,255,255,0.25)",
    hover: "#82A5EB",
  },
  light: {
    accent: "#5078DC",
    context: "rgba(10, 10, 10, 0.24)",
    track: "rgba(10, 10, 10, 0.06)",
    underline: "rgba(10,10,10,0.25)",
    hover: "#3F5FD9",
  },
};

type Palette = (typeof PALETTE)[Tone];

export function StatTile({ stat, tone = "dark" }: { stat: WhyNowStat; tone?: Tone }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const c = PALETTE[tone];

  return (
    <article className="border-line-strong flex flex-col border-t pt-6">
      <p className="font-mono-display text-fg-low text-[11px] uppercase tracking-[0.16em]">{stat.theme}</p>
      <h3 className="font-display text-fg mt-3 text-[19px] font-medium leading-snug tracking-[-0.01em]">
        {stat.title}
      </h3>
      <div ref={ref} className="mt-5">
        <p
          className="font-display text-fg font-medium leading-none tracking-tight"
          style={{ fontSize: "clamp(38px, 3.6vw, 54px)" }}
        >
          {stat.figure}
        </p>
        <Chart stat={stat} grow={inView} c={c} />
      </div>
      <p className="text-fg-mid mt-4 text-[15px] leading-relaxed">{stat.caption}</p>
      <p className="font-mono-display text-fg-low mt-auto pt-5 text-[11px] uppercase leading-relaxed tracking-wider">
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
    </article>
  );
}

function Bar({
  pct,
  color,
  track,
  grow,
  delay = 0,
}: {
  pct: number;
  color: string;
  track: string;
  grow: boolean;
  delay?: number;
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: track }}>
      <div
        className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out"
        style={{ width: grow ? `${pct}%` : "0%", backgroundColor: color, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

function Chart({ stat, grow, c }: { stat: WhyNowStat; grow: boolean; c: Palette }) {
  if (stat.chart === "bigNumber") {
    return stat.bar != null ? (
      <div className="mt-4" aria-hidden="true">
        <Bar pct={stat.bar} color={c.accent} track={c.track} grow={grow} />
      </div>
    ) : null;
  }

  const data = stat.data ?? [];
  const max = Math.max(...data.map((d) => d.value), 1);

  if (stat.chart === "columns") {
    // Two to three columns, the latest one highlighted.
    return (
      <div className="mt-4 flex h-20 items-end gap-3" role="img" aria-label={describe(stat)}>
        {data.map((d, i) => {
          const last = i === data.length - 1;
          return (
            <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="font-mono-display text-fg-mid text-[11px]">
                ${d.value}B{last ? "+" : ""}
              </span>
              <div
                className="w-full max-w-[56px] rounded-t-[3px] motion-safe:transition-[height] motion-safe:duration-700 motion-safe:ease-out"
                style={{
                  height: grow ? `${(d.value / max) * 70}%` : "0%",
                  backgroundColor: last ? c.accent : c.context,
                  transitionDelay: `${i * 120}ms`,
                }}
              />
              <span className="font-mono-display text-fg-low text-[11px]">{d.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // pairedBars and comparisonBars: horizontal bars with direct labels.
  // pairedBars highlights the latest period; comparisonBars the better case.
  const highlight = stat.chart === "pairedBars" ? data.length - 1 : data.findIndex((d) => d.value === max);
  return (
    <div className="mt-4 space-y-2.5" role="img" aria-label={describe(stat)}>
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="font-mono-display mb-1 flex justify-between text-[11px]">
            <span className={i === highlight ? "text-fg" : "text-fg-low"}>{d.label}</span>
            <span className={i === highlight ? "text-fg" : "text-fg-low"}>
              {stat.chart === "comparisonBars" && i !== highlight ? "<" : ""}
              {stat.chart === "comparisonBars" && i === highlight ? "~" : ""}
              {d.value}%
            </span>
          </div>
          <Bar
            pct={(d.value / 100) * 100}
            color={i === highlight ? c.accent : c.context}
            track={c.track}
            grow={grow}
            delay={i * 120}
          />
        </div>
      ))}
    </div>
  );
}

function describe(stat: WhyNowStat): string {
  const parts = (stat.data ?? []).map((d) => `${d.label}: ${d.value}${stat.unit?.startsWith("%") ? "%" : ` ${stat.unit ?? ""}`}`);
  return `${stat.title}. ${parts.join("; ")}`;
}
