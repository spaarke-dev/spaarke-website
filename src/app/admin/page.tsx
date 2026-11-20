import Link from "next/link";
import { requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { newContacts, recentActivity, type ActivityRow, type ContactRow } from "@/lib/market/queries";
import { Badge } from "@/components/admin/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { activityLabel, formatDay, formatWhen, label } from "@/components/admin/format";

export const dynamic = "force-dynamic";

const NEW_CONTACTS_SHOWN = 15;

function ContactCell({ name, email }: { name?: string; email?: string }) {
  return (
    <div className="min-w-0 [overflow-wrap:anywhere]">
      <div className="font-medium">{name || email}</div>
      {name && email ? <div className="text-xs text-fg-mid">{email}</div> : null}
    </div>
  );
}

const ACTIVITY_COLUMNS: Column<ActivityRow>[] = [
  {
    key: "when",
    header: "When",
    className: "hidden sm:table-cell",
    cell: (a) => <span className="whitespace-nowrap">{formatWhen(a.occurredAt)}</span>,
  },
  { key: "contact", header: "Contact", cell: (a) => <ContactCell name={a.contactName} email={a.contactEmail} /> },
  {
    key: "what",
    header: "Activity",
    cell: (a) => (
      <div>
        <div>{activityLabel(a.type)}</div>
        <div className="text-xs text-fg-mid sm:hidden">{formatWhen(a.occurredAt)}</div>
        {a.summary && a.summary !== activityLabel(a.type) ? (
          <div className="text-xs text-fg-mid [overflow-wrap:anywhere]">{a.summary}</div>
        ) : null}
      </div>
    ),
  },
  {
    key: "campaign",
    header: "Campaign",
    className: "hidden md:table-cell",
    cell: (a) => a.campaignSlug ?? a.utm?.campaign ?? "",
  },
];

const CONTACT_COLUMNS: Column<ContactRow>[] = [
  { key: "contact", header: "Contact", cell: (c) => <ContactCell name={c.name} email={c.email} /> },
  { key: "org", header: "Organization", className: "hidden sm:table-cell", cell: (c) => c.organizationName ?? "" },
  { key: "kind", header: "Kind", className: "hidden md:table-cell", cell: (c) => <Badge>{label(c.kind)}</Badge> },
  {
    key: "source",
    header: "First activity",
    className: "hidden md:table-cell",
    cell: (c) => (c.source ? activityLabel(c.source) : ""),
  },
  { key: "added", header: "Added", cell: (c) => <span className="whitespace-nowrap">{formatDay(c.createdAt)}</span> },
];

export default async function AdminHome() {
  const access = await requireAdmin("/admin");
  if (access.status !== "ok") return null;
  const { roles } = access.principal;

  if (!isMarketConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Market access</h1>
        <div className="mt-6">
          <EmptyState title="Storage is not configured">
            Set STORAGE_ACCOUNT_CONNECTION to read the market access tables.
          </EmptyState>
        </div>
      </section>
    );
  }

  const [activity, fresh] = await Promise.all([recentActivity(roles), newContacts(roles)]);

  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-semibold">Market access</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-4">
          <h2 className="font-medium">Follow-ups</h2>
          <p className="mt-1 text-sm text-fg-mid">Due and overdue follow-ups will show here.</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <h2 className="font-medium">Triage</h2>
          <p className="mt-1 text-sm text-fg-mid">New senders from the shared inbox will show here.</p>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold">
            New contacts this week{fresh.length ? <span className="font-normal text-fg-mid"> ({fresh.length})</span> : null}
          </h2>
          <Link href="/admin/contacts" className="text-sm text-fg-mid hover:underline">
            All contacts
          </Link>
        </div>
        <div className="mt-3">
          {fresh.length ? (
            <DataTable
              rows={fresh.slice(0, NEW_CONTACTS_SHOWN)}
              columns={CONTACT_COLUMNS}
              rowKey={(c) => c.id}
              caption="New contacts this week"
            />
          ) : (
            <EmptyState title="No new contacts in the last 7 days" />
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <div className="mt-3">
          {activity.length ? (
            <DataTable rows={activity} columns={ACTIVITY_COLUMNS} rowKey={(a) => a.id} caption="Recent activity" />
          ) : (
            <EmptyState title="No activity this month or last" />
          )}
        </div>
      </div>
    </section>
  );
}
