import Link from "next/link";
import { ArrowLeft20Regular, ArrowRight20Regular } from "@/components/admin/icons";

/** Previous and next links that keep the current filters. */
export function Pager({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  const linkClass = "inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-surface-2";
  return (
    <nav aria-label="Pages" className="flex items-center justify-between gap-4 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass}>
          <ArrowLeft20Regular aria-hidden /> Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-fg-mid">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} className={linkClass}>
          Next <ArrowRight20Regular aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
