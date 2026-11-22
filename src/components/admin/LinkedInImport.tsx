"use client";

import Link from "next/link";
import { useState } from "react";
import { BUTTON, FIELD, useAdminRequest } from "@/components/admin/useAdminRequest";
import { LEAD_FIELD_LABELS, LEAD_FIELDS, type LeadField, type LeadMapping } from "@/lib/market/csv";
import type { ImportResult, Preview } from "@/lib/market/linkedin-import";

const NEW = "__new";
const MAX_BYTES = 3_000_000;

type CampaignOption = { slug: string; name: string; kind: string };

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function when(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";
}

const STATE_LABEL = { ready: "Ready", imported: "Already imported", skipped: "Skipped" } as const;

/**
 * Import a Campaign Manager Lead Gen Form export (FR-14). The file is read in
 * the browser and its text sent for a preview; nothing is saved until Import.
 */
export function LinkedInImport({ campaigns }: { campaigns: CampaignOption[] }) {
  const linkedin = campaigns.filter((c) => c.kind === "linkedin");
  const [campaign, setCampaign] = useState(linkedin[0]?.slug ?? campaigns[0]?.slug ?? NEW);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [fileName, setFileName] = useState("");
  // A new key clears the file input, so the same file can be chosen again.
  const [fileKey, setFileKey] = useState(0);
  const [csv, setCsv] = useState<string | null>(null);
  const [mapping, setMapping] = useState<LeadMapping | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<(ImportResult & { slug: string }) | null>(null);
  const { send, busy, error, setError } = useAdminRequest();

  async function runPreview(text: string, map: LeadMapping | null) {
    setResult(null);
    const res = await send<{ preview: Preview }>(
      "/api/admin/import/linkedin",
      "POST",
      { csv: text, mapping: map ?? undefined },
      { refresh: false },
    );
    if (res) {
      setPreview(res.preview);
      setMapping(res.preview.mapping);
    } else {
      setPreview(null);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(null);
    setMapping(null);
    setResult(null);
    setCsv(null);
    setFileName(file?.name ?? "");
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError("The file is too large; split it and import each part");
      return;
    }
    const text = await file.text();
    setCsv(text);
    await runPreview(text, null);
  }

  async function onMap(field: LeadField, header: string) {
    if (!csv || !mapping) return;
    const next: LeadMapping = { ...mapping };
    if (header) next[field] = header;
    else delete next[field];
    setMapping(next);
    await runPreview(csv, next);
  }

  async function onImport() {
    if (!csv || !mapping || !preview) return;
    let slug = campaign;
    if (campaign === NEW) {
      const created = await send<{ campaign: { slug: string } }>(
        "/api/admin/campaigns",
        "POST",
        { slug: newSlug.trim(), name: newName.trim(), kind: "linkedin", visibility: "general" },
        { refresh: false },
      );
      if (!created) return;
      slug = created.campaign.slug;
      setCampaign(slug);
    }
    // Refreshes the page's campaign list, so a new campaign shows in the picker.
    const res = await send<{ result: ImportResult }>("/api/admin/import/linkedin", "POST", {
      csv,
      mapping,
      campaign: slug,
      confirm: true,
    });
    if (res) {
      setResult({ ...res.result, slug });
      setPreview(null);
      setCsv(null);
      setFileName("");
      setFileKey((k) => k + 1);
    }
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  const canImport =
    Boolean(preview && preview.ready > 0) && (campaign !== NEW || (newName.trim() !== "" && newSlug.trim() !== ""));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
        <label className={row}>
          Campaign for these leads
          <select value={campaign} onChange={(e) => setCampaign(e.target.value)} className={FIELD} disabled={busy}>
            {campaigns.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value={NEW}>New LinkedIn campaign</option>
          </select>
        </label>
        <label className={row}>
          Lead Gen Form export (CSV)
          <input
            key={fileKey}
            type="file"
            accept=".csv,text/csv"
            onChange={onFile}
            disabled={busy}
            className="text-sm text-fg file:mr-3 file:h-9 file:rounded-md file:border file:border-line-strong file:bg-surface file:px-3 file:text-sm"
          />
        </label>
        {campaign === NEW ? (
          <>
            <label className={row}>
              Campaign name
              <input value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={200} className={FIELD} />
            </label>
            <label className={row}>
              Short name (lowercase, digits, dashes)
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                pattern="[a-z0-9][a-z0-9\-]{0,62}"
                maxLength={63}
                className={FIELD}
                placeholder="2026-12-design-partner-leads"
              />
            </label>
          </>
        ) : null}
        <p className="text-xs text-fg-mid sm:col-span-2">
          The file is read here and checked on the server; it is not stored. Importing the same file again adds nothing.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
      {busy ? (
        <p role="status" className="text-sm text-fg-mid">
          Working
        </p>
      ) : null}

      {preview && mapping ? (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Columns in {fileName || "the file"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LEAD_FIELDS.map((field) => (
                <label key={field} className={row}>
                  {LEAD_FIELD_LABELS[field]}
                  <select
                    value={mapping[field] ?? ""}
                    onChange={(e) => onMap(field, e.target.value)}
                    className={FIELD}
                    disabled={busy}
                  >
                    <option value="">{field === "email" ? "Pick a column" : "Not in this file"}</option>
                    {preview.headers.filter(Boolean).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Preview</h2>
            <p className="text-sm">
              {count(preview.total, "lead", "leads")}: {preview.ready} ready, {preview.alreadyImported} already imported,{" "}
              {preview.skipped} skipped.
            </p>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">First rows of the file</caption>
                <thead className="bg-surface-2 text-xs text-fg-mid">
                  <tr>
                    <th className="px-3 py-2 font-medium">Line</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="hidden px-3 py-2 font-medium sm:table-cell">Name</th>
                    <th className="hidden px-3 py-2 font-medium md:table-cell">Company</th>
                    <th className="hidden px-3 py-2 font-medium md:table-cell">Submitted</th>
                    <th className="px-3 py-2 font-medium">State</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.sample.map((r) => (
                    <tr key={r.line} className="border-t border-line align-top">
                      <td className="px-3 py-2 text-fg-mid">{r.line}</td>
                      <td className="px-3 py-2 [overflow-wrap:anywhere]">{r.email}</td>
                      <td className="hidden px-3 py-2 sm:table-cell">{r.name}</td>
                      <td className="hidden px-3 py-2 md:table-cell">{r.company}</td>
                      <td className="hidden px-3 py-2 md:table-cell">{when(r.submittedAt)}</td>
                      <td className="px-3 py-2">{r.reason ?? STATE_LABEL[r.state]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.total > preview.sample.length ? (
              <p className="text-xs text-fg-mid">Showing the first {preview.sample.length} rows.</p>
            ) : null}
            {preview.skippedRows.length ? <Skipped rows={preview.skippedRows} total={preview.skipped} /> : null}
            <button type="button" className={BUTTON} disabled={busy || !canImport} onClick={onImport}>
              Import {count(preview.ready, "lead", "leads")}
            </button>
          </section>
        </>
      ) : null}

      {result ? (
        <section role="status" className="space-y-2 rounded-lg border border-line bg-surface p-4 text-sm">
          <h2 className="text-lg font-semibold">Import finished</h2>
          <p>
            Imported {count(result.imported, "lead", "leads")}, {count(result.newContacts, "new contact", "new contacts")}.{" "}
            {result.alreadyImported} already imported, {result.skipped} skipped.
            {result.membersAdded ? ` Added ${count(result.membersAdded, "member", "members")} to the campaign.` : ""}
          </p>
          {result.skippedRows.length ? <Skipped rows={result.skippedRows} total={result.skipped} /> : null}
          <Link href={`/admin/campaigns/${result.slug}`} className="inline-block font-medium underline">
            Open the campaign
          </Link>
        </section>
      ) : null}
    </div>
  );
}

function Skipped({ rows, total }: { rows: { line: number; reason: string }[]; total: number }) {
  return (
    <div className="text-sm">
      <p className="text-fg-mid">Skipped rows{total > rows.length ? ` (first ${rows.length} of ${total})` : ""}:</p>
      <ul className="mt-1 list-inside list-disc text-xs">
        {rows.map((r) => (
          <li key={`${r.line}-${r.reason}`}>
            Line {r.line}: {r.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
