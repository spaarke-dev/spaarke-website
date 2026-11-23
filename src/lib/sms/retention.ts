import { trackEvent, trackException } from "@/lib/logger";
import { claimDailyPurge, isSmsStorageConfigured, purgeSmsRows, type PurgeResult } from "@/lib/sms/store";

/**
 * The daily retention purge (task 043), run from the five-minute reminder
 * schedule. Only the first call each UTC day does the work; every other call
 * is one refused insert. It never throws, so it can never fail the reminder
 * run. A run that fails after claiming the day is retried the next day.
 *
 * It runs whether or not SMS_MODE is set: a paused program still holds rows
 * that age out. The first run creates the SMS tables if they are missing.
 */
export async function runDailySmsPurge(now: Date = new Date()): Promise<PurgeResult | null> {
  if (!isSmsStorageConfigured()) return null;
  try {
    if (!(await claimDailyPurge(now))) return null;
    const result = await purgeSmsRows(now);
    trackEvent("sms.purged", {
      conversations: String(result.conversations),
      senders: String(result.senders),
      inbound: String(result.inbound),
      counters: String(result.counters),
      capped: String(result.capped),
    });
    return result;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    // The message only: storage errors carry no number or text.
    console.error("[sms] retention purge failed:", error.message);
    trackException(error, { step: "sms.purge" });
    return null;
  }
}
