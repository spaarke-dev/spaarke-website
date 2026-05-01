import type { ReactNode } from "react";

type LedeProps = {
  children: ReactNode;
  className?: string;
};

export function Lede({ children, className }: LedeProps) {
  const merged = [
    "font-body text-fg-mid text-[clamp(18px,1.4vw,25px)] leading-[1.5] tracking-[-0.005em]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <p className={merged}>{children}</p>;
}
