import type { ReactNode } from "react";

/** Shown in place of a list with nothing in it. */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong px-4 py-8 text-center">
      <p className="font-medium">{title}</p>
      {children ? <div className="mt-1 text-sm text-fg-mid">{children}</div> : null}
    </div>
  );
}
