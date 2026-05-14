# Task 012: Implement link builders

**Phase:** 1 — Function logic
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 001
**Tags:** typescript, urls, integration
**Parallel group:** **A** — runs alongside 010, 011, 013 after Phase 0

## Goal

Pure-functional URL builders for the three link types in each digest
row: workspace, issue search, and "Continue in Claude" deep link.

## Context

Per [spec.md §5.4](../spec.md). Centralizing URL construction keeps
the digest template free of string concatenation noise and makes the
URL formats easy to change later.

## Steps

1. Create `src/integrations/links.ts`.
2. Export pure functions (no side effects):
   - `buildWorkspaceUrl(slug: string, owner = "spaarke-dev", repo = "spaarke-website"): string`
     → `https://github.com/<owner>/<repo>/tree/main/content-platform/articles/<slug>`
   - `buildIssueSearchUrl(slug: string, owner = "spaarke-dev", repo = "spaarke-website"): string`
     → `https://github.com/<owner>/<repo>/issues?q=is%3Aissue+<encodeURIComponent(slug)>`
     (uses search, not direct issue URL — per spec decision #1)
   - `buildContinueInClaudeUrl(slug: string): string`
     → `https://claude.ai/new?q=<encoded prompt>` where the prompt is hard-coded as: `Continue work on articles/${slug}/ in the spaarke-website repo. Read CLAUDE.md and tasks.md to orient before doing anything else.`
     Use `encodeURIComponent` on the full prompt.
3. Add a small `buildAllLinksFor(slug)` convenience helper returning all three as a single object — saves the digest template a few lines.

## Expected Outputs

- `azure/functions/content-reminder/src/integrations/links.ts` (~60 lines)

## Acceptance Criteria

- [ ] `npm run build` exits 0.
- [ ] `buildWorkspaceUrl("the-iq-stack")` returns exactly the expected URL.
- [ ] `buildIssueSearchUrl("the-iq-stack")` correctly encodes special chars (test with a hyphenated slug).
- [ ] `buildContinueInClaudeUrl("the-iq-stack")` produces a URL that, when opened in a browser, results in a Claude session with the prompt visibly populated. **Manual smoke test — confirm by clicking the URL once.**

## Notes

- Don't use a URL library; `encodeURIComponent` + template strings is sufficient.
- The "Continue in Claude" URL is the experimental piece — if `claude.ai/new?q=` ever stops working as a prefill mechanism, this is the one function that needs updating.
- `owner` and `repo` default to spaarke-dev/spaarke-website but accept overrides for future repos.
