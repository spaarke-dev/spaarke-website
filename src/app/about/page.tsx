import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Spaarke — the shared platform for legal departments, business stakeholders, and outside counsel. Built on Microsoft 365.",
};

export default function About() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="About"
          title="See all sides of every matter."
          lede="Spaarke is the shared platform for the business, in-house counsel, and outside counsel — built on Microsoft 365 to make legal work, data, and decisions navigable across the full legal value chain."
        />

        <div className="text-fg-mid mt-12 max-w-2xl space-y-6 text-base leading-relaxed">
          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            What we are
          </h2>
          <p>
            Spaarke is a Legal Operations Intelligence platform. It consolidates
            matters, projects, documents, communications, spend, performance,
            and AI into one shared platform that the business, the legal team,
            and outside counsel all work in together. It runs on Microsoft 365
            — Dataverse, SharePoint Embedded, Azure AI Foundry, and Foundry IQ
            — so customer data stays inside the customer&rsquo;s own tenant
            under the controls and compliance posture they already trust.
          </p>
          <p>
            We call the operational intelligence layer{" "}
            <strong className="text-fg font-medium">Legal IQ</strong>. It runs
            on top of Microsoft 365 to make Microsoft 365 Copilot, AI agents,
            and existing systems fluent in legal work — not as a plug-in or
            an accessory, but as the foundation those tools sit on.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Why we built it
          </h2>
          <p>
            Legal teams sit at the center of the business. They steward risk,
            shepherd contracts, run internal investigations, manage outside
            counsel, and answer to the business at every turn. The tools they
            were given were built one party at a time — billing software for
            firms, matter management for departments, document review for
            litigation, spreadsheets for everything in between. None of it sees
            the whole picture. Most of it doesn&rsquo;t talk to the rest.
          </p>
          <p>
            That fragmentation is why AI initiatives in legal stall. You
            can&rsquo;t ground a model in matter context that lives in seven
            systems. You can&rsquo;t benchmark outside counsel performance when
            the firm and the department keep different ledgers. You can&rsquo;t
            answer a board question about legal spend without a week of
            spreadsheet reconciliation.
          </p>
          <p>
            We built Spaarke to be the shared platform that holds the work,
            the data, and the decisions in one place — with AI grounded in
            that shared context, not bolted on after the fact.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            The shared platform
          </h2>
          <p>
            Spaarke is the only legal platform built across the full legal
            value chain — business clients, in-house counsel, and outside
            counsel. Every other vendor sees one party in the relationship.
            Spaarke connects all three, which is what enables shared
            intelligence and benchmarks no single-sided tool can produce.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-fg font-medium">
                The business gets answers.
              </strong>{" "}
              Status, risk, and spend on every matter — without filing a
              ticket or chasing a lawyer.
            </li>
            <li>
              <strong className="text-fg font-medium">
                The legal team gets visibility.
              </strong>{" "}
              One operating picture across matters, documents, vendors, and
              outcomes. Performance and benchmarks that hold up under board
              questioning.
            </li>
            <li>
              <strong className="text-fg font-medium">
                The firms get clarity.
              </strong>{" "}
              A shared workspace where engagement, instructions, and outputs
              live alongside the work — instead of disappearing into email
              threads and shared drives.
            </li>
          </ul>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Built on Microsoft
          </h2>
          <p>
            Spaarke is built on Microsoft 365, not for it. Customer data lives
            in the customer&rsquo;s own tenant — Dataverse for structured
            records, SharePoint Embedded for documents, Microsoft Entra ID
            for identity, Azure AI Foundry and Foundry IQ for AI. We deliver
            value at the application layer; Microsoft handles the storage,
            identity, compliance, and infrastructure obligations enterprise
            customers already meet.
          </p>
          <p>
            That posture matters. It means data sovereignty isn&rsquo;t a
            feature flag — it&rsquo;s the architecture. It means our AI
            features are grounded in the customer&rsquo;s own content, under
            the customer&rsquo;s own enterprise data protections, with no
            training on customer inputs. And it means a Microsoft-shop legal
            team can deploy Spaarke without standing up new vendors, new
            identity surfaces, or new compliance reviews.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Built for the AI era
          </h2>
          <p>
            AI in legal works when it has the right context. Spaarke supplies
            that context. Foundry IQ retrieves grounded knowledge across
            matters, documents, communications, and operational records.
            Copilot Studio agents and the Spaarke Agent Framework run
            generative, agentic, and autonomous workflows on that retrieved
            context. The result is AI that drafts on real precedent, agents
            that operate on live matter state, and decisions backed by
            traceable evidence — not chat outputs detached from the work.
          </p>
          <p>
            Importantly, Spaarke is model-agnostic. Where the customer&rsquo;s
            plan supports it, customers select among approved enterprise
            models — OpenAI, Anthropic, Microsoft, or any frontier model
            available in Azure — and constrain processing to a region or
            tenant-bound endpoint. AI choice is a customer decision, not a
            platform lock-in.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Where we are
          </h2>
          <p>
            Spaarke is in early access. We are partnering with a small group
            of corporate legal departments, business stakeholders, and outside
            counsel to validate the platform, sharpen the AI experiences, and
            shape the roadmap that follows general availability. Early-access
            partners receive concierge onboarding, direct access to the
            engineering and product team, and the ability to influence the
            features that ship next.
          </p>
          <p>
            If you are exploring Legal Operations Intelligence for your team,
            we would like to talk.{" "}
            <Link href="/access-request" className="text-cta-blue underline">
              Request early access
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-cta-blue underline">
              get in touch
            </Link>
            .
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            Founders &amp; team
          </h2>
          <p>
            Spaarke was founded by a team of legal operations practitioners,
            Microsoft platform engineers, and AI architects who spent careers
            building the systems large legal departments and outside counsel
            actually run on — and who watched, again and again, as those
            systems failed to talk to each other.
          </p>
          <p>
            We are a small, senior team. We work alongside design and
            engineering partners (visible in our footer) who help build,
            deploy, and operate Spaarke for our customers.
          </p>
          <p>
            Detailed founder bios are in progress and will appear here as the
            company moves out of stealth. For company inquiries, partnership
            ideas, or media requests, please email{" "}
            <a
              href="mailto:contactus@spaarke.com"
              className="text-cta-blue underline"
            >
              contactus@spaarke.com
            </a>
            .
          </p>
        </div>
      </Shell>
    </Slab>
  );
}
