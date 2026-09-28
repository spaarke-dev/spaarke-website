# Lessons learned

> Task 090. What this project taught that was not obvious at the start, written
> for whoever builds the next feature on this site.
>
> Most of these were learned by getting something wrong in production. They are
> recorded that way deliberately: a lessons file that reads like a list of good
> decisions is not a record of anything.

## Azure Static Web Apps

**An app setting is a runtime value. A statically generated page needs the
build environment.** This cost three separate incidents.

`INSIGHTS_ENABLED` in app settings alone did nothing, because whether the console
renders is decided at build time. It had to go into the GitHub workflow as well.
Keep both: the app setting still gates the endpoint at runtime and **is the kill
switch**, because clearing it refuses every question immediately, where clearing
the build flag takes a full build.

The same bug one layer down was worse. `RECAPTCHA_SITE_KEY` was in app settings
only, so the widget never rendered on statically generated pages, the token was
always empty, and the guard refused every first question with a message telling
the reader to confirm something there was no way to confirm. Fixing it also
**restored the contact form's captcha**, which had been silently broken on every
deploy. It was invisible because the contact route treats a missing token as a
pass, so only the honeypot was stopping anything.

**Verify against the rendered page, not the setting.** Reading the app setting
back tells you the value was stored. It tells you nothing about what the deployed
page does with it.

**Streamed responses are buffered.** The platform holds the stream and delivers
it in one piece, so a token-by-token UI shows nothing and then everything. The
fix was a partial-answer store the browser polls alongside the POST, merging
whichever arrives first. Worth knowing before designing a streaming feature here.

**Deploys cancel each other.** Two pull requests merged a minute apart produced
`Deployment Canceled` and left `main` built but not published. A `concurrency`
group with `cancel-in-progress: false` queues them instead.

**Select a workflow run by name and event, not by "latest on main".** Matching
the latest run picked up the close-PR job and then the scheduled keep-warm job,
and a failed deploy got reported as green twice on the strength of it.

## Rotating credentials on a live system

Both Azure keys were rotated on 2026-09-28. It caused a three-minute production
outage, which hit no real visitors only by luck.

**Regenerating a storage key is not immediately usable.** The new key returned by
`az storage account keys renew` took roughly **four to five minutes** to
authenticate against the data plane. Repointing the application at it straight
away pointed production at a key that did not yet work. **Poll the new key until
it authenticates before repointing anything.**

**Never invalidate the old credential in the same breath as repointing.** The
storage rotation went cleanly because minutes of verification sat between
repointing and killing the old key. The Foundry rotation did both in one script,
seconds apart, and the running app was still holding the old key when it died.
The sequence that works:

1. Regenerate the key that is **not** in use. Confirm which that is first.
2. Poll until the new key authenticates.
3. Repoint the application setting.
4. **Prove the running application picked it up**, with a real request.
5. Only then regenerate the exposed key.

Step 4 is the one that is tempting to skip and is the whole point.

**Secrets do not have to pass through a transcript.** The original exposure came
from `az staticwebapp appsettings list` printing every value. The hazard is
printing, not touching. Generating a key, assembling a connection string and
setting it inside a single shell invocation keeps the value in a shell variable
and out of any log. To check which key is live, compare truncated SHA-256
fingerprints rather than the values.

**Fail-closed defences make rotation dangerous, and that is still correct.** If
the counters cannot be read the request is refused, so a stale storage key takes
the assistant down rather than leaving it unmetered. That is the right trade and
it is exactly why the order above matters.

**Rotate the local environment too.** `.env.local` held the key that was just
killed, which would have failed the next evaluation run for reasons that looked
like something else.

## The model

**Extended thinking is on by default at the deployment and it destroys answers.**
Eleven of forty evaluation cases came back empty. Everything goes through
`buildMessageRequest`, which disables it. Anything new that calls the model uses
that builder rather than composing its own request. The model also rejects
`temperature` as deprecated.

**Three model behaviours are repaired mechanically and counted:** citations
corrected, non-verbatim quotations demoted, dashes replaced. The counts matter as
much as the repairs, because they are the measurement of how often the model gets
it wrong. Never bypass them by rendering raw model text.

**Provenance labeling is the weak spot and stayed the weak spot.** All three
remaining evaluation failures are the model over-claiming that an answer is
grounded in the articles. Citations cannot be fabricated, because they are checked
against the manifest, but the label on the reasoning can be wrong. This was known
at the end of Phase 1 and shipped known.

**The model overshoots a stated word band by five to twenty five percent.**
Shortening the instruction made it over-quote instead, so the quotation rule and
the length rule now reference each other.

## Testing

**Check the test tooling before believing the finding.** Two citations looked like
broken anchors in the evaluation output. They were whole-article citations, which
correctly have no anchor, and the runner was appending `undefined` to them in its
own report. A defect in the measuring instrument reads exactly like a defect in
the thing measured.

**The same trap, twice in one day.** A first pass at checking anchors against
production reported zero of seventy-four resolving. The pages are React Server
Components, so heading ids appear escaped in the payload as well as in the
markup, and a naive pattern matched neither. A result that says everything is
broken is usually a broken check.

**Source-level assertions are the right tool for guarantees about structure.**
That both surfaces carry the disclaimer is a claim about the code having one
console, not about a rendered page. Asserting it at source is what stops the two
surfaces forking later.

**Lighthouse defaults to throttled mobile.** The site's targets are written for
desktop. Comparing the default run against them produced a performance figure
that looked like a serious regression and was not.

**A criterion with no baseline cannot be met.** The wrap-up task asked for
Lighthouse scores "not materially degraded against the pre-console baseline", and
no baseline was ever captured. Capture the before when the criterion says
"against before".

## Telemetry

**Serverless telemetry needs an explicit flush.** Application Insights had ninety
days of zero rows because the function returned before the buffer was sent. With
`flushTelemetry()` a probe arrives in under a minute.

**Instrument the refusals, not only the successes.** The most useful rows during
this launch were `insights.blocked.*` and `insights.error`, because they are what
distinguishes a defence working from a system broken.

**Separate what readers did from what the server did.** Reader behaviour goes to
Plausible, server events to Application Insights. Mixing them makes the cost and
defence data as sensitive as the analytics, for no gain.

**Record who generated the data.** Nine of the first ten telemetry events came
from verification, not readers. Numbers written down without that note would have
read as adoption a month later.

## Process

**Two commits went directly to `main`**, against the repo convention that says not
to. Both were documentation. The convention exists so that every change is
reviewable in one place, and documentation commits are not exempt.

**Write the estimate down and then check it.** Cache warming was scoped against
an estimate of $57.96 a month, which assumed 2.8 cold misses a day. The worst
case on the same window is twelve misses, about $250 a month. The measurement
query is in `notes/cost-model.md` and should run before the feature is built.

**The ceiling warning is the guard rail, and it needs a decision before it
fires.** The corpus is at 92% of the token ceiling with room for about two more
articles. Task 051 builds the lever now so that pulling it later is a one-line
change rather than a redesign under pressure.
