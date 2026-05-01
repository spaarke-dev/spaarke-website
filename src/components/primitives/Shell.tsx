import type { ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Page-width container with fluid horizontal padding and a sane max-width
 * so content stays readable on large displays (1440px cap, centered).
 * Padding scales clamp(24px, 6vw, 120px) — see --spacing-shell-x in globals.css.
 * Sections that need to be wider (full-bleed hero screenshots, etc.) should
 * skip Shell and use the padding token directly.
 */
export function Shell({ children, className }: ShellProps) {
  const merged = [
    "mx-auto max-w-[1440px] px-[var(--spacing-shell-x)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={merged}>{children}</div>;
}
