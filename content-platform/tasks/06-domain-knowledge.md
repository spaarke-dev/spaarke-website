# T06 — Draft `voice/domain-knowledge.md`

**Phase**: 0
**Wave**: 3 (parallel with T02–T05, T07–T08)
**Dependencies**: T00, T01

## Goal

Capture legal-operations and corporate-legal industry context that
articles assume rather than re-explain. The reference I reach for
when a brief mentions "OCG compliance" or "ELM consolidation" or "the
billable-hour problem" — and I need to know how those terms are
actually used in the field, what we believe about them, and what
sources we cite.

## Reads (required context)

- `content-platform/spec.md` §5.5.
- `content-platform/tasks/00-inputs.md` — especially §2
  (personas) and §5 (calendar topics).
- `voice/library-audit.md` (T01) — articles already reveal which
  industry topics we engage with.
- Existing articles in `content/blog/` that touch on industry trends,
  pain points, or stats.

## Deliverables

### `content-platform/voice/domain-knowledge.md`

Markdown file, 1,500–2,500 words. Sections:

#### 1. The legal-ops landscape (one paragraph)

A short orientation: what corporate legal looks like as a function in
2026. The problem space we operate in — matter sprawl, vendor
fragmentation, AI proliferation, in-house team growth, OCG and
billing-rule complexity. One paragraph; not exhaustive.

#### 2. Common pain points

The recurring problems Spaarke addresses or that articles assume.
Each as a section with: name, 2–3 sentence description, and (if
relevant) typical magnitude or impact. Examples:

- **Matter sprawl** — corporate legal teams juggling hundreds of
  active matters across multiple practice areas, often tracked in
  spreadsheets and email threads.
- **Outside-counsel spend visibility** — corporate legal spending
  millions on outside firms with limited per-matter, per-firm,
  per-attorney visibility.
- **Document chaos** — version 14 in someone's inbox, version 12 on
  SharePoint, the redline of record nobody can find.
- **OCG (Outside Counsel Guidelines) compliance** — billing rules
  set by the client; tracking adherence across firms is a manual
  process at most companies.
- **AI vendor fatigue** — every legal-tech vendor adding "AI" to
  their pitch since late 2023; buyers are saturated and skeptical.

8–12 pain points typically.

#### 3. Industry terms and how they're used

A glossary of legal-ops terminology with how the field actually uses
each. Not Wikipedia definitions — usage notes. Format:

```markdown
**OCG (Outside Counsel Guidelines)** — A document corporate legal
issues to its outside firms specifying billing, staffing, and conduct
rules. Often run 30–60 pages. The shorthand is "OCG"; "outside
counsel guidelines" spelled out is fine in introductions but tedious
to repeat.
```

Aim for 20–30 terms covering: matter management, billing, vendor
management, AI/tech, practice areas. Pull from your reading of
existing articles + standard industry vocabulary.

#### 4. Trends with our point of view

For each trend, a paragraph stating it and one stating where Spaarke
lands. Examples:

- **The rise of in-house headcount.** [Stat — confirm source.]
  Corporate legal teams have grown ~30% over the past decade. Our
  POV: this rise creates the operational-intelligence demand that
  legacy ELM systems can't serve.
- **AI vendor consolidation pressure.** Many AI startups in legal-tech
  in 2024–2025; buyers becoming skeptical. Our POV: the winners are
  going to be platforms with operational depth, not single-feature
  AI wrappers.
- **Microsoft 365 Copilot in legal.** Most large corporate legal
  shops have or are getting M365 Copilot. Our POV: this is the
  strategic platform; Spaarke is built to extend it.

5–8 trends.

#### 5. Sources we cite

Recurring sources for stats and trend data — where we can pull a
number from without weakening the piece's credibility:

- **Axiom** — annual legal-ops benchmark (or whatever they publish).
- **Association of Corporate Counsel (ACC)** — annual benchmarking
  report; chief legal officer survey.
- **Thomson Reuters Institute** — legal-industry trend reports.
- **BTI Consulting** — corporate-legal market research.
- **Gartner / IDC** — for tech-stack and AI trends.
- **(others as relevant)**

For each: what they publish, when, what tone they take, and any
known caveats (e.g., "Axiom's data is captive — they're a vendor
themselves; cite carefully"). Helps me decide which source to use
and how to attribute.

#### 6. Sources we DON'T cite

Equally important. Vendor-published "research" that isn't
methodologically sound, generic AI-hype reports, anything that's
been used to support inflated productivity claims. Brief mentions
with reasons.

#### 7. Things the field is sensitive about

Politicized framings, common arguments to avoid, and topics where the
audience splits. Examples:

- AI replacing lawyers (audience splits; we frame as "augmenting").
- Billable hour as a model (some firms defending; some legal-ops
  attacking; we don't take sides).
- Specific regulatory regimes (privacy law debates, etc. — we cite
  facts without political framing).
- Diversity initiatives (handle factually, not aspirationally).

Helps me decline to write certain framings even if a brief is loose
about it.

## Constraints

- Mark uncertain stats `**TBD — confirm**`. Don't fabricate numbers.
- Sources section names the source — does NOT replicate their
  research. We cite, we don't restate.
- Don't write the doc as a position paper. It's a reference;
  positions belong in `voice/brand-positioning.md`.

## Acceptance criteria

- `voice/domain-knowledge.md` exists, 1,500–2,500 words.
- All seven sections populated.
- §3 has 20+ glossary entries.
- §4 has 5–8 trends, each with our POV.
- §5 has 4–6 sources with caveats noted where relevant.
- Uncertain facts tagged `**TBD — confirm**`.

## Out of scope

- Spaarke-specific facts (T05 covers product knowledge).
- Voice and style rules (T02).
- Persona definition (T04 — though personas inform what's worth
  including in pain points and trends).

## Prompt

> Phase 0, T06 of the Spaarke content platform.
>
> Read `content-platform/spec.md` §5.5,
> `tasks/00-inputs.md` (esp. §2 and §5), `voice/library-audit.md`,
> and a few existing articles in `content/blog/` that touch on
> industry trends.
>
> Produce `voice/domain-knowledge.md`, 1,500–2,500 words, with the
> seven sections specified. This is a reference, not a position
> paper. Mark uncertain stats `**TBD — confirm**`. Don't fabricate.
>
> Do not modify other files. First draft — team revises in T11.
