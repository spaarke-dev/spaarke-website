import { createHash } from "node:crypto";

/**
 * Key helpers for the market access tables. Emails never appear in a
 * partition or row key: keys use a SHA-256 of the normalized address, so table
 * tooling, logs and URLs do not expose who is in the store.
 */

const EMAIL = /^[^\s@,;<>()"]+@[^\s@,;<>()"]+\.[^\s@,;<>()"]+$/;

/** Lower-cased and trimmed, or null when it is not a single address. */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let email = raw.trim().toLowerCase();
  if (email.startsWith("mailto:")) email = email.slice(7);
  if (email.length > 254 || !EMAIL.test(email)) return null;
  return email;
}

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/** Hash of a normalized email. Also the contact ID for a primary email. */
export function emailHash(normalizedEmail: string): string {
  return sha256(normalizedEmail);
}

/** Partition for a contact (or alias) row: the first two hex characters. */
export function hashPartition(hash: string): string {
  return hash.slice(0, 2);
}

export function contactKeys(contactId: string): { partitionKey: string; rowKey: string } {
  return { partitionKey: hashPartition(contactId), rowKey: contactId };
}

/** Alternate emails live beside contacts, in their own partitions. */
export function aliasKeys(emailHashValue: string): { partitionKey: string; rowKey: string } {
  return { partitionKey: `alias-${hashPartition(emailHashValue)}`, rowKey: emailHashValue };
}

const MAX_TIME = 9_999_999_999_999;

/** A row key prefix that sorts newest first. */
export function invertedTime(ms: number): string {
  return String(MAX_TIME - ms).padStart(13, "0");
}

export function fromInvertedTime(prefix: string): number {
  return MAX_TIME - Number(prefix.slice(0, 13));
}

/** `yyyy-mm` in UTC. */
export function monthKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 7);
}

export function emailDomain(normalizedEmail: string): string {
  return normalizedEmail.slice(normalizedEmail.lastIndexOf("@") + 1);
}

/**
 * Domains that never create an organization (FR-04). A short built-in list of
 * the common providers; anything missed creates an organization that can be
 * fixed with an override.
 */
const FREE_MAIL = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.uk",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "zoho.com",
  "fastmail.com",
  "hey.com",
  "yandex.com",
  "qq.com",
  "163.com",
]);

export function isFreeMailDomain(domain: string): boolean {
  return FREE_MAIL.has(domain.toLowerCase());
}

/** Characters Table Storage forbids in keys. */
export function isSafeKey(value: string): boolean {
  return value.length > 0 && value.length <= 512 && !/[\\/#?\u0000-\u001f\u007f-\u009f]/.test(value);
}
