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
 *  - Fees are fixed and set at fair market value by an independent study;
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
    firm: "Managed Legal Operations gives your lawyers the technology, team and economics of a much larger firm, and leaves your clients, your judgment and your practice yours.",
    corporate:
      "Managed Legal Operations gives your legal team the AI, technology and operating discipline to do more, at lower cost, with privilege and control intact.",
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
  /** Keep visible wherever the structure is explained (design.md section 9). */
  boundaryLine:
    "The MSO does not practice law, does not share in legal fees, and does not direct legal judgment. Its fee is fixed, set at fair market value by an independent study, and never tied to legal fees.",
};

/* ------------------------------------------------------------------ */
/* 4a. The MSO structure visual (handoff 2026-11-22)                   */
/* ------------------------------------------------------------------ */

export type StructureView = "all" | "own" | "ctrl" | "money" | "value";
export type StructureEdgeType = "own" | "money" | "svc" | "ctrl" | "value";
export type StructureNodeKey = "clients" | "partners" | "firm" | "mso" | "spaarke" | "network";
export type StructureEdgeKey =
  | "fees"
  | "ownFirm"
  | "fee"
  | "svc"
  | "direct"
  | "ownMso"
  | "lic"
  | "plat"
  | "deploy"
  | "equity"
  | "net";

export interface StructureNode {
  title: string;
  sub: string;
  eyebrow?: string;
  items?: string[];
}
export interface StructureEdge {
  t: StructureEdgeType;
  /** A second view the edge also lights up in. */
  also?: StructureEdgeType;
  label: string;
  /** Shorter label for the phone layout. */
  short?: string;
}

/**
 * Replaces the law firm / MSO allocation diagram in "What is Managed Legal
 * Operations" (handoff: notes/mso-structure-visual). The law firm copy is the
 * handoff's, in US spelling. The legal department copy is a draft written for
 * the audience switch (2026-11-22): no equity, the company keeps the legal
 * function, and the value flow is upgrades and network learning.
 */
