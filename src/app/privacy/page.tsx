import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Spaarke privacy policy — how we collect, process, and protect data across our website and our Microsoft-native SaaS platform.",
};

export default function Privacy() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          lede="How we collect, use, and protect data — both on this website and across the Spaarke platform."
        />

        <div className="text-fg-mid mt-12 max-w-2xl space-y-6 text-base leading-relaxed">
          <p className="text-fg-low text-sm">Last updated: 2026-05-07</p>

          <p>
            This policy covers two related but distinct contexts: (1) the
            information we collect when you visit{" "}
            <strong className="text-fg font-medium">spaarke.com</strong> or
            interact with our forms, and (2) how we handle your{" "}
            <strong className="text-fg font-medium">customer data</strong> when
            you use the Spaarke platform as a paying customer or early-access
            partner. Our{" "}
            <a href="/terms" className="text-cta-blue underline">
              Terms of Service
            </a>{" "}
            also apply to platform use.
          </p>

          {/* ============================================================ */}
          {/*  Part 1 — The website                                         */}
          {/* ============================================================ */}

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Part 1 — This website
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
                      className="text-cta-blue underline"
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
                      className="text-cta-blue underline"
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
                      className="text-cta-blue underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr className="border-line border-b">
                  <td className="py-2 pr-4">Google reCAPTCHA</td>
                  <td className="py-2 pr-4">
                    Risk score for bot detection on form submissions
                  </td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cta-blue underline"
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
            Forms (contact, get access, take tour)
          </h3>
          <p>
            When you submit a form, we store what you typed (name, work email,
            organization, message, and any other fields you complete) along
            with the attribution snapshot above. Form data is stored in Azure
            Table Storage in our tenant and is used solely to respond to your
            inquiry and operate any early-access provisioning that follows. We
            do not share form data with third parties for marketing purposes.
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

          {/* ============================================================ */}
          {/*  Part 2 — The Spaarke platform                                */}
          {/* ============================================================ */}

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Part 2 — The Spaarke platform
          </h2>

          <h3 className="text-fg font-display text-lg font-medium">
            Customer data lives in your tenant
          </h3>
          <p>
            Spaarke is a Microsoft ISV solution. Customer Data — your matters,
            documents, communications, and operational records — is stored
            inside{" "}
            <strong className="text-fg font-medium">
              your own Microsoft 365 tenant
            </strong>
            , primarily in Microsoft Dataverse and SharePoint Embedded.
            Microsoft is the data processor for that tenant under your existing
            agreements with Microsoft (the Microsoft Online Services Terms,
            Product Terms, and Data Protection Addendum). Spaarke acts at the
            application layer above your tenant, accessing your data only as
            needed to provide the Service.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            What this means in practice
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Your data is not pooled with other customers&rsquo; data — it
              stays in your tenant boundary.
            </li>
            <li>
              You can revoke Spaarke&rsquo;s access at any time through your
              tenant&rsquo;s admin controls; doing so terminates our processing
              of your data.
            </li>
            <li>
              Microsoft&rsquo;s region commitments, encryption defaults, and
              compliance certifications (ISO 27001, SOC 2, HIPAA, FedRAMP where
              applicable) apply to the underlying storage.
            </li>
            <li>
              Spaarke does not sell customer data, does not use it for
              advertising, and does not use it to train foundation AI models.
            </li>
          </ul>

          <h3 className="text-fg font-display text-lg font-medium">
            AI features
          </h3>
          <p>
            Spaarke&rsquo;s AI features (Foundry IQ, Microsoft Agent
            Framework agents, and approved enterprise model integrations,
            surfaced through Microsoft Power Platform and Microsoft 365)
            are grounded in your
            Customer Data via retrieval rather than training. Prompts and
            grounding content sent to underlying model providers are processed
            under enterprise data protection terms — including the Azure
            OpenAI Service data handling commitments and Microsoft Copilot
            enterprise data protection — that prohibit training on customer
            inputs and limit retention to what is needed to return a response.
            Where your plan supports it, you may select the model and
            constrain processing to a region or tenant-bound endpoint.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            Personal data and lawful basis
          </h3>
          <p>
            When you use the platform, we may process personal data of your
            employees and end users — names, work email addresses, role
            information, and the activity records the platform generates. We
            process that data on the lawful bases of (a) performance of our
            agreement with you, and (b) legitimate interest in operating and
            securing the Service. Where your customers or matter participants
            are themselves data subjects under GDPR or CCPA, you act as the
            controller and we as a processor. Customers subject to GDPR-class
            regimes can request our standard Data Processing Addendum at{" "}
            <a
              href="mailto:privacy@spaarke.com"
              className="text-cta-blue underline"
            >
              privacy@spaarke.com
            </a>
            .
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            Subprocessors
          </h3>
          <p>
            We use a small number of subprocessors to operate the Service, all
            of which are contracted under data protection terms at least as
            protective as our commitments to you. The current list includes
            Microsoft (Azure, Microsoft 365, Entra ID), SendGrid (transactional
            email), and Google reCAPTCHA (form bot detection). We will provide
            advance notice of material changes to our subprocessor list to
            customers under a Data Processing Addendum.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            Retention
          </h3>
          <p>
            Customer Data persists for as long as you use the Service. After
            termination, your data remains in your Microsoft tenant under your
            control; we deactivate Spaarke-managed access on request. Operational
            telemetry (logs, metrics) generated by Spaarke is retained for up
            to 90 days, and longer where required for security, audit, or
            legal purposes.
          </p>

          <h3 className="text-fg font-display text-lg font-medium">
            International transfers
          </h3>
          <p>
            For website telemetry and form storage, data is processed in
            Microsoft Azure regions in the United States. For platform
            customer data, the storage region is governed by your Microsoft
            tenant settings. Where data is transferred from the European
            Economic Area, the United Kingdom, or Switzerland to a country
            without an adequacy decision, transfers are made under Standard
            Contractual Clauses or equivalent transfer mechanisms.
          </p>

          {/* ============================================================ */}
          {/*  Your rights / contact                                        */}
          {/* ============================================================ */}

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Your rights
          </h2>
          <p>
            Depending on where you live, you may have the right to access,
            correct, delete, port, or object to processing of personal data we
            hold about you, and the right not to be subject to solely automated
            decisions with significant effects. To exercise any of these
            rights, or to ask any privacy question:
          </p>
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
                className="text-cta-blue underline"
              >
                privacy@spaarke.com
              </a>{" "}
              for data deletion requests, DPA requests, or any privacy
              questions, or use our{" "}
              <a href="/contact" className="text-cta-blue underline">
                contact form
              </a>
              .
            </li>
          </ul>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Changes to this policy
          </h2>
          <p>
            We may update this policy as the Service evolves. Material changes
            will be announced via the website and, where you have an account,
            by email or in-product notice. The &ldquo;Last updated&rdquo; date
            at the top of the page reflects the latest revision.
          </p>
        </div>
      </Shell>
    </Slab>
  );
}
