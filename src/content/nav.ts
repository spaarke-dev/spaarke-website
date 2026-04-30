/**
 * Site navigation content.
 *
 * Top nav: spaarke wordmark + left page links + right action links.
 * Right side is "Contact us + Sign in" — Get access lives elsewhere
 * (notification banner, hero CTA, closing CTA, footer panel).
 */

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: { left: NavLink[]; right: NavLink[] } = {
  left: [
    { label: "Platform", href: "/platform" },
    { label: "Why Spaarke", href: "/why-spaarke" },
    { label: "Insights", href: "/insights" },
  ],
  right: [
    { label: "Contact us", href: "/contact" },
    { label: "Sign in", href: "/signin" },
  ],
};

export const logo = {
  src: "/brand/logos/spaarke-logo-white.svg",
  alt: "Spaarke",
  href: "/",
};
