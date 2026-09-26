# Evaluation: how to run it and how to read it

> Task 012, 2026-09-26. Forty cases across nine categories, run against the real
> composed prompt. Eight full runs went into building this, costing about 18 USD
> in total, and the prompt changed six times because of what they showed.

## Running it

```
npm run insights:eval                       every case, 1.75 to 2.40 USD warm
npm run insights:eval -- --category stance  one category
npm run insights:eval -- --id fp-01,st-05   named cases
npm run insights:eval -- --review           print every answer, not only the flagged ones
npm run insights:eval -- --base http://localhost:3000
```

Cases live in `eval/cases.json`, as data rather than in the script, because they
need rewriting whenever the library gains an article. The full run lands in
`eval/last-run.json` with every answer, so a failure can be read after the fact
without paying for another run.

The first case runs alone and the rest run four at a time. Four concurrent calls
against a cold cache would write the corpus four times, which costs eight times
what the whole run should cost.

Anchors are checked against the rendered page on spaarke.com, not against the
manifest. The manifest is what produced the citation, so checking one against the
other proves nothing.

## What the pass rate means

**It is a rate, not a verdict.** The model is nondeterministic and the
assertions are strict, so the same suite against the same prompt lands between
32 and 39 of 40. Read a single run as a sample. Before and after a prompt change,
run it twice and compare the categories rather than the total.

Across the eleven runs to date:

| Run | Passed | What changed before it |
|---|---|---|
| 1 | 14/40 | first run, extended thinking on |
| 2 | 18/40 | thinking disabled |
| 3 | 28/40 | quotation rule narrowed to attribution |
| 4 | 35/40 | mechanical repairs, boundary narrowed, numbers rule fixed |
| 5 | 39/40 | leak detection, whole-article citations |
| 6 to 8 | 32, 32, 34 | article-level citations, provenance decision procedure |
| 9 | 36/40 | answer length capped at 120 to 200 words, 19 character ceilings |
| 10 | 33/40 | length tightened to 100 to 160 words, which is where it lands |
| 11 | 33/40 | quotation rule tied to the length rule |

Nineteen cases are marked for human judgement. A structural pass there is
necessary and not sufficient: the runner cannot tell whether a false premise was
corrected or accommodated, so those answers are printed for reading.

## The repairs, and why they are not failures

Three model behaviours are repaired mechanically before a reader could see them,
and the counts are printed on every run. They are prompt work, not defects in the
output.

**Citations are corrected.** An anchor that differs only in punctuation resolves
anyway. An anchor belonging to a different article moves to that article, since
anchors are effectively unique across 24 articles. An anchor made from an
article's title resolves to the article.

**Quotations that are not verbatim lose their quotation marks** and keep their
citation, becoming a paraphrase. The claim is almost always right; the promise of
exact wording is what was wrong.

**Dashes are replaced.** House voice bans the em dash, several published articles
use it because they predate the rule, and the model mirrors what it reads however
firmly the instructions say not to.

A misquotation still fails its case even though it is repaired, because a
quotation that is not in the article it cites usually means the citation is
loosely attached too, and no mechanical check can catch that.

## The five findings that changed the prompt

**Extended thinking was on and it was destroying answers.** Eleven of the first
forty cases came back completely empty: 1,999 of 2,000 output tokens went into a
thinking block and the reply was truncated before any prose. Every call now goes
through `buildMessageRequest`, which disables thinking, so the endpoint, this
runner and the entry card generator cannot drift apart on it.

**The rule against inventing numbers made every question outside the corpus
unanswerable.** Told that every number must come from an article, the assistant
declined to put any figure on a salary question and sent the reader to a
compensation survey instead. Estimates outside the corpus are now explicitly
allowed under the general label, attributed to nobody.

**The contact boundary was swallowing questions it should not.** Out-of-corpus
questions about salaries, procurement and a competitor's features were all coming
back labeled contact, which is the label for Spaarke's commercial terms. The
boundary now names Spaarke in every term, and the instructions say plainly that
the contact marker is never a way to avoid a question.

**The assistant was answering by redirection.** It would open by saying what the
library does not contain, then offer to answer something else. The instruction now
forbids both, and forbids handing the reader off to a survey, a recruiter or a
vendor.

**It quoted its own system prompt to a reader,** telling them that an article
states plainly something that is a sentence from the instructions. There is now a
rule against it and a detector for it, comparing eight-word windows and ignoring
any overlap that is also in the corpus, since the instructions quote the articles
in places.

## What is still not right

Three behaviours survive. None of them is a blocker for building the endpoint,
and all three are worth another pass at the prompt before launch.

**Misquotation, one to four per run.** The assistant tightens a sentence and
leaves the quotation marks on. Repaired before the reader, and the underlying
attribution may still be loose. **Shortening the answers made this worse before it
made it better**, which is the interaction worth remembering: compression is
exactly the act that produces a squeezed sentence with its quotation marks intact.
The two rules now reference each other.

**Provenance drift on mixed answers.** A reply that draws on both the articles
and outside knowledge is sometimes labeled corpus, and a mixed reply does not
always carry the paragraph marker the client needs to mark the general passages.
The decision procedure added before run 8 cut label errors from four to one, so
this is tractable.

**Occasional thin citation.** A cross-article answer sometimes cites one article
where it drew on three. The instruction to cite each article is in, and it is not
reliable yet.

**Length is now measured rather than hoped for.** Nineteen cases assert a character
ceiling, and the suite reports the distribution. Answers run a mean of 185 words
and a median near 197, against 400 to 650 before. The lesson is in
`notes/prompt-design.md`: the model overshoots a stated band by five to twenty five
percent, so the instruction has to aim below the target.

**The phase 1 gate is therefore met in part.** The suite runs and reports per
case, cross-article cases pass most of the time, citations resolve to real
anchors after repair, and provenance is right on corpus-only and general
questions. Mixed labeling is not yet reliable. Whether that is enough to start
phase 2 is the owner's call, and the endpoint work does not depend on it.

## Adding a case

Add an object to `eval/cases.json` with an `id`, a `category`, the
`articleSlug` the reader is on, the `question`, and an `expect` block. Available
expectations: `provenance`, `citesSlugs`, `minDistinctSlugs`, `minCitations`,
`generalParagraph`, `asksQuestion`, `contains`, `containsAny`, `notContains`,
`minChars`. Set `review: true` with a `reviewFor` note for anything that needs a
person to judge.

Ground the expectation in the corpus text before writing it. One case asserted
that an article contains report cards, which it does not, and a case built on a
false premise tests nothing.
