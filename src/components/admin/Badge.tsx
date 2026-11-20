import type { ReactNode } from "react";

type Tone = "neutral" | "blue" | "amber";

const TONES: Record<Tone, string> = {
  neutral: "border-line-strong text-fg-mid",
  blue: "border-spaarke-blue/40 text-spaarke-blue",
  amber: "border-warning/60 text-[#8a4f00]",
};

/** A small outlined label: kind, stage, tag, visibility. */
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
