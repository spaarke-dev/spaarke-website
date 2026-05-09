# GitHub Project setup

The marketing program runs on two surfaces:

1. **Repo files** under `content-platform/` — voice constitution,
   campaigns, briefs, drafts, the calendar. These are the durable
   *content* layer; Claude reads them for grounding.
2. **GitHub Project + Issues + Milestones** at the repo level —
   the operational *dashboard*. Status, dates, owners, board
   views, comments, history.

The Project references the repo files; it does not replace them.

## Source-of-truth rule

| Dimension | Canonical home |
|---|---|
| Pipeline status (idea → published) | GitHub Project (*Pipeline status* field) |
| Publish date | GitHub Project (*Publish date* field) |
| Owner / assignee | GitHub Issue (assignee) |
| Campaign membership | GitHub Issue (Milestone) |
| Type / persona | GitHub Issue (labels) |
| Voice rules, brand positioning | `content-platform/voice/*.md` |
| Campaign theme, narrative arc, distribution sequence | `content-platform/campaigns/<slug>.md` |
| Brief content | `content-platform/briefs/<slug>.md` |
| Draft prose | `content-platform/drafts/<type>/<slug>.<ext>` |
| Final article | `content/blog/<slug>.mdx` |

`calendar.md` becomes a *snapshot* — useful for human reading, but
the live state is the Project. Update the calendar opportunistically;
update the Project whenever a piece moves.

## What's in GitHub

### Project

- **Name:** Content pipeline
- **URL:** https://github.com/users/spaarke-dev/projects/3
- **Project ID:** `PVT_kwHODW0Pv84BXNgi`

Custom fields (in addition to defaults):

| Field | Type | ID |
|---|---|---|
| Pipeline status | Single-select (Idea, Brief, Outline, Draft, Review, Scheduled, Published) | `PVTSSF_lAHODW0Pv84BXNgizhSb9M8` |
| Publish date | Date | `PVTF_lAHODW0Pv84BXNgizhSb9NA` |

### Milestones

One per campaign. Issue → Milestone is the campaign assignment.

| # | Title | Due | Campaign file |
|---|---|---|---|
| 1 | 2026-05 Spaarke Launch | 2026-05-31 | `campaigns/2026-05-spaarke-launch.md` |
| 2 | 2026-06 Architecture and Trust | 2026-06-30 | `campaigns/2026-06-architecture-and-trust.md` |
| 3 | 2026-07 AI Across the Lifecycle | 2026-07-31 | `campaigns/2026-07-ai-across-the-lifecycle.md` |
| 4 | 2026-08 Operating Model and Spend | 2026-09-30 | `campaigns/2026-08-operating-model-and-spend.md` |

### Labels

- `type:blog-post`, `type:linkedin-post`, `type:white-paper`, `type:tweet`
- `persona:corporate-counsel`, `persona:corporate-it`,
  `persona:legal-operations`, `persona:law-firm-leadership`

### Issues

One Issue per content piece. Title format:
`<Prefix>: <slug>`, where Prefix is "Blog post", "LinkedIn post",
"White paper", or "Tweet".

Already-published articles (the 16 pre-launch pieces) are *not*
Issues — they're done; their files are the record. If we want
re-promotion tracking later, bulk-create them.

## Adding a new piece

1. Add a row to `content-platform/calendar.md` (cadence record).
2. Create the Issue:

   ```bash
   gh issue create --repo spaarke-dev/spaarke-website \
     --title "Blog post: <slug>" \
     --body "<body — see scripts/create-pipeline-issues.sh for template>" \
     --label "type:blog-post,persona:<persona>" \
     --milestone "<campaign milestone title>"
   ```

3. Add to the Project and set custom fields:

   ```bash
   url="https://github.com/spaarke-dev/spaarke-website/issues/<NN>"
   item_id=$(gh project item-add 3 --owner spaarke-dev --url "$url" --format json --jq '.id')
   gh project item-edit --project-id PVT_kwHODW0Pv84BXNgi \
     --id $item_id \
     --field-id PVTSSF_lAHODW0Pv84BXNgizhSb9M8 \
     --single-select-option-id <status-option-id>
   gh project item-edit --project-id PVT_kwHODW0Pv84BXNgi \
     --id $item_id \
     --field-id PVTF_lAHODW0Pv84BXNgizhSb9NA \
     --date <YYYY-MM-DD>
   ```

Status option IDs: Idea=`2cbf3c80`, Brief=`26f291d2`,
Outline=`696d4878`, Draft=`b1e49f24`, Review=`157c10bf`,
Scheduled=`6f5c76ca`, Published=`be5835d4`.

The bulk-creation script `scripts/create-pipeline-issues.sh` is
the reference template. It's a one-shot — re-running creates
duplicates.

## Updating status as a piece moves

Update on the Project board (web UI, easiest) or via:

```bash
gh project item-edit --project-id PVT_kwHODW0Pv84BXNgi \
  --id <item-id> \
  --field-id PVTSSF_lAHODW0Pv84BXNgizhSb9M8 \
  --single-select-option-id <new-option-id>
```

When a piece publishes, also: close the Issue (`gh issue close <NN>`)
and update `calendar.md` to status=published.
