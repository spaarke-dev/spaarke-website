# Content type: blog post

Calibration for blog-post drafts. Read alongside `voice/style-guide.md` (universal voice) and `voice/brand-positioning.md` (the argument). This doc adjusts the dial for the workhorse format.

---

## 1. Purpose

Blog posts are the workhorse. They carry the bulk of the publication calendar, do the SEO work that brings in unfamiliar readers, and supply the raw material every other format adapts from.

Three jobs each post should do, in order of priority:

1. Land one specific argument the reader can repeat in their own words.
2. Earn the next click — to a related post, a `/platform` section, or a `/why-spaarke/<slug>`.
3. Be findable — title, headings, and frontmatter that work for search without sacrificing voice.

If a draft does the first two and only weakly does the third, ship it. If it does the third and weakly does the first, kill it.

## 2. Length and structure

**Target: 1,000–1,800 words. Sweet spot ~1,400.** Shorter than 1,000 reads as a LinkedIn post upgraded to a blog. Longer than 1,800 should probably be a white paper, or two posts.

Standard structure:

1. **Hook (paragraphs 1–2)** — a specific observation, a named scene, or a direct claim. The first sentence carries weight; the §5 list of forbidden openers in `style-guide.md` rules out "Imagine if…" and "In today's world…"
2. **3–5 H2 sections** — each with its own sub-claim and at least one piece of named evidence (a number, a framework, a concrete scenario). H2s are sentence-case statements, never questions.
3. **Tight close** — 2–3 paragraphs that land the argument. No summary recap of "in this post, we covered…" The close advances; it doesn't restate.
4. **CTA paragraph** — one short paragraph or single line pointing to the next read. Contextual to the topic, not a sales button.

H3s are allowed but rare — usually a sign the H2 section should be its own post. Code blocks are rare; reserve for genuinely technical pieces aimed at `legal-tech-cio`.

## 3. Voice calibration

The blog is the default register `voice/style-guide.md` was written for, so calibration is light:

- **Byline**: organizational by default. First-person allowed when the brief specifies it — typically practitioner-experience pieces where the lived experience *is* the argument.
- **Pronouns**: third-person and named roles. First-person plural sparingly, never in the CEO-letter register flagged in `style-guide.md` §5.
- **Sentence rhythm**: looser than white papers. Short sentences for cadence.

When the brief sets `byline: <person>` and the post is first-person, sustain the persona — don't drift into organizational voice mid-paragraph.

## 4. Image treatment

- **1–2 supporting images per post.** Required for any post whose argument is visual (architecture, flow, dashboard, comparison).
- **Acceptable**: product screenshots, original diagrams (existing asset library), licensed photography. No stock-suit handshakes; no AI-generated illustrations that read as AI-generated.
- **Hero image**: every post sets `heroImage` in frontmatter. From now on, heroes are custom-generated per piece, not picked from a vector library — hero treatment follows `voice/visual-identity.md`, and the brief's `# Hero graphic` section captures the prompt and generator settings the team used. Reused diagrams fine; reused stock isn't.
- **Alt text** is a real sentence — "Diagram of the IQ Stack with Data, Memory, and Inference layers," not "diagram." Polish step enforces.
- **Pull-quotes** optional, one per post max.

## 5. CTA convention

Contextual — the CTA matches the audience and the topic. The brief specifies. Defaults by topic family:

- **Architecture / deployment / security** (`legal-tech-cio` audience) → "Read about [tenant deployment / Microsoft-native architecture]" pointing to `/why-spaarke/<slug>` or a related deep-dive post.
- **Operational pieces** (`legal-ops-director` audience) → "See how this looks in the platform: [/platform/<module>]" or "Read the companion piece on [related slug]."
- **Strategic / category pieces** (`corporate-counsel` audience) → "Talk to our team" or "Read more in [related]."
- **Practitioner experience pieces** (first-person bylines) → an open question or a soft pointer; rarely a "buy" CTA.

Never end with "Schedule a demo." See `style-guide.md` §5.4 — the close points to substance, not a button.

## 6. Frontmatter

The canonical shape lives in `src/lib/blog.ts`. Required fields, validated at build:

```yaml
---
title: <Statement, sentence-case-but-with-proper-caps-as-needed>
description: <SEO meta description, ~155 chars; full sentence>
summary: <Optional one-paragraph summary shown above the article body>
date: 2026-05-12                      # ISO date; publication date
author: spaarke                       # spaarke | <person-slug>
tags:
  organization: []                    # e.g., spaarke, microsoft
  function: []                        # e.g., legal-operations, in-house, law-firm
  topic: []                           # e.g., spend-management, ocg, ai-readiness
  theme: []                           # e.g., loi, microsoft-native, system-of-record
heroImage: /images/blog/<slug>.jpg
heroImagePosition: center             # optional; CSS object-position
draft: false
---
```

Optional fields supported by the loader: `posted` (separate from `date` if backdating); `keyTakeaways` (bullet list shown at the top of the article); `order` (homepage card sort); `featured` + `featuredOrder` (for the `/why-spaarke` carousel).

**`keyTakeaways`**: array of 3–5 strings; each string 18–35 words; drafted in Spaarke voice; appears in the article's "Key takeaways" card above the body.

Tag categories must align with `voice/taxonomy.md` (Phase 1 deliverable). Don't invent new tag values mid-draft.

## 7. Cross-linking

Every blog post links to **at least one** of:

- A related blog post in `content/blog/` (the natural prerequisite or follow-on).
- A `/platform/<section>` page, when the topic touches a capability module.
- A `/why-spaarke/<slug>` page, when the topic touches a positioning theme.

Two or three internal links is healthy. Five-plus reads as SEO posturing. External links to cited sources are separate from this rule and should be present whenever a number or framework is named (see the style guide's "no claims without a defense" rule).

The brief's "References" section names which links the draft must include.

## 8. Common pitfalls

- **The dual hook.** Opening with both a stat *and* a scene burns 200 words on warm-up. Pick one.
- **The five-section sprawl.** Five H2s of 200 words each is an outline. If two only need a paragraph, fold them.
- **The marketing close.** "If you're ready to transform your legal department…" — see `style-guide.md` §5. The close advances or points to substance.
- **Adopting LinkedIn voice.** First-person, line breaks every sentence, hook-bait open. LinkedIn voice in a blog post reads as if the author posted to the wrong surface.

## 9. Worked example

**Brief sketch** (hypothetical): *2026-05-19 — "Where matter management ends and operational intelligence begins."*

Audience `legal-ops-director` primary, `corporate-counsel` secondary. Angle: matter management answers "what's open?" Operational intelligence answers "what should we do about it?" Length 1,400 words. Structure: hook (a director walking into a QBR with a 47-tab status report) → §1 what matter management is built to answer → §2 the questions it can't → §3 what operational intelligence adds (the IQ Stack, used structurally) → close → CTA to `/platform/spend-performance`.

The angle becomes the H2 sequence: §1 the table-stakes claim, §2 the gap, §3 the resolution. The hook drops out of "what does the director actually walk into?" Each section names one piece of evidence — a CLOC reference in §1, a concrete failure scenario in §2, the IQ Stack organizing §3.

---

*Locked 2026-05-07 — see git log for history.*
