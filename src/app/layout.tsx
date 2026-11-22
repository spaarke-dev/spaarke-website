import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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

// Fonts are bundled from npm packages (geist, @fontsource-variable/*), not
// fetched from Google at build time: the Google fetch failed intermittently and
// broke deploys. All are variable fonts, latin subset, the same families as before.
const geistSans = GeistSans;
const geistMono = GeistMono;

// v2 fonts: Inter Tight (display), Inter (body), JetBrains Mono (eyebrows / captions).
const interTight = localFont({
  src: "../../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
});

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
});

const siteUrl = process.env.SITE_URL ?? "https://www.spaarke.com";

export const metadata: Metadata = {
  title: {
    default: "Spaarke | Legal Operations Intelligence",
    template: "%s | Spaarke",
  },
  description:
    "Spaarke is a Legal Operations Intelligence platform built on an ontology of legal work, delivered as service as software. It integrates and extends a legal team's core systems and runs where legal teams already work, with enterprise scale and governance.",
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
        width: 1200,
        height: 630,
        alt: "Spaarke — the LegalIQ system of record",
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
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add body
          attributes before React hydrates; ignore those attribute mismatches. */}
      <body
        suppressHydrationWarning
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
