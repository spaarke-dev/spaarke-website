# Current task: Design Partner Page, privacy policy, and LinkedIn ads

> Context recovery. A session picking this up cold, on any machine, reads this
> file first, then `tasks/TASK-INDEX.md`, `notes/implementation.md`,
> `notes/preview-verification.md`, and `spec.md`.
>
> Last updated 2026-10-28, after PR #126 (the paid LinkedIn plan) merged.

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | 031: Pull request and preview verification |
| **Step** | 9 of 10: one real test submission on the preview |
| **Status** | in progress; every automated check passes |
| **Next Action** | The writer submits one test application on the preview (link below). Then confirm the row and the email, delete the test row, mark PR #124 ready, merge, and run task 090 |

## Setting up on a new machine

1. `git clone https://github.com/spaarke-dev/spaarke-website.git` (or
   `git fetch origin --prune` in an existing clone).
2. `git worktree add ../spaarke-website-wt-design-partner-page feat/design-partner-page`,
   or simply `git checkout feat/design-partner-page`.
3. `npm ci`. Before `npm run typecheck` passes in a fresh checkout, run
   `npm run build` once (it writes `next-env.d.ts`) or copy `next-env.d.ts`
   from another checkout, and run `node scripts/build-corpus-manifest.mjs --quiet`.
4. Local API testing needs `.env.local` with STORAGE_ACCOUNT_CONNECTION,
   SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, CONTACT_EMAIL_TO,
   RECAPTCHA_SECRET_KEY, RECAPTCHA_SITE_KEY and NEXT_PUBLIC_CLARITY_PROJECT_ID.
   Copy it from the desktop by hand; it is not in git. Without it the API
   returns 500 by design (nothing stored, nothing sent).
5. The private archive `C:\code_files\spaarke-research\` is not a git
   repository. Copy `C:\code_files\spaarke-research\linkedin-carousel\` to
   the laptop by hand: it holds the carousel source HTML, the Lead Gen Form
   images, and `lead-gen\HANDOFF.md` (ad budget and targeting notes that stay
   out of this public repo).

## Where everything stands

### Git

| Branch | PR | State |
|---|---|---|
| `feat/design-partner-page` | [#124](https://github.com/spaarke-dev/spaarke-website/pull/124) (draft) | Pushed. The page, API, form, redirects, daily report, privacy policy rewrite, Clarity decision. Not merged: waits on the test submission. On 2026-10-28 the `DesignPartnerApplications` table did not exist yet, so no application had been stored |
| `content/spaarke-overview-carousel` | #125 | The carousel workspace, calendar, and campaign rows. Merged 2026-10-22 |
| `docs/linkedin-advertising` | #126 | The paid LinkedIn procedure and plan, the Design Partner Program campaign file, Paid columns and sections. Merged 2026-10-28 |

Preview: https://ambitious-bay-0fb5bb10f-124.1.azurestaticapps.net/design-partners

### Design Partner Page (tasks 001 to 031)

- Route `/design-partners`. `/advisory-group` redirects permanently;
  `/go/more-info-1` (the printed postcards) redirects temporarily.
- Applications go to the `DesignPartnerApplications` table (partition
  `design-partner`) and to contactus@spaarke.com with reply-to set to the
  applicant. The daily report lists them.
- Automated preview checks all pass (`notes/preview-verification.md`).

**Remaining in task 031:**

1. The writer submits a test application on the preview, using a real
   mailbox they can see, organization "Spaarke test".
2. Confirm: a row in `DesignPartnerApplications`; an email at
   contactus@spaarke.com whose reply-to is the test address; the Plausible
   events "Design Partner Submit" and "Overview Download" (if the PDF was
   downloaded).
3. Delete the test row (Azure portal, Storage browser, or `az storage entity delete`).
4. `gh pr ready 124`, then `gh pr merge 124 --merge`, then confirm
   https://www.spaarke.com/design-partners, `/go/more-info-1` and `/privacy`
   in production.
5. Mark 031 complete in `tasks/TASK-INDEX.md` and start 090 (wrap-up).

**Why it has to merge before the LinkedIn ad launches:** the Lead Gen Form
links to `/privacy` (the LinkedIn lead form section is only in this PR), and
the form's confirmation link points to `/design-partners`.

### Privacy policy (in PR #124)

Rewritten so it is accurate: all four forms, the IP hash, SendGrid, LinkedIn
lead forms, how form data is used (no sale, no cross-context advertising),
the optional updates checkbox, retention and security, non-discrimination,
children, and a Cookies section.

Decisions the writer made on 2026-10-22:

- Retention stays as written ("as long as we need it ... delete when you ask").
- The optional updates checkbox on the Lead Gen Form is covered by the policy.
- **Clarity runs without cookies (option B).** The writer turned cookies off
  in the Clarity project settings. The policy now says the site sets no
  analytics or advertising cookies; the only cookies are `_GRECAPTCHA` on
  form pages and Azure's `ARRAffinity` and `ARRAffinitySameSite`. Record:
  `projects/clarity-consent/design.md`.
- The daily report keeps its Clarity traffic section for now. Its "sessions"
  are now single page views; revisit later.

Still for the writer: privacy@spaarke.com must be a working mailbox, and any
marketing email sent to people who tick the updates box needs a postal address
and an unsubscribe link (CAN-SPAM).

### LinkedIn Lead Gen Form (built in Campaign Manager)

- Image: light version B, "See what your legal data can decide." with a
  "Get the overview" button. Files in
  `C:\code_files\spaarke-research\linkedin-carousel\lead-gen\`
  (`form-image-light-b@2x.png` uploaded; `render-light.mjs` re-renders).
  The writer confirmed the preview looks right.
- Headline: "Make every legal decision intelligent".
- Details: "Legal runs on decisions. Spaarke brings your data, rules, and
  people into one model, so AI proposes and your team decides. We will
  follow up by email."
- Fields in the writer's preview: email, first and last name, job title,
  company (from the profile), and the required question "Which best
  describes your organization" (advised options: Law department, Law firm,
  Other, to match the site form).
- Advised, not yet confirmed in the preview: the optional checkbox "Send me
  occasional updates from Spaarke. I can unsubscribe at any time.", the
  hidden field `source=linkedin-lead-form`, and camelCase field names that
  match the table.
- Privacy policy URL `https://www.spaarke.com/privacy`, with the custom
  privacy text "Spaarke uses the information you submit to respond to your
  request. We do not share it with third parties for marketing purposes."
