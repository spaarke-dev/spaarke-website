import { getTable, statusOf } from "@/lib/market/tables";
import { emailDomain } from "@/lib/market/keys";
import { findContactByEmail, isTombstoned } from "@/lib/market/contacts";
import { attachEmailLink, hasActivity, recordActivity } from "@/lib/market/activity";
import { enabledMailboxes, recordSync, type Mailbox } from "@/lib/market/mailboxes";
import {
  bounceRecipient,
  isBounce,
  listMessagesSince,
  MailGraphError,
  type MailDeps,
  type MailFolder,
  type MailSettings,
  type MessageMeta,
} from "@/lib/market/graph-mail";
import { listContactFollowUps } from "@/lib/market/followups";
import { changeFollowUp } from "@/lib/market/followup-admin";
import { recomputeAllCampaigns } from "@/lib/market/results";
import { cleanupDismissed, isBlocked, queueTriage } from "@/lib/market/triage";
import { emailSourceId, messageKey, SYNC_SOURCE } from "@/lib/market/mail-keys";
import type { Contact } from "@/lib/market/types";

/**
 * The mail sync (FR-07, task 042). For each enabled mailbox, one at a time,
 * it reads message metadata since that mailbox's checkpoints and:
 *
 * - logs `email.sent` (each recipient) and `email.received` (the sender) for
 *   every counterpart who is already a contact;
 * - logs `email.bounced` against the failed address of a non-delivery report;
 * - in a `capture-new` mailbox, queues inbound mail from unknown senders for
 *   triage (task 043); in `known-only`, ignores it and stores nothing;
 * - closes follow-ups: an email sent after a follow-up was created marks it
 *   `sent`, and their reply after that marks it `replied` (FR-11).
 *
 *   MaSyncState  partition: mailbox ID   row key: folder   checkpoint
 *
 * Each run starts a few minutes before the checkpoint, so a message at the
 * boundary is never missed; the activity log's idempotency keys make the
 * repeats free. A run stops at its deadline and carries on next time.
 *
 * Source IDs use the internet message ID, not the mailbox, so one message seen
 * in two synced mailboxes is logged once.
 */

/** A mailbox with no checkpoint starts this far back. */
export const FIRST_LOOKBACK_DAYS = 30;
const OVERLAP_MS = 5 * 60_000;
const SENT_BEFORE_INBOX: readonly MailFolder[] = ["sentitems", "inbox"];
const AUTOMATED = /^(no-?reply|do-?not-?reply|donotreply|postmaster|mailer-daemon|bounces?|notifications?)([@+._-])/i;

export type FolderSummary = { messages: number; checkpoint?: string; complete: boolean };

export type MailboxSummary = {
  /** The mailbox ID (its address hash), never the address. */
  id: string;
  ok: boolean;
  error?: string;
  messages: number;
  sent: number;
  received: number;
  bounced: number;
  /** Bounces whose failed address could not be read or is not a contact. */
  bouncesUnmatched: number;
  triaged: number;
  duplicates: number;
  /** Messages an import had already logged, whose entries gained the Outlook link. */
  linked: number;
  followUpsClosed: number;
  /** False when the deadline stopped it; the next run continues. */
  complete: boolean;
};

export type SyncSummary = {
  mailboxes: MailboxSummary[];
  /** Mailboxes not reached before the deadline. */
  deferred: number;
  recomputed?: { members: number; changed: number };
  /** Dismissed triage entries past 30 days, deleted this run (task 043). */
  triageCleaned?: number;
};

export type SyncOptions = MailDeps & {
  settings: MailSettings;
  /** Epoch ms after which no new message is started. */
  deadline: number;
  now?: Date;
  /** Per folder per run (default 2,000). */
  max?: number;
};

// ---- Checkpoints ----

type StateEntity = { partitionKey: string; rowKey: string; checkpoint: string; updatedAt: string };

