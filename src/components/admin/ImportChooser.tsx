"use client";

import { useState } from "react";
import { LinkedInImport } from "@/components/admin/LinkedInImport";
import { TargetImport } from "@/components/admin/TargetImport";

type CampaignOption = { slug: string; name: string; kind: string };

const KINDS = {
  targets: {
    label: "Target list",
    help: "A list of people to reach, from any spreadsheet saved as CSV. Each person becomes a contact and joins the campaign, with the group and template you map.",
  },
  linkedin: {
    label: "LinkedIn leads",
    help: "In Campaign Manager, download the leads from the Lead Gen Form as a CSV. Each lead becomes a contact with a LinkedIn lead activity, and joins the campaign.",
  },
} as const;

type Kind = keyof typeof KINDS;

/** The import page's two kinds of file, one form at a time. */
export function ImportChooser({ campaigns, canInvestor }: { campaigns: CampaignOption[]; canInvestor: boolean }) {
  const [kind, setKind] = useState<Kind>("targets");
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-sm font-medium">What are you importing?</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {(Object.keys(KINDS) as Kind[]).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input type="radio" name="import-kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
              {KINDS[k].label}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-sm text-fg-mid">{KINDS[kind].help}</p>
      {kind === "targets" ? (
        <TargetImport campaigns={campaigns} canInvestor={canInvestor} />
      ) : (
        <LinkedInImport campaigns={campaigns} />
      )}
    </div>
  );
}
