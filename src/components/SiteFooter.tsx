"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { footerContent } from "@/content/footer";
import { Button } from "@/components/primitives";
import { track } from "@/lib/analytics";
import type { PlausibleEventName } from "@/types/plausible";

const CTA_EVENTS: Record<string, PlausibleEventName> = {
  "/access-request": "CTA Click — Get Access",
  "/contact": "CTA Click — Contact Us",
  "/platform": "CTA Click — See Platform",
};

function isLinkedIn(href: string): boolean {
  return /linkedin\.com/i.test(href);
}

export default function SiteFooter() {
  const { columns, ctaPanel, bottomStrip } = footerContent;
  const fromPage = usePathname() ?? "/";
  const ctaEvent = CTA_EVENTS[ctaPanel.cta.href];

  return (
    <footer className="bg-bg border-line text-fg-mid border-t">
      <div className="px-[var(--spacing-shell-x)] py-16 md:py-20">
        {/* Columns + CTA panel */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
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

          {/* CTA panel */}
          <div className="md:col-span-1">
            <h3 className="text-fg font-display text-sm font-medium uppercase tracking-wider">
              {ctaPanel.heading}
            </h3>
            <p className="text-fg-mid mt-4 text-sm leading-relaxed">
              {ctaPanel.body}
            </p>
            <div className="mt-5">
              <Button
                variant="primary"
                href={ctaPanel.cta.href}
                onClick={
                  ctaEvent
                    ? () => track(ctaEvent, { from_page: fromPage })
                    : undefined
                }
              >
                {ctaPanel.cta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-line mt-16 flex flex-col items-start justify-between gap-4 border-t pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Image
              src={bottomStrip.wordmark.src}
              alt={bottomStrip.wordmark.alt}
              width={100}
              height={28}
              className="h-6 w-auto"
            />
            <span className="text-fg-low text-xs">
              {bottomStrip.copyright}
            </span>
          </div>
          <ul className="flex items-center gap-4">
            {bottomStrip.socialLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-mid hover:text-fg text-sm transition-colors"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={
                    isLinkedIn(link.href)
                      ? () =>
                          track("Outbound Click — LinkedIn", {
                            from_page: fromPage,
                          })
                      : undefined
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
