/**
 * Copy and diagram data for /services (Managed Legal Operations).
 *
 * Sections 1 to 3 are ported from the design prototype
 * (projects/website-services-page/prototype/src/content/mlo.content.ts);
 * sections 4 to 8 are written from design.md sections 4.4 to 4.8.
 * Every audience-dependent field is typed ByAudience<T> so the page-wide
 * switch can flip it without a mixed state.
 *
 * Guardrails (design.md section 9), do not edit them away:
 *  - No equity numbers, percentages, vesting terms or return claims anywhere.
 *  - Practice-agnostic wording (no IP-specific headlines).
 *  - The boundary line stays visible wherever the structure is explained.
 *  - Fees are fixed, per-unit or cost-plus; never tied to legal fees.
 *  - Every statistic carries a source. `verification` records what must be
 *    checked against the primary report before launch.
 * Counsel reviews final copy, function labels and FAQ answers before the
 * page is indexed. Run `npm run voice:lint -- src/app/services/content.ts`.
 */
import type { ByAudience } from "@/components/services/audience-types";

/* ------------------------------------------------------------------ */
/* Page bar                                                            */
/* ------------------------------------------------------------------ */

export const anchors = [
  { id: "what-is-mlo", label: "What is MLO" },
  { id: "why-now", label: "Why now" },
  { id: "how-it-works", label: "How it works" },
  { id: "network", label: "Network" },
  { id: "financial-opportunity", label: "Economics" },
  { id: "approach", label: "Approach" },
  { id: "faq", label: "FAQ" },
];

export const ctas = {
  conversation: { label: "Start a conversation", href: "/meet" },
  assessment: { label: "Request an assessment", href: "/contact" },
  numbers: { label: "Discuss your numbers", href: "/contact" },
};

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Spaarke Managed Legal Operations",
  /** First candidate from design.md 4.1; the alternates are kept for review. */
  headline: ["Practice law.", "We’ll run the business."],
  headlineAlternates: ["Run legal like a business.", "Legal, operated."],
  subhead: {
    firm: "Managed Legal Operations gives your lawyers the technology, team and economics of a much larger firm, and leaves your clients, your judgment and your practice yours.",
    corporate:
      "Managed Legal Operations gives your legal team the AI, technology and operating discipline to do more, at lower cost, with privilege and control intact.",
  } satisfies ByAudience<string>,
  primaryCta: {
    firm: { label: "Start a conversation", href: "/meet" },
    corporate: { label: "Start a conversation", href: "/meet" },
  } satisfies ByAudience<{ label: string; href: string }>,
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  image: {
    // Placeholder until the commissioned or exclusively licensed photograph is ready (design.md section 8).
    src: null as string | null,
    alt: "A lawyer and an operations professional working side by side in a real office.",
  },
};

/* ------------------------------------------------------------------ */
/* 2. What is Managed Legal Operations                                 */
/* ------------------------------------------------------------------ */

