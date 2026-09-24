# Current task: the Legal Operations Intelligence series

*Updated 2026-09-23. Delete or rewrite this file when the work closes.*

Read this before picking the work up. The routing doc is
[`CLAUDE.md`](CLAUDE.md); this file records where things stand.

---

## The series is published

All five articles are live on production, dated June through September so
the series reads as one that has been building rather than five pieces
arriving at once.

| # | Title | Slug | Date |
|---|---|---|---|
| 1 | The New Mandate for Legal Operations | `managing-legal-operations` | 2026-06-16 |
| 2 | How to Build the Legal Operations Intelligence Platform | `building-the-legal-operations-intelligence-platform` | 2026-07-14 |
| 3 | The Legal Operations Intelligence Ontology | `legal-operations-ontology` | 2026-07-21 |
| 4 | From Spend Analytics to Legal Operations Intelligence | `from-spend-analytics-to-legal-operations-intelligence` | 2026-09-01 |
| 5 | Knowledge Management: The Context Behind Legal Operations Intelligence | `knowledge-management-legal-operations-intelligence` | 2026-09-15 |

Articles 4 and 5 were retitled and reslugged during review. Every reference
across the repo, the GitHub issues and the campaign was renamed with them.

Each carries a hero, its exhibits, a Sources block and full inline
attribution. Sixty-five sources, fifty-one linked, every URL checked.

## What is open

**The two LinkedIn posts for the ontology article.** Briefs are written and
carry no TBD markers. Neither has been through `content-pipeline`, so
neither has a plan, a task list or an issue yet, and neither is drafted.

- `articles/legal-operations-ontology-syndication`, company page,
  2026-09-23. Leads on the asymmetry between the model layer and the
  definitions layer.
- `articles/legal-operations-ontology-founder`, first person, 2026-09-24.
  Same case from the other end: nobody decided what a matter is. The writer
  has no referenceable engagement, so the brief says to state the mechanism
  generically.

Next step for both: `/content-pipeline <slug>`, then draft, then the writer
reviews. `content-pipeline` produces the workspace and the issue; it does
not write the post.

**The October slot** is the standalone `state-of-legal-operations-fall-2026`,
which is still at the idea stage with no brief.

**PR #83**, the hero colour variation, may still be open. It is separate
from the published series on purpose.

## What the writer ruled, and where it is recorded

- Long-form summaries may exceed the 150 to 280 character spec, because the
  summary is the on-page block and the length is doing work there.
  `content-types/blog-post.md`. The `description` field, not `summary`,
  supplies the meta description and the social preview.
- Bold lead-in lists are permitted and reviewed at use. No fixed ceiling.
- "Critically important" is permitted when appropriate.
- Sources with no reachable public URL are listed without a link rather than
  omitted, so the list matches what the prose cites.
- One accent per hero across a series, tinting the halo and the canvas
  centre. `voice/visual-identity.md`.

## The method that produced all of this

The writer rewrote every article by hand and returned it. Diffing each
rewrite against the draft it replaced isolates the voice almost exactly,
because the brief, the evidence and the argument are held constant. That is
what produced the corrections to `voice/`, not impressions.

Four things learned the hard way, which will apply to the next series:

1. **Fix the guide, not the article.** Where the writer's text and a rule
   disagree, the rule is what failed. A rule taken from one article is a
   hypothesis until a second article agrees with it. The close-imperative
   check needed widening on all five.
2. **A permission in one file is not a permission.** `ai-tells.md` and
   `avoid-this.md` load again as the removal sweep, so a relaxation that
   lands only in `style-guide.md` gets stripped on the next pass. Verification
   caught this; review did not.
3. **Run the decisive test after any guide change.** Read the approved
   article and ask what the revised guides would still flag. It found 26
   collisions after the first pass and 16 after the second.
4. **Look at every image, and at the size it renders.** Every round of image
   work found a defect the markup did not show, and the heroes looked varied
   at full size while the thumbnails were a single dark block.

## Checks before any gate is called done

`npm run voice:lint -- <file>` at zero errors. No source dated on or after
the display date. In-body links only to pieces with earlier display dates,
every one resolving. `node scripts/rasterize-assets.mjs` and actually look
at the output. Quotes verified verbatim against the source.

## Known issues not yet fixed

- **Azure staging environments are full**, so PR previews cannot deploy. Ten
  environments from PRs merged March to May 2026 were never torn down. The
  production deploy from `main` is unaffected. PowerShell, not bash:
  ```powershell
  foreach ($e in 1,13,16,17,18,19,20,21,37,43) {
    az staticwebapp environment delete --name swa-spaarke-website `
      --resource-group rg-spaarke-website --environment-name $e --yes
  }
  ```
  Worth finding why the teardown job does not fire on PR close.
- **Two links answer 403 to a headless request and 200 to a browser**, LawVu
  and Wiley. They are kept and want a click-test.
- **Three single-occurrence voice findings** the writer has not ruled on: a
  cleft sentence in article 2, "the General Counsel's office" capitalised in
  article 5, and an oversized section in article 4 that he has said to keep.
