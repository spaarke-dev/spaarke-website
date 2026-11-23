import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleModal } from "@/components/services/ArticleModal";
import { getPostBySlug, readingTimeMinutes } from "@/lib/blog";

const SLUG = "the-spaarke-method";

/**
 * /why-spaarke/the-spaarke-method reached from /services ("Read the Spaarke
 * Method" under the phases): shown as a modal over the page (owner,
 * 2026-11-22). A reload or a direct link renders the full article page in
 * src/app/why-spaarke/[slug]/page.tsx. Same MDX setup as that page; links in
 * the body are plain links here.
 */
export default async function SpaarkeMethodIntercepted() {
  const post = getPostBySlug(SLUG);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });

  return (
    <ArticleModal title={post.title}>
      <ArticleHeader post={post} readingTimeMin={readingTimeMinutes(post.content)} backLink={false} />
      <div className="prose prose-neutral prose-base md:prose-lg max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight">
        {content}
      </div>
    </ArticleModal>
  );
}
