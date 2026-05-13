// scripts/linkedin-revoke.ts
//
// Clean disposal CLI for LinkedIn tokens. Revokes the access + refresh
// tokens at LinkedIn and then clears the four session-level secrets
// from Key Vault. App-level secrets (`client-id`, `client-secret`)
// are preserved so a future `linkedin-auth` run can re-authorize
// without re-provisioning the app.
//
//   npx tsx scripts/linkedin-revoke.ts --app=member
//   npx tsx scripts/linkedin-revoke.ts --app=member --confirm
//
// Per projects/linkedin-publishing/spec.md §10 #10 (GDPR/privacy
// disposal posture) and tasks/041.
//
// LinkedIn's revoke endpoint is best-effort: it can return 200, 400,
// or 404 for valid-but-already-revoked tokens. We treat any of those
// as "fine, proceed with KV cleanup" — the source of truth for
// "are we authenticated" is KV, not LinkedIn.

import {
  type App,
  type LinkedInTokens,
  LinkedInConfigError,
  getCredentials,
  getSecretClient,
  getTokens,
} from "./linkedin-shared.ts";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const REVOKE_ENDPOINT = "https://www.linkedin.com/oauth/v2/revoke";

type TokenTypeHint = "access_token" | "refresh_token";

/* ------------------------------------------------------------------ */
/*  CLI parsing                                                        */
/* ------------------------------------------------------------------ */

interface ParsedArgs {
  app: App;
  confirm: boolean;
}

function parseArgs(argv: readonly string[]): ParsedArgs {
  // Accept `--app=member`, `--app member`, or bare positional `member`/`org`.
  // Bare-positional is the npm-on-Windows fallback (`npm run` strips
  // `--app=` prefixes after `--`). Mirrors linkedin-auth.ts.
  let app: App | null = null;
  let confirm = false;
  for (let i = 2; i < argv.length; i++) {
    const raw = argv[i];
    if (raw === "--app=member" || (raw === "--app" && argv[i + 1] === "member")) {
      app = "member";
      if (raw === "--app") i++;
      continue;
    }
    if (raw === "--app=org" || (raw === "--app" && argv[i + 1] === "org")) {
      app = "org";
      if (raw === "--app") i++;
      continue;
    }
    if (raw === "--confirm") {
      confirm = true;
      continue;
    }
    if (raw === "member" || raw === "org") {
      app = raw;
      continue;
    }
  }
  if (!app) {
    throw new LinkedInConfigError(
      "Missing or invalid --app flag. Use --app=member or --app=org " +
        "(or pass `member`/`org` as a bare arg).",
    );
  }
  return { app, confirm };
}

/* ------------------------------------------------------------------ */
/*  LinkedIn revoke                                                    */
/* ------------------------------------------------------------------ */

async function revokeOne(
  token: string,
  hint: TokenTypeHint,
  clientId: string,
  clientSecret: string,
): Promise<void> {
  const body = new URLSearchParams({
    token,
    token_type_hint: hint,
    client_id: clientId,
    client_secret: clientSecret,
  });
  try {
    const response = await fetch(REVOKE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    // LinkedIn's revoke endpoint returns 200 on success, 400/404 on
    // already-revoked or unknown tokens. Any of those is acceptable —
    // KV is the source of truth, so we proceed to cleanup regardless.
    if (response.status === 200) {
      console.log(`  ${hint}: revoked (HTTP 200).`);
    } else if (response.status === 400 || response.status === 404) {
      console.log(
        `  ${hint}: already revoked or unknown to LinkedIn (HTTP ${response.status}).`,
      );
    } else {
      const errBody = await response.text().catch(() => "<unreadable>");
      console.warn(
        `  ${hint}: unexpected HTTP ${response.status} from revoke ` +
          `endpoint (proceeding with KV cleanup anyway): ${errBody}`,
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `  ${hint}: network/transport error during revoke (proceeding ` +
        `with KV cleanup anyway): ${msg}`,
    );
  }
}

/* ------------------------------------------------------------------ */
/*  KV cleanup                                                         */
/* ------------------------------------------------------------------ */

async function deleteSessionSecrets(app: App): Promise<void> {
  const client = getSecretClient();
  // Only the four session-level secrets. Never delete
  // `linkedin-<app>-client-id` or `linkedin-<app>-client-secret`.
  const names = [
    `linkedin-${app}-access-token`,
    `linkedin-${app}-refresh-token`,
    `linkedin-${app}-token-expires-at`,
    `linkedin-${app}-author-urn`,
  ];
  await Promise.all(
    names.map(async (name) => {
      try {
        const poller = await client.beginDeleteSecret(name);
        await poller.pollUntilDone();
        console.log(`  deleted: ${name}`);
      } catch (err: unknown) {
        const e = err as { code?: string; statusCode?: number; message?: string };
        if (e?.code === "SecretNotFound" || e?.statusCode === 404) {
          console.log(`  skipped: ${name} (already absent)`);
          return;
        }
        throw err;
      }
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const { app, confirm } = parseArgs(process.argv);

  const tokens: LinkedInTokens | null = await getTokens(app);

  if (!tokens) {
    console.log(`No tokens stored for app=${app}. Nothing to revoke.`);
    if (!confirm) {
      console.log("Add `--confirm` to also clear any partial KV state.");
      return;
    }
    // With --confirm, still try the KV cleanup in case partial secrets exist.
    console.log("Clearing any partial session secrets from Key Vault...");
    await deleteSessionSecrets(app);
    console.log(
      `\nNo tokens to revoke at LinkedIn; KV cleared for app=${app}.\n` +
        `To re-authorize, run: npx tsx scripts/linkedin-auth.ts --app=${app}`,
    );
    return;
  }

  if (!confirm) {
    console.log(`Would revoke LinkedIn tokens for app=${app}:`);
    console.log(`  app:        ${app}`);
    console.log(`  expiresAt:  ${tokens.expiresAt}`);
    console.log(`  authorUrn:  ${tokens.authorUrn}`);
    console.log("\nAdd `--confirm` to actually revoke.");
    return;
  }

  const { clientId, clientSecret } = await getCredentials(app);

  console.log(`Revoking LinkedIn tokens for app=${app}...`);
  await revokeOne(tokens.accessToken, "access_token", clientId, clientSecret);
  await revokeOne(tokens.refreshToken, "refresh_token", clientId, clientSecret);

  console.log(`Clearing session secrets from Key Vault for app=${app}...`);
  await deleteSessionSecrets(app);

  console.log(
    `\nRevoked LinkedIn ${app} tokens.\n` +
      `To re-authorize, run: npx tsx scripts/linkedin-auth.ts --app=${app}`,
  );
}

main().catch((err: unknown) => {
  if (err instanceof LinkedInConfigError) {
    console.error(`Configuration error: ${err.message}`);
    process.exit(2);
  }
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`Unexpected error: ${msg}`);
  process.exit(1);
});
