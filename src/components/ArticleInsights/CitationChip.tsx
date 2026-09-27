import type { Citation } from "@/lib/insights/types";

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
 */
export function CitationChip({ citation }: { citation: Citation }) {
  const label = citation.heading.length > 0 ? citation.heading : citation.title;
  const context = citation.heading.length > 0 ? citation.title : null;

  return (
    <a
      href={citation.href}
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
