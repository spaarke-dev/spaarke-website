# Task 002: Twilio account and Messaging Service

**Phase:** 0 (Decisions and setup)
**Status:** not-started
**Estimated:** 1 hour (owner; Claude can drive the Console in the owner's Chrome)
**Dependencies:** none
**Tags:** config, deploy

## Goal

The Twilio account is paid, the toll-free number sits in a Messaging Service
named "Spaarke meeting links" with Advanced Opt-Out and the FR-11 HELP text,
and messaging is limited to the US and Canada (spec FR-01).

## Context

The account is still a trial. A trial account cannot complete Toll-Free
Verification or text unverified phones, so the upgrade comes first. The
webhook URL is not set here; it is set in task 041 so no real text reaches
the route before go-live.

## Steps

1. Owner upgrades the account to paid in the Twilio Console (billing is the
   owner's step; Claude does not enter payment details).
2. Messaging > Services > Create: "Spaarke meeting links", use case
   "Customer care" or the closest match. Add the toll-free number to its
   sender pool.
3. In the service: Opt-Out Management > Advanced Opt-Out on. Set the HELP
   reply to `HELP_REPLY` in `src/lib/sms/messages.ts`, character for
   character. Leave STOP and START on Twilio's defaults (toll-free STOP
   replies cannot be changed). Advanced Opt-Out can only be switched off by
   Twilio support: the owner turns it on knowingly.
4. In the service's Integration, leave incoming messages on "Defer to
   sender's webhook" for now, and confirm the number's own webhook is empty.
5. Messaging > Settings > Geo permissions: US and Canada only.
6. Check the Toll-Free Verification status and record it in
   current-task.md.
7. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- Twilio configuration (no files; nothing is committed)
- `projects/text-to-meet/current-task.md`: verification status

## Acceptance Criteria

- [ ] Account is paid
- [ ] Messaging Service exists with the number, Advanced Opt-Out on, HELP
      text identical to `HELP_REPLY`
- [ ] Geo permissions allow only the US and Canada
- [ ] No webhook URL set yet

## Notes

The owner signs in to Twilio in their own Chrome; sign-in fails in the
built-in browser pane. Never write the SIDs or the number into the repo.
