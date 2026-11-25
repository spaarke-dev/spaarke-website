import type { Metadata } from "next";
import { canSeeInvestor, requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { listMailboxes, type Mailbox } from "@/lib/market/mailboxes";
import { Badge } from "@/components/admin/Badge";
import { EmptyState } from "@/components/admin/EmptyState";
import { MailboxActions } from "@/components/admin/MailboxActions";
import { MailboxForm } from "@/components/admin/MailboxForm";
import { formatWhen } from "@/components/admin/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mailboxes" };

const GUIDE = "https://github.com/spaarke-dev/spaarke-website/blob/main/docs/market-access-mailboxes.md";

const MODE_LABEL: Record<Mailbox["mode"], string> = {
  "known-only": "Known contacts only",
  "capture-new": "Known contacts, new senders to triage",
};

function Status({ m }: { m: Mailbox }) {
  const line = "flex flex-wrap gap-x-2";
  return (
    <dl className="space-y-1 text-sm">
      <div className={line}>
        <dt className="text-fg-mid">Last sync</dt>
        <dd>{m.lastSyncAt ? formatWhen(m.lastSyncAt) : "Not synced yet"}</dd>
      </div>
      {m.lastError ? (
        <div className={line}>
          <dt className="text-fg-mid">Last error</dt>
          <dd className="text-[#c42b1c] [overflow-wrap:anywhere]">
            {m.lastError}
            {m.lastErrorAt ? <span className="text-fg-mid"> ({formatWhen(m.lastErrorAt)})</span> : null}
            {(m.failStreak ?? 0) > 1 ? <span className="text-fg-mid"> Failed {m.failStreak} runs in a row.</span> : null}
          </dd>
        </div>
      ) : null}
      {m.checkedAt ? (
        <div className={line}>
          <dt className="text-fg-mid">Access check</dt>
          <dd className={m.checkError ? "text-[#c42b1c] [overflow-wrap:anywhere]" : undefined}>
            {m.checkError ?? "Graph can read it"}
            <span className="text-fg-mid"> ({formatWhen(m.checkedAt)})</span>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

export default async function MailboxesPage() {
  const access = await requireAdmin("/admin/mailboxes");
  if (access.status !== "ok") return null;
  const { principal } = access;
  const canSetVisibility = canSeeInvestor(principal);

  if (!isMarketConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Mailboxes</h1>
        <div className="mt-6">
          <EmptyState title="Storage is not configured" />
        </div>
      </section>
    );
  }

  const mailboxes = await listMailboxes();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Mailboxes</h1>
        <p className="text-sm text-fg-mid">
          {mailboxes.length} {mailboxes.length === 1 ? "mailbox" : "mailboxes"}, {mailboxes.filter((m) => m.enabled).length} syncing
        </p>
      </div>

      <div className="rounded-lg border border-line bg-surface-2 p-4 text-sm">
        <p>
          Adding a mailbox here does not give the sync access to it. It must also be a member of the &ldquo;Market access
          sync&rdquo; group in Exchange, which an Exchange admin sets up and which can take an hour or two to apply. Until
          then its sync shows &ldquo;not in the Exchange access scope yet&rdquo; and the other mailboxes keep syncing.
        </p>
        <p className="mt-2">
          <a href={GUIDE} className="underline" target="_blank" rel="noreferrer">
            How to add or remove a mailbox in Exchange
          </a>
        </p>
      </div>

      <MailboxForm canSetVisibility={canSetVisibility} />

      {mailboxes.length ? (
        <ul className="space-y-4">
          {mailboxes.map((m) => (
            <li key={m.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{m.label}</h2>
                    {m.enabled ? null : <Badge tone="amber">Paused</Badge>}
                    {m.visibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
                  </div>
                  {m.label !== m.address ? <p className="text-sm text-fg-mid">{m.address}</p> : null}
                  <p className="text-xs text-fg-mid">
                    {m.kind === "shared" ? "Shared" : "Personal"} · {MODE_LABEL[m.mode]}
                  </p>
                </div>
                <MailboxForm
                  mailbox={{ id: m.id, address: m.address, label: m.label, kind: m.kind, mode: m.mode, visibility: m.visibility }}
                  canSetVisibility={canSetVisibility}
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:items-start">
                <Status m={m} />
                <MailboxActions id={m.id} address={m.address} enabled={m.enabled} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No mailboxes yet">
          Add your own mailbox (personal, known contacts only) and the team inbox (shared, new senders to triage).
        </EmptyState>
      )}
    </section>
  );
}
