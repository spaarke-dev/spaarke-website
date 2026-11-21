/**
 * Page copy for sections 1-3 (Hero, What is MLO, Why MLO / why now).
 * Every audience-dependent field is typed ByAudience<...> so the toggle can swap it.
 *
 * Guardrails (see design.md section 9):
 *  - No equity numbers, percentages, vesting terms or return claims anywhere.
 *  - Practice-agnostic wording (no IP-specific headlines).
 *  - Boundary language stays visible: the MLO does not practice law, share in legal fees,
 *    or direct legal judgment.
 *  - Every statistic carries a source. `verification` says what still has to be checked
 *    before launch. Counsel reviews final copy before publication.
 */
import type { ByAudience } from '../audience/AudienceContext';

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: 'Spaarke Managed Legal Operations',
  /** Pick one; the rest are alternates for review. */
  headline: 'Practice law. We’ll run the business.',
  headlineAlternates: ['Run legal like a business.', 'Legal, operated.'],
  subhead: {
    firm: 'Managed Legal Operations gives your lawyers the technology, team and economics of a much larger firm, and leaves your clients, your judgment and your practice yours.',
    corporate:
      'Managed Legal Operations gives your legal team the AI, technology and operating discipline to do more, at lower cost, with privilege and control intact.',
  } satisfies ByAudience<string>,
  primaryCta: { label: 'Start a conversation', href: '#contact' },
  secondaryCta: { label: 'See how it works', href: '#how-it-works' },
  image: {
    // Placeholder until the commissioned or exclusively licensed photograph is ready (design.md section 8).
    src: '/images/hero-placeholder.jpg',
    alt: 'Two colleagues, a lawyer and an operations professional, working side by side in a real office.',
    status: 'placeholder' as const,
  },
};

/* ------------------------------------------------------------------ */
/* 2. What is Managed Legal Operations                                 */
/* ------------------------------------------------------------------ */

export const whatIsMlo = {
  id: 'what-is-mlo',
  eyebrow: 'What is Managed Legal Operations',
  title: 'The operating model built for how legal actually works',
  definition:
    'Managed Legal Operations (MLO) is a managed service that runs the business side of legal (technology, operations, finance and administration) so lawyers can concentrate on the practice of law.',
  msoNote:
    'MLO is delivered through a Managed Services Organization, or MSO: a separate company that provides non-legal services under a services agreement. The MSO is the structure. MLO is the service it provides.',
  /** "Why legal is different" row: six icons with one-line captions. */
  whyLegalIsDifferent: {
    title: 'Legal is a business with unusual requirements',
    items: [
      { id: 'independence', title: 'Professional independence', caption: 'Legal judgment stays with lawyers.' },
      { id: 'privilege', title: 'Privilege and confidentiality', caption: 'They shape which data, systems and people can move.' },
      { id: 'matters', title: 'Matter-based economics', caption: 'Work is scoped, priced and tracked by matter, not by seat.' },
      { id: 'fees', title: 'Regulated fee rules', caption: 'What may be paid to a service provider, and how, is constrained.' },
      { id: 'compensation', title: 'Partner pay and succession', caption: 'Compensation and ownership work differently from a normal company.' },
      { id: 'billing', title: 'Billing under pressure', caption: 'Hourly and fixed fees that track human effort are being repriced.' },
    ],
  },
  benefitsTitle: {
    firm: 'What firms gain',
    corporate: 'What legal departments gain',
  } satisfies ByAudience<string>,
  benefits: {
    firm: [
      { title: 'Lower cost to deliver each matter', body: 'Operating functions are delivered at a unit price below your own internal cost.' },
      { title: 'Technology that keeps pace', body: 'AI and legal technology you could not justify building or integrating alone.' },
      { title: 'Lawyers back on the practice', body: 'Partners stop running the business and concentrate on clients and legal work.' },
      { title: 'Room to grow', body: 'Add capacity, practices or offices without rebuilding the back office each time.' },
      { title: 'Lasting value', body: 'A way for the firm to build long-term value in how it operates, beyond annual partner draws.' },
    ],
    corporate: [
      { title: 'Lower cost per matter', body: 'Run legal operations, contracts and matter management at a lower unit cost.' },
      { title: 'Less reliance on outside counsel for routine work', body: 'Technology-enabled handling of repeatable work stays under your control.' },
      { title: 'Access to legal AI that is hard to buy', body: 'Specialist tools, security review and integration handled for you.' },
      { title: 'Control and visibility', body: 'One view of spend, matters and outside firms, with reporting you can act on.' },
      { title: 'Lower risk', body: 'Consistent processes, governed data and clear service levels.' },
    ],
  } satisfies ByAudience<{ title: string; body: string }[]>,
  /** Keep visible wherever the structure is explained. */
  boundaryLine:
    'The MLO does not practice law, does not share in legal fees, and does not direct legal judgment. Its fee is set on a fixed or per-unit method and is never tied to legal fees.',
};

