# Task 012: Create `.claude/skills/publish-linkedin/SKILL.md`

**Phase:** 1 — Personal-account end-to-end
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 002 (for shape only — skill is spec-driven)
**Tags:** claude-code, skill, orchestration
**Parallel group:** **A** — runs alongside 010 and 011 after Phase 0

## Goal

The Claude Code skill the operator invokes. Defines the gated
workflow, the voice-aware drafting prompts, the approval gate,
and the call out to `npm run linkedin:publish`.

## Context

Per [spec §4](../spec.md). This is the operator's only interface.
Everything else is invisible. The skill is spec-driven — it doesn't
import code from `scripts/linkedin-*.ts`, only shells out to
`npm run linkedin:publish`. That means this task can be drafted in
parallel with the CLI implementations as long as the CLI contract
in spec §6.1 holds.

## Steps

1. Create `.claude/skills/publish-linkedin/SKILL.md`.
2. Header section (matching the pattern from `.claude/skills/content-pipeline/SKILL.md`):
   ```yaml
   ---
   description: Publish a Spaarke blog article to LinkedIn as a feed-card post, with chat approval gate
   tags: [linkedin, publishing, marketing, orchestration]
   appliesTo: ["publish to linkedin", "/publish-linkedin"]
   alwaysApply: false
   ---
   ```
3. **Purpose** — one paragraph linking to `projects/linkedin-publishing/spec.md`.
4. **When to use** — explicit triggers: "publish to LinkedIn", "/publish-linkedin <slug>".
5. **Pipeline Steps** — implement the 7-step gated workflow from spec §4.2:
   - Step 1: Validate (article exists, not draft, live on spaarke.com, KV credentials present).
   - Step 2: Resolve image (default path, hero.svg fallback via Sharp).
   - Step 3: Resolve commentary (existing file, draft fresh with voice, --draft-fresh flag).
   - Step 4: Preview in chat (target, author URN, image, link, title, description, commentary, char count).
   - Step 5: Approval gate (`approve` | `edit "<copy>"` | `regenerate` | `cancel`).
   - Step 6: Publish (invoke `npm run linkedin:publish --slug=<slug> --target=<target>` via Bash).
   - Step 7: Record (show URL, offer commit of the linkedin-posts/<slug>.md update).
6. **Voice profiles** section — references:
   - Company voice: `content-platform/voice/style-guide.md` + `content-platform/voice/brand-positioning.md`; rules from spec §7.1.
   - Personal voice: `content-platform/voice/personal-voice-ralph.md` if present, else the placeholder profile from spec §7.2.
7. **Error handling** — map common script failures to operator-friendly chat messages (token expired → "I'll need you to run `npm run linkedin:auth --app=member`").
8. **Success criteria** — pipeline complete when post URL is returned and `published/linkedin-posts/<slug>.md` is updated.
9. **Integration with other skills** — note the relationship with `content-pipeline` (this skill picks up where that one leaves off).

## Expected Outputs

- `.claude/skills/publish-linkedin/SKILL.md` — ~300 lines, mirroring the structure of `content-pipeline/SKILL.md`

## Acceptance Criteria

- [ ] Skill file has the standard frontmatter pattern other skills use.
- [ ] All 7 pipeline steps documented with clear "Output to User" + "Wait for User" patterns.
- [ ] Voice section clearly differentiates company vs personal drafting prompts.
- [ ] At least one full draft commentary example included for each voice (in chat-preview format).
- [ ] The skill never references actual secrets or token values.
- [ ] The skill references the publish CLI via Bash tool only — never imports the TS source.

## Notes

- Pattern-match against `.claude/skills/content-pipeline/SKILL.md` for tone and structure consistency.
- The skill should make the "two voices" choice obvious by always showing which voice doc was used to draft.
- For the company voice draft, the skill should pull `summary` + `keyTakeaways` from frontmatter and rewrite in "we / our / Spaarke" register.
- For personal voice (no doc yet), include the placeholder profile inline so it's self-contained.