export const whatIsMlo = {
  id: "what-is-mlo",
  eyebrow: "What is Managed Legal Operations",
  title: "The operating model built for how legal actually works",
  definition:
    "Managed Legal Operations (MLO) is a managed service that runs the business side of legal (technology, operations, finance and administration) so lawyers can concentrate on the practice of law.",
  msoNote:
    "MLO is delivered through a Managed Services Organization, or MSO: a separate company that provides non-legal services under a services agreement. The MSO is the structure. MLO is the service it provides.",
  split: {
    practice: {
      title: "The practice of law",
      items: ["Legal judgment", "Client relationships", "Privilege and confidentiality"],
    },
    business: {
      title: "The business of law",
      items: ["Technology and AI", "Operations and staff", "Finance and administration"],
    },
    connector: "Services agreement",
  },
  whyLegalIsDifferent: {
    title: "Legal is a business with unusual requirements",
    intro:
      "Generic outsourcing and generic MSOs were not designed for them. Managed Legal Operations starts from them.",
    items: [
      { id: "independence", title: "Professional independence", caption: "Legal judgment stays with lawyers." },
      { id: "privilege", title: "Privilege and confidentiality", caption: "They shape which data, systems and people can move." },
      { id: "matters", title: "Matter-based economics", caption: "Work is scoped, priced and tracked by matter, not by seat." },
      { id: "fees", title: "Regulated fee rules", caption: "What may be paid to a service provider, and how, is constrained." },
      { id: "compensation", title: "Partner pay and succession", caption: "Compensation and ownership work differently from a normal company." },
      { id: "billing", title: "Billing under pressure", caption: "Hourly and fixed fees that track human effort are being repriced." },
    ],
  },
  benefitsTitle: {
    firm: "What firms gain",
    corporate: "What legal departments gain",
  } satisfies ByAudience<string>,
  benefits: {
    firm: [
      { title: "Lower cost to deliver each matter", body: "Operating functions are delivered at a unit price below your own internal cost." },
      { title: "Technology that keeps pace", body: "AI and legal technology you could not justify building or integrating alone." },
      { title: "Lawyers back on the practice", body: "Partners stop running the business and concentrate on clients and legal work." },
      { title: "Room to grow", body: "Add capacity, practices or offices without rebuilding the back office each time." },
      { title: "Lasting value", body: "A way for the firm to build long-term value in how it operates, beyond annual partner draws." },
    ],
    corporate: [
      { title: "Lower cost per matter", body: "Run legal operations, contracts and matter management at a lower unit cost." },
      { title: "Less reliance on outside counsel for routine work", body: "Technology-enabled handling of repeatable work stays under your control." },
      { title: "Access to legal AI that is hard to buy", body: "Specialist tools, security review and integration handled for you." },
      { title: "Control and visibility", body: "One view of spend, matters and outside firms, with reporting you can act on." },
      { title: "Lower risk", body: "Consistent processes, governed data and clear service levels." },
    ],
  } satisfies ByAudience<{ title: string; body: string }[]>,
  differentiators: [
    "Technology-led, with AI and the legal technology platform inside the operating model",
    "Built for law firms and for corporate legal departments",
    "Every structure designed around the client’s goals and requirements",
    "Part of a network that grows in capability as it grows in members",
  ],
  /** Keep visible wherever the structure is explained (design.md section 9). */
  boundaryLine:
    "The MLO does not practice law, does not share in legal fees, and does not direct legal judgment. Its fee is set on a fixed or per-unit method and is never tied to legal fees.",
};

/* ------------------------------------------------------------------ */
/* 3. Why MLO, why now                                                 */
/* ------------------------------------------------------------------ */

export type StatChart = "bigNumber" | "pairedBars" | "columns" | "comparisonBars";
/**
 * "retrieved-snippet" = seen in a search result during research; confirm in the primary report.
 * "secondary-verify"  = taken from a secondary citation; find and confirm the primary before publishing.
 */
export type Verification = "retrieved-snippet" | "secondary-verify";

export interface WhyNowStat {
  id: string;
  theme: string;
  /** Action title: states the takeaway, not the topic. */
  title: string;
  figure: string;
  caption: string;
  chart: StatChart;
  /** Data for the small chart. Values are in the units named in `unit`. */
  data?: { label: string; value: number }[];
  unit?: string;
  /** Share for the thin bar under a big-number tile (0 to 100). */
  bar?: number;
  source: { name: string; url: string; date?: string; note?: string };
  verification: Verification;
  /** Lower rank shows first. */
  rank: ByAudience<number>;
}

