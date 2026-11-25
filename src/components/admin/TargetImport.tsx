"use client";

import Link from "next/link";
import { useState } from "react";
import { BUTTON, FIELD, useAdminRequest } from "@/components/admin/useAdminRequest";
import { useRouter } from "next/navigation";
import { RUN_CHUNK, TARGET_FIELD_LABELS, TARGET_FIELDS, type TargetField, type TargetMapping } from "@/lib/market/target-fields";
import type { TargetPreview, TargetResult } from "@/lib/market/target-import";

const NEW = "__new";
const MAX_BYTES = 2_000_000; // MAX_TARGET_CHARS, checked again on the server

type CampaignOption = { slug: string; name: string; kind: string };

type Totals = Omit<TargetResult, "from" | "to" | "next"> & { slug: string };

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

const STATE_LABEL = { new: "New contact", existing: "Existing contact", member: "Already in the campaign", skipped: "Skipped" } as const;

/**
 * Import a target list (phase 2 FR-01). The file is read in the browser and
 * its text sent for a preview; nothing is saved until Import. A large file is
 * imported in parts, one request each.
 */
export function TargetImport({ campaigns, canInvestor }: { campaigns: CampaignOption[]; canInvestor: boolean }) {
  const [campaign, setCampaign] = useState(campaigns.find((c) => c.kind === "outreach")?.slug ?? NEW);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [visibility, setVisibility] = useState<"general" | "investor">("general");
  const [fileName, setFileName] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [csv, setCsv] = useState<string | null>(null);
  const [mapping, setMapping] = useState<TargetMapping | null>(null);
  const [preview, setPreview] = useState<TargetPreview | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<Totals | null>(null);
  const { send, busy, error, setError } = useAdminRequest();
  const router = useRouter();

  const target = campaign === NEW ? undefined : campaign;

  async function runPreview(text: string, map: TargetMapping | null, slug = target) {
    setResult(null);
    const res = await send<{ preview: TargetPreview }>(
      "/api/admin/import/targets",
      "POST",
      { csv: text, mapping: map ?? undefined, campaign: slug, visibility },
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
      setError("The file is larger than 2 MB; split it and import each part");
      return;
    }
    const text = await file.text();
    setCsv(text);
    await runPreview(text, null);
  }

  async function onMap(field: TargetField, header: string) {
    if (!csv || !mapping) return;
    const next: TargetMapping = { ...mapping };
    if (header) next[field] = header;
    else delete next[field];
    setMapping(next);
    await runPreview(csv, next);
  }

  async function onCampaign(value: string) {
    setCampaign(value);
    if (csv && mapping) await runPreview(csv, mapping, value === NEW ? undefined : value);
  }

  async function onImport() {
    if (!csv || !mapping || !preview) return;
    let slug = campaign;
    if (campaign === NEW) {
      const created = await send<{ campaign: { slug: string } }>(
        "/api/admin/campaigns",
        "POST",
        { slug: newSlug.trim(), name: newName.trim(), kind: "outreach", visibility },
        { refresh: false },
      );
      if (!created) return;
      slug = created.campaign.slug;
    }

    const totals: Totals = {
      slug,
      total: preview.total,
      newContacts: 0,
      existingContacts: 0,
      membersAdded: 0,
      alreadyMembers: 0,
      notesAdded: 0,
      skipped: 0,
      skippedRows: [],
    };
    let from: number | null = 0;
    while (from !== null) {
      setProgress(`Importing rows ${from + 1} to ${Math.min(from + RUN_CHUNK, preview.total)} of ${preview.total}`);
      const res: { result: TargetResult } | null = await send<{ result: TargetResult }>(
        "/api/admin/import/targets",
        "POST",
        { csv, mapping, campaign: slug, visibility, confirm: true, from },
        { refresh: false },
      );
      if (!res) {
        setProgress(null);
        return;
      }
      const r: TargetResult = res.result;
      totals.newContacts += r.newContacts;
      totals.existingContacts += r.existingContacts;
      totals.membersAdded += r.membersAdded;
      totals.alreadyMembers += r.alreadyMembers;
      totals.notesAdded += r.notesAdded;
      totals.skipped += r.skipped;
      totals.skippedRows = [...totals.skippedRows, ...r.skippedRows].slice(0, 50);
      from = r.next;
    }
    setProgress(null);
    setCampaign(slug);
    setResult(totals);
    setPreview(null);
    setCsv(null);
    setFileName("");
    setFileKey((k) => k + 1);
    // Refresh the page's campaign list, so a new campaign shows in the picker.
    router.refresh();
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  const ready = preview ? preview.newContacts + preview.existingContacts + preview.alreadyMembers : 0;
  const canImport = ready > 0 && (campaign !== NEW || (newName.trim() !== "" && newSlug.trim() !== ""));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
        <label className={row}>
          Campaign for this list
          <select value={campaign} onChange={(e) => onCampaign(e.target.value)} className={FIELD} disabled={busy}>
            {campaigns.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value={NEW}>New outreach campaign</option>
          </select>
        </label>
        <label className={row}>
          Target list (CSV)
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
                placeholder="2027-01-general-counsel-outreach"
              />
            </label>
          </>
        ) : null}
        <label className={row}>
          Who can see new contacts
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "general" | "investor")}
            className={FIELD}
            disabled={busy}
          >
            <option value="general">All admins</option>
            {canInvestor ? <option value="investor">Investor role only</option> : null}
          </select>
        </label>
        <p className="text-xs text-fg-mid sm:col-span-2">
          The file is read here and checked on the server; it is not stored. Existing contacts gain only details they do not
          have yet, and importing the same file again adds nothing.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
      {busy || progress ? (
        <p role="status" className="text-sm text-fg-mid">
          {progress ?? "Working"}
        </p>
      ) : null}

      {preview && mapping ? (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Columns in {fileName || "the file"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TARGET_FIELDS.map((field) => (
                <label key={field} className={row}>
                  {TARGET_FIELD_LABELS[field]}
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
              {count(preview.total, "row", "rows")}: {count(preview.newContacts, "new contact", "new contacts")},{" "}
              {count(preview.existingContacts, "existing contact", "existing contacts")}, {preview.alreadyMembers} already in
              the campaign, {preview.skipped} skipped.
            </p>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">First rows of the file</caption>
                <thead className="bg-surface-2 text-xs text-fg-mid">
                  <tr>
                    <th className="px-3 py-2 font-medium">Line</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="hidden px-3 py-2 font-medium sm:table-cell">Name</th>
                    <th className="hidden px-3 py-2 font-medium md:table-cell">Organization</th>
                    <th className="hidden px-3 py-2 font-medium md:table-cell">Group</th>
                    <th className="px-3 py-2 font-medium">State</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.sample.map((r) => (
                    <tr key={r.line} className="border-t border-line align-top">
                      <td className="px-3 py-2 text-fg-mid">{r.line}</td>
                      <td className="px-3 py-2 [overflow-wrap:anywhere]">{r.email}</td>
                      <td className="hidden px-3 py-2 sm:table-cell">{r.name}</td>
                      <td className="hidden px-3 py-2 md:table-cell">{r.organization}</td>
                      <td className="hidden px-3 py-2 md:table-cell">{r.group}</td>
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
            <button type="button" className={BUTTON} disabled={busy || !!progress || !canImport} onClick={onImport}>
              Import {count(ready, "person", "people")}
            </button>
          </section>
        </>
      ) : null}

      {result ? (
        <section role="status" className="space-y-2 rounded-lg border border-line bg-surface p-4 text-sm">
          <h2 className="text-lg font-semibold">Import finished</h2>
          <p>
            Added {count(result.membersAdded, "person", "people")} to the campaign
            {result.membersAdded
              ? `: ${count(result.newContacts, "new contact", "new contacts")} and ${count(result.membersAdded - result.newContacts, "existing contact", "existing contacts")}`
              : ""}
            . {result.alreadyMembers} already in the campaign, {count(result.skipped, "row", "rows")} skipped
            {result.notesAdded ? `, ${count(result.notesAdded, "note", "notes")} added` : ""}.
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
