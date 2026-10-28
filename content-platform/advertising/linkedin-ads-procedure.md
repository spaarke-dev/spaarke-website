# LinkedIn advertising procedure

How Spaarke runs paid LinkedIn. This is the standing procedure. The
time-bound choices (which campaigns get paid support, when, and at what
level) are in [`linkedin-ads-plan.md`](linkedin-ads-plan.md).

Paid LinkedIn supports the campaign and content program. It does not run
beside it. Every ad promotes a piece that already exists in
[`../campaigns/`](../campaigns/) and [`../calendar.md`](../calendar.md), and
every ad is tracked as an asset in the campaign file it belongs to.

> **Verification status.** This file was checked against LinkedIn's own help
> pages and ads guide on 2026-10-24. Items marked **[UI]** are things the help
> pages could not settle (current minimum spend, exact menu labels, sources
> that disagree). Confirm them in Campaign Manager before they drive a
> decision. LinkedIn changes menus and names often, so re-check this file
> each quarter. The sources are listed in section 10.
>
> Budgets, targeting lists, and account identifiers are kept in the private
> archive, not in this repo.

---

## 1. How LinkedIn works

### 1.1 Organic and paid share assets

- **Organic** is a post on a page or a personal profile. The feed shows it to
  followers and to people their connections engage with.
- **Paid** is the same post, or a purpose-built ad, delivered to an audience
  we choose by targeting, whether or not they follow us.

An organic post can become an ad. Company-page posts can be sponsored. A post
on a personal profile can be sponsored as a Thought Leader Ad, with the
author's permission. Direct sponsored content (ads that do not appear on the
page feed) lets us run several variants of one idea without cluttering the
page.

### 1.2 The account structure

Campaign Manager has four levels. **LinkedIn renamed two of them from
October 2025.** The old names still appear in older help pages, in the API,
and in older reports, so the table gives both.

| Level (current UI name) | Old name | What it holds | Spaarke use |
|---|---|---|---|
| Ad account | Ad account | Billing, audiences, conversions, users, one linked company page | One account for Spaarke |
| **Campaign** | Campaign group | The objective shared by everything under it; an optional total budget and schedule; optional budget optimization | One per campaign file and objective (section 3) |
| **Ad set** | Campaign | The audience, formats, placements, bidding strategy, budget and schedule (when not set above) | One per audience and route |
| Ad | Ad (creative) | The creative a person sees, with its headline, text, link, and Lead Gen Form | Two to four variants per ad set |

Notes on the rename:

- It is a name change. LinkedIn described it as alignment with other ad
  platforms and did not add new function with it.
- The API and some exports may still use the old names. Anything we build
  that reads LinkedIn data (reports, the publish scripts under
  `projects/linkedin-publishing/`) must be checked against the names in use
  before it is trusted. **[UI]**
- Sources disagree on the exact start date. It began around mid October 2025
  and rolled out gradually.

### 1.3 The auction and delivery

- Ads compete in an auction for each impression. Delivery depends on the bid
  and on predicted relevance. **[UI]** (LinkedIn's help pages do not describe
  the auction rule in detail.)
- Each ad set has an objective-driven optimization goal that sets what we pay
  for: impressions or reach (CPM), clicks (CPC), video views (CPV), sends
  (CPS, messaging), or results such as leads and conversions.
- A new ad set enters a learning phase under maximum delivery, and results
  fluctuate until it ends. Do not judge or change an ad set during its first
  days.
- Audience size drives cost. A narrow audience gets expensive and saturates
  (the same people see the ad repeatedly). Watch frequency.
- Location is a required targeting facet for every ad set audience.

### 1.4 What LinkedIn is good at for us

LinkedIn is the one channel where we can buy a job title, a seniority, and a
company, and reach legal operations leaders, general counsel, and firm
operations leaders directly. That is the reason to pay for it. The cost per
impression is high against other networks, so we spend on a narrow,
well-defined audience and a high-intent asset, not on broad awareness.

---

## 2. Objectives, routes, and ad types

Pick the objective first. The objective decides which formats and bidding
options are available. Then pick the route and the format.

### 2.1 Objectives (confirmed from LinkedIn's help center)

