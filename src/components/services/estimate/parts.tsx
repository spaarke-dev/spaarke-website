"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Building blocks shared by the law firm and legal department estimates
 * (tasks 070 and 071): the inputs card, objective cards, summary bar and the
 * cards and structure boxes of "How the estimate works".
 */

/**
 * Secondary text on the light estimate surfaces. Darker than the site's
 * tertiary gray, for small labels and axis text (value page row 18).
 */
export const MUTED = "text-[rgba(10,10,10,0.72)]";

const BTN =
  "inline-flex shrink-0 items-center gap-2 rounded-full bg-[#5078DC] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#3F5FD9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2 motion-safe:hover:scale-[1.02]";

export type Fact = [value: string, text: string];

export interface Objective {
  title: string;
  question: string;
  /** Headline figure; left out for a card with no figures (the equity card). */
  big?: string;
  cap?: string;
  facts?: Fact[];
  bullets?: string[];
  link?: { label: string; href: string };
}

export function InputsCard({
  label,
  presetsLabel,
  presets,
  active,
  onPreset,
  children,
  after,
}: {
  label: string;
  presetsLabel: string;
  presets: readonly { key: string; label: string }[];
  active: string | null;
  onPreset: (key: string) => void;
  children: ReactNode;
  /** Below the sliders: the upside toggle and the assumption controls. */
  after?: ReactNode;
}) {
  return (
    <section aria-label={label} className="border-line rounded-3xl border bg-white p-6 md:p-8">
      <div role="group" aria-label="Size" className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className={`${MUTED} text-[13px]`}>{presetsLabel}</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => {
            const on = active === p.key;
            return (
              <button
                key={p.key}
                type="button"
                aria-pressed={on}
                onClick={() => onPreset(p.key)}
                className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] ${
                  on
                    ? "border-[#5078DC] bg-[#5078DC] text-white"
                    : "border-line-strong text-fg hover:border-[#5078DC] hover:text-[#3F5FD9]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">{children}</div>
      {after}
    </section>
  );
}

/** An on/off switch with a label and a note under it. */
export function Toggle({
  id,
  label,
  note,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  note: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-note`}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2 ${
          checked ? "bg-[#5078DC]" : "bg-[rgba(10,10,10,0.25)]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
      <div>
        <label htmlFor={id} className="text-fg cursor-pointer text-[15px] font-medium">
          {label}
        </label>
        <p id={`${id}-note`} className={`${MUTED} mt-0.5 text-[13px] leading-snug`}>
          {note}
        </p>
      </div>
    </div>
  );
}

export function Slider(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <label htmlFor={props.id} className="text-fg flex items-baseline justify-between gap-3 text-[14px] font-medium">
        <span>{props.label}</span>
        <output htmlFor={props.id} className="font-mono-display shrink-0 text-[14px] tabular-nums text-[#3F5FD9]">
          {props.display}
        </output>
      </label>
      <input
        id={props.id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="mt-3 w-full cursor-pointer accent-[#5078DC]"
      />
    </div>
  );
}

export function Objectives({ items, label }: { items: Objective[]; label: string }) {
  return (
    <section aria-live="polite" aria-label={label} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {items.map((o, i) => (
        <article key={o.title} className="border-line flex flex-col rounded-3xl border bg-white p-6 md:p-7">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="font-mono-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5078DC] text-[13px] text-white"
            >
              {i + 1}
            </span>
            <h3 className="font-display text-fg text-[22px] font-medium tracking-[-0.01em]">{o.title}</h3>
          </div>
          <p className="text-fg-mid mt-2 text-[15px] leading-snug">{o.question}</p>
          {o.big ? (
            <div className="border-line mt-5 border-b pb-5">
              <p className="font-display text-[clamp(34px,4vw,44px)] font-medium leading-none tracking-[-0.02em] text-[#3F5FD9] tabular-nums">
                {o.big}
              </p>
              {o.cap ? <p className="text-fg-mid mt-2 text-[14px]">{o.cap}</p> : null}
            </div>
          ) : null}
          {o.facts ? (
            <ul className="mt-5 space-y-3">
              {o.facts.map(([v, t]) => (
                <li key={t} className="text-[14px] leading-snug">
                  <b className="text-fg block font-semibold tabular-nums">{v}</b>
                  <span className="text-fg-mid">{t}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {o.bullets ? (
            <ul className="border-line mt-5 space-y-3 border-t pt-5">
              {o.bullets.map((b) => (
                <li key={b} className="text-fg flex gap-3 text-[15px] leading-snug">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5078DC]" />
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
          {o.link ? (
            <div className="mt-auto pt-6">
              <Link
                href={o.link.href}
                className="text-[15px] font-medium text-[#3F5FD9] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
              >
                {o.link.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

export function SummaryBar({
  children,
  cta,
  href,
  scroll,
}: {
  children: ReactNode;
  cta: string;
  href: string;
  /** False when the link opens the details as a modal over this page. */
  scroll: boolean;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-[rgba(80,120,220,0.35)] bg-[#EBF2FF] p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <p className="text-fg max-w-[70ch] text-[17px] leading-relaxed">{children}</p>
      <Link href={href} scroll={scroll} aria-haspopup={scroll ? undefined : "dialog"} className={BTN}>
        {cta}
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  // Change list row 34: larger, directly under the summary.
  return <p className={`${MUTED} px-1 text-[14px] leading-relaxed`}>{children}</p>;
}

/** Value page row 19: the closing call to action. */
export function ClosingCta({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <section className="rounded-3xl border border-[rgba(80,120,220,0.35)] bg-[#EBF2FF] p-6 md:p-10">
      <h2 className="font-display text-fg text-[clamp(26px,3vw,34px)] font-medium tracking-[-0.02em]">{title}</h2>
      <p className={`${MUTED} mt-2 max-w-[60ch] text-[16px] leading-relaxed`}>{body}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Link href={primary.href} className={BTN}>
          {primary.label}
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href={secondary.href}
          className="text-[15px] font-medium text-[#3F5FD9] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
        >
          {secondary.label} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* How the estimate works ------------------------------------------- */

export function DetailsHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={`${id}-title`} className="font-display text-fg text-[clamp(28px,3.4vw,40px)] font-medium tracking-[-0.02em]">
      {title}
    </h2>
  );
}

export function Card({
  title,
  caption,
  tight,
  note,
  children,
}: {
  title: string;
  caption: string;
  tight?: boolean;
  /** The disclaimer, next to a numeric section (value page row 20). */
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className={`border-line rounded-3xl border bg-white md:p-8 ${tight ? "px-3 py-6 sm:p-6" : "p-6"}`}>
      <h3 className={`font-display text-fg text-[21px] font-medium tracking-[-0.01em] ${tight ? "px-3 sm:px-0" : ""}`}>{title}</h3>
      <p className={`${MUTED} mt-1.5 text-[14px] leading-relaxed ${tight ? "px-3 sm:px-0" : ""}`}>{caption}</p>
      {children}
      {note ? (
        <p className={`border-line ${MUTED} mt-6 border-t pt-4 text-[13px] leading-relaxed ${tight ? "mx-3 sm:mx-0" : ""}`}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

export interface Row {
  label: string;
  today: ReactNode;
  mso: ReactNode;
  /** Green when the line improves with the MSO. */
  better?: boolean;
  total?: boolean;
}

export function CompareTable({ rows }: { rows: Row[] }) {
  return (
    <table className="mt-5 w-full text-[14px] tabular-nums">
      <thead>
        <tr className={`${MUTED} font-mono-display text-[10px] uppercase tracking-[0.14em]`}>
          <th scope="col" className="pb-2 text-left font-normal">
            <span className="sr-only">Line</span>
          </th>
          <th scope="col" className="pb-2 text-right font-normal">
            Today
          </th>
          <th scope="col" className="pb-2 pl-3 text-right font-normal text-[#3F5FD9]">
            With MSO
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className={r.total ? "border-fg/40 border-t font-semibold" : "border-line border-t"}>
            <th scope="row" className="text-fg py-2.5 pr-3 text-left font-normal">
              {r.total ? <b className="font-semibold">{r.label}</b> : r.label}
            </th>
            <td className={`${MUTED} py-2.5 text-right`}>{r.today}</td>
            <td className={`py-2.5 pl-3 text-right font-medium ${r.better ? "text-[#1F7A50]" : "text-fg"}`}>{r.mso}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Steps({ titles, bodies }: { titles: readonly string[]; bodies: string[] }) {
  return (
    <ol className="mt-5 space-y-5">
      {titles.map((s, i) => (
        <li key={s} className="grid grid-cols-[32px_1fr] gap-3">
          <span
            aria-hidden="true"
            className="font-mono-display flex h-8 w-8 items-center justify-center rounded-full bg-[#5078DC] text-[13px] text-white"
          >
            {i + 1}
          </span>
          <div>
            <p className="text-fg text-[16px] font-semibold">{s}</p>
            <p className={`${MUTED} mt-1 text-[15px] leading-relaxed`}>{bodies[i]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Structure({ boxes, arrows }: { boxes: [Box, Box, Box]; arrows: [string, string] }) {
  return (
    <div className="mt-6 grid grid-cols-1 items-stretch gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-3">
      <StructureBox {...boxes[0]} />
      <Arrow label={arrows[0]} />
      <StructureBox {...boxes[1]} accent />
      <Arrow label={arrows[1]} />
      <StructureBox {...boxes[2]} />
    </div>
  );
}

export function Assumptions({ items, tag }: { items: [string, string][]; tag?: string }) {
  return (
    <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
      {items.map(([k, v]) => (
        <li key={k} className={`${MUTED} text-[14px] leading-relaxed`}>
          <strong className="text-fg font-semibold">{k}:</strong> {v}
          {/* Value page row 14: every assumption is marked for the pilot. */}
          {tag ? (
            <span className="font-mono-display ml-2 inline-block whitespace-nowrap rounded-full border border-[rgba(199,122,30,0.45)] bg-[#FFF6EA] px-2 py-0.5 align-[1px] text-[10px] uppercase tracking-[0.1em] text-[#8A5410]">
              {tag}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  return <span className={MUTED}>{children}</span>;
}

type Box = { title: string; body: string };

function StructureBox({ title, body, accent }: Box & { accent?: boolean }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: accent ? "#EBF2FF" : "#f6f6f4",
        borderColor: accent ? "rgba(80,120,220,0.35)" : "rgba(10,10,10,0.1)",
      }}
    >
      <p className="text-fg text-[16px] font-semibold">{title}</p>
      <p className="text-fg-mid mt-1.5 text-[14px] leading-relaxed">{body}</p>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="text-fg-mid flex items-center justify-center gap-2 py-1 text-[13px] md:flex-col md:px-1 md:py-0">
      <span className="text-center font-medium tabular-nums md:max-w-[110px]">{label}</span>
      <span aria-hidden="true" className="text-[18px] text-[#5078DC]">
        <span className="md:hidden">↓</span>
        <span className="hidden md:inline">→</span>
      </span>
    </div>
  );
}
