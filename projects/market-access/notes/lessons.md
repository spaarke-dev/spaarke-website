# Lessons learned

What the market access project taught, for the next module on this site. Written 2026-11-24, at the end of task 090.

## What worked

- **A spike before the guard.** Task 001 answered seven questions about SWA authentication on a throwaway preview before any admin code existed. Two answers changed the design:
  - Route rules do guard hybrid Next.js routes.
  - A 401 override would turn API answers into redirects, so the API checks roles in code.
- **One writer, one ID.** Every source (site forms, meetings, mail, imports, backfill) goes through `recordActivity` with a source ID built the same way. That is why re-runs, retries and the backfill never doubled anything. The backfill calls the live writers' own builders rather than copying their logic.
- **Checks against an emulator, not live storage.** `npm run market:check` refuses to run without `MA_TABLE_SUFFIX`, so it can never touch live tables. It grew from 16 checks to 59, and the made-up data in it never needed scrubbing.
- **Private files read at run time.** The TLTF import and the backfill take paths to the private files as arguments and print counts only. Nothing private was ever staged.
- **Dry runs that count what the real run does.** The import and the backfill each ran dry against live data first. The real run then matched the dry run, and a second run added nothing.
- **Asking at the task that needs the answer.** The three open questions were each asked at the task they blocked, so the work kept moving while they were open.

## What to do differently

- **Measure engagement as a person would, from the start.** Mail security gateways open and click every link within minutes of delivery. Without the quiet window and burst filter (task 051), 38 TLTF recipients had a hit, against 6 who engaged. Any future tracked send needs the filter on day one, and the first hit never counts.
- **Expect scheduled jobs to run late.** GitHub started the 30-minute sync up to 44 minutes apart. A promise like "within 30 minutes" needs a schedule of about half that.
- **Test scale with a production build.** At 7,000 contacts, `next dev` took 3 minutes on the contacts list and overflowed its stack, while the production build answered in 0.4 s. Development mode is no guide to production speed.
- **Exchange scope tests need a real mailbox.** A made-up address answers 404, not 403, so only a real mailbox outside the scope tests the scope.

## Data quirks worth knowing

- The Summit calendar export uses Windows time zone names ("Eastern Standard Time"); `tltf-import.ts` maps them to IANA names.
- Outreach file names for a general inbox carry only the firm: `<code> <firm>.eml`, with no person's name in parentheses.
- App Insights does not keep the brief label behind an Ask AI click. The backfill matched live clicks by member, provider and a two-second window instead.
- Mail gateways sometimes rewrite a link's code; the click still resolves through the brief label and is flagged `codeRewritten`.
- A booking keeps only its last move, so the backfill can restore only that move.

## Running it

- **Deploys:** SWA preview close jobs are often canceled when two workflows overlap. Re-run the close job, then confirm with `az staticwebapp environment list` that the preview is gone.
- **Secret:** the mail sync reuses the `/meet` Graph app, so its secret expiry (2027-11-13) stops both booking and sync. Rotate it about two weeks before.
- **Retention:** activity entries are kept for no more than three years (privacy page). No automatic purge exists yet; the first entries come due in 2029.
