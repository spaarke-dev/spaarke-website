# The console

What task 030 built, the decisions behind it, and what task 031 inherits.

## The shape, and why it is not what the task said

The task said right-rail console. **The rail is 220px**, which at 14px type is
about 30 characters a line, so a 185-word answer is roughly 38 lines of three or
four words. That is not a reading surface. The task and the spec were both written
before the answer length was measured, so this was a fact discovered rather than a
requirement changed.

The owner chose, on 2026-09-26, to keep the entry card in the rail and open the
answers in a panel beside the article. Two consequences worth keeping:

**The rail is an entry point, not a surface.** It holds the heading, one line of
positioning, and a link that opens the panel. It carried the four entry questions
at first, and the owner rejected that on sight: the cards pushed the column past
the fold and put a scrollbar beside a table of contents that had never had one. The
questions moved into the panel, where there is room to read what they return.

**One console, two containers, soon three.** The desktop panel and task 031's
mobile sheet. Everything below `InsightsPanel` is container-agnostic, so the sheet
is a different frame around the same entry card, transcript, composer and
disclaimer. Do not fork them.

**The panel is always mounted and hidden when closed.** So its first rendered state
carries the entry questions and the disclaimer, and both are in the page's first
paint rather than appearing on open, which is what FR-04 and FR-10 ask for. `inert`
is what makes that safe: a closed panel is out of the tab order and out of the
accessibility tree instead of leaving a hidden text field in both.

**The article moves, it is not covered.** `shiftArticle` measures how far the panel
intrudes on the grid and adds that much right padding to it. Padding rather than a
transform, because a transformed ancestor becomes the containing block for the
sticky table of contents inside it and would stop the rail following the scroll.
Because the article has `max-w-[720px] mx-auto` inside the grid's first column, the
padding re-centers it leftward without the prose re-wrapping, until the column
drops below 720px.

## The panel is deliberately not a modal

No `aria-modal`, no focus trap, no backdrop. The point of a console beside an
article is to use it while reading, so the article stays live, scrollable and
reachable by Tab. A focus trap would make the article unreachable to exactly the
readers who most need it reachable. What is there instead: Escape closes, focus
moves to the composer on open and back to the rail trigger on close, and the region
is labeled so it can be found.

## Files

| File | What it is |
|---|---|
| `transcript.ts` | The view model and its reducer. No JSX, so it is tested directly |
| `ArticleInsights.tsx` | State, the rail entry point, the captcha, the one place a turn is run |
| `InsightsPanel.tsx` | The reading surface, the entry card, and `shiftArticle` |
| `AnswerBody.tsx` | Provenance line, prose, the general-knowledge treatment, chips, the question back |
| `Composer.tsx` | The question box. Enter sends, Shift then Enter breaks |
| `CitationChip.tsx` | One citation, as something clickable |
| `Disclaimer.tsx` | FR-10, on both surfaces, in the first paint |

The page reads `entryOptions(slug)` server side and passes the result as props,
because `@/lib/corpus` pulls a 500 kB manifest and the page is a server component.
Verified two ways: the manifest's field names are absent from the rendered HTML,
and a grep over `.next/static/chunks` finds nothing.

## Three things that were wrong and are now right

**Paragraphs never split.** The first version split a run of prose on two
newlines, because that is what the model writes between paragraphs. It is not what
arrives. The stream assembler breaks a unit at every newline and then drops the
unit that is nothing but whitespace, so a paragraph boundary reaches the client as
a **single** trailing newline. A live turn came back as one 227-word paragraph,
which is how this was found. Splitting on one newline gives three.

**The general-knowledge label was accumulated during render.** A counter mutated
inside a `map` to mark only the first general paragraph. React is entitled to
re-run that, and the lint rule said so. It is computed with `findIndex` now.

**Citations are required of a corpus answer and wrong for a general one.** The
first version of the acceptance check asserted every answer carries citations,
which failed on a question about the EU AI Act. The articles do not cover it, so
there is nothing to link, and a chip there would be the failure rather than the
fix. The check now asserts both directions.

## The general-knowledge treatment

A left rule, slightly lowered text, and one small label on the first such
paragraph. It has to read as a note about where the answer came from, not as a
warning that the answer is suspect, because the owner decided there is no refusal
path: an answer from outside the articles is a normal answer here. The labeling is
therefore the entire mechanism, and overstating it visually would undo the
decision it implements.

## Failure states

Copy comes from `ERROR_COPY` in `stream.ts` by way of the response, so the endpoint
and the console cannot drift. Four codes get a retry button and four do not: there
is no point retrying a spend ceiling or a rate limit, a failed captcha needs a
reload, and a disabled endpoint needs a deploy. Asserted rather than described.

**Prose that already reached the reader is never blanked.** A connection dying
after five sentences leaves five real sentences on screen. `answered-without-close`
from `poll-client` is that case, and it is rendered as a finished answer rather
than as an error, because the reader can see the answer is there.

## Verified

```
npm run insights:console                                    logic and copy, free
npm run insights:console -- --base http://localhost:3000    plus what is in the first paint
npm run insights:console -- --base ... --live                plus one real turn and its links
```

Thirty-eight checks. Confirmed in the live runs on 2026-09-26: an answer from the
articles came back labeled corpus in three paragraphs with **four citation chips,
every one of which resolves to an id on the rendered page**; a question the library
does not cover came back labeled general, cited nothing, and carried marked
passages; both were inside the length the instructions ask for.

The first paint carries the entry card, three article-specific questions with
summarize last, and the disclaimer, which is FR-04 and FR-10 together.

## Not verified

**The visual result.** Nobody has looked at it. There is no browser automation in
this repo and adding Playwright was not part of this task, so what is proven is the
markup, the logic and the links, not the appearance. This wants a person on a
1440px screen and on a 1280px one, where the shift calculation does the most work.

**Screen reader behaviour.** The answer region is `aria-live="polite"` and not
atomic, so a reader should hear each sentence as it lands rather than the whole
answer re-read on every flush. That is the correct markup and it is not the same as
having heard it.

**Anything below 1024px.** The rail does not exist there and neither does the
console. That is task 031.

## The rail's height

The sticky column is `max-h-[calc(100vh-8rem)] overflow-y-auto`, added because it
now carries three things and a sticky column taller than the screen cuts its own
bottom off. With the entry questions moved into the panel the rail is about 80px
rather than 280px, so on a normal article nothing overflows and no scrollbar
appears. It remains a safety net for an article with a very long table of contents,
which is the case that would otherwise hide the assistant entirely.
