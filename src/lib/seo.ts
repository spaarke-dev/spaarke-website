import type { Metadata } from "next";
import type { BlogPostMeta } from "@/lib/blog";
import { flattenTags } from "@/lib/blog";

/* ------------------------------------------------------------------ */
/*  Site-wide constants                                                */
/* ------------------------------------------------------------------ */

const SITE_NAME = "Spaarke";
const SITE_DESCRIPTION =
  "Spaarke is a Legal Operations Intelligence platform built on Microsoft 365. Raise the IQ of your legal work with unified data, operational memory, and AI-powered inference.";

/* ------------------------------------------------------------------ */
/*  Organization JSON-LD (site-wide)                                   */
/* ------------------------------------------------------------------ */

export type OrganizationJsonLd = {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  description: string;
  sameAs?: string[];
};

export function generateOrganizationJsonLd(
  siteUrl: string,
): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    sameAs: [
      // Add social profiles as they become available
      // "https://www.linkedin.com/company/spaarke",
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Blog Post Metadata (Open Graph, Twitter, canonical)                */
/* ------------------------------------------------------------------ */

export function generateBlogPostMetadata(
  post: BlogPostMeta,
  siteUrl: string,
): Metadata {
  const url = `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.heroImage ?? `${siteUrl}/images/og-default.png`;
  const allTags = flattenTags(post.tags);

  return {
    title: post.title,
    description: post.summary ?? post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.summary ?? post.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.date,
      ...(post.posted ? { modifiedTime: post.posted } : {}),
      authors: [post.author],
      tags: allTags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary ?? post.description,
      images: [ogImage],
    },
    other: {
      // AI search signals — helps AI crawlers understand content purpose
      "article:section": post.tags.topic[0] ?? "Legal Operations Intelligence",
      "article:tag": allTags.join(", "),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  JSON-LD Article schema (enhanced for SEO + AI search)              */
/* ------------------------------------------------------------------ */

export type ArticleJsonLd = {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  abstract?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  image?: string;
  keywords?: string;
  articleSection?: string;
  about?: {
    "@type": "Thing";
    name: string;
  }[];
  speakable?: {
    "@type": "SpeakableSpecification";
    cssSelector: string[];
  };
};

export function generateBlogJsonLd(
  post: BlogPostMeta,
  siteUrl: string,
): ArticleJsonLd {
  const url = `${siteUrl}/blog/${post.slug}`;
  const allTags = flattenTags(post.tags);

  // Build "about" entities from topic and theme tags for AI understanding
  const aboutEntities = [
    ...post.tags.topic,
    ...post.tags.theme,
  ].map((tag) => ({
    "@type": "Thing" as const,
    name: tag
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary ?? post.description,
    ...(post.summary ? { abstract: post.summary } : {}),
    datePublished: post.date,
    ...(post.posted ? { dateModified: post.posted } : {}),
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(post.heroImage ? { image: post.heroImage } : {}),
    ...(allTags.length > 0 ? { keywords: allTags.join(", ") } : {}),
    ...(post.tags.topic.length > 0
      ? { articleSection: post.tags.topic[0] }
      : {}),
    ...(aboutEntities.length > 0 ? { about: aboutEntities } : {}),
    // Speakable: tells AI assistants which parts of the page are most
    // suitable for text-to-speech / AI summary extraction
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "article h1",
        "[data-summary]",
        "article .prose h2:first-of-type + p",
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  WebSite JSON-LD (for sitelinks search box in search results)       */
/* ------------------------------------------------------------------ */

export type WebSiteJsonLd = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
};

export function generateWebSiteJsonLd(siteUrl: string): WebSiteJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}
