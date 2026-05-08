"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerContent } from "@/content/footer";
import { SocialIcon } from "@/components/SocialIcons";
import { track } from "@/lib/analytics";

function isLinkedIn(href: string): boolean {
  return /linkedin\.com/i.test(href);
}

export default function SiteFooter() {
  // partnersPanel data is intentionally unused for now — the partners
  // section was removed pending refreshed partner branding.
  const { brand, columns, socialLinks, copyright } = footerContent;
  const fromPage = usePathname() ?? "/";

  // Flatten the (currently single-column) Spaarke link list into a flat
  // horizontal row for the footer-mid nav. If we add more sections
  // later, this is the place to merge or split them.
  const flatLinks = columns.flatMap((c) => c.links);

  return (
    <footer className="bg-bg border-line text-fg-mid border-t">
      <div className="px-[var(--spacing-shell-x)] py-12 md:py-14">
        {/* Top row: brand block (left) | horizontal links (right).
            Layout uses the .footer-row CSS class in globals.css
            (auto / 1fr grid template at md+). The partners panel
            previously sat in a third column; remove that comment if
            it returns. */}
        <div className="footer-row">
          {/* Brand block */}
          <div>
            <Link
              href="/"
              className="focus-visible:ring-spaarke-blue inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2"
              aria-label={brand.wordmark.alt}
            >
              {/* Plain <img> — Next/Image was rendering this SVG at its
                  intrinsic 3832×1163 size on the footer, ignoring the
                  className-based height cap. The header doesn't have
                  this issue, but for a defensive fix in this surface we
                  render the SVG via a vanilla img. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.wordmark.src}
                alt={brand.wordmark.alt}
                style={{ height: 32, width: "auto" }}
              />
            </Link>
            {/* Render the positioning line with a break after the
                em-dash for visual rhythm. The split tolerates any
                positioning string that contains an em-dash; if the
                copy ever changes to a single phrase, no change is
                needed here. */}
            <p className="text-fg-mid mt-3 max-w-xs text-sm leading-relaxed">
              {(() => {
                const idx = brand.positioning.indexOf("—");
                if (idx === -1) return brand.positioning;
                return (
                  <>
                    {brand.positioning.slice(0, idx + 1)}
                    <br />
                    {brand.positioning.slice(idx + 1).trim()}
                  </>
                );
              })()}
            </p>
          </div>

          {/* Horizontal links — fill the middle 1fr column and spread
              the links evenly. Layout via .footer-links in globals.css
              (justify-content: space-around at md+). */}
          <nav aria-label="Footer" className="md:pt-1">
            <ul className="footer-links">
              {flatLinks.map((link) => (
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
          </nav>

        </div>

        {/* Bottom strip — copyright (left) + social icons (right). */}
        <div className="border-line mt-12 flex flex-col items-start justify-between gap-5 border-t pt-6 md:flex-row md:items-center md:gap-4">
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
