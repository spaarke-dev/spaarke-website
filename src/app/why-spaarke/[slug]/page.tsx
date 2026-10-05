import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Button, Shell, Slab } from "@/components/primitives";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleTOC } from "@/components/article/ArticleTOC";
import { ArticleShare } from "@/components/article/ArticleShare";
import { ArticleRelated } from "@/components/article/ArticleRelated";
import { ArticleProgressBar } from "@/components/article/ArticleProgressBar";
import { ArticleLink } from "@/components/article/ArticleLink";
import { ArticleReadTracker } from "@/components/analytics/ArticleReadTracker";
import { InsightsProvider, RailEntry } from "@/components/ArticleInsights";
import { entryOptions } from "@/lib/insights/questions";
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

  // Published titles by slug, so a link to another article can open it in the
  // reader beside the page instead of navigating away (ArticleLink).
  const titles = Object.fromEntries(getAllPosts().map((p) => [p.slug, p.title]));

  // Auto-generate IDs on rendered headings so the TOC anchor links work.
  const { content: mdxContent } = await compileMDX({
    source: post.content,
    components: {
      a: (props) => <ArticleLink {...props} titles={titles} currentSlug={slug} />,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
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

  // The entry card questions are read here rather than in the console, because
  // `entryOptions` reaches the corpus manifest and that is 500 kB of JSON with no
  // business in a page bundle. This page is a server component, so they travel as
  // props. The console is off unless INSIGHTS_ENABLED is set, which is what keeps
  // a paid endpoint from being reachable before the owner turns it on.
  const insightsEnabled = process.env.INSIGHTS_ENABLED === "true";
  const insightsOptions = insightsEnabled ? entryOptions(slug) : [];

  // The id is how the console shifts the article out from under its panel. See
  // shiftArticle in components/ArticleInsights.
  const grid = (
    <div
      id="article-grid"
            className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16"
          >
            {/* Center: article */}
            {/* The hook the console's reader lifts this article out of. The whole
                article rather than its body, so a cited passage opens complete,
                with its hero and its heading, and nothing has to navigate away to
                see the rest. Reusing the page rather than re-rendering the
                markdown means the reader cannot drift from what the article
                actually looks like. */}
            <article
              data-article-full
              className="mx-auto w-full max-w-[720px]"
              itemScope
              itemType="https://schema.org/Article"
            >
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
              />

              <ArticleHeader post={post} readingTimeMin={readingTime} />

              <div
                className="prose prose-neutral prose-base md:prose-lg max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-h2:scroll-mt-[132px] prose-h3:scroll-mt-[132px]"
              >
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
                <Button variant="primary" href="/access-request" arrow>
                  Get access
                </Button>
              </div>
            </article>

            {/* Right: TOC + Share — sticky together so both follow the scroll.
                Hidden < lg; on smaller screens the share row appears at the
                bottom of the article instead. */}
            <aside className="hidden lg:block">
              {/* Scrollable, because the rail now carries the table of contents,
                  the share row and the assistant entry card, which together run
                  past the fold on a laptop-height viewport. A sticky column taller
                  than the screen simply cuts its own bottom off. */}
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] space-y-8 overflow-y-auto pb-2">
                <ArticleTOC items={toc} />
                {toc.length >= 3 && (
                  <div className="border-line border-t pt-6">
                    <ArticleShare url={articleUrl} title={post.title} />
                  </div>
                )}
                {toc.length < 3 && (
                  <ArticleShare url={articleUrl} title={post.title} />
                )}
                {/* A surface rather than another hairline. Below a table of
                    contents and a share row, both of which are quiet lists of
                    links, one more section divided by a rule read as a third
                    quiet list. */}
                {insightsEnabled && (
                  <div className="border-line bg-surface rounded-lg border p-4 shadow-sm">
                    <RailEntry />
                  </div>
                )}
              </div>
            </aside>
    </div>
  );

  return (
    <>
      <ArticleProgressBar />
      <ArticleReadTracker slug={slug} />
      <Slab tone="light">
        <Shell>
          {/* The provider wraps the grid rather than sitting inside the rail,
              because the rail is `hidden lg:block` and a display-none ancestor
              hides a fixed child too, so the mobile button could not live there.
              One provider means one conversation across all three surfaces. */}
          {insightsEnabled ? (
            <InsightsProvider
              slug={slug}
              articleTitle={post.title}
              options={insightsOptions}
              recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
            >
              {grid}
            </InsightsProvider>
          ) : (
            grid
          )}
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
