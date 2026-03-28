import type { Metadata } from "next";
import NotificationBar from "@/components/NotificationBar";
import HeroSection from "@/components/HeroSection";
import StickyTagline from "@/components/StickyTagline";
import LibrarySection from "@/components/LibrarySection";
import NextSection from "@/components/NextSection";
import { getAllPosts, flattenTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Spaarke | Legal Operations Intelligence",
  description:
    "Legal Operations Intelligence — Work Smarter, Operate Leaner, Decide Faster.",
};

export default function Home() {
  const posts = getAllPosts();

  // Map blog posts to the shape LibrarySection expects
  const articles = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.summary ?? post.description,
    date: post.date,
    author: post.author,
    tags: flattenTags(post.tags).slice(0, 4),
  }));

  return (
    <div>
      <NotificationBar />
      <HeroSection />
      {/* Wrapper constrains sticky tagline — it unsticks when this container ends */}
      <div>
        <StickyTagline />
        <LibrarySection articles={articles} />
      </div>
      <NextSection />
    </div>
  );
}
