# The UX That Legal IQ Requires

## The one-sentence topic

Users now expect to interact with enterprise systems differently —
across AI-derived outputs *and* deterministic ones like search,
reporting, and workflows. The shift is from passive viewing to
active engagement with information. Conversational AI was the
right starting point for tasks like attorney drafting and document
Q&A; embedding AI into a Legal IQ platform requires meeting the
broader UX expectations, and adding a conversation side pane to an
existing application does not do that. The UI follows from getting
the UX right.

## A note on terminology (UX vs UI)

Used in the plain industry sense:

- **User Experience (UX)** — how the user and the system
  collaborate: interaction patterns, modalities, feedback,
  information flow, the experience over time.
- **User Interface (UI)** — the surface: visual design and the
  controls through which UX is delivered.

The argument throughout is that users now expect a different
**experience**, not just a different **interface**. Define this
distinction cleanly once in the piece, then use both terms with
discipline.

## Why this matters, why now

Generative AI represents a generational shift in software — on
the order of the web or mobile — and most enterprise software is
still defaulting to a conversational surface dropped on top of the
last era's screens. That gets diagnosed as a UI gap, but the
deeper problem is the **UX**: the way the user and the system
collaborate over the information the system holds.

The shift is bigger than AI itself. Across enterprise software,
users have learned a new style of interaction — drill, pivot,
follow up, ask in different ways, pull insight from the same data
multiple ways without leaving their work. They are bringing that
expectation to legal software. A matter list, a budget report, a
search result, a workflow queue — none of these have to involve
AI for users to want active engagement rather than passive
viewing.

Legal IQ sits inside this shift. When AI inference is embedded
*inside* a system of record (matters, billing, contracts,
invoices), the question is not "what does the assistant on the
side panel do?" — it's "how do the user and the system
collaborate over a record that contains both deterministic facts
and probabilistic inference, with both expected to be explorable,
defensible, and acted upon?" That is a UX question. The UI
consequences (where to put the citation, how to color the
confidence cue) only become tractable after the UX is designed.

The timing is sharp: a wave of conversational-only AI demos is
hitting the legal market right now, sold as "AI-native." The
frame this piece gives the reader is what to *demand* instead.

## Who this is for

Three co-equal personas, all involved in evaluating or buying
legal-AI software:

- **Attorneys** — partners, in-house counsel, and senior
  practitioners who are deciding whether AI tools fit how they
  actually work. They are being shown conversational demos; they
  need a frame for why that's not enough, in language that
  respects their practice.
- **IT leaders** — the architects and engineering leaders
  evaluating "AI-native" pitches. They need vocabulary for what
  an AI-supported enterprise system actually requires beyond a
  conversation surface.
- **Legal-ops leaders** — the operating-model owners. They need
  a frame for the workflow, governance, and reporting
  implications of AI inside the system of record.

The piece must serve all three without specializing the prose for
any one of them. Examples should draw from spaces all three
recognize (matters, intake, billing, OCG, reporting).

## The argument (what the reader should walk away believing)

1. **AI is a generational software shift; the deeper gap is UX,
   not UI.** Each prior era produced its own UI paradigm (the
   page, the screen, the app). The current era's UI primitives
   are still being worked out — but the harder, more
   consequential problem is interaction design, not visual
   design. Users now expect a different experience, not just a
   different interface.

2. **First-generation generative AI made conversation the
   primary UX — and that was right for the tasks it was best
   at.** Tasks like attorney drafting, document Q&A, and
   exploratory research are well-served by conversation:
   natural-language input is the natural input, the output is
   meant to be read or refined, and a thread is the easiest way
   to show what a language model can do. That this pattern
   anchored the first wave of legal AI was correct.

3. **But adding a conversation side pane to an enterprise system
   does not embed AI into the system, and does not meet the new
   UX expectations.** This is the point the rest of the piece
   builds on. A conversation panel bolted onto a forms-and-
   clicks application leaves the underlying interaction model
   unchanged. The user still fills forms, still pages through
   queues, still hunts through tabs for the records that ground
   the answer. AI is adjacent to the work; it isn't part of it.
   Calling that "AI-native" is the marketing-led error this
   piece names.

