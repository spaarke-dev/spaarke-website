---
slug: <kebab-case-slug>
type: white-paper
publish_date: <YYYY-MM-DD>
channels: [website, linkedin]
status: brief                       # brief | outline | draft | review | scheduled | published
priority: normal                    # high | normal | low
audience: <persona-slug>            # corporate-counsel | legal-ops-director | legal-tech-cio | firm-operations-leader
length_target: 3500                 # words; sweet spot ~3,500 (range 2,500–5,000)
byline: spaarke                     # white papers default to organizational
executive_summary_length: 300       # target words for the executive summary (200–350)
citation_count_minimum: 8           # floor; raise it when the argument leans on data
companion_pieces:                   # blog posts / LinkedIn posts shipping alongside
  - blog: <slug>
  - linkedin: <slug>
sources_in_scope:                   # named sources the brief commits to using
  - <CLOC Core 12, ACC Maturity Model, BTI 2025, Thomson Reuters Institute, etc.>
diagrams_required:                  # named diagrams from the asset library or new
  - <iq-stack | deployment-topology | <new-diagram-slug>>
download_asset: pdf                 # pdf | html-only | both
---

# Topic
<What this paper is about. The thesis in 1–2 sentences.>

# Angle / Point of view
<The frame. How Spaarke approaches the topic and what we are arguing
for that the market is not already saying. 3–5 sentences.>

# Why now
<What changed in the market or the practice that makes this paper
worth shipping in this quarter. Cite the trigger if there is one.>

# Must include
- <Sub-claim that supports the thesis>
- <Sub-claim that supports the thesis>
- <Named evidence — number, framework, or scenario>
- <Diagram or callout the argument relies on>

# Must NOT include
- <Sales close, demo CTA, or anything that breaks research-mode>
- <Items from voice/examples/avoid-this.md>
- <Slogan recitation, padding, citation theatre>

# References
- <Internal article(s) to link or extend>
- <External source(s) to cite — with rough access notes>
- <Companion pieces that reference this paper>

# Voice notes
<Any deviation from the white-paper calibration in
content-types/white-paper.md — usually empty. White papers default to
organizational byline, formal cadence, footnoted sources.>

# Hero graphic

For white papers the "hero" usually doubles as the cover image on
the PDF and the lead image on the HTML page. See
`voice/visual-identity.md` for style.

**Prompt** (paste-ready for Midjourney/DALL-E/Firefly):

<Full prompt assembled per visual-identity.md §7. Style prefix,
abstract subject, composition, negative list. White paper covers
trend slightly more typographic / structural than blog heroes —
isometric architecture, layered diagrams-as-mark.>

**Style preset**: <e.g., "minimalist geometric, deep-navy + copper accent, isometric, paper-grain texture">

**Aspect ratio**: 16:9 for the HTML hero. Cover-page rendering on
the PDF uses the same image scaled to fit; design composes the
title and subtitle in white type over the lower band — leave the
lower-third negative space for typography.

**Alt text**: <One sentence describing the image for screen readers.>

**Generator notes**: <Which tool, any flags. White-paper covers
warrant 8–12 candidates and a deliberate pick — they live longer
than blog heroes.>
