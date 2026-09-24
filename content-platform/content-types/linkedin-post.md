# Content type: LinkedIn post

This document calibrates the house voice for LinkedIn drafts. Read it alongside `voice/style-guide.md` (the universal voice rules), `voice/examples/ai-tells.md` (the constructions to find and remove), and `voice/audience-personas.md`, because LinkedIn is where most personas read us. It adjusts the register for a format in which a personal voice outperforms an organizational voice and the first two lines decide whether the rest is read.

---

## 1. Purpose

LinkedIn is where Spaarke's audience already reads. The `corporate-counsel`, `legal-ops-director`, and `firm-operations-leader` personas all name it as a primary source, and `legal-tech-cio` reads it sporadically but can be reached there. A personal post from a known practitioner outperforms a polished company post by an order of magnitude.

A LinkedIn post earns the right to be read, and deals close in other channels. Within that purpose, LinkedIn posts do three jobs:

1. **Distribution**: they surface long-form work where the audience is. Every blog post and white paper receives at least one syndication.
2. **Brand-building**: they supply the steady cadence of posts that makes "Spaarke" a name in the legal-ops conversation.
3. **Practitioner voice**: they carry sharp observations from a named team member that do not merit a 1,400-word blog post.

## 2. Variants

The brief picks one of three variants:

- **Standalone post**: 150 to 400 words that make a single thought sharply. The post carries no outbound link, because the post *is* the piece. This variant has the highest engagement on average. It may use one image; if it does, hero treatment follows `voice/visual-identity.md`.
- **Carousel**: 5 to 10 slides, with one idea per slide. The cover slide is the hook, and the last slide carries the CTA. Each body slide has one to three sentences plus a visual. Carousels have a higher reshare rate and a higher production cost. Imagery follows `voice/visual-identity.md` across the whole set. The cover slide needs the strongest hook image, because it doubles as the carousel thumbnail and is the single asset most readers see.
- **Article syndication**: a teaser of 200 to 250 words that links to a blog post or white paper. The teaser is a separate hook that earns the click, and it does not walk the reader through the piece section by section. It does have to name the subject. Where the source piece exists to establish a term, the teaser uses that term in the first line and defines it, because a teaser that works around the word is teasing a different article. Naming what the piece covers, in one closing sentence, is not a summary and is the honest way to set up the click. The link goes in the post body and never in a comment. The image is usually the source piece's hero, reused as it is.

A single brief can produce more than one variant. A blog post, for example, often generates both a syndication and a standalone practitioner post from the same source.

## 3. The hook

The first one or two lines decide whether the post is read. LinkedIn's mobile preview cuts off around line 3, so a hook that has not made its point by then loses the reader.

Strong hooks share three properties:

- **Specific**: the hook names a scene, a number, or a role. "After 12 years on the corporate-counsel side, the question I never got asked in a vendor demo is…" is stronger than "Have you ever wondered…"
- **A claim or a question, never both**: a claim earns the read by being arguable, and a question earns it by being uncomfortable. Combining the two dilutes both. A question hook must be a diagnostic question that readers can put to their own departments. A question that the next line answers is a staged reveal and is not used (`style-guide.md` §5, rule 19).
- **Concrete nouns**: "outside counsel," "OCG enforcement," and "matter handoff" are stronger than "legal teams," "compliance," and "transitions."

The forbidden openers in `style-guide.md` §5 still apply. The brief's `hook` field holds the literal first one or two lines, which are written before the body. If the hook does not work, the post does not ship.

## 4. Voice calibration

Defer to `voice/style-guide.md` for the baseline. Sections 4 and 5 of that guide apply to LinkedIn in full, including the ban on em dashes and dash substitutes and the ban on the constructions listed in `voice/examples/ai-tells.md`. The LinkedIn-specific calibration is as follows:

- **Byline**: usually a named team member, writing in a sustained first person. The organizational byline ("Spaarke") is reserved for announcements and syndications, and even those often perform better when they are re-posted from a named account.
- **Pronouns**: "I" and "you." The first person works on LinkedIn in a way that it does not in a blog post.
- **Tone**: looser than a blog post, conversational, and still authoritative. Contractions are acceptable.
- **Sentences**: shorter than in long-form work, which suits the medium. Each sentence still has a subject and a verb, and each carries content. Brevity does not license the devices that readers identify as machine-written: negation followed by correction (`It is not X. It is Y.`), `not just X but Y`, stacked verbless fragments, a question answered in the next line, a colon reveal such as `The result:`, or a pair of clipped symmetrical sentences as the closing line.
- **Evidence**: the post remains operator-grade. A number still cites its source, compactly and often in parentheses, and the forbidden phrases in style-guide §5 still apply.

## 5. Formatting

LinkedIn rewards short paragraphs and white space, because long blocks read as walls of text on mobile.

