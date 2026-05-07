/**
 * Site footer — brand block + minimal site links + Our Partners
 * panel + social icon row.
 */

import type { NavLink } from "./nav";

export type FooterColumn = {
  heading: string;
  links: NavLink[];
};

export type FooterPartnersPanel = {
  heading: string;
  body: string;
  partners: { name: string; logo: { src: string; alt: string } }[];
};

export type SocialPlatform = "linkedin" | "x" | "medium" | "bluesky";

export type SocialLink = {
  label: string;
  href: string;
  platform: SocialPlatform;
};

export type FooterContent = {
  brand: {
    wordmark: { src: string; alt: string };
    /** One short sentence under the wordmark. Anchors the footer. */
    positioning: string;
  };
  columns: FooterColumn[];
  partnersPanel: FooterPartnersPanel;
  socialLinks: SocialLink[];
  copyright: string;
};

export const footerContent: FooterContent = {
  brand: {
    wordmark: {
      src: "/brand/logos/spaarke-logo-white.svg",
      alt: "Spaarke",
    },
    positioning:
      "The shared platform for legal — built on Microsoft 365.",
  },
  columns: [
    {
      heading: "Spaarke",
      links: [
        { label: "About", href: "/about" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  partnersPanel: {
    heading: "Our partners",
    body: "We work alongside a growing network of design and engineering partners who help build, deploy, and operate Spaarke for our customers.",
    partners: [
      {
        name: "Spark Labs",
        logo: {
          src: "/brand/logos/spark-labs-logo-dark.svg",
          alt: "Spark Labs",
        },
      },
    ],
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/spaarke",
      platform: "linkedin",
    },
    {
      label: "X",
      href: "https://x.com/spaarke",
      platform: "x",
    },
    {
      label: "Medium",
      href: "https://medium.com/@spaarke",
      platform: "medium",
    },
    {
      label: "Bluesky",
      href: "https://bsky.app/profile/spaarke.bsky.social",
      platform: "bluesky",
    },
  ],
  copyright: `© ${new Date().getFullYear()} Spaarke. All rights reserved.`,
};
