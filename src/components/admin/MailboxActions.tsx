"use client";

import { useState } from "react";
import { DANGER, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

const SMALL = "h-8 px-3 text-xs";

/** Pause or resume, check access, read again from a date, and remove one mailbox. */
export function MailboxActions({ id, address, enabled }: { id: string; address: string; enabled: boolean }) {
  const { send, busy, error } = useAdminRequest();
  const [result, setResult] = useState<string | null>(null);
  const url = `/api/admin/mailboxes/${id}`;

  async function onCheck() {
    setResult(null);
    const r = await send<{ ok: boolean; error?: string }>(`${url}/check`, "POST");
    if (r) setResult(r.ok ? "Graph can read this mailbox." : r.error ?? "Graph cannot read this mailbox.");
  }

  async function onReread(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const from = String(new FormData(e.currentTarget).get("from") ?? "");
    const r = await send<{ ok: boolean; folders: string[] }>(`${url}/reread`, "POST", { from });
    if (r) {
      setResult(
        r.folders.length
          ? `The next sync reads this mailbox again from ${from}. Mail already logged is skipped.`
          : `This mailbox is already reading from ${from} or earlier.`,
      );
    }
  }

  async function onRemove() {
    if (
      !window.confirm(
        `Remove ${address} from the sync? Activities already logged from it stay. Exchange access is not changed; remove it from the "Market access sync" group separately.`,
      )
    )
      return;
    await send(url, "DELETE");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${QUIET} ${SMALL}`} disabled={busy} onClick={() => send(url, "PATCH", { enabled: !enabled })}>
          {enabled ? "Pause" : "Resume"}
        </button>
        <button type="button" className={`${QUIET} ${SMALL}`} disabled={busy} onClick={onCheck}>
          {busy ? "Working" : "Check access"}
        </button>
        <button type="button" className={`${DANGER} ${SMALL}`} disabled={busy} onClick={onRemove}>
          Remove
        </button>
      </div>
      <form onSubmit={onReread} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs text-fg-mid">
          Read again from
          <input name="from" type="date" required className={`${FIELD} h-8 text-xs`} />
        </label>
        <button type="submit" className={`${QUIET} ${SMALL}`} disabled={busy}>
          Read again
        </button>
      </form>
      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
      {result ? (
        <p role="status" className="text-sm text-fg-mid">
          {result}
        </p>
      ) : null}
    </div>
  );
}
