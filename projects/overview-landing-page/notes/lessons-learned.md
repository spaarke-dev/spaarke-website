# Lessons learned: Design Partner Page

Written at wrap-up, 2026-11-12.

## A preview check that only reads the page misses reCAPTCHA

Task 031 confirmed the reCAPTCHA site key was on the page and that the API
rejected missing and invalid tokens. All of that passed, and a real
submission still failed: the key only allows `spaarke.com`, so Google refused
to issue a token on the `azurestaticapps.net` preview. The form showed its
"couldn't verify the reCAPTCHA" message and nothing reached the server.

For the next form tested on a preview, either add the preview hostname to the
key's domains before the test or plan to test in production. To check a
hostname without submitting anything, request the reCAPTCHA anchor URL for it
and look for "Invalid domain for site key" in the response.

## A branch that waits three weeks needs main merged before the final test

The branch fell 25 commits behind `main` while it waited on the test
submission. Merging `main` in before the test meant the preview the writer
tested matched what production would get. It also surfaced the one conflict
early: `main` had added an accelerator reason to the contact form's reason
list while the branch renamed another entry in the same list.

## Keep the shared reason list the single source

The contact form and the API both import `VALID_REASONS` from
`src/lib/contact.ts`. The merge conflict was easy to resolve because there was
one list to fix. Before that list was shared, the form and the validator had
drifted apart until three of four reasons were rejected on submit.

## Order the checks that delete data last

The plan listed "the next daily report lists the application" before
"delete the test row", but the recovery notes put the delete straight after
the table check. Deleting first left the daily report check with nothing to
find. When a check depends on test data, say so next to the delete step.

## Watch the deploy run, not the latest run

`gh run list --branch main --limit 1` returned a scheduled "Keep warm" run,
not the deploy. Filter by workflow name (`--workflow "Azure Static Web Apps
CI/CD"`) before watching.
