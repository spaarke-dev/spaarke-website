"use client";

import { useState } from "react";
import { Badge } from "@/components/admin/Badge";
import { FollowUpStatus } from "@/components/admin/FollowUpStatus";
import { WriteInOutlook } from "@/components/admin/WriteInOutlook";
import { BUTTON, DANGER, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

export type FollowUpView = {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  notes?: string;
  campaignSlug?: string;
  campaignName?: string;
  closedAt?: string;
};

const OPEN = new Set(["todo", "drafted"]);

function day(d: string): string {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** A contact's follow-ups, with add, edit, status and delete (FR-11). */
export function ContactFollowUps({
  contactId,
  email,
  followUps,
  campaigns,
  today,
}: {
  contactId: string;
  /** The contact's address, for Write in Outlook on open follow-ups (phase 2 FR-11). */
  email?: string;
  followUps: FollowUpView[];
  /** The contact's campaigns, to link a new follow-up to one. */
  campaigns: { slug: string; name: string }[];
  /** YYYY-MM-DD in the host's zone. */
  today: string;
}) {
  const [adding, setAdding] = useState(false);
  const { send, busy, error } = useAdminRequest();
  const row = "flex flex-col gap-1 text-xs text-fg-mid";

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const ok = await send(`/api/admin/contacts/${contactId}/followups`, "POST", {
      title: v("title"),
      dueDate: v("dueDate"),
      notes: v("notes"),
      campaignSlug: v("campaignSlug"),
    });
    if (ok) setAdding(false);
  }

  return (
    <div className="space-y-3">
      {adding ? (
        <form onSubmit={onAdd} className="grid gap-3 rounded-lg border border-line bg-surface p-4">
          <label className={row}>
            Title
            <input name="title" required maxLength={200} className={FIELD} placeholder="Thank-you after the Summit" />
          </label>
          <label className={row}>
            Due
            <input name="dueDate" type="date" required defaultValue={today} className={FIELD} />
          </label>
          {campaigns.length ? (
            <label className={row}>
              Campaign (optional)
              <select name="campaignSlug" defaultValue="" className={FIELD}>
                <option value="">None</option>
                {campaigns.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className={row}>
            Notes (optional)
            <textarea name="notes" rows={3} maxLength={2000} className={`${FIELD} h-auto py-2`} />
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <button type="submit" className={BUTTON} disabled={busy}>
              {busy ? "Adding" : "Add"}
            </button>
            <button type="button" className={QUIET} onClick={() => setAdding(false)} disabled={busy}>
              Cancel
            </button>
            {error ? (
              <p role="alert" className="text-sm text-[#c42b1c]">
                {error}
              </p>
            ) : null}
          </div>
        </form>
      ) : (
        <button type="button" className={QUIET} onClick={() => setAdding(true)}>
          Add follow-up
        </button>
      )}

      {followUps.length ? (
        <ul className="space-y-2">
          {followUps.map((f) => (
            <Item key={`${f.id}-${f.status}-${f.dueDate}-${f.title}`} contactId={contactId} email={email} f={f} today={today} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-fg-mid">No follow-ups.</p>
      )}
    </div>
  );
}

function Item({ contactId, email, f, today }: { contactId: string; email?: string; f: FollowUpView; today: string }) {
  const [editing, setEditing] = useState(false);
  const { send, busy, error } = useAdminRequest();
  const open = OPEN.has(f.status);
  const overdue = open && f.dueDate < today;
  const url = `/api/admin/contacts/${contactId}/followups/${f.id}`;
  const row = "flex flex-col gap-1 text-xs text-fg-mid";

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const patch: Record<string, string> = {};
    if (v("title") !== f.title) patch.title = v("title");
    if (v("dueDate") !== f.dueDate) patch.dueDate = v("dueDate");
    if (v("notes") !== (f.notes ?? "")) patch.notes = v("notes");
    if (!Object.keys(patch).length) {
      setEditing(false);
      return;
    }
    if (await send(url, "PATCH", patch)) setEditing(false);
  }

  return (
    <li className={`rounded-lg border border-line bg-surface p-3 text-sm ${open ? "" : "opacity-75"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <div className="font-medium">{f.title}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-fg-mid">
            <span>Due {day(f.dueDate)}</span>
            {overdue ? <Badge tone="amber">Overdue</Badge> : null}
            {f.campaignName || f.campaignSlug ? <span>{f.campaignName ?? f.campaignSlug}</span> : null}
          </div>
          {open && email ? (
            <div className="mt-1">
              <WriteInOutlook email={email} title={f.title} />
            </div>
          ) : null}
        </div>
        <FollowUpStatus contactId={contactId} id={f.id} status={f.status} title={f.title} />
      </div>
      {f.notes && !editing ? <p className="mt-2 whitespace-pre-line text-xs [overflow-wrap:anywhere]">{f.notes}</p> : null}
      {editing ? (
        <form onSubmit={onSave} className="mt-3 grid gap-3">
          <label className={row}>
            Title
            <input name="title" required maxLength={200} defaultValue={f.title} className={FIELD} />
          </label>
          <label className={row}>
            Due
            <input name="dueDate" type="date" required defaultValue={f.dueDate} className={FIELD} />
          </label>
          <label className={row}>
            Notes
            <textarea name="notes" rows={3} maxLength={2000} defaultValue={f.notes} className={`${FIELD} h-auto py-2`} />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className={BUTTON} disabled={busy}>
              Save
            </button>
            <button type="button" className={QUIET} onClick={() => setEditing(false)} disabled={busy}>
              Cancel
            </button>
            <button
              type="button"
              className={DANGER}
              disabled={busy}
              onClick={() => {
                if (window.confirm(`Delete the follow-up "${f.title}"?`)) void send(url, "DELETE");
              }}
            >
              Delete
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="mt-2 text-xs text-fg-mid hover:underline" onClick={() => setEditing(true)}>
          Edit
        </button>
      )}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-[#c42b1c]">
          {error}
        </p>
      ) : null}
    </li>
  );
}
