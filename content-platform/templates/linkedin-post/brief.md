---
slug: <kebab-case-slug>
type: linkedin-post
publish_date: <YYYY-MM-DD>
channels: [linkedin]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: normal                    # high | normal | low
audience: <persona-slug>            # corporate-counsel | legal-ops-director | legal-tech-cio | firm-operations-leader
length_target: 280                  # words for standalone (150 to 400); ignore for carousel
byline: <person-slug>               # named team member preferred; 'spaarke' for company posts
hook: |                             # the literal first 1 to 2 lines as drafted; mobile preview cuts at line 3
  <First line: specific, a claim or a question, no em dashes, no AI tells.>
  <Second line: earns the click on "see more".>
format: standalone                  # standalone | carousel | syndication
hashtags:                           # 2 to 3 max; bottom of post on their own line
  - <LegalOps>
  - <InHouseCounsel>
syndication_target:                 # only when format: syndication
  blog: <slug>
carousel_slides:                    # only when format: carousel; 5 to 10 slides total
  - cover: <hook line, treated as the thumbnail>
  - body: <slide 2 idea in 1 to 3 sentences>
  - body: <slide 3 idea>
  - body: <slide 4 idea>
  - body: <slide 5 idea>
  - cta: <last slide, with a pointer or an open question>
---

# Topic
<What this post is about. 1 to 2 sentences.>

# Angle / Point of view
<The frame. What is the one sharp observation the post lands? On
LinkedIn, the angle is usually a practitioner's lived take, not a
company position. 2 to 3 sentences.>

# Why now
<Why this post makes sense in this week. A conversation worth joining,
a number that just landed, an industry moment, or syndication of a
just-shipped long-form piece.>

# Must include
- <The hook line, sharpened>
- <The concrete observation or named scenario>
- <Defended numbers if any are used>
- <Link target if format is syndication>

# Must NOT include
- <Sales close, "schedule a demo", company-pitch energy>
- <Em dashes, and items from voice/examples/ai-tells.md>
- <Items from voice/examples/avoid-this.md>
- <Hashtag stuffing, emoji, exclamation points>
- <Organizational voice when the byline is named>

# References
- <Companion blog post / white paper this previews or extends>
- <External source(s); even one number needs a cited source>

# Voice notes
<Any deviation from the LinkedIn calibration in
content-types/linkedin-post.md. Named bylines sustain first-person
throughout. Looser cadence than blog. No formatting tricks.>

# Hero graphic

A standalone post may carry one optional image. A carousel has 5 to
10 images, and the cover slide is the strongest hook (the thumbnail).
A syndication uses the source piece's hero, and
`voice/visual-identity.md` sets the style in every case.

**Prompt** (paste-ready for Midjourney/DALL-E/Firefly):

<Full prompt per visual-identity.md §7. Carousel covers in
particular need to read at thumbnail size, so push the focal element
larger and the negative space tighter than a blog hero.>

**Style preset**: <e.g., "minimalist geometric, deep-navy + electric-blue, 2.5D">

**Aspect ratio**: 1:1 or 4:5 portrait for LinkedIn standalone /
carousel cover (LinkedIn favors square/portrait in feed). 16:9 only
when syndicating an article hero.

**Alt text**: <One sentence per image for screen readers.>

**Generator notes**: <Tool, flags. For carousels, lock the style
prefix across all slides so they read as one set.>
