import type { Metadata } from "next";
import Link from "next/link";
import { canSeeInvestor, requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { campaignSummaries, type Funnel } from "@/lib/market/results";
import type { Campaign } from "@/lib/market/campaigns";
import { Badge } from "@/components/admin/Badge";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { formatDay, label } from "@/components/admin/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Campaigns" };

type Row = { campaign: Campaign; funnel: Funnel };

function dates(c: Campaign): string {
  const day = (d?: string) => (d ? formatDay(`${d}T12:00:00Z`) : "");
  if (c.startDate && c.endDate) return `${day(c.startDate)} to ${day(c.endDate)}`;
  if (c.startDate) return `From ${day(c.startDate)}`;
  if (c.endDate) return `Until ${day(c.endDate)}`;
  return "";
}

const COLUMNS: Column<Row>[] = [
  {
    key: "name",
    header: "Campaign",
    cell: ({ campaign: c }) => (
      <div className="min-w-0 [overflow-wrap:anywhere]">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/campaigns/${c.slug}`} className="font-medium hover:underline">
            {c.name}
          </Link>
          {c.visibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
        </div>
        <div className="text-xs text-fg-mid">
          {label(c.kind)}
          <span className="md:hidden">{dates(c) ? ` · ${dates(c)}` : ""}</span>
        </div>
      </div>
    ),
  },
  { key: "dates", header: "Dates", className: "hidden md:table-cell", cell: ({ campaign }) => dates(campaign) },
  { key: "members", header: "Members", cell: ({ funnel }) => funnel.members },
  { key: "sent", header: "Sent", className: "hidden sm:table-cell", cell: ({ funnel }) => funnel.sent },
  { key: "engaged", header: "Engaged", className: "hidden sm:table-cell", cell: ({ funnel }) => funnel.engaged },
  { key: "replied", header: "Replied", cell: ({ funnel }) => funnel.replied },
  { key: "meeting", header: "Meetings", className: "hidden sm:table-cell", cell: ({ funnel }) => funnel.meeting },
];

export default async function CampaignsPage() {
  const access = await requireAdmin("/admin/campaigns");
  if (access.status !== "ok") return null;
  const { principal } = access;

  if (!isMarketConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <div className="mt-6">
          <EmptyState title="Storage is not configured" />
        </div>
      </section>
    );
  }

  const rows = await campaignSummaries(principal.roles);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <p className="text-sm text-fg-mid">
          {rows.length} {rows.length === 1 ? "campaign" : "campaigns"}
        </p>
      </div>

      <CampaignForm canSetVisibility={canSeeInvestor(principal)} />

      {rows.length ? (
        <DataTable rows={rows} columns={COLUMNS} rowKey={(r) => r.campaign.slug} caption="Campaigns" />
      ) : (
        <EmptyState title="No campaigns yet">Create one, then add the contacts you are reaching out to.</EmptyState>
      )}
      <p className="text-xs text-fg-mid">Counts are from the last status update; open a campaign to refresh it.</p>
    </section>
  );
}
