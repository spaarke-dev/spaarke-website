"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog";

type Props = {
  items: TocItem[];
};

/**
 * Sticky table of contents with scroll-spy highlight. Hidden on screens
 * smaller than 1024px (the article column takes priority on mobile/tablet).
 * Only renders if there are 3+ headings (caller decides).
 */
export function ArticleTOC({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when heading is in the upper portion of the viewport.
        rootMargin: "-20% 0% -65% 0%",
        threshold: 0,
      },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-fg-low font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
        On this page
      </p>
      <ul className="border-line mt-3 space-y-2 border-l">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className={item.depth === 3 ? "pl-4" : ""}>
              <a
                href={`#${item.id}`}
                className={`focus-visible:ring-spaarke-blue -ml-px block border-l-2 py-0.5 pl-3 text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  isActive
                    ? "border-spaarke-blue text-fg font-medium"
                    : "text-fg-mid hover:text-fg border-transparent"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
