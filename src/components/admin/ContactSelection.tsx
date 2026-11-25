"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DANGER, QUIET } from "@/components/admin/useAdminRequest";

/**
 * Row selection on the contacts list, and deleting the selected contacts for
 * good (FR-17). Each contact goes through the same DELETE route as the
 * contact page, one at a time, so the role, same-site and visibility checks
 * and the tombstones are the same. Only rows on the current page can be
 * selected: a selection is dropped when the rows change.
 */

type Selection = {
  rowIds: readonly string[];
  selected: ReadonlySet<string>;
  toggle: (id: string, on: boolean) => void;
  setAll: (on: boolean) => void;
  confirming: boolean;
  setConfirming: (on: boolean) => void;
};

const Ctx = createContext<Selection | null>(null);

function useSelection(): Selection {
  const s = useContext(Ctx);
  if (!s) throw new Error("ContactSelection components must sit inside SelectionProvider");
  return s;
}

export function SelectionProvider({ rowIds, children }: { rowIds: readonly string[]; children: ReactNode }) {
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  // Only rows still on the page count, so paging or filtering never deletes a row out of view.
  const selected = useMemo(() => new Set(rowIds.filter((id) => picked.has(id))), [rowIds, picked]);

  const value: Selection = {
    rowIds,
    selected,
    toggle: (id, on) =>
      setPicked((p) => {
        const next = new Set(p);
        if (on) next.add(id);
        else next.delete(id);
        return next;
      }),
    setAll: (on) => setPicked(on ? new Set(rowIds) : new Set()),
    confirming: confirming && selected.size > 0,
    setConfirming,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const BOX = "h-4 w-4 cursor-pointer accent-spaarke-blue";

export function RowCheckbox({ id, label }: { id: string; label: string }) {
  const s = useSelection();
  return (
    <input
      type="checkbox"
      className={BOX}
      aria-label={`Select ${label}`}
      checked={s.selected.has(id)}
      onChange={(e) => s.toggle(id, e.target.checked)}
    />
  );
}

export function SelectAllCheckbox() {
  const s = useSelection();
  const all = s.rowIds.length > 0 && s.selected.size === s.rowIds.length;
  return (
    <input
      type="checkbox"
      className={BOX}
      aria-label="Select every contact on this page"
      checked={all}
      ref={(el) => {
        if (el) el.indeterminate = s.selected.size > 0 && !all;
      }}
      onChange={(e) => s.setAll(e.target.checked)}
    />
  );
}

/** Sits to the right of Apply. Opens the confirmation below the filters. */
export function BulkDeleteButton() {
  const s = useSelection();
  const n = s.selected.size;
  return (
    <button
      type="button"
      className={QUIET}
      disabled={n === 0}
      onClick={() => s.setConfirming(true)}
      aria-expanded={s.confirming}
      aria-controls="bulk-delete"
    >
      {n ? `Delete ${n}` : "Delete"}
    </button>
  );
}

export function BulkDeletePanel() {
  const s = useSelection();
  const router = useRouter();
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!s.confirming) return null;

  const ids = [...s.selected];
  const n = ids.length;
  const busy = progress !== null;

  async function onDelete() {
    setError(null);
    let done = 0;
    for (const id of ids) {
      setProgress(done + 1);
      try {
        const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
        // Already gone counts as done: a second click or another admin got there first.
        if (!res.ok && res.status !== 404) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setError(`${done} of ${n} deleted, then it stopped: ${data.error ?? `the request failed (${res.status})`}.`);
          break;
        }
      } catch {
        setError(`${done} of ${n} deleted, then a request did not reach the server.`);
        break;
      }
      done++;
    }
    setProgress(null);
    if (done === n) {
      s.setAll(false);
      s.setConfirming(false);
    } else {
      for (const id of ids.slice(0, done)) s.toggle(id, false);
    }
    router.refresh();
  }

  return (
    <div id="bulk-delete" className="space-y-3 rounded-md border border-[#c42b1c]/40 p-3 text-sm">
      <p>
        This removes {n === 1 ? "the selected contact" : `the ${n} selected contacts`}, every activity on{" "}
        {n === 1 ? "it" : "them"}, their campaign memberships and follow-ups. A hash of each email is kept so forms,
        mail sync and imports never add them again. This cannot be undone.
      </p>
      <div className="flex gap-2">
        <button type="button" className={DANGER} onClick={onDelete} disabled={busy}>
          {busy ? `Deleting ${progress} of ${n}` : "Confirm delete"}
        </button>
        <button type="button" className={QUIET} onClick={() => s.setConfirming(false)} disabled={busy}>
          Cancel
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-[#c42b1c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
