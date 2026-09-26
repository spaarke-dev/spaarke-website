# Cost model

> Task 002 working notes. Rates confirmed 2026-09-26. Rates change, so the
> date matters more than the numbers.

## How Foundry bills Claude

CCU, the Claude Consumption Unit, is a billing wrapper and nothing more.
Anthropic rates the token usage in dollars at its standard published rates,
applies any negotiated discount, converts at **$0.01 per CCU**, and reports
the quantity to Azure Marketplace hourly. **100 CCU is $1.00 of usage.**

So the CCU rate quoted in the portal says nothing about what a turn costs.
The published token rates do.

## Claude Sonnet 5 rates

| Item | Rate |
|---|---|
| Base input | $2.00 / MTok |
| Output | $10.00 / MTok |
| Cache read, which also refreshes | $0.20 / MTok |
| Cache write, 5 minute | $2.50 / MTok |
| Cache write, 1 hour | $4.00 / MTok |

## What a turn costs at a 100,000 token corpus

**Cache hit.** The case we want almost every time.

| Line | Calculation | Cost |
|---|---|---|
| Corpus, cache read | 100,000 x $0.20 / 1M | $0.0200 |
| Question, ~50 tokens | 50 x $2 / 1M | $0.0001 |
| Answer, ~800 tokens | 800 x $10 / 1M | $0.0080 |
| **Total** | | **~$0.028** |

**Cache miss.** The corpus has to be written before it can be read.

| Cache duration | Write cost | Turn total |
|---|---|---|
| 5 minute | $0.2500 | ~$0.278 |
| 1 hour | $0.4000 | ~$0.428 |

**The write is roughly ten times the turn.** That single fact decides the
architecture of the cost model. Answer volume is almost free; cache misses
are what cost money.

## The consequence, and it is not obvious

A marketing site gets sporadic traffic. Left alone, most conversations
arrive with a cold cache and pay a write. At one write per conversation the
$500 ceiling buys roughly 1,500 to 1,800 conversations a month, and the
answers themselves are a rounding error against the writes.

**Warm the cache deliberately.** A cache read refreshes the cache for
another full duration. One read an hour against a 1-hour cache costs
$0.020, so about **$14.40 a month** keeps the corpus permanently resident.
Every real reader turn is then a $0.028 hit rather than a $0.428 miss.

Break-even is about 36 conversations a month. Above that, warming wins, and
a site promoting a five-part series on LinkedIn should clear that easily.

This is the same shape as the keep-warm workflow added on 2026-09-25 for
the Static Web Apps function, and it can run on the same schedule. Note
that GitHub's scheduler is best effort and has been observed running 49
minutes late, so a 1-hour cache warmed by a 10-minute cron is the right
safety margin. A 5-minute cache cannot be held open this way.

## Budget at 500 USD a month

| Approach | Per conversation, 3 turns | Conversations per month |
|---|---|---|
| Cold, 1h cache | $0.484 | ~1,030 |
| Cold, 5m cache | $0.334 | ~1,500 |
| **Warmed, 1h cache** | **$0.084** | **~5,780** (after ~$14 warming) |

Warming is worth roughly a 4x increase in what the same budget buys.

## Rate limits derived from this

Assume warming, so $0.028 a turn.

- The ceiling buys about 17,800 turns a month, roughly 590 a day.
- Reserve half for headroom: target about 300 turns a day.
- **Per IP: 10 an hour, 30 a day**, which the spec already proposed and
  which these numbers support rather than contradict.
- **Global daily ceiling: 400 turns**, degrading the console with an
  explanation rather than spending past the budget.

An unwarmed abuse case is the dangerous one. A scripted client that forces
cache misses costs $0.43 a request rather than $0.028, so the global
ceiling should count spend rather than turns if that is cheap to do.

## Two decisions this raises

**Data Zone versus Global.** The deployment is `GlobalStandard`. US Data
Zone applies a **1.1x multiplier on every category**, so US-only inference
costs 10% more. At these volumes that is a few dollars a month. US data
residency was part of the reason for choosing Foundry, and 10% is a low
price for it. Worth redeploying unless someone objects.

**Cache duration.** Use the 1-hour cache with warming. The 5-minute cache
is cheaper to write but cannot be held open by any practical schedule.

## Still to measure

These are published rates applied to an estimated corpus size. Task 002
still needs a real call to confirm the actual token count of the assembled
manifest, that cache reads are being hit rather than silently rewritten,
and the real output length of a typical answer.
