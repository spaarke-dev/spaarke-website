# Prompt design and what the live runs changed

> Task 011. Written 2026-09-26 against four live runs of
> `npx tsx scripts/check-insights-prompt.ts`, which cost about 2.60 USD in
> total and produced every finding below.

## What was built

| File | What it holds |
|---|---|
| `src/lib/insights/types.ts` | Provenance, citation and verdict types, and the wire markers in one place |
| `src/lib/insights/prompt.ts` | The corpus block, the instructions, and the cached system blocks |
| `src/lib/insights/citations.ts` | Marker parsing and mechanical verification. Calls no model |
| `scripts/check-insights-prompt.ts` | Parser fixtures, prompt invariants, and four live cases |

## The wire format

The model writes prose for a reader and structure for the client in the same
stream, so the structure travels as markers rather than as a JSON envelope. A
JSON envelope cannot stream, and the console streams.

| Marker | Where | Meaning |
|---|---|---|
| `[[provenance:corpus\|general\|mixed\|contact]]` | First line | Where the answer came from |
| `[[cite:slug#anchor]]` | After a claim | A section of an article |
| `[[general]]` | Start of a paragraph | This paragraph is outside the corpus |
| `[[ask]] question` | Last line | The one question asked back |

Each marker is either a whole line or a single token, so a marker split across
two streamed chunks can be detected and held. `holdPartialMarker` does that, and
a fixture covers it.

## The four decisions worth keeping

**The citation marker is printed beside every heading, and the model copies it.**
This is the change with the largest effect on citation accuracy. The first
version printed the slug in the article's opening tag and the anchor beside the
heading, and asked the model to assemble the two. On the first live run it
assembled them across articles: it attributed the platform article's invoice
example to the ontology article, produced an anchor that does not exist, and
quoted sentences that are in neither article it cited. These pieces are a
series, so they reuse each other's terms, and composition across 25,000
characters is the weak step. Copying a token from the line above the material is
the strong one. Cost of printing 230 markers: about 4,000 tokens.

**Nothing per-request touches the cached prefix.** The corpus goes first as the
long document, the instructions second, and the cache breakpoint sits on the
instructions so the cached prefix covers both. The reader's article is named in
the user turn. A static check asserts the prefix is identical between builds and
that `reader-context` never appears inside it, because the cost model dies
quietly if a per-article string leaks into the cached blocks.

**Verification is mechanical and runs after generation.** Approach taken from
`Services/Ai/CitationVerification/GroundingVerifier.cs` in the product repo, per
spec KD-04: normalize, try exact substring, then slide a 200 character window
scoring token overlap at 0.70, and return a verdict. No model call. A citation
is graded `verified`, `unknown-slug` or `unknown-anchor`, and the client renders
only the verified ones. This caught the invented anchor on the first live run,
which is the whole argument for it: a chip that looks right and goes nowhere is
worse than no chip.

**The assistant answers past the corpus.** Strict grounding was rejected in the
spec because it produces dead ends. The instruction says that a reply which only
reports the library's silence is a failure whatever marker it carries, and the
live case asserts both a `general` label and a substantive answer above 400
characters. The observed answers ran to 2,000.

## Findings from the live runs

**46 sections of the functional specification were uncitable.** The manifest
captured h2 and h3 only, matching the table of contents, but rehype-slug anchors
every depth, so those sections had anchors on the page and no marker in the
corpus. Faced with material it could not cite, the model invented an anchor
rather than declining. Fixed in `scripts/build-corpus-manifest.mjs`, which now
captures h1 to h6: 184 headings became 230.

The same change fixed a latent anchor bug. `github-slugger` de-duplicates
statefully, so it has to see every heading in document order to decide whether a
repeated title becomes `foo` or `foo-1`. Both the manifest and `extractToc` were
feeding it a subset. No published article currently has a duplicate heading
title, so nothing was broken today, but this is the same class of drift as the
seven dead table of contents links fixed on 2026-09-25.

**The model quotes loosely unless told not to.** It wrote "the processes, tools,
and information these decisions require" in quotation marks where the article
says "the processes, tools, and information the department needs to make it well
and consistently". It also put quotation marks around a phrase of its own as a
gloss. The instruction now says quotation marks mean attribution and nothing
else, and that a tightened sentence is a paraphrase. Task 012 needs a case for
each.

**A general reply will not repeat the paragraph marker.** Asked to mark every
general paragraph, the model reasonably treated the first line marker as
sufficient when the whole reply was general. The parser now treats
`provenance: general` as marking all paragraphs, and the marker is only required
in a mixed reply. This removed a whole class of flakiness rather than arguing
with the model about it.

**The model will ask a question in the prose if the rule only says it may use
the marker.** A prose question has no skip affordance, which FR-06 requires. The
instruction now says the marker is the only way it asks a reader anything, and a
check fails on a reply whose last line ends in a question mark.

**One live call returned an empty response** where usage reported 1,227 output
tokens and `stop_reason: end_turn`. It did not recur across seven later calls.
The check script now fails on an empty answer and prints the stop reason and
block types, so the next occurrence is diagnosable rather than mysterious. Task
020 needs to treat an empty reply as an error rather than streaming nothing.

## Measured numbers

| Measure | Value |
|---|---|
| Cached prefix | **152,357 tokens**, 95% of the 160,000 ceiling |
| Cold turn, cache write at 1 hour | $0.68 |
| Warm turn | $0.036 to $0.056, four turns for $0.17 |
| Time to complete answer | 3.6s to 22.5s, unstreamed |

**The corpus is at 95% of the ceiling, not 86%.** The build script was
estimating the prose and the old assembly shape, not what the endpoint actually
sends. It now counts the index, the article tags, the heading markers and the
instruction block, and reports 92% against its own calibration where the API
reports 95%. Roughly one more article fits. This sharpens the headroom decision
the owner deferred; it does not change that it is deferred.

**The 1 hour cache TTL is probably being honoured but is not confirmed.** A
prefix written in one run was still read in a later run, and the interval was
not measured. `cache_creation` is now logged on every call, so the next cold run
settles it. It matters because the write rate is $4.00 per million tokens at 1
hour against $2.50 at 5 minutes, and because hourly warming is pointless if the
cache expires in five minutes.

## What task 012 should test

Every case below comes from behaviour seen on a live run rather than from
imagination. Each one therefore has a known failure to reproduce, which is what
separates a test from a hope.

1. A claim attributed to a neighbouring article in the same series.
2. A tightened sentence inside quotation marks.
3. Quotation marks around a phrase of the model's own.
4. A question the corpus answers, where the assistant should not ask the reader
   anything.
5. A reply that must not end in a prose question.
6. An em dash, which the sample answer in task 002 contained.
7. A legal question that must be answered rather than deflected to counsel.
8. A scope-boundary question mixed with a substantive one, where the substantive
   half must still be answered in full.
9. The stance trap: whether legal operations decides or facilitates.
10. An empty or truncated upstream reply.
