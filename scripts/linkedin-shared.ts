// scripts/linkedin-shared.ts
//
// Shared LinkedIn integration primitives — KV access, token types,
// app selection, errors. Every other linkedin-*.ts script imports
// from this module. See projects/linkedin-publishing/spec.md §3.2
// for the KV layout and projects/linkedin-publishing/tasks/002 for
// the full contract.

import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type App = "member" | "org";

export interface LinkedInTokens {
  accessToken: string;
  refreshToken: string;
  /** ISO 8601 timestamp at which the access token expires. */
  expiresAt: string;
  /** Either `urn:li:person:{id}` (member) or `urn:li:organization:{id}` (org). */
  authorUrn: string;
}

export interface LinkedInCredentials {
  clientId: string;
  clientSecret: string;
}

/* ------------------------------------------------------------------ */
/*  Errors                                                             */
/* ------------------------------------------------------------------ */

export class LinkedInAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LinkedInAuthError";
  }
}

export class LinkedInApiError extends Error {
  public readonly httpStatus: number;
  public readonly responseBody: string;
  constructor(message: string, httpStatus: number, responseBody: string) {
    super(message);
    this.name = "LinkedInApiError";
    this.httpStatus = httpStatus;
    this.responseBody = responseBody;
  }
}

export class LinkedInConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LinkedInConfigError";
  }
}

/* ------------------------------------------------------------------ */
/*  KV access                                                          */
/* ------------------------------------------------------------------ */

// Hard-coded for v1 per spec §10 open-question #5 resolution.
const KV_VAULT_NAME = "sprk-demo-kv";

export function getKvVaultName(): string {
  return KV_VAULT_NAME;
}

let cachedClient: SecretClient | null = null;

export function getSecretClient(): SecretClient {
  if (cachedClient) return cachedClient;
  const credential = new DefaultAzureCredential();
  cachedClient = new SecretClient(
    `https://${KV_VAULT_NAME}.vault.azure.net`,
    credential,
  );
  return cachedClient;
}

async function getSecret(name: string): Promise<string | null> {
  try {
    const client = getSecretClient();
    const secret = await client.getSecret(name);
    return secret.value ?? null;
  } catch (err: unknown) {
    // Missing or soft-deleted-not-purged secrets surface as 404 / SecretNotFound.
    // Distinguish missing-secret (caller handles) from auth/network errors (caller bubbles).
    const e = err as { code?: string; statusCode?: number };
    if (e?.code === "SecretNotFound" || e?.statusCode === 404) {
      return null;
    }
    throw err;
  }
}

async function setSecret(name: string, value: string): Promise<void> {
  const client = getSecretClient();
  await client.setSecret(name, value);
}

/* ------------------------------------------------------------------ */
/*  Credentials + tokens                                               */
/* ------------------------------------------------------------------ */

export async function getCredentials(app: App): Promise<LinkedInCredentials> {
  const [clientId, clientSecret] = await Promise.all([
    getSecret(`linkedin-${app}-client-id`),
    getSecret(`linkedin-${app}-client-secret`),
  ]);
  if (!clientId || !clientSecret) {
    throw new LinkedInConfigError(
      `Missing LinkedIn ${app} credentials in Key Vault. Add ` +
        `linkedin-${app}-client-id and linkedin-${app}-client-secret to ` +
        `${KV_VAULT_NAME}.`,
    );
  }
  return { clientId, clientSecret };
}

export async function getTokens(app: App): Promise<LinkedInTokens | null> {
  const [accessToken, refreshToken, expiresAt, authorUrn] = await Promise.all([
    getSecret(`linkedin-${app}-access-token`),
    getSecret(`linkedin-${app}-refresh-token`),
    getSecret(`linkedin-${app}-token-expires-at`),
    getSecret(`linkedin-${app}-author-urn`),
  ]);
  if (!accessToken || !refreshToken || !expiresAt || !authorUrn) {
    return null;
  }
  return { accessToken, refreshToken, expiresAt, authorUrn };
}

export async function setTokens(app: App, tokens: LinkedInTokens): Promise<void> {
  // Sequential writes — KV soft-delete (90-day window) covers partial-failure recovery.
  await setSecret(`linkedin-${app}-access-token`, tokens.accessToken);
  await setSecret(`linkedin-${app}-refresh-token`, tokens.refreshToken);
  await setSecret(`linkedin-${app}-token-expires-at`, tokens.expiresAt);
  await setSecret(`linkedin-${app}-author-urn`, tokens.authorUrn);
}

/* ------------------------------------------------------------------ */
/*  Self-check                                                         */
/* ------------------------------------------------------------------ */

/**
 * Confirms KV is reachable and `linkedin-member-client-id` is set.
 * Used by `npm run linkedin:test-kv`. Returns the length of the client
 * ID (a non-secret integer) so the caller can log a success signal
 * without exposing any value.
 */
export async function pingKv(): Promise<number> {
  const id = await getSecret("linkedin-member-client-id");
  if (!id) {
    throw new LinkedInConfigError(
      `linkedin-member-client-id is not set in ${KV_VAULT_NAME}. ` +
        `Verify your az login session and KV RBAC role.`,
    );
  }
  return id.length;
}
