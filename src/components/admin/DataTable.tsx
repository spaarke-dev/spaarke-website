import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Extra classes for both header and cell, for example `hidden md:table-cell`. */
  className?: string;
};

/**
 * A plain table for admin lists. Columns that matter less are hidden on narrow
 * screens through their className, so a list stays readable on a phone.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  caption,
}: {
  rows: readonly T[];
  columns: readonly Column<T>[];
  rowKey: (row: T) => string;
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-fg-mid">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`px-3 py-2 font-medium ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-line bg-surface align-top">
              {columns.map((c) => (
                <td key={c.key} className={`px-3 py-2 ${c.className ?? ""}`}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
