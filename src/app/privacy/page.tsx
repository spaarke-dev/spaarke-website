import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Spaarke privacy policy — how we collect and use your data.",
};

export default function Privacy() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          lede="How we collect, use, and protect your data."
        />

        <div className="text-fg-mid mt-12 max-w-2xl space-y-6 text-base leading-relaxed">
          <p className="text-fg-low text-sm">Last updated: 2026-05-07</p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Analytics and telemetry
          </h2>

          <h3 className="text-fg font-display text-lg font-medium">
            What we don&rsquo;t do
          </h3>
          <p>
            We do not run third-party advertising trackers on this site, build
            cross-site behavioral profiles, or sell visitor data. We do not
            require a cookie banner because we don&rsquo;t set non-essential
            tracking cookies.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            What we do use
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-line border-b">
                  <th className="text-fg py-2 pr-4 text-left font-medium">
                    Tool
                  </th>
                  <th className="text-fg py-2 pr-4 text-left font-medium">
                    What it sees
                  </th>
                  <th className="text-fg py-2 pr-4 text-left font-medium">
                    Cookies?
                  </th>
                  <th className="text-fg py-2 text-left font-medium">Policy</th>
                </tr>
              </thead>
              <tbody className="text-fg-mid">
                <tr className="border-line border-b">
                  <td className="py-2 pr-4">Plausible Analytics</td>
                  <td className="py-2 pr-4">
                    Pageviews, referrer, country, device, browser
                  </td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">
                    <a
                      href="https://plausible.io/data-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-spaarke-blue underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr className="border-line border-b">
                  <td className="py-2 pr-4">Microsoft Clarity</td>
                  <td className="py-2 pr-4">
                    Anonymous session playback, heatmaps (form fields masked)
                  </td>
                  <td className="py-2 pr-4">First-party only</td>
                  <td className="py-2">
                    <a
                      href="https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-consent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-spaarke-blue underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr className="border-line border-b">
                  <td className="py-2 pr-4">Azure Application Insights</td>
                  <td className="py-2 pr-4">
                    Server-side error and performance telemetry
                  </td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">
                    <a
                      href="https://learn.microsoft.com/en-us/azure/azure-monitor/app/data-retention-privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-spaarke-blue underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-fg font-display text-lg font-medium">
            Plausible Analytics
          </h3>
          <p>
            Plausible is a privacy-first analytics tool that records pageviews
            without setting cookies and without storing personal data. It tells
            us which pages get traffic, where visitors arrive from, and rough
            geographic and device categories. Plausible is GDPR, CCPA, and
            ePrivacy compliant by design.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            Microsoft Clarity
          </h3>
          <p>
            Clarity records anonymous session playbacks and produces heatmaps
            so we can see where visitors get stuck or confused. Text typed
            into form fields is automatically masked before recording, so we
            never see the names, emails, or messages people type. Recordings
            are tied to a first-party identifier only and are not used for
            advertising.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            First-party attribution storage
          </h3>
          <p>
            When you first arrive at the site, your browser stores a small
            JSON snapshot under the localStorage key{" "}
            <code className="bg-surface text-fg rounded px-1 py-0.5 text-xs">
              spk_attribution_v1
            </code>
            . It contains your entry referrer (e.g., &ldquo;google.com&rdquo;),
            the first page you landed on, the timestamp of your first visit,
            and any UTM parameters from the URL. It contains no personal
            information and no device identifiers. It expires after 90 days
            and is used only to attribute your own form submissions to their
            original referrer when you submit a form on this site. You can
            clear it any time using your browser&rsquo;s &ldquo;Clear site
            data&rdquo; tool.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            Azure Application Insights
          </h3>
          <p>
            Application Insights collects server-side telemetry: HTTP request
            timing, exceptions, and aggregate logs we use to keep the site
            running. It does not set client cookies and does not capture form
            content. We use it for engineering operations, not behavioral
            profiling.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            AI crawler logging
          </h3>
          <p>
            When AI crawlers (e.g., GPTBot, ClaudeBot, PerplexityBot,
            Google-Extended) visit the site, we log the bot name and the path
            it requested via Application Insights. This tells us how the site
            is being indexed for AI citations. No personal data is captured —
            just the bot identifier and the public path it visited.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            What you can do
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Clear &ldquo;Cookies and other site data&rdquo; in your browser
              to remove the{" "}
              <code className="bg-surface text-fg rounded px-1 py-0.5 text-xs">
                spk_attribution_v1
              </code>{" "}
              snapshot and any Clarity identifiers.
            </li>
            <li>
              Use a tracking-protection extension or browser-level setting —
              both Plausible and Clarity respect standard opt-outs.
            </li>
            <li>
              Email{" "}
              <a
                href="mailto:privacy@spaarke.com"
                className="text-spaarke-blue underline"
              >
                privacy@spaarke.com
              </a>{" "}
              for data deletion requests or any privacy questions, or use our{" "}
              <a href="/contact" className="text-spaarke-blue underline">
                contact form
              </a>
              .
            </li>
          </ul>
        </div>
      </Shell>
    </Slab>
  );
}
