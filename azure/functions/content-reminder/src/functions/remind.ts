import { app, InvocationContext, Timer } from "@azure/functions";

// Placeholder handler — full orchestration logic lands in task 014.
export async function remind(_myTimer: Timer, context: InvocationContext): Promise<void> {
  context.log("[remind] Timer fired. Orchestration not yet implemented (task 014).");
}

app.timer("remind", {
  // Daily at 13:00 UTC (≈09:00 ET DST / 08:00 ET standard). Per spec §9 decision #2.
  schedule: "0 0 13 * * *",
  handler: remind,
});