export async function getCheckpoint(mailboxId: string, folder: MailFolder): Promise<string | null> {
  const t = await getTable("syncState");
  if (!t) return null;
  try {
    return (await t.getEntity<StateEntity>(mailboxId, folder)).checkpoint || null;
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

async function saveCheckpoint(mailboxId: string, folder: MailFolder, checkpoint: string): Promise<void> {
  const t = await getTable("syncState");
  if (!t) return;
  await t.upsertEntity<StateEntity>(
    { partitionKey: mailboxId, rowKey: folder, checkpoint, updatedAt: new Date().toISOString() },
    "Replace",
  );
}

/** How far back "Read again" may go. Graph's search stays quick well past this. */
export const REREAD_MAX_DAYS = 90;

/**
 * A "Read again from" date: a `yyyy-mm-dd` day, not in the future and no
 * more than REREAD_MAX_DAYS back. Returns the start of that day in UTC, or an
 * error message. Pure.
 */
export function parseRereadFrom(value: unknown, now: Date): Date | string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Pick a date";
  const ms = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(ms)) return "Pick a date";
  if (ms > now.getTime()) return "The date is in the future";
  if (ms < now.getTime() - REREAD_MAX_DAYS * 86_400_000) return `Pick a date within the last ${REREAD_MAX_DAYS} days`;
  return new Date(ms);
}

/**
 * Move a mailbox's checkpoints back, so the next runs read its mail again
 * from `from`. Mail already logged is skipped as a duplicate; mail with people
 * who became contacts since is logged now, and imported entries gain their
 * Outlook links. A checkpoint already earlier than `from` is left alone.
 * Returns the folders moved.
 */
export async function rereadFrom(mailboxId: string, from: Date): Promise<MailFolder[]> {
  const target = new Date(from.getTime() + OVERLAP_MS).toISOString();
  const moved: MailFolder[] = [];
  for (const folder of SENT_BEFORE_INBOX) {
    const current = await getCheckpoint(mailboxId, folder);
    if (current && current <= target) continue;
    await saveCheckpoint(mailboxId, folder, target);
    moved.push(folder);
  }
  return moved;
}

/** Where a folder's next run starts: a little before the checkpoint, or FIRST_LOOKBACK_DAYS back. Pure. */
export function startFrom(checkpoint: string | null, now: Date): string {
  const ms = checkpoint ? Date.parse(checkpoint) - OVERLAP_MS : now.getTime() - FIRST_LOOKBACK_DAYS * 86_400_000;
  return new Date(ms).toISOString();
}

// ---- Pure helpers ----

/**
 * The other parties on a message, seen from the mailbox: the recipients of
 * mail it sent, the sender of mail it received. The mailbox itself is never a
 * counterpart. Pure, so the checks can run it.
 */
export function counterparts(m: Pick<MessageMeta, "folder" | "from" | "to" | "cc">, mailbox: string): string[] {
  const own = mailbox.toLowerCase();
  const list = m.folder === "sentitems" ? [...m.to, ...m.cc].map((a) => a.address) : m.from ? [m.from.address] : [];
  return [...new Set(list.filter((a) => a !== own))];
}

/** Whether an unknown sender may go to triage: not automated, not from the mailbox's own domain. Pure. */
export function triageable(sender: string, mailbox: string): boolean {
  if (AUTOMATED.test(sender)) return false;
  return emailDomain(sender) !== emailDomain(mailbox.toLowerCase());
}

export { emailSourceId, SYNC_SOURCE };

// ---- Follow-ups (FR-11) ----

/**
 * Close a contact's follow-ups on new mail. The change is dated at the email,
 * not the run, so `closedAt` is when the email went out and a reply is
 * compared with that; the audit entry and the `followup.done` activity carry
 * the same time, with `system` as who.
 */
