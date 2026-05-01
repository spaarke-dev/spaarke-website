import type { ReactNode } from "react";

type HeadingProps = {
  level: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
};

const sizeClasses: Record<1 | 2 | 3, string> = {
  1: "text-[clamp(48px,7.5vw,104px)] leading-[0.98] tracking-[-0.035em]",
  2: "text-[clamp(34px,4.5vw,64px)] leading-[1.05] tracking-[-0.025em]",
  3: "text-[clamp(20px,1.6vw,30px)] leading-[1.2] tracking-[-0.015em]",
};

export function Heading({ level, children, className }: HeadingProps) {
  const merged = [
    "font-display font-medium text-fg",
    sizeClasses[level],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (level === 1) return <h1 className={merged}>{children}</h1>;
  if (level === 2) return <h2 className={merged}>{children}</h2>;
  return <h3 className={merged}>{children}</h3>;
}
