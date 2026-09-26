# Article Insights Assistant

> Design document. Input to `/design-to-spec`, which produces `spec.md`,
> which `/project-pipeline` turns into a plan, tasks, and a branch.
>
> Status: draft for review. Written 2026-09-25.

## 1. Why this exists

Spaarke's go-to-market rests on demonstrated subject matter expertise. The
site publishes long-form articles because developing an idea completely is
the proof of expertise, and a shorter piece cannot carry that proof. Most
readers will not read 6,000 words end to end. The library is therefore
doing its job for the minority who read deeply and very little for everyone
else.

The assistant is a second way into the same material. A reader who will not
read the ontology article can still interrogate it, follow a thread across
the series, and come away knowing what Spaarke thinks and why.

There is a second reason, and it is close to the first. Spaarke sells legal
operations intelligence: AI grounded in a department's own governed content,
connected across sources, with the reasoning traceable to where it came
from. An assistant that answers from Spaarke's own corpus, names which
article each claim came from, and reasons across a five-part series is that
argument running in a browser. The feature is a demonstration of the product
thesis, which is why grounding and visible citation are the point rather
than hygiene.

## 2. What it is not

It is not a website chat bot. It does not answer questions about pricing,
availability, support, or how to reach sales, and it does not try to move
the reader toward a demo. It is a way to engage with an article, its subject
matter, and the library around it.

It is not a summarizer first, for the reasons set out in section 3.

## 3. Placement and first contact

The assistant lives in the right rail of an article page, below the share
controls, in the space the current layout leaves empty.

On first open it presents a small card offering a few entry points. The
entry points matter more than they look, because they set what the reader
believes the tool is for.

The default card offers questions that require the article rather than
replace it. Examples, to be finalized per article from its frontmatter:

- What would this mean for a department running 200 matters?
- How is this different from what a CLM vendor calls a data model?
- What are the decisions this piece says I have to make?
- What do the other articles in this series add to this?

A summarize option is present and is not the first thing offered. A summary
that ends the visit defeats the purpose of publishing long form. Where a
summary is given, each claim in it links to the section that argues it, so
the summary is a way in rather than a way out.

## 4. Scope: release one and release two

Release one ships on article pages, framed around the article the reader is
on. Release two promotes the same console to a library-wide surface.

This is a difference in framing and entry points, not in architecture. The
backend sees the whole corpus from the first commit (section 5), so release
two changes what the interface claims rather than what the system can do.

Two things must be right in release one so release two costs nothing:

- The current article is a parameter, never a baked-in assumption.
- Citations carry `{slug, heading, anchor}` from the first commit.
  Retrofitting citation structure later is the expensive mistake.

## 5. Architecture: the whole corpus in context

The library is roughly 21 articles averaging about 3,500 words, which is on
the order of 100,000 tokens in total. That fits in a 200K context window
with room to spare.

**There is no retrieval layer, no chunking, and no vector store.** The
entire corpus goes in the cached system prompt and the model sees all of it
on every turn. This is the same thing as uploading every document to a
Claude project, which is the experience the feature is meant to match.

The consequences are worth stating plainly, because they are the reason for
the choice:

- No retrieval miss is possible, so there is no class of question that
  fails because the right passage was not fetched.
- Cross-article reasoning is free rather than a later feature. A model
  holding all five series articles at once can actually compare them, which
  retrieval systems do badly.
- Prompt caching makes it affordable. The corpus is written once and reused
  across requests at a large discount, so full rate is paid only on the
  question and the answer.

**The threshold to watch:** at roughly 80 to 100 articles the corpus would
reach 400,000 tokens and this design needs revisiting. At the current
publishing cadence that is years away. Record the token count in the build
so the limit announces itself rather than arriving as a surprise.

A build-time corpus manifest is generated from `content/blog/`. The MDX
frontmatter already carries `summary`, `keyTakeaways`, `tags`, `date`, and
the series campaign, which gives the model a structured index of what exists
and how the pieces relate before it reads any body text.

## 6. Model

Claude in Microsoft Foundry, generally available since 2026-06-29, which
resolves what looked like a choice between the Microsoft story and the
best available model. Spaarke published "Why we built on Microsoft", and an
AI feature running outside the tenant would undercut it. Claude in Foundry
runs on Azure infrastructure in a US data region, authenticates with Entra
ID or an API key, and bills through existing Azure workflows.

Start on `claude-sonnet-5` for the live path, with an Opus model available
if reasoning depth proves insufficient. At about 100,000 cached input tokens
per turn, model selection drives cost more than any other decision in the
system.

**To check before building:** the Spaarke BFF already has a `Services/Ai`
layer, and `BFF_API_URL` is already configured in the website's app
settings. If that layer is already wired to Foundry, the website may need no
model integration of its own.

## 7. Answer quality and labeled provenance

The requirement is that answers match what the reader would get from Claude
with the documents uploaded. No dead ends and no weak answers, including
when a question runs past what the articles cover.

