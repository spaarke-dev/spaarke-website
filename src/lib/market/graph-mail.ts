import { ClientSecretCredential } from "@azure/identity";
import { normalizeEmail } from "@/lib/market/keys";

/**
 * Mail metadata from Microsoft Graph for the mailbox sync (task 040, FR-07).
 *
 * It reuses the /meet app registration (open question 1): app-only
 * credentials whose mail access comes only from Exchange RBAC for
 * Applications, scoped to the synced mailboxes
 * (docs/market-access-mailboxes.md). A mailbox outside that scope answers 403,
 * which surfaces as NoMailboxAccess.
 *
 * Only metadata is requested: `$select` names the fields, so no message body
 * crosses the wire. The one exception is a non-delivery report, whose text is
 * read to find the address that failed and then dropped (NFR-02).
 *
 * The token cache is its own, not the one in src/lib/meet/graph.ts, so the
 * booking code stays untouched and nothing here depends on MEET_HOST.
 */

const GRAPH = "https://graph.microsoft.com/v1.0";
const SCOPE = "https://graph.microsoft.com/.default";
const PAGE_SIZE = 50;

export type MailSettings = { tenantId: string; clientId: string; clientSecret: string };

/** The /meet app's credentials, or null when any is unset (sync then reports "not configured"). */
export function getMailSettings(): MailSettings | null {
  const tenantId = process.env.MEET_GRAPH_TENANT_ID?.trim();
  const clientId = process.env.MEET_GRAPH_CLIENT_ID?.trim();
  const clientSecret = process.env.MEET_GRAPH_CLIENT_SECRET?.trim();
  if (!tenantId || !clientId || !clientSecret) return null;
  return { tenantId, clientId, clientSecret };
}

export class MailGraphError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "MailGraphError";
  }
}

/** The mailbox is not inside the Exchange management scope (yet). */
export class NoMailboxAccess extends MailGraphError {
  constructor(readonly mailbox: string) {
    super("This mailbox is not in the Exchange access scope yet.", 403, "ErrorAccessDenied");
    this.name = "NoMailboxAccess";
  }
}

/** The error a failed Graph call becomes. Pure, so the checks can run it. */
export function graphErrorFor(status: number, code: string | undefined, message: string, mailbox: string): MailGraphError {
  if (status === 403 && (!code || /AccessDenied/i.test(code))) return new NoMailboxAccess(mailbox);
  if (status === 404 && code && /InvalidUser|MailboxNotEnabled|UserNotFound/i.test(code)) {
    return new MailGraphError("No mailbox with this address was found in the tenant.", status, code);
  }
  return new MailGraphError(message, status, code);
}

/** Lets the checks stand in for Graph. */
export type MailDeps = { fetch?: typeof fetch; token?: () => Promise<string> };

let credential: ClientSecretCredential | null = null;
let credentialKey = "";

async function tokenFor(s: MailSettings): Promise<string> {
  const key = `${s.tenantId}:${s.clientId}:${s.clientSecret.length}`;
  if (!credential || credentialKey !== key) {
    // The credential caches tokens until shortly before they expire.
    credential = new ClientSecretCredential(s.tenantId, s.clientId, s.clientSecret);
    credentialKey = key;
  }
  const t = await credential.getToken(SCOPE);
  if (!t) throw new MailGraphError("No Graph token", 401);
  return t.token;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function graphGet<T>(
  s: MailSettings,
  mailbox: string,
  url: string,
  headers: Record<string, string>,
  deps: MailDeps,
): Promise<T> {
  const doFetch = deps.fetch ?? fetch;
  const token = deps.token ? await deps.token() : await tokenFor(s);
  const full = url.startsWith("https://") ? url : `${GRAPH}${url}`;

  // The sync runs in the background, so it can wait out throttling a little longer than /meet does.
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await doFetch(full, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Prefer: 'outlook.timezone="UTC"', ...headers },
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    if ((res.status === 429 || res.status === 503 || res.status === 504) && attempt < 2) {
      const after = Number(res.headers.get("Retry-After") ?? "2");
      await sleep(Math.min(Number.isFinite(after) && after > 0 ? after : 2, 10) * 1000);
      continue;
    }
    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = undefined;
    }
    if (!res.ok) {
      const err = (json as { error?: { code?: string; message?: string } } | undefined)?.error;
      // The message names the call, not the mailbox or the query.
      const path = full
        .replace(GRAPH, "")
        .split("?")[0]
        .replace(/^\/users\/[^/]+/, "/users/{mailbox}")
        .replace(/\/messages\/[^/]+$/, "/messages/{id}");
      throw graphErrorFor(
        res.status,
        err?.code,
        `Graph GET ${path} failed: ${res.status} ${err?.code ?? ""}`.trim(),
        mailbox,
      );
    }
    return json as T;
  }
  throw new MailGraphError("Graph throttled the request three times", 429);
}

