---
slug: <kebab-case-slug>
type: blog-post
publish_date: <YYYY-MM-DD>
channels: [website, linkedin]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: normal                    # high | normal | low
audience: <persona-slug>            # corporate-counsel | legal-ops-director | legal-tech-cio | firm-operations-leader
length_target: 1400                 # words; sweet spot ~1,400 (range 1,000–1,800)
byline: spaarke                     # spaarke | <person-slug from voice/bylines.md>

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: <Sentence-case statement; not a question>
description: <SEO meta description, ~155 chars; full sentence>
summary: <Optional one-paragraph summary shown above the article body>
date: <YYYY-MM-DD>                  # publication date; ISO format
posted: <YYYY-MM-DD>                # optional — separate from date if backdating
author: spaarke                     # spaarke | <person-slug>
tags:
  organization: []                  # e.g., spaarke, microsoft
  function: []                      # e.g., legal-operations, in-house, law-firm
  topic: []                         # e.g., spend-management, ocg, ai-readiness
  theme: []                         # e.g., loi, microsoft-native, system-of-record
heroImage: /images/blog/<slug>.jpg
heroImagePosition: center           # optional; CSS object-position
draft: true                         # set false when polished and ready
keyTakeaways:                       # optional bullet list shown at top of article
  - <takeaway>
order: <number>                     # optional; lower numbers appear first on homepage
featured: false                     # optional; surfaces in /why-spaarke carousel
featuredOrder: <1|2|3>              # optional; only when featured: true
---

# Topic
<What this article is about. 1–2 sentences.>

# Angle / Point of view
<The frame. Not just the topic but how Spaarke approaches it. What is
the one specific argument the reader should be able to repeat? 2–4
sentences.>

# Why now
<Why this article makes sense to publish in this window. A market
trigger, a calendar moment, a debate to weigh in on, or a gap in our
existing library.>

# Must include
- <Sub-claim or section the argument needs>
- <Named evidence — a number, a framework, a concrete scenario>
- <Cross-link the draft must include (related blog post, /platform
  page, or /why-spaarke page)>

# Must NOT include
- <Topics that should land in a separate piece>
- <Items from voice/examples/avoid-this.md>
- <Marketing closes, "schedule a demo", "transform your…">

# References
- <Internal article(s) to link>
- <External source(s) to cite — every named number needs one>
- <Companion white paper or LinkedIn syndication, if any>

# Voice notes
<Any deviation from the blog-post calibration in
content-types/blog-post.md. For example: first-person practitioner
register if the byline is a named person; CTA target; image
direction. Often empty.>

# Hero graphic

**Prompt** (paste-ready for Midjourney/DALL-E/Firefly — see
`voice/visual-identity.md`):

<Full prompt assembled per visual-identity.md §7. Style prefix,
abstract subject, composition, negative list. Roughly 80–140 words.>

**Style preset**: <e.g., "minimalist geometric, deep-navy + electric-blue accent, 2.5D">

**Aspect ratio**: 16:9 (default — matches `ArticleHeader.tsx`).
Override only when the brief specifies a different surface.

**Alt text**: <One sentence describing the image for screen readers — a real description, not "hero image".>

**Generator notes**: <Which tool (Midjourney v6.1+ default), any
flags (e.g., `--style raw --ar 16:9 --stylize 50`), any iteration
notes for the team.>
