import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import NotificationBar from "@/components/NotificationBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PlausibleScript } from "@/components/analytics/PlausibleScript";
import { ClarityScript } from "@/components/analytics/ClarityScript";
import { AttributionBootstrap } from "@/components/analytics/AttributionBootstrap";
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// v2 fonts — Inter Tight (display), Inter (body), JetBrains Mono (eyebrows / captions).
// Self-hosted at build time by next/font/google.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

export const metadata: Metadata = {
  title: {
    default: "Spaarke | Legal Operations Intelligence",
    template: "%s | Spaarke",
  },
  description:
    "Spaarke is a Legal Operations Intelligence platform built on Microsoft 365. Raise the IQ of your legal work with unified data, operational memory, and AI-powered inference.",
  metadataBase: new URL(siteUrl),
  alternates: {
    types: {
      "application/rss+xml": "/why-spaarke/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Spaarke",
    locale: "en_US",
    images: [
      {
        url: "/images/og-default.png",
        width: 1661,
        height: 935,
        alt: "Spaarke — Legal Operations Intelligence platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = generateOrganizationJsonLd(siteUrl);
  const siteJsonLd = generateWebSiteJsonLd(siteUrl);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
        {/* Organization + WebSite structured data — site-wide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([orgJsonLd, siteJsonLd]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} ${inter.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <PlausibleScript />
        <ClarityScript />
        <AttributionBootstrap />
        <ThemeProvider>
          {/* Skip link — first focusable element, hidden until focused */}
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spaarke-blue"
          >
            Skip to main content
          </a>
          <NotificationBar />
          <SiteHeader />
          {/* main is a flex column so a single-section page can grow
              its Slab via `flex-1` to fill the viewport. Without this,
              the body's light background shows through below short
              dark pages on tall viewports. */}
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
