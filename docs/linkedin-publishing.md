# LinkedIn Publishing — Operator Runbook

> Task-oriented "how do I…" reference for the operator who runs
> LinkedIn publishes from this repo. Background and architecture are
> not in this file — they live in the spec.
>
> - Architecture: [`projects/linkedin-publishing/spec.md`](../projects/linkedin-publishing/spec.md)
> - Project overview: [`projects/linkedin-publishing/README.md`](../projects/linkedin-publishing/README.md)
> - The skill the operator actually invokes: [`.claude/skills/publish-linkedin/SKILL.md`](../.claude/skills/publish-linkedin/SKILL.md)

---

## 1. First-time setup (new operator)

You need three things before you can publish:

1. An active `az login` session in the same terminal you'll run
   commands from.
2. The **Key Vault Secrets Officer** role on `sprk-demo-kv`. Ask an
   Azure subscription owner to grant it via the portal or:

   ```bash
   az role assignment create \
     --assignee <your-aad-upn> \
     --role "Key Vault Secrets Officer" \
     --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.KeyVault/vaults/sprk-demo-kv
   ```

   **Shell quirk to be aware of:** on some Linux/macOS terminals, `az role
   assignment create` returns a misleading `(MissingSubscription)` error
   for KV-scoped writes even though the session is valid (writes at other
   resource scopes still work). If you hit this, retry the exact same
   command from Windows PowerShell — it usually works first try from
   there. The cause appears to be a session-token-binding edge case in
   the az CLI, not a real permissions issue.

3. A clone of this repo with `npm install` completed.

Then run the one-shot OAuth for each LinkedIn app you'll publish from:

```bash
az login
npx tsx scripts/linkedin-auth.ts --app=member
# When the company-page app is in production:
npx tsx scripts/linkedin-auth.ts --app=org
```

Each run opens a browser at `localhost:3030`, has you sign in to
LinkedIn and approve the scopes, then writes access + refresh tokens
to Key Vault. You should see `success — token valid until <date>` in
the terminal.

Verify with:

```bash
npm run linkedin:status
```

---

## 2. Publishing an article

The happy path. The article must already be live on
`https://www.spaarke.com/why-spaarke/<slug>`.

1. In Claude Code chat: `/publish-linkedin <slug> --target=personal`
   (or `--target=company`).
2. Step through the skill's gates — validate, image, commentary,
   preview.
3. At the preview, type `approve`.
4. The skill shells out to `npx tsx scripts/linkedin-publish.ts` and
   prints the post URL.
5. Optionally accept the offered commit of
   `content-platform/published/linkedin-posts/<slug>.md`.

The full 7-gate workflow is documented in the skill itself; don't
re-implement it from memory.

---

## 3. Checking system health

```bash
npm run linkedin:status
```

Expected output (both apps healthy):

```
LinkedIn integration status:
  ✓ member: token valid, 62.0 days remaining (urn:li:person:abc123)
      expires at 2026-07-12T19:47:10.867Z
      Last publish: 2026-05-13 — the-iq-stack
  ✓ org:    not authenticated yet (CM API approval pending)
```

Read it like this:

- **Days remaining < 14**: the refresh function should fix this in the
  next nightly run. If it doesn't, run step 4.
- **`Not authenticated`**: that app has never been authorized. Go back
  to step 1 for that app.
- **`token rejected (401)`**: the refresh token itself was revoked
  outside this system. Re-auth required (step 4).

To check whether the refresh function ran cleanly, check the
`spaarke-linkedin-refresh` Application Insights resource directly in
the Azure Portal — `linkedin:status` reads only KV, not function-run
history.

---

## 4. Re-authorizing when a token expires

The refresh function is supposed to keep tokens fresh. If it fails
silently and a token expires, run:

```bash
az login
npx tsx scripts/linkedin-auth.ts --app=member   # or --app=org
```

This is the same command as first-time setup. It rewrites the same
KV secrets with fresh values. Once it prints `success`, retry your
publish.

If you see this in the publish CLI output, this is your fix:

```
LinkedIn token expired and refresh failed. Run
npx tsx scripts/linkedin-auth.ts --app=member to re-authorize.
```

---

## 5. What to do when a publish fails

