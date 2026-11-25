# Task 040: Follow-up steps

**Phase:** 4 (Follow-up steps)
**Status:** done
**Estimated:** 3 hours
**Dependencies:** 020
**Tags:** nextjs, react, api, storage

## Goal

Ralph adds, edits, orders, switches off and removes follow-up steps on a campaign, and can mark "Stop steps" on a member.

## Context

FR-09 and owner decision 5. A step says when a follow-up is due and for whom; the daily job (task 041) creates the follow-ups.

## Steps

1. `MaSteps` (partition campaign slug) and `src/lib/market/steps.ts`. A step has:
   - name (the follow-up's title);
   - days after an anchor: `first-email` or `first-meeting`;
   - who: `no-reply`, `engaged-no-meeting`, `met`, `everyone`;
   - optional group label;
   - order and on/off;
   - created and updated times.
2. Input checks: days from 0 to 365, a known anchor and audience, a group that exists in the campaign or is empty.
3. Routes under `/api/admin/campaigns/[slug]/steps` for add, edit, reorder, switch and remove.
4. `stopSteps` on a member, with a route and a switch on the campaign's member row and on the contact's membership.
5. On the campaign page, a "Follow-up steps" section: the list in order, each with a sentence like "7 days after first email, no reply, group A", and a form to add or edit.
6. Audit `step.create`, `step.edit`, `step.order`, `step.switch`, `step.delete`, `member.stop_steps`.
7. Checks: save, edit, reorder, switch off, remove, bad input refused, audit rows written.
8. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/steps.ts`
- `src/app/api/admin/campaigns/[slug]/steps/**/route.ts`
- A steps component on the campaign page; the stop switch on member rows
- Changes to `src/lib/market/tables.ts`, `campaigns.ts`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [x] Steps save, reorder and switch off, with an audit entry for each change.
- [x] "Stop steps" shows on the member and is audited.
- [x] The section works at 375 px and passes axe.

## Notes

- Removing a step keeps the follow-ups it already made.
- Spec references: FR-09, NFR-03, NFR-05.

## As built

- `src/lib/market/steps.ts`: `MaSteps` (partition campaign slug, row key a 12-character hex ID). `parseStep` checks days (whole, 0 to 365), anchor, audience, name (up to 120 characters) and group, and refuses other fields; `createStep` adds at the end of the order; `editStep` audits `step.switch` when only `enabled` changed, else `step.edit`; `reorderSteps` takes every step ID once; `deleteStep` leaves the follow-ups a step made. A group must be one a member of the campaign carries.
- `src/lib/market/step-text.ts`: the anchors, audiences and `describeStep` ("7 days after first email, no reply, group Tier A"), with no server imports so the form can show the sentence as it is typed.
- Routes: `POST /api/admin/campaigns/[slug]/steps`, `PATCH` and `DELETE .../steps/[id]`, `POST .../steps/order` with `{ ids }`.
- `stopSteps` on a member: kept when the member is added again or merged; set through the member `PATCH` with `{ stopSteps: boolean }`, audited as `member.stop_steps` only on a change.
- Campaign page: a "Follow-up steps" section (list in order with the sentence, On switch, Up, Down, Edit, Remove with a confirm) and a Stop steps box on each member row. The contact page has the same box on each campaign it belongs to.
- Checks: the sentence, bad input refused, and save, edit, switch, reorder, remove, the group check, Stop steps and the audit rows. 75 pass with fresh tables.
- Browser: every action through the page, Stop steps from the member row and from the contact, no sideways scroll at 375 px, and axe clean apart from the header contrast that predates this work.
