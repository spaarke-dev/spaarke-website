# Article authoring guide

This folder holds **templates and authoring guidance** for articles published
under `/why-spaarke/<slug>` on the Spaarke website. Articles are MDX files
in `content/blog/`. There is no admin UI — all writing happens by editing
files in this repo.

---

## Workflow at a glance

```
1.  Copy templates/article-template.mdx
        →  content/blog/YYYY-MM-DD-slug.mdx
2.  Drop raw images into  resources/articles/<topic-or-slug>/
3.  Ask Claude to write the article (see prompts below)
        →  Claude fills in frontmatter + body, copies the right images
           into public/articles/<slug>/, references them in the MDX
4.  Review locally:    npm run dev   →   http://localhost:3000/why-spaarke/<slug>
5.  Commit + push to main   →   Azure SWA auto-deploys the live site
```

---

## File layout

| Path | Purpose |
|---|---|
| `content/blog/<YYYY-MM-DD>-<slug>.mdx` | Article source. The date prefix is dropped from the URL — `2026-05-15-the-iq-stack.mdx` becomes `/why-spaarke/the-iq-stack`. |
| `templates/article-template.mdx` | Starting-point template. Has every frontmatter field commented + body scaffolding. |
| `templates/README.md` | This file. |
| `resources/articles/` | **Raw, unshipped image library — local only, gitignored.** Source images at full resolution. Not served by the site, not committed to the repo (would inflate deploy artifacts). |
| `public/articles/<slug>/` | **Published images** for a specific article. Served at `/articles/<slug>/...`. Claude (or you) copy from `resources/articles/` to here when writing the post. |

---

## Frontmatter fields

The full reference is documented inline in
[`article-template.mdx`](./article-template.mdx). Quick summary:

| Field | Required? | Notes |
|---|---|---|
| `title` | Yes | Used as `<h1>`, `<title>`, and social card title |
| `description` | Yes | 1–2 sentence SEO meta (~150–160 chars) |
| `summary` | Optional | Falls back into the "Key Takeaways" block if `keyTakeaways` is absent |
| `keyTakeaways` | **Recommended** | 3–5 bullet points — the busy reader's tl;dr at the top of the article |
| `date` | Yes | ISO date the article was written; drives sort order (newest first) |
| `posted` | Optional | Separate publication date if you want a delay |
| `author` | Yes | Byline ("Spaarke Team" by default) |
| `heroImage` | Optional | Path under `public/`. Used as banner + card thumbnail + social preview |
| `tags` | Yes | Structured: `organization`, `function`, `topic`, `theme` arrays. Powers library filters |
| `featured` + `featuredOrder` | Optional | Marks the post as one of the 3 carousel slides on `/why-spaarke` |
| `order` | Optional | Manual override for sort order |
| `draft` | Yes | `true` keeps the post out of the library, sitemap, and RSS |

---

## Images — full specifications

### Hero image (one per article)

The hero is used in **three places**, so a single 16:9 source image works for all:

| Where | Crop | Display size |
|---|---|---|
| Article page banner | 21:9 (top centered) | 720×~310 |
| Post card thumbnail | 1:1 (centered) | 96–112px |
| Social preview (Twitter / LinkedIn / etc.) | 1.91:1 (centered) | 1200×630 |

**Specs:**
- Source resolution: **1600×900** (or wider — at least 1200×675)
- Format: **JPG ~75% quality**, **PNG** for screenshots/diagrams, **WebP** if you want max compression
- File size: **< 250 KB** (smaller is better; Next.js will further optimize at request time)
- File name: descriptive, kebab-case — e.g., `legal-ops-dashboard.jpg` not `IMG_1234.jpg`

### Inline images (figures inside the article body)

| Type | Format | Notes |
|---|---|---|
| Diagrams / illustrations | **SVG** | Scales perfectly, tiny file size |
| UI screenshots | **PNG** | Sharp edges; export at 2× display resolution |
| Photos / lifestyle | **JPG** at ~80% quality | Same compression rules as hero |
| Charts | **SVG** preferred | Falls back to PNG at 2× |

Reference inside MDX:

```markdown
![Bar chart of legal spend by department, FY2025](/articles/the-iq-stack/spend-by-dept.svg)
```

Alt text rules:
- **Decorative** image → `alt=""` (screen reader skips it)
- **Informational** image → describe the *information*, not the visual ("Bar chart showing legal spend rose 18% YoY", not "a bar chart")

---

## How to build an image library