| Error / symptom | What it means | Fix |
|---|---|---|
| `401 Unauthorized` | Access token expired and the inline refresh also failed. | Run `npx tsx scripts/linkedin-auth.ts --app=<member\|org>`, then retry. |
| `403 Forbidden` (company) | Your LinkedIn account is not ADMINISTRATOR on the Spaarke Company Page. | Have a page admin grant you the role in LinkedIn's page-admin UI. |
| `403 Forbidden` (personal) | The access token is missing `w_member_social`. | Re-run `linkedin-auth.ts --app=member`. The scope set is hard-coded; re-auth fixes it. |
| `422 Unprocessable Entity` — `commentary too long` | Body > 3000 chars. | At the skill's preview, reply `edit "<shorter copy>"` or `regenerate`. |
| `422 Unprocessable Entity` — other | Usually invalid mention or hashtag syntax. | `edit "<copy>"` to fix the syntax. |
| `429 Too Many Requests` | LinkedIn rate-limited the account (~150 posts/day). | Wait 5–10 minutes and retry. The drafted commentary is preserved. |
| `No hero asset at public/articles/<slug>/` | Neither `hero.svg` nor `linkedin-1920x1080.png` exists. | Add one of those files to `public/articles/<slug>/` and retry. |
| `Image is N MB, over LinkedIn's 8 MB limit` | The rasterized PNG is too large. | Check `hero.svg` — it's unusually complex. Provide a hand-optimized `linkedin-1920x1080.png` instead. |
| `KV access denied` / `DefaultAzureCredential failed` | Your `az login` session expired or you don't have the KV role. | `az login` again. If still failing, re-check the role assignment in step 1. |
| `secret not found: linkedin-<app>-access-token` | The chosen app has never been authorized in this Key Vault. | Run `linkedin-auth.ts --app=<member\|org>` once. |
| Article live-check fails (404 on `/why-spaarke/<slug>`) | SWA hasn't finished deploying, or the slug is wrong. | Wait for the SWA build, or fix the slug. |

Anything not in this table: capture the CLI stderr verbatim and read
spec §6.4. Don't silently retry.

---

## 6. Adding a new LinkedIn app

Hypothetical: Spaarke launches a second company page (e.g.,
`Spaarke Labs`) and you want to publish to it from this system. The
abstract steps:

1. **Create the LinkedIn app** in the LinkedIn Developer portal.
   Attach the right products (Community Management API for a company
   page, Sign In with LinkedIn + Share on LinkedIn for a personal
   account). Note the client ID and client secret.
2. **Pick an app key** — short kebab-case identifier, e.g. `labs`.
   This becomes the suffix for KV secret names: `linkedin-labs-*`.
3. **Seed the KV secrets** for client ID and client secret:

   ```bash
   az keyvault secret set --vault-name sprk-demo-kv \
     --name linkedin-labs-client-id --value <id>
   az keyvault secret set --vault-name sprk-demo-kv \
     --name linkedin-labs-client-secret --value <secret>
   ```

4. **Extend `scripts/linkedin-shared.ts`** to recognize the new app
   key in the `App` union type and the scope/URN map.
5. **Extend `scripts/linkedin-publish.ts`** to accept the new value
   for `--target`.
6. **Run the OAuth flow**:

   ```bash
   npx tsx scripts/linkedin-auth.ts --app=labs
   ```

7. **Update the refresh function** to include the new app key in
   the daily sweep (`azure/functions/linkedin-token-refresh/`).
8. **Update `linkedin-status.ts`** to surface the new app's state.
9. **Smoke-test** with `--dry-run` before publishing for real.

The architecture is two-app today; the code is structured so adding
a third is mechanical, not architectural.

---

## 7. Decommissioning an operator

When an operator leaves the project, their LinkedIn-account tokens
must be invalidated and the KV secrets cleared (they're personal
credentials, not service credentials).

```bash
az login
npx tsx scripts/linkedin-revoke.ts --app=member --confirm
# If they also held the company page authorization on their account:
npx tsx scripts/linkedin-revoke.ts --app=org --confirm
```

What the script does:

1. POSTs to LinkedIn's `/oauth/v2/revoke` to invalidate the access
   and refresh tokens.
