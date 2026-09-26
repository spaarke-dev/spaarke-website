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
