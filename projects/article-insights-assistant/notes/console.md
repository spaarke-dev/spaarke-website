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

**One console, two frames.** `ConsoleBody` holds the entry card, the transcript,
the composer and the disclaimer. The desktop panel and the mobile sheet are frames
around it, and `check-insights-console.mts` fails if either stops rendering it.
That check is source-level, which is usually a weak kind of test and is the right
kind here: the failure it guards against is not a wrong value at runtime, it is
somebody answering a mobile bug by copying the panel.

**State lives in a provider, not in a component, and the reason is a CSS rule.**
The rail sits inside `<aside className="hidden lg:block">`, and a `display: none`
ancestor hides a fixed child too, so the mobile button could not live where the
rest of the console lived. Two components would have meant two conversations and
two captcha widgets. `InsightsProvider` wraps the article grid; the rail entry, the
panel and the sheet all read one state.

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

## The question goes to the top, the answer fills downward

Asked for by the owner on 2026-09-27, and the reason is worth keeping. Following
the last line as it streams makes the reader chase text down the screen and keeps
the sentence they are reading in motion. Instead the current exchange is scrolled
to the top of the pane once, when the question is asked, and nothing moves after
that.

That needs somewhere to scroll to, which is what the minimum height on the last
exchange is for: without it a short answer cannot reach the top, because there is
nothing underneath it to scroll past. The height is measured from the pane with a
`ResizeObserver` rather than guessed in viewport units, because the mobile sheet
shrinks when the keyboard opens and a stale measurement there would leave the
question unreachable.

The scroll effect is keyed on the **number** of exchanges, deliberately. Keying it
on the turns would re-run on every sentence, which is the behaviour it replaces.

## The library surface

Added on 2026-09-27, moved in from release two. The console appears on
`/why-spaarke` with `slug` null, which the endpoint already accepted: the whole
corpus is in the model's context either way, so a library question reaches all
twenty-four articles rather than fewer. The only difference is that nothing is
foregrounded, and the panel heading says "Ask the library" rather than "Ask about
this piece".

**It takes the place of the keyword search box** in the filter bar, which is the
owner's call and a defensible one. Search matches titles and excerpts; a question
reaches the argument and comes back citing the piece that makes it. A live
library-context turn cited three different articles, which is the thing search
cannot do. The filters stay, because narrowing by topic is a different job from
asking a question.

The search box is still in `WhySpaarkeLibrary` and renders whenever the assistant
prop is absent, so switching the console off restores search rather than leaving a
gap in the bar. That is also why the entry point is passed in as a prop: the
section should not have to know whether the assistant exists.

The library's three entry questions are written rather than generated, and are
deliberately cross-corpus, because an entry question only one article answers
wastes the surface. They are held to the same validator as the generated ones.
There is no summarize option, since summarizing twenty-four articles produces the
page the reader is already on.

## The sheet traps focus and the panel does not

This looks like an inconsistency and is not. Beside an article the console is one
of two things on screen and the reader moves between them. Over an article it is
the only thing on screen, nothing behind it is usable, and letting Tab wander into
a covered page is the bug.

## The keyboard, which is the detail that gets missed

The sheet is `max-h-[85dvh]`, and the check fails if anyone changes it to `vh`. A
sheet sized in `vh` keeps its height when the on-screen keyboard opens, so the
composer ends up underneath it and the reader types blind. The dynamic viewport
unit shrinks with the keyboard, so the composer stays pinned to the bottom of a
sheet that is now shorter.

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
| `InsightsProvider.tsx` | State, the captcha, the one place a turn is run |
| `RailEntry.tsx` | The desktop entry point on an article, in the rail |
| `LibraryAskButton.tsx` | The desktop entry point on the library, in the filter bar |
| `ConsoleBody.tsx` | The console itself, with no opinion about what holds it |
| `InsightsPanel.tsx` | The desktop frame, and `shiftArticle` |
| `MobileSheet.tsx` | The phone frame, which does trap focus |
| `FloatingButton.tsx` | The mobile entry point |
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

Sixty-one checks with no server, more with one. Confirmed in the live runs on 2026-09-26: an answer from the
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

**Anything on a phone.** Nobody has opened this on one. The keyboard behaviour,
the thumb reach, the scroll restore and the focus trap are implemented and argued
rather than observed, which for a surface whose whole reason to exist is mobile
traffic from LinkedIn is the gap worth closing first.

## The rail's height

The sticky column is `max-h-[calc(100vh-8rem)] overflow-y-auto`, added because it
now carries three things and a sticky column taller than the screen cuts its own
bottom off. With the entry questions moved into the panel the rail is about 80px
rather than 280px, so on a normal article nothing overflows and no scrollbar
appears. It remains a safety net for an article with a very long table of contents,
which is the case that would otherwise hide the assistant entirely.
