import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Eyebrow,
  Heading,
  PageHeader,
  Shell,
  Slab,
} from "@/components/primitives";
import ContactForm from "@/components/ContactForm";

// SSR per request so ContactForm receives a runtime-resolved
// RECAPTCHA_SITE_KEY (Azure SWA app settings are runtime-only).
export const dynamic = "force-dynamic";

const ARTICLE_URL = "/why-spaarke/microsoft-is-now-the-platform-for-legal-ai";

export const metadata: Metadata = {
  title: "Spaarke Legal AI Accelerator",
  description:
    "Put Microsoft Copilot to work for one legal practice in one week, with core legal skills, practice packs, tools, and forward-deployed legal engineers.",
};

// The copy below follows the founder article. Keep the two in step: the
// article's closing call to action links here and promises this session.
const SESSION_STEPS = [
  "Choose the practice and the first two or three tasks.",
  "Confirm the Microsoft setup with your IT lead: Copilot licences, the Cowork usage policy, and who approves connectors.",
  "Plan the week.",
];

const WEEK_OUTCOMES = [
  "The team's own playbooks, written with the setup interview and held in its own files.",
  "The practice pack and agent deployed in your own tenant.",
  "Results measured on your own documents against today's baseline.",
  "A deployment package your IT team has reviewed.",
  "A plan for the next practice.",
];

const LAYERS = [
  {
    name: "The foundation",
    body: "Core legal skills that every practice uses: reviewing a document against a playbook, preparing an issues list, extracting key terms, comparing documents, building a chronology, writing a matter brief, and checking citations.",
  },
  {
    name: "Practice packs",
    body: "Specialty skills, playbook templates, checklists, and calculation tools for practices such as NDAs, commercial real estate, M&A, employment, litigation, patents, and trademarks, and an invoice review pack for legal operations.",
  },
  {
    name: "The team's own playbooks",
    body: "Your preferred and fallback positions, escalation rules, house style, and approved precedents, captured in files the team owns. Updates to the foundation and the packs never overwrite them.",
  },
];

const INCLUDED = [
  {
    name: "Legal skills",
    body: "Foundation and practice pack skills in the Agent Skills format, deployed as plugins to Cowork and Copilot Chat.",
  },
  {
    name: "Playbooks for Word",
    body: "Playbooks rendered as Word documents from the team's own positions, for Word's legal drafting and review skills.",
  },
  {
    name: "Knowledge library",
    body: "A SharePoint site structure for precedents, the clause library, and checklists, in your own tenant.",
  },
  {
    name: "Agents",
    body: "Copilot agents for each practice, grounded on the knowledge library and shared with the team.",
  },
  {
    name: "Tools and MCP connectors",
    body: "Calculation tools for the work that must be exact, and connectors to the systems you already license.",
  },
  {
    name: "Setup interview",
    body: "A guided skill that walks a practice lead through positions, fallbacks, escalation, and house style.",
  },
  {
    name: "Evaluation set",
    body: "Questions and documents for each practice, extended with your own, to test results on your work.",
  },
  {
    name: "Governance and deployment",
    body: "Human review guidance in every skill, a summary for IT of how data flows, and an administrator deployment package.",
  },
  {
    name: "Adoption",
    body: "Installation guides, training prompts, and a usage baseline from which to measure results.",
  },
];

export default function Accelerator() {
  return (
    <>
      <Slab tone="dark">
        <Shell>
          <PageHeader
            eyebrow="Spaarke Legal AI Accelerator for Microsoft Copilot"
            title="Legal AI on Microsoft, one practice in one week."
            lede="The accelerator brings core legal skills, practice packs, calculation tools, and forward-deployed legal engineers to put Microsoft's platform to work for your legal team, inside the tenant you already govern."
          />
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button variant="primary" href="#book" arrow>
              Book a scoping session
            </Button>
            <Link
              href={ARTICLE_URL}
              className="text-fg-mid hover:text-fg text-sm underline underline-offset-4 transition-colors"
            >
              Read why Microsoft is now the platform for legal AI
            </Link>
          </div>
          <div className="relative mt-14 aspect-video overflow-hidden rounded-xl">
            <Image
              src="/articles/microsoft-is-now-the-platform-for-legal-ai/hero.svg"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        </Shell>
      </Slab>

      <Slab tone="light">
        <Shell>
          <div className="max-w-3xl">
            <Eyebrow>Three layers of legal content</Eyebrow>
            <Heading level={2} className="mt-5">
              Spaarke maintains two layers. Your team owns the third.
            </Heading>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {LAYERS.map((layer) => (
              <div key={layer.name} className="border-line-strong border-t pt-6">
                <Heading level={3}>{layer.name}</Heading>
                <p className="text-fg-mid mt-4 text-base leading-relaxed">
                  {layer.body}
                </p>
              </div>
            ))}
          </div>
        </Shell>
      </Slab>

      <Slab tone="dark">
        <Shell>
          <div className="max-w-3xl">
            <Eyebrow>What&rsquo;s included</Eyebrow>
            <Heading level={2} className="mt-5">
              Delivered into your own tenant.
            </Heading>
          </div>
          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <div key={item.name}>
                <dt className="text-fg font-medium">{item.name}</dt>
                <dd className="text-fg-mid mt-2 text-[15px] leading-relaxed">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </Shell>
      </Slab>

      <Slab tone="light">
        <Shell>
          <div
            id="book"
            className="mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col gap-14 md:flex-row md:items-start md:gap-20 lg:gap-28"
          >
            <div className="md:flex-1">
              <Eyebrow>Book a scoping session</Eyebrow>
              <Heading level={2} className="mt-5">
                Thirty minutes to plan the week.
              </Heading>
              <p className="text-fg-mid mt-8 text-base leading-relaxed md:text-[17px]">
                In the session we will:
              </p>
              <ul className="text-fg-mid mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
                {SESSION_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <p className="text-fg-mid mt-8 text-base leading-relaxed md:text-[17px]">
                At the end of the week, the team has:
              </p>
              <ul className="text-fg-mid mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
                {WEEK_OUTCOMES.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <p className="text-fg-mid mt-8 text-base leading-relaxed">
                Teams that prefer to begin on their own can add a practice pack
                in Cowork and run the setup interview. To ask a question first,
                email{" "}
                <a
                  href="mailto:ralph.schroeder@spaarke.com"
                  className="text-fg underline underline-offset-4"
                >
                  ralph.schroeder@spaarke.com
                </a>
                .
              </p>
            </div>
            <div className="md:flex-1 md:pt-2">
              <ContactForm
                recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
                defaultReason="Book an accelerator scoping session"
                messagePlaceholder="The practice you have in mind and the two or three tasks you want results on first."
                submitLabel="Request a session"
              />
            </div>
          </div>
        </Shell>
      </Slab>
    </>
  );
}
