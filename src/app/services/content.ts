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
 *  - Fees are fixed or per-unit and benchmarked to fair market value (say
 *    "independent study" only once one exists);
 *    never tied to legal fees (owner decision 2026-11-22).
 *  - Every statistic carries a source. `verification` records what must be
 *    checked against the primary report before launch.
 * Counsel reviews final copy, function labels and FAQ answers before the
 * page is indexed. Run `npm run voice:lint -- src/app/services/content.ts`.
 */
import type { ByAudience } from "@/components/services/audience-types";

/** Owner decisions 2026-11-21: conversations and numbers go to booking; assessments to the contact form with the MLO reason preselected. */
export const ctas = {
  conversation: { label: "Start a conversation", href: "/meet" },
  assessment: { label: "Request an assessment", href: "/contact?reason=mlo" },
  numbers: { label: "Discuss your numbers", href: "/meet" },
};

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Spaarke Managed Legal Operations",
  /** Owner decision 2026-11-21: one headline for both audiences. */
  headline: ["Practice law.", "We’ll run the operations."],
  subhead: {
    /** Owner copy, 2026-11-22. */
    firm: "Spaarke provides the technology, team and back-office operations, at a fixed, per-unit price. Your clients, your legal judgment and your ownership stay yours.",
    corporate:
      "Spaarke gives your legal team the technology, process and capacity to meet the demands of stakeholders and deliver results the business can see and measure.",
  } satisfies ByAudience<string>,
  primaryCta: {
    firm: { label: "Start a conversation", href: "/meet" },
    corporate: { label: "Start a conversation", href: "/meet" },
  } satisfies ByAudience<{ label: string; href: string }>,
  secondaryCta: { label: "See how it works", href: "#what-is-mlo" },
  media: {
    /**
     * Background video behind the hero, like the Platform hero. Review round 3
     * (2026-11-21): one clip is picked at random on each page load, for some
     * variation. The clips are unlicensed, watermarked Stocksy comps on trial
     * (5947230 and 5947223): they live only in the local worktree at
     * public/services/hero-comp-*.mp4, are gitignored, and must never be
     * committed. Where a file is missing (any deployed build) the hero shows
     * the fallback photo instead. License the clips, or pick others, before
     * launch; `interim: true` shows a small label.
     */
    videos: [
      // `focus` is the CSS object-position that keeps the subject in the visible right side.
      { src: "/services/hero-comp-1.mp4", focus: "60% 50%" },
      { src: "/services/hero-comp-2.mp4", focus: "60% 50%" },
    ] as { src: string; focus: string }[],
    // Interim: Unsplash XjJmfN7QJj4, Vitaly Gariev, Unsplash License. Replace before launch.
    fallbackImage: "/services/hero-interim.jpg",
    fallbackFocus: "70% 50%",
    interim: true,
  },
};

/* ------------------------------------------------------------------ */
/* 4. What is Managed Legal Operations                                 */
/* ------------------------------------------------------------------ */

export const whatIsMlo = {
  id: "what-is-mlo",
  eyebrow: "What is Managed Legal Operations",
  title: "The operating model built for how legal works",
  definition:
    "Managed Legal Operations (MLO) is a managed service that runs the business side of legal (technology, operations, finance and administration) so lawyers can concentrate on the practice of law.",
  msoNote:
    "MLO is delivered through a Management Services Organization, or MSO: a separate company that provides non-legal services under a services agreement. The MSO is the structure. MLO is the service it provides.",
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
  /**
   * Keep visible wherever the structure is explained (design.md section 9).
   * Owner copy 2026-11-22. Say "independent study" only once one exists.
   */
  boundaryLine:
    "The MSO does not practice law, share in legal fees or direct legal judgment. Its fee is fixed or per-unit, benchmarked to fair market value, and never tied to legal fees. Attorneys review all AI output.",
};

/* ------------------------------------------------------------------ */
/* 4a. The MSO structure visual (handoff 2026-11-22, simplified)       */
/* ------------------------------------------------------------------ */

/** A labeled group of items inside a block (the law firm box). */
export interface StructureGroup {
  /** "decides" gets the most weight: a brighter label and a lock icon. "shares" anchors the network value arrow. */
  id: "decides" | "say" | "shares";
  label: string;
  items: string[];
  link?: { label: string; href: string };
}

export interface StructureBlock {
  eyebrow: string;
  title: string;
  sub: string;
  /** A plain list, or labeled groups in its place. */
  items?: string[];
  groups?: StructureGroup[];
}

