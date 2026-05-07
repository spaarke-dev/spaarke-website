# Integration: Demo Request → Provisioned Demo Access

> The end-to-end flow that turns a website **Request Early Access** form
> submission into a working Spaarke demo account. The website is a
> thin proxy; the heavy lifting (Dataverse persistence, Entra ID user
> creation, license assignment, Power Platform team membership,
> SharePoint Embedded container access, welcome email) happens in
> the **Sprk.Bff.Api** service that lives in the main Spaarke
> codebase.
>
> **Source of truth for this flow lives in the main repo at
> `c:\code_files\spaarke\src\server\api\Sprk.Bff.Api`.** This
> document describes the integration from the website's perspective
> so the website team understands what each response status means and
> what UX to present.

---

## 1. The two systems

| System | Path | Role |
|---|---|---|
| **Website** | this repo, `src/app/api/registration/demo-request/route.ts` | Validates form input client + server side, runs reCAPTCHA, persists rate-limit data, **proxies the validated payload to the BFF**, surfaces the BFF's response status + tracking ID to the user. |
| **Sprk.Bff.Api** | `c:\code_files\spaarke\src\server\api\Sprk.Bff.Api` | Owns the Demo Request lifecycle: Dataverse persistence, duplicate detection, admin notifications, applicant acknowledgement, manual approval workflow, automated provisioning, daily expiration. |

**Endpoint**: `BFF_API_URL` environment variable in the website
points at the BFF (`https://spe-api-dev-67e2xz.azurewebsites.net` in
the current dev/prod config).

> **Note on dev vs prod BFF**: as of 2026-05-07 the production
> website points at the **dev** BFF instance (`spe-api-dev-…`).
> Intentional for now — early-access volume is low and the dev
> environment can absorb it. Before high-volume external launch we
> should: (1) stand up a production BFF, (2) update SWA app settings
> via `az staticwebapp appsettings set ... --setting-names
> BFF_API_URL=<prod-url>`, (3) decide whether dev stays as a
> preview-deploy target or gets retired. Tracked in §11.

The BFF endpoint hit by the website:

```
POST <BFF_API_URL>/api/registration/demo-request
```

