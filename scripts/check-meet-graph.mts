// Live checks for the /meet Graph app registration, against the real tenant.
//
//   npm run meet:graph -- access [--outside <mailbox>]
//       getSchedule on MEET_HOST must succeed; on --outside it must fail
//       with 403, which proves the Exchange RBAC scope holds.
//   npm run meet:graph -- block <ISO start> [minutes]
//       creates a plain busy event on MEET_HOST (no attendees, no Teams
//       link) for the "meeting added in Outlook" check; prints its ID.
//   npm run meet:graph -- unblock <event id>
//       deletes that event.
//   npm run meet:graph -- event <event id>
//       shows a booked event's time, Teams link fingerprint, and attendees.
//
// Reads settings from the environment or .env.local. Prints no secrets.

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const { getMeetConfig } = await import("@/lib/meet/config");
const { getBusyIntervals, GraphError } = await import("@/lib/meet/graph");
const { ClientSecretCredential } = await import("@azure/identity");

const config = getMeetConfig();
if (!config) {
  console.error("Graph settings are incomplete (MEET_GRAPH_*, MEET_HOST, MEET_LINK_SECRET).");
  process.exit(2);
}

const [command, ...args] = process.argv.slice(2);
const hour = 3_600_000;

async function raw(method: string, path: string, body?: unknown) {
  const cred = new ClientSecretCredential(config!.tenantId, config!.clientId, config!.clientSecret);
  const token = await cred.getToken("https://graph.microsoft.com/.default");
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    method,
    headers: { Authorization: `Bearer ${token!.token}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, json: text ? JSON.parse(text) : undefined };
}

if (command === "access") {
  const range = { start: Date.now(), end: Date.now() + 24 * hour };
  try {
    const busy = await getBusyIntervals(config, range);
    console.log(`ok   host getSchedule: ${busy.length} busy interval(s) in the next 24 hours`);
  } catch (err) {
    console.error(`FAIL host getSchedule: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  const i = args.indexOf("--outside");
  if (i !== -1 && args[i + 1]) {
    try {
      await getBusyIntervals({ ...config, host: args[i + 1] }, range);
      console.error("FAIL outside mailbox: getSchedule succeeded, so the scope does not hold");
      process.exit(1);
    } catch (err) {
      const status = err instanceof GraphError ? err.status : 0;
      if (status === 403) console.log("ok   outside mailbox: 403, outside the scope");
      else {
        console.error(`FAIL outside mailbox: expected 403, got ${err instanceof Error ? err.message : err}`);
        process.exit(1);
      }
    }
  }
} else if (command === "block") {
  const start = Date.parse(args[0] ?? "");
  const minutes = Number(args[1] ?? "30");
  if (!Number.isFinite(start)) {
    console.error("Usage: block <ISO start> [minutes]");
    process.exit(2);
  }
  const utc = (ms: number) => ({ dateTime: new Date(ms).toISOString().replace("Z", ""), timeZone: "UTC" });
  const r = await raw("POST", `/users/${encodeURIComponent(config.host)}/events`, {
    subject: "Booking test block",
    start: utc(start),
    end: utc(start + minutes * 60_000),
    showAs: "busy",
  });
  if (r.status !== 201) {
    console.error(`FAIL block: ${r.status} ${JSON.stringify(r.json?.error ?? {})}`);
    process.exit(1);
  }
  console.log(r.json.id);
} else if (command === "event") {
  const r = await raw(
    "GET",
    `/users/${encodeURIComponent(config.host)}/events/${encodeURIComponent(args[0] ?? "")}?$select=start,end,isCancelled,isOnlineMeeting,onlineMeeting,attendees`,
  );
  if (r.status === 404) {
    console.log("event: not found (deleted)");
  } else if (r.status !== 200) {
    console.error(`FAIL event: ${r.status} ${JSON.stringify(r.json?.error ?? {})}`);
    process.exit(1);
  } else {
    const e = r.json;
    const join = e.onlineMeeting?.joinUrl ?? "";
    console.log(
      JSON.stringify({
        start: e.start.dateTime,
        end: e.end.dateTime,
        isCancelled: e.isCancelled,
        isOnlineMeeting: e.isOnlineMeeting,
        // A hash, so two runs can be compared without printing the link.
        joinUrlHash: join ? createHash("sha256").update(join).digest("hex").slice(0, 12) : null,
        attendees: e.attendees.map((a: { emailAddress: { address: string }; status: { response: string } }) => `${a.emailAddress.address} (${a.status.response})`),
      }),
    );
  }
} else if (command === "unblock") {
  const r = await raw("DELETE", `/users/${encodeURIComponent(config.host)}/events/${encodeURIComponent(args[0] ?? "")}`);
  if (r.status !== 204) {
    console.error(`FAIL unblock: ${r.status} ${JSON.stringify(r.json?.error ?? {})}`);
    process.exit(1);
  }
  console.log("ok   block event deleted");
} else {
  console.error("Usage: access [--outside <mailbox>] | block <ISO start> [minutes] | unblock <event id>");
  process.exit(2);
}
