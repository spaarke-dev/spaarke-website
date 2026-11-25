"use client";

import { useState } from "react";
import { BUTTON, FIELD, QUIET } from "@/components/admin/useAdminRequest";
import { linksCsv, type MemberLinks } from "@/lib/market/links-csv";

const COPIES: { key: string; label: string; pick: (r: MemberLinks) => string | undefined }[] = [
  { key: "brief", label: "Brief", pick: (r) => r.briefUrl },
  { key: "claude", label: "Claude", pick: (r) => r.ask.claude },
  { key: "chatgpt", label: "ChatGPT", pick: (r) => r.ask.chatgpt },
  { key: "gemini", label: "Gemini", pick: (r) => r.ask.gemini },
  { key: "page", label: "Page", pick: (r) => r.pageUrl },
];

/**
 * Each coded member's links (phase 2 FR-05), loaded on request because they
 * carry the brief keys. "Export links" builds the CSV in the browser; it is
 * never written on the server.
 */
export function CampaignLinks({ slug, coded }: { slug: string; coded: number }) {
  const [page, setPage] = useState("");
  const [links, setLinks] = useState<MemberLinks[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!coded) return <p className="text-sm text-fg-mid">Members get links once they have codes.</p>;

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const q = page.trim() ? `?page=${encodeURIComponent(page.trim())}` : "";
      const res = await fetch(`/api/admin/campaigns/${slug}/links${q}`, { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as { links?: MemberLinks[]; error?: string };
      if (!res.ok || !data.links) setError(data.error ?? `The request failed (${res.status})`);
      else setLinks(data.links);
    } catch {
      setError("The request did not reach the server");
    } finally {
      setBusy(false);
    }
  }

  function exportCsv() {
    if (!links) return;
    const blob = new Blob([linksCsv(links)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-links.csv`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copy(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
    } catch {
      setError("The browser did not allow copying; use Export links instead");
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={load} className="flex flex-wrap items-end gap-2" aria-label="Campaign links">
        <label className="flex w-full min-w-0 flex-col gap-1 text-xs text-fg-mid sm:w-auto sm:max-w-md sm:flex-1">
          Site page for the page link (optional)
          <input
            name="page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            placeholder="/platform"
            maxLength={300}
            autoComplete="off"
            className={FIELD}
          />
        </label>
        <button type="submit" className={QUIET} disabled={busy}>
          {busy ? "Loading" : links ? "Show the links again" : "Show links"}
        </button>
        {links?.length ? (
          <button type="button" className={BUTTON} onClick={exportCsv}>
            Export links
          </button>
        ) : null}
      </form>
      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
      {links ? (
        links.length ? (
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Links for each coded member</caption>
              <thead className="bg-surface-2 text-xs uppercase text-fg-mid">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Member
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Copy a link
                  </th>
                </tr>
              </thead>
              <tbody>
                {links.map((r) => (
                  <tr key={r.contactId} className="border-t border-line align-top">
                    <td className="px-3 py-2 [overflow-wrap:anywhere]">
                      <div className="font-medium">{r.name || r.email}</div>
                      <div className="font-mono text-xs text-fg-mid">{r.code}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {COPIES.map((c) => {
                          const value = c.pick(r);
                          if (!value) return null;
                          const id = `${r.contactId}:${c.key}`;
                          return (
                            <button
                              key={c.key}
                              type="button"
                              className={`${QUIET} h-8 px-2 text-xs`}
                              aria-label={`Copy the ${c.label} link for ${r.name || r.email}`}
                              onClick={() => void copy(id, value)}
                            >
                              {copied === id ? "Copied" : c.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-fg-mid">No coded members you can see.</p>
        )
      ) : null}
    </div>
  );
}
