"use client";

import { useEffect, useState } from "react";
import { howItWorks, type AllocationItem } from "@/app/services/content";
import { useAudience, useInView } from "./audience";

/**
 * Functional allocation diagram (design.md 4.4 and 6.1). Two panels joined by
 * a services-agreement connector. Items build in one at a time (120 ms
 * stagger, left panel first) when the diagram scrolls into view; hovering,
 * focusing or tapping an item shows its one-line explanation. Under reduced
 * motion everything is shown at once and Replay is hidden.
 */

const STAGGER = 120;

export function AllocationDiagram() {
  const { audience } = useAudience();
  const keeps = howItWorks.keeps[audience];
  const takes = howItWorks.takes[audience];
  const sides = howItWorks.sideLabel[audience];

  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const [built, setBuilt] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [detail, setDetail] = useState<AllocationItem | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Start the build one frame after the diagram enters the viewport, so the
  // items' initial hidden state is painted and the transition runs.
  useEffect(() => {
    if (!inView) return;
    const id = requestAnimationFrame(() => setBuilt(true));
    return () => cancelAnimationFrame(id);
  }, [inView]);

  // Rebuild when the audience flips, so the new labels build in too.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetail(null);
  }, [audience]);

  const replay = () => {
    setBuilt(false);
    window.setTimeout(() => setBuilt(true), 60);
  };

  const show = built || reduced;

  return (
    <div ref={ref}>
      <div className="grid grid-cols-1 items-stretch gap-0 md:grid-cols-[1fr_120px_1fr]">
        <Panel
          title={sides.left}
          subtitle={keeps.title}
          items={keeps.items}
          tone="client"
          show={show}
          offset={0}
          onDetail={setDetail}
        />

        {/* Connector: horizontal on desktop, vertical on phones. */}
        <div className="relative flex items-center justify-center py-6 md:py-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(10,10,10,0.25)] md:left-0 md:top-1/2 md:h-px md:w-full md:translate-x-0 md:-translate-y-1/2" />
          <span className="font-mono-display relative rounded-full border border-[rgba(10,10,10,0.18)] bg-white px-3 py-1.5 text-center text-[10px] uppercase leading-tight tracking-[0.14em] text-[rgba(10,10,10,0.7)]">
            Services
            <br />
            agreement
          </span>
        </div>

        <Panel
          title={sides.right}
          subtitle={takes.title}
          items={takes.items}
          tone="operator"
          show={show}
          offset={keeps.items.length}
          onDetail={setDetail}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-mid min-h-[1.5em] text-[15px]" aria-live="polite">
          {detail ? (
            <>
              <span className="text-fg font-medium">{detail.label}.</span> {detail.detail}
            </>
          ) : (
            <span className="text-fg-low">Hover over or select an item to see what it covers.</span>
          )}
        </p>
        {!reduced && (
          <button
            type="button"
            onClick={replay}
            className="font-body text-fg-mid hover:text-fg self-start rounded-full border border-[rgba(10,10,10,0.18)] px-4 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] sm:self-auto"
          >
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  items,
  tone,
  show,
  offset,
  onDetail,
}: {
  title: string;
  subtitle: string;
  items: AllocationItem[];
  tone: "client" | "operator";
  show: boolean;
  offset: number;
  onDetail: (i: AllocationItem | null) => void;
}) {
  const operator = tone === "operator";
  return (
    <div
      className="rounded-3xl border p-6 md:p-8"
      style={{
        backgroundColor: operator ? "rgba(80, 120, 220, 0.08)" : "#ffffff",
        borderColor: operator ? "rgba(80, 120, 220, 0.45)" : "rgba(10, 10, 10, 0.12)",
      }}
    >
      <p className="font-display text-fg text-[22px] font-medium tracking-[-0.01em]">{title}</p>
      <p
        className="font-mono-display mt-1 text-[11px] uppercase tracking-[0.16em]"
        style={{ color: operator ? "#3F5FD9" : "rgba(10,10,10,0.55)" }}
      >
        {subtitle}
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li
            key={item.label}
            className={`motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${
              show ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
            }`}
            style={{ transitionDelay: show ? `${(offset + i) * STAGGER}ms` : "0ms" }}
          >
            <button
              type="button"
              onMouseEnter={() => onDetail(item)}
              onFocus={() => onDetail(item)}
              onClick={() => onDetail(item)}
              title={item.detail}
              className="font-body rounded-full border px-3.5 py-2 text-left text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
              style={
                operator
                  ? { backgroundColor: "#5078DC", borderColor: "#5078DC", color: "#ffffff" }
                  : { backgroundColor: "#f6f6f4", borderColor: "rgba(10,10,10,0.14)", color: "#0a0a0a" }
              }
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Every structure is tailored": three illustrative clients and the services each chose. */
export function ServiceMenu() {
  const { audience } = useAudience();
  const services = howItWorks.takes[audience].items.map((i) => i.label);
  const examples = howItWorks.tailored.examples[audience];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[300px] border-collapse text-left">
        <caption className="sr-only">Services chosen by three illustrative clients</caption>
        <thead>
          <tr>
            <th scope="col" className="font-mono-display text-fg-low pb-3 text-[11px] font-normal uppercase tracking-[0.14em]">
              Service
            </th>
            {examples.map((e) => (
              <th
                key={e.name}
                scope="col"
                className="font-mono-display text-fg-low pb-3 text-center text-[11px] font-normal uppercase tracking-[0.14em]"
              >
                {e.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s} className="border-t border-[rgba(10,10,10,0.08)]">
              <th scope="row" className="text-fg py-2 pr-4 text-[14px] font-normal">
                {s}
              </th>
              {examples.map((e) => {
                const on = e.chosen.includes(s);
                return (
                  <td key={e.name} className="py-2 text-center">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: on ? "#5078DC" : "transparent", border: on ? "none" : "1px solid rgba(10,10,10,0.2)" }}
                    />
                    <span className="sr-only">{on ? "Included" : "Not included"}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
