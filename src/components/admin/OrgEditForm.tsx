"use client";

import { useState } from "react";
import { CONTACT_KINDS } from "@/lib/market/types";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

export type EditableOrg = {
  id: string;
  name: string;
  website?: string;
  kind?: string;
  notes?: string;
  visibility: string;
};

function label(value: string): string {
  const s = value.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** The organization edit form. Sends only the fields that changed. */
export function OrgEditForm({ org, canSetVisibility }: { org: EditableOrg; canSetVisibility: boolean }) {
  const [open, setOpen] = useState(false);
  const { send, busy, error } = useAdminRequest();

  if (!open) {
    return (
      <button type="button" className={QUIET} onClick={() => setOpen(true)}>
        Edit organization
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const next: Record<string, string> = {
      name: text("name"),
      website: text("website"),
      kind: text("kind"),
      notes: text("notes"),
    };
    if (canSetVisibility) next.visibility = text("visibility");
    const current = org as Record<string, unknown>;
    const patch: Record<string, string> = {};
    for (const [k, v] of Object.entries(next)) if (v !== (current[k] ?? "")) patch[k] = v;
    if (Object.keys(patch).length === 0) {
      setOpen(false);
      return;
    }
    if (await send(`/api/admin/organizations/${encodeURIComponent(org.id)}`, "PATCH", patch)) setOpen(false);
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
      <label className={row}>
        Name
        <input name="name" required defaultValue={org.name} maxLength={200} className={FIELD} />
      </label>
      <label className={row}>
        Website
        <input name="website" type="url" defaultValue={org.website} maxLength={400} placeholder="https://" className={FIELD} />
      </label>
      <label className={row}>
        Kind
        <select name="kind" defaultValue={org.kind ?? ""} className={FIELD}>
          <option value="">Not set</option>
          {CONTACT_KINDS.map((k) => (
            <option key={k} value={k}>
              {label(k)}
            </option>
          ))}
        </select>
      </label>
      {canSetVisibility ? (
        <label className={row}>
          Who can see this organization
          <select name="visibility" defaultValue={org.visibility} className={FIELD}>
            <option value="general">All admins</option>
            <option value="investor">Investor role only</option>
          </select>
        </label>
      ) : null}
      <label className={`${row} sm:col-span-2`}>
        Notes
        <textarea
          name="notes"
          defaultValue={org.notes}
          maxLength={2000}
          rows={4}
          className={`${FIELD} h-auto py-2`}
        />
      </label>
      <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
        <button type="submit" className={BUTTON} disabled={busy}>
          {busy ? "Saving" : "Save"}
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
