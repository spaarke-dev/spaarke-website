#!/usr/bin/env bash
# One-shot: create GitHub Issues for every upcoming pipeline piece in
# content-platform/calendar.md, add each to Project "Content pipeline",
# set Pipeline status + Publish date custom fields, assign to milestone.
#
# Idempotent? No — re-running creates duplicate issues. Run once.
#
# Run:  bash scripts/create-pipeline-issues.sh

set -euo pipefail

REPO="spaarke-dev/spaarke-website"
PROJECT_ID="PVT_kwHODW0Pv84BXNgi"
STATUS_FIELD_ID="PVTSSF_lAHODW0Pv84BXNgizhSb9M8"
DATE_FIELD_ID="PVTF_lAHODW0Pv84BXNgizhSb9NA"

# Status option IDs
S_IDEA="2cbf3c80"
S_BRIEF="26f291d2"

# Pieces: type|slug|publish_date|status|persona|milestone|notes
# (one row per Issue to create)
read -r -d '' PIECES <<'EOF' || true
linkedin-post|legal-ops-after-the-ai-hype-cycle|2026-05-20|brief|corporate-counsel|2026-05 Spaarke Launch|Practical observations on the shift from experimentation to operationalization
blog-post|ai-is-moving-from-tools-to-operating-models|2026-05-26|brief|corporate-counsel|2026-05 Spaarke Launch|Why legal AI is evolving beyond drafting assistants into operational orchestration
linkedin-post|what-legal-departments-actually-need-from-ai|2026-05-27|brief|corporate-counsel|2026-05 Spaarke Launch|Legal buyers want operational reliability more than flashy demos
linkedin-post|spaarke-launch-org|2026-05-11|brief|corporate-counsel|2026-05 Spaarke Launch|Spaarke company-page launch post for May 11 — needs writing
blog-post|why-human-in-the-loop-is-a-competitive-advantage|2026-06-02|brief|corporate-counsel|2026-06 Architecture and Trust|Legal organizations will trust AI systems that preserve professional judgment
blog-post|the-problem-with-fragmented-legal-tech|2026-06-09|brief|legal-operations|2026-06 Architecture and Trust|Operational fragmentation is now a larger constraint than lack of legal expertise
white-paper|billing-compliance-intelligence|2026-06-16|brief|legal-operations|2026-06 Architecture and Trust|AI-directed billing review and enforcement; practitioner byline
blog-post|why-microsoft-is-becoming-the-operating-layer-for-legal|2026-06-23|brief|corporate-it|2026-06 Architecture and Trust|Strategic importance of Microsoft-native legal infrastructure
blog-post|document-management-is-becoming-document-intelligence|2026-06-30|brief|corporate-it|2026-06 Architecture and Trust|Static repositories evolving into intelligent operational systems; architecture byline
blog-post|operational-intelligence-vs-productivity-ai|2026-07-07|brief|corporate-counsel|2026-07 AI Across the Lifecycle|Why workflow intelligence matters more than isolated drafting tools
blog-post|embedded-ai-vs-bolted-on-ai|2026-07-14|brief|corporate-it|2026-07 AI Across the Lifecycle|Why AI systems must be integrated directly into workflows and documents; architecture byline
blog-post|ai-across-the-engagement|2026-07-28|idea|corporate-counsel|2026-07 AI Across the Lifecycle|Engagement-boundary AI; promote from Q3 idea bucket if brief lands in time
white-paper|the-rise-of-ai-directed-legal-workflows|2026-09-08|brief|legal-operations|2026-08 Operating Model and Spend|Operational architecture for agentic legal systems
blog-post|e-invoicing-and-vida-what-corporate-legal-needs-to-know|2026-09-15|idea|corporate-counsel|2026-08 Operating Model and Spend|EU ViDA + e-invoicing landscape — operational implications for in-house legal
EOF

while IFS='|' read -r type slug publish_date status persona milestone notes; do
  [[ -z "$type" ]] && continue

  case "$type" in
    blog-post) prefix="Blog post";;
    linkedin-post) prefix="LinkedIn post";;
    white-paper) prefix="White paper";;
    tweet) prefix="Tweet";;
  esac

  case "$status" in
    idea) status_opt_id="$S_IDEA";;
    brief) status_opt_id="$S_BRIEF";;
  esac

  campaign_slug=$(echo "$milestone" | awk '{ for (i=1;i<=NF;i++) printf "%s%s", tolower($i), (i<NF ? "-" : "\n") }' | sed 's/^/campaign-/')
  campaign_file="content-platform/campaigns/$(echo "$milestone" | sed -E 's/^([0-9]{4}-[0-9]{2}) (.*)$/\1-\2/' | tr '[:upper:] ' '[:lower:]-').md"

  body=$(cat <<BODY
**Slug:** \`$slug\`
**Type:** $type
**Publish date:** $publish_date
**Campaign:** [$milestone](https://github.com/$REPO/blob/main/$campaign_file)

## Notes

$notes

## Where things live

- Brief: \`content-platform/articles/$slug/brief.md\` (when written)
- Plan: \`content-platform/articles/$slug/plan.md\` (when started)
- Tasks: \`content-platform/articles/$slug/tasks.md\` (when started)
- Draft: \`content-platform/articles/$slug/draft.mdx\` (when started)
- Final publish: \`content/blog/$publish_date-$slug.mdx\` *(blog posts only)*

## Workflow

Pipeline status flow: Idea → Brief → Outline → Draft → Review → Scheduled → Published. Update the Project's *Pipeline status* field as the piece progresses.
BODY
)

  echo "Creating: $prefix: $slug"
  issue_url=$(gh issue create --repo "$REPO" \
    --title "$prefix: $slug" \
    --body "$body" \
    --label "type:$type,persona:$persona" \
    --milestone "$milestone" \
    | tail -1)

  echo "  -> $issue_url"

  item_id=$(gh project item-add 3 --owner spaarke-dev --url "$issue_url" --format json --jq '.id')
  echo "  -> project item: $item_id"

  gh project item-edit --project-id "$PROJECT_ID" --id "$item_id" \
    --field-id "$STATUS_FIELD_ID" --single-select-option-id "$status_opt_id" >/dev/null

  if [[ "$status" != "idea" ]]; then
    gh project item-edit --project-id "$PROJECT_ID" --id "$item_id" \
      --field-id "$DATE_FIELD_ID" --date "$publish_date" >/dev/null
  fi

  echo "  -> status=$status, publish_date=$publish_date"
  echo
done <<< "$PIECES"

echo "Done."
