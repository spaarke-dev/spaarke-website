"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

export type EditableCampaign = {
  slug: string;
  name: string;
  kind: string;
  utmCampaign?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  visibility: string;
};

const KINDS = [
  ["outreach", "Outreach"],
  ["event", "Event"],
  ["linkedin", "LinkedIn"],
  ["website", "Website"],
  ["other", "Other"],
] as const;

/**
 * Create a campaign, or edit one when `campaign` is given. An edit sends only
 * the fields that changed; the short name is set once.
 */
export function CampaignForm({
  campaign,
  canSetVisibility,
}: {
  campaign?: EditableCampaign;
  canSetVisibility: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { send, busy, error } = useAdminRequest();
  const editing = Boolean(campaign);

  if (!open) {
    return (
      <button type="button" className={editing ? QUIET : BUTTON} onClick={() => setOpen(true)}>
        {editing ? "Edit details" : "New campaign"}
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const next: Record<string, string> = {
      name: text("name"),
      kind: text("kind"),
      utmCampaign: text("utmCampaign"),
      startDate: text("startDate"),
      endDate: text("endDate"),
      notes: text("notes"),
    };
    if (canSetVisibility) next.visibility = text("visibility");

    if (!campaign) {
      const body = { slug: text("slug"), ...next };
      const res = await send<{ campaign: { slug: string } }>("/api/admin/campaigns", "POST", body, { refresh: false });
      if (res) router.push(`/admin/campaigns/${res.campaign.slug}`);
      return;
    }
    const current = campaign as Record<string, unknown>;
    const patch: Record<string, string> = {};
    for (const [k, v] of Object.entries(next)) if (v !== String(current[k] ?? "")) patch[k] = v;
    if (Object.keys(patch).length === 0) {
      setOpen(false);
      return;
    }
    if (await send(`/api/admin/campaigns/${campaign.slug}`, "PATCH", patch)) setOpen(false);
  }

  const row = "flex flex-col gap-1 text-xs text-fg-mid";
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
      <label className={row}>
        Name
        <input name="name" required defaultValue={campaign?.name} maxLength={200} className={FIELD} />
      </label>
      {editing ? null : (
        <label className={row}>
          Short name, used in links (lowercase, digits, dashes)
          <input
            name="slug"
            required
            pattern="[a-z0-9][a-z0-9\-]{0,62}"
            maxLength={63}
            className={FIELD}
            placeholder="tltf-2026"
          />
        </label>
      )}
      <label className={row}>
        Kind
        <select name="kind" defaultValue={campaign?.kind ?? "outreach"} className={FIELD}>
          {KINDS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className={row}>
        UTM campaign value
        <input name="utmCampaign" defaultValue={campaign?.utmCampaign} maxLength={100} className={FIELD} />
      </label>
      <label className={row}>
        Start date
        <input name="startDate" type="date" defaultValue={campaign?.startDate} className={FIELD} />
      </label>
      <label className={row}>
        End date
        <input name="endDate" type="date" defaultValue={campaign?.endDate} className={FIELD} />
      </label>
      {canSetVisibility ? (
        <label className={row}>
          Who can see this campaign
          <select name="visibility" defaultValue={campaign?.visibility ?? "general"} className={FIELD}>
            <option value="general">All admins</option>
            <option value="investor">Investor role only</option>
          </select>
        </label>
      ) : null}
      <label className={`${row} sm:col-span-2`}>
        Notes
        <textarea name="notes" defaultValue={campaign?.notes} maxLength={2000} rows={3} className={`${FIELD} h-auto py-2`} />
      </label>
      <p className="text-xs text-fg-mid sm:col-span-2">
        Emails and meetings with members count toward the campaign from the start date (or the day a member is added) to
        60 days after the end date.
      </p>
      <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
        <button type="submit" className={BUTTON} disabled={busy}>
          {busy ? "Saving" : editing ? "Save" : "Create"}
        </button>
        <button type="button" className={QUIET} onClick={() => setOpen(false)} disabled={busy}>
          Cancel
        </button>
        {error ? (
          <p role="alert" className="text-sm text-[#c42b1c]">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