/**
 * Securities counsel must approve the SHARES IN group and the "Share in
 * network value" arrow before launch (diagram spec 2026-11-22, section 5).
 * false hides both.
 */
export const SHOW_NETWORK_VALUE = true;

/**
 * "What is Managed Legal Operations" diagram. Built from the structure visual
 * handoff (notes/mso-structure-visual), then simplified at the owner's
 * request (2026-11-22): only the client block and its MSO, with the fee
 * flowing to the MSO and operations and technology flowing back. Second
 * review the same day: the Spaarke MSO operator returns as a green box under
 * the MSO. The other members and equity figures stay out.
 *
 * Diagram spec 2026-11-22 (owner's spaarke-structure-diagram-spec.md): the
 * firm box splits into DECIDES, HAS A SAY and SHARES IN; the operator "owns
 * and runs" the MSO, with a connector; the firm gives the MSO input on staff,
 * culture and standards; and a dashed arrow carries network value from the
 * operator back to the firm (behind SHOW_NETWORK_VALUE). No dollar amounts,
 * percentages or multiples anywhere in the diagram.
 */
export const structure = {
  title: {
    firm: "Your firm keeps the practice. Spaarke runs the operations.",
    corporate: "Your department keeps the legal work. Spaarke runs the operations.",
  } satisfies ByAudience<string>,
  lede: {
    /** Owner copy 2026-11-22; the department text follows it. */
    firm: "The law firm stays 100% lawyer-owned. Its non-legal operations move into a dedicated management services organization (MSO) that Spaarke owns and runs on its platform. Spaarke funds the transition, so the firm makes no upfront investment, and pricing is designed to cost less per unit than doing the same work in-house.",
    corporate:
      "The legal department stays part of the company, with its lawyers, judgment and decisions. Its legal operations and technology move into a dedicated management services organization (MSO) that Spaarke owns and runs on its platform. Spaarke funds the transition, so the department makes no upfront investment, and pricing is designed to cost less per unit than doing the same work in-house.",
  } satisfies ByAudience<string>,
  /** Connector labels, one entry per line of the label (owner, 2026-11-22). */
  flows: {
    fee: ["Fixed or", "per-unit fee"],
    services: ["Operations and", "technology"],
    /** Operator to MSO, both views. */
    owns: ["Owns and runs"],
    /** Law firm view only: firm to MSO, under the fee. */
    input: ["Input on staff,", "culture and standards"],
    /** Law firm view only, behind SHOW_NETWORK_VALUE: operator to firm, dashed, centered on the operator. */
    share: ["Share in", "network value"],
  },
  /** Shown under the MSO in both views. */
  operator: {
    eyebrow: "MSO operator · Spaarke",
    title: "Spaarke MSO Operator",
    sub: "Owns and runs your MSO",
    items: ["Technology and AI platform", "Shared services", "Business process transformation"],
  } satisfies StructureBlock,
  blocks: {
    firm: {
      client: {
        eyebrow: "Law firm · 100% lawyer-owned",
        title: "Your law firm",
        sub: "Your lawyers and legal professionals. Keeps the practice of law.",
        /** Counsel: the supervision wording varies by state (spec section 5). */
        groups: [
          {
            id: "decides",
            label: "Decides",
            items: [
              "Legal judgment and advice",
              "Client acceptance and conflicts",
              "Fees, billing rates and trust accounts",
              "Supervision of all legal work and AI output",
              "Clients, client confidences and privilege",
              "Firm name, brand and culture",
            ],
          },
          {
            id: "say",
            label: "Has a say",
            items: [
              "Input on MSO staff, culture and standards",
              "Which services it uses from the menu",
              "Service levels reviewed with the MSO",
            ],
          },
          ...(SHOW_NETWORK_VALUE
            ? [
                {
                  id: "shares" as const,
                  label: "Shares in",
                  items: ["Share in network value"],
                  /** Gated: the contact form, until a dedicated request gate exists. */
                  link: { label: "Request the equity model", href: "/contact?reason=mlo" },
                },
              ]
            : []),
        ],
      },
      mso: {
        eyebrow: "Dedicated MSO · Spaarke-owned",
        title: "Your firm’s MSO",
        sub: "Your operations, run to your standards",
        items: [
          "Your same staff, now in the MSO",
          "Administrative support and other non-legal staff",
          "IT, security and systems",
          "Finance, billing and collections",
          "HR, facilities and vendors",
        ],
      },
    },
    corporate: {
      client: {
        eyebrow: "Legal department · in-house",
        title: "Your legal department",
        sub: "Keeps legal judgment",
        items: [
          "In-house lawyers",
          "Legal strategy and advice",
          "Outside counsel choices",
          "Company data and privilege",
          "Decisions and sign-off",
        ],
      },
      mso: {
        eyebrow: "Dedicated MSO · Spaarke-owned",
        title: "Your department’s MSO",
        sub: "Your operations, run to your standards",
        items: [
          "Your legal ops staff, now in the MSO",
          "Matter and spend management",
          "Contract operations",
          "Technology and AI platform",
          "Reporting and benchmarking",
        ],
      },
    },
  } satisfies ByAudience<{ client: StructureBlock; mso: StructureBlock }>,
};

