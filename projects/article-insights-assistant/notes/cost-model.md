# Cost model

> Task 002, measured. Rates confirmed 2026-09-26 and live calls made the
> same day against `spaarke-website-claude-sonnet-5`. Rates change, so the
> date matters as much as the numbers.

## How Foundry bills Claude

CCU, the Claude Consumption Unit, is a billing wrapper and nothing more.
Anthropic rates the token usage in dollars at its standard published rates,
applies any discount, converts at **$0.01 per CCU**, and reports the
quantity to Azure Marketplace hourly. **100 CCU is $1.00 of usage.**

The CCU rate quoted in the portal therefore says nothing about what a turn
costs. The published token rates do.

## Rates

Claude Sonnet 5, USD per million tokens.

| Item | Rate |
|---|---|
| Base input | $2.00 |
| Output | $10.00 |
| Cache read, which also refreshes | $0.20 |
| Cache write, 5 minute | $2.50 |
| Cache write, 1 hour | $4.00 |

The deployment is `DataZoneStandard`, which keeps inference in the US and
applies a **1.1x multiplier to every category**. Every figure below already
includes it.

## Measured, not estimated

Two live calls on 2026-09-26, via `scripts/measure-insights-cost.mjs`.

| | Call 1 | Call 2 |
|---|---|---|
| Cache write tokens | 137,320 | 0 |
| Cache read tokens | 0 | 137,320 |
| Input | 21 | 23 |
| Output | 112 | 161 |
| Latency | 4.6s | 3.1s |
| **Cost** | **$0.3789** | **$0.0320** |

**Prompt caching works.** The second call read the cache rather than
rewriting it, which is the thing that had to be true for this design to be
affordable at all.

**The corpus is 137,341 tokens**, not the 107,808 the first build-time
estimate gave. The estimate was 27% low. It is now calibrated directly
against the measurement at 2.142 tokens per word, about 3.2 characters per
token, and lands within 15 tokens.

Two reasons the early guess was wrong, both worth remembering. Sonnet 5
uses the tokenizer introduced with Claude 4.7, which produces roughly 30%
more tokens than earlier models, so a ratio borrowed from older guidance
reads low. And the estimate has to cover the per-article index the endpoint
sends, not only the prose.

## What a turn costs

| | Cost | What it is |
|---|---|---|
| Warm turn | **$0.032** | Cache hit, the normal case if warming runs |
| Cold turn | **$0.379** | Cache miss, the corpus written before it is read |

**The write is roughly twelve times the turn.** Answer volume is nearly
free. Cache misses are the entire cost model.

## Warming pays for itself many times over

A marketing site gets sporadic traffic, so left alone most conversations
arrive cold and pay a write. A cache read refreshes the cache for another
full duration, so one read an hour holds the corpus resident for about
**$23 a month** and makes every reader turn a $0.032 hit rather than a
$0.379 miss.

Break-even is about 61 conversations a month, which a site promoting a
five-part series on LinkedIn should clear easily.

| Approach | 3-turn conversation | Conversations per month at $500 |
|---|---|---|
| Cold every time | $0.443 | ~1,130 |
| **Warmed** | **$0.096** | **~4,970** after ~$23 of warming |

Use the **1 hour** cache. It costs more to write but is the only duration a
practical schedule can hold open, because GitHub's scheduler is best effort
and has been seen running 49 minutes late, which a 5-minute cache cannot
survive. This can run on the same cron as the keep-warm workflow added on
2026-09-25.

## Rate limits

At $0.032 a warm turn the $500 ceiling buys about 15,600 turns a month, or
roughly 520 a day. Reserving half for headroom gives a target near 260 a
day.

- **Per IP: 10 an hour, 30 a day.** The figures the spec proposed survive
  the arithmetic rather than being contradicted by it.
- **Global daily ceiling: 400 turns**, degrading the console with an
  explanation rather than spending past the budget.

The dangerous case is an abuser who forces cache misses, at $0.379 a
request rather than $0.032. A little over 1,300 such requests would exhaust
the month in a day, so **the global ceiling should count spend rather than
turns.** That is the difference between a bad day and a bad invoice.

## Latency

3.1 seconds to a complete short answer on a warm cache, 4.6 on a cold one.
Comfortably inside the 3-second time-to-first-token target in NFR-04 once
responses stream, since streaming begins well before completion.

## Corpus headroom

137,356 estimated against a 160,000 ceiling, so **86% full, with room for
about three more articles.** The ceiling leaves roughly 23,000 tokens for
the conversation and the answer inside a 200,000 window.

This wants deciding within a few articles rather than at the moment the
build fails. The options are the same three as ever: a larger context
window, a trimmed corpus, or the retrieval layer this design deliberately
avoided.

