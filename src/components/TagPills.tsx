"use client";

import { Tag20Regular } from "@fluentui/react-icons";
import type { TagCategories } from "@/lib/blog";

/** Display labels for tag categories. */
const CATEGORY_LABELS: Record<keyof TagCategories, string> = {
  organization: "Audience",
  function: "Role",
  topic: "Topic",
  theme: "Theme",
};

/** Accent colors per category for visual differentiation. */
const CATEGORY_STYLES: Record<keyof TagCategories, string> = {
  organization:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  function:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  topic:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  theme:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
};

/** Format a kebab-case tag for display. */
function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/* ------------------------------------------------------------------ */
/*  Compact variant — single row, no category labels                   */
/* ------------------------------------------------------------------ */

type TagPillsCompactProps = {
  tags: TagCategories;
  variant?: "compact";
};

function TagPillsCompact({ tags }: TagPillsCompactProps) {
  const allTags = [
    ...tags.theme.map((t) => ({ tag: t, cat: "theme" as const })),
    ...tags.topic.map((t) => ({ tag: t, cat: "topic" as const })),
  ];

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Tag20Regular className="h-3.5 w-3.5 text-muted-foreground" />
      {allTags.map(({ tag, cat }) => (
        <span
          key={`${cat}-${tag}`}
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[cat]}`}
        >
          {formatTag(tag)}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Full variant — grouped by category                                 */
/* ------------------------------------------------------------------ */

type TagPillsFullProps = {
  tags: TagCategories;
  variant: "full";
};

function TagPillsFull({ tags }: TagPillsFullProps) {
  const categories = (
    Object.keys(CATEGORY_LABELS) as (keyof TagCategories)[]
  ).filter((cat) => tags[cat].length > 0);

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => (
        <div key={cat} className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {CATEGORY_LABELS[cat]}
          </span>
          {tags[cat].map((tag) => (
            <span
              key={tag}
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[cat]}`}
            >
              {formatTag(tag)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline variant — serial text, categories separated by semicolons   */
/* ------------------------------------------------------------------ */

/** Text colors per category for inline variant. */
const CATEGORY_TEXT: Record<keyof TagCategories, string> = {
  organization: "text-blue-600 dark:text-blue-400",
  function: "text-emerald-600 dark:text-emerald-400",
  topic: "text-amber-600 dark:text-amber-400",
  theme: "text-violet-600 dark:text-violet-400",
};

function TagPillsInline({ tags }: { tags: TagCategories }) {
  const categories = (
    Object.keys(CATEGORY_LABELS) as (keyof TagCategories)[]
  ).filter((cat) => tags[cat].length > 0);

  if (categories.length === 0) return null;

  return (
    <p className="text-[11px] leading-relaxed text-muted-foreground">
      {categories.map((cat, i) => (
        <span key={cat}>
          {i > 0 && (
            <span className="mx-1.5 text-muted-foreground/30">;</span>
          )}
          <span className="font-semibold uppercase tracking-wider">
            {CATEGORY_LABELS[cat]}:
          </span>{" "}
          <span className={CATEGORY_TEXT[cat]}>
            {tags[cat].map(formatTag).join(", ")}
          </span>
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported component                                                 */
/* ------------------------------------------------------------------ */

type TagPillsProps = {
  tags: TagCategories;
  /** "compact" (default) shows theme + topic pills in a single row.
   *  "full" shows all categories with colored pill labels.
   *  "inline" shows serial text with categories separated by semicolons. */
  variant?: "compact" | "full" | "inline";
};

export default function TagPills({
  tags,
  variant = "compact",
}: TagPillsProps) {
  if (variant === "full") {
    return <TagPillsFull tags={tags} variant="full" />;
  }
  if (variant === "inline") {
    return <TagPillsInline tags={tags} />;
  }
  return <TagPillsCompact tags={tags} />;
}
