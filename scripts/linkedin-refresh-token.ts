// scripts/linkedin-refresh-token.ts
//
// Reusable refresh-token logic. Called by linkedin-publish.ts (inline,
// 5-minute window before posting) and by the Azure Function on a daily
// timer. Same implementation, two callers.
//
// LinkedIn access tokens are 60-day TTL; refresh tokens are 365-day TTL
// and rotate on every refresh — so the new refresh token must be
// persisted atomically with the new access token.
//
// See projects/linkedin-publishing/spec.md §5 and tasks/003 for
// the full contract.

import {
  type App,
  type LinkedInTokens,
  LinkedInAuthError,
  getCredentials,
  getTokens,
  setTokens,
} from "./linkedin-shared.ts";

const TOKEN_ENDPOINT = "https://www.linkedin.com/oauth/v2/accessToken";

interface RefreshResponseBody {
  access_token: string;
  expires_in: number; // seconds
  refresh_token: string;
  refresh_token_expires_in?: number; // seconds
  scope?: string;
  token_type?: "Bearer";
}

/**
 * Returns the number of days remaining before the access token expires.
 * Pure helper — used by the refresh function for logging and by
 * `linkedin-status` for the operator-facing health report.
 */
export function daysUntilExpiry(tokens: LinkedInTokens): number {
  const expiresMs = new Date(tokens.expiresAt).getTime();
  const nowMs = Date.now();
  return (expiresMs - nowMs) / (1000 * 60 * 60 * 24);
}

/**
 * Refresh the access token if it's within `windowDays` of expiry.
 * Returns the current tokens unchanged if the window hasn't been hit.
 *
 * Used inline by `linkedin-publish.ts` with `windowDays = 0.0035`
 * (~5 minutes) to guarantee a fresh token at post time, and by the
 * Azure Function with the default `windowDays = 7` for the daily
 * housekeeping loop.
 */
export async function refreshIfNeeded(
  app: App,
  windowDays = 7,
): Promise<LinkedInTokens> {
  const tokens = await getTokens(app);
  if (!tokens) {
    throw new LinkedInAuthError(
      `No tokens stored for app=${app}. ` +
        `Run npm run linkedin:auth --app=${app} to authorize.`,
    );
  }
  if (daysUntilExpiry(tokens) > windowDays) {
    return tokens;
  }
  return refreshNow(app);
}

/**
 * Force a refresh regardless of expiry window. Persists the new tokens
 * to Key Vault before returning.
 */
export async function refreshNow(app: App): Promise<LinkedInTokens> {
  const credentials = await getCredentials(app);
  const current = await getTokens(app);
  if (!current) {
    throw new LinkedInAuthError(
      `No tokens stored for app=${app}; cannot refresh. ` +
        `Run npm run linkedin:auth --app=${app}.`,
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: current.refreshToken,
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (response.status === 401) {
    throw new LinkedInAuthError(
      `Refresh token rejected for app=${app}. The refresh token is ` +
        `expired, revoked, or invalid. Run npm run linkedin:auth ` +
        `--app=${app} to re-authorize.`,
    );
  }
  if (!response.ok) {
    const errBody = await response.text().catch(() => "<unreadable>");
    throw new LinkedInAuthError(
      `Refresh failed for app=${app} (HTTP ${response.status}): ${errBody}`,
    );
  }

  const data = (await response.json()) as RefreshResponseBody;
  if (!data.access_token || !data.refresh_token || !data.expires_in) {
    throw new LinkedInAuthError(
      `Refresh response missing required fields for app=${app}: ` +
        `${JSON.stringify(Object.keys(data))}`,
    );
  }

  const newTokens: LinkedInTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    authorUrn: current.authorUrn, // preserved across refresh
  };

  await setTokens(app, newTokens);
  return newTokens;
}
