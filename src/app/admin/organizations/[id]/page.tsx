import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canSeeInvestor, requireAdmin } from "@/lib/market/auth";
import { loadOrganizations, organizationDetail } from "@/lib/market/org-admin";
import type { ContactRow } from "@/lib/market/queries";
import { Badge } from "@/components/admin/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { OrgEditForm } from "@/components/admin/OrgEditForm";
import { OrgDomains } from "@/components/admin/OrgDomains";
import { ArrowLeft20Regular } from "@/components/admin/icons";
import { activityLabel, formatDay, formatWhen, label } from "@/components/admin/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Organization" };

const CONTACT_COLUMNS: Column<ContactRow>[] = [
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
        <div className="break-all text-xs text-fg-mid">{[c.title, c.name ? c.email : null].filter(Boolean).join(" · ")}</div>
      </div>
    ),
  },
  { key: "stage", header: "Stage", cell: (c) => <Badge tone="blue">{label(c.stage)}</Badge> },
  {
    key: "last",
    header: "Last activity",
    className: "hidden sm:table-cell",
    cell: (c) => <span className="whitespace-nowrap">{formatDay(c.lastActivityAt)}</span>,
  },
];

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="w-28 shrink-0 text-xs text-fg-mid sm:pt-0.5">{name}</dt>
      <dd className="min-w-0 text-sm [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

/** Only web addresses are shown as links. */
function webLink(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const raw = (await params).id;
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    notFound();
  }
  const access = await requireAdmin(`/admin/organizations/${encodeURIComponent(id)}`);
  if (access.status !== "ok") return null;
  const { roles } = access.principal;

  // An investor organization is "not found" without the role, so the page does not reveal it exists.
  const [detail, all] = await Promise.all([organizationDetail(id, roles), loadOrganizations(roles)]);
  if (!detail) notFound();
  const { org, contacts, activity } = detail;
  const website = webLink(org.website);
  const suggestions = all
    .filter((o) => o.id !== org.id && o.domain)
    .map((o) => o.domain as string)
    .slice(0, 500);

  return (
    <article className="space-y-8">
      <div>
        <Link href="/admin/organizations" className="inline-flex items-center gap-1 text-sm text-fg-mid hover:underline">
          <ArrowLeft20Regular aria-hidden /> Organizations
        </Link>
        <h1 className="mt-3 text-2xl font-semibold [overflow-wrap:anywhere]">{org.name}</h1>
        <p className="mt-1 text-sm text-fg-mid">
          {org.contactCount === 1 ? "1 contact" : `${org.contactCount} contacts`}
          {org.lastActivityAt ? ` · last activity ${formatDay(org.lastActivityAt)}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {org.kind ? <Badge>{label(org.kind)}</Badge> : null}
          {org.visibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="contacts" className="space-y-3">
            <h2 id="contacts" className="text-lg font-semibold">
              Contacts
            </h2>
            {contacts.length ? (
              <DataTable rows={contacts} columns={CONTACT_COLUMNS} rowKey={(c) => c.id} caption="Contacts" />
            ) : (
              <EmptyState title="No contacts">Contacts at its domains appear here.</EmptyState>
            )}
          </section>

          <section aria-labelledby="activity" className="space-y-3">
            <h2 id="activity" className="text-lg font-semibold">
              Recent activity
            </h2>
            {activity.length ? (
              <ol className="rounded-lg border border-line bg-surface px-4">
                {activity.map((a) => (
                  <li key={`${a.contactId}-${a.id}`} className="border-t border-line py-3 first:border-t-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-medium">{activityLabel(a.type)}</span>
                      <span className="text-xs text-fg-mid">{formatWhen(a.occurredAt)}</span>
                    </div>
                    <div className="mt-1 text-sm [overflow-wrap:anywhere]">
                      <Link href={`/admin/contacts/${a.contactId}`} className="hover:underline">
                        {a.contactName || a.contactEmail}
                      </Link>
                      {a.subject ? <span className="text-fg-mid">: {a.subject}</span> : null}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="No activity yet" />
            )}
          </section>
        </div>

        <aside className="min-w-0 space-y-8">
          <section aria-labelledby="details" className="space-y-3">
            <h2 id="details" className="text-lg font-semibold">
              Details
            </h2>
            <dl className="space-y-2">
              <Field name="Website">
                {website ? (
                  <a href={website} target="_blank" rel="noreferrer noopener" className="hover:underline">
                    {website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                ) : null}
              </Field>
              <Field name="Kind">{org.kind ? label(org.kind) : null}</Field>
              <Field name="Notes">{org.notes ? <span className="whitespace-pre-line">{org.notes}</span> : null}</Field>
              <Field name="Added">{formatDay(org.createdAt)}</Field>
            </dl>
            <OrgEditForm
              org={{
                id: org.id,
                name: org.name,
                website: org.website,
                kind: org.kind,
                notes: org.notes,
                visibility: org.visibility,
              }}
              canSetVisibility={canSeeInvestor(access.principal)}
            />
          </section>

          <section aria-labelledby="domains" className="space-y-3">
            <h2 id="domains" className="text-lg font-semibold">
              Domains
            </h2>
            <OrgDomains orgId={org.id} ownDomain={org.domain} otherDomains={org.otherDomains} suggestions={suggestions} />
          </section>
        </aside>
      </div>
    </article>
  );
}
