/**
 * Site navigation content.
 *
 * Top nav: spaarke wordmark + left page links + right action links +
 * a "Get access" pill (rendered separately as a Button primary in
 * SiteHeader so it carries the rounded cta-blue treatment).
 */

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: { left: NavLink[]; right: NavLink[] } = {
  left: [],
  right: [
    { label: "Platform", href: "/platform" },
    { label: "Why Spaarke", href: "/why-spaarke" },
    { label: "Contact us", href: "/contact" },
    { label: "Sign in", href: "/signin" },
  ],
};

export const navCta: NavLink = {
  label: "Get access",
  href: "/access-request",
};

export const logo = {
  src: "/brand/logos/spaarke-logo-white.svg",
  alt: "Spaarke",
  href: "/",
};
