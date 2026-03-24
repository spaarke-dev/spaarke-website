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
      const progress = Math.min(1, window.scrollY / 350);
      setScrollProgress(progress);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo — laser icon flies up from hero on scroll */}
        <Link href="/" className="flex flex-shrink-0 items-center gap-0.5">
          {/* Laser icon — slides up from below and fades in */}
          <div
            className="overflow-hidden"
            style={{
              width: scrollProgress > 0.1 ? 36 : 0,
              opacity: Math.max(0, (scrollProgress - 0.3) / 0.7),
              transform: `translateY(${(1 - scrollProgress) * 20}px)`,
              transition: "width 0.3s ease-out",
            }}
          >
            <Image
              src="/images/hero/laser-logo.png"
              alt=""
              width={36}
              height={28}
              className="h-8 w-auto sm:h-9"
              aria-hidden="true"
            />
          </div>
          {/* Wordmark — always visible */}
          <Image
            src="/images/logo-wordmark-color.svg"
            alt="Spaarke"
            width={120}
            height={36}
            priority
            className="h-8 w-auto sm:h-10 dark:hidden"
          />
          <Image
            src="/images/logo-wordmark-white.svg"
            alt="Spaarke"
            width={120}
            height={36}
            priority
            className="hidden h-8 w-auto sm:h-10 dark:block"
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
