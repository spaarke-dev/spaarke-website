"use client";

import { track } from "@/lib/analytics";
import type { Citation } from "@/lib/insights/types";
import { useInsights } from "./InsightsProvider";

/**
 * A citation, as something the reader can click rather than something they have
 * to trust.
 *
 * The label is the heading where the claim is argued, or the article title when
 * the citation is to the piece as a whole. Both come from the build-time manifest
 * rather than from the model, and the anchor was verified against the same
 * slugger the rendered page uses, so a chip that appears is a chip that lands.
 *
 * Two of the published titles contain an em dash and the owner has decided they
 * keep it. That mark will appear here, accurately, because the alternative is
 * quoting somebody's title wrongly to satisfy a house rule about prose.
 *
 * **A followed chip is the measurement that matters most.** It is a reader going
 * from the assistant back into an article, which is the behaviour the whole
 * feature is a bet on. If this event is rare, the assistant is answering instead
 * of the articles rather than alongside them.
 */
export function CitationChip({ citation }: { citation: Citation }) {
  const { slug } = useInsights();
  const label = citation.heading.length > 0 ? citation.heading : citation.title;
  const context = citation.heading.length > 0 ? citation.title : null;

  return (
    <a
      href={citation.href}
      onClick={() =>
        track("Assistant Citation", {
          article_slug: slug ?? "library",
          to_slug: citation.slug,
          same_article: citation.slug === slug,
          whole_article: !citation.anchor,
        })
      }
      className="border-line text-fg-mid hover:border-line-strong hover:text-fg focus-visible:ring-spaarke-blue group inline-flex max-w-full items-baseline gap-1.5 rounded-full border px-3 py-1 text-[12px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2"
      title={context ? `${context}: ${label}` : label}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden="true" className="text-fg-low group-hover:text-fg-mid">
        &rsaquo;
      </span>
    </a>
  );
}
