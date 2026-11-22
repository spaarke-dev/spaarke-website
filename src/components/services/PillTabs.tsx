"use client";

import { useRef, type KeyboardEvent } from "react";

/**
 * Numbered pill tabs for the structure and network visuals, on a dark band.
 * Colors follow the Phases tabs (selected: soft blue fill and blue border;
 * number in light blue) and the Law Firm | Corporate switch (rounded-full,
 * Inter 13 to 14 px). Arrow keys move between tabs, as in any tab set.
 * On phones an odd number of tabs sits two across with the last one full
 * width.
 */
export function PillTabs<T extends string | number>({
  items,
  value,
  onChange,
  label,
  controls,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  /** id of the element the tabs change. */
  controls?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const odd = items.length % 2 === 1;

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = items.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i + n - 1) % n : -1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {items.map((it, i) => {
        const selected = it.id === value;
        return (
          <button
            key={String(it.id)}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={controls}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(it.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={[
              "font-body inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82A5EB] sm:justify-start sm:text-[14px]",
              selected
                ? "text-fg border-[rgba(130,165,235,0.55)] bg-[rgba(80,120,220,0.18)]"
                : "text-fg-mid border-line-strong hover:text-fg",
              odd && i === items.length - 1 ? "col-span-2" : "",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="font-mono-display text-[11px]"
              style={{ color: selected ? "#82A5EB" : "rgba(245,245,245,0.45)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
