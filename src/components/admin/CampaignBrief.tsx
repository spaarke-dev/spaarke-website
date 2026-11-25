"use client";

import { useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

const MAX = 20_000;

/**
 * The campaign's brief (phase 2 FR-04): one text, a private link for each
 * coded member, and a switch that turns every link off or on.
 */
export function CampaignBrief({
  slug,
  text,
  active,
  links,
  coded,
  audience,
}: {
  slug: string;
  text?: string;
  active: boolean;
  /** Links for members this user may see. */
  links: number;
  /** Coded members this user may see. */
  coded: number;
  audience: "investor" | "general";
}) {
  const save = useAdminRequest();
  const toggle = useAdminRequest();
  const [draft, setDraft] = useState(text ?? "");
  const [saved, setSaved] = useState<string | null>(null);
  const dirty = draft.trim() !== (text ?? "").trim();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(null);
    const r = await save.send<{ created: number; updated: number }>(`/api/admin/campaigns/${slug}/brief`, "PUT", { text: draft });
    if (r) setSaved(r.created ? `Saved. ${r.created === 1 ? "1 new link" : `${r.created} new links`}.` : "Saved.");
  }

  if (!coded && !text) {
    return <p className="text-sm text-fg-mid">Give members codes first. Each coded member then gets a private link to the brief.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-mid">
        {audience === "investor"
          ? "Readers see it as the investor overview, with the full Spaarke library."
          : "Readers see it as a note from the Spaarke team, with the full Spaarke library."}{" "}
        Plain text or markdown. It is stored with the links, never in the site&apos;s code.
      </p>
      <form onSubmit={onSubmit} className="space-y-2" aria-label="Campaign brief">
        <label className="flex flex-col gap-1 text-xs text-fg-mid">
          Brief text
          <textarea
            name="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MAX}
            rows={10}
            className={`${FIELD} h-auto py-2 font-mono`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={BUTTON} disabled={save.busy || !draft.trim() || !dirty}>
            {save.busy ? "Saving" : "Save brief"}
          </button>
          <span className="text-xs text-fg-mid tabular-nums">
            {draft.length.toLocaleString("en-US")} of {MAX.toLocaleString("en-US")}
          </span>
          {saved ? (
            <span role="status" className="text-sm">
              {saved}
            </span>
          ) : null}
          {save.error ? (
            <span role="alert" className="text-sm text-[#c42b1c]">
              {save.error}
            </span>
          ) : null}
        </div>
      </form>
      {text ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
          <span className="text-sm">
            {links === 1 ? "1 link" : `${links} links`}, {active ? "on" : "turned off"}
            {coded > links ? ` (${coded - links} coded members get theirs on the next save)` : ""}
          </span>
          <button
            type="button"
            className={QUIET}
            disabled={toggle.busy}
            onClick={() => void toggle.send(`/api/admin/campaigns/${slug}/brief/active`, "POST", { active: !active })}
          >
            {toggle.busy ? "Changing" : active ? "Turn the briefs off" : "Turn them on"}
          </button>
          {toggle.error ? (
            <span role="alert" className="text-sm text-[#c42b1c]">
              {toggle.error}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
