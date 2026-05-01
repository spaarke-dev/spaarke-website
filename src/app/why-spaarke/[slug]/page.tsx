import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { Shell, Slab } from "@/components/primitives";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleTOC } from "@/components/article/ArticleTOC";
import { ArticleShare } from "@/components/article/ArticleShare";
import { ArticleRelated } from "@/components/article/ArticleRelated";
import { ArticleProgressBar } from "@/components/article/ArticleProgressBar";
import {
  getAllPosts,
  getPostBySlug,
  flattenTags,
  extractToc,
  readingTimeMinutes,
} from "@/lib/blog";
import { generateBlogPostMetadata, generateBlogJsonLd } from "@/lib/seo";

const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return generateBlogPostMetadata(post, siteUrl);
}

export default async function WhySpaarkeArticle({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Auto-generate IDs on rendered headings so the TOC anchor links work.
  const { content: mdxContent } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  const toc = extractToc(post.content);
  const readingTime = readingTimeMinutes(post.content);
  const jsonLd = generateBlogJsonLd(post, siteUrl);

  // Related posts: rank by shared tags, exclude current, take top 3.
  const allPosts = getAllPosts();
  const currentTags = new Set(flattenTags(post.tags));
  const related = allPosts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: flattenTags(p.tags).filter((t) => currentTags.has(t)).length,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.post);

  const articleUrl = `${siteUrl}/why-spaarke/${slug}`;
  const allTags = flattenTags(post.tags);

  return (
    <>
      <ArticleProgressBar />
      <Slab tone="light">
        <Shell>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            {/* Center: article */}
            <article
              className="mx-auto w-full max-w-[720px]"
              itemScope
              itemType="https://schema.org/Article"
            >
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
              />

              <ArticleHeader post={post} readingTimeMin={readingTime} />

              <div className="prose prose-neutral prose-base md:prose-lg max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-h2:scroll-mt-28 prose-h3:scroll-mt-28">
                {mdxContent}
              </div>

              {/* Tags — small subtle row at the bottom */}
              {allTags.length > 0 && (
                <div className="border-line mt-12 flex flex-wrap gap-2 border-t pt-8">
                  {allTags.map((tag) => (
                    <span
                      key={tag}
                      className="border-line text-fg-mid rounded-full border px-3 py-1 text-xs"
                    >
                      {formatTag(tag)}
                    </span>
                  ))}
                </div>
              )}

              {/* Mobile/tablet share — only shown on screens < lg.
                  On lg+ the share lives in the sticky aside. */}
              <div className="mt-10 lg:hidden">
                <ArticleShare url={articleUrl} title={post.title} />
              </div>

              {/* Related */}
              <ArticleRelated posts={related} />

              {/* Footer CTA — single line, subtle */}
              <div className="border-line mt-16 flex flex-col items-start gap-3 border-t pt-10 md:flex-row md:items-center md:justify-between">
                <p className="text-fg-mid text-sm">
                  Want to see how it works?
                </p>
                <Link
                  href="/access-request"
                  className="bg-spaarke-blue text-white hover:bg-spaarke-blue/90 focus-visible:ring-spaarke-blue inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  Get access
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M3 7h8m0 0L8 4m3 3l-3 3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </article>

            {/* Right: TOC + Share — sticky together so both follow the scroll.
                Hidden < lg; on smaller screens the share row appears at the
                bottom of the article instead. */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                <ArticleTOC items={toc} />
                {toc.length >= 3 && (
                  <div className="border-line border-t pt-6">
                    <ArticleShare url={articleUrl} title={post.title} />
                  </div>
                )}
                {toc.length < 3 && (
                  <ArticleShare url={articleUrl} title={post.title} />
                )}
              </div>
            </aside>
          </div>
        </Shell>
      </Slab>
    </>
  );
}

function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
