# Task 011: System prompt and labeled provenance

**Phase:** 1 (Corpus, prompt, and evaluation)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 010
**Tags:** typescript, content

## Goal

A composed system prompt that produces answers labeled by where they came
from, in Spaarke's register, consistent with Spaarke's stated positions.

## Context

This is the actual product. The endpoint is plumbing; the prompt is what
readers experience.

The requirement is Claude-with-the-documents-uploaded quality, including
when a question runs past what the articles cover. Strict grounding would
produce dead ends and is rejected. Answering freely with no visible
distinction would stake Spaarke's authority on training data. The
resolution is labeled provenance: answer fully either way, and make the
source visible.

## Steps

1. Read `content-platform/voice/stance.md` in full. Without it the
   assistant will contradict the articles it is quoting, particularly on
   what the general counsel owns versus what legal operations facilitates.
2. Read `Services/Ai/CitationVerification/GroundingVerifier.cs` in the
   Spaarke repo. It already solves citation verification for the product.
   Take the approach, not the code.
3. Compose the prompt from the corpus manifest, the provenance rules, the
   citation format, the register, the stance, the scope boundary, and the
   current article as a parameter that biases without limiting.
4. Specify the citation format as `{slug, heading, anchor}` so the client
   renders links without parsing prose.
5. Write the scope boundary: pricing, support, availability and
   demo-booking go to the contact page rather than being answered.
6. Write the materiality rule for assistant-initiated questions. Ask only
   when the answer would materially change the response, one at a time,
   always skippable, never blocking a reply.
7. Put the corpus in a cached block and keep per-request content out of it,
   or the cache rewrites on every call.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/insights/prompt.ts` for prompt composition
- `src/lib/insights/types.ts` for citation and provenance types

## Acceptance Criteria

- [ ] Corpus sits in a cached block, with cache reads confirmed on turn two
- [ ] Corpus claims carry structured citations, not prose references
- [ ] General-knowledge answers say so in plain language, with no clanging
      disclaimer
- [ ] Article context biases the answer without limiting what is visible
- [ ] Stance positions match the articles rather than contradicting them

## Notes

The register matters more than it looks. An assistant that sounds like a
support bot undercuts articles written in a consulting register. Read
`voice/examples/consulting-register.md` and `voice/examples/ai-tells.md`,
because the banned constructions apply here too.

Resist making the general-knowledge label apologetic. "Our articles do not
cover this, though generally" is right. A boxed legal disclaimer on every
paragraph is not.

See spec FR-03, FR-06, FR-11, KD-04, KD-05.