## One finding for the prompt work

The sample answer contained an em dash. House voice bans them everywhere,
per `voice/style-guide.md`. The assistant's output is Spaarke-voiced prose
in front of readers, so task 011's system prompt has to carry the ban
explicitly and task 012 needs a case that fails on one.

## Cache warming: measured 2026-09-28, and not built

Task 050 gates on measuring the real miss rate before building anything. The
measurement says do not build yet.

Over the 30 days to 2026-09-28, Application Insights holds **one**
`insights.answer` event, and that one was generated by launch verification. Real
reader turns: **zero**. Real cache misses: **zero**. Measured miss rate:
**0.00 a day**, against a gate of one a day.

**The rate is zero because the traffic is zero, not because the cache is warm.**
That distinction decides when to revisit this. Every real turn so far has been a
cold miss, so the miss rate per turn is 100%. What is missing is turns.

The arithmetic at low traffic:

| Traffic | Misses a day | Cost of misses | Warming at $18 a month | Worth it |
|---|---|---|---|---|
| 1 turn a day | 1 | $0.69 a day, $21 a month | $18 a month | no, roughly break-even |
| 4 turns a day, spread | about 4 | $2.76 a day, $83 a month | $18 a month | yes |
| 12 an hour apart | 12 | $8.28 a day, $250 a month | $18 a month | clearly |

Warming costs a cached read each time, about $0.045, because a hit refreshes the
time to live. Thirteen calls across a twelve hour window is about $0.59 a day.

**So the trigger is traffic, not time.** Re-run the query when the assistant is
taking **more than two turns a day on separate hours**. Below that, warming costs
about as much as it saves and adds a scheduled job, a shared secret and a second
spend path to maintain.

```
customEvents
| where name == "insights.answer"
| summarize misses = countif(tostring(customDimensions.cacheMiss) == "True"),
            turns = count(), spend = sum(todouble(customDimensions.costUsd))
  by bin(timestamp, 1d)
```

The design in task 050 stands and does not need revisiting: warm through
`buildMessageRequest` so the cached prefix is byte identical, authenticate with a
shared secret, count the spend under the same ceiling, and emit a distinct event
so warming turns can be excluded from the answer statistics.

**The $500 monthly ceiling is not at risk at this traffic.** At current volume
the assistant costs under a dollar a month. The cost alert at $150 will fire long
before anything needs deciding in a hurry.

## What a demoted article costs an answer, measured 2026-09-28

Task 051 builds a tier per article so the corpus can grow past the window without
retrieval. Tier 2 holds an article's header, summary, key takeaways and headings
with their citation markers, and not its body. This is the measurement of what
that costs, run once so it is not assumed.

**Method.** `the-20b-blind-spot` was demoted, the manifest rebuilt, and
evaluation case `co-04` re-run. That case asks "What does the $20B figure refer
to, and where does the number come from?", which cannot be answered from a
heading.

| | Tier 1 | Tier 2 |
|---|---|---|
| Result | pass | pass |
| Provenance | corpus | corpus |
| Citations | 1 | 2 |
| Answer length | 1,067 chars | 724 chars |
| Corpus size | 146,884 tokens | 142,928 tokens |

**The demotion freed 3,956 tokens on that one article.** Across the library the
build now reports the range: demoting eight frees between **24,751 and 77,331
tokens**, depending which eight, which is four to thirteen more articles.

**What the answer kept.** It still found the figure, by recovering it from
another article that states it more precisely, and it still cited the demoted
article. Whole-corpus reasoning survived the demotion, which is the property this
design exists to protect.

**What the answer lost.** A third of its length, and the specifics that came from
the body: the e-billing platforms, outside counsel guidelines, rate cards and
alternative fee arrangements that the tier 1 answer used to explain what the
department has already built.

**What it did instead, and this is the part that matters.** It said so:

> The article on the blind spot itself is held as an outline in this corpus, so I
> can tell you what it covers and cite it, but I can't quote its text or trace the
> figure to a specific source or study inside it.

That sentence is why the outline notice is in the corpus block. Without it the
model reads a list of headings as material it has read and quotes sentences that
do not exist. A first pass without that line is not worth trying again.

**Conclusion: the trade is acceptable and should be taken one article at a time.**
A demoted article gets thinner and more deferential, not wrong. Demote the least
cited first, from `citedSlugs` on `insights.answer`, and re-read this measurement
before demoting anything a reader is likely to ask about in detail.

**One cost to remember:** changing any article's tier changes the cached prefix,
so the next turn after a demotion is a cache write at about $0.69. Demote in one
batch rather than one article a day.
