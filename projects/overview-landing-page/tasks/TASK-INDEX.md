# Task index: Design Partner Page

> Registry and status. Update the status column as tasks complete.
> Generated 2026-10-21.

## Status

| ID | Task | Phase | Depends on | Est. | Status |
|---|---|---|---|---|---|
| 001 | [Render and copy the assets](001-render-and-copy-assets.md) | 0 | none | 2h | not-started |
| 010 | [Storage and notification functions](010-storage-and-email.md) | 1 | none | 2h | not-started |
| 011 | [API route](011-api-route.md) | 1 | 010 | 3h | not-started |
| 012 | [Daily report section](012-daily-report.md) | 1 | 010 | 1h | not-started |
| 020 | [Page shell and copy](020-page-shell.md) | 2 | 001 | 3h | not-started |
| 021 | [Slide strip and download](021-slide-strip.md) | 2 | 001, 020 | 3h | not-started |
| 022 | [Application form](022-application-form.md) | 2 | 011, 020 | 3h | not-started |
| 030 | [Redirects and contact reason](030-redirects-and-contact-reason.md) | 3 | 020 | 2h | not-started |
| 031 | [Pull request and preview verification](031-preview-verification.md) | 3 | 012, 021, 022, 030 | 2h | not-started |
| 090 | [Project wrap-up](090-project-wrap-up.md) | 3 | 031 | 2h | not-started |

**10 tasks, roughly 23 hours.**

## Phases

| Phase | Tasks | What it proves |
|---|---|---|
| 0 Assets | 001 | The slides and PDF are ready and nothing private leaks |
| 1 Server side | 010 to 012 | An application is stored, sent, and reported |
| 2 The page | 020 to 022 | The page reads, swipes, and submits |
| 3 Connections and preview | 030, 031, 090 | Every entry point lands, and it works on the preview and in production |

Phases 0 and 1 can run in parallel.
