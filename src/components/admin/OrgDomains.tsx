"use client";

import { useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

type Result = { domain: string; moved: number; removedOrganization?: string };

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * The organization's domains: its own, and others pointed at it by an
 * override. Adding a domain moves that domain's contacts here; removing one
 * sends them back to an organization of their own.
 */
export function OrgDomains({
  orgId,
  ownDomain,
  otherDomains,
  suggestions,
}: {
  orgId: string;
  ownDomain?: string;
  otherDomains: string[];
  /** Domains of other organizations, offered while typing. */
  suggestions: string[];
}) {
  const { send, busy, error } = useAdminRequest();
  const [done, setDone] = useState<string | null>(null);
  const url = `/api/admin/organizations/${encodeURIComponent(orgId)}/domains`;

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const domain = String(new FormData(form).get("domain") ?? "").trim();
    if (!domain) return;
    setDone(null);
    const r = await send<Result>(url, "POST", { domain });
    if (r) {
      form.reset();
      setDone(
        `${r.domain} now belongs here. ${plural(r.moved, "contact", "contacts")} moved.` +
          (r.removedOrganization ? ` The organization "${r.removedOrganization}" was folded in.` : ""),
      );
    }
  }

  async function onRemove(domain: string) {
    if (!window.confirm(`Stop pointing ${domain} here? Its contacts go back to an organization of their own.`)) return;
    setDone(null);
    const r = await send<Result>(url, "DELETE", { domain });
    if (r) setDone(`${r.domain} removed. ${plural(r.moved, "contact", "contacts")} moved back.`);
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-1 text-sm">
        {ownDomain ? (
          <li className="flex flex-wrap items-center justify-between gap-2">
            <span className="break-all">{ownDomain}</span>
            <span className="text-xs text-fg-mid">Its own domain</span>
          </li>
        ) : null}
        {otherDomains.map((d) => (
          <li key={d} className="flex flex-wrap items-center justify-between gap-2">
            <span className="break-all">{d}</span>
            <button type="button" className={`${QUIET} h-7 px-2 text-xs`} onClick={() => onRemove(d)} disabled={busy}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={onAdd} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-fg-mid">
          Add a domain; its contacts move here
          <input
            name="domain"
            list={`domains-${orgId}`}
            placeholder="example.com"
            maxLength={253}
            autoComplete="off"
            className={FIELD}
          />
          <datalist id={`domains-${orgId}`}>
            {suggestions.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </label>
        <button type="submit" className={BUTTON} disabled={busy}>
          {busy ? "Moving" : "Add domain"}
        </button>
      </form>
      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
      {done ? (
        <p role="status" className="text-sm text-fg-mid">
          {done}
        </p>
      ) : null}
    </div>
  );
}
