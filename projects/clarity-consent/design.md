# Clarity cookies and consent: design

Status: decided, 2026-10-22. Option B was chosen, because the team does not
use Clarity's session recordings. The owner turned cookies off in the Clarity
project settings, and the privacy policy was rewritten to match in PR #124
(commit 90a773c). The daily report's Clarity traffic section is unchanged for
now, although its session counts now count page views; revisit it later. No
spec is needed.

## 1. The problem

The privacy policy says the site does not need a cookie banner "because we
don't set non-essential tracking cookies." Microsoft Clarity sets two
first-party cookies, `_clck` and `_clsk`, to connect page views into a
session and sessions into a returning visitor. They are analytics cookies,
and under the EU ePrivacy rules and the UK's PECR, analytics cookies need
the visitor's consent before they are set. The sentence is therefore
inaccurate for some visitors, and the policy's table lists Clarity's cookies
as "First-party only" without saying where they apply.

Google reCAPTCHA also sets a cookie, but only on pages with a form, and it is
used to stop automated abuse. Regulators generally treat security cookies of
that kind as strictly necessary, which needs no consent, but the policy
should say so rather than leave it implied.

## 2. What Microsoft already does

Since 31 October 2025 Clarity enforces consent for visits from the European
Economic Area, the United Kingdom, and Switzerland. Its documentation says
consent mode "is enabled by default for all users originating from" those
regions: Clarity sets no cookies there until the site sends a consent signal
through its `consentv2` API, and it "assigns a unique ID per page view" in
the meantime. Spaarke's site sends no consent signal, so visitors from those
regions are already tracked without cookies, page by page.

Two things are unconfirmed: that the regional default is active on Spaarke's
Clarity project (Settings, Setup, Cookies), and how Clarity decides where a
visitor is.

## 3. Options

| | A. Rely on the regional default, fix the policy | B. Cookies off for every visitor | C. Consent banner |
|---|---|---|---|
| What changes | The Clarity setting is checked; the policy is rewritten to describe what happens | The Clarity project's cookie setting is turned off | A banner, a stored choice, and a `consentv2` call on each page |
| Code | None | None | A banner component, storage, and the Clarity call |
| Visitors in the EEA, UK, Switzerland | No cookies (as today) | No cookies | Cookies only if they accept |
| Other visitors | Cookies, disclosed in the policy | No cookies | Cookies, or a banner for everyone |
| Analytics cost | None beyond today | Every page view counts as a new session everywhere, so cross-page journeys, returning visitors, and the daily report's Clarity session counts lose meaning | Only for visitors who decline |
| Fits the site's stance ("no tracking banner") | Yes | Yes, most simply | No |

## 4. Recommendation

Option A. Most of the site's audience is in the United States, where
first-party analytics cookies need disclosure rather than opt-in consent, and
the policy will disclose them. Visitors from the regions that require consent
already get cookie-free tracking from Microsoft's default. The site keeps its
journey data and its daily report numbers, and adds no banner.

Choose B instead if the team does not use Clarity's cross-page views, or wants
the policy to say simply that the site sets no analytics cookies anywhere.

## 5. The work for option A

1. **Confirm the Clarity setting.** In the Clarity project, Settings, Setup:
   record whether cookies are on and whether the regional consent default is
   shown. Record the result in this project's notes.
2. **Verify behavior.** In a browser, run Clarity's console check
   (`clarity('metadata', …)`) to read the consent state, and confirm `_clck`
   and `_clsk` appear for a United States visit. Verifying the EEA behavior
   needs a visit that originates from the EEA, through a VPN or a remote
   browser in that region.
3. **Rewrite the policy.**
   - "What we don't do": replace the cookie-banner sentence with an accurate
     one: the site sets no advertising cookies; Clarity sets first-party
     analytics cookies for visitors outside the EEA, the UK, and
     Switzerland, and runs without cookies for visitors inside them; reCAPTCHA
     sets a security cookie on pages with a form.
   - The table's "Cookies?" column for Clarity: "First-party, outside the
     EEA, UK, and Switzerland".
   - The Clarity section: name the two cookies, what they do, and how long
     they last (from Clarity's cookie documentation), and how to remove them.
4. **Review.** Typecheck, lint, voice lint on the new text, a pull request,
   and the preview.

## 6. Out of scope

- Global Privacy Control and US state opt-out signals. Clarity's data is
  used to operate this site, not sold or shared for advertising, so the
  policy's existing statements cover it; revisit if an advertising pixel
  such as the LinkedIn Insight Tag is added.
- Plausible, which sets no cookies.

## 7. Open questions

- Does anyone on the team use Clarity's session recordings or journeys across
  pages? If not, option B costs nothing that is used.
- Will the LinkedIn Insight Tag be added for ad measurement? It is an
  advertising cookie, needs consent in the EEA and UK, and would change this
  design toward option C.

## Sources

- Microsoft Clarity, Consent Mode:
  https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode
- Microsoft Clarity, Consent API v2:
  https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