/* ------------------------------------------------------------------ */
/* 3. Why MLO, why now                                                 */
/* ------------------------------------------------------------------ */

export type StatChart = 'bigNumber' | 'pairedBars' | 'columns' | 'comparisonBars';
/**
 * 'retrieved-snippet'  = seen in a search result during research; confirm in the primary report.
 * 'secondary-verify'   = taken from internal strategy notes, which cite a secondary
 *                        source; find and confirm the primary before publishing.
 */
export type Verification = 'retrieved-snippet' | 'secondary-verify';

export interface WhyNowStat {
  id: string;
  theme: string;
  /** Action title: states the takeaway, not the topic. */
  title: string;
  figure: string;
  caption: string;
  chart: StatChart;
  /** Data for the chart component. Values are in the units named in `unit`. */
  data?: { label: string; value: number }[];
  unit?: string;
  source: { name: string; url: string; date?: string; note?: string };
  verification: Verification;
  /** Lower rank shows first. */
  rank: ByAudience<number>;
}

export const whyNow = {
  id: 'why-now',
  eyebrow: 'Why MLO, why now',
  title: 'The economics of legal are being rewritten',
  intro: {
    firm: 'Technology, pricing and client expectations are changing at the same time. Firms are expected to adopt AI and to charge less for it, while carrying the cost of the technology and the competition from new AI-native firms.',
    corporate:
      'Legal departments are being asked to do more, keep more work in-house and spend less. AI makes that look possible, but building and running it alone is complex, and the savings depend on redesigning the work.',
  } satisfies ByAudience<string>,
  stats: [
    {
      id: 'tech-adoption',
      theme: 'Technology is transforming practice',
      title: 'Seven in ten law-firm attorneys now use AI every week',
      figure: '70%',
      caption: 'of attorneys at law firms use AI at least once a week, a sharp increase from the year before.',
      chart: 'bigNumber',
      source: { name: 'Law360 Pulse, 2026 AI Survey', url: 'https://www.law360.com/legalindustry/articles/2454764', date: '2026-03-31' },
      verification: 'retrieved-snippet',
      rank: { firm: 1, corporate: 3 },
    },
    {
      id: 'delivery-dynamics',
      theme: 'New service delivery dynamics',
      title: 'Legal departments have moved from experimenting to deploying AI',
      figure: '61%',
      caption: 'of legal departments are in AI deployment phases, and 10% say AI is fully embedded in daily workflows.',
      chart: 'bigNumber',
      source: {
        name: 'Deloitte Legal, The AI Imperative',
        url: 'https://www.deloitte.com/uk/en/about/press-room/ai-set-to-reshape-legal-work-law-firm-pricing-and-legal-careers.html',
        date: '2026',
        note: 'Survey of 121 senior legal leaders, April to May 2026.',
      },
      verification: 'retrieved-snippet',
      rank: { firm: 4, corporate: 1 },
    },
    {
      id: 'fee-pressure',
      theme: 'Downward pressure on effort-based fees',
      title: 'Clients expect AI savings to show up in the bill',
      figure: '92%',
      caption: 'of legal departments expect, or are negotiating, AI-related rate cuts from their law firms.',
      chart: 'bigNumber',
      source: {
        name: 'Axiom survey, as cited by LLMs for Lawyers',
        url: 'https://www.llms-for-lawyers.com/practice-areas/ai-for-in-house-counsel/',
        note: 'Vendor-sourced figure; confirm the primary report.',
      },
      verification: 'secondary-verify',
      rank: { firm: 2, corporate: 5 },
    },
    {
      id: 'tech-cost-complexity',
      theme: 'Cost and complexity of new technology',
      title: 'Technology only pays off when the work is redesigned around it',
      figure: '~60% vs <20%',
      caption:
        'Cost reduction reported with end-to-end workflow redesign versus without it. Only 37% of organizations report a positive EBIT impact from AI.',
      chart: 'comparisonBars',
      data: [
        { label: 'Without redesign', value: 20 },
        { label: 'End-to-end redesign', value: 60 },
      ],
      unit: '% cost reduction (upper bound for "without", under 20%)',
      source: {
        name: 'BCG; McKinsey',
        url: 'https://www.bcg.com/publications/2026/reinventing-the-operating-system-of-work-with-ai',
        note: 'McKinsey EBIT figure: https://www.mckinsey.com/capabilities/people-and-organization/our-insights/ai-is-changing-work-now-it-has-to-change-the-organization',
      },
      verification: 'secondary-verify',
      rank: { firm: 3, corporate: 2 },
    },
    {
      id: 'ai-native-competition',
      theme: 'Competition from AI-native firms',
      title: 'Capital is flowing to AI-native competitors',
      figure: '$1B → $4B+',
      caption: 'Legal tech venture funding, 2023 to 2025.',
      chart: 'columns',
      data: [
        { label: '2023', value: 1 },
        { label: '2025', value: 4 },
      ],
      unit: '$B (2025 shown as "more than $4B")',
      source: { name: 'Gavel', url: 'https://www.gavel.io/resources/ai-native-law-firms-how-to-respond' },
      verification: 'secondary-verify',
      rank: { firm: 5, corporate: 4 },
    },
    {
      id: 'insourcing',
      theme: 'Clients bringing work back in-house',
      title: 'Clients are keeping more work in-house',
      figure: '58% → 37%',
      caption:
        'Share of legal departments expecting to increase outside counsel spend, last year versus this year, in a survey of 135 corporate law departments.',
      chart: 'pairedBars',
      data: [
        { label: 'Last year', value: 58 },
        { label: 'This year', value: 37 },
      ],
      unit: '% of departments',
      source: {
        name: 'Above the Law, reporting a corporate law department survey',
        url: 'https://abovethelaw.com/2025/12/biglaws-worst-enemy-isnt-ai-its-clients-using-ai-to-stop-paying-them/',
        date: '2025-12',
        note: 'A separate vendor survey (Axiom, 2026) reports 80%+ of departments plan to move significant work in-house or to alternative providers within 24 months.',
      },
      verification: 'retrieved-snippet',
      rank: { firm: 6, corporate: 1 },
    },
  ] as WhyNowStat[],
  /** Keeps the section credible rather than alarmist. */
  nuance: {
    title: 'AI reallocates the profit pool. It does not shrink it evenly.',
    body: 'Practices that combine high automation with durable pricing power can expand margins, while commoditized, substitutable work faces the most pressure. The question is not whether AI reduces hours, but who keeps pricing and client control.',
    source: { name: 'Stout and Piper Sandler, law firm MSO white paper (2026)', url: '', note: 'Private project document; find the public primary before quoting.' },
  },
  bridge: 'The firms and teams that win will not just buy AI tools. They will redesign how legal is operated.',
};

/** Returns the six stats ordered for the chosen audience. */
export function orderedStats(audience: keyof ByAudience<unknown>): WhyNowStat[] {
  return [...whyNow.stats].sort((a, b) => a.rank[audience] - b.rank[audience]);
}