/* ------------------------------------------------------------------ */
/* 3. Definitions: MSO and MLO                                         */
/* ------------------------------------------------------------------ */

/**
 * Review round 3 (2026-11-21): a light-blue band that defines the two terms,
 * from the owner's mockup. The MSO text is the owner's; the corporate
 * variant drops the ownership clause (corporate arrangements have no
 * ownership element). The MLO text is drafted to pair with it. Counsel
 * reviews both.
 */
export const definitions = {
  id: "definitions",
  title: "Two terms",
  mso: {
    abbr: "MSO",
    term: "Management Services Organization",
    body: {
      firm: "An operating company separate from the law firm that delivers non-legal business functions under a services agreement. It is organized to enable non-lawyer ownership and facilitate technology and operational transformation to improve legal service performance.",
      corporate:
        "An operating company separate from the legal department that delivers non-legal business functions under a services agreement. It is organized to bring technology and operational transformation to the department and improve legal service performance.",
    } satisfies ByAudience<string>,
  },
  mlo: {
    abbr: "MLO",
    term: "Managed Legal Operations",
    body: {
      firm: "The managed service an MSO delivers to a law firm: the technology, AI, operations, finance and administration that run the business side of legal, so lawyers can concentrate on the practice of law.",
      corporate:
        "The managed service an MSO delivers to a legal department: the technology, AI, operations and reporting that run the business side of legal, so lawyers can concentrate on legal work.",
    } satisfies ByAudience<string>,
  },
};

/* ------------------------------------------------------------------ */
/* 2. Why MLO, why now                                                 */
/* ------------------------------------------------------------------ */

/**
 * Review round 3 (2026-11-21): each tile is a small chart beside its text.
 * "donut" = one share of a whole; "waffle" = x in ten; "columns" = two or
 * three values side by side, the highlighted one in the accent color.
 */
export type StatChart = "donut" | "waffle" | "columns";
/**
 * "retrieved-snippet" = seen in a search result during research; confirm in the primary report.
 * "secondary-verify"  = taken from a secondary citation; find and confirm the primary before publishing.
 */
export type Verification = "retrieved-snippet" | "secondary-verify";

export interface WhyNowStat {
  id: string;
  theme: string;
  /** Action title: states the takeaway, not the topic. Written in each audience's voice. */
  title: ByAudience<string>;
  /** The headline number, for "donut" and "waffle". */
  figure?: string;
  caption: string;
  chart: StatChart;
  /** Share for "donut" (0 to 100) or count in ten for "waffle". */
  value?: number;
  /** Data for "columns". `display` is the label shown above the column. */
  data?: { label: string; value: number; display: string }[];
  /** Index of the highlighted column; defaults to the last. */
  highlight?: number;
  source: { name: string; url: string; date?: string; note?: string };
  verification: Verification;
  /** Position in each audience's 2 x 2 grid (1 to 4). Leave an audience out to hide the stat there. */
  rank: Partial<ByAudience<number>>;
}

