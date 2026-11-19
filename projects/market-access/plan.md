# Market access: implementation plan

> **Status**: Draft for owner review (2026-11-19). No code until Ralph approves it.
> **Spec**: [`spec.md`](spec.md) · **Design**: [`design.md`](design.md) · **Tasks**: [`tasks/TASK-INDEX.md`](tasks/TASK-INDEX.md)

## Approach

Build from the bottom up, and keep every step shippable on its own:

1. Prove the sign-in model on a preview environment before anything depends on it.
2. Build the store and `recordActivity`, then point the existing site writers at it. From that moment the log fills on its own, before any admin page exists.
3. Add the admin pages that read and edit the log.
4. Add mailbox sync, which needs the Exchange setup Ralph runs (task 003).
5. Add the imports and the one-time backfill.
6. Add the morning report sections and the privacy text, then wrap up.

Every PR merges dark: nothing a visitor sees changes, and every new writer call is fire-and-forget with a timeout. The admin area exists only behind the role.

## Phases

### Phase 0: Foundations (tasks 001 to 004)

| Task | Deliverable |
|---|---|
| 001 Auth spike | A note in `notes/auth-spike.md` that answers, on a real preview environment: do `staticwebapp.config.json` route rules guard hybrid Next.js pages and route handlers; does `x-ms-client-principal` reach server code; can a visitor forge it; does a 401 override disturb existing routes. Ends in a decision on the guard design. |
| 002 Admin guard and shell | `requireAdmin()` and `requireRole()` for pages and route handlers, the route rules (if the spike keeps them), the `/admin` layout, `noindex`, and the robots disallow. |
| 003 Exchange and app setup instructions | `docs/market-access-mailboxes.md`: the app registration, Key Vault secret, the mail-enabled group, management scope and `Application Mail.Read` assignment, and the two-step "add a mailbox" runbook. Ralph runs these. |
| 004 App Insights safety export | A private export of the `brief.read` and `ask_ai.click` events (with `--offset 90d`) into `C:\code_files\spaarke-research`, so the 2027-02-11 retention deadline stops being a risk while the backfill (052) is built. |

**Milestone M0:** the admin shell is live in production behind the `admin` role, and Ralph can sign in. Acceptance: success criterion 1.

### Phase 1: Store and activity log (tasks 010 to 013)

| Task | Deliverable |
|---|---|
| 010 Market store | `src/lib/market/store.ts`: one cached `TableClient` per `Ma*` table (the `src/lib/meet/store.ts` pattern), table name overrides for dev, entity types, key helpers, and the visibility filter used by every read. |
| 011 Contact and organization resolution | `resolveContact()`: normalized email, alternate emails, organization by domain with the free-mail list, tombstone check, and first-source capture. |
| 012 `recordActivity` | Idempotent append to `MaActivities` (partitioned by contact) and `MaActivityByMonth`, keyed by source plus source ID; `recordActivitySafe()` wraps it in a timeout and never throws. |
| 013 Campaigns, members and audit | `MaCampaigns`, `MaMembers` (partitioned by campaign), code and brief-label lookup, and `MaAudit` writes. |

**Milestone M1:** the store passes its check script (`npm run market:check`) against dev tables, including re-running the same writes with no duplicates.

### Phase 2: Site writers (tasks 020 to 022)

| Task | Deliverable |
|---|---|
| 020 Form writers | One `recordActivitySafe` call in each form path: contact, demo, design partner, early release, investor overview. Open question 3 (default visibility) is settled here. |
| 021 Meeting writers | `meeting.booked`, `meeting.rescheduled`, `meeting.cancelled` from `src/lib/meet/service.ts`. |
| 022 Brief and Ask AI writers | `brief.read` and `ask_ai.click` resolved through the recipient code or brief label to a campaign member; skipped when neither resolves. |

**Milestone M2:** a test form submission on the preview environment appears as a contact with its activity and UTM fields, and with the market tables unavailable every form still succeeds. Acceptance: success criterion 4.

### Phase 3: Admin pages (tasks 030 to 034)

| Task | Deliverable |
|---|---|
| 030 Home and contacts list | `/admin` (recent activity, new contacts, slots for follow-ups and triage) and `/admin/contacts` with search and filters. |
| 031 Contact detail and edits | `/admin/contacts/[id]`: profile, timeline, memberships, follow-ups, add note, log activity, edit, merge, delete with tombstone, all audited. |
| 032 Organizations | `/admin/organizations` and `/admin/organizations/[id]`, with the domain override. |
| 033 Campaigns and results | `/admin/campaigns` and `/admin/campaigns/[slug]`: member status derived from the log, manual override, the funnel and the per-member table. |
| 034 Follow-ups | Per-contact and bulk follow-ups, and the due and overdue list on `/admin`. |

**Milestone M3:** every page renders for `admin` and refuses all others, and an admin without `investor` sees no investor record or count.

### Phase 4: Mailbox sync (tasks 040 to 043)

Needs task 003 run in the tenant, and open question 1 answered.

| Task | Deliverable |
|---|---|
| 040 Graph mail client | Read Inbox and Sent Items since a checkpoint (sender, recipients, subject, time, web link), and detect non-delivery reports. |
| 041 Mailbox registry | `MaMailboxes` and `/admin/mailboxes`: add, pause, remove, and the last sync time and error. |
| 042 Sync engine and schedule | `/api/market/sync` behind a bearer token, one mailbox at a time, `MaSyncState` checkpoints, email activities, bounces, member status and follow-up auto-close; `.github/workflows/mail-sync.yml` every 30 minutes. |
| 043 Triage | `MaTriage` and `/admin/triage`: accept, link or dismiss, sender and domain blocks, and the 30-day cleanup. |

