"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logo, navLinks } from "@/content/nav";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-bg border-line sticky top-0 z-50 border-b backdrop-blur-sm">
      <nav className="px-[var(--spacing-shell-x)] flex items-center justify-between gap-6 py-[21px] md:py-[26px]">
        {/* Left group: logo + page nav */}
        <div className="flex items-center gap-8 md:gap-10">
          <Link href={logo.href} className="flex-shrink-0" aria-label={logo.alt}>
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
            {navLinks.left.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-mid hover:text-fg font-display text-[15px] font-medium transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right group: action links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.right.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-fg-mid hover:text-fg font-display text-[15px] font-medium transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

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
            {[...navLinks.left, ...navLinks.right].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-mid hover:text-fg font-display block rounded-md px-2 py-2 text-base font-medium transition-colors hover:bg-surface"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