export const whyNow = {
  id: "why-now",
  eyebrow: "Why Managed Legal Operations, why now",
  title: "The economics of legal are being rewritten",
  /** Owner copy, review round 3 (2026-11-21). */
  intro: {
    firm: "Law firms face rising client demands for pricing tied to value and outcomes, while new service models reshape how legal work is staffed, delivered and priced.",
    corporate:
      "Legal departments face increased pressure to deliver more value, improve responsiveness and better align to business priorities.",
  } satisfies ByAudience<string>,
  /**
   * Owner picks, review round 3: four stats per audience in a 2 x 2 grid.
   * Law firm: AI use, fee pressure, insourcing, AI-native capital.
   * Legal department: deployment, redesign, insourcing, AI use (department voice).
   */
  stats: [
    {
      id: "tech-adoption",
      theme: "Technology is transforming practice",
      title: {
        firm: "Seven in ten law-firm attorneys now use AI every week",
        corporate: "Seven in ten of your outside counsel now use AI every week",
      },
      figure: "70%",
      caption: "of attorneys at law firms use AI at least once a week, a sharp increase from the year before.",
      chart: "waffle",
      value: 7,
      source: { name: "Law360 Pulse, 2026 AI Survey", url: "https://www.law360.com/legalindustry/articles/2454764", date: "March 2026" },
      verification: "retrieved-snippet",
      rank: { firm: 1, corporate: 4 },
    },
    {
      id: "delivery-dynamics",
      theme: "New service delivery dynamics",
      title: {
        firm: "Legal departments have moved from POC to deploying AI",
        corporate: "Legal departments have moved from POC to deploying AI",
      },
      figure: "61%",
      caption: "of legal departments are in AI deployment phases, and 10% say AI is fully embedded in daily workflows.",
      chart: "donut",
      value: 61,
      source: {
        name: "Deloitte Legal, The AI Imperative",
        url: "https://www.deloitte.com/uk/en/about/press-room/ai-set-to-reshape-legal-work-law-firm-pricing-and-legal-careers.html",
        date: "2026",
        note: "Survey of 121 senior legal leaders, April to May 2026",
      },
      verification: "retrieved-snippet",
      rank: { corporate: 1 },
    },
    {
      id: "fee-pressure",
      theme: "Pressure on effort-based fees",
      title: {
        firm: "Clients expect AI savings to show up in the bill",
        corporate: "Departments expect AI savings to show up in the bill",
      },
      figure: "92%",
      caption: "of legal departments expect AI-related rate cuts from their firms.",
      chart: "donut",
      value: 92,
      source: {
        name: "Axiom survey (vendor-sourced)",
        url: "https://www.llms-for-lawyers.com/practice-areas/ai-for-in-house-counsel/",
      },
      verification: "secondary-verify",
      rank: { firm: 2 },
    },
    {
      id: "tech-cost-complexity",
      theme: "Technology cost and complexity",
      title: {
        firm: "Technology only pays off when the work is redesigned around it",
        corporate: "Technology only pays off when the work is redesigned around it",
      },
      /** Owner review 2026-11-22: 100 characters at most. */
      caption: "Cost reduction with workflow redesign versus without. Only 37% see a positive EBIT impact from AI.",
      chart: "columns",
      data: [
        { label: "Without redesign", value: 20, display: "<20%" },
        { label: "With redesign", value: 60, display: "~60%" },
      ],
      source: {
        name: "BCG; McKinsey",
        url: "https://www.bcg.com/publications/2026/reinventing-the-operating-system-of-work-with-ai",
      },
      verification: "secondary-verify",
      rank: { corporate: 2 },
    },
    {
      id: "ai-native-competition",
      theme: "Competition from AI-native firms",
      title: {
        firm: "Capital is flowing to AI-native competitors",
        corporate: "Capital is flowing to AI-native legal providers",
      },
      caption: "Legal tech venture funding quadrupled, from $1B in 2023 to more than $4B in 2025.",
      chart: "columns",
      data: [
        { label: "2023", value: 1, display: "$1B" },
        { label: "2025", value: 4, display: "$4B+" },
      ],
      source: { name: "Gavel", url: "https://www.gavel.io/resources/ai-native-law-firms-how-to-respond" },
      verification: "secondary-verify",
      rank: { firm: 4 },
    },
    {
      id: "insourcing",
      theme: "Work moving back in-house",
      title: {
        firm: "Clients are keeping more work in-house",
        corporate: "Legal departments are keeping more work in-house",
      },
      /**
       * Owner copy, 2026-11-22. The survey of 135 corporate law departments
       * asked who expects to increase outside counsel spend: 58% last year,
       * 37% this year. The columns show the rest, who expect to keep it level
       * or reduce it (42% and 63%).
       */
      caption: "63% of legal departments expect to keep level or reduce outside counsel spend.",
      chart: "columns",
      data: [
        { label: "Last year", value: 42, display: "42%" },
        { label: "This year", value: 63, display: "63%" },
      ],
      source: {
        name: "Above the Law",
        url: "https://abovethelaw.com/2025/12/biglaws-worst-enemy-isnt-ai-its-clients-using-ai-to-stop-paying-them/",
        date: "December 2025",
      },
      verification: "retrieved-snippet",
      rank: { firm: 3, corporate: 3 },
    },
  ] as WhyNowStat[],
  /**
   * Shown in review round 2's highlight band; that band was replaced by the
   * MSO and MLO definitions in round 3. Kept for task 060.
   */
  nuance: {
    title: "AI reallocates the profit pool. It does not shrink it evenly.",
    body: "Practices that combine high automation with durable pricing power can expand margins, while commoditized, substitutable work faces the most pressure. The question is not whether AI reduces hours, but who keeps pricing and client control.",
    // A public primary source is still to be found (design.md section 10, status P).
    source: { name: "Stout and Piper Sandler, law firm MSO white paper (2026)" },
  },
  bridge: "The firms and teams that win will not just buy AI tools. They will redesign how legal is operated.",
};

