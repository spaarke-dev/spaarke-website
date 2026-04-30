import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

  const staticPages = [
    "",
    "/platform",
    "/why-spaarke",
    "/insights",
    "/about",
    "/contact",
    "/access-request",
    "/privacy",
    "/terms",
    "/signin",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/insights" ? 0.9 : 0.5,
  }));

  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/insights/${post.slug}`,
    lastModified: post.posted ? new Date(post.posted) : new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