Strict grounding would produce dead ends and is rejected. Answering freely
with no visible distinction would stake Spaarke's authority on the model's
training data, which is worse. The resolution is **labeled provenance**:
answer fully either way and make the source visible.

- Answered from the corpus: cite the article and section, linked.
- Answered from general knowledge: say so plainly, in ordinary language,
  without a disclaimer that clangs.
- Answered from both: distinguish which part is which.

This has a useful side effect. A reader seeing "our articles do not cover
this, but generally" is a content gap announcing itself, which feeds the
content pipeline directly.

## 8. The assistant asking the reader questions

The assistant may ask the reader a question, for example whether the
department runs Harvey or Legora, or whether its CLM exposes an API.

**The governing rule is that it asks only when the answer materially changes
the response.** It does not ask to fill a field, to qualify a lead, or to
gather market data. The model for this is the way Claude Code asks the user
a question: when it is genuinely blocked on something only that person
knows, not on a schedule.

This rule is not squeamishness. A reader who came for help with an article
and finds themselves being profiled will stop trusting the tool, and the
trust is the whole asset. Asking in service of the answer produces the
market intelligence anyway, as a byproduct, and produces it from people who
were pleased to be asked.

Constraints:

- Every question is skippable, and skipping produces a useful general answer
  rather than a worse experience.
- No question is required before the assistant will answer.
- It never reads as a form. One question at a time, in the flow of the
  conversation.

Release one implements this as prompt instruction plus a lightweight
suggested-reply affordance. A later release can add structured options along
the lines of Claude Code's own question interface, once there is evidence
about which questions actually earn their place.

## 9. Capturing the conversation

Questions asked of the articles are the highest value output of the feature.
What a reader asks the ontology article is the brief for the next article.
Kapa productized the same idea as coverage-gap analytics.

Capture the question, the article in context, whether the answer came from
the corpus or from general knowledge, and whether the reader continued.

Constraints. Conversations are reader-supplied text and may contain personal
or confidential information whether or not they should. Decide retention
before launch, keep the store out of reach of the public endpoint, and
confirm that the privacy policy covers it. Do not log anything that
identifies a reader beyond what the site already collects.

## 10. What has to be built beyond the inference call

The model call is the easy part, and everything below it is where the work
actually sits.

- **Corpus manifest**, generated at build time from `content/blog/`.
- **System prompt**, which is the actual product. It carries the provenance
  rules, the boundary in section 11, the citation format, the register, and
  Spaarke's own stance from `content-platform/voice/stance.md`. Without the
  last of these the assistant will contradict the articles it is quoting,
  particularly on what the general counsel owns and what legal operations
  facilitates.
- **Evaluation set** of 30 to 50 real questions with known-good answers, run
  on every prompt change. This is the step most teams skip and the reason
  these tools ship bad. It must include questions that span three articles,
  questions the articles deliberately do not answer, questions that invite
  legal advice, and questions built on a false premise drawn from a
  competitor's vocabulary.
- **Question log**, per section 9.
- **Streaming and a hard timeout.** A large cached call on a cold Azure
  Static Web Apps function is exactly the ambiguous silence that broke the
  contact form on 2026-09-25. A request that hangs must become a visible
  error, not a spinner.

## 11. Risks and boundaries

**Legal advice.** The audience is in-house counsel. A tool on the site that
answers "should we accept this indemnity position" is a liability question,
not a scope question. This needs an explicit refusal path, distinct from the
general-knowledge path, and it should be reviewed by counsel before launch
rather than after.

**Authority damage.** One confidently wrong answer about Spaarke's own
thesis costs more than not shipping. The assistant says it does not know
when it does not know.

**Cost and abuse.** A public unmetered endpoint calling a frontier model is
unbounded spend and an attractive target. Reuse the existing patterns in
`src/lib/rate-limit.ts` and `src/lib/ip-hash.ts`.

**Substitution.** The open question is whether the assistant deepens
engagement or replaces it. Instrument from the first commit, because in a
month the question will be asked and only measurement can answer it.

## 12. How success is judged

Primary: scroll depth and time on page for readers who open the assistant,
against readers who do not. If the assistant reduces both, it is competing
with the articles rather than serving them, and the entry points are wrong.

Secondary: questions per session, proportion answered from the corpus rather
than general knowledge, and the rate at which readers follow a citation into
the article.

Note that site telemetry was dropping nearly all events until 2026-09-25 and
the fix shipped that day. Confirm events are arriving before trusting any of
these numbers.

## 13. Open questions for the writer

- Retention period for captured conversations, and whether the privacy
  policy needs updating before launch.
- Whether the BFF `Services/Ai` layer is already wired to Foundry, which
  decides whether the website integrates with the model directly.
- Whether counsel review of the legal-advice boundary is a launch gate.
- Whether release one ships on all articles or on the series only.
