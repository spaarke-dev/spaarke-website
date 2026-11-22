import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import {
  campaignMemberIds,
  filterContacts,
  loadContacts,
  tagsInUse,
  visibleCampaigns,
  type ContactRow,
} from "@/lib/market/queries";
import { CONTACT_KINDS, CONTACT_STAGES } from "@/lib/market/types";
import { Badge } from "@/components/admin/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { FilterBar } from "@/components/admin/FilterBar";
import { Pager } from "@/components/admin/Pager";
import { formatDay, label } from "@/components/admin/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Contacts" };

type SearchParams = Record<string, string | string[] | undefined>;

function one(params: SearchParams, name: string, max = 100): string | undefined {
  const v = params[name];
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s ? s.slice(0, max) : undefined;
}

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

const COLUMNS: Column<ContactRow>[] = [
  {
    key: "contact",
    header: "Contact",
    cell: (c) => (
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/contacts/${c.id}`} className="font-medium hover:underline">
            {c.name || c.email}
          </Link>
          {c.visibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
        </div>
        {c.name ? <div className="break-all text-xs text-fg-mid">{c.email}</div> : null}
        {c.organizationName ? <div className="text-xs text-fg-mid sm:hidden">{c.organizationName}</div> : null}
      </div>
    ),
  },
  {
    key: "org",
    header: "Organization",
    className: "hidden sm:table-cell",
    cell: (c) =>
      c.organizationName && c.organizationId ? (
        <Link href={`/admin/organizations/${encodeURIComponent(c.organizationId)}`} className="hover:underline">
          {c.organizationName}
        </Link>
      ) : (
        ""
      ),
  },
  { key: "kind", header: "Kind", className: "hidden md:table-cell", cell: (c) => <Badge>{label(c.kind)}</Badge> },
  { key: "stage", header: "Stage", cell: (c) => <Badge tone="blue">{label(c.stage)}</Badge> },
  {
    key: "tags",
    header: "Tags",
    className: "hidden lg:table-cell",
    cell: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
    ),
  },
  {
    key: "last",
    header: "Last activity",
    className: "hidden md:table-cell",
    cell: (c) => <span className="whitespace-nowrap">{formatDay(c.lastActivityAt)}</span>,
  },
];

export default async function ContactsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const access = await requireAdmin("/admin/contacts");
  if (access.status !== "ok") return null;
  const { roles } = access.principal;

  if (!isMarketConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <div className="mt-6">
          <EmptyState title="Storage is not configured" />
        </div>
      </section>
    );
  }

  const params = await searchParams;
  const q = one(params, "q", 200);
  const kind = oneOf(one(params, "kind"), CONTACT_KINDS);
  const stage = oneOf(one(params, "stage"), CONTACT_STAGES);
  const tag = one(params, "tag");
  const campaign = one(params, "campaign");
  const page = Number(one(params, "page") ?? "1") || 1;

  const [all, campaigns] = await Promise.all([loadContacts(roles), visibleCampaigns(roles)]);
  // A campaign the user may not see filters to nothing, rather than being ignored.
  const members = campaign ? ((await campaignMemberIds(campaign, roles)) ?? new Set<string>()) : undefined;
  const result = filterContacts(all, { q, kind, stage, tag, campaignMembers: members, page });

  const current = { q, kind, stage, tag, campaign };
  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(current)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `/admin/contacts?${s}` : "/admin/contacts";
  };

  const filtered = Boolean(q || kind || stage || tag || campaign);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <p className="text-sm text-fg-mid">
          {filtered ? `${result.total} of ${all.length}` : `${all.length}`} {all.length === 1 ? "contact" : "contacts"}
        </p>
      </div>

      <FilterBar
        action="/admin/contacts"
        q={q}
        searchLabel="Name, email or organization"
        selects={[
          { name: "kind", label: "Kind", value: kind, options: CONTACT_KINDS.map((k) => ({ value: k, label: label(k) })) },
          {
            name: "stage",
            label: "Stage",
            value: stage,
            options: CONTACT_STAGES.map((s) => ({ value: s, label: label(s) })),
          },
          { name: "tag", label: "Tag", value: tag, options: tagsInUse(all).map((t) => ({ value: t, label: t })) },
          {
            name: "campaign",
            label: "Campaign",
            value: campaign,
            options: campaigns.map((c) => ({ value: c.slug, label: c.name })),
          },
        ]}
      />

      {result.rows.length ? (
        <DataTable rows={result.rows} columns={COLUMNS} rowKey={(c) => c.id} caption="Contacts" />
      ) : (
        <EmptyState title={filtered ? "No contacts match" : "No contacts yet"}>
          {filtered ? "Try fewer words or clear a filter." : "Contacts appear as forms, meetings and imports come in."}
        </EmptyState>
      )}

      <Pager page={result.page} pageCount={result.pageCount} hrefFor={hrefFor} />
    </section>
  );
}
