# Spaarke MSO Value Estimate: Build Handoff for Claude Code

This folder is a working reference build of the "MSO value estimate" section for the Spaarke website. Rebuild it inside the website's own codebase, using its framework, components and design system. Keep the model logic and copy exactly as specified here.

## 1. Purpose and story

The page shows a prospective IP boutique how a firm-owned MSO achieves three objectives:

1. **Higher margins.** Run the firm for less: operating efficiency lifts margins and profit.
2. **Technology edge.** Compete with larger firms and AI-first rivals: Spaarke funds and maintains the platform, freeing lawyer time for new work.
3. **Long-term value.** Own equity the partnership never had: an equity stake in the firm's MSO, annual MSO profit, and an option to roll into the Spaarke platform at exit.

Visitors don't adjust assumptions. They pick a firm size, or set three numbers, and see plausible results based on our representative assumptions.

## 2. Files in this folder

| File | Role | Port to the website? |
|---|---|---|
| `model.js` | Pure calculation module, no DOM. The single source of truth. | Yes. Port to TypeScript unchanged in logic (for example `lib/msoModel.ts`). |
| `model.test.js` | Golden values for the three presets plus a guardrail case. | Yes. Convert to the site's test runner (Vitest or Jest). Tests must pass. |
| `index.html`, `simple.js`, `simple.css` | Reference UI: the main section and the details dialog. | Use as a visual and behavioral reference. Rebuild with site components. |
| `style.css` | Shared tokens (dark and light themes). | Map to the site's existing tokens. Don't copy wholesale. |
| `advanced.html`, `advanced.js` | Internal detailed model with every assumption adjustable. | No. Internal use only, not for the public site. |

Run the reference locally with `npx serve .`, or any static server, and open `index.html`.

## 3. Page structure

### On the page (main section)

1. **Headline:** "Run leaner, compete on technology, and build equity"
2. **Lede:** "Your firm moves its back office and technology into an MSO it owns. Spaarke funds and runs the platform. The firm puts in no cash and stays fully lawyer-owned."
3. **Inputs card:**
   - Preset buttons: Small boutique, Mid-size boutique (default), Large boutique.
   - Three sliders: Equity partners, Other attorneys and patent agents, Annual revenue.
   - Moving any slider clears the active preset.
4. **Three objective cards.** Each has a number badge, title, subtitle, one large hero figure with a caption, and three supporting facts. See section 5 for content.
5. **Summary bar:** one sentence with the annual partner-profit gain and the equity stake, plus a primary **"See the details"** button.
6. **Disclaimer** (small text).

### Behind "See the details" (modal or separate page)

The reference uses a native `<dialog>`. Use the site's modal component, or a route such as `/mso/estimate/details` that reads the inputs from query parameters. Either way, the details must reflect the inputs currently selected on the main section.

1. **Waterfall chart:** "Where the extra profit per partner comes from". Bars: Today → Lower MSO fee → MSO profit share → New matters (freed time) → New client services → With the MSO. Value labels sit above the bars, and the y-axis starts near 70% of today's profit per partner.
2. **"Today vs with the MSO" table.**
3. **"How it works":** three numbered steps with dynamic numbers.
4. **"The structure":** Law firm → (fixed fee) → Firm's MSO → (platform licence) → Spaarke.
5. **"Our assumptions":** the full list.

## 4. Model specification (`model.js`)

Inputs are `partners` (P), `attorneys` (A) and `revenue` (R). The assumptions are constants in `ASSUMPTIONS`.

**Guardrails, applied in this order:**

1. Revenue is clamped to between \$400k and \$1.2M per lawyer, where lawyers = P + A. The slider's min and max update to match.
2. Operating cost today: `opex = R − P × 650k − A × 210k`, clamped to between 30% and 55% of R.
3. Profit per partner: `(R − A × 210k − opex) / P`, clamped to between \$300k and \$1.5M. Then opex is recomputed as `R − comp − ppp × P`.

**With the MSO:**

