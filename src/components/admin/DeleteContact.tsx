"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DANGER, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

/**
 * Delete a contact for good (FR-17). The button stays disabled until the
 * contact's email is typed, so a stray click cannot remove anyone.
 */
export function DeleteContact({ contactId, email }: { contactId: string; email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const { send, busy, error } = useAdminRequest();

  if (!open) {
    return (
      <button type="button" className={QUIET} onClick={() => setOpen(true)}>
        Delete contact
      </button>
    );
  }

  const matches = typed.trim().toLowerCase() === email.toLowerCase();

  async function onDelete() {
    const r = await send(`/api/admin/contacts/${contactId}`, "DELETE", undefined, { refresh: false });
    if (r) router.replace("/admin/contacts");
  }

  return (
    <div className="space-y-3 rounded-md border border-[#c42b1c]/40 p-3 text-sm">
      <p>
        This removes the contact, every activity on it, its campaign memberships and follow-ups. A hash of the
        email is kept so forms, mail sync and imports never add the person again. This cannot be undone.
      </p>
      <label className="flex flex-col gap-1 text-xs text-fg-mid">
        Type the email to confirm
        <input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" className={FIELD} />
      </label>
      <div className="flex gap-2">
        <button type="button" className={DANGER} onClick={onDelete} disabled={!matches || busy}>
          {busy ? "Deleting" : "Delete for good"}
        </button>
        <button type="button" className={QUIET} onClick={() => setOpen(false)} disabled={busy}>
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
