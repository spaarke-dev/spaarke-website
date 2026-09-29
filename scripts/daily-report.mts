// Prints the daily digest to the terminal, without sending it.
//
// The same assembler the scheduled mail uses, so what you see here is what the
// mail says. Useful for seeing the shape before wiring the schedule up, and for
// checking a Clarity token works without waiting until tomorrow morning.
//
//   STORAGE_ACCOUNT_CONNECTION="..." npm run report:daily
//   STORAGE_ACCOUNT_CONNECTION="..." CLARITY_API_TOKEN="..." npm run report:daily
//   npm run report:daily -- --days 3        Clarity allows at most 3
//
// Sends nothing. To send, call the route with the bearer token.

const { buildDailyReport, renderDailyReport } = await import("@/lib/reports/daily");

const argv = process.argv.slice(2);
const i = argv.indexOf("--days");
const days = i === -1 ? 1 : Number(argv[i + 1]);

if (!process.env.STORAGE_ACCOUNT_CONNECTION) {
  console.warn(
    "STORAGE_ACCOUNT_CONNECTION is not set, so questions and leads will be missing.\n",
  );
}
if (!process.env.CLARITY_API_TOKEN) {
  console.warn(
    "CLARITY_API_TOKEN is not set, so traffic will be missing. Generate one in\n" +
      "Clarity under Settings, Data Export.\n",
  );
}

const report = await buildDailyReport({
  connectionString: process.env.STORAGE_ACCOUNT_CONNECTION,
  clarityToken: process.env.CLARITY_API_TOKEN,
  days,
});

console.log("");
console.log(renderDailyReport(report, Math.min(Math.max(days, 1), 3)));

const broken = report.sections.filter((s) => s.problem);
if (broken.length > 0) {
  console.log("");
  console.log(`${broken.length} section(s) could not be read. The mail would still go.`);
}
if (report.quiet) {
  console.log("");
  console.log('This would be sent with the subject "quiet. No questions, no leads."');
}
