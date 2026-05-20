---
slug: probabilistic-vs-deterministic-syndication
type: linkedin-post
publish_date: 2026-05-25                         # Monday — 4 days after the blog publish; clean slot inside the campaign distribution
channels: [linkedin]
status: brief                                    # brief | outline | draft | review | scheduled | published
priority: normal                                 # campaign-cadence, not time-sensitive
audience: corporate-counsel                      # primary co-equal with legal-ops-director (in-house attorneys); org-page channel skews slightly buyer-side
length_target: 240                               # words; syndication range 200–250 per content-types/linkedin-post.md §2
byline: spaarke                                  # organizational; company-page post (founder double-up is a separate, later decision)
hook: |                                          # locked verbatim; mobile preview cuts at line 3
  Generative AI is probabilistic. That isn't a defect.
  It's the property that determines where AI belongs in legal work — and where it doesn't.
format: syndication                              # standalone | carousel | syndication
hashtags:                                        # 2 — bottom of post on their own line
  - LegalOps
  - LegalTech
syndication_target:
  blog: probabilistic-vs-deterministic
campaign: 2026-05-spaarke-launch
source_piece_url: https://www.spaarke.com/why-spaarke/probabilistic-vs-deterministic
---

# Topic

A LinkedIn syndication of the 2026-05-21 blog post **Legal AI Is Not Deterministic — And That Matters**. Compresses the article's argument into a ~240-word teaser on Spaarke's company page, with a direct link back to the full piece. Org-page post, organizational byline.

# Angle / Point of view

Generative AI is probabilistic. That isn't a defect — it's a property that determines where AI belongs in legal work and where it doesn't. The post lands that take in two sentences (the locked hook), gestures at the operational consequences (deterministic systems for rules and math, probabilistic for surfacing and judgement, hybrid patterns for everything important, deterministic guardrails around agent loops), and points the reader to the full primer for the reasoning.

The post is a **teaser, not a summary**. It earns the click by promising the *why* — not by giving it away. Per `content-types/linkedin-post.md` §9: a syndication that duplicates the article's reasoning has no reason to be clicked.

# Why now

The 2026-05 launch campaign distribution sequence places a syndication ~3–4 business days after each blog publish (cf. the 5/22 syndication of the 5/19 piece, the 5/29 syndication of the 5/26 piece). The blog landed 2026-05-21; 5/25 (Monday) is the clean slot — clear gap from the 5/22 syndication, doesn't crowd the 5/26 blog. This is also the company-page beat that complements the founder-voice posts elsewhere in the week.

# Must include

- The hook line verbatim (locked in frontmatter):
  - *Generative AI is probabilistic. That isn't a defect.*
  - *It's the property that determines where AI belongs in legal work — and where it doesn't.*
- A compressed gesture at the deterministic/probabilistic distinction. **Pick one example pair from the article, not several.** Recommended: the billing-rule-engine vs "potentially non-compliant billing patterns" contrast (concrete, legal-domain, and the article itself uses this as the locked example pair). Two short sentences max.
- One sentence on the agentic implication — that a probabilistic step inside an agent loop compounds across downstream actions if it isn't bounded. (This is the highest-stakes line in the source piece; surfacing it in the teaser is an honest preview of where the argument lands.)
- One sentence on the practitioner payoff — that good legal AI tools make the probabilistic layer visible (grounded citations, where-inference-enters markers, human gates at consequential steps) so practitioners can act responsibly on the output. *(Optional — drop this if word budget is tight; the agent line is the priority.)*
- The CTA, on its own line: **Read the full primer →** followed by the URL `https://www.spaarke.com/why-spaarke/probabilistic-vs-deterministic`
- Hashtags `#LegalOps #LegalTech` at the bottom on their own line, separated from the body by a blank line — per `content-types/linkedin-post.md` §7 (hashtags as metadata, not the close).

# Must NOT include

- A copy-paste of the article's opening. The calculator/advisor pair is the article's hook; using it again here means the reader has nothing left to click through for. The teaser hook is the *take*, not the analogy.
- A full restatement of the deterministic vs probabilistic candidates lists from the article (five each). One example pair is enough; the article is the place for exhaustiveness.
- Founder voice. The byline is `spaarke` (organizational). A founder-voice version from `ralph-schroeder` is a separate, optional follow-up — see Unresolved.
- "Schedule a demo," "transform your legal department," exclamation points, or any item from `voice/style-guide.md` §5. The CTA points to substance.
- More than 2 hashtags. The post needs room to breathe; `#LegalOps #LegalTech` is the right pair for this audience.
- Emoji, Unicode bold tricks, or other formatting workarounds. Per `content-types/linkedin-post.md` §5 — sentence structure carries emphasis on LinkedIn.
- The phrase "AI-powered," "by design" (as casual shorthand for the probabilistic property), or any recitation of "Data → Memory → Inference" without using it structurally. Inherited Voice notes from the source piece.

