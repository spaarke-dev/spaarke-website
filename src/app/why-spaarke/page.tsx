import type { Metadata } from "next";
import { WhySpaarkeHero, WhySpaarkeLibrary } from "@/components/sections";
import { InsightsProvider } from "@/components/ArticleInsights";
import { getAllPosts, getAllTags, getFeaturedPosts } from "@/lib/blog";
import { libraryOptions } from "@/lib/insights/questions";

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
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Why Spaarke — the LegalIQ system of record",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-default.png"],
  },
};

export default function WhySpaarke() {
  const featured = getFeaturedPosts();
  const allPosts = getAllPosts();
  const tagsByCategory = getAllTags();

  // The library surface. `slug` is null because there is no article to extend:
  // the whole corpus is in the model's context either way, so a question here
  // reaches all of it rather than less of it.
  //
  // The console is off unless INSIGHTS_ENABLED is set, and when it is off the
  // filter bar renders its search box instead of the assistant, so nothing is
  // missing rather than something being broken.
  const insightsEnabled = process.env.INSIGHTS_ENABLED === "true";

  const library = (
    <WhySpaarkeLibrary
      posts={allPosts}
      tagsByCategory={tagsByCategory}
      assistant={insightsEnabled}
    />
  );

  return (
    <>
      <WhySpaarkeHero posts={featured} />
      {insightsEnabled ? (
        <InsightsProvider
          slug={null}
          articleTitle={`${allPosts.length} published articles`}
          options={libraryOptions()}
          recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
        >
          {library}
        </InsightsProvider>
      ) : (
        library
      )}
    </>
  );
}