- **To set:** the confirmation (thank-you) link is
  `https://www.spaarke.com/design-partners?utm_source=linkedin&utm_medium=paid&utm_campaign=2026-11-design-partner-program&utm_content=lead-form`,
  the UTM convention in `content-platform/advertising/linkedin-ads-procedure.md`
  section 5.1.
- Leads are downloaded from Campaign Manager; there is no CRM sync yet.

### LinkedIn ads: now on main

Since PR #126 merged on 2026-10-28, the paid program lives in
`content-platform/advertising/` (procedure, plan, handoff) and in the campaign
files. The gated overview Document ad has its full ad brief in
`content-platform/campaigns/2026-11-design-partner-program.md` (Milestone 7,
Issue #127). Decisions on 2026-10-28: no Insight Tag (leads measured in
LinkedIn, engagement retargeting only); the Design Partner Program has its own
campaign; nothing is live in LinkedIn yet. Budgets and targeting notes stay in
`C:\code_files\spaarke-research\linkedin-carousel\lead-gen\HANDOFF.md`.

### Carousel (Issue #123)

Approved at version 4 with three hashtags. The writer posts the PDF and post
text to the company page by hand. After posting, run the ship step in
`content-platform/articles/spaarke-overview-carousel/tasks.md` section 6:
move `draft.md` and the PDF to `content-platform/published/linkedin-posts/`,
record `posted_url`, set the calendar and campaign rows to published, move
the Project status, close Issue #123, then commit, PR, merge. The
company-page link for the post is
`https://www.spaarke.com/design-partners?utm_source=linkedin&utm_medium=social&utm_campaign=spaarke-overview`.

## Standing rules

- This repo is public. Private sources, budgets, and targeting stay in
  `C:\code_files\spaarke-research\`.
- Never name the firm whose operating model Spaarke's services follow.
- No em or en dashes in anything written for readers; run
  `npm run voice:lint -- <file>` on new copy.
- Test submissions write to the production table and inbox, so the writer
  makes them. Posting to LinkedIn and launching ads are manual.
- Don't push to main, force push, or skip hooks.