# References

- [The source blog post](https://www.spaarke.com/why-spaarke/probabilistic-vs-deterministic) — the only required link. Lives in the post body on its own line, not in a comment.
- [Context Is Only One Layer](../context-is-only-one-layer/) — the LinkedIn post that established the IQ-stack frame this piece extends at the Inference layer. Not required as a link, but the writer can reference its hook structurally if useful.

# Voice notes

- Register: **organizational primer voice**. Not founder voice (byline is `spaarke`). Confident, calm, operator-grade. The post sounds like the company explaining a concept its audience needs, not a sales pitch.
- LinkedIn-specific cadence (per `content-types/linkedin-post.md` §§4–5):
  - Short paragraphs. 1–3 sentences each. Single-sentence paragraphs allowed.
  - Line breaks between paragraphs — mobile preview is the rendering target.
  - No bold/italic, no emoji, no Unicode tricks. Sentence structure carries emphasis.
  - First-person plural ("we") is acceptable from the org byline but should be rare; the post can carry without it.
- The hook is the post's most load-bearing line. It has been pre-approved verbatim. **Do not rewrite the hook.** If the draft surfaces a stronger candidate, escalate via the Unresolved list — do not silently swap.
- Number of inline links in the body: **one** — the CTA back to the article. LinkedIn algorithmically deprioritizes posts with external links, but a single link in the body (not a comment) is the right move for an honest syndication.
- The post must read cold. Spaarke is a relatively new brand; the reader may not know the company yet. The post should not assume the reader has read the IQ-stack post or the source article.

# Hero graphic

Per `content-types/linkedin-post.md` §2.3 (syndications): use the source piece's hero, reused as-is. The image is already generated.

- **Image**: `public/articles/probabilistic-vs-deterministic/linkedin-1920x1080.png` (1920×1080, ~145KB). Generated 2026-05-20 from the revised SVG (light periwinkle dots + embedding-vector arrows on lifted navy).
- **Alt text** (for the LinkedIn attachment): *An embedding-vector field. On the left, a 3×3 grid of light-blue points with arrows pointing the same direction — deterministic vectors. On the right, points scattered with arrows pointing in many different directions — a probabilistic distribution in embedding space.*
- **Aspect ratio**: 16:9 (1920×1080). Acceptable for syndications per `content-types/linkedin-post.md` §8 ("16:9 only when syndicating an article hero"). LinkedIn will render it in feed.

No carousel, no new graphic generation required.

# Follow-up

A separate **founder-voice version** from `ralph-schroeder` is on the table but **out of scope for this brief**. Decision criteria:

- If the 5/25 org post performs above campaign average → write the founder version for 5/26 or 5/27 with a different hook (probably #4 from the idea, the close-inversion: *"Legal AI doesn't fail because it's probabilistic. It fails when the people using it don't know that it is."*).
- If the 5/25 org post performs at or below average → no founder double-up; the syndication has run its course.

Tracked separately. Do not write it here.

---

## Unresolved (resolve before drafting)

- [x] **Hook** — locked verbatim. *"Generative AI is probabilistic. That isn't a defect. It's the property that determines where AI belongs in legal work — and where it doesn't."* The strongest alternative considered was hook #1 from `idea.md` (the calculator/advisor parallel), but that duplicates the article's opening and so undercuts the syndication's job of earning the click. If a team-stage reviewer wants to test hook #1 instead, escalate before drafting — do not swap silently.
- [x] **Byline** — locked: `spaarke` (organizational, company page).
- [x] **Date** — locked: 2026-05-25.
- [x] **Image** — locked: the existing LinkedIn header PNG, no new generation needed.
- [x] **CTA** — locked: a single line of body text — *"Read the full primer →"* followed by the URL on the next line.
- [ ] **Founder double-up decision** — deferred to post-publish metrics on the 5/25 org post. See Follow-up.
- [ ] **Body word count discipline** — target 240 words, range 200–250 per `content-types/linkedin-post.md` §2. The Must Include list has one optional item (the "make it visible" payoff sentence) — drop it first if the draft runs long.
