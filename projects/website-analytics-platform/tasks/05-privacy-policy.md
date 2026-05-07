# T05 — Privacy policy update

**Phase**: 0
**Wave**: 4
**Dependencies**: T01, T02, T04 (need the actual implementation
before disclosing it accurately)

## Goal

Update the site's privacy policy at `src/app/privacy/page.tsx` to
disclose all the new analytics tools and the first-party
attribution mechanism. The wording matters — Spaarke's audience
includes corporate counsel who will read this. The disclosure
should be:

- Specific (names the tools).
- Plainspoken (no legal-cosplay euphemism).
- Reflective of what we actually do (no over-claiming, no
  under-claiming).
- Easy to act on (links + opt-out info).

## Reads (required context)

- `projects/website-analytics-platform/spec.md` §7 (privacy posture).
- The actual current state of the implementation:
  - `src/components/analytics/PlausibleScript.tsx`
  - `src/components/analytics/ClarityScript.tsx`
  - `src/lib/attribution.ts`
  - `middleware.ts` (AI crawler logging)
- `src/app/privacy/page.tsx` — current content.
- Plausible's privacy stance: <https://plausible.io/data-policy>
- Clarity's privacy stance:
  <https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-consent>

## Deliverables

### Update `src/app/privacy/page.tsx`

Add a section titled "Analytics and Telemetry" (or similar — match
the existing page's heading register). Place it near the top of the
"How we use information" / equivalent section, before any unrelated
material.

The section should disclose, in this order:

1. **What we don't do.** Lead with this — sets the frame.
   - We do not use third-party advertising trackers.
   - We do not build cross-site behavioral profiles.
   - We do not require a cookie banner because we don't use
     non-essential tracking cookies.

2. **Plausible Analytics.** What it is, what it captures, link to
   their privacy policy. Plausible is cookieless, GDPR/CCPA/ePrivacy
   compliant by design.

3. **Microsoft Clarity.** What it is, what it captures (anonymous
   session recordings with form-input fields auto-masked), link to
   their privacy practices. Note that recordings exclude any text
   typed into form fields.

4. **First-party attribution storage.** A short paragraph explaining
   the `spk_attribution_v1` localStorage entry — that it's first-
   party, contains no PII, persists 90 days, and is only used to
   attribute the visitor's own form submissions to their original
   referrer.

5. **Azure Application Insights.** Server-side telemetry — error
   rates, request performance, AI crawler visits. No client cookies.
   Used for engineering operations, not behavioral profiling.

6. **AI crawler logging.** A note that we record which AI crawlers
   visit the site (e.g., GPTBot, ClaudeBot) for our own awareness of
   how the site is being indexed for AI citations. No personal data
   captured.

7. **What you can do.**
   - Clear localStorage / Site Data in your browser to remove the
     attribution snapshot.
   - Use a Tracking Protection / Privacy Badger / etc. browser
     extension — Plausible and Clarity both honor opt-outs.
   - Email <privacy@spaarke.com> (if such an address exists — verify
     with the team; if not, use the existing contact route) to
     request data deletion or for any privacy questions.

### Tone and structure suggestions

- Plain prose, short paragraphs, no legalese. The existing privacy
  page sets the register — match it.
- A short table can help: "Tool | What it sees | Cookie? | Link to
  their policy."
- Don't bury — this section should be readable in 2-3 minutes.

### Length and format

- Target ~400-700 words for the new section.
- Markdown / JSX as the existing page uses; don't introduce a new
  formatting model.
- Add a "Last updated: YYYY-MM-DD" line if the page already has one;
  otherwise add it.

## Acceptance criteria

- `src/app/privacy/page.tsx` has a clearly-labeled analytics section
  covering all six topics above.
- Each named tool has a working link to its primary privacy policy.
- Specifically calls out:
  - The `spk_attribution_v1` localStorage key by name.
  - The 90-day TTL.
  - That Clarity recordings auto-mask form-input fields.
- "Last updated" date present.
- `npm run typecheck` passes.
- The new section reads in plain prose — no boilerplate
  legal-template feel. A non-lawyer should be able to skim it and
  understand what we do.

## Out of scope

- Restructuring the rest of the privacy page.
- Translating to other languages.
- Adding a separate "Cookie Policy" page — the analytics-section
  approach is sufficient given the no-cookie posture.
- Drafting Terms of Service updates.

## Prompt

> Phase 0, T05 of the Spaarke website analytics platform.
>
> Read `projects/website-analytics-platform/spec.md` §7,
> `projects/website-analytics-platform/tasks/05-privacy-policy.md`
> (this file), and the current
> `src/app/privacy/page.tsx`. Then briefly inspect what was actually
> wired in T01/T02/T04 so the disclosure is accurate.
>
> Update `src/app/privacy/page.tsx` to add an "Analytics and
> Telemetry" section disclosing: what we don't do (lead with this),
> Plausible, Microsoft Clarity, the spk_attribution_v1 localStorage,
> Azure Application Insights, AI crawler logging, and what users can
> do. Match the existing page's tone — plainspoken, not lawyer-y.
> ~400-700 words for the new section.
>
> Add or update a "Last updated" date.
>
> Don't restructure unrelated parts of the page.
> Run `npm run typecheck`.
