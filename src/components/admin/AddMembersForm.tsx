"use client";

import { useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

type Result = { added: number; updated: number; notFound: string[] };

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Add existing contacts to a campaign by email, one per line. */
export function AddMembersForm({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const { send, busy, error } = useAdminRequest();

  if (!open) {
    return (
      <button type="button" className={QUIET} onClick={() => setOpen(true)}>
        Add members
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    setResult(null);
    const res = await send<Result>(`/api/admin/campaigns/${slug}/members`, "POST", {
      contacts: text("contacts"),
      group: text("group"),
      templateLabel: text("templateLabel"),
    });
    if (res) {
      setResult(res);
      if (!res.notFound.length) form.reset();
    }
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
      <label className={`${row} sm:col-span-2`}>
        Emails of existing contacts, one per line
        <textarea name="contacts" required rows={5} className={`${FIELD} h-auto py-2 font-mono`} />
      </label>
      <label className={row}>
        Group (optional)
        <input name="group" maxLength={100} className={FIELD} />
      </label>
      <label className={row}>
        Template label (optional)
        <input name="templateLabel" maxLength={100} className={FIELD} />
      </label>
      <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
        <button type="submit" className={BUTTON} disabled={busy}>
          {busy ? "Adding" : "Add"}
        </button>
        <button type="button" className={QUIET} onClick={() => setOpen(false)} disabled={busy}>
          Close
        </button>
        {error ? (
          <p role="alert" className="text-sm text-[#c42b1c]">
            {error}
          </p>
        ) : null}
      </div>
      {result ? (
        <div role="status" className="text-sm sm:col-span-2">
          <p>
            Added {count(result.added, "member", "members")}
            {result.updated ? `, updated ${count(result.updated, "existing member", "existing members")}` : ""}.
          </p>
          {result.notFound.length ? (
            <div className="mt-2">
              <p className="text-fg-mid">
                No contact found for {count(result.notFound.length, "entry", "entries")}. A person must be a contact before
                they can join a campaign.
              </p>
              <ul className="mt-1 list-inside list-disc font-mono text-xs [overflow-wrap:anywhere]">
                {result.notFound.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
