import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import Container from "@/components/Container";
import PostHeader from "@/components/PostHeader";
import {
  ArticleSidebarNav,
  ArticleSidebarMeta,
} from "@/components/ArticleSidebar";
import { getAllPosts, getPostBySlug, flattenTags } from "@/lib/blog";
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

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content: mdxContent } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  const jsonLd = generateBlogJsonLd(post, siteUrl);

  // Fetch all posts for series nav + related posts
  const allPosts = getAllPosts();

  // Compute related posts: rank by shared tags, exclude current, take top 3
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

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto flex max-w-7xl justify-center gap-8 lg:gap-10">
          {/* Left sidebar — series nav */}
          <div className="hidden w-52 shrink-0 lg:block">
            <ArticleSidebarNav currentSlug={slug} posts={allPosts} />
          </div>

          {/* Center — article content */}
          <article
            className="min-w-0 max-w-2xl flex-1"
            itemScope
            itemType="https://schema.org/Article"
          >
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostHeader post={post} />
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              {mdxContent}
            </div>
          </article>

          {/* Right sidebar — meta, related, CTA */}
          <div className="hidden w-60 shrink-0 lg:block">
            <ArticleSidebarMeta post={post} relatedPosts={related} />
          </div>
        </div>
      </Container>
    </section>
  );
}
