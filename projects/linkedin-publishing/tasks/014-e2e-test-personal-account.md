# Task 014: End-to-end test — personal account post

**Phase:** 1 — Personal-account end-to-end
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 010, 011, 012, 013
**Tags:** testing, e2e, linkedin, milestone

## Goal

The first real LinkedIn post created by the system. Validates the
full chain: skill → CLI → image upload → post creation → local
record update.

## Context

This is **Milestone M2** from plan.md. Until this passes, the system
isn't real. Use a low-stakes article (an existing published piece)
and post to the operator's personal account.

## Steps

1. Confirm operator has already run `pnpm linkedin:auth --app=member` once and KV has fresh tokens.
2. Pick a test article — recommend `the-iq-stack` (live, hero exists).
3. From Claude Code chat, invoke: `/publish-linkedin the-iq-stack --target=personal`.
4. Skill walks through the 7 gates. Operator reviews each preview.
5. At the approval gate, operator types `approve`.
6. Skill invokes `pnpm linkedin:publish --slug=the-iq-stack --target=personal`.
7. CLI uploads image, posts, returns URL.
8. Open the returned URL in a browser.
9. Verify:
   - Link card renders with the title, description, and thumbnail.
   - Image is the correct 1920×1080.
   - Commentary appears above the link card.
   - Click on the card goes to `https://www.spaarke.com/why-spaarke/the-iq-stack`.
10. Verify local state:
    - `content-platform/published/linkedin-posts/the-iq-stack.md` exists or was updated with `posted_url` frontmatter.
    - `content-platform/calendar.md` has a new entry (TBD format from task 043, can be free-text for now).
11. Delete the test post from LinkedIn (right-click → Delete) to avoid noise on the operator's feed — UNLESS it reads well, in which case keep it.
12. Document any rough edges in `notes/e2e-personal-2026-05-XX.md`.

## Expected Outputs

- One real LinkedIn post (possibly deleted afterward).
- `content-platform/published/linkedin-posts/the-iq-stack.md` written.
- `content-platform/calendar.md` updated.
- `projects/linkedin-publishing/notes/e2e-personal-<date>.md` — observations.

## Acceptance Criteria

- [ ] LinkedIn post exists at the returned URL.
- [ ] Image renders correctly in the link card.
- [ ] Link click navigates to the correct spaarke.com article.
- [ ] No partial state on disk (no `.linkedin-cache/*-pending.json` markers left over).
- [ ] No secret values appear in chat or terminal output.
- [ ] Operator confirms the chat experience felt right (or files observations in the notes file).

## Notes

- This task DOES create real LinkedIn activity. Pick a time when the operator can monitor it.
- If the post reads badly because the placeholder personal voice profile is too generic, that's expected — voice refinement is a Phase 4 deliverable.
- If anything fails, capture the exact error and file in `notes/` before retrying.
