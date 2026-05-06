# T05 — Draft `voice/product-knowledge.md`

**Phase**: 0
**Wave**: 3 (parallel with T02–T04, T06–T08)
**Dependencies**: T00, T01

## Goal

A single reference document covering Spaarke product facts a writer
needs to make accurate claims. Reference material — not narrative.
Pulled in selectively per piece, not read cover-to-cover every
session.

## Reads (required context)

- `projects/content-platform/spec.md` §5.4.
- `docs/SITE-SPECIFICATION.md` §1 (purpose of the site, which mirrors
  the product positioning).
- The site's existing platform-page content
  (`src/app/platform/page.tsx`) — captures the latest product framing.
- Capability content in `src/content/home/capabilities.ts` — the
  five capability modules with their feature sets.
- Existing articles in `content/blog/` — pull product facts already
  in print to avoid contradictions.

## Deliverables

### `projects/content-platform/voice/product-knowledge.md`

Markdown file, 1,500–2,500 words. Sections:

#### 1. The platform in one paragraph

A canonical short description suitable for use as boilerplate in an
"about Spaarke" section at the bottom of articles or in author bios.
Pull from existing site copy.

#### 2. Architecture

- The five capability modules (Matter Management, Documents & Email,
  Collaboration, AI & Automation, Spend & Performance).
- The Microsoft foundation (Power Platform, SharePoint, M365 Apps,
  Outlook, Teams, Copilot, Azure AI Foundry).
- Hosting models (Spaarke-hosted vs Customer-hosted) — what each
  means and when each applies.

Each module gets a 2–3 sentence description: what it covers, what
problem it solves, key features.

#### 3. The AI layer

The "Spaarke AI" framing — three pillars:
- **Foundry IQ** — knowledge grounding.
- **Copilot Studio** — orchestration.
- **Agent Framework** — execution.

For each: 1 paragraph explaining what it does, where it shows up in
the product, what it lets the user accomplish that they couldn't
otherwise. The framing matters because we don't say "Spaarke AI" the
way other vendors say "AI-powered" — it's specific.

#### 4. Integration surfaces

Where the product shows up for users:
- Native Outlook add-in (email capture).
- Native Word integration (save-to-Spaarke, co-creation).
- Microsoft Teams app (matter-centric chat, files, tasks).
- Microsoft 365 Copilot (Spaarke as a Copilot knowledge source).
- SharePoint (document storage, in your tenant).
- Power BI (cross-matter analytics).

Each: one sentence on what it does plus one on why we ship it native
(rather than as a separate UI).

#### 5. What we don't claim

This section is critical. List the claims we don't make about the
product, with one-line reasons each:

- We don't claim the product replaces lawyers or paralegals.
- We don't claim a specific productivity multiplier (10x, 5x, etc.).
- We don't claim AI accuracy numbers without citing the underlying
  evaluation.
- We don't claim "fully autonomous" — agentic execution is bounded
  and supervised.
- We don't claim instant deployment — a real implementation has real
  effort.

Pull from T00 §4 (do-not-claim list) and add product-specific
disclaimers.

#### 6. Differentiators

What makes Spaarke different from the alternatives — not as a sales
pitch, as factual statements I can use to write accurate
positioning:

- Microsoft-native deployment vs SaaS-walled-garden.
- Customer-tenant hosting option.
- Single platform across the 5 capability modules vs point tools.
- Built-in AI vs bolted-on AI.
- (etc.)

#### 7. Common misconceptions

What readers often assume that's wrong. Examples:

- "Spaarke is a SaaS app." Not exactly — we run inside your Microsoft
  tenant when you choose customer-hosted.
- "Spaarke is for litigation." It's for all matter types — corporate
  legal work, regulatory, IP, M&A, etc.
- "Spaarke needs a separate identity provider." It uses your Entra ID.
- (etc.)

#### 8. Useful technical / numeric facts

A short list of factual claims that are stable enough to reuse without
re-verifying every time. Examples (verify before adding):

- The product launched in [year].
- Number of capability modules: 5.
- Number of integrated Microsoft surfaces: [n].
- Etc.

Each fact: source where verifiable, "internal — confirm" where not.

## Constraints

- Stick to facts. If unsure whether a claim is true, mark it
  "**TBD — confirm**" rather than asserting.
- Don't transcribe marketing copy. The doc is a reference for the
  writer, not a polished piece itself.
- Cite the source of any non-obvious claim (e.g., "per
  `src/app/platform/page.tsx` as of 2026-05-06").

## Acceptance criteria

- `voice/product-knowledge.md` exists, 1,500–2,500 words.
- All eight sections populated.
- Module descriptions consistent with `src/content/home/capabilities.ts`.
- "What we don't claim" has at least 5 entries.
- "Common misconceptions" has at least 4 entries.
- Any uncertain fact tagged `**TBD — confirm**`.

## Out of scope

- Customer testimonials / case studies (separate Phase 1 task).
- Pricing details (we don't write about pricing publicly).
- Technical architecture diagrams (live in `/public/brand/diagrams/`,
  referenced not duplicated).
- Voice and style rules (T02).

## Prompt

> Phase 0, T05 of the Spaarke content platform.
>
> Read `projects/content-platform/spec.md` §5.4, the site's
> `docs/SITE-SPECIFICATION.md` §1, `src/app/platform/page.tsx`, and
> `src/content/home/capabilities.ts`. Skim a handful of existing
> articles in `content/blog/` to align with the product framings
> already in print.
>
> Produce `voice/product-knowledge.md`, 1,500–2,500 words, with the
> eight sections specified. Reference document — facts, not narrative.
> Tag uncertain facts with `**TBD — confirm**`.
>
> Do not modify other files. First draft — team revises in T11.
