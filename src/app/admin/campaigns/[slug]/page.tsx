import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canSeeInvestor, requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { MEMBER_STATUSES, type MemberStatus } from "@/lib/market/campaigns";
import { campaignResults, filterResults, type Funnel, type ResultRow } from "@/lib/market/results";
import { Badge } from "@/components/admin/Badge";
import { AddMembersForm } from "@/components/admin/AddMembersForm";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { FilterBar } from "@/components/admin/FilterBar";
import { RecomputeButton } from "@/components/admin/RecomputeButton";
import { StatusOverride } from "@/components/admin/StatusOverride";
import { formatDay, formatWhen, label } from "@/components/admin/format";
import { ArrowLeft20Regular } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Campaign" };

type SearchParams = Record<string, string | string[] | undefined>;

function one(params: SearchParams, name: string, max = 100): string | undefined {
  const v = params[name];
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s ? s.slice(0, max) : undefined;
}

const STAGES: { key: keyof Funnel; label: string; hint?: string }[] = [
  { key: "members", label: "Members" },
  { key: "sent", label: "Sent" },
  { key: "delivered", label: "Delivered", hint: "Sent, less bounces" },
  { key: "engaged", label: "Engaged", hint: "Read the brief or clicked" },
  { key: "replied", label: "Replied" },
  { key: "meeting", label: "Meeting" },
];

function FunnelTiles({ funnel }: { funnel: Funnel }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STAGES.map((s) => (
        <div key={s.key} className="rounded-lg border border-line bg-surface p-3">
          <dt className="text-xs text-fg-mid">{s.label}</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">{funnel[s.key]}</dd>
          {s.hint ? <dd className="text-xs text-fg-low">{s.hint}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

function columns(slug: string): Column<ResultRow>[] {
  return [
    {
      key: "contact",
      header: "Member",
      cell: (r) => (
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/contacts/${r.contactId}`} className="font-medium hover:underline">
              {r.contactName || r.contactEmail}
            </Link>
            {r.contactVisibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
          </div>
          {r.contactName ? <div className="text-xs text-fg-mid">{r.contactEmail}</div> : null}
          {r.group ? <div className="text-xs text-fg-mid sm:hidden">{r.group}</div> : null}
          <div className="text-xs text-fg-mid md:hidden">{formatDay(r.lastActivityAt)}</div>
        </div>
      ),
    },
    {
      key: "group",
      header: "Group",
      className: "hidden sm:table-cell",
      cell: (r) => (
        <div>
          {r.group ?? ""}
          {r.templateLabel ? <div className="text-xs text-fg-mid">{r.templateLabel}</div> : null}
        </div>
      ),
    },
    {
      key: "last",
      header: "Last activity",
      className: "hidden md:table-cell",
      cell: (r) => <span className="whitespace-nowrap">{formatWhen(r.lastActivityAt)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <div className="flex flex-col items-start gap-1">
          <span className="flex flex-wrap items-center gap-1">
            <Badge tone={r.statusOverride ? "amber" : "blue"}>{label(r.effective)}</Badge>
            {r.statusOverride ? <span className="text-xs text-fg-mid">set by hand</span> : null}
          </span>
          <StatusOverride
            key={r.statusOverride ?? "derived"}
            slug={slug}
            contactId={r.contactId}
            derived={r.status}
            override={r.statusOverride}
            who={r.contactName || r.contactEmail}
          />
        </div>
      ),
    },
  ];
}

function dates(start?: string, end?: string): string {
  const day = (d?: string) => (d ? formatDay(`${d}T12:00:00Z`) : "");
  if (start && end) return `${day(start)} to ${day(end)}`;
  if (start) return `From ${day(start)}`;
  if (end) return `Until ${day(end)}`;
  return "No dates set";
}

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const access = await requireAdmin(`/admin/campaigns/${encodeURIComponent(slug)}`);
  if (access.status !== "ok") return null;
  const { principal } = access;
  if (!isMarketConfigured()) notFound();

  // A campaign the user may not see is "not found", so the page does not reveal it exists.
  const results = await campaignResults(slug, principal.roles);
  if (!results) notFound();
  const { campaign, funnel, rows, groups } = results;

  const sp = await searchParams;
  const q = one(sp, "q", 200);
  const statusParam = one(sp, "status");
  const status = (MEMBER_STATUSES as readonly string[]).includes(statusParam ?? "")
    ? (statusParam as MemberStatus)
    : undefined;
  const group = one(sp, "group");
  const shown = filterResults(rows, { q, status, group });
  const filtered = Boolean(q || status || group);
  const base = `/admin/campaigns/${campaign.slug}`;

  return (
    <article className="space-y-8">
      <div>
        <Link href="/admin/campaigns" className="inline-flex items-center gap-1 text-sm text-fg-mid hover:underline">
          <ArrowLeft20Regular aria-hidden /> Campaigns
        </Link>
        <h1 className="mt-3 text-2xl font-semibold [overflow-wrap:anywhere]">{campaign.name}</h1>
        <p className="mt-1 text-sm text-fg-mid">
          {label(campaign.kind)} · {dates(campaign.startDate, campaign.endDate)}
          {campaign.utmCampaign ? ` · UTM ${campaign.utmCampaign}` : ""}
        </p>
        {campaign.visibility === "investor" ? (
          <div className="mt-3">
            <Badge tone="amber">Investor only</Badge>
          </div>
        ) : null}
        {campaign.notes ? (
          <p className="mt-3 max-w-3xl whitespace-pre-line text-sm [overflow-wrap:anywhere]">{campaign.notes}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <CampaignForm
            canSetVisibility={canSeeInvestor(principal)}
            campaign={{
              slug: campaign.slug,
              name: campaign.name,
              kind: campaign.kind,
              utmCampaign: campaign.utmCampaign,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
              notes: campaign.notes,
              visibility: campaign.visibility,
            }}
          />
        </div>
      </div>

      <section aria-labelledby="results" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="results" className="text-lg font-semibold">
            Results
          </h2>
          <span className="flex flex-wrap items-center gap-3 text-xs text-fg-mid">
            {campaign.resultsAt ? <span>Statuses updated {formatWhen(campaign.resultsAt)}</span> : null}
            <RecomputeButton slug={campaign.slug} />
          </span>
        </div>
        <FunnelTiles funnel={funnel} />
        <p className="text-xs text-fg-mid">
          Engaged counts every brief read and Ask AI click for now. Filtering out link scanners (the first 15 minutes after
          a first hit, bursts and rewritten links) comes with a later release.
        </p>
      </section>

      <section aria-labelledby="members" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="members" className="text-lg font-semibold">
            Members
          </h2>
          <p className="text-sm text-fg-mid">{filtered ? `${shown.length} of ${rows.length}` : rows.length}</p>
        </div>
        <AddMembersForm slug={campaign.slug} />
        {rows.length ? (
          <FilterBar
            action={base}
            q={q}
            searchLabel="Name or email"
            selects={[
              {
                name: "status",
                label: "Status",
                value: status,
                options: MEMBER_STATUSES.map((s) => ({ value: s, label: label(s) })),
              },
              { name: "group", label: "Group", value: group, options: groups.map((g) => ({ value: g, label: g })) },
            ]}
          />
        ) : null}
        {shown.length ? (
          <DataTable rows={shown} columns={columns(campaign.slug)} rowKey={(r) => r.contactId} caption="Members" />
        ) : (
          <EmptyState title={filtered ? "No members match" : "No members yet"}>
            {filtered ? "Clear a filter to see more." : "Add the contacts this campaign reaches out to."}
          </EmptyState>
        )}
      </section>
    </article>
  );
}
