"use client";

import { useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

type Preview = {
  preview: { activities: number; memberships: number; followUps: number; aliases: number };
  other: { id: string; name: string | null; email: string; organization: string | null };
};

function count(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Merge a duplicate into this contact, in two steps: look it up and show what
 * would move, then confirm.
 */
export function MergeContact({ contactId, label }: { contactId: string; label: string }) {
  const [other, setOther] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const { send, busy, error, setError } = useAdminRequest();
  const url = `/api/admin/contacts/${contactId}/merge`;

  async function lookUp(e: React.FormEvent) {
    e.preventDefault();
    setDone(null);
    const p = await send<Preview>(url, "POST", { other }, { refresh: false });
    setPreview(p);
  }

  async function confirm() {
    if (!preview) return;
    const r = await send(url, "POST", { other: preview.other.id, confirm: true });
    if (r) {
      setDone(`Merged ${preview.other.email} into ${label}.`);
      setPreview(null);
      setOther("");
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={lookUp} className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-0 flex-[1_1_14rem] flex-col gap-1 text-xs text-fg-mid">
          Duplicate contact&apos;s email
          <input
            value={other}
            onChange={(e) => {
              setOther(e.target.value);
              setPreview(null);
              setError(null);
            }}
            type="email"
            required
            className={FIELD}
          />
        </label>
        <button type="submit" className={QUIET} disabled={busy || !other.trim()}>
          Find
        </button>
      </form>
      {preview ? (
        <div className="rounded-md border border-line-strong p-3 text-sm">
          <p>
            Merge <strong>{preview.other.name ?? preview.other.email}</strong>
            {preview.other.name ? ` (${preview.other.email})` : ""}
            {preview.other.organization ? ` at ${preview.other.organization}` : ""} into {label}?
          </p>
          <p className="mt-1 text-fg-mid">
            Moves {count(preview.preview.activities, "activity", "activities")},{" "}
            {count(preview.preview.memberships, "campaign membership")} and{" "}
            {count(preview.preview.followUps, "follow-up")}. Its email becomes an alternate on this contact, and
            the duplicate is removed. This cannot be undone.
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" className={BUTTON} onClick={confirm} disabled={busy}>
              {busy ? "Merging" : "Merge"}
            </button>
            <button type="button" className={QUIET} onClick={() => setPreview(null)} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {done ? <p className="text-sm text-fg-mid">{done}</p> : null}
      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
