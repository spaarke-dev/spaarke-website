import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@fluentui/react-icons"],
  },
  serverExternalPackages: ["applicationinsights"],
  async redirects() {
    return [
      // Permanent redirects: old /blog and intermediate /insights routes
      // both resolve to the current /why-spaarke section. Preserves SEO
      // and inbound links across the two renames.
      {
        source: "/blog",
        destination: "/why-spaarke",
        permanent: true,
      },
      {
        source: "/blog/:slug*",
        destination: "/why-spaarke/:slug*",
        permanent: true,
      },
      {
        source: "/insights",
        destination: "/why-spaarke",
        permanent: true,
      },
      {
        source: "/insights/:slug*",
        destination: "/why-spaarke/:slug*",
        permanent: true,
      },
      // Print-campaign QR landing slots. Each /go/<code> is printed on
      // physical media, so the path must never 404. Until a real landing
      // page exists at the route, it temporarily redirects to the
      // homepage. permanent: false is required — a cached 308 would keep
      // sending visitors to the interim destination after the real page
      // ships. To launch a page: delete its entry here and add the page
      // at src/app/go/<code>/.
      {
        source: "/go/more-info-1",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
