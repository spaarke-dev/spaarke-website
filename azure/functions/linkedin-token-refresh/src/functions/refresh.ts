import { app, InvocationContext, Timer } from "@azure/functions";

export async function refresh(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');
}

app.timer('refresh', {
    // Daily at 02:00 UTC (per spec §5.2 / task 020).
    schedule: '0 0 2 * * *',
    handler: refresh
});
