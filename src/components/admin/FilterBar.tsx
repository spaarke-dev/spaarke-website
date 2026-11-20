import Link from "next/link";
import { Search20Regular } from "@/components/admin/icons";

export type FilterSelect = {
  name: string;
  label: string;
  value?: string;
  options: readonly { value: string; label: string }[];
};

const FIELD =
  "h-9 rounded-md border border-line-strong bg-surface px-2 text-sm text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-spaarke-blue";

/**
 * Search box and filters as a plain GET form, so a filtered list has its own
 * URL and works without client JavaScript.
 */
export function FilterBar({
  action,
  q,
  searchLabel,
  selects,
}: {
  action: string;
  q?: string;
  searchLabel: string;
  selects: readonly FilterSelect[];
}) {
  const active = Boolean(q) || selects.some((s) => s.value);
  return (
    <form action={action} method="get" role="search" className="flex flex-wrap items-end gap-2">
      <label className="flex min-w-0 flex-[1_1_16rem] flex-col gap-1 text-xs text-fg-mid">
        {searchLabel}
        <span className="relative">
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-fg-low" aria-hidden>
            <Search20Regular />
          </span>
          <input type="search" name="q" defaultValue={q} className={`${FIELD} w-full pl-8`} />
        </span>
      </label>
      {selects.map((s) => (
        <label key={s.name} className="flex flex-[1_1_8rem] flex-col gap-1 text-xs text-fg-mid sm:flex-none">
          {s.label}
          <select name={s.name} defaultValue={s.value ?? ""} className={FIELD}>
            <option value="">All</option>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <div className="flex gap-2">
        <button
          type="submit"
          className="h-9 rounded-md bg-spaarke-blue px-4 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-spaarke-blue focus-visible:ring-offset-2"
        >
          Apply
        </button>
        {active ? (
          <Link href={action} className="flex h-9 items-center px-2 text-sm text-fg-mid hover:underline">
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}
