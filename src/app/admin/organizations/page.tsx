import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { filterOrganizations, loadOrganizations, type OrgRow } from "@/lib/market/org-admin";
import { Badge } from "@/components/admin/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { FilterBar } from "@/components/admin/FilterBar";
import { Pager } from "@/components/admin/Pager";
import { formatDay, label } from "@/components/admin/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Organizations" };

type SearchParams = Record<string, string | string[] | undefined>;

function one(params: SearchParams, name: string, max = 200): string | undefined {
  const v = params[name];
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s ? s.slice(0, max) : undefined;
}

const COLUMNS: Column<OrgRow>[] = [
  {
    key: "org",
    header: "Organization",
    cell: (o) => (
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/organizations/${encodeURIComponent(o.id)}`} className="font-medium hover:underline">
            {o.name}
          </Link>
          {o.visibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
        </div>
        <div className="break-all text-xs text-fg-mid">{[o.domain, ...o.otherDomains].filter(Boolean).join(", ")}</div>
      </div>
    ),
  },
  { key: "contacts", header: "Contacts", className: "text-right", cell: (o) => o.contactCount },
  { key: "kind", header: "Kind", className: "hidden md:table-cell", cell: (o) => (o.kind ? <Badge>{label(o.kind)}</Badge> : "") },
  {
    key: "last",
    header: "Last activity",
    className: "hidden sm:table-cell",
    cell: (o) => <span className="whitespace-nowrap">{formatDay(o.lastActivityAt)}</span>,
  },
];

export default async function OrganizationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const access = await requireAdmin("/admin/organizations");
  if (access.status !== "ok") return null;

  if (!isMarketConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Organizations</h1>
        <div className="mt-6">
          <EmptyState title="Storage is not configured" />
        </div>
      </section>
    );
  }

  const params = await searchParams;
  const q = one(params, "q");
  const page = Number(one(params, "page") ?? "1") || 1;
  const all = await loadOrganizations(access.principal.roles);
  const result = filterOrganizations(all, { q, page });

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `/admin/organizations?${s}` : "/admin/organizations";
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Organizations</h1>
        <p className="text-sm text-fg-mid">
          {q ? `${result.total} of ${all.length}` : `${all.length}`} {all.length === 1 ? "organization" : "organizations"}
        </p>
      </div>

      <p className="max-w-3xl text-sm text-fg-mid">
        Contacts are grouped by the domain of their email. Personal addresses such as Gmail never form an organization.
        To group a company that writes from several domains, open it and add the other domain.
      </p>

      <FilterBar action="/admin/organizations" q={q} searchLabel="Name, domain or website" selects={[]} />

      {result.rows.length ? (
        <DataTable rows={result.rows} columns={COLUMNS} rowKey={(o) => o.id} caption="Organizations" />
      ) : (
        <EmptyState title={q ? "No organizations match" : "No organizations yet"}>
          {q ? "Try fewer words." : "Organizations appear as contacts with company email addresses come in."}
        </EmptyState>
      )}

      <Pager page={result.page} pageCount={result.pageCount} hrefFor={hrefFor} />
    </section>
  );
}
