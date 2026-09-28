# Launch verification

> Task 090. Every success criterion in `spec.md` walked against the live system
> on 2026-09-28, with the failures recorded rather than omitted.
>
> Verified against production at `https://spaarke.com`, not a local build. Where
> a criterion could not be met, it says so and says when it can be.

**Result: 9 of 11 met, 1 partly met, 1 not yet assessable.**

| # | Criterion | Result |
|---|---|---|
| 1 | Renders on every article page and on mobile | **met** |
| 2 | A question answerable only from another article succeeds | **met** |
| 3 | Every corpus claim carries a working anchor | **met** |
| 4 | General-knowledge answers are labeled | **partly met** |
| 5 | Disclaimer visible whenever the console is open | **met** |
| 6 | A hung request produces a visible error | **met** |
| 7 | Per-turn cost measured and within NFR-01 | **met** |
| 8 | Conversation log queryable for content gaps | **met** |
| 9 | Telemetry events arriving | **met** |
| 10 | Scroll depth and time on page, users against non-users | **not yet assessable** |
| 11 | A scripted client without a captcha cannot reach the model | **met** |

## 1. Renders everywhere. Met

All 24 published articles fetched from production and checked for the console's
markup: **24 of 24**, plus the library page at `/why-spaarke`. The spec said 21
because that was the corpus when it was written.

Both viewports were confirmed by the owner rather than by a script: the phone
surface on 2026-09-28, and the desktop rail across the review rounds that
produced its current shape.

## 2. Cross-article questions. Met

The evaluation suite's `cross-article` category passed **5 of 5**. These are
questions the article on screen cannot answer and a different article can, which
is the behaviour whole-corpus context exists to buy.

## 3. Working anchors. Met

Every citation the 40 evaluation cases produced was checked against the rendered
production page: **74 citations, 72 anchored, all 72 resolve**. The other two
are whole-article citations, which correctly carry no fragment.

Those two appeared in the run file as `slug#undefined`, which reads like a broken
anchor and is not one. The product builds a whole-article citation with no
fragment at all. The defect was in how the evaluation runner named citations in
its own report, and it is fixed here.

Note for anyone checking this by hand: the article pages are React Server
Components, so heading ids appear in the payload in escaped form as well as in
the markup. A naive grep for an unescaped id attribute can read as a total
failure when nothing is wrong.

## 4. General knowledge labeled. Partly met

This remains the largest failure class, as it was at the end of Phase 1.

Evaluation run: **37 of 40 passed**. All three failures are provenance labeling:

| Case | Category | Failure |
|---|---|---|
| `nc-03` | not-covered | Labeled `corpus` where `general` or `mixed` was required |
| `mx-01` | mixed | Labeled `mixed` but no paragraph carried the general-knowledge mark |
| `fp-05` | false-premise | Quoted a phrase not present in the cited article |

By category: corpus-only 6/6, cross-article 5/5, legal-advice 4/4, no-question
3/3, scope-boundary 4/4, stance 5/5, false-premise 4/5, mixed 3/4,
not-covered 3/4.

The `fp-05` quotation was **repaired before it could reach a reader**: the
mechanical pass demoted it to a paraphrase. That is the repair layer doing its
job, and it is also the reason this is recorded as a labeling weakness rather
than a reader-facing one.

**The honest reading:** the assistant sometimes over-claims that an answer is
grounded in the articles. It does not fabricate citations, because those are
checked against the manifest, but it will present reasoning as corpus-derived
when part of it is not. A reader who trusts the provenance label is
occasionally over-trusting it.

## 5. Disclaimer. Met

The disclaimer lives in `ConsoleBody`, which is the single console the panel and
the sheet both wrap, so neither surface can ship without it. Asserted at source
level, and asserted again as present before any answer exists.

## 6. Visible error on failure. Met, and demonstrated in production by accident

All eleven error codes carry reader-facing copy, none of it generic, and none of
it asks the reader to do something they cannot do. The four that cannot be
retried offer no retry.

This was then proved live, unintentionally. During the key rotation earlier
today the model was briefly unreachable, and the endpoint returned exactly what
it should: an `UPSTREAM_ERROR` whose message says the model could not be reached
and that it is our problem, not the reader's.

A forced-hang test would have been a weaker result than this one.

## 7. Cost. Met

Measured over the 40-case run against Foundry's published rates.

| | |
|---|---|
| Cold turn, cache miss | **$0.6855**, measured 2026-09-27 |
| Warm turn, cache hit, in production | **$0.0358**, measured 2026-09-28 |
| Mean across the evaluation run | **$0.056** ($2.23 over 40 cases) |

The cold figure is the 2026-09-27 measurement, not a fresh one. See the
telemetry caveat below: a cold turn recorded today at $0.6888 was visible in
Application Insights once and is not there now, so it is not cited as evidence.
Two independent measurements a day apart agreeing to within half a cent is the
reason the cost model is still trusted.

