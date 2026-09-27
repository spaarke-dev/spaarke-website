"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { CloseIcon, PANEL_WIDTH, SURFACE_TOP } from "./chrome";
import { useInsights } from "./InsightsProvider";

/**
 * The cited passage, read beside the conversation rather than instead of it.
 *
 * Following a citation used to navigate away, which cost the reader whatever they
 * were in the middle of asking. On the library page that is the whole session. So
 * a chip opens the article here, scrolled to the section that was cited, with the
 * console still open on the right and the page still behind.
 *
 * **The article is lifted out of its own rendered page, not re-rendered.** A
 * second markdown pipeline would need its own handling for the raw HTML some
 * articles contain, and would be free to drift from what the page actually looks
 * like. Fetching the page and taking `[data-article-body]` out of it cannot drift,
 * because it is the same markup, with the same heading ids the citation anchors
 * were built against.
 *
 * The parse happens in an inert document, so nothing in the fetched page runs.
 * What is injected is first-party content from this site's own content files, the
 * same bytes the public page serves.
 *
 * **Desktop only.** Below the rail breakpoint the chip stays an ordinary link and
 * navigates, because a reader, a console and an article on a phone is three things
 * in a space that holds one. The href is real either way, so a middle click or a
 * long press still opens the article properly.
 */
export function ArticleReader() {
  const { reader, closeReader, open, openOn } = useInsights();
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const body = useRef<HTMLDivElement | null>(null);
  const cache = useRef(new Map<string, string>());

  const slug = reader?.slug ?? null;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const cached = cache.current.get(slug);
    if (cached) {
      setHtml(cached);
      setFailed(false);
      return;
    }

    setHtml(null);
    setFailed(false);
    (async () => {
      try {
        const res = await fetch(`/why-spaarke/${slug}`, { credentials: "same-origin" });
        if (!res.ok) throw new Error(String(res.status));
        const page = await res.text();
        // Inert: no scripts run, no images load, nothing from the fetched document
        // touches this one until it is injected deliberately.
        const parsed = new DOMParser().parseFromString(page, "text/html");
        const article = parsed.querySelector("[data-article-body]");
        if (!article) throw new Error("no article body");
        if (cancelled) return;
        cache.current.set(slug, article.innerHTML);
        setHtml(article.innerHTML);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Put the cited section at the top and say which one it is, because an article
  // that opens at the right place but does not show which place leaves the reader
  // to work out what they are looking at.
  useEffect(() => {
    if (!html || !reader) return;
    const container = body.current;
    if (!container) return;
    container.scrollTop = 0;
    if (!reader.anchor) return;

    const target = container.querySelector<HTMLElement>(`#${CSS.escape(reader.anchor)}`);
    if (!target) return;

    // Measured against the scrolling element rather than read off `offsetTop`.
    // `offsetTop` is relative to the nearest positioned ancestor, which here is
    // the card and not the scroller, so it landed a header's height out and the
    // cited heading was never quite at the top.
    const top =
      target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTop = Math.max(top - 16, 0);

    target.style.transition = "background-color 900ms ease";
    target.style.backgroundColor = "rgba(0, 11, 255, 0.10)";
    const timer = setTimeout(() => {
      target.style.backgroundColor = "transparent";
    }, 1_400);
    return () => clearTimeout(timer);
  }, [html, reader]);

  useEffect(() => {
    if (!reader) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeReader();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeReader, reader]);

  if (!reader) return null;

  // Stop short of the console when it is beside us, so both are readable at once.
  const rightEdge = open && openOn === "panel" ? PANEL_WIDTH : 0;

  return (
    <div
      className="fixed bottom-0 left-0 z-30 hidden lg:block"
      // Light, like the articles it shows. Without this it inherits from wherever
      // it happens to be mounted, which on the library page meant a dark article
      // on a light page.
      data-tone="light"
      style={{ top: SURFACE_TOP, right: rightEdge }}
    >
      <div
        className="absolute inset-0 bg-black/30"
        onClick={closeReader}
        aria-hidden="true"
      />
      <section
        role="dialog"
        // Not modal, for the same reason the console is not: the conversation
        // beside this has to stay usable while the reader reads.
        aria-label={`${reader.title}, the cited section`}
        // A reading column, not a window. The first version filled the whole
        // space left of the console, which on a wide screen is prose at about a
        // hundred and forty characters a line and unreadable.
        className="border-line bg-bg absolute inset-y-6 left-1/2 flex w-[min(740px,calc(100%-3rem))] -translate-x-1/2 flex-col overflow-hidden rounded-lg border shadow-2xl"
      >
        <header className="border-line flex shrink-0 items-start justify-between gap-4 border-b px-5 py-3">
          <div className="min-w-0">
            <p className="text-fg-low font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
              {reader.heading ? "Cited section" : "Cited article"}
            </p>
            <p className="text-fg mt-1 truncate text-[15px] font-medium">{reader.title}</p>
            {reader.heading && (
              <p className="text-fg-mid mt-0.5 truncate text-[13px]">{reader.heading}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={reader.href}
              className="text-spaarke-blue hover:text-cta-blue focus-visible:ring-spaarke-blue rounded text-[13px] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2"
              onClick={() =>
                track("Assistant Citation", {
                  article_slug: "reader",
                  to_slug: reader.slug,
                  same_article: false,
                  whole_article: true,
                })
              }
            >
              Open the full article
            </a>
            <button
              type="button"
              onClick={closeReader}
              aria-label="Close the article"
              className="text-fg-low hover:text-fg focus-visible:ring-spaarke-blue rounded p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div ref={body} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {html === null && !failed && (
            <p className="text-fg-low text-[14px]">Opening the article</p>
          )}
          {failed && (
            <p className="text-fg-mid text-[14px]">
              That article could not be opened here.{" "}
              <a href={reader.href} className="text-spaarke-blue underline underline-offset-2">
                Read it on its own page
              </a>
              .
            </p>
          )}
          {html !== null && (
            <div
              className="prose prose-neutral prose-sm max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight"
              // First-party content, from this site's own content files, taken out
              // of the page that already serves it publicly.
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