- `scope` = 60% of opex (moves to the MSO)
- `fee` = scope × 0.90 (fixed fee, 10% below today's cost)
- `feeSaving` = scope − fee
- `msoCost` = scope × 0.70 + scope × 0.08 (30% efficiency, plus the Spaarke licence)
- `ebitda` = fee − msoCost
- `share` = ebitda × 0.75 (the firm's share)
- `hoursFreed` = (P + A) × 1,700 × 10%
- `growthRev` = R × 10% × 50%; `growthProfit` = growthRev × 80%
- `svcRev` = R × 2%; `svcProfit` = svcRev × 50%
- `deploymentFunded` = scope × 10%
- `revenue2` = R + growthRev + svcRev
- `opex2` = opex − feeSaving
- `profit2` = revenue2 − comp − opex2 − (cost of new work) + share
- `firmValue` = ebitda × 6 × 0.75
- `firmValuePlatform` = share × 10

**Golden values** (from `model.test.js`):

| Preset | Inputs (P / A / R) | Margin | Profit per partner | Hours freed | Deployment funded | MSO profit to firm | Equity stake | Platform roll-up | Partner profit gain |
|---|---|---|---|---|---|---|---|---|---|
| Small | 3 / 4 / \$3.5M | 46.0% → 50.9% | \$537k → \$635k | 1,190 | \$63k | \$57k | \$340k | \$567k | \$295k |
| Mid | 5 / 7 / \$9.0M | 36.1% → 43.5% | \$650k → \$838k | 2,040 | \$257k | \$231k | \$1.39M | \$2.31M | \$938k |
| Large | 12 / 18 / \$25M | 31.2% → 39.6% | \$650k → \$882k | 5,100 | \$805k | \$725k | \$4.35M | \$7.25M | \$2.78M |

## 5. Objective card content (mid preset shown)

| Card | Hero | Fact 1 | Fact 2 | Fact 3 |
|---|---|---|---|---|
| 1 Higher margins: "Run the firm for less" | `36% → 43%` profit margin | `22%` lower cost to run the back office | `$257k a year` saved on day one through a fixed fee below today's cost | `+29%` profit per partner, \$650k to \$838k |
| 2 Technology edge: "Compete with larger firms and AI-first rivals" | `2,040` lawyer hours freed a year | `$257k` AI platform and migration funded by Spaarke, not the firm | `+7% revenue`, \$630k from new matters and new client services | `Kept current`: platform upgrades included, with a market-parity commitment |
| 3 Long-term value: "Own equity the partnership never had" | `$1.39M` equity stake in your MSO | `$231k a year`, the firm's 75% share of MSO profit | `Up to $2.31M` if the stake rolls into the Spaarke platform at 10x | `$0` cash invested by the firm |

**Summary line:** "For a firm like this, partner profit rises by about **\$938k a year**, and the firm builds an equity stake worth about **\$1.39M** without putting in any cash."

**Money format:**

- \$1M and above: `$X.XXM` (one decimal at \$10M and above).
- \$1k and above: `$XXXk`.
- Percentages are whole numbers.

## 6. Design requirements

- Use the site's design system. The reference uses a deep slate dark theme with a teal accent (`#3fb8a4` dark, `#0d7a6a` light), Switzer for body text and Zodiak for the headline. Map these to the site's tokens.
- Support dark and light themes if the site does.
- Responsive:
  - Three objective cards side by side on desktop, stacked below 900px.
  - Sliders: three columns on desktop, one on mobile.
  - The modal goes full-screen on mobile.
- The chart can use Chart.js (as the reference does) or the site's chart library. Keep the waterfall form and the value labels.
- Accessibility:
  - Sliders have labels and visible values.
  - The objective section uses `aria-live="polite"`.
  - The modal traps focus and closes with Esc and the close button.
- No cookies or local storage are needed. State lives in component state, or in query parameters if the details use a separate route.

## 7. Acceptance criteria

1. The ported model passes the golden-value tests and the guardrail test (2 partners, 18 attorneys, \$60M input → revenue clamped to \$24M, profit per partner \$1.5M).
2. The mid preset loads by default and matches section 5 exactly.
3. The details view reflects the current inputs.
4. There is no horizontal scroll at 375px, and no text is clipped in the cards, table or chart labels. On narrow screens, use the short chart labels: Today, Lower fee, MSO share, New matters, New services, With MSO.
5. The disclaimer is visible on the main section.