export async function closeFollowUps(contactId: string, type: "email.sent" | "email.received", at: string): Promise<number> {
  const when = new Date(at);
  let closed = 0;
  for (const f of await listContactFollowUps(contactId)) {
    if (type === "email.sent" && (f.status === "todo" || f.status === "drafted") && at > f.createdAt) {
      if (await changeFollowUp(contactId, f.id, { status: "sent" }, "system", when)) closed++;
    } else if (type === "email.received" && f.status === "sent" && at > (f.closedAt ?? f.createdAt)) {
      if (await changeFollowUp(contactId, f.id, { status: "replied" }, "system", when)) closed++;
    }
  }
  return closed;
}

// ---- One mailbox ----

type RunState = { contacts: Map<string, Contact | null> };

async function contactFor(address: string, run: RunState): Promise<Contact | null> {
  if (!run.contacts.has(address)) run.contacts.set(address, await findContactByEmail(address));
  return run.contacts.get(address) ?? null;
}

async function handleMessage(m: MessageMeta, mailbox: Mailbox, s: MailboxSummary, opts: SyncOptions, run: RunState): Promise<void> {
  const now = opts.now ?? new Date();
  const key = messageKey(m.internetMessageId, mailbox.id, m.id);

  if (isBounce(m)) {
    const sourceId = emailSourceId("email.bounced", key);
    if (await hasActivity(SYNC_SOURCE, sourceId)) {
      s.duplicates++;
      return;
    }
    const failed = await bounceRecipient(opts.settings, mailbox.address, m.id, opts);
    const contact = failed ? await contactFor(failed, run) : null;
    if (!contact) {
      s.bouncesUnmatched++;
      return;
    }
    const linked = await attachEmailLink({
      contactId: contact.id,
      type: "email.bounced",
      source: SYNC_SOURCE,
      sourceId,
      occurredAt: m.receivedAt,
      webLink: m.webLink,
      subject: m.subject,
      mailbox: mailbox.address,
    });
    if (linked) {
      s.linked++;
      return;
    }
    const r = await recordActivity({
      type: "email.bounced",
      source: SYNC_SOURCE,
      sourceId,
      occurredAt: m.receivedAt,
      contactId: contact.id,
      subject: m.subject,
      webLink: m.webLink,
      mailbox: mailbox.address,
    });
    if (r.status === "recorded") s.bounced++;
    else if (r.status === "duplicate") s.duplicates++;
    return;
  }

  const type = m.folder === "sentitems" ? "email.sent" : "email.received";
  const at = m.folder === "sentitems" ? (m.sentAt ?? m.receivedAt) : m.receivedAt;
  for (const address of counterparts(m, mailbox.address)) {
    const contact = await contactFor(address, run);
    if (!contact) {
      // Unknown: ignored, except inbound mail to a capture-new mailbox.
      if (mailbox.mode === "capture-new" && type === "email.received" && triageable(address, mailbox.address)) {
        if (!(await isBlocked(address)) && !(await isTombstoned(address))) {
          const queued = await queueTriage(
            { sender: address, name: m.from?.name, subject: m.subject, receivedAt: at, webLink: m.webLink, mailboxId: mailbox.id, mailbox: mailbox.address, messageKey: key },
            now,
          );
          if (queued) s.triaged++;
        }
      }
      continue;
    }
    const sourceId = emailSourceId(type, key, address);
    if (await hasActivity(SYNC_SOURCE, sourceId)) {
      s.duplicates++;
      continue;
    }
    // Mail an import logged without a link (TLTF): add the link, do not log it twice.
    const linked = await attachEmailLink({
      contactId: contact.id,
      type,
      source: SYNC_SOURCE,
      sourceId,
      occurredAt: new Date(at).toISOString(),
      webLink: m.webLink,
      subject: m.subject,
      mailbox: mailbox.address,
    });
    if (linked) {
      s.linked++;
      continue;
    }
    const r = await recordActivity({
      type,
      source: SYNC_SOURCE,
      sourceId,
      occurredAt: at,
      contactId: contact.id,
      subject: m.subject,
      webLink: m.webLink,
      mailbox: mailbox.address,
    });
    if (r.status === "duplicate") {
      s.duplicates++;
      continue;
    }
    if (r.status !== "recorded") continue;
    if (type === "email.sent") s.sent++;
    else s.received++;
    s.followUpsClosed += await closeFollowUps(contact.id, type, new Date(at).toISOString());
  }
}

