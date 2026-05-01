import Link from "next/link";
import Image from "next/image";
import type { BlogPostMeta } from "@/lib/blog";

type Props = {
  posts: BlogPostMeta[];
};

/**
 * Compact horizontal "related articles" row at the foot of an article.
 * Three cards with title + small thumbnail; no summary, no tags.
 */
export function ArticleRelated({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="border-line mt-20 border-t pt-12"
    >
      <h2
        id="related-articles-heading"
        className="text-fg-low font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
      >
        Continue reading
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.slug}
            href={`/why-spaarke/${post.slug}`}
            className="border-line hover:border-fg group flex gap-4 rounded-lg border p-4 transition-colors"
          >
            <div
              className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md"
              style={{
                background: post.heroImage
                  ? undefined
                  : "linear-gradient(135deg, #1a1f3a 0%, #2d1f5e 50%, #4a1f4f 100%)",
              }}
            >
              {post.heroImage && (
                <Image
                  src={post.heroImage}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  style={{ objectPosition: post.heroImagePosition ?? "center" }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-fg group-hover:text-spaarke-blue line-clamp-3 text-sm font-medium leading-snug transition-colors">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
