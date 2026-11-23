import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { isFreeMailDomain } from "@/lib/market/keys";
import { listTriage } from "@/lib/market/triage";
import { Badge } from "@/components/admin/Badge";
import { EmptyState } from "@/components/admin/EmptyState";
import { TriageActions } from "@/components/admin/TriageActions";
import { formatWhen } from "@/components/admin/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Triage" };

const SHOWN = 5;

export default async function TriagePage() {
  const access = await requireAdmin("/admin/triage");
  if (access.status !== "ok") return null;

  if (!isMarketConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Triage</h1>
        <div className="mt-6">
          <EmptyState title="Storage is not configured" />
        </div>
      </section>
    );
  }

  const senders = await listTriage(access.principal.roles);
  const total = senders.reduce((n, s) => n + s.messages.length, 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Triage</h1>
        <p className="text-sm text-fg-mid">
          {senders.length} {senders.length === 1 ? "sender" : "senders"}, {total} {total === 1 ? "message" : "messages"}
        </p>
      </div>
      <p className="text-sm text-fg-mid">
        Mail from people who are not contacts yet, sent to a shared inbox that queues new senders (see{" "}
        <Link href="/admin/mailboxes" className="underline">
          Mailboxes
        </Link>
        ). Nothing here is a contact until you accept it. Accepting adds the sender and logs these messages on their timeline;
        dismissing stops them from being queued again.
      </p>

      {senders.length ? (
        <ul className="space-y-4">
          {senders.map((s) => (
            <li key={s.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="min-w-0 [overflow-wrap:anywhere]">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{s.name ?? s.sender}</h2>
                  {s.visibility === "investor" ? <Badge tone="amber">Investor only</Badge> : null}
                </div>
                {s.name ? <p className="text-sm text-fg-mid">{s.sender}</p> : null}
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {s.messages.slice(0, SHOWN).map((m) => (
                  <li key={m.key} className="flex flex-wrap gap-x-2 [overflow-wrap:anywhere]">
                    <span className="text-fg-mid">{formatWhen(m.receivedAt)}</span>
                    {m.webLink ? (
                      <a href={m.webLink} target="_blank" rel="noreferrer" className="hover:underline">
                        {m.subject ?? "(no subject)"}
                      </a>
                    ) : (
                      <span>{m.subject ?? "(no subject)"}</span>
                    )}
                  </li>
                ))}
              </ul>
              {s.messages.length > SHOWN ? (
                <p className="mt-1 text-xs text-fg-mid">and {s.messages.length - SHOWN} earlier</p>
              ) : null}
              <div className="mt-3">
                <TriageActions id={s.id} sender={s.sender} domain={s.domain} freeMail={isFreeMailDomain(s.domain)} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nothing waiting">New senders to a shared inbox appear here after the next mail sync.</EmptyState>
      )}
    </section>
  );
}
