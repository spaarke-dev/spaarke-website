# Spaarke MSO structure visual: Claude Code handoff

Replaces the "What is managed legal operations" law firm / MSO two-card graphic in the dark section of the site.

## Model shown
- The law firm stays 100% lawyer-owned and keeps the practice: lawyers, clients, legal fees, client data and the firm name.
- Spaarke owns 100% of each firm's dedicated MSO and runs it on its platform. Spaarke funds the deployment, so the firm puts in no cash.
- The firm directs the day-to-day work. The same staff move to the MSO, there is a joint operating committee and agreed service levels, and lawyers supervise staff on client matters.
- Money: clients pay the firm. The firm pays the MSO a fixed fee at fair market value, never a share of legal fees. The MSO pays Spaarke a platform licence, and its profit goes to Spaarke as owner ("Fee + profit").
- Value: the firm receives equity in Spaarke, which owns every MSO on the network.
- Copy is general to all law firm specialties.

## Files
- `index.html`: section markup (header, five tabs, wide and tall diagram containers, legend, caption grid, guardrail line).
- `structure.css`: dark tokens (`--ms-*`, plus `--c-own`, `--c-money`, `--c-svc`, `--c-ctrl`, `--c-value`) and SVG styles. Map these to the site's design tokens.
- `structure.js`: renders two SVGs from data. `NODES`, `EDGE_LABELS` and `CAPTIONS` hold the content. `WIDE` (1130x640, shown above 760px) and `TALL` (372x1330, mobile) hold the layout coordinates.

## Behaviour
- Tabs set `data-view` on the section: `all`, `own`, `ctrl`, `money` or `value`. CSS dims the edges that don't match the view, and the three caption cards change with it.
- Edge types: `t-own` (violet), `t-money` (amber), `t-svc` (slate), `t-ctrl` (pink, firm direction) and `t-value` (teal, dashed). An `also-*` class shows an edge in a second view.
- The diagram is `aria-hidden`. The caption cards and the guardrail sentence carry the meaning for screen readers. Reduced motion is respected.

## Port notes
- In React or Next, port `render()` into a component, or hand-write the SVG as JSX from the same coordinates. Keep the content arrays as props or a JSON file.
- If a label changes length, check that its pill still fits between the cards. The gap between the MSO and Spaarke cards is about 110px in the wide layout.
