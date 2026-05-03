import type { ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "outline" | "text";

type ButtonProps = {
  variant: ButtonVariant;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  arrow?: boolean;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

const baseClasses =
  "group inline-flex items-center gap-2 font-body text-sm font-medium " +
  "transition-all motion-safe:hover:scale-[1.02] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spaarke-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  // Primary CTA blue from the hero glow / fade palette (#5078DC),
  // hover deepens to #3F5FD9. Both via Tailwind arbitrary values so
  // the rule always compiles regardless of custom-token state.
  primary:
    "bg-[#5078DC] hover:bg-[#3F5FD9] text-white rounded-full px-6 py-3",
  outline:
    "border border-line-strong text-fg rounded-full px-6 py-3 hover:border-fg",
  // Soft glow-blue hover instead of bright pure spaarke-blue
  text: "text-fg px-2 py-3 hover:text-[#82A5EB]",
};

export function Button({
  variant,
  children,
  href,
  onClick,
  type = "button",
  arrow,
  className,
  ariaLabel,
  disabled,
}: ButtonProps) {
  const merged = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={merged} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={merged}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {inner}
    </button>
  );
}
