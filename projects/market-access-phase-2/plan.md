# Market access phase 2: implementation plan

> **Status**: Approved by the owner (2026-11-24).
> **Spec**: [`spec.md`](spec.md) · **Design**: [`design.md`](design.md) · **Tasks**: [`tasks/TASK-INDEX.md`](tasks/TASK-INDEX.md)
> **Builds on**: [`../market-access/plan.md`](../market-access/plan.md). Phase 1 stays open for Ralph's final checks; nothing here closes it.

## Approach

Build in the order a second campaign needs it, and keep every PR shippable on its own:

1. Answer the calendar questions on live Graph before calendar code depends on them, and give Ralph the Exchange step early, since it can take two hours to apply.
2. Get people in: the target list import and "Add contact".
3. Give them codes, briefs and links, so the first emails can go out from Outlook with tracked links.
4. Add calendar entries, so meetings show without logging them by hand.
5. Add follow-up steps and the daily job that turns them into follow-ups.
6. Add the health lines and the alert, then wrap up.

Every PR merges dark for visitors. New admin features sit behind the `admin` role, new writes go through `recordActivity` and the phase 1 contact resolution, and every task adds to `npm run market:check` against Azurite.

## Phases

### Phase 0: Calendar access (task 001)

| Task | Deliverable |
|---|---|
| 001 Calendar access spike and Exchange step | A note in `notes/calendar-spike.md` that answers, against Ralph's mailbox with the existing app: does `calendarView/delta` work app-only within a date window; how a rolling 30-back, 90-ahead window is kept when the delta window is fixed at its first call; what a canceled, moved and private event looks like in the delta; and which field matches a `/meet` booking's event ID. Plus the `Application Calendars.Read` command for contactus@ in `docs/market-access-mailboxes.md`, which Ralph runs. |

**Milestone M0:** the calendar read design is settled, and Ralph has run the Exchange step for contactus@.

### Phase 1: Target lists (tasks 010 to 011)

| Task | Deliverable |
|---|---|
| 010 Target list import | `src/lib/market/target-import.ts`: column mapping with the target fields, row checks, preview, and the run, through the phase 1 contact resolution and `addMember`. The import page gets a "Target list" choice next to "LinkedIn leads", with a new or existing campaign and visibility. Reuses `csv.ts`. |
| 011 Add contact | An "Add contact" form on `/admin/contacts` and `POST /api/admin/contacts`: resolution, the "already a contact" answer with its link, and the "Added by hand" first activity. |

**Milestone M1:** a made-up target list imports into a new campaign in the Check tables, a second import adds nothing, and one person added by hand shows in the list. Covers FR-01 and FR-02.

### Phase 2: Codes, briefs and links (tasks 020 to 022)

| Task | Deliverable |
|---|---|
| 020 Member codes | `src/lib/market/codes.ts`: the campaign's code prefix, "Give everyone a code", the next number for later members, and the brief label `<slug>:<code>` on each member, through the phase 1 code and label indexes. |
| 021 Campaign brief | Write, update and switch off `PrivateBriefs` rows in `src/lib/private-brief.ts`; one random key for each coded member; the brief editor and on/off switch on the campaign page. The text never leaves Table Storage. |
| 022 Links and export | The links table on the campaign page (brief, Ask AI for each provider, tagged site link) and "Export links" as a CSV built in the browser. |

**Milestone M2:** in the Check tables, a coded campaign's export opens with one row per member; a brief read and an Ask AI click from it count for the right member; turning the briefs off makes the link answer 404. Covers FR-03 to FR-05 and success criteria 1 and 2.

### Phase 3: Calendar (tasks 030 to 032)

| Task | Deliverable |
|---|---|
| 030 Graph calendar client and registry setting | `src/lib/market/graph-calendar.ts` (the delta read the spike settled), a "Read calendar" setting on each mailbox with its own checkpoint and error, and "Check access" covering the calendar. |
| 031 Calendar entries in the sync | `src/lib/market/calendar-sync.ts`: booked, moved, canceled and held entries for events with a known contact; private events; the `/meet` skip; run inside the mail sync's time budget. |
| 032 Meetings in results | `calendar.held` counts toward the `meeting` stage; booked and moved do not. Timeline icons and labels for the four new types. |

**Milestone M3:** a test meeting from Ralph's calendar and one from contactus@ show booked, then held, on the contact, and the campaign funnel changes only once held. Covers FR-06 to FR-08 and success criterion 3.

### Phase 4: Follow-up steps (tasks 040 to 042)

| Task | Deliverable |
|---|---|
| 040 Follow-up steps | `MaSteps` and `src/lib/market/steps.ts`; add, edit, order, switch off and remove steps on the campaign page, audited; "Stop steps" on a member. |
| 041 Daily follow-up job | `src/lib/market/step-run.ts`: which members each step applies to today, the 7-day catch-up, the stop rules, and one follow-up per member and step through `MaStepRuns`; `POST /api/market/followups/run` behind the sync token. |
| 042 Job schedule and Write in Outlook | `.github/workflows/followup-steps.yml` at 11:00 UTC and on demand; the "Write in Outlook" link on every open follow-up, on the contact and the campaign. |

