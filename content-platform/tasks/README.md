# Content Platform — Tasks

Phase 0 (voice extraction) is the bootstrap. Without the voice
constitution in place, no drafting work should start — drafts produced
without it will average toward generic marketing English.

The full architecture is in [`../spec.md`](../spec.md). Tasks reference
spec sections by number.

---

## Phase 0 — Voice extraction

Deliverable: the voice constitution in
`content-platform/voice/`, locked, plus `content-types/*.md`
specs, plus initial workflow scaffolding.

### Inputs needed from you (T00)

Before any drafting tasks start, you supply:

1. **3–5 "yes, this is us" articles** — pointers to existing posts in
   `content/blog/` you'd hold up as exemplary, or external pieces (sales
   decks, founder interviews, LinkedIn posts) in the voice we want.
2. **Audience personas** — rough sketches of 3–4 of: who we're trying
   to reach, what they care about, what they don't trust. One paragraph
   each is enough.
3. **3 reference voices** — companies (any industry) whose writing you
   respect. Lets me triangulate "you sound more like X than like Y."
4. **A do-not-claim list** — things others say in your space that you
   don't say, with one-line reasons.
5. **Initial calendar** — 8–12 topic stubs with rough publish dates and
   content types.

You can drop these into `tasks/00-inputs.md` (template provided) or
deliver in chat — I'll structure them.

### Phase 0 dependency graph

```
T00 [Inputs from you]                                  ← prerequisite
 │
T01 [Audit existing library + voice tagging]           ← reads content/blog/
 │
 ├── T02 [Draft style-guide.md]              ┐
 ├── T03 [Draft brand-positioning.md]        │
 ├── T04 [Draft audience-personas.md]        ├─ all parallel after T01
 ├── T05 [Draft product-knowledge.md]        │
 ├── T06 [Draft domain-knowledge.md]         │
 ├── T07 [Draft vocabulary.md]               │
 └── T08 [Curate voice/examples/]            ┘
 │
T09 [Draft content-types/*.md (4 types)]    ← can start anytime after T02
 │
T10 [CLAUDE.md routing + brief templates + calendar.md skeleton]
 │
T11 [Phase 0 review + lock]                  ← team reviews, revises, locks
```

### Parallelization plan

- **Wave 1**: T00 (you supply inputs).
- **Wave 2** (sequential): T01.
- **Wave 3** (parallel, 7 agents): T02, T03, T04, T05, T06, T07, T08.
- **Wave 4** (1 agent): T09 (depends on style-guide having shape).
- **Wave 5** (1 agent): T10.
- **Wave 6** (1 agent): T11 (team-driven; Claude assists).

Drafting tasks (T02–T08) all read the same input files (T01's audit
output + your raw inputs in T00) and write to disjoint files, so
parallelism is safe.

---

## Phase 1+ tasks (deferred)

Phase 1+ tasks aren't written yet — they depend on Phase 0 output. Once
the voice constitution is locked, we'll write task files for:

- **P1.1**: Per-content-type brief templates with examples.
- **P1.2**: Calendar initial population from your topic list.
- **P1.3**: Bylines doc (`voice/bylines.md`).
- **P1.4**: Taxonomy audit + canonical tag values.
- **P2.1–P2.4**: First-batch articles (one task per piece).
- **P3.x**: Channel adapters, white-paper site treatment, library
  functionality.

---

## File touch matrix (Phase 0)

| Task | Creates | Modifies |
|---|---|---|
| T00 | `tasks/00-inputs.md` (filled-in by team) | — |
| T01 | `voice/library-audit.md` | — (read-only on `content/blog/`) |
| T02 | `voice/style-guide.md` | — |
| T03 | `voice/brand-positioning.md` | — |
| T04 | `voice/audience-personas.md` | — |
| T05 | `voice/product-knowledge.md` | — |
| T06 | `voice/domain-knowledge.md` | — |
| T07 | `voice/vocabulary.md` | — |
| T08 | `voice/examples/good-articles.md`, `tone-samples.md`, `avoid-this.md` | — |
| T09 | `content-types/{white-paper,blog-post,linkedin-post,tweet}.md` | — |
| T10 | `CLAUDE.md`, `briefs/_template-{type}.md`, `calendar.md` | — |
| T11 | revisions across `voice/*` | — |

No two parallel tasks write to the same file. Safe to fan out
T02–T08 as concurrent agents.