/** The stats shown to an audience, in its order. */
export function orderedStats(audience: keyof ByAudience<unknown>): WhyNowStat[] {
  return whyNow.stats
    .filter((s) => s.rank[audience] != null)
    .sort((a, b) => (a.rank[audience] ?? 0) - (b.rank[audience] ?? 0));
}

/* ------------------------------------------------------------------ */
/* 4b. How MLO works: the functional structure                         */
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
  title: "What stays with the lawyers, and what the MSO takes on",
  intro: {
    firm: "The firm keeps everything that is the practice of law. The MSO runs the operating functions under a services agreement, for a fixed or per-unit fee benchmarked to fair market value.",
    corporate:
      "The legal department keeps its lawyers, its judgment and its decisions. The MSO runs the operations, technology and reporting that support them, under a services agreement with clear service levels.",
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
        { label: "Firm name and brand", detail: "The firm’s name, reputation and standing with clients stay its own." },
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
        { label: "Business partnership", detail: "The department stays the trusted legal advisor to the company’s leaders and business units." },
      ],
    },
  } satisfies ByAudience<{ title: string; items: AllocationItem[] }>,
  takes: {
    firm: {
      title: "MSO takes on",
      items: [
        { label: "Non-attorney staff", detail: "Administrative and support teams, employed and managed by the MSO." },
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
      title: "MSO takes on",
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
  /** Diagram panels: the client on top, the MSO (spelled out) below. */
  sideLabel: {
    firm: { client: "Law firm", mso: "Management Services Organization" },
    corporate: { client: "Legal department", mso: "Management Services Organization" },
  } satisfies ByAudience<{ client: string; mso: string }>,
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
  operatorNote: "Every MSO is operated by Spaarke.",
};

/* ------------------------------------------------------------------ */
/* 5. The operating company and the MLO partner network                */
/* ------------------------------------------------------------------ */

export type NetworkClient = "firm" | "department";
export type NetworkSize = 1 | 3 | 8;

export const network = {
  id: "network",
  eyebrow: "The operating company and the MLO partner network",
  title: "One operator. A network that gets stronger with every member.",
  /** Handoff 2026-11-22 (notes/mso-operator-network). No equity in either view (owner, 2026-11-22). */
  intro: {
    firm: "Your firm joins a network, not just a vendor. Every member has its own dedicated MSO, and every MSO is owned and run by Spaarke on the same platform. As the network grows, each firm gets more from its MSO and can offer more to its clients.",
    corporate:
      "Your department joins a network, not just a vendor. Every member has its own dedicated MSO, and every MSO is owned and run by Spaarke on the same platform. As the network grows, each department and firm gets more from its MSO: more specialists, better playbooks and better terms.",
  } satisfies ByAudience<string>,
  /** Step tabs: how many members show around the hub (phones show at most six). */
  steps: {
    firm: [
      { size: 1, label: "Your firm joins" },
      { size: 3, label: "Members join" },
      { size: 8, label: "The network at scale" },
    ],
    corporate: [
      { size: 1, label: "Your department joins" },
      { size: 3, label: "Members join" },
      { size: 8, label: "The network at scale" },
    ],
  } satisfies ByAudience<{ size: NetworkSize; label: string }[]>,
  /** Reveal order around the hub. Index 0 is the visitor's own organization. */
  members: {
    firm: ["firm", "firm", "department", "firm", "firm", "department", "firm", "firm"],
    corporate: ["department", "department", "firm", "department", "department", "firm", "department", "firm"],
  } satisfies ByAudience<NetworkClient[]>,
  you: {
    firm: { long: "Your law firm", short: "Your firm" },
    corporate: { long: "Your legal department", short: "Your department" },
  } satisfies ByAudience<{ long: string; short: string }>,
  /** Ring segments (two lines each) and their matching cards, in the same order. Titles only (2026-11-22). */
  capabilities: [
    { ring: ["Technology", "platform"], title: "Technology platform" },
    { ring: ["AI", "capabilities"], title: "AI capabilities" },
    { ring: ["Shared", "services"], title: "Shared services" },
    { ring: ["Employment", "services (PEO)"], title: "Employment services (PEO)" },
    { ring: ["Playbooks and", "transformation"], title: "Playbooks and transformation" },
    { ring: ["Vendor and", "partner deals"], title: "Vendor and partner agreements" },
  ],
  flywheel: {
    firm: ["More members", "More scale and shared learning", "Better capabilities for every firm", "More to offer every client"],
    corporate: ["More members", "More scale and shared learning", "Better capabilities for every member", "Lower cost of legal for every department"],
  } satisfies ByAudience<string[]>,
  hub: {
    title: "Spaarke",
    subtitle: "MSO operator",
    capabilities: [
      "Technology platform",
      "AI capabilities",
      "Business transformation",
      "Shared services",
      "Employment services (PEO)",
      "Best practices and playbooks",
      "Vendor and partner agreements",
    ],
  },
  /**
   * Owner decisions 2026-11-21: six pairs, generic labels, and both client
   * types in both views. Each list is the order pairs join the network as the
   * visitor scrolls; the visitor's own type comes first and is emphasized.
   */
  pairs: {
    firm: ["firm", "department", "firm", "firm", "department", "firm"],
    corporate: ["department", "firm", "department", "department", "firm", "department"],
  } satisfies ByAudience<NetworkClient[]>,
  clientLabel: { firm: "Law firm", department: "Legal department" } satisfies Record<NetworkClient, string>,
  msoLabel: "MSO",
  legend: {
    agreement: "Services agreement between a member and its MSO",
    operator: "Operator services from Spaarke to each MSO",
  },
  blocks: [
    { title: "Center of excellence", body: "Playbooks, standards and training developed once and applied in every MSO." },
    { title: "Technology", body: "One platform instead of a dozen vendors per firm, kept current as AI changes." },
    { title: "Shared services", body: "Purchasing and operations at a scale no single organization reaches alone." },
    {
      title: "Network learning",
      body: "What works at one MSO improves the others. Benchmarks are shared only in aggregate.",
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
    firm: "Moving operating functions to an MSO can lower operating expense, turn hard-to-fund technology investment into a predictable service cost, and raise profit per partner. Over time, the firm also builds long-term value in the operator network.",
    corporate:
      "Moving operations and technology to an MSO lowers the total cost of legal, reduces routine outside counsel spend and gives the department technology it would struggle to buy and run alone.",
  } satisfies ByAudience<string>,
  networkValue: "Each MSO that joins adds purchasing power, learning and capability for every member.",
  /** Firm view only (design.md 4.6). Factual, no promises. */
  capitalNote:
    "For firms that want it, private capital may be available as a source of growth funding or as an exit option. It is never a requirement.",
};

/**
 * The MSO value estimate (task 070): the law firm view of the financial
 * section and the /services/estimate page. Reworked to the owner's value page
 * change list (spaarke-value-page-change-list.md, 2026-11-22): the firm's MSO
 * is a wholly owned Spaarke subsidiary, so there is no MSO profit share and
 * no equity figure anywhere; the base case is the cost saving alone. Rows 1
 * to 8, 19 and 20 need securities counsel before launch. "Availability varies
 * by state" is left out of the disclaimers: the owner confirmed the same day
 * that no state restriction applies. Figures are computed in
 * src/components/services/estimate/.
 */
export const estimate = {
  title: "Run leaner, compete on technology, and build equity",
  /** Change list 2026-11-22, rows 24 to 34 (rows 32 to 34 need securities counsel). */
  lede: "Your firm moves its back office and technology into a dedicated MSO that Spaarke owns and runs. Spaarke funds the transition, and the firm stays fully lawyer-owned.",
  presetsLabel: "Start from a typical firm",
  presets: [
    { key: "small", label: "Small firm" },
    { key: "mid", label: "Mid-size firm" },
    { key: "large", label: "Large firm" },
  ] as const,
  fields: {
    partners: "Equity partners",
    attorneys: "Other lawyers and professionals",
    revenue: "Annual revenue",
  },
  /** Value page row 11: off by default, and labeled as an assumption. */
  upside: {
    label: "Capacity upside",
    note: "An assumption, not a result: new matters from freed lawyer time, plus new client services.",
  },
  /** Value page row 15. */
  assumptionsToggle: { open: "Edit the assumptions", close: "Hide the assumptions", reset: "Reset" },
  adjustable: {
    feeDiscount: "MSO fee below today’s cost",
    efficiency: "MSO efficiency gain",
    redeploy: "Freed time used for new matters",
    glide: "Fee reduction each year",
  },
  capNote: "The fee discount is capped at what the MSO’s efficiency gain pays for.",
  objectives: [
    { title: "Lower operating cost", question: "Run the firm for less" },
    { title: "Technology edge", question: "Compete with larger firms and AI-first rivals" },
    { title: "Share in the network’s growth", question: "Member equity in Spaarke, earned through use" },
  ],
  /** Card 3 is public: no dollar amounts, profit share or multiples (row 32). */
  equity: {
    bullets: [
      "Vested equity is kept if you leave or close",
      "Your own lawyers and staff can share in it",
      "It grows as more firms join",
    ],
    /** Gated: the contact form, until a dedicated request gate exists. */
    link: { label: "Request the equity model", href: "/contact?reason=mlo" },
  },
  summary: {
    base: "in lower operating cost, plus a technology and capacity advantage.",
    /** Shown when the capacity upside is on: "With the capacity upside ... about $X a year in all." */
    upside: ["With the capacity upside, which is an assumption, about", "a year in all."],
  },
  detailsCta: "See the details",
  /** Under the calculator. Counsel to approve. */
  disclaimer:
    "Illustrative estimate based on representative assumptions, not a forecast or an offer of securities. Results depend on the firm and on the MSO fee, benchmarked to fair market value.",
  /** Value page row 20: next to each numeric section. Counsel to approve. */
  note: "Illustrative estimate based on representative assumptions, not a forecast or an offer of securities.",
  /** Value page row 6: the approved three-box diagram, right after the calculator (row 16). */
  structure: {
    title: "The structure",
    caption:
      "The law firm stays 100% lawyer-owned and keeps the practice of law. Spaarke owns and runs the MSO, which handles everything that is not legal advice.",
  },
  details: {
    title: "How the estimate works",
    bridgeTitle: "Where the savings come from",
    feeTitle: "The fee over five years",
    tableTitle: "Today vs with the MSO",
    tableCaption: {
      base: "Annual figures for the whole firm, base case: the cost saving alone.",
      upside: "Annual figures for the whole firm, with the capacity upside on.",
    },
    stepsTitle: "How it works",
    stepsCaption: "Three changes, no cash from the firm.",
    steps: ["Run the back office for less", "Turn freed time into new work", "Share in the network’s growth"],
    /** Value page row 4: no dollars, percentages or multiples. */
    equityStep: "Member equity in Spaarke, earned through use. Vested equity is kept if you leave or close.",
    assumptionsTitle: "Our assumptions",
    assumptionsCaption:
      "Representative figures for US law firms. Your own numbers come from your firm’s costs and a fee benchmarked to fair market value.",
    /** Value page row 14. */
    validate: "To validate in pilot",
  },
  /** Value page row 19. */
  closing: {
    title: "Your firm’s own numbers",
    body: "We build the estimate from your firm’s actual costs, in a confidential conversation.",
    primary: { label: "Get an estimate for your firm", href: "/contact?reason=mlo" },
    secondary: { label: "Request the equity model", href: "/contact?reason=mlo" },
  },
};

/**
 * The legal department equivalent (task 071, 2026-11-22). Same structure as
 * the law firm estimate. No equity, ownership or profit share anywhere: the
 * department contracts with an MSO that Spaarke runs (design.md section 9).
 * Figures come from src/components/services/estimate/dept-model.ts.
 */
export const deptEstimate = {
  title: "Run leaner, work like a much larger team, and lock in the savings",
  lede: "Your department moves legal operations and technology into an MSO that Spaarke funds and runs. The department pays a fixed or per-unit fee, benchmarked to fair market value and below today’s cost, invests no capital and keeps every legal decision.",
  presetsLabel: "Start from a typical department",
  presets: [
    { key: "small", label: "Small department" },
    { key: "mid", label: "Mid-size department" },
    { key: "large", label: "Large department" },
  ] as const,
  fields: {
    lawyers: "In-house lawyers",
    staff: "Legal operations and support staff",
    budget: "Annual legal budget, including outside counsel",
  },
  objectives: [
    { title: "Lower cost of legal", question: "Run the department for less" },
    { title: "Technology edge", question: "Give a lean team the tools of a large firm" },
    { title: "Lasting value", question: "Lock in the savings without spending capital" },
  ],
  detailsCta: "See the details",
  disclaimer:
    "Illustrative estimate using representative assumptions for US corporate legal departments, not a forecast or an offer. Actual results depend on the department, its outside counsel mix, the scope of the services agreement and the MSO fee as benchmarked to fair market value.",
  details: {
    title: "How the estimate works",
    bridgeTitle: "Where the savings come from",
    tableTitle: "Today vs with the MSO",
    tableCaption: "Annual figures for the whole department.",
    stepsTitle: "How it works",
    stepsCaption: "Three changes, no capital from the department.",
    steps: ["Run legal operations for less", "Bring routine work back in-house", "Send routine matters to the MSO"],
    structureTitle: "The structure",
    structureCaption:
      "The department keeps every legal decision and all privileged work. The MSO runs operations and technology under a services agreement. The department owns no part of it.",
    assumptionsTitle: "Our assumptions",
    assumptionsCaption:
      "Representative figures for US corporate legal departments. Your own numbers come from an assessment of your spend.",
  },
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
  title: "Designed in weeks. Value delivered over years.",
  /**
   * Owner decision 2026-11-21: link the Spaarke Method under the phases. The
   * sentence explains how the two sets of phases fit: these three stand up and
   * run the MSO; the Method's five deliver the technology and AI work inside it.
   */
  method: {
    text: "Inside the MSO, technology and AI work follows the Spaarke Method: one decision at a time, with legal engineers working alongside your team.",
    link: { label: "Read the Spaarke Method", href: "/why-spaarke/the-spaarke-method" },
  },
  phases: [
    {
      id: "design",
      name: "Design",
      summary: "Set the goals, choose the services and fix how fees are set.",
      steps: {
        firm: [
          "Goals and a baseline of the firm’s current costs",
          "Choose the services the MSO will deliver",
          "Set the fee with an independent fair-market-value study",
          "Ethics and regulatory review",
        ],
        corporate: [
          "Goals and a baseline of spend, matters and outside counsel use",
          "Choose the services the MSO will deliver",
          "Agree service levels and a fair-market-value fee",
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
      summary: "Stand up the MSO and move people and technology across.",
      steps: {
        firm: [
          "Set up the MSO",
          "Transition people and technology",
          "Run old and new side by side before cutover",
        ],
        corporate: [
          "Set up the MSO and connect it to company systems",
          "Move operations and technology work across",
          "Run old and new side by side before cutover",
        ],
      },
      outcome: {
        firm: "The MSO running the chosen functions, with no break in client service.",
        corporate: "The MSO running the chosen functions, with no break in service to the business.",
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
      a: "A managed service that runs the business side of legal, including technology, operations, finance and administration, so lawyers can concentrate on the practice of law. It is delivered through a separate company, a Management Services Organization, under a services agreement.",
    },
    {
      q: "Does the MSO practice law?",
      a: "No. The MSO does not practice law, does not give legal advice and does not direct legal judgment. Lawyers, clients and legal decisions stay with the firm or the legal department.",
    },
    {
      q: "How are fees set?",
      a: "Fees are fixed or per-unit and benchmarked to fair market value. They are never a share of legal fees, revenue or profit.",
    },
    {
      q: "Who owns what?",
      a: "The firm or department keeps its lawyers, its clients, its data and its revenue. The MSO owns the operating functions it delivers and the people it employs to deliver them.",
    },
    {
      q: "How long does it take?",
      a: "Design typically takes weeks. Implementation is phased, with old and new running side by side before each function moves across, so the timeline depends on the services chosen.",
    },
    {
      q: "How is data protected?",
      a: "Privilege and confidentiality shape the design from the start: which data and systems the MSO can reach, under what controls, and with what audit trail. Client and company data stay under the owner’s governance.",
    },
  ],
};

export const closing = {
  title: "Practice law. We’ll run the operations.",
  body: {
    firm: "Talk to us about what Managed Legal Operations would look like for your firm.",
    corporate: "Talk to us about what Managed Legal Operations would look like for your legal department.",
  } satisfies ByAudience<string>,
};

export const disclaimers = [
  "This page is general information about a service. It is not legal, tax or financial advice.",
  "Nothing on this page is an offer to sell, or a solicitation of an offer to buy, any security or interest in any entity.",
  "Calculator figures are illustrative, use placeholder assumptions and are not a projection, forecast or offer. Results will differ for every organization.",
  "Statistics are cited to their published sources and dates. Vendor-sourced figures are labeled as such.",
  "Managed Legal Operations does not include the practice of law. Each structure is subject to the rules of the jurisdictions in which the client practices.",
];
