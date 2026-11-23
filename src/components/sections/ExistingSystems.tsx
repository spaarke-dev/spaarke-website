"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { Eyebrow, SectionHead, Shell, Slab } from "@/components/primitives";
import {
  existingSystemsContent,
  type ExistingSystemsCard as Card,
} from "@/content/home/existing-systems";

/**
 * Solid dark band (design pass R1, 2026-11-23). It used to fade from dark
 * into cream behind the cards; the bands now alternate tone as on the
 * Services page (white stats above, cream platform section below), and the
 * cards use the Services dark-card treatment: hairline border, faint fill,
 * no shadow.
 */
const CARDS_GAP_STYLE: CSSProperties = {
  marginTop: "clamp(56px, 7vh, 80px)",
};

export function ExistingSystems() {
  const { heading, subhead, cards } = existingSystemsContent;

  return (
    <Slab tone="dark" className="relative">
      <Shell>
        <SectionHead
          eyebrow="Why legal systems fall short"
          title={`${heading.line1} ${heading.line2}`}
          intro={`${subhead.line1} ${subhead.line2}`}
        />

        {/*
          Subgrid wires every card's internal rows (title, summary,
          expand-region, spacer, button) to the same parent row tracks
          so the line / READ MORE eyebrow / detail top + the bottom
          button line up across all three cards.
        */}
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-x-8 md:gap-y-0 md:grid-rows-[auto_auto_auto_1fr_auto]"
          style={CARDS_GAP_STYLE}
        >
          {cards.map((card) => (
            <ExpandableCard key={card.id} card={card} />
          ))}
        </div>
      </Shell>
    </Slab>
  );
}

function ExpandableCard({ card }: { card: Card }) {
  const [open, setOpen] = useState(false);
  const detailId = `${card.id}-detail`;

  // 5 rows on the parent grid: title / summary / expand-region / 1fr
  // spacer / button. Card spans all 5 via subgrid, so siblings align
  // their line + eyebrow + detail-top + button across the row.
  return (
    <article
      // min-height applied at md+ only so mobile cards size to content
      // (3 stacked at 360px each = excessive scroll on small phones).
      className="border-line-strong flex flex-col rounded-3xl border bg-[rgba(255,255,255,0.03)] p-8 md:row-span-5 md:grid md:min-h-[clamp(280px,32vh,360px)] md:grid-rows-subgrid md:p-10"
    >
      <h3 className="font-display text-fg text-xl font-medium leading-tight tracking-tight md:text-2xl">
        {card.title}
      </h3>
      <p className="text-fg-mid mt-5 text-[15px] leading-relaxed md:text-base">
        {card.summary}
      </p>

      {/*
        Fluid open: outer grid animates rows 0fr → 1fr (browser-native
        height interpolation, no JS measurement). Inner content fades
        and slides up from the bottom on a small delay so text reveals
        after the container has started expanding.

        mt-6 sits on the wrapper itself so the line position stays
        consistent across cards (subgrid keeps the row top aligned).
      */}
      <div
        id={detailId}
        aria-hidden={!open}
        className={`mt-6 grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-line border-t pt-6 pb-8 transition-[opacity,transform] duration-500 ease-out ${
              open
                ? "translate-y-0 opacity-100 delay-150"
                : "translate-y-3 opacity-0"
            }`}
          >
            <Eyebrow>Read more</Eyebrow>
            <p className="text-fg-mid mt-4 text-[15px] leading-relaxed md:text-base">
              {card.detail}
            </p>
          </div>
        </div>
      </div>

      {/* Spacer — flex-1 on mobile, fills 1fr row on md+ */}
      <div className="mt-8 flex-1 md:mt-0" />

      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={detailId}
          className="border-line text-fg hover:bg-surface-2 focus-visible:ring-spaarke-blue inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
        >
          <PlusMinusIcon open={open} />
          {open ? "Show less" : "Read more"}
        </button>
      </div>
    </article>
  );
}

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
    >
      <line x1="3" y1="8" x2="13" y2="8" />
      {!open && <line x1="8" y1="3" x2="8" y2="13" />}
    </svg>
  );
}
