"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { BlogPostMeta, TagCategories } from "@/lib/blog";
import PostCard from "@/components/PostCard";

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

function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type ActiveFilters = Partial<Record<keyof TagCategories, string>>;

type Props = {
  posts: BlogPostMeta[];
  tagsByCategory: TagCategories;
};

export default function BlogFilteredList({ posts, tagsByCategory }: Props) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [openCategory, setOpenCategory] = useState<keyof TagCategories | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredPosts = posts.filter((post) => {
    for (const [cat, tag] of Object.entries(activeFilters)) {
      const category = cat as keyof TagCategories;
      if (!post.tags[category].includes(tag)) return false;
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
  }, []);

  const handleClear = useCallback(() => {
    setActiveFilters({});
  }, []);

  const hasFilters = Object.keys(activeFilters).length > 0;
  const categories = Object.keys(CATEGORY_LABELS) as (keyof TagCategories)[];

  return (
    <>
      {/* Filter bar */}
      <div ref={dropdownRef} className="mt-6 flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => {
          const isOpen = openCategory === cat;
          const selectedTag = activeFilters[cat];
          const colors = CATEGORY_COLORS[cat];

          return (
            <div key={cat} className="relative">
              <button
                type="button"
                onClick={() => setOpenCategory(isOpen ? null : cat)}
                className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  selectedTag
                    ? colors.active
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {CATEGORY_LABELS[cat]}
                {selectedTag && (
                  <span className="ml-0.5 opacity-80">: {formatTag(selectedTag)}</span>
                )}
                <svg className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isOpen && tagsByCategory[cat].length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[150px] rounded-lg border border-border bg-background p-1 shadow-lg dark:bg-neutral-800">
                  {tagsByCategory[cat].map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          handleToggle(cat, tag);
                          setOpenCategory(null);
                        }}
                        className={`block w-full rounded-md px-2.5 py-1 text-left text-xs transition-colors ${
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

        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full px-2 py-1 text-[11px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            Clear all
          </button>
        )}

        {/* Counter badge — always visible, pushed to right */}
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
          {filteredPosts.length} of {posts.length}
        </span>
      </div>

      {/* Filtered results */}
      <div className="mt-6 space-y-5">
        {filteredPosts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No articles match the selected filters.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        )}
      </div>
    </>
  );
}