Defined in
[`Endpoints/RegistrationEndpoints.cs`](file:///c:/code_files/spaarke/src/server/api/Sprk.Bff.Api/Endpoints/RegistrationEndpoints.cs)
in the main repo. Two other endpoints exist there but the **website
does not call them** — they're admin-authenticated:

- `POST /api/registration/requests/{id}/approve` — admin-only;
  triggers the 9-step automated provisioning sequence.
- `POST /api/registration/requests/{id}/reject` — admin-only;
  marks the request rejected with a reason.

---

## 2. The big picture — what happens from form submit to user login

1. User fills out the **Request Early Access** form on
   `/access-request` (DemoRequestForm component).
2. Form posts to website's `/api/registration/demo-request`.
3. Website does its checks (rate limit, CAPTCHA, field validation,
   attribution capture) and **forwards the payload to the BFF**.
4. BFF validates again, **blocks disposable email domains**, **checks
   for duplicate active/pending requests**, generates a
   **tracking ID**, persists a record in **Dataverse** (table
   `sprk_registrationrequest`), and fires two emails fire-and-forget:
   - **Admin notification** to the team.
   - **Applicant acknowledgement** to the requester.
5. BFF returns **`202 Accepted`** with `{ trackingId, message }`.
6. Website returns `{ ok: true, trackingId }` to the form.
7. Form shows the tracking-ID-bearing success screen.
8. **Async**: an admin reviews the request in the Power Platform
   admin app, then clicks Approve.
9. **The 9-step automated provisioning sequence runs** in the BFF
   (Section 4 below).
10. The user receives a **welcome email** with their UPN, temporary
    password, and the access URL. They log in to the demo
    environment.

The visible-to-user time between step 1 and step 10 is typically a
few hours to a day, depending on admin response time. The form's
success screen tells them: "Your request has been submitted. You'll
receive an email when your access is ready."

---

## 3. What the website actually does (proxy step)

Source:
[`src/app/api/registration/demo-request/route.ts`](../../src/app/api/registration/demo-request/route.ts).

```
website /api/registration/demo-request
├── 1. Rate limit (in-process, per IP-hash bucket)
├── 2. CAPTCHA verify (gated on RECAPTCHA_SECRET_KEY presence)
├── 3. Server-side field validation
├── 4. Map website field names → BFF DTO names:
│       workEmail   → email
│       consent     → consentAccepted
│       captchaToken → recaptchaToken
├── 5. POST to ${BFF_API_URL}/api/registration/demo-request
└── 6. Return BFF response status to the form, with attribution data
       persisted in App Insights for our own analytics.
```

The website is intentionally a thin layer. We do *not* do any of the
following ourselves:

- Persist demo-request records (only the BFF does).
- Block disposable email domains (BFF does it).
- Detect duplicates (BFF does it).
- Issue tracking IDs (BFF does it).
- Send admin notifications or applicant emails (BFF does it).

The website does add what only it can know — first-touch
attribution + analytics — but those are tracked separately in our
own systems (Plausible + App Insights), not pushed to the BFF.

### Response status mapping

| BFF returns | Website interprets as | UX shown |
|---|---|---|
| `202 Accepted` + body | `{ ok: true, trackingId }` | Success screen with tracking ID |
| `400 Bad Request` (validation) | `VALIDATION_ERROR` + field map | Inline field errors |
| `400 Bad Request` (disposable email) | Generic `error` field | "Please use a business email" |
| `409 Conflict` (duplicate) | Pass through 409 | "Looks like that email is already on our list" *(added 2026-05-07)* |
| `429 Rate Limited` | Pass through 429 | "Too many submissions. Please try again later." |
| `500 Internal Server Error` | `502 UPSTREAM_ERROR` | "Our servers had a brief hiccup" |
| Network failure / BFF unreachable | Caught by website's try/catch | "Couldn't reach our server" |

The website upgrades upstream 5xx to a 502 in our own response so
the form's status-code branching can distinguish "BFF down" from
"website internal error."

---

## 4. The 9-step automated provisioning sequence

When an admin clicks Approve in the Power Platform app, the BFF's
`POST /api/registration/requests/{id}/approve` endpoint runs the
sequence in
[`Services/Registration/DemoProvisioningService.cs`](file:///c:/code_files/spaarke/src/server/api/Sprk.Bff.Api/Services/Registration/DemoProvisioningService.cs).

| Step | Action | What it touches | Failure impact |
|---|---|---|---|
| 1 | **Generate unique UPN** | Microsoft Graph (collision check on `firstname.lastname@demo.spaarke.com` etc.) | Total fail; nothing created |
| 2 | **Generate temporary password** | In-memory only | Total fail; nothing created |
| 3 | **Create Entra ID user** | Microsoft Graph `POST /users` — creates the account in Spaarke's Entra tenant | Partial fail; user exists in Entra but no further setup |
| 4 | **Add to "Demo Users" security group** | Microsoft Graph `POST /groups/{id}/members/$ref` | User exists but lacks group-conditional licenses/policies |
| 5 | **Assign licenses** | Microsoft Graph `POST /users/{id}/assignLicense` — typically Power Platform / SPE / M365 minimum | User exists but can't access licensed services |
| 6 | **Create Dataverse `systemuser`** | Power Platform Web API in target Business Unit | User exists in Entra but can't sign in to the Dataverse-backed Spaarke app |
| 7 | **Add to Demo Team** | Power Platform Web API — joins user to the team that owns demo records | User can sign in but can't see demo data |
| 8 | **Grant SharePoint Embedded container Writer access** | Microsoft Graph `POST /storage/fileStorage/containers/{id}/permissions` (best-effort — failure is non-fatal) | User can sign in but can't open/upload demo documents |
| 9 | **Send welcome email** | SendGrid via `RegistrationEmailService` | User exists but doesn't know their credentials — admin can resend manually |

After all 9 steps:
- Registration record in Dataverse updated to **status: Provisioned**
  with `sprk_demousername`, `sprk_demouserobjectid`,
  `sprk_provisioneddate`, `sprk_expirationdate`, `sprk_environment`.
- Welcome email is sent to the applicant's **work email** (the email
  they submitted in the form), not their newly-created UPN.

### Idempotency

The provisioning service is idempotent (per ADR-004 in the BFF):

```csharp
// If sprk_demousername is already set, this request was already provisioned.
if (!string.IsNullOrWhiteSpace(request.DemoUsername))
{
    return new ApproveResponseDto { Status = "Provisioned", Username = ..., ExpirationDate = ... };
}
```

If the admin clicks Approve twice, the second click sees the
already-provisioned record and returns the existing username
without doing anything.

### Partial failure handling

Each step is logged with `[Step N/9]` markers. If any step throws,
the BFF wraps the exception in `DemoProvisioningException` with a
list of `CompletedSteps`, the `EntraUserId`, the `Upn`, and the
`DataverseSystemUserId` (whichever exist). This lets ops:

1. Check what got created.
2. Manually clean up partial state if needed.
3. Re-run the approve action — but **note**: idempotency only
   protects the *full* sequence based on `sprk_demousername`. If
   an Entra user was created but step 6 failed (no
   `sprk_demousername` written yet), re-running creates a *second*
   Entra user with a slightly different UPN.

   **Operational implication**: partial-failure recovery is
   currently a manual ops process, not automatic re-tries. The
   error response includes `completedSteps` and IDs to help.

### Step 8 (SPE container) is non-fatal

Steps 1-7 and 9 are required. Step 8 is wrapped in its own try/catch
and on failure logs `[Step 8/9] SPE container access grant failed
(non-fatal)`, then continues. Reasons:

- The `SpeContainerId` in environment config can be a placeholder
  during early environment setup.
- Container API is occasionally rate-limited.

The user gets a working sign-in but might see permission errors when
they open SharePoint Embedded documents. Ops re-runs the grant
manually if needed.

---

## 5. Registration lifecycle states

Source:
`Services/Registration/RegistrationDataverseService.cs:RegistrationStatus`.

```
   ┌──────────────────────────────────────────────────────────┐
   │  POST /api/registration/demo-request                     │
   │  (website → BFF, anonymous)                              │
   └────────────┬─────────────────────────────────────────────┘
                │
                ▼
        ┌──────────────┐
        │  Submitted   │  ← record created, admin notified
        └──────┬───────┘
               │
        ┌──────┴───────┐
        │              │
        ▼              ▼
  ┌──────────┐   ┌──────────┐
  │ Approve  │   │  Reject  │  ← admin actions in Power Platform
  └────┬─────┘   └────┬─────┘
       │              │
       │              ▼
       │      ┌────────────┐
       │      │  Rejected  │  (terminal, with reason)
       │      └────────────┘
       │
       │   (intermediate state during provisioning)
       ▼
  ┌──────────┐
  │ Approved │   ← briefly held during the 9 steps
  └────┬─────┘
       │
       ▼
  ┌─────────────┐
  │ Provisioned │  ← user account live, welcome email sent
  └──────┬──────┘
         │
         │ (background worker on expiration date)
         ▼
   ┌──────────┐
   │ Expired  │  (terminal — Entra account disabled, team
   └──────────┘   removed, SPE access revoked, applicant
                  notified by email)

   Independent path:
   Admin can manually move Provisioned → Revoked at any time.
```

The states are integers in Dataverse, mapped by the BFF enum:
`Submitted=0, Approved=1, Rejected=2, Provisioned=3, Expired=4,
Revoked=5`.

### Daily background — `DemoExpirationService`

Source:
[`Services/Registration/DemoExpirationService.cs`](file:///c:/code_files/spaarke/src/server/api/Sprk.Bff.Api/Services/Registration/DemoExpirationService.cs).

Runs at **midnight UTC every day**. Two responsibilities:

1. **Expire**: any record with `Status = Provisioned` and
   `sprk_expirationdate < today` gets the full teardown:
   - Disable the Entra account (Microsoft Graph).
   - Remove from Demo Team (Power Platform).
   - Revoke SPE container access (Microsoft Graph).
   - Send "your demo has expired" email to the applicant.
   - Update status to `Expired`.

2. **Warn**: any `Provisioned` record with an `sprk_expirationdate`
   within 3 days gets a "your demo expires soon" warning email
   (status unchanged).

Each record is processed independently — one failure doesn't block
others. Failures are logged and surface in App Insights.

The default demo duration is configurable per environment
(`DemoEnvironmentConfig.DefaultDemoDurationDays`) and is set when
the registration is approved (step 1 of provisioning computes
`expirationDate = UtcNow + environment.DefaultDemoDurationDays`).

---

## 6. Email notifications

The BFF sends three categories via SendGrid (separate sender/templates
from the website's own `/api/contact` SendGrid wiring — the BFF has
its own `RegistrationEmailService`).

| Email | Trigger | Recipient | Contains |
|---|---|---|---|
| **Admin notification** | New request submitted | `DemoProvisioningOptions.AdminNotificationEmails` (configured list) | Tracking ID, applicant info, deep link to the Dataverse record |
| **Applicant acknowledgement** | New request submitted | The applicant's work email | Tracking ID, "we'll review and get back to you" |
| **Welcome (credentials)** | Approve action completes step 9 | The applicant's work email | UPN, temporary password, access URL, expiration date, environment name |
| **Expiration warning** | Daily worker, 3-day window | The applicant's work email | "Your demo expires on …" |
| **Expiration notice** | Daily worker, on expiration | The applicant's work email | "Your demo has expired. To continue, contact us." |

All five emails are sent **fire-and-forget** by the calling endpoints
— a SendGrid failure is logged but does not roll back the
provisioning step.

> ⚠️ **Operational risk**: if a welcome email fails to send, the user
> has a working account but no credentials. Currently surfaced only
> in App Insights logs. Worth adding a manual-resend admin action.
> Track in main-repo issues.

---

## 7. Data persisted in Dataverse

Records live in the custom Dataverse entity **`sprk_registrationrequest`**.
Selected columns (verified against the BFF code):

| Column | Type | Set when |
|---|---|---|
| `sprk_registrationrequestid` (Guid) | PK | On create |
| `sprk_trackingid` | Text (≈ "REQ-2026-XXXX") | On create |
| `sprk_firstname` | Text | On create |
| `sprk_lastname` | Text | On create |
| `sprk_email` | Text | On create |
| `sprk_organization` | Text | On create |
| `sprk_jobtitle` | Text | On create (optional) |
| `sprk_phone` | Text | On create (optional) |
| `sprk_usecase` | Choice | On create (optional) |
| `sprk_referralsource` | Choice | On create (optional) |
| `sprk_notes` | Text | On create (optional) |
| `sprk_consentaccepted` | Boolean | On create (must be true) |
| `sprk_status` | Choice (Submitted/Approved/Rejected/Provisioned/Expired/Revoked) | Updated through lifecycle |
| `sprk_demousername` | Text | After step 1 of provisioning |
| `sprk_demouserobjectid` | Text | After step 3 of provisioning |
| `sprk_provisioneddate` | DateTimeOffset | After step 9 of provisioning |
| `sprk_expirationdate` | DateTimeOffset | After step 9 of provisioning |
| `sprk_environment` | Text | After provisioning |
| `sprk_rejectionreason` | Text | On reject |
| `sprk_reviewdate` | DateTimeOffset | On reject (also on approve) |

The website itself **does not write to or read from** this entity.
That's the BFF's responsibility.

Website-side analytics data (`entry_referrer`, `ai_source`, etc.) is
not currently persisted to Dataverse. It lives only in:
- App Insights (for Spaarke's own analytics).
- Plausible (cookieless visitor analytics).

If we wanted to attribute "this provisioned demo originated from
LinkedIn" we'd need to extend the website→BFF payload to forward
`attribution`, *and* extend the Dataverse entity with new columns.
**Open question, not currently planned** (see §11).

---

## 8. Environment configuration (BFF side)

`DemoProvisioningOptions` (`Configuration/DemoProvisioningOptions.cs`
in the BFF) defines per-environment config:

```jsonc
{
  "DemoProvisioning": {
    "DefaultEnvironment": "demo-dev",
    "DemoUsersGroupId": "<entra-group-guid>",
    "AdminNotificationEmails": ["admin@spaarke.com"],
    "Environments": [
      {
        "Name": "demo-dev",
        "DataverseUrl": "https://orgxxxx.crm.dynamics.com",
        "BusinessUnitName": "Demo BU",
        "TeamName": "Demo Team",
        "AppId": "<power-app-id>",
        "SpeContainerId": "<sharepoint-embedded-container-id>",
        "DefaultDemoDurationDays": 30
      }
      // — other envs here, e.g. demo-prod
    ]
  }
}
```

Multiple environments are supported — e.g., a dev-Spaarke environment
for testing the flow vs a prod-Spaarke environment for real customer
demos. The admin can choose at approve time:

```json
POST /api/registration/requests/{id}/approve
{ "environment": "demo-prod" }
```

If unspecified, `DefaultEnvironment` is used.

### Secrets the BFF needs

Documented in
`SPE.BFF.API-SECRETS-SETUP.md` in the BFF `docs/`. High-level:

- Microsoft Graph app registration (for Entra user creation, group
  membership, license assignment).
- Dataverse app user (for systemuser + team operations).
- SharePoint Embedded container API access (for permission grants).
- SendGrid API key (for the registration emails — separate from the
  website's SendGrid wiring).

---

## 9. Operational / monitoring considerations

Where to look when something goes wrong:

| Symptom | Where to look |
|---|---|
| Form submission shows "Couldn't reach our server" | Website App Insights — confirm the `/api/registration/demo-request` request itself; if absent, network/CDN issue |
| Form returns 502 / 5xx | BFF App Insights (Sprk.Bff.Api in the main repo's hosting) — search `RegistrationEndpoints` |
| Form returns 409 | Expected — duplicate email. Check Dataverse `sprk_registrationrequest` for an existing record on that email |
| Submission succeeded but no admin email | BFF logs — search `Failed to send admin notification` |
| Admin approved but user got no welcome email | BFF logs — partial-failure of step 9; check `DemoProvisioningException` with `[Step 9/9]` |
| Admin approved but provisioning failed mid-sequence | BFF logs — `Demo provisioning partially failed for request {RequestId}. Completed steps: [...]`; clean up partial state manually if needed |
| Demo expired but user wasn't notified | `DemoExpirationService` logs in BFF — check for the day's run |
| Demo accounts not expiring on schedule | `DemoExpirationService` worker is configured to run at midnight UTC; check it's running and the BFF service host hasn't been restarted in a way that broke the schedule |

---

## 10. UX implications for the website

What the website team needs to remember:

1. **The success screen is a promise, not a fulfillment.** When the
   form returns 202, the user has *requested* access — not received
   it. The success copy says so. Don't over-promise.

2. **The tracking ID is meaningful.** It's the BFF-issued
   `sprk_trackingid`. Surface it visibly so the user can reference it
   if they have questions. The BFF can look up the record by
   tracking ID.

3. **The 409 means real success in the background.** It indicates
   the user already has an active request or provisioned account.
   The new copy reflects this: "Looks like that email is already on
   our list. We'll be in touch — no need to submit again."

4. **CAPTCHA failures should retry once before showing the error.**
   Particularly relevant since `/access-request` is dynamic (SSR) —
   the reCAPTCHA widget should be loaded by the time the user
   submits, but cold-start timing can occasionally produce empty
   tokens.

5. **No need to handle "your account is ready" client-side.** The
   user finds out by email, not by polling our API. We don't
   currently have any "check status" UX, and unless the team wants
   to build that, we don't need it — the BFF + email handles the
   loop.

6. **Form-submission attribution doesn't reach the BFF.** Our
   first-touch attribution (`entry_referrer`, `ai_source`, etc.)
   stays in our own analytics — Plausible + App Insights — and is
   not forwarded to Dataverse. If we ever want "this demo customer
   came from LinkedIn → submitted Take Tour → converted to demo
   request 4 days later," we'd need to extend both the BFF schema
   and the website→BFF payload. **Not currently planned.**

---

## 11. Open questions / future improvements

Items worth tracking; not currently scoped:

- **Forward website attribution to the BFF / Dataverse.** Would
  let sales correlate the lead source with the eventual customer.
  Requires schema additions on the BFF + an additive payload from
  the website. Effort: low. Value: medium-high. Track in
  `projects/website-analytics-platform/spec.md` as a Phase 3
  candidate.

- **Status-check page.** A `/access-request/status?id=<trackingId>`
  page that lets the applicant check their request status without
  needing to email us. Requires an unauthenticated read endpoint on
  the BFF. Effort: low. Value: low (one-off email exchange covers
  it).

- **Resend welcome credentials.** Admin action when the welcome
  email failed to deliver but provisioning succeeded. Currently a
  manual ops task. Effort: low (BFF endpoint + admin UI).

- **Partial-failure auto-rollback.** If a step in the 9-step
  sequence fails, optionally roll back earlier steps (delete Entra
  user, etc.) instead of leaving partial state. Risky — might
  prefer the current "leave for ops to investigate" posture. ADR
  decision in BFF.

- **Hybrid resilience pattern.** Website could write its own
  Demo Requests row before forwarding to the BFF, so a BFF outage
  doesn't lose the lead. Adds complexity; the current architecture
  loses no data because the website's submit blocks until the BFF
  responds 2xx (so a BFF outage shows the user an error and they
  retry). Worth re-evaluating only if BFF availability becomes a
  real issue.

- **Replace BFF call with Service Bus message.** Decouple the
  website from BFF availability via a queue. Site submits → message
  to Service Bus → BFF processes asynchronously. Deferred decision
  — current synchronous call is fine for current volume.

---

## 12. Quick links

**In this repo (website)**:
- [`src/app/api/registration/demo-request/route.ts`](../../src/app/api/registration/demo-request/route.ts) — the proxy.
- [`src/components/DemoRequestForm.tsx`](../../src/components/DemoRequestForm.tsx) — the form.
- [`src/app/access-request/page.tsx`](../../src/app/access-request/page.tsx) — the page.

**In the main Spaarke repo** (`c:\code_files\spaarke`):
- `src/server/api/Sprk.Bff.Api/Endpoints/RegistrationEndpoints.cs` — the three endpoints.
- `src/server/api/Sprk.Bff.Api/Services/Registration/DemoProvisioningService.cs` — the 9 steps.
- `src/server/api/Sprk.Bff.Api/Services/Registration/RegistrationDataverseService.cs` — Dataverse persistence + status enum.
- `src/server/api/Sprk.Bff.Api/Services/Registration/DemoExpirationService.cs` — daily expiration worker.
- `src/server/api/Sprk.Bff.Api/Services/Registration/RegistrationEmailService.cs` — email templates.
- `src/server/api/Sprk.Bff.Api/Services/Registration/GraphUserService.cs` — Microsoft Graph operations.
- `src/server/api/Sprk.Bff.Api/Services/Registration/EmailDomainValidator.cs` — disposable-domain blocking.
- `src/server/api/Sprk.Bff.Api/Models/Registration/DemoRequestDto.cs` — the BFF's DTO shape.
- `src/server/api/Sprk.Bff.Api/Configuration/DemoProvisioningOptions.cs` — environment config schema.
- `src/server/api/Sprk.Bff.Api/docs/SPE.BFF.API-TECHNICAL-OVERVIEW.md` — BFF-wide architecture.
- `src/server/api/Sprk.Bff.Api/docs/SPE.BFF.API-SECRETS-SETUP.md` — secrets configuration.
