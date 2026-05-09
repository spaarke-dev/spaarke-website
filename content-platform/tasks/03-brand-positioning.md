# T03 — Draft `voice/brand-positioning.md`

**Phase**: 0
**Wave**: 3 (parallel with T02, T04–T08)
**Dependencies**: T00, T01

## Goal

Capture what Spaarke stands for narratively — the positioning
statement, the 3–5 core narrative themes, the implicit competitive
frame, and the proof points. This is the document I read when I need
to understand *what to argue*, not *how to write*.

## Reads (required context)

- `content-platform/spec.md` §5.2.
- `content-platform/tasks/00-inputs.md` — all sections,
  especially §3 (reference voices) and §5 (calendar topics — they
  reveal positioning by the topics chosen).
- `content-platform/voice/library-audit.md` (T01 output).
- The site itself — read `src/app/page.tsx` (home), `src/app/platform/page.tsx`,
  the home-Hero content (`src/content/home/hero.ts`,
  `src/content/home/closing.ts`, `src/content/home/microsoft-native.ts`).
  These have already been written and reviewed; they're the most
  current positioning artifact.
- `docs/SITE-SPECIFICATION.md` §1 (purpose).

## Deliverables

### `content-platform/voice/brand-positioning.md`

Markdown file, ~800 words. Sections:

#### 1. Positioning statement

One sentence. The kind you'd use as the lead in a pitch deck or as
your LinkedIn-bio one-liner. Pull from existing site copy if it's
already articulated; refine if it isn't.

#### 2. Core narrative themes (3–5)

For each theme:
- **Theme name** — a short phrase you'd actually say out loud.
- **Why it matters** — one paragraph, 3–4 sentences. The argument we
  make for this theme.
- **How it shows up** — concrete examples of how this theme appears
  in product, in messaging, in talks.

Likely candidates (from existing site copy):
- "Microsoft-native — not bolted on"
- "The system of record for legal work"
- "Built for AI across the lifecycle, not bolted on"
- "Your data, your environment, your control"
- "All sides of every matter — a shared platform"

Pick the 3–5 strongest based on what existing copy and the team
inputs converge on. Don't list 8 — 3–5 forces prioritization.

#### 3. Competitive frame

We don't punch sideways at named competitors. But we have an implicit
contrast — what we're NOT, even if not named. Capture:
- The market category we're in (e.g., "legal operations platform" or
  "matter management system" or whatever the team uses).
- The standard alternative (status quo) we displace — typically a mix
  of spreadsheets, point tools, and dated ELM systems.
- The implicit "vs." — what we offer that the standard doesn't (e.g.,
  the Microsoft-native deployment vs. SaaS-walled-garden tools).

This section is for *me* to understand the framing, not for direct
quote in articles.

#### 4. Proof points

What evidence we use to support claims. Not testimonials (those go
elsewhere) — the structural arguments:

- Architectural proofs (e.g., "Spaarke runs in your tenant; data
  doesn't leave your environment").
- Functional proofs (e.g., "Five capability modules covering matter
  management, documents, collaboration, AI, spend").
- Industry proofs (e.g., "Built on Microsoft Power Platform, the
  same foundation enterprise customers already trust").
- Practical proofs (e.g., "Customer onboarding via existing IT —
  no new identity, no parallel governance").

Each proof point: one short paragraph explaining what it is and why
it works as evidence.

#### 5. Things we are NOT

A short section explicitly disclaiming positions we don't take. Pulls
from T00 §4 (do-not-claim list) and the implicit competitive frame.
Examples:

- We are not an "AI-first" company. We're a legal-operations platform
  that happens to use AI well.
- We are not a productivity app. We are operational intelligence.
- We are not a billing system or an e-billing replacement.
- We are not for solo practitioners or small firms.

Helps me decline to write certain framings.

## Constraints

- Pull positioning straight from existing site copy where it's
  already articulated. Don't reinvent in the platform doc what the
  hero already says.
- 800 words is a hard cap. This doc is for orientation, not exposition.
- "What we are NOT" is as important as "what we are" — both must be
  populated.
- No marketing-speak in the doc itself. Read it as if it were a
  finished article — does it sound like Spaarke?

## Acceptance criteria

- `voice/brand-positioning.md` exists, 600–900 words.
- One-sentence positioning statement at the top.
- 3–5 core themes (not 6+, not 2).
- Competitive frame and proof points each have at least 3 entries.
- "Things we are NOT" has at least 4 entries.

## Out of scope

- Style and voice rules (T02).
- Audience personas (T04).
- Product feature reference (T05).
- Vocabulary specifics (T07).

## Prompt

> Phase 0, T03 of the Spaarke content platform.
>
> Read `content-platform/spec.md` §5.2,
> `tasks/00-inputs.md`, `voice/library-audit.md`, and the existing
> site copy (`src/app/page.tsx`, `src/app/platform/page.tsx`,
> `src/content/home/*.ts`).
>
> Produce `voice/brand-positioning.md`, 600–900 words, with the five
> sections specified: positioning statement, 3–5 core narrative themes,
> competitive frame, proof points, and "things we are NOT."
>
> Lean on existing site copy — don't reinvent the positioning.
> Write the doc itself in Spaarke's voice; it should read like our
> writing, not a marketing-strategy template.
>
> Do not modify other files. First draft — team revises in T11.
