import Link from "next/link";
import type { BlogPostMeta, TagCategories } from "@/lib/blog";

/* ------------------------------------------------------------------ */
/*  Display helpers                                                     */
/* ------------------------------------------------------------------ */

const CATEGORY_LABELS: Record<keyof TagCategories, string> = {
  organization: "Audience",
  function: "Role",
  topic: "Topic",
  theme: "Theme",
};

function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Left sidebar — series navigation                                    */
/* ------------------------------------------------------------------ */

type ArticleSidebarNavProps = {
  currentSlug: string;
  posts: BlogPostMeta[];
};

export function ArticleSidebarNav({
  currentSlug,
  posts,
}: ArticleSidebarNavProps) {
  // Sort ascending by date (oldest first = Article 1 at top)
  const sorted = [...posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <nav
      aria-label="Article series navigation"
      className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-1 overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`.series-nav::-webkit-scrollbar { display: none; }`}</style>
      <div className="series-nav">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          In This Series
        </h2>

        <ul className="space-y-0.5">
          {sorted.map((post, idx) => {
            const isCurrent = post.slug === currentSlug;

            return (
              <li key={post.slug}>
                {isCurrent ? (
                  <span
                    className="block border-l-2 border-[#000BFF] py-1.5 pl-3 text-sm font-bold text-foreground dark:border-blue-400"
                    aria-current="page"
                  >
                    {idx + 1}. {post.title}
                  </span>
                ) : (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block border-l-2 border-transparent py-1.5 pl-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                  >
                    {idx + 1}. {post.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA card — reusable across desktop sidebar and mobile standalone   */
/* ------------------------------------------------------------------ */

export function ArticleCTA({ className }: { className?: string }) {
  return (
    <section
      className={`rounded-lg border border-border bg-muted/40 px-4 py-5 dark:bg-muted/15 ${className ?? ""}`}
    >
      <h2 className="text-sm font-semibold text-foreground">
        See Spaarke in Action
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        Discover how Legal Operations Intelligence transforms how your team
        works.
      </p>
      <Link
        href="/contact"
        className="mt-3 inline-block rounded-md bg-[#000BFF] px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
      >
        Request Early Access
      </Link>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Right sidebar — meta, related posts, tags, CTA                     */
/* ------------------------------------------------------------------ */

type ArticleSidebarMetaProps = {
  post: BlogPostMeta;
  relatedPosts: BlogPostMeta[];
};

export function ArticleSidebarMeta({
  post,
  relatedPosts,
}: ArticleSidebarMetaProps) {
  // Build tag groups for inline display
  const tagCategories = (
    Object.keys(CATEGORY_LABELS) as (keyof TagCategories)[]
  ).filter((cat) => post.tags[cat].length > 0);

  return (
    <aside
      aria-label="Article metadata"
      className="sticky top-24 space-y-6"
    >
      {/* Tags */}
      {tagCategories.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {tagCategories.map((cat, i) => (
              <span key={cat}>
                {i > 0 && (
                  <span className="mx-1 text-muted-foreground/30">;</span>
                )}
                <span className="font-semibold uppercase tracking-wider">
                  {CATEGORY_LABELS[cat]}:
                </span>{" "}
                {post.tags[cat].map(formatTag).join(", ")}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* CTA card */}
      <ArticleCTA />

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Related Articles
          </h2>
          <div className="space-y-2.5">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="block rounded-lg border border-border bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60 dark:bg-muted/10 dark:hover:bg-muted/25"
              >
                <p className="text-sm font-medium leading-snug text-foreground">
                  {related.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(related.date)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}