export const whyNow = {
  id: "why-now",
  eyebrow: "Why MLO, why now",
  title: "The economics of legal are being rewritten",
  intro: {
    firm: "Technology, pricing and client expectations are changing at the same time. Firms are expected to adopt AI and to charge less for it, while carrying the cost of the technology and the competition from new AI-native firms.",
    corporate:
      "Legal departments are being asked to do more, keep more work in-house and spend less. AI makes that look possible, but building and running it alone is complex, and the savings depend on redesigning the work.",
  } satisfies ByAudience<string>,
  stats: [
    {
      id: "tech-adoption",
      theme: "Technology is transforming practice",
      title: "Seven in ten law-firm attorneys now use AI every week",
      figure: "70%",
      caption: "of attorneys at law firms use AI at least once a week, a sharp increase from the year before.",
      chart: "bigNumber",
      bar: 70,
      source: { name: "Law360 Pulse, 2026 AI Survey", url: "https://www.law360.com/legalindustry/articles/2454764", date: "March 2026" },
      verification: "retrieved-snippet",
      rank: { firm: 1, corporate: 3 },
    },
    {
      id: "delivery-dynamics",
      theme: "New service delivery dynamics",
      title: "Legal departments have moved from experimenting to deploying AI",
      figure: "61%",
      caption: "of legal departments are in AI deployment phases, and 10% say AI is fully embedded in daily workflows.",
      chart: "bigNumber",
      bar: 61,
      source: {
        name: "Deloitte Legal, The AI Imperative",
        url: "https://www.deloitte.com/uk/en/about/press-room/ai-set-to-reshape-legal-work-law-firm-pricing-and-legal-careers.html",
        date: "2026",
        note: "Survey of 121 senior legal leaders, April to May 2026",
      },
      verification: "retrieved-snippet",
      rank: { firm: 4, corporate: 2 },
    },
    {
      id: "fee-pressure",
      theme: "Downward pressure on effort-based fees",
      title: "Clients expect AI savings to show up in the bill",
      figure: "92%",
      caption: "of legal departments expect, or are negotiating, AI-related rate cuts from their law firms.",
      chart: "bigNumber",
      bar: 92,
      source: {
        name: "Axiom survey (vendor-sourced)",
        url: "https://www.llms-for-lawyers.com/practice-areas/ai-for-in-house-counsel/",
      },
      verification: "secondary-verify",
      rank: { firm: 2, corporate: 5 },
    },
    {
      id: "tech-cost-complexity",
      theme: "Cost and complexity of new technology",
      title: "Technology only pays off when the work is redesigned around it",
      figure: "~60% vs <20%",
      caption:
        "Cost reduction reported with end-to-end workflow redesign versus without it. Only 37% of organizations report a positive EBIT impact from AI.",
      chart: "comparisonBars",
      data: [
        { label: "Without redesign", value: 20 },
        { label: "End-to-end redesign", value: 60 },
      ],
      unit: "% cost reduction",
      source: {
        name: "BCG; McKinsey",
        url: "https://www.bcg.com/publications/2026/reinventing-the-operating-system-of-work-with-ai",
      },
      verification: "secondary-verify",
      rank: { firm: 3, corporate: 3 },
    },
    {
      id: "ai-native-competition",
      theme: "Competition from AI-native firms",
      title: "Capital is flowing to AI-native competitors",
      figure: "$1B → $4B+",
      caption: "Legal tech venture funding, 2023 to 2025.",
      chart: "columns",
      data: [
        { label: "2023", value: 1 },
        { label: "2025", value: 4 },
      ],
      unit: "$B",
      source: { name: "Gavel", url: "https://www.gavel.io/resources/ai-native-law-firms-how-to-respond" },
      verification: "secondary-verify",
      rank: { firm: 5, corporate: 4 },
    },
    {
      id: "insourcing",
      theme: "Clients bringing work back in-house",
      title: "Clients are keeping more work in-house",
      figure: "58% → 37%",
      caption:
        "Share of legal departments expecting to increase outside counsel spend, last year versus this year, in a survey of 135 corporate law departments.",
      chart: "pairedBars",
      data: [
        { label: "Last year", value: 58 },
        { label: "This year", value: 37 },
      ],
      unit: "% of departments",
      source: {
        name: "Above the Law, reporting a corporate law department survey",
        url: "https://abovethelaw.com/2025/12/biglaws-worst-enemy-isnt-ai-its-clients-using-ai-to-stop-paying-them/",
        date: "December 2025",
      },
      verification: "retrieved-snippet",
      rank: { firm: 6, corporate: 1 },
    },
  ] as WhyNowStat[],
  /** Keeps the section credible rather than alarmist. */
  nuance: {
    title: "AI reallocates the profit pool. It does not shrink it evenly.",
    body: "Practices that combine high automation with durable pricing power can expand margins, while commoditized, substitutable work faces the most pressure. The question is not whether AI reduces hours, but who keeps pricing and client control.",
    // A public primary source is still to be found (design.md section 10, status P).
    source: { name: "Stout and Piper Sandler, law firm MSO white paper (2026)" },
  },
  bridge: "The firms and teams that win will not just buy AI tools. They will redesign how legal is operated.",
};

/** The six stats ordered for the chosen audience. */
export function orderedStats(audience: keyof ByAudience<unknown>): WhyNowStat[] {
  return [...whyNow.stats].sort((a, b) => a.rank[audience] - b.rank[audience]);
}

