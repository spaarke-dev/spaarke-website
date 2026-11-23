import { getTable, statusOf } from "@/lib/market/tables";
import { emailDomain, emailHash, normalizeEmail, sha256 } from "@/lib/market/keys";

/**
 * The triage queue for `capture-new` mailboxes (FR-08, NFR-05): inbound mail
 * from senders who are not contacts yet, waiting for a person to accept, link
 * or dismiss it. Nothing here is a contact.
 *
 *   MaTriage  partition: sender email hash   row key: message key   one queued message
 *             partition: block               row key: sender:<hash> or domain:<domain>
 *
 * Only the sender, display name, subject, time, Outlook link and mailbox are
 * kept. The sync (task 042) queues messages; the page and its actions arrive
 * with task 043.
 */

export const TRIAGE_STATES = ["new", "dismissed"] as const;
export type TriageState = (typeof TRIAGE_STATES)[number];

export type TriageInput = {
  sender: string;
  name?: string;
  subject?: string;
  receivedAt: string;
  webLink?: string;
  mailboxId: string;
  mailbox: string;
  /** Stable per message (see messageKey). */
  messageKey: string;
};

const BLOCK = "block";

function trimTo(value: string | undefined, max: number): string | undefined {
  const v = value?.replace(/\s+/g, " ").trim();
  if (!v) return undefined;
  return v.length > max ? `${v.slice(0, max - 3)}...` : v;
}

/** A message's key: the internet message ID when Graph gives one, so one message seen in two mailboxes is one key. */
export function messageKey(internetMessageId: string | undefined, mailboxId: string, graphId: string): string {
  return sha256(internetMessageId ? `imid:${internetMessageId}` : `graph:${mailboxId}:${graphId}`).slice(0, 32);
}

/** Whether a sender, or their domain, was dismissed for good. */
export async function isBlocked(raw: string): Promise<boolean> {
  const email = normalizeEmail(raw);
  const table = await getTable("triage");
  if (!email || !table) return false;
  for (const rowKey of [`sender:${emailHash(email)}`, `domain:${emailDomain(email)}`]) {
    try {
      await table.getEntity(BLOCK, rowKey);
      return true;
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
  }
  return false;
}

/**
 * Queue one message. Returns false when it was already queued (a repeat sync,
 * or the same message in a second mailbox), so a dismissed entry stays
 * dismissed.
 */
export async function queueTriage(input: TriageInput, now = new Date()): Promise<boolean> {
  const sender = normalizeEmail(input.sender);
  const table = await getTable("triage");
  if (!sender || !table) return false;
  try {
    const row = {
      partitionKey: emailHash(sender),
      rowKey: input.messageKey,
      sender,
      name: trimTo(input.name, 200),
      subject: trimTo(input.subject, 300),
      receivedAt: input.receivedAt,
      webLink: trimTo(input.webLink, 2000),
      mailboxId: input.mailboxId,
      mailbox: input.mailbox,
      state: "new" satisfies TriageState,
      queuedAt: now.toISOString(),
    };
    await table.createEntity(Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined)) as typeof row);
    return true;
  } catch (err) {
    if (statusOf(err) === 409) return false;
    throw err;
  }
}
