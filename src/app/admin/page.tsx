import Link from "next/link";
import { requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { newContacts, recentActivity, type ActivityRow, type ContactRow } from "@/lib/market/queries";
import { Badge } from "@/components/admin/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { activityLabel, formatDay, formatWhen, label } from "@/components/admin/format";
import { FollowUpStatus } from "@/components/admin/FollowUpStatus";
import { dueForHome, type DueRow } from "@/lib/market/followup-admin";
import { listTriage } from "@/lib/market/triage";

export const dynamic = "force-dynamic";

const NEW_CONTACTS_SHOWN = 15;

function ContactCell({ id, name, email }: { id: string; name?: string; email?: string }) {
  return (
    <div className="min-w-0 [overflow-wrap:anywhere]">
      <Link href={`/admin/contacts/${id}`} className="font-medium hover:underline">
        {name || email}
      </Link>
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
  { key: "contact", header: "Contact", cell: (a) => <ContactCell id={a.contactId} name={a.contactName} email={a.contactEmail} /> },
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

const FOLLOWUPS_SHOWN = 50;

function dueDay(d: string): string {
  return formatDay(`${d}T12:00:00Z`);
}

const FOLLOWUP_COLUMNS: Column<DueRow>[] = [
  {
    key: "due",
    header: "Due",
    cell: (f) => (
      <span className="flex flex-wrap items-center gap-1 whitespace-nowrap">
        {dueDay(f.dueDate)}
        {f.overdue ? <Badge tone="amber">Overdue</Badge> : null}
      </span>
    ),
  },
  {
    key: "what",
    header: "Follow-up",
    cell: (f) => (
      <div className="min-w-0 [overflow-wrap:anywhere]">
        <div className="font-medium">{f.title}</div>
        <div className="text-xs text-fg-mid">
          <Link href={`/admin/contacts/${f.contactId}`} className="hover:underline">
            {f.contactName || f.contactEmail}
          </Link>
          {f.campaignSlug ? <span className="md:hidden"> · {f.campaignSlug}</span> : null}
        </div>
      </div>
    ),
  },
  { key: "campaign", header: "Campaign", className: "hidden md:table-cell", cell: (f) => f.campaignSlug ?? "" },
  {
    key: "status",
    header: "Status",
    cell: (f) => <FollowUpStatus key={f.status} contactId={f.contactId} id={f.id} status={f.status} title={f.title} />,
  },
];

const CONTACT_COLUMNS: Column<ContactRow>[] = [
  { key: "contact", header: "Contact", cell: (c) => <ContactCell id={c.id} name={c.name} email={c.email} /> },
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

  const [activity, fresh, due, triage] = await Promise.all([
    recentActivity(roles),
    newContacts(roles),
    dueForHome(roles),
    listTriage(roles),
  ]);
  const triageMessages = triage.reduce((n, t) => n + t.messages.length, 0);
  const overdue = due.filter((f) => f.overdue).length;

  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-semibold">Market access</h1>

      <div>
        <h2 className="text-lg font-semibold">
          Follow-ups due
          {due.length ? (
            <span className="font-normal text-fg-mid">
              {" "}
              ({due.length}
              {overdue ? `, ${overdue} overdue` : ""})
            </span>
          ) : null}
        </h2>
        <div className="mt-3">
          {due.length ? (
            <DataTable rows={due.slice(0, FOLLOWUPS_SHOWN)} columns={FOLLOWUP_COLUMNS} rowKey={(f) => f.id} caption="Follow-ups due" />
          ) : (
            <EmptyState title="Nothing due today or overdue" />
          )}
          {due.length > FOLLOWUPS_SHOWN ? (
            <p className="mt-2 text-xs text-fg-mid">Showing the oldest {FOLLOWUPS_SHOWN}.</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-4">
          <h2 className="font-medium">
            <Link href="/admin/triage" className="hover:underline">
              Triage
            </Link>
          </h2>
          <p className="mt-1 text-sm text-fg-mid">
            {triage.length
              ? `${triage.length} new ${triage.length === 1 ? "sender" : "senders"} waiting, ${triageMessages} ${triageMessages === 1 ? "message" : "messages"}.`
              : "No new senders waiting."}
          </p>
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
