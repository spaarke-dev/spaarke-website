"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
};

type LibrarySectionProps = {
  articles: Article[];
};

function ArticleCard({
  slug,
  title,
  excerpt,
}: Article) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-lg"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Content — fills entire card, title at top */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ padding: "clamp(1rem, 1.4vw, 1.75rem)" }}>
        <h3 className="shrink-0 text-sm font-semibold leading-snug tracking-tight text-foreground group-hover:underline dark:text-white sm:text-base">
          {title}
        </h3>
        <p className="mt-3 min-h-0 flex-1 overflow-hidden text-xs leading-relaxed text-muted-foreground dark:text-white/70 sm:text-sm"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 999,
            maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
          }}
        >
          {excerpt}
        </p>
        <div className="shrink-0 pt-3">
          <span className="text-xs font-medium text-muted-foreground/60 transition-colors group-hover:text-foreground dark:text-white/40 dark:group-hover:text-white/70">
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
        {/* 2/3 split layout — fills remaining height */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — dark gray background, fixed content */}
          <div className="flex w-[35%] flex-col justify-center bg-neutral-800 px-[4%] text-white dark:bg-neutral-900">
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
          <div className="relative flex-1 overflow-hidden px-[2%] pt-10">
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
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