// ----- Messages -----

export const MAIL_FOLDERS = ["inbox", "sentitems"] as const;
export type MailFolder = (typeof MAIL_FOLDERS)[number];

export type MailAddress = { address: string; name?: string };

export type MessageMeta = {
  id: string;
  internetMessageId?: string;
  folder: MailFolder;
  from?: MailAddress;
  to: MailAddress[];
  cc: MailAddress[];
  subject?: string;
  receivedAt: string;
  sentAt?: string;
  webLink?: string;
};

type GraphRecipient = { emailAddress?: { address?: string; name?: string } };
export type GraphMessage = {
  id?: string;
  internetMessageId?: string;
  from?: GraphRecipient;
  toRecipients?: GraphRecipient[];
  ccRecipients?: GraphRecipient[];
  subject?: string;
  receivedDateTime?: string;
  sentDateTime?: string;
  webLink?: string;
};

const SELECT = "id,internetMessageId,from,toRecipients,ccRecipients,subject,receivedDateTime,sentDateTime,webLink";

function address(r: GraphRecipient | undefined): MailAddress | undefined {
  // Exchange-internal senders (such as some NDRs) can carry an X.500 address; those are left out.
  const email = normalizeEmail(r?.emailAddress?.address);
  if (!email) return undefined;
  const name = r?.emailAddress?.name?.trim();
  return name && name.toLowerCase() !== email ? { address: email, name } : { address: email };
}