One objective applies to all ad sets in a campaign.

| Tier | Objective | Optimization goal (as listed) | Notes |
|---|---|---|---|
| Awareness | Brand awareness | Reach (impressions or reach, chosen by format and bidding) | Impression-based |
| Consideration | Website visits | Landing page clicks | |
| Consideration | Engagement | Engagement clicks | A Follow button is added to Sponsored Content by default; Follow clicks are charged on CPC ad sets, not CPM |
| Consideration | Video views | Video views | |
| Conversion | **Lead generation** | Qualified leads (recommended); leads if no Conversions API integration | The objective that uses Lead Gen Forms |
| Conversion | Website conversions | Website conversions | Needs conversion tracking, which we do not run (5.1); not used |
| Conversion | Job applicants | Landing page clicks | Recruiting; not used |
| Conversion | Talent leads | Talent leads | Needs a LinkedIn Recruiter contract; not used |

### 2.2 Routes

An ad route is the path from a viewer to Spaarke.

| Route | Where the viewer lands | Best for | Typical objective |
|---|---|---|---|
| **A. Click to site** | An article, `/design-partners`, a landing page | Reaching a reader | Website visits |
| **B. In-feed lead form** | A Lead Gen Form, prefilled from the viewer's profile | Gated assets, design partner interest | Lead generation |
| **C. Engage in feed** | The post itself | Authority, social proof, warming an audience | Brand awareness, Engagement |
| **D. Inbox** | LinkedIn messaging | A direct invitation to a defined list | Lead generation, Website visits |
| **E. Retarget** | A lead form or the site, for people who already engaged with our ads or page | Moving a warm audience to action | Lead generation |

Routes combine. The default Spaarke pattern is **C or A to warm, then E and B
to convert.**

### 2.3 Ad types (from LinkedIn's ads guide)

| Format | Specs | Routes | Spaarke fit |
|---|---|---|---|
| **Single image** | 1200 x 627 px; PNG or JPG; under 5 MB; headline, text, and call to action required | A, B, E | Article or `/design-partners` traffic. Cheap to produce. |
| **Carousel** | 2 to 10 cards; 1080 x 1080 px recommended; JPG or PNG; up to 10 MB per file | A, B | A staged story. Our decks are PDFs, so a Document ad is usually better. |
| **Document** | PDF, DOCX, or PPTX; up to 100 MB; up to 300 pages. **With the Lead generation objective, only PDF is accepted.** Under about 10 pages is recommended. | B, A, C | **First-choice paid format.** The overview carousel PDF already runs this way. |
| **Video** | MP4; under 500 MB; up to 30 minutes | C, A, E | Walkthroughs, once they exist |
| **Thought Leader Ad** | Sponsors a text, image, video, newsletter, or article post from a verified employee or connection, with the member's permission. **Documents, polls, multi-image posts, and reposts are not eligible.** | C, A | Founder and practitioner posts. See 2.4. |
| **Article and newsletter ad** | Promotes a native LinkedIn article or newsletter | C, A | If we publish a LinkedIn newsletter |
| **Event ad** | Promotes a LinkedIn Event; intro text up to 600 characters | C, B | Only when we run a webinar or roundtable |
| **Connected TV ad** | Streaming-platform video | C | Not used |
| **Job ad** | Promotes a job post | n/a | Not used |
| **Conversation ad** | Sponsored Messaging; up to 5 call-to-action buttons; message up to 8,000 characters; optional 300 x 250 px banner | D, B | A small named list, such as design partner invitations |
| **Message ad** | Sponsored Messaging; message up to 1,500 characters; 20-character call to action; optional 300 x 250 px banner | D, B | Same list, simpler |
| **Spotlight, Follower, and Text ads** | Right-rail ads; 100 x 100 px logo; headline up to 50 characters | A | Low value for us. Not used. |

### 2.4 Thought Leader Ad rules that matter to us

- The member must approve. They receive an email request and can approve one
  post or all pending and future ones, and can revoke later, which turns the
  ad off.
- The post must be public, and the profile must show the member's full name.
- **A founder post that carries our carousel as a document cannot be
  sponsored as a Thought Leader Ad.** To sponsor the carousel, run it as a
  Document ad from the company page. Founder syndication posts for articles
  (text or single image) are eligible.
