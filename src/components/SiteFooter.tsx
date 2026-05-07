"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { footerContent } from "@/content/footer";
import { SocialIcon } from "@/components/SocialIcons";
import { track } from "@/lib/analytics";

function isLinkedIn(href: string): boolean {
  return /linkedin\.com/i.test(href);
}

export default function SiteFooter() {
  const { brand, columns, partnersPanel, socialLinks, copyright } =
    footerContent;
  const fromPage = usePathname() ?? "/";

  return (
    <footer className="bg-bg border-line text-fg-mid border-t">
      <div className="px-[var(--spacing-shell-x)] py-16 md:py-20">
        {/* Top section: brand · site links · partners — balanced 3 cols
            on desktop, stacked on mobile. The brand block anchors the
            footer visually so the link column doesn't look stranded. */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Brand block */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link
              href="/"
              className="focus-visible:ring-spaarke-blue inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2"
              aria-label={brand.wordmark.alt}
            >
              <Image
                src={brand.wordmark.src}
                alt={brand.wordmark.alt}
                width={160}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-fg-mid mt-5 max-w-xs text-sm leading-relaxed">
              {brand.positioning}
            </p>
          </div>

          {/* Site links */}
          <div className="md:col-span-3 lg:col-span-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-fg font-display text-sm font-medium uppercase tracking-wider">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-fg-mid hover:text-fg focus-visible:ring-spaarke-blue rounded-sm text-sm transition-colors focus-visible:outline-none focus-visible:ring-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Our Partners panel */}
          <div className="md:col-span-4 lg:col-span-5">
            <h3 className="text-fg font-display text-sm font-medium uppercase tracking-wider">
              {partnersPanel.heading}
            </h3>
            <p className="text-fg-mid mt-4 max-w-md text-sm leading-relaxed">
              {partnersPanel.body}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
              {partnersPanel.partners.map((p) => (
                // The current Spark Labs logo is dark-on-light, so it
                // sits in a soft white pill to stay legible on the
                // dark footer. Replace the wrapper when a true white
                // version of the partner logo arrives.
                <span
                  key={p.name}
                  className="inline-flex items-center justify-center rounded-md bg-white/95 px-4 py-2"
                >
                  <Image
                    src={p.logo.src}
                    alt={p.logo.alt}
                    width={120}
                    height={44}
                    className="h-8 w-auto"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip: copyright (left) + social icon row (right). On
            mobile the social row stacks below the copyright. */}
        <div className="border-line mt-14 flex flex-col items-start justify-between gap-5 border-t pt-8 md:flex-row md:items-center md:gap-4">
          <p className="text-fg-low text-xs">{copyright}</p>
          <ul className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <Link
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={link.label}
                  onClick={
                    isLinkedIn(link.href)
                      ? () =>
                          track("Outbound Click — LinkedIn", {
                            from_page: fromPage,
                          })
                      : undefined
                  }
                  className="text-fg-mid hover:text-fg hover:bg-surface focus-visible:ring-spaarke-blue inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
                >
                  <SocialIcon platform={link.platform} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
