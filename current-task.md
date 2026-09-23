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
| 1 | `managing-legal-operations` | 2026-06-16 | draft, writer rewrote it | 78 |
| 2 | `building-the-legal-operations-intelligence-platform` | 2026-07-14 | draft | 82 |
| 3 | `legal-operations-ontology` | 2026-07-21 | draft | 79 |
| 4 | `business-intelligence-for-legal-operations` | 2026-09-01 | draft | 80 |
| 5 | `the-newfound-importance-of-knowledge-management` | 2026-09-15 | draft | 81 |

Standalone: `state-of-legal-operations-fall-2026` (2026-10-20) is at the
idea stage and has no brief.

Each workspace at `content-platform/articles/<slug>/` holds `idea.md`,
`brief.md`, `plan.md`, `tasks.md`, `CLAUDE.md`, and `draft.mdx`. The
briefs and plans are approved. Section 6 of each per-piece `CLAUDE.md`
carries the model and guardrail rules for the gates that remain.

---

## The open thread: capturing the writer's voice in the guides

**This is the live piece of work.** The writer rewrote article 1 in Word
and returned it. The rewrite was shorter (4,935 words against 6,691),
restructured (9 sections against 10), and different in voice and
positioning from what the pipeline produced. Both versions are kept for
comparison:

- `scratchpad/voice/before.mdx` is the pipeline draft, also at git
  `e72f68f:content-platform/articles/managing-legal-operations/draft.mdx`
- `scratchpad/voice/after.mdx` is the writer's rewrite, which is now the
  committed `draft.mdx`

The scratchpad is session-local and will be gone. Recover both from git:
the before version from `e72f68f`, the after version from `4b9b95d`.

Two causes were confirmed by hand before any analysis ran:

1. **The guide was wrong.** `voice/style-guide.md` line 115 and rule 26
   retire bold lead-in bullets and forbid them from carrying an
   argument. The writer's rewrite uses ten of them, and they do carry
   the argument. That prohibition was written in this session while
   rebuilding the voice docs after the "sounds like AI" complaint; the
   audit found bold bullets among the tells, and the fix banned the
   pattern rather than its lazy use. **The guide needs correcting, not
   the writer.**
2. **The guide was right and unused.** Line 40 already permits the
   analytical "we", and `examples/consulting-register.md` section 4.11
   puts it at 3.3 uses per 1,000 words in the McKinsey sample. The
   rewrite runs 2.4 per 1,000; the pipeline draft ran 0.15. No model
   passage shows the move the writer actually uses, "In our earlier
   article, [X], we discussed ...", which ties a piece to the published
   library.

A five-dimension analysis was running when the session ended: workflow
`wl3yms1ak`, run id `wf_9fc1414b-8f0`. It compares the two versions on
positioning, register, structure, evidence, and vocabulary, diagnoses
which guide line produced the wrong output, and synthesises file-by-file
edits. **Its result was not seen, so nothing from it has been applied.**
Recover it from the journal at
`.claude/projects/c--code-files-spaarke-website/<session>/subagents/workflows/wf_9fc1414b-8f0/journal.jsonl`,
or re-run the script at
`.claude/projects/.../workflows/scripts/voice-delta-analysis-wf_9fc1414b-8f0.js`.
If neither survives, the analysis is cheap to repeat from the two files.

**The method that matters, whatever the analysis says:**

- A rewrite is a controlled experiment, because the brief, the evidence,
  and the argument are held constant and only the voice moves. Keep both
  versions and diff them.
- Guidance only works inside the load order in the per-piece
  `CLAUDE.md`. A correct rule in an unread file changes nothing.
- Before and after pairs beat abstract rules. `ai-tells.md` works
  because it shows the sentence and its replacement.
- Countable things belong in `scripts/voice-lint.mjs` as statistics, the
  way passive share already is: first-person density, bold-bullet count,
  words per section.
- Run the diff after every rewrite, before the next article drafts.

---

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

- **Apply the voice findings to the guides.** The open thread above.
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
