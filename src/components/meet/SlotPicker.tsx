"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  allTimeZones,
  dateKeyOf,
  dayLabel,
  formatTime,
  groupByDay,
  inputBase,
  inputBorder,
  labelClass,
  weekdayOf,
} from "@/components/meet/shared";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  slots: string[];
  timeZone: string;
  onTimeZoneChange: (tz: string) => void;
  selected: string | null;
  onSelect: (iso: string) => void;
  durationMinutes: number;
  /** Shown above the calendar; defaults to "Choose a day". */
  dayHeading?: string;
};

/**
 * A month-style grid of the booking window with the open times for the chosen
 * day beside it. Days with no open time are shown but disabled, so the
 * visitor can see the shape of the window rather than a list with gaps.
 */
export function SlotPicker({
  slots,
  timeZone,
  onTimeZoneChange,
  selected,
  onSelect,
  durationMinutes,
  dayHeading = "Choose a day",
}: Props) {
  const byDay = useMemo(() => groupByDay(slots, timeZone), [slots, timeZone]);
  const dayKeys = useMemo(() => [...byDay.keys()].sort(), [byDay]);
  const zones = useMemo(() => allTimeZones(timeZone), [timeZone]);

  const [chosenDay, setChosenDay] = useState<string | null>(null);
  const selectedDay = selected ? dateKeyOf(selected, timeZone) : null;
  // The chosen day falls back to the selected slot's day, then the first open
  // day, so a zone change or a refreshed list never leaves an empty pane.
  const activeDay =
    (chosenDay && byDay.has(chosenDay) && chosenDay) ||
    (selectedDay && byDay.has(selectedDay) && selectedDay) ||
    dayKeys[0] ||
    null;

  const cells = useMemo(() => {
    if (dayKeys.length === 0) return [];
    const today = dateKeyOf(new Date().toISOString(), timeZone);
    const first = addDays(today, -weekdayOf(today));
    const last = dayKeys[dayKeys.length - 1];
    const end = addDays(last, 6 - weekdayOf(last));
    const out: { key: string; inWindow: boolean }[] = [];
    for (let k = first; k <= end; k = addDays(k, 1)) out.push({ key: k, inWindow: k >= today });
    return out;
  }, [dayKeys, timeZone]);

  const times = activeDay ? (byDay.get(activeDay) ?? []) : [];
  const monthTitle = (() => {
    if (cells.length === 0) return "";
    const a = dayLabel(cells[0].key, { month: "long", year: "numeric" });
    const b = dayLabel(cells[cells.length - 1].key, { month: "long", year: "numeric" });
    return a === b ? a : `${dayLabel(cells[0].key, { month: "long" })} to ${b}`;
  })();

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] md:gap-12">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-fg text-lg font-medium">{dayHeading}</h2>
          <p className="text-fg-low text-sm" aria-hidden="true">
            {monthTitle}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 sm:gap-1.5" role="group" aria-label="Days">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-fg-low pb-2 text-center font-mono text-[10px] uppercase tracking-[0.14em]">
              {d}
            </div>
          ))}
          {cells.map(({ key, inWindow }) => {
            const open = byDay.has(key);
            const isActive = key === activeDay;
            const label = dayLabel(key, { weekday: "long", month: "long", day: "numeric" });
            return (
              <button
                key={key}
                type="button"
                disabled={!open}
                aria-pressed={isActive}
                aria-label={open ? `${label}, ${byDay.get(key)!.length} times open` : `${label}, no times open`}
                onClick={() => setChosenDay(key)}
                className={[
                  "flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors",
                  "focus-visible:ring-cta-blue focus-visible:outline-none focus-visible:ring-2",
                  isActive
                    ? "bg-cta-blue font-medium text-white"
                    : open
                      ? "border-line-strong text-fg hover:border-cta-blue border"
                      : inWindow
                        ? "text-fg-low/60 cursor-default"
                        : "text-fg-low/30 cursor-default",
                ].join(" ")}
              >
                {Number(key.slice(8))}
              </button>
            );
          })}
        </div>

        <div className="mt-8 max-w-xs">
          <label htmlFor="meet-tz" className={labelClass}>
            Time zone
          </label>
          <div className="relative">
            <select
              id="meet-tz"
              value={timeZone}
              onChange={(e) => onTimeZoneChange(e.target.value)}
              className={`${inputBase} ${inputBorder(false)} appearance-none pr-8`}
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="text-fg-low pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-fg text-lg font-medium">
          {activeDay ? dayLabel(activeDay, { weekday: "long", month: "long", day: "numeric" }) : "Times"}
        </h2>
        <p className="text-fg-low mt-1 text-sm">{durationMinutes} minute meeting, Microsoft Teams</p>
        <div className="mt-5 grid grid-cols-2 gap-2" role="group" aria-label="Open times">
          {times.map((iso) => {
            const isSelected = iso === selected;
            return (
              <button
                key={iso}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(iso)}
                className={[
                  "rounded-full border px-3 py-2.5 text-sm font-medium transition-colors",
                  "focus-visible:ring-cta-blue focus-visible:outline-none focus-visible:ring-2",
                  isSelected
                    ? "border-cta-blue bg-cta-blue text-white"
                    : "border-line-strong text-fg hover:border-cta-blue",
                ].join(" ")}
              >
                {formatTime(iso, timeZone)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
