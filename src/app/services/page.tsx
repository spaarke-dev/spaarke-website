import type { Metadata } from "next";
import { ServicesPage } from "@/components/services/sections";
import { isAudience } from "@/components/services/audience-types";

const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

const description =
  "Spaarke Managed Legal Operations (MLO): a legal MSO that runs the business side of legal, including technology, AI, operations and finance, for law firms and corporate legal departments.";

export const metadata: Metadata = {
  title: "Managed Legal Operations",
  description,
  // Draft: kept out of search until counsel has reviewed the copy, the
  // function labels and the FAQ answers (design.md section 0, task 052).
  robots: { index: false, follow: false },
  openGraph: {
    title: "Spaarke Managed Legal Operations",
    description,
    url: `${siteUrl}/services`,
    siteName: "Spaarke",
    type: "website",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: "Spaarke Managed Legal Operations" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og-default.png"] },
};

type Props = { searchParams: Promise<{ audience?: string | string[] }> };

/**
 * /services. The audience comes from `?audience=firm|corporate` so links from
 * campaigns and emails render the right view on the first paint; with no
 * parameter the client applies the visitor's remembered choice after mount.
 */
export default async function Services({ searchParams }: Props) {
  const raw = (await searchParams).audience;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const fromUrl = isAudience(value);
  return <ServicesPage initialAudience={fromUrl ? value : "firm"} fromUrl={fromUrl} />;
}
