# Content type: LinkedIn post

Calibration for LinkedIn drafts. Read alongside `voice/style-guide.md` (universal voice) and `voice/audience-personas.md` (LinkedIn is where most personas actually read us). This doc adjusts the dial for the format where personal voice outperforms organizational voice and the first two lines decide whether the rest gets read.

---

## 1. Purpose

LinkedIn is where Spaarke's audience already is — `corporate-counsel`, `legal-ops-director`, and `firm-operations-leader` all name it as a primary read; `legal-tech-cio` is sporadic but reachable. A personal post from a known practitioner outperforms a polished company post by an order of magnitude.

Three jobs LinkedIn posts do:

1. **Distribution** — surface long-form work where the audience is. Every blog post and white paper gets at least one syndication.
2. **Brand-building** — the steady drumbeat that makes "Spaarke" a name in the legal-ops conversation.
3. **Practitioner voice** — sharp observations from a named team member that don't merit a 1,400-word blog.

LinkedIn is not where we close deals. It's where we earn the right to be read.

## 2. Variants

Three. The brief picks one.

- **Standalone post**: 150–400 words. A single thought, sharply made. No link out — the post *is* the piece. Highest engagement on average. May use one image; if it does, hero treatment follows `voice/visual-identity.md`.
- **Carousel**: 5–10 slides, one idea per slide. Cover slide is the hook; last slide carries the CTA. Body slides 1–3 sentences plus a visual. Higher reshare rate, higher production cost. Imagery follows `voice/visual-identity.md` across the whole set, with the cover-slide as the strongest hook image — it doubles as the carousel thumbnail and is the single asset most readers see.
- **Article syndication**: 200–250-word teaser linking to a blog post or white paper. *Not* a summary — a separate hook that earns the click. Link in the post body, not a comment. Image is usually the source piece's hero, reused as-is.

A single brief can produce more than one variant — a blog post often generates both a syndication and a standalone practitioner post from the same source.

## 3. The hook

The first 1–2 lines decide everything. LinkedIn's mobile preview cuts off around line 3; if the hook doesn't land there, the rest doesn't get read.

Strong hooks are:

- **Specific** — a named scene, number, or role. "After 12 years on the corporate-counsel side, the question I never got asked in a vendor demo is…" beats "Have you ever wondered…"
- **Claim or question, not both.** A claim earns the read by being arguable; a question by being uncomfortable. Combining dilutes both.
- **Concrete nouns** — "outside counsel," "OCG enforcement," "matter handoff" beat "legal teams," "compliance," "transitions."

Forbidden openers per `style-guide.md` §5 still apply.

The brief's `hook` field is the literal first 1–2 lines, written before the body. If the hook doesn't work, the post doesn't ship.

## 4. Voice calibration

Defer to `voice/style-guide.md`. LinkedIn-specific calibration:

- **Byline**: usually a named team member; first-person sustained. Organizational ("Spaarke") is reserved for announcements and syndications — and even those often perform better re-posted from a named account.
- **Pronouns**: "I" and "you." First-person works on LinkedIn the way it doesn't in blog.
- **Tone**: looser than blog. Shorter sentences. Conversational, still authoritative.
- **Still operator-grade.** A number still cites the source (compactly, often parenthetically). Style-guide §5 forbidden phrases still apply.

## 5. Formatting

LinkedIn rewards short paragraphs and white space; long blocks read as walls on mobile.

- **Paragraphs**: 1–3 sentences each. Single-sentence paragraphs are common.
- **Line breaks** between paragraphs. Mobile preview is the rendering target.
- **Lists** sparingly — a 5-bullet list of single sentences works; three-sentence bullets read like blog paste.
- **Bold/italic** unsupported in standard posts (Unicode tricks read as desperate). Use sentence structure for emphasis.
- **Emoji**: zero, except as a section marker in a long carousel slide.

## 6. CTA convention

LinkedIn CTAs do one of three things:

- **Open question** to drive comments — "What does enforcement intelligence look like in your stack?" Best for standalone posts where engagement is the goal.
- **"Read the full piece →"** — for syndications. Link in the post body, on its own line.
- **No explicit CTA** — when the post lands a thought and stops. Often the right move; not every post needs a button.

Never end with hashtags. Hashtags go at the bottom, after a clear break, separated from the post's argument so they read as metadata, not as the close.

## 7. Hashtag strategy

**2–3 hashtags maximum**, at the bottom on their own line. More reads as Instagram in a suit.

Acceptable tags (pick 2, occasionally a third): `#LegalOps`, `#LegalTech`, `#InHouseCounsel` (for `corporate-counsel`), `#LegalOperations` (alternative to `#LegalOps` — pick one per post), `#Microsoft365` or `#PowerPlatform` (for `legal-tech-cio`).

Avoid: `#AI`, `#Innovation`, `#Transformation`, `#FutureOfLaw`. Wrong audience; signals "vendor" to the right one.

## 8. Frontmatter

LinkedIn briefs add the following fields on top of the universal frontmatter (see `spec.md` §6):

```yaml
---
type: linkedin-post
hook: |                              # the literal first 1-2 lines as drafted
  After twelve years inside legal, the question I never got asked in a vendor
  demo is the one that mattered most: where does this data actually live?
format: standalone                   # standalone | carousel | syndication
byline: <person-slug>                # person-slug from voice/bylines.md, or 'spaarke'
hashtags:                            # 2-3 max
  - LegalOps
  - InHouseCounsel
syndication_target:                  # only when format: syndication
  blog: <slug>
carousel_slides:                     # only when format: carousel; n = 5-10
  - cover: <hook line>
  - body: <slide 2 idea>
---
```

T10 builds the brief template from these fields.

## 9. Common pitfalls

The biggest one: **writing LinkedIn posts in blog voice.** A 600-word post in tight paragraphs with H2-style structure reads as a blog pasted into the wrong surface. LinkedIn is a different format, not a smaller blog.

- **Buried hook.** "I've been thinking a lot about legal ops lately…" — the claim is paragraph three. Rewrite from paragraph three forward.
- **Bait-and-switch syndication.** A teaser that promises a sharp argument; a blog link that delivers a generic overview. The teaser must be honest about what's at the other end.
- **Organizational voice where it should be personal.** "We at Spaarke believe…" almost always underperforms "I've watched three legal departments try this and…"

## 10. Worked example

**Brief sketch** (hypothetical): *2026-05-08 — standalone LinkedIn post on OCG enforcement.*

Audience `legal-ops-director` primary. Format `standalone`, byline a named team member with prior in-house experience, length ~280 words. Hook: "Most legal departments don't have an OCG problem. They have an OCG-enforcement-timing problem. The clauses are right; they just don't fire until after the invoice has been approved." Body: 4–5 short paragraphs covering what enforcement looks like today, what it should look like, why the gap persists, one concrete example. CTA an open question. Hashtags `#LegalOps #LegalTech`.

The brief's hook is the post's first two sentences verbatim. No link out — this is standalone, designed to drive comments and recognition for the byline.

---

*Locked 2026-05-07 — see git log for history.*
