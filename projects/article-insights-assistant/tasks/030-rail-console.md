# Task 030: Right-rail console

**Phase:** 3 (The interface)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 020, 013
**Tags:** react, nextjs, tailwind, accessibility

## Goal

The console renders in the article right rail, offers its entry card, and
streams answers with working citations.

## Context

The rail region below the share controls is currently empty, so this needs
no layout surgery.

The entry card is the part that decides whether the feature serves the
articles or competes with them. Three extending questions, then summarize.
Not the other way round.

## Steps

1. Build the console component: entry card, question input, streaming
   answer area, citation chips.
2. Render three suggested questions from the manifest, with summarize
   fourth.
3. Consume the stream from task 020, rendering tokens as they arrive.
4. Render citations as chips linking to `/why-spaarke/<slug>#<anchor>`.
   Verify the anchors resolve on the real page.
5. Distinguish general-knowledge passages visually, quietly. A subtle
   marker, not a warning box.
6. Put the disclaimer in the console chrome, present in the first rendered
   state rather than appearing after a first answer.
7. Handle every failure state with specific copy: timeout, rate limited,
   upstream busy, daily ceiling reached. Never a bare spinner and never a
   generic failure.
8. Render assistant-initiated questions with a skip affordance.
9. Keyboard operable throughout, with focus managed and streaming output
   announced politely.
10. Verify acceptance criteria are met.
11. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/components/ArticleInsights/` console, entry card, citation chip,
  message list
- `src/app/why-spaarke/[slug]/page.tsx` with the rail slot filled

## Acceptance Criteria

- [ ] Console renders in the rail on article pages
- [ ] Three extending questions shown, summarize never first
- [ ] Answers stream rather than appearing at the end
- [ ] Every citation chip navigates to a real anchor on the article
- [ ] Disclaimer present in the first rendered state
- [ ] Each failure state has its own copy
- [ ] Keyboard operable with focus managed

## Notes

**Do not import `@/lib/corpus` from a client component.** It pulls
`src/generated/corpus.json`, about 500 kB, into the browser bundle. The article
page is a server component, so read the three questions there with
`entryOptions(slug)` from `src/lib/insights/questions.ts` and pass them as props.

The visual treatment for general-knowledge passages is easy to overdo. It
should read as a note about where the answer came from, not as a warning
that the answer is suspect.

Check the citation anchors against the rendered page rather than the
manifest. A chip pointing at a nonexistent anchor looks correct and does
nothing.

See spec FR-03, FR-04, FR-05, FR-06, FR-10, NFR-05.
