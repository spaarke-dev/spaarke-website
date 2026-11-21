import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canSeeInvestor, requireAdmin } from "@/lib/market/auth";
import { contactMemberships, contactTimeline, visibleContact } from "@/lib/market/queries";
import type { Activity } from "@/lib/market/types";
import { Badge } from "@/components/admin/Badge";
import { EmptyState } from "@/components/admin/EmptyState";
import { ContactEditForm } from "@/components/admin/ContactEditForm";
import { LogActivityForm } from "@/components/admin/LogActivityForm";
import { MergeContact } from "@/components/admin/MergeContact";
import { DeleteContact } from "@/components/admin/DeleteContact";
import { ArrowLeft20Regular } from "@/components/admin/icons";
import { activityLabel, formatDay, formatWhen, label } from "@/components/admin/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Contact" };

type Params = { id: string };
type SearchParams = Record<string, string | string[] | undefined>;

/** Only links to Outlook on the web or a Microsoft host are shown as links. */
function outlookLink(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)(office\.com|office365\.com|outlook\.com|microsoft\.com)$/.test(u.hostname)
      ? url
      : null;
  } catch {
    return null;
  }
}

function TimelineItem({ a }: { a: Activity }) {
  const link = outlookLink(a.webLink);
  const summary = a.summary && a.summary !== activityLabel(a.type) ? a.summary : null;
  return (
    <li className="border-t border-line py-3 first:border-t-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-medium">{activityLabel(a.type)}</span>
        <span className="text-xs text-fg-mid">{formatWhen(a.occurredAt)}</span>
      </div>
      {a.subject ? <div className="mt-1 text-sm [overflow-wrap:anywhere]">{a.subject}</div> : null}
      {summary ? <div className="mt-1 text-sm text-fg-mid [overflow-wrap:anywhere]">{summary}</div> : null}
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-fg-low">
        {a.campaignSlug ? <span>Campaign: {a.campaignSlug}</span> : null}
        {a.utm?.campaign ? <span>UTM: {a.utm.campaign}</span> : null}
        {a.mailbox ? <span>Mailbox: {a.mailbox}</span> : null}
        {a.visibility === "investor" ? <span>Investor only</span> : null}
        {link ? (
          <a href={link} target="_blank" rel="noreferrer noopener" className="text-spaarke-blue hover:underline">
            Open in Outlook
          </a>
        ) : null}
      </div>
    </li>
  );
}

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="w-28 shrink-0 text-xs text-fg-mid sm:pt-0.5">{name}</dt>
      <dd className="min-w-0 text-sm [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const access = await requireAdmin(`/admin/contacts/${encodeURIComponent(id)}`);
  if (access.status !== "ok") return null;
  const { roles } = access.principal;

  // An investor contact is "not found" without the role, so the page does not reveal it exists.
  const contact = await visibleContact(id, roles);
  if (!contact) notFound();

  const sp = await searchParams;
  const after = typeof sp.after === "string" ? sp.after : undefined;
  const [timeline, memberships] = await Promise.all([
    contactTimeline(contact.id, roles, { after }),
    contactMemberships(contact.id, roles),
  ]);
  const title = contact.name || contact.email;

  return (
    <article className="space-y-8">
      <div>
        <Link href="/admin/contacts" className="inline-flex items-center gap-1 text-sm text-fg-mid hover:underline">
          <ArrowLeft20Regular aria-hidden /> Contacts
        </Link>
        <h1 className="mt-3 text-2xl font-semibold [overflow-wrap:anywhere]">{title}</h1>
        <p className="mt-1 text-sm text-fg-mid [overflow-wrap:anywhere]">
          {[contact.title, contact.organizationName].filter(Boolean).join(", ")}
          {contact.name ? `${contact.title || contact.organizationName ? " · " : ""}${contact.email}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{label(contact.kind)}</Badge>
          <Badge tone="blue">{label(contact.stage)}</Badge>
          {contact.visibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
          {contact.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="min-w-0 space-y-4" aria-labelledby="timeline">
          <h2 id="timeline" className="text-lg font-semibold">
            Timeline
          </h2>
          <LogActivityForm contactId={contact.id} />
          {timeline.rows.length ? (
            <ol className="rounded-lg border border-line bg-surface px-4">
              {timeline.rows.map((a) => (
                <TimelineItem key={a.id} a={a} />
              ))}
            </ol>
          ) : (
            <EmptyState title={after ? "No older activity" : "No activity yet"} />
          )}
          <div className="flex justify-between text-sm">
            {after ? (
              <Link href={`/admin/contacts/${contact.id}`} className="text-fg-mid hover:underline">
                Newest
              </Link>
            ) : (
              <span />
            )}
            {timeline.next ? (
              <Link href={`/admin/contacts/${contact.id}?after=${timeline.next}`} className="text-fg-mid hover:underline">
                Older
              </Link>
            ) : null}
          </div>
        </section>

        <aside className="min-w-0 space-y-8">
          <section aria-labelledby="profile" className="space-y-3">
            <h2 id="profile" className="text-lg font-semibold">
              Profile
            </h2>
            <dl className="space-y-2">
              <Field name="Email">{contact.email}</Field>
              <Field name="Title">{contact.title}</Field>
              <Field name="Organization">{contact.organizationName}</Field>
              <Field name="LinkedIn">
                {contact.linkedinUrl ? (
                  <a href={contact.linkedinUrl} target="_blank" rel="noreferrer noopener" className="hover:underline">
                    {contact.linkedinUrl.replace(/^https:\/\/(www\.)?/, "")}
                  </a>
                ) : null}
              </Field>
              <Field name="Phone">{contact.phone}</Field>
              <Field name="Owner">{contact.owner}</Field>
              <Field name="First activity">{contact.source ? activityLabel(contact.source) : null}</Field>
              <Field name="Added">{formatDay(contact.createdAt)}</Field>
              <Field name="Last activity">{formatDay(contact.lastActivityAt)}</Field>
              <Field name="Edited by hand">
                {contact.editedFields.length ? contact.editedFields.map((f) => label(f)).join(", ") : null}
              </Field>
            </dl>
            <ContactEditForm
              contact={{
                id: contact.id,
                name: contact.name,
                title: contact.title,
                linkedinUrl: contact.linkedinUrl,
                phone: contact.phone,
                kind: contact.kind,
                stage: contact.stage,
                tags: contact.tags,
                owner: contact.owner,
                visibility: contact.visibility,
              }}
              canSetVisibility={canSeeInvestor(access.principal)}
            />
          </section>

          <section aria-labelledby="campaigns" className="space-y-3">
            <h2 id="campaigns" className="text-lg font-semibold">
              Campaigns
            </h2>
            {memberships.length ? (
              <ul className="space-y-2">
                {memberships.map((m) => (
                  <li key={m.campaignSlug} className="rounded-lg border border-line bg-surface p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{m.campaignName}</span>
                      <Badge tone="blue">{label(m.statusOverride ?? m.status)}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-fg-mid">
                      {[m.group, m.lastActivityAt ? `Last activity ${formatDay(m.lastActivityAt)}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-fg-mid">Not in any campaign.</p>
            )}
          </section>

          <section aria-labelledby="followups" className="space-y-3">
            <h2 id="followups" className="text-lg font-semibold">
              Follow-ups
            </h2>
            <p className="text-sm text-fg-mid">Follow-ups for this contact will show here.</p>
          </section>

          <section aria-labelledby="manage" className="space-y-4 border-t border-line pt-6">
            <h2 id="manage" className="text-lg font-semibold">
              Merge or delete
            </h2>
            <MergeContact contactId={contact.id} label={title} />
            <DeleteContact contactId={contact.id} email={contact.email} />
          </section>
        </aside>
      </div>
    </article>
  );
}
