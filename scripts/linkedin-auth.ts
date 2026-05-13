// scripts/linkedin-auth.ts
//
// One-shot OAuth CLI for LinkedIn. Run once per app per year (or when
// a refresh token has been revoked):
//
//   npx tsx scripts/linkedin-auth.ts --app=member
//   npx tsx scripts/linkedin-auth.ts --app=org
//
// Opens the system browser, spins up an ephemeral HTTP server on
// 127.0.0.1:3000 to catch the OAuth callback, exchanges the
// authorization code for tokens, fetches the author URN, and persists
// everything to Key Vault via the shared module.
//
// Per projects/linkedin-publishing/spec.md §5.1 and tasks/010.
//
// IMPORTANT: secret values (access token, refresh token, client
// secret) must never appear in stdout/stderr. Only success/failure
// status and the access-token expiry date are printed.

import { randomBytes } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import open from "open";

import {
  type App,
  type LinkedInTokens,
  LinkedInApiError,
  LinkedInAuthError,
  LinkedInConfigError,
  getCredentials,
  setTokens,
} from "./linkedin-shared.ts";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CALLBACK_HOST = "127.0.0.1";
const CALLBACK_PORT = 3000;
const CALLBACK_PATH = "/auth/linkedin/callback";
const REDIRECT_URI = `http://localhost:${CALLBACK_PORT}${CALLBACK_PATH}`;

const AUTHORIZE_ENDPOINT = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_ENDPOINT = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_ENDPOINT = "https://api.linkedin.com/v2/userinfo";
const ORG_ACLS_ENDPOINT =
  "https://api.linkedin.com/rest/organizationAcls" +
  "?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED";
const LINKEDIN_VERSION = "202604";

const SCOPES: Record<App, string> = {
  member: "openid profile email w_member_social",
  org: "r_organization_social w_organization_social rw_organization_admin",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TokenResponseBody {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: "Bearer";
}

interface UserInfoBody {
  sub: string;
  // other fields are present but unused
}

interface OrgAclElement {
  organization: string; // urn:li:organization:<id>
  role?: string;
  state?: string;
}

interface OrgAclsBody {
  elements: OrgAclElement[];
}

/* ------------------------------------------------------------------ */
/*  CLI parsing                                                        */
/* ------------------------------------------------------------------ */

function parseApp(argv: readonly string[]): App {
  // Accept `--app=member`, `--app member`, or bare positional `member`/`org`.
  // The bare-positional form is the fallback for npm-on-Windows, which strips
  // the `--app=` prefix when passing args after `--` through `npm run`.
  for (let i = 2; i < argv.length; i++) {
    const raw = argv[i];
    if (raw === "--app=member" || (raw === "--app" && argv[i + 1] === "member")) return "member";
    if (raw === "--app=org" || (raw === "--app" && argv[i + 1] === "org")) return "org";
    if (raw === "member" || raw === "org") return raw;
  }
  throw new LinkedInConfigError(
    "Missing or invalid --app flag. Use --app=member or --app=org " +
      "(or pass `member`/`org` as a bare arg).",
  );
}

/* ------------------------------------------------------------------ */
/*  HTML helpers                                                       */
/* ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSuccessPage(app: App, expiresAt: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>LinkedIn auth complete</title>
<style>body{font-family:system-ui,sans-serif;max-width:40em;margin:4em auto;padding:0 1em;color:#222}</style>
</head><body>
<h1>Success</h1>
<p>LinkedIn ${escapeHtml(app)} token stored.</p>
<p>Access valid until <strong>${escapeHtml(expiresAt.slice(0, 10))}</strong>.</p>
<p>You may close this tab.</p>
</body></html>`;
}

function renderErrorPage(message: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>LinkedIn auth failed</title>
<style>body{font-family:system-ui,sans-serif;max-width:40em;margin:4em auto;padding:0 1em;color:#222}</style>
</head><body>
<h1>Authentication failed</h1>
<p>${escapeHtml(message)}</p>
<p>Check the terminal for details. You may close this tab.</p>
</body></html>`;
}

function renderOrgPickerPage(orgs: readonly string[], state: string): string {
  const items = orgs
    .map(
      (urn, i) =>
        `<li><a href="${CALLBACK_PATH}?pick=${i}&state=${encodeURIComponent(state)}">${escapeHtml(urn)}</a></li>`,
    )
    .join("\n");
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Choose an organization</title>
<style>body{font-family:system-ui,sans-serif;max-width:40em;margin:4em auto;padding:0 1em;color:#222}
li{margin:.5em 0}a{color:#0a66c2}</style>
</head><body>
<h1>Choose an organization</h1>
<p>You administer multiple LinkedIn pages. Pick the one to authorize:</p>
<ul>
${items}
</ul>
</body></html>`;
}

/* ------------------------------------------------------------------ */
/*  HTTP helpers                                                       */
/* ------------------------------------------------------------------ */

function sendHtml(
  res: ServerResponse,
  statusCode: number,
  html: string,
): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

function sendPlain(
  res: ServerResponse,
  statusCode: number,
  message: string,
): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
}