4. **The bigger UX shift: active engagement with information.**
   This is the driver behind the new expectations — and it
   applies to AI outputs *and* deterministic ones. Users now
   expect to interact with reports, search results, workflows,
   matter lists, dashboards — not just read them. The shift is
   driven by how information is produced, analyzed, and surfaced
   in modern enterprise software, and the ways users have
   learned to engage with that information across the tools they
   already use. AI accelerates the shift; it doesn't create it.

5. **Legal IQ makes this concrete in legal practice.** The Legal
   IQ stack (Data, Memory, Inference) is what we mean by AI
   embedded in a system of record: the inference layer reasons
   *over* the deterministic record layer, on the same surface.
   The user is no longer just editing a record; they are reading
   a record that now contains both the facts and the system's
   interpretation of them — and is expected to be able to engage
   with both.

6. **The new UX patterns — across deterministic and probabilistic
   outputs.** These are the structural payload. Each is an
   interaction-level requirement first; the UI consequences
   follow. Show with examples drawn from both kinds of outputs:

   - **Active interaction over passive viewing.** UX
     requirement: from any system-derived view, the user can
     pivot, drill, filter, ask a follow-up, or change the lens
     without leaving the surface. Deterministic example: a
     matter list refined by "show only matters with budget
     overruns this quarter" via natural language; a Power BI-
     style report drilled to the firms driving a number.
     Probabilistic example: an AI-summarized matter where the
     user can ask "what's the basis for this?" and pivot to
     the underlying documents.

   - **Multi-modal intent capture.** UX requirement: how the
     user expresses what they want depends on the task —
     sometimes a form, sometimes a structured query, sometimes
     a natural-language sentence, sometimes a selection. UI
     consequence: the system offers the right input affordance
     for each task, rather than defaulting everything into a
     single conversational surface.

   - **Grounding and provenance for every system output.** UX
     requirement: from any insight the system surfaces, the
     user can step to what produced it — the records, the
     rules, the model output. Applies broadly. Deterministic
     example: a billing report aggregation drillable to the
     invoices behind it; a workflow decision traceable to the
     OCG rule that fired. Probabilistic example: an AI
     classification with the documents that grounded it,
     reachable in one step.

   - **Inference vs facts, visibly distinguished.** UX
     requirement (probabilistic-specific): the user can tell at
     a glance which parts of a record are deterministic facts
     and which are AI inference. UI consequence: consistent
     visual treatment that distinguishes the two, with
     confidence cues for the inferred parts.

   - **Action from insight, in place.** UX requirement: when
     the user sees something that warrants action, the action
     is one step from the surface that showed it — not a
     context switch to a separate screen. Deterministic
     example: an exception in a workflow queue resolved
     inline. Probabilistic example: an AI-flagged OCG concern
     where the user can accept, reject, or escalate without
     leaving the invoice.

   - **Cross-surface continuity.** UX requirement: actions and
     context carry across the surfaces the user moves between
     — a matter pinned in one view stays present in the next;
     a search refined in one place is recognized in another.
     Applies to deterministic surfaces as much as to AI ones.

