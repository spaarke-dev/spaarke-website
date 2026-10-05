"use client";

import type { AnchorHTMLAttributes } from "react";
import { useInsightsOptional } from "@/components/ArticleInsights/InsightsProvider";

/**
 * A link in an article body.
 *
 * A link to another article opens that article in the reader beside the page, the
 * way a citation chip does, instead of navigating away. Following a link used to
 * cost the reader their place in the piece they were reading, and the reader
 * already exists for exactly that reason (ArticleReader).
 *
 * Three cases leave the link alone, so that it stays a link:
 *
 * - Below the rail breakpoint, where a reader beside a page does not fit.
 * - A modifier key or a middle click, which are the reader asking for a new tab.
 * - Anywhere the assistant is switched off, because the reader is mounted by the
 *   assistant's provider.
 *
 * The `href` is real in every case, so a copied link or a long press still lands
 * on the article. The data attributes are what the reader itself reads when a link
 * inside an opened article is clicked, because that markup is lifted out of the
 * rendered page and carries no React handlers with it.
 */

/** Matches the `lg` breakpoint the panel, the rail, and the reader are gated on. */
const READER_MIN_WIDTH = 1024;

const ARTICLE_HREF = /^\/why-spaarke\/([a-z0-9-]+)(?:#([A-Za-z0-9_-]+))?\/?$/;

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Published article titles by slug, from the server. */
  titles: Record<string, string>;
  /** The article this link sits in, so a link to itself stays an anchor. */
  currentSlug: string;
};

export function ArticleLink({ href, children, titles, currentSlug, ...rest }: Props) {
  const insights = useInsightsOptional();
  const match = href ? ARTICLE_HREF.exec(href) : null;
  const slug = match?.[1];
  const articleTitle = slug ? titles[slug] : undefined;
  const opensReader = Boolean(slug && articleTitle && slug !== currentSlug);
  const anchor = match?.[2];

  return (
    <a
      href={href}
      {...rest}
      {...(opensReader
        ? {
            "data-reader-slug": slug,
            "data-reader-title": articleTitle,
            "data-reader-anchor": anchor ?? "",
          }
        : {})}
      onClick={(event) => {
        if (!opensReader || !insights || !slug || !articleTitle || !href) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.button !== 0) return;
        if (window.innerWidth < READER_MIN_WIDTH) return;

        event.preventDefault();
        insights.openReader({ slug, title: articleTitle, heading: "", anchor, href });
      }}
    >
      {children}
    </a>
  );
}