function utc(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const ms = Date.parse(value.endsWith("Z") || /[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : undefined;
}

/** A Graph message as metadata, with addresses normalized. Pure, so the checks can run it. */
export function toMeta(m: GraphMessage, folder: MailFolder): MessageMeta | null {
  const receivedAt = utc(m.receivedDateTime) ?? utc(m.sentDateTime);
  if (!m.id || !receivedAt) return null;
  const list = (rs: GraphRecipient[] | undefined) =>
    (rs ?? []).map(address).filter((a): a is MailAddress => Boolean(a));
  return {
    id: m.id,
    internetMessageId: m.internetMessageId || undefined,
    folder,
    from: address(m.from),
    to: list(m.toRecipients),
    cc: list(m.ccRecipients),
    subject: m.subject?.trim() || undefined,
    receivedAt,
    sentAt: utc(m.sentDateTime),
    webLink: m.webLink || undefined,
  };
}

/**
 * Message metadata in one folder received at or after `sinceIso`, oldest
 * first, following Graph's paging. Stops after `max` messages, so one run
 * stays bounded; the caller checkpoints on the last `receivedAt` it handled.
 */
export async function* listMessagesSince(
  s: MailSettings,
  mailbox: string,
  folder: MailFolder,
  sinceIso: string,
  opts: { max?: number } & MailDeps = {},
): AsyncGenerator<MessageMeta> {
  const box = normalizeEmail(mailbox);
  if (!box) throw new MailGraphError("Not a mailbox address", 400);
  const since = utc(sinceIso);
  if (!since) throw new MailGraphError("Not a checkpoint time", 400);
  const max = opts.max ?? 2000;

  // Spaces encoded as %20, not "+", which OData does not read as a space.
  const query = [
    `$filter=${encodeURIComponent(`receivedDateTime ge ${since}`)}`,
    `$select=${SELECT}`,
    `$orderby=${encodeURIComponent("receivedDateTime asc")}`,
    `$top=${PAGE_SIZE}`,
  ].join("&");
  let url: string | undefined = `/users/${encodeURIComponent(box)}/mailFolders/${folder}/messages?${query}`;
  let seen = 0;
  while (url) {
    const page: { value?: GraphMessage[]; "@odata.nextLink"?: string } = await graphGet(s, box, url, {}, opts);
    for (const m of page.value ?? []) {
      const meta = toMeta(m, folder);
      if (!meta) continue;
      yield meta;
      if (++seen >= max) return;
    }
    const next = page["@odata.nextLink"];
    // Follow only Graph's own links.
    url = next && next.startsWith(`${GRAPH}/`) ? next : undefined;
  }
}

// ----- Non-delivery reports -----

const BOUNCE_SENDER = /^(postmaster|mailer-daemon|mail-daemon)@/i;
const BOUNCE_SUBJECT =
  /^\s*(undeliverable:|undelivered mail returned to sender|delivery status notification \(failure\)|delivery status notification$|mail delivery failed|delivery has failed|returned mail:|failure notice|non[- ]?delivery report)/i;

/** True when a message looks like a non-delivery report. Pure, so the checks can run it. */
export function isBounce(m: Pick<MessageMeta, "from" | "subject" | "folder">): boolean {
  if (m.folder !== "inbox") return false;
  // A delay notice is not a failure.
  if (m.subject && /\(delay\)|delayed/i.test(m.subject)) return false;
  return Boolean((m.from && BOUNCE_SENDER.test(m.from.address)) || (m.subject && BOUNCE_SUBJECT.test(m.subject)));
}

const EMAIL = /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+/gi;

const PATTERNS = [
  /final-recipient:\s*rfc822;\s*<?([^\s<>;]+@[^\s<>;]+)>?/i,
  /original-recipient:\s*rfc822;\s*<?([^\s<>;]+@[^\s<>;]+)>?/i,
  /your message to\s+<?([^\s<>]+@[^\s<>]+?)>?\s+couldn['’]?t be delivered/i,
  /wasn['’]?t delivered to\s+<?([^\s<>]+@[^\s<>]+?)>?[\s.,]/i,
  /delivery has failed to these recipients or groups:\s*(?:[^\n]*\(\s*)?<?([^\s<>()]+@[^\s<>()]+)/i,
  /<([^\s<>]+@[^\s<>]+)>:\s*(?:host|said|recipient address rejected|user unknown|mailbox)/i,
  /could not be delivered to(?: the following)?(?: recipients?)?:?\s*<?([^\s<>]+@[^\s<>]+?)>?[\s.,]/i,
];

function cleanAddress(raw: string): string | null {
  return normalizeEmail(raw.replace(/^mailto:/i, "").replace(/[.,;:)\]>]+$/, ""));
}

/**
 * The address that failed, read from a non-delivery report's text, or null.
 * Known report wordings are tried first; otherwise the one address left after
 * removing the mailbox itself and the reporting systems. Pure, so the checks
 * can run it.
 */
export function bounceRecipientFromText(text: string, mailbox: string): string | null {
  const own = normalizeEmail(mailbox);
  const usable = (a: string | null): a is string => Boolean(a) && a !== own && !BOUNCE_SENDER.test(a!);
  for (const re of PATTERNS) {
    const m = re.exec(text);
    const a = m ? cleanAddress(m[1]) : null;
    if (usable(a)) return a;
  }
  const candidates = new Set<string>();
  for (const m of text.matchAll(EMAIL)) {
    const a = cleanAddress(m[0]);
    if (usable(a) && !/^(no-?reply|do-?not-?reply)@/i.test(a)) candidates.add(a);
  }
  return candidates.size === 1 ? [...candidates][0] : null;
}

/**
 * For a message isBounce flagged: read its text once, return the failed
 * address, and keep nothing else. The body never leaves this function.
 */
export async function bounceRecipient(
  s: MailSettings,
  mailbox: string,
  messageId: string,
  deps: MailDeps = {},
): Promise<string | null> {
  const box = normalizeEmail(mailbox);
  if (!box) throw new MailGraphError("Not a mailbox address", 400);
  const m = await graphGet<{ body?: { content?: string } }>(
    s,
    box,
    `/users/${encodeURIComponent(box)}/messages/${encodeURIComponent(messageId)}?$select=body`,
    { Prefer: 'outlook.timezone="UTC", outlook.body-content-type="text"' },
    deps,
  );
  // Read the first 20,000 characters: the failed address is always near the top.
  return bounceRecipientFromText((m.body?.content ?? "").slice(0, 20_000), box);
}
