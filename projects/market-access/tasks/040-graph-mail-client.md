# Task 040: Graph mail client

**Phase:** 4 (Mailbox sync)
**Status:** done
**Estimated:** 3 hours
**Dependencies:** 003 (run by Ralph in the tenant)
**Tags:** typescript, azure, api

## Goal

`src/lib/market/graph-mail.ts` reads message metadata from one mailbox's Inbox and Sent Items since a checkpoint, and recognizes non-delivery reports, using app-only credentials limited by Exchange RBAC.

## Context

FR-07, NFR-02, NFR-05. The fetch pattern, token cache and retry are those of `src/lib/meet/graph.ts`. Only metadata is read: `$select` limits the fields, so no body ever crosses the wire except what bounce detection needs.

## Steps

1. Settings: reuse the `/meet` app (open question 1), so read `MEET_GRAPH_TENANT_ID`, `MEET_GRAPH_CLIENT_ID` and `MEET_GRAPH_CLIENT_SECRET` (reuse the token cache in `src/lib/meet/graph.ts` if it can be shared without coupling to `MEET_HOST`); null when unset, so sync reports "not configured" instead of failing.
2. `listMessagesSince(mailbox, folder, sinceIso)`: `GET /users/{mailbox}/mailFolders/{inbox|sentitems}/messages?$filter=receivedDateTime ge {since}&$select=id,internetMessageId,from,toRecipients,ccRecipients,subject,receivedDateTime,sentDateTime,webLink&$orderby=receivedDateTime&$top=50`, following `@odata.nextLink`.
3. `isBounce(message)`: sender `postmaster@` or `MAILER-DAEMON@`, or subject patterns ("Undeliverable:", "Delivery Status Notification", "Mail delivery failed"); for bounces only, fetch `body` with `Prefer: outlook.body-content-type="text"` and extract the failed recipient address; discard the body after extraction.
4. Map Graph 403 `ErrorAccessDenied` to a typed `NoMailboxAccess` error, so the registry can show "This mailbox is not in the Exchange access scope yet."
5. A local check script `scripts/check-market-mail.mts` that lists the last day's metadata counts (not content) for a mailbox given on the command line, like `npm run meet:graph`. Name it `market:mail`, as `docs/market-access-mailboxes.md` says.

## Expected outputs

- `src/lib/market/graph-mail.ts`
- `scripts/check-market-mail.mts`, `package.json` script

## Acceptance criteria

- [x] Against an in-scope mailbox the check script prints counts per folder.
- [ ] Against an out-of-scope mailbox it reports `NoMailboxAccess` and exits cleanly.
- [x] No message body is kept anywhere except during bounce parsing.

## Notes

- Spec references: FR-07, NFR-02, NFR-05.

## As built

- `src/lib/market/graph-mail.ts`: `getMailSettings` (the three `MEET_GRAPH_*` values, or null), `listMessagesSince` (an async generator over one folder, oldest first, following Graph's next links and stopping at `max`, 2,000 by default), `isBounce`, `bounceRecipientFromText` and `bounceRecipient`, `NoMailboxAccess` and `MailGraphError`.
- Its own token cache, not the one in `src/lib/meet/graph.ts`: sharing it would have meant changing the live booking code, and nothing here needs `MEET_HOST`.
- `$select` names only metadata fields. Addresses are normalized; Exchange-internal (X.500) addresses are left out; Graph's zone-less times are read as UTC.
- Throttling (429, 503, 504) is retried twice, waiting up to 10 seconds each time. Only links on graph.microsoft.com are followed.
- Errors: 403 `ErrorAccessDenied` becomes `NoMailboxAccess` ("This mailbox is not in the Exchange access scope yet."); 404 `ErrorInvalidUser` becomes "No mailbox with this address was found in the tenant." Error messages name the call as `/users/{mailbox}/...`, never the address.
- Bounces: an Inbox message from postmaster or mailer-daemon, or with a failure subject ("Undeliverable:", "Delivery Status Notification (Failure)", "Mail delivery failed" and similar; delay notices excluded). Only then is the text body fetched, the first 20,000 characters searched for the failed address (Exchange, Gmail, Postfix and DSN wordings, then a single remaining address), and the body dropped.
- `npm run market:mail -- <mailbox> [hours]` (`scripts/check-market-mail.mts`) prints counts per folder, distinct addresses, bounces and how many failed addresses were read. No subjects, addresses or content.
- Checks: one pure check against canned Graph responses (paging, the query, no body field, a foreign next link ignored, the cap, 403 and 404 mapping, throttling, bounce detection and five report wordings, the text body requested only for a bounce). 47 pass.
- Live, 2026-11-22, with the settings read from the app settings for the run only: the meet host mailbox (24 hours: 7 inbox, 0 sent; 30 days: 663 inbox, 222 sent, 13 bounces with the failed address read for all 13) and contactus@spaarke.com (7 days: 15 inbox). Both are in the scope.
- Not yet run: a real mailbox outside the scope. A made-up address answers 404, not 403, so it does not test the scope; the 403 mapping is covered by the canned check only. Run `npm run market:mail -- <a mailbox outside the group>` and expect `NoMailboxAccess`.