/* ------------------------------------------------------------------ */
/* 4. How MLO works: the functional structure                          */
/* ------------------------------------------------------------------ */

export interface AllocationItem {
  label: string;
  /** One-line explanation shown on hover or focus. */
  detail: string;
}

/** Placeholder labels (design.md 4.4). Counsel confirms each placement before launch. */
export const howItWorks = {
  id: "how-it-works",
  eyebrow: "How Managed Legal Operations works",
  title: "What stays with the lawyers, and what the MLO takes on",
  intro: {
    firm: "The firm keeps everything that is the practice of law. The MLO runs the operating functions under a services agreement, at a fee set by the cost of the services delivered.",
    corporate:
      "The legal department keeps its lawyers, its judgment and its decisions. The MLO runs the operations, technology and reporting that support them, under a services agreement with clear service levels.",
  } satisfies ByAudience<string>,
  keeps: {
    firm: {
      title: "Law firm keeps",
      items: [
        { label: "Partners and associates", detail: "Every lawyer stays employed by the firm and answers to the firm." },
        { label: "Client relationships", detail: "Clients engage the firm, and the firm alone advises them." },
        { label: "Client data", detail: "Client files remain the firm’s, under its privilege and confidentiality obligations." },
        { label: "Billings and revenue", detail: "Legal fees are billed and collected by the firm." },
        { label: "Partner and professional compensation", detail: "The firm sets and pays all lawyer compensation." },
      ],
    },
    corporate: {
      title: "Legal department keeps",
      items: [
        { label: "Lawyers and privileged work", detail: "Privileged advice and the people who give it stay in the department." },
        { label: "Legal strategy", detail: "Priorities, risk positions and legal approach are set by the department." },
        { label: "Outside counsel relationships", detail: "The department chooses and instructs its law firms." },
        { label: "Company data", detail: "Company and matter data stay under the company’s governance." },
        { label: "Decisions and sign-off", detail: "Every legal decision and approval stays with the department." },
      ],
    },
  } satisfies ByAudience<{ title: string; items: AllocationItem[] }>,
  takes: {
    firm: {
      title: "MLO takes on",
      items: [
        { label: "Non-attorney staff", detail: "Administrative and support teams, employed and managed by the MLO." },
        { label: "Technical staff", detail: "Engineers and analysts who run the firm’s systems and data." },
        { label: "IT systems", detail: "Infrastructure, security, support and vendor management." },
        { label: "Accounting and finance", detail: "Bookkeeping, payables, reporting and financial planning." },
        { label: "Marketing", detail: "Brand, business development support and the website." },
        { label: "HR and talent", detail: "Recruiting, onboarding, benefits and people operations." },
        { label: "Facilities and vendors", detail: "Offices, procurement and supplier contracts." },
        { label: "Legal technology and AI", detail: "The platform, AI tools and the workflows built on them." },
      ],
    },
    corporate: {
      title: "MLO takes on",
      items: [
        { label: "Legal operations", detail: "Intake, workflow, process design and day-to-day running of the function." },
        { label: "Matter and spend management", detail: "Matter records, budgets, invoice review and accruals." },
        { label: "Contract operations", detail: "Templates, playbooks, routing and the contract record." },
        { label: "Vendor and panel management", detail: "Panel design, rate negotiation support and performance tracking." },
        { label: "Technology and AI platform", detail: "The platform, AI tools, integrations and their security review." },
        { label: "Reporting and benchmarking", detail: "Dashboards, board reporting and comparisons that hold up to scrutiny." },
      ],
    },
  } satisfies ByAudience<{ title: string; items: AllocationItem[] }>,
  sideLabel: {
    firm: { left: "Law firm", right: "MSO" },
    corporate: { left: "Legal department", right: "MLO" },
  } satisfies ByAudience<{ left: string; right: string }>,
  tailored: {
    title: "Every structure is tailored",
    body: "No two organizations move the same functions. The service menu is chosen to fit each client’s goals and requirements.",
    /** Three illustrative clients and the services each chose (labels match `takes`). */
    examples: {
      firm: [
        { name: "Firm A", chosen: ["IT systems", "Accounting and finance", "Legal technology and AI"] },
        {
          name: "Firm B",
          chosen: [
            "Non-attorney staff",
            "Technical staff",
            "IT systems",
            "Accounting and finance",
            "Marketing",
            "HR and talent",
            "Facilities and vendors",
            "Legal technology and AI",
          ],
        },
        { name: "Firm C", chosen: ["Non-attorney staff", "IT systems", "HR and talent", "Legal technology and AI"] },
      ],
      corporate: [
        { name: "Company A", chosen: ["Matter and spend management", "Technology and AI platform"] },
        {
          name: "Company B",
          chosen: [
            "Legal operations",
            "Matter and spend management",
            "Contract operations",
            "Vendor and panel management",
            "Technology and AI platform",
            "Reporting and benchmarking",
          ],
        },
        { name: "Company C", chosen: ["Contract operations", "Technology and AI platform", "Reporting and benchmarking"] },
      ],
    } satisfies ByAudience<{ name: string; chosen: string[] }[]>,
  },
  operatorNote: "Every MLO is operated by Spaarke.",
};

