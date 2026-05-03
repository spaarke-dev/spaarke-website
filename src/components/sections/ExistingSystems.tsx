"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { Eyebrow, Heading, Lede, Shell } from "@/components/primitives";
import {
  existingSystemsContent,
  type ExistingSystemsCard as Card,
} from "@/content/home/existing-systems";

/**
 * Section bridges the dark stats section above into the light-cream
 * platform section below via a vertical gradient. The heading + lede
 * sit in the dark zone (white text), the cards land in the light zone
 * (white surface, dark text).
 *
 * Top stop is #0a0a0a (matches --v2-bg, the GapStats dark above) so
 * the boundary is invisible — no dark seam. Mid-stops pull from the
 * hero footlight glow palette (rgb(80,120,220) → rgb(210,225,255) →
 * rgb(235,242,255)). Cream is reached at ~70% so it lands roughly
 * at the mid-card line when cards are collapsed; the bottom 30%
 * stays solid cream and blends into the next section's bg.
 */
const SECTION_GRADIENT =
  "linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 35%, #1a1f2e 47%, #b3c4dc 62%, #ebf2ff 72%, #f6f6f4 83%, #f6f6f4 100%)";

const SECTION_STYLE: CSSProperties = {
  backgroundImage: SECTION_GRADIENT,
  paddingTop: "clamp(80px, 10vh, 120px)",
  paddingBottom: "clamp(80px, 10vh, 120px)",
};

// Override v2 fg tokens within the dark zone so Heading/Lede primitives
// render in pure white / 70% white per the gradient spec.
const DARK_ZONE_STYLE = {
  "--v2-fg": "#ffffff",
  "--v2-fg-mid": "rgba(255, 255, 255, 0.7)",
} as CSSProperties;

const CARDS_GAP_STYLE: CSSProperties = {
  marginTop: "clamp(80px, 9vh, 96px)",
};

export function ExistingSystems() {
  const { heading, subhead, cards } = existingSystemsContent;

  return (
    <section className="relative" style={SECTION_STYLE}>
      <Shell>
        <div
          className="mx-auto max-w-5xl text-center"
          style={DARK_ZONE_STYLE}
        >
          <Heading level={2}>
            <span className="md:whitespace-nowrap">{heading.line1}</span>
            <br />
            <span className="md:whitespace-nowrap">{heading.line2}</span>
          </Heading>
          <div className="mx-auto mt-6 max-w-3xl">
            <Lede>
              <span className="md:whitespace-nowrap">{subhead.line1}</span>
              <br />
              <span className="md:whitespace-nowrap">{subhead.line2}</span>
            </Lede>
          </div>
        </div>

        {/*
          Subgrid wires every card's internal rows (title, summary,
          expand-region, spacer, button) to the same parent row tracks
          so the line / READ MORE eyebrow / detail top + the bottom
          button line up across all three cards.
        */}
        <div
          data-tone="light"
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-x-8 md:gap-y-0 md:grid-rows-[auto_auto_auto_1fr_auto]"
          style={CARDS_GAP_STYLE}
        >
          {cards.map((card) => (
            <ExpandableCard key={card.id} card={card} />
          ))}
        </div>
      </Shell>
    </section>
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
      className="bg-surface flex flex-col rounded-3xl p-8 shadow-sm md:row-span-5 md:grid md:min-h-[clamp(280px,32vh,360px)] md:grid-rows-subgrid md:p-10"
    >
      <h3 className="font-display text-fg text-xl font-bold leading-tight tracking-tight md:text-2xl">
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
