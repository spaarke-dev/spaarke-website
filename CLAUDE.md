# Spaarke website — session start

This is the root routing doc. Before doing anything, identify what
kind of work the session is about and route to the right place.

## Domain dispatcher

| If the work is… | Read first |
|---|---|
| Writing or editing content (blog posts, LinkedIn posts, white papers, tweets, marketing copy) | [`content-platform/CLAUDE.md`](content-platform/CLAUDE.md) |
| Site features, components, build config, infrastructure | (no per-domain CLAUDE.md yet — read this file's §Site work below) |
| Bug fixes or maintenance | (read this file's §Site work below) |
| Marketing operations (campaigns, calendar, GitHub Project) | [`content-platform/CLAUDE.md`](content-platform/CLAUDE.md) + [`content-platform/github-setup.md`](content-platform/github-setup.md) |

When the user's request is ambiguous, ask which domain before
loading anything else. Loading the wrong domain wastes the context
window and produces grounded-in-the-wrong-thing output.

## Skills

The `.claude/skills/` directory holds skills that enforce the
gated workflows. Use them — they are not optional.

| Skill | When to use |
|---|---|
| `idea-to-brief` | Writer has dropped an `idea.md` in `content-platform/articles/<slug>/`. Run this skill to produce `brief.md`. |
| `content-pipeline` | A `brief.md` is signed off. Run this skill to produce `plan.md` + `tasks.md` + per-piece `CLAUDE.md`, create the GitHub Issue, add to the Project. |
| `design-to-spec` | (software) Producing `spec.md` from a design idea. |
| `project-pipeline` | (software) Producing plan + tasks from a `spec.md`. |
| `task-execute` | (software) Working through a generated task. |
| `push-to-github` | Push the current branch and open a PR. |

If a skill exists for the work being asked, invoke it. Don't write
a content brief from scratch when `idea-to-brief` is the
codified, voice-aware, taxonomy-aware path.

## Content-platform — quick orientation

Active operating program for everything Spaarke publishes. Lives at
[`content-platform/`](content-platform/). The structure mirrors the
software project pattern — per-piece workspace with idea, brief,
plan, tasks, CLAUDE.md, and draft.

```
content-platform/
├── CLAUDE.md                    ← writing-session router
├── spec.md                      ← architectural spec
├── voice/                       ← the constitution (style, brand, personas, vocab)
├── content-types/               ← per-type calibration (blog-post, linkedin-post, …)
├── articles/                    ← per-piece workspaces
│   ├── _template-blog-post/     ← templates by content type
│   ├── _template-linkedin-post/
│   ├── _template-white-paper/
│   ├── _template-tweet/
│   └── <slug>/                  ← one directory per piece
│       ├── idea.md              ← writer's raw idea
│       ├── brief.md             ← formal brief (the spec)
│       ├── plan.md              ← outline + sections + sources
│       ├── tasks.md             ← workflow gates
│       ├── CLAUDE.md            ← per-piece session contract
│       └── draft.{mdx|md}       ← the working draft
├── campaigns/                   ← multi-asset coordinated pushes
├── calendar.md                  ← cadence record (with GitHub Project cross-ref)
├── github-setup.md              ← GitHub Project + Issues + Milestones layout
└── published/                   ← finalized linkedin posts, tweets, papers
```

The 16 already-published blog articles live at `content/blog/`
(the site's existing publish target). For new pieces, the workflow
is: idea → `idea-to-brief` → `content-pipeline` → write → publish
to `content/blog/<date>-<slug>.mdx`.

## Site work — quick orientation

Until a per-domain CLAUDE.md exists for site code, here's the
shortest loading list:

- `package.json` + `next.config.ts` — Next.js 16.1.6 (Turbopack), Sharp, MDX
- `src/app/` — App Router routes
- `src/components/` — React components
- `src/lib/blog.ts` — MDX frontmatter shape (load when touching blog frontmatter)
- `public/articles/<slug>/` — per-article static assets (heroes, LinkedIn headers)
- Deploy: Azure Static Web Apps via GitHub Actions (`.github/workflows/`)

When site work grows enough to warrant its own routing doc (a
`docs/dev/CLAUDE.md` or similar), add a row to the dispatcher above.

## Repo conventions

- **Per-batch workflow:** `git fetch origin --prune` →
  `git checkout -b <type>/<slug> origin/main` → edit → commit →
  push → `gh pr create` → `gh pr merge --merge`
- **Commit prefixes:** `content:`, `feat:`, `fix:`, `chore:`,
  `docs:`. Content commits use the slug (e.g.,
  `content: <slug> -> outline`).
- **Worktrees:** the repo uses git worktrees for parallel work.
  `c:\code_files\spaarke-website` is the main worktree on `main`;
  `c:\code_files\spaarke-website-wt-<feature>` are branch-isolated
  worktrees. Create a worktree only when you need parallel work
  on multiple pieces; for one-piece-at-a-time, a regular branch is
  fine.
- **Don't** push directly to `main`. Don't `--force` push. Don't
  skip hooks. Don't auto-publish content.
