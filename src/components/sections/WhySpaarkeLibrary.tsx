"use client";

import { useEffect, useMemo, useState } from "react";
import { Heading, Shell, Slab } from "@/components/primitives";
import PostCard from "@/components/PostCard";
import type { BlogPostMeta, TagCategories } from "@/lib/blog";

const PAGE_SIZE = 6;

type Props = {
  posts: BlogPostMeta[];
  tagsByCategory: TagCategories;
};

type FilterKey = "contentType" | "topic" | "audience";

// Words that should render as ALL-CAPS abbreviations even though
// they're stored lowercase in MDX frontmatter (e.g. "ai-copilot" →
// "AI Copilot", "iq-stack" → "Legal IQ stack"). Add to this set when new
// abbreviation tags are introduced.
const ABBREVIATIONS = new Set([
  "ai",
  "iq",
  "dms",
  "it",
  "loi",
  "saas",
  "rfp",
  "kpi",
  "sla",
]);

function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((w) =>
      ABBREVIATIONS.has(w)
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

export function WhySpaarkeLibrary({ posts, tagsByCategory }: Props) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    contentType: "",
    topic: "",
    audience: "",
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Audience options = function (roles) + organization (org type) merged
  const audienceOptions = useMemo(
    () =>
      [...tagsByCategory.function, ...tagsByCategory.organization].sort(),
    [tagsByCategory],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (q) {
        const haystack = `${p.title} ${p.summary ?? ""} ${p.description ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.contentType && !p.tags.theme.includes(filters.contentType))
        return false;
      if (filters.topic && !p.tags.topic.includes(filters.topic)) return false;
      if (filters.audience) {
        const inFunction = p.tags.function.includes(filters.audience);
        const inOrg = p.tags.organization.includes(filters.audience);
        if (!inFunction && !inOrg) return false;
      }
      return true;
    });
  }, [posts, search, filters]);

  // Reset to first page whenever search or filters change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, filters]);

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const update = (key: FilterKey, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <Slab tone="light" className="pb-32 md:pb-40">
      <Shell>
        <div className="mx-auto max-w-3xl text-center">
          <Heading level={2}>
            Legal operations is complex.
            <br />
            Rethink what's possible.
          </Heading>
        </div>

        {/* Filter bar */}
        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Search */}
          <label className="border-line bg-surface flex items-center gap-2 rounded-md border px-3 py-2.5">
            <svg
              className="text-fg-low h-4 w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search all resources"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-fg placeholder:text-fg-low w-full bg-transparent text-sm outline-none"
            />
          </label>

          <FilterSelect
            label="Content Type"
            value={filters.contentType}
            options={tagsByCategory.theme}
            onChange={(v) => update("contentType", v)}
          />
          <FilterSelect
            label="Topic"
            value={filters.topic}
            options={tagsByCategory.topic}
            onChange={(v) => update("topic", v)}
          />
          <FilterSelect
            label="Audience"
            value={filters.audience}
            options={audienceOptions}
            onChange={(v) => update("audience", v)}
          />
        </div>

        <div className="text-fg-mid mt-3 text-sm">
          Showing {visiblePosts.length} of {filtered.length}
          {filtered.length !== posts.length && ` (filtered from ${posts.length})`}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <p className="text-fg-mid mt-12 text-center">
            No articles match your filters.
          </p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              {visiblePosts.map((post) => (
                <PostCard key={post.slug} post={post} variant="portrait" />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((n) => n + PAGE_SIZE)
                  }
                  className="border-line text-fg hover:border-fg focus-visible:ring-spaarke-blue rounded-full border px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
                >
                  Load more articles
                  <span className="text-fg-mid ml-2 font-normal">
                    ({filtered.length - visibleCount} more)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </Shell>
    </Slab>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="border-line bg-surface relative rounded-md border">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="text-fg w-full appearance-none bg-transparent px-3 py-2.5 text-sm outline-none"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {formatTag(opt)}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="text-fg-low pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M6 9l6 6 6-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