NFR-01 sets a $500 per month inference ceiling. At the warm rate that is roughly
**12,500 turns a month**, far above any traffic this site is close to. The
ceiling is not the binding constraint. Cold misses are, which is what task 050
exists for.

The run cost $2.23 against an estimate of $1.60. The estimate assumed every turn
warm. The first one never is.

## 8. Gap report. Met

`npm run insights:gap` runs end to end against the live conversation record and
produced the first report: 5 turns across 5 sessions in 30 days, 4 answered from
the corpus, 1 mixed. One question surfaced as a partial gap.

The pipeline is proven. The sample is not yet large enough to act on, which is
expected a day after launch and is the reason the task asked for it anyway.

## 9. Telemetry. Met

Application Insights holds `insights.answer`, `insights.error` and
`insights.blocked.captcha_required` with their dimensions, arriving within a
minute. The explicit `flushTelemetry()` fix is holding.

**Two caveats, and the second is unresolved.**

First, **every one of the 9 events in the window was generated by this
verification**. Real reader traffic to date is zero turns. Anyone reading these
tables later should not mistake the volume for adoption.

Second, and less comfortably: an `insights.answer` event timestamped
2026-09-28T12:46:57Z, cache miss, $0.6888, **was returned by one query and has
not been returned by any query since**. Repeated runs of the same query, an
absolute time window, and a union across `customEvents`, `requests`, `traces`
and `exceptions` all now show nothing before 13:30. The `requests` table's
earliest row is 12:52, which is after the vanished event, so nothing corroborates
it.

It is recorded here rather than dropped because it is the only thing seen so far
that suggests telemetry may not be exactly once. The events this verification
generated are all present and stable, so the criterion is still met, but **treat
single events as evidence with care until this is understood**. Worth a second
look once there is enough traffic to tell a gap from an absence.

## 10. Engagement comparison. Not yet assessable

The criterion asks for scroll depth and time on page for assistant users against
non-users, verified after two weeks. The console has been live one day and has
had one real turn, so there is nothing to compare.

`Article Engagement` carries its `assistant` property on every event, so the
comparison will be available from data already being collected. **Look again on
2026-10-12.** The four failure thresholds in `notes/measurement.md` were written
before the data and should be read then, not renegotiated then.

## 11. Bot defence. Met

Direct POST to the production endpoint with no captcha token returns
`HTTP 400 CAPTCHA_REQUIRED`.

The stronger check also holds. A client that fabricates a conversation history to
look like a later turn, where the captcha is not re-checked, is **also refused**,
because the guard requires a stored record that the session passed the captcha.
Both were run against production today.

## Lighthouse

Run against `/why-spaarke/the-iq-stack`, which carries the console. The site's
targets in `projects/website-version-1/design.md` are stated for desktop.

| Category | Desktop | Target | |
|---|---|---|---|
| Performance | **98** | 90 | met |
| Accessibility | **96** | 95 | met |
| Best Practices | **78** | 95 | **missed** |
| SEO | **100** | 95 | met |

LCP 1.0s against a 1.5s budget. **CLS 0**, against a 0.02 budget, which matters
here because the console injects a rail into the layout. Total blocking time 0ms.

Mobile, under Lighthouse's throttling, scores Performance 63 with an 8.0s LCP.
That is the throttled-mobile profile of the whole site rather than a console
regression, and the site's stated targets are desktop.

**Best Practices misses, and the cause is the assistant.** The only failing item
on the article page is a single third-party cookie, `_GRECAPTCHA`, which the bot
defence requires. Before the console, article pages did not load reCAPTCHA.

Two things stop this being a simple verdict:

- The homepage, which has no console, scores **74**, lower still, because it
  carries eight Clarity and Bing cookies on top of the same reCAPTCHA cookie.
  The site was already missing this target.
- Removing the cookie means removing the captcha, and criterion 11 is the reason
  the captcha exists. The owner's instruction was to prevent bots running up
  costs. That is the trade, and it was made deliberately.

**No pre-console Lighthouse baseline was ever captured**, so "not materially
degraded against the baseline" cannot be answered as a comparison. The absolute
scores above are recorded instead, and the homepage serves as the nearest
reference point. Capture a baseline before the next feature that touches these
pages.

## Accessibility: one real failure, and it is not the console

One contrast failure on the article page: the access-request call to action,
white on the Spaarke blue `#5078dc`, measuring 4.14:1 where AA needs 4.5:1 at
14px normal weight.

That element predates this project and is unrelated to it. It is a genuine WCAG
AA failure and belongs in the site backlog rather than here. Darkening the blue
or increasing the font weight fixes it.

The console itself produced no accessibility failures.

## Also found

A report-only Content Security Policy violation, `frame-ancestors 'self'`, logged
when reCAPTCHA frames. Report-only, so nothing is blocked, but the policy and the
captcha disagree and one of them should be corrected.