7. **How Spaarke is building this — three surfaces that work
   together.** This is the "show, don't tell" section. Lands
   each surface as a concept, what it's for, and how it
   integrates with the others. *Don't name internal code paths
   or technical implementation — those are how, not what.*

   - **The Assistant surface.** The conversational AI surface —
     natural-language access, exploratory questions, drafting,
     intent capture. The inheritor of the first-gen pattern,
     kept where it actually works. Used for: "summarize this
     matter," "find similar matters," "draft a response to this
     clause," "what's the OCG implication here?"
   - **The Workspace surface.** Where actual work happens. The
     record with information embedded in it — both deterministic
     facts (matter fields, billing line items, calendar entries)
     and inferred ones (AI summaries, similar-matter
     suggestions, OCG pattern flags, confidence cues, citations).
     The Workspace is not a chat surface; it is the work surface
     made *active* — drillable, pivotable, interrogable.
   - **The Context surface.** The supporting surface for
     evidence, provenance, and audit. When the Assistant or the
     Workspace surfaces an output, the Context surface answers:
     what records grounded it, what policy or rule applied, what
     the system was uncertain about, what action history led
     here. Context is what turns surfaced information into
     defensible decisions.
   - **Inline AI inside content.** Not a separate surface — the
     same AI capability available *inside* the work the user is
     already doing. Highlight text in a document, apply an AI
     action in place. Edit an analysis with AI-suggested
     revisions shown as diffs the user accepts or rejects.
     Inline AI keeps AI from being a tab the user has to leave
     their work to reach.
   - **Cross-surface integration.** The surfaces aren't siloed;
     they share session, context, and intent. Selecting text in
     the Workspace deepens what the Assistant knows; asking the
     Assistant a question can pin a record in the Workspace; the
     Context surface reflects what either of the others has
     surfaced. This coordination is what "AI-supported" looks
     like at the UX level.

8. **For legal specifically, this isn't optional.** Privilege,
   audit, and compliance constraints make grounding and
   provenance non-negotiable for any system output — deterministic
   or AI-derived. A legal system of record where conclusions
   can't be traced back to their basis is a system that can't be
   defended.

9. **Spaarke punchline (one short paragraph, late, earned).** §7
   already does most of the work. The closing lands the bigger
   point: Legal IQ requires this UX, and it's visible in the
   product today. Point at the walkthrough, not a slogan.

## Concrete legal examples to consider (verify before claiming)

Examples to weave through the piece, drawn from spaces all three
personas recognize:

- **Billing.** Deterministic rule engine + probabilistic anomaly
  surfacing on the same record. UX: user pivots between
  enforcement and pattern review, drills from a flagged line to
  the OCG rule or to the matter history that explains it.
- **Matter intake.** Intent capture ("find matters like this")
  alongside a form. UX: choose modality by task; pivot from a
  suggested similar matter to the records that justify the
  suggestion.
- **OCG compliance.** Hard rule enforcement is deterministic;
  pattern surfacing is probabilistic. UX: user pivots from flag
  to evidence in one step; both rule-driven and AI-driven flags
  visible on the same record, distinguished.
- **Reporting and dashboards.** A deterministic example of the
  active-interaction pattern: drill, pivot, natural-language
  refinement, action-from-insight (escalate a budget overrun
  inline). Important — makes the "this is bigger than AI" point.
- **Workflow queues.** Exception triage replacing queue
  management. Applies whether the routing decision was AI-driven
  or rule-driven.
- **Document review / similar matters.** Grounded inference with
  citations to actual records. UX: the inference is never
  abstract — always pivot-able to evidence.

## Spaarke surface references for §7 (ground accurately)

Concrete product capabilities to draw from for the surface
descriptions, so §7 has real examples rather than abstractions:

- **Assistant** — the conversational AI surface. Examples:
  matter Q&A, find-similar, summarization, drafting, the
  Copilot-native experiences in M365.
- **Workspace** — the work surfaces inside Spaarke: matter
  records with AI summaries, intake with similar-matter
  suggestions, document records with relationship graphs,
  invoice review with OCG flags, daily briefings, Power BI
  dashboards on the Dataverse model.
- **Context** — provenance, evidence, audit. Where the inference
  came from, what policy applied, the history of action on a
  record. Less branded than Assistant/Workspace today — describe
  conceptually rather than by a single internal feature name.
- **Inline AI within content.** Word in-place co-authoring with
  grounded Copilot; selection-driven AI actions inside the work
  surface (described conceptually — don't name internal
  projects).
- **Cross-surface integration.** Describe the *user-visible*
  behavior — asking the Assistant about a matter pins it in the
  Workspace; selecting text in a document deepens the
  Assistant's context — not the internal mechanism.

## Cross-references to related Spaarke articles

