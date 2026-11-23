"use client";

import Link from "next/link";
import { useState } from "react";
import { BUTTON, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

const SMALL = "h-8 px-3 text-xs";

type Result = { contactId?: string; activities?: number; dismissed?: number; domain?: string };

/** Accept, link to a contact, or dismiss one sender waiting in triage. */
export function TriageActions({
  id,
  sender,
  domain,
  freeMail,
}: {
  id: string;
  sender: string;
  domain: string;
  /** A free-mail domain cannot be dismissed as a whole. */
  freeMail: boolean;
}) {
  const { send, busy, error } = useAdminRequest();
  const [linking, setLinking] = useState(false);
  const [done, setDone] = useState<{ text: string; contactId?: string } | null>(null);
  const url = `/api/admin/triage/${id}`;

  async function act(body: Record<string, string>, describe: (r: Result) => string) {
    setDone(null);
    // No refresh: the card stays, showing what happened and a link to the contact; the list is current on the next visit.
    const r = await send<Result>(url, "POST", body, { refresh: false });
    if (r) setDone({ text: describe(r), contactId: r.contactId });
  }

  const messages = (n = 0) => `${n} ${n === 1 ? "message" : "messages"}`;

  async function onLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (email) await act({ action: "link", email }, (r) => `Linked; ${messages(r.activities)} added to the contact.`);
  }

  if (done) {
    return (
      <p role="status" className="text-sm text-fg-mid">
        {done.text}{" "}
        {done.contactId ? (
          <Link href={`/admin/contacts/${done.contactId}`} className="underline">
            Open the contact
          </Link>
        ) : null}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`${BUTTON} ${SMALL}`}
          disabled={busy}
          onClick={() => act({ action: "accept" }, (r) => `Added as a contact with ${messages(r.activities)}.`)}
        >
          Accept
        </button>
        <button type="button" className={`${QUIET} ${SMALL}`} disabled={busy} onClick={() => setLinking((v) => !v)}>
          Link to a contact
        </button>
        <button
          type="button"
          className={`${QUIET} ${SMALL}`}
          disabled={busy}
          onClick={() => act({ action: "dismiss", scope: "sender" }, (r) => `Dismissed ${messages(r.dismissed)}; ${sender} will not be queued again.`)}
        >
          Dismiss sender
        </button>
        {freeMail ? null : (
          <button
            type="button"
            className={`${QUIET} ${SMALL}`}
            disabled={busy}
            onClick={() => {
              if (!window.confirm(`Dismiss everyone at ${domain}? Mail from that domain will not be queued again.`)) return;
              void act({ action: "dismiss", scope: "domain" }, (r) => `Dismissed ${messages(r.dismissed)} from ${r.domain}; the domain will not be queued again.`);
            }}
          >
            Dismiss {domain}
          </button>
        )}
      </div>
      {linking ? (
        <form onSubmit={onLink} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-fg-mid">
            The contact&apos;s email address; {sender} becomes another address of theirs
            <input name="email" type="email" required maxLength={254} autoComplete="off" className={FIELD} />
          </label>
          <button type="submit" className={`${BUTTON} ${SMALL}`} disabled={busy}>
            Link
          </button>
        </form>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
