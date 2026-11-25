"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONTACT_KINDS } from "@/lib/market/types";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

function label(value: string): string {
  const s = value.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Add one contact by hand (phase 2 FR-02). An address that is already a
 * contact creates nothing; the form links to that contact instead.
 */
export function AddContactForm({ canInvestor }: { canInvestor: boolean }) {
  const [open, setOpen] = useState(false);
  const [existing, setExisting] = useState<{ contactId?: string } | null>(null);
  const { send, busy, error } = useAdminRequest();
  const router = useRouter();

  if (!open) {
    return (
      <button type="button" className={QUIET} onClick={() => setOpen(true)}>
        Add contact
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setExisting(null);
    const f = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    for (const [k, v] of f.entries()) if (typeof v === "string" && v.trim()) body[k] = v.trim();
    const res = await send<{ created: boolean; contactId?: string }>("/api/admin/contacts", "POST", body, { refresh: false });
    if (!res) return;
    if (res.created && res.contactId) router.push(`/admin/contacts/${res.contactId}`);
    else setExisting({ contactId: res.contactId });
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  return (
    <form onSubmit={onSubmit} className="w-full space-y-3 rounded-lg border border-line bg-surface p-4" aria-label="Add contact">
      <h2 className="text-base font-semibold">Add contact</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={row}>
          Email (required)
          <input name="email" type="email" required maxLength={254} autoComplete="off" className={FIELD} />
        </label>
        <label className={row}>
          Name
          <input name="name" maxLength={200} autoComplete="off" className={FIELD} />
        </label>
        <label className={row}>
          Job title
          <input name="title" maxLength={200} className={FIELD} />
        </label>
        <label className={row}>
          Organization
          <input name="organization" maxLength={200} className={FIELD} />
        </label>
        <label className={row}>
          LinkedIn profile
          <input name="linkedinUrl" type="url" maxLength={400} placeholder="https://www.linkedin.com/in/…" className={FIELD} />
        </label>
        <label className={row}>
          Phone
          <input name="phone" type="tel" maxLength={40} className={FIELD} />
        </label>
        <label className={row}>
          Kind
          <select name="kind" defaultValue="prospect" className={FIELD}>
            {CONTACT_KINDS.map((k) => (
              <option key={k} value={k}>
                {label(k)}
              </option>
            ))}
          </select>
        </label>
        <label className={row}>
          Who can see this contact
          <select name="visibility" defaultValue="general" className={FIELD}>
            <option value="general">All admins</option>
            {canInvestor ? <option value="investor">Investor role only</option> : null}
          </select>
        </label>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
      {existing ? (
        <p role="status" className="text-sm">
          This address already belongs to a contact, so nothing was added.{" "}
          {existing.contactId ? (
            <Link href={`/admin/contacts/${existing.contactId}`} className="font-medium underline underline-offset-2">
              Open the contact
            </Link>
          ) : null}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BUTTON} disabled={busy}>
          {busy ? "Adding" : "Add contact"}
        </button>
        <button type="button" className={QUIET} disabled={busy} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
