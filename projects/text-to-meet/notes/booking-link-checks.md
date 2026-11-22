# Booking link checks

Task 031. Bookings through a text link, made in a browser against `next dev`
in the worktree on port 3125 in Graph mode with the dev mock
(`MEET_DEV_MOCK=1`), and test-only SMS settings passed on the command line.
A signed MEET SIG sent to `/api/sms/inbound` returned the link. Offline
cases for the pieces the route uses are in `npm run sms:check`.

## Results (2026-11-22)

| Case | Booking | Request carried `smsToken` | Team notice (dev mock log) |
|---|---|---|---|
| Valid link | Booked | Yes, 42 characters | "Came from a text (MEET, SIG: Email signature)" |
| Expired link (token put into the request by hand) | Booked | The page sent none; the test added it | "no text link" |

The visitor's confirmation was logged with the same subject as before the
change. No `[sms]` error appeared in the server log.

The dev mock keeps its tables in the server's memory, so the booking row and
the conversation could not be read from outside. The offline cases cover
them: the booking row carries `source: sms` and the conversation ID, the
conversation shows `booked` with the booking ID, and a token that is bad,
expired, unknown, or met by a storage failure gives no link and no error.

Recaptcha and SendGrid were not configured locally, so neither ran. The real
team email is checked at go live (task 041).

The test settings file was kept outside the project and deleted after the
run, and the server was stopped.
