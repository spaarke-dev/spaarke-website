# Task 072: Structure visual and operator network

**Phase:** 2 - Sections
**Status:** complete (draft)
**Dependencies:** 031
**Tags:** react, svg, tailwind, accessibility

## Goal

Build the two design handoffs the owner supplied on 2026-11-22, matched to the rest of the site:

1. The MSO structure visual (`notes/mso-structure-visual/`) in "What is Managed Legal Operations", in place of the allocation diagram.
2. The operator and member network (`notes/mso-operator-network/`) in the network section, converted from a light to a dark background, in place of the old hub diagram and its four blocks.

## Built

- `src/components/services/StructureDiagram.tsx`: the handoff's `render()` as JSX, with the same wide (1130 x 640) and tall (372 x 1330) coordinates. Tabs dim edges and nodes by view and swap the caption cards.
- `src/components/services/OperatorNetwork.tsx`: the handoff's hub as JSX, on dark tokens. Step tabs, ring-to-card hover, pulses at full size, and the illustrative equity pie (law firm view only). Coordinates are rounded so the server and browser render the same SVG.
- `src/components/services/PillTabs.tsx`: shared numbered pill tabs with arrow-key support.
- Copy in `content.ts`: `structure` (new) and new fields on `network`, for both audiences.

## Decisions

- Site look over the handoffs' own: site fonts, dark band tokens, site blue for the MSO accent, left-aligned section heads.
- The five edge colors and teal stay, because they carry meaning.
- The legal department copy is new: no equity, the company keeps the legal function, and outside firms on the same platform in place of the equity panel.

## Open

- Fee basis wording: "fair-market-value study" in the structure visual against "cost-based" elsewhere.
- Counsel on the law firm equity copy; owner read of the department copy.
- Remove `AllocationDiagram.tsx` and `NetworkDiagram.tsx` after sign-off (task 060).
