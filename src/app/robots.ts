import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The market access admin area (projects/market-access, FR-01).
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
