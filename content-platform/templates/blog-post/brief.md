---
slug: <kebab-case-slug>
type: blog-post
publish_date: <YYYY-MM-DD>
channels: [website, linkedin]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: normal                    # high | normal | low
audience: <persona-slug>            # corporate-counsel | legal-ops-director | legal-tech-cio | firm-operations-leader
length_target: <open | words>       # open = long-form article, no length cap (the primary format for thought leadership); a number above 1,800 = long-form estimate chosen for the topic, not a cap; 1,000 to 1,800 = short post (about 1,400 suits most). See content-types/blog-post.md section 2.
byline: spaarke                     # spaarke | <person-slug from voice/bylines.md>

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: <Title case; a statement by default (voice/style-guide.md section 5, rule 2); no em dash>
description: <SEO meta description, ~155 chars; full sentence; no em dash>
summary: <Optional one-paragraph summary shown above the article body; no em dash>
date: <YYYY-MM-DD>                  # publication date; ISO format
posted: <YYYY-MM-DD>                # optional; separate from date if backdating
author: "Spaarke Team"              # the string the site prints; "Spaarke Team" for the organizational byline (see voice/bylines.md section 2)
tags:
  organization: []                  # e.g., spaarke, microsoft
  function: []                      # e.g., legal-operations, in-house, law-firm
  topic: []                         # e.g., spend-management, ocg, ai-readiness
  theme: []                         # e.g., loi, microsoft-native, system-of-record
heroImage: /images/blog/<slug>.jpg
heroImagePosition: center           # optional; CSS object-position
draft: true                         # set false when polished and ready
keyTakeaways:                       # optional bullet list shown at top of article; no em dash
  - <takeaway>
order: <number>                     # optional; lower numbers appear first on homepage
featured: false                     # optional; surfaces in /why-spaarke carousel
featuredOrder: <1|2|3>              # optional; only when featured: true
---

# Topic
<What this article is about. One or two sentences.>

# Angle / Point of view
<The frame: how Spaarke approaches the topic. What is the one
specific argument the reader should be able to repeat? For a
long-form article, write the thesis as the single sentence that
will appear in the opening. Two to four sentences.>

# Prime mover
<The one force driving the others, named in the thesis sentence, with
every other force in the piece grammatically subordinate to it. If the
idea lists drivers, rank them here. A numbered list of coequal drivers
is not an outline. See voice/stance.md rule 3.>

# The concession
<The fault in the reader's own function that this argument depends on,
written as a direct predicate with that function as the subject ("legal
can become an impediment to the business"). The draft states it early,
in the reader's own terms, and pairs it with the remedy. If the argument
works without a concession, write "none" and say why. See
voice/stance.md rule 4.>

# What we assert from practice
<Claims the writer holds from practice that carry no citation, quoted in
the writer's own words. These are permitted under style-guide.md section
5, rule 12, and they are the only unsourced claims the draft may make.
Anything not recorded here still needs a source.>

# Where the reader starts
<The first moves the reader makes after reading, as imperatives. The
close carries them, after the sentence that discharges the title.>

# Why now
<Why this article makes sense to publish in this window. A market
trigger, a calendar moment, a debate to weigh in on, or a gap in our
existing library.>

# Must include
- <Sub-claim or section the argument needs.>
- <Named evidence: a number, a framework, or a concrete scenario.>
- <For a long-form article: the exhibits that the findings need.>
- <Cross-link the draft must include (related blog post, /platform
  page, or /why-spaarke page).>

# Must NOT include
- <Topics that should be covered in a separate piece.>
- <Em dashes, and the constructions listed in
  voice/examples/ai-tells.md.>
- <Items from voice/examples/avoid-this.md.>
- <Marketing closes such as `schedule a demo` and `transform your ...`.>

# References
- <Internal article(s) to link.>
- <External source(s) to cite. Every named number needs one, with its
  year and its sample.>
- <Companion white paper or LinkedIn syndication, if any.>

# Voice notes
<Any deviation from the calibration in content-types/blog-post.md.
For example: a first-person practitioner register if the byline is a
named person; the related-reading links; whether the piece carries
the closing contact line (voice/bylines.md section 6); image
direction. Often empty.>

# Hero graphic

**Prompt** (paste-ready for Midjourney, DALL-E, or Firefly; see
`voice/visual-identity.md`):

<Full prompt assembled per visual-identity.md §7. Style prefix,
abstract subject, composition, negative list. Roughly 80 to 140 words.>

**Style preset**: <e.g., "minimalist geometric, deep-navy + electric-blue accent, 2.5D">

**Aspect ratio**: 16:9 (the default, which matches `ArticleHeader.tsx`).
Override only when the brief specifies a different surface.

**Alt text**: <One sentence that describes the image for screen readers. Write a real description; the words "hero image" are not alt text.>

**Generator notes**: <Which tool (Midjourney v6.1+ by default), any
flags (e.g., `--style raw --ar 16:9 --stylize 50`), any iteration
notes for the team.>
