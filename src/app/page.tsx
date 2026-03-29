import type { Metadata } from "next";
import NotificationBar from "@/components/NotificationBar";
import HeroSection from "@/components/HeroSection";
import StickyTagline from "@/components/StickyTagline";
import LibrarySection from "@/components/LibrarySection";
import NextSection from "@/components/NextSection";
import { getAllPosts, getAllTags, flattenTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Spaarke | Legal Operations Intelligence",
  description:
    "Legal Operations Intelligence — Work Smarter, Operate Leaner, Decide Faster.",
};

export default function Home() {
  const posts = getAllPosts();

  // Sort: ordered posts first (by order asc), then unordered posts by date desc
  const sorted = [...posts].sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Map blog posts to the shape LibrarySection expects
  const articles = sorted.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.summary ?? post.description,
    date: post.date,
    author: post.author,
    tags: post.tags,
    tagsFlat: flattenTags(post.tags),
  }));

  // Collect unique tags by category for filtering
  const tagsByCategory = getAllTags();

  return (
    <div>
      <NotificationBar />
      <HeroSection />
      {/* Wrapper constrains sticky tagline — it unsticks when this container ends */}
      <div>
        <StickyTagline />
        <LibrarySection articles={articles} tagsByCategory={tagsByCategory} />
      </div>
      {/* Bottom spacer after article section */}
      <div className="h-12 bg-background" />
      <NextSection />
    </div>
  );
}
