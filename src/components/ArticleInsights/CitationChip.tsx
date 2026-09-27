"use client";

import { track } from "@/lib/analytics";
import type { Citation } from "@/lib/insights/types";
import { useInsights } from "./InsightsProvider";
import { pinInPage } from "./pin";

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
 *
 * **It opens the article beside the conversation rather than instead of it.**
 * Navigating away cost the reader whatever they were in the middle of asking, and
 * on the library page it cost them the whole session, which made following a
 * citation a punishment for trusting the answer.
 *
 * Three cases, and only one of them opens the reader:
 *
 * - Below the rail breakpoint it stays an ordinary link. A reader, a console and
 *   an article on a phone is three things in a space that holds one.
 * - **A citation into the article already on screen scrolls that page to the
 *   heading and marks it.** Opening a copy of the page you are on over the top of
 *   it would be absurd, and this is the behaviour the console had before the
 *   reader existed. It is done here rather than left to the browser so the
 *   heading is marked, the scroll is smooth, and the address bar does not collect
 *   a fragment the reader did not ask for.
 * - Anything else opens the reader.
 *
 * The `href` is real in every case, so a middle click, a long press and a copied
 * link all still do what they should.
 */

/** Matches the `lg` breakpoint the panel and the rail are gated on. */
const READER_MIN_WIDTH = 1024;

export function CitationChip({ citation }: { citation: Citation }) {
  const { slug, openReader } = useInsights();
  const label = citation.heading.length > 0 ? citation.heading : citation.title;
  const context = citation.heading.length > 0 ? citation.title : null;
  const sameArticle = citation.slug === slug;

  return (
    <a
      href={citation.href}
      onClick={(event) => {
        track("Assistant Citation", {
          article_slug: slug ?? "library",
          to_slug: citation.slug,
          same_article: sameArticle,
          whole_article: !citation.anchor,
        });

        // Leave the browser alone when the reader asked for a new tab or a
        // different window. Intercepting those is how a link stops being a link.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        // The article is already on screen behind the console, so this is a
        // scroll rather than anything to open. If the heading turns out not to be
        // there, fall through and let the link navigate.
        if (sameArticle) {
          if (citation.anchor && pinInPage(citation.anchor)) event.preventDefault();
          return;
        }

        if (window.innerWidth < READER_MIN_WIDTH) return;

        event.preventDefault();
        openReader({
          slug: citation.slug,
          title: citation.title,
          heading: citation.heading,
          anchor: citation.anchor,
          href: citation.href,
        });
      }}
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
