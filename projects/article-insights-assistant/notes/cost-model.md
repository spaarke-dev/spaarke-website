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

## Data zone multiplier

The deployment is `DataZoneStandard`, which keeps inference in the US and
applies a **1.1x multiplier to every category**: input, output, cache reads
and cache writes alike. The rates below are the published ones. Multiply by
1.1 for what this deployment actually bills.

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
| **Total** | | **~$0.028**, or **~$0.031** at the 1.1x data zone rate |

**Cache miss.** The corpus has to be written before it can be read.

| Cache duration | Write cost | Turn total | At 1.1x |
|---|---|---|---|
| 5 minute | $0.2500 | ~$0.278 | ~$0.306 |
| 1 hour | $0.4000 | ~$0.428 | ~$0.471 |

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

At the 1.1x data zone rate.

| Approach | Per conversation, 3 turns | Conversations per month |
|---|---|---|
| Cold, 1h cache | $0.533 | ~935 |
| Cold, 5m cache | $0.368 | ~1,355 |
| **Warmed, 1h cache** | **$0.093** | **~5,200** (after ~$16 warming) |

Warming is worth roughly a 4x increase in what the same budget buys.

## Rate limits derived from this

Assume warming, so about $0.031 a turn at the data zone rate.

- The ceiling buys about 16,100 turns a month, roughly 535 a day.
- Reserve half for headroom: target about 300 turns a day.
- **Per IP: 10 an hour, 30 a day**, which the spec already proposed and
  which these numbers support rather than contradict.
- **Global daily ceiling: 400 turns**, degrading the console with an
  explanation rather than spending past the budget.

An unwarmed abuse case is the dangerous one. A scripted client that forces
cache misses costs $0.43 a request rather than $0.028, so the global
ceiling should count spend rather than turns if that is cheap to do.

## Two decisions this raises

**Data Zone versus Global. Settled 2026-09-26**, redeployed to
`DataZoneStandard`. US residency was part of the reason for choosing
Foundry and the 1.1x multiplier is a few dollars a month at this volume.

**Cache duration.** Use the 1-hour cache with warming. The 5-minute cache
is cheaper to write but cannot be held open by any practical schedule.

## Still to measure

These are published rates applied to an estimated corpus size. Task 002
still needs a real call to confirm the actual token count of the assembled
manifest, that cache reads are being hit rather than silently rewritten,
and the real output length of a typical answer.