- LinkedIn lists Brand awareness, Engagement, and Video views as the
  objectives for Thought Leader Ads. A lead form on a Thought Leader Ad was
  not confirmed. Do not plan lead capture on one. **[UI]**
- Permissions needed: Page super admin, content admin, or Sponsored Content
  poster, plus creative manager or higher on the ad account.

### 2.5 Lead Gen Forms (confirmed specifications)

- Formats that can carry a form: single image, carousel, video, event,
  message, document, and conversation ads. The Lead generation objective is
  required.
- Up to 12 fields in total. First name, last name, and email are selected by
  default. At least one predetermined or custom question is required. Up to
  3 custom questions (counted in the 12). Up to 20 hidden tracking fields.
- LinkedIn's guidance is three to four fields. Fewer fields convert better.
- Limits: headline 60 characters; details 160; each custom question 100;
  privacy policy text 2,000 (optional); up to 5 disclosure checkboxes of 500
  each (optional); confirmation message 300; landing page URL 2,000.
- A privacy policy URL is required and must begin with http:// or https://.
- The thank-you step can show a confirmation message, a button to a landing
  page, and optional booking through Calendly or Chili Piper. LinkedIn does
  not send the gated asset itself, so the thank-you page must link to the
  file.
- **Gated Document ads:** with Lead generation, website visits, or website
  conversions, a slider sets how many pages are previewed. At least one page
  must be a preview, so a one-page document cannot be gated. The viewer
  clicks "Unlock full document" and completes the form. Hyperlinks inside the
  document work only after download.

### 2.6 Budget and bidding (confirmed from LinkedIn's help center)

**Bidding strategies**

| Strategy | What it does | Objectives |
|---|---|---|
| **Maximum delivery** (automated) | Machine learning bids to get the most results from the full budget. Default and recommended. No bid input. | All |
| **Cost cap** | You set a target cost per key result as a benchmark. | Brand awareness, Website visits, Engagement, Video views, Lead generation |
| **Manual** | You set the bid per result. Most control. Charged per click, impression, view, or send depending on objective, format, and goal. | All |

Campaign Manager shows a suggested bid range for cost cap and manual bidding.
Suggestions are not guaranteed inventory.

**Budget types:** daily, lifetime, or daily plus lifetime.

- A **lifetime** budget is required for a custom schedule.
- **Daily plus lifetime** allows only a continuous schedule with no end date.
- Daily spend can run up to 100% above the daily budget on a given day, but a
  week (Monday to Sunday) will not exceed seven times the daily budget.
- With a lifetime budget, daily spend varies but the total never exceeds it.
- A lifetime budget must meet a minimum that depends on duration. The
  interface shows the minimum when a budget is too low. Older help pages
  quote $10 a day and $100 lifetime. **[UI]**
- Budget optimization (the setting formerly called Dynamic Group Budget) moves
  budget, schedule, and bidding strategy to the campaign level. It requires
  all ad sets in the campaign to share objective, bidding strategy, and
  budget type. It cannot be turned off after the campaign launches.

**Spaarke rule:** every campaign carries a campaign-level **lifetime budget
and an end date** as a ceiling, so nothing runs past its window. Phase 1 ad
sets use maximum delivery. Move to cost cap once there is a baseline cost.

---

## 3. How we structure campaigns, ad sets, and ads

### 3.1 The mapping

```
Ad account (Spaarke)
 └─ Campaign           one Spaarke campaign file x one objective
     └─ Ad set         one audience x one route and format family
         └─ Ad         one creative variant (2 to 4 per ad set)
```

- **Campaign.** LinkedIn requires one objective per campaign, and our
  campaign files mix objectives (an article to read, a PDF to download). So
  one campaign file becomes **one LinkedIn campaign per objective**. The
  Spaarke Method has, for example, a lead generation campaign for the
  overview carousel and a website visits campaign for the phase articles.
  This keeps cost and results readable by goal.
- **Ad set.** One audience and one route. Keep ad sets of one campaign
  different on audience, not on the creative, so budget and results compare
  cleanly. Do not run two ad sets over the same people in the same campaign.