/* ------------------------------------------------------------------ */
/*  LinkedIn API calls                                                 */
/* ------------------------------------------------------------------ */

async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string,
): Promise<TokenResponseBody> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: clientId,
    client_secret: clientSecret,
  });
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    const errBody = await response.text().catch(() => "<unreadable>");
    throw new LinkedInApiError(
      `Token exchange failed (HTTP ${response.status}).`,
      response.status,
      errBody,
    );
  }
  const data = (await response.json()) as TokenResponseBody;
  if (!data.access_token || !data.refresh_token || !data.expires_in) {
    throw new LinkedInAuthError(
      `Token response missing required fields: ${JSON.stringify(Object.keys(data))}`,
    );
  }
  return data;
}

async function fetchMemberUrn(accessToken: string): Promise<string> {
  const response = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const errBody = await response.text().catch(() => "<unreadable>");
    throw new LinkedInApiError(
      `userinfo lookup failed (HTTP ${response.status}).`,
      response.status,
      errBody,
    );
  }
  const data = (await response.json()) as UserInfoBody;
  if (!data.sub) {
    throw new LinkedInAuthError("userinfo response missing 'sub' field.");
  }
  return `urn:li:person:${data.sub}`;
}

async function fetchOrgUrns(accessToken: string): Promise<string[]> {
  const response = await fetch(ORG_ACLS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "LinkedIn-Version": LINKEDIN_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
  if (!response.ok) {
    const errBody = await response.text().catch(() => "<unreadable>");
    throw new LinkedInApiError(
      `organizationAcls lookup failed (HTTP ${response.status}).`,
      response.status,
      errBody,
    );
  }
  const data = (await response.json()) as OrgAclsBody;
  const elements = Array.isArray(data.elements) ? data.elements : [];
  const urns = elements
    .map((e) => e.organization)
    .filter((u): u is string => typeof u === "string" && u.length > 0);
  if (urns.length === 0) {
    throw new LinkedInAuthError(
      "No APPROVED ADMINISTRATOR organizations returned by organizationAcls. " +
        "Confirm the operator has an ADMINISTRATOR role on a Spaarke page.",
    );
  }
  return urns;
}

/* ------------------------------------------------------------------ */
/*  Main flow                                                          */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const app = parseApp(process.argv);
  const scope = SCOPES[app];

  const { clientId, clientSecret } = await getCredentials(app);

  const state = randomBytes(16).toString("base64url");

  const authUrl =
    `${AUTHORIZE_ENDPOINT}` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${encodeURIComponent(state)}` +
    `&scope=${encodeURIComponent(scope)}`;

  // Per-flow state held in closure so the callback handler can mutate
  // and the outer promise can resolve / reject from inside the server.
  let resolveDone: (value: void) => void;
  let rejectDone: (reason: unknown) => void;
  const done = new Promise<void>((resolve, reject) => {
    resolveDone = resolve;
    rejectDone = reject;
  });

  // For org-app, once we have an access token we may need to render a
  // picker and wait for the operator to choose. We stash the data here.
  let pendingOrgChoice: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    orgs: string[];
  } | null = null;

  async function finalizeMember(token: TokenResponseBody): Promise<LinkedInTokens> {
    const authorUrn = await fetchMemberUrn(token.access_token);
    return {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: new Date(Date.now() + token.expires_in * 1000).toISOString(),
      authorUrn,
    };
  }

  async function finalizeOrg(
    token: TokenResponseBody,
  ): Promise<{ tokens: LinkedInTokens | null; orgs: string[] }> {
    const orgs = await fetchOrgUrns(token.access_token);
    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();
    if (orgs.length === 1) {
      return {
        tokens: {
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt,
          authorUrn: orgs[0],
        },
        orgs,
      };
    }
    pendingOrgChoice = {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt,
      orgs,
    };
    return { tokens: null, orgs };
  }

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    void handleRequest(req, res).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      try {
        sendHtml(res, 500, renderErrorPage(msg));
      } catch {
        // ignore
      }
      rejectDone(err);
    });
  });

  async function handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    if (!req.url) {
      sendPlain(res, 400, "Bad request");
      return;
    }
    const url = new URL(req.url, `http://${CALLBACK_HOST}:${CALLBACK_PORT}`);
    if (url.pathname !== CALLBACK_PATH) {
      sendPlain(res, 404, "Not found");
      return;
    }

    const returnedState = url.searchParams.get("state");
    if (returnedState !== state) {
      sendHtml(res, 400, renderErrorPage("State mismatch — possible CSRF attempt."));
      rejectDone(new LinkedInAuthError("OAuth state mismatch on callback."));
      return;
    }

    // Org-picker second hop.
    const pickRaw = url.searchParams.get("pick");
    if (pickRaw !== null) {
      if (!pendingOrgChoice) {
        sendHtml(res, 400, renderErrorPage("No pending organization choice."));
        rejectDone(new LinkedInAuthError("Unexpected picker callback with no pending choice."));
        return;
      }
      const idx = Number.parseInt(pickRaw, 10);
      if (
        !Number.isInteger(idx) ||
        idx < 0 ||
        idx >= pendingOrgChoice.orgs.length
      ) {
        sendHtml(res, 400, renderErrorPage("Invalid organization index."));
        rejectDone(new LinkedInAuthError(`Invalid pick index: ${pickRaw}`));
        return;
      }
      const tokens: LinkedInTokens = {
        accessToken: pendingOrgChoice.accessToken,
        refreshToken: pendingOrgChoice.refreshToken,
        expiresAt: pendingOrgChoice.expiresAt,
        authorUrn: pendingOrgChoice.orgs[idx],
      };
      await setTokens(app, tokens);
      sendHtml(res, 200, renderSuccessPage(app, tokens.expiresAt));
      console.log(
        `Token stored. Access valid until ${tokens.expiresAt.slice(0, 10)}. ` +
          `Refresh valid for 365 days.`,
      );
      resolveDone();
      return;
    }

    // Primary callback hop.
    const oauthError = url.searchParams.get("error");
    if (oauthError) {
      const description =
        url.searchParams.get("error_description") ?? "no description";
      sendHtml(
        res,
        400,
        renderErrorPage(`LinkedIn returned error: ${oauthError} — ${description}`),
      );
      rejectDone(
        new LinkedInAuthError(
          `LinkedIn OAuth error: ${oauthError} — ${description}`,
        ),
      );
      return;
    }

    const code = url.searchParams.get("code");
    if (!code) {
      sendHtml(res, 400, renderErrorPage("Missing authorization code."));
      rejectDone(new LinkedInAuthError("Callback missing authorization code."));
      return;
    }

    const token = await exchangeCodeForTokens(code, clientId, clientSecret);

    if (app === "member") {
      const tokens = await finalizeMember(token);
      await setTokens(app, tokens);
      sendHtml(res, 200, renderSuccessPage(app, tokens.expiresAt));
      console.log(
        `Token stored. Access valid until ${tokens.expiresAt.slice(0, 10)}. ` +
          `Refresh valid for 365 days.`,
      );
      resolveDone();
      return;
    }

    // app === "org"
    const { tokens, orgs } = await finalizeOrg(token);
    if (tokens) {
      await setTokens(app, tokens);
      sendHtml(res, 200, renderSuccessPage(app, tokens.expiresAt));
      console.log(
        `Token stored. Access valid until ${tokens.expiresAt.slice(0, 10)}. ` +
          `Refresh valid for 365 days.`,
      );
      resolveDone();
      return;
    }
    // Multiple orgs — render picker; resolution waits for the pick hop.
    sendHtml(res, 200, renderOrgPickerPage(orgs, state));
  }

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(CALLBACK_PORT, CALLBACK_HOST, () => resolve());
  });

  console.log(`Starting LinkedIn OAuth flow for app=${app}.`);
  console.log(`If your browser doesn't open, visit:\n  ${authUrl}`);

  try {
    await open(authUrl);
  } catch {
    // open() may fail in headless environments; the URL is already
    // printed above so the operator can paste it manually.
  }

  try {
    await done;
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

main().catch((err: unknown) => {
  if (err instanceof LinkedInConfigError) {
    console.error(`Configuration error: ${err.message}`);
    process.exit(2);
  }
  if (err instanceof LinkedInAuthError) {
    console.error(`Authentication failed: ${err.message}`);
    process.exit(1);
  }
  if (err instanceof LinkedInApiError) {
    console.error(
      `LinkedIn API error (HTTP ${err.httpStatus}): ${err.message}`,
    );
    process.exit(1);
  }
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`Unexpected error: ${msg}`);
  process.exit(1);
});
