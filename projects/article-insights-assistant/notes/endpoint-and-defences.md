# The endpoint and its defences

> Tasks 020 and 021, 2026-09-26. What the route does, what it refuses, and what
> was verified against real infrastructure rather than reasoned about.

## The endpoint is switched off

`INSIGHTS_ENABLED` must be `true` or the route returns 503 with a reader-facing
message. Nothing calls it yet, and a public route that spends money should come
on with the interface that uses it rather than before it. Task 030 turns it on.

Set it in Azure Static Web Apps app settings when the console ships. Locally it
is in `.env.local`.

## What the route does

`POST /api/article-insights` takes `{question, articleSlug, history, sessionId,
captchaToken}` and streams newline-delimited JSON events back: the provenance
label once, runs of prose with a flag for passages resting on general knowledge,
each citation as a resolved object with its heading and link, the one question the
assistant may ask back, and a final `done` event carrying token counts and repair
counts. Errors arrive as an `error` event with a code and copy written for a
reader.

Citations are events rather than prose the client has to parse, which was the
point of carrying structure from the first commit (spec KD-06).

### Why it flushes by sentence

Two of the three mechanical repairs need a whole sentence. A quotation can only be
checked once the citation that follows it has arrived, and the citation arrives
after the closing quote mark. Streaming token by token would show a false verbatim
claim and then correct it. A sentence at the measured rate of roughly 70 tokens a
second is about a third of a second, so prose still appears as it is written.

### The timeouts

There are two, and they exist because of the contact form failure of 2026-09-25:
two awaits with no timeout, a promise that never settled, and a visitor who
reasonably concluded their message had sent.

| Deadline | Default | App setting |
|---|---|---|
| First token | 30s | `INSIGHTS_FIRST_TOKEN_TIMEOUT_MS` |
| Whole answer, after the first token | 120s | `INSIGHTS_STREAM_TIMEOUT_MS` |

Both are overridable, partly so they can be tightened once there is production
data on time to first token, and partly because a deadline that cannot be forced
cannot be tested. Forcing the first-token deadline to 50ms produced
`{"type":"error","code":"TIMEOUT"}` within the deadline, which is the acceptance
evidence.

## The four defences

No single one holds, so there are four. They run in this order, which is a cost
decision: the ceiling is one read and decides for everybody, the captcha rejects a
script before it consumes anyone's quota, and the counters are writes.

| Defence | Limit | Where |
|---|---|---|
| Global daily spend ceiling | $16 a day, `INSIGHTS_DAILY_CEILING_USD` | `ceiling.ts` |
| reCAPTCHA on the first question of a session | required | `guard.ts` |
| Per IP, per hour | 10 | `rate-limit-durable.ts` |
| Per IP, per day | 30 | `rate-limit-durable.ts` |
| Per session | 25 | `rate-limit-durable.ts` |

**The ceiling counts money, not requests.** A request that forces a cache miss
costs $0.379 against $0.032 for a cached turn, so about 1,300 cache-missing
requests would spend a month's budget in a day while a request counter sat well
inside its limit. Each turn's actual cost is computed from the token counts the
API reports and added to the day's total.

**The counters are durable.** `src/lib/rate-limit.ts` keeps its counters in a
module-level Map, which resets on every function recycle and is not shared across
instances. That is adequate for the contact form, where a missed block costs one
email. Here a missed block costs money and a scripted client only has to wait for
a recycle. The insights counters live in Table Storage, incremented with
optimistic concurrency on the ETag.

**They fail closed.** If the counters cannot be read or written, the request is
refused. Unmetered calls to a frontier model are the failure this exists to
prevent, so a few minutes without the feature is the better outcome. The one
exception is development with no storage connection, which falls back to the
in-process limiter and warns loudly.

**The verified session is what makes the captcha more than decoration.** Only the
first question of a session is gated, because re-gating every turn would make a
conversation painful. That leaves an obvious bypass: claim the conversation is
already under way. So a passing captcha writes a `session-verified` row, and a
later turn whose session has no such row is refused.

## What the ceiling says when it trips

> The assistant has reached its daily limit and is resting until tomorrow. The
> article itself is all still here, and you are welcome to get in touch.

The feature is fine and it is resting. A generic failure message would be wrong.

## Verified, and how

`npx tsx scripts/check-insights-defences.mts` runs eighteen checks against **real
Table Storage**, in its own table, so production counters are never touched. It
needs the storage connection string in the environment:

```
STORAGE_ACCOUNT_CONNECTION=$(az staticwebapp appsettings list \
  --name swa-spaarke-website --query "properties.STORAGE_ACCOUNT_CONNECTION" -o tsv) \
  npx tsx scripts/check-insights-defences.mts
```

**The recycle case was tested rather than reasoned about**, which is the whole
point of the durable counters. One process writes counts and verifies a session,
then a second process with an empty in-memory Map reads what the first one wrote
and its decision follows the stored count. Run the script with `--durable`, then
again with `--second`, then `--clean` to remove the rows.

Confirmed in that run: the hourly limit blocks on the request after the limit and
names the scope that fired, a warm turn costs $0.0419 against $0.6773 for a cache
miss, recorded spend accumulates, the ceiling trips when spend passes it, the
sweep removes counter rows whose window has closed, a first question with no
captcha token is refused before the model is called, a fabricated history cannot
skip the captcha, a later turn in a verified session is not re-gated, and the
ceiling refuses everybody ahead of the other checks.

The endpoint itself was driven end to end against the dev server: a real question
streamed 745 output tokens with six resolved citations across two articles,
reported `cacheRead: 154015` with no cache write, and every validation path
returned its own code.

## Not verified

**Upstream 429 handling.** The code distinguishes Foundry rate limiting from a
failure and gives it its own message, and there is no way to make Foundry return
429 on demand without spending real money on a burst that might not trigger it.
Read by inspection only.

**Streaming through Azure Static Web Apps.** Streaming works through Next
locally, proven with a probe that emits six chunks half a second apart. Whether
the platform buffers has to be checked on the deployed site, and the probe needs
no flag and costs nothing:

```
curl -N https://spaarke.com/api/article-insights?probe=stream
```

If those six timestamps arrive together, the platform is buffering and the
interface design changes. Check this before task 030.

## Telemetry

Every defence emits its own event, so abuse is distinguishable from load:
`insights.blocked.ceiling`, `insights.blocked.captcha_required`,
`insights.blocked.captcha_failed`, `insights.blocked.ip_hour`,
`insights.blocked.ip_day`, `insights.blocked.session`,
`insights.blocked.counters_error`.

An answer emits `insights.answer` with the provenance, the cited slugs, the token
counts, the repair counts, time to first token, and a `cacheMiss` flag. That flag
is the one to alert on: a cache miss on a turn that should have read is twelve
times the cost.
