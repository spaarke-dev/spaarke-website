# T04 — Draft `voice/audience-personas.md`

**Phase**: 0
**Wave**: 3 (parallel with T02, T03, T05–T08)
**Dependencies**: T00, T01

## Goal

Define 3–5 reader personas that briefs reference by name. Each piece
is written *to* a primary persona, not to "the market." Personas are
specific enough that I can pick vocabulary, examples, and pacing from
the persona's perspective.

## Reads (required context)

- `content-platform/spec.md` §5.3.
- `content-platform/tasks/00-inputs.md` §2 (team's persona
  sketches) — the most direct input.
- `voice/library-audit.md` (T01) — articles often reveal whom they're
  written for.
- Existing site copy on `/platform` and `/why-spaarke` — the
  capability/feature framings imply readers.

## Deliverables

### `content-platform/voice/audience-personas.md`

Markdown file, ~1,200 words. One section per persona, plus a short
introduction and a "primary vs. secondary" note.

#### Per-persona structure

```markdown
## Persona: <Name>

**Slug**: `<slug-id>` (used in brief frontmatter, e.g., `corporate-counsel`)
**Role**: <title + seniority + org type>
**Primary or secondary?**: primary | secondary

### What they're hired for
<1–2 paragraphs on the operational outcome they own>

### What they care about
<3–5 bullets. Not "innovation" — specific outcomes, e.g., "Reducing
matter-cycle time by 25%", "Getting visibility into outside-counsel
spend by panel firm">

### What they don't trust
<3–5 bullets. The skepticism they bring — hype, AI-magic claims,
consulting-speak, vendors that don't understand legal practice>

### Where they read
<Publications, communities, podcasts. Concrete>

### Vocabulary they use
<5–10 industry-specific terms they say. Helps me match register>

### Vocabulary they roll their eyes at
<5–10 phrases that mark a writer as outsider or shallow>

### Best content angle for this persona
<1 paragraph: what topics, what frames, what they'll click on>
```

Three to five personas total. Prioritize quality over quantity — a
deeply-defined persona drives better drafts than three vague ones.

Likely candidates based on Spaarke positioning:
- **Corporate counsel** (in-house GC, AGC, legal-ops director at
  Fortune 1000 / mid-cap).
- **Law firm partner / managing partner** (mid-size firm, 20–500
  attorneys, often on the receiving end of OCG demands).
- **Legal operations professional** (Director of Legal Ops or similar —
  often distinct from corporate counsel and worth its own persona).
- **IT / CIO partner inside the corporate-counsel buying committee** —
  the often-overlooked stakeholder for any Microsoft-native platform.

Decide which 3–5 to define based on the team's inputs in T00 §2 and
the calendar (T00 §5) — the topics planned reveal who we're writing
to.

#### Primary vs. secondary

A short closing section noting which 1–2 personas are primary (most
content written for them) and which 1–2 are secondary (occasional
content for them). The brief template's `audience` field defaults to
the primary persona unless overridden.

## Constraints

- Personas are descriptions of real people, not buyer-journey
  archetypes. Avoid "the strategic CMO who wants to drive synergies"
  framing.
- Each "what they don't trust" item must be specific. "Hype" alone
  isn't useful. "AI vendors that promise 10x productivity without
  showing the work" is useful.
- Vocabulary lists pull from real legal-ops language. If unsure,
  err on the side of restraint.

## Acceptance criteria

- `voice/audience-personas.md` exists, 1,000–1,400 words.
- 3–5 personas, each with all eight subsections.
- "Primary vs. secondary" note at the end identifies 1–2 primary
  personas.
- Each persona has a short slug ID for use in brief frontmatter.

## Out of scope

- Buyer-journey mapping. We're not building a marketing automation
  system.
- Account-based marketing accounts/segments.
- Channel strategy per persona (where each persona reads informs us,
  but the content platform doesn't run campaigns).

## Prompt

> Phase 0, T04 of the Spaarke content platform.
>
> Read `content-platform/spec.md` §5.3,
> `tasks/00-inputs.md` §2, `voice/library-audit.md`, and existing site
> copy on `/platform` and `/why-spaarke`.
>
> Produce `voice/audience-personas.md`, 1,000–1,400 words, with 3–5
> personas. Each persona has the eight subsections specified in
> `tasks/04-audience-personas.md` (this file). Close with a "primary
> vs. secondary" note identifying the 1–2 primary personas.
>
> Define personas as real people, not archetypes. "What they don't
> trust" entries must be specific.
>
> Do not modify other files. First draft — team revises in T11.
