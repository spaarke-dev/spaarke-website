import type { ReactNode } from "react";
import { Eyebrow, Heading, Lede } from "./index";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  className?: string;
};

/**
 * Standard page header for content pages — eyebrow + H1 + lede block.
 * Use inside a Slab + Shell for consistent vertical rhythm.
 */
export function PageHeader({ eyebrow, title, lede, className }: PageHeaderProps) {
  const merged = ["max-w-3xl", className].filter(Boolean).join(" ");

  return (
    <div className={merged}>
      {eyebrow && (
        <div className="mb-5">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <Heading level={1}>{title}</Heading>
      {lede && (
        <div className="mt-6 max-w-2xl">
          <Lede>{lede}</Lede>
        </div>
      )}
    </div>
  );
}
