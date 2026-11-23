# Task 004: Counsel review

**Phase:** 0 (Decisions and setup)
**Status:** completed
**Estimated:** external (owner and counsel)
**Dependencies:** none
**Tags:** content, compliance

## Goal

Counsel has approved the spec's Compliance section and every item in its
"For counsel" checklist is ticked (success criterion 2).

## Context

The flow answers only texts a person sends, one reply each, which Twilio
classes as conversational consent. Counsel decides whether that holds under
the TCPA, the FCC revocation rules, and state mini-TCPA laws. Going live
(task 041) waits for this.

## Steps

1. Owner sends counsel the spec's Compliance section, the live
   https://spaarke.com/sms page, the privacy policy "Text messages" section,
   and the MEET and HELP texts.
2. Counsel works through the checklist: consent and revocation, the wording,
   the privacy paragraph and the Twilio clause, a DPA with Twilio, state
   laws, retention (proposed 12 months from last activity).
3. Record each answer in spec.md under "For counsel" and tick it.
4. If counsel changes any wording: change `src/lib/sms/messages.ts` once,
   which updates `/sms` and the opt-in image, and update the verification
   submission to match before go-live.
5. If counsel sets a retention period, add a task for the cleanup job.
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `projects/text-to-meet/spec.md`: counsel checklist ticked

## Acceptance Criteria

- [x] Every "For counsel" item ticked with the answer
- [x] Any wording change made in `messages.ts` and the submission (none asked)

## Notes

Counsel's review is not legal advice from this project; the spec only
drafts. Keep counsel's notes out of the public repo beyond the outcome.

### Done (2026-11-23)

The owner reported counsel's approval of the Compliance section as drafted.
No wording changed. The proposed retention (12 months from last activity,
opt-out flags kept while Twilio holds the number) stands, so task 043 adds
the cleanup job.
