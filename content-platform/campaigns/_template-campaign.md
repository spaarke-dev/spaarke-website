---
slug: <YYYY-MM-short-name>
name: <Human-readable campaign name>
status: planned                    # planned | scheduled | active | complete | retro
date_range:
  start: <YYYY-MM-DD>              # when amplification begins (often the hero asset's publish date)
  launch: <YYYY-MM-DD>             # the marquee day (hero asset publishes / event happens)
  end: <YYYY-MM-DD>                # when this campaign closes — pieces may continue evergreen after
owner: rs                          # rs | <team-member> | spaarke
theme: <one-line theme statement>
audience: <primary persona id, from voice/audience-personas.md>
---

# <Campaign name>

## Theme

<2–3 sentences. What is this campaign saying, structurally? Not the
tactics — the argument the assets make together. A reader who saw
all the assets in sequence should come away with this.>

## Why now

<1–2 sentences. The market reason this campaign lands now —
seasonal timing, product milestone, conversation in the field,
adjacent industry moment.>

## Narrative arc

The reading order, if a reader followed every asset:

1. **Asset 1** — what it establishes
2. **Asset 2** — what it adds
3. **Asset 3** — what it adds
4. ...

Each asset earns the next. Order matters; the campaign file is the
record of why.

## Assets

| Date | Type | Slug | Status | Channel(s) | Notes |
|---|---|---|---|---|---|
| YYYY-MM-DD | blog-post | <slug> | published | website, linkedin | hero asset |
| YYYY-MM-DD | linkedin-post | <slug> | scheduled | linkedin | syndicates the hero |
| YYYY-MM-DD | linkedin-post | <slug> | planned | linkedin (Ralph) | standalone |

Channel codes:
- `website` — published on /blog or /papers
- `linkedin` — Spaarke company page
- `linkedin (rs)` — Ralph's LinkedIn profile
- `linkedin (<name>)` — named team member's profile
- `x` — X / Twitter
- `email` — newsletter
- `direct` — outreach to specific contacts

## Distribution sequence

Day-by-day or week-by-week, what posts and when. Each row is a
discrete action a human takes.

| Date | Channel | Action |
|---|---|---|
| YYYY-MM-DD | website | Publish hero article |
| YYYY-MM-DD | linkedin (rs) | Post intro/launch announcement |
| YYYY-MM-DD | linkedin | Spaarke company-page launch post |
| YYYY-MM-DD | linkedin (rs) | Syndicate <article slug> |
| ... | ... | ... |

## Success metrics

Tracked at retro. Don't pre-commit to numbers — pre-commit to what
to measure.

- Article reads (analytics)
- LinkedIn impressions / reactions / comments / reposts
- Profile visits / connection requests post-campaign
- Inbound demo requests / contact-form submissions tagged to
  campaign window
- Specific qualitative signals (named accounts engaging, comments
  from target personas, inbound from publications)

## Retro

<Filled in after `complete`. Two paragraphs max.>

**What worked:** <…>

**What didn't:** <…>

**What to do differently next time:** <…>

**Notes for the voice docs:** <pattern-level lessons that should
update `voice/style-guide.md` or `voice/examples/avoid-this.md`.>