2. Deletes these KV secrets:
   - `linkedin-<app>-access-token`
   - `linkedin-<app>-refresh-token`
   - `linkedin-<app>-token-expires-at`
   - `linkedin-<app>-person-urn` (member) or
     `linkedin-<app>-organization-urn` (org)

What remains in KV after revoke:

- `linkedin-<app>-client-id`
- `linkedin-<app>-client-secret`

These are app-level (not operator-level) and stay so the next
operator can re-authorize without recreating the LinkedIn app. After
the new operator runs `linkedin-auth.ts --app=<app>`, the system is
back online with their tokens.

Also remove the leaving operator's Azure role assignment on the
vault:

```bash
az role assignment delete \
  --assignee <their-aad-upn> \
  --role "Key Vault Secrets Officer" \
  --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.KeyVault/vaults/sprk-demo-kv
```

---

## 8. How the system stays alive without intervention

A timer-triggered Azure Function at
`azure/functions/linkedin-token-refresh/` runs daily at 02:00 UTC.
For each app it reads `linkedin-<app>-token-expires-at` from Key
Vault; if the access token is within 7 days of expiring, it calls
LinkedIn's `/oauth/v2/accessToken` with `grant_type=refresh_token`,
gets new access + refresh tokens (LinkedIn rotates both on every
refresh), and writes them back to KV atomically. On failure it logs
to App Insights and sends an email via SendGrid so you know to run
`linkedin-auth.ts` before the refresh token itself expires. As long
as the function is healthy, the operator only re-authenticates once
per year per app.

### SendGrid alerting configuration

The function emails on refresh failures and sends a weekly summary on
Mondays. It reads three secrets from `sprk-demo-kv`:

| Secret name | Purpose | Example |
|---|---|---|
| `sendgrid-api-key` | API key for `sgMail.setApiKey()`. Best practice: dedicated key with "Mail Send" permission only, not the site's shared key. | `SG.…` |
| `notification-email-operator` | Recipient address. | `ralph.schroeder@spaarke.com` |
| `notification-email-from` | Sender address. Must be a SendGrid-verified sender. | `noreply@spaarke.com` |

If any of the three is missing, the function logs a notice and
proceeds to refresh tokens anyway — alerting is best-effort. To set
or rotate:

```bash
az keyvault secret set --vault-name sprk-demo-kv --name sendgrid-api-key --value "<key>"
az keyvault secret set --vault-name sprk-demo-kv --name notification-email-operator --value "<email>"
az keyvault secret set --vault-name sprk-demo-kv --name notification-email-from --value "noreply@spaarke.com"
```

The function reads KV at runtime, so secret rotation takes effect on
the next scheduled run — no redeploy needed.

---

## FAQ

**Can I post a long-form Pulse article through this system?**
No. LinkedIn's API doesn't expose Pulse-article creation. Do that
manually in LinkedIn's web UI. This system handles feed-card posts
only (commentary + image + link to the canonical article on
`spaarke.com`).

**Why is the image different between the company post and the
personal post?**
It isn't. Both targets use the same
`public/articles/<slug>/linkedin-1920x1080.png` file. If the rendered
post on LinkedIn looks different between the two surfaces, that's
LinkedIn's feed renderer cropping the same source image differently
(desktop vs mobile, link-card vs feed-card). The bytes uploaded are
identical.

**What happens if I publish to the wrong target?**
The system can't auto-revert. Delete the post manually in the
LinkedIn UI (use the `…` menu on the post). Then:

- Edit `content-platform/published/linkedin-posts/<slug>.md` to
  remove the post URL line, or delete the file if it was just
  created.
- Edit `content-platform/calendar.md` to remove the row that the
  publish script appended.
- Re-run the skill against the correct target.

Local files are cleanup-able; the LinkedIn post is not. Approve the
preview deliberately.

**Why does the skill ask me to approve again when I've already
approved a draft in `published/linkedin-posts/<slug>.md`?**
The approval gate is on every publish, not every draft. The file
captures intent; the gate captures consent to go live right now.

**The refresh function emailed me — what do I do?**
Run `npm run linkedin:status` to see which app is unhealthy, then
run `npx tsx scripts/linkedin-auth.ts --app=<that-app>` from a
terminal with an active `az login`. The fix is the same regardless
of why the refresh failed.

---

*This is operational documentation, not architectural. When a step
here disagrees with the spec, the spec wins. File a fix.*
