import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";
import BlogFilteredList from "@/components/BlogFilteredList";
import { getAllPosts, getAllTags } from "@/lib/blog";

const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "How we think about the work — perspectives on Legal Operations Intelligence, AI strategy, and the Microsoft-native approach to raising the IQ of legal work.",
  openGraph: {
    title: "Insights | Spaarke",
    description:
      "How we think about the work — perspectives on Legal Operations Intelligence, AI strategy, and the Microsoft-native approach to raising the IQ of legal work.",
    url: `${siteUrl}/insights`,
    siteName: "Spaarke",
    type: "website",
  },
};

export default function InsightsIndex() {
  const posts = getAllPosts();
  const tagsByCategory = getAllTags();

  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Insights"
          title="How we think about the work."
          lede="Perspectives on Legal Operations Intelligence, AI strategy, and the Microsoft-native approach to raising the IQ of legal work."
        />

        <div className="mt-16">
          {posts.length === 0 ? (
            <p className="text-fg-mid">No posts yet. Check back soon.</p>
          ) : (
            <BlogFilteredList posts={posts} tagsByCategory={tagsByCategory} />
          )}
        </div>
      </Shell>
    </Slab>
  );
}
