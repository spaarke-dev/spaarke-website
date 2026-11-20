# Text to Meet: implementation plan

> Generated 2026-11-20 from [spec.md](spec.md). Task files are in
> [tasks/](tasks/TASK-INDEX.md).

## Where it starts

Already live, so not in this plan:

- FR-18, the `/sms` page and `/sms/opt-in.png` (PRs #145, #166)
- FR-19, the privacy policy "Text messages" section, Twilio in the processor
  table, and the clause Twilio requires (PR #145)
- FR-02, the Toll-Free Verification submission, resubmitted 2026-11-19
- `src/lib/sms/messages.ts`: `meetReply()`, `HELP_REPLY`, the call to action
  and the consent statement

What is left is the webhook, the storage behind it, the link into `/meet`,
the setup guide, and going live.

## The rule that shapes the order

Building does not wait for Twilio or counsel. The route ships dark: with
`SMS_MODE` unset it returns 404, so the code can be merged and deployed while
the number is in review. Only going live (phase 4) waits for the two outside
approvals. Everything before that is tested locally with requests the check
script signs itself.

## Phases

### Phase 0: Decisions and setup (owner, in parallel with phases 1 to 3)

| Task | What | Who |
|---|---|---|
| 001 | Answer the open questions and sign off the spec | Owner |
| 002 | Upgrade the Twilio account; Messaging Service, Advanced Opt-Out, HELP text, US and Canada only | Owner, with Claude in Chrome if wanted |
| 003 | Create the secrets in Key Vault and the SWA settings, with `SMS_MODE` left unset | Claude, owner approves |
| 004 | Counsel review of the Compliance section | Owner and counsel |

Milestone: spec signed off; account and settings ready; counsel engaged.

### Phase 1: Core library (no network, no storage)

| Task | What |
|---|---|
| 010 | `src/lib/sms/config.ts` (settings, placement codes), `twilio-signature.ts`, `keywords.ts` |
| 011 | SMS link token in `src/lib/meet/tokens.ts`; `phone-hash.ts` |
| 012 | `scripts/check-sms.mts` and `npm run sms:check`: signatures, keywords, tokens, reply length and GSM-7 |

Milestone: `npm run sms:check` passes every offline case, including Twilio's
documented signature example.

### Phase 2: Storage and the webhook

| Task | What |
|---|---|
| 020 | `src/lib/sms/store.ts`: senders, conversations, inbound, counters with ETag concurrency |
| 021 | `POST /api/sms/inbound`: the FR-03 pipeline, keyword handling, TwiML replies, telemetry |
| 022 | Rate limits, the site-wide caps and their email alert; route cases in the check script |

Milestone: against a local server, one signed MEET gets one reply, a repeat
`MessageSid` gets none, STOP silences the sender, and each limit holds at its
edge.

### Phase 3: The link into /meet, and the guide

| Task | What |
|---|---|
| 030 | `/meet?c=<token>`: verify, record the open, welcome line, strip `c`, Plausible event |
| 031 | Graph mode: the token travels with the booking; `smsConversationId` on the booking; the team email line |
| 032 | `/meet` footer line, `docs/text-to-meet.md`, `.env.local.example` |

Milestone: a link from a local MEET reply opens `/meet` with the welcome
line, and a local test booking through it shows `booked` on the conversation.

### Phase 4: Ship and go live

| Task | What | Waits for |
|---|---|---|
| 040 | Pull request, preview checks with `SMS_MODE` unset, merge | Phases 1 to 3 |
| 041 | Go live: webhook URL in Twilio, `SMS_MODE=twilio`, live tests from a phone | 040, Verified number (002), counsel (004) |
| 042 | `/go/more-info-2` and the card copy, when the next card goes to print | 041 and a print date |
| 090 | Project wrap-up | 041 |

Milestone: success criteria 1 to 8 in the spec are all ticked.

## Dependencies

```
001 ─┐
010 ─┼─> 011 ─> 012 ─> 020 ─> 021 ─> 022 ─┐
     │                         └──> 030 ─> 031 ─┼─> 040 ─> 041 ─> 090
003 ─┘                                   032 ───┘          ^    └─> 042
002 (Verified) ────────────────────────────────────────────┤
004 (counsel) ─────────────────────────────────────────────┘
```

001 gates only the parts its answers change: whether the phone number is kept
(FR-13, the store, the privacy wording) and whether placement codes are used
(FR-17). If the owner keeps the spec's assumptions, nothing changes.

## Risks

| Risk | Effect | Handling |
|---|---|---|
| Verification rejected again | No texts to US numbers | Keep the webhook dark; answer Twilio's error code; any wording change goes to `messages.ts`, `/sms`, and the submission together |
| Twilio account still on trial | Verification and sending blocked | Task 002 upgrades it before go-live |
| Counsel asks for wording changes | Live `/sms` and the submission must change too | Change `messages.ts` once; resubmit the verification if the sample texts change |
| Signature mismatch behind SWA | Every real text gets 403 | Sign over `SMS_WEBHOOK_URL`, never `request.url` (the PR #153 lesson); task 041 checks the first real request in App Insights |
| Twilio retries a slow reply | Two replies | Deduplicate on `MessageSid` before any reply (FR-05); keep p95 under 3 seconds |
| Abuse runs up cost | Bills | Per-sender limits, hourly and daily caps, US and Canada only |
| Advanced Opt-Out is one-way | Only Twilio support can switch it off | The owner turns it on knowingly in task 002 |

## Estimate

About 30 hours of build (phases 1 to 3 and task 040), plus owner time for
001, 002 and 004 and the live test in 041.
