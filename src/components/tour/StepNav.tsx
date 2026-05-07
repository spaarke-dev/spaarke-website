"use client";

type Props = {
  /** Zero-based step index within the active section. */
  index: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const buttonBaseClasses =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border " +
  "border-line-strong text-fg bg-surface " +
  "transition-colors hover:bg-surface-2 hover:border-fg " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spaarke-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:border-line-strong";

export function StepNav({
  index,
  total,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-disabled={!hasPrev}
        aria-label="Previous step"
        className={buttonBaseClasses}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <span
        aria-live="polite"
        className="font-display text-[15px] font-medium text-slate-700 tabular-nums"
      >
        {index + 1} of {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-disabled={!hasNext}
        aria-label="Next step"
        className={buttonBaseClasses}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