**Milestone M4:** a "7 days after first email, no reply" step creates follow-ups for exactly the members still at `sent`, and a second run that day creates none; "Write in Outlook" opens a message with the subject filled in. Covers FR-09 to FR-12 and success criteria 4 and 5.

### Phase 5: Health (tasks 050 to 051, then 090)

| Task | Deliverable |
|---|---|
| 050 Sync health and alert | A failure count on each mailbox; the "Mail sync" line in the morning report; one alert email on the third failed run in a row, at most once a day for each mailbox. |
| 051 Secret expiry warning | `MEET_GRAPH_SECRET_EXPIRES` read by the morning report, with a warning 30 days ahead and "unknown" without it; the setting added to the rotation steps in the setup guide. |
| 090 Wrap-up | Every success criterion verified, the privacy search rerun, the Lighthouse and axe pass, lessons in `notes/`. The README and milestones are marked complete only after Ralph's final checks. |

**Milestone M5:** success criteria 6 and 7, and the project closes once Ralph has done his checks.

## Dependencies between tasks

```
001 ─▶ 030 ─▶ 031 ─▶ 032
010 ─▶ 020 ─▶ 021 ─▶ 022
011 (needs nothing new)
020 ─▶ 040 ─▶ 041 ─▶ 042
031 ─▶ 041 (the "first meeting held" anchor reads calendar.held)
050, 051 (need nothing new)
```

Phases 1 and 2 do not wait on the calendar spike, so contacts, codes and briefs can be built while the Exchange step takes effect. If calendar work runs late, task 041 ships with the "first email sent" anchor first and adds "first meeting held" when 031 lands.

## Design decisions the plan adds

These fill gaps the spec leaves to implementation. Each can be reversed.

- **Brief keys.** Members already carry `briefKeyHash` from phase 1. Task 021 keeps that: the member row stores the hash, and the export reads the keys from `PrivateBriefs` by the campaign's brief labels. So a key lives only where the brief text lives.
- **Brief rows for one campaign.** `PrivateBriefs` rows keep PartitionKey `brief` so `getPrivateBrief` stays a point read. Saving or switching off a campaign's briefs walks its members and updates each row by key; with at most a few hundred members a campaign, that stays well inside a request.
- **Code numbers.** The next number comes from a counter row on the campaign, claimed with an ETag check, so two runs at once never hand out the same code. The phase 1 code index stays the final guard against a clash across campaigns.
- **Calendar checkpoint.** Calendar state lives in `MaSyncState` next to the mail folders, keyed by mailbox and `calendar`, so "Read again" and the checkpoint rules apply to it unchanged.
- **Calendar entry IDs.** Source `graph-calendar`, source ID built from the event's `iCalUId` and the entry type (plus the new start time for a move), so re-reads and both mailboxes seeing the same meeting add nothing.
- **Held entries.** The sync logs `calendar.held` for events whose end has passed on any run, not only on the run that sees a change, so a meeting with no edits still gets its held entry.
- **Step follow-up IDs.** `MaStepRuns` keys a run by campaign, step and member, and the follow-up ID comes from the same three, so a second job run finds what the first made.
- **Anchors.** "First email sent" reads the member's earliest `email.sent` within the campaign window; "first meeting held" reads the earliest `calendar.held`, `meeting.booked` (`/meet`, counted when booked as in phase 1) or `meeting.in_person`.
- **Alert sender.** The sync alert uses the same SendGrid sender as the morning report, with the same recipient setting.

## Open items and when they are raised

| # | Item | Raised at | Recommendation |
|---|---|---|---|
| 1 | Ralph runs the `Application Calendars.Read` command for contactus@. | Task 001 | Run it as soon as task 001 merges; it can take two hours to apply. |
| 2 | Is the delta window workable for a rolling 30-back, 90-ahead range? | Task 001 | If not, fall back to reading `calendarView` for the window on each run and keeping a hash of each event's state. The spike decides. |
| 3 | Set `MEET_GRAPH_SECRET_EXPIRES` to 2027-11-13. | Task 051 | The task sets it with `az staticwebapp appsettings set`, with Ralph's go-ahead at that task. |

The spec's seven assumptions stand as written, since Ralph accepted the spec on 2026-11-24.

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| The `/meet` app's calendar assignment does not cover reading Ralph's calendar the way the sync needs. | Low | Task 001 tests it first. It already reads and writes events there for `/meet`. |
| A meeting with several contacts, or seen in both calendars, logs twice. | Medium | One entry for each contact and event, keyed by `iCalUId`, which is the same in both calendars. |
| Calendar reads slow the mail sync past its time budget. | Low | Shared budget, clean stop, checkpoint resume (NFR-04). |
| Step follow-ups pile up for members who already replied by phone or in person. | Medium | Stop rules, "Stop steps" on a member, and follow-ups closing on the next sent email as in phase 1. |
| A brief key or brief text leaks into the repo or a log. | Low | Keys and text stay in Table Storage; the export is built in the browser; the wrap-up reruns the phase 1 privacy search. |
| The daily job runs late or not at all. | Medium | The 7-day catch-up, and a failed run fails the workflow so GitHub emails Ralph. |

## Out of scope

As in the spec: sending email from the admin area, a brief text per person or group, the three-year purge, the weekly LinkedIn reminder, a link to the content calendar's GitHub Project, paid-media metrics, and calendars other than the two named.