- **Ad.** The variants of one idea: hook line, image, or offer, one variable
  at a time.

### 3.2 Naming convention

Names are internal, but every report and export depends on them, so keep to
the pattern.

| Level | Pattern | Example |
|---|---|---|
| Campaign | `<campaign-slug> / <objective>` | `2026-10-the-spaarke-method / leadgen` |
| Ad set | `<audience> / <route> / <format> / <yyyymm>` | `A1-legalops / B / document / 202610` |
| Ad | `<asset-slug> / <variant>` | `spaarke-overview-carousel / v1-hook-decision` |
| Lead Gen Form | `<asset-slug> / form / v<n>` | `spaarke-overview-carousel / form / v1` |

The campaign slug is the same slug used in the campaign file, the milestone,
and the `utm_campaign` value, so one name joins the repo, GitHub, LinkedIn,
and site analytics.

### 3.3 Settings we choose

| Setting | Spaarke default | Reason |
|---|---|---|
| Shared objective | On | Required for budget optimization and keeps the campaign readable |
| Budget optimization | Off in phase 1 | Lets us set a budget per audience until there is a baseline |
| Campaign budget and schedule | Lifetime, with end date | A hard ceiling |
| Bidding | Maximum delivery, then cost cap | See 2.6 |
| Placements | LinkedIn only; turn off the LinkedIn Audience Network | The Audience Network (selected by default) extends delivery to outside sites. Our rule, not LinkedIn's: we want to know where our spend lands in a narrow B2B audience. Revisit after the baseline. |
| Audience | Location plus job function, seniority, title, company size | Section 4 |
| Ad creation method | Standard setup | LinkedIn offers a flexible method that varies delivery for you; we want to control and read variants. **[UI]** |
| Status on build | Draft | Nothing delivers until the owner approves |

### 3.4 How-to: create a campaign

1. Open the ad account in Campaign Manager, choose **Advertise**, and on the
   **Campaigns** tab choose **Create**, then **Campaign**. You need campaign
   manager access or higher.
2. Enter the name from 3.2. Set the status to **Draft**.
3. Choose the single objective. It cannot be changed after launch.
4. Leave budget optimization off in phase 1. Set the campaign budget,
   schedule start, and **end date**, using a lifetime budget.
5. Choose **Create and use in new ad set**.

### 3.5 How-to: create an ad set

1. Confirm the objective carried over.
2. **Audience.** Set location first, then add attributes (section 4). Check
   the forecasted audience size and the 300-member floor for matched
   audiences. Save the audience as a template if we will reuse it.
3. **Format.** Choose the ad format from section 2.3. Formats available
   depend on the objective.
4. **Placements.** LinkedIn only (3.3).
5. **Budget, bidding, schedule.** Set them here if budget optimization is
   off. Maximum delivery to start. Use a lifetime budget with the end date.
   The interface shows the minimum.
6. **Conversion tracking.** Attach the conversion defined for this campaign.
   A conversion counts only when attached to an ad set.
7. **URL tracking parameters.** Add the UTM template from section 5.1 at the
   ad set level so every ad inherits it.
8. Save. The ad set stays in **Draft** until the owner approves.

### 3.6 How-to: create an ad

1. Open the ad set and go to **Ads in this ad set**, then **Create new ad**.
   Creating an ad needs creative manager access or higher.
2. Choose the creative or the post (a page post, or a member post for a
   Thought Leader Ad).
3. Enter headline, intro text, destination URL, and call to action. First
   line of the intro text carries the message, because feeds truncate early
   on mobile.
4. For Lead generation, attach the Lead Gen Form (2.5). For a gated Document
   ad, set the preview page count.
5. Check the preview on desktop and mobile.
6. Save as **Draft**. Build the second to fourth variants by duplicating and
   changing one variable.
7. Switch to **Active** only after the owner's approval. Ads go through review
   before delivery, and a rejected ad needs a fix and resubmission.

### 3.7 How-to: create a Lead Gen Form

1. Create it during ad set or ad setup under the Lead generation objective,
   or in the form library.
2. Name it per 3.2. Write the headline (60 characters) and details (160).
3. Choose the fields. Default to first name, last name, work email, company,
   and job title. Add a custom question only if lead qualification needs it.
