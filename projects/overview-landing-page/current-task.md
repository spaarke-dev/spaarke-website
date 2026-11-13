# Current task: LinkedIn Lead Gen Form and ads for the Design Partner Program

> Context recovery. A session picking this up cold, on any machine, reads this
> file first. The Design Partner Page project itself is complete: its record
> is `tasks/TASK-INDEX.md`, `notes/launch-verification.md`, and
> `notes/lessons-learned.md`.
>
> Last updated 2026-11-12, after PR #124 merged and the page went live, and
> again the same day when the paid program was restarted. The paid program as
> a whole, its launch order, and the next Campaign Manager steps are in
> `content-platform/advertising/handoff.md`.

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | The LinkedIn Lead Gen Form and Document Ad (Issue #127), and the carousel ship step (Issue #123) |
| **Status** | The page, `/privacy`, and both redirects are live, so nothing on the site blocks the ads any longer. The owner decided on 2026-11-12 that the Document ad starts on 2026-12-19, after the accelerator lead campaign ends |
| **Next Action** | Post the carousel some days before 2026-12-19 and run its ship step. By 2026-12-18 the writer finishes the Lead Gen Form settings below and builds the ad; the owner approves it to start 2026-12-19 |

## Setting up on a new machine

1. `git clone https://github.com/spaarke-dev/spaarke-website.git` (or
   `git fetch origin --prune` in an existing clone), then work from `main`.
2. `npm ci`. Before `npm run typecheck` passes in a fresh checkout, run
   `npm run build` once (it writes `next-env.d.ts`) or copy `next-env.d.ts`
   from another checkout, and run `node scripts/build-corpus-manifest.mjs --quiet`.
3. Local API testing needs `.env.local` with STORAGE_ACCOUNT_CONNECTION,
   SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, CONTACT_EMAIL_TO,
   RECAPTCHA_SECRET_KEY, RECAPTCHA_SITE_KEY and NEXT_PUBLIC_CLARITY_PROJECT_ID.
   Copy it from the desktop by hand; it is not in git. Without it the API
   returns 500 by design (nothing stored, nothing sent).
4. The private archive `C:\code_files\spaarke-research\` is not a git
   repository. Copy `C:\code_files\spaarke-research\linkedin-carousel\` to
   the laptop by hand: it holds the carousel source HTML, the Lead Gen Form
   images, and `lead-gen\HANDOFF.md` (ad budget and targeting notes that stay
   out of this public repo).

## Where everything stands

### Git

| Branch | PR | State |
|---|---|---|
| `feat/design-partner-page` | [#124](https://github.com/spaarke-dev/spaarke-website/pull/124) | The page, API, form, redirects, daily report, privacy policy rewrite, Clarity decision. Merged and live 2026-11-12 |
| `content/spaarke-overview-carousel` | #125 | The carousel workspace, calendar, and campaign rows. Merged 2026-10-22 |
| `docs/linkedin-advertising` | #126 | The paid LinkedIn procedure and plan, the Design Partner Program campaign file, Paid columns and sections. Merged 2026-10-28 |

### Design Partner Page (complete)

- Live at https://www.spaarke.com/design-partners. `/advisory-group`
  redirects permanently; `/go/more-info-1` (the printed postcards) redirects
  temporarily. Both keep their query strings.
- Applications go to the `DesignPartnerApplications` table (partition
  `design-partner`) and to contactus@spaarke.com with reply-to set to the
  applicant. The daily report lists them. The test submission on 2026-11-12
  worked end to end, and its row was deleted.
- Left for the writer:
  - Remove `ambitious-bay-0fb5bb10f-124.1.azurestaticapps.net` from the
    reCAPTCHA key's domains. It was added for the test.
  - Confirm the Plausible events "Design Partner Submit" and
    "Overview Download" appear; this session could not check them.
- Optional follow-up from the Lighthouse run: the site-wide button blue
  `#5078DC` with white text is 4.14:1, short of the 4.5:1 contrast minimum.
  Details in `notes/launch-verification.md`.

### Privacy policy (live 2026-11-12)

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

Still for the writer: ~~privacy@spaarke.com must be a working mailbox~~ (the
writer confirmed on 2026-11-12 that it exists), and any marketing email sent to
people who tick the updates box needs a postal address and an unsubscribe link
(CAN-SPAM).

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
campaign; nothing was live in LinkedIn on that date. Since then the
accelerator founder post's Thought Leader Ad went live on 2026-11-04. On
2026-11-12 the owner set the launch order: the accelerator lead ads first, to
2026-12-18, then this Document ad from 2026-12-19 (plan section 5). Budgets and
targeting notes stay in
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
