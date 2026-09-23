# Current task: the Legal Operations Intelligence series

*Updated 2026-09-22. Delete or rewrite this file when the work closes.*

Read this before picking up the series. The routing doc is
[`CLAUDE.md`](CLAUDE.md); this file records where the work stands and what
it is waiting on.

---

## What this is

A five-article long-form series plus a standalone companion, written for
legal operations directors. Branch `content/legal-operations-ontology`,
open as [PR #77](https://github.com/spaarke-dev/spaarke-website/pull/77).

| # | Slug | Display date | Gate | Issue |
|---|---|---|---|---|
| 1 | `managing-legal-operations` | 2026-06-16 | writer's redraft adopted | 78 |
| 2 | `building-the-legal-operations-intelligence-platform` | 2026-07-14 | writer's redraft adopted | 82 |
| 3 | `legal-operations-ontology` | 2026-07-21 | writer's redraft adopted | 79 |
| 4 | `from-spend-analytics-to-legal-operations-intelligence` | 2026-09-01 | writer's redraft adopted | 80 |
| 5 | `knowledge-management-legal-operations-intelligence` | 2026-09-15 | writer's redraft adopted | 81 |

Standalone: `state-of-legal-operations-fall-2026` (2026-10-20) is at the
idea stage and has no brief.

Each workspace at `content-platform/articles/<slug>/` holds `idea.md`,
`brief.md`, `plan.md`, `tasks.md`, `CLAUDE.md`, and `draft.mdx`. The
briefs and plans are approved. Section 6 of each per-piece `CLAUDE.md`
carries the model and guardrail rules for the gates that remain.

---

## The voice thread, closed on 2026-09-23

The writer rewrote article 1 in Word and returned it. A five-dimension
analysis diffed it against the pipeline draft, and the findings are now
applied across the voice constitution in commits `d7bd01a`, `d5e156b`,
`e18cbd1` and `46d842c`.

The diagnosis. The pipeline draft satisfied all 27 prohibitions in
`style-guide.md`, returned 0 errors and 0 warnings, and was
statistically indistinguishable from the rewrite on every measure the
linter printed. It still had no speaker in it. The guides define the
voice almost entirely by subtraction, so they can certify a draft
written by nobody, to nobody, about a field.

Six rules actively forbade what the writer publishes and are now
narrowed to the fault rather than reversed: rule 11 (the bibliographic
"we", which he uses five times), rule 26 and the bold lead-in entry (18
instances against the pipeline's 1), rule 24 (intensifiers), rule 25
(the synthesis paragraph opening his close), and rules 14 and 18. Two
new files ship: `voice/stance.md` for posture and
`voice/examples/house-exemplar.md`, which names his article as the model
and annotates the eight traits with real before-and-after pairs.

The method, which is what matters for the next rewrite:

- A rewrite is a controlled experiment. The brief, the evidence and the
  argument are held constant and only the voice moves. Keep both
  versions and diff them.
- Guidance only works inside the load order. A correct rule in an unread
  file changes nothing.
- A permission granted in one file and not the others is not a
  permission. `ai-tells.md` and `avoid-this.md` load again as the
  removal sweep, so a relaxation that lands only in the style guide gets
  stripped on the next pass. That failure was found by verification, not
  by review.
- Run the decisive test after any guide change: read the approved
  article and ask what the revised guides would still flag. It found 26
  collisions after the first pass and 16 after the second.
- "Where the rewrite and the guide disagree, the guide is wrong" is a
  heuristic, not a rule. Applying it to every hit would undo the
  September 2026 correction. Fix the structural and repeated cases;
  report single occurrences for the writer.

The writer's rulings, 2026-09-23, all applied:

1. "critically important" is permitted when appropriate and reviewed at
   use. It is not a synonym for the words rule 27 still rules out, which
   assert importance with no referent.
2. Bold lead-in lists are permitted and reviewed at use. There is no
   hard ceiling. The linter reports the count as a statistic and no
   longer judges it.
3. The two uses of "we" are now named in plain terms, because the label
   "bibliographic" did not communicate. The **citing "we"** points at our
   own earlier articles ("In our earlier article, [title], we
   discussed"). The **arguing "we"** states a position as ours ("we
   recommend", "in our view"). These are discussion pieces, so the
   second is welcome wherever we give a judgment rather than report a
   finding.
4. Articles 2 to 5 are NOT to be re-read against the corrected guides.
   The writer is reviewing them manually, one article at a time, and
   will return edited versions.

## How to handle each returned article

Each edited version the writer returns is another controlled experiment,
and the highest-value thing to do with it is the same diff that produced
this pass. For each one:

1. Keep both versions. The pipeline draft is in git; the returned
   version replaces `draft.mdx`.
2. Diff them across positioning, register, structure, evidence and
   vocabulary, and ask of each difference which guide line produced the
   wrong output.
3. Apply the fix to `voice/`, not to the article, wherever the guide is
   what failed.
4. Run the decisive test afterwards: read the approved article and ask
   what the revised guides would still flag. A permission that lands
   only in `style-guide.md` is not a permission, because `ai-tells.md`
   and `avoid-this.md` load again as the removal sweep and will strip
   it.
5. Add any new trait to `voice/examples/house-exemplar.md` as a real
   before-and-after pair.

Expect the corrections to get smaller each time. Article 1's pass found
26 collisions between the guides and the approved text; if article 2's
pass finds a comparable number, the guides did not actually learn.

Still open, and none of it blocking:

- Does the citing "we" extend to LinkedIn posts, white papers and
  tweets? Those type files were out of scope.
- Six single-occurrence collisions in article 1 that may be slips rather
  than guide errors: Mary O'Carroll cited with no institution, "Kevin
  Clem's" repeated where the surname alone is house form, the close
  compressing three of the six signal names, "streamlined", and
  "actually".
- The four new `brief.md` sections are not yet in either skill's
  validation list. Adding them to the blocking validation would fail
  every brief already on disk.

## What is done

- Five drafts, each through draft, three single-lens reviews, and a fix
  pass. `npm run voice:lint` reports 0 errors and 0 warnings on all five.
- A texture pass cut "rather than" across the series from 96 uses to 50,
  keeping the ones that carry an epistemic distinction.
- An active-voice pass brought all five under the 15% passive ceiling.
  The checker caught an editor inventing actors in article 1 that
  reversed the argument; both were reverted.
- Heroes for all five, exhibits for the series (seven SVGs plus one
  table already in article 5), LinkedIn headers for all 23 articles.
- `voice/style-guide.md` section 2 gained the active-voice treatment,
  and the linter reports passive share.
- A YAML bug was fixed: an unquoted keyTakeaway containing ": " parses
  as a map, and two takeaways were silently absent from their pages.
  Every entry in the drafts and briefs is now quoted.

## What is outstanding

- **All five articles have been through the writer's manual review** and their redrafts are adopted. Two were retitled and reslugged in the process, articles 4 and 5.
- **Articles 2 to 5 have not been reviewed by the writer.** Only article
  1 has been through a rewrite. Expect the same voice corrections to
  apply to the other four, which argues for fixing the guides first and
  then re-reading them against the corrected guide.
- **Polish gate** for all five: `description` and `summary` lengths are
  within spec for article 1 only; articles 2 to 5 have summaries of 299
  to 458 characters against a 150 to 280 target, and takeaways running
  to 62 words against an 18 to 35 target. The writer's call on whether
  to bring them to spec or relax the spec for long-form.
- **Word counts are uneven.** Article 1 is now 4,935 words; article 5 is
  9,019. Worth a decision.
- **`posted:` dates** stay as the TBD marker until the Q4 push start is
  set. Each article publishes in push week N, on a Tuesday, per the
  campaign file's distribution sequence.
- **The standalone State piece** has no brief.
- **Azure staging environments are full**, so the PR preview cannot
  build. Ten environments from PRs merged in March to May 2026 were
  never torn down. The fix needs the writer to run it, because deleting
  cloud resources is blocked here:
  ```
  for e in 1 13 16 17 18 19 20 21 37 43; do
    az staticwebapp environment delete --name swa-spaarke-website \
      --resource-group rg-spaarke-website --environment-name $e --yes
  done
  ```
  Worth also finding why the teardown job does not fire on PR close.

---

## How to work on it

**Reading the articles rendered.** `npm run dev`, then
`http://localhost:3000/why-spaarke/<slug>`. The five drafts have to be
staged into `content/blog/` first, as
`content/blog/<display-date>-<slug>.mdx`, with `draft: true` kept. Those
staged copies are untracked on purpose and are not committed: they are
local reading only. Note that `getPostBySlug` does not filter drafts and
`dynamicParams` is unset, so a draft in `content/blog/` on a deployed
site is reachable by direct URL. That is why the series is not published
for review.

**Reviewing the prose.** `node scripts/export-drafts-to-docx.mjs` writes
one `.docx` per article into `review/`, with the hero and exhibits
embedded. `review/` is git ignored. Word is good for comments and track
changes; markdown is better for a heavy rewrite, because it diffs. The
writer asked about markdown and it has not been added to the exporter
yet.

**Images.** `node scripts/generate-series-exhibits.mjs` builds the
exhibits; the heroes were generated from a scratchpad script that will
not survive, so the SVGs in `public/articles/<slug>/hero.svg` are the
source of truth for them. Always rasterise and look at an image before
calling it done: every round of image work so far has found a defect
that the markup did not show.

**Checks before any gate is called done.** `npm run voice:lint -- <file>`
at 0 errors; no source dated on or after the display date; in-body links
only to series pieces with earlier display dates; every cross-link
resolves; each brief's Spaarke mention limit respected.

**Nothing publishes without the writer.** The ship gate is theirs.
