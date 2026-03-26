import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import StickyTagline from "@/components/StickyTagline";
import LibrarySection from "@/components/LibrarySection";
import NextSection from "@/components/NextSection";
import { getAllPosts } from "@/lib/blog";

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
  }));

  return (
    <div>
      <HeroSection />
      <StickyTagline />
      <LibrarySection articles={articles} />
      <NextSection />
    </div>
  );
}
