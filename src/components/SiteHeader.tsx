"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      setScrollProgress(Math.min(1, window.scrollY / 350));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo — crossfade from wordmark-only to full logo on scroll */}
        <Link href="/" className="relative flex-shrink-0">
          {/* Wordmark only — visible at top, fades out on scroll */}
          <Image
            src="/images/logo-wordmark-color.svg"
            alt="Spaarke"
            width={120}
            height={36}
            priority
            className="h-8 w-auto sm:h-10 dark:hidden"
            style={{ opacity: 1 - scrollProgress }}
          />
          <Image
            src="/images/logo-wordmark-white.svg"
            alt="Spaarke"
            width={120}
            height={36}
            priority
            className="hidden h-8 w-auto sm:h-10 dark:block"
            style={{ opacity: 1 - scrollProgress }}
          />
          {/* Full logo (icon + wordmark) — fades in on scroll, sized so text matches wordmark */}
          <Image
            src="/images/logo-color.svg"
            alt="Spaarke"
            width={160}
            height={42}
            priority
            className="absolute left-0 top-1/2 h-9 w-auto -translate-y-1/2 sm:h-11 dark:hidden"
            style={{ opacity: scrollProgress }}
          />
          <Image
            src="/images/logo-white.svg"
            alt="Spaarke"
            width={160}
            height={42}
            priority
            className="absolute left-0 top-1/2 hidden h-9 w-auto -translate-y-1/2 sm:h-11 dark:block"
            style={{ opacity: scrollProgress }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/signin"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <ThemeToggle />
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
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
