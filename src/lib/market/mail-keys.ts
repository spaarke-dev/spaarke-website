import { emailHash, sha256 } from "@/lib/market/keys";

/**
 * Keys shared by the mail sync (task 042) and triage (task 043), so an email
 * logged by either one has the same idempotency key and is never logged twice.
 */

/** The activity source for mail read through Graph. */
export const SYNC_SOURCE = "graph";

/** A message's key: the internet message ID when Graph gives one, so one message seen in two mailboxes is one key. */
export function messageKey(internetMessageId: string | undefined, mailboxId: string, graphId: string): string {
  return sha256(internetMessageId ? `imid:${internetMessageId}` : `graph:${mailboxId}:${graphId}`).slice(0, 32);
}

/** The source ID for one email activity. No address in it: the counterpart is a hash slice. */
export function emailSourceId(type: string, key: string, counterpart?: string): string {
  return counterpart ? `${type}:${key}:${emailHash(counterpart).slice(0, 16)}` : `${type}:${key}`;
}
