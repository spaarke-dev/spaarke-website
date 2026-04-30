import type { ReactNode } from "react";

type SlabProps = {
  tone: "dark" | "light";
  children: ReactNode;
  className?: string;
};

/**
 * Section background slab with vertical padding.
 * `tone="light"` sets data-tone="light" on the section so v2 fg/bg/line tokens
 * flip to light values for descendants (handled by globals.css).
 *
 * Does NOT wrap children in a Shell — sections may need full-bleed elements
 * (e.g., the hero screenshot) outside the padded shell.
 */
export function Slab({ tone, children, className }: SlabProps) {
  const merged = [
    "bg-bg text-fg py-[var(--spacing-section-y)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section data-tone={tone} className={merged}>
      {children}
    </section>
  );
}