Maintain raw, unshipped images in **`resources/articles/`** at the repo root.
This folder is not served by the site — it's a staging area for assets you
*might* use in articles.

Two organizational patterns work well; pick whichever you prefer:

**By topic** (recommended if you build a library before knowing exact articles):
```
resources/articles/
├── legal-ops/
│   ├── dashboard-screenshot.png
│   ├── spend-trends-chart.svg
│   └── kpi-grid.png
├── ai-strategy/
│   ├── llm-architecture-diagram.svg
│   └── prompt-flow.png
└── microsoft/
    └── azure-foundry-diagram.svg
```

**By article slug** (recommended once you've outlined a specific post):
```
resources/articles/
├── the-iq-stack/
│   ├── hero-source.jpg
│   ├── data-layer-diagram.svg
│   └── memory-layer-diagram.svg
└── breaking-the-silo/
    └── hero-source.jpg
```

Either works. You can mix them. The key constraint: **`resources/articles/`
is your private staging library; `public/articles/<slug>/` is what gets
shipped with the site.**

---

## How to point Claude at images

When you want to write or revise an article, include the image source in
the prompt. Claude has filesystem access for this repo and can read images
to understand them, then copy them into the published folder.

Three patterns, increasing in specificity:

### 1. "Use whatever fits" — Claude picks from your library

> "Write a new article on the IQ Stack framework. There are images in
> `resources/articles/legal-ops/` you can use — pick whichever fit.
> Save the post as `content/blog/2026-05-20-iq-stack-explained.mdx`."

Claude will look at the images in that folder, describe them mentally,
and decide which (if any) to use as hero / inline figures, then copy
them into `public/articles/iq-stack-explained/` and reference them in
the MDX.

### 2. "Use these specific images"

> "Write the article on the IQ Stack. Use these images:
>
> - `resources/articles/legal-ops/iq-stack-diagram.svg` as the hero
> - `resources/articles/legal-ops/data-layer.svg` for the Data section
> - `resources/articles/legal-ops/memory-layer.svg` for the Memory section
>
> Save as `content/blog/2026-05-20-iq-stack-explained.mdx`."

Most predictable approach. Claude will not make assumptions about which
images go where.

### 3. "Drop these into chat" (when no library exists yet)

You can attach images directly to a Claude conversation. Claude can see
them but cannot save them to the repo from a chat attachment alone — it
will tell you the filename to give them, then you save them into
`resources/articles/<folder>/` yourself, and *then* Claude can reference
them by path.

For sustained article production, **option 1 or 2 is much faster.**

---

## Suggested Claude prompts

Copy/paste-friendly prompts for common tasks:

### New article from scratch

> Write a new article for `/why-spaarke` on the topic of `<TOPIC>`.
> Use [`templates/article-template.mdx`](./article-template.mdx) as the
> structure. Save it at `content/blog/<YYYY-MM-DD>-<slug>.mdx`. The
> intended audience is `<corporate-legal | law-firm | mixed>`.
> For images, use whatever fits from `resources/articles/<folder>/` —
> copy the chosen ones into `public/articles/<slug>/` and reference them
> by their public path.

### Revise an existing article

> Revise `content/blog/<filename>.mdx`. Specifically: `<what to change>`.
> Don't change the slug, date, or hero image unless I ask. Keep the
> Key Takeaways down to ~4 bullets.

### Add Key Takeaways to a post that doesn't have them

> Add `keyTakeaways` to `content/blog/<filename>.mdx`. 3–5 bullets,
> each a single concrete sentence. The first bullet should be the
> headline thesis; the last should be what the reader should DO.

### Replace a hero image

> Replace the hero image on `content/blog/<filename>.mdx` with
> `resources/articles/<folder>/<image>`. Copy the file into
> `public/articles/<slug>/` and update the `heroImage` frontmatter.

---

## Publishing

1. Make sure `draft: false` (or remove the field) in the frontmatter
2. Run `npm run dev` and check the article at `/why-spaarke/<slug>`
3. Verify the hero image looks right + key takeaways render as bullets
4. Commit:
   ```
   git add content/blog/<filename>.mdx public/articles/<slug>/
   git commit -m "feat(content): publish '<title>'"
   git push origin main
   ```
5. Azure SWA picks up the push, builds, and deploys automatically
   (~3–5 min). Visit https://www.spaarke.com/why-spaarke to confirm

That's it. No CMS, no separate build step for content, no database. The
article goes live the moment the deploy finishes.
