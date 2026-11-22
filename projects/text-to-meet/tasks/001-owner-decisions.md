# Task 001: Owner decisions and spec sign-off

**Phase:** 0 (Decisions and setup)
**Status:** not-started
**Estimated:** 1 hour (owner)
**Dependencies:** none
**Tags:** content, config

## Goal

The spec's two open owner questions are answered, the answers are written
into spec.md, and the owner has signed off the spec (success criterion 1).

## Context

Spec "Unresolved Questions". The build can start on the spec's assumptions;
these answers change only FR-13 (the phone hash), FR-17 (placement codes),
and possibly the privacy wording.

## Steps

1. Owner answers: does the team want the phone number itself, to call or
   text the person back? The spec assumes no (keyed hash only). A yes
   changes FR-13, the privacy paragraph, the verification's use case, and
   needs counsel.
2. Owner answers: is MEET the final keyword, and may a placement code follow
   it on print ("Text MEET CARD2")? A different keyword means a new
   verification submission.
3. Owner lists the first placement codes, if any (for example `CARD2`,
   `SIG`, one per event).
4. Record the answers in spec.md "Owner Clarifications", tick the questions,
   and change the status line to "Signed off by the owner, <date>".
5. If an answer changes a requirement, edit that FR and note the affected
   tasks in TASK-INDEX.md.
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `projects/text-to-meet/spec.md`: answers recorded, status signed off

## Acceptance Criteria

- [ ] Both questions ticked with the owner's answers
- [ ] Placement codes listed for FR-17, or "none for now"
- [ ] Spec status reads signed off, with the date

## Notes

Keeping the spec's assumptions (no readable number, MEET with optional
codes) means no change to tasks 010 to 032.
