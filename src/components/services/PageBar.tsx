"use client";

import { useEffect, useRef, useState } from "react";
import { AudienceSwitch } from "./audience";

type Anchor = { id: string; label: string };

/**
 * Sticky bar under the site header (design.md section 3): section anchors,
 * the audience switch and the primary CTA. It measures the site header so it
 * sits directly beneath it, and publishes the combined height as
 * --services-offset so anchored sections are not hidden under both bars.
 */
export function PageBar({
  anchors,
  cta,
}: {
  anchors: Anchor[];
  cta: { label: string; href: string };
}) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(0);
  const [active, setActive] = useState<string | null>(null);

  // Track the site header's height (it changes at the md breakpoint).
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const bar = barRef.current;
    if (!header || !bar) return;
    const update = () => {
      const h = header.getBoundingClientRect().height;
      setTop(h);
      document.documentElement.style.setProperty(
        "--services-offset",
        `${Math.round(h + bar.getBoundingClientRect().height + 16)}px`,
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    ro.observe(bar);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--services-offset");
    };
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = anchors
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [anchors]);

  return (
    <div
      ref={barRef}
      data-tone="dark"
      className="bg-bg/95 border-line sticky z-40 border-b backdrop-blur-md"
      style={{ top }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-[var(--spacing-shell-x)] py-2.5">
        <nav aria-label="On this page" className="hidden min-w-0 flex-1 xl:block">
          <ul className="flex items-center gap-1">
            {anchors.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  aria-current={active === a.id ? "location" : undefined}
                  className={`font-body block whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82A5EB] ${
                    active === a.id ? "bg-surface-2 text-fg" : "text-fg-mid hover:text-fg"
                  }`}
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-1 items-center justify-between gap-3 xl:flex-none xl:justify-end">
          <AudienceSwitch />
          <a
            href={cta.href}
            className="font-body hidden rounded-full bg-[#5078DC] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#3F5FD9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82A5EB] sm:inline-flex"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </div>
  );
}
