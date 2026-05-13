# Task 031: Extend publish CLI for `--target=company`

**Phase:** 3 — Company-page publishing (gated)
**Status:** blocked — waits on 030
**Estimated:** 30 minutes
**Dependencies:** 011, 030
**Tags:** linkedin, cli, scope-extension

## Goal

`pnpm linkedin:publish --target=company` works end-to-end against
the Spaarke Company Page.

## Context

The code path is already identical — only the `App` selection
changes (`company` → `org`) and the `authorUrn` will start with
`urn:li:organization:`. So this task is mostly verification, not
new code.

## Steps

1. Verify the `--target` arg in `linkedin-publish.ts` already handles `company` → maps to `App = "org"`. If not (task 011 left it as personal-only stub), fix the mapping.
2. Test that everything wired correctly:
   ```bash
   pnpm linkedin:publish --slug=the-iq-stack --target=company --dry-run
   ```
   The output should show:
   - `author: urn:li:organization:<id>` (not person)
   - Uses `linkedin-org-access-token` from KV
3. Update the error-mapping table to include the 403 message variant for company permission issues ("must be ADMINISTRATOR on the Spaarke Company Page").
4. Update `linkedin-shared.ts` if needed so the `App` enum mapping is explicit.

## Expected Outputs

- `scripts/linkedin-publish.ts` — minor updates to ensure `target=company` flows
- Possibly `scripts/linkedin-shared.ts` — minor type-narrowing update

## Acceptance Criteria

- [ ] Dry-run with `--target=company` shows organization URN in the body.
- [ ] Real run posts to the Spaarke Company Page (test via task 032).
- [ ] All existing personal-target tests still pass.

## Notes

- If the code already handled this cleanly from task 011, mark this task complete after the dry-run check.
- The Images API call uses the same `authorUrn` for the upload owner — make sure that flows through.
