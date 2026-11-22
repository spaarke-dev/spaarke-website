# Spaarke MSO network section: Claude Code handoff

Replaces the existing "One operator. A network that gets stronger with every member." hub graphic. This section sits on a light background.

## Story
1. Spaarke, the MSO operator, sits at the centre and owns and runs every member's MSO.
2. A ring of six capabilities surrounds the hub, each matched to a numbered card.
3. "Your law firm" sits at the top, and other members (law firms and legal departments, each with its own MSO) fill in around the hub.
4. Two payoffs: what your firm can offer (capabilities unlock as the network grows), and what your firm owns (equity in Spaarke, a smaller share of a larger company).

## Files
- `index.html`: section markup (header, three step tabs, wide and tall diagram containers, legend, capability cards, flywheel line, two payoff panels).
- `network.css`: a small shared base, plus light tokens scoped to `.mso-network` (`--n-*`). Map these to the site's design tokens.
- `network.js`: builds the hub SVG and drives the steps.

## Content in `network.js`
- `MEMBERS`: the reveal order. Index 0 is "Your law firm".
- `CAPS`: the ring segment labels. They must match the six `.nw-capgrid` cards in the HTML.
- `STEPS`: the per-step copy for the two panels, plus the illustrative pie values (`r`, `pct`).

## Behaviour
- The step tabs set `data-size` to 1, 3 or 8 (mobile shows 6 spokes). This fills the spokes, unlocks capability rows (`data-at` on each `li`), and animates the equity pie and the "size of your slice" bar.
- Hovering a ring segment highlights its card, and hovering a card highlights its segment.
- At full size, moving pulses run along the spokes.
- Mobile uses a separate tall layout, with the MSO badge inside each member box and numbers only in the ring.
- The diagram is `aria-hidden`; the cards and panels carry the content. Reduced motion is respected.

## Notes
- The pie and the value bar are illustrative and are labelled that way. Equity terms are set at signing.
- In the wide layout, MSO pills sit at a fixed distance outside the ring (`r1 + 44`).
