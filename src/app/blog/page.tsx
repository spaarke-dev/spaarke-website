import type { Metadata } from "next";
import Container from "@/components/Container";
import BlogFilteredList from "@/components/BlogFilteredList";
import { getAllPosts, getAllTags } from "@/lib/blog";

const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

export const metadata: Metadata = {
  title: "Library",
  description:
    "Insights on Legal Operations Intelligence, AI strategy, data sovereignty, and the Microsoft-native approach to raising the IQ of legal work.",
  openGraph: {
    title: "Library | Spaarke",
    description:
      "Insights on Legal Operations Intelligence, AI strategy, data sovereignty, and the Microsoft-native approach to raising the IQ of legal work.",
    url: `${siteUrl}/blog`,
    siteName: "Spaarke",
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tagsByCategory = getAllTags();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Library
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Insights on Legal Operations Intelligence, AI strategy, and the
            Microsoft-native approach to raising the IQ of legal work.
          </p>

          {posts.length === 0 ? (
            <p className="mt-12 text-muted-foreground">
              No posts yet. Check back soon!
            </p>
          ) : (
            <BlogFilteredList posts={posts} tagsByCategory={tagsByCategory} />
          )}
        </div>
      </Container>
    </section>
  );
}
