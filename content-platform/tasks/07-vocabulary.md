# T07 — Draft `voice/vocabulary.md`

**Phase**: 0
**Wave**: 3 (parallel with T02–T06, T08)
**Dependencies**: T00, T01

## Goal

A focused two-column reference: terms we use, terms we avoid. The
fastest-to-load doc in the constitution. When I'm writing and reach
for a word, this tells me whether to use it.

## Reads (required context)

- `content-platform/spec.md` §5.6.
- `content-platform/tasks/00-inputs.md` §4 (do-not-claim list).
- `voice/library-audit.md` (T01) — Section 2 (patterns observed)
  flags repeating word choices.
- 2–3 existing strong articles to mine for actual word choices.

## Deliverables

### `content-platform/voice/vocabulary.md`

Markdown file. Two-column table (or two tables — preferred / avoided)
with one-line reasons. Target: 50 entries to start.

#### Section 1 — Preferred terminology

```markdown
## Preferred

| We say | Instead of | Why |
|---|---|---|
| matter | case | "case" is litigation-only; we cover all matter types |
| platform | tool / app / suite | "platform" implies the breadth we have |
| outside counsel | external counsel | industry standard usage |
| operational intelligence | productivity | we're not a productivity app |
| Microsoft-native | Microsoft-integrated | "native" = built on, not glued onto |
| customer-tenant | customer-side / client-hosted | matches our deployment-mode language |
| corporate counsel | in-house lawyers | industry register |
| matter intake | case opening | matter is broader |
| ... | ... | ... |
```

Aim for 25–35 preferred-term entries.

#### Section 2 — Terms to avoid

```markdown
## Avoid

| Don't say | Use instead | Why |
|---|---|---|
| seamless | (cut) | empty word — describe what's actually true |
| robust | (cut) or specific verb | meaningless adjective |
| innovative | specific or cut | self-congratulatory |
| revolutionary | (cut) | over-claim |
| leverage | use | corporate-speak |
| empower | enable / let | corporate-speak |
| unlock | (often cut) | overused and vague |
| solution | platform / product / answer | sales-y |
| game-changing | (cut) | hype |
| transform | (specific verb) | overused |
| dive deep | examine / consider | cliché |
| at the end of the day | (cut) | filler |
| moving forward | next / from here | filler |
| best-in-class | (specific claim) | self-promotion without proof |
| AI-powered | (specific) | meaningless in 2026 |
| ... | ... | ... |
```

Aim for 25–35 avoid-term entries. Pull liberally from
`voice/library-audit.md` Section 2's "recurring weaknesses" notes.

#### Section 3 — Industry terms — usage notes

Short notes on terms the field uses with specific connotations we
should respect:

```markdown
## Industry-specific terms — usage notes

**Outside counsel guidelines (OCG)** — Always capitalize the acronym;
spell out on first use in long form, OCG thereafter.

**Spend management** — In legal context this means outside-counsel
spend specifically, not all legal spend. Don't conflate.

**Matter type** — Ours covers everything: corporate, regulatory, IP,
M&A, litigation, employment. Don't default-frame as litigation-only
unless the brief specifies.

**Practice area** — Subset of matter type, narrower (e.g., "M&A" is
a practice area; "corporate" is a matter type). Don't use
interchangeably.

**Legal operations** vs **legal ops** — both are fine; "legal ops" is
the field's casual register, "legal operations" is more formal.
Default to "legal operations" in long-form, "legal ops" in social.

**E-billing** — hyphenated, lowercase, even at sentence start.

**Practice management** — usually means law-firm-side software
(distinct from corporate-counsel matter management). Be careful not
to use as a generic term for our space.

(more entries — aim for 8–12)
```

This section catches usage details that go beyond preferred/avoided
words.

## Constraints

- Each entry has a *reason*. "We avoid X" without explanation isn't
  enough — I need to know why so I can apply judgment to similar
  cases.
- Don't pad. 50 well-considered entries is more useful than 200
  sloppy ones.
- The reasons should be in our voice — not "this term lacks
  specificity," but "this term doesn't say anything."

## Acceptance criteria

- `voice/vocabulary.md` exists.
- Section 1 has 25–35 preferred-term entries.
- Section 2 has 25–35 avoid-term entries.
- Section 3 has 8–12 usage-note entries.
- Every entry has a one-line reason.
- File length: ~1,200–1,800 words / ~80–100 lines of tabular data.

## Out of scope

- Style rules beyond word choice (T02).
- Persona-specific vocabulary (T04 captures persona vocabulary).
- Brand-name terminology (e.g., "Foundry IQ", "Copilot Studio") —
  those are product terms, captured in `voice/product-knowledge.md`.

## Prompt

> Phase 0, T07 of the Spaarke content platform.
>
> Read `content-platform/spec.md` §5.6,
> `tasks/00-inputs.md` §4, `voice/library-audit.md`, and 2–3 of the
> strongest existing articles in `content/blog/`.
>
> Produce `voice/vocabulary.md` with three sections: preferred terms
> (25–35 entries), terms to avoid (25–35 entries), and industry-term
> usage notes (8–12 entries). Each entry has a one-line reason. Reasons
> in Spaarke voice — not academic.
>
> Do not modify other files. First draft — team revises in T11.
