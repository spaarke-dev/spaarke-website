import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { BlobServiceClient } from "@azure/storage-blob";
import sgMail from "@sendgrid/mail";
import type { Attribution } from "@/lib/attribution";
import { signatureFromEnv } from "@/lib/meet/emails";

/**
 * The investor overview behind an email address, on /tltf-2026.
 *
 * The PDF is not in this repository (the repository is public). It is a blob in
 * the site's storage account, in a private container, and the site streams it
 * through /api/investor-overview/file only to someone holding a signed link.
 * A visitor gets that link twice: in the response to the form, which starts
 * the download, and in an email, which keeps working for LINK_TTL_DAYS.
 *
 * To replace the PDF, upload a new file over the same blob name; links already
 * sent then serve the new version.
 */

export const CONTAINER = "private-downloads";
export const BLOB_NAME = "investor-overview/spaarke-investor-overview.pdf";
export const DOWNLOAD_FILENAME = "Spaarke Investor Overview.pdf";
/** INVESTOR_OVERVIEW_TABLE overrides it for local testing. */
const TABLE = process.env.INVESTOR_OVERVIEW_TABLE || "InvestorOverviewRequests";
const LINK_TTL_DAYS = 30;
const REQUEST_ID = /^[0-9]{13}-[0-9a-f]{8}$/;

/** Where a request came from; the partition key of its row. */
export const SOURCES = ["tltf-2026"] as const;
export type Source = (typeof SOURCES)[number];
export function isSource(value: unknown): value is Source {
  return typeof value === "string" && (SOURCES as readonly string[]).includes(value);
}

function connectionString(): string | null {
  return process.env.STORAGE_ACCOUNT_CONNECTION || null;
}

function linkSecret(): string | null {
  const s = process.env.DOWNLOAD_LINK_SECRET;
  return s && s.length >= 32 ? s : null;
}

/** True when everything the gate needs is configured. */
export function isConfigured(): boolean {
  return Boolean(connectionString() && linkSecret());
}

export function newRequestId(now = Date.now()): string {
  return `${now}-${randomBytes(4).toString("hex")}`;
}

// ---------------------------------------------------------------------------
// Signed links
// ---------------------------------------------------------------------------

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** A token is the request ID and an expiry, signed. It carries nothing personal. */
export function createDownloadToken(requestId: string, now = Date.now()): string | null {
  const secret = linkSecret();
  if (!secret) return null;
  const payload = `${requestId}.${(now + LINK_TTL_DAYS * 86_400_000).toString(36)}`;
  return `${payload}.${sign(payload, secret)}`;
}

export type TokenCheck = { ok: true; requestId: string } | { ok: false; reason: "invalid" | "expired" };

