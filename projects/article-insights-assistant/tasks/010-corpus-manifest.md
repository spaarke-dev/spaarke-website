# Task 010: Build-time corpus manifest

**Phase:** 1 (Corpus, prompt, and evaluation)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** none
**Tags:** nextjs, mdx, content, typescript

## Goal

A generated manifest of every published article, with a logged token count
and a build that fails if the corpus outgrows the context window.

## Context

The whole corpus goes into a cached system prompt, so it has to be
assembled deterministically at build time rather than read per request.
The MDX frontmatter already carries `summary`, `keyTakeaways`, `tags`,
`date` and the campaign, which gives the model a structured index of what
exists and how the pieces relate before it reads any body text.

The token ceiling is the safety rail on KD-01. When the library outgrows a
single context window the build should say so, not degrade quietly.

## Steps

1. Write `scripts/build-corpus-manifest.mjs` reading `content/blog/*.mdx`
   with `gray-matter`.
2. For each article capture slug, title, date, summary, keyTakeaways, tags,
   campaign, heading anchors, and body text.
3. Extract heading anchors the same way the article route does, so citation
   anchors resolve against the rendered page. Check how `rehype-slug` is
   configured in `src/app/why-spaarke/[slug]/page.tsx` and match it rather
   than inventing a slugifier.
4. Skip drafts, matching the filter in `src/lib/blog.ts`.
5. Count tokens for the assembled manifest and log the total.
6. Fail the build above a configured ceiling, defaulting to 150,000 tokens.
7. Emit to a generated file that the endpoint imports, and git ignore it.
8. Wire the script into the build.
9. Verify acceptance criteria are met.
10. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `scripts/build-corpus-manifest.mjs`
- Generated manifest, git ignored
- `package.json` with the build step wired in
- `src/lib/corpus.ts` typed accessor

## Acceptance Criteria

- [ ] Manifest contains all non-draft articles
- [ ] Token count logged on every build
- [ ] Build fails above the ceiling with a message naming the number
- [ ] Heading anchors match the rendered article ids exactly
- [ ] Drafts excluded

## Notes

Anchor fidelity is the part that silently breaks. A citation pointing at an
anchor that does not exist on the page looks fine in the response and does
nothing when clicked, which is worse than no citation at all. Verify
against a real rendered article, not against the generator's own output.

See spec FR-01, KD-01, KD-06.
