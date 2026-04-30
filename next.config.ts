import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@fluentui/react-icons"],
  },
  serverExternalPackages: ["applicationinsights"],
  async redirects() {
    return [
      // Permanent redirect from old /blog routes to renamed /insights
      {
        source: "/blog",
        destination: "/insights",
        permanent: true,
      },
      {
        source: "/blog/:slug*",
        destination: "/insights/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