/* ------------------------------------------------------------------ */
/* 5. The operating company and the MLO partner network                */
/* ------------------------------------------------------------------ */

export const network = {
  id: "network",
  eyebrow: "The operating company and the MLO partner network",
  title: "One operator. A network that gets stronger with every member.",
  intro: {
    firm: "Spaarke is the operating company behind every MLO. Each firm works with its own MLO, and every MLO draws on the same platform, playbooks and shared services.",
    corporate:
      "Spaarke is the operating company behind every MLO. Each legal department works with its own MLO, and every MLO draws on the same platform, playbooks and shared services.",
  } satisfies ByAudience<string>,
  hub: {
    title: "Spaarke",
    subtitle: "Operating company",
    capabilities: [
      "Technology platform",
      "AI and transformation",
      "Shared services",
      "Employment services (PEO)",
      "Best practices and playbooks",
      "Vendor and partner agreements",
    ],
  },
  /** Six pairs in the diagram; labels flip with the audience. */
  pairCount: 6,
  pairLabel: {
    firm: { client: "Law firm", mlo: "MLO" },
    corporate: { client: "Legal department", mlo: "MLO" },
  } satisfies ByAudience<{ client: string; mlo: string }>,
  legend: {
    agreement: "Services agreement between a client and its MLO",
    operator: "Operator services from Spaarke to each MLO",
  },
  blocks: [
    { title: "Center of excellence", body: "Playbooks, standards and training developed once and applied in every MLO." },
    { title: "Technology", body: "One platform instead of a dozen vendors per firm, kept current as AI changes." },
    { title: "Shared services", body: "Purchasing and operations at a scale no single organization reaches alone." },
    {
      title: "Network learning",
      body: "What works at one MLO improves the others. Benchmarks are shared only in aggregate.",
    },
  ],
  corporateBlock: {
    title: "One platform with your outside firms",
    body: "A company and its outside firms can work on the same platform, which reduces re-keying and improves visibility on every matter.",
  },
  platformLink: { label: "See the platform", href: "/platform" },
};

/* ------------------------------------------------------------------ */
/* 6. The financial opportunity                                        */
/* ------------------------------------------------------------------ */

export const financial = {
  id: "financial-opportunity",
  eyebrow: "The financial opportunity",
  title: {
    firm: "See how the economics change",
    corporate: "See how the cost of legal changes",
  } satisfies ByAudience<string>,
  narrative: {
    firm: "Moving operating functions to an MLO can lower operating expense, turn hard-to-fund technology investment into a predictable service cost, and raise profit per partner. Over time, the firm also builds long-term value in the operator network.",
    corporate:
      "Moving operations and technology to an MLO lowers the total cost of legal, reduces routine outside counsel spend and gives the department technology it would struggle to buy and run alone.",
  } satisfies ByAudience<string>,
  networkValue: "Each MLO that joins adds purchasing power, learning and capability for every member.",
  /** Firm view only (design.md 4.6). Factual, no promises. */
  capitalNote:
    "For firms that want it, private capital may be available as a source of growth funding or as an exit option. It is never a requirement.",
};

/* ------------------------------------------------------------------ */
/* 7. Designing, implementing and operating MLO                        */
/* ------------------------------------------------------------------ */

export interface Phase {
  id: string;
  name: string;
  summary: string;
  steps: ByAudience<string[]>;
  outcome: ByAudience<string>;
}

