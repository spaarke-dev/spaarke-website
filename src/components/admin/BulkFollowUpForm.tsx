"use client";

import { useMemo, useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";
import { matchesSelection } from "@/lib/market/followup-select";
import type { MemberStatus } from "@/lib/market/campaigns";

// A copy of MEMBER_STATUSES: campaigns.ts holds storage code that must not reach the browser.
const MEMBER_STATUSES: MemberStatus[] = ["planned", "sent", "bounced", "replied", "engaged", "meeting", "done"];

type Member = { status: MemberStatus; group?: string; tags: string[] };
type Result = { matched: number; created: number; existing: number };

function label(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * One follow-up for each member picked by status, group or tag (FR-11). The
 * count updates as the selection changes; running it again adds none.
 */
export function BulkFollowUpForm({
  slug,
  members,
  groups,
  tags,
  today,
}: {
  slug: string;
  members: Member[];
  groups: string[];
  tags: string[];
  today: string;
}) {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<MemberStatus[]>([]);
  const [group, setGroup] = useState("");
  const [tag, setTag] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const { send, busy, error } = useAdminRequest();

  const matched = useMemo(
    () => members.filter((m) => matchesSelection(m, { statuses, group: group || undefined, tag: tag || undefined })).length,
    [members, statuses, group, tag],
  );

  if (!open) {
    return (
      <button type="button" className={QUIET} onClick={() => setOpen(true)}>
        Add follow-ups
      </button>
    );
  }

  function toggle(s: MemberStatus) {
    setStatuses((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    setResult(null);
    const res = await send<Result>(`/api/admin/campaigns/${slug}/followups`, "POST", {
      title: v("title"),
      dueDate: v("dueDate"),
      notes: v("notes"),
      statuses,
      group,
      tag,
    });
    if (res) setResult(res);
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
      <label className={row}>
        Title
        <input name="title" required maxLength={200} className={FIELD} placeholder="Thank-you after the Summit" />
      </label>
      <label className={row}>
        Due
        <input name="dueDate" type="date" required defaultValue={today} className={FIELD} />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-xs text-fg-mid">Members with status (none checked means all)</legend>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {MEMBER_STATUSES.map((s) => (
            <label key={s} className="inline-flex items-center gap-1.5">
              <input type="checkbox" checked={statuses.includes(s)} onChange={() => toggle(s)} />
              {label(s)}
            </label>
          ))}
        </div>
      </fieldset>
      {groups.length ? (
        <label className={row}>
          Group
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={FIELD}>
            <option value="">Any</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {tags.length ? (
        <label className={row}>
          Contact tag
          <select value={tag} onChange={(e) => setTag(e.target.value)} className={FIELD}>
            <option value="">Any</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className={`${row} sm:col-span-2`}>
        Notes (optional)
        <textarea name="notes" rows={2} maxLength={2000} className={`${FIELD} h-auto py-2`} />
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <button type="submit" className={BUTTON} disabled={busy || matched === 0}>
          {busy ? "Adding" : `Add for ${count(matched, "member", "members")}`}
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
        <p role="status" className="text-sm sm:col-span-2">
          Added {count(result.created, "follow-up", "follow-ups")}
          {result.existing ? `; ${result.existing} of the ${result.matched} members already had this one` : ""}.
        </p>
      ) : null}
    </form>
  );
}