- **Paragraphs**: one to three sentences each. Single-sentence paragraphs are common on LinkedIn, because the mobile layout needs the white space. They are a layout convention of the medium, and each one must carry content. A line that is set alone only to dramatize the line before it remains a tell (`style-guide.md` §5, rule 17).
- **Line breaks**: one between paragraphs. The mobile preview is the rendering target.
- **Lists**: use them sparingly. A five-bullet list of single sentences works, whereas three-sentence bullets read like a pasted blog post.
- **Bold and italic**: unsupported in standard posts, and Unicode workarounds read as desperate. Use sentence structure for emphasis.
- **Punctuation**: no em dashes, and no spaced hyphens, double hyphens, or spaced en dashes standing in for them. Use a comma, a colon, parentheses, or a new sentence.
- **Emoji**: none, except as a section marker in a long carousel slide.

## 6. CTA convention

A LinkedIn CTA takes one of three forms:

- **An open question** that drives comments, such as "What does enforcement intelligence look like in your stack?" This form is best for standalone posts where engagement is the goal.
- **"Read the full piece →"** for syndications, with the link in the post body on its own line.
- **No explicit CTA**, when the post makes its point and stops. This is often the right choice, because not every post needs a button.

Hashtags never serve as the close. They go at the bottom, after a clear break, separated from the post's argument so that they read as metadata.

## 7. Hashtag strategy

**Use two or three hashtags at most**, at the bottom on their own line. A longer list reads as Instagram in a suit.

Acceptable tags (pick two, and occasionally a third): `#LegalOps`, `#LegalTech`, `#InHouseCounsel` (for `corporate-counsel`), `#LegalOperations` (an alternative to `#LegalOps`; pick one per post), and `#Microsoft365` or `#PowerPlatform` (for `legal-tech-cio`).

Avoid `#AI`, `#Innovation`, `#Transformation`, and `#FutureOfLaw`. They reach the wrong audience, and they signal "vendor" to the right one.

## 8. Frontmatter

LinkedIn briefs add the following fields on top of the universal frontmatter (see `spec.md` §6), and T10 builds the brief template from these fields:

```yaml
---
type: linkedin-post
hook: |                              # the literal first 1 to 2 lines as drafted
  In twelve years inside legal, no vendor demo asked me where our data lives,
  and that was the question that decided most of our risk.
format: standalone                   # standalone | carousel | syndication
byline: <person-slug>                # person-slug from voice/bylines.md, or 'spaarke'
hashtags:                            # 2 to 3 max
  - LegalOps
  - InHouseCounsel
syndication_target:                  # only when format: syndication
  blog: <slug>
carousel_slides:                     # only when format: carousel; n = 5 to 10
  - cover: <hook line>
  - body: <slide 2 idea>
---
```

## 9. Common pitfalls

The most common pitfall is **writing LinkedIn posts in blog voice.** A 600-word post in tight paragraphs with an H2-style structure reads as a blog post pasted into the wrong surface. LinkedIn is a separate format with its own conventions, and a blog post cut down to size does not meet them.

- **Buried hook.** The post opens with "I've been thinking a lot about legal ops lately…" and the claim does not arrive until paragraph three. Rewrite from paragraph three forward.
- **Bait-and-switch syndication.** The teaser promises a sharp argument, and the blog link delivers a generic overview. The teaser must be honest about what is at the other end.
- **Syndication that never names the subject.** A teaser built from the source piece's closing claim can read well and still omit the term the piece was written to teach. The company-page post for `legal-operations-ontology` was drafted this way on 2026-09-23 and did not contain the word "ontology". Check the teaser against the source piece's first key takeaway, not its conclusion.
- **Organizational voice where a personal voice belongs.** "We at Spaarke believe…" almost always underperforms "I've watched three legal departments try this and…"
- **Short-form AI tells.** The pressure to be brief invites em dashes, stacked fragments, and a closing pair of clipped sentences. Sweep every post against the pre-review checklist in `voice/examples/ai-tells.md` before it ships.

## 10. Worked example

**Brief sketch** (hypothetical): *2026-05-08, standalone LinkedIn post on OCG enforcement.*

The audience is `legal-ops-director` (primary). The format is `standalone`, the byline is a named team member with prior in-house experience, and the length is about 280 words. The hook reads: "Most legal departments enforce their outside counsel guidelines after the invoice has already been approved. The clauses are right, but they fire too late to stop the spend." The body is four or five short paragraphs that cover what enforcement looks like today, what it should look like, why the gap persists, and one concrete example. The CTA is an open question, and the hashtags are `#LegalOps #LegalTech`.

The brief's hook is the post's first two sentences verbatim, and it states its claim positively. An earlier version of this example opened by denying one problem in order to name another, which is the negation followed by correction that `style-guide.md` §5, rule 14 bans in every format. The post carries no outbound link, because it is a standalone piece designed to drive comments and recognition for the byline.

---

*Revised 2026-09-21 (no em dashes, AI-tells ban applied to short formats), see git log for history.*
