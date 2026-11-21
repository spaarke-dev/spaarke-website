# Task 030: Port calculator model and tests

**Phase:** 3 - Calculator
**Status:** complete (draft)
**Estimated:** 2-4 hours
**Dependencies:** 001
**Tags:** typescript, testing

## Goal

Prototype model, defaults and Sankey mapping in the site, with the tests on Node's built-in test runner (design section 7).

## Context

See `../spec.md` and the design sections named in the goal.

## Steps

1. Copy model.ts, defaults.ts and sankeyData.ts with behavior unchanged
2. Port model.test.ts to node:test and node:assert
3. Add the `test:services` script; add d3-sankey
4. Verify the acceptance criteria are met
5. Update TASK-INDEX.md: mark this task complete

## Expected Outputs

- `src/components/services/calculator/*`
- `package.json`

## Acceptance Criteria

- [x] All 18 tests pass, including the GUARDRAIL tests
