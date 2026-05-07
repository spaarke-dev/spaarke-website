type Props = {
  enabled: boolean;
};

/**
 * Dev/author aid: draws a 5%-step grid over the tour stage so callout
 * coordinates can be read visually instead of guessed. Only mounted when
 * `?grid=1` is present in the URL — see TourShell. Production users never
 * see it.
 *
 * Implementation note: the grid lines use a stretched SVG
 * (`preserveAspectRatio="none"`, `viewBox="0 0 100 100"`) so SVG units map
 * directly to percent-of-stage along each axis — a single `<line>` at
 * `x1=50` reaches the full stage height regardless of the stage's actual
 * aspect ratio. Labels can't share that trick (text doesn't stretch
 * gracefully), so they're rendered as absolutely-positioned `<span>`s in
 * a sibling layer instead of inside the SVG.
 */
export function CoordinateGrid({ enabled }: Props): React.ReactElement | null {
  if (!enabled) return null;

  // 0, 5, 10, …, 100 — 21 steps along each axis.
  const steps: number[] = [];
  for (let i = 0; i <= 100; i += 5) steps.push(i);

  const lightStroke = "rgba(80, 120, 220, 0.18)";
  const heavyStroke = "rgba(80, 120, 220, 0.32)";
  const labelColor = "rgba(80, 120, 220, 0.7)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {steps.map((s) => {
          const heavy = s % 10 === 0;
          const stroke = heavy ? heavyStroke : lightStroke;
          // viewBox units = % of stage, so stroke-width is also a % —
          // 0.1 ≈ a hairline, 0.18 ≈ a noticeable rule.
          const strokeWidth = heavy ? 0.18 : 0.1;
          return (
            <g key={s}>
              <line
                x1={s}
                y1={0}
                x2={s}
                y2={100}
                stroke={stroke}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={0}
                y1={s}
                x2={100}
                y2={s}
                stroke={stroke}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>
      {/* Labels — positioned in a non-stretched layer so the type stays
          legible regardless of stage aspect ratio. We skip 0 and 100 to
          avoid clipping at the edges. */}
      <div className="absolute inset-0">
        {steps
          .filter((s) => s !== 0 && s !== 100 && s % 10 === 0)
          .map((s) => (
            <span
              key={`x-${s}`}
              className="absolute -translate-x-1/2 font-mono text-[10px] leading-none"
              style={{ left: `${s}%`, top: 2, color: labelColor }}
            >
              {s}
            </span>
          ))}
        {steps
          .filter((s) => s !== 0 && s !== 100 && s % 10 === 0)
          .map((s) => (
            <span
              key={`y-${s}`}
              className="absolute -translate-y-1/2 font-mono text-[10px] leading-none"
              style={{ top: `${s}%`, left: 4, color: labelColor }}
            >
              {s}
            </span>
          ))}
      </div>
    </div>
  );
}
