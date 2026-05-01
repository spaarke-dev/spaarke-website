import type { Metadata } from "next";
import { WhySpaarkeHero, WhySpaarkeLibrary } from "@/components/sections";
import { getAllPosts, getAllTags, getFeaturedPosts } from "@/lib/blog";

const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

export const metadata: Metadata = {
  title: "Why Spaarke",
  description:
    "Why Spaarke — the strategic case for a shared platform across legal departments, business stakeholders, and outside counsel. Perspectives on Legal Operations Intelligence, AI strategy, and the Microsoft-native approach.",
  openGraph: {
    title: "Why Spaarke",
    description:
      "Why Spaarke — the strategic case for a shared platform across legal departments, business stakeholders, and outside counsel.",
    url: `${siteUrl}/why-spaarke`,
    siteName: "Spaarke",
    type: "website",
  },
};

export default function WhySpaarke() {
  const featured = getFeaturedPosts();
  const allPosts = getAllPosts();
  const tagsByCategory = getAllTags();

  return (
    <>
      <WhySpaarkeHero posts={featured} />
      <WhySpaarkeLibrary posts={allPosts} tagsByCategory={tagsByCategory} />
    </>
  );
}
