// Live check for mail read through the /meet Graph app (task 040), against the
// real tenant:
//
//   npm run market:mail -- <mailbox> [hours]
//
// Prints message counts per folder for the last 24 hours (or the hours given),
// how many look like non-delivery reports, and for how many of those the failed
// address could be read. It never prints a subject, an address or any content.
// A mailbox outside the Exchange access scope is reported and the script exits
// cleanly, as the sync will.
//
// Reads MEET_GRAPH_TENANT_ID, MEET_GRAPH_CLIENT_ID and MEET_GRAPH_CLIENT_SECRET
// from the environment or .env.local. Prints no secrets.

import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const mail = await import("@/lib/market/graph-mail");

const [mailbox, hoursArg] = process.argv.slice(2);
if (!mailbox) {
  console.error("Usage: npm run market:mail -- <mailbox> [hours]");
  process.exit(2);
}
const hours = Math.min(Math.max(Number(hoursArg ?? "24") || 24, 1), 24 * 31);

const settings = mail.getMailSettings();
if (!settings) {
  console.error("Graph settings are incomplete (MEET_GRAPH_TENANT_ID, MEET_GRAPH_CLIENT_ID, MEET_GRAPH_CLIENT_SECRET).");
  process.exit(2);
}

const since = new Date(Date.now() - hours * 3_600_000).toISOString();
console.log(`Mailbox metadata for the last ${hours} hour(s); counts only.`);

try {
  for (const folder of mail.MAIL_FOLDERS) {
    let count = 0;
    let bounces = 0;
    let readable = 0;
    const counterparts = new Set<string>();
    for await (const m of mail.listMessagesSince(settings, mailbox, folder, since, { max: 5000 })) {
      count++;
      for (const a of folder === "inbox" ? [m.from] : [...m.to, ...m.cc]) if (a) counterparts.add(a.address);
      if (mail.isBounce(m)) {
        bounces++;
        if (await mail.bounceRecipient(settings, mailbox, m.id)) readable++;
      }
    }
    const extra = folder === "inbox" ? `, ${bounces} non-delivery report(s), failed address read for ${readable}` : "";
    console.log(`  ${folder.padEnd(9)} ${count} message(s), ${counterparts.size} distinct address(es)${extra}`);
  }
} catch (err) {
  if (err instanceof mail.NoMailboxAccess) {
    console.log(`  NoMailboxAccess: ${err.message}`);
    process.exit(0);
  }
  console.error(`  FAIL ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
