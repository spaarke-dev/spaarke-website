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
    ];
  },
};

export default nextConfig;