The piece should sit inside the existing Legal IQ thread and pull
on these load-bearing pieces explicitly:

- **[Legal AI Is Not Deterministic — And That Matters]
  (`/blog/probabilistic-vs-deterministic`)** — cite for the
  probabilistic property and the visibility requirement that
  flows from it (citations, confidence cues, provenance).
- **[Context Is Only One Layer]
  (`/blog/context-is-only-one-layer`)** — the operating-model
  argument; "context graph is one layer, the operating model is
  the frame." Cite as the architectural prior.
- **[The Legal IQ Stack: Data, Memory, Inference]
  (`/why-spaarke/the-iq-stack`)** — canonical reference for what
  we mean by AI embedded in a system of record.
- **[What Is Legal Operations Intelligence?]
  (`/why-spaarke/what-is-legal-operations-intelligence`)** —
  category-level prior; reference once, lightly.
- **[The AI Readiness Gap in Legal Departments]
  (`/blog/the-ai-readiness-gap`)** — pairs naturally: data
  readiness is the input, UX-for-active-engagement is the
  output. Single-link reference, not a paragraph.

*(Link these inline at the place the argument hands off to them.
Don't dump them in a footer-style "related reading" block.)*

## What this should NOT become

- **Not a UX history lesson.** No "how the page became the
  screen became the app." The piece is about what's required
  now, not how we got here.
- **Not a critique of conversational AI.** First-gen
  conversational AI was right for the tasks it was best at. The
  argument is "enterprise AI needs more than a conversation
  side pane," not "conversation was a mistake."
- **Not "AI changes UX" framed too narrowly.** The bigger driver
  is how users now expect to engage with information across
  enterprise software — deterministic and probabilistic both.
  AI is one driver, not the only one. Section 4 has to land
  this; the patterns list has to demonstrate it.
- **No "chat bubble" / "chat bot" phrasing.** Use *conversational
  surface*, *conversational AI*, *the Assistant surface*,
  *conversation as the primary modality*, *first-generation
  generative AI*. Plain "chat" is fine as a verb (what the user
  does), not as a label for the whole UX.
- **No external research citations.** The Menlo / ServiceNow /
  LinkedIn-excerpt framings are useful for our thinking; they
  are not reference material. Write our argument in our own
  voice without attributions to outside thought leadership.
- **Not a UI-pattern listicle.** The six patterns are the
  structural payload, but the piece is an argument, not "7 UI
  patterns for AI-native software."
- **Not a UX/UI definitions lecture.** The distinction is a
  tool, not the topic. Define both terms cleanly once, then use
  them with discipline.
- **Not a Spaarke product pitch.** §7 introduces the three
  surfaces because they make the argument concrete — that's
  earned. The closing is short.
- **Avoid the do-not-say list.** No "unlock," "empower," "AI-
  powered," "revolutionize," "in today's fast-paced,"
  "seamless," "next-generation."

## Stand-alone vs. campaign

Stand-alone, but check the [2026-07 AI Across the Lifecycle]
campaign — this piece likely belongs in that arc as the "UX
layer" beat. Decide in `/idea-to-brief`.

## Open questions for `/idea-to-brief`

1. **Length.** Blog-post (1,400–1,800) or essay (2,000+)? The
   six-pattern payload plus the three-surfaces section pushes
   longer; brief decides.
2. **Companion LinkedIn post?** The probabilistic-vs-
   deterministic piece has a LinkedIn syndication workspace.
   This one would pair naturally with one. Flag in the brief.
3. **How concrete to make the Assistant / Workspace / Context
   examples?** Section 7 can land at three levels: (a)
   conceptual only, (b) conceptual + named product capabilities
   (matter summaries, find-similar, Word in-place drafting),
   (c) annotated screenshots from the walkthrough. The brief
   should pick — (b) is the working assumption.
4. **Hero direction.** SVG (default). Possible visuals: a
   three-surface diagram (Assistant + Workspace + Context with
   shared session and context); or a record with deterministic
   facts and AI inference rendered as visibly-different layers.
   Worth thinking about at brief time.
