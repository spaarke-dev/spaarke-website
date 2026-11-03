// Copy for the accelerator page, the accelerator brief, and the readiness
// checklist. Each document is rendered twice from this file: as a web page
// (src/app/accelerator/brief, src/app/accelerator/readiness-checklist) and as
// a 1080 by 1350 PDF for LinkedIn Document ads
// (scripts/render-accelerator-pdfs.mts). Keep it free of imports so the PDF
// script can load it outside Next.
//
// The copy follows the founder article, "Microsoft Is Now the Platform for
// Legal AI". These documents are paid assets, so they carry no competitor
// names and none of the article's unsourced assertions (campaign file, "Copy
// rules for this campaign").

export const ARTICLE_URL = "/why-spaarke/microsoft-is-now-the-platform-for-legal-ai";
export const BRIEF_URL = "/accelerator/brief";
export const CHECKLIST_URL = "/accelerator/readiness-checklist";
export const BRIEF_PDF = "/accelerator/legal-ai-accelerator-brief.pdf";
export const CHECKLIST_PDF = "/accelerator/legal-ai-on-microsoft-checklist.pdf";
export const CONTACT_EMAIL = "getstarted@spaarke.com";

export type Item = { name: string; body: string };

export const SESSION_STEPS = [
  "Choose the practice and the first two or three tasks.",
  "Confirm the Microsoft setup with your IT lead: Copilot licenses, the Cowork usage policy, and who approves connectors.",
  "Plan the week.",
];

export const WEEK_OUTCOMES = [
  "The team's own playbooks, written with the setup interview and held in its own files.",
  "The practice pack and agent deployed in your own tenant.",
  "Results measured on your own documents against today's baseline.",
  "A deployment package your IT team has reviewed.",
  "A plan for the next practice.",
];

