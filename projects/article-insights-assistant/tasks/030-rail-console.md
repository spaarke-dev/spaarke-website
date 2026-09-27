# Task 030: Right-rail console

**Phase:** 3 (The interface)
**Status:** complete
**Estimated:** 4 hours
**Dependencies:** 013, 023
**Tags:** react, nextjs, tailwind, accessibility

## Goal

The console renders in the article right rail, offers its entry card, and
streams answers with working citations.

## Context

The rail region below the share controls is currently empty, so this needs
no layout surgery.

**That turned out to be half right.** The rail is 220px, which at 14px type is
about 30 characters a line, so a 185-word answer is roughly 38 lines of three or
four words. The task and the spec were both written before the answer length was
measured. The owner chose, on 2026-09-26, to keep the entry card in the rail and
open the answers in a panel beside the article, which is one console in two
containers and makes task 031's sheet the third. Detail in `notes/console.md`.

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

- `src/components/ArticleInsights/` entry card, panel, transcript reducer,
  answer body, composer, citation chip, disclaimer
- `src/app/why-spaarke/[slug]/page.tsx` with the rail slot filled
- `scripts/check-insights-console.mts`, thirty-eight checks
- `notes/console.md`

## Acceptance Criteria

- [x] Console renders in the rail on article pages. Asserted against the rendered
      HTML rather than described.
- [x] Three extending questions shown, summarize never first. Four options render,
      summarize is last, asserted.
- [x] Answers arrive progressively rather than at the end. Task 023 carries this;
      the console consumes it through `askInsights`, and a live turn delivered
      three paragraphs and four chips.
- [x] Every citation chip navigates to a real anchor on the article. Each href is
      fetched and its anchor looked for in the rendered page rather than in the
      manifest that produced it. Four for four.
- [x] Disclaimer present in the first rendered state. In the rail card and the
      panel both, asserted in the first paint.
- [x] Each failure state has its own copy. Eleven codes, all with copy, none
      generic, and the four that cannot be retried offer no retry.
- [x] Keyboard operable with focus managed. Escape closes, focus moves to the
      composer on open and back to the rail trigger on close, every control is a
      real button. **Not screen-reader tested**, which is recorded in
      `notes/console.md` rather than claimed.

## What was learned

**Paragraphs never split, and only a live turn showed it.** The first version split
a run on two newlines, because that is what the model writes between paragraphs. It
is not what arrives: the stream assembler breaks a unit at every newline and then
drops the whitespace-only unit, so a paragraph boundary reaches the client as one
newline. A real answer came back as a single 227-word block.

**Citations are required of a corpus answer and wrong for a general one.** The
acceptance check asserted every answer carries citations and failed on a question
about the EU AI Act. The articles do not cover it, so there is nothing to link, and
a chip there would be the defect rather than the fix.

**A counter mutated during render is a bug the linter catches before React does.**
Marking only the first general-knowledge paragraph was done with a flag inside a
`map`. It is a `findIndex` now.

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

The panel is deliberately not a modal. No `aria-modal`, no focus trap, no
backdrop, because the point of a console beside an article is to use it while
reading and a trap would make the article unreachable to exactly the readers who
most need it reachable.

See spec FR-03, FR-04, FR-05, FR-06, FR-10, NFR-05, and `notes/console.md`.