/**
 * Sync one mailbox: Sent Items first, then the Inbox, so a follow-up closed
 * by a sent email can be marked replied by an answer in the same run. Each
 * folder's checkpoint moves to the last message handled, also when a later
 * one fails. Throws on a Graph or storage failure; syncAll records it.
 */
export async function syncMailbox(mailbox: Mailbox, opts: SyncOptions): Promise<MailboxSummary> {
  const now = opts.now ?? new Date();
  const s: MailboxSummary = {
    id: mailbox.id,
    ok: true,
    messages: 0,
    sent: 0,
    received: 0,
    bounced: 0,
    bouncesUnmatched: 0,
    triaged: 0,
    duplicates: 0,
    linked: 0,
    followUpsClosed: 0,
    complete: true,
  };
  const run: RunState = { contacts: new Map() };

  for (const folder of SENT_BEFORE_INBOX) {
    if (Date.now() >= opts.deadline) {
      s.complete = false;
      break;
    }
    const since = startFrom(await getCheckpoint(mailbox.id, folder), now);
    let last: string | undefined;
    try {
      for await (const m of listMessagesSince(opts.settings, mailbox.address, folder, since, opts)) {
        await handleMessage(m, mailbox, s, opts, run);
        s.messages++;
        last = m.receivedAt;
        if (Date.now() >= opts.deadline) {
          s.complete = false;
          break;
        }
      }
    } finally {
      if (last) await saveCheckpoint(mailbox.id, folder, last);
    }
    if (!s.complete) break;
  }
  return s;
}

function errorText(err: unknown): string {
  // The Graph client's messages never carry an address or content; anything else stays in the logs.
  if (err instanceof MailGraphError) return err.message;
  return "The sync failed on the site's side. See the site logs.";
}

/**
 * Every enabled mailbox, one at a time, the longest unsynced first. A failure
 * in one is recorded on it and the others carry on. Campaign statuses are
 * derived again when any email was logged.
 */
export async function syncAll(opts: SyncOptions): Promise<SyncSummary> {
  const mailboxes = (await enabledMailboxes()).sort((a, b) => (a.lastSyncAt ?? "").localeCompare(b.lastSyncAt ?? ""));
  const out: SyncSummary = { mailboxes: [], deferred: 0 };
  for (const mailbox of mailboxes) {
    if (Date.now() >= opts.deadline) {
      out.deferred++;
      continue;
    }
    try {
      const s = await syncMailbox(mailbox, opts);
      await recordSync(mailbox.id, {});
      out.mailboxes.push(s);
    } catch (err) {
      const error = errorText(err);
      if (!(err instanceof MailGraphError)) console.error("[sync] mailbox failed:", (err as Error).message);
      await recordSync(mailbox.id, { error });
      out.mailboxes.push({
        id: mailbox.id,
        ok: false,
        error,
        messages: 0,
        sent: 0,
        received: 0,
        bounced: 0,
        bouncesUnmatched: 0,
        triaged: 0,
        duplicates: 0,
        linked: 0,
        followUpsClosed: 0,
        complete: false,
      });
    }
  }
  if (out.mailboxes.some((m) => m.sent + m.received + m.bounced > 0)) {
    out.recomputed = await recomputeAllCampaigns(opts.now);
  }
  try {
    out.triageCleaned = await cleanupDismissed(opts.now);
  } catch (err) {
    // Housekeeping never fails the run; the next run tries again.
    console.error("[sync] triage cleanup failed:", (err as Error).message);
  }
  return out;
}