4. Add the privacy policy URL and consent text.
5. Set the thank-you step: a confirmation message, and a landing page button
   linking to the PDF or the next step.
6. Add hidden fields for tracking where we need them, such as the campaign
   slug.
7. Test the form from a personal account before launch.

### 3.8 Worked example: the overview carousel

| Level | Setting |
|---|---|
| Campaign | `2026-10-the-spaarke-method / leadgen`, Lead generation, lifetime budget with end date |
| Ad set | `A1-legalops / B / document / 202610`: legal operations leaders, Document ad, gated, maximum delivery, LinkedIn only |
| Ad set | `A2-firmops / B / document / 202610`: law firm operations leaders, same format |
| Ads | The nine-slide PDF with the cover as the feed view, two to four hook variants, preview set to the first four slides |
| Form | `spaarke-overview-carousel / form / v1` |

---

## 4. Targeting

### 4.1 Facets we use

| Facet | Use |
|---|---|
| Location | Required. The markets we sell into. |
| Job function and seniority | The main lever: Legal, Operations, and Finance at manager level and above |
| Job title | Specific titles (legal operations, general counsel, chief legal officer, firm COO, firm director of operations) |
| Company size and industry | Mid-size and large legal departments; law firms for the firm audience |
| Skills and groups | Supplementary; use sparingly |

Include adds reach within a facet, and narrowing or excluding shrinks the
audience. Do not stack many facets. Below the minimum audience the ad set
will not serve. Campaign Manager can suggest an audience, which we treat as a
starting point only.

### 4.2 Matched Audiences

| Type | What it is | Use |
|---|---|---|
| **Company list** | Upload target accounts | Account-based ad sets |
| **Contact list** | Upload emails | Existing relationships and prospects. Needs consent and a lawful basis. |
| **Website retargeting** | Visitors to pages with the Insight Tag | Not used: the site has no Insight Tag (5.1) |
| **Engagement retargeting** | People who interacted with our ads, forms, page, or events | Route E |
| **Lookalike** | Profiles similar to a seed list | Later, once a seed list is large enough |

Every matched audience needs at least **300 matched members** to serve.
Location is still required and can drop a borderline audience under 300.
Several segments can be combined in one ad set. Matched audience sizes can be
limited in the EEA and Switzerland.

### 4.3 Audience rules

- Every audience has a written definition in the campaign file (who it is,
  how it is built, expected size). The list stays in the private archive.
- Exclude customers, partners, our staff, and anyone who has converted, from
  acquisition ad sets.
- The personas in `voice/audience-personas.md` get separate ad sets.

---

## 5. Measurement

### 5.1 Setup

- **No Insight Tag.** The owner decided on 2026-10-28 not to install it. The
  privacy policy says the site sets no analytics or advertising cookies and
  needs no cookie banner, and the tag would make that untrue. What this
  leaves:
  - Lead generation ads count leads inside LinkedIn and need no tag, so the
    gated Document ad and Lead Gen Forms are measured in full.
  - Retargeting uses engagement audiences only (4.2).
  - Website-visit ads are judged on clicks in Campaign Manager and on visits
    and form submissions in Plausible, matched by the UTM template below.
  Installing the tag later needs a consent decision and a privacy policy
  rewrite first; record that in `projects/clarity-consent/design.md`.
- **Conversions API, enhanced conversion tracking, and website
  conversions** are not set up. They would let LinkedIn see site actions such
  as a design partner application. The Conversions API sends events from our
  server, and enhanced conversion tracking adds a click ID (`li_fat_id`) to
  landing page URLs. Both send visitor data to LinkedIn, so they need the
  same privacy review as the tag before use. **[UI]**
- **UTM template** on every ad set:
  `utm_source=linkedin&utm_medium=paid&utm_campaign=<campaign slug>&utm_content=<ad slug>`.
- Lead generation optimizes for qualified leads when a Conversions API
  integration exists, and for leads otherwise.

### 5.2 What we report