export const LAYERS: Item[] = [
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

export const INCLUDED: Item[] = [
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

// Exhibit 1 and Exhibit 2, as data. The web pages show the article's SVGs;
// the PDF draws the same content natively so it stays legible at 1080 wide.
// Keep the wording identical to the SVGs.
export const EXHIBIT_1 = {
  title: "Legal AI on Microsoft is built in layers, from enterprise governance to legal skills.",
  svg: "/articles/microsoft-is-now-the-platform-for-legal-ai/exhibit-1.svg",
  alt: "A stack of four layers. At the base, enterprise governance: Entra ID, conditional access, Purview, and the tenant boundary. Above it, Microsoft 365 and Power Platform: Outlook, Teams, Word, SharePoint, Power Apps, and Dataverse. Above that, the legal platform: systems of record for matter and case management, document management, and finance, budgeting, and e-billing, with the decision support ontology across them. At the top, legal AI: skills, playbooks, agents, and tools. Copilot and Cowork reach across every layer, and the accelerator starts at the top layer.",
  reach: ["Copilot and Cowork", "reach across every layer"],
  layers: [
    { name: "Legal AI", body: "Skills, playbooks, agents, and tools", accelerator: true },
    { name: "The legal platform", body: "", accelerator: false },
    { name: "Microsoft 365 and Power Platform", body: "Outlook, Teams, Word, SharePoint, Power Apps, and Dataverse", accelerator: false },
    { name: "Enterprise governance", body: "Entra ID, conditional access, Purview, and the tenant boundary", accelerator: false },
  ],
  ontology: {
    name: "Decision support ontology",
    body: "Matters, documents, invoices, obligations, and policies, with the record of each decision",
  },
  systems: ["Matter and case management", "Document management", "Finance, budgeting, and e-billing"],
  // Not in the article's SVG; shown under the systems of record in the PDF and
  // in the web caption, so readers don't take the row to mean replacement.
  systemsNote: "Spaarke's, or the systems you already run",
  acceleratorLabel: "The accelerator starts here",
};

export const EXHIBIT_2 = {
  title: "Everything the accelerator builds carries forward onto the Legal Operations Intelligence platform.",
  svg: "/articles/microsoft-is-now-the-platform-for-legal-ai/exhibit-2.svg",
  alt: "A table with three columns: Copilot for the individual, the team's legal AI with the accelerator, and the legal platform. Five rows. The playbook moves from a document a lawyer attaches, to the team's positions with an owner, to a versioned policy cited on each decision. Critical dates and obligations move from an extraction in a session, to a governed extraction with exact date calculations, to obligations with owners and lifecycles. The issues list moves from a document, to a structured list, to entries in the decision record with the approver. Invoice review moves from a file reviewed in a session, to a guideline review with exact arithmetic, to invoices posted against the matter and its budget. Matter context moves from the lawyer's own knowledge, to the knowledge library, to the matter record.",
  columns: [
    { name: "Copilot for the individual", sub: "" },
    { name: "The team's legal AI", sub: "with the accelerator" },
    { name: "The legal platform", sub: "systems of record and the ontology" },
  ],
  rows: [
    {
      name: "The playbook",
      cells: ["A document a lawyer attaches", "The team's positions, with an owner", "A versioned policy, cited on each decision"],
    },
    {
      name: "Critical dates and obligations",
      cells: ["Extracted in a session", "A governed extraction, with exact date calculations", "Obligations with owners and lifecycles"],
    },
    {
      name: "The issues list",
      cells: ["A document", "A structured list", "Entries in the decision record, with the approver"],
    },
    {
      name: "Invoice review",
      cells: ["A file reviewed in a session", "A guideline review with exact arithmetic", "Invoices posted against the matter and its budget"],
    },
    {
      name: "Matter context",
      cells: ["The lawyer's own knowledge", "The knowledge library", "The matter record"],
    },
  ],
};

// A document is a run of pages. On the web each page is one section; in the
// PDF each page is one 1080 by 1350 page.
export type Block =
  | { kind: "text"; paragraphs: string[] }
  | { kind: "items"; items: Item[]; columns: 1 | 2 | 3 }
  | { kind: "steps"; items: Item[] }
  | { kind: "list"; lead: string; items: string[] }
  | { kind: "checks"; items: Check[] }
  | { kind: "exhibit"; exhibit: 1 | 2 }
  | { kind: "contents"; items: string[] }
  | { kind: "book"; title: string; body: string };

export type Check = { name: string; question: string; why: string; owner?: "Legal" | "IT" | "Legal and IT" };

export type DocPage = { id: string; eyebrow: string; title: string; blocks: Block[] };

export type AcceleratorDocument = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  pdf: string;
  webUrl: string;
  pages: DocPage[];
};

export const BRIEF: AcceleratorDocument = {
  slug: "brief",
  title: "The Spaarke Legal AI Accelerator for Microsoft Copilot",
  shortTitle: "Accelerator brief",
  description:
    "Seven pages on legal AI on Microsoft: the platform, how it is built, the three layers of legal content, what the accelerator includes, and how the week runs.",
  pdf: BRIEF_PDF,
  webUrl: BRIEF_URL,
  pages: [
    {
      id: "cover",
      eyebrow: "Spaarke Legal AI Accelerator for Microsoft Copilot",
      title: "Legal AI on Microsoft, one practice in one week.",
      blocks: [
        {
          kind: "text",
          paragraphs: [
            "Microsoft Copilot now brings legal skills into Word and Cowork, inside the tenant a legal team already governs. The Spaarke Accelerator lets a team start quickly, with best practice already configured: core legal skills, practice packs, calculation tools, and forward-deployed legal engineers.",
          ],
        },
        {
          kind: "contents",
          items: [
            "Microsoft is now the platform for legal AI",
            "How legal AI on Microsoft is built",
            "Three layers of legal content",
            "What the accelerator includes",
            "The week",
            "What carries forward",
          ],
        },
      ],
    },
    {
      id: "platform",
      eyebrow: "The platform",
      title: "Microsoft is now the platform for legal AI.",
      blocks: [
        {
          kind: "text",
          paragraphs: [
            "Legal teams have proven where AI fits in their work and are ready for the next step. The early tools sit outside the core legal systems, or inside only one, and are governed by their vendors rather than by the organization. Microsoft Copilot brings the legal skills and the governance into the environment most legal teams already run.",
          ],
        },
        {
          kind: "items",
          columns: 1,
          items: [
            {
              name: "The legal skills",
              body: "Copilot for Legal makes more than 20 legal skills generally available. In Word, a lawyer reviews a contract against the team's playbook. In Cowork, the Legal plugin reviews, summarizes, drafts, and redlines across many files, including a set of invoices.",
            },
            {
              name: "Tuned to the team",
              body: "Each team tunes the platform to its own practice. Plugins package skills, tools, and MCP connectors to other systems. Playbooks capture the team's positions in Word documents the skills apply. Administrators govern all of it through a plugin registry.",
            },
            {
              name: "The tenant",
              body: "Copilot works inside the Microsoft 365 service boundary and shows each user only what that user may already see. Entra ID, sensitivity labels, and retention in Microsoft Purview apply to legal AI as they apply to everything else, and the organization chooses among models from Anthropic, OpenAI, and Microsoft.",
            },
          ],
        },
      ],
    },
    {
      id: "build",
      eyebrow: "How it is built",
      title: "Legal AI on Microsoft is built in layers, from enterprise governance to legal skills.",
      blocks: [
        {
          kind: "text",
          paragraphs: [
            "Each layer inherits what the layers below it provide. Microsoft supplies the governance and the services at the base, a legal platform of systems of record and a decision support ontology sits in the middle, and legal skills run on top.",
          ],
        },
        { kind: "exhibit", exhibit: 1 },
        {
          kind: "text",
          paragraphs: [
            "The accelerator starts at the top layer, on the governance and services Microsoft already provides, and the platform layers follow.",
          ],
        },
      ],
    },
    {
      id: "layers",
      eyebrow: "Three layers of legal content",
      title: "Spaarke maintains two layers of legal content, and your team owns the third.",
      blocks: [
        { kind: "items", columns: 1, items: LAYERS },
        {
          kind: "text",
          paragraphs: [
            "Most of the effort in a deployment goes into the third layer, because that is where the team's own expertise enters its legal AI. Some work also has to come out the same way every time. A notice deadline, a rent escalation, a patent term, or the arithmetic on an invoice is computed by a calculation tool, and the AI calls the tool when the work needs one.",
            "Because the playbooks are the team's own files in its own tenant, they stay with the team and carry forward to everything it builds next, including the Legal Operations Intelligence platform.",
          ],
        },
      ],
    },
    {
      id: "included",
      eyebrow: "What's included",
      title: "The accelerator delivers nine components into your own tenant.",
      blocks: [
        { kind: "items", columns: 2, items: INCLUDED },
        {
          kind: "text",
          paragraphs: [
            "A team can deploy the packs itself. With Spaarke's legal engineers, the first practice is live in one week.",
          ],
        },
      ],
    },
    {
      id: "week",
      eyebrow: "The week",
      title: "The engagement covers one practice in one week.",
      blocks: [
        {
          kind: "text",
          paragraphs: [
            "Spaarke's forward-deployed legal engineers are attorneys, legal operations professionals, and specialty practitioners who work inside the team's own operations.",
          ],
        },
        {
          kind: "steps",
          items: [
            {
              name: "Choose the tasks and record the baseline",
              body: "The team chooses two or three recurring tasks in one practice and records how long they take today.",
            },
            {
              name: "Write the playbooks",
              body: "The legal engineers and the practice lead capture the team's positions with the setup interview and curate its knowledge library.",
            },
            {
              name: "Configure and connect",
              body: "The legal engineers configure the skills, agents, and tools, and connect the systems the practice relies on.",
            },
            {
              name: "Test on the team's own documents",
              body: "The team tests the results on its own documents against the baseline.",
            },
            {
              name: "Train and hand over",
              body: "The legal engineers train the team and hand over the deployment, with an administrator package for IT.",
            },
          ],
        },
        { kind: "list", lead: "At the end of the week, the team has:", items: WEEK_OUTCOMES },
      ],
    },
    {
      id: "forward",
      eyebrow: "What carries forward",
      title: "Everything the accelerator builds carries forward onto the Legal Operations Intelligence platform.",
      blocks: [
        { kind: "exhibit", exhibit: 2 },
        {
          kind: "book",
          title: "Book a 30-minute scoping session",
          body: "In 30 minutes we choose the practice and the first tasks, confirm the Microsoft setup with your IT lead, and plan the week.",
        },
      ],
    },
  ],
};

export const CHECKLIST: AcceleratorDocument = {
  slug: "readiness-checklist",
  title: "Legal AI on Microsoft: a readiness checklist for legal and IT",
  shortTitle: "Readiness checklist",
  description:
    "Three pages on what legal and IT settle before legal AI goes live on Microsoft: licenses, the Cowork usage policy, plugin and connector approval, labels and retention, and the team's own positions.",
  pdf: CHECKLIST_PDF,
  webUrl: CHECKLIST_URL,
  pages: [
    {
      id: "together",
      eyebrow: "Readiness checklist for legal and IT",
      title: "Legal AI on Microsoft: a readiness checklist for legal and IT.",
      blocks: [
        {
          kind: "text",
          paragraphs: [
            "Legal AI on Microsoft runs inside the organization's own tenant, under the identity, security, and retention controls IT already maintains. That makes the first deployment a joint decision: legal chooses the work and writes down its positions, and IT confirms the licenses, policies, and approvals the work depends on. These are the questions the two settle together before the first practice goes live.",
          ],
        },
        {
          kind: "checks",
          items: [
            {
              name: "The first practice",
              question: "Which practice comes first, and which two or three recurring tasks?",
              why: "",
              owner: "Legal",
            },
            {
              name: "Licenses",
              question: "Who on the practice team holds a Microsoft 365 Copilot license?",
              why: "",
              owner: "IT",
            },
            {
              name: "Cowork",
              question: "Is Cowork enabled for the legal team, and under which usage policy?",
              why: "",
              owner: "IT",
            },
            {
              name: "Approvals",
              question: "Who approves the plugins and connectors the practice needs?",
              why: "",
              owner: "Legal and IT",
            },
            {
              name: "Labels and retention",
              question: "How do sensitivity labels and retention apply to the practice's documents and to Copilot activity?",
              why: "",
              owner: "Legal and IT",
            },
            {
              name: "Deployment route",
              question: "Will the practice deploy itself, or will IT deploy centrally?",
              why: "",
              owner: "Legal and IT",
            },
          ],
        },
      ],
    },
    {
      id: "it",
      eyebrow: "For IT",
      title: "IT confirms the licenses, policies, and approvals the practice depends on.",
      blocks: [
        {
          kind: "checks",
          items: [
            {
              name: "Licenses",
              question: "Which members of the practice team hold a Microsoft 365 Copilot license, and is Copilot for Legal available to them in Word?",
              why: "The legal skills in Word and the Legal for Cowork plugin are what the accelerator builds on.",
            },
            {
              name: "Cowork usage policy",
              question: "Is Cowork enabled for the legal team, which models may it use, and what usage policy and capacity apply?",
              why: "Cowork runs the multi-file work, such as reviewing a set of agreements or invoices.",
            },
            {
              name: "Plugins and connectors",
              question: "Who approves plugins in the plugin registry, and the connectors the practice needs, such as one to the document management system?",
              why: "The accelerator's skills and calculation tools arrive as plugins.",
            },
            {
              name: "Sensitivity labels",
              question: "Which sensitivity labels apply to the practice's documents, and what do they allow Copilot to do?",
              why: "Copilot honors the usage rights that labels apply, so labels decide which documents a skill can use.",
            },
            {
              name: "Retention",
              question: "What retention applies in Microsoft Purview to Copilot and Cowork activity for the legal team?",
              why: "Prompts and responses about a matter usually belong under the same rules as the matter.",
            },
            {
              name: "Deployment route",
              question: "Will the practice add the pack itself in Cowork, or will IT deploy it with the administrator package?",
              why: "Organizations that run Information Barriers, as many law firms do, start with the IT-deployed route.",
            },
          ],
        },
      ],
    },
    {
      id: "legal",
      eyebrow: "For legal",
      title: "Legal chooses the work and writes down the positions the AI will apply.",
      blocks: [
        {
          kind: "checks",
          items: [
            {
              name: "The first practice and tasks",
              question: "Which practice comes first, and which two or three recurring tasks?",
              why: "A narrow start lets the week end with measured results on real work.",
            },
            {
              name: "Today's baseline",
              question: "How long does each task take today, how often does it arrive, and who does it?",
              why: "The baseline is what the team measures the results against.",
            },
            {
              name: "Positions and fallbacks",
              question: "For each task, what are the team's preferred positions, its fallbacks, and the points at which it escalates, and to whom?",
              why: "These positions become the team's playbooks, the layer the team owns.",
            },
            {
              name: "Precedents and house style",
              question: "Which templates, clauses, and precedents are approved, and where are they kept?",
              why: "They seed the knowledge library that the practice agent draws on.",
            },
            {
              name: "AI work under way",
              question: "Which prompts, skills, and pilots have lawyers already built in other AI tools?",
              why: "Skills built in other AI tools often share the Agent Skills format, so the first deployment builds on them rather than starting again.",
            },
            {
              name: "Owners",
              question: "Who owns each position, and who signs off when a playbook changes?",
              why: "The team's positions will change as its practice does, and each change needs an owner.",
            },
          ],
        },
        {
          kind: "book",
          title: "Book a 30-minute scoping session",
          body: "We review this checklist with your legal and IT leads and plan the week.",
        },
      ],
    },
  ],
};
