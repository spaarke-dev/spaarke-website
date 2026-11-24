/**
 * Site navigation content.
 *
 * Top nav: spaarke wordmark + left page links + right action links +
 * the site-wide Law Firm | Corporate switch (SiteHeader). The "Get
 * access" pill left the header on 2026-11-23; /access-request stays
 * reachable from the Platform page.
 */

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: { left: NavLink[]; right: NavLink[] } = {
  left: [],
  right: [
    { label: "Platform", href: "/platform" },
    { label: "Services", href: "/services" },
    { label: "Why Spaarke", href: "/why-spaarke" },
    { label: "Contact us", href: "/contact" },
    { label: "Sign in", href: "/signin" },
  ],
};

export const logo = {
  src: "/brand/logos/spaarke-logo-white.svg",
  alt: "Spaarke",
  href: "/",
};
