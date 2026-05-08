"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logo, navCta, navLinks } from "@/content/nav";
import { Button } from "@/components/primitives";

/**
 * Match the current pathname against a nav-link href.
 *
 * Root (`/`) only matches exactly. Section pages match exact + any
 * deeper sub-path so the parent stays highlighted on nested pages —
 * e.g. `/why-spaarke` stays active on `/why-spaarke/some-article`.
 */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  return (
    <header className="bg-bg border-line sticky top-0 z-50 border-b backdrop-blur-sm">
      <nav className="px-[var(--spacing-shell-x)] flex items-center justify-between gap-6 py-[21px] md:py-[26px]">
        {/* Left group: logo + page nav */}
        <div className="flex items-center gap-8 md:gap-10">
          <Link
            href={logo.href}
            className="focus-visible:ring-spaarke-blue flex-shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2"
            aria-label={logo.alt}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={186}
              height={50}
              priority
              className="h-11 w-auto md:h-12"
            />
          </Link>
          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.left.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`focus-visible:ring-spaarke-blue font-display relative rounded-sm px-1 py-1 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                      active ? "text-fg" : "text-fg-mid hover:text-fg"
                    }`}
                  >
                    {link.label}
                    {active && <NavUnderline />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right group: action links + Get access pill */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-6">
            {navLinks.right.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-display relative text-[15px] font-medium transition-colors ${
                      active ? "text-fg" : "text-fg-mid hover:text-fg"
                    }`}
                  >
                    {link.label}
                    {active && <NavUnderline />}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Compact Button — Button primitive's primary variant gives
              the rounded pill in cta-blue. Slightly tighter padding so
              it doesn't dominate the nav row vertically. */}
          <Button
            variant="primary"
            href={navCta.href}
            className="!px-5 !py-2 !text-[14px]"
          >
            {navCta.label}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="text-fg focus-visible:ring-spaarke-blue inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-line border-t md:hidden">
          <ul className="px-[var(--spacing-shell-x)] flex flex-col gap-1 py-3">
            {[...navLinks.left, ...navLinks.right].map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`focus-visible:ring-spaarke-blue font-display block rounded-md px-2 py-2 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                      active
                        ? "text-fg bg-surface border-l-2 border-cta-blue pl-3"
                        : "text-fg-mid hover:text-fg hover:bg-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-[var(--spacing-shell-x)] pb-4">
            <Button
              variant="primary"
              href={navCta.href}
              onClick={() => setMobileOpen(false)}
            >
              {navCta.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Subtle underline marker rendered beneath the active nav link. Sits
 * absolutely below the text so the surrounding label baseline
 * doesn't shift between active and inactive states. Uses cta-blue at
 * 80% so it reads as deliberate but not heavy.
 */
function NavUnderline() {
  return (
    <span
      aria-hidden="true"
      className="bg-cta-blue/80 absolute -bottom-1.5 left-1 right-1 h-[2px] rounded-full"
    />
  );
}
