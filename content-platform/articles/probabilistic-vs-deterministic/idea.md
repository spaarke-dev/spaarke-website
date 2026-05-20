# Probabilistic vs Deterministic

<!--
slug:           probabilistic-vs-deterministic
proposed type:  blog-post
audience:       practitioners / consumers of AI (corporate counsel, legal-ops,
                firm operations leaders) — non-technical but accountable for
                outcomes that depend on AI
-->

## The motivation

A lot of end-users and consumers of AI do not appreciate the difference between
probabilistic and deterministic systems — and critically, that generative LLM-based
AI tools are probabilistic. That distinction drives different behaviors, analysis,
outcomes, and the actions taken on those outcomes.

This is not "probabilistic is bad, deterministic is good." Each has pros, cons,
and correct applications. Practitioners do not need to understand the technical
internals of AI, but there are a few fundamental concepts where understanding
the basics makes you more effective and more satisfied with how you use today's
AI — generative AI in particular.

## What the article should cover

1. **How and why AI (generative LLMs) is probabilistic.** At the level a
   practitioner needs — no math, no transformer internals. The point: the same
   prompt can produce different outputs; the output is the model's best estimate,
   not a calculated answer; confidence is implicit, not guaranteed.

2. **The implications for the tools and the output.** What does it mean for
   reliability, reproducibility, evaluation, the way you read an answer, the way
   you cite or rely on one?

3. **How outputs can / should be used and acted on.** When to trust, when to
   verify, when to require a deterministic check, when probabilistic is
   sufficient.

4. **Implications for agents and agentic systems.** Very important. A
   probabilistic step inside an agent loop compounds — small uncertainties
   accumulate across tool calls and decisions. What does that mean for designing,
   bounding, and supervising agent workflows? When should an agent be allowed to
   act, and when must a deterministic guardrail intervene?

5. **Examples of legal processes that can / should be probabilistic vs
   deterministic.**
   - Deterministic candidates: matter intake routing rules, conflicts checks,
     OCG compliance enforcement, invoice math, billing guidelines application,
     deadline calculations, access control / permissions.
   - Probabilistic candidates: drafting first-pass language, summarizing a
     matter history, suggesting relevant precedent, classifying / tagging,
     surfacing related matters, drafting a recommendation for human review.
   - The interesting cases: hybrid — probabilistic surfacing + deterministic
     enforcement (e.g., AI suggests the OCG flag; rule engine enforces it).

6. **Examples of tool / application types** that lean each way, and how to
   recognize which you're using.

7. **How AI solutions can highlight this "feature" of AI** — i.e., make the
   probabilistic nature visible to the user so they appreciate it, understand
   it, and act responsibly on the outputs. Things like:
   - Showing confidence / uncertainty
   - Citing grounded source documents
   - Showing the deterministic vs probabilistic layers in the workflow
   - Requiring human review at the right gate
   - Logging and reproducibility (even when output is non-deterministic, the
     prompt + context + model + temperature can be captured)
   - Designing the UI so the user knows when they're looking at AI inference
     vs a system-of-record fact

## The Spaarke angle (don't over-rotate)

This sits naturally on top of the Legal IQ stack argument: Data (deterministic
record), Memory (mixed), Inference (probabilistic). The article is a primer on
the *why* behind the stack's architectural separation — the reason you don't
let inference write to the operational record without a deterministic gate.

Cross-link candidates:
- The IQ Stack page (Data / Memory / Inference)
- "Context is only one layer" (the architectural-layers argument)
- Any existing piece on AI-readiness or AI grounding

But the article should stand on its own as a practitioner-facing primer, not as
a Spaarke product piece. The pay-off for the reader is: *I now understand why
AI sometimes feels unreliable, and I know when that's the right tool and when
it isn't.*

## Audience

Primary: corporate-counsel + legal-operations leaders who are evaluating,
deploying, or consuming AI tools and need to set expectations for their teams
and stakeholders.

Secondary: firm-operations leaders making the same call from the firm side.

Not for: AI engineers, data scientists, or anyone who already knows what
"temperature" and "stochastic" mean.

## What this should NOT become

- A technical explainer on transformers, attention, or how LLMs work internally.
- A doom piece about hallucinations.
- A Spaarke feature pitch.
- A "deterministic good, probabilistic bad" or the reverse. The whole point is
  the *right tool for the right job*, and how to tell which is which.

## Tone

Calm, primer-level, confident. Practitioner-to-practitioner. Concrete examples
over abstraction. Should leave the reader with vocabulary they can use in their
next AI vendor meeting.

## Open questions for the brief stage

- Title direction: "Probabilistic vs Deterministic" is the topic, but the title
  should probably be a statement about the *implication*, not the dichotomy
  itself.
- Length target: a meaty primer — likely 1,400–1,800 words.
- Hero direction: abstract / geometric (two shapes / two patterns), not literal.
- Does this tie to an existing campaign or stand alone?
