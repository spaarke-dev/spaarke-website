# Task 012: Check script, offline cases

**Phase:** 1 (Core library)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 010, 011
**Tags:** testing, typescript

## Goal

`npm run sms:check` runs every offline case and exits non-zero on a failure.
Task 022 adds the route cases behind a `--server` flag.

## Context

The repo has no test framework; checks are `tsx` scripts
(`scripts/check-meet-slots.mts`, `scripts/check-market.mts`). Spec FR-03,
FR-04, FR-07, FR-15 and success criterion 8 name this script.

## Steps

1. `scripts/check-sms.mts`, loading `.env.local` the way
   `scripts/check-meet-graph.mts` does, with a small `check(name, ok)`
   helper and a summary line.
2. Signature cases: Twilio's documented example (copy the URL, parameters,
   token and expected signature from
   https://www.twilio.com/docs/usage/webhooks/webhooks-security) passes; a
   changed parameter, a changed URL, and a wrong token fail; the previous
   token is accepted when passed.
3. Keyword cases: each word list in task 010, punctuation and case, codes,
   free-text stop phrases, `OptOutType` precedence.
4. Token cases: the five in task 011.
5. Reply cases: `meetReply()` with a real token on `SITE_URL` is at most 306
   characters and pure GSM-7; the nudge and `HELP_REPLY` are GSM-7. Write
   the GSM-7 basic set and extension table check in the script.
6. Add `"sms:check": "tsx scripts/check-sms.mts"` to `package.json`.
7. Run it; all pass.
8. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `scripts/check-sms.mts`
- `package.json`: `sms:check` script

## Acceptance Criteria

- [ ] All offline cases pass
- [ ] A deliberately broken reply (an em dash or a curly quote in
      `meetReply`) fails the GSM-7 case
- [ ] The script prints no secret values

## Notes

A curly apostrophe is not GSM-7 and would turn the whole message into UCS-2
(70 characters a segment). This check is what keeps the reply at two
segments.
