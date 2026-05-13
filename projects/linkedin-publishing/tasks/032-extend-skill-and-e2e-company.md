# Task 032: Extend skill for company voice + E2E test on Company Page

**Phase:** 3 — Company-page publishing (gated)
**Status:** blocked — waits on 030
**Estimated:** 1.5 hours
**Dependencies:** 012, 031
**Tags:** claude-code, skill, voice, e2e, milestone

## Goal

The skill drafts in company voice when `--target=company`, and an
end-to-end test produces the first real Spaarke Company Page post.
**Milestone M4.**

## Context

The skill already has the company-voice section (task 012); this
task validates that it produces good output when targeting the
company page, and runs a real post as the milestone.

## Steps

1. Re-read the company-voice prompts in `.claude/skills/publish-linkedin/SKILL.md`. Confirm the institutional register comes through cleanly.
2. Confirm the skill picks the right voice when `--target=company`:
   - Pronouns: "we / our / Spaarke"
   - Source docs: `content-platform/voice/style-guide.md` + `brand-positioning.md`
   - Length: 150–200 words
3. Dry-run test:
   - From Claude Code: `/publish-linkedin the-iq-stack --target=company`
   - Skill drafts company-voice commentary
   - Verify the draft reads like Spaarke house voice, not like the personal post that would have been drafted with `--target=personal`.
4. If the draft is off (too casual, wrong pronouns, etc.), refine the prompts in the skill and re-test.
5. Real post:
   - When the draft is good, type `approve`.
   - Skill invokes `npm run linkedin:publish --slug=<slug> --target=company`.
   - Post URL returned.
6. Verify on LinkedIn:
   - Post appears on the **Spaarke Company Page feed** (not on the operator's personal feed).
   - Author shows as "Spaarke" with the company logo, not the operator's name + photo.
   - Image, link card, commentary all render correctly.
7. Document the experience in `notes/e2e-company-<date>.md`.

## Expected Outputs

- Possibly refined `.claude/skills/publish-linkedin/SKILL.md` — prompt tuning
- One real Spaarke Company Page post (keep it — first official post via this system)
- `notes/e2e-company-<date>.md`
- `current-task.md` updated; `plan.md` M4 milestone checked

## Acceptance Criteria

- [ ] Post visible on the Spaarke Company Page LinkedIn feed.
- [ ] Author = Spaarke (organization), not the operator personally.
- [ ] Draft commentary uses "we / our / Spaarke" pronouns, no "I".
- [ ] The skill's chat output clearly shows which voice doc was used to draft.
- [ ] No partial state on disk after success.

## Notes

- This is the milestone for Phase 3. Once this passes, the system is feature-complete except for polish.
- If the company-voice draft is too generic, that's a prompt-tuning iteration, not a code issue.
- Don't delete the test post — it becomes the first "real" company post.
