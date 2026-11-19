# Task 040: Graph mail client

**Phase:** 4 (Mailbox sync)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 003 (run by Ralph in the tenant)
**Tags:** typescript, azure, api

## Goal

`src/lib/market/graph-mail.ts` reads message metadata from one mailbox's Inbox and Sent Items since a checkpoint, and recognizes non-delivery reports, using app-only credentials limited by Exchange RBAC.

## Context

FR-07, NFR-02, NFR-05. The fetch pattern, token cache and retry are those of `src/lib/meet/graph.ts`. Only metadata is read: `$select` limits the fields, so no body ever crosses the wire except what bounce detection needs.

## Steps

1. Settings from app settings (names fixed in task 003); null when unset, so sync reports "not configured" instead of failing.
2. `listMessagesSince(mailbox, folder, sinceIso)`: `GET /users/{mailbox}/mailFolders/{inbox|sentitems}/messages?$filter=receivedDateTime ge {since}&$select=id,internetMessageId,from,toRecipients,ccRecipients,subject,receivedDateTime,sentDateTime,webLink&$orderby=receivedDateTime&$top=50`, following `@odata.nextLink`.
3. `isBounce(message)`: sender `postmaster@` or `MAILER-DAEMON@`, or subject patterns ("Undeliverable:", "Delivery Status Notification", "Mail delivery failed"); for bounces only, fetch `body` with `Prefer: outlook.body-content-type="text"` and extract the failed recipient address; discard the body after extraction.
4. Map Graph 403 `ErrorAccessDenied` to a typed `NoMailboxAccess` error, so the registry can show "This mailbox is not in the Exchange access scope yet."
5. A local check script `scripts/check-market-mail.mts` that lists the last day's metadata counts (not content) for a mailbox given on the command line, like `npm run meet:graph`.

## Expected outputs

- `src/lib/market/graph-mail.ts`
- `scripts/check-market-mail.mts`, `package.json` script

## Acceptance criteria

- [ ] Against an in-scope mailbox the check script prints counts per folder.
- [ ] Against an out-of-scope mailbox it reports `NoMailboxAccess` and exits cleanly.
- [ ] No message body is kept anywhere except during bounce parsing.

## Notes

- Spec references: FR-07, NFR-02, NFR-05.
