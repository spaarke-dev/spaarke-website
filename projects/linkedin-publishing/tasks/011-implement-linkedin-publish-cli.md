# Task 011: Implement `scripts/linkedin-publish.ts`

**Phase:** 1 — Personal-account end-to-end
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 002, 003
**Tags:** typescript, linkedin, api, cli, sharp
**Parallel group:** **A** — runs alongside 010 and 012 after Phase 0

## Goal

The publish CLI the orchestrator skill invokes. Uploads the image,
posts to LinkedIn, writes local records. End-to-end success or a
typed error.

## Context

Per [spec §6](../spec.md). This is the single point of LinkedIn API
contact (apart from the auth CLI). All other code talks to LinkedIn
through this script.

## Steps

1. Create `scripts/linkedin-publish.ts`.
2. Parse args: `--slug` (required), `--target=personal|company` (required), `--dry-run` (flag), `--commentary "<text>"` (override), `--image <path>` (override).
3. Map `--target` to `App`: `personal` → `member`, `company` → `org`.
4. **Load article frontmatter** from `content/blog/*-${slug}.mdx` using `gray-matter` (already a site dep). Extract `title`, `summary`, `description`.
5. **Load commentary**:
   - If `--commentary` provided: use it.
   - Else if `content-platform/published/linkedin-posts/${slug}.md` exists: read its body.
   - Else: error — the skill is expected to have written the file before invoking the CLI.
6. Validate commentary length ≤ 3000 chars (LinkedIn hard limit). Truncate-warning if > 2700; error if > 3000.
7. **Resolve image**:
   - If `--image` provided: use it.
   - Else: `public/articles/${slug}/linkedin-1920x1080.png`.
   - Validate file exists, type is PNG/JPG, size < 8 MB.
8. **Refresh tokens** via `refreshIfNeeded(app, 0.0035)` (5-minute window).
9. **If `--dry-run`**: print the full request body that would be sent, and exit 0.
10. **Upload image** (Images API):
    - `POST https://api.linkedin.com/rest/images?action=initializeUpload` with body `{ initializeUploadRequest: { owner: <authorUrn> } }`.
    - Parse response: `uploadUrl`, `image` (URN).
    - `PUT` the file binary to `uploadUrl` with `Content-Type: application/octet-stream`.
    - Receive image URN.
11. **Create post** (Posts API):
    - `POST https://api.linkedin.com/rest/posts` with the body shape from [spec §6.2 step 4](../spec.md).
    - Headers: `Authorization: Bearer <token>`, `LinkedIn-Version: 202604`, `X-Restli-Protocol-Version: 2.0.0`, `Content-Type: application/json`.
12. On 201: extract Post URN from `x-restli-id` response header. Construct human URL: `https://www.linkedin.com/feed/update/${URN}/`.
13. **Persist results**:
    - Write/update `content-platform/published/linkedin-posts/${slug}.md` with frontmatter `posted_url: <url>`, `posted_at: <iso>`, `target: <personal|company>`, body = the commentary that was sent.
    - Append to `content-platform/calendar.md` (a new row in the "Posted" section — exact format from task 043).
14. Print the post URL to stdout (skill captures this).
15. Error mapping table per [spec §6.4](../spec.md).
16. Partial-state safety: write a `.linkedin-cache/<slug>-pending.json` marker before the POST; clear it after success. On startup, if the marker exists, query LinkedIn for recent posts by `authorUrn` and ask the operator how to proceed.

## Expected Outputs

- `scripts/linkedin-publish.ts` — ~400 lines

## Acceptance Criteria

- [ ] `pnpm linkedin:publish --slug=the-iq-stack --target=personal --dry-run` prints the request body without making any API calls.
- [ ] `pnpm linkedin:publish --slug=the-iq-stack --target=personal` posts to the operator's personal LinkedIn feed; the printed URL renders the link card and the 1920×1080 image.
- [ ] On 422 (e.g., commentary > 3000): exits with the spec-defined message.
- [ ] On 401: exits with a message that tells the operator to run `pnpm linkedin:auth --app=member`.
- [ ] After success, `published/linkedin-posts/the-iq-stack.md` has frontmatter with `posted_url` and the calendar has a new entry.
- [ ] Crash between image upload and post creation does NOT leave the calendar dirty.

## Notes

- Use `gray-matter` for the article frontmatter parse — already a site dep.
- For the binary PUT upload, use `fetch` with `body: Buffer.from(fs.readFileSync(path))` and the correct content-type.
- Don't try to support multiple images, polls, or carousels in v1 — those are explicit non-goals.
- The personal-account flow uses Sign In + Share product scopes (`w_member_social`), which are already approved.
