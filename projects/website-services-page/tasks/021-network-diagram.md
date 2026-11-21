# Task 021: Operator network diagram

**Phase:** 2 - Diagrams
**Status:** complete (draft)
**Estimated:** 2-4 hours
**Dependencies:** 010
**Tags:** react, svg, animation

## Goal

SVG hub (Spaarke operating company with capabilities) and client and MLO pairs, gray and blue lines, pulse, legend (design 4.5 and 6.2).

## Context

See `../spec.md` and the design sections named in the goal.

## Steps

1. Compute pair positions around the hub
2. Line draw and pulse animations with a reduced-motion state
3. Copy blocks beside or below the diagram
4. Verify the acceptance criteria are met
5. Update TASK-INDEX.md: mark this task complete

## Expected Outputs

- `src/components/services/NetworkDiagram.tsx`

## Acceptance Criteria

- [x] Pair labels flip with the audience
- [x] Legend explains both line types
