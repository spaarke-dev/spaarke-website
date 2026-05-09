---
slug: <kebab-case-slug>
type: tweet
publish_date: <YYYY-MM-DD>
channels: [x]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: normal                    # high | normal | low
audience: <persona-slug>            # legal-ops-director | legal-tech-cio | corporate-counsel | firm-operations-leader
length_target: 280                  # characters per tweet (hard cap); draft to ~270
byline: spaarke                     # usually organizational; named accounts handle their own
format: thread                      # single | thread
tweet_count: 5                      # 1 for single; 3–8 typical for threads
link_target: <url-or-slug>          # only when there's a link in the last tweet; X penalizes early-tweet links
companion_piece:                    # if this thread adapts a longer piece
  blog: <slug>
---

# Topic
<What this tweet or thread is about. 1–2 sentences.>

# Angle / Point of view
<The single claim the tweet (or the thread end-to-end) lands. On X,
sharper and shorter than LinkedIn. One idea. 1–2 sentences.>

# Why now
<Why this ships this week. A market moment, a thread worth joining, or
distribution of a just-published long-form piece.>

# Must include
- <The hook — tweet 1 is the whole pitch>
- <The defended number, named role, or concrete scenario>
- <For threads: tweet count and rough character budget per tweet>
- <Link target placement — last tweet only>

# Must NOT include
- <Links in early thread tweets — algorithm penalty>
- <Hashtag stuffing; one hashtag max, often zero>
- <Items from voice/examples/avoid-this.md>
- <"DM me", "comment INFO", or any low-rent CTA>

# References
- <Companion blog post / white paper / LinkedIn post this adapts>
- <External source(s) for any cited number>

# Voice notes
<Any deviation from the tweet calibration in content-types/tweet.md.
Sentence fragments OK; em-dashes work hard; end-of-tweet periods
optional. Still in voice — no "transform," no "AI-powered," no
exclamation points except for genuine surprise.>

# Hero graphic

A tweet itself usually has no image — the words carry the hook. Use
an image only when one specific tweet (often the hook tweet, or a
single-tweet positioning post) genuinely benefits from one. When in
doubt, no image. See `voice/visual-identity.md` if you do.

**Prompt** (paste-ready; leave blank if no image):

<Full prompt per visual-identity.md §7, or leave empty.>

**Style preset**: <e.g., "minimalist geometric, deep-navy + electric-blue", or n/a>

**Aspect ratio**: 16:9 for X (matches the in-feed preview crop).

**Alt text**: <One sentence for screen readers, or n/a.>

**Generator notes**: <Tool, flags, or n/a.>

# Thread sketch (only when format: thread)
<List tweets 1..n with a rough character count beside each. Each
tweet must work alone *and* earn the next one.>

1. <Hook — the whole pitch.> (~<chars>)
2. <Mechanism / context.> (~<chars>)
3. <Stakes — cost, scale, or named example.> (~<chars>)
4. <Resolution — what changes.> (~<chars>)
5. <CTA + link, last tweet only.> (~<chars>)