export const approach = {
  id: "approach",
  eyebrow: "Designing, implementing and operating MLO",
  title: "Designed in weeks. Judged over years.",
  phases: [
    {
      id: "design",
      name: "Design",
      summary: "Set the goals, choose the services and fix how fees are set.",
      steps: {
        firm: [
          "Goals and a baseline of the firm’s current costs",
          "Choose the services the MLO will deliver",
          "Fix the fee method on an independent benchmark",
          "Ethics and regulatory review",
        ],
        corporate: [
          "Goals and a baseline of spend, matters and outside counsel use",
          "Choose the services the MLO will deliver",
          "Agree service levels and the fee method",
          "Privilege, data and procurement review",
        ],
      },
      outcome: {
        firm: "A signed design: services, fee method and governance.",
        corporate: "A signed design: services, service levels and governance.",
      },
    },
    {
      id: "implement",
      name: "Implement",
      summary: "Stand up the MLO and move people and technology across.",
      steps: {
        firm: [
          "Set up the MLO",
          "Transition people and technology",
          "Run old and new side by side before cutover",
        ],
        corporate: [
          "Set up the MLO and connect it to company systems",
          "Move operations and technology work across",
          "Run old and new side by side before cutover",
        ],
      },
      outcome: {
        firm: "The MLO running the chosen functions, with no break in client service.",
        corporate: "The MLO running the chosen functions, with no break in service to the business.",
      },
    },
    {
      id: "operate",
      name: "Operate",
      summary: "Run to service levels and improve every year.",
      steps: {
        firm: [
          "Service levels and regular reporting",
          "Continuous improvement from the operator’s center of excellence",
          "Annual governance review",
        ],
        corporate: [
          "Service levels and regular reporting to the general counsel",
          "Continuous improvement from the operator’s center of excellence",
          "Annual governance review",
        ],
      },
      outcome: {
        firm: "Lower cost per matter and technology that keeps pace, year after year.",
        corporate: "Lower cost per matter and stronger control, year after year.",
      },
    },
  ] as Phase[],
};

/* ------------------------------------------------------------------ */
/* 8. FAQ, closing and disclaimers                                     */
/* ------------------------------------------------------------------ */

/** Draft answers. Counsel reviews every answer before the page is indexed. */
export const faq = {
  id: "faq",
  eyebrow: "Questions",
  title: "Frequently asked questions",
  items: [
    {
      q: "What is Managed Legal Operations?",
      a: "A managed service that runs the business side of legal, including technology, operations, finance and administration, so lawyers can concentrate on the practice of law. It is delivered through a separate company, a Managed Services Organization, under a services agreement.",
    },
    {
      q: "Does the MLO practice law?",
      a: "No. The MLO does not practice law, does not give legal advice and does not direct legal judgment. Lawyers, clients and legal decisions stay with the firm or the legal department.",
    },
    {
      q: "How are fees set?",
      a: "Fees are fixed, per unit of service or cost-plus, set against an independent benchmark of fair market value. They are never a share of legal fees, revenue or profit.",
    },
    {
      q: "Who owns what?",
      a: "The firm or department keeps its lawyers, its clients, its data and its revenue. The MLO owns the operating functions it delivers and the people it employs to deliver them.",
    },
    {
      q: "How long does it take?",
      a: "Design typically takes weeks. Implementation is phased, with old and new running side by side before each function moves across, so the timeline depends on the services chosen.",
    },
    {
      q: "How is data protected?",
      a: "Privilege and confidentiality shape the design from the start: which data and systems the MLO can reach, under what controls, and with what audit trail. Client and company data stay under the owner’s governance.",
    },
  ],
};

export const closing = {
  title: "Practice law. We’ll run the business.",
  body: {
    firm: "Talk to us about what an MLO would look like for your firm.",
    corporate: "Talk to us about what an MLO would look like for your legal department.",
  } satisfies ByAudience<string>,
};

export const disclaimers = [
  "This page is general information about a service. It is not legal, tax or financial advice.",
  "Nothing on this page is an offer to sell, or a solicitation of an offer to buy, any security or interest in any entity.",
  "Calculator figures are illustrative, use placeholder assumptions and are not a projection, forecast or offer. Results will differ for every organization.",
  "Statistics are cited to their published sources and dates. Vendor-sourced figures are labeled as such.",
  "Managed Legal Operations does not include the practice of law. Each structure is subject to the rules of the jurisdictions in which the client practices.",
];
