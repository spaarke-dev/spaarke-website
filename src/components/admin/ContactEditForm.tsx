"use client";

import { useState } from "react";
import { CONTACT_KINDS, CONTACT_STAGES } from "@/lib/market/types";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

export type EditableContact = {
  id: string;
  name?: string;
  title?: string;
  linkedinUrl?: string;
  phone?: string;
  kind: string;
  stage: string;
  tags: string[];
  owner?: string;
  visibility: string;
};

function label(value: string): string {
  const s = value.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** The profile edit form. Sends only the fields that changed. */
export function ContactEditForm({ contact, canSetVisibility }: { contact: EditableContact; canSetVisibility: boolean }) {
  const [open, setOpen] = useState(false);
  const { send, busy, error } = useAdminRequest();

  if (!open) {
    return (
      <button type="button" className={QUIET} onClick={() => setOpen(true)}>
        Edit profile
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const next: Record<string, unknown> = {
      name: text("name"),
      title: text("title"),
      linkedinUrl: text("linkedinUrl"),
      phone: text("phone"),
      kind: text("kind"),
      stage: text("stage"),
      owner: text("owner"),
      tags: text("tags")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (canSetVisibility) next.visibility = text("visibility");
    const current: Record<string, unknown> = { ...contact, tags: contact.tags };
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(next)) {
      const was = current[k] ?? "";
      if (JSON.stringify(v) !== JSON.stringify(was)) patch[k] = v;
    }
    if (Object.keys(patch).length === 0) {
      setOpen(false);
      return;
    }
    if (await send(`/api/admin/contacts/${contact.id}`, "PATCH", patch)) setOpen(false);
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
      <label className={row}>
        Name
        <input name="name" defaultValue={contact.name} maxLength={200} className={FIELD} />
      </label>
      <label className={row}>
        Title
        <input name="title" defaultValue={contact.title} maxLength={200} className={FIELD} />
      </label>
      <label className={row}>
        LinkedIn URL
        <input name="linkedinUrl" type="url" defaultValue={contact.linkedinUrl} maxLength={400} className={FIELD} />
      </label>
      <label className={row}>
        Phone
        <input name="phone" type="tel" defaultValue={contact.phone} maxLength={40} className={FIELD} />
      </label>
      <label className={row}>
        Kind
        <select name="kind" defaultValue={contact.kind} className={FIELD}>
          {CONTACT_KINDS.map((k) => (
            <option key={k} value={k}>
              {label(k)}
            </option>
          ))}
        </select>
      </label>
      <label className={row}>
        Stage
        <select name="stage" defaultValue={contact.stage} className={FIELD}>
          {CONTACT_STAGES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </label>
      <label className={row}>
        Tags, separated by commas
        <input name="tags" defaultValue={contact.tags.join(", ")} className={FIELD} />
      </label>
      <label className={row}>
        Owner
        <input name="owner" defaultValue={contact.owner} maxLength={200} className={FIELD} />
      </label>
      {canSetVisibility ? (
        <label className={row}>
          Who can see this contact
          <select name="visibility" defaultValue={contact.visibility} className={FIELD}>
            <option value="general">All admins</option>
            <option value="investor">Investor role only</option>
          </select>
        </label>
      ) : null}
      <div className="flex items-end gap-2 sm:col-span-2">
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