| Level | Metric | Why |
|---|---|---|
| Delivery | Impressions, reach, frequency | Is the audience saturating? |
| Interest | Click-through rate, engagement rate, document completion, video views | Is the creative earning attention? |
| Action | Leads, conversions, cost per lead, cost per conversion | Is it producing outcomes? |
| Quality | Share of leads that match the persona and are worth a call | The metric that matters most |
| Pipeline | Conversations, design partner conversations, meetings | The reason the program exists |

Quality and pipeline come from our follow-up, not from LinkedIn. Section 7.5
assigns the person who records them.

---

## 6. Creative and brand rules

- Load `voice/style-guide.md`, `voice/stance.md`, `voice/vocabulary.md`, and
  `voice/examples/ai-tells.md` before writing ad copy. Run the
  `avoid-this.md` sweep, because ad copy is marketing language.
- No em dashes, no dash substitutes, no AI-sounding constructions, in ad copy
  and form text. Run `npm run voice:lint` on each ad copy file.
- Ad copy makes only claims the source article or deck supports. Statistics
  carry the same source discipline as articles.
- Use `voice/visual-identity.md`. Check legibility at phone size; for
  documents, apply the carousel check (body 38 px or larger, labels 28 px or
  larger, nothing clipped).
- Hashtags: three at most, at the end, on organic and Thought Leader posts.
- **Do not auto-publish.** A person reviews and launches every ad.

### 6.1 Testing

Run one variable at a time: hook line, image, or offer. Two to four ads per
ad set. Wait out the learning phase and give a test enough impressions to
mean something before changing it. Rotate creative before frequency climbs.
Replace fatigued ads with variants of the best performer.

---

## 7. The operating procedure

### 7.1 Roles

| Role | Does |
|---|---|
| **Owner** (rs) | Decides which campaigns get paid support, approves budget and audience, approves every ad before it goes Active |
| **Operator** | Builds campaigns, ad sets, and ads in Campaign Manager, uploads audiences, checks delivery, writes the weekly report |
| **Writer** | Produces ad copy and form text through the voice documents |

One person can fill several roles, but the owner approval step is never
skipped. Budget approval is the owner's alone.

### 7.2 Steps for each paid campaign

1. **Select the asset.** A published, approved piece from the campaign file.
   It must be live, or going live the same day.
2. **Write the ad brief** (half a page, in the campaign file under *Paid
   support*): asset, audience, route, format, objective, conversion, window,
   success measure.
3. **Get the owner's approval** of the brief and budget (budget stays in the
   private archive).
4. **Build the audience** and check its size after location.
5. **Write the copy** and form text. Run the voice sweeps and lint.
6. **Build the creative** to the specs in section 2.3.
7. **Set up tracking** (section 5.1).
8. **Build** the campaign, ad sets, and ads (sections 3.4 to 3.7), all in
   Draft, with a lifetime budget and end date.
9. **Pre-launch check** (7.3). The owner approves.
10. **Launch** by setting the campaign and ads Active. Add the ad to the
    campaign file's asset table as `scheduled`, then `active`. Update the
    GitHub Issue and Project item per `github-setup.md`.
11. **Monitor.** First 48 hours: delivery, disapproval, the form, the landing
    page. Then weekly.
12. **Optimize** within section 6.1.
13. **Close.** At the end date, pause, export results, write the retro in the
    campaign file, update the calendar and Project. Lead follow-up continues
    under 7.5.

### 7.3 Pre-launch checklist

- [ ] The asset is live and the landing URL resolves
- [ ] UTM template on every ad set
- [ ] Audience size checked after location; exclusions applied
- [ ] Campaign lifetime budget and end date set
- [ ] Objective correct for the goal (it cannot be changed after launch)
- [ ] Placements set as intended (3.3)
- [ ] Voice sweeps and `voice:lint` clean
- [ ] Creative legible at phone size, nothing clipped
- [ ] Lead Gen Form tested; privacy policy linked; thank-you page links to
      the asset
- [ ] Gated Document ad: preview page count set; file is a PDF
- [ ] Lead generation: the form is attached and leads are counted. Website
      visits: the UTM template is set (no Insight Tag; see 5.1)
- [ ] Thought Leader Ad: the author approved this exact post, and the post is
      an eligible type
- [ ] Owner has approved the live ad

### 7.4 Cadence