export const structure = {
  title: {
    firm: "Your firm keeps the practice. Spaarke runs the operations.",
    corporate: "Your department keeps the legal work. Spaarke runs the operations.",
  } satisfies ByAudience<string>,
  lede: {
    firm: "The law firm stays 100% lawyer-owned. Its back office moves into a dedicated MSO that Spaarke owns and runs on its platform, and Spaarke pays for the move. The firm puts in no cash, lowers its operating cost and receives equity in Spaarke.",
    corporate:
      "The legal department stays part of the company, with its lawyers, judgment and decisions. Its operations and technology move into a dedicated MSO that Spaarke owns and runs on its platform, and Spaarke pays for the move. The department invests no capital and lowers the total cost of legal.",
  } satisfies ByAudience<string>,
  views: [
    { id: "all", label: "The full picture" },
    { id: "own", label: "Who owns what" },
    { id: "ctrl", label: "Who directs the work" },
    { id: "money", label: "How money moves" },
    { id: "value", label: "Where value builds" },
  ] as { id: StructureView; label: string }[],
  legend: {
    firm: { own: "Ownership", money: "Money", svc: "Services", ctrl: "Firm direction", value: "Value to the firm" },
    corporate: {
      own: "Ownership",
      money: "Money",
      svc: "Services",
      ctrl: "Department direction",
      value: "Value to the department",
    },
  } satisfies ByAudience<Record<StructureEdgeType, string>>,
  brace: { firm: "What the firm owns", corporate: "What the department keeps" } satisfies ByAudience<string>,
  nodes: {
    firm: {
      clients: { title: "Clients", sub: "Engage the firm" },
      partners: { title: "Firm partners", sub: "Licensed lawyers" },
      firm: {
        eyebrow: "Law firm · 100% lawyer-owned",
        title: "Your law firm",
        sub: "Keeps the practice of law",
        items: [
          "Lawyers and legal professionals",
          "Clients and matters",
          "Legal fees and billing rates",
          "Client data and privilege",
          "Firm name and brand",
        ],
      },
      mso: {
        eyebrow: "Dedicated MSO · Spaarke-owned",
        title: "Your firm’s MSO",
        sub: "Your operations, run to your direction",
        items: [
          "Your same staff, now in the MSO",
          "Paralegals, assistants and docketing",
          "IT, security and systems",
          "Finance, billing and collections",
          "HR, facilities and vendors",
        ],
      },
      spaarke: {
        eyebrow: "MSO operator",
        title: "Spaarke",
        sub: "Owns and runs your MSO",
        items: ["Legal platform and AI", "Funds the deployment", "Migrates legacy systems", "Operations and upgrades"],
      },
      network: { title: "Other member firms", sub: "Each with its own MSO" },
    },
    corporate: {
      clients: { title: "Business units", sub: "Bring legal work" },
      partners: { title: "The company", sub: "Funds the legal budget" },
      firm: {
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
        sub: "Your operations, run to your direction",
        items: [
          "Your legal ops staff, now in the MSO",
          "Matter and spend management",
          "Contract operations",
          "Technology and AI platform",
          "Reporting and benchmarking",
        ],
      },
      spaarke: {
        eyebrow: "MSO operator",
        title: "Spaarke",
        sub: "Owns and runs your MSO",
        items: ["Legal platform and AI", "Funds the deployment", "Migrates legacy systems", "Operations and upgrades"],
      },
      network: { title: "Other members", sub: "Each with its own MSO" },
    },
  } satisfies ByAudience<Record<StructureNodeKey, StructureNode>>,
  edges: {
    firm: {
      fees: { t: "money", label: "Legal fees" },
      ownFirm: { t: "own", label: "Own 100%" },
      fee: { t: "money", label: "Fixed fee" },
      svc: { t: "svc", also: "ctrl", label: "Back-office services", short: "Services" },
      direct: { t: "ctrl", label: "Directs day-to-day", short: "Directs work" },
      ownMso: { t: "own", label: "Owns 100%" },
      lic: { t: "money", label: "Fee + profit", short: "License" },
      plat: { t: "svc", label: "Platform + ops", short: "Platform" },
      deploy: { t: "money", label: "Funds setup" },
      equity: { t: "value", also: "own", label: "Spaarke equity to the firm", short: "Spaarke equity" },
      net: { t: "svc", also: "value", label: "Same platform" },
    },
    corporate: {
      fees: { t: "svc", label: "Legal work" },
      ownFirm: { t: "money", label: "Budget" },
      fee: { t: "money", label: "Fixed fee" },
      svc: { t: "svc", also: "ctrl", label: "Operations services", short: "Services" },
      direct: { t: "ctrl", label: "Directs day-to-day", short: "Directs work" },
      ownMso: { t: "own", label: "Owns 100%" },
      lic: { t: "money", label: "Fee + profit", short: "License" },
      plat: { t: "svc", label: "Platform + ops", short: "Platform" },
      deploy: { t: "money", label: "Funds setup" },
      equity: { t: "value", label: "Upgrades and network learning", short: "Upgrades" },
      net: { t: "svc", also: "value", label: "Same platform" },
    },
  } satisfies ByAudience<Record<StructureEdgeKey, StructureEdge>>,
  captions: {
    firm: {
      all: [
        ["The practice", "The law firm stays 100% owned by its lawyers. Clients, legal fees, legal judgment and the firm name do not move."],
        ["The back office", "Your same staff, systems and operations move into a dedicated MSO owned and run by Spaarke. Your firm directs the day-to-day work."],
        ["The operator", "Spaarke owns and runs the MSO on its platform, and pays for the deployment. The firm puts in no cash and receives equity in Spaarke."],
      ],
      own: [
        ["Law firm", "Partners own 100% of the law firm, as they do today. Ownership of the practice does not change."],
        ["Your MSO", "Spaarke owns 100% of each firm’s dedicated MSO, as operators and investors do in most legal MSOs. Ownership sits with Spaarke; direction of the work sits with the firm."],
        ["Spaarke equity", "Instead of a stake in one MSO, the firm receives equity in Spaarke, which owns every MSO on the network. There is no private equity, no outside investor and no cash in."],
      ],
      ctrl: [
        ["The same people", "Your staff move to the MSO as employees, but they keep working with the same lawyers, on the same matters, in the same offices."],
        ["Firm direction", "The firm sets priorities and directs the day-to-day work. Lawyers supervise staff on client matters, as the professional rules require."],
        ["Shared governance", "A joint operating committee, agreed service levels, and firm approval over key staff and any change that affects clients. Spaarke runs the business; the firm directs the work."],
      ],
      money: [
        ["Legal fees stay", "Clients pay the law firm. Legal fees stay with the firm and are never shared with the MSO or Spaarke."],
        ["A lower, fixed fee", "The firm pays its MSO a fixed fee, set by a fair-market-value study and priced below today’s back-office cost. The savings are the firm’s from day one."],
        ["License and profit", "The MSO pays Spaarke a fixed platform license, and as owner Spaarke receives the MSO’s profit. The firm sees open-book reporting, and Spaarke earns its return by running the MSO well."],
      ],
      value: [
        ["Better margins now", "A lower operating cost and modern technology lift the firm’s margin and competitiveness straight away."],
        ["A shared network", "Every member firm runs on the same Spaarke platform, so improvements and benchmarks are shared across the network."],
        ["Long-term value", "The firm’s Spaarke equity shares in the whole network, not one firm’s back office. Liquidity comes at the Spaarke level, on terms members helped build."],
      ],
    },
    corporate: {
      all: [
        ["The legal function", "The legal department stays part of the company. Its lawyers, legal judgment, outside counsel choices and decisions do not move."],
        ["The operations", "Legal operations, technology and support move into a dedicated MSO owned and run by Spaarke. The department directs the day-to-day work."],
        ["The operator", "Spaarke owns and runs the MSO on its platform, and pays for the deployment. The department invests no capital."],
      ],
      own: [
        ["Legal department", "The company employs its lawyers and keeps its legal function, as it does today. That does not change."],
        ["Your MSO", "Spaarke owns 100% of each department’s dedicated MSO. Ownership sits with Spaarke; direction of the work sits with the department."],
        ["No stake required", "The department takes no ownership in the MSO or in Spaarke and invests no capital. It buys a service at a fixed fee."],
      ],
      ctrl: [
        ["The same people", "Operations staff who move to the MSO keep working with the same lawyers, on the same matters, to the same standards."],
        ["Department direction", "The department sets priorities and directs the day-to-day work. Lawyers review and sign off legal work, as the professional rules require."],
        ["Shared governance", "A joint operating committee, agreed service levels, and department approval over key staff and any change that affects legal work. Spaarke runs the operations; the department directs the work."],
      ],
      money: [
        ["A fixed fee", "The department pays its MSO a fixed fee, set by a fair-market-value study and priced below today’s cost of the same work, so the legal budget is predictable."],
        ["Less outside spend", "Time the MSO frees up brings routine outside counsel work back in-house, and the MSO handles routine work at lower cost, with lawyers reviewing it."],
        ["License and profit", "The MSO pays Spaarke a fixed platform license, and as owner Spaarke receives the MSO’s profit. The department sees open-book reporting."],
      ],
      value: [
        ["Lower cost now", "A lower operating cost and modern technology reduce the total cost of legal straight away."],
        ["A shared network", "Every member runs on the same Spaarke platform, so improvements and benchmarks are shared, and outside firms on the network can work on the same platform."],
        ["Kept current", "Platform upgrades and new AI capabilities are included, so the department does not fall behind or fund the next upgrade itself."],
      ],
    },
  } satisfies ByAudience<Record<StructureView, [string, string][]>>,
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
      theme: "Downward pressure on effort-based fees",
      title: {
        firm: "Clients expect AI savings to show up in the bill",
        corporate: "Departments expect AI savings to show up in the bill",
      },
      figure: "92%",
      caption: "of legal departments expect, or are negotiating, AI-related rate cuts from their law firms.",
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
      theme: "Cost and complexity of new technology",
      title: {
        firm: "Technology only pays off when the work is redesigned around it",
        corporate: "Technology only pays off when the work is redesigned around it",
      },
      caption:
        "Cost reduction reported with end-to-end workflow redesign versus without it. Only 37% of organizations report a positive EBIT impact from AI.",
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
      caption: "Legal tech venture funding, 2023 to 2025.",
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
      caption:
        "Share of legal departments expecting to increase outside counsel spend, last year versus this year, in a survey of 135 corporate law departments.",
      chart: "columns",
      data: [
        { label: "Last year", value: 58, display: "58%" },
        { label: "This year", value: 37, display: "37%" },
      ],
      source: {
        name: "Above the Law, reporting a corporate law department survey",
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
    firm: "The firm keeps everything that is the practice of law. The MSO runs the operating functions under a services agreement, for a fixed fee set at fair market value.",
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
  /** Handoff 2026-11-22 (notes/mso-operator-network); the department copy has no equity. */
  intro: {
    firm: "Your firm joins a network, not just a vendor. Every member has its own dedicated MSO, and every MSO is owned and run by Spaarke on the same platform. As the network grows, each firm can offer more to its clients, and the equity each firm holds in Spaarke grows with it.",
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
  /** Ring segments (two lines each) and their matching cards, in the same order. */
  capabilities: [
    { ring: ["Technology", "platform"], title: "Technology platform", body: "One modern legal platform in place of a dozen separate tools, kept current for every member." },
    { ring: ["AI", "capabilities"], title: "AI capabilities", body: "AI workflows for legal operations, built, tested and supported, and improved across the network." },
    { ring: ["Shared", "services"], title: "Shared services", body: "Finance, billing, collections, IT and security, run at a scale no single member reaches alone." },
    { ring: ["Employment", "services (PEO)"], title: "Employment services (PEO)", body: "Your staff employed through the MSO, with stronger benefits, payroll and HR support." },
    { ring: ["Playbooks and", "transformation"], title: "Playbooks and transformation", body: "Proven practices from across the network, and hands-on help redesigning how work gets done." },
    { ring: ["Vendor and", "partner deals"], title: "Vendor and partner agreements", body: "Network pricing on software, insurance, research and outside services." },
  ],
  flywheel: {
    firm: ["More members", "More scale and shared learning", "Better capabilities for every firm", "More value in every firm’s equity"],
    corporate: ["More members", "More scale and shared learning", "Better capabilities for every member", "Lower cost of legal for every department"],
  } satisfies ByAudience<string[]>,
  offer: {
    title: { firm: "What your firm can offer", corporate: "What your department gets" } satisfies ByAudience<string>,
    step: {
      firm: {
        1: "On day one, your firm runs on a platform and operating team built for a much larger firm.",
        3: "As members join, shared teams and proven playbooks give your firm capabilities it could not build alone.",
        8: "At network scale, your firm gets buying power and peer benchmarks, so it can compete for work that goes to larger firms.",
      },
      corporate: {
        1: "On day one, your department runs on a platform and operating team built for a much larger legal function.",
        3: "As members join, shared teams and proven playbooks give your department capabilities it could not build alone.",
        8: "At network scale, your department gets buying power and peer benchmarks, and keeps more routine work away from outside counsel.",
      },
    } satisfies ByAudience<Record<NetworkSize, string>>,
    items: {
      firm: [
        { at: 1, title: "Modern platform and AI from day one", body: "Compete on technology with firms many times your size." },
        { at: 1, title: "A lower, fixed operating cost", body: "Back office run by Spaarke, priced below today’s cost." },
        { at: 3, title: "Specialists you could not hire alone", body: "Shared finance, billing, HR and security teams across members." },
        { at: 3, title: "Proven playbooks and AI workflows", body: "What works at one member is rolled out to all." },
        { at: 8, title: "Network buying power", body: "Better terms on vendors, insurance and benefits through employment services." },
        { at: 8, title: "Benchmarks against peers", body: "See how your operations compare, shared only in aggregate." },
      ],
      corporate: [
        { at: 1, title: "Modern platform and AI from day one", body: "The technology of a much larger legal team, without building it." },
        { at: 1, title: "A lower, fixed operating cost", body: "Operations run by Spaarke, priced below today’s cost." },
        { at: 3, title: "Specialists you could not hire alone", body: "Shared legal operations, data, finance and security teams across members." },
        { at: 3, title: "Proven playbooks and AI workflows", body: "What works at one member is rolled out to all." },
        { at: 8, title: "Network buying power", body: "Better terms on software, research and outside services." },
        { at: 8, title: "Benchmarks against peers", body: "See how your spend and operations compare, shared only in aggregate." },
      ],
    } satisfies ByAudience<{ at: NetworkSize; title: string; body: string }[]>,
  },
  /** Firm view only: the illustrative equity panel. Pie radius and slice are not data. */
  owns: {
    title: "What your firm owns",
    step: {
      1: { text: "Your firm receives equity in Spaarke when it signs. It is a share of an early-stage operator.", r: 46, pct: 0.3 },
      3: { text: "Each new member adds operator revenue and platform value. Your share is a smaller slice of a larger company.", r: 88, pct: 0.14 },
      8: { text: "Your stake is a share of the whole network, valued as a platform rather than as one firm’s back office.", r: 132, pct: 0.09 },
    } satisfies Record<NetworkSize, { text: string; r: number; pct: number }>,
    keyAll: "Spaarke: the operator of every MSO on the network",
    keyYou: "Your firm’s equity in Spaarke",
    growLabel: "Size of your slice, in value terms",
    note: "Illustrative. Your percentage can fall as members join, but it is a share of a much larger company. Equity terms are set at signing.",
  },
  /** Department view only, in place of the equity panel. */
  outsideFirms: {
    title: "Working with your outside firms",
    step: {
      1: "Your department and its MSO run on the Spaarke platform from day one, with one view of matters, spend and outside firms.",
      3: "As law firms join, outside firms on your panel can work with you on the same platform, with less re-keying.",
      8: "At scale, more of your panel works on the network, so matters, budgets and invoices move between you without re-entry.",
    } satisfies Record<NetworkSize, string>,
    items: [
      { at: 1, title: "One view of matters and spend", body: "Matters, budgets and outside firm performance in one place from day one." },
      { at: 3, title: "Outside firms on the same platform", body: "Firms on your panel that join the network work with you without re-keying." },
      { at: 8, title: "Budgets and invoices without re-entry", body: "Matter data moves between the department and its firms as the work happens." },
    ] satisfies { at: NetworkSize; title: string; body: string }[],
    note: "Network membership never changes which firms the department instructs.",
  },
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
 * The MSO value estimate (task 070, handoff 2026-11-22): the law firm view of
 * the financial section and the /services/estimate details page. Copy as in
 * the handoff, in US spelling. Figures are computed in
 * src/components/services/estimate/. Equity figures appear here by the
 * owner's decision and need counsel sign-off before launch (task 051).
 */
export const estimate = {
  title: "Run leaner, compete on technology, and build equity",
  lede: "Your firm moves its back office and technology into an MSO it owns. Spaarke funds and runs the platform. The firm puts in no cash and stays fully lawyer-owned.",
  presetsLabel: "Start from a typical firm",
  presets: [
    { key: "small", label: "Small boutique" },
    { key: "mid", label: "Mid-size boutique" },
    { key: "large", label: "Large boutique" },
  ] as const,
  fields: {
    partners: "Equity partners",
    attorneys: "Other attorneys and patent agents",
    revenue: "Annual revenue",
  },
  objectives: [
    { title: "Higher margins", question: "Run the firm for less" },
    { title: "Technology edge", question: "Compete with larger firms and AI-first rivals" },
    { title: "Long-term value", question: "Own equity the partnership never had" },
  ],
  detailsCta: "See the details",
  disclaimer:
    "Illustrative estimate using representative assumptions for US IP boutiques, not a forecast or an offer. Actual results depend on the firm, the fair-market-value study that sets the MSO fee, and the final legal and tax structure.",
  details: {
    title: "How the estimate works",
    bridgeTitle: "Where the extra profit per partner comes from",
    tableTitle: "Today vs with the MSO",
    tableCaption: "Annual figures for the whole firm.",
    stepsTitle: "How it works",
    stepsCaption: "Three changes, no cash from the firm.",
    steps: ["Run the back office for less", "Turn freed time into new work", "Own the profit and the equity"],
    structureTitle: "The structure",
    structureCaption:
      "Lawyers keep full ownership of the law firm. The MSO handles everything that is not legal advice.",
    assumptionsTitle: "Our assumptions",
    assumptionsCaption:
      "Representative figures for US IP boutiques. Your own numbers come from a fair-market-value study.",
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
  lede: "Your department moves legal operations and technology into an MSO that Spaarke funds and runs. The department pays a fixed fee, set at fair market value and below today’s cost, invests no capital and keeps every legal decision.",
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
    "Illustrative estimate using representative assumptions for US corporate legal departments, not a forecast or an offer. Actual results depend on the department, its outside counsel mix, the scope of the services agreement and the fair-market-value study that sets the MSO fee.",
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
      a: "Fees are fixed and set at fair market value by an independent study. They are never a share of legal fees, revenue or profit.",
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
