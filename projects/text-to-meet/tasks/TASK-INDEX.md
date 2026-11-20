# Task index: Text to Meet

> Registry and status. Update the status column as tasks complete.
> Generated 2026-11-20 from [../plan.md](../plan.md).

## Status

| ID | Task | Phase | Depends on | Est. | Status |
|---|---|---|---|---|---|
| 001 | [Owner decisions and spec sign-off](001-owner-decisions.md) | 0 | none | 1h | not-started (owner) |
| 002 | [Twilio account and Messaging Service](002-twilio-account-setup.md) | 0 | none | 1h | not-started (owner) |
| 003 | [Secrets and app settings](003-secrets-and-settings.md) | 0 | none | 1h | not-started |
| 004 | [Counsel review](004-counsel-review.md) | 0 | none | external | not-started (owner) |
| 010 | [Config, signature check, keywords](010-config-signature-keywords.md) | 1 | none | 3h | not-started |
| 011 | [SMS link token and phone hash](011-token-and-phone-hash.md) | 1 | 010 | 2h | not-started |
| 012 | [Check script, offline cases](012-check-script.md) | 1 | 010, 011 | 2h | not-started |
| 020 | [Table storage](020-table-storage.md) | 2 | 011 | 3h | not-started |
| 021 | [Inbound webhook route](021-inbound-route.md) | 2 | 012, 020 | 4h | not-started |
| 022 | [Rate limits, caps, route checks](022-rate-limits-and-route-checks.md) | 2 | 021 | 3h | not-started |
| 030 | [/meet with a token](030-meet-link-open.md) | 3 | 020 | 3h | not-started |
| 031 | [Booking linked to the text](031-booking-link.md) | 3 | 030 | 3h | not-started |
| 032 | [Footer line, setup guide, env example](032-footer-and-setup-guide.md) | 3 | 021 | 2h | not-started |
| 040 | [Pull request and preview checks](040-pull-request.md) | 4 | 022, 031, 032 | 2h | not-started |
| 041 | [Go live](041-go-live.md) | 4 | 040, 002, 003, 004 | 2h | blocked (Verified number, counsel) |
| 042 | [Next card placement](042-next-card-placement.md) | 4 | 041 | 0.5h | deferred (print date) |
| 090 | [Project wrap-up](090-project-wrap-up.md) | 4 | 041 | 2h | not-started |

**17 tasks: about 30 hours of build, plus owner and counsel time.**

## Phases

| Phase | Tasks | What it proves |
|---|---|---|
| 0 Decisions and setup | 001 to 004 | The owner's answers, the account, the secrets, and counsel are in place |
| 1 Core library | 010 to 012 | Signatures, keywords, tokens and reply length are right, offline |
| 2 Storage and webhook | 020 to 022 | One text gets one reply, STOP holds, limits hold, nothing readable is stored |
| 3 The link into /meet | 030 to 032 | The link opens /meet and a booking through it is tied to the text |
| 4 Ship and go live | 040 to 042, 090 | It ships dark, then works from a real phone |

Phase 0 runs alongside phases 1 to 3. Only task 041 waits for the Verified
number and counsel.
