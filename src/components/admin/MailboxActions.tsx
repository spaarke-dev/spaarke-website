"use client";

import { useState } from "react";
import { DANGER, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

const SMALL = "h-8 px-3 text-xs";

/** Pause or resume, check access, and remove one mailbox. */
export function MailboxActions({ id, address, enabled }: { id: string; address: string; enabled: boolean }) {
  const { send, busy, error } = useAdminRequest();
  const [result, setResult] = useState<string | null>(null);
  const url = `/api/admin/mailboxes/${id}`;

  async function onCheck() {
    setResult(null);
    const r = await send<{ ok: boolean; error?: string }>(`${url}/check`, "POST");
    if (r) setResult(r.ok ? "Graph can read this mailbox." : r.error ?? "Graph cannot read this mailbox.");
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
