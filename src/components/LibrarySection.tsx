"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
};

type LibrarySectionProps = {
  articles: Article[];
};

/** Format a kebab-case tag for display. */
function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ArticleCard({
  slug,
  title,
  excerpt,
  date,
  author,
  tags,
}: Article) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-lg"
      style={{ aspectRatio: "2/3" }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ padding: "clamp(0.75rem, 1.2vw, 1.5rem)" }}>
        {/* Title */}
        <h3 className="shrink-0 text-sm font-semibold leading-snug tracking-tight text-foreground dark:text-white sm:text-base">
          {title}
        </h3>

        {/* Date + Author */}
        <p className="mt-1.5 shrink-0 text-[10px] text-muted-foreground/70 dark:text-white/40 sm:text-[11px]">
          {formattedDate} &middot; {author}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-2 flex shrink-0 flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-muted/60 px-1.5 py-px text-[9px] font-medium text-muted-foreground dark:bg-white/10 dark:text-white/50 sm:text-[10px]"
              >
                {formatTag(tag)}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt with fade */}
        <p className="mt-2.5 min-h-0 flex-1 overflow-hidden text-xs leading-relaxed text-muted-foreground dark:text-white/70 sm:text-sm"
          style={{
            maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        >
          {excerpt}
        </p>

        {/* Read more */}
        <div className="shrink-0 pt-2">
          <span className="text-[10px] font-medium text-muted-foreground/60 transition-colors group-hover:text-foreground dark:text-white/40 dark:group-hover:text-white/70 sm:text-xs">
            Read more &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LibrarySection({ articles }: LibrarySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [cardOverflow, setCardOverflow] = useState(0);

  // Measure how much the card grid overflows the visible area
  useEffect(() => {
    function measure() {
      const container = cardContainerRef.current;
      if (!container) return;
      const visibleHeight = container.parentElement?.clientHeight ?? 0;
      const totalHeight = container.scrollHeight;
      setCardOverflow(Math.max(0, totalHeight - visibleHeight));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Track scroll position to translate the card grid
  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      setScrollOffset(Math.max(0, Math.min(scrolled, cardOverflow)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [cardOverflow]);

  const sectionHeight = `calc(100vh + ${cardOverflow}px)`;

  return (
    <section
      id="library-section"
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container — pins below the sticky tagline header */}
      <div className="sticky flex flex-col overflow-hidden" style={{ top: "calc(var(--header-h, 73px) + var(--tagline-h, 80px))", height: "calc(100vh - var(--header-h, 73px) - var(--tagline-h, 80px))" }}>
        {/* Top spacer so the dark sidebar doesn't bleed above the cards */}
        <div className="h-10 shrink-0 bg-background" />
        {/* 2/3 split layout — fills remaining height */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — narrower to give cards more room */}
          <div className="flex w-[30%] flex-col rounded-tr-2xl bg-neutral-800 px-[3%] pt-8 text-white dark:bg-neutral-900">
            <h3
              className="font-semibold leading-tight"
              style={{ fontSize: "clamp(1.2rem, 2.2vw, 4rem)" }}
            >
              Work Smarter.
              <br />
              Operate Leaner.
              <br />
              Decide Faster.
            </h3>
            <p
              className="mt-6 max-w-[30ch] text-white/70"
              style={{ fontSize: "clamp(0.875rem, 1vw, 1.5rem)" }}
            >
              Legal operations intelligence that transforms how your team
              captures data, retains knowledge, and makes decisions.
            </p>
            {/* Placeholder image */}
            <div
              className="mt-8 rounded-lg bg-white/10"
              style={{ width: "80%", aspectRatio: "4/3" }}
            />
          </div>

          {/* Right — scrollable article cards */}
          <div className="relative flex-1 overflow-hidden px-[2%]">
            <div
              ref={cardContainerRef}
              className="grid grid-cols-3"
              style={{
                gap: "clamp(0.5rem, 1vw, 1.5rem)",
                transform: `translateY(-${scrollOffset}px)`,
                willChange: "transform",
              }}
            >
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  {...article}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
