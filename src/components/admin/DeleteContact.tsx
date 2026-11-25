"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DANGER, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

/**
 * Delete a contact for good (FR-17). The first click only opens the warning;
 * the contact goes on a second, separate click.
 */
export function DeleteContact({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { send, busy, error } = useAdminRequest();

  if (!open) {
    return (
      <button type="button" className={QUIET} onClick={() => setOpen(true)}>
        Delete contact
      </button>
    );
  }

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
      <div className="flex gap-2">
        <button type="button" className={DANGER} onClick={onDelete} disabled={busy}>
          {busy ? "Deleting" : "Confirm delete"}
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