**Milestone M4:** success criteria 3 and 7.

### Phase 5: Imports and backfill (tasks 050 to 053)

| Task | Deliverable |
|---|---|
| 050 TLTF import CLI | `scripts/market/import-tltf.mts` reading the private files by path. Open question 2 (confirming which Summit meetings took place) is settled here. |
| 051 Engagement filter | The `track.py` scanner filter ported to TypeScript, used by campaign results, and checked against `track.py` output. |
| 052 Backfill CLI | Existing site tables and the App Insights events into contacts and activities, keeping timestamps and UTM fields. Must run before 2027-02-11. |
| 053 LinkedIn CSV import | `/admin/import`: pick a campaign, map columns, preview, confirm; parsed in memory only. |

**Milestone M5:** success criteria 2 and 5.

### Phase 6: Reporting and privacy (tasks 060 to 061, then 090)

| Task | Deliverable |
|---|---|
| 060 Morning report | Follow-ups due and new contacts in `src/lib/reports/daily.ts`, with investor records as a count only. |
| 061 Privacy page | The contact and activity records, sources, retention and how to ask for deletion. |
| 090 Wrap-up | Every success criterion verified, the repo privacy grep, README and plan marked complete, lessons in `notes/`. |

**Milestone M6:** success criteria 6 and 8, and the project closes.

## Dependencies between phases

```
001 ─▶ 002 ─▶ 030..034 ─▶ 041, 043, 053
010 ─▶ 011 ─▶ 012 ─▶ 013 ─▶ 020..022, 030..034, 050..053
003 (Ralph runs it) ─▶ 040 ─▶ 042 ─▶ 043
004 ─▶ 052 (lowers the deadline risk; 052 still reads the live data if it runs in time)
```

Phase 1 does not depend on Phase 0's auth work, so the store can be built while the spike's preview deploy waits on Ralph's sign-in.

## Design decisions the plan adds

These fill gaps the spec leaves to implementation. Each is reversible.

- **Write path.** `recordActivitySafe()` is awaited inside the request, raced against a 1,500 ms timeout, and swallows every error. On Static Web Apps' managed functions a promise left running after the response may be frozen, so true fire-and-forget would lose writes. The timeout caps the visitor cost; the spike measures the normal cost (one or two Table Storage writes, typically under 100 ms).
- **Contact key.** `MaContacts` is partitioned by the first two hex characters of a SHA-256 of the normalized email, and keyed by the hash. A lookup by email is a point read, and the email itself never appears in a key. Alternate emails are rows in an `email` index partition that point to the primary.
- **Activity key.** `MaActivities`: partition is the contact ID; row key is an inverted timestamp plus the idempotency key's hash, so a timeline reads newest first. A separate idempotency row (`idem:<hash>`) makes re-runs no-ops.
- **Sync route.** The scheduled sync calls `/api/market/sync`, not `/api/admin/...`, because a bearer-token caller has no signed-in role. It follows `/api/reports/daily`.
- **Scripts.** CLI importers are `.mts` run with `tsx`, like the existing `scripts/*.mts`, so they import `src/lib/market` directly rather than duplicating it.
- **Tests.** The repo has no test runner. Each task adds to a `scripts/check-market.mts` check script (`npm run market:check`) that runs against dev tables named by `MA_TABLE_SUFFIX=Dev`, the same way `/meet` uses `MeetingBookingsDev`.

## Open questions and when they are raised

| # | Question | Raised at | Recommendation |
|---|---|---|---|
| 1 | Reuse the `/meet` Graph app for mail read, or register a separate one? | Task 003, before the instructions are final | A separate app ("Spaarke market access sync"). The `/meet` secret is used on every public booking request; keeping mail read on its own app and secret limits what a leak of either exposes, and the two can be rotated apart. |
| 2 | Should Summit `meeting.in_person` entries come from the calendar import only, or should Ralph confirm which took place? | Task 050 | Import them as `planned`, then let Ralph confirm in one pass on the campaign page. |
| 3 | Should contacts from the website forms start as `general` even when they are investors? | Task 020 | Yes, `general`, except the investor overview form, which starts as `investor`. Ralph reclassifies the rest. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| SWA route rules do not apply to hybrid Next.js routes. | Medium | Task 001 tests it first. The server-side `x-ms-client-principal` check in every page and route is the guard either way. |
| A custom Entra registration puts the tenant ID in `staticwebapp.config.json` (the `openIdIssuer` URL), which NFR-01 forbids. | High if the custom provider is used | The spike tests the pre-configured Microsoft Entra provider with an invitation-assigned `admin` role, which needs no tenant ID in git. |
| The App Insights backfill misses the 2027-02-11 retention cliff. | Low | Task 004 exports the events privately now; task 052 is scheduled before mid-January. |
| Writers slow or break public forms. | Low | Timeout, swallowed errors, and the M2 test with the tables unavailable. |
| Mail sync stores personal mail. | Low | `known-only` mode ignores unknown counterparts; only metadata is stored; triage holds sender, subject, time and link only. |
| Private data leaks into the public repo. | Medium over the life of the project | Imports take paths at run time; tests use made-up data; the wrap-up and every PR run a grep for addresses, codes and tenant IDs. |
| Exchange RBAC takes up to two hours to apply. | Certain | The sync shows a clear "no access" error per mailbox and keeps going (FR-08). |

## Out of scope

As in the spec: sending mail, LinkedIn API, paid-media metrics, CRM sync, other users.