| When | What |
|---|---|
| Launch plus 48 hours | Delivery and disapproval check |
| Weekly | Report: spend against budget, delivery, interest, action; one decision (keep, change, stop) |
| End of window | Retro in the campaign file |
| Monthly | Audience saturation, creative rotation, lead quality review with the owner |
| Quarterly | Review the paid program against the plan, and re-verify this file |

### 7.5 Leads

Leads from a Lead Gen Form can be downloaded as a CSV or synced to a CRM or
marketing automation partner. Until a sync exists, the operator downloads
weekly. Each lead gets a human reply within two working days, in the house
voice and not as an automated sequence. The operator records each lead's fit
and next step, so the quality metric exists.

### 7.6 Compliance and care

- Contact list uploads need consent and a lawful basis. Do not upload a list
  we cannot defend.
- The Insight Tag stays off the site (5.1). Reopening that needs a consent
  decision and a privacy policy rewrite before any code changes.
- Do not target on sensitive categories.
- Do not pay to promote a claim that has not cleared the content program's
  source and fact discipline.
- Keep competitor mentions out of ad copy.
- Never commit budgets, billing details, audience lists, or ad account
  identifiers to this repo.

### 7.7 Records

| Record | Home |
|---|---|
| Campaign theme, paid asset table, retro | `campaigns/<slug>.md` |
| Ad briefs and copy | `articles/<slug>/` for the piece, or the campaign file's *Paid support* section |
| Status and dates | GitHub Project (*Pipeline status*, *Publish date*) |
| Budgets, audiences, targeting, account identifiers, raw exports | Private archive |
| Program plan | `linkedin-ads-plan.md` |

---

## 8. Common mistakes

- Choosing the wrong objective. It cannot be changed after launch, so a wrong
  choice means rebuilding the campaign.
- Putting founder posts that carry a document into Thought Leader Ads. They
  are not eligible.
- Gating a one-page document. At least one page must be a preview.
- Uploading a DOCX or PPTX for a lead generation Document ad. Use PDF.
- Too many form fields.
- Judging an ad set during its learning phase.
- Two ad sets that overlap on the same audience, so they bid against each
  other.
- Leaving the Audience Network on without meaning to.
- Letting a campaign run past its window because no end date was set.

## 9. Open items in this file

| Item | Why open |
|---|---|
| Current minimum daily and lifetime budgets | Newer help page says the interface shows it; older pages say $10 and $100 |
| Auction mechanics | Not described in the help pages we read |
| Lead Gen Forms on Thought Leader Ads | Not confirmed |
| Flexible versus standard ad creation method | Described in LinkedIn's guide, not detailed |
| Exact menu labels and rename effects on the API | Check in Campaign Manager and the API docs |

## 10. Sources checked

- [LinkedIn Ads Guide](https://business.linkedin.com/advertise/ads/ads-guide)
- [Marketing objectives available for your ad campaigns](https://www.linkedin.com/help/lms/answer/a424570)
- [Campaign and ad set budgets](https://www.linkedin.com/help/lms/answer/a422101)
- [Campaign and ad set bidding strategies](https://www.linkedin.com/help/linkedin/answer/a421112)
- [Create campaigns](https://www.linkedin.com/help/lms/answer/a424128)
- [How to create a LinkedIn advertising campaign](https://business.linkedin.com/advertise/ads/best-practices/create-your-first-campaign)
- [Lead Gen Form specifications](https://www.linkedin.com/help/lms/answer/a423364)
- [Create document ads in Campaign Manager](https://www.linkedin.com/help/lms/answer/a733950)
- [Thought Leader Ads](https://www.linkedin.com/help/lms/answer/a1399568) and [Create thought leader ads](https://www.linkedin.com/help/lms/answer/a5965137)
- [Matched Audiences best practices](https://www.linkedin.com/help/lms/answer/106247)
- [Conversions API setup](https://www.linkedin.com/help/lms/answer/a1657171) and [Insight Tag conversion tracking](https://www.linkedin.com/help/lms/answer/a425606)
- [Social Media Today on the Campaign Manager rename](https://www.socialmediatoday.com/news/linkedin-updates-advertising-campaign-naming-conventions/761534)
