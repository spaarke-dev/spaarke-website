/** Compact dollar figures for the calculator: $1.50M, $12.5M, $480K. */
export const money = (v: number) => {
  const a = Math.abs(v);
  const s =
    a >= 1_000_000
      ? `$${(a / 1_000_000).toFixed(a >= 10_000_000 ? 1 : 2)}M`
      : a < 500
        ? "$0"
        : `$${Math.round(a / 1000)}K`;
  return v < 0 ? `-${s}` : s;
};
