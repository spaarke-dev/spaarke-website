/**
 * Site footer — three columns + Get access CTA panel + bottom strip.
 */

import type { NavLink } from "./nav";

export type FooterColumn = {
  heading: string;
  links: NavLink[];
};

export type FooterCTAPanel = {
  heading: string;
  body: string;
  cta: { label: string; href: string };
};

export type FooterContent = {
  columns: [FooterColumn, FooterColumn, FooterColumn];
  ctaPanel: FooterCTAPanel;
  bottomStrip: {
    wordmark: { src: string; alt: string };
    copyright: string;
    socialLinks: NavLink[];
  };
};

export const footerContent: FooterContent = {
  columns: [
    {
      heading: "Platform",
      links: [
        { label: "Operations", href: "/platform#operations" },
        { label: "Documents & Knowledge", href: "/platform#documents" },
        { label: "Collaboration", href: "/platform#collaboration" },
        { label: "Agents & Automation", href: "/platform#automation" },
        { label: "Spend & Performance", href: "/platform#spend-performance" },
        { label: "Microsoft foundation", href: "/platform#microsoft-foundation" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  ctaPanel: {
    heading: "Get access",
    body: "The shared platform for legal departments, business stakeholders, and outside counsel.",
    cta: { label: "Get access", href: "/access-request" },
  },
  bottomStrip: {
    wordmark: {
      src: "/brand/logos/spaarke-logo-white.svg",
      alt: "Spaarke",
    },
    copyright: `© ${new Date().getFullYear()} Spaarke. All rights reserved.`,
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/spaarke" },
    ],
  },
};
