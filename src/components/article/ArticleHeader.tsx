import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

type Props = {
  post: BlogPostMeta;
  readingTimeMin: number;
};

/**
 * Compact, light-theme article header.
 *  - Back link
 *  - Eyebrow (top topic tag)
 *  - H1 title
 *  - Meta line: date · author · X min read
 *  - Optional hero image / brand gradient
 *  - "Why this matters" summary block (if summary present in frontmatter)
 */
export function ArticleHeader({ post, readingTimeMin }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eyebrow = post.tags.theme[0] ?? post.tags.topic[0];

  return (
    <header className="mb-10">
      <Link
        href="/why-spaarke"
        className="text-fg-mid hover:text-fg focus-visible:ring-spaarke-blue inline-flex items-center gap-1.5 rounded-sm text-sm transition-colors focus-visible:outline-none focus-visible:ring-2"
      >
        <svg
          aria-hidden="true"
          className="h-3.5 w-3.5"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M11 7H3m0 0l3-3m-3 3l3 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Why Spaarke
      </Link>

      {eyebrow && (
        <p className="text-fg-low mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
          {formatLabel(eyebrow)}
        </p>
      )}

      <h1
        className="font-display text-fg mt-3 font-medium leading-[1.1] tracking-[-0.02em]"
        style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
      >
        {post.title}
      </h1>

      <div className="text-fg-mid mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <time dateTime={post.date}>{formattedDate}</time>
        <span aria-hidden="true" className="opacity-50">·</span>
        <span>{post.author}</span>
        <span aria-hidden="true" className="opacity-50">·</span>
        <span>{readingTimeMin} min read</span>
      </div>

      {/* Hero image / brand gradient — small, not dominant */}
      <div
        className="border-line relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl border md:aspect-[21/9]"
        style={{
          background: post.heroImage
            ? undefined
            : "linear-gradient(135deg, #1a1f3a 0%, #2d1f5e 50%, #4a1f4f 100%)",
        }}
      >
        {post.heroImage ? (
          <Image
            src={post.heroImage}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(123,91,255,0.35) 0%, rgba(255,77,203,0.15) 45%, rgba(0,0,0,0) 80%)",
            }}
          />
        )}
      </div>

      {/* Key Takeaways — bullet list when frontmatter provides it, otherwise
          fall back to the summary paragraph for older posts. */}
      {(post.keyTakeaways && post.keyTakeaways.length > 0) || post.summary ? (
        <div
          data-summary
          className="bg-surface border-line mt-10 rounded-xl border px-6 py-5"
        >
          <p className="text-fg-low font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
            Key takeaways
          </p>
          {post.keyTakeaways && post.keyTakeaways.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {post.keyTakeaways.map((item, i) => (
                <li
                  key={i}
                  className="text-fg flex items-baseline gap-3 text-base leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="bg-spaarke-blue mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-fg mt-2 text-base leading-relaxed">
              {post.summary}
            </p>
          )}
        </div>
      ) : null}
    </header>
  );
}

function formatLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
