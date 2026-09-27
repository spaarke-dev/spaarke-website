"use client";

import { track } from "@/lib/analytics";
import type { Citation } from "@/lib/insights/types";
import { useInsights } from "./InsightsProvider";
import { pinInPage } from "./pin";

/**
 * A citation, as something the reader can click rather than something they have
 * to trust.
 *
 * The label comes from the build-time manifest rather than from the model, and
 * the anchor was verified against the same slugger the rendered page uses, so a
 * chip that appears is a chip that lands.
 *
 * **Two kinds of chip, because they do two different things.** A citation into the
 * article on screen scrolls the page; a citation into another article opens it.
 * Rendering both as the same grey pill left the reader unable to predict either,
 * and worse, a chip from another article showed only its heading, so it did not
 * even say which piece it came from.
 *
 * - **In this article.** The heading, and an arrow down, because that is where the
 *   reader is about to go.
 * - **From another article.** The article's title first, since that is the thing
 *   the reader does not know, with the heading beneath it and a mark saying this
 *   one opens.
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

/** True when this citation points at the article the reader is already on. */
export function isInPageCitation(citation: Citation, slug: string | null): boolean {
  return slug !== null && citation.slug === slug;
}

export function CitationChip({ citation }: { citation: Citation }) {
  const { slug, openReader } = useInsights();
  const sameArticle = isInPageCitation(citation, slug);

  return sameArticle ? (
    <InPageChip citation={citation} slug={slug} />
  ) : (
    <OtherArticleChip citation={citation} slug={slug} openReader={openReader} />
  );
}

/**
 * A citation into the article on screen. A pill, because it is a jump within
 * something the reader already has.
 */
function InPageChip({ citation, slug }: { citation: Citation; slug: string | null }) {
  const label = citation.heading.length > 0 ? citation.heading : citation.title;

  return (
    <a
      href={citation.href}
      onClick={(event) => {
        track("Assistant Citation", {
          article_slug: slug ?? "library",
          to_slug: citation.slug,
          same_article: true,
          whole_article: !citation.anchor,
        });

        // Leave the browser alone when the reader asked for a new tab or a
        // different window. Intercepting those is how a link stops being a link.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        // The article is already on screen behind the console, so this is a
        // scroll rather than anything to open. If the heading turns out not to be
        // there, fall through and let the link navigate.
        if (citation.anchor && pinInPage(citation.anchor)) event.preventDefault();
      }}
      className="border-line text-fg-mid hover:border-line-strong hover:text-fg focus-visible:ring-spaarke-blue group inline-flex max-w-full items-baseline gap-1.5 rounded-full border px-3 py-1 text-[12px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2"
      title={label}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden="true" className="text-fg-low group-hover:text-fg-mid shrink-0">
        &darr;
      </span>
    </a>
  );
}

/**
 * A citation into a different article. A card rather than a pill, leading with
 * the title, because which article it is is the thing the reader cannot guess and
 * the thing the old chip left out.
 */
function OtherArticleChip({
  citation,
  slug,
  openReader,
}: {
  citation: Citation;
  slug: string | null;
  openReader: ReturnType<typeof useInsights>["openReader"];
}) {
  return (
    <a
      href={citation.href}
      onClick={(event) => {
        track("Assistant Citation", {
          article_slug: slug ?? "library",
          to_slug: citation.slug,
          same_article: false,
          whole_article: !citation.anchor,
        });

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
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
      className="border-line bg-surface hover:border-line-strong hover:bg-surface-2 focus-visible:ring-spaarke-blue group flex items-start gap-2 rounded-md border px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2"
      title={citation.heading ? `${citation.title}: ${citation.heading}` : citation.title}
    >
      <OpensIcon />
      <span className="min-w-0">
        <span className="text-fg block truncate text-[12px] font-medium leading-snug">
          {citation.title}
        </span>
        {citation.heading.length > 0 && (
          <span className="text-fg-mid block truncate text-[12px] leading-snug">
            {citation.heading}
          </span>
        )}
      </span>
    </a>
  );
}

/**
 * Says the chip opens something. Not an external-link mark, which would promise a
 * new tab and a departure, and this does neither: the article opens beside the
 * conversation and the conversation stays where it is.
 */
function OpensIcon() {
  return (
    <svg
      className="text-fg-low group-hover:text-spaarke-blue mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M14 4v16" strokeLinecap="round" />
    </svg>
  );
}
