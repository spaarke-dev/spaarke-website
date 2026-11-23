"use client";

import { useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

export type EditableMailbox = {
  id: string;
  address: string;
  label: string;
  kind: string;
  mode: string;
  visibility: string;
};

const KINDS = [
  ["personal", "Personal"],
  ["shared", "Shared (team inbox)"],
] as const;

const MODES = [
  ["known-only", "Known contacts only"],
  ["capture-new", "Known contacts, and queue new senders for triage"],
] as const;

/**
 * Register a mailbox, or edit one when `mailbox` is given. The address is set
 * once. Choosing a kind on a new mailbox picks the usual mode for it.
 */
export function MailboxForm({ mailbox, canSetVisibility }: { mailbox?: EditableMailbox; canSetVisibility: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(mailbox?.mode ?? "known-only");
  const { send, busy, error } = useAdminRequest();
  const editing = Boolean(mailbox);

  if (!open) {
    return (
      <button type="button" className={editing ? `${QUIET} h-8 px-3 text-xs` : BUTTON} onClick={() => setOpen(true)}>
        {editing ? "Edit" : "Add mailbox"}
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const next: Record<string, string> = { label: text("label"), kind: text("kind"), mode };
    if (canSetVisibility) next.visibility = text("visibility");

    if (!mailbox) {
      if (await send("/api/admin/mailboxes", "POST", { address: text("address"), ...next })) setOpen(false);
      return;
    }
    const current = mailbox as Record<string, unknown>;
    const patch: Record<string, string> = {};
    for (const [k, v] of Object.entries(next)) if (v !== String(current[k] ?? "")) patch[k] = v;
    if (Object.keys(patch).length === 0) {
      setOpen(false);
      return;
    }
    if (await send(`/api/admin/mailboxes/${mailbox.id}`, "PATCH", patch)) setOpen(false);
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
      {editing ? null : (
        <label className={row}>
          Mailbox address
          <input name="address" type="email" required maxLength={254} autoComplete="off" className={FIELD} placeholder="name@spaarke.com" />
        </label>
      )}
      <label className={row}>
        Label
        <input name="label" defaultValue={mailbox?.label} maxLength={100} className={FIELD} placeholder="Shown on this page and on activities" />
      </label>
      <label className={row}>
        Kind
        <select
          name="kind"
          defaultValue={mailbox?.kind ?? "personal"}
          className={FIELD}
          onChange={(e) => {
            if (!editing) setMode(e.target.value === "shared" ? "capture-new" : "known-only");
          }}
        >
          {KINDS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className={row}>
        What to log
        <select name="mode" value={mode} onChange={(e) => setMode(e.target.value)} className={FIELD}>
          {MODES.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      {canSetVisibility ? (
        <label className={row}>
          Who can see contacts it creates
          <select name="visibility" defaultValue={mailbox?.visibility ?? "general"} className={FIELD}>
            <option value="general">All admins</option>
            <option value="investor">Investor role only</option>
          </select>
        </label>
      ) : null}
      <p className="text-xs text-fg-mid sm:col-span-2">
        {mode === "capture-new"
          ? "Mail with known contacts is logged. Mail from a new sender waits in triage until you accept or dismiss it; mail this mailbox sends to an unknown address is ignored."
          : "Only mail with people who are already contacts is logged. Everything else is ignored and never stored."}
      </p>
      <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
        <button type="submit" className={BUTTON} disabled={busy}>
          {busy ? "Saving" : editing ? "Save" : "Add"}
        </button>
        <button type="button" className={QUIET} onClick={() => setOpen(false)} disabled={busy}>
          Cancel
        </button>
        {error ? (
          <p role="alert" className="text-sm text-[#c42b1c]">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
