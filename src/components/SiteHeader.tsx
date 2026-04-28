"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const navLinks: { href: string; label: string }[] = [
  { href: "/platform", label: "Platform" },
  { href: "/why-spaarke", label: "Why Spaarke" },
  { href: "/blog", label: "Insights" },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Set CSS variable for header height so other components can reference it
  useEffect(() => {
    function measure() {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          "--header-h",
          `${headerRef.current.offsetHeight}px`
        );
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-border bg-background backdrop-blur-sm">
      <nav className="mx-auto flex items-center justify-between px-4 sm:px-6 md:px-[6%]" style={{ paddingTop: "clamp(0.75rem, 1.2vw, 2.5rem)", paddingBottom: "clamp(0.75rem, 1.2vw, 2.5rem)" }}>
        {/* Logo — full logo, black in light mode / white in dark mode */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo-black.svg"
            alt="Spaarke"
            width={160}
            height={42}
            priority
            className="w-auto dark:hidden"
            style={{ height: "clamp(1.5rem, 2.5vw, 5rem)" }}
          />
          <Image
            src="/images/logo-white.svg"
            alt="Spaarke"
            width={160}
            height={42}
            priority
            className="hidden w-auto dark:block"
            style={{ height: "clamp(1.5rem, 2.5vw, 5rem)" }}
          />
        </Link>

        {/* Desktop nav — left-aligned page links, right-aligned auth/CTA */}
        <div className="hidden flex-1 items-center justify-between md:flex">
          <div className="flex items-center gap-6 pl-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-foreground/80 transition-colors hover:text-foreground"
                style={{ fontSize: "clamp(0.875rem, 1vw, 1.75rem)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/signin"
              className="font-medium text-foreground/80 transition-colors hover:text-foreground"
              style={{ fontSize: "clamp(0.875rem, 1vw, 1.75rem)" }}
            >
              Sign in
            </Link>
            <Link
              href="/access-request"
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              style={{ fontSize: "clamp(0.875rem, 1vw, 1.75rem)" }}
            >
              Get access
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 pb-4 pt-2 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signin"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/access-request"
              className="block rounded-lg bg-primary px-3 py-2 text-center text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
