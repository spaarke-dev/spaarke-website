import type { ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Page-width container with fluid horizontal padding.
 * Padding scales clamp(24px, 6vw, 120px) — see --spacing-shell-x in globals.css.
 * No max-width by default; sections can constrain inner content explicitly.
 */
export function Shell({ children, className }: ShellProps) {
  const merged = ["px-[var(--spacing-shell-x)]", className]
    .filter(Boolean)
    .join(" ");

  return <div className={merged}>{children}</div>;
}