export function verifyDownloadToken(token: string | null, now = Date.now()): TokenCheck {
  const secret = linkSecret();
  if (!secret || !token || token.length > 200) return { ok: false, reason: "invalid" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid" };
  const [requestId, exp, sig] = parts;
  if (!REQUEST_ID.test(requestId)) return { ok: false, reason: "invalid" };

  const expected = Buffer.from(sign(`${requestId}.${exp}`, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "invalid" };
  }
  const expiresAt = Number.parseInt(exp, 36);
  if (!Number.isFinite(expiresAt) || now > expiresAt) return { ok: false, reason: "expired" };
  return { ok: true, requestId };
}

// ---------------------------------------------------------------------------
// The file
// ---------------------------------------------------------------------------

export async function readPdf(): Promise<Buffer> {
  const cs = connectionString();
  if (!cs) throw new Error("STORAGE_ACCOUNT_CONNECTION is not set.");
  return BlobServiceClient.fromConnectionString(cs)
    .getContainerClient(CONTAINER)
    .getBlobClient(BLOB_NAME)
    .downloadToBuffer();
}

// ---------------------------------------------------------------------------
// The lead
// ---------------------------------------------------------------------------

let tableEnsured = false;

/** Writes the request. Never throws: the visitor still gets the file when storage fails. */
export async function saveRequest(data: {
  requestId: string;
  source: Source;
  email: string;
  ipHash: string;
  attribution?: Attribution | null;
}): Promise<boolean> {
  const cs = connectionString();
  if (!cs) return false;
  const client = TableClient.fromConnectionString(cs, TABLE);
  if (!tableEnsured) {
    try {
      await client.createTable();
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code && code !== 409) console.warn("[investor-overview] createTable failed:", err);
    }
    tableEnsured = true;
  }
  const a = data.attribution;
  try {
    await client.createEntity({
      partitionKey: data.source,
      rowKey: data.requestId,
      email: data.email,
      ipHash: data.ipHash,
      createdAt: new Date().toISOString(),
      entry_referrer: a?.entry_referrer ?? "",
      entry_landing: a?.entry_landing ?? "",
      first_visit_at: a?.first_visit_at ?? "",
      ai_source: a?.ai_source ?? "",
      utm_source: a?.utm_source ?? "",
      utm_medium: a?.utm_medium ?? "",
      utm_campaign: a?.utm_campaign ?? "",
    });
    return true;
  } catch (err) {
    console.error("[investor-overview] Failed to save request:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function mailReady(): { from: string } | null {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!key || !from) return null;
  sgMail.setApiKey(key);
  return { from };
}

/** The visitor's copy of the link. Never throws. */
export async function sendVisitorEmail(to: string, url: string, meetUrl: string): Promise<boolean> {
  const ready = mailReady();
  if (!ready) return false;
  const signature = signatureFromEnv();
  const signOff = signature ? signature.name : "The Spaarke team";

  const text = [
    "Thank you for your interest in Spaarke.",
    "",
    `Here is the Spaarke investor overview: ${url}`,
    `The link works for ${LINK_TTL_DAYS} days.`,
    "",
    `If you would like to talk, choose a time here: ${meetUrl}`,
    "",
    signOff,
    "Spaarke",
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a">
<p>Thank you for your interest in Spaarke.</p>
<p><a href="${esc(url)}" style="display:inline-block;background:#5078DC;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:999px;font-weight:600">Download the investor overview</a></p>
<p style="color:#555;font-size:13px">The link works for ${LINK_TTL_DAYS} days.</p>
<p>If you would like to talk, <a href="${esc(meetUrl)}" style="color:#3F5FD9">choose a time here</a>.</p>
<p>${esc(signOff)}<br>Spaarke</p>
</body></html>`;

  try {
    await sgMail.send({ to, from: ready.from, subject: "The Spaarke investor overview", text, html });
    return true;
  } catch (err) {
    console.error("[investor-overview] Visitor email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

/** Tells the team who asked. Never throws. */
export async function sendTeamNotice(data: {
  email: string;
  source: Source;
  requestId: string;
  saved: boolean;
  attribution?: Attribution | null;
}): Promise<boolean> {
  const ready = mailReady();
  const to = process.env.CONTACT_EMAIL_TO;
  if (!ready || !to) return false;
  const a = data.attribution;
  const text = [
    `Investor overview requested at ${new Date().toISOString()}`,
    data.saved
      ? `Saved in Table Storage, ${TABLE}, ${data.source} / ${data.requestId}.`
      : "NOT SAVED. Table Storage was unavailable, so this mail is the only copy.",
    "",
    `Email:    ${data.email}`,
    `Source:   ${data.source}`,
    `UTM:      ${[a?.utm_source, a?.utm_medium, a?.utm_campaign].filter(Boolean).join(" / ") || "(none)"}`,
    `Landing:  ${a?.entry_landing || "(unknown)"}`,
  ].join("\n");
  try {
    await sgMail.send({
      to,
      from: ready.from,
      replyTo: data.email,
      subject: `[Spaarke] Investor overview requested - ${data.email}`,
      text,
    });
    return true;
  } catch (err) {
    console.error("[investor-overview] Team notice failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
