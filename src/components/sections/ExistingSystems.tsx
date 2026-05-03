"use client";

import { useState } from "react";
import { Heading, Lede, Shell, Slab } from "@/components/primitives";
import {
  existingSystemsContent,
  type ExistingSystemsCard as Card,
} from "@/content/home/existing-systems";

export function ExistingSystems() {
  const { heading, subhead, cards } = existingSystemsContent;

  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto max-w-3xl text-center">
          <Heading level={2}>
            {heading.line1}
            <br />
            {heading.line2}
          </Heading>
          <div className="mx-auto mt-6 max-w-[60ch]">
            <Lede>{subhead}</Lede>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-3 md:gap-8">
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

  return (
    <article className="bg-surface flex flex-col rounded-3xl p-8 shadow-sm md:p-10">
      <h3 className="font-display text-fg text-xl font-semibold leading-tight tracking-tight md:text-2xl">
        {card.title}
      </h3>
      <p className="text-fg-mid mt-5 text-[15px] leading-relaxed md:text-base">
        {card.summary}
      </p>

      {open && (
        <div id={detailId} className="border-line mt-6 border-t pt-6">
          <p className="text-fg-mid text-[15px] leading-relaxed md:text-base">
            {card.detail}
          </p>
        </div>
      )}

      <div className="mt-8 flex-1" />

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
