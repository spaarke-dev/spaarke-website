"use client";

import { track } from "@/lib/analytics";

export const OVERVIEW_PDF = "/design-partners/spaarke-overview.pdf";

/**
 * The overview PDF download. A plain anchor rather than the Button primitive,
 * because Button renders a next/link, which cannot carry `download`.
 * Classes mirror Button's outline variant.
 */
export function OverviewDownload({ location }: { location: "hero" | "strip" }) {
  return (
    <a
      href={OVERVIEW_PDF}
      download="Spaarke Overview.pdf"
      onClick={() => track("Overview Download", { location })}
      className="font-body border-line-strong text-fg hover:border-fg focus-visible:ring-spaarke-blue focus-visible:ring-offset-bg inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:hover:scale-[1.02]"
    >
      Download the overview (PDF)
    </a>
  );
}
