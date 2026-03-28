"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { TagCategories } from "@/lib/blog";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: TagCategories;
  tagsFlat: string[];
};

type LibrarySectionProps = {
  articles: Article[];
  tagsByCategory: TagCategories;
};

/** Category display labels */
const CATEGORY_LABELS: Record<keyof TagCategories, string> = {
  organization: "Audience",
  function: "Role",
  topic: "Topic",
  theme: "Theme",
};

const CATEGORY_COLORS: Record<keyof TagCategories, { active: string; pill: string }> = {
  organization: {
    active: "bg-blue-600 text-white dark:bg-blue-500",
    pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  function: {
    active: "bg-emerald-600 text-white dark:bg-emerald-500",
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  topic: {
    active: "bg-amber-600 text-white dark:bg-amber-500",
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  theme: {
    active: "bg-violet-600 text-white dark:bg-violet-500",
    pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
};

/** Format a kebab-case tag for display. */
function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ------------------------------------------------------------------ */
/*  Filter Bar                                                         */
/* ------------------------------------------------------------------ */

type ActiveFilters = Partial<Record<keyof TagCategories, string>>;

function FilterBar({
  tagsByCategory,
  activeFilters,
  onToggle,
  onClear,
  filteredCount,
  totalCount,
}: {
  tagsByCategory: TagCategories;
  activeFilters: ActiveFilters;
  onToggle: (category: keyof TagCategories, tag: string) => void;
  onClear: () => void;
  filteredCount: number;
  totalCount: number;
}) {
  const [openCategory, setOpenCategory] = useState<keyof TagCategories | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasFilters = Object.keys(activeFilters).length > 0;
  const categories = Object.keys(CATEGORY_LABELS) as (keyof TagCategories)[];

  return (
    <div ref={dropdownRef} className="flex shrink-0 flex-wrap items-center gap-1.5 pb-5" style={{ paddingTop: "2px" }}>
      {/* Category buttons */}
      {categories.map((cat) => {
        const isOpen = openCategory === cat;
        const selectedTag = activeFilters[cat];
        const colors = CATEGORY_COLORS[cat];

        return (
          <div key={cat} className="relative">
            <button
              type="button"
              onClick={() => setOpenCategory(isOpen ? null : cat)}
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-medium transition-colors sm:text-[10px] ${
                selectedTag
                  ? colors.active
                  : "bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
              }`}
            >
              {CATEGORY_LABELS[cat]}
              {selectedTag && (
                <span className="ml-0.5 opacity-80">: {formatTag(selectedTag)}</span>
              )}
              <svg className={`h-2.5 w-2.5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Dropdown */}
            {isOpen && tagsByCategory[cat].length > 0 && (
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-border bg-background p-1 shadow-lg dark:bg-neutral-800">
                {tagsByCategory[cat].map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        onToggle(cat, tag);
                        setOpenCategory(null);
                      }}
                      className={`block w-full rounded-md px-2.5 py-1 text-left text-[11px] transition-colors ${
                        isSelected
                          ? `${colors.pill} font-semibold`
                          : "text-foreground hover:bg-muted dark:text-white/80 dark:hover:bg-white/10"
                      }`}
                    >
                      {formatTag(tag)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Clear all */}
      {hasFilters && (
        <button
          type="button"
          onClick={() => { onClear(); setOpenCategory(null); }}
          className="rounded-full px-2 py-0.5 text-[9px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground dark:text-white/40 dark:hover:text-white/70 sm:text-[10px]"
        >
          Clear all
        </button>
      )}

      {/* Counter badge */}
      <span className="ml-auto rounded-full bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-muted-foreground dark:bg-white/10 dark:text-white/50 sm:text-[10px]">
        {filteredCount} of {totalCount}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Article Card                                                       */
/* ------------------------------------------------------------------ */

function ArticleCard({
  slug,
  title,
  excerpt,
  date,
  author,
  tagsFlat,
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
        <h3
          className="shrink-0 font-semibold leading-snug tracking-tight text-foreground dark:text-white"
          style={{ fontSize: "clamp(0.8rem, 0.95vw, 1.25rem)" }}
        >
          {title}
        </h3>

        <p
          className="mt-1.5 shrink-0 text-muted-foreground/70 dark:text-white/40"
          style={{ fontSize: "clamp(0.55rem, 0.65vw, 0.8rem)" }}
        >
          {formattedDate} &middot; {author}
        </p>

        {tagsFlat.length > 0 && (
          <div className="mt-2 flex shrink-0 flex-wrap gap-1">
            {tagsFlat.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-muted/60 py-px font-medium text-muted-foreground dark:bg-white/10 dark:text-white/50"
                style={{ fontSize: "clamp(0.5rem, 0.6vw, 0.7rem)", padding: "1px clamp(0.3rem, 0.4vw, 0.5rem)" }}
              >
                {formatTag(tag)}
              </span>
            ))}
          </div>
        )}

        <p
          className="mt-2.5 min-h-0 flex-1 overflow-hidden leading-relaxed text-muted-foreground dark:text-white/70"
          style={{
            fontSize: "clamp(0.65rem, 0.8vw, 1rem)",
            maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        >
          {excerpt}
        </p>

        <div className="shrink-0 pt-2">
          <span
            className="font-medium text-muted-foreground/60 transition-colors group-hover:text-foreground dark:text-white/40 dark:group-hover:text-white/70"
            style={{ fontSize: "clamp(0.55rem, 0.65vw, 0.8rem)" }}
          >
            Read more &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Library Section                                                    */
/* ------------------------------------------------------------------ */

export default function LibrarySection({ articles, tagsByCategory }: LibrarySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [cardOverflow, setCardOverflow] = useState(0);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const filteredArticles = articles.filter((a) => {
    for (const [cat, tag] of Object.entries(activeFilters)) {
      const category = cat as keyof TagCategories;
      if (!a.tags[category].includes(tag)) return false;
    }
    return true;
  });

  const handleToggle = useCallback((category: keyof TagCategories, tag: string) => {
    setActiveFilters((prev) => {
      if (prev[category] === tag) {
        const next = { ...prev };
        delete next[category];
        return next;
      }
      return { ...prev, [category]: tag };
    });
    setScrollOffset(0);
  }, []);

  const handleClear = useCallback(() => {
    setActiveFilters({});
    setScrollOffset(0);
  }, []);

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
  }, [filteredArticles]);

  // Track scroll position to translate the card grid
  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const offset = Math.max(0, Math.min(scrolled, cardOverflow));
      setScrollOffset(offset);

      // Reset left sidebar scroll when at top of section
      if (offset === 0 && leftSidebarRef.current) {
        leftSidebarRef.current.scrollTop = 0;
      }
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
      {/* Sticky container */}
      <div className="sticky flex flex-col overflow-hidden" style={{ top: "calc(var(--header-h, 73px) + var(--tagline-h, 80px))", height: "calc(100vh - var(--header-h, 73px) - var(--tagline-h, 80px))" }}>
        <div className="h-10 shrink-0 bg-background" />
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — scrollable, hidden scrollbar */}
          <div
            ref={leftSidebarRef}
            className="w-[30%] overflow-y-auto rounded-tr-2xl bg-neutral-800 px-[3%] pt-8 text-white dark:bg-neutral-900"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <h3
              className="font-semibold leading-tight"
              style={{ fontSize: "clamp(1.2rem, 2.2vw, 4rem)" }}
            >
              Your systems need to uncover what you&rsquo;re missing.
            </h3>
            <p
              className="mt-6 max-w-[30ch] text-white/70"
              style={{ fontSize: "clamp(0.875rem, 1vw, 1.5rem)" }}
            >
              Legal Operations Intelligence transforms how your team
              captures data, retains knowledge, and makes decisions.
            </p>
            <div
              className="mt-8 shrink-0 rounded-lg bg-white/10"
              style={{ width: "80%", aspectRatio: "4/3" }}
            />
            <div className="pb-8" />
          </div>

          {/* Right — filter + cards */}
          <div className="relative flex flex-1 flex-col overflow-hidden px-[2%]">
            {/* Category filter dropdowns */}
            <FilterBar
              tagsByCategory={tagsByCategory}
              activeFilters={activeFilters}
              onToggle={handleToggle}
              onClear={handleClear}
              filteredCount={filteredArticles.length}
              totalCount={articles.length}
            />

            {/* Cards grid */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <div
                ref={cardContainerRef}
                className="grid grid-cols-3"
                style={{
                  gap: "clamp(0.5rem, 1vw, 1.5rem)",
                  transform: `translateY(-${scrollOffset}px)`,
                  willChange: "transform",
                }}
              >
                {filteredArticles.length === 0 ? (
                  <div className="col-span-3 flex items-center justify-center py-20">
                    <p className="text-sm text-muted-foreground">No articles match the selected filters.</p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.slug}
                      {...article}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
